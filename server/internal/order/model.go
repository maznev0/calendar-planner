package order

type Order struct {
	Id 		    string    `json:"id" binding:"required"`
	Date 	    string 	  `json:"order_date" binding:"required"`
	Address     string    `json:"order_address" binding:"required"`
	PhoneNumber string    `json:"phone_number" binding:"required"`
	Meters 		float32   `json:"meters" binding:"required"`
	Price 		int       `json:"price" binding:"required"`
	DriverId 	string    `json:"driver_id"`
	Drivername 	string    `json:"drivername"`
	CarColor    string    `json:"car_color"`
	ChatId      int64     `json:"chat_id" binding:"required"`
	Note 	    string    `json:"note"`
	OrderState  string    `json:"order_state" binding:"required"`
}

type Payments struct {
	TotalPrice  int `json:"total_price" binding:"required"`
	DriverPrice int `json:"driver_price" binding:"required"`
	OtherPrice  int `json:"other_price" binding:"required"`
	Polish 		int `json:"polish" binding:"required"`
}

type Worker struct {
	WorkerId      string `json:"worker_id" binding:"required"`
	Workername 	  string `json:"workername" binding:"required"`
	WorkerPayment int    `json:"worker_payment"`
}

type OrderWithDetails struct {
	Id           string    `json:"id"`
	Date         string    `json:"order_date"`
	Address      string    `json:"order_address"`
	PhoneNumber  string    `json:"phone_number"`
	Meters       float32   `json:"meters"`
	Price        int       `json:"price"`
	DriverName   string    `json:"driver_name"`
	CarColor     string    `json:"car_color"`
	OrderState   string    `json:"order_state"`
	WorkerNames  []string  `json:"worker_names"`
}

type Date struct {
	Date 		   string    `json:"date"`
	OrdersQuantity int 	     `json:"orders_quantity"`
}