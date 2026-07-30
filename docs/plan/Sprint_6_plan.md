# Sprint 6: Production Blockers Plan

> เป้าหมายระยะนี้: ทำให้ FindMyTang พร้อมสำหรับการ deploy แบบ staging โดยลดความเสี่ยงด้านความปลอดภัย การเชื่อมต่อฐานข้อมูล และการตรวจสอบระบบให้เหลือน้อยที่สุด

สถานะฟีเจอร์หลักของ MVP ถือว่าครบแล้ว และระบบอยู่ในช่วง **Public Beta** งานชุดนี้จึงยังไม่เพิ่มฟีเจอร์ใหม่ แต่ปิดจุดที่อาจทำให้ระบบ production ใช้งานไม่ได้หรือทำให้ข้อมูลการเงินเสียหาย พร้อมเก็บรายละเอียดจากผู้ใช้จริง

## เป้าหมายที่ต้องผ่าน

- API และ Web สร้าง production build ได้ซ้ำได้
- API มี health check ที่ตรวจได้ทั้ง process และฐานข้อมูล
- Production environment variables มีชื่อเดียวกันระหว่างโค้ด เอกสาร และ hosting
- ไม่มี default secret หรือ CORS ที่เปิดกว้างใน production
- Migration และ seed ทำงานกับฐานข้อมูล cloud ได้
- มี automated checks ขั้นต่ำก่อน deploy

## Phase 1: Code and build verification

- [x] รัน Web lint, test และ production build ด้วย Webpack (`11 files / 69 tests`, build ผ่าน)
- [x] รัน API lint, build, unit test และ e2e test (`21 unit tests`, `10 e2e tests` ผ่าน)
- [x] รัน TypeScript typecheck ของ API และ Web (`npx tsc --noEmit` ผ่านทั้งคู่)
- [x] ตรวจ Prisma client และ migration บนฐานข้อมูล local (`npm run db:migrate`, `npm run db:status`, `8 migrations`, schema up to date; staging ยังรอ provider จริง)
- [x] บันทึกคำสั่งตรวจสอบและผลลัพธ์ไว้ใน Decision Log/สถานะงาน
- [ ] ตรวจ API health และ Web root บน staging domain จริง

**เกณฑ์ผ่าน:** คำสั่งตรวจสอบทั้งหมดผ่าน หรือมีข้อยกเว้นที่บันทึกเหตุผลและผลกระทบไว้อย่างชัดเจน

## Phase 2: Production safety hardening

- [x] เพิ่ม `GET /api/v1/health` สำหรับ liveness/readiness
  - process ยังทำงานอยู่
  - เชื่อมต่อ Prisma/PostgreSQL ได้
  - ตอบสถานะที่เหมาะสมเมื่อ database ใช้งานไม่ได้
- [x] ทำให้ API fail fast เมื่อ production ไม่มี `DATABASE_URL`
- [x] ทำให้ API fail fast เมื่อ production ต่อฐานข้อมูลไม่ได้
- [x] ทำให้ API fail fast เมื่อ production ใช้ JWT หรือ cookie secret ค่า default
- [x] ตรวจและจำกัด CORS ด้วย allowlist จาก `ALLOWED_ORIGINS`
- [x] ตรวจ cookie settings สำหรับ HTTPS production (`secure`, `sameSite`, `domain`) และระบุ `SameSite=None` สำหรับ Vercel/Render คนละ site
- [x] บังคับ production ให้ใช้ `COOKIE_SECURE=true`, ตรวจค่า `COOKIE_SAME_SITE` และให้ `ALLOWED_ORIGINS` เป็น HTTPS เท่านั้น
- [x] ตรวจว่า Swagger และข้อมูล error ไม่เปิดเผย secret หรือข้อมูลส่วนตัวเกินจำเป็น (500 error ถูก mask ใน production และ response ไม่ส่ง stack trace)
- [x] ตรวจ rate limit และ request body limit ให้เหมาะกับ production (100 requests/minute, JSON/urlencoded 10MB, multipart file 10MB)

**เกณฑ์ผ่าน:** ยิง request ที่ไม่มี/ผิด environment สำคัญแล้วระบบปฏิเสธการ start หรือคืน error ที่ตรวจสอบได้ และ request จาก origin ที่ไม่ได้รับอนุญาตถูกปฏิเสธ

## Phase 3: Environment contract

จัดทำรายการ environment variables กลางหนึ่งชุด และใช้ชื่อให้ตรงกันทุกที่

### Backend

- [x] `DATABASE_URL`
- [x] `PORT`
- [x] `NODE_ENV=production`
- [x] `JWT_ACCESS_SECRET`
- [x] `JWT_REFRESH_SECRET`
- [x] `JWT_ACCESS_EXPIRES_IN`
- [x] `JWT_REFRESH_EXPIRES_IN`
- [x] `COOKIE_SECRET`
- [x] `COOKIE_DOMAIN` (ถ้าจำเป็น)
- [x] `COOKIE_SECURE=true`
- [x] `COOKIE_SAME_SITE`
- [x] `ALLOWED_ORIGINS`
- [x] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET` (ถ้าใช้ storage)

### Frontend

- [x] `NEXT_PUBLIC_URL_BACKEND` ให้ตรงกับชื่อที่โค้ดใช้จริง
- [x] ตรวจ rewrite `/api/:path*` ให้ชี้ไป backend staging/production ถูกตัว
- [x] ตรวจว่าไม่มี secret ฝั่ง backend ถูกใส่ใน `NEXT_PUBLIC_*`

**หมายเหตุ:** ใช้ชื่อที่โค้ดปัจจุบันอ่านจริงแล้ว: `ALLOWED_ORIGINS` และ `NEXT_PUBLIC_URL_BACKEND` เอกสารเดิมที่ใช้ชื่ออื่นต้องถือว่า obsolete

## Phase 4: Staging database verification

- [ ] สร้าง PostgreSQL staging แยกจากข้อมูลจริง
- [x] เพิ่มและตรวจคำสั่ง `npm run db:migrate`
- [ ] รัน seed สำหรับ category เริ่มต้น
- [ ] ตรวจ foreign key, soft delete, transfer และ adjustment ด้วยข้อมูลทดสอบ
- [x] เขียน backup/restore runbook ที่ [OPERATIONS.md](../OPERATIONS.md)
- [ ] เปิด Automatic Backup และทดสอบ Restore อย่างน้อยหนึ่งรอบบน provider จริง
- [ ] ห้ามใช้ `prisma db push` กับฐานข้อมูล production

**เกณฑ์ผ่าน:** สร้างฐานข้อมูล staging ใหม่จากศูนย์ได้ และ flow สำคัญทำงานครบโดยไม่แก้ schema ด้วยมือ

## Phase 5: Automated pre-deploy gate

เพิ่มคำสั่งหรือ CI check ขั้นต่ำให้รันทุกครั้งก่อน deploy:

```bash
# Web
cd apps/web
npm run lint
npm run test -- --run
npm run build

# API
cd ../api
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

- [x] เพิ่ม GitHub Actions workflow ที่ `/.github/workflows/ci.yml` พร้อมตรวจ `db:status` หลัง migration และรองรับ manual `workflow_dispatch`
- [ ] ยืนยัน workflow ผ่านบน GitHub จาก clean checkout
- [x] CI รัน migration, seed และ schema status ก่อน build/test; ไม่ผ่านแล้วหยุด workflow

## Definition of Done

Sprint นี้ถือว่าผ่านเมื่อ:

1. Web และ API build จาก clean checkout สำเร็จ
2. API มี health check ที่ตรวจ database ได้
3. ไม่มี default secret ใน production configuration
4. Environment variable names ในโค้ดและเอกสารตรงกัน
5. Staging database migrate และ seed ได้จากศูนย์
6. Automated pre-deploy checks ผ่าน
7. มีบันทึกผลตรวจสอบและ blocker ที่เหลืออยู่

## ลำดับการลงมือทำถัดไป

1. รัน API/Web smoke test บน staging domain
2. ยืนยัน GitHub Actions pre-deploy gate บน repository จริง
3. ตั้ง backup และทดสอบ restore บน Supabase
4. Deploy/ตรวจ staging บน Vercel + Render
5. ทำ Critical User Flow QA บน Public Beta และเก็บ feedback ผ่านช่องทางที่กำหนด

## Decision Log

บันทึกจากการทบทวนแผนร่วมกัน:

- [x] รัน Web lint/test/build และ API build/unit/e2e เพื่อสร้าง baseline ก่อนแก้ไข
- [x] Health check ตรวจทั้ง API process และ Database connection
- [x] Fail fast เฉพาะ Production เมื่อขาด `DATABASE_URL` หรือใช้ default secret
- [x] ยึดชื่อ environment variables ตามโค้ดปัจจุบัน แล้วแก้เอกสารให้ตรง
- [x] จำกัด CORS เฉพาะ Web domain ที่อนุญาต และใช้ Secure Cookie บน HTTPS
- [x] ใช้ Supabase PostgreSQL เป็น Staging Database
- [x] ใช้ Vercel สำหรับ Web และ Render สำหรับ API
- [x] เลือกแนวทางเปิด Automatic Backup และทดสอบ Restore อย่างน้อย 1 ครั้งก่อน Production
- [x] ใช้ GitHub Actions เป็น Pre-deploy Gate
- [x] ทดสอบ Critical User Flows ครบชุดบน Staging/Production
- [x] สถานะปัจจุบันเป็น Public Beta แล้ว ไม่ต้องมี Private Beta เพิ่ม
- [x] เพิ่มช่องทาง Report Bug/Feedback และเก็บ error log ฝั่งระบบ
- [x] ใช้ Sentry สำหรับ Error Monitoring ของ Web และ API
- [x] Redact PII และ Secret ก่อนส่งข้อมูลไป Error Monitoring
- [x] เก็บ Error Logs 30 วัน และลบอัตโนมัติ
- [x] อัปเดตเอกสารนี้ด้วย Decision Log และสถานะงาน

## Public Beta Release Policy

- การ deploy ถัดไปเป็น **incremental release** ไม่ใช่การเปิดตัวครั้งแรก
- ทุก release ต้องผ่าน pre-deploy gate และ Critical User Flow smoke test
- ปัญหาที่กระทบความถูกต้องของยอดเงิน ความปลอดภัย หรือการสูญหายของข้อมูลให้จัดเป็น P0 และหยุด release จนกว่าจะแก้เสร็จ
- Feedback จากผู้ใช้ให้จัดกลุ่มเป็น bug, usability และ feature request ก่อนนำไปจัดลำดับงานรอบถัดไป

## Verification Log

ผลตรวจสอบล่าสุดหลังลงมือทำ:

- Web: `npm run lint` ผ่านโดยไม่มี warning, `npm run test -- --run` ผ่าน `11 files / 69 tests`, `npx tsc --noEmit` ผ่าน และ `npm run build` ผ่านด้วย Webpack
- API: `npm run lint` ผ่าน, `npm run build` ผ่าน, `npm test -- --runInBand` ผ่าน `21 tests`, `npm run test:e2e -- --runInBand --detectOpenHandles` ผ่าน `10 tests` รอบล่าสุดกับ PostgreSQL local
- TypeScript: `npx tsc --noEmit` ผ่านทั้ง API และ Web; API production build ยัง emit จาก `src` เดิมผ่าน `tsconfig.build.json`
- Database: local `npm run db:migrate` ผ่านและไม่มี pending migration, `npm run db:status` รายงานว่า schema up to date; `npm run db:seed` สร้าง 20 categories รอบแรกและรอบซ้ำเป็น `Created: 0, Skipped: 20`
- Workflow: `.github/workflows/ci.yml` parse ผ่าน และตั้งค่า PostgreSQL service สำหรับ API migration/seed/status/e2e
- Workflow trigger: รองรับ branch `main`, `master` และ `developer` ซึ่งเป็น branch ที่กำลังทำงานอยู่
- Operations: เพิ่ม runbook backup/restore แล้ว แต่ยังไม่มีหลักฐานว่า Automatic Backup/Restore drill ผ่านบน provider จริง
- Production guard: start ด้วย development default secret ถูกปฏิเสธก่อนเปิด server
- Database guard: production start ด้วย `DATABASE_URL` ที่เชื่อมต่อไม่ได้ถูกหยุดก่อนเปิด server; build ที่ไม่มี `DATABASE_URL` ยังผ่านเพราะ migration config ไม่ถูกใช้ใน generate
- Production policy guard: production start ถูกปฏิเสธเมื่อ `COOKIE_SECURE` ไม่เป็น `true` หรือ `ALLOWED_ORIGINS` มี HTTP origin
- Cookie policy guard: production start ถูกปฏิเสธเมื่อ `COOKIE_SAME_SITE` ไม่ใช่ `lax`, `strict` หรือ `none`
- API lint ตรวจ test files ด้วย override เฉพาะ test และไม่ใช้ `--fix`; local gate ผ่านแล้ว รอยืนยันผลบน GitHub Actions จริง
- ยังไม่ถือว่า deploy staging/production เสร็จ จนกว่าจะตั้งค่า hosting, backup/restore และ smoke test บน domain จริง
