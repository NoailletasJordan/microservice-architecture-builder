test:
	cd backend && go test -v ./tests/...

dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build 

prod:
	docker-compose -f docker-compose.yml up --build 