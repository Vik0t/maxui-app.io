# Deployment to Vercel with PostgreSQL

## Prerequisites
1. Ensure you have a Vercel account
2. Install the Vercel CLI: `npm install -g vercel`
3. Set up a managed PostgreSQL database (Supabase, PlanetScale, AWS RDS, etc.)

## Database Setup Options

### Option 1: Supabase (Recommended for simplicity)
1. Create a free account at https://supabase.com/
2. Create a new project
3. Get your database connection details:
   - Database URL
   - Username
   - Password

### Option 2: Railway (Alternative)
1. Create a free account at https://railway.app/
2. Create a new PostgreSQL database
3. Get your database connection details

## Deployment Steps

1. **Prepare your code:**
   - Copy the `server` folder contents to your Vercel backend repository
   - Make sure all files are in the root directory of your repository

2. **Configure environment variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add the following variables:
     - `JWT_SECRET` - A secure random string for JWT token generation
     - `PORT` - Set to `3000` (Vercel's default port)
     - `DB_USER` - Your PostgreSQL username
     - `DB_HOST` - Your PostgreSQL host
     - `DB_NAME` - Your PostgreSQL database name
     - `DB_PASSWORD` - Your PostgreSQL password
     - `DB_PORT` - Your PostgreSQL port (usually 5432)

3. **Update the build settings in Vercel:**
   - Build Command: `npm start`
   - Output Directory: `.` (current directory)
   - Install Command: `npm install`

4. **Deploy:**
   - Push your changes to GitHub
   - Vercel will automatically deploy your application

## API Endpoint Configuration

After deployment, update the frontend to use your Vercel backend URL:

1. Open `src/utils/api.js` in your frontend project
2. Comment out the localhost URL and uncomment the Vercel URL:
   ```javascript
   // const API_BASE_URL = 'http://localhost:3001/api';
   const API_BASE_URL = 'https://your-vercel-app-name.vercel.app/api';
   ```

For local development, make sure to switch back to the localhost URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:3001/api';
   // const API_BASE_URL = 'https://your-vercel-app-name.vercel.app/api';
   ```

## Notes

- The application now uses PostgreSQL for persistent storage
- Make sure your PostgreSQL database is accessible from Vercel
- For free tier databases, you may need to whitelist Vercel's IP addresses
- Make sure to use a strong JWT_SECRET in production
- The application will automatically create the necessary tables on first run