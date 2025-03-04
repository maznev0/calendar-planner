### FOR RUN 'SERVER'

linux x86_64 ---> `.bin/server-linux-amd64`

apple silicon ---> `.bin/server-darwin-arm64`

# OR

write in command line `go run cmd/app/main.go`

### FOR RUN 'CLIENT'

`npx expo start`

orders:

1. Количество заказов в определенный день в рамках промежутка, используется для календаря и главной страницы

# GetQuantityByDates(ctx context.Context, startDate, endDate string) ([]Date, error)

type Date struct {
Date string `json:"date"`
OrdersQuantity int `json:"orders_quantity"`

### request:

GET http://localhost:10000/orders/days?start=YYYY-MM-DD&end=YYYY-MM-DD

# response:

[
{
"date": "2025-02-28",
"orders_quantity": 1
},
{
"date": "2025-03-01",
"orders_quantity": 2
}
]

2. Используется для перехода из главной страницы на страницу с определенной датой, также должна использоваться в календаре при нажатии на кнопку "СЕГОДНЯ"

# GetByDate(ctx context.Context, date string) ([]OrdersWithDetails, error)

type OrderWithDetails struct {
Id string `json:"id"`
Date string `json:"order_date"`
Address string `json:"order_address"`
PhoneNumber string `json:"phone_number"`
Meters float32 `json:"meters"`
Price int `json:"price"`
DriverName string `json:"driver_name"`

# CarColor string `json:"car_color"` (!)требует правки в коде

    OrderState   string    `json:"order_state"`
    WorkerNames  []string  `json:"worker_names"`

}

# request:

GET http://localhost:10000/orders/day?date=YYYY-MM-DD

# response:

[
{
"id": "3a0daaa8-c0ce-4f09-a3a2-a4387dedb18e",
"order_date": "2025-02-28",
"order_address": "Притыцкого 143-78",
"phone_number": "+375297654321",
"meters": 23.7,
"price": 60,
"driver_name": "Дмитрий",

# "car_color": "#FFFFFF"

        "order_state": "Готов",
        "worker_names": [
            "Вадим",
            "Николай"
        ]
      },

      ...

]
