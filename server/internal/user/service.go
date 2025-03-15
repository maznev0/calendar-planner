package user

import "context"

type Service interface {
	Create(ctx context.Context, user *User) error
	GetAll(ctx context.Context) (users []User, err error)
	GetWorkersAndDrivers(ctx context.Context, date string) ([]Drivers, []Workers, error)
	GetDriversWithoutCar(ctx context.Context) ([]DriversWithoutCar, error)
	//GetById(ctx context.Context, id string) (User, error)
	//Update(ctx context.Context, user User) error
	//Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, user *User) error {
	return s.repo.Create(ctx, user)
}

func (s *service) GetAll(ctx context.Context) ([]User, error) {
	return s.repo.GetAll(ctx)
}

func (s *service) GetWorkersAndDrivers(ctx context.Context, date string) ([]Drivers, []Workers, error) {
	return s.repo.GetWorkersAndDrivers(ctx, date)
}

func (s *service) GetDriversWithoutCar(ctx context.Context) ([]DriversWithoutCar, error) {
	return s.repo.GetDriversWithoutCar(ctx)
}

// func (s *service) GetById(ctx context.Context, id string) (User, error) {
// 	return s.repo.GetById(ctx, id)
// }

// func (s *service) Update(ctx context.Context, user User) error {
// 	return s.repo.Update(ctx, user)
// }

// func (s *service) Delete(ctx context.Context, id string) error {
// 	return s.repo.Delete(ctx, id)
// }
