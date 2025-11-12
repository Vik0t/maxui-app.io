require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

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

// Initialize database tables
const initDatabase = async () => {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    console.log('Database connected successfully');
    
    // Create applications table
    await db.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        faculty VARCHAR(255),
        course_with_group VARCHAR(100),
        contact_phone VARCHAR(50),
        pass_serial VARCHAR(50),
        pass_place TEXT,
        registration TEXT,
        reason TEXT,
        documents TEXT,
        date DATE,
        expenses DECIMAL(10, 2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending'
      )
    `);
    
    // Create deans table
    await db.query(`
      CREATE TABLE IF NOT EXISTS deans (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    
    // Insert default dean user if not exists
    try {
      await db.query(
        'INSERT INTO deans (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
        ['dean', '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa']
      );
    } catch (insertError) {
      // If ON CONFLICT is not supported, try the old way
      const deanResult = await db.query('SELECT * FROM deans WHERE username = $1', ['dean']);
      if (deanResult.rows.length === 0) {
        await db.query(
          'INSERT INTO deans (username, password) VALUES ($1, $2)',
          ['dean', '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa']
        );
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Handle different types of database errors
    if (error.code === 'ECONNREFUSED') {
      console.error('Database connection error. Please make sure PostgreSQL is installed and running.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Database host not found. Please check your database configuration.');
    } else if (error.code === 'ECONNRESET') {
      console.error('Database connection was reset. Please try again.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Database connection timed out. Please try again.');
    } else if (error.code === '28P01') {
      console.error('Invalid database password. Please check your database configuration.');
    } else if (error.code === '3D000') {
      console.error('Database does not exist. Please check your database configuration.');
    } else if (error.code === '28000') {
      console.error('Invalid database user. Please check your database configuration.');
    } else if (error.code === '42501') {
      console.error('Insufficient privileges to create tables. This is common with Supabase free tier.');
      console.error('Please manually run the SQL commands from server/migrations/init.sql in your Supabase SQL editor.');
    } else {
      console.error('Unknown database error. Please check your database configuration.');
    }
    console.error('Follow the setup instructions in README.md to configure the database.');
  }
};

// Initialize database on startup
initDatabase();

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
    const result = await db.query('SELECT * FROM deans WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const dean = result.rows[0];
    
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
  }
});

// Get all applications
app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM applications ORDER BY timestamp DESC');
    res.json({
      success: true,
      applications: result.rows
    });
  } catch (error) {
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
  }
});

// Get applications by type
app.get('/api/applications/type/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const result = await db.query('SELECT * FROM applications WHERE type = $1 ORDER BY timestamp DESC', [type]);
    
    res.json({
      success: true,
      applications: result.rows
    });
  } catch (error) {
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
    
    // Insert new application into database
    const result = await db.query(
      `INSERT INTO applications
      (type, name, faculty, course_with_group, contact_phone, pass_serial, pass_place, registration, reason, documents, date, expenses, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        applicationData.type,
        applicationData.name,
        applicationData.faculty,
        applicationData.courseWithGroup,
        applicationData.contactPhone,
        applicationData.passSerial,
        applicationData.passPlace,
        applicationData.registration,
        applicationData.reason,
        applicationData.documents,
        applicationData.date,
        applicationData.expenses,
        'pending'
      ]
    );
    
    res.status(201).json({
      success: true,
      application: result.rows[0]
    });
  } catch (error) {
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
  }
});

// Calculate financial aid payments
app.get('/api/applications/financial-aid/payments', authenticateToken, async (req, res) => {
  try {
    // Fetch all applications from database
    const result = await db.query('SELECT * FROM applications');
    const { results, total } = processApplications(result.rows, financialAidRules);
    
    res.json({
      success: true,
      payments: results,
      total: total
    });
  } catch (error) {
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
  }
});

// Update application status
app.put('/api/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Update status in database
    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({
      success: true,
      application: result.rows[0]
    });
  } catch (error) {
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
  }
});

// Get applications statistics
app.get('/api/applications/stats', authenticateToken, async (req, res) => {
  try {
    // Get total count
    const totalResult = await db.query('SELECT COUNT(*) as count FROM applications');
    const total = parseInt(totalResult.rows[0].count);
    
    // Get count by status
    const statusResult = await db.query(`
      SELECT status, COUNT(*) as count
      FROM applications
      GROUP BY status
    `);
    
    let pending = 0, approved = 0, rejected = 0;
    statusResult.rows.forEach(row => {
      switch (row.status) {
        case 'pending': pending = parseInt(row.count); break;
        case 'approved': approved = parseInt(row.count); break;
        case 'rejected': rejected = parseInt(row.count); break;
      }
    });
    
    // Count by type
    const typeResult = await db.query(`
      SELECT type, COUNT(*) as count
      FROM applications
      GROUP BY type
    `);
    
    let financialAidCount = 0, certificateCount = 0;
    typeResult.rows.forEach(row => {
      switch (row.type) {
        case 'financial_aid': financialAidCount = parseInt(row.count); break;
        case 'certificate': certificateCount = parseInt(row.count); break;
      }
    });
    
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