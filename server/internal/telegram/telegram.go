package telegram

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"server/pkg/logging"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/nats-io/nats.go"
)

func StartTelegramBot(bot *tgBotApi.BotAPI, logger *logging.Logger, nc *nats.Conn) error {
    webhookURL := os.Getenv("WEBHOOK_URL")
    if webhookURL == "" {
        logger.Fatal("WEBHOOK_URL not exist")
        return fmt.Errorf("WEBHOOK_URL not exist")
    }

    _, err := bot.Request(tgBotApi.DeleteWebhookConfig{})
    if err != nil {
        logger.Errorf("Failed to delete webhook: %v", err)
        return err
    }

    webhookConfig, err := tgBotApi.NewWebhook(webhookURL)
    if err != nil {
        logger.Errorf("Failed to create webhook: %v", err)
        return err
    }

    _, err = bot.Request(webhookConfig)
    if err != nil {
        logger.Fatalf("Failed to set webhook: %v", err)
        return err
    }

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        defer r.Body.Close()

        bytes, err := io.ReadAll(r.Body)
        if err != nil {
            logger.Errorf("Failed to read request: %v", err)
            http.Error(w, "Failed to read request", http.StatusBadRequest)
            return
        }

        var update tgBotApi.Update
        if err := json.Unmarshal(bytes, &update); err != nil {
            logger.Errorf("Failed to parse JSON: %v", err)
            http.Error(w, "Failed to parse JSON", http.StatusBadRequest)
            return
        }

        logger.Infof("UPDATE: %+v", update)
        handleUpdate(bot, update, logger)
    })

    go func() {
        _, err := nc.Subscribe("new_order", func(msg *nats.Msg) {
            var order OrderPayload
            if err := json.Unmarshal(msg.Data, &order); err != nil {
                logger.Errorf("Failed to parse order: %v", err)
                return
            }
    
            // Обрабатываем новый заказ
            handleNewOrder(order, logger)
    
            orderId := order.Order.OrderId
            driverId := order.Order.DriverId
            if orderId == "" || driverId == "" {
                logger.Errorf("Missing orderId or driverId: %+v", order)
                return
            }
    
            orderDriverMap[orderId] = driverId
    
            workersInfo := "Нет рабочих"
            if len(order.Workers) > 0 {
                workerNames := []string{}
                for _, worker := range order.Workers {
                    workerNames = append(workerNames, worker.WorkerName)
                }
                workersInfo = strings.Join(workerNames, ", ")
            }
    
            messageText := fmt.Sprintf(
                "🚖 Новый заказ!\n📅 Дата: %s\n📍 Адрес: %s\n📞 Телефон: %s\n📏 Площадь: %d М²\n💰 Цена: %d руб.\n👷‍♂️ Исполнители: %s\n📝 Примечание: %s\n",
                order.Order.OrderDate, order.Order.OrderAddress, order.Order.PhoneNumber,
                order.Order.Meters, order.Order.Price, workersInfo, order.Order.Note,
            )
    
            chatID := order.Order.ChatId
            if chatID == 0 {
                logger.Error("Error: empty chat_id in order")
                return
            }
    
            buttons := tgBotApi.NewInlineKeyboardMarkup(
                tgBotApi.NewInlineKeyboardRow(
                    tgBotApi.NewInlineKeyboardButtonData("💵 Заполнить расчет", fmt.Sprintf("fill_calc:%s", orderId)),
                ),
            )
    
            msgToSend := tgBotApi.NewMessage(chatID, messageText)
            msgToSend.ReplyMarkup = buttons
    
            if _, err := bot.Send(msgToSend); err != nil {
                logger.Errorf("Failed to send message in Telegram: %v", err)
            } else {
                logger.Infof("Order sent to chat with id: %d", chatID)
            }
        })
    
        if err != nil {
            logger.Fatalf("Subscribe error on NATS: %v", err)
        }
        logger.Info("Subscribed to NATS: new_order")
    }()

    return nil
}