package payments

type Payment struct {
	OrderId        string   `json:"order_id" binding:"required"`
	DriverId       string   `json:"driver_id" binding:"required"`
	TotalPrice     int      `json:"total_price" binding:"required"`
	DriverPrice    int      `json:"driver_price" binding:"required"`
	OtherPrice     int      `json:"other_price" binding:"required"`
	Polish 		   int      `json:"polish" binding:"required"`
	Profit		   int
	WorkersPayments []Worker `json:"workers_payments" binding:"required"`
}

type PaymentBot struct {
	OrderId        string   `json:"order_id" binding:"required"`
	DriverId       string   `json:"driver_id" binding:"required"`
	TotalPrice     int      `json:"total_price" binding:"required"`
	DriverPrice    int      `json:"driver_price" binding:"required"`
	OtherPrice     int      `json:"other_price" binding:"required"`
	Meters         float32  `json:"meters" binding:"required"`
	Price          int      `json:"price" binding:"required"`
	Polish 		   int      `json:"polish" binding:"required"`
	Profit		   int
	WorkersPayments []Worker `json:"workers_payments" binding:"required"`
}

type Worker struct {
	WorkerId      string `json:"worker_id" binding:"required"`
	WorkerPayment int    `json:"worker_payment"`
}

type WeekPayments struct {
	TotalPriceWeek int `json:"total_price_week"`
	TotalPriceWorkers int `json:"total_price_workers"`
	TotalOtherPrice int `json:"total_other_price"`
	TotalPolish int `json:"total_polish"`
	MediumMeters float32 `json:"medium_meters"`
	DoneOrders int `json:"done_orders"`
	LeftOrders int `json:"left_orders"`
	TotalProfit int `json:"total_profit"`
	CarsStatistics []Car `json:"cars_statistics"`
}

type Car struct {
	Color string `json:"color"`
	Carname string `json:"carname"`
	CarProfit int `json:"car_profit"`
}