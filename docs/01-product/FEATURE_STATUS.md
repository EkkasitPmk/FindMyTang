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

### 4. Frontend & Shared Core Fixes
- [x] แก้ไข TypeScript Lint Error ใน HTTP Client (`apps/web/src/shared/lib/api/http.ts`) โดยเปลี่ยน `any` เป็น `unknown` เพื่อความปลอดภัยของประเภทข้อมูล
- [x] ปรับปรุง HTTP Client ให้ใช้ `throw error` แทน `Promise.reject(error)` และลบ Promise catch block ที่ซ้ำซ้อนออก เพื่อความสะอาดและสอดคล้องกับมาตรฐาน async/await
- [x] แก้ไข TypeScript/ESLint Warning ใน Auth Module (`apps/api/src/modules/auth/controllers/auth.controller.ts`) เรื่อง "Unsafe return of a value of type error" โดยระบุชนิดข้อมูลผลลัพธ์ของ `syncGuest` ทั้งใน Service และ Controller อย่างชัดเจน (`Promise<{ success: boolean }>`)
- [x] **แก้ไขบั๊ก API Calls ใน Guest Mode:** สร้าง `useIsGuest` hook เพื่อรอให้ Zustand Store ทำการ Hydrate สถานะจาก LocalStorage ให้เสร็จสิ้นก่อน และอัปเดต Query Hooks ทั้งหมด (`useMeQuery`, `useAssets`, `useTransactionsQuery`, `useTodaySummary`, `useCategories`) ให้ใช้ `useIsGuest` เพื่อระงับการเรียก API ทุกตัวเมื่ออยู่ในโหมด Guest ป้องกันการเกิด HTTP 401 (Unauthorized) และ /auth/refresh 401 บน Web Console อย่างเด็ดขาด
- [x] แก้ไข TypeScript Type Error ใน Category Hook (`apps/web/src/features/category/hooks/category.hook.ts`) โดยเพิ่มฟิลด์ `userId`, `createdAt`, และ `updatedAt` ใน `mockResponse` สำหรับสร้าง Category ในโหมด Guest ให้ครบถ้วนตามประเภทข้อมูล `Category`
- [x] แก้ไข TypeScript Type Error ใน Asset Hook (`apps/web/src/features/assets/hooks/assets.hook.ts`) โดยกำหนดค่าเริ่มต้น fallback ให้กับฟิลด์ `balance` (`?? 0`) และ `currency` (`?? "THB"`) เมื่อสร้างข้อมูลจำลองในโหมด Guest
- [x] แก้ไข TypeScript Type Error ใน Asset Type (`apps/web/src/features/assets/types/assets.type.ts`) โดยการเพิ่มฟิลด์ `createdAt` และ `updatedAt` ใน `CreateAssetResponse` และ `Asset` interfaces เพื่อให้สอดคล้องกับ Database Schema และรองรับการ Mock ข้อมูลจำลอง
- [x] **ปรับปรุง Layout และระบบ Navigation:** แก้ไขปัญหาการนำเข้าไฟล์ที่ไม่สอดคล้องกัน (Case-Sensitive Mismatch) ใน `layout.tsx` และย้ายการทำงานของระบบนำทาง (เช่น `DesktopSidebar`, `MobileDrawer`, `MobileBottomNav`, `LogoutConfirmModal`) มารวมไว้ภายใต้ `NavContainer` เพื่อเชื่อมต่อสถานะ `mobileMenuOpen` ร่วมกัน แก้ไขบั๊ก Mobile Drawer ไม่เปิดเมื่อคลิกเมนู More บนโทรศัพท์มือถือ พร้อมปรับเปลี่ยน `LayoutAppMainContainer` ให้ทำงานเป็น Server Component แบบสมบูรณ์เพื่อความรวดเร็วและสะอาดตามแนวทาง Feature-Based Architecture
- [x] **แยก Presentation Component และ Container Logic ในระบบ Navigation:** ย้าย side-effects logic (เช่น `useEffect` สำหรับดักจับการกดปุ่ม `Escape` และการควบคุม overflow ของ `document.body`) ออกจากตัว UI Component `LogoutConfirmModal` ไปอยู่ที่ `NavContainer` เพื่อให้ UI Component เป็น Pure Presentation Component ตามกฎ `apps/web/AGENTS.md` และแยก logic ที่ไม่จำเป็นออกไปอย่างสมบูรณ์
- [x] **ปรับปรุง Layout ของ Mobile Bottom Navigation:** เปลี่ยนการจัดเลย์เอาต์ของเมนูนำทางด้านล่างบนมือถือ (`MobileBottomNav`) จากการใช้ Flexbox (`flex justify-between sm:justify-around`) มาเป็น Grid Layout (`grid grid-cols-5 justify-items-center`) เพื่อแก้ปัญหาระยะห่างปุ่มไม่เท่ากัน ให้ปุ่มทั้ง 5 ปุ่มแบ่งความกว้าง 20% เท่ากันพอดีบนทุกขนาดหน้าจอ

---

## 🚀 สิ่งที่ต้องทำต่อไป (Next Actions)

### 1. ข้อมูลเริ่มต้น (System Data) - ครบ 100%
- [x] สร้าง Script สำหรับ Seed หมวดหมู่เริ่มต้น (อาหาร, เดินทาง ฯลฯ) ลงในฐานข้อมูล เพื่อให้ผู้ใช้ใหม่ใช้งานได้ทันที
- [x] ย้ายรายการหมวดหมู่เริ่มต้นไปไว้ใน `common/constants` เพื่อให้ใช้ร่วมกันได้ทั้งระบบ
- [x] ปรับปรุงรายการหมวดหมู่เริ่มต้น (`DEFAULT_CATEGORIES`) ใน backend ใหม่ เพื่อเปลี่ยนชื่อ, ไอคอน, สี (รวมถึง teal color `#42D2C1`) และลำดับการแสดงผล (displayOrder) ของแต่ละรายการให้สอดคล้องกัน

### 2. สร้าง Guest Sync Endpoint
- [x] เพิ่ม Endpoint `POST /auth/sync-guest` ใน Auth Module เพื่อรับข้อมูลจาก LocalStorage ขึ้น DB
- [x] ออกแบบ `SyncGuestDto` เพื่อรองรับการแมป Client-side ID กับ Server-side ID
- [x] พัฒนา Sync Logic ใน `AuthService` โดยใช้ Transaction เพื่อความถูกต้องของข้อมูล

### 3. Frontend & Guest Sync
- [x] พัฒนาระบบ Guest Mode ใน `apps/web` (Zustand + LocalStorage) ให้เก็บข้อมูลตามโครงสร้าง Domain ใหม่
- [x] สร้าง Zustand Store (`useGuestStore`) พร้อมระบบ Persist ลง LocalStorage สำหรับ Asset, Category และ Transaction
- [x] พัฒนา `useSyncGuestMutation` สำหรับการซิงค์ข้อมูล Guest ขึ้น Backend
- [x] **แยกการทำงาน Guest Mode:** ปรับปรุง Hook และ Container ให้ทำงานแบบ Local-only เมื่ออยู่ในโหมด Guest โดยไม่เรียก API แต่ยังคงความสามารถในการจัดการข้อมูลได้ครบถ้วน
- [ ] เชื่อมต่อ API ใหม่เข้ากับ TanStack Query และแสดงผลข้อมูลจาก Backend ในหน้า UI ต่างๆ

---

**💡 สรุปสถานะ:** 
Backend Logic พื้นฐานเสร็จสมบูรณ์แล้ว พร้อมสำหรับการสร้าง Seed Data และพัฒนา API ส่วนที่เหลือ (Sync) รวมถึงการเริ่มทำ UI ฝั่ง Frontend ให้เชื่อมต่อกับระบบใหม่นี้ครับ
