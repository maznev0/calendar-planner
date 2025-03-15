package payments

type Payment struct {
	OrderId        string   `json:"order_id" binding:"required"`
	DriverId       string   `json:"driver_id" binding:"required"`
	TotalPrice     int      `json:"total_price" binding:"required"`
	DriverPrice    int      `json:"driver_price" binding:"required"`
	OtherPrice     int      `json:"other_price" binding:"required"`
	Polish 		   int      `json:"polish" binding:"required"`
	WorkersPayments []Worker `json:"workers_payments" binding:"required"`
}

type Worker struct {
	WorkerId      string `json:"worker_id" binding:"required"`
	WorkerPayment int    `json:"worker_payment"`
}