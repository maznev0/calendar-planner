package order

import (
	"context"
)

type Service interface {
	GetQuantityByDates(ctx context.Context, startDate, endDate string) ([]Date, error)
	GetOrdersByDate(ctx context.Context, date string) ([]OrderWithDetails, error)
	GetById(ctx context.Context, id string) (Order, []Worker, Payments, error)
	GetWorkers(ctx context.Context, orderId string) ([]string, error)
	Create(ctx context.Context, order *Order, workers []Worker) error
	Update(ctx context.Context, order Order) error
	UpdateWorkersAndDriver(ctx context.Context, orderId string, driverId *string, workerIds *[]string) error
	Delete(ctx context.Context, id string) error 
	UpdateOrderState(ctx context.Context, orderId, newState string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetQuantityByDates(ctx context.Context, startDate, endDate string) ([]Date, error) {
	return s.repo.GetQuantityByDates(ctx, startDate, endDate)
}

func (s *service) GetOrdersByDate(ctx context.Context, date string) ([]OrderWithDetails, error) {
	return s.repo.GetOrdersByDate(ctx, date)
}

func (s *service) GetById(ctx context.Context, id string) (Order, []Worker, Payments, error) {
	return s.repo.GetById(ctx, id)
}

func (s *service) GetWorkers(ctx context.Context, orderId string) ([]string, error) {
	return s.repo.GetWorkers(ctx, orderId)
}

func (s *service) Create(ctx context.Context, order *Order, workers []Worker) error {
	return s.repo.Create(ctx, order, workers)
}

func (s *service) Update(ctx context.Context, order Order) error {
	return s.repo.Update(ctx, order)
}

func (s *service) UpdateWorkersAndDriver(ctx context.Context, orderId string, driverId *string, workerIds *[]string) error {
	return s.repo.UpdateWorkersAndDriver(ctx, orderId, driverId, workerIds)
}

func (s *service) UpdateOrderState(ctx context.Context, orderId, newState string) error {
	return s.repo.UpdateOrderState(ctx, orderId, newState)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}