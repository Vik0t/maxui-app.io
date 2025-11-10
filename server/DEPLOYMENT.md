# Deployment to Vercel

## Prerequisites
1. Ensure you have a Vercel account
2. Install the Vercel CLI: `npm install -g vercel`

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
2. Change the `API_BASE_URL` constant to your Vercel backend URL:
   ```javascript
   const API_BASE_URL = 'https://your-vercel-app-name.vercel.app/api';
   ```

## Notes

- The current implementation uses in-memory storage which will reset when the server restarts
- For production use, replace the in-memory storage with a real database (MongoDB, PostgreSQL, etc.)
- Make sure to use a strong JWT_SECRET in production