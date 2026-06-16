# Architecture Decisions

## 2026-06

### Product Type

Decision

Personal Finance Dashboard

Reason

Primary purpose is financial tracking and analysis.

---

### UX Direction

Decision

Mobile First

Desktop Optimized

Reason

Most transaction entry occurs on mobile devices, but analytics benefits from larger screens.

---

### User Onboarding

Decision

Guest First

Reason

Reduce friction and encourage immediate usage.

---

### Synchronization

Decision

Sync Later

Reason

Account creation should not block usage.

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

Optimized experience across device sizes.

---

### Financial Model

Decision

Everything is a Transaction

Reason

Provides consistent accounting logic and enables future analytics.

---

### Frontend Stack

Decision

Next.js
Tailwind
shadcn/ui
Zustand
Dexie
TanStack Query

Reason

Modern full-stack TypeScript ecosystem.

---

### Backend Stack

Decision

NestJS
Prisma
PostgreSQL

Reason

Scalable architecture with strong TypeScript support.
