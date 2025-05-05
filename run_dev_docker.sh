#!/bin/bash
# This script runs Docker Compose with development overrides.

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build 