package order

type Order struct {
	Id string `json:"id" binding:"required"`
	Date string `json:"order_date" binding:"required"`
	Address string `json:"order_address" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
	Meters float32 `json:"meters" binding:"required"`
	Price int `json:"price" binding:"required"`
	DriverId string `json:"driver_id"`
	Note string `json:"note"`
	OrderState string `json:"order_state" binding:"required"`
}