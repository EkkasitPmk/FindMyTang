# PocketNote Architecture

## Architecture Style

Offline First Web Application

---

## Frontend Stack

Framework

- Next.js
- TypeScript

UI

- Tailwind CSS
- shadcn/ui

State Management

- Zustand

Data Fetching

- TanStack Query

Local Storage

- Dexie
- IndexedDB

Validation

- React Hook Form
- Zod

---

## Backend Stack

Framework

- NestJS

Database

- PostgreSQL

ORM

- Prisma

Authentication

- JWT

Password Hashing

- bcrypt

---

## High Level Flow

User

↓

Next.js Application

↓

IndexedDB (Primary Local Storage)

↓

Sync Layer

↓

NestJS API

↓

PostgreSQL

---

## Core Principles

### Local First

User actions should be saved locally before cloud synchronization.

### Fast UI

The user interface should not wait for API responses.

### Sync Later

Cloud synchronization is secondary to local persistence.

### Transaction Driven

Financial data should be derived from transactions.

Asset balances should be calculated from transaction history whenever possible.

---

## Initial Backend Modules

- auth
- users
- assets
- categories
- transactions
- analytics
- sync

---

## Future Expansion

- PWA Support
- Push Notifications
- Multi Device Sync
- Data Export
- AI Insights
