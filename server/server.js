import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import process from 'process';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { createRequire } from 'module';

// Load .env config
const require = createRequire(import.meta.url);
try {
    const dotenv = require('dotenv');
    dotenv.config({ path: new URL('.env', import.meta.url).pathname });
} catch (e) { /* dotenv optional */ }


const app = express();
const PORT = 5000;
const DB_PATH = path.join(process.cwd(), 'server', 'db.json');
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

// Helper function to read DB
const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

// Helper function to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// --- Nodemailer Setup (optional - configure real SMTP to enable email sending) ---
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
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username && u.password === password);

    if (user) {
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
});

app.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;
    const db = readDB();

    if (db.users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' });
    }

    const newUser = {
        id: Date.now(),
        username,
        password,
        email,
        role: 'staff',
        status: 'pending',
        permissions: ['read'] // Default simple access
    };

    db.users.push(newUser);
    writeDB(db);

    // Send confirmation email (async, non-blocking)
    sendConfirmationEmail(email, username);

    res.json({ success: true, message: 'ลงทะเบียนสำเร็จ! กรุณารอ Admin อนุมัติบัญชี (จะแจ้งผ่านอีเมล)' });
});

// --- User Management (Admin Only) ---
app.get('/api/users', (req, res) => {
    const db = readDB();
    res.json(db.users);
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
        db.users[index] = { ...db.users[index], ...req.body };
        writeDB(db);
        res.json({ success: true, user: db.users[index] });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    db.users = db.users.filter(u => u.id !== parseInt(id));
    writeDB(db);
    res.json({ success: true });
});

// --- Generic CRUD helpers ---
const setupCRUD = (endpoint, dbKey) => {
    app.get(`/api/${endpoint}`, (req, res) => {
        try { res.json(readDB()[dbKey]); } catch (err) { res.status(500).json({ error: 'Failed' }); }
    });

    app.post(`/api/${endpoint}`, (req, res) => {
        try {
            const db = readDB();
            const newItem = { id: Date.now(), ...req.body };
            db[dbKey].push(newItem);
            writeDB(db);
            res.json(newItem);
        } catch (err) { res.status(500).json({ error: 'Failed' }); }
    });

    app.put(`/api/${endpoint}/:id`, (req, res) => {
        try {
            const db = readDB();
            const index = db[dbKey].findIndex(item => item.id === parseInt(req.params.id) || item.id === req.query.id);
            if (index !== -1) {
                db[dbKey][index] = { ...db[dbKey][index], ...req.body };
                writeDB(db);
                res.json(db[dbKey][index]);
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } catch (err) { res.status(500).json({ error: 'Failed' }); }
    });

    app.delete(`/api/${endpoint}/:id`, (req, res) => {
        try {
            const db = readDB();
            db[dbKey] = db[dbKey].filter(item => item.id !== parseInt(req.params.id) && item.id !== req.params.id);
            writeDB(db);
            res.json({ success: true });
        } catch (err) { res.status(500).json({ error: 'Failed' }); }
    });
};

setupCRUD('news', 'news');
setupCRUD('activities', 'activities');
setupCRUD('median-prices', 'medianPrices');
setupCRUD('jobs', 'jobs');
setupCRUD('academic-docs', 'academicDocs');
setupCRUD('appointments', 'appointments');
setupCRUD('bidding', 'bidding');

// ITA - special endpoint with year filter
app.get('/api/ita', (req, res) => {
    try {
        const db = readDB();
        const year = req.query.year;
        const items = db.ita || [];
        res.json(year ? items.filter(i => String(i.year) === String(year)) : items);
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/ita', (req, res) => {
    try {
        const db = readDB();
        if (!db.ita) db.ita = [];
        const newItem = { id: Date.now(), ...req.body };
        db.ita.push(newItem);
        writeDB(db);
        res.json(newItem);
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.put('/api/ita/:id', (req, res) => {
    try {
        const db = readDB();
        if (!db.ita) db.ita = [];
        const index = db.ita.findIndex(i => i.id === parseInt(req.params.id));
        if (index !== -1) {
            db.ita[index] = { ...db.ita[index], ...req.body };
            writeDB(db);
            res.json(db.ita[index]);
        } else { res.status(404).json({ error: 'Not found' }); }
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/ita/:id', (req, res) => {
    try {
        const db = readDB();
        db.ita = (db.ita || []).filter(i => i.id !== parseInt(req.params.id));
        writeDB(db);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});


// Specialized Stats
app.get('/api/stats', (req, res) => {
    try { res.json(readDB().stats); } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/services', (req, res) => {
    try { res.json(readDB().services); } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// Upload File Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
