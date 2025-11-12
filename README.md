# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

<<<<<<< HEAD
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
=======
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> parent of a95de35 (db added)
