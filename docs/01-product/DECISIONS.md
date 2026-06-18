# Architecture Decisions

## 2026-06

### Product Type

Decision

Personal Finance Dashboard

Reason

เน้นการวิเคราะห์ภาพรวมการเงินและการบันทึกที่รวดเร็ว เพื่อให้ผู้ใช้เข้าใจสถานะการเงินของตนเอง

---

### UX Direction

Decision

Mobile First & Desktop Optimized

Reason

การบันทึกรายการมักเกิดขึ้นบนมือถือ แต่การดูรายงานเชิงลึกจะได้ประสบการณ์ที่ดีกว่าบนหน้าจอขนาดใหญ่

---

### Storage Strategy

Decision

Online-First (Cloud Persistence) with Guest LocalStorage

Reason

เพื่อความง่ายในการพัฒนาและลดความซับซ้อนในการจัดการข้อมูล โดยใช้ LocalStorage สำหรับ Guest และยึดฐานข้อมูลบน Server เป็นหลักสำหรับผู้ใช้ที่ลงทะเบียนแล้ว

---

### User Onboarding

Decision

Guest First (LocalStorage) -> Login Required for Cloud Persistence

Reason

ลดแรงต้านในการเริ่มใช้งาน (Frictionless Onboarding) ให้ผู้ใช้ลองเล่นระบบได้เต็มที่โดยใช้ LocalStorage และผลักดันให้ Login เมื่อต้องการความปลอดภัยและการเข้าถึงข้อมูลจากหลายอุปกรณ์ (Cloud Persistence)

---

### Navigation

Mobile

- Home
- Journal
- Add
- Analytics
- More

Desktop

- Sidebar Navigation

Reason

เพื่อให้เหมาะสมกับพื้นที่หน้าจอและพฤติกรรมการใช้งานในแต่ละอุปกรณ์

---

### Financial Model

Decision

Everything is a Transaction (Event Sourcing Style)

Reason

เพื่อให้สามารถคำนวณยอดเงินย้อนหลังและทำ Analytics ได้อย่างแม่นยำ รวมถึงรองรับฟีเจอร์ Transfer และ Adjustment ได้อย่างสมบูรณ์

---

### Frontend Stack

Decision

Next.js, Tailwind, shadcn/ui, Zustand, TanStack Query

Reason

เป็น Stack ที่ทันสมัย มีประสิทธิภาพสูง และเหมาะสมกับการสร้าง Web Application ที่มีความซับซ้อนปานกลาง

---

### Backend Stack

Decision

NestJS, Prisma, PostgreSQL

Reason

เน้นความมั่นคงของระบบ (Type Safety) และความสะดวกในการจัดการฐานข้อมูลผ่าน ORM ที่มีประสิทธิภาพ
