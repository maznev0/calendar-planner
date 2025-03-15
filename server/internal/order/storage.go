package order

import (
	"context"
	"server/internal/worker"
	"server/pkg/logging"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, order *Order, workers []worker.Worker) error
	//GetAll(ctx context.Context) (orders []Order, err error)
	GetQuantityByDates(ctx context.Context, startDate, endDate string) ([]Date, error)
	GetOrdersByDate(ctx context.Context, date string) ([]OrderWithDetails, error)
	GetById(ctx context.Context, id string) (Order, []Worker, Payments, error)
	Update(ctx context.Context, order Order) error
	UpdateOrderState(ctx context.Context, orderId, newState string) error
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

	queryOrder := `INSERT INTO ORDERS 
		(order_date, order_address, phone_number, meters, price, driver_id, note, order_state) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	var orderId string
	err = tx.QueryRow(ctx, queryOrder, order.Date, order.Address, order.PhoneNumber, order.Meters, order.Price, order.DriverId, order.Note, order.OrderState).Scan(&orderId)
	if err != nil {
		return err
	}

	queryWorker := `INSERT INTO ORDER_WORKERS (order_id, worker_id, worker_payment) VALUES ($1, $2, $3)`
	for _, w := range workers {
		_, err := tx.Exec(ctx, queryWorker, orderId, w.WorkerId, w.WorkerPayment)
		if err != nil {
			return err
		}
	}

	queryPayment := `INSERT INTO PAYMENTS (order_id, driver_id, total_price, driver_price, polish, other_price) 
		VALUES ($1, $2, 0, 0, 0, 0)`
	_, err = tx.Exec(ctx, queryPayment, orderId, order.DriverId)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r *PostgresRepository) Update(ctx context.Context, order Order) error {
	query := `
		UPDATE orders
		SET order_date = $1, order_address = $2, phone_number = $3, meters = $4, 
		    price = $5, note = $6, order_state = $7
		WHERE id = $8
	`
	_, err := r.db.Exec(ctx, query, order.Date, order.Address, order.PhoneNumber, order.Meters,
		order.Price, order.Note, order.OrderState, order.Id)
	
	if err != nil {
		r.logger.Errorf("Failed to update order with ID %s: %v", order.Id, err)
		return err
	}

	return nil
}

func (r *PostgresRepository) UpdateOrderState(ctx context.Context, orderId, newState string) error {
	query := `UPDATE ORDERS SET order_state = $1 WHERE id = $2`

	_, err := r.db.Exec(ctx, query, newState, orderId) 
	if err != nil {
		r.logger.Errorf("Failed to update order state: %v", err)
		return err
	}
	return nil
}



func (r *PostgresRepository) GetQuantityByDates(ctx context.Context, startDate, endDate string) ([]Date, error) {
	query := `
		SELECT TO_CHAR(order_date, 'YYYY-MM-DD') AS date, COUNT(*) AS orders_quantity 
		FROM orders 
		WHERE order_date BETWEEN $1 AND $2 
		GROUP BY date 
		ORDER BY date;
	`

	rows, err := r.db.Query(ctx, query, startDate, endDate)
	if err != nil {
		r.logger.Errorf("Failed to fetch orders by date range: %v", err)
		return nil, err
	}
	defer rows.Close()

	var dates []Date
	for rows.Next() {
		var date Date
		if err := rows.Scan(&date.Date, &date.OrdersQuantity); err != nil {
			r.logger.Errorf("Failed to scan row: %v", err)
			return nil, err
		}
		dates = append(dates, date)
	}

	if err := rows.Err(); err != nil {
		r.logger.Errorf("Rows iteration error: %v", err)
		return nil, err
	}

	return dates, nil
}


func (r *PostgresRepository) GetOrdersByDate(ctx context.Context, date string) ([]OrderWithDetails, error) {
	var orders []OrderWithDetails

	query := `
		SELECT o.id, TO_CHAR(o.order_date, 'YYYY-MM-DD'), o.order_address, o.phone_number, 
		o.meters, o.price, u.username AS driver_name, c.color, o.order_state
	FROM ORDERS o
	JOIN USERS u ON o.driver_id = u.id
	LEFT JOIN CARS c ON o.driver_id = c.driver_id
	WHERE o.order_date = $1`
	rows, err := r.db.Query(ctx, query, date)
	if err != nil {
		r.logger.Errorf("Failed to get orders by date: %v", err)
		return nil, err
	}
	defer rows.Close()

	orderMap := make(map[string]*OrderWithDetails)

	for rows.Next() {
		var o OrderWithDetails
		if err := rows.Scan(&o.Id, &o.Date, &o.Address, &o.PhoneNumber, &o.Meters, &o.Price, &o.DriverName, &o.CarColor, &o.OrderState); err != nil {
			r.logger.Errorf("Failed to scan order: %v", err)
			return nil, err
		}
		orderMap[o.Id] = &o
	}

	workerQuery := `
		SELECT ow.order_id, u.username 
		FROM ORDER_WORKERS ow
		JOIN USERS u ON ow.worker_id = u.id
		WHERE ow.order_id = ANY($1)`

	orderIDs := make([]string, 0, len(orderMap))
	for id := range orderMap {
		orderIDs = append(orderIDs, id)
	}

	workerRows, err := r.db.Query(ctx, workerQuery, orderIDs)
	if err != nil {
		r.logger.Errorf("Failed to get workers: %v", err)
		return nil, err
	}
	defer workerRows.Close()

	for workerRows.Next() {
		var orderID, workerName string
		if err := workerRows.Scan(&orderID, &workerName); err != nil {
			r.logger.Errorf("Failed to scan worker: %v", err)
			return nil, err
		}
		if order, exists := orderMap[orderID]; exists {
			order.WorkerNames = append(order.WorkerNames, workerName)
		}
	}

	for _, order := range orderMap {
		orders = append(orders, *order)
	}

	return orders, nil
}


func (r *PostgresRepository) GetById(ctx context.Context, id string) (Order, []Worker, Payments, error) {
	var order Order
	var workers []Worker
	var payments Payments

	// Получение заказа
	queryOrder := `SELECT o.id, TO_CHAR(o.order_date, 'YYYY-MM-DD'), o.order_address, o.phone_number, o.meters, o.price, o.driver_id, 
		u.username AS driver_name, c.color, c.chat_id, o.note, o.order_state FROM orders o
		JOIN USERS u ON o.driver_id = u.id 
		LEFT JOIN cars c ON o.driver_id = c.driver_id WHERE o.id = $1
		`
	row := r.db.QueryRow(ctx, queryOrder, id)
	if err := row.Scan(&order.Id, &order.Date, &order.Address, &order.PhoneNumber, &order.Meters, &order.Price, &order.DriverId, &order.Drivername, &order.CarColor, &order.ChatId, &order.Note, &order.OrderState); err != nil {
		r.logger.Errorf("Failed to scan order: %v", err)
		return Order{}, nil, Payments{}, err
	}

	// Получение работников
	queryWorkers := `SELECT ow.worker_id, u.username, ow.worker_payment 
	    FROM order_workers ow 
	    JOIN users u ON ow.worker_id = u.id 
	    WHERE ow.order_id = $1`
	rows, err := r.db.Query(ctx, queryWorkers, id)
	if err != nil {
		r.logger.Errorf("Failed to get workers for order: %v", err)		
		return order, nil, payments, err
	}
	defer rows.Close()

	for rows.Next() {
		var worker Worker
		if err := rows.Scan(&worker.WorkerId, &worker.Workername, &worker.WorkerPayment); err != nil {			
			r.logger.Errorf("Failed to scan workers: %v", err)
			return order, nil, payments, err
		}
		workers = append(workers, worker)
	}

	// Получение платежей
	queryPayments := `SELECT total_price, driver_price, other_price FROM payments WHERE order_id = $1`
	row = r.db.QueryRow(ctx, queryPayments, id)
	if err := row.Scan(&payments.TotalPrice, &payments.DriverPrice, &payments.OtherPrice); err != nil {
		if err.Error() == "no rows in result set" {
			payments = Payments{}
		} else {
			return order, workers, Payments{}, err
		}
	}

	return order, workers, payments, nil
}
