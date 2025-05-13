test-b:
	docker compose exec backend go test $(ARGS) ./tests/...

test-f:
	docker compose exec frontend bun test

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build 

prod:
	docker compose -f docker-compose.yml up --build 

temp: 
	docker compose exec backend go test $(ARGS) ./tests/temp_test.go ./tests/test_helpers.go 