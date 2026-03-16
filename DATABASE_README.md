# Hospital Database README - MySQL Integration

## 📚 ข้อมูลสำคัญ

โปรเจ็คนี้ได้ทำการปรับปรุงระบบฐานข้อมูล จาก **JSON File (db.json)** ไปเป็น **MySQL Database** เพื่อให้เหมาะสมกับการใช้บน Linux AlmaLinux 9.6

---

## 📁 ไฟล์ที่เพิ่มเติม/แก้ไข

### ไฟล์ใหม่:
1. **`server/server-mysql.js`** - Server API ที่ใช้ MySQL (แทนที่ JSON)
2. **`server/db.js`** - MySQL Connection Pool Config
3. **`server/migrate.sql`** - SQL Schema สำหรับสร้าง Tables
4. **`server/migrate-data.js`** - Script โอนข้อมูล JSON → MySQL
5. **`.env.example`** - Template Environment Variables
6. **`MYSQL_SETUP_GUIDE.md`** - คำแนะนำการตั้งค่า MySQL
7. **`NAVICAT_QUICK_REFERENCE.md`** - ไกด์ใช้ Navicat CLI

### ไฟล์ที่แก้ไข:
- **`package.json`** - เพิ่ม dependency `mysql2`

---

## 🚀 **เริ่มต้นใช้งาน**

### ขั้นตอนที่ 1: สำหรับ Linux Server (AlmaLinux 9.6)
ตามดู [**MYSQL_SETUP_GUIDE.md**](./MYSQL_SETUP_GUIDE.md)

### ขั้นตอนที่ 2: ตั้งค่า `.env` File
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```env
DB_HOST=192.168.x.x        # IP ของ AlmaLinux Server
DB_PORT=3306
DB_USER=hospital_user
DB_PASSWORD=your_password
DB_NAME=hospital_db
SERVER_PORT=5000
```

### ขั้นตอนที่ 3: ติดตั้ง Dependencies
```bash
npm install
```

### ขั้นตอนที่ 4: Migrate Data (ถ้าต้อง)
```bash
node server/migrate-data.js
```

### ขั้นตอนที่ 5: เปลี่ยน Server เป็น MySQL Version
ใน `package.json` แก้ไข script:
```json
"scripts": {
  "server": "node server/server-mysql.js"
}
```

### ขั้นตอนที่ 6: เริ่มใช้งาน
```bash
npm run dev-all
```

---

## 📊 **Database Schema**

### Tables ที่สร้าง:

| ชื่อ | เนื้อหา | สำเร็จ |
|------|--------|------|
| `users` | ข้อมูลผู้ใช้ | ✅ |
| `services` | บริการโรงพยาบาล | ✅ |
| `news` | ข่าวสาร | ✅ |
| `activities` | กิจกรรม | ✅ |
| `median_prices` | ค่าใช้บริการ | ✅ |
| `jobs` | รับสมัครงาน | ✅ |
| `academic_docs` | เอกสารวิชาการ | ✅ |
| `appointments` | การนัดหมาย | ✅ |
| `bidding` | ซื้อจ้าง | ✅ |
| `ita` | ข้อมูล ITA | ✅ |
| `stats` | สถิติ | ✅ |

---

## 🔌 **API Endpoints**

ยังคงใช้ endpoints เดิมทั้งหมด:

### Users (Authentication)
- `POST /api/login` - เข้าสู่ระบบ
- `POST /api/register` - ลงทะเบียน
- `GET /api/users` - ดูรายชื่อผู้ใช้ทั้งหมด
- `PUT /api/users/:id` - แก้ไขผู้ใช้
- `DELETE /api/users/:id` - ลบผู้ใช้

### CRUD Endpoints
- `GET /api/news` - ดูข่าว
- `POST /api/news` - เพิ่มข่าว
- `PUT /api/news/:id` - แก้ไขข่าว
- `DELETE /api/news/:id` - ลบข่าว

(เช่นเดียวกันสำหรับ: `services`, `activities`, `median-prices`, `jobs`, `academic-docs`, `appointments`, `bidding`, `ita`, `stats`)

### Special
- `POST /api/upload` - อัปโหลดไฟล์
- `GET /api/health` - ตรวจสอบสถานะ (MySQL ใหม่)

---

## 🔧 **Configuration Files**

### `.env` (สร้างจาก `.env.example`)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=hospital_user
DB_PASSWORD=strong_password
DB_NAME=hospital_db
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SERVER_PORT=5000
```

### `package.json` dependencies
```json
{
  "mysql2": "^3.6.0"
}
```

---

## 🔐 **Security Notes**

1. **ไม่ควร commit** ไฟล์ `.env` ที่มี password จริง
2. ใช้ **strong password** สำหรับ MySQL user
3. ให้ **Firewall เข้มงวด** - เปิด port 3306 เฉพาะ IPs ที่ต้อง
4. ปิด `db.json` file เก่า หลังจากโอนข้อมูล (ถ้าต้องการ)

---

## 📞 **Troubleshooting**

### ❌ MySQL Connection Error
```bash
# ตรวจสอบ MySQL Server ทำงาน
sudo systemctl status mysqld

# Restart
sudo systemctl restart mysqld
```

### ❌ Permission Denied
- ตรวจสอบ DB_USER และ DB_PASSWORD ใน `.env`
- Verify user permissions:
  ```sql
  GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### ❌ Connection Refused on Windows
- ตรวจสอบ Firewall on AlmaLinux
- ให้ port 3306 เปิด:
  ```bash
  sudo firewall-cmd --permanent --add-port=3306/tcp
  sudo firewall-cmd --reload
  ```

---

## 📖 **Reference Documents**

- [🔗 MYSQL_SETUP_GUIDE.md](./MYSQL_SETUP_GUIDE.md) - คำแนะนำติดตั้ง MySQL
- [🔗 NAVICAT_QUICK_REFERENCE.md](./NAVICAT_QUICK_REFERENCE.md) - ไกด์ Navicat

---

## 🎯 **Next Steps**

1. ✅ Single Click MySQL Setup บน AlmaLinux ✓
2. ✅ Create Tables ใน Navicat ✓
3. ✅ Configure .env ✓
4. ✅ รัน Migration ✓
5. ✅ Start Server ✓
6. ✅ Test Endpoints ✓

---

**Last Updated**: March 16, 2025  
**Version**: 1.0  
**Status**: Ready for Production

---

## 📞 For Questions or Support

- Ensure MySQL Server is running on AlmaLinux
- Check network connectivity between Windows and Linux Server
- Verify credentials in `.env` file
- Check Firewall permissions on Linux
