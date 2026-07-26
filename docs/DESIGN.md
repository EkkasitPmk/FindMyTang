# FindMyTang Design System: Semantic Color System

สรุปแนวทางการออกแบบระบบสีสำหรับ FindMyTang (ปรับปรุงจาก Material Design 3 มาเป็น Semantic Color System เพื่อความเรียบ สะอาด และให้ความสำคัญกับข้อมูลการเงินเป็นหลัก)

---

## 1. หลักการออกแบบ (Design Principle)

- **เรียบง่ายและเน้นข้อมูล (Minimal & Data-Focused):** ลดความซับซ้อนของสีในระบบ UI เพื่อให้ข้อมูลการเงินมีความโดดเด่นและชัดเจนที่สุด
- **แยกแยะประเภทสี (Color Separation):** แยกสีกระบวนการทำงานของแอป (UI & Brand Colors) ออกจากสีแสดงผลข้อมูลการเงิน (Financial Data Colors) เพื่อป้องกันความสับสนในการใช้งาน

---

## 2. โครงสร้างระบบสี (Color Palette)

### 2.1 Brand & UI Colors (องค์ประกอบและโครงสร้าง UI)

เน้นการใช้กลุ่มสี Neutral (ประมาณ 90% ของหน้าจอ) และใช้ Brand Color สำหรับจุดที่ต้องการให้เกิดการโต้ตอบ (Interactive)

| Color Name          | Light Mode | Dark Mode | การใช้งาน                                                                         |
| :------------------ | :--------- | :-------- | :-------------------------------------------------------------------------------- |
| `background`        | `#FAFAFA`  | `#111827` | พื้นหลังหลักของแอปพลิเคชัน                                                        |
| `surface`           | `#FFFFFF`  | `#1F2937` | พื้นผิวหลัก เช่น Card, Dialog, Sidebar                                            |
| `surface-secondary` | `#F5F5F5`  | `#374151` | สถานะ Hover ของ Card หรือพื้นหลังย่อย                                             |
| `border`            | `#E5E7EB`  | `#374151` | เส้นขอบ (Border), เส้นคั่น (Divider)                                              |
| `text-primary`      | `#111827`  | `#F9FAFB` | ข้อความหลัก, หัวข้อ (Heading)                                                     |
| `text-secondary`    | `#6B7280`  | `#9CA3AF` | ข้อความรอง, คำอธิบาย (Description)                                                |
| `text-disabled`     | `#9CA3AF`  | `#4B5563` | ข้อความหรือปุ่มที่ปิดใช้งาน                                                       |
| `primary`           | `#2563EB`  | `#3B82F6` | สีหลักของแบรนด์ (ปุ่มหลัก, Link, Active State, Focus Ring) สื่อถึงความน่าเชื่อถือ |
| `primary-hover`     | `#1D4ED8`  | `#60A5FA` | ปุ่มหลักขณะ Hover                                                                 |
| `primary-light`     | `#DBEAFE`  | `#1E3A8A` | พื้นหลังของ Active elements                                                       |

---

### 2.2 Financial Data & Status Colors (ข้อมูลการเงินและสถานะ)

ใช้สีเฉพาะเพื่อระบุประเภทธุรกรรมและการแสดงผลรายงานกราฟ (Dashboard & Analytics) ช่วยให้ผู้ใช้จดจำรูปแบบข้อมูลได้ทันที

| Color Name               | Light Mode         | Light Tint | Dark Mode          | Dark Tint | การใช้งานหลัก                                                          |
| :----------------------- | :----------------- | :--------- | :----------------- | :-------- | :--------------------------------------------------------------------- |
| `income` / `success`     | `#16A34A` (เขียว)  | `#DCFCE7`  | `#22C55E` (เขียว)  | `#14532D` | รายรับ (Income), การทำงานสำเร็จ (Success/Completed)                    |
| `expense` / `danger`     | `#DC2626` (แดง)    | `#FEE2E2`  | `#EF4444` (แดง)    | `#7F1D1D` | รายจ่าย (Expense), ปุ่มลบ (Delete), ข้อผิดพลาด (Error)                 |
| `transfer`               | `#7C3AED` (ม่วง)   | -          | `#8B5CF6` (ม่วง)   | -         | รายการโอนเงิน (Transfer)                                               |
| `investment` / `warning` | `#F59E0B` (เหลือง) | `#FEF3C7`  | `#F59E0B` (เหลือง) | `#78350F` | การลงทุน (Investment), รายการรอตรวจสอบ (Pending), แจ้งเตือน (Reminder) |
| `info`                   | `#0EA5E9` (ฟ้า)    | `#E0F2FE`  | `#0EA5E9` (ฟ้า)    | `#0C4A6E` | ข้อมูลทั่วไป (Information)                                             |
| `highlight`              | `#EA580C` (ส้ม)    | `#FFEDD5`  | `#F97316` (ส้ม)    | `#7C2D12` | เน้นจุดดึงสายตาเฉพาะจุด, Badge, Asset Card                             |

---

## 3. ตารางการนำไปใช้งานจริง (Mapping Summary)

| ลักษณะการใช้งาน                            | ตัวเลือกสีที่ใช้ (Color Key) |
| :----------------------------------------- | :--------------------------- |
| Background ของหน้าจอ                       | `background`                 |
| Container / Card                           | `surface`                    |
| Hover บน Container / Card                  | `surface-secondary`          |
| เส้นแบ่งช่อง / กรอบอินพุต                  | `border`                     |
| หัวข้อ (Heading)                           | `text-primary`               |
| คำอธิบายประกอบ (Description)               | `text-secondary`             |
| ตัวหนังสือเมื่อคลิกไม่ได้ (Disabled)       | `text-disabled`              |
| ปุ่มกดสำคัญ / สถานะแอคทีฟ (Primary Action) | `primary`                    |
| ตัวเลขรายรับ                               | `income`                     |
| ตัวเลขรายจ่าย                              | `expense`                    |
| รายการโอนเงิน                              | `transfer`                   |
| รายการการลงทุน                             | `investment`                 |
| การแจ้งเตือน / Badge ไฮไลต์                | `highlight`                  |
