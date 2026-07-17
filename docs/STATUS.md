# PocketNote - Development Status & Roadmap (แผนงานและสถานะการพัฒนา)

เอกสารนี้ใช้สำหรับติดตามสถานะการพัฒนาของโครงการในแต่ละ Sprint และบันทึกสิ่งที่ดำเนินการเสร็จสิ้นแล้ว รวมถึงแผนงานขั้นตอนต่อไป (Next Actions)

---

## 📅 แผนงานหลัก (Project Roadmap)

### Sprint 0: วางโครงรากฐานระบบ (Foundation) - ✅ สำเร็จ 100%

- **Frontend**: ตั้งค่า Next.js, Tailwind CSS, shadcn/ui, Zustand, และ TanStack Query รวมถึงโครงสร้างการแสดงผล Layout & Navigation (Responsive)
- **Backend**: ตั้งค่า NestJS, PostgreSQL & Prisma, โครงสร้าง Module พื้นฐาน และระบบล็อกอิน/สมัครสมาชิก (Auth Module)

### Sprint 1: ระบบสินทรัพย์ หมวดหมู่ และรายการพื้นฐาน (Transaction & Asset Core) - 🔄 กำลังดำเนินการ (ปรับปรุงตาม DB Schema ใหม่)

- **ฟีเจอร์หลัก**:
  - ระบบจัดการสินทรัพย์ (Asset CRUD & UI) - ไม่เก็บไอคอนใน DB ใช้ไอคอนตามประเภท
  - ระบบจัดการหมวดหมู่ (Category CRUD & UI จัดการสีและไอคอน) - _ขยับขึ้นมาจาก Sprint 5_
  - การบันทึกรายรับ-รายจ่ายพื้นฐาน (Income/Expense Entry)
  - การแสดงผลประวัติรายการธุรกรรมพื้นฐาน (Transaction Timeline)
- **เป้าหมาย**: ผู้ใช้งานสามารถจัดการบัญชีสินทรัพย์ จัดการหมวดหมู่ และบันทึกรายการรายรับ-รายจ่ายพื้นฐานรายวันได้จริง

### Sprint 2: ระบบประวัติ ธุรกรรมขั้นสูง และการตั้งค่า (Journal, Advanced Transactions & Profile Settings) - 🔄 กำลังดำเนินการ

- **ฟีเจอร์หลัก**:
  - ระบบโอนเงินข้ามบัญชี (Transfer Transaction)
  - ระบบปรับปรุงยอดบัญชีคงเหลือ (Balance Adjustment Transaction) - สำหรับเคลียร์ยอดเงินดื้อๆ ให้ตรงกับชีวิตจริง
  - ระบบกลไกซิงค์ข้อมูลฝั่งหน้าบ้าน (Guest Mode Sync UI & Merge Flow) - _ขยับขึ้นมา_ รองรับ Merge Popup แจ้งเตือนเมื่อมีข้อมูลเดิม และวิดเจ็ตแสดงสถานะ เช่น "Sync just Now", "Sync failed" พร้อมปุ่มกด Sync ซ้ำ
  - ระบบจัดการโปรไฟล์ผู้ใช้ (UI/API สำหรับอัปเดต displayName, language) - _ขยับขึ้นมาจาก Sprint 5_
  - หน้าจอประวัติธุรกรรมแบบสมบูรณ์ (Journal Timeline & Calendar View)
- **เป้าหมาย**: ระบบจดบันทึกมีความยืดหยุ่น เชื่อมต่อการซิงค์ข้อมูล Guest สมบูรณ์ และตั้งค่าโปรไฟล์ส่วนตัวได้

### Sprint 3: หน้าจอแดชบอร์ดหลัก (Home Dashboard) - ⏳ รอดำเนินการ

- **ฟีเจอร์หลัก**:
  - คำนวณยอดเงินสินทรัพย์รวม (Total Assets Calculation)
  - แดชบอร์ดแสดงสรุปรายรับ-รายจ่าย และกระแสเงินสดสุทธิ (Net Flow) ประจำเดือน
  - รายการสินทรัพย์ล่าสุด (Recent Assets Grid)
  - ประวัติรายการธุรกรรมล่าสุด 5 รายการ (Recent Transactions Feed)

### Sprint 4: ระบบการวิเคราะห์ข้อมูลและรายงาน (Analytics & Insights) - ⏳ รอดำเนินการ

- **ฟีเจอร์หลัก**:
  - รายงานสัดส่วนรายจ่ายแยกตามหมวดหมู่ (Category Breakdown Chart)
  - รายงานสัดส่วนการกระจายสินทรัพย์ (Asset Distribution Chart)
  - รายงานแนวโน้มทางการเงินรายเดือน (Monthly Trends)
  - ระบบ Drill-down เพื่อกดเจาะดูรายละเอียดรายการธุรกรรมภายใต้หมวดหมู่ในเดือนนั้น ๆ

### Sprint 5: ความปลอดภัยและฟังก์ชันเสริมระบบคลาวด์ (Security & Cloud Features) - ⏳ รอดำเนินการ

- **ฟีเจอร์หลัก**:
  - ระบบความปลอดภัยและการจัดการสิทธิ์ขั้นสูง
  - การปรับปรุงประสิทธิภาพระบบในกรณีมีข้อมูลธุรกรรมปริมาณมาก

### Sprint 6: การขัดเกลาและติดตั้งขึ้นระบบจริง (Polish & Deployment) - ⏳ รอดำเนินการ

- **ฟีเจอร์หลัก**:
  - ปรับปรุงประสิทธิภาพและ UX/UI ละเอียดแบบทีละจุด
  - แก้ไขบั๊กที่พบจากการใช้งานจริงและการทดสอบ (QA)
  - ติดตั้งฐานข้อมูลและเว็บขึ้นระบบจริง (Production Deployment)

---

## 🛠️ สถานะปัจจุบัน (Current Status)

### 1. สิ่งที่พัฒนาเสร็จสิ้นแล้ว (Completed)

- **Sprint 0 (Foundation):** โครงสร้างระบบพื้นฐานทั้ง Frontend (Next.js, Tailwind, Zustand, TanStack Query) และ Backend (NestJS, PostgreSQL, Prisma, Auth Module) เสร็จสมบูรณ์
- **Sprint 1 (Backend Core):** อัปเดต DB Schema และ API ของ NestJS สำหรับจัดการ Asset, Category, และ Transaction เสร็จสมบูรณ์
- **Sprint 2 (Guest Mode & Sync):** พัฒนาระบบ Guest Mode แบบ Offline ฝั่ง Frontend ครอบคลุมระบบทั้งหมด และพัฒนากลไก Sync นำข้อมูล Local โยนขึ้น Cloud สมบูรณ์ (อ้างอิงจาก PR #12)
- **Sprint 2 (Advanced Transactions):** พัฒนาระบบโอนเงินข้ามบัญชี (Transfer) และระบบปรับปรุงยอดบัญชี (Balance Adjustment) สมบูรณ์พร้อมเชื่อมต่อหน้าบ้านและหลังบ้าน
- **Sprint 3 (Dashboard):** พัฒนาหน้า Dashboard เสร็จสมบูรณ์ (คำนวณ Net Worth, Net Flow รายเดือน, รายการบัญชี และ 5 ธุรกรรมล่าสุด)
- **Refactor (Asset Module):** แยก method `findAll` ใน `AssetService` และ `AssetRepository` เป็น `findAllActive` และ `findAllIncludingDeleted` แทนการใช้พารามิเตอร์ `includeDeleted` พร้อมอัปเดต Controller และ Unit Tests ให้สอดคล้องกัน

### 2. งานที่จะต้องทำเป็นลำดับถัดไป (Next Actions)

งานหลักที่ต้องดำเนินการใน **Sprint 4: ระบบการวิเคราะห์ข้อมูลและรายงาน (Analytics & Insights)**:

- **[ ] แผนภูมิรายจ่ายแยกตามหมวดหมู่ (Category Breakdown Chart):** แสดงสัดส่วนรายจ่ายในแต่ละหมวดหมู่ (Pie Chart / Donut Chart)
- **[ ] แผนภูมิกระจายตัวสินทรัพย์ (Asset Distribution Chart):** แสดงสัดส่วนเงินที่กระจายอยู่ในแต่ละบัญชีหรือแต่ละประเภทสินทรัพย์
- **[ ] สรุปแนวโน้มรายเดือน (Monthly Trends):** ดึงข้อมูลสรุปรายได้และรายจ่ายของเดือนมาโชว์เทียบกัน
- **[ ] ระบบดูรายละเอียดเจาะลึก (Drill-down):** กดที่หมวดหมู่เพื่อดูรายการธุรกรรมย่อยที่เกิดในหมวดหมู่นั้นๆ
