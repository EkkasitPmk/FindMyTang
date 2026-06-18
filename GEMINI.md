# PocketNote Project AI Instructions

ไฟล์นี้ประกอบด้วยกฎเหล็กและคำแนะนำเฉพาะสำหรับโปรเจกต์ PocketNote ที่ AI เอเจนท์ต้องปฏิบัติตามอย่างเคร่งครัด กฎเหล่านี้มีความสำคัญสูงสุดเหนือกว่าค่าเริ่มต้นทั่วไป

## การสื่อสาร (Communication)

- **ภาษา:** ต้องตอบกลับผู้ใช้งานเป็น **ภาษาไทย** เสมอ

## ขั้นตอนการทำงาน (Workflow)

- **Frontend Development (apps/web):**
  - **กฎเหล็กสูงสุด:** การทำงานในส่วน Frontend ทุกอย่าง **ต้องยึดถือและปฏิบัติตาม `apps/web/AGENTS.md` เป็นคัมภีร์หลักอย่างเคร่งครัด 100%** ห้ามนำเสนอโครงสร้างหรือวิธีการอื่นที่ขัดกับไฟล์ดังกล่าวโดยเด็ดขาด
  - **Architecture:** ต้องใช้ Feature-Based Architecture, แยก Service (Axios), Hook (TanStack Query), Container และ Component (Presentation) ตามที่ระบุไว้
  - **Naming & Folder Structure:** ต้องเป๊ะตามที่ `AGENTS.md` กำหนดไว้ทุุกประการ

- **Backend Development (apps/api):**
  - **ปรัชญาการทำงาน (Ponytail Mode):** ยึดถือแนวทาง "Lazy Senior Developer" ตามไฟล์ `AGENTS.md` ซึ่งเน้นความมีประสิทธิภาพ (Efficient) ไม่ใช่ความสะเพร่า (Careless)
  - **YAGNI & Minimalism:** ยึดหลัก "You Ain't Gonna Need It" ไม่สร้าง Abstraction หรือ Boilerplate ที่ไม่ได้ร้องขอ เน้นเขียนโค้ดที่น้อยที่สุดแต่ทำงานได้จริง (Working Minimum)
  - **Standard Library First:** เลือกใช้ฟีเจอร์ของ Standard Library หรือ Native Platform ก่อนการเพิ่ม Dependency ภายนอกเสมอ
  - **Critical Areas:** ห้ามละเลยเรื่อง Input Validation, Error Handling และ Security แม้จะเป็นการทำงานแบบ Minimalist ก็ตาม
  - **Documentation:** หากมีการทำ Shortcut เพื่อความรวดเร็ว ต้องกำกับด้วยคอมเมนต์ `// ponytail:` พร้อมระบุเหตุผลและแนวทางการปรับปรุงในอนาคต

- **Research First:**
- **Research First:** ไม่ว่าจะเป็นการเพิ่มฟีเจอร์ใหม่, การแก้ไขบั๊ก หรือการปรับปรุงระบบ (Refactoring) ต้องทำการค้นคว้าและอ่านเอกสารที่เกี่ยวข้องในโปรเจกต์ (เช่น ในโฟลเดอร์ `docs/` และ `AGENTS.md`) เพื่อทำความเข้าใจกฎเกณฑ์และสถาปัตยกรรมก่อนลงมือทำเสมอ
- **Progress Documentation:** เมื่อทำงานใดๆ เสร็จสิ้น (เช่น การเพิ่มฟีเจอร์, แก้ไขบั๊ก หรือ Refactor) **ต้องทำการอัปเดตสถานะในไฟล์เอกสารที่เกี่ยวข้องในโฟลเดอร์ `docs/` เสมอ** (เช่น `FEATURE_STATUS.md` หรือ `ROADMAP.md`) โดยต้องระบุ:
- งานที่ทำสำเร็จแล้ว (Completed)
- สิ่งที่จะต้องทำเป็นลำดับถัดไป (Next Actions)
  เพื่อความต่อเนื่องในการทำงานและให้ผู้ใช้อื่นหรือ AI เข้าใจสถานะล่าสุดของ Product ได้ทันที
