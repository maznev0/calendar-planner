package server

import (
	"fmt"
	"net"
	"net/http"
	"server/internal/config"
	"server/pkg/logging"
	"time"
)

// type Server struct {
// 	httpServer *http.Server
// }

func Start(handler http.Handler, cfg *config.Config) {
	logger := logging.GetLogger()
	logger.Info("start server")

	listener, listenErr := net.Listen("tcp", fmt.Sprintf("%s:%s", cfg.Listen.BindIP, cfg.Listen.Port))
	logger.Infof("server is listening on %s:%s", cfg.Listen.BindIP, cfg.Listen.Port)

	if listenErr != nil {
		logger.Fatal(listenErr)
	}

	server := &http.Server{
		Handler:      handler,
		WriteTimeout: 5 * time.Second,
		ReadTimeout:  5 * time.Second,
	}

	logger.Fatal(server.Serve(listener))
}

func Stop() {
	panic("")
}