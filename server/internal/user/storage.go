package user

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, user *User) error
	GetAll(ctx context.Context) ([]User, error)
	GetById(ctx context.Context, id string) (User, error)
	Update(ctx context.Context, user User) error
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
	return nil
}

func (r *PostgresRepository) GetAll(ctx context.Context) ([]User, error) {
	return []User{}, nil
}

func (r *PostgresRepository) GetById(ctx context.Context, id string) (User, error) {
	return User{}, nil
}

func (r *PostgresRepository) Update(ctx context.Context, user User) error {
	return nil
}

func (r *PostgresRepository) Delete(ctx context.Context, id string) error {
	return nil
}