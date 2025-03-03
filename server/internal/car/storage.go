package car

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, car *Car, driver_id string) error
	// GetOne(ctx context.Context, driver_id string) (car Car, err error)
	// GetAll(ctx context.Context) (cars []Car, err error)
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
	query := "INSERT INTO CARS (driver_id, color, carname) VALUES ($1, $2, $3)"
	_, err := r.db.Exec(ctx, query, driver_id, car.Color, car.Carname)
	if err != nil {
		r.logger.Errorf("Failed to create car: %v", err)
		return err
	}
	return nil
}