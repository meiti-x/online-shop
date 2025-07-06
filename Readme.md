# 🛒 Online Shop

This is a **case study project** designed to experiment with and apply key software engineering concepts.  
All features and architecture decisions are made with **learning and clean code practices** in mind.

> ⚠️ This project is not intended for production use.

I’ve added **important comments and TODOs** throughout the code so you can easily explore and extend individual parts.

---

## 🛠️ Technologies & Concepts Covered

### 🧱 Architecture

Repository Pattern  
Service Layer  
Shared Utilities (e.g. hashing, ID generation)

### 📦 ORM & Database

PostgreSQL  
Prisma ORM  
Snowflake ID – sortable, unique 64-bit public IDs  
Custom Migration Flow – optional → backfill → required  
Connection Pooling  
Decoupled DB access for future swapping

### 📘 DTOs & Validation

Zod  
Centralized Schemas  
Type-safe params/body/query parsing

### 📚 Logging

ILogger abstraction  
Winston  
Daily rotate log files  
JSON logs  
Console output in dev  
AsyncLocalStorage (for userId/requestId)  
Response time tracking  
Full error stack traces

### 🔐 Authentication & Security

JWT  
Auth middleware  
Request ID (`x-request-id`)  
Rate Limiting – token-based, backed by Redis  
Redis – persistent shared store for rate limiter  
Bloom Filter (for brute-force email check)  
No internal IDs exposed to client

### 🔄 API Design

RESTful versioned endpoints  
Modular route registration  
CustomError abstraction  
Consistent HTTP status codes
Prisma ERD Generator
Swagger with use zod scehma for api input(write a script to convert zod to open api)

### 🐳 Docker & DevOps & DX

Multi-stage Dockerfile  
Non-root container  
Docker Compose  
.env support  
Husky hooks  
ESLint + Prettier  
Git pre-commit enforcement  
Prisma CLI + ts-node scripting

---

## 🚀 Getting Started

```bash
pnpm i
cp .env.example .env
pnpm dev
```
