# Domain Model

Version: 0.1

---

# Purpose

Describe business entities and relationships.

This file is independent from database implementation.

Database tables (Prisma) will be generated from this model later.

---

# Ubiquitous Language

| Term                  | Meaning                                 |
| --------------------- | --------------------------------------- |
| User                  | Person who owns accounts and records    |
| Profile               | Optional personal information of a user |
| Account               | Money container                         |
| Category              | Income / Expense classification         |
| Transaction           | Income / Expense record                 |
| Budget                | Spending limit                          |
| Goal                  | Saving target                           |
| Recurring Transaction | Auto-created transaction                |
| Attachment            | Receipt / Image                         |
| Tag                   | Flexible labels                         |
| Currency              | Money unit                              |

---

# Aggregate

User
└── Profile (optional)

User
├── Accounts
├── Categories
├── Transactions
├── Budgets
├── Goals
└── Tags

Account
└── Transactions

Category
└── Transactions

Transaction
└── Attachments

Goal
└── Contributions (future)

## User

Represents authentication identity.

Fields

- id
- email
- passwordHash
- createdAt
- updatedAt

Rules

- Email must be unique.
- Password is hashed.
- User owns every resource.

## Profile

Optional profile information.

Relationship

User (1) ---- (0..1) Profile

Fields

- id
- userId
- displayName
- avatarUrl (optional)
- timezone
- locale
- currency

Rules

- User may not have a profile.
- One user has only one profile.
- Avatar is optional.
- Default values are generated during onboarding.

## Account

Represents a wallet or bank account.

Fields

- id
- userId
- name
- type
- balance
- currency
- color
- icon
- isArchived

Relationship

User (1) ---- (N) Accounts

Rules

- Name cannot be empty.
- Balance may be negative.
- Archived accounts cannot receive new transactions.

## Category

Represents transaction classification.

Fields

- id
- userId
- name
- type (Income / Expense)
- color
- icon
- isDefault

Relationship

User (1) ---- (N) Categories

Rules

- Category type never changes.
- Default categories cannot be deleted.

## Transaction

Represents income or expense.

Fields

- id
- userId
- accountId
- categoryId
- amount
- type
- note
- date
- status

Relationship

User
└── Transactions

Account
└── Transactions

Category
└── Transactions

Rules

- Amount > 0
- One transaction belongs to one account.
- One transaction belongs to one category.

## Attachment

Receipt or image attached to transaction.

Fields

- id
- transactionId
- url
- mimeType

Relationship

Transaction (1)
|
+---- (N) Attachments

## Budget

Monthly spending limit.

Fields

- id
- userId
- categoryId
- amount
- month
- year

Rules

- One category can have one budget per month.

## Goal

Saving target.

Fields

- id
- userId
- name
- targetAmount
- currentAmount
- deadline
- status

Rules

- currentAmount <= targetAmount

## Tag

Flexible labels.

Fields

- id
- userId
- name
- color

Relationship

Transaction (N)
|
Tag (N)

## Currency

Supported currencies.

Examples

- THB
- USD
- EUR

Rules

- ISO-4217

## Relationships

User
│
├── Profile (0..1)
│
├── Account (1..N)
│ │
│ └── Transaction (1..N)
│
├── Category (1..N)
│ │
│ └── Transaction
│
├── Budget (1..N)
│
├── Goal (1..N)
│
└── Tag (1..N)

Transaction
│
├── Attachment (0..N)
│
└── Tag (0..N)

## Future Features

Planned Domain

- Shared Wallet
- Family Account
- Multiple Currency
- Investment Portfolio
- Debt Tracking
- Loan
- Subscription
- Recurring Payment
- OCR Receipt
- AI Spending Analysis

## Domain Constraints

- Every resource belongs to exactly one User.
- No cross-user access.
- Transaction amount is always positive.
- Expense / Income determined by Transaction.type.
- Category.type must match Transaction.type.
- Archived Account cannot accept new Transactions.
- Budget is unique per Category per Month.

## Naming Convention

Entity

Singular

User
Transaction
Account

Repository

UserRepository
TransactionRepository

Service

BudgetService

GoalService

DTO

CreateTransactionDto

UpdateProfileDto
