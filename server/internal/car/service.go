package car

import "context"

type Service interface {
	Create(ctx context.Context, car *Car, driver_id string) error
	GetAll(ctx context.Context) ([]Car, error)
	// GetOne(ctx context.Context, driver_id string) (car Car, err error)
	// GetAll(ctx context.Context) (cars []Car, err error)
	// Update(ctx context.Context, driver_id string) error
	// Delete(ctx context.Context, driver_id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, car *Car, driver_id string) error {
	return s.repo.Create(ctx, car, driver_id)
}

func (s *service) GetAll(ctx context.Context) ([]Car, error){
	return s.repo.GetAll(ctx)
}