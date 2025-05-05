test:
	cd backend && go test -v ./tests/...

run-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build 