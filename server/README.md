# MAX App Server

Backend server for the MAX messenger application.

## Setup

1. Install dependencies:
<<<<<<< HEAD
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
=======
>>>>>>> parent of a95de35 (db added)
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Or start the production server:
```bash
npm start
```

The server will run on port 3001 by default (http://localhost:3001).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Dean login
  - Request body: `{ "username": "dean", "password": "dean123" }`
  - Response: `{ "success": true, "token": "JWT_TOKEN", "user": { "id": 1, "username": "dean" } }`

### Applications
- `GET /api/applications` - Get all applications (requires authentication)
- `GET /api/applications/type/:type` - Get applications by type (requires authentication)
- `POST /api/applications` - Create new application
  - Request body: Application data
- `PUT /api/applications/:id/status` - Update application status (requires authentication)
  - Request body: `{ "status": "approved|rejected|pending" }`
- `GET /api/applications/stats` - Get applications statistics (requires authentication)

### Health Check
- `GET /api/health` - Server health check

## Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT token generation (default: 'max_app_secret_key')

## Deployment

To deploy to Vercel:
1. Push the code to your repository
2. Connect the repository to Vercel
3. Set the build command to `npm start`
4. Set the output directory to the root directory

Note: For production use, replace the in-memory data storage with a real database.