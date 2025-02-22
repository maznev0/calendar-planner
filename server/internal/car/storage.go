package car

import "context"

type Repository interface {
	Create(ctx context.Context, car *Car) error
	GetOne() (car Car, err error)
	GetAll() (cars []Car, err error)
	Update() error
	Delete() error
}