# Redis

## Requirements

- [Docker Compose](https://docs.docker.com/compose/)

## Setup

- `docker compose up -d`
- `docker compose down`

## Run in Redis

- `redis-cli`
- `SUBSCRIBE job_applicant_score`

## Run in Node

- `curl -X POST 'http://localhost:3000/jobs/init'`
- `curl -X POST 'http://localhost:3000/jobs/import'`
- `curl -X GET 'http://localhost:3000/jobs/search?title='`
