package main

import (
	"fmt"
	"net"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"server/internal/config"
	"server/internal/user"
	"server/pkg/logging"
	"time"

	"github.com/julienschmidt/httprouter"
)

func main() {
	logger := logging.GetLogger()
	logger.Info("create router")
	router := httprouter.New()

	cfg := config.GetConfig()

	logger.Info("register user handler")
	handler := user.NewHandler(logger)
	handler.Register(router)

	start(router, cfg)
}

// * Start -> server/server.go ?
func start(router *httprouter.Router, cfg *config.Config) {
	logger := logging.GetLogger()
	logger.Info("start server")

	var listener net.Listener
	var listenErr error

	if cfg.Listen.Type == "sock" {
		logger.Info("detect app path")
		appDir, err := filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			logger.Fatal(err)
		}
		logger.Info("create socket")
		socketPath := path.Join(appDir, "app.sock")

		logger.Info("listen unix socket")
		listener, listenErr = net.Listen("unix", socketPath)
		logger.Infof("server is listening unix socket: %s", socketPath)

		// !
		/*
		time="2025-02-17T01:59:40+03:00" level=fatal 
		msg="listen unix /Users/vladnz/Library/Caches/go-build/b3/b38833e0b17c14108a216adfa9d197f9a74012e73b3118b5681e9bd2e93aca51-d/app.sock: 
		bind: invalid argument" func="main.start()" file="main.go:60"
		*/
		
	} else {
		logger.Info("listen tcp")
		listener, listenErr = net.Listen("tcp", fmt.Sprintf("%s:%s", cfg.Listen.BindIP, cfg.Listen.Port))
		logger.Infof("server is listening port %s:%s", cfg.Listen.BindIP, cfg.Listen.Port)
	}

	if listenErr != nil {
		logger.Fatal(listenErr)
	}


	server := &http.Server{
		Handler: router,
		WriteTimeout: 10 * time.Second,
		ReadTimeout: 10 * time.Second,
	}

	logger.Fatal(server.Serve(listener))
}