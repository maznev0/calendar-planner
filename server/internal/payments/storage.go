package payments

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Update(ctx context.Context, payment Payment) error
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

func (r *PostgresRepository) Update(ctx context.Context, payment Payment) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `
		UPDATE payments 
		SET total_price = $1, driver_price = $2, other_price = $3, polish = $4
		WHERE order_id = $4 AND driver_id = $5`,
		payment.TotalPrice, payment.DriverPrice, payment.OtherPrice, payment.Polish, payment.OrderId, payment.DriverId)
	if err != nil {
		return err
	}

	for _, worker := range payment.WorkersPayments {
		_, err = tx.Exec(ctx, `
			UPDATE order_workers 
			SET worker_payment = $1 
			WHERE worker_id = $2 AND order_id = $3`,
			worker.WorkerPayment, worker.WorkerId, payment.OrderId)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
