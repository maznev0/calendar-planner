package utils

import (
	"server/pkg/logging"
	"time"
)

func Retry(fn func() error, maxAttempts int, delay time.Duration) error {
	logger := logging.GetLogger()
	var err error
	for i := 0; i < maxAttempts; i++ {
		err = fn()
		if err == nil {
			return nil
		}

		logger.Printf("Attempt %d failed: %v. Retrying in %v...", i+1, err, delay)
		time.Sleep(delay)
		delay *= 2 
	}
	return err
}
