package utils

type Date struct {
	Date string `json: "date"`
	OrdersQuantity int `json: "orders_quantity"`
}

func NewDate(date string, ordersQuantity int) Date {
	return Date{
		Date: date,
		OrdersQuantity: ordersQuantity,
	}
}