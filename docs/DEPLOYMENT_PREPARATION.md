# FindMyTang - Deployment Preparation & Readiness Checklist

(สรุปความพร้อมของระบบและขั้นตอนการเตรียมตัวสำหรับ Deployment)

**วันที่บันทึก:** 25 กรกฎาคม 2026  
**สถานะภาพรวมความพร้อม:** ~80% - 85% (ฟีเจอร์หลักพร้อมใช้งาน 100%, เหลือขั้นตอน Infra/Deployment)

---

## 📊 1. ภาพรวมสถานะปัจจุบัน (Completed Features)

ระบบหลักใน **Sprint 0 ถึง Sprint 4** พัฒนาเสร็จสิ้นสมบูรณ์และผ่านการทดสอบ UI/UX แล้ว:

- **Sprint 0 (Foundation):** Next.js, Tailwind CSS, NestJS, PostgreSQL & Prisma, Auth Module (JWT)
- **Sprint 1 (Asset & Category Core):** ระบบจัดการสินทรัพย์, หมวดหมู่รายรับ-รายจ่าย, การบันทึกธุรกรรมพื้นฐาน
- **Sprint 2 (Journal & Advanced Transactions):** ระบบโอนเงินข้ามบัญชี (Transfer), ปรับปรุงยอด (Adjustment), Guest Sync & Merge UI, หน้า Timeline/Calendar
- **Sprint 3 (Home Dashboard):** คำนวณสินทรัพย์รวม, สรุปกระแสเงินสดสุทธิ (Net Flow), รายการธุรกรรมล่าสุด
- **Sprint 4 (Analytics & Insights):** กราฟวงกลมแยกหมวดหมู่, สัดส่วนสินทรัพย์, แนวโน้มรายเดือน, ระบบ Drill-down รายละเอียด
- **UI/UX Refactoring:** Animate UI Motion Tab, Bottom Sheet Form สำหรับ Web Mobile, Radix Dropdown Menu และ Micro-interactions

---

## 🚀 2. รายการสิ่งที่ต้องทำก่อนขึ้นระบบจริง (Deployment Readiness Checklist)

รายการงานที่เหลืออีก 15% - 20% เพื่อเตรียมพร้อมสำหรับการ Deploy ขึ้น Production:

### Phase A: การตรวจสอบความพร้อมของโค้ด (Build Verification)

- [x] ทดสอบรัน Build ฝั่ง Frontend (`cd apps/web && npm run build`) เพื่อตรวจสอบ TypeScript และ Compile Errors (แก้ไขปัญหา `tw-animate-css` เรียบร้อย)
- [x] ทดสอบรัน Build ฝั่ง Backend (`cd apps/api && npm run build`) เพื่อตรวจสอบ NestJS Compilation
- [x] เพิ่ม API health check (`GET /api/v1/health`) และตรวจ database readiness ผ่าน e2e

### Phase B: การเตรียมฐานข้อมูล Cloud (Database Infrastructure)

- [x] เลือก Provider สำหรับจัดเก็บ PostgreSQL: Supabase
- [ ] ตั้งค่า Connection String และทดสอบรัน Prisma Migration บน Cloud DB (`npm run db:migrate`) โดยใช้ `apps/api/prisma.config.ts`
- [x] จัดเตรียม Seed Data หรือ Initial Category Setup สำหรับผู้ใช้ใหม่ (`npm run db:seed`)

### Phase C: การติดตั้งระบบขึ้น Cloud Hosting (App Deployment)

- [ ] **Frontend Deployment (`apps/web`):**
  - [x] เลือก Hosting: Vercel
  - เชื่อมต่อ Repository สำหรับ Auto-Deployment (CI/CD)
- [ ] **Backend Deployment (`apps/api`):**
  - [x] เลือก Hosting: Render
  - ตั้งค่า Health Check Endpoint และ Port

### Phase D: การตั้งค่าสภาพแวดล้อมและความปลอดภัย (Environment & Security)

- [ ] จัดทำและตรวจสอบ Environment Variables สำหรับ Production (`.env.production`):
  - `DATABASE_URL`
  - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
  - `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN`
  - `NEXT_PUBLIC_URL_BACKEND`
  - `ALLOWED_ORIGINS` (อนุญาตเฉพาะ Domain หน้าบ้าน)
  - `COOKIE_SECURE=true` และ `ALLOWED_ORIGINS` ต้องเป็น HTTPS ใน Production
  - `COOKIE_SAME_SITE=none` เมื่อใช้ Vercel Web กับ Render API คนละ site (ต้องใช้คู่กับ `COOKIE_SECURE=true`)
- [x] เปิดใช้งาน Security Headers & API Rate Limiting (Sprint 5)
- [ ] ทดสอบ End-to-End QA บนสภาพแวดล้อม Staging/Production ก่อนเปิดใช้งานจริง

### Phase E: Pre-deploy Gate & Post-deploy Verification

- [x] เพิ่ม GitHub Actions ที่ `.github/workflows/ci.yml` สำหรับ Web lint/test/build และ API migration/build/unit/e2e
- [x] API lint ผ่านโดยใช้ test-only rule override และไม่แก้ไฟล์อัตโนมัติ
- [x] เพิ่ม [Operations Runbook](./OPERATIONS.md) สำหรับ backup/restore และ incident recovery
- [ ] ยืนยัน CI ผ่านบน GitHub repository จริง (workflow รองรับ `main`, `master`, `developer` และ manual `workflow_dispatch`)
- [ ] ตรวจ API health และ Web root บน staging domain จริง

## 4. Provider Deployment Handoff

ใช้ลำดับนี้สำหรับ Staging และทำซ้ำกับ Production หลังตรวจข้อมูลและ secrets แล้ว:

### 4.1 Supabase PostgreSQL

1. สร้าง database แยกสำหรับ Staging และเก็บ `DATABASE_URL` ไว้ใน secret manager ของ API host
2. จากโฟลเดอร์ `apps/api` รัน:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. ตรวจด้วย `npm run db:status` ต้องรายงานว่า database schema up to date
4. ห้ามใช้ `prisma db push` กับ Staging/Production

### 4.2 Render API

- **Root directory:** `apps/api`
- **Build command:** `npm ci && npm run build`
- **Start command:** `npm run start:prod`
- **Health check path:** `/api/v1/health`
- **Port:** ใช้ค่าจาก `$PORT` ที่ Render ส่งให้แอป
- ตั้งค่าตัวแปร production ตาม environment contract ในหัวข้อด้านบน ใน Render secret environment เท่านั้น
- รัน migration เป็นขั้นตอนที่ตรวจสอบได้ก่อนเปิด traffic ใหม่ ไม่ฝัง secret ลงใน build log

### 4.3 Vercel Web

- **Root directory:** `apps/web`
- **Build command:** `npm run build`
- **Required public variable:**
  - `NEXT_PUBLIC_URL_BACKEND=https://<render-api-domain>/api/v1`
- ไม่ใส่ `DATABASE_URL`, JWT secret, cookie secret หรือ Supabase service-role key ใน Vercel
- ตั้งค่า API `ALLOWED_ORIGINS` ให้ตรงกับ Web domain แบบ `https://` แล้ว redeploy API

### 4.4 Release order

1. Run GitHub Actions pre-deploy gate
2. Apply Supabase migration and seed
3. Deploy Render API and wait for `/api/v1/health` to report database `ok`
4. Deploy Vercel Web with `NEXT_PUBLIC_URL_BACKEND`
5. ตรวจ API health (`/api/v1/health`) และ Web root ด้วย `curl`
6. Run Critical User Flow QA and record the release result

---

## 💬 3. ประเด็นสำหรับหารือร่วมกันในครั้งถัดไป (Discussion Points)

1. **การเลือก Hosting & Infrastructure Provider:**
   - สรุปการเลือกบริการ Cloud DB และ Backend Host ที่เหมาะสมกับงบประมาณและ Scale ของแอป (เช่น Vercel + Supabase/Render)
2. **Domain Name & SSL:**
   - การจัดเตรียม Custom Domain Name และการตั้งค่า HTTPS/SSL Certificate
3. **ยุทธศาสตร์การเปิดตัว (Release Strategy):**
   - การเปิดทดสอบ Beta/Staging แบบจำกัดจำนวนผู้ใช้ ก่อนเปิด Launch เป็น Public Production
