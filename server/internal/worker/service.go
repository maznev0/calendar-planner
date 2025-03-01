package worker

import (
	"context"
)

type Service interface {
	Create(ctx context.Context, worker *Worker) error
}