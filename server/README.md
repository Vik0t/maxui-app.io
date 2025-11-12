# MAX App Server

Backend server for the MAX messenger application with PostgreSQL database support.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v10 or higher)

## PostgreSQL Setup

1. Install PostgreSQL on your system:
   - **macOS**: `brew install postgresql`
   - **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
   - **Windows**: Download from https://www.postgresql.org/download/windows/

2. Start PostgreSQL service:
   - **macOS**: `brew services start postgresql`
   - **Ubuntu/Debian**: `sudo service postgresql start`
   - **Windows**: Start the PostgreSQL service from Services

3. Create a database user and database:
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create a new user (optional, you can use the default postgres user)
   CREATE USER max_user WITH PASSWORD 'postgres';

   # Create the database
   CREATE DATABASE max_app;

   # Grant privileges (if you created a new user)
   GRANT ALL PRIVILEGES ON DATABASE max_app TO max_user;

   # Exit PostgreSQL
   \q
   ```

4. Update the `.env` file with your database credentials if needed:
   ```
   DB_USER=postgres      # or max_user if you created a new user
   DB_HOST=localhost
   DB_NAME=max_app
   DB_PASSWORD=postgres  # or the password you set for max_user
   DB_PORT=5432
   ```

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Set up PostgreSQL database:
   - Install PostgreSQL on your system
   - Create a database named `max_app`
   - Update the `.env` file with your database credentials if needed

3. Database configuration:
   The application will automatically create the necessary tables on first run. The default configuration is:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=max_app
   DB_PASSWORD=postgres
   DB_PORT=5432
   ```

## Running the Server

### Development Mode
```bash
cd server
npm run dev
```

### Production Mode
```bash
cd server
npm start
```

The server will run on port 3001 by default.

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=max_app
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=max_app_secret_key
PORT=3001
```

## API Endpoints

- `POST /api/auth/login` - Dean authentication
- `GET /api/applications` - Get all applications (requires authentication)
- `GET /api/applications/type/:type` - Get applications by type (requires authentication)
- `POST /api/applications` - Create new application
- `GET /api/applications/financial-aid/payments` - Calculate financial aid payments (requires authentication)
- `PUT /api/applications/:id/status` - Update application status (requires authentication)
- `GET /api/applications/stats` - Get application statistics (requires authentication)
- `GET /api/health` - Health check endpoint

## Database Schema

The application automatically creates two tables:

1. `applications` - Stores application data
2. `deans` - Stores dean user credentials

The default dean user is:
- Username: `dean`
- Password: `dean123`