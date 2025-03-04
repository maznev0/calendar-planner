package car

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, car *Car, driver_id string) error
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
	query := "INSERT INTO CARS (driver_id, color, carname) VALUES ($1, $2, $3)"
	_, err := r.db.Exec(ctx, query, driver_id, car.Color, car.Carname)
	if err != nil {
		r.logger.Errorf("Failed to create car: %v", err)
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