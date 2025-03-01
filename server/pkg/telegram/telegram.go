package telegram

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"server/pkg/logging"

	tgBotApi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type UserState struct {
	Step      string
	Username  string
	UserRole  string
	TgUsername string
}

func StartTelegramBot(bot *tgBotApi.BotAPI, logger *logging.Logger) {
	u := tgBotApi.NewUpdate(0)
	u.Timeout = 60
	updates := bot.GetUpdatesChan(u)

	// Храним состояния пользователей
	userStates := make(map[int64]UserState)

	for update := range updates {
		if update.Message == nil {
			continue
		}

		chatID := update.Message.Chat.ID
		text := update.Message.Text

		logger.Infof("Message from %s: %s", update.Message.From.UserName, text)

		switch text {
		case "/start":
			sendMainMenu(bot, chatID)

		case "/users", "Пользователи 👨‍💻":
			sendUsersList(bot, chatID, logger)

		case "/adduser", "Создать 👨‍💻":
			msg := tgBotApi.NewMessage(chatID, "Введите имя пользователя:")
			bot.Send(msg)
			userStates[chatID] = UserState{Step: "waiting_for_username"}

		default:
			handleUserInput(bot, chatID, text, userStates, logger)
		}
	}
}

func sendMainMenu(bot *tgBotApi.BotAPI, chatID int64) {
	msg := tgBotApi.NewMessage(chatID, "Выберите действие:")

	keyboard := tgBotApi.NewReplyKeyboard(
		tgBotApi.NewKeyboardButtonRow(
			tgBotApi.NewKeyboardButton("Пользователи 👨‍💻"),
			tgBotApi.NewKeyboardButton("Создать 👨‍💻"),
			tgBotApi.NewKeyboardButton("Удалить 👨‍💻"),

		),
		tgBotApi.NewKeyboardButtonRow(
			tgBotApi.NewKeyboardButton("Cоздать 🚛"),
			tgBotApi.NewKeyboardButton("Удалить 🚛"),
			tgBotApi.NewKeyboardButton("Пересадить 👨‍💻🚛"),
		),
	)

	msg.ReplyMarkup = keyboard
	bot.Send(msg)
}

func sendUsersList(bot *tgBotApi.BotAPI, chatID int64, logger *logging.Logger) {
	resp, err := http.Get("http://localhost:10000/users/all")
	if err != nil {
		logger.Errorf("Ошибка запроса к API: %v", err)
		bot.Send(tgBotApi.NewMessage(chatID, "Ошибка получения списка пользователей."))
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bot.Send(tgBotApi.NewMessage(chatID, "Не удалось получить список пользователей."))
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.Errorf("Ошибка чтения ответа: %v", err)
		bot.Send(tgBotApi.NewMessage(chatID, "Ошибка обработки данных."))
		return
	}

	msg := tgBotApi.NewMessage(chatID, fmt.Sprintf("Список пользователей:\n%s", string(body)))
	bot.Send(msg)
}

func createUser(username, role, telegramID string, logger *logging.Logger) error {
	url := "http://localhost:10000/users"

	userData := map[string]string{
		"username":    username,
		"user_role":   role,
		"telegram_id": telegramID, // исправлено
	}

	jsonData, err := json.Marshal(userData)
	if err != nil {
		return err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		logger.Errorf("Ошибка при запросе к API: %v", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		logger.Errorf("Ошибка API: статус %d", resp.StatusCode)
		return fmt.Errorf("API вернул статус %d", resp.StatusCode)
	}

	return nil
}

func handleUserInput(bot *tgBotApi.BotAPI, chatID int64, text string, userStates map[int64]UserState, logger *logging.Logger) {
	state, exists := userStates[chatID]
	if !exists {
		bot.Send(tgBotApi.NewMessage(chatID, "Введите команду из меню."))
		return
	}

	switch state.Step {
		case "waiting_for_username":
			state.Username = text
			state.Step = "waiting_for_role"
			userStates[chatID] = state // Обновляем состояние
			bot.Send(tgBotApi.NewMessage(chatID, "Теперь введите роль пользователя (admin, driver, worker):"))

		case "waiting_for_role":
			state.UserRole = text
			state.Step = "waiting_for_tg_username"
			userStates[chatID] = state // Обновляем состояние
			bot.Send(tgBotApi.NewMessage(chatID, "Теперь введите @username пользователя:"))

		
		case "waiting_for_tg_username":
			state.TgUsername = text
			
			// Отправляем данные в API
			err := createUser(state.Username, state.UserRole, fmt.Sprintf("%d", chatID), logger)
			if err != nil {
			bot.Send(tgBotApi.NewMessage(chatID, "Ошибка при создании пользователя."))
			} else {
				bot.Send(tgBotApi.NewMessage(chatID, "✅ Пользователь успешно создан!"))
			}

			// Удаляем состояние
			delete(userStates, chatID)


		default:
			bot.Send(tgBotApi.NewMessage(chatID, "Введите команду из меню."))
	}
}
