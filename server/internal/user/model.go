package user

type User struct {
	Id 		   string `json:"id"`
	Username   string `json:"username"`
	UserRole   string `json:"user_role"`
	CarColor   string `json:"car_color,omitempty"`
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

type DriversWithoutCar struct {
	Id       string `json:"id"`
	Username string `json:"username"`
}