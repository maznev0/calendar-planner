package redis

import (
	"context"

	"github.com/go-redis/redis/v8"
)

func NewClient(ctx context.Context) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
}
