package car

type Car struct {
	DriverId   string `json:"driver_id" binding:"required"`
	Color      string `json:"color" binding:"required"`
	Carname    string `json:"carname" binding:"required"`
	ChatId     int64  `json:"chat_id" binding:"required"`
}