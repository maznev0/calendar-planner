package order

import "context"

type Repository interface {
	Create(ctx context.Context, order *Order) error
	GetById(ctx context.Context, id string) (order Order, err error)
	// GetAll(ctx context.Context) (orders []Order, err error)
	GetByDate(ctx context.Context, date string) (orders []Order, err error)
	Update(ctx context.Context, order Order) error
	Delete(ctx context.Context, id string) error
}