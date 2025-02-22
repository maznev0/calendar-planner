package user

import "context"

type Repository interface {
	Create(ctx context.Context, user *User) error
	GetAllUsers(ctx context.Context) (users []User, err error)
	GetOne(ctx context.Context, id string) (User, error)
	Update(ctx context.Context, user User) error
	Delete(ctx context.Context, id string) error
}