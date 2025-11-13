const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const dbPath = path.join(dbDir, 'max_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Initialize database schema
const initSqlPath = path.join(__dirname, 'migrations', 'init.sql');
fs.readFile(initSqlPath, 'utf8', (err, sql) => {
    if (err) {
        console.error('Error reading init.sql:', err.message);
        return;
    }
    
    db.exec(sql, (err) => {
        if (err) {
            console.error('Error initializing database:', err.message);
        } else {
            console.log('Database initialized successfully');
        }
    });
});

// Database operations for applications
const getApplications = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM applications', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getApplicationsByType = (type) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM applications WHERE type = ?', [type], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getApplicationById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM applications WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const createApplication = (applicationData) => {
    return new Promise((resolve, reject) => {
        const {
            type, name, timestamp, status, reason, expenses, additional_info
        } = applicationData;
        
        const sql = `
            INSERT INTO applications 
            (type, name, timestamp, status, reason, expenses, additional_info) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
            type, name, timestamp, status, reason, expenses, additional_info
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, ...applicationData });
            }
        });
    });
};

const updateApplicationStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        
        db.run(sql, [status, id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Application not found'));
            } else {
                getApplicationById(id).then(resolve).catch(reject);
            }
        });
    });
};

// Database operations for deans
const getDeanByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM deans WHERE username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Get applications statistics
const getApplicationsStats = () => {
    return new Promise((resolve, reject) => {
        const statsSql = `
            SELECT
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN type = 'financial_aid' THEN 1 END) as financialAid,
                COUNT(CASE WHEN type = 'certificate' THEN 1 END) as certificates
            FROM applications
        `;
        
        db.get(statsSql, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Delete application by ID
const deleteApplication = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM applications WHERE id = ?';
        
        db.run(sql, [id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Application not found'));
            } else {
                resolve({ message: 'Application deleted successfully' });
            }
        });
    });
};

module.exports = {
    db,
    getApplications,
    getApplicationsByType,
    getApplicationById,
    createApplication,
    updateApplicationStatus,
    getDeanByUsername,
    getApplicationsStats,
    deleteApplication
};