package car

import "context"

type Repository interface {
	Create(ctx context.Context, car *Car) error
	GetOne(ctx context.Context, driver_id string) (car Car, err error)
	GetAll(ctx context.Context) (cars []Car, err error)
	Update(ctx context.Context, driver_id string) error
	Delete(ctx context.Context, driver_id string) error
}