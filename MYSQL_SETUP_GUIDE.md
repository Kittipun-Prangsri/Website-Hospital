# MySQL Migration Setup Guide
## โรงพยาบาลคลองหาด Hospital - Linux AlmaLinux 9.6

---

## 📋 ขั้นตอนการติดตั้ง

### 1. **ติดตั้ง MySQL Server บน AlmaLinux 9.6**

```bash
# Update system
sudo dnf update -y

# Install MySQL Server
sudo dnf install mysql-server -y

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Initial security setup
sudo mysql_secure_installation
```

---

### 2. **สร้าง Database User และ Database**

```bash
# Connect to MySQL as root
mysql -u root -p

# Then run these commands:
CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'strong_password_here';
CREATE DATABASE hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### 3. **สร้าง Table ด้วย Navicat**

#### ติดตั้ง Navicat บน Windows:
1. ดาวน์โหลด Navicat Premium/Standard จาก https://www.navicat.com
2. ติดตั้งโปรแกรม

#### เชื่อมต่อ MySQL Server:
1. เปิด Navicat
2. คลิก **Connection** → **MySQL**
3. กรอกข้อมูล:
   - **Connection Name**: `Hospital-Linux`
   - **Host**: `192.168.x.x` (IP AlmaLinux Server)
   - **Port**: `3306`
   - **User Name**: `hospital_user`
   - **Password**: `strong_password_here`
   
4. คลิก **Test Connection** เพื่อตรวจสอบ

#### Import SQL Schema:
1. ในหน้า Navicat คลิกขวาที่ Connection ที่สร้าง → **New Query**
2. วาง SQL Script จาก `server/migrate.sql` ลงไป
3. คลิก **Run** (Ctrl+Shift+Enter)

**หรือ Import SQL File:**
1. คลิกขวา Connection → **Execute SQL File**
2. เลือก `server/migrate.sql`
3. คลิก **Execute**

---

### 4. **ตั้งค่า Environment Variable**

สร้างหรือแก้ไข `.env` ไฟล์ในโปรเจค:

```bash
# MySQLคำตั้งค่า
DB_HOST=192.168.x.x         # IP ของ AlmaLinux Server
DB_PORT=3306
DB_USER=hospital_user
DB_PASSWORD=strong_password_here
DB_NAME=hospital_db

# SMTP Configuration (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Server Port
SERVER_PORT=5000
```

---

### 5. **ติดตั้ง Dependencies**

```bash
# ติดตั้ง mysql2 driver
npm install

# หรือ ติดตั้งเฉพาะ mysql2
npm install mysql2
```

---

### 6. **Migrate Data จาก JSON ไป MySQL** (Optional)

หากต้องการโอนข้อมูลจากไฟล์ JSON เดิม:

```bash
# ตั้งแต่ที่ Folder ของโปรเจค
node server/migrate-data.js
```

---

### 7. **เปลี่ยน Server Configuration**

ในไฟล์ `package.json` แก้ไขคำสั่ง:

```json
"scripts": {
  "dev": "vite",
  "server": "node server/server-mysql.js",
  "dev-all": "concurrently \"npm run dev\" \"npm run server\"",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

### 8. **เริ่มใช้งาน**

```bash
# Run development environment
npm run dev-all

# หรือ Run server เพียงอย่างเดียว
npm run server
```

---

## 🔒 Remote Access Setup (เชื่อมต่อจาก Windows/Client เข้า AlmaLinux)

### อนุญาต Remote Connection ใน MySQL:

```bash
# SSH เข้า AlmaLinux Server
ssh user@192.168.x.x

# Connect MySQL
mysql -u root -p

# Change user permissions
ALTER USER 'hospital_user'@'localhost' IDENTIFIED BY 'strong_password';
CREATE USER 'hospital_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### ปิด Firewall (ถ้าจำเป็น):

```bash
# Allow MySQL Port
sudo firewall-cmd --permanent --add-service=mysql
sudo firewall-cmd --reload

# หรือ เพิ่ม Port โดยตรง
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

---

## 📊 ตรวจสอบ Database

### ใน Navicat:
1. คลิคขวา Connection → **Refresh**
2. คลิก **+** เพื่อขยาย Connection
3. เลือก `hospital_db`
4. ดู Tables ต่างๆ ได้ในหมวด **Tables**

### ผ่าน Terminal:

```bash
# Connect
mysql -u hospital_user -p hospital_db

# Show all tables
SHOW TABLES;

# Show table structure
DESCRIBE users;
DESCRIBE services;
```

---

## 📁 Files ที่มีการเปลี่ยนแปลง

| ไฟล์ | คำอธิบาย |
|----|--------|
| `server/server-mysql.js` | Server ใหม่ที่ใช้ MySQL แทน JSON |
| `server/db.js` | MySQL Connection Pool Configuration |
| `server/migrate.sql` | SQL Schema สำหรับสร้าง Tables |
| `server/migrate-data.js` | Script สำหรับโอนข้อมูลจาก JSON ไป MySQL |
| `.env.example` | Template ไฟล์ .env |
| `package.json` | เพิ่มดีเพนเดนซี `mysql2` |

---

## 🐛 Troubleshooting

### ❌ ไม่สามารถเชื่อมต่อ MySQL

```bash
# ตรวจสอบ MySQL Service ทำงานหรือไม่
sudo systemctl status mysqld

# เริ่มเปิด Service ใหม่
sudo systemctl restart mysqld
```

### ❌ Authentication Failed

- ตรวจสอบ Username และ Password ใน `.env`
- ลองเชื่อมต่อ Manual: `mysql -u hospital_user -p hospital_db`

### ❌ Connection Refused

- ตรวจสอบ Host IP ถูกต้องหรือไม่
- ตรวจสอบ Firewall อนุญาต Port 3306 หรือไม่
- ล็อกเข้า AlmaLinux check: `sudo netstat -tulpn | grep 3306`

---

## ✅ ตรวจสอบสถานะ API

หลังจากเริ่ม Server:

```bash
# Check health endpoint
curl http://localhost:5000/api/health

# Response
{"status":"OK","database":"MySQL"}
```

---

## 📝 Next Steps

1. ✅ ติดตั้ง MySQL บน Server
2. ✅ สร้าง Database และ User
3. ✅ Import SQL Schema ด้วย Navicat
4. ✅ ตั้งค่า `.env` ไฟล์
5. ✅ รัน Migration Script (ถ้าต้อง)
6. ✅ เปลี่ยน Server Script ไป `server-mysql.js`
7. ✅ ทดสอบ API Endpoints

---

## 📞 Support

สำหรับข้อมูลเพิ่มเติม:
- MySQL Documentation: https://dev.mysql.com/doc/
- Navicat Docs: https://www.navicat.com/en/products/navicat-for-mysql
- AlmaLinux Docs: https://almalinux.org/

---

**Created**: 2025-03-16  
**Version**: 1.0  
**Project**: Khlonghat Hospital Management System
