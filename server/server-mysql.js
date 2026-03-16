import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import process from 'process';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { pool, testConnection } from './db.js';
import { createRequire } from 'module';

// Load .env config
const require = createRequire(import.meta.url);
try {
    const dotenv = require('dotenv');
    dotenv.config({ path: new URL('.env', import.meta.url).pathname });
} catch (e) { /* dotenv optional */ }

const app = express();
const PORT = process.env.SERVER_PORT || 5000;
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

app.use(cors());
app.use(bodyParser.json({ limit: '1024mb' }));
app.use(bodyParser.urlencoded({ limit: '1024mb', extended: true }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 } // 1GB
});

// --- Nodemailer Setup ---
const EMAIL_CONFIG = {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
};

const sendConfirmationEmail = async (email, username) => {
    if (!EMAIL_CONFIG.host || !EMAIL_CONFIG.user) {
        console.log(`[EMAIL MOCK] Confirmation email to: ${email} (username: ${username})`);
        console.log(`[EMAIL MOCK] Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars to send real emails.`);
        return;
    }
    try {
        const transporter = nodemailer.createTransport({
            host: EMAIL_CONFIG.host,
            port: EMAIL_CONFIG.port,
            auth: { user: EMAIL_CONFIG.user, pass: EMAIL_CONFIG.pass }
        });
        await transporter.sendMail({
            from: EMAIL_CONFIG.user,
            to: email,
            subject: 'ยืนยันการลงทะเบียน - โรงพยาบาลคลองหาด',
            html: `<p>เรียน ${username}, การลงทะเบียนที่ใช้งานสำเร็จแล้ว กรุณารออนุมัติจากผู้ดูแลระบบ</p>`
        });
        console.log(`Email sent to ${email}`);
    } catch (err) {
        console.error('Email send failed:', err.message);
    }
};

// --- Auth & Register ---
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        connection.release();

        if (rows.length > 0) {
            const user = rows[0];
            if (user.status !== 'active') {
                return res.status(403).json({ success: false, message: 'บัญชีนี้ยังไม่ได้รับการยืนยันหรือถูกระงับ' });
            }
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    permissions: user.permissions
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const connection = await pool.getConnection();
        
        // Check if user exists
        const [existing] = await connection.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        
        if (existing.length > 0) {
            connection.release();
            return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' });
        }

        const id = Date.now();
        await connection.query(
            'INSERT INTO users (id, username, password, email, role, status, permissions, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, username, password, email, 'staff', 'pending', JSON.stringify(['read']), `https://via.placeholder.com/200x200?text=${encodeURIComponent(username)}`]
        );
        connection.release();

        sendConfirmationEmail(email, username);
        res.json({ success: true, message: 'ลงทะเบียนสำเร็จ! กรุณารอ Admin อนุมัติบัญชี (จะแจ้งผ่านอีเมล)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// --- User Management (Admin Only) ---
app.get('/api/users', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users');
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        
        const fields = [];
        const values = [];
        
        Object.keys(req.body).forEach(key => {
            if (key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(req.body[key]);
            }
        });
        
        values.push(parseInt(id));
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        
        const [result] = await connection.query(query, values);
        
        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: 'User not found' });
        }

        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [parseInt(id)]);
        connection.release();
        res.json({ success: true, user: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM users WHERE id = ?', [parseInt(id)]);
        connection.release();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

// --- Generic CRUD Helper ---
const setupCRUD = (endpoint, tableName, idField = 'id') => {
    // GET all
    app.get(`/api/${endpoint}`, async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
            connection.release();
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch' });
        }
    });

    // POST create
    app.post(`/api/${endpoint}`, async (req, res) => {
        try {
            const connection = await pool.getConnection();
            
            const fields = Object.keys(req.body).concat(['id']);
            const values = Object.values(req.body).concat([Date.now()]);
            const placeholders = fields.map(() => '?').join(', ');
            
            const query = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
            await connection.query(query, values);
            
            const result = { id: Date.now(), ...req.body };
            connection.release();
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Create failed' });
        }
    });

    // PUT update
    app.put(`/api/${endpoint}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const connection = await pool.getConnection();
            
            const fields = [];
            const values = [];
            
            Object.keys(req.body).forEach(key => {
                if (key !== 'id') {
                    fields.push(`${key} = ?`);
                    values.push(req.body[key]);
                }
            });
            
            values.push(parseInt(id));
            const query = `UPDATE ${tableName} SET ${fields.join(', ')} WHERE ${idField} = ?`;
            
            const [result] = await connection.query(query, values);
            
            if (result.affectedRows === 0) {
                connection.release();
                return res.status(404).json({ error: 'Item not found' });
            }

            const [rows] = await connection.query(`SELECT * FROM ${tableName} WHERE ${idField} = ?`, [parseInt(id)]);
            connection.release();
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Update failed' });
        }
    });

    // DELETE
    app.delete(`/api/${endpoint}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const connection = await pool.getConnection();
            await connection.query(`DELETE FROM ${tableName} WHERE ${idField} = ?`, [parseInt(id)]);
            connection.release();
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Delete failed' });
        }
    });
};

// Setup CRUD endpoints
setupCRUD('news', 'news');
setupCRUD('activities', 'activities');
setupCRUD('median-prices', 'median_prices');
setupCRUD('jobs', 'jobs');
setupCRUD('academic-docs', 'academic_docs');
setupCRUD('appointments', 'appointments');
setupCRUD('bidding', 'bidding');

// ITA - special endpoint with year filter
app.get('/api/ita', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const year = req.query.year;
        
        let query = 'SELECT * FROM ita';
        const params = [];
        
        if (year) {
            query += ' WHERE year = ?';
            params.push(parseInt(year));
        }
        
        const [rows] = await connection.query(query, params);
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/ita', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const id = Date.now();
        
        const fields = Object.keys(req.body).concat(['id']);
        const values = Object.values(req.body).concat([id]);
        const placeholders = fields.map(() => '?').join(', ');
        
        const query = `INSERT INTO ita (${fields.join(', ')}) VALUES (${placeholders})`;
        await connection.query(query, values);
        
        connection.release();
        res.json({ id, ...req.body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Create failed' });
    }
});

app.put('/api/ita/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        
        const fields = [];
        const values = [];
        
        Object.keys(req.body).forEach(key => {
            if (key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(req.body[key]);
            }
        });
        
        values.push(parseInt(id));
        const query = `UPDATE ita SET ${fields.join(', ')} WHERE id = ?`;
        
        const [result] = await connection.query(query, values);
        
        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: 'Not found' });
        }

        const [rows] = await connection.query('SELECT * FROM ita WHERE id = ?', [parseInt(id)]);
        connection.release();
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
});

app.delete('/api/ita/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM ita WHERE id = ?', [parseInt(id)]);
        connection.release();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

// Stats
app.get('/api/stats', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM stats');
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM services');
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Upload File Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', database: 'MySQL' });
});

// Start Server
async function startServer() {
    const connected = await testConnection();
    if (!connected) {
        console.error('Failed to connect to database. Exiting...');
        process.exit(1);
    }
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${PORT}`);
        console.log(`Database: MySQL (${process.env.DB_HOST}:${process.env.DB_PORT})`);
    });
}

startServer();
