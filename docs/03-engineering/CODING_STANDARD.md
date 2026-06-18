# Coding Standard

## General Principles

- **Type Safety**: ใช้ TypeScript อย่างเคร่งครัด หลีกเลี่ยงการใช้ `any`
- **Readability**: เขียนโค้ดให้อ่านง่าย ตั้งชื่อตัวแปรและฟังก์ชันให้สื่อความหมาย
- **Consistency**: ปฏิบัติตามโครงสร้างและรูปแบบที่กำหนดไว้ในโปรเจกต์

---

## Naming Conventions

- **Variables & Functions**: `camelCase` (เช่น `totalAmount`, `calculateBalance`)
- **Classes & Types/Interfaces**: `PascalCase` (เช่น `TransactionService`, `UserDto`)
- **Files**: `kebab-case` (เช่น `transaction-form.tsx`, `asset.service.ts`)
- **Components**: `PascalCase` (เช่น `AssetCard.tsx`)

---

## Frontend Standards (Next.js)

- **Structure**: ใช้ Feature-based Architecture (แยกตามฟีเจอร์ เช่น `features/assets`, `features/transactions`)
- **Components**: แยก Presentation Component (UI) และ Container Component (Logic) เมื่อจำเป็น
- **Hooks**: ใช้ Custom Hooks สำหรับจัดการ Business Logic หรือการดึงข้อมูล
- **State**:
    - ใช้ **Zustand** สำหรับ Client State ที่ใช้ร่วมกันหลายจุด
    - ใช้ **TanStack Query** สำหรับ Server State (Data Fetching, Caching, Mutations)

---

## Backend Standards (NestJS)

- **Modular**: แยกการทำงานเป็น Module, Controller, Service
- **Validation**: ใช้ `class-validator` และ `Zod` สำหรับการทำ Request Validation
- **DTOs**: ใช้ Data Transfer Objects สำหรับทุกการส่งข้อมูลผ่าน API
- **Error Handling**: ใช้ Built-in HTTP Exceptions ของ NestJS
- **ORM**: ใช้ Prisma อย่างเหมาะสม และจัดการ Transaction เมื่อมีการเขียนข้อมูลหลายตารางพร้อมกัน

---

## Database Standards (Prisma)

- **Naming**: ใช้ `snake_case` สำหรับชื่อ Table ใน DB แต่ใช้ `camelCase` ใน Prisma Model
- **Primary Keys**: ใช้ `UUID` หรือ `CUID` เป็นค่าเริ่มต้น
- **Relations**: นิยามความสัมพันธ์ให้ชัดเจนและใช้ `onDelete: Cascade` อย่างระมัดระวัง
