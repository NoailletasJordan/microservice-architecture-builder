# Stage 1: Builder stage
FROM golang:1.24.2-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o backend main.go

# Stage 2: Development stage with hot reload
FROM golang:1.24.2-alpine AS dev
WORKDIR /app
RUN go install github.com/air-verse/air@latest
COPY go.mod go.sum ./
RUN go mod download
COPY . .
EXPOSE 6006
CMD ["air", "-c", ".air.toml"]

# Stage 3: Production stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/backend ./toExecute
EXPOSE 6006
RUN chmod +x ./toExecute
CMD ["./toExecute"]