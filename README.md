# MAX Messenger Application

A student service application built with React, Vite, and MAXUI for managing financial aid applications and certificates.

## Features

- Student portal for submitting financial aid applications and certificate requests
- Dean portal for reviewing and managing applications
- Financial aid payment calculation based on application reasons
- Certificate request management
- Responsive design using MAXUI components

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (for local development)
- Vercel account (for deployment)
- Supabase account (for managed PostgreSQL database)

## Local Development Setup

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL database:
   - Install PostgreSQL on your system
   - Create a database named `max_app`
   - Update the `.env` file with your database credentials

4. Start the backend server:
   ```bash
   npm start
   ```

## Deployment

### Deploying to Vercel

The application can be deployed to Vercel with a managed PostgreSQL database. Follow the detailed guide in [VERCEL_DEPLOYMENT_GUIDE.md](server/VERCEL_DEPLOYMENT_GUIDE.md).

#### Important Notes for Vercel Deployment

1. **Database Initialization**: When deploying to Vercel with Supabase, the automatic database table creation might fail due to permission restrictions. If you encounter database initialization errors, you'll need to manually create the tables using the SQL commands in [server/migrations/init.sql](server/migrations/init.sql).

2. **Environment Variables**: Make sure to configure all environment variables in the Vercel project settings, including database connection details and JWT secret.

3. **CORS Configuration**: The application is configured to allow CORS requests from specific origins. If you deploy to a different domain, you may need to update the CORS configuration in [server/index.js](server/index.js).

### Environment Variables

For local development, create a `.env` file in the server directory:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=max_app
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=max_app_secret_key
PORT=3001
```

## Project Structure

```
maxui-app/
├── src/                 # Frontend source code
│   ├── pages/           # Application pages
│   ├── utils/           # Utility functions
│   └── assets/          # Static assets
├── server/              # Backend server
│   ├── config/          # Database configuration
│   ├── migrations/      # Database migrations
│   ├── index.js         # Main server file
│   ├── package.json     # Server dependencies
│   └── .env             # Environment variables
├── public/              # Public assets
├── package.json         # Frontend dependencies
└── README.md            # This file
```

## API Endpoints

- `POST /api/auth/login` - Dean authentication
- `GET /api/applications` - Get all applications (requires authentication)
- `GET /api/applications/type/:type` - Get applications by type (requires authentication)
- `POST /api/applications` - Create new application
- `GET /api/applications/financial-aid/payments` - Calculate financial aid payments (requires authentication)
- `PUT /api/applications/:id/status` - Update application status (requires authentication)
- `GET /api/applications/stats` - Get application statistics (requires authentication)

## Default Credentials

Dean login:
- Username: `dean`
- Password: `dean123`

## Development Notes

- The frontend runs on port 5173 by default
- The backend runs on port 3001 by default
- All API requests are proxied through the backend
- The application uses MAXUI components for the user interface
- PostgreSQL is used for data persistence
