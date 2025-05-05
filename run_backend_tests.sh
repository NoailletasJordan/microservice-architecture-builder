#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Start the local database in the background
docker-compose up -d db_local

# Wait for the database to be ready
until docker exec postgres pg_isready -U postgres; do
  echo "Waiting for db_local to be ready..."
  sleep 1
done

# Run backend tests (assuming from the backend directory)
cd backend
go test ./tests/...
cd ..

# Bring down the database container after tests complete
docker-compose down 