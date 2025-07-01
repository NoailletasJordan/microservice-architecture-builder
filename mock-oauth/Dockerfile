FROM golang:1.24.2-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o mock-oauth .

EXPOSE 6008

CMD ["./mock-oauth"]
