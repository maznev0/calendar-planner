package user

type User struct {
	Id 		   string `json:"id"`
	Username   string `json:"username"`
	UserRole   string `json:"user_role"`
	TelegramId string `json:"telegram_id"`
}

type Drivers struct {
	Id 		      string `json:"id"`
	Username      string `json:"username"`
	UserRole      string `json:"user_role"`
	СarColor      string `json:"car_color"`
	OrderQuantity int `json:"order_quantity"`
}

type Workers struct {
	Id 		 string `json:"id"`
	Username string `json:"username"`
	UserRole string `json:"user_role"`
}