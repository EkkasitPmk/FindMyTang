# PocketNote Architecture

## Architecture Style

Client-Server Web Application (Online-First with Guest Mode)

---

## Frontend Stack

Framework

- Next.js (App Router)
- TypeScript

UI

- Tailwind CSS
- shadcn/ui

State Management

- Zustand (Client State & Guest Mode persistence)

Data Fetching & Server State

- TanStack Query (React Query)

Validation

- React Hook Form
- Zod

---

## Backend Stack

Framework

- NestJS

Database

- PostgreSQL

ORM

- Prisma

Authentication

- JWT (Json Web Token)

Password Hashing

- bcrypt

---

## High Level Flow

**กรณี Guest User (ยังไม่ Login)**
User → Next.js (Web Frontend) ↔ Zustand & LocalStorage (เก็บข้อมูลชั่วคราว)

**กรณี Authenticated User (Login แล้ว)**
User → Next.js (Web Frontend) → API Calls (REST) → NestJS (API Backend) → Prisma ORM → PostgreSQL (Database)

**กรณีการ Sync (Guest -> Login)**
User กด Login/Register → Web Frontend รวบรวมข้อมูลใน LocalStorage → ส่งผ่าน API `/auth/sync-guest` → NestJS บันทึกลง Database → เคลียร์ LocalStorage และเปลี่ยนเป็น Online Mode

---

## Core Principles

### API Driven (Online Mode)

การจัดการข้อมูลหลักจะผ่านระบบ API เป็นหลัก เพื่อความปลอดภัยและความถูกต้องของข้อมูลบนเซิร์ฟเวอร์

### Guest First (LocalStorage)

อนุญาตให้ผู้ใช้ใช้งานได้ทันทีโดยไม่ต้องสมัครสมาชิก โดยใช้ LocalStorage เป็นที่เก็บข้อมูลชั่วคราวบนเครื่องผู้ใช้

### Transaction Driven

ข้อมูลทางการเงินทั้งหมดจะถูกคำนวณจาก Transaction History เพื่อความแม่นยำและตรวจสอบย้อนหลังได้

---

## Initial Backend Modules

- auth: จัดการการเข้าสู่ระบบ สมัครสมาชิก และการ Sync ข้อมูลจาก Guest
- users: จัดการข้อมูลผู้ใช้และโปรไฟล์
- assets: จัดการสินทรัพย์และยอดเงินคงเหลือ
- categories: จัดการหมวดหมู่รายรับ-รายจ่าย
- transactions: จัดการรายการบันทึกทั้งหมด (Income, Expense, Transfer, Adjustment)
- analytics: ระบบประมวลผลข้อมูลเพื่อแสดงรายงาน

---

## Future Expansion

- PWA (Progressive Web App) สำหรับการใช้งานที่สะดวกบน Mobile
- Push Notifications แจ้งเตือนรายการสำคัญ
- Data Export (CSV/PDF)
- AI Spending Insights
