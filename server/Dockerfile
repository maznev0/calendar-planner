FROM golang:1.24-alpine AS builder

WORKDIR /app

# Копируем go.mod и go.sum и скачиваем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем весь код
COPY . .

# Собираем бинарник под Linux amd64 (обычные серверы и ПК)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/app ./cmd/app/main.go
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/bot ./cmd/bot/main.go

# Финальный образ без Go
FROM alpine:latest  

WORKDIR /app

# Копируем собранные бинарники
COPY --from=builder /app/app /app/app
COPY --from=builder /app/bot /app/bot

# Копируем конфиг, если он есть
COPY --from=builder /app/config.yml /app/config.yml

ENTRYPOINT [ "/app/app" ]
