package order

import (
	"context"
	"server/internal/payments"
	"server/internal/worker"
)

type Service interface {
	GetQuantityByDates(ctx context.Context, startDate, endDate string) ([]Date, error)
	GetOrdersByDate(ctx context.Context, date string) ([]OrderWithDetails, error)
	GetById(ctx context.Context, id string) (Order, worker.Worker, payments.Payments, error)
	Create(ctx context.Context, order *Order, workers []worker.Worker) error
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

func (s *service) GetById(ctx context.Context, id string) (Order, worker.Worker, payments.Payments, error) {
	return s.repo.GetById(ctx, id)
}

func (s *service) Create(ctx context.Context, order *Order, workers []worker.Worker) error {
	return s.repo.Create(ctx, order, workers)
}