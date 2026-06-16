# Coding Standard

Version: 0.1

---

# Goal

Maintain a consistent, readable, and scalable codebase.

---

# General Principles

- Readability over cleverness.
- Keep functions small.
- Single Responsibility Principle.
- Prefer composition over inheritance.
- Avoid premature optimization.

---

# Naming Convention

## Variables

camelCase

```
totalAmount
createdAt
```

---

## Functions

camelCase

```
createTransaction()

calculateBalance()
```

---

## Components

PascalCase

```
TransactionCard.tsx

AccountForm.tsx
```

---

## Types

PascalCase

```
TransactionDto

UserProfile
```

---

## Constants

UPPER_SNAKE_CASE

```
MAX_FILE_SIZE

DEFAULT_PAGE_SIZE
```

---

## Files

React

```
transaction-card.tsx

account-form.tsx
```

NestJS

```
transaction.service.ts

transaction.controller.ts
```

---

# Folder Structure

Frontend

```
src/

app/

components/

features/

hooks/

lib/

services/

types/

utils/
```

Backend

```
src/

modules/

common/

config/

database/
```

---

# TypeScript Rules

- Strict mode enabled
- Avoid `any`
- Prefer `unknown`
- Prefer interfaces for object contracts
- Prefer enums only when necessary
- Explicit return types for public functions

---

# React Rules

- Functional Components only
- Server Components by default
- Client Components only when required
- Hooks start with `use`
- Avoid prop drilling
- Prefer composition
- Memoize only when necessary

---

# Next.js Rules

- App Router
- Feature-based architecture
- Route Groups for pages
- Server Actions only when appropriate
- Keep page.tsx minimal

---

# NestJS Rules

- Modular architecture
- One controller per module
- Business logic in services
- Controllers should stay thin
- DTO validation required
- Dependency Injection everywhere

---

# Prisma Rules

- UUID/CUID primary keys
- Never expose Prisma directly to frontend
- Use transactions when multiple writes occur
- Avoid raw SQL unless necessary

---

# API Rules

- RESTful endpoints
- Consistent response format
- Proper status codes
- Validate every request
- JWT authentication

---

# Error Handling

- Throw domain-specific exceptions
- Never expose stack traces
- Log unexpected errors
- Return user-friendly messages

---

# Logging

- Structured logging
- Log errors with context
- Avoid logging sensitive information

---

# Testing

- Unit tests for business logic
- Integration tests for API
- E2E tests for critical user flows

---

# Git Convention

Branch

```
feature/account

feature/auth

fix/login

refactor/database

docs/domain-model
```

Commit (Conventional Commits)

```
feat:

fix:

refactor:

docs:

style:

test:

chore:

ci:
```

---

# Import Order

1. Node modules
2. Internal aliases
3. Relative imports
4. Styles

---

# Code Formatting

- ESLint
- Prettier
- Husky
- lint-staged

Every commit must pass:

- lint
- type-check
- tests

---

# Security

- Never trust client input
- Escape user-generated content
- Store passwords using Argon2
- JWT secrets via environment variables
- Never commit secrets

---

# Performance

- Lazy load when possible
- Optimize images
- Minimize unnecessary renders
- Paginate large datasets
- Cache expensive queries

---

# Documentation

Every public service should include:

- Purpose
- Parameters
- Return value
- Possible exceptions

Complex business logic should include explanatory comments.

---

# Definition of Done

A feature is complete only if:

- Requirements implemented
- Type-safe
- Tested
- Linted
- Formatted
- Documented
- Reviewed
- No TypeScript errors
- No ESLint warnings
