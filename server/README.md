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

4. Supabase Deployment:
   When deploying to Vercel with Supabase, the automatic table creation might fail due to permission restrictions.
   If you encounter database initialization errors, you can manually create the tables:
   
   a. Go to your Supabase project dashboard
   b. Navigate to SQL Editor
   c. Copy and run the SQL commands from `server/migrations/init.sql`:
      ```sql
      -- Create applications table
      CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          name VARCHAR(255) NOT NULL,
          faculty VARCHAR(255),
          course_with_group VARCHAR(100),
          contact_phone VARCHAR(50),
          pass_serial VARCHAR(50),
          pass_place TEXT,
          registration TEXT,
          reason TEXT,
          documents TEXT,
          date DATE,
          expenses DECIMAL(10, 2),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'pending'
      );

      -- Create deans table
      CREATE TABLE IF NOT EXISTS deans (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
      );

      -- Insert default dean user (password is 'dean123' hashed)
      INSERT INTO deans (username, password) VALUES
      ('dean', '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa')
      ON CONFLICT (username) DO NOTHING;
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