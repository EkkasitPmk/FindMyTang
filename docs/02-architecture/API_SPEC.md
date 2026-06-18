# API Specification

## General Information

- **Base URL**: `/api/v1`
- **Format**: JSON
- **Auth**: JWT Bearer Token in Header `Authorization: Bearer <token>`

---

## Authentication Endpoints

### POST `/auth/register`
- สมัครสมาชิกใหม่
- Body: `email`, `password`, `displayName`

### POST `/auth/login`
- เข้าสู่ระบบ
- Body: `email`, `password`
- Response: `accessToken`, `user`

### POST `/auth/sync-guest`
- ซิงค์ข้อมูลทั้งหมดจาก LocalStorage ของ Guest ขึ้น Cloud (ทำครั้งเดียวหลังสมัครสมาชิกหรือ Login ครั้งแรกที่มีข้อมูล Local)
- Body: `assets` (Array), `categories` (Array), `transactions` (Array)
- Response: Status 200 OK (ยืนยันการบันทึกสำเร็จ)

---

## User & Profile Endpoints

### GET `/me`
- ดึงข้อมูลผู้ใช้ปัจจุบันและโปรไฟล์

### PATCH `/me/profile`
- แก้ไขข้อมูลโปรไฟล์ (DisplayName, Currency, Language, Timezone)

---

## Asset Endpoints

### GET `/assets`
- รายการสินทรัพย์ทั้งหมดของผู้ใช้

### POST `/assets`
- สร้างสินทรัพย์ใหม่ (Name, Type, Initial Balance)

### PATCH `/assets/:id`
- แก้ไขข้อมูลสินทรัพย์ หรือ Archive สินทรัพย์

---

## Category Endpoints

### GET `/categories`
- รายการหมวดหมู่ทั้งหมด (แยก Income/Expense)

### POST `/categories`
- สร้างหมวดหมู่ใหม่

---

## Transaction Endpoints

### GET `/transactions`
- รายการบันทึก (รองรับ Query: month, year, assetId, type, search)

### POST `/transactions`
- บันทึกรายการใหม่
- Body: `type`, `amount`, `date`, `assetId`, `categoryId`, `note`, `toAssetId` (เฉพาะ Transfer)

### PATCH `/transactions/:id`
- แก้ไขรายการบันทึก

### DELETE `/transactions/:id`
- ลบรายการบันทึก

---

## Analytics Endpoints

### GET `/analytics/summary`
- สรุปภาพรวมสำหรับ Dashboard

### GET `/analytics/categories`
- สรุปยอดตามหมวดหมู่ในช่วงเวลาที่กำหนด

### GET `/analytics/trends`
- ข้อมูลแนวโน้มรายรับ-รายจ่ายรายเดือน
