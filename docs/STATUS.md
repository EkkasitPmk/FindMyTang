# PocketNote - Development Status & Roadmap (แผนงานและสถานะการพัฒนา)

เอกสารนี้ใช้สำหรับติดตามสถานะการพัฒนาของโครงการในแต่ละ Sprint และบันทึกสิ่งที่ดำเนินการเสร็จสิ้นแล้ว รวมถึงแผนงานขั้นตอนต่อไป (Next Actions)

---

## 📅 แผนงานหลัก (Project Roadmap)

### Sprint 0: วางโครงรากฐานระบบ (Foundation) - ✅ สำเร็จ 100%

- **Frontend**: ตั้งค่า Next.js, Tailwind CSS, shadcn/ui, Zustand, และ TanStack Query รวมถึงโครงสร้างการแสดงผล Layout & Navigation (Responsive)
- **Backend**: ตั้งค่า NestJS, PostgreSQL & Prisma, โครงสร้าง Module พื้นฐาน และระบบล็อกอิน/สมัครสมาชิก (Auth Module)

### Sprint 1: ระบบสินทรัพย์ หมวดหมู่ และรายการพื้นฐาน (Transaction & Asset Core) - ✅ สำเร็จ 100%

- **ฟีเจอร์หลัก**:
  - ระบบจัดการสินทรัพย์ (Asset CRUD & UI) - ไม่เก็บไอคอนใน DB ใช้ไอคอนตามประเภท
  - ระบบจัดการหมวดหมู่ (Category CRUD & UI จัดการสีและไอคอน) - _ขยับขึ้นมาจาก Sprint 5_
  - การบันทึกรายรับ-รายจ่ายพื้นฐาน (Income/Expense Entry)
  - การแสดงผลประวัติรายการธุรกรรมพื้นฐาน (Transaction Timeline)
- **เป้าหมาย**: ผู้ใช้งานสามารถจัดการบัญชีสินทรัพย์ จัดการหมวดหมู่ และบันทึกรายการรายรับ-รายจ่ายพื้นฐานรายวันได้จริง

### Sprint 2: ระบบประวัติ ธุรกรรมขั้นสูง และการตั้งค่า (Journal, Advanced Transactions & Profile Settings) - ✅ สำเร็จ 100%

- **ฟีเจอร์หลัก**:
  - ระบบโอนเงินข้ามบัญชี (Transfer Transaction)
  - ระบบปรับปรุงยอดบัญชีคงเหลือ (Balance Adjustment Transaction) - สำหรับเคลียร์ยอดเงินดื้อๆ ให้ตรงกับชีวิตจริง
  - ระบบกลไกซิงค์ข้อมูลฝั่งหน้าบ้าน (Guest Mode Sync UI & Merge Flow) - _ขยับขึ้นมา_ รองรับ Merge Popup แจ้งเตือนเมื่อมีข้อมูลเดิม และวิดเจ็ตแสดงสถานะ เช่น "Sync just Now", "Sync failed" พร้อมปุ่มกด Sync ซ้ำ
  - ระบบจัดการโปรไฟล์ผู้ใช้ (UI/API สำหรับอัปเดต displayName, language) - _ขยับขึ้นมาจาก Sprint 5_
  - หน้าจอประวัติธุรกรรมแบบสมบูรณ์ (Journal Timeline & Calendar View)
- **เป้าหมาย**: ระบบจดบันทึกมีความยืดหยุ่น เชื่อมต่อการซิงค์ข้อมูล Guest สมบูรณ์ และตั้งค่าโปรไฟล์ส่วนตัวได้

### Sprint 3: หน้าจอแดชบอร์ดหลัก (Home Dashboard) - ✅ สำเร็จ 100%

- **ฟีเจอร์หลัก**:
  - คำนวณยอดเงินสินทรัพย์รวม (Total Assets Calculation)
  - แดชบอร์ดแสดงสรุปรายรับ-รายจ่าย และกระแสเงินสดสุทธิ (Net Flow) ประจำเดือน
  - รายการสินทรัพย์ล่าสุด (Recent Assets Grid)
  - ประวัติรายการธุรกรรมล่าสุด 5 รายการ (Recent Transactions Feed)

### Sprint 4: ระบบการวิเคราะห์ข้อมูลและรายงาน (Analytics & Insights) - ✅ สำเร็จ 100%

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

- **Sidebar Collapse Animation Refactoring**:
  - ปรับปรุงอนิเมชันการย่อ-ขยาย (Expand/Collapse) ของ Desktop Sidebar ให้มีความนุ่มนวล (Smooth Transition) แบบ 100% ตามมาตรฐาน [test.md](file:///Users/torikiton/Desktop/PocketNote/test.md)
  - เปลี่ยนจากการใช้ JavaScript Unmount Elements (`{!isCollapsed && ...}`) ไปใช้ Tailwind CSS `group-data-[collapsible=icon]` ร่วมกับ CSS Transitions
  - อัปเดตคอมโพเนนต์ [DesktopSidebar.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/DesktopSidebar.tsx), [NavUserProfile.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/NavUserProfile.tsx), [SyncStatusButton.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/SyncStatusButton.tsx), และ [ThemeSwitcher.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/ThemeSwitcher.tsx) ให้รองรับอนิเมชัน CSS โดยไม่มีอาการกระตุก

- **ThemeSwitcher Smooth Sidebar Collapse/Expand Animation**:
  - แก้ไขปัญหา ThemeSwitcher สลับ View ด้วย `display: hidden` / `block` แบบทันทีทันใดที่ขาด Animation
  - เปลี่ยนจากการใช้ `display: hidden/block` มาใช้ Tailwind CSS Transition ร่วมกับ `opacity`, `scale` และ `max-width` (`opacity-0 scale-90` -> `opacity-100 scale-100`)
  - รองรับการ Animate Cross-fade / Morph ระหว่าง 3-Pill Expanded Buttons และ 1-Icon Collapsed Dropdown อย่างนุ่มนวล ซิงค์ตรงกับจังหวะการย่อ-ขยาย 300ms ของ Sidebar

- **Mobile Sidebar Open/Close Animation & Architecture Refactoring**:
  - ย้าย Logic การทำงานทั้งหมดของ Mobile Sidebar (State `drawerRendered`, `drawerVisible`, `useEffect` ควบคุม Transition 300ms, `body overflow`, และ Keyboard Escape Listener) ออกจาก [MobileDrawer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/MobileDrawer.tsx) ไปไว้ที่ Logic Container [NavContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/containers/NavContainer.tsx) 100% ตามสถาปัตยกรรม `FRONTEND_IMPLEMENTATION.md`
  - ปรับปรุง [MobileDrawer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/MobileDrawer.tsx) ให้กลายเป็น Pure Presentation Component ที่รับเฉพาะ Props (`isMounted`, `isVisible`, handlers) และรับหน้าที่แสดงผล UI และ Tailwind CSS Animation (Slide in/out และ Backdrop Fade in/out) อย่างเดียวเท่านั้น

- **MobileDrawer Performance & Instant Open/Close Optimization**:
  - แก้ไขปัญหาความหน่วง ชะงัก (Lag/Delay) ตอนกดเปิด-ปิด MobileDrawer บนมือถือ
  - ยกเลิกการใช้ Multi-state (`rAF`, `drawerRendered`, `drawerVisible`, `setTimeout 300ms`) ที่ทำให้เกิด Double Render Delay ปรับใช้ single state `mobileMenuOpen` ควบคู่กับ CSS Transition
  - ถอด `backdrop-blur-xs` ออก เปลี่ยนเป็น `bg-primary-text/30` เพื่อลดภาระการประมวลผล GPU บนเบราว์เซอร์มือถือ
  - เพิ่ม Hardware Acceleration (`transform-gpu`, `will-change-transform`) และปรับเป็น 200ms `ease-out` เพื่อการตอบสนองสไลด์เปิด-ปิดที่รวดเร็วและลื่นไหลระดับ 60fps/120fps

- **Mobile Bottom Nav Active Color Sync Fix**:
  - แก้ไขปัญหา active สีใน Mobile Bottom Nav สลับเปลี่ยนช้า (สี Text เปลี่ยนก่อน แล้วสี Icon เปลี่ยนตามมา)
  - กำหนดคลาสสี `text-primary` และ `text-secondary-text` ให้กับตัว `<Icon />` และ `<MoreHorizontal />` โดยตรงใน [MobileBottomNav.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/MobileBottomNav.tsx) พร้อมใส่ `transition-colors duration-150`
  - ปรับใช้ `strokeWidth={2}` คงที่เพื่อป้องกันไม่ให้ React Re-render และอัปเดต Attribute ของ SVG Element บน DOM กลางคันขณะเปลี่ยนหน้า ช่วยให้การสลับสี Text และ Icon active เป็นไปอย่างพร้อมเพรียงและนุ่มนวล

---


### 2. สิ่งที่จะต้องทำเป็นลำดับถัดไป (Next Actions)

งานหลักที่ต้องดำเนินการใน **Sprint 5: ความปลอดภัยและฟังก์ชันเสริมระบบคลาวด์ (Security & Cloud Features)**:

- **[ ] ระบบความปลอดภัยและการจัดการสิทธิ์ขั้นสูง:** ตรวจสอบความปลอดภัย API, JWT, Middleware
- **[ ] การปรับปรุงประสิทธิภาพระบบ:** การแบ่งหน้าข้อมูล (Pagination), ทำ Caching กรณีข้อมูลธุรกรรมปริมาณมาก
