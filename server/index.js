const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  getApplications,
  getApplicationsByType,
  createApplication,
  updateApplicationStatus,
  getDeanByUsername,
  getApplicationsStats,
  deleteApplication
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'max_app_secret_key';

// Middleware
// Replace the existing app.use(cors()); line with this:
app.use(cors({
  origin: ['https://vik0t.github.io', 'http://localhost:5173', 'http://localhost:3001', 'http://46.8.69.221:3002'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Financial aid payment rules
const financialAidRules = {
  "fixed": {
    "беременность (сроком от 20 недель)": {"value": 15000},
    "рождение ребёнка (детей)": {"value": 20000},
    "чрезвычайные происшествия (стихийные бедствия, техногенные аварии, пожар, наводнение и т.п.)": {"value": 10000},
    "смерть близкого родственника (родителей, супруга, ребенка, родных братьев и сестер, опекуна, попечителя)": {"value": 20000},
    "признание погибшим или без вести пропавшим родственника - участника сво (мать, отец, супруг, супруга)": {"value": 60000},
    "заключение брака": {"value": 5000},
    "получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность родственника (мать, отец, супруг, супруга) - участника сво": {"value": 40000},
    "получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность обучающегося - участника сво": {"value": 50000},
    "вынужденный выезд с территории курской, белгородской, брянской областей в связи с чрезвычайной ситуацией": {"value": 30000},
    "санаторно-курортное лечение": {"value": 50000},
    "компенсация платы за пребывание ребенка в дошкольном образовательном учреждении": {"value": 16000},
    "наличие ребенка (детей) до 14 лет": {"value": 10000},
    "наличие родственников (мать, отец, супруг, супруга), являющихся участниками специальной военной операции": {"value": 10000},
    "обучающийся - участник специальной военной операции": {"value": 15000},
    "тяжелое материальное положение обучающегося": {"value": 10000},
    "заболевание обучающегося, требующее дорогостоящего обследования и лечения": {"value": 10000},
    "студент из неполной семьи, обучающийся по программе бакалавриата или специалитета": {"value": 10000},
    "студент из многодетной семьи, обучающийся по программе бакалавриата или специалитета": {"value": 10000},
    "студент, имеющий регистрацию в отдаленном районе г. новосибирска и не проживающий в общежитии": {"value": 5000},
    "студент, получающий государственную социальную помощь": {"value": 4000},
    "студент-инвалид (ребенок-инвалид, инвалид с детства, инвалид i, ii, iii групп)": {"value": 15000},
    "студент из числа детей-сирот и детей, оставшихся без попечения родителей": {"value": 10000},
    "студент, у которого оба родителя (единственный родитель) являются пенсионерами по старости": {"value": 5000},
    "студент, у которого оба родителя (единственный родитель) являются инвалидами i или ii группы": {"value": 7000}
  },
  "not_fixed": {
    "компенсация затрат на проезд к постоянному месту жительства и обратно к месту учебы": {
      "percentage": 50,
      "max_value": 10000
    }
  }
};

// Calculate payment for a financial aid application
const calculatePayment = (application, rules) => {
  // Extract the text part after the number (e.g., "1.1 Беременность (сроком от 20 недель)" -> "Беременность (сроком от 20 недель)")
  let reason = application.reason;
  const numberPrefixMatch = reason.match(/^\d+\.\d+\s+(.*)/);
  if (numberPrefixMatch) {
    reason = numberPrefixMatch[1];
  }
  
  // Convert to lowercase for matching
  const reasonLower = reason.toLowerCase();
  
  // Check if we have an exact match in fixed rules
  if (rules.fixed[reasonLower]) {
    return rules.fixed[reasonLower].value;
  }
  
  // Check if we have an exact match in not_fixed rules
  if (rules.not_fixed[reasonLower]) {
    const rule = rules.not_fixed[reasonLower];
    const expenses = application.expenses || 0;
    const value = expenses * rule.percentage / 100;
    return Math.min(value, rule.max_value);
  }
  
  // Try partial matching for fixed rules
  const fixedKeys = Object.keys(rules.fixed);
  for (const key of fixedKeys) {
    if (reasonLower.includes(key)) {
      return rules.fixed[key].value;
    }
  }
  
  // Try partial matching for not_fixed rules
  const notFixedKeys = Object.keys(rules.not_fixed);
  for (const key of notFixedKeys) {
    if (reasonLower.includes(key)) {
      const rule = rules.not_fixed[key];
      const expenses = application.expenses || 0;
      const value = expenses * rule.percentage / 100;
      return Math.min(value, rule.max_value);
    }
  }
  
  return 0;
};

// Process all financial aid applications and calculate payments
const processApplications = (applications, rules) => {
  const results = [];
  let total = 0;

  for (const app of applications) {
    if (app.type === 'financial_aid' && app.status === 'approved') {
      const amount = calculatePayment(app, rules);
      results.push({
        id: app.id,
        name: app.name,
        reason: app.reason,
        amount: amount
      });
      total += amount;
    }
  }

  return { results, total };
};

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
    
    // Find dean in database
    const dean = await getDeanByUsername(username);
    if (!dean) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, dean.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken({ id: dean.id, username: dean.username });
    
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
app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    const applications = await getApplications();
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications by type
app.get('/api/applications/type/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const applications = await getApplicationsByType(type);
    
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new application
app.post('/api/applications', async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Validate required fields
    if (!applicationData.type || !applicationData.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Add timestamp and status if not provided
    const applicationToSave = {
      ...applicationData,
      timestamp: applicationData.timestamp || new Date().toISOString(),
      status: applicationData.status || 'pending'
    };
    
    // Create new application in database
    const newApplication = await createApplication(applicationToSave);
    
    res.status(201).json({
      success: true,
      application: newApplication
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Calculate financial aid payments
app.get('/api/applications/financial-aid/payments', authenticateToken, async (req, res) => {
  try {
    const allApplications = await getApplications();
    const { results, total } = processApplications(allApplications, financialAidRules);
    
    res.json({
      success: true,
      payments: results,
      total: total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update application status
app.put('/api/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Update status in database
    const updatedApplication = await updateApplicationStatus(id, status);
    
    res.json({
      success: true,
      application: updatedApplication
    });
  } catch (error) {
    if (error.message === 'Application not found') {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete application
app.delete('/api/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete application from database
    await deleteApplication(id);
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Application not found') {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications statistics
app.get('/api/applications/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await getApplicationsStats();
    
    // For student count, we'll use a simple approach
    // In a real app, this would come from a separate students database
    const studentCount = Math.max(1000, stats.total * 5); // Estimate at least 1000 students
    
    res.json({
      success: true,
      stats: {
        ...stats,
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