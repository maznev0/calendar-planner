package database

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"server/internal/config"
	"server/pkg/logging"
	"server/pkg/utils"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPool(ctx context.Context, maxAttempts int, dbconf config.DBConfig) (pool *pgxpool.Pool, err error) {
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

func BackupDatabase(dbconf config.DBConfig, logger *logging.Logger) error {
    timestamp := time.Now().Format("20060102150405")
    backupDir := "backups" // Папка для бэкапов
    backupFile := fmt.Sprintf("%s_backup_%s.sql", dbconf.Name, timestamp)
    backupPath := filepath.Join(backupDir, backupFile)

    if err := os.MkdirAll(backupDir, os.ModePerm); err != nil {
        logger.Errorf("Failed to create backups directory: %v", err)
        return err
    }

    logger.Info("Starting database backup...")

    cmd := exec.Command("docker", "exec", "-i", "dbpostgres",
        "pg_dump", "-U", dbconf.User, "-d", dbconf.Name)

    outFile, err := os.Create(backupPath)
    if err != nil {
        logger.Errorf("Failed to create backup file: %v", err)
        return err
    }
    defer outFile.Close()

    cmd.Stdout = outFile

    if err := cmd.Run(); err != nil {
        logger.Errorf("Failed to run pg_dump: %v", err)
        return err
    }

    logger.Infof("Backup successful! File saved as: %s", backupPath)
    return nil
}
