package payments

type Payments struct {
	OrderId string `json:"order_id" binding:"required"`
	DriverId string `json:"driver_id" binding:"required"`
	TotalPrice int `json:"total_price" binding:"required"`
	DriverPrice int `json:"driver_price" binding:"required"`
	OtherPrice int `json:"other_price" binding:"required"`
}