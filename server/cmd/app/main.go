package main

import (
	"context"
	"server/internal/car"
	"server/internal/config"
	"server/internal/order"
	"server/internal/user"
	"server/pkg/database"
	"server/pkg/logging"
	"server/pkg/server"

	"github.com/julienschmidt/httprouter"
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
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders:   []string{"Content-Type"},
        AllowCredentials: true,
    })

	// creating Conection Pool
	pool, err := database.NewPool(context.Background(), 10, cfg.Database)
	if err != nil {
		logger.Fatalf("%v", err)
	}
	//

	

	logger.Info("register user handler")
	repoUser := user.NewRepository(pool, logger)
	serviceUser := user.NewService(repoUser)	
	handlerUser := user.NewHandler(logger, serviceUser)
	handlerUser.Register(router)

	logger.Info("register order handler")
	repoOrder := order.NewRepository(pool, logger)
	serviceOrder := order.NewService(repoOrder)
	handlerOrder := order.NewHandler(logger, serviceOrder)
	handlerOrder.Register(router)

	logger.Info("register car handler")
	repoCar := car.NewRepository(pool, logger)
	serviceCar := car.NewService(repoCar)
	handlerCar := car.NewHandler(logger, serviceCar)
	handlerCar.Register(router)

	handler := c.Handler(router)

	server.Start(handler, cfg)

	// quit := make(chan os.Signal, 1)
	// signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	// <-quit

	// logger.Print("TodoApp Shutting Down")

	// if err := server.Stop(context.Background()); err != nil {
	// 	logger.Errorf("error occured on server shutting down: %s", err.Error())
	// }

	// if err := db.Close(); err != nil {
	// 	logger.Errorf("error occured on db connection close: %s", err.Error())
	// }
}
