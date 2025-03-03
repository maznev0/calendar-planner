package main

import (
	"context"
	"server/internal/config"
	"server/internal/order"
	"server/internal/user"
	"server/pkg/database"
	"server/pkg/logging"
	"server/pkg/server"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
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
        AllowedOrigins:   []string{"*"}, // Разрешаем все домены (можно указать конкретный)
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

	// initializing Bot
	bot, err := tgBotApi.NewBotAPI(cfg.Telegram.Token)
	if err != nil {
		logger.Fatal(err)
	}

	bot.Debug = true
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

	handler := c.Handler(router)

	// * BOT
	// go telegram.StartTelegramBot(bot, logger)
	// *
	server.Start(handler, cfg)
}

// func start(router *httprouter.Router, cfg *config.Config) {
// 	logger := logging.GetLogger()
// 	logger.Info("start server")

// 	listener, listenErr := net.Listen("tcp", fmt.Sprintf("%s:%s", cfg.Listen.BindIP, cfg.Listen.Port))
// 	logger.Infof("server is listening port %s:%s", cfg.Listen.BindIP, cfg.Listen.Port)

// 	if listenErr != nil {
// 		logger.Fatal(listenErr)
// 	}

// 	server := &http.Server{
// 		Handler: router,
// 		WriteTimeout: 5 * time.Second,
// 		ReadTimeout: 5 * time.Second,
// 	}

// 	logger.Fatal(server.Serve(listener))
// }