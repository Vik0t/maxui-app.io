# Docker Deployment

This guide explains how to run the Electronic Dean's Office application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Building and Running the Application

1. Clone or download the repository to your local machine

2. Navigate to the project root directory

3. Build and start the services:
```bash
docker-compose up --build
```

This command will:
- Build the frontend and backend Docker images
- Start both services
- Create a Docker volume for the SQLite database persistence

## Accessing the Application

Once the services are running, you can access the application at:
- Frontend: http://localhost
- Backend API: http://localhost:3002/api

## Default Credentials

For testing purposes, the application comes with default users:

### Dean Account
- Username: `dean`
- Password: `dean123`

### Student Account
- Email: `ivanov@g.nsu.ru`
- Password: `student123`

## Stopping the Application

To stop the application, press `Ctrl+C` in the terminal where docker-compose is running.

To stop and remove containers:
```bash
docker-compose down
```

To stop and remove containers along with the database volume (WARNING: This will delete all data):
```bash
docker-compose down -v
```

## Development vs Production

The current configuration is suitable for development and testing. For production use:

1. Change the `JWT_SECRET` environment variable in `docker-compose.yml` to a strong, random secret
2. Consider using a production-grade database instead of SQLite
3. Use a reverse proxy like Nginx or Traefik for SSL termination
4. Implement proper backup strategies for the database volume