package order

import (
	"context"
	"server/internal/payments"
	"server/internal/worker"
	"server/pkg/utils"
)

type Service interface {
	GetByDates(ctx context.Context, dates []string) ([]utils.Date, error)
	GetByDate(ctx context.Context, date string) ([]Order, []worker.Worker, error)
	GetById(ctx context.Context, id string) (Order, worker.Worker, payments.Payments, error)
	Create(ctx context.Context, order *Order, workers []worker.Worker) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetByDates(ctx context.Context, dates []string) ([]utils.Date, error) {
	return s.repo.GetByDates(ctx, dates)
}

func (s *service) GetByDate(ctx context.Context, date string) ([]Order, []worker.Worker, error) {
	return s.repo.GetByDate(ctx, date)
}

func (s *service) GetById(ctx context.Context, id string) (Order, worker.Worker, payments.Payments, error) {
	return s.repo.GetById(ctx, id)
}

func (s *service) Create(ctx context.Context, order *Order, workers []worker.Worker) error {
	return s.repo.Create(ctx, order, workers)
}