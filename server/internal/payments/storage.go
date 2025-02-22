package payments

import (
	"context"
)

type Repository interface {
	Create(ctx context.Context, payments *Payments) error
	GetByOrderId(ctx context.Context, id string) (payments Payments, err error)
	Update(ctx context.Context, payments Payments) error
	Delete(ctx context.Context, orederId string) error 
}