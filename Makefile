test-backend:
	./run_backend_tests.sh 

run-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build 