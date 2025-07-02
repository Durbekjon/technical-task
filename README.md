# Dockerized NestJS Backend

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Quick Start

1. **Build and start the services:**

   ```sh
   docker-compose up --build
   ```

   This will start both the PostgreSQL database and the NestJS backend.

2. **Run Prisma migrations (in a separate terminal):**

   ```sh
   docker-compose exec backend npx prisma migrate deploy
   ```

3. **Access the API:**
   The backend will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

- The backend uses the `DATABASE_URL` environment variable, set in `docker-compose.yml` for Docker and in `.env` for local development.

## Stopping the services

```sh
docker-compose down
```

## Notes

- The database data is persisted in a Docker volume (`db_data`).
- For development, you may want to mount your local code as a volume for hot-reloading (adjust `docker-compose.yml` as needed).
