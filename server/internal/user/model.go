package user

type User struct {
	Id string `json:"id"`
	Username string `json:"username"`
	UserRole string `json:"user_role"`
	TelegramId string `json:"telegram_id"`
}