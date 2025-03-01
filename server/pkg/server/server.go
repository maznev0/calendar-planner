package server

import (
	"fmt"
	"net"
	"net/http"
	"server/internal/config"
	"server/pkg/logging"
	"time"

	"github.com/julienschmidt/httprouter"
)

// type Server struct {
// 	httpServer *http.Server
// }

func Start(router *httprouter.Router, cfg *config.Config) {
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

func Stop() {
	panic("")
}