# Domain Model

## Ubiquitous Language

| คำศัพท์ | ความหมาย |
|-------|---------|
| User | เจ้าของข้อมูลผู้ใช้งานระบบ |
| Profile | ข้อมูลส่วนตัวเบื้องต้นของผู้ใช้ (ชื่อ, รูปภาพ, การตั้งค่า) |
| Asset | แหล่งเก็บเงิน/สินทรัพย์ (เช่น เงินสด, ธนาคาร, หุ้น) |
| Category | หมวดหมู่สำหรับจัดกลุ่มรายรับหรือรายจ่าย |
| Transaction | รายการบันทึกทางการเงินที่เกิดขึ้น (รายรับ, รายจ่าย, โอน, ปรับยอด) |
| Journal | ศูนย์รวมประวัติรายการบันทึกทั้งหมด |
| Dashboard | หน้าสรุปภาพรวมทางการเงินหลัก |

---

## Aggregates & Entities

### User & Profile
- **User**: เอนทิตีหลักสำหรับการยืนยันตัวตน (Email, Password)
- **Profile**: ข้อมูลส่วนตัว (DisplayName, Avatar, Preferred Currency, Language)

### Asset (สินทรัพย์)
- เป็น Root สำหรับการติดตามยอดเงิน
- ประกอบด้วย: Name, Type (Cash, Bank, etc.), Balance (Calculated), Color, Icon

### Category (หมวดหมู่)
- ใช้สำหรับจำแนกประเภทของรายการ
- ประกอบด้วย: Name, Type (Income, Expense), Icon, Color

### Transaction (รายการบันทึก)
- เป็นเอนทิตีที่สำคัญที่สุดที่เป็นตัวกำหนดการเปลี่ยนแปลงของข้อมูล
- ประเภท (Type):
    - **INCOME**: เพิ่มเงินใน Asset
    - **EXPENSE**: ลดเงินใน Asset
    - **TRANSFER**: โอนเงินระหว่าง Assets (From -> To)
    - **ADJUSTMENT**: ปรับยอดเงินให้ตรงกับความเป็นจริง
- ข้อมูลประกอบ: Amount, Date, Note, Category, Asset

---

## Domain Relationships

- **User (1) <-> (1) Profile**: ผู้ใช้หนึ่งคนมีหนึ่งโปรไฟล์
- **User (1) <-> (N) Asset**: ผู้ใช้สามารถมีกี่สินทรัพย์ก็ได้
- **User (1) <-> (N) Category**: ผู้ใช้สามารถมีหมวดหมู่ของตนเองได้
- **User (1) <-> (N) Transaction**: ผู้ใช้เป็นเจ้าของรายการบันทึกทั้งหมด
- **Asset (1) <-> (N) Transaction**: หนึ่งสินทรัพย์เกี่ยวข้องกับหลายรายการ
- **Category (1) <-> (N) Transaction**: หนึ่งหมวดหมู่เกี่ยวข้องกับหลายรายการ

---

## Core Business Rules

1. **Asset-Centric Balance**: ยอดเงินคงเหลือใน Asset มาจากการประมวลผล Transactions ทั้งหมดที่เกี่ยวข้อง
2. **Transaction Integrity**: รายการบันทึกเมื่อเกิดขึ้นแล้ว ข้อมูลจำนวนเงินและวันที่ต้องมีความถูกต้องและตรวจสอบได้
3. **No Cross-User Access**: ข้อมูลทั้งหมดต้องถูกกั้นแยกตาม User ID อย่างเข้มงวด
4. **Consistency**: การโอนเงิน (Transfer) ต้องมีสถานะที่สมบูรณ์ทั้งฝ่ายต้นทางและปลายทางในคราวเดียว
