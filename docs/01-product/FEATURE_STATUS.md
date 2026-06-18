# PocketNote Feature Status

สถานะการพัฒนาของโครงการ (อัปเดตล่าสุด: 18 มิถุนายน 2026)

## 📌 สถานะปัจจุบัน (Current Phase)
เราเสร็จสิ้นการปรับปรุง **API Modules (Sprint 1)** ให้สอดคล้องกับโครงสร้างฐานข้อมูลใหม่ (v2) เรียบร้อยแล้ว 

ขณะนี้ระบบรองรับการจัดการฟีเจอร์หลัก (Income, Expense, Transfer, Adjustment) และระบบความปลอดภัยของข้อมูล (Soft Delete) ในระดับ API พร้อมลุยขั้นต่อไปคือการจัดการข้อมูลเริ่มต้นและการเชื่อมต่อกับ Frontend

---

## 🛠️ สิ่งที่ทำเสร็จแล้ว (Completed)

### 1. เอกสารโครงการ (Documentation) - ครบ 100%
- [x] วิสัยทัศน์และขอบเขต MVP (`PRODUCT_VISION.md`, `PRD.md`)
- [x] กฎทางธุรกิจและโมเดลข้อมูล (`BUSINESS_RULES.md`, `DOMAIN_MODEL.md`)
- [x] สถาปัตยกรรม (Online-First + Guest Mode) (`ARCHITECTURE.md`)
- [x] ข้อกำหนด API และมาตรฐานโค้ด (`API_SPEC.md`, `CODING_STANDARD.md`)

### 2. โครงสร้างฐานข้อมูล (Database)
- [x] ออกแบบและแก้ไข `prisma/schema.prisma` ใหม่ทั้งหมด
- [x] รัน Migration สำเร็จ
- [x] รองรับ Soft Delete, Transfer, Adjustment และระบบ Profile ใหม่

### 3. การปรับปรุง API Modules (Sprint 1)
- [x] **Asset Module:** รองรับ Soft Delete และฟิลด์ใหม่ (color, icon, isArchived)
- [x] **Category Module:** รองรับ Soft Delete และฟิลด์ isSystem
- [x] **Transaction Module:** 
    - รวม Logic การสร้างรายการแบบ Unified (Income, Expense, Transfer, Adjustment)
    - รองรับระบบ **Transfer** (โอนเงินข้ามบัญชี)
    - รองรับระบบ **Adjustment** (ปรับยอดเงิน)
    - รองรับ Soft Delete
- [x] **Summary Module:** ปรับปรุงให้รองรับการกรองข้อมูลที่ถูกลบ (Soft Delete)

---

## 🚀 สิ่งที่ต้องทำต่อไป (Next Actions)

### 1. ข้อมูลเริ่มต้น (System Data) - ครบ 100%
- [x] สร้าง Script สำหรับ Seed หมวดหมู่เริ่มต้น (อาหาร, เดินทาง ฯลฯ) ลงในฐานข้อมูล เพื่อให้ผู้ใช้ใหม่ใช้งานได้ทันที
- [x] ย้ายรายการหมวดหมู่เริ่มต้นไปไว้ใน `common/constants` เพื่อให้ใช้ร่วมกันได้ทั้งระบบ

### 2. สร้าง Guest Sync Endpoint
- [ ] เพิ่ม Endpoint `POST /auth/sync-guest` ใน Auth Module เพื่อรับข้อมูลจาก LocalStorage ขึ้น DB

### 3. Frontend & Guest Sync
- [ ] พัฒนาระบบ Guest Mode ใน `apps/web` (Zustand + LocalStorage) ให้เก็บข้อมูลตามโครงสร้าง Domain ใหม่
- [ ] เชื่อมต่อ API ใหม่เข้ากับ TanStack Query และแสดงผลข้อมูลจาก Backend

---

**💡 สรุปสถานะ:** 
Backend Logic พื้นฐานเสร็จสมบูรณ์แล้ว พร้อมสำหรับการสร้าง Seed Data และพัฒนา API ส่วนที่เหลือ (Sync) รวมถึงการเริ่มทำ UI ฝั่ง Frontend ให้เชื่อมต่อกับระบบใหม่นี้ครับ
