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

- **AssetDetail TopAppBar Mobile Dropdown Animate-UI Migration & Touch Fix**:
  - ปรับปรุงเมนูดรอปดาวน์ของรายละเอียดสินทรัพย์ (`AssetsMenu`) บน `TopAppBarMobile` ให้ย้ายมาใช้งาน Radix Dropdown Menu จาก `animate-ui` (`@/shared/components/animate-ui/components/radix/dropdown-menu`)
  - รองรับ Submenu ของ Filter และ Sort (ย่อยตาม Date และ Money) พร้อมอนิเมชันเปิด-ปิดที่นุ่มนวลและเป็นธรรมชาติจาก `animate-ui`
  - แก้ไขปัญหาบน Mobile ที่กดเลือก Filter/Sort แล้วเมนูปิด/หลุดออกก่อนเลือกตัวเลือก สาเหตุเกิดจาก Hook `useClickOutside` ของเดิมที่ผูกกับ Trigger Ref เมื่อกด Submenu Content (ซึ่ง Radix UI Render ใน Portal ภายนอก Trigger Container) ทำให้ถูกตรวจจับว่าเป็นการกดนอกพื้นที่ จึงได้ลบ `useClickOutside` ซ้ำซ้อนออกเพื่อให้ Radix UI จัดการ Portal Touch Events ได้อย่างสมบูรณ์
  - เพิ่มสไตล์ `font-medium` ให้กับตัวเลือกที่ถูกเช็กเลือก (`checked`) ในคอมโพเนนต์ [dropdown-menu.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/components/radix/dropdown-menu.tsx) (`DropdownMenuCheckboxItem`)
  - แก้ไขปัญหา Hover Highlight ใน Submenu ไม่แสดงผล โดยเพิ่ม `<DropdownMenuHighlightPrimitive>` ครอบใน `DropdownMenuSubContent` พร้อมกำหนด `data-[highlighted]:bg-surface-secondary/80` ให้กับไอเทมดรอปดาวน์ทั้งหมด
  - อัปเดตไฟล์ [AssetsMenu.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/components/AssetsMenu.tsx), [AssetsMenuContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/containers/AssetsMenuContainer.tsx) และ [AssetDetailContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/containers/AssetDetailContainer.tsx) ผ่านการตรวจสอบ TypeScript (`tsc --noEmit`) 100%

- **Journal Timeline Animate UI Dropdown Menu Migration**:
  - ย้าย Dropdown เมนูเรียงลำดับรายการ (Sort Menu) ของ Journal Timeline ใน [JournalContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/containers/JournalContainer.tsx) จากเมนูดั้งเดิม ไปใช้ `animate-ui` Radix Dropdown Menu (`DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuCheckboxItem`)
  - รองรับ Submenu สำหรับการจัดเรียงแยกตาม วันที่ (Date) และ จำนวนเงิน (Money/Amount) พร้อม Motion transition, micro-interactions และ accessibility ครบถ้วนตามมาตรฐาน UI
  - ลบ state และ custom helper ที่ซ้ำซ้อน (`openSortSubMenu`, `sortMenuRef`, `useClickOutside`, `MenuItem`, `MenuCheckboxItem`) ออก เพื่อความสะอาด ละเอียดยิบ และผ่านการตรวจสอบ TypeScript Check 100%

- **DropdownSelect Modern Pill Card Redesign**:
  - ปรับปรุงดีไซน์ปุ่ม Trigger ของ [DropdownSelect.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/DropdownSelect.tsx) ใหม่ในสไตล์ **Modern Pill Card** ตัวปุ่มขอบโค้งมน (`rounded-xl`), มีเส้นขอบเนียนบาง (`border border-border/70`), Shadow เบาๆ (`shadow-2xs`), พร้อมไมโครอนิเมชันตอนกดและวางเมาส์ (`tapScale={0.98}`, `hoverScale={1.01}`)
  - เพิ่มเอฟเฟกต์ Subtle Ring Glow (`ring-2 ring-primary/15` / `ring-current/15`) และปรับสีตามสีธีมสินทรัพย์เมื่อเปิดดรอปดาวน์ (`isOpen`) ให้ดูสวยงาม สะอาดตา พรีเมียม และมีมิติตามมาตรฐานสถาปัตยกรรม UI ล่าสุด

- **DropdownMenu Instant Rapid Click Transition Optimization**:
  - ปรับแต่งการเปิด-ปิดเมนูดรอปดาวน์ใน [DropdownSelect.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/DropdownSelect.tsx) และ [MonthYearNavigator.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/components/MonthYearNavigator.tsx) เป็น `transition={{ duration: 0.12, ease: "easeOut" }}` ถอด Spring Physics แรงต้านออก เพื่อรองรับการกดรัวๆ เปิด-ปิด ได้ทันทีแบบ Instant ตอบสนองทันใจโดยไม่มีอาการหน่วง ชะงัก หรือ Lag ของคิว Animation

- **DropdownSelect & Animate-UI HighlightItem Style Preservation Fix**:
  - แก้ไข Root Cause ใน [highlight.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/effects/highlight.tsx) ที่เดิมมีการใช้ `React.cloneElement` เขียนทับ `style` ด้วย `{ position: "relative", zIndex: 1 }` ทำให้ `style` และ `backgroundColor` ที่ส่งเข้ามาใน `DropdownMenuItem` ถูกลบทิ้ง
  - ปรับปรุง [highlight.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/effects/highlight.tsx) ให้รักษา `element.props.style` (`{ position: "relative", zIndex: 1, ...element.props.style }`)
  - ส่งผลให้สีพื้นหลังและสีตัวอักษรของ Selected Item ใน [DropdownSelect.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/DropdownSelect.tsx) แสดงผลสีพื้นหลังได้อย่างถูกต้อง 100% ทั้งสี `bg-primary-light` ของ Default Theme และ Custom `themeColor` ของสินทรัพย์

- **DropdownSelect Journal Calendar UI Alignment & Code Refactoring**:
  - ปรับปรุงโครงสร้างคอมโพเนนต์ [DropdownSelect.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/DropdownSelect.tsx) เป็นรูปแบบ `export default function DropdownSelect(...)` ตามมาตรฐานของโปรเจกต์
  - ให้ดีไซน์และพฤติกรรมเหมือนกับ [MonthYearNavigator.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/components/MonthYearNavigator.tsx) ในหน้า Journal Calendar 100% พร้อมรองรับ `effectiveThemeColor` ของสินทรัพย์ได้อย่างกลมกลืน และผ่าน TypeScript Check 100%

- **Month & Year Selector Animate UI Radix Dropdown Menu Migration**:
  - ติดตั้งและย้ายมาใช้แพ็กเกจคอมโพเนนต์ `@animate-ui/components-radix-dropdown-menu` ([components/radix/dropdown-menu.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/components/radix/dropdown-menu.tsx))
  - ลบคอมโพเนนต์ดรอปดาวน์เดิมที่ซ้ำซ้อนออก และอัปเดตจุดเรียกใช้งานทั้งหมด ([MonthYearNavigator.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/components/MonthYearNavigator.tsx) และ [ThemeSwitcher.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/ThemeSwitcher.tsx)) ให้ชี้ไปยังคอมโพเนนต์ Radix Dropdown Menu ตัวใหม่ของ `animate-ui`
  - อัปเดต [journal-calendar.hook.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/hooks/journal-calendar.hook.ts) ให้ฟังก์ชัน `handleMonthToggle` และ `handleYearToggle` รองรับพารามิเตอร์ `open?: boolean` เพื่อทำงานร่วมกับ Radix UI & Motion transition entry animations ได้อย่างราบรื่นและเสถียร 100%
  - **Journal Calendar Dropdown Fast-Close Fix**: แก้ไขปัญหากดเปิด Dropdown เดือน/ปีแล้วเมนูปิดลงทันที โดยยกเลิกการใช้ `useClickOutside` และ `monthRef`/`yearRef` ใน [journal-calendar.hook.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/hooks/journal-calendar.hook.ts) และ [MonthYearNavigator.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/components/MonthYearNavigator.tsx) เนื่องจาก Radix UI DropdownMenu มีระบบจัดการ Dismiss/Outside Click ในตัวแบบ Portal อยู่แล้ว การใส่ custom `useClickOutside` ไปครอบเฉพาะปุ่ม Trigger ทำให้เมื่อเปิดเมนู เมนูดรอปดาวน์ที่ถูก Portal ไปอยู่ด้านนอก DOM Node ถูก `useClickOutside` ตรวจจับว่าเป็น "นอกพื้นที่" และสั่งปิดทันที การนำ Custom Hook ออกช่วยให้ Radix UI ควบคุม Open/Close State ได้อย่างสมบูรณ์และเสถียร 100%


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

- **Animate UI Tabs Migration & DESIGN.md Styling Alignment**:
  - ติดตั้งแพ็กเกจคอมโพเนนต์ `@animate-ui/components-animate-tabs` และจัดโครงสร้างไฟล์ใน [src/shared/components/animate-ui/](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui)
  - ปรับแต่งการแสดงผลและระบบสีของ `TabsList` และ `TabsTrigger` ให้สอดคล้องกับมาตรฐาน [DESIGN.md](file:///Users/torikiton/Desktop/PocketNote/docs/DESIGN.md) (ใช้ `bg-surface-secondary`, `bg-surface`, `text-primary-text`, `text-secondary-text`, `border-border` พร้อมรองรับทั้ง Light และ Dark Mode)
  - ย้ายและเปลี่ยนจากคอมโพเนนต์เดิม `SegmentedControl` ไปใช้ `Animate Tabs` (`Tabs`, `TabsList`, `TabsTrigger`) แบบ Smooth Motion ในทุกหน้าจอเรียบร้อยแล้ว
  - ลบไฟล์ `SegmentedControl.tsx` เดิมที่ไม่ถูกใช้งานแล้วออกจากระบบสำเร็จ 100%

- **Transaction Date Modal React Portal & Month/Year Dropdown Restoration**:
  - Refactor คอมโพเนนต์ [ChooseADate.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/transactions/components/ChooseADate.tsx) ให้ใช้ `createPortal(modalContent, document.body)` ร่วมกับ `useMounted()` เพื่อส่งองค์ประกอบ Modal ขึ้นไปเรนเดอร์ในระดับ Root Document (`document.body`)
  - คืนค่าและปรับปรุงระบบ Dropdown สำหรับเลือก **เดือน และ ปี** (`captionLayout="dropdown"`) พร้อมตั้งค่า `startMonth` และ `endMonth` ครอบคลุมตั้งแต่งปี 2010 ถึง 2040
  - ปรับแต่งสไตล์ [calendar.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/ui/calendar.tsx) ให้ปุ่ม Dropdown เดือนและปีมีกรอบมน สวยงาม ชัดเจน และไม่บดบังปุ่มลูกศร Navigation เลื่อนเดือน
  - เพิ่ม Backdrop Overlay ครอบเต็มจอภาพ (`fixed inset-0 z-100 bg-primary-text/20 backdrop-blur-xs`) พร้อมระบบกดพื้นที่ว่างภายนอกเพื่อปิด Modal
  - ซ่อนลูกศร Spinner Native Browser ในช่องกรอกเวลา (`[appearance:textfield]` และ `&::-webkit-inner-spin-button`) ช่วยให้ตัวเลขอ่านง่ายและจัดกึ่งกลางสวยงาม

- **Analytics Chart Animation & Unblocked Interactions Optimization**:
  - ปรับแต่งระยะเวลา Animation ของ Recharts กราฟวงกลม (`PieChart`) ใน [CategoryBreakdownChart.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/components/CategoryBreakdownChart.tsx) และกราฟแท่ง (`BarChart`) ใน [MonthlyTrendsChart.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/components/MonthlyTrendsChart.tsx) ให้รวดเร็ว นุ่มนวล เคลื่อนไหวสวยงาม (`animationDuration={400}`, `animationEasing="ease-out"`)
  - จัด Z-Index Layer ของปุ่มกดและแท็บควบคุม (`PeriodSelector` และ `TabsList`) ด้วย `relative z-10` ใน [CategoryBreakdownContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/containers/CategoryBreakdownContainer.tsx) เพื่อป้องกันไม่ให้ SVG Overlay บล็อกการโต้ตอบ
  - ส่งผลให้ผู้ใช้สามารถกดปุ่ม แท็บ หรือเปลี่ยนเดือนในหน้า Analytics ได้ทันทีขณะที่กราฟกำลังเล่น Animation อยู่

- **Analytics Page Scroll Refactoring**:
  - แก้ไขโครงสร้าง Layout การเลื่อน (Scroll) ของหน้าแดชบอร์ดวิเคราะห์ข้อมูล ([AnalyticsContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/containers/AnalyticsContainer.tsx))
  - กำหนดให้แถบ Tab Bar หลักด้านบนสุด (`[รายงาน]`, `[แนวโน้ม]`, `[สินทรัพย์]`) ล็อกตรึงอยู่กับที่ด้านบนสุดของหน้าเสมอ ไม่เลื่อนหายไปเมื่อผู้ใช้เลื่อนดูข้อมูล
  - กำหนดให้เนื้อหาทั้งหมดภายในแต่ละ Tab ([CategoryBreakdownContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/containers/CategoryBreakdownContainer.tsx), [MonthlyTrendsContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/containers/MonthlyTrendsContainer.tsx), [AssetDistributionContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/containers/AssetDistributionContainer.tsx)) สามารถเลื่อน Scroll ไปพร้อมกันได้อย่างเป็นธรรมชาติแบบผืนเดียวกันในแต่ละ Tab

- **Transaction Form Tab Switch Validation Bug Fix**:
  - แก้ไขปัญหาหน้าจอบันทึกรายการธุรกรรม (Transaction Form) แสดงข้อความแจ้งเตือนผิดพลาด `"Amount must be greater than 0"` ทันทีเมื่อผู้ใช้กดสลับ Tab (ประเภทธุรกรรม)
  - **สาเหตุที่แท้จริง (Root Cause)**: ปุ่ม `<TabsTrigger>` ของคอมโพเนนต์ Animate Tabs ไม่ได้ระบุ Attribute `type="button"` เมื่ออยู่ภายใต้ฟอร์ม `<form>` เบราว์เซอร์จึงปฏิบัติตามมาตรฐาน HTML โดยถือว่าปุ่มนั้นเป็น `type="submit"` ซึ่งส่งผลให้ทุกครั้งที่ผู้ใช้กดสลับ Tab ระบบจะทำการ Submit Form และรัน Zod Validation ทันที เป็นเหตุให้แสดงข้อผิดพลาด `"Amount must be greater than 0"`
  - **การแก้ไข**: เพิ่ม `type="button"` ให้กับ [TabsTrigger Primitive](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/animate/tabs.tsx#L176) และ [TabsTrigger Component Wrapper](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/components/animate/tabs.tsx#L52) เพื่อป้องกันการกดสลับ Tab ไม่ให้เกิดการ Trigger Form Submit โดยไม่ตั้งใจ
  - คงระบบ Validation สมบูรณ์แบบไว้สำหรับการพิมพ์จำนวนเงิน และการกดบันทึกรายการ (Submit) ตามปกติ

- **Analytics & Journal Layout Lockdown & Content-Only Scroll Architecture**:
  - แก้ไขปัญหาหน้าจอ Analytics (`/analytics`) และ Journal (`/journal`) ซึ่งเดิมตัว Layout นอกสุด (`<main>`) มี class `overflow-y-auto` ทำให้เมื่อทำการสโครล ทั้งส่วนหัวเลือก Tab (`TabsList`) และส่วนตัวกรองสโครลตามไปด้วยหลุดจากหน้าจอ
  - **การปรับปรุง**:
    1. ปรับปรุง [MainLayoutContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/main-layout/containers/MainLayoutContainer.tsx) โดยกำหนดให้ `<main>` ในหน้า `/journal` และ `/analytics` มีคุณสมบัติ `overflow-hidden h-full` เพื่อปิดการสโครลระดับ Layout ใหญ่ ไม่ให้ส่วนหัวและแถบ Tab สโครลตาม
    2. ใน [JournalContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/journal/containers/JournalContainer.tsx) และ [AnalyticsContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/containers/AnalyticsContainer.tsx) ล็อคส่วนหัว `TabsList` และส่วนกรอง/ค้นหาด้วย `shrink-0 z-10 bg-background` และเปิดให้สโครลเฉพาะส่วนรายการข้อมูล (`flex-1 min-h-0 overflow-y-auto` / `GroupedVirtuoso`) เท่านั้น
    3. ปรับแต่ง [tabs.tsx (Primitive)](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/animate/tabs.tsx) ใช้ `Math.max(pane.scrollHeight, ...)` เพื่อแก้ปัญหา ResizeObserver Deadlock กรณีข้อมูลโหลดทีหลัง และรองรับ `isHFull` ให้สโครลได้ 100% สมบูรณ์ทั้งหน้า Analytics และ Journal
- **Transaction Item Radix Collapsible Refactoring & Exit Animation Fix**:
  - ติดตั้งแพ็กเกจคอมโพเนนต์ `@animate-ui/primitives-radix-collapsible` และจัดเก็บไฟล์ไว้ที่ [collapsible.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/radix/collapsible.tsx) พร้อม re-export ผ่าน [shared/components/ui/collapsible.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/ui/collapsible.tsx)
  - ปรับปรุง [collapsible.tsx (Primitive)](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/radix/collapsible.tsx) โดยระบุ `key="collapsible-content"` บนตัวลูกชั้นแรกของ `<AnimatePresence>` เพื่อให้ Framer Motion สลับสถานะและรัน `exit` animation ตอนปิดกางได้อย่างถูกต้อง
  - ปรับปรุงคอมโพเนนต์ [TransactionItem.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/TransactionItem.tsx) ถอดคลาส CSS `data-[state=closed]:grid-rows-[0fr]` ที่เข้ามาขัดขวาง Framer Motion ออก เพื่อเปิดให้จังหวะการหุบปิด (Exit collapse animation) ทำงานได้อย่างนุ่มนวลสมบูรณ์ทั้งเปิดและปิด

- **Asset Edit Modal Cancel Event Leakage Bug Fix**:
  - แก้ไขปัญหาชื่อ Asset แสดงผลเป็น `[object Object]` บน `TopAppBarMobile` เมื่อผู้ใช้กดปุ่ม Cancel บน Modal แก้ไข Asset
  - **สาเหตุที่แท้จริง (Root Cause)**: ปุ่ม Cancel ใน [AssetForm.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/components/AssetForm.tsx) ถูกผูก `onClick={onClose}` ไว้โดยตรง ส่งผลให้ React ส่ง `MouseEvent` (SyntheticBaseEvent) เข้าไปเป็น argument ตัวแรกของ `onClose` และผ่านไปถึง `handleEditClose(newName)` ใน [AssetDetailContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/containers/AssetDetailContainer.tsx) เนื่องจาก JavaScript ประเมินว่า Event Object เป็นค่า truthy ทำให้เงื่อนไข `if (newName && id)` ทำงาน และสั่ง `params.set("name", newName)` ซึ่งแปลง Event Object เป็น string จนกลายเป็น `"[object Object]"` บน URL
  - **การแก้ไข**:
    1. ปรับปรุง [AssetDetailContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/containers/AssetDetailContainer.tsx) โดยเพิ่ม Type Check `if (typeof newName === "string" && id)` เพื่อป้องกันไม่ให้ Object ชนิดอื่นถูกส่งไปตั้งค่าใน URL Query Parameter
    2. ปรับปรุง [AssetForm.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/components/AssetForm.tsx) ให้ปุ่ม Cancel เรียก `onClick={() => onClose?.()}` เพื่อป้องกันไม่ให้ส่ง MouseEvent Object ออกไปยัง callback

- **Analytics Transfer/Adjustment Drilldown Synthetic Category TopAppBarMobile Loading Fix**:
  - แก้ไขปัญหา TopAppBarMobile หมุนค้างแสดงผล Skeleton ไม่ยอมหายและไม่แสดงชื่อข้อมูล เมื่อกดคลิกรายการในหน้า Analytics (`/analytics`) -> แถบรายงาน (`Report`) -> แถบโอนเงิน (`Transfer`) เพื่อไปยังหน้า Drilldown (`/analytics/category/[id]`)
  - **สาเหตุที่แท้จริง (Root Cause)**: รายการธุรกรรมในแถบโอนเงิน (`TRANSFER`) และการปรับปรุงยอด (`ADJUSTMENT`) จะใช้ Synthetic Category ID พิเศษ (`uncategorized_transfer`, `uncategorized_adjustment`, `uncategorized`) ซึ่งถูกสร้างขึ้นเฉพาะในระบบ Analytics เท่านั้น แต่ไม่ได้อยู่ในตารางหมวดหมู่จริง (`categories` จาก hook `useCategories()`) เมื่อผู้ใช้นิเกตไปยังหน้า Drilldown (`/analytics/category/uncategorized_transfer`) คอมโพเนนต์ [MainLayoutContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/main-layout/containers/MainLayoutContainer.tsx) ค้นหาหมวดหมู่นี้ไม่พบ (`currentCategory` มีค่าเป็น `undefined`) จึงทำให้ฟังก์ชัน `getMobileTitle()` คืนค่าเป็น `<Skeleton />` ค้างตลอดเวลา
  - **การแก้ไข**:
    1. เพิ่มฟังก์ชัน helper `getSyntheticCategory` ใน [MainLayoutContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/main-layout/containers/MainLayoutContainer.tsx) เพื่อแมปข้อมูล Synthetic Category (`uncategorized_transfer`, `uncategorized_adjustment`, `uncategorized`) กลับเป็นชื่อหมวดหมู่ที่แปลตามภาษา (เช่น "โอนเงิน", "ปรับปรุง") พร้อมสีและประเภทธุรกรรม
    2. ปรับปรุงคอมโพเนนต์ [TransactionIcon.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/TransactionIcon.tsx) ให้ตรวจสอบ `transaction.category?.icon` ก่อน และหากไม่มีไอคอนประจำหมวดหมู่ ให้เลือกแสดงไอคอนประเภทธุรกรรม (`ArrowRightLeft` สำหรับ TRANSFER และ `SlidersHorizontal` สำหรับ ADJUSTMENT) ได้อย่างถูกต้อง
    3. ปรับปรุงคอมโพเนนต์ [CategoryList.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/components/CategoryList.tsx) และ [CategoryBreakdownContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/analytics/containers/CategoryBreakdownContainer.tsx) โดยเลิกฮาร์ดโค้ด `type: "EXPENSE"` และส่งประเภทแถบข้อมูล (`type`) พร้อมคำนวณ `itemType` ตาม `categoryId` เพื่อให้ไอคอนรายการโอนเงิน (`TRANSFER`) และปรับปรุงยอด (`ADJUSTMENT`) แสดงไอคอนสัญลักษณ์ที่ถูกต้องแทนการตกเป็นไอคอนเครื่องหมายคำถาม (`?`)

- **Create / Edit Asset, Category & Change Password Form Radix Sheet Refactoring**:
  - ติดตั้งและปรับเปลี่ยนคอมโพเนนต์การเพิ่ม/แก้ไขสินทรัพย์ ([AssetForm.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/components/AssetForm.tsx)), การเพิ่ม/แก้ไขหมวดหมู่ ([CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx)) และฟอร์มเปลี่ยนรหัสผ่าน ([ChangePasswordModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/account/components/ChangePasswordModal.tsx)) จาก `ModalForm` แบบ Pop-up ตรงกลาง มาใช้งาน `@/shared/components/animate-ui/components/radix/sheet` (`Sheet`) แบบ Bottom Sheet ตามตัวอย่างใน [exp.md](file:///Users/torikiton/Desktop/PocketNote/exp.md)
  - รองรับการแสดงผลที่เหมาะสมกับ Web Mobile โดยแสดงเป็น Bottom Sheet สไลด์ขึ้นมาจากด้านล่าง พร้อมจัดการ Scrollbar, Virtual Keyboard Offset, Dynamic Height และ Touch Ergonomics ทำให้ฟอร์มกรอกข้อมูลทั้งหมดในแอปเป็นมาตรฐานเดียวกัน 100%
  - คงการทำงานระบบ **Auto Focus แบบ Synchronous บน Radix Sheet** ([primitives/radix/sheet.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/radix/sheet.tsx)) เพื่อให้เบราว์เซอร์บนมือถือ (iOS Safari / Android Chrome) แสดงเคอร์เซอร์ (Cursor) และเรียกแป้นพิมพ์เสมือน (Virtual Soft Keyboard) ขึ้นมาให้ผู้ใช้งานกรอกข้อมูลได้ทันทีโดยไม่ถูกระบบปฏิบัติการสั่งบล็อก Security Policy ของระบบโฟกัสแบบ Async (setTimeout)

- **Transaction Date Picker Radix Sheet & Single-Instance Architecture Refactoring**:
  - ปรับเปลี่ยนคอมโพเนนต์เลือกวัน/เวลาในธุรกรรม ([ChooseADate.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/transactions/components/ChooseADate.tsx)) จาก custom pop-up modal ตรงกลางหน้าจอ มาใช้งาน `@/shared/components/animate-ui/components/radix/sheet` (`Sheet`) แบบ Bottom Sheet สไลด์ลื่นไหลจากด้านล่าง
  - ย้ายการเรนเดอร์คอมโพเนนต์ `<ChooseADate>` ออกมาจากลูป `.map()` ของแท็บทั้ง 4 ประเภท (`TabsContent`) ใน [TransactionMoreDetails.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/transactions/components/TransactionMoreDetails.tsx) ขึ้นไปไว้ที่ระดับบนสุดของ [TransactionsContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/transactions/containers/TransactionsContainer.tsx) ร่วมกับ `ConfirmModal` และ `LoadingModal`
  - แก้ไขสาเหตุที่แท้จริง (Root Cause) ของปัญหาการเกิด `sheet-overlay` และ `sheet-content` ซ้อนกัน 4 ชั้นได้อย่างเบ็ดเสร็จ 100% ทำให้เหลือตัว Sheet ใน DOM เพียง 1 ตัวถ้วน เรนเดอร์ลื่นไหลและประหยัดหน่วยความจำ
  - ปรับปรุงคอมโพเนนต์ส่วนกลาง [sheet.tsx (Component)](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/components/radix/sheet.tsx) และ [sheet.tsx (Primitive)](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/radix/sheet.tsx) โดยใช้ `opacity` transition ร่วมกับ `bg-black/40 backdrop-blur-xs` เพื่อให้ Overlay ฉากหลังสอดคล้อง นุ่มนวล และสวยงามเหมือนกันทุก Sheet ทั้งแอป 100%

- **Animate UI Motion Button Integration & Clean Removal of Legacy Button**:
  - ติดตั้งและปรับใช้ `@animate-ui/components-buttons-button` ([primitives/buttons/button.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/primitives/buttons/button.tsx) และ [components/buttons/button.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/animate-ui/components/buttons/button.tsx)) เพื่อให้ปุ่มทุกตัวในแอปพลิเคชันมี Micro-interaction (Hover/Active Scale motion) ที่เรียบหรูและตอบสนองได้นุ่มนวล
  - ปรับแต่ง variants และขนาดให้สอดคล้องตาม [DESIGN.md](file:///Users/torikiton/Desktop/PocketNote/docs/DESIGN.md) (`primary`, `surface`, `income`, `expense`, `investment`, `secondary`, `outline`, `ghost`, `link`, `unstyled`)
  - อัปเดตเส้นทาง Import ในแอปพลิเคชันทั้งหมด 45 ไฟล์ตรงไปที่ `@/shared/components/animate-ui/components/buttons/button`
  - ลบไฟล์เก่า `customs/Button.tsx` และ `ui/button.tsx` ออกจากระบบโดยเด็ดขาด 100% พร้อมทดสอบ TypeScript Type Check และ Unit Tests ผ่านทั้งหมดเรียบร้อยแล้ว

- **ManageAsset Collapsible Integration**:
  - เปลี่ยนการแสดงผลส่วนขยาย (Expanded Actions Panel) ของรายการสินทรัพย์ใน [ManageAssetItem.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/components/ManageAssetItem.tsx) ให้ใช้งานคอมโพเนนต์ `Collapsible`, `CollapsibleTrigger`, และ `CollapsibleContent` จาก `@/shared/components/animate-ui/primitives/radix/collapsible`
  - รองรับอนิเมชันเปิด-ปิดสไลด์อย่างราบรื่นร่วมกับ `AnimatePresence` และ `motion`
  - รองรับการสลับระหว่างโหมดแก้ไขรายการ (Select/Drag & Drop Mode) กับโหมดขยายปกติ (Collapsible Mode) โดยไม่เกิดการชนกันของ Event Handlers

- **MainLayoutContainer Asset Search Mode Top Padding Fix**:
  - ปิด `pt-12` บน [MainLayoutContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/main-layout/containers/MainLayoutContainer.tsx) เมื่อผู้ใช้อยู่ในหน้าสินทรัพย์ (`/assets`) และอยู่ในโหมดค้นหา (`isSearchMode`) เพื่อให้ layout ไม่เกิดช่องว่างส่วนเกินใต้ Sticky Search Header

- **AssetDetail Animate UI Dropdown Menu Migration**:
  - ปรับเปลี่ยนดรอปดาวน์เมนูในหน้าจอรายละเอียดสินทรัพย์ ([AssetDetail.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/assets/components/AssetDetail.tsx)) ได้แก่ ดรอปดาวน์เลือกมุมมอง (View Option), เลือกเดือน (Month), เลือกปี (Year) รวมถึงเมนูตัวเลือกเพิ่มธุรกรรม (Add Transaction Menu) ให้มาใช้งาน `DropdownMenu` จาก `@/shared/components/animate-ui/components/radix/dropdown-menu`
  - ปรับปรุงคอมโพเนนต์ส่วนกลาง [DropdownSelect.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/components/customs/DropdownSelect.tsx) จาก custom absolute positioning list มาใช้ Radix UI `DropdownMenu` ร่วมกับ Spring animation ของ `animate-ui` สวยงาม ราบรื่น และมี accessibility สมบูรณ์ 100%
  - เพิ่มสถานะสี **Active / Selected State** (`bg-primary-light/60 text-primary font-semibold` สำหรับโหมดปกติ หรือใช้สีสินทรัพย์ `themeColor` ร่วมกับ `text-white`) พร้อมแสดงไอคอนสัญลักษณ์ติ๊กถูก (`Check` Icon) ด้านขวามือของตัวเลือกที่ถูกเปิดใช้งานเพื่อความชัดเจนทาง visual และตรงตาม [DESIGN.md](file:///Users/torikiton/Desktop/PocketNote/docs/DESIGN.md)
- **Deployment Readiness & Preparation Documentation**:
  - จัดทำเอกสารฉบับใหม่ [DEPLOYMENT_PREPARATION.md](file:///Users/torikiton/Desktop/PocketNote/docs/DEPLOYMENT_PREPARATION.md) รวบรวมสรุปความพร้อมของระบบ (~80%-85%), รายการตรวจสอบการทดสอบ Build, การจัดเตรียม Cloud Database (PostgreSQL), การเลือก App Hosting (Frontend Vercel / Backend Render), การตั้งค่า Environment Variables (`.env.production`) และประเมินหัวข้อสำหรับการนำมาประชุมตัดสินใจร่วมกันก่อน Launch ขึ้นเซิร์ฟเวอร์จริง

- **Supabase Centralized Storage Service & Security Refactoring**:
  - **สร้าง Centralized Storage Module & Service**: สร้าง [storage.module.ts](file:///Users/torikiton/Desktop/PocketNote/apps/api/src/common/storage/storage.module.ts) และ [storage.service.ts](file:///Users/torikiton/Desktop/PocketNote/apps/api/src/common/storage/storage.service.ts) ไว้ที่ฝั่ง Backend สื่อสารผ่าน NestJS `ConfigService` เพื่อเป็นศูนย์กลางเดี่ยวในการสร้าง Supabase Client (Singleton) สำหรับจัดการ Storage
  - **ขจัด Code Duplication**: ลบการประกาศ `createClient(...)` ซ้ำซ้อน 3 จุด และลบ Helper Method ที่สร้างกระจัดกระจายใน [AssetService](file:///Users/torikiton/Desktop/PocketNote/apps/api/src/modules/asset/services/asset.service.ts), [AuthService](file:///Users/torikiton/Desktop/PocketNote/apps/api/src/modules/auth/services/auth.service.ts), และ [TransactionService](file:///Users/torikiton/Desktop/PocketNote/apps/api/src/modules/transaction/services/transaction.service.ts) โดยเปลี่ยนมา Inject `StorageService` แทน
  - **ลบ Unused Config & Keys**: ลบ `SUPABASE_ANON_KEY` ที่ไม่ได้ใช้งานในฝั่ง Backend ออกจากไฟล์ `.env` เพื่อป้องกันความสับสน
  - **Frontend Wildcard Domain Pattern**: ปรับปรุง [next.config.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/next.config.ts) ฝั่งหน้าบ้าน จากเดิมที่ระบุ Hostname เจาะจงเฉพาะโครงการ ให้รองรับ Wildcard Pattern `*.supabase.co` เพื่อความยืดหยุ่นและการเปลี่ยนผ่าน Environment
  - **Verification**: ทดสอบผ่าน TypeScript Compilation และการ Build ผ่าน 100% ทั้งฝั่ง `apps/api` และ `apps/web`

---

### 2. สิ่งที่จะต้องทำเป็นลำดับถัดไป (Next Actions)

งานหลักที่ต้องดำเนินการใน **Sprint 5: ความปลอดภัยและฟังก์ชันเสริมระบบคลาวด์ (Security & Cloud Features)**:

- **[ ] ระบบความปลอดภัยและการจัดการสิทธิ์ขั้นสูง:** ตรวจสอบความปลอดภัย API, JWT, Middleware
- **[ ] การปรับปรุงประสิทธิภาพระบบ:** การแบ่งหน้าข้อมูล (Pagination), ทำ Caching กรณีข้อมูลธุรกรรมปริมาณมาก

---

### 3. 💡 ฟีเจอร์เพิ่มเติมที่วางแผนไว้ในอนาคต (Future Feature Backlog)

ฟีเจอร์เพิ่มเติมที่สรุปจากความต้องการของผู้ใช้ เพื่อเตรียมออกแบบและพัฒนาใน Sprint ถัด ๆ ไป:

1. **[ ] การคำนวณรายจ่ายเฉลี่ย/วัน (Daily Average Expenses):** คำนวณและแสดงผลค่าเฉลี่ยการใช้จ่ายรายวันประจำเดือน เพื่อช่วยให้ผู้ใช้ประเมินพฤติกรรมการใช้จ่ายได้ชัดเจนยิ่งขึ้น (พิจารณาแสดงบน Home Dashboard หรือ Analytics)
2. **[ ] ระบบวางแผนงบประมาณรายหมวดหมู่ (Category Budget Planning):** สามารถกำหนดเพดานงบประมาณรายจ่ายล่วงหน้าในแต่ละหมวดหมู่ประจำเดือน พร้อมระบบแจ้งเตือนเมื่อใช้จ่ายใกล้เต็มงบ
3. **[ ] ระบบผู้ช่วยอัจฉริยะด้วยข้อความและเสียง (AI Smart Assistant / Voice & Text Action):** พิมพ์หรือพูดคำสั่งเสียงภาษาธรรมชาติเพื่อให้ผู้ช่วย AI ดำเนินการเพิ่ม, แก้ไข, หรือลบรายการธุรกรรม, หมวดหมู่, และสินทรัพย์โดยอัตโนมัติ
4. **[ ] ระบบจัดการหนี้สินและเป้าหมายเงินออม (Debts & Savings Goals):** ติดตั้งโมดูลติดตามภาระหนี้สิน (Debts/Liabilities) และระบบตั้งเป้าหมายการออมเงิน (Savings Goals) พร้อม Progress Tracking
5. **[ ] ระบบคำนวณยอดเงินพร้อมใช้ (Spendable / Available Balance):** คำนวณยอดเงินคงเหลือที่สามารถนำไปใช้จ่ายได้จริง (สุทธิจากเงินออม เงินลงทุน หรือเงินสำรอง) แยกต่างหากจากยอดสินทรัพย์รวม (Total Assets)
6. **[ ] ระบบวิเคราะห์ภาษีและการลดหย่อน (Tax Calculation & Deduction Tracker):** ระบบรวบรวมรายได้สะสม สรุปหมวดหมู่ค่าใช้จ่าย/สิทธิลดหย่อน และคำนวณภาษีเงินได้บุคคลธรรมดาประเมินปลายปี
7. **[ ] ระบบจัดสรรรายได้อัตโนมัติ (Income Allocation / Rule-based Splitting):** ตั้งค่ากฎการแบ่งเก็บแบ่งจ่ายอัตโนมัติเมื่อมีรายรับเข้ามา (เช่น 50% ค่าใช้จ่าย, 30% เงินออม, 20% ลงทุน)

