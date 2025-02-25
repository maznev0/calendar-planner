package main

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"server/internal/config"
	"server/internal/user"
	"server/pkg/database"
	"server/pkg/logging"
	"time"

	"github.com/julienschmidt/httprouter"
)

func main() {
	logger := logging.GetLogger()
	logger.Info("create router")
	router := httprouter.New()

	cfg := config.GetConfig()
	logger.Print(cfg)

	pool, err := database.NewPool(context.TODO(), 10, cfg.Database)
	if err != nil {
		logger.Fatalf("%v", err)
	}


	logger.Info("register user handler")
	repo := user.NewRepository(pool, logger)
	service := user.NewService(repo)	
	handler := user.NewHandler(logger, service)
	handler.Register(router)

	start(router, cfg)
}

// * Start -> server/server.go ?
func start(router *httprouter.Router, cfg *config.Config) {
	logger := logging.GetLogger()
	logger.Info("start server")

	listener, listenErr := net.Listen("tcp", fmt.Sprintf("%s:%s", cfg.Listen.BindIP, cfg.Listen.Port))
	logger.Infof("server is listening port %s:%s", cfg.Listen.BindIP, cfg.Listen.Port)

	if listenErr != nil {
		logger.Fatal(listenErr)
	}

	server := &http.Server{
		Handler: router,
		WriteTimeout: 5 * time.Second,
		ReadTimeout: 5 * time.Second,
	}

	logger.Fatal(server.Serve(listener))
}