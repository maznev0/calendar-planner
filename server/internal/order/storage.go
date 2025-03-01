package order

import (
	"context"
	"server/internal/payments"
	"server/internal/worker"
	"server/pkg/logging"
	"server/pkg/utils"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	//Create(ctx context.Context, order *Order) error
	//GetById(ctx context.Context, id string) (order Order, err error)
	// GetAll(ctx context.Context) (orders []Order, err error)
	GetByDates(ctx context.Context, dates []string) ([]utils.Date, error)
	GetByDate(ctx context.Context, date string) ([]Order, []worker.Worker, error)
	GetById(ctx context.Context, id string) (Order, worker.Worker, payments.Payments, error)
	Create(ctx context.Context, order *Order, workers []worker.Worker) error
	//Update(ctx context.Context, order Order) error
	//Delete(ctx context.Context, id string) error
}

type PostgresRepository struct {
	db     *pgxpool.Pool
	logger *logging.Logger
}

func NewRepository(db *pgxpool.Pool, logger *logging.Logger) Repository {
	return &PostgresRepository{
		db:     db,
		logger: logger,
	}
}

func (r *PostgresRepository) Create(ctx context.Context, order *Order, workers []worker.Worker) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Создание заказа
	queryOrder := `INSERT INTO ORDERS 
		(order_date, order_address, phone_number, meters, price, driver_id, note, order_state) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	var orderId string
	err = tx.QueryRow(ctx, queryOrder, order.Date, order.Address, order.PhoneNumber, order.Meters, order.Price, order.DriverId, order.Note, order.OrderState).Scan(&orderId)
	if err != nil {
		return err
	}

	// Добавление рабочих к заказу
	queryWorker := `INSERT INTO ORDER_WORKERS (order_id, worker_id, worker_payment) VALUES ($1, $2, $3)`
	for _, w := range workers {
		_, err := tx.Exec(ctx, queryWorker, orderId, w.WorkerId, w.WorkerPayment)
		if err != nil {
			return err
		}
	}

	// Фиксируем транзакцию
	return tx.Commit(ctx)
}

func (r *PostgresRepository) GetByDates(ctx context.Context, dates []string) ([]utils.Date, error) {
	return []utils.Date{}, nil
}

func (r *PostgresRepository) GetByDate(ctx context.Context, date string) ([]Order, []worker.Worker, error) {
	return []Order{}, []worker.Worker{}, nil
}

func (r *PostgresRepository) GetById(ctx context.Context, id string) (Order, worker.Worker, payments.Payments, error) {
	return Order{}, worker.Worker{}, payments.Payments{}, nil
}
