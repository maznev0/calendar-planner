package telegram

type OrderPayload struct {
	Order struct {
		OrderId      string `json:"id"`
		DriverId     string `json:"driver_id"`
		OrderDate    string `json:"order_date"`
		OrderAddress string `json:"order_address"`
		PhoneNumber  string `json:"phone_number"`
		Meters       int    `json:"meters"`
		Price        int    `json:"price"`
		ChatId       int64  `json:"chat_id"`
		Note         string `json:"note"`
	} `json:"order"`
	Workers []struct {
		WorkerName string `json:"workername"`
		WorkerId   string `json:"worker_id"`
	} `json:"workers"`
}

type Payment struct {
	OrderId string `json:"order_id"`
    DriverId string `json:"driver_id"`
	TotalPrice int `json:"total_price"`
	DriverPrice int `json:"driver_price"`
	OtherPrice int `json:"other_price"`
	Polish int `json:"polish"`
	WorkersPayments []Worker `json:"workers_payments"`
}

type Worker struct {
	WorkerId string `json:"worker_id"`
	WorkerPayment int `json:"worker_payment"`
}