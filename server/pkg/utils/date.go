package utils

type Date struct {
	date string
	orders_quantity int
}

func NewDate(date string, orders_quantity int) Date {
	return Date{
		date: date,
		orders_quantity: orders_quantity,
	}
}