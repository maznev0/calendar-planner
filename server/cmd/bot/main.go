package main

import (
	"server/internal/config"
	"server/internal/telegram"
	"server/pkg/logging"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func main() {
	logger := logging.GetLogger()
	
	cfg := config.GetConfig()

	// initializing Bot
	bot, err := tgBotApi.NewBotAPI(cfg.Telegram.Token)
	if err != nil {
		logger.Fatal(err)
	}

	bot.Debug = true
	logger.Info("BOT initialized")
	// 

	// starting BOT
	telegram.StartTelegramBot(bot, logger)
	logger.Info("BOT is working")
}