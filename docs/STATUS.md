# PocketNote - Development Status & Roadmap (แผนงานและสถานะการพัฒนา)

เอกสารนี้ใช้สำหรับติดตามสถานะการพัฒนาของโครงการในแต่ละ Sprint และบันทึกสิ่งที่ดำเนินการเสร็จสิ้นแล้ว รวมถึงแผนงานขั้นตอนต่อไป (Next Actions)

---

## 📅 แผนงานหลัก (Project Roadmap)

### Sprint 0: วางโครงรากฐานระบบ (Foundation) - ✅ สำเร็จ 100%
*   **Frontend**: ตั้งค่า Next.js, Tailwind CSS, shadcn/ui, Zustand, และ TanStack Query รวมถึงโครงสร้างการแสดงผล Layout & Navigation (Responsive)
*   **Backend**: ตั้งค่า NestJS, PostgreSQL & Prisma, โครงสร้าง Module พื้นฐาน และระบบล็อกอิน/สมัครสมาชิก (Auth Module)

### Sprint 1: ระบบสินทรัพย์ หมวดหมู่ และรายการพื้นฐาน (Transaction & Asset Core) - 🔄 กำลังดำเนินการ (ปรับปรุงตาม DB Schema ใหม่)
*   **ฟีเจอร์หลัก**:
    *   ระบบจัดการสินทรัพย์ (Asset CRUD & UI) - ไม่เก็บไอคอนใน DB ใช้ไอคอนตามประเภท
    *   ระบบจัดการหมวดหมู่ (Category CRUD & UI จัดการสีและไอคอน) - *ขยับขึ้นมาจาก Sprint 5*
    *   การบันทึกรายรับ-รายจ่ายพื้นฐาน (Income/Expense Entry)
    *   การแสดงผลประวัติรายการธุรกรรมพื้นฐาน (Transaction Timeline)
*   **เป้าหมาย**: ผู้ใช้งานสามารถจัดการบัญชีสินทรัพย์ จัดการหมวดหมู่ และบันทึกรายการรายรับ-รายจ่ายพื้นฐานรายวันได้จริง

### Sprint 2: ระบบประวัติ ธุรกรรมขั้นสูง และการตั้งค่า (Journal, Advanced Transactions & Profile Settings) - 🔄 กำลังดำเนินการ
*   **ฟีเจอร์หลัก**:
    *   ระบบโอนเงินข้ามบัญชี (Transfer Transaction)
    *   ระบบปรับปรุงยอดบัญชีคงเหลือ (Balance Adjustment Transaction) - สำหรับเคลียร์ยอดเงินดื้อๆ ให้ตรงกับชีวิตจริง
    *   ระบบกลไกซิงค์ข้อมูลฝั่งหน้าบ้าน (Guest Mode Sync UI & Merge Flow) - *ขยับขึ้นมา* รองรับ Merge Popup แจ้งเตือนเมื่อมีข้อมูลเดิม และวิดเจ็ตแสดงสถานะ เช่น "Sync just Now", "Sync failed" พร้อมปุ่มกด Sync ซ้ำ
    *   ระบบจัดการโปรไฟล์ผู้ใช้ (UI/API สำหรับอัปเดต displayName, language, timezone) - *ขยับขึ้นมาจาก Sprint 5*
    *   หน้าจอประวัติธุรกรรมแบบสมบูรณ์ (Journal Timeline & Calendar View)
*   **เป้าหมาย**: ระบบจดบันทึกมีความยืดหยุ่น เชื่อมต่อการซิงค์ข้อมูล Guest สมบูรณ์ และตั้งค่าโปรไฟล์ส่วนตัวได้

### Sprint 3: หน้าจอแดชบอร์ดหลัก (Home Dashboard) - ⏳ รอดำเนินการ
*   **ฟีเจอร์หลัก**:
    *   คำนวณยอดเงินสินทรัพย์รวม (Total Assets Calculation)
    *   แดชบอร์ดแสดงสรุปรายรับ-รายจ่าย และกระแสเงินสดสุทธิ (Net Flow) ประจำเดือน
    *   รายการสินทรัพย์ล่าสุด (Recent Assets Grid)
    *   ประวัติรายการธุรกรรมล่าสุด 5 รายการ (Recent Transactions Feed)

### Sprint 4: ระบบการวิเคราะห์ข้อมูลและรายงาน (Analytics & Insights) - ⏳ รอดำเนินการ
*   **ฟีเจอร์หลัก**:
    *   รายงานสัดส่วนรายจ่ายแยกตามหมวดหมู่ (Category Breakdown Chart)
    *   รายงานสัดส่วนการกระจายสินทรัพย์ (Asset Distribution Chart)
    *   รายงานแนวโน้มทางการเงินรายเดือน (Monthly Trends)
    *   ระบบ Drill-down เพื่อกดเจาะดูรายละเอียดรายการธุรกรรมภายใต้หมวดหมู่ในเดือนนั้น ๆ

### Sprint 5: ความปลอดภัยและฟังก์ชันเสริมระบบคลาวด์ (Security & Cloud Features) - ⏳ รอดำเนินการ
*   **ฟีเจอร์หลัก**:
    *   ระบบความปลอดภัยและการจัดการสิทธิ์ขั้นสูง
    *   การปรับปรุงประสิทธิภาพระบบในกรณีมีข้อมูลธุรกรรมปริมาณมาก

### Sprint 6: การขัดเกลาและติดตั้งขึ้นระบบจริง (Polish & Deployment) - ⏳ รอดำเนินการ
*   **ฟีเจอร์หลัก**:
    *   ปรับปรุงประสิทธิภาพและ UX/UI ละเอียดแบบทีละจุด
    *   แก้ไขบั๊กที่พบจากการใช้งานจริงและการทดสอบ (QA)
    *   ติดตั้งฐานข้อมูลและเว็บขึ้นระบบจริง (Production Deployment)

---

## 🛠️ สถานะปัจจุบัน (Current Status)

### 1. สิ่งที่พัฒนาเสร็จสิ้นแล้ว (Completed)

#### 📝 งานด้านเอกสารระบบและการวางแผน
*   จัดทําเอกสารภาพรวมสเปก [PRODUCT.md](file:///Users/torikiton/Desktop/PocketNote/docs/PRODUCT.md) และเอกสารสถาปัตยกรรมด้านเทคนิค [ARCHITECTURE.md](file:///Users/torikiton/Desktop/PocketNote/docs/ARCHITECTURE.md) เรียบร้อยแล้ว (อัปเดตสเปกใหม่รอบ 2 สำเร็จ)
*   ทบทวนและบรรลุข้อตกลงใหม่ (v2 Alignment): ยุบรวม Profile เข้ากับ User, ยกเลิก Guest ใน DB, ลบตาราง Session/SyncLog, เปลี่ยนวิธีเก็บรูปภาพแนบใน Transaction เป็นฟิลด์เดียว และปรับปรุงความสัมพันธ์สำหรับการ Soft Delete

#### 💾 งานด้านระบบหลังบ้านและฐานข้อมูล (Backend & DB)
*   **Prisma 7 Upgrade**: อัปเกรดจาก v6 เป็น v7 ใช้ Driver Adapter `@prisma/adapter-pg` ในการเชื่อมต่อฐานข้อมูลเรียบร้อยแล้ว
*   **System Seed Data**: สร้าง Script สำหรับการ Seed หมวดหมู่เริ่มต้น (เช่น อาหาร, เดินทาง ฯลฯ) ในระบบฐานข้อมูล

#### 💻 งานด้านหน้าบ้าน (Frontend - apps/web)
*   **Guest Mode Core Store**: พัฒนา Zustand Store (`useGuestStore`) พร้อม LocalStorage Persistence สำเร็จ
*   **Zustand Store Persist & Helper**: พัฒนา `useIsGuest` helper hook เพื่อป้องกันปัญหา Hydration
*   **Clean Up**: ลบการตั้งค่าและฟังก์ชันระบบ Currency (สกุลเงิน) ออกทั้งหมดจากตัวแอป (ตามข้อตกลงในการลดยากของระบบ)
*   **Navigation & Layout Fixes**: แยก UI `LogoutConfirmModal` ออกจาก Logic (Presentation/Container Split) และปรับหน้าเมนูนำทางด้านล่างบนมือถือด้วย Grid 20% เท่ากัน

---

### 2. สิ่งที่ต้อง Rework และอยู่ระหว่างดำเนินการ (Rework & In Progress)

#### 💾 Rework งานหลังบ้านตาม Schema ใหม่ (Backend Rework)
*   [ ] **แก้ไข Prisma Schema (`schema.prisma`)**: ยุบตาราง Profile เข้ากับ User, ลบตาราง Session, ลบตาราง SyncLog, ลบตาราง TransactionAttachment และอัปเดตฟิลด์ของ Asset (`color` เท่านั้น), Category, และ Transaction (`attachmentUrl` และการลบสัมพันธ์ attachments)
*   [ ] **แก้ไข Auth Module**: เอาการตรวจสอบ/สร้าง Guest Row ในฐานข้อมูลออก (โหมด Guest ใน DB จะไม่มีอีกต่อไป)
*   [ ] **แก้ไข User & Profile API**: สร้าง endpoint `PATCH /users/profile` และปรับปรุง logic การสร้าง user ให้มี display name และข้อมูลอื่นครบในตารางเดียว
*   [ ] **แก้ไข API Sync Guest**: ปรับปรุง endpoint `POST /auth/sync-guest` ให้รองรับ Merge Flow (แบบ A) เข้ากับข้อมูลที่มีอยู่เดิม และจัดเก็บผลลัพธ์การซิงค์ไว้ในฟิลด์ของ User ตรงๆ
*   [ ] **แก้ไข Asset, Category, Transaction API**: อัปเดตตามฟิลด์ใหม่ (ลบ `icon` ใน Asset, เพิ่ม `attachmentUrl` ใน Transaction) และเปลี่ยนระบบลบเป็นการ Soft Delete (`deletedAt`) ที่สมบูรณ์

#### 💻 Rework งานหน้าบ้านตามการเปลี่ยนแปลง (Frontend Rework)
*   [ ] **อัปเดต Types, Services และ Hooks**: แก้ไขข้อมูล Interface ของ User, Asset, Category, Transaction ให้ตรงกับโครงสร้างใหม่ฝั่งหลังบ้าน
*   [ ] **ปรับปรุง Guest Sync Hook**: แก้ไขการเรียกใช้งาน API `POST /auth/sync-guest` ให้สอดรับกับผลลัพธ์ Merge Flow

---

### 3. งานที่จะต้องทำเป็นลำดับถัดไป (Next Actions)

*   [ ] **พัฒนา UI การจัดการหมวดหมู่ (Category CRUD)**: ทำหน้าจอเพิ่ม/ลบ/แก้ไขหมวดหมู่ส่วนตัว เลือกสีและไอคอน (Sprint 1)
*   [ ] **พัฒนาหน้าแก้ไขโปรไฟล์ (Profile UI)**: ทำหน้าจอแก้ไขข้อมูลชื่อ, ภาษา และโซนเวลาของผู้ใช้ (Sprint 2)
*   [ ] **พัฒนา UI ระบบกลไกซิงค์ข้อมูล (Guest Sync UI)**: สร้าง Popup ยืนยันการ Merge ข้อมูล และวิดเจ็ตแสดงผลสถานะการซิงค์พร้อมปุ่ม Sync ซ้ำ (Sprint 2)
*   [ ] **พัฒนาและเชื่อมต่อธุรกรรมขั้นสูง (Transfer & Adjustment UI/API)**: เชื่อมต่อหน้าจอประวัติธุรกรรมแบบสมบูรณ์และหน้าสำหรับการโอนเงิน/ปรับปรุงยอดบัญชี (Sprint 2)
