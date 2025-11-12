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

<<<<<<< HEAD
// Initialize database tables
const initDatabase = async () => {
  try {
    // Log Supabase configuration for debugging
    console.log('Attempting to connect to Supabase with config:', {
      supabaseUrl: process.env.SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    
    // Test database connection by querying a simple select
    const testResult = await db.query('SELECT NOW()');
    console.log('Database connected successfully');
    
    // For Supabase, we'll skip automatic table creation and instead
    // provide instructions for manual table creation
    console.log('For Supabase deployments, please ensure tables are created manually using the SQL commands in server/migrations/init.sql');
    
    // Try to insert default dean user if not exists
    try {
      // First check if the user exists
      const deanResult = await db.query('SELECT * FROM deans WHERE username = $1', ['dean']);
      if (deanResult.rows.length === 0) {
        await db.query(
          'INSERT INTO deans (username, password) VALUES ($1, $2)',
          ['dean', '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa']
        );
        console.log('Default dean user created');
      } else {
        console.log('Default dean user already exists');
      }
    } catch (insertError) {
      console.log('Note: Could not automatically create default dean user. Please ensure it exists in the database.');
      console.log('You can manually insert it using: INSERT INTO deans (username, password) VALUES (\'dean\', \'$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa\');');
    }
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('For Supabase deployments, please ensure:');
    console.error('1. Environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    console.error('2. Tables are created manually using the SQL commands in server/migrations/init.sql');
    console.error('3. The default dean user exists in the database');
=======
// In-memory data storage (in a real app, this would be a database)
let applications = [];
let deans = [
  {
    id: 1,
    username: 'dean',
    // Password is 'dean123' hashed
    password: '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa'
>>>>>>> parent of a95de35 (db added)
  }
];

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
    console.log('Authentication request received:', req.body);
    
    const { username, password } = req.body;
    
<<<<<<< HEAD
    // Log database configuration for debugging
    console.log('Database config during auth:', {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'max_app',
      port: process.env.DB_PORT || 5432,
    });
    
    // Find dean in database
    const result = await db.query('SELECT * FROM deans WHERE username = $1', [username]);
    if (result.rows.length === 0) {
=======
    // Find dean
    const dean = deans.find(d => d.username === username);
    if (!dean) {
>>>>>>> parent of a95de35 (db added)
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
<<<<<<< HEAD
    console.error('Error during authentication:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection error. Please make sure PostgreSQL is installed and running.' });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Database host not found. Please check your database configuration.' });
    } else if (error.code === 'ECONNRESET') {
      return res.status(500).json({ error: 'Database connection was reset. Please try again.' });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Database connection timed out. Please try again.' });
    } else if (error.code === '28P01') {
      return res.status(500).json({ error: 'Invalid database password. Please check your database configuration.' });
    } else if (error.code === '3D000') {
      return res.status(500).json({ error: 'Database does not exist. Please check your database configuration.' });
    } else if (error.code === '28000') {
      return res.status(500).json({ error: 'Invalid database user. Please check your database configuration.' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
=======
    res.status(500).json({ error: 'Server error' });
>>>>>>> parent of a95de35 (db added)
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
<<<<<<< HEAD
    console.error('Error fetching applications:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection error. Please make sure PostgreSQL is installed and running.' });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Database host not found. Please check your database configuration.' });
    } else if (error.code === 'ECONNRESET') {
      return res.status(500).json({ error: 'Database connection was reset. Please try again.' });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Database connection timed out. Please try again.' });
    } else if (error.code === '28P01') {
      return res.status(500).json({ error: 'Invalid database password. Please check your database configuration.' });
    } else if (error.code === '3D000') {
      return res.status(500).json({ error: 'Database does not exist. Please check your database configuration.' });
    } else if (error.code === '28000') {
      return res.status(500).json({ error: 'Invalid database user. Please check your database configuration.' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
=======
    res.status(500).json({ error: 'Server error' });
>>>>>>> parent of a95de35 (db added)
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
<<<<<<< HEAD
    console.error('Error fetching applications by type:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection error. Please make sure PostgreSQL is installed and running.' });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Database host not found. Please check your database configuration.' });
    } else if (error.code === 'ECONNRESET') {
      return res.status(500).json({ error: 'Database connection was reset. Please try again.' });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Database connection timed out. Please try again.' });
    } else if (error.code === '28P01') {
      return res.status(500).json({ error: 'Invalid database password. Please check your database configuration.' });
    } else if (error.code === '3D000') {
      return res.status(500).json({ error: 'Database does not exist. Please check your database configuration.' });
    } else if (error.code === '28000') {
      return res.status(500).json({ error: 'Invalid database user. Please check your database configuration.' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
=======
    res.status(500).json({ error: 'Server error' });
>>>>>>> parent of a95de35 (db added)
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
<<<<<<< HEAD
    console.error('Error creating application:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection error. Please make sure PostgreSQL is installed and running.' });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Database host not found. Please check your database configuration.' });
    } else if (error.code === 'ECONNRESET') {
      return res.status(500).json({ error: 'Database connection was reset. Please try again.' });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Database connection timed out. Please try again.' });
    } else if (error.code === '28P01') {
      return res.status(500).json({ error: 'Invalid database password. Please check your database configuration.' });
    } else if (error.code === '3D000') {
      return res.status(500).json({ error: 'Database does not exist. Please check your database configuration.' });
    } else if (error.code === '28000') {
      return res.status(500).json({ error: 'Invalid database user. Please check your database configuration.' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
=======
    res.status(500).json({ error: 'Server error' });
>>>>>>> parent of a95de35 (db added)
  }
});

// Calculate financial aid payments
app.get('/api/applications/financial-aid/payments', authenticateToken, (req, res) => {
  try {
    const { results, total } = processApplications(applications, financialAidRules);
    
    res.json({
      success: true,
      payments: results,
      total: total
    });
  } catch (error) {
<<<<<<< HEAD
    console.error('Error calculating payments:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection error. Please make sure PostgreSQL is installed and running.' });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Database host not found. Please check your database configuration.' });
    } else if (error.code === 'ECONNRESET') {
      return res.status(500).json({ error: 'Database connection was reset. Please try again.' });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Database connection timed out. Please try again.' });
    } else if (error.code === '28P01') {
      return res.status(500).json({ error: 'Invalid database password. Please check your database configuration.' });
    } else if (error.code === '3D000') {
      return res.status(500).json({ error: 'Database does not exist. Please check your database configuration.' });
    } else if (error.code === '28000') {
      return res.status(500).json({ error: 'Invalid database user. Please check your database configuration.' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
=======
    res.status(500).json({ error: 'Server error' });
>>>>>>> parent of a95de35 (db added)
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
<<<<<<< HEAD
    console.error('Error updating application status:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection error. Please make sure PostgreSQL is installed and running.' });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Database host not found. Please check your database configuration.' });
    } else if (error.code === 'ECONNRESET') {
      return res.status(500).json({ error: 'Database connection was reset. Please try again.' });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Database connection timed out. Please try again.' });
    } else if (error.code === '28P01') {
      return res.status(500).json({ error: 'Invalid database password. Please check your database configuration.' });
    } else if (error.code === '3D000') {
      return res.status(500).json({ error: 'Database does not exist. Please check your database configuration.' });
    } else if (error.code === '28000') {
      return res.status(500).json({ error: 'Invalid database user. Please check your database configuration.' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
=======
    res.status(500).json({ error: 'Server error' });
>>>>>>> parent of a95de35 (db added)
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
<<<<<<< HEAD
    console.error('Error fetching application stats:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection error. Please make sure PostgreSQL is installed and running.' });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Database host not found. Please check your database configuration.' });
    } else if (error.code === 'ECONNRESET') {
      return res.status(500).json({ error: 'Database connection was reset. Please try again.' });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Database connection timed out. Please try again.' });
    } else if (error.code === '28P01') {
      return res.status(500).json({ error: 'Invalid database password. Please check your database configuration.' });
    } else if (error.code === '3D000') {
      return res.status(500).json({ error: 'Database does not exist. Please check your database configuration.' });
    } else if (error.code === '28000') {
      return res.status(500).json({ error: 'Invalid database user. Please check your database configuration.' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
=======
    res.status(500).json({ error: 'Server error' });
>>>>>>> parent of a95de35 (db added)
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