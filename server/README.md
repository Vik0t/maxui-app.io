# MAX App Server

Backend server for the MAX messenger application.

## Setup

1. Install dependencies:
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

### Deploying to Vercel
To deploy to Vercel:
1. Push the code to your repository
2. Connect the repository to Vercel
3. Set the build command to `npm start`
4. Set the output directory to the root directory

Note: For production use, replace the in-memory data storage with a real database.

### Deploying with GitHub Pages and Self-Hosted Server
See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for detailed instructions on deploying with GitHub Pages.