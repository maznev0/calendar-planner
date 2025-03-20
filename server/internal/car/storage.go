package car

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, car *Car, driver_id string) error
	Swap(ctx context.Context, driverID1, driverID2 string) error
	GetAll(ctx context.Context) ([]Car, error)
	// GetOne(ctx context.Context, driver_id string) (car Car, err error)
	// Update(ctx context.Context, driver_id string) error
	// Delete(ctx context.Context, driver_id string) error
}

type PostgresRepository struct {
	db     *pgxpool.Pool
	logger *logging.Logger
}

func NewRepository(db *pgxpool.Pool, logger *logging.Logger) Repository {
	return &PostgresRepository{
		db: db,
		logger: logger,
	}
}

func (r *PostgresRepository) Create(ctx context.Context, car *Car, driver_id string) error {
	query := "INSERT INTO CARS (driver_id, color, carname, chat_id) VALUES ($1, $2, $3, $4)"
	_, err := r.db.Exec(ctx, query, driver_id, car.Color, car.Carname, car.ChatId)
	if err != nil {
		r.logger.Errorf("Failed to create car: %v", err)
		return err
	}
	return nil
}

func (r *PostgresRepository) Swap(ctx context.Context, driverID1, driverID2 string) error {
	// Начинаем транзакцию
	tx, err := r.db.Begin(ctx)
	if err != nil {
		r.logger.Errorf("Failed to begin transaction: %v", err)
		return err
	}
	defer tx.Rollback(ctx) // Откат транзакции в случае ошибки

	// Шаг 1: Получаем текущие данные для обоих водителей
	var car1, car2 Car
	err = tx.QueryRow(ctx, "SELECT color, carname, chat_id FROM CARS WHERE driver_id = $1", driverID1).Scan(&car1.Color, &car1.Carname, &car1.ChatId)
	if err != nil {
		r.logger.Errorf("Failed to get car data for driver 1: %v", err)
		return err
	}

	err = tx.QueryRow(ctx, "SELECT color, carname, chat_id FROM CARS WHERE driver_id = $1", driverID2).Scan(&car2.Color, &car2.Carname, &car2.ChatId)
	if err != nil {
		r.logger.Errorf("Failed to get car data for driver 2: %v", err)
		return err
	}

	// Шаг 2: Удаляем текущие записи
	_, err = tx.Exec(ctx, "DELETE FROM CARS WHERE driver_id IN ($1, $2)", driverID1, driverID2)
	if err != nil {
		r.logger.Errorf("Failed to delete cars: %v", err)
		return err
	}

	// Шаг 3: Вставляем записи с обновлёнными driver_id и chat_id
	_, err = tx.Exec(ctx, "INSERT INTO CARS (driver_id, color, carname, chat_id) VALUES ($1, $2, $3, $4)", driverID1, car2.Color, car2.Carname, car2.ChatId)
	if err != nil {
		r.logger.Errorf("Failed to insert car for driver 1: %v", err)
		return err
	}

	_, err = tx.Exec(ctx, "INSERT INTO CARS (driver_id, color, carname, chat_id) VALUES ($1, $2, $3, $4)", driverID2, car1.Color, car1.Carname, car1.ChatId)
	if err != nil {
		r.logger.Errorf("Failed to insert car for driver 2: %v", err)
		return err
	}

	// Фиксируем транзакцию
	if err := tx.Commit(ctx); err != nil {
		r.logger.Errorf("Failed to commit transaction: %v", err)
		return err
	}

	return nil
}

func (r *PostgresRepository) GetAll(ctx context.Context) ([]Car, error) {
	query := "SELECT driver_id, color, carname FROM CARS"
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		r.logger.Errorf("Failed to fetch cars: %v", err)
		return nil, err
	}
	defer rows.Close()

	var cars []Car
	for rows.Next() {
		var car Car
		if err := rows.Scan(&car.DriverId, &car.Color, &car.Carname); err != nil {
			r.logger.Errorf("Failed to scan car row: %v", err)
			return nil, err
		}
		cars = append(cars, car)
	}

	if err := rows.Err(); err != nil {
		r.logger.Errorf("Rows iteration error: %v", err)
		return nil, err
	}

	return cars, nil
}