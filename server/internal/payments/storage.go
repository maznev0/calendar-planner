package payments

import (
	"context"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Update(ctx context.Context, payment Payment) error
	UpdateBot(ctx context.Context, payment PaymentBot) error
	GetWeekPayments(ctx context.Context, startDate, endDate string) (WeekPayments, error)
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

	workersPayments := 0
	for _, worker := range payment.WorkersPayments {
		workersPayments += worker.WorkerPayment
	}
	r.logger.Infof("workersPayments: %d", workersPayments)

	_, err = tx.Exec(ctx, `
		UPDATE payments 
		SET total_price = $1, driver_price = $2, other_price = $3, polish = $4, 
	    	profit = (COALESCE($1, 0) - COALESCE($2, 0) - COALESCE($3, 0) - COALESCE($5, 0)) 
		WHERE order_id = $6 AND driver_id = $7`,
		payment.TotalPrice, payment.DriverPrice, payment.OtherPrice, payment.Polish, 
		workersPayments, payment.OrderId, payment.DriverId,
	)

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

	_, err = r.db.Exec(ctx, `UPDATE ORDERS SET order_state = $1 WHERE id = $2`, "Ожидает проверки", payment.OrderId) 
	if err != nil {
		r.logger.Errorf("Failed to update order state after update payments: %v", err)
		return err
	}

	return tx.Commit(ctx)
}

func (r *PostgresRepository) UpdateBot(ctx context.Context, payment PaymentBot) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	workersPayments := 0
	for _, worker := range payment.WorkersPayments {
		workersPayments += worker.WorkerPayment
	}
	r.logger.Infof("workersPayments: %d", workersPayments)

	_, err = tx.Exec(ctx, `
		UPDATE payments 
		SET total_price = $1, driver_price = $2, other_price = $3, polish = $4, 
		    profit = (COALESCE($1, 0) - COALESCE($2, 0) - COALESCE($3, 0) - COALESCE($5, 0)) 
		WHERE order_id = $6 AND driver_id = $7`,
		payment.TotalPrice, payment.DriverPrice, payment.OtherPrice, payment.Polish, 
		workersPayments, payment.OrderId, payment.DriverId,
	)
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

	_, err = tx.Exec(ctx, `
		UPDATE orders 
		SET order_state = $1, meters = $2, price = $3 
		WHERE id = $4`, "Ожидает проверки", payment.Meters, payment.Price, payment.OrderId)
	if err != nil {
		r.logger.Errorf("Failed to update order state, meters, and price after update payments: %v", err)
		return err
	}

	return tx.Commit(ctx)
}

func (r *PostgresRepository) GetWeekPayments(ctx context.Context, startDate, endDate string) (WeekPayments, error) {
	var result WeekPayments

	query := `
		WITH worker_payments AS (
			SELECT order_id, COALESCE(SUM(worker_payment), 0) AS total_worker_payment
			FROM order_workers
			GROUP BY order_id
		),
		full_payments AS (
			SELECT p.order_id, (COALESCE(wp.total_worker_payment, 0) + COALESCE(p.driver_price, 0)) AS total_worker_payment
			FROM payments p
			LEFT JOIN worker_payments wp ON p.order_id = wp.order_id
		)
		SELECT 
			COALESCE(SUM(p.total_price), 0), 
			COALESCE(SUM(fp.total_worker_payment), 0),
			COALESCE(SUM(p.other_price), 0),
			COALESCE(SUM(p.polish), 0), 
			COALESCE(AVG(o.meters), 0),
			COUNT(CASE WHEN o.order_state = 'Готов' THEN 1 END),
			COUNT(CASE WHEN o.order_state != 'Готов' THEN 1 END),
			COALESCE(SUM(p.profit), 0)
		FROM payments p
		JOIN orders o ON p.order_id = o.id
		LEFT JOIN full_payments fp ON o.id = fp.order_id
		WHERE o.order_date BETWEEN $1 AND $2;
	`

	row := r.db.QueryRow(ctx, query, startDate, endDate)
	if err := row.Scan(
		&result.TotalPriceWeek,
		&result.TotalPriceWorkers,
		&result.TotalOtherPrice,
		&result.TotalPolish,
		&result.MediumMeters,
		&result.DoneOrders,
		&result.LeftOrders,
		&result.TotalProfit,
	); err != nil {
		if err.Error() == "no rows in result set" {
			return result, nil
		}
		r.logger.Errorf("Failed to query weekly stats: %v", err)
		return result, err
	}

	carQuery := `
		SELECT c.color, c.carname, COALESCE(SUM(p.profit), 0) 
		FROM payments p
		JOIN cars c ON p.driver_id = c.driver_id
		JOIN orders o ON p.order_id = o.id
		WHERE o.order_date BETWEEN $1 AND $2
		GROUP BY c.color, c.carname;
	`

	rows, err := r.db.Query(ctx, carQuery, startDate, endDate)
	if err != nil {
		r.logger.Errorf("Failed to query car statistics: %v", err)
		return result, err
	}
	defer rows.Close()

	for rows.Next() {
		var car Car
		if err := rows.Scan(&car.Color, &car.Carname, &car.CarProfit); err != nil {
			r.logger.Errorf("Failed to scan car row: %v", err)
			return result, err
		}
		result.CarsStatistics = append(result.CarsStatistics, car)
	}

	return result, nil
}
