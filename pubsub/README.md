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

- `curl -X POST 'http://localhost:3000/v1/jobs/1/apply'`
- `curl -X GET 'http://localhost:3000/v1/jobs/1/applicants/d837f173-239c-4e41-856b-9cdca7804d68'`
- `curl -X POST 'http://localhost:3000/v2/jobs/1/apply'`
