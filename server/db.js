const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

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
            
            // Check if we need to create default data
            initializeDefaultData();
        }
    });
});

// Database operations for applications
const getApplications = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT a.*, s.faculty, s.course_with_group as courseWithGroup, s.contact_phone as contactPhone
            FROM applications a
            LEFT JOIN students s ON a.student_id = s.id
        `;
        db.all(sql, (err, rows) => {
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
        const sql = `
            SELECT a.*, s.faculty, s.course_with_group as courseWithGroup, s.contact_phone as contactPhone
            FROM applications a
            LEFT JOIN students s ON a.student_id = s.id
            WHERE a.type = ?
        `;
        db.all(sql, [type], (err, rows) => {
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
        const sql = `
            SELECT a.*, s.faculty, s.course_with_group as courseWithGroup, s.contact_phone as contactPhone
            FROM applications a
            LEFT JOIN students s ON a.student_id = s.id
            WHERE a.id = ?
        `;
        db.get(sql, [id], (err, row) => {
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
            type, name, timestamp, status, reason, expenses, additional_info, student_id
        } = applicationData;
        
        const sql = `
            INSERT INTO applications
            (type, name, timestamp, status, reason, expenses, additional_info, student_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
            type, name, timestamp, status, reason, expenses, additional_info, student_id
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

// Database operations for students
const createStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        const {
            name, email, faculty, courseWithGroup, contactPhone, password, maxId
        } = studentData;
        
        const sql = `
            INSERT INTO students
            (name, email, faculty, course_with_group, contact_phone, password, max_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
            name, email, faculty, courseWithGroup, contactPhone, password, maxId
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, ...studentData });
            }
        });
    });
};

const getStudentById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getStudentByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM students WHERE email = ?', [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getApplicationsByStudentId = (studentId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM applications WHERE student_id = ?', [studentId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Initialize default data
const initializeDefaultData = async () => {
    try {
        // Check if we already have a student
        const student = await getStudentById(1);
        if (!student) {
            // Create default student
            const defaultStudent = {
                name: "Иванов Иван Иванович",
                email: "ivanov@g.nsu.ru",
                faculty: "Факультет информационных технологий",
                courseWithGroup: "2 курс, группа ИТ-201",
                contactPhone: "+7 (999) 123-45-67",
                password: await bcrypt.hash("student123", 10), // Hashed password
                maxId: "MAX123456789"
            };
            
            const createdStudent = await createStudent(defaultStudent);
            console.log('Default student created:', createdStudent);
            
            // Create some sample applications
            const sampleApplications = [
                {
                    type: 'financial_aid',
                    name: "Иванов Иван Иванович",
                    timestamp: new Date().toISOString(),
                    status: 'pending',
                    reason: "Тяжелое материальное положение обучающегося",
                    expenses: 15000,
                    additional_info: "Нуждаюсь в финансовой помощи для оплаты обучения",
                    student_id: createdStudent.id.toString()
                },
                {
                    type: 'certificate',
                    name: "Иванов Иван Иванович",
                    timestamp: new Date().toISOString(),
                    status: 'approved',
                    reason: "Для предоставления по месту работы",
                    additional_info: "Требуется справка для оформления социальной стипендии",
                    student_id: createdStudent.id.toString()
                }
            ];
            
            for (const app of sampleApplications) {
                await createApplication(app);
            }
            
            console.log('Sample applications created');
        } else {
            console.log('Default student already exists');
        }
    } catch (error) {
        console.error('Error initializing default data:', error);
    }
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
    deleteApplication,
    createStudent,
    getStudentById,
    getStudentByEmail,
    getApplicationsByStudentId,
    initializeDefaultData
};