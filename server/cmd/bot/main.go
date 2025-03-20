package main

import (
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"server/internal/config"
	"server/internal/telegram"
	"server/pkg/logging"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/nats-io/nats.go"
)

func main() {
    logger := logging.GetLogger()

    cfg := config.GetConfig()
    logger.Info("BOT is starting")

    bot, err := tgBotApi.NewBotAPI(cfg.Telegram.Token)
    if err != nil {
        logger.Fatal(err)
    }

    bot.Debug = true
    logger.Info("BOT initialized")

    natsConn, err := nats.Connect(nats.DefaultURL)
    if err != nil {
        logger.Fatal(err)
    }
    defer natsConn.Close()

    if err := telegram.StartTelegramBot(bot, logger, natsConn); err != nil {
        logger.Fatal(err)
    }

    go func() {
        logger.Info("Starting HTTP-server for webhooks on port 8082")
        if err := http.ListenAndServe(":8082", nil); err != nil {
            logger.Fatalf("Failed to start server: %v", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
    <-quit

    logger.Info("BOT завершает работу")
}
