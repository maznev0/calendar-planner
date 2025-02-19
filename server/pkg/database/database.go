package postgresql

import (
	"context"
	"fmt"
	"server/internal/config"
	"server/pkg/logging"
	"server/pkg/utils"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// ! must be upgrade
func NewPool(ctx context.Context, maxAttempts int, dbconf config.DBConfig) (pool *pgxpool.Pool,err error) {
	logger := logging.GetLogger()
	dsn := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=%s", dbconf.User, dbconf.Password, dbconf.Host, dbconf.Port, dbconf.Name, dbconf.SSLMode)

	err = utils.Retry(func() error {
		ctx, cancel := context.WithTimeout(ctx, 5 * time.Second)
		defer cancel()

		pool, err = pgxpool.New(ctx, dsn)
		if err != nil {
			return err
		}

		if err := pool.Ping(ctx); err != nil {
			return err
		}

		return nil
	}, maxAttempts, time.Second * 5)

	if err != nil {
		logger.Printf("error connecting to postgres after %d attempts: %v", maxAttempts, err)
		return nil, err
	}

	logger.Info("connected to postgres")
	return pool, nil
}