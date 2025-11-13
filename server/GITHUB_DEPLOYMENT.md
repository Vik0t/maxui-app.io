# Deployment to GitHub Pages with Self-Hosted Server

## Prerequisites
1. A server/VPS with a public IP address (46.8.69.221 in your case)
2. Port 3002 open and accessible from the internet
3. GitHub account with GitHub Pages enabled

## Server Setup

### 1. Make Sure Your Server is Publicly Accessible
Ensure your server is running and accessible from the internet:
```bash
# Start your server
cd server
npm start
```

### 2. Configure Firewall
Make sure port 3002 is open in your firewall:
```bash
# For UFW (Ubuntu)
sudo ufw allow 3002

# For iptables
sudo iptables -A INPUT -p tcp --dport 3002 -j ACCEPT
```

### 3. Router Configuration
If your server is behind a router, configure port forwarding:
- Forward external port 3002 to your server's internal IP on port 3002

### 4. Test Server Accessibility
Test if your server is accessible from outside:
```bash
# From another machine, test if the port is open
telnet 46.8.69.221 3002

# Or use curl
curl http://46.8.69.221:3002/api/health
```

## CORS Configuration
Your server already has the correct CORS configuration:
```javascript
app.use(cors({
  origin: ['https://vik0t.github.io', 'http://localhost:5173', 'http://localhost:3001', 'http://46.8.69.221:3002'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## Frontend Configuration
Your frontend is already configured correctly:
```javascript
const API_BASE_URL = 'http://46.8.69.221:3002/api';
```

## Deployment Steps

### 1. Start Your Server
```bash
cd server
npm start
```

### 2. Deploy Frontend to GitHub Pages
```bash
# Build your frontend
npm run build

# Deploy to GitHub Pages (using your preferred method)
# For example, if using gh-pages package:
npm run deploy
```

## Troubleshooting

### Common Issues and Solutions

1. **CORS Errors**
   - Make sure `https://vik0t.github.io` is in the CORS origin list
   - Check that your server is actually running
   - Verify that port 3002 is accessible from the internet

2. **Connection Refused**
   - Check if your server is running
   - Verify firewall settings
   - Test port accessibility with `telnet 46.8.69.221 3002`

3. **Mixed Content Warnings**
   - GitHub Pages uses HTTPS, your server uses HTTP
   - Consider setting up HTTPS for your server or use a proxy

### Testing Your Setup
1. Visit your GitHub Pages site: https://vik0t.github.io
2. Open browser developer tools (F12)
3. Try to log in as dean
4. Check the Network tab for any errors

### Alternative Solutions

If you continue to have issues with the self-hosted server:

1. **Use Vercel for both frontend and backend** (recommended)
2. **Use a reverse proxy** to serve both frontend and backend from the same domain
3. **Use a different hosting solution** like Render, Railway, or Heroku

## Security Considerations
- Use environment variables for sensitive data
- Consider implementing rate limiting
- Use HTTPS in production (Let's Encrypt is free)
- Regularly update dependencies

## Testing CORS Configuration

If you're still experiencing issues, use the provided `cors_test.html` file to test your server's CORS configuration:

1. Open `cors_test.html` in a browser
2. Click the test buttons to verify each endpoint
3. Check the browser's developer console for any errors

This will help you identify if the issue is with CORS configuration or network accessibility.