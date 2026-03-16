import mysql from 'mysql2/promise';
import process from 'process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
try {
    const dotenv = require('dotenv');
    dotenv.config();
} catch (e) { /* dotenv optional */ }

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✓ MySQL Database Connected Successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('✗ MySQL Connection Error:', error.message);
        return false;
    }
}

export { pool, testConnection };
