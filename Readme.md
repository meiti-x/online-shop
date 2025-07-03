# 🛒 Online Shop

This is a **case study project** designed to experiment with and apply key software engineering concepts.  
All features and architecture decisions are made with **learning and clean code practices** in mind.

> ⚠️ This project is not intended for production use.

I’ve added **important comments and TODOs** throughout the code so you can easily explore and extend individual parts.

---

## 🛠️ Technologies & Concepts Covered

### 🧱 Architecture

- Repository Pattern (decoupling DB access)

### 📦 ORM & Database

- PostgreSQL
- Prisma ORM
  - Abstraction Interface over Prisma
  - Connection Pooling
  - Soft decoupling for future DB swap (e.g., MongoDB)

### 📘 DTOs & Validation

- Zod-based DTO validations
  - Create/Update schema separation
  - Centralized schema handling
- Type-safe request parsing for `params`, `body`, and `query`

### 📚 Logging

- Custom Logger Abstraction (`ILogger`)
- Winston integration
  - Daily File Rotation (`winston-daily-rotate-file`)
  - JSON structured logging
  - Console logging for development
  - Context-based logging (userId, requestId, etc.)
  - Request-scoped metadata injection via `AsyncLocalStorage`
  - Error tracing with full stack info
  - Response time logging per route

### 🔐 Authentication & Security

- JWT-based authentication
- Middleware for user extraction
- Request ID generation (`uuid` / `x-request-id`)
- Brute-force protection with Bloom Filter (email pre-check)
- Basic rate limiting (optional)

### 🔄 API Design

- RESTful routes
- Modular route registration per domain (e.g., `/v1/auth`)
- Versioning support

### 🐳 Docker & DevOps & DX

- Multi-stage Docker build (dev & prod)
- Non-root user for production container
- Docker Compose setup with PostgreSQL service
- `.env` configuration support
- Prettier + ESLint config with Husky hooks
  - Git pre-commit validation
  - Auto-format and lint staged files

## 🚀 Getting Started

```bash
pnpm i
cp .env.example .env
pnpm dev
```
