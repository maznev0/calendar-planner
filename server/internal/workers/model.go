package worker

type Worker struct {
	OrderId string `json:"order_id" binding:"required"`
	WorkerId string `json:"worker_id" binding:"required"`
	WorkerPayment int `json:"worker_payment"`
}