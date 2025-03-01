package worker

type Repository interface {
	//GetAllByOrderId() (workers []Worker, err error)
	//GetByWorkerID() (orders []order.Order, err error)
	Update() error
	Delete() error
}