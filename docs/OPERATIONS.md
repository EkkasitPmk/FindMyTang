# FindMyTang Operations Runbook

เอกสารนี้ใช้สำหรับ Public Beta และ Production โดยเน้นการป้องกันข้อมูลการเงินสูญหายและการกู้คืนแบบตรวจสอบได้

## Backup policy

- ใช้ Automatic Backup ของ Supabase เป็น backup หลักของ PostgreSQL
- ตั้ง retention ตามแผนบริการที่เลือก และบันทึกวันหมดอายุไว้ใน release/operations record
- เก็บ backup สำรองแบบ export แยกจากฐานข้อมูลหลักก่อน migration สำคัญหรือการเปลี่ยน schema ใหญ่
- ห้ามเก็บ `DATABASE_URL`, service-role key หรือไฟล์ backup ใน Git
- Backup ถือว่ายังใช้ไม่ได้จนกว่าจะทดสอบ restore สำเร็จ

## Restore drill

ทำอย่างน้อยหนึ่งครั้งก่อนเปิดใช้งาน production อย่างเป็นทางการ และทำซ้ำหลังเปลี่ยน provider หรือ schema สำคัญ

1. สร้างฐานข้อมูล restore target แยกจาก production ห้าม restore ทับฐานข้อมูลจริง
2. Restore backup ล่าสุดหรือเลือก point-in-time ที่ต้องการลง target
3. ตั้ง `DATABASE_URL` ชั่วคราวให้ชี้ไป target และรัน `npm run db:status` จาก `apps/api`
4. ตรวจข้อมูลขั้นต่ำ:
   - จำนวนผู้ใช้และสินทรัพย์สมเหตุสมผล
   - ยอดรวมและรายการธุรกรรมของผู้ใช้ตัวอย่างตรงกับก่อน backup
   - soft delete, archive, transfer และ adjustment ยังอยู่ครบ
   - attachment URL ไม่ถูกเปลี่ยนโดยไม่ตั้งใจ
5. รัน API build และตรวจ Critical User Flows บนสภาพแวดล้อมทดสอบ
6. บันทึกเวลา backup, เวลา restore, target, ผลตรวจ และเวลาที่ใช้กู้คืน
7. ลบ restore target และ credential ชั่วคราวตามนโยบายของ provider

## Production incident restore

หากต้องกู้คืน production จริง:

1. หยุดหรือจำกัดการเขียนข้อมูลเพื่อป้องกันข้อมูลใหม่หาย
2. เก็บ snapshot ของสถานะปัจจุบันก่อน restore เพื่อย้อนกลับได้
3. เลือก backup และ restore point ที่ผู้รับผิดชอบอนุมัติ
4. Restore ไปยัง target และตรวจสอบข้อมูลตามรายการ Restore drill
5. เปลี่ยน traffic ไปยัง target เมื่อ health check และ critical flows ผ่าน
6. สื่อสารช่วงเวลาที่ข้อมูลอาจสูญหายตาม RPO ที่ provider รับรอง
7. เก็บ incident record และทำ post-incident review

## Evidence checklist

- [ ] Automatic backup เปิดใช้งานแล้ว
- [ ] มี retention และผู้รับผิดชอบชัดเจน
- [ ] Restore drill ผ่านอย่างน้อย 1 ครั้ง
- [ ] มีบันทึก RTO/RPO ที่วัดได้จากการซ้อมจริง
- [ ] มีช่องทางแจ้ง incident และ rollback decision
