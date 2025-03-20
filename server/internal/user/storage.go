package user

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, user *User) error
	GetAll(ctx context.Context) ([]User, error)
	GetWorkersAndDrivers(ctx context.Context, date string) ([]Drivers, []Workers, error)
	GetDriversWithoutCar(ctx context.Context) ([]DriversWithoutCar, error)
	GetDriversWithCar(ctx context.Context) ([]DriversWithCar, error)
	//GetDrivers(ctx context.Context) ([]User, error)
	//GetById(ctx context.Context, id string) (User, error)
	//Update(ctx context.Context, user User) error
	Delete(ctx context.Context, id string) error
}

type PostgresRepository struct {
	db *pgxpool.Pool
	logger *logging.Logger
}

func NewRepository(db *pgxpool.Pool, logger *logging.Logger) Repository {
	return &PostgresRepository{
		db: db,
		logger: logger,
	}
}

func (r *PostgresRepository) Create(ctx context.Context, user *User) error {
	query := "INSERT INTO USERS (username, user_role) VALUES ($1, $2)"
	_, err := r.db.Exec(ctx, query, user.Username, user.UserRole)
	return err
}

func (r *PostgresRepository) Delete(ctx context.Context, id string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		r.logger.Errorf("Failed to start transaction: %v", err)
		return err
	}
	defer tx.Rollback(ctx)

	query1 := `UPDATE ORDERS SET driver_id = NULL WHERE driver_id = $1`
	_, err = tx.Exec(ctx, query1, id)
	if err != nil {
		r.logger.Errorf("Failed to nullify driver_id in orders: %v", err)
		return err
	}

	query2 := `DELETE FROM ORDER_WORKERS WHERE worker_id = $1`
	_, err = tx.Exec(ctx, query2, id)
	if err != nil {
    	r.logger.Errorf("Failed to delete user from order_workers: %v", err)
    	return err
	}

	query3 := `DELETE FROM CARS WHERE driver_id = $1`
	_, err = tx.Exec(ctx, query3, id)
	if err != nil {
		r.logger.Errorf("Failed to delete user from cars: %v", err)
		return err
	}

	query4 := `UPDATE PAYMENTS SET driver_id = NULL WHERE driver_id = $1`
	_, err = tx.Exec(ctx, query4, id)
	if err != nil {
		r.logger.Errorf("Failed to nullify user from payments: %v", err)
		return err
	}

	query5 := `DELETE FROM USERS WHERE id = $1`
	_, err = tx.Exec(ctx, query5, id)
	if err != nil {
		r.logger.Errorf("Failed to delete user: %v", err)
		return err
	}

	err = tx.Commit(ctx)
	if err != nil {
		r.logger.Errorf("Failed to commit transaction: %v", err)
		return err
	}

	r.logger.Infof("User %s deleted successfully", id)
	return nil
}


func (r *PostgresRepository) GetAll(ctx context.Context) ([]User, error) {
	query := `
		SELECT u.id, u.username, u.user_role, COALESCE(c.color, '') 
		FROM users u
		LEFT JOIN cars c ON u.id = c.driver_id
	`
	
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		r.logger.Errorf("failed to execute query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.Id, &user.Username, &user.UserRole, &user.CarColor); err != nil {
			r.logger.Errorf("failed to scan row: %v", err)
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		r.logger.Errorf("rows iteration error: %v", err)
		return nil, err
	}

	return users, nil
}


func (r *PostgresRepository) GetWorkersAndDrivers(ctx context.Context, date string) ([]Drivers, []Workers, error) {
	query := `
		SELECT u.id, u.username, u.user_role, COALESCE(c.color, '') AS car_color,
			COALESCE(o.order_count, 0) AS order_quantity
		FROM USERS u
		LEFT JOIN CARS c ON u.id = c.driver_id
		LEFT JOIN (
			SELECT driver_id, COUNT(*) AS order_count
			FROM ORDERS
			WHERE order_date = $1
			GROUP BY driver_id
		) o ON u.id = o.driver_id
		WHERE u.user_role IN ('driver', 'worker')
	`

	rows, err := r.db.Query(ctx, query, date)
	if err != nil {
		r.logger.Errorf("Failed to execute query: %v", err)
		return nil, nil, err
	}
	defer rows.Close()

	var drivers []Drivers
	var workers []Workers

	for rows.Next() {
		var id, username, userRole, carColor string
		var orderQuantity int

		if err := rows.Scan(&id, &username, &userRole, &carColor, &orderQuantity); err != nil {
			r.logger.Errorf("Failed to scan row: %v", err)
			return nil, nil, err
		}

		if userRole == "driver" {
			drivers = append(drivers, Drivers{
				Id:            id,
				Username:      username,
				UserRole:      userRole,
				СarColor:      carColor,
				OrderQuantity: orderQuantity,
			})
		} else if userRole == "worker" {
			workers = append(workers, Workers{
				Id:       id,
				Username: username,
				UserRole: userRole,
			})
		}
	}

	if err := rows.Err(); err != nil {
		r.logger.Errorf("Rows iteration error: %v", err)
		return nil, nil, err
	}

	return drivers, workers, nil
}

func (r *PostgresRepository) GetDriversWithoutCar(ctx context.Context) ([]DriversWithoutCar, error) {
	query := `
		SELECT u.id, u.username 
		FROM USERS u
		LEFT JOIN CARS c ON u.id = c.driver_id
		WHERE c.driver_id IS NULL
		AND u.user_role = 'driver'
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		r.logger.Errorf("Failed to fetch drivers without car: %v", err)
		return nil, err
	}
	defer rows.Close()

	var drivers []DriversWithoutCar

	for rows.Next() {
		var driver DriversWithoutCar
		if err := rows.Scan(&driver.Id, &driver.Username); err != nil {
			r.logger.Errorf("Failed to scan driver row: %v", err)
			return nil, err
		}
		drivers = append(drivers, driver)
	}

	if err = rows.Err(); err != nil {
		r.logger.Errorf("Error iterating over drivers without car: %v", err)
		return nil, err
	}

	return drivers, nil
}

func (r *PostgresRepository) GetDriversWithCar(ctx context.Context) ([]DriversWithCar, error) {
	var drivers []DriversWithCar

	query := `
		SELECT u.id, u.username, c.color 
		FROM USERS u
		JOIN CARS c ON u.id = c.driver_id
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		r.logger.Errorf("Failed to get drivers with car: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var driver DriversWithCar
		if err := rows.Scan(&driver.Id, &driver.Username, &driver.Color); err != nil {
			r.logger.Errorf("Failed to scan driver with car: %v", err)
			return nil, err
		}
		drivers = append(drivers, driver)
	}

	return drivers, nil
}

// func (r *PostgresRepository) GetById(ctx context.Context, id string) (User, error) {
// 	return User{}, nil
// }

// func (r *PostgresRepository) Update(ctx context.Context, user User) error {
// 	return nil
// }

// func (r *PostgresRepository) Delete(ctx context.Context, id string) error {
// 	return nil
// }