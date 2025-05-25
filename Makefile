test-b:
	docker compose exec backend go test $(ARGS) ./tests/...

test-f:
	cd frontend && npx playwright test ./...

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build 

prod:
	docker compose -f docker-compose.yml up --build 

temp: 
	docker compose exec backend go test $(ARGS) ./tests/temp_test.go ./tests/test_helpers.go 

docs-backend:
	cd backend && ~/go/bin/swag init --output docs 