package telegram

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"server/pkg/logging"
	"server/pkg/redis"
	"syscall"
	"time"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

// Структура для заказа
type Order struct {
	DriverID  int64  `json:"driver_id"`
	OrderText string `json:"order_text"`
}

func StartTelegramBot(bot *tgBotApi.BotAPI, logger *logging.Logger) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Освобождаем ресурсы при выходе

	// Устанавливаем вебхук
	webhookURL := os.Getenv("WEBHOOK_URL")
	webhookConfig, _ := tgBotApi.NewWebhook(webhookURL)
	if _, err := bot.Request(webhookConfig); err != nil {
    	logger.Fatal("Ошибка установки вебхука: ", err)
	}


	// Подключаемся к Redis
	redisClient := redis.NewClient(ctx)
	pubsub := redisClient.Subscribe(ctx, "new_order")
	orderChannel := pubsub.Channel()

	// Создаем HTTP-сервер для вебхуков
	server := &http.Server{
		Addr:    ":8081",
		Handler: webhookHandler(bot, logger),
	}

	// Запускаем сервер в горутине
	go func() {
		logger.Info("Запуск HTTP-сервера для Telegram вебхуков на порту 8081")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Ошибка HTTP-сервера:", err)
		}
	}()

	// Горутина для обработки заказов из Redis
	go func() {
		for {
			select {
			case <-ctx.Done():
				logger.Info("Завершаем обработку заказов из Redis")
				return
			case msg := <-orderChannel:
				var order Order
				if err := json.Unmarshal([]byte(msg.Payload), &order); err != nil {
					logger.Error("Ошибка разбора заказа:", err)
					continue
				}

				// Отправляем заказ водителю
				message := tgBotApi.NewMessage(order.DriverID, fmt.Sprintf("🚖 Новый заказ: %s", order.OrderText))
				bot.Send(message)
			}
		}
	}()

	// Ожидание завершения по сигналу (Ctrl+C, SIGTERM)
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	<-stop // Ожидаем сигнал завершения
	logger.Info("Выключение сервера...")

	// Завершаем HTTP-сервер
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Error("Ошибка при завершении HTTP-сервера:", err)
	}

	// Завершаем подписку Redis
	if err := pubsub.Close(); err != nil {
		logger.Error("Ошибка закрытия Redis-подписки:", err)
	}

	logger.Info("Бот остановлен.")
}

// Функция-обработчик вебхуков
func webhookHandler(bot *tgBotApi.BotAPI, logger *logging.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Ошибка чтения запроса", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		update := tgBotApi.Update{}
		if err := json.Unmarshal(body, &update); err != nil {
			http.Error(w, "Ошибка обработки JSON", http.StatusBadRequest)
			return
		}

		handleUpdate(bot, update, logger)
	})
}

// Обработчик обновлений от Telegram
func handleUpdate(bot *tgBotApi.BotAPI, update tgBotApi.Update, logger *logging.Logger) {
	if update.Message == nil {
		return
	}

	chatID := update.Message.Chat.ID
	text := update.Message.Text

	logger.Infof("Сообщение от %s: %s", update.Message.From.UserName, text)

	switch text {
	case "/start":
		bot.Send(tgBotApi.NewMessage(chatID, "Привет! Я бот для водителей. Ожидайте заказы."))
	default:
		bot.Send(tgBotApi.NewMessage(chatID, "Команда не распознана."))
	}
}
