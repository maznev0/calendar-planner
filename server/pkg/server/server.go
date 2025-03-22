package server

import (
	"context"
	"fmt"
	"net/http"
	"server/internal/config"
	"server/pkg/logging"
	"time"
)

type Server struct {
	httpServer      *http.Server
	ShutdownTimeout time.Duration
	CertFile        string
	KeyFile         string
}

func NewServer(handler http.Handler, cfg *config.Config) *Server {
	return &Server{
		httpServer: &http.Server{
			Handler:      handler,
			Addr:         fmt.Sprintf("%s:%s", cfg.Listen.BindIP, cfg.Listen.Port),
			WriteTimeout: 5 * time.Second,
			ReadTimeout:  5 * time.Second,
		},
		ShutdownTimeout: 5 * time.Second,
		CertFile:        cfg.TLS.CertFile,
		KeyFile:         cfg.TLS.KeyFile,
	}
}

func (s *Server) Start() {
	logger := logging.GetLogger()
	logger.Info("Starting HTTPS server")

	if err := s.httpServer.ListenAndServeTLS(s.CertFile, s.KeyFile); err != nil && err != http.ErrServerClosed {
		logger.Fatal(err)
	}
}

func (s *Server) Stop(ctx context.Context) error {
	logger := logging.GetLogger()
	logger.Info("Shutting down HTTPS server...")

	return s.httpServer.Shutdown(ctx)
}