const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'max_app_secret_key';

// Middleware
// Replace the existing app.use(cors()); line with this:
app.use(cors({
  origin: ['https://vik0t.github.io', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data storage (in a real app, this would be a database)
let applications = [];
let deans = [
  {
    id: 1,
    username: 'dean',
    // Password is 'dean123' hashed
    password: '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa'
  }
];

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Dean authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find dean
    const dean = deans.find(d => d.username === username);
    if (!dean) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, dean.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(dean);
    
    res.json({
      success: true,
      token,
      user: {
        id: dean.id,
        username: dean.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all applications
app.get('/api/applications', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications by type
app.get('/api/applications/type/:type', authenticateToken, (req, res) => {
  try {
    const { type } = req.params;
    const filteredApplications = applications.filter(app => app.type === type);
    
    res.json({
      success: true,
      applications: filteredApplications
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new application
app.post('/api/applications', (req, res) => {
  try {
    const applicationData = req.body;
    
    // Validate required fields
    if (!applicationData.type || !applicationData.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new application
    const newApplication = {
      id: Date.now(),
      ...applicationData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    applications.push(newApplication);
    
    res.status(201).json({
      success: true,
      application: newApplication
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update application status
app.put('/api/applications/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Find application
    const applicationIndex = applications.findIndex(app => app.id === parseInt(id));
    if (applicationIndex === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Update status
    applications[applicationIndex].status = status;
    
    res.json({
      success: true,
      application: applications[applicationIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications statistics
app.get('/api/applications/stats', authenticateToken, (req, res) => {
  try {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    
    // Count by type
    const financialAidCount = applications.filter(app => app.type === 'financial_aid').length;
    const certificateCount = applications.filter(app => app.type === 'certificate').length;
    
    // For student count, we'll use a simple approach
    // In a real app, this would come from a separate students database
    const studentCount = Math.max(1000, total * 5); // Estimate at least 1000 students
    
    res.json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
        financialAid: financialAidCount,
        certificates: certificateCount,
        studentCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;