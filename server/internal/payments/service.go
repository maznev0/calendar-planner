package payments

import "context"

type Service interface {
	Update(ctx context.Context, payment Payment) error
	UpdateBot(ctx context.Context, payment PaymentBot) error
	GetWeekPayments(ctx context.Context, startDate, endDate string) (WeekPayments, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Update(ctx context.Context, payment Payment) error {
	return s.repo.Update(ctx, payment)
}

func (s *service) UpdateBot(ctx context.Context, payment PaymentBot) error {
	return s.repo.UpdateBot(ctx, payment)
}

func (s *service) GetWeekPayments(ctx context.Context, startDate, endDate string) (WeekPayments, error) {
	return s.repo.GetWeekPayments(ctx, startDate, endDate)
}