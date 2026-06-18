# Database Schema

## Overview
ฐานข้อมูลของ PocketNote ออกแบบมาเพื่อรองรับระบบบัญชีแบบ Event-driven โดยยึด Transaction เป็นหัวใจหลักในการคำนวณยอดเงิน (Balance)

---

## Tables Specification

### `User`
- `id`: UUID (PK)
- `email`: String (Unique)
- `password`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### `Profile`
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `displayName`: String
- `avatarUrl`: String (Optional)
- `currency`: String (Default: 'THB')
- `language`: String (Default: 'th')
- `timezone`: String (Default: 'Asia/Bangkok')

### `Asset`
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `name`: String
- `type`: Enum (CASH, BANK, E_WALLET, INVESTMENT, CRYPTO, OTHER)
- `color`: String
- `icon`: String
- `isArchived`: Boolean (สำหรับการซ่อนจาก UI แบบปกติ)
- `deletedAt`: DateTime (Optional, สำหรับ Soft Delete)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### `Category`
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `name`: String
- `type`: Enum (INCOME, EXPENSE)
- `icon`: String
- `color`: String
- `isSystem`: Boolean (สำหรับหมวดหมู่เริ่มต้น)
- `deletedAt`: DateTime (Optional, สำหรับ Soft Delete)
- `createdAt`: DateTime

### `Transaction`
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `assetId`: UUID (FK -> Asset.id)
- `categoryId`: UUID (FK -> Category.id, Optional สำหรับ Transfer/Adjustment)
- `toAssetId`: UUID (FK -> Asset.id, สำหรับ Transfer เท่านั้น)
- `type`: Enum (INCOME, EXPENSE, TRANSFER, ADJUSTMENT)
- `amount`: Decimal (ต้องเป็นค่าบวกเสมอ, สำหรับ ADJUSTMENT การเพิ่ม/ลดจะถูกจัดการด้วย Business Logic)
- `note`: String (Optional)
- `date`: DateTime
- `deletedAt`: DateTime (Optional, สำหรับ Soft Delete)
- `createdAt`: DateTime
- `updatedAt`: DateTime

---

## Indices & Constraints
- `User.email`: Unique Index
- `Transaction.userId`, `Transaction.assetId`, `Transaction.date`: Compound/Separate Indices เพื่อความเร็วในการ Query รายเดือนและตามบัญชี
- `Asset.userId`, `Category.userId`: เพื่อความเร็วในการดึงข้อมูลส่วนตัวของผู้ใช้
