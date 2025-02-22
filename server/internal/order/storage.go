package order

import "context"

type Repository interface {
	Create(ctx context.Context, order *Order) error
	Get() (order Order, err error)
	GetAll() (orders []Order, err error)
	GetByDate() (orders []Order, err error)
	Update() error
	Delete() error
}