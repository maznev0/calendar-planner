package main

import (
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
	logger.Info("BOT запущен")

	// Инициализация бота
	bot, err := tgBotApi.NewBotAPI(cfg.Telegram.Token)
	if err != nil {
		logger.Fatal(err)
	}

	bot.Debug = true

	// Подключение к NATS
	natsConn, err := nats.Connect(nats.DefaultURL)
	if err != nil {
		logger.Fatal(err)
	}
	defer natsConn.Close()

	if err := telegram.StartTelegramBot(bot, logger, natsConn); err != nil {
		logger.Fatal(err)
	}

	// Ожидание SIGTERM или SIGINT для безопасного завершения
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	logger.Info("BOT завершает работу")
}
