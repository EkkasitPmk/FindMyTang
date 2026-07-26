# แผนการปรับเปลี่ยนชื่อ WebApp เป็น "FindMyTang" (ฉบับขยายความสมบูรณ์ครอบคลุมทุกระบบ)

เอกสารนี้รวบรวมรายละเอียดและขั้นตอนการเปลี่ยนชื่อโปรเจกต์จาก **PocketNote** เป็น **FindMyTang** ครอบคลุมตั้งแต่ชื่อ Folder, Docker, GitHub, Codebase, Package และระบบอื่นๆ ทั้งหมด

---

## 🎯 สรุปรายการระบบและจุดที่ต้องปรับเปลี่ยนชื่อ (Complete Rebranding Checklist)

### 1. 📁 Folder & Directory Renaming (โครงสร้างโฟลเดอร์)

- **Root Directory:** เปลี่ยนชื่อโฟลเดอร์โปรเจกต์จาก `PocketNote` เป็น `FindMyTang` (หรือ `findmytang`)
- **ขั้นตอนการปรับเปลี่ยนใน Local & IDE:**
  - ปิด IDE (เช่น VS Code / Cursor / Windsurf / Antigravity)
  - เปลี่ยนชื่อโฟลเดอร์ในเครื่อง: `mv PocketNote FindMyTang`
  - เปิด Workspace ใหม่จากโฟลเดอร์ `FindMyTang`

### 2. 🐙 GitHub & Repository Settings

- **GitHub Repository Rename:**
  - ไปที่ GitHub Repo Settings -> Rename Repository เป็น `FindMyTang` (หรือ `findmytang`)
- **Git Remote Origin URL Update:**
  - คำสั่งอัปเดต remote URL บนเครื่อง local:
    `git remote set-url origin git@github.com:EkkasitPmk/FindMyTang.git` (หรือ `https://github.com/EkkasitPmk/FindMyTang.git`)
- **Documentation Files (ในโปรเจกต์):**
  - `README.md`: อัปเดตหัวข้อและรายละเอียดเป็น **FindMyTang**
  - `LICENSE`: อัปเดต `Copyright (c) 2026 EkkasitPmk (FindMyTang)`
  - `GEMINI.md` & `AGENTS.md`: อัปเดตชื่อโปรเจกต์อ้างอิงเป็น **FindMyTang**
  - `.github/copilot-instructions.md`: อัปเดตคำอธิบายอ้างอิง (ถ้ามี)

### 3. 🐳 Docker & Containerization (คอนเทนเนอร์และอิมเมจ)

- **Container Names & Service Names (`docker-compose.yml` / Deployment):**
  - Web Service: `findmytang-web`
  - API Service: `findmytang-api`
  - Database Service: `findmytang-db` / `findmytang-postgres`
- **Docker Image Tags:**
  - `findmytang-web:latest`
  - `findmytang-api:latest`
- **Network & Volume Names:**
  - Network: `findmytang-network`
  - Volume: `findmytang-postgres-data`

### 4. 📦 Package & Workspace Configurations

- **Root `package.json`:**
  - `"name": "findmytang-monorepo"`
- **Frontend `apps/web/package.json`:**
  - `"name": "@findmytang/web"` (หรือ `"findmytang"`)
- **Backend `apps/api/package.json`:**
  - `"name": "@findmytang/api"` (หรือ `"findmytang-backend"`)

### 5. 🔍 SonarQube & Code Quality Tools

- **`sonar-project.properties`:**
  - `sonar.projectKey=findmytang`
  - `sonar.projectName=FindMyTang`

### 6. 🌐 Frontend (apps/web)

- **App Title & Metadata (`apps/web/src/app/layout.tsx`):**
  - Title: `FindMyTang - Smart Personal Asset Tracker & Command Center`
- **UI Components:**
  - `apps/web/src/features/nav/components/DesktopSidebar.tsx`: Brand Name `FindMyTang`
  - `apps/web/src/features/nav/components/MobileDrawer.tsx`: Brand Name `FindMyTang`
  - `apps/web/src/features/auth/login/components/LoginForm.tsx`: Logo Title `FindMyTang`
- **Translations & Export Settings (`apps/web/src/shared/lib/configs/translations.config.ts`):**
  - `exportAlert`: `findmytang_backup.json`
- **Guest Local Storage (`apps/web/src/shared/lib/storages/guest.storage.ts`):**
  - LocalStorage Key: `findmytang-guest-storage`

### 7. ⚙️ Backend & API (apps/api)

- **Swagger Open API (`apps/api/src/main.ts`):**
  - Title: `FindMyTang API`
  - Description: `FindMyTang Backend API`
- **Prisma Seed (`apps/api/prisma/seed.ts`):**
  - System email default: `system@findmytang.io`

---

## 📌 ขั้นตอนการดำเนินการตามลำดับ (Execution Steps)

1. **Git Branching:**
   - รันคำสั่งสร้าง branch ใหม่: `git checkout -b feature/rebrand-findmytang`
2. **อัปเดตไฟล์ใน Codebase:**
   - ปรับแก้ไข Package names, Configs, UI, Swagger, Seed และ Storage keys ตามรายการข้างต้น
3. **ปรับแต่ง GitHub Repository:**
   - Rename repo บน GitHub และรัน `git remote set-url origin git@github.com:EkkasitPmk/FindMyTang.git`
4. **ปรับชื่อ Folder ใน Local (Optional):**
   - เปลี่ยนชื่อโฟลเดอร์ Root เป็น `FindMyTang`
5. **Verification & Testing:**
   - รัน `npm run build` ตรวจสอบความถูกต้องของการ Build ทั้งหมด
