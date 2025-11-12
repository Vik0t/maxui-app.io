# Vercel Deployment Guide

This guide will help you deploy your MAX App server to Vercel with PostgreSQL database support.

## Prerequisites

1. Create accounts:
   - [Vercel](https://vercel.com/signup)
   - [Supabase](https://supabase.com/) (for PostgreSQL database)

2. Install tools:
   ```bash
   npm install -g vercel
   ```

## Step 1: Set up PostgreSQL Database

1. Go to [Supabase](https://supabase.com/) and create a free account
2. Create a new project:
   - Click "New Project"
   - Enter project name (e.g., "max-app")
   - Set a secure database password
   - Select a region closest to you
   - Click "Create new project"

3. Wait for the project to be created (this may take a few minutes)

4. Get your database connection details:
   - Click on your project
   - Go to "Settings" → "Database"
   - Note down the following information:
     - Host (e.g., "db.xxxxxxxxxxxxxxxxxxxx.supabase.co")
     - Port (5432)
     - Database name (usually "postgres")
     - User (usually "postgres")
     - Password (the one you set during creation)

## Step 2: Prepare Your Code for Deployment

1. Create a new GitHub repository for your backend (or use an existing one)

2. Copy the server files to your repository:
   ```bash
   # If you're in the maxui-app directory
   cp -r server/* /path/to/your/backend/repository/
   ```

3. Make sure your repository structure looks like this:
   ```
   your-backend-repo/
   ├── index.js
   ├── package.json
   ├── package-lock.json
   ├── .env
   ├── README.md
   ├── DEPLOYMENT.md
   ├── config/
   │   └── db.js
   └── migrations/
       └── init.sql
   ```

4. Commit and push your code to GitHub

## Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in

2. Click "Add New..." → "Project"

3. Import your GitHub repository:
   - Click "Continue with GitHub"
   - Select your backend repository
   - Click "Import"

4. Configure project settings:
   - Framework Preset: "Other"
   - Build Command: `npm start`
   - Output Directory: `.` (current directory)
   - Install Command: `npm install`

5. Set environment variables:
   - Click "Environment Variables"
   - Add the following variables:
     ```
     JWT_SECRET=your-secure-jwt-secret
     PORT=3000
     SUPABASE_URL=your-supabase-project-url
     SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
     ```
   
   To get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the Project URL (SUPABASE_URL)
   - Copy the service_role key (SUPABASE_SERVICE_ROLE_KEY)

6. Click "Deploy"

## Step 4: Update Frontend Configuration

1. In your frontend project, open `src/utils/api.js`

2. Comment out the localhost URL and uncomment the Vercel URL:
   ```javascript
   // const API_BASE_URL = 'http://localhost:3001/api';
   const API_BASE_URL = 'https://your-vercel-app-name.vercel.app/api';
   ```

3. Replace `your-vercel-app-name` with your actual Vercel app name

4. Build and deploy your frontend:
   ```bash
   npm run build
   # Deploy to your preferred hosting service (Vercel, GitHub Pages, etc.)
   ```

## Step 5: Test Your Deployment

1. Visit your deployed frontend URL

2. Try logging in as dean:
   - Username: `dean`
   - Password: `dean123`

3. Submit a test application to verify database connectivity

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Check your Supabase database connection details
2. Ensure your database password is correct
3. Verify that your Supabase project is not paused

### Database Initialization Issues

If you encounter database initialization errors (common with Supabase free tier):

1. The application tries to automatically create tables on first run
2. Supabase free tier may have restrictions that prevent automatic table creation
3. If you see errors like "insufficient privileges", you need to manually create the tables:
   a. Go to your Supabase project dashboard
   b. Navigate to SQL Editor
   c. Copy and run the SQL commands from `server/migrations/init.sql`

### CORS Issues

If you encounter CORS issues:

1. Update the CORS configuration in `server/index.js`:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:5173'],
     credentials: true
   }));
   ```

### Environment Variables

If environment variables are not being read:

1. Make sure they are set in Vercel project settings
2. Redeploy your application after setting environment variables

For Supabase deployments, ensure you're using:
- SUPABASE_URL (not DB_HOST, DB_USER, etc.)
- SUPABASE_SERVICE_ROLE_KEY (not DB_PASSWORD)

The older DB_* environment variables are for direct PostgreSQL connections and won't work with Supabase's connection pooling.

## Updating Your Deployment

To update your deployed application:

1. Make changes to your code
2. Commit and push to GitHub
3. Vercel will automatically redeploy your application

For environment variable changes:
1. Update variables in Vercel project settings
2. Redeploy your application manually