# Start from the latest official Golang image as a build stage
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY ./backend .
RUN go mod download
RUN go build -o backend main.go

# Start a minimal image for running
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/data ./data
EXPOSE 8080
CMD ["./backend"] 