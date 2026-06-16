# API Specification

Version: 0.1

---

# Purpose

Define API contracts between Frontend and Backend.

This document focuses on:

- Endpoint naming
- Request format
- Response format
- Validation
- Error handling
- Authentication
- Versioning

---

# API Principles

- RESTful API
- JSON only
- UTF-8 encoding
- Stateless
- JWT Authentication
- HTTPS only

---

# Base URL

Development

```
http://localhost:3000/api/v1
```

Production

```
https://api.example.com/v1
```

---

# API Versioning

```
/api/v1
```

Future

```
/api/v2
```

---

# HTTP Methods

| Method | Usage          |
| ------ | -------------- |
| GET    | Read           |
| POST   | Create         |
| PATCH  | Partial Update |
| PUT    | Replace        |
| DELETE | Remove         |

---

# Authentication

Protected endpoints require

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Response Format

Every response follows the same structure.

Success

```json
{
  "success": true,
  "message": "Transaction created successfully.",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be greater than zero."
    }
  ]
}
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Resource Naming

Plural nouns only.

```
/users
/accounts
/categories
/transactions
/budgets
/goals
/tags
/profiles
```

---

# Endpoint Convention

List

GET /transactions

Get One

GET /transactions/:id

Create

POST /transactions

Update

PATCH /transactions/:id

Delete

DELETE /transactions/:id

---

# Pagination

Request

```
?page=1&limit=20
```

Response

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

# Sorting

```
?sort=date
?order=asc
```

---

# Filtering

```
?categoryId=
?accountId=
?type=
?from=
?to=
```

---

# Validation Rules

- Validate every request
- Reject unknown fields
- Never trust client input
- Return field-level validation errors

---

# Authentication Endpoints

POST /auth/register

POST /auth/login

POST /auth/refresh

POST /auth/logout

GET /auth/me

---

# User Endpoints

GET /profile

PATCH /profile

PATCH /profile/avatar

---

# Account Endpoints

GET /accounts

GET /accounts/:id

POST /accounts

PATCH /accounts/:id

DELETE /accounts/:id

---

# Category Endpoints

GET /categories

POST /categories

PATCH /categories/:id

DELETE /categories/:id

---

# Transaction Endpoints

GET /transactions

GET /transactions/:id

POST /transactions

PATCH /transactions/:id

DELETE /transactions/:id

---

# Budget Endpoints

GET /budgets

POST /budgets

PATCH /budgets/:id

DELETE /budgets/:id

---

# Goal Endpoints

GET /goals

POST /goals

PATCH /goals/:id

DELETE /goals/:id

---

# Tag Endpoints

GET /tags

POST /tags

PATCH /tags/:id

DELETE /tags/:id

---

# File Upload

Multipart Form Data

```
POST /uploads
```

Returns

```json
{
  "url": "https://..."
}
```

---

# Error Codes

AUTH_INVALID_TOKEN

AUTH_EXPIRED_TOKEN

RESOURCE_NOT_FOUND

VALIDATION_ERROR

PERMISSION_DENIED

CONFLICT_RESOURCE

UNKNOWN_ERROR

---

# Future APIs

- Reports
- Dashboard
- OCR Receipt
- AI Insights
- Shared Wallet
- Notifications
- Exchange Rate
