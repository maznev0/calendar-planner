package main

import (
	"context"
	"os"
	"os/signal"
	"server/internal/car"
	"server/internal/config"
	"server/internal/order"
	"server/internal/payments"
	"server/internal/user"
	"server/middleware"
	"server/pkg/database"
	"server/pkg/logging"
	"server/pkg/server"
	"syscall"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/nats-io/nats.go"
	"github.com/rs/cors"
)

func main() {
	logger := logging.GetLogger()
	logger.Info("create router")
	router := httprouter.New()

	cfg := config.GetConfig()
	logger.Print(cfg)

	c := cors.New(cors.Options{
        AllowedOrigins:   []string{"*"},
        AllowedMethods:   []string{"GET", "POST", "DELETE"},
        AllowedHeaders:   []string{"Content-Type"},
        AllowCredentials: true,
    })

	// creating Conection Pool
	pool, err := database.NewPool(context.Background(), 10, cfg.Database)
	if err != nil {
		logger.Fatalf("%v", err)
	}

	defer pool.Close()
	//

	// creating Nats Connection
	natsConn, err := nats.Connect(nats.DefaultURL)
	if err != nil {
		logger.Fatalf("%v", err)
	}
	defer natsConn.Close()
	//

	logger.Info("register user handler")
	repoUser := user.NewRepository(pool, logger)
	serviceUser := user.NewService(repoUser)	
	handlerUser := user.NewHandler(logger, serviceUser)
	handlerUser.Register(router)

	logger.Info("register order handler")
	repoOrder := order.NewRepository(pool, logger)
	serviceOrder := order.NewService(repoOrder)
	handlerOrder := order.NewHandler(logger, serviceOrder, natsConn)
	handlerOrder.Register(router)

	logger.Info("register order handler")
	repoPayments := payments.NewRepository(pool, logger)
	servicePayments := payments.NewService(repoPayments)
	handlerPayments := payments.NewHandler(logger, servicePayments)
	handlerPayments.Register(router)

	logger.Info("register car handler")
	repoCar := car.NewRepository(pool, logger)
	serviceCar := car.NewService(repoCar)
	handlerCar := car.NewHandler(logger, serviceCar)
	handlerCar.Register(router)

	handler := middleware.AuthMiddleware(c.Handler(router))
	
	serverInstance := server.NewServer(handler, cfg)
	go serverInstance.Start()

	// Creating backup one time for a week
	go func() {
		for {
			logger.Info("Starting weekly database backup...")
			if err := database.BackupDatabase(cfg.Database, logger); err != nil {
				logger.Errorf("Error during weekly backup: %v", err)
			} else {
				logger.Info("Weekly backup successfully created.")
			}
			time.Sleep(7 * 24 * time.Hour)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit

	logger.Print("Server Shutting Down")

	logger.Info("Creating backup before shutting down server.")
	if err := database.BackupDatabase(cfg.Database, logger); err != nil {
		logger.Errorf("Failed to create backup before shutting down server, error: %v", err)
	} else {
		logger.Info("Backup successfully created before shutting down server.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), serverInstance.ShutdownTimeout)
	defer cancel()

	if err := serverInstance.Stop(ctx); err != nil {
		logger.Errorf("Error occurred on server shutting down: %v", err)
	}
}


