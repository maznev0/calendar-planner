### FOR RUN 'SERVER'

linux x86_64 ---> `.bin/server-linux-amd64`

linux arm ---> `.bin/server-linux-arm64`

apple silicon ---> `.bin/server-darwin-arm64`

### FOR RUN 'CLIENT'

npx expo start

1. Stop()
2. Docker with Postgres
3. Connection Pool
4. func Retry()
5. Deploy DB
6. Hosting
7. Reading from .env and .yaml, check config.go

orders:

1. GetByDates(ctx context.Context, dates []string) []Date, error

   type Date struct {
   date string
   orders_quantity int
   }

2. GetByDate(ctx context.Context, date string) []Orders, []Workers, error
