-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reason TEXT,
    expenses REAL,
    additional_info TEXT,
    student_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    faculty TEXT NOT NULL,
    course_with_group TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    password TEXT,
    max_id TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create deans table
CREATE TABLE IF NOT EXISTS deans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert default dean user (same as in the original code)
-- Password is 'dean123' hashed with bcrypt
INSERT OR IGNORE INTO deans (id, username, password) VALUES 
(1, 'dean', '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa');