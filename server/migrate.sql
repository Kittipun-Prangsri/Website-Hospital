-- Hospital Database Schema for MySQL
-- Execute this script in Navicat to create all tables

-- Create Database
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'staff',
  status VARCHAR(50) DEFAULT 'pending',
  permissions JSON,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id BIGINT PRIMARY KEY,
  icon VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id BIGINT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  tag VARCHAR(100),
  date VARCHAR(50),
  pdfUrl VARCHAR(500),
  deadline VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id BIGINT PRIMARY KEY,
  title VARCHAR(500),
  description TEXT,
  image VARCHAR(500),
  date VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Median Prices Table
CREATE TABLE IF NOT EXISTS median_prices (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT PRIMARY KEY,
  position VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  description TEXT,
  requirements TEXT,
  salary VARCHAR(100),
  deadline VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Academic Documents Table
CREATE TABLE IF NOT EXISTS academic_docs (
  id BIGINT PRIMARY KEY,
  title VARCHAR(500),
  category VARCHAR(100),
  url VARCHAR(500),
  author VARCHAR(255),
  date VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT PRIMARY KEY,
  patient_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  department VARCHAR(255),
  appointment_date VARCHAR(50),
  appointment_time VARCHAR(20),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bidding Table
CREATE TABLE IF NOT EXISTS bidding (
  id BIGINT PRIMARY KEY,
  project_name VARCHAR(255),
  description TEXT,
  budget DECIMAL(12, 2),
  deadline VARCHAR(50),
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ITA Table
CREATE TABLE IF NOT EXISTS ita (
  id BIGINT PRIMARY KEY,
  title VARCHAR(500),
  year INT,
  description TEXT,
  amount DECIMAL(12, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Stats Table
CREATE TABLE IF NOT EXISTS stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metric_name VARCHAR(255) UNIQUE,
  metric_value INT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create Indexes for better query performance
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_news_date ON news(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_ita_year ON ita(year);

-- Display created tables
SHOW TABLES;
