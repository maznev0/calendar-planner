package user

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, user *User) error
	GetAll(ctx context.Context) ([]User, error)
	GetWorkersAndDrivers(ctx context.Context) ([]User, error)
	GetById(ctx context.Context, id string) (User, error)
	//Update(ctx context.Context, user User) error
	//Delete(ctx context.Context, id string) error
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
	query := "INSERT INTO USERS (username, user_role, telegram_id) VALUES ($1, $2, $3)"
	_, err := r.db.Exec(ctx, query, user.Username, user.UserRole, user.TelegramId)
	return err
}

func (r *PostgresRepository) GetAll(ctx context.Context) ([]User, error) {
	query := "SELECT id, username, user_role, telegram_id FROM users"
	
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		r.logger.Errorf("failed to execute query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.Id, &user.Username, &user.UserRole, &user.TelegramId); err != nil {
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

func (r *PostgresRepository) GetWorkersAndDrivers(ctx context.Context) ([]User, error) {
	query := "SELECT id, username, user_role, telegram_id FROM USERS WHERE user_role IN ('driver', 'worker')"

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		r.logger.Errorf("Failed to execute query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.Id, &user.Username, &user.UserRole, &user.TelegramId); err != nil {
			r.logger.Errorf("Failed to scan row: %v", err)
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		r.logger.Errorf("Rows iteration error: %v", err)
		return nil, err
	}

	return users, nil
}

func (r *PostgresRepository) GetById(ctx context.Context, id string) (User, error) {
	return User{}, nil
}

// func (r *PostgresRepository) Update(ctx context.Context, user User) error {
// 	return nil
// }

// func (r *PostgresRepository) Delete(ctx context.Context, id string) error {
// 	return nil
// }