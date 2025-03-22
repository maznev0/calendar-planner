package telegram

import (
	"fmt"
	"regexp"
	"server/pkg/logging"
	"strconv"
	"strings"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

var orderCalcState = make(map[int64]string)      // key: chatID, value: orderId|driverId
var orderDriverMap = make(map[string]string)     // key: orderId, value: driverId
var orderWorkersMap = make(map[string][]string)  // key: orderId, value: []workerId

func handleNewOrder(order OrderPayload, logger *logging.Logger) {
    orderId := order.Order.OrderId
    driverId := order.Order.DriverId

    orderDriverMap[orderId] = driverId
    var workerIDs []string
    for _, worker := range order.Workers {
        workerIDs = append(workerIDs, worker.WorkerId)
    }
    orderWorkersMap[orderId] = workerIDs

    logger.Infof("Добавлены рабочие для заказа %s: %v", orderId, workerIDs)
}

func handleCallback(bot *tgBotApi.BotAPI, update tgBotApi.Update, logger *logging.Logger) {
    callbackData := update.CallbackQuery.Data
    chatId := update.CallbackQuery.Message.Chat.ID
    messageId := update.CallbackQuery.Message.MessageID

    parts := strings.Split(callbackData, ":")
    if len(parts) < 2 {
        logger.Warnf("Некорректный формат callbackData: %s", callbackData)
        return
    }

    action, orderId := parts[0], parts[1]

    if action == "fill_calc" {
        driverId, ok := orderDriverMap[orderId]
        if !ok {
            bot.Send(tgBotApi.NewMessage(chatId, "Ошибка: Не найден driver_id для заказа."))
            return
        }

        orderCalcState[chatId] = fmt.Sprintf("%s|%s", orderId, driverId)
        logger.Infof("Заказ %s (driver_id: %s) привязан к chat_id %d", orderId, driverId, chatId)

		msg := tgBotApi.NewMessage(chatId, "Заполните форму расчета\\.\n\nДля этого нажмите на текст ниже, чтобы его скопировать, и вставьте его в поле ввода сообщения и отформатируйте нужные поля\\.\n\n```\nОбщий расчет: \nЗарплата исполнителям: \nДоставка: \nМетраж: \nЦена за метр: \nКоличество лака: 0\nРасходы: 0```")
        msg.ParseMode = "MarkdownV2"
        bot.Send(msg)

        editMsg := tgBotApi.NewEditMessageText(chatId, messageId, update.CallbackQuery.Message.Text)
        bot.Send(editMsg)
    }
}

func handleMessage(bot *tgBotApi.BotAPI, update tgBotApi.Update, logger *logging.Logger) {
    chatId := update.Message.Chat.ID
    text := update.Message.Text

    data, ok := orderCalcState[chatId]
    if !ok {
        bot.Send(tgBotApi.NewMessage(chatId, "Ожидайте"))
        return
    }

    partsData := strings.Split(data, "|")
    if len(partsData) != 2 {
        bot.Send(tgBotApi.NewMessage(chatId, "Ошибка: Некорректные данные заказа."))
        return
    }

    orderId := partsData[0]
    driverId := partsData[1]

    workerIDs := orderWorkersMap[orderId]
    logger.Infof("Рабочие для заказа %s: %v", orderId, workerIDs)

    lines := strings.Split(text, "\n")
    if len(lines) < 7 {
        bot.Send(tgBotApi.NewMessage(chatId, "Ошибка: Введите все 7 строк данных."))
        return
    }

    workerPaymentsStr := strings.TrimPrefix(lines[1], "Зарплата исполнителям: ")
    workerPaymentsStr = strings.TrimSpace(workerPaymentsStr)

    var workersPayments []Worker
    if len(workerIDs) > 0 {
        if strings.Contains(workerPaymentsStr, ",") {
            workerPayments := strings.Split(workerPaymentsStr, ",")
            if len(workerIDs) != len(workerPayments) {
                bot.Send(tgBotApi.NewMessage(chatId, "Ошибка: Количество выплат не совпадает с числом рабочих."))
                return
            }

            for i, workerID := range workerIDs {
                payment, err := strconv.Atoi(strings.TrimSpace(workerPayments[i]))
                if err != nil {
                    bot.Send(tgBotApi.NewMessage(chatId, "Ошибка: Некорректный формат выплат."))
                    return
                }
                workersPayments = append(workersPayments, Worker{WorkerId: workerID, WorkerPayment: payment})
            }
        } else {
            totalPayment, err := strconv.Atoi(workerPaymentsStr)
            if err != nil {
                bot.Send(tgBotApi.NewMessage(chatId, "Ошибка: Некорректный формат выплат."))
                return
            }
            perWorkerPayment := totalPayment / len(workerIDs)
            for _, workerID := range workerIDs {
                workersPayments = append(workersPayments, Worker{WorkerId: workerID, WorkerPayment: perWorkerPayment})
            }
        }
    }

    paymentData := Payment{
        OrderId:        orderId,
        DriverId:       driverId,
        TotalPrice:     parseInt(lines[0], "Общий расчет: "),
        DriverPrice:    parseInt(lines[2], "Доставка: "),
        Meters:         parseFloat(lines[3], "Метраж: "),
        Price:          parseInt(lines[4], "Цена за метр: "),
        Polish:         parseInt(lines[5], "Количество лака: "),
        OtherPrice:     parseInt(lines[6], "Расходы: "),
        WorkersPayments: workersPayments,
    }

    if err := sendPaymentData(paymentData); err != nil {
        bot.Send(tgBotApi.NewMessage(chatId, "Ошибка отправки данных на сервер."))
        return
    }

    delete(orderCalcState, chatId)
    bot.Send(tgBotApi.NewMessage(chatId, "✅ Расчет завершен, данные отправлены!"))
}

func handleUpdate(bot *tgBotApi.BotAPI, update tgBotApi.Update, logger *logging.Logger) {
    if update.CallbackQuery != nil {
        handleCallback(bot, update, logger)
    } else if update.Message != nil {
        handleMessage(bot, update, logger)
    } else {
        logger.Warn("Получен неизвестный тип обновления от Telegram")
    }
}

func parseInt(line, prefix string) int {
    trimmed := strings.TrimPrefix(line, prefix)
    trimmed = strings.TrimSpace(trimmed)

    re := regexp.MustCompile(`\d+`)
    match := re.FindString(trimmed) 
    num, _ := strconv.Atoi(match)
    return num
}

func parseFloat(line, prefix string) float32 {
    trimmed := strings.TrimPrefix(line, prefix)
    trimmed = strings.TrimSpace(trimmed)

    re := regexp.MustCompile(`\d+(\.\d+)?`)
    match := re.FindString(trimmed)
    value, _ := strconv.ParseFloat(match, 32)
    return float32(value)
}