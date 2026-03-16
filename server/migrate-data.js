import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

// Connect to MySQL
const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_db'
});

// Read JSON data
const DB_PATH = path.join(process.cwd(), 'server', 'db.json');
const jsonData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

console.log('Starting data migration from JSON to MySQL...\n');

try {
    // Migrate Users
    if (jsonData.users) {
        console.log('Migrating users...');
        for (const user of jsonData.users) {
            await connection.query(
                'INSERT INTO users (id, username, password, email, role, status, permissions, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [user.id, user.username, user.password, user.email, user.role || 'staff', user.status || 'pending', JSON.stringify(user.permissions || ['read']), user.image || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.users.length} users`);
    }

    // Migrate Services
    if (jsonData.services) {
        console.log('Migrating services...');
        for (const service of jsonData.services) {
            await connection.query(
                'INSERT INTO services (id, icon, title, description, color) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [service.id, service.icon || '', service.title, service.desc || service.description || '', service.color || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.services.length} services`);
    }

    // Migrate News
    if (jsonData.news) {
        console.log('Migrating news...');
        for (const news of jsonData.news) {
            await connection.query(
                'INSERT INTO news (id, title, description, image, tag, date, pdfUrl, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [news.id, news.title || '', news.desc || news.description || '', news.image || '', news.tag || '', news.date || '', news.pdfUrl || '', news.deadline || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.news.length} news articles`);
    }

    // Migrate Activities
    if (jsonData.activities) {
        console.log('Migrating activities...');
        for (const activity of jsonData.activities) {
            await connection.query(
                'INSERT INTO activities (id, title, description, image, date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [activity.id, activity.title || '', activity.description || '', activity.image || '', activity.date || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.activities.length} activities`);
    }

    // Migrate Median Prices
    if (jsonData.medianPrices) {
        console.log('Migrating median prices...');
        for (const price of jsonData.medianPrices) {
            await connection.query(
                'INSERT INTO median_prices (id, name, price, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [price.id, price.name || '', price.price || 0, price.description || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.medianPrices.length} median prices`);
    }

    // Migrate Jobs
    if (jsonData.jobs) {
        console.log('Migrating jobs...');
        for (const job of jsonData.jobs) {
            await connection.query(
                'INSERT INTO jobs (id, position, department, description, requirements, salary, deadline) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [job.id, job.position || '', job.department || '', job.description || '', job.requirements || '', job.salary || '', job.deadline || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.jobs.length} job postings`);
    }

    // Migrate Academic Docs
    if (jsonData.academicDocs) {
        console.log('Migrating academic documents...');
        for (const doc of jsonData.academicDocs) {
            await connection.query(
                'INSERT INTO academic_docs (id, title, category, url, author, date) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [doc.id, doc.title || '', doc.category || '', doc.url || '', doc.author || '', doc.date || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.academicDocs.length} academic documents`);
    }

    // Migrate Appointments
    if (jsonData.appointments) {
        console.log('Migrating appointments...');
        for (const apt of jsonData.appointments) {
            await connection.query(
                'INSERT INTO appointments (id, patient_name, email, phone, department, appointment_date, appointment_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [apt.id, apt.patient_name || '', apt.email || '', apt.phone || '', apt.department || '', apt.appointment_date || '', apt.appointment_time || '', apt.notes || '', apt.status || 'pending']
            );
        }
        console.log(`✓ Migrated ${jsonData.appointments.length} appointments`);
    }

    // Migrate Bidding
    if (jsonData.bidding) {
        console.log('Migrating bidding records...');
        for (const bid of jsonData.bidding) {
            await connection.query(
                'INSERT INTO bidding (id, project_name, description, budget, deadline, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [bid.id, bid.project_name || '', bid.description || '', bid.budget || 0, bid.deadline || '', bid.status || 'open']
            );
        }
        console.log(`✓ Migrated ${jsonData.bidding.length} bidding records`);
    }

    // Migrate ITA
    if (jsonData.ita) {
        console.log('Migrating ITA records...');
        for (const ita of jsonData.ita) {
            await connection.query(
                'INSERT INTO ita (id, title, year, description, amount, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE updated_at=NOW()',
                [ita.id, ita.title || '', ita.year || 0, ita.description || '', ita.amount || 0, ita.status || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.ita.length} ITA records`);
    }

    // Migrate Stats
    if (jsonData.stats) {
        console.log('Migrating stats...');
        for (const stat of jsonData.stats) {
            await connection.query(
                'INSERT INTO stats (metric_name, metric_value, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE metric_value=VALUES(metric_value)',
                [stat.metric_name || '', stat.metric_value || 0, stat.description || '']
            );
        }
        console.log(`✓ Migrated ${jsonData.stats.length} stats records`);
    }

    console.log('\n✓ Migration completed successfully!');
    process.exit(0);
} catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
} finally {
    await connection.end();
}
