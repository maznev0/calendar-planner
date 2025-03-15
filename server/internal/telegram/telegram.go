package telegram

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"server/pkg/logging"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/nats-io/nats.go"
)

var orderCalcState = make(map[int64]string) // key: chatID, value: orderID

// OrderPayload — структура заказа
type OrderPayload struct {
	Order struct {
		OrderID      string `json:"order_id"`
		OrderDate    string `json:"order_date"`
		OrderAddress string `json:"order_address"`
		PhoneNumber  string `json:"phone_number"`
		Meters       int    `json:"meters"`
		Price        int    `json:"price"`
		ChatID       int64  `json:"chat_id"`
		Note         string `json:"note"`
	} `json:"order"`
	Workers []struct {
		WorkerName string `json:"workername"`
		WorkerID   string `json:"worker_id"`
	} `json:"workers"`
}

// StartTelegramBot запускает бота с вебхуком и подпиской на NATS
func StartTelegramBot(bot *tgBotApi.BotAPI, logger *logging.Logger, nc *nats.Conn) error {
	webhookURL := os.Getenv("WEBHOOK_URL")
	if webhookURL == "" {
		logger.Fatal("WEBHOOK_URL не задан")
		return fmt.Errorf("WEBHOOK_URL не задан")
	}

	// Удаляем старый вебхук
	_, err := bot.Request(tgBotApi.DeleteWebhookConfig{})
	if err != nil {
    	logger.Errorf("Ошибка удаления вебхука: %v", err)
    	return err
	}

	// Устанавливаем новый вебхук
	webhookConfig, err := tgBotApi.NewWebhook(webhookURL)
	if err != nil {
		logger.Errorf("Ошибка создания вебхука: %v", err)
		return err
	}

	_, err = bot.Request(webhookConfig)
	if err != nil {
		logger.Fatalf("Ошибка установки вебхука: %v", err)
		return err
	}

	// Обработчик вебхуков
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close() // Закрываем тело запроса

		bytes, err := io.ReadAll(r.Body)
		if err != nil {
			logger.Errorf("Ошибка чтения тела запроса: %v", err)
			http.Error(w, "Ошибка чтения тела", http.StatusBadRequest)
			return
		}

		var update tgBotApi.Update
		if err := json.Unmarshal(bytes, &update); err != nil {
			logger.Errorf("Ошибка парсинга JSON: %v", err)
			http.Error(w, "Ошибка парсинга JSON", http.StatusBadRequest)
			return
		}

		logger.Infof("Получено обновление: %+v", update)
		handleUpdate(bot, update, logger)
	})

	// Запускаем веб-сервер для Telegram
	go func() {
		logger.Info("Запуск HTTP-сервера для вебхуков на порту 8081")
		if err := http.ListenAndServe(":8081", nil); err != nil {
			logger.Fatalf("Ошибка запуска сервера: %v", err)
		}
	}()

	// Подписка на NATS
	_, err = nc.Subscribe("new_order", func(msg *nats.Msg) {
		var order OrderPayload
		if err := json.Unmarshal(msg.Data, &order); err != nil {
			logger.Errorf("Ошибка парсинга заказа: %v", err)
			return
		}

		var workerNames []string
		for _, worker := range order.Workers {
			workerNames = append(workerNames, worker.WorkerName)
		}

		workersInfo := "Нет рабочих"
		if len(workerNames) > 0 {
			workersInfo = strings.Join(workerNames, ", ")
		}

		messageText := fmt.Sprintf(
			"🚖 Новый заказ!\n📅 Дата: %s\n📍 Адрес: %s\n📞 Телефон: %s\n📏 Площадь: %d М²\n💰 Цена: %d руб.\n📝 Примечание: %s\n👷‍♂️ Рабочие: %s",
			order.Order.OrderDate, order.Order.OrderAddress, order.Order.PhoneNumber,
			order.Order.Meters, order.Order.Price, order.Order.Note, workersInfo,
		)

		chatID := order.Order.ChatID
		if chatID == 0 {
			logger.Error("Ошибка: у заказа нет chat_id")
			return
		}

		buttons := tgBotApi.NewInlineKeyboardMarkup(
			tgBotApi.NewInlineKeyboardRow(
				tgBotApi.NewInlineKeyboardButtonData("💵 Заполнить расчет", fmt.Sprintf("fill_calc:%s", order.Order.OrderID)),
			),
		)

		// Отправляем сообщение с кнопкой
		msgToSend := tgBotApi.NewMessage(chatID, messageText)
		msgToSend.ReplyMarkup = buttons

		if _, err := bot.Send(msgToSend); err != nil {
			logger.Errorf("Ошибка отправки сообщения в Telegram: %v", err)
		} else {
			logger.Infof("Заказ отправлен в чат %d", chatID)
		}
	})

	if err != nil {
		logger.Fatalf("Ошибка подписки на NATS: %v", err)
		return err
	}

	logger.Info("Подписка на NATS: new_order")

	// Блокировка основного потока (ждем сигнала завершения)
	select {}
}

// handleUpdate обрабатывает входящие сообщения
func handleUpdate(bot *tgBotApi.BotAPI, update tgBotApi.Update, logger *logging.Logger) {
	if update.Message == nil || !update.Message.IsCommand() {
		return
	}

	userID := update.Message.From.ID
	chatID := update.Message.Chat.ID
	command := update.Message.Command()
	logger.Infof("Получена команда от user_id: %d, chat_id: %d: %s", userID, chatID, command)

	response := "Команда не распознана."
	switch command {
	case "start":
		response = "Привет! Я бот для водителей. Ожидайте заказы."
		logger.Infof("Новый водитель: chat_id %d, user_id %d", chatID, userID)
	}

	msg := tgBotApi.NewMessage(chatID, response)
	if _, err := bot.Send(msg); err != nil {
		logger.Errorf("Ошибка отправки сообщения: %v", err)
	}
}

func handleCallback(bot *tgBotApi.BotAPI, update tgBotApi.Update, logger *logging.Logger) {
	if update.CallbackQuery == nil {
		return
	}

	callbackData := update.CallbackQuery.Data
	chatID := update.CallbackQuery.Message.Chat.ID
	messageID := update.CallbackQuery.Message.MessageID

	parts := strings.Split(callbackData, ":")
	action, orderID := parts[0], parts[1]

	if action == "fill_calc" {
		// Сообщение с инструкцией
		msg := tgBotApi.NewMessage(chatID, "Введите данные в формате:\n*общая_стоимость водитель_забрал расходы литры_лака оплата_рабочим1,оплата_рабочим2,...*")
		msg.ParseMode = "Markdown"
		bot.Send(msg)

		// Сохраняем orderID, ждем ввод данных
		orderCalcState[chatID] = orderID

		// Удаляем кнопки под заказом
		editMsg := tgBotApi.NewEditMessageReplyMarkup(chatID, messageID, tgBotApi.NewInlineKeyboardMarkup())
		bot.Send(editMsg)
	}
}

func handleMessage(bot *tgBotApi.BotAPI, update tgBotApi.Update, logger *logging.Logger) {
	chatID := update.Message.Chat.ID
	text := update.Message.Text

	// Если водитель вводит расчет
	if orderID, ok := orderCalcState[chatID]; ok {
		delete(orderCalcState, chatID) // Убираем из ожидания ввода

		parts := strings.Split(text, " ")
		if len(parts) < 5 {
			bot.Send(tgBotApi.NewMessage(chatID, "Ошибка: Введите 5 значений через пробел."))
			return
		}

		// Парсим значения
		totalPrice, _ := strconv.Atoi(parts[0])
		driverPrice, _ := strconv.Atoi(parts[1])
		otherPrice, _ := strconv.Atoi(parts[2])
		lacquerLiters, _ := strconv.Atoi(parts[3])
		workerPayments := strings.Split(parts[4], ",")

		// Получаем список ID рабочих для заказа
		workerIDs := getWorkerIDsForOrder(orderID)
		if len(workerIDs) != len(workerPayments) {
			bot.Send(tgBotApi.NewMessage(chatID, "Ошибка: Количество выплат не совпадает с числом рабочих."))
			return
		}

		// Формируем JSON-запрос
		paymentData := map[string]interface{}{
			"order_id":     orderID,
			"total_price":  totalPrice,
			"driver_price": driverPrice,
			"other_price":  otherPrice,
			"lacquer_litres": lacquerLiters,
			"worker_payments": map[string]int{},
		}

		for i, workerID := range workerIDs {
			workerPayment, _ := strconv.Atoi(workerPayments[i])
			paymentData["worker_payments"].(map[string]int)[workerID] = workerPayment
		}

		// Отправляем данные на сервер
		err := sendPaymentData(paymentData)
		if err != nil {
			bot.Send(tgBotApi.NewMessage(chatID, "Ошибка отправки данных на сервер."))
			logger.Errorf("Ошибка отправки расчета: %v", err)
			return
		}

		bot.Send(tgBotApi.NewMessage(chatID, "✅ Расчет завершен, данные отправлены!"))
	}
}

// Функция для получения ID рабочих по заказу
func getWorkerIDsForOrder(orderID string) []string {
	// Здесь должен быть код запроса к БД, возвращающий worker_id для заказа
	// Пока что просто возвращаем пустой массив
	return []string{}
}

func sendPaymentData(paymentData map[string]interface{}) error {
	jsonData, err := json.Marshal(paymentData)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "http://localhost:10000/payments/update", strings.NewReader(string(jsonData)))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("Ошибка сервера: %s", string(body))
	}

		return nil
	}
// package telegram

// import (
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"net/http"
// 	"os"
// 	"strconv"
// 	"strings"
// 	"sync"

// 	"server/pkg/logging"

// 	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
// 	"github.com/nats-io/nats.go"
// )

// // OrderPayload — структура заказа
// type OrderPayload struct {
// 	Order struct {
// 		OrderID      string `json:"order_id"`
// 		OrderDate    string `json:"order_date"`
// 		OrderAddress string `json:"order_address"`
// 		PhoneNumber  string `json:"phone_number"`
// 		Meters       int    `json:"meters"`
// 		Price        int    `json:"price"`
// 		DriverID     string `json:"driver_id"`
// 		ChatID       int64  `json:"chat_id"`
// 		Note         string `json:"note"`
// 	} `json:"order"`
// 	Workers []struct {
// 		WorkerName string `json:"workername"`
// 		WorkerID   string `json:"worker_id"`
// 	} `json:"workers"`
// }

// // Структура для хранения состояния расчета
// type CalculationState struct {
// 	OrderID       string
// 	CurrentWorker int
// 	WorkerPayments map[string]int
// }

// var (
// 	userCalculations = make(map[int64]*CalculationState) // Храним состояние по chatID
// 	mu               sync.Mutex                          // Защита от гонки данных
// )

// // StartTelegramBot запускает бота с вебхуком и подпиской на NATS
// func StartTelegramBot(bot *tgBotApi.BotAPI, logger *logging.Logger, nc *nats.Conn) error {
// 	webhookURL := os.Getenv("WEBHOOK_URL")
// 	if webhookURL == "" {
// 		logger.Fatal("WEBHOOK_URL не задан")
// 		return fmt.Errorf("webhook URL не задан")
// 	}

// 	// Удаляем старый вебхук
// 	if _, err := bot.Request(tgBotApi.DeleteWebhookConfig{}); err != nil {
// 		logger.Errorf("Ошибка удаления вебхука: %v", err)
// 		return err
// 	}

// 	// Устанавливаем новый вебхук
// 	webhookConfig, err := tgBotApi.NewWebhook(webhookURL)
// 	if err != nil {
// 		logger.Errorf("Ошибка создания вебхука: %v", err)
// 		return err
// 	}

// 	if _, err = bot.Request(webhookConfig); err != nil {
// 		logger.Fatalf("Ошибка установки вебхука: %v", err)
// 		return err
// 	}

// 	// Обработчик вебхуков
// 	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
// 		defer r.Body.Close()

// 		bytes, err := io.ReadAll(r.Body)
// 		if err != nil {
// 			logger.Errorf("Ошибка чтения тела запроса: %v", err)
// 			http.Error(w, "Ошибка чтения тела", http.StatusBadRequest)
// 			return
// 		}

// 		if len(bytes) == 0 {
// 			logger.Warn("Пустое тело запроса")
// 			http.Error(w, "Пустой JSON", http.StatusBadRequest)
// 			return
// 		}

// 		var update tgBotApi.Update
// 		if err := json.Unmarshal(bytes, &update); err != nil {
// 			logger.Errorf("Ошибка парсинга JSON: %v", err)
// 			http.Error(w, "Ошибка парсинга JSON", http.StatusBadRequest)
// 			return
// 		}

// 		logger.Infof("Получено обновление: %+v", update)
// 		handleUpdate(bot, update)
// 	})

// 	// Запуск HTTP-сервера
// 	go func() {
// 		logger.Info("Запуск HTTP-сервера для вебхуков на порту 8081")
// 		if err := http.ListenAndServe(":8081", nil); err != nil {
// 			logger.Fatalf("Ошибка запуска сервера: %v", err)
// 		}
// 	}()

// 	// Подписка на NATS
// 	_, err = nc.Subscribe("new_order", func(msg *nats.Msg) {
// 		var order OrderPayload
// 		if err := json.Unmarshal(msg.Data, &order); err != nil {
// 			logger.Errorf("Ошибка парсинга заказа: %v", err)
// 			return
// 		}

// 		sendOrderNotification(bot, order)
// 	})

// 	if err != nil {
// 		logger.Fatalf("Ошибка подписки на NATS: %v", err)
// 		return err
// 	}

// 	logger.Info("Подписка на NATS: new_order")

// 	select {} // Ожидание завершения
// }

// // handleUpdate обрабатывает входящие команды и нажатия кнопок
// func handleUpdate(bot *tgBotApi.BotAPI, update tgBotApi.Update) {
// 	if update.CallbackQuery != nil {
// 		handleCallbackQuery(bot, update.CallbackQuery)
// 		return
// 	}

// 	if update.Message != nil {
// 		handleUserInput(bot, update.Message)
// 	}
// }

// // sendOrderNotification отправляет уведомление о новом заказе
// func sendOrderNotification(bot *tgBotApi.BotAPI, order OrderPayload) {
// 	chatID := order.Order.ChatID
// 	if chatID == 0 {
// 		return
// 	}

// 	workerNames := make([]string, len(order.Workers))
// 	for i, worker := range order.Workers {
// 		workerNames[i] = worker.WorkerName
// 	}

// 	workersInfo := "Нет рабочих"
// 	if len(workerNames) > 0 {
// 		workersInfo = strings.Join(workerNames, ", ")
// 	}

// 	messageText := fmt.Sprintf(
// 		"🚖 Новый заказ!\n📅 Дата: %s\n📍 Адрес: %s\n📞 Телефон: %s\n📏 Площадь: %d М²\n💰 Цена: %d руб.\n📝 Примечание: %s\n👷‍♂️ Рабочие: %s",
// 		order.Order.OrderDate, order.Order.OrderAddress, order.Order.PhoneNumber,
// 		order.Order.Meters, order.Order.Price, order.Order.Note, workersInfo,
// 	)

// 	buttons := tgBotApi.NewInlineKeyboardMarkup(
// 		tgBotApi.NewInlineKeyboardRow(
// 			tgBotApi.NewInlineKeyboardButtonData("💵 Заполнить расчет", fmt.Sprintf("fill_calc:%s", order.Order.OrderID)),
// 		),
// 	)

// 	msg := tgBotApi.NewMessage(chatID, messageText)
// 	msg.ReplyMarkup = buttons
// 	bot.Send(msg)
// }

// // handleCallbackQuery обрабатывает нажатия на inline-кнопки
// func handleCallbackQuery(bot *tgBotApi.BotAPI, query *tgBotApi.CallbackQuery) {
// 	data := strings.Split(query.Data, ":")
// 	if len(data) < 2 {
// 		return
// 	}

// 	action, orderID := data[0], data[1]
// 	chatID := query.Message.Chat.ID

// 	if action == "fill_calc" {
// 		mu.Lock()
// 		userCalculations[chatID] = &CalculationState{
// 			OrderID:       orderID,
// 			CurrentWorker: 0,
// 			WorkerPayments: make(map[string]int),
// 		}
// 		mu.Unlock()

// 		bot.Send(tgBotApi.NewMessage(chatID, "Введите сумму для первого рабочего:"))
// 	}
// }

// // handleUserInput обрабатывает ввод пользователя (суммы выплат)
// func handleUserInput(bot *tgBotApi.BotAPI, msg *tgBotApi.Message) {
// 	chatID := msg.Chat.ID
// 	mu.Lock()
// 	state, exists := userCalculations[chatID]
// 	mu.Unlock()

// 	if !exists || state == nil {
// 		return
// 	}

// 	// Получаем текущего рабочего
// 	if state.CurrentWorker >= len(state.WorkerPayments) {
// 		bot.Send(tgBotApi.NewMessage(chatID, "✅ Все выплаты записаны!"))
// 		mu.Lock()
// 		delete(userCalculations, chatID)
// 		mu.Unlock()
// 		return
// 	}

// 	// Проверяем ввод "Готово"
// 	if strings.ToLower(msg.Text) == "готово" {
// 		bot.Send(tgBotApi.NewMessage(chatID, "✅ Все выплаты записаны!"))
// 		mu.Lock()
// 		delete(userCalculations, chatID)
// 		mu.Unlock()
// 		return
// 	}

// 	// Парсим сумму выплаты
// 	payment, err := strconv.Atoi(msg.Text)
// 	if err != nil {
// 		bot.Send(tgBotApi.NewMessage(chatID, "Введите число (сумма выплаты):"))
// 		return
// 	}

// 	// Сохраняем выплату
// 	workerID := state.OrderID // Пример (лучше использовать ID рабочего)
// 	state.WorkerPayments[workerID] = payment

// 	// Переход к следующему рабочему
// 	state.CurrentWorker++

// 	// Проверяем, есть ли еще рабочие
// 	if state.CurrentWorker >= len(state.WorkerPayments) {
// 		bot.Send(tgBotApi.NewMessage(chatID, "✅ Все выплаты записаны!"))
// 		mu.Lock()
// 		delete(userCalculations, chatID)
// 		mu.Unlock()
// 		return
// 	}

// 	// Спрашиваем следующего рабочего
// 	bot.Send(tgBotApi.NewMessage(chatID, "Выплата записана. Введите сумму следующему рабочему или напишите 'Готово'."))
// }
