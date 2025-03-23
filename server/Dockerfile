FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/app ./cmd/app/main.go
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/bot ./cmd/bot/main.go

FROM alpine:latest  


RUN apk add go && go install github.com/nats-io/nats-server/v2@main
WORKDIR /root/go/bin/
RUN ./nats-server & 

WORKDIR /app

COPY --from=builder /app/app /app/app
COPY --from=builder /app/bot /app/bot

COPY --from=builder /app/config.yml /app/config.yml

COPY .env /app/.env

ENTRYPOINT [ "/app/app", "&&", "/app/bot" ]
