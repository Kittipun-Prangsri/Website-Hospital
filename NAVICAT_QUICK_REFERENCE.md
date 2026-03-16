# MySQL Quick Reference - Navicat Setup

## 📌 **ชั้นตอนสร้าง Connection ใน Navicat**

### 1️⃣ **เปิด Navicat**
   - ไปที่ **Connection** → **MySQL**

### 2️⃣ **กรอกข้อมูล Connection**
```
Connection Name:    Hospital-Linux
Host Name:          192.168.x.x (IP ของ AlmaLinux Server)
Port:               3306
User Name:          hospital_user
Password:           strong_password_here
Database:           hospital_db
```

### 3️⃣ **Test Connection**
   - คลิก **Test Connection** ปุ่มเพื่อตรวจสอบ

### 4️⃣ **เชื่อมต่อ**
   - คลิก **OK** เพื่อสร้าง Connection

---

## 📋 **Import SQL Schema (สร้าง Table)**

### **วิธีที่ 1: Copy-Paste SQL**
1. ใน Navicat, คลิกขวา Connection ที่สร้าง
2. เลือก **New Query**
3. Copy SQL ทั้งหมดจาก `server/migrate.sql`
4. Paste ลงใน Query Editor
5. คลิก **Run** ปุ่ม (หรือ Ctrl+Shift+Enter)

### **วิธีที่ 2: Import SQL File**
1. คลิกขวา Connection ที่สร้าง
2. เลือก **Execute SQL File**
3. เลือกไฟล์ `server/migrate.sql`
4. คลิก **Execute**

---

## 📊 **ดู Table และ Data**

1. ขยาย Connection ที่สร้าง (คลิก **+**)
2. เลือก **hospital_db** database
3. ขยาย **Tables** folder
4. ดับเบิล-คลิก table เพื่อดู data

---

## 🔑 **Tables ที่สร้าง**

| ชื่อ Table | เนื้อหา |
|---------|--------|
| users | ข้อมูลผู้ใช้ระบบ |
| services | บริการของโรงพยาบาล |
| news | ข่าวสารและประกาศ |
| activities | กิจกรรม |
| median_prices | ค่าใช้บริการ |
| jobs | ประกาศรับสมัครงาน |
| academic_docs | เอกสารวิชาการ |
| appointments | การนัดหมาย |
| bidding | ข้อมูลการซื้อจ้าง |
| ita | ข้อมูล ITA |
| stats | สถิติ |

---

## 🔐 **MySQL User Permissions**

สร้าง User ที่สามารถเข้าจากระยะไกล:

```sql
-- เข้า MySQL Server
mysql -u root -p

-- Create User
CREATE USER 'hospital_user'@'%' IDENTIFIED BY 'strong_password';

-- Grant Permissions
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'%';

-- Apply Changes
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

---

## 🌐 **Firewall Settings (AlmaLinux)**

```bash
# Allow MySQL Port
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload

# Check Status
sudo firewall-cmd --list-ports
```

---

## 🔧 **.env Configuration Example**

```env
DB_HOST=192.168.1.100
DB_PORT=3306
DB_USER=hospital_user
DB_PASSWORD=strong_password_here
DB_NAME=hospital_db
SERVER_PORT=5000
```

---

## 📱 **เปลี่ยน Server ไป MySQL**

Update หมวด scripts ใน `package.json`:

```json
"scripts": {
  "server": "node server/server-mysql.js"
}
```

---

## ✅ **Test Endpoints**

```bash
# Check Server Health
curl http://localhost:5000/api/health

# Output
{"status":"OK","database":"MySQL"}
```

---

## 📝 **Notes**

- ✅ ต้อง MySQL Server ทำงานบน AlmaLinux Server ก่อน
- ✅ ต้องมี Network Connection ระหว่าง Windows กับ AlmaLinux Server
- ✅ Firewall ต้องอนุญาต Port 3306
- ✅ ตรวจสอบ Username/Password ถูกต้อง
- ✅ Database Charset = utf8mb4 (รองรับ Thai Characters)

---

**Last Updated**: 2025-03-16
