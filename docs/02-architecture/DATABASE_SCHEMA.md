# DATABASE_SCHEMA.md

Version: 0.1

---

# Purpose

This document defines the logical database schema for the MoneyNote Clone project.

It serves as the source of truth before implementing the Prisma schema and database migrations.

This document is database-agnostic. The physical implementation (PostgreSQL + Prisma) will follow this specification.

---

# Database Engine

| Item        | Value          |
| ----------- | -------------- |
| Database    | PostgreSQL     |
| ORM         | Prisma         |
| Charset     | UTF-8          |
| Timezone    | UTC            |
| ID Strategy | CUID           |
| Soft Delete | No (v1)        |
| Migration   | Prisma Migrate |

---

# Naming Convention

## Tables

Plural

```text
users
profiles
accounts
categories
transactions
attachments
budgets
goals
tags
transaction_tags
```

---

## Columns

snake_case

```text
created_at
updated_at
user_id
avatar_url
```

---

## Primary Keys

Every table

```text
id String @id @default(cuid())
```

---

## Foreign Keys

```text
user_id

account_id

category_id
```

---

## Timestamps

Every table contains

```text
created_at

updated_at
```

---

# Common Rules

Every entity

- Has primary key
- Has created_at
- Has updated_at

Every business resource belongs to exactly one User.

Cross-user access is forbidden.

---

# users

Purpose

Authentication identity.

| Field         | Type      | Nullable | Notes  |
| ------------- | --------- | -------- | ------ |
| id            | CUID      | No       | PK     |
| email         | String    | No       | Unique |
| password_hash | String    | No       | Argon2 |
| created_at    | Timestamp | No       |        |
| updated_at    | Timestamp | No       |        |

Indexes

- email UNIQUE

Relationships

```text
User

1 -> 1 Profile

1 -> N Accounts

1 -> N Categories

1 -> N Transactions

1 -> N Budgets

1 -> N Goals

1 -> N Tags
```

---

# profiles

Optional user profile.

| Field        | Type      |
| ------------ | --------- |
| id           | CUID      |
| user_id      | FK        |
| display_name | String    |
| avatar_url   | String?   |
| timezone     | String    |
| locale       | String    |
| currency     | String    |
| created_at   | Timestamp |
| updated_at   | Timestamp |

Indexes

- user_id UNIQUE

Relationship

```text
User

1 ---- 0..1 Profile
```

---

# accounts

Represents wallets and bank accounts.

| Field       | Type      |
| ----------- | --------- |
| id          | CUID      |
| user_id     | FK        |
| name        | String    |
| type        | Enum      |
| balance     | Decimal   |
| currency    | String    |
| color       | String    |
| icon        | String    |
| is_archived | Boolean   |
| created_at  | Timestamp |
| updated_at  | Timestamp |

Indexes

```text
user_id

user_id + name
```

---

# categories

Income / Expense classification.

| Field      | Type      |
| ---------- | --------- |
| id         | CUID      |
| user_id    | FK        |
| name       | String    |
| type       | Enum      |
| color      | String    |
| icon       | String    |
| is_default | Boolean   |
| created_at | Timestamp |
| updated_at | Timestamp |

Unique

```text
user_id

name

type
```

Meaning

A user cannot create duplicate category names of the same type.

---

# transactions

Core financial record.

| Field            | Type          |
| ---------------- | ------------- |
| id               | CUID          |
| user_id          | FK            |
| account_id       | FK            |
| category_id      | FK            |
| amount           | Decimal(18,2) |
| type             | Enum          |
| note             | Text          |
| transaction_date | Timestamp     |
| status           | Enum          |
| created_at       | Timestamp     |
| updated_at       | Timestamp     |

Indexes

```text
user_id

account_id

category_id

transaction_date
```

Rules

- amount > 0
- account must belong to same user
- category must belong to same user

---

# attachments

Receipt images.

| Field          | Type      |
| -------------- | --------- |
| id             | CUID      |
| transaction_id | FK        |
| url            | String    |
| mime_type      | String    |
| created_at     | Timestamp |
| updated_at     | Timestamp |

Relationship

```text
Transaction

1

↓

N Attachment
```

---

# budgets

Monthly budget.

| Field       | Type      |
| ----------- | --------- |
| id          | CUID      |
| user_id     | FK        |
| category_id | FK        |
| amount      | Decimal   |
| month       | Integer   |
| year        | Integer   |
| created_at  | Timestamp |
| updated_at  | Timestamp |

Unique

```text
user_id

category_id

month

year
```

---

# goals

Saving goals.

| Field          | Type      |
| -------------- | --------- |
| id             | CUID      |
| user_id        | FK        |
| name           | String    |
| target_amount  | Decimal   |
| current_amount | Decimal   |
| deadline       | Date      |
| status         | Enum      |
| created_at     | Timestamp |
| updated_at     | Timestamp |

Rules

```text
current_amount <= target_amount
```

---

# tags

Transaction labels.

| Field      | Type      |
| ---------- | --------- |
| id         | CUID      |
| user_id    | FK        |
| name       | String    |
| color      | String    |
| created_at | Timestamp |
| updated_at | Timestamp |

---

# transaction_tags

Many-to-many bridge.

| Field          | Type |
| -------------- | ---- |
| transaction_id | FK   |
| tag_id         | FK   |

Composite Primary Key

```text
transaction_id

tag_id
```

---

# Enums

## AccountType

```text
CASH

BANK

CREDIT_CARD

E_WALLET

SAVINGS
```

---

## TransactionType

```text
INCOME

EXPENSE
```

---

## TransactionStatus

```text
PENDING

COMPLETED

CANCELLED
```

---

## GoalStatus

```text
ACTIVE

COMPLETED

CANCELLED
```

---

# Constraints

- Email must be unique.
- One profile per user.
- Transaction amount must be positive.
- Category type must match transaction type.
- Archived account cannot receive transactions.
- Budget is unique per month.
- Goal current_amount cannot exceed target_amount.
- Tags are unique per user.

---

# Cascade Rules

| Parent      | Child            | Action          |
| ----------- | ---------------- | --------------- |
| User        | Profile          | Cascade Delete  |
| User        | Accounts         | Cascade Delete  |
| User        | Categories       | Restrict Delete |
| User        | Transactions     | Cascade Delete  |
| Transaction | Attachments      | Cascade Delete  |
| Transaction | Transaction Tags | Cascade Delete  |
| Tag         | Transaction Tags | Cascade Delete  |

---

# Index Strategy

Indexes

```text
users.email

transactions.transaction_date

transactions.account_id

transactions.category_id

transactions.user_id

accounts.user_id

categories.user_id

budgets.user_id

goals.user_id
```

Future

```text
Full Text Search

GIN Index

Partial Index

Composite Index
```

---

# Seed Data

Default Categories

Expense

- Food
- Transport
- Shopping
- Bills
- Entertainment

Income

- Salary
- Bonus
- Investment

Default Currency

```text
THB
```

Default Timezone

```text
Asia/Bangkok
```

---

# Future Database Changes

- Soft Delete
- Audit Logs
- Multi Currency
- Shared Wallet
- Family Members
- Exchange Rate
- Notifications
- Recurring Transactions
- Investment Portfolio
- AI Spending Analysis
