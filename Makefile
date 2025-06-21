test-b:
	cd backend && go test $(ARGS) ./tests/...

test-f:
	cd frontend && npx playwright test $(ARGS) ./...

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build 

prod:
	docker compose -f docker-compose.yml up -d --wait --wait-timeout 100 --build 

temp: 
	docker compose exec backend go test $(ARGS) ./tests/temp_test.go ./tests/test_helpers.go 

docs-backend:
	cd backend && ~/go/bin/swag init --output docs 

install:
	@echo "🔧 Installing frontend dependencies..."
	cd frontend && bun install

	@echo "🔧 Installing backend dependencies..."
	cd backend && go mod download