# SECURITY.md

Version: 1.0

---

# Purpose

This document defines the security architecture and best practices for the MoneyNote Clone project.

It covers:

- Authentication
- Authorization
- Password Security
- JWT
- Refresh Token
- File Upload Security
- Environment Variables
- Database Security
- API Security
- Frontend Security

---

# Security Principles

The project follows these principles:

- Zero Trust
- Least Privilege
- Defense in Depth
- Secure by Default
- Never Trust Client Input

---

# Authentication

Authentication uses JWT.

Flow

```text
Register
    ↓
Hash Password
    ↓
Save User
    ↓
Login
    ↓
Verify Password
    ↓
Generate Access Token
    ↓
Generate Refresh Token
```

---

# Password Policy

Minimum Requirements

- Minimum 8 characters
- Maximum 128 characters
- Passwords are never stored in plain text

Hash Algorithm

```text
Argon2id
```

Rules

- Never log passwords
- Never return passwords
- Never expose password hash

---

# JWT

Two tokens are used.

## Access Token

Purpose

Authentication

Expiration

```text
15 minutes
```

Contains

```json
{
  "sub": "userId",
  "email": "user@example.com"
}
```

---

## Refresh Token

Purpose

Generate new access token

Expiration

```text
30 days
```

Rules

- Stored as hashed value in database
- Rotated after refresh
- Revoked on logout

---

# Authorization

Model

```text
Resource Ownership
```

Every resource belongs to one user.

Example

```text
Transaction.userId

==

CurrentUser.id
```

Otherwise

```text
403 Forbidden
```

---

# Route Protection

Public

```text
POST /auth/register

POST /auth/login

POST /auth/refresh
```

Protected

```text
Everything else
```

---

# Validation

Every request is validated.

NestJS ValidationPipe

```text
transform

whitelist

forbidNonWhitelisted
```

Rules

- Reject unknown fields
- Reject invalid types
- Reject missing required values

---

# Input Sanitization

All user input is sanitized.

Examples

- Trim whitespace
- Validate email
- Validate URL
- Validate UUID/CUID
- Reject invalid enum values

---

# SQL Injection

Prevented by

- Prisma ORM
- Parameterized queries

Rules

- Never concatenate SQL
- Avoid raw SQL unless necessary

---

# XSS Protection

Frontend

- Escape user-generated content
- Never use dangerouslySetInnerHTML unless absolutely required

Backend

- Validate all string inputs
- Sanitize HTML if HTML input is ever supported

---

# CSRF

Authentication uses JWT.

If Refresh Token is stored in cookies:

- HttpOnly
- Secure
- SameSite=Strict

---

# CORS

Development

```text
localhost only
```

Production

Allow only trusted frontend domains.

Never use

```text
*
```

---

# Rate Limiting

Protect authentication endpoints.

Example

```text
Login

5 requests

per minute

per IP
```

---

# File Upload Security

Allowed

- jpg
- jpeg
- png
- webp
- pdf

Maximum Size

```text
5 MB
```

Rules

- Validate MIME type
- Validate extension
- Generate random filename
- Store outside public root if possible

---

# Environment Variables

Never commit

```text
.env
```

Example

```text
DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

SMTP_URL

S3_ACCESS_KEY

S3_SECRET_KEY
```

---

# Secrets

Rules

- Minimum 32 random characters
- Different secrets for Access Token and Refresh Token
- Rotate secrets if compromised

---

# Database Security

Rules

- Least privilege database user
- SSL enabled in production
- Backup regularly
- No direct internet exposure

---

# Logging

Never log

- Password
- JWT
- Refresh Token
- API Keys
- Secrets

Allowed

- Request ID
- User ID
- Endpoint
- Status Code
- Execution Time

---

# Error Handling

Never expose

- Stack trace
- SQL errors
- Prisma errors
- Internal implementation

Return generic messages.

Example

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

# HTTPS

Production

HTTPS Required

HTTP → Redirect to HTTPS

---

# Security Headers

Recommended

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- X-Frame-Options
- Permissions-Policy

---

# Dependency Security

Run regularly

```text
npm audit

pnpm audit
```

Update dependencies frequently.

---

# Authentication Flow

```text
Register
    ↓
Hash Password
    ↓
Create User
    ↓
Login
    ↓
Access Token
    ↓
Protected API
    ↓
Access Expired
    ↓
Refresh Token
    ↓
New Access Token
```

---

# Security Checklist

Before Release

- Password hashing enabled
- JWT secrets configured
- HTTPS enabled
- CORS configured
- Validation enabled
- Rate limiting enabled
- File upload validation enabled
- Environment variables secured
- Logging sanitized
- Database backup configured

---

# Future Enhancements

- Two-Factor Authentication (2FA)
- Email Verification
- Password Reset via Email
- Device Management
- Login History
- Session Management
- Security Audit Log
- IP Whitelist
- OAuth (Google / GitHub)
- WebAuthn / Passkeys
