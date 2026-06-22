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
*   **Database Schema & API Rework (v2)**:
    *   แก้ไข Prisma Schema ยุบตาราง Profile เข้า User, ลบตาราง Session/SyncLog/TransactionAttachment เรียบร้อยแล้ว
    *   ปรับปรุง API ใน Module ต่างๆ (Auth, User, Asset, Category, Transaction) และลบ Session Module ออกอย่างสมบูรณ์ตามข้อตกลง
*   **Category Display Order Support**: เพิ่มการรองรับฟิลด์ `displayOrder` ใน Prisma model `Category` และตัวแปรเริ่มต้น รวมทั้งเพิ่ม API Endpoint `PATCH /categories/reorder` ในระดับหลังบ้านเพื่อรองรับการอัปเดตเรียงลำดับหมวดหมู่แบบกลุ่ม (Bulk Transaction) อย่างมีประสิทธิภาพ

#### 💻 งานด้านหน้าบ้าน (Frontend - apps/web)
*   **Guest Mode Core Store**: พัฒนา Zustand Store (`useGuestStore`) พร้อม LocalStorage Persistence สำเร็จ
*   **Zustand Store Persist & Helper**: พัฒนา `useIsGuest` helper hook เพื่อป้องกันปัญหา Hydration
*   **Clean Up**: ลบการตั้งค่าและฟังก์ชันระบบ Currency (สกุลเงิน) ออกทั้งหมดจากตัวแอป (ตามข้อตกลงในการลดยากของระบบ)
*   **Navigation & Layout Fixes**: แยก UI `LogoutConfirmModal` ออกจาก Logic (Presentation/Container Split) และปรับหน้าเมนูนำทางด้านล่างบนมือถือด้วย Grid 20% เท่ากัน
*   **Frontend Types & Hooks Rework (v2)**:
    *   ปรับปรุง Types ของ User (`UserProfile`), `Asset`, `Category` และ `Transaction` (เพิ่ม `toAssetId`, `toAsset`, `isSystem`, `color`, `deletedAt`) ให้ตรงตาม Database Schema v2 ของหลังบ้าน
    *   พัฒนา `sync-guest.hook.ts` สำหรับดึงและ Map ข้อมูลจาก Guest store เพื่อส่งซิงค์ไปยัง API `/auth/sync-guest` (Merge Flow) และแก้ไข Types ตอบกลับให้สอดคล้องกัน
*   **CSS Classes Cleanup**: ตรวจสอบและลบ className/CSS classes ที่ไม่มีการใช้งานหรือไม่ได้ประกาศไว้ใน `globals.css` ออกจากทุกๆ Element ใน Frontend components เรียบร้อยแล้ว (เช่น คลาสตัวหนังสือและสีแบบ Material Design 3 แบบเก่า ตลอดจน spacing classes ที่ถูกลบออกไป)
*   **LoginForm & RegisterForm Spacing Improvements**: ออกแบบและปรับปรุงระยะห่าง (Spacing) และ Layout ของ LoginForm และ RegisterForm ให้สวยงามในรูปแบบ Card ที่มีความโค้งมนและมีมิติที่พรีเมียมมากขึ้น ปรับระยะห่างระหว่าง Element ด้วยมาตรฐาน Tailwind CSS Utility classes เรียบร้อยแล้ว
*   **Category List UI & API Integration**: พัฒนาการแสดงผลรายการหมวดหมู่ (Category List) ดึงข้อมูลตรงจาก API (`useCategories`) ตามโครงสร้าง UI Mockup พร้อมรองรับการสลับแท็บ Expenses/Income รวมถึง Map ไอคอนและสีตามการตั้งค่าของข้อมูลแต่ละรายการเรียบร้อยแล้ว
*   **Category Delete Confirmation UI**: ปรับปรุง UI ยืนยันการลบหมวดหมู่ (Category Delete) โดยเปลี่ยนจาก native `window.confirm` ไปใช้ `ConfirmModal` ร่วมกับไอคอน `CircleX` ทำให้ UX ของระบบจัดการหมวดหมู่สมบูรณ์และสวยงามยิ่งขึ้น
*   **Category Drag & Drop Reordering**: พัฒนาฟังก์ชันการลากและวาง (Drag & Drop) จัดตำแหน่งหมวดหมู่ตามต้องการด้วย native HTML5 drag-and-drop API และได้เพิ่มการรองรับอุปกรณ์พกพา (Mobile Drag Support) โดยใช้ Touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) และ `document.elementFromPoint` ในการคำนวณสลับตำแหน่งอย่างลื่นไหลและตัดการ Scroll หน้าจอขณะลากด้วย `touch-action: none` เพื่อรองรับการทำงานบนมือถือ 100% โดยไม่ต้องพึ่งพา dependency ภายนอกเพิ่มเติมตามกฎ YAGNI
*   **ESLint Error Fixes (Category & Guest Store)**: แก้ไขข้อผิดพลาดจากกฎ `react-hooks/set-state-in-effect` ในไฟล์ [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) (บรรทัด 62) โดยการเปลี่ยนมาซิงค์สถานะ `localCategories` ใน Render Phase (ตามแนวทาง You Might Not Need an Effect ของ React) แทนการเรียก `setState` ภายใน `useEffect` และแก้ไขข้อผิดพลาดประเภทเดียวกันใน [guest-store.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/lib/store/guest-store.ts) ให้เรียก `setMounted` แบบ Asynchronous เพื่อให้ระบบผ่านการตรวจสอบคุณภาพโค้ด (Lint/Build) 100%
*   **CUCategoryModal Restoration**: กู้คืนและสร้างไฟล์ [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) เพื่อนำการเรียกใช้งาน Modal การเพิ่ม/แก้ไขหมวดหมู่กลับมาให้ทำงานร่วมกับ [CategoryContainer](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) และ [CategoryForm](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CategoryForm.tsx) ได้อย่างสมบูรณ์ พร้อมเชื่อมโยงระบบ validation ของ Zod และ state sync
*   **CUCategoryModal Optimization & Visual Quality Fix**: ปรับปรุง [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) โดยเปลี่ยนจากคำนวณ HSL (ซึ่งมีบั๊กต่อสตริงใน CSS ทำให้การเรนเดอร์พื้นหลังโปร่งใสไอคอนพัง) มาเป็นชุดสี Premium HEX (24 สี) ที่มีประสิทธิภาพสูง พร้อมอัปเดตระบบแมปไอคอนหมวดหมู่เป็นศูนย์กลาง (`getCategoryIcon` / `getCategoryEmoji` ใน [category-icons.config.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/lib/configs/category-icons.config.ts)) เพื่อแก้บั๊กไอคอนหมวดหมู่ custom แสดงเป็นไอคอนช้อนส้อมเริ่มต้น และปรับปรุงการแสดงผลในหน้าประวัติธุรกรรม [TransactionList.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/transactions/components/TransactionList.tsx) และ dropdown เลือกหมวดหมู่ [ExpenseForm.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/transactions/components/ExpenseForm.tsx) และ [IncomeForm.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/transactions/components/IncomeForm.tsx) ให้สวยงามสอดคล้องกัน 100%

*   **CUCategoryModal Presentation Rework & Bug Fix (AGENTS.md Compliance)**: ปรับปรุงโครงสร้างไฟล์ [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) ให้เป็นไปตามสถาปัตยกรรมที่ระบุไว้ใน [AGENTS.md](file:///Users/torikiton/Desktop/PocketNote/AGENTS.md) โดยแยก Form management (React Hook Form), Local UI States (เช่น `customColor`) และ Compute Logic ไปไว้ใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) ทั้งหมด เพื่อรักษาสถาปัตยกรรมแบบ Presentation Component อย่างเข้มงวด และย้าย Static Configurations ไปอยู่ใน [category.config.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/configs/category.config.ts) อย่างเป็นระบบ พร้อมกับแก้ไขบั๊ก ReferenceError และเปลี่ยนมาซิงค์สเตตผ่าน Render Phase บน Container เพื่อหลีกเลี่ยง cascading renders และผ่านกฎ ESLint 100%
*   **Remove Icon Search Feature from CUCategoryModal**: ทำการลบฟีเจอร์ค้นหาไอคอน (Search Input for Icons) ออกจาก [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) และตัวควบคุมสถานะใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) เพื่อให้ UI กลับมาเป็นแบบดั้งเดิมที่เรียบง่ายและไม่เปลี่ยนแปลงโครงสร้าง UI ที่ไม่ได้ร้องขอตามข้อตกลง
*   **Default Categories Icons Alignment with API**: ปรับปรุงไอคอนให้เลือก (Selectable Icons) ใน [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) โดยอ้างอิงให้มีไอคอนของ Default Categories ในระดับ API ([default-categories.ts](file:///Users/torikiton/Desktop/PocketNote/apps/api/src/common/constants/default-categories.ts)) ครบถ้วนเป็น 18 ลำดับแรก และนำข้อมูลไอคอนต้นทาง (Legacy string) มากำหนดให้กับหมวดหมู่โดยตรงเพื่อให้ระบบบันทึกและแก้ไขข้อมูลสอดคล้องกัน 100% ปราศจากความซ้ำซ้อน
*   **Expand Preset Colors to 62, Row Distribution, & Retain Custom Color**: ปรับเพิ่มจำนวนสีสำเร็จรูปใน [category.config.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/configs/category.config.ts) เป็น 62 สีพรีเมียม และทำการจัดเรียงสลับตำแหน่ง (Interleave) ของแต่ละเฉดสี เพื่อให้ในแต่ละแถว (Row ของ Grid 6 คอลัมน์) มีโทนสีและเฉดสีอื่นๆ ที่หลากหลายผสมผสานกันอย่างงดงาม ไม่ได้กระจุกเป็นเฉดสีเดียวกันทั้งแถว พร้อมทั้งยังคงรักษาและกู้คืนฟังก์ชันการเลือกสีเน้นที่กำหนดเอง (Custom ColorPicker ปุ่ม `+` HTML5 color input) ใน [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) and [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) ให้ทำงานได้อย่างสมบูรณ์ โดยไม่นับปุ่มกำหนดสีเองนี้เป็นหนึ่งใน 62 สีสำเร็จรูป
*   **Expand Selectable Icons List & Backdrop Scroll Layout**: เพิ่มรายการไอคอนที่เลือกได้ (Selectable Icons) ใน [category-icons.config.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/lib/configs/category-icons.config.ts) และนำเข้าไอคอนจาก Lucide-React เพิ่มเติมอีก 30+ รายการ ครอบคลุมหลายหมวดหมู่ พร้อมทั้งยกเลิกขอบเขตความสูงและ Scrollbar ทั้งหมดภายในหน้าต่างฟอร์มและ Grid ย่อยใน [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) แล้วเปลี่ยนมาใช้ระบบ Scroll ในระดับ Backdrop ภายนอกสุดแทน ทำให้รายการสีและไอคอนเรนเดอร์ยาวเหยียดแสดงออกมาให้เห็นทั้งหมด 100% โดยไม่มีการจำกัดความสูงหรือบดบังสายตา และเลื่อนหน้าจอเลื่อนหน้ากากได้อย่างอิสระ
*   **Selectable Category Icons Expansion**: เพิ่มไอคอนจาก Lucide-react เพิ่มเติมอีก 56 ไอคอนใน [category-icons.config.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/lib/configs/category-icons.config.ts) ครอบคลุมหมวดหมู่อาหาร/ของหวาน (Soup, Beer, IceCream, Fish, Egg, Croissant, Popcorn, Cookie), ท่องเที่ยว/กิจกรรม (Map, Globe, Compass, Landmark, Luggage, Tent, Mountain, Anchor, Ship), บ้าน/ของใช้ (Sofa, Lightbulb, Plug, Bath, Brush), อุปกรณ์ไอที (Laptop, Tablet, Mouse, Printer), การเงิน/ธุรกิจ (Banknote, Percent, CirclePercent, Presentation, ShieldCheck), สุขภาพ/บริการ (Hospital, Ambulance, Footprints, Eye, Syringe), ความบันเทิง/งานอดิเรก (Book, Bookmark, PenTool, Palette, Mic, Headphones, Camera, Clapperboard, Target), และธรรมชาติ/สิ่งแวดล้อม (PawPrint, TreePine, Flower2, Leaf, Bell, Calendar, Clock, Star, Cloud, Moon) เพื่อตอบสนองความต้องการของผู้ใช้และช่วยให้ตั้งค่าหมวดหมู่การเงินมีความละเอียดและหลากหลายยิ่งขึ้น
*   **Category Container Global Error Toast**: ปรับปรุงไฟล์ [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) โดยลบ state `globalError` ที่ไม่มีการเรนเดอร์ใน UI ออกทั้งหมด และปรับมาใช้การแสดงผลข้อผิดพลาดแบบ Global จาก API ผ่านระบบ Toast แจ้งเตือน (`toast.error(...)`) ในกรณีที่เกิดข้อผิดพลาดในการบันทึกหรือปรับปรุงข้อมูลหมวดหมู่ที่ไม่เกี่ยวกับฟิลด์หลัก ทำให้ระบบรองรับการแจ้งเตือนผู้ใช้อย่างถูกต้องและโค้ดมีความคลีน กระชับตามแนวทาง Ponytail Mode
*   **Category Optional Chaining Refactor**: ปรับปรุงโค้ดใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) (บรรทัดที่ 62-63) โดยเปลี่ยนการตรวจสอบความมีอยู่ของ `editingCategory` และ `editingCategory.color` มาใช้ Optional Chain Expression (`editingCategory?.color`) เพื่อให้โค้ดกระชับ อ่านง่าย และตรงตามแนวทาง Ponytail Mode
*   **React Compiler Compatibility (CategoryContainer)**: ปรับปรุงโค้ดใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) โดยการนำเข้า `useWatch` และส่ง `control` เข้าไปแทนการเรียกใช้ `watch()` จาก `useForm()` เพื่อแก้ไขคำเตือน `react-hooks/incompatible-library` ที่ทำให้ React Compiler ข้ามการ memoize (Compilation Skipped) ใน component นี้ ทำให้ component สามารถ optimized ด้วย React Compiler ได้อย่างปลอดภัย และผ่านการตรวจสอบคุณภาพโค้ด (ESLint Linting) 100%
*   **Prefer `.dataset` over `getAttribute` (CategoryContainer)**: ปรับปรุงโค้ดใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) (บรรทัดที่ 190) โดยเปลี่ยนการดึงข้อมูล `data-index` จาก `getAttribute("data-index")` มาใช้ `dataset.index` พร้อมทำการแคสต์ `itemElement` เป็น `HTMLElement` เพื่อให้สอดคล้องกับมาตรฐานการเข้าถึง dataset และลดการใช้ attribute selector โดยตรง
*   **Prefer `Number.parseInt` and `Number.isNaN` (CategoryContainer)**: ปรับปรุงโค้ดใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) (บรรทัดที่ 195-196) โดยเปลี่ยนการเรียกใช้ `parseInt` และ `isNaN` เป็น `Number.parseInt` และ `Number.isNaN` เพื่อให้เป็นไปตามมาตรฐานการพัฒนาที่ทันสมัยและเพิ่มความปลอดภัยของไทป์
*   **CategoryContainer Accessibility Fix**: ปรับปรุงปุ่ม New Category ใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) (บรรทัดที่ 369-375) โดยเปลี่ยนการใช้งาน element แบบ non-native (`div` ที่มี `onClick`) ไปเป็น native HTML `button` element ที่ระบุ `type="button"` เพื่อให้ตัวแอปพลิเคชันรองรับการทำงานในแง่ Accessibility (tabbing, mouse, keyboard, และ touch inputs) ได้อย่างถูกต้องตามข้อกำหนด
*   **Category Grid Items Accessibility Fix**: ปรับปรุงปุ่มรายการหมวดหมู่ใน [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) (บรรทัดที่ 390-425) โดยย้ายคุณสมบัติความเคลื่อนไหว (Drag and Drop, Touch handlers) และ `data-index` จากเดิมที่อยู่บน wrapper `div` มาอยู่บนปุ่มหลักที่เป็น native `<button>` โดยตรง ทำให้หลีกเลี่ยงการใช้ `role="button"` บนอิลิเมนต์ที่เป็น non-native ทั้งหมด และป้องกันการเกิด Invalid HTML จากการมีปุ่มซ้อนปุ่มได้อย่างสมบูรณ์
*   **Category Modal Key Index Fix**: แก้ไขไฟล์ [CUCategoryModal.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CUCategoryModal.tsx) โดยเลิกใช้ Array Index เป็น `key` สำหรับการแมปรายการเฉดสี (PREMIUM_COLORS) และเปลี่ยนมาใช้ค่าสี (`color`) ซึ่งมีความเฉพาะตัวและเป็นเอกลักษณ์แทนตามคำร้องขอ เพื่อป้องกันการเรนเดอร์ซ้ำโดยไม่จำเป็นและรักษามาตรฐานของ React
*   **Category Icons Alignment between Types**: ปรับปรุงการทำงานของระบบแมปไอคอนหมวดหมู่ให้มีลักษณะการแมปเป็นอันหนึ่งอันเดียวกัน (Identical Mapping) สำหรับทั้ง 2 ประเภทธุรกรรม (INCOME และ EXPENSE) โดยยกเลิกการแบ่ง logic ไอคอนเฉพาะประเภทใน `getCategoryIcon` เพื่อให้ไอคอนที่ชื่อเดียวกันแสดงหน้าตาเหมือนกันและจัดเรียงเหมือนกันเป๊ะในหน้าต่างเลือกและทุกส่วนของระบบ พร้อมกับเพิ่มไอคอน `HandCoins` เข้าไปในระบบ Selectable Icons เพื่อรักษาฟีเจอร์การเลือกไอคอนรูปมือถือเหรียญ
*   **Category UI Representation Separation (AGENTS.md Compliance)**: ทำการแยกส่วนแสดงผลกริดหมวดหมู่ (Categories Grid) และฟังก์ชัน Drag & Drop UI จาก [CategoryContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/containers/CategoryContainer.tsx) ไปสร้างเป็นไฟล์เฉพาะ [CategoryGrid.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/category/components/CategoryGrid.tsx) เพื่อให้ตรงกับมาตรฐานสถาปัตยกรรมแบบ Presentation Component ของ `AGENTS.md` ทำให้ตัว Container ทำหน้าที่เพียงการเชื่อมต่อ hooks และจัดการ Logic เท่านั้น
*   **i18n Localization Engine & Store**: พัฒนาระบบแปลภาษาและเก็บสถานะภาษาปัจจุบันด้วย Zustand [i18n-store.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/lib/i18n/i18n-store.ts) พร้อมระบบ persist ลงใน LocalStorage
*   **Translations Dictionary**: จัดทำพจนานุกรมสองภาษา (ไทย/อังกฤษ) [translations.ts](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/shared/lib/i18n/translations.ts) สำหรับข้อความและปุ่มหลักๆ ในระบบ
*   **Preferences & Navigation i18n Integration**: เชื่อมต่อฟังก์ชันสลับภาษาจริงที่ปุ่มสลับภาษาใน PREFERENCES หน้า `/more` [MoreContainer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/more/containers/MoreContainer.tsx) และเมนูนำทางหลักทั้งหมดของแอปพลิเคชัน ([DesktopSidebar.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/DesktopSidebar.tsx), [MobileBottomNav.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/MobileBottomNav.tsx), [MobileDrawer.tsx](file:///Users/torikiton/Desktop/PocketNote/apps/web/src/features/nav/components/MobileDrawer.tsx)) ทำให้แอปพลิเคชันสลับภาษาแบบ Reactive ได้ทันทีโดยไม่ต้องลง Dependency ภายนอกเพิ่มเติม

---

### 2. สิ่งที่ต้อง Rework และอยู่ระหว่างดำเนินการ (Rework & In Progress)
*   *ขณะนี้ขั้นตอน Rework และปรับเปลี่ยนโครงสร้างพื้นฐาน v2 ในระดับ Backend และ Frontend Types/Hooks หลักเสร็จสมบูรณ์แล้ว อยู่ในระหว่างเตรียมพัฒนาฟีเจอร์ระดับ UI และ Flow เชื่อมต่อ*

---

### 3. งานที่จะต้องทำเป็นลำดับถัดไป (Next Actions)

*   [x] **พัฒนา UI การจัดการหมวดหมู่เพิ่มเติม (Category CRUD - Form & Actions)**: ทำฟอร์มสำหรับเพิ่ม/แก้ไขหมวดหมู่ส่วนตัว พร้อมเชื่อมโยง Action การลบและการบันทึกข้อมูลให้สมบูรณ์ (Sprint 1)
*   [ ] **พัฒนาหน้าแก้ไขโปรไฟล์ (Profile UI)**: ทำหน้าจอแก้ไขข้อมูลชื่อผู้ใช้ และตัวเลือกสลับภาษา/โซนเวลาจริง (Sprint 2)
*   [ ] **พัฒนา UI ระบบกลไกซิงค์ข้อมูล (Guest Sync UI)**: สร้าง Popup ยืนยันการ Merge ข้อมูล และวิดเจ็ตแสดงผลสถานะการซิงค์พร้อมปุ่ม Sync ซ้ำ (Sprint 2)
*   [ ] **พัฒนาและเชื่อมต่อธุรกรรมขั้นสูง (Transfer & Adjustment UI/API)**: เชื่อมต่อหน้าจอประวัติธุรกรรมแบบสมบูรณ์และหน้าสำหรับการโอนเงิน/ปรับปรุงยอดบัญชี (Sprint 2)
