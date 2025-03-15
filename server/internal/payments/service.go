package payments

import "context"

type Service interface {
	Update(ctx context.Context, payment Payment) error
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