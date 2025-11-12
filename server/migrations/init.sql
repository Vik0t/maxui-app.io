-- Create applications table
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
);

-- Create deans table
CREATE TABLE IF NOT EXISTS deans (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insert default dean user (password is 'dean123' hashed)
INSERT INTO deans (username, password) VALUES 
('dean', '$2a$10$BeYXFumV478oSnEKVRqRFOAoF6p0Yq/mW87ofMZnKvW5fAXY8irpa')
ON CONFLICT (username) DO NOTHING;