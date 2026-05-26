<div align="center">

<br/>

# `newsglance-api`

**Production-grade REST API powering an AI-driven news platform**

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js_20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)](https://aws.amazon.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)

<br/>

|                         | Link                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------- |
| 📦 **API Repository**   | [github.com/joydeep-git/newsglance-api](https://github.com/joydeep-git/newsglance-api) |
| 📖 **API Docs**         | [newsglance.apidog.io](https://newsglance.apidog.io)                                   |
| 🌐 **Live App**         | [newsglance.vercel.app](https://newsglance.vercel.app)                                 |
| 🖥️ **Web Repository**   | [github.com/joydeep-git/newsglance-web](https://github.com/joydeep-git/newsglance-web) |
| ☁️ **EC2 + CloudFront** | [d3g4hp7x5o3v7g.cloudfront.net](https://d3g4hp7x5o3v7g.cloudfront.net)                 |
| ☁️ **YouTube Video** | [d3g4hp7x5o3v7g.cloudfront.net](https://d3g4hp7x5o3v7g.cloudfront.net)                    |

<br/>

</div>

---

## Overview

`newsglance-api` is the backend service for the NewsGlance platform. It handles authentication, article delivery with Redis caching, AI-powered summarization, AWS Polly text-to-speech, bookmark management, and payment processing — all wrapped in a clean, typed Express architecture.

**Key characteristics:**

- Full **OTP-gated authentication** (credential + Google OAuth2)
- **Redis-first** news caching strategy — Guardian API only called on cache miss
- AI summarization via **Google Gemini** and audio via **AWS Polly**
- **JWT blacklisting** on logout (Redis-backed)
- **Rate-limited** at the route group level — stricter on auth routes
- **AWS CloudFront** as HTTPS reverse proxy in front of EC2
- One-command Docker setup for both dev and production

---

## Platform Architecture

```
┌────────────────────────────────────────┐
│           newsglance-web               │
│    Next.js 15 · React 19 · Vercel     │
└─────────────────┬──────────────────────┘
                  │  HTTPS · httpOnly Cookie
                  ▼
┌────────────────────────────────────────┐
│        AWS CloudFront (HTTPS)          │
│   d3g4hp7x5o3v7g.cloudfront.net       │
└─────────────────┬──────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────┐
│           newsglance-api               │
│    Express · TypeScript · AWS EC2     │
│                                        │
│   Auth · News · User · Payment        │
│   Rate Limiting · CORS · Helmet       │
└──────┬──────────┬──────────┬───────────┘
       │          │          │
       ▼          ▼          ▼
  PostgreSQL    Redis      AWS Cloud
  (Prisma)     Cache     S3 · Polly · Gemini
```

---

## Feature Overview

| Feature                   | Detail                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| 📰 **Real-time News**     | Live feeds from The Guardian — homepage, category, country, full-text search                        |
| 🤖 **AI Summaries**       | One-click article summaries powered by Google Gemini                                                |
| 🎧 **Audio Articles**     | Listen to any article as MP3 — generated by AWS Polly, hosted on S3                                 |
| 🔖 **Bookmarks**          | Save and manage a personal reading list                                                             |
| 🔐 **Secure Auth**        | OTP-gated email/password login + Google OAuth2 · JWT cookies with Redis blacklisting on logout      |
| ⚡ **Redis Caching**      | Homepage, category, country, and single article responses cached — Guardian API called only on miss |
| 💎 **Premium Membership** | Unlimited AI features via Cashfree payment gateway                                                  |
| 🌍 **Country Feeds**      | Localised news by country code                                                                      |
| 🛡️ **Rate Limiting**      | 300 req/15min global · 30 req/15min on auth routes                                                  |
| 🐳 **Docker Ready**       | One-command dev and production deployment                                                           |
| ☁️ **CloudFront HTTPS**   | EC2 API served securely via AWS CloudFront distribution                                             |

---

## Tech Stack

| Concern          | Technology                                                            |
| ---------------- | --------------------------------------------------------------------- |
| Language         | TypeScript 5                                                          |
| Runtime          | Node.js 20+                                                           |
| Framework        | Express.js 4                                                          |
| Database         | PostgreSQL via **Prisma ORM**                                         |
| Cache            | Redis (ioredis)                                                       |
| Authentication   | JWT · Google OAuth2 (`google-auth-library`) · Argon2 password hashing |
| AI Summarization | Google Gemini (`@google/genai`)                                       |
| Text-to-Speech   | AWS Polly                                                             |
| File Storage     | AWS S3                                                                |
| Email            | Nodemailer + Brevo SMTP                                               |
| Payments         | Cashfree PG SDK                                                       |
| News Source      | The Guardian Open Platform API                                        |
| Security         | Helmet · express-rate-limit                                           |
| CDN / HTTPS      | AWS CloudFront                                                        |
| Containerization | Docker + Docker Compose                                               |
| Deploy           | AWS EC2                                                               |

---

## Project Structure

```
src/
├── server.ts                        # Bootstrap: Express, middleware, routes, CORS
│
├── routers/
│   ├── auth-routers.ts              # /api/auth/*
│   ├── user-routers.ts              # /api/user/*
│   ├── news-routers.ts              # /api/news/*
│   ├── payment-routers.ts           # /api/payment/*
│   └── utility-routers.ts           # /api/test, /api/health, /api/generate-otp
│
├── controllers/
│   ├── auth-controllers/
│   │   ├── auth-credential.ts       # Register, login, forgot-password flows
│   │   ├── auth-general.ts          # Logout, delete account, verify-token
│   │   └── auth-google.ts           # Google OAuth2 sign-in / sign-up
│   ├── news-controllers.ts          # Homepage, category, country, search, bookmark, AI
│   ├── user-controllers.ts          # Profile update, avatar upload/delete
│   ├── payment-controllers.ts       # Cashfree order creation, verification, history
│   └── utility-controllers.ts       # OTP generation, health check, limit reset
│
├── middleware/
│   ├── auth-token.ts                # JWT validator — checks cookie or Authorization header
│   ├── multer-config.ts             # Multipart file upload config
│   ├── response-wrapper.ts          # Injects success/error flags into all responses
│   └── route-error-handler.ts       # 404 handler for unregistered routes
│
├── services/
│   ├── news/
│   │   ├── guardian.ts              # Guardian API client (homepage, category, search, etc.)
│   │   └── news-db.ts               # Bookmark and NewsData DB operations
│   ├── redis/
│   │   ├── auth-redis.ts            # OTP, user cache, JWT blacklist, default avatar
│   │   └── news-redis.ts            # Homepage, category, country, single article cache
│   ├── aws/
│   │   ├── s3.ts                    # File upload / delete
│   │   └── polly.ts                 # TTS audio generation + S3 upload
│   ├── AI/
│   │   └── summarization.ts         # Gemini prompt — summary + audio script modes
│   ├── email/
│   │   └── brevo.ts                 # Welcome email, OTP email, contact form
│   └── payment/
│       └── cashfree.ts              # Order creation + payment verification
│
├── prisma-utils/                    # Typed DB query helpers (auth, user, news, files, payment)
├── types/                           # Shared TypeScript interfaces and enums
├── errors/                          # Error factory + global error middleware
└── utils/                           # OTP generator, email validator, helpers
```

---

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- Docker & Docker Compose (recommended)
- A PostgreSQL database (local or managed — e.g., AWS RDS, Aiven)
- A Redis instance (bundled in Docker Compose)

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/newsglance

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET_KEY=your_jwt_secret

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id

# The Guardian API
GUARDIAN_API_KEY=your_guardian_api_key
GUARDIAN_API_URL=https://content.guardianapis.com

# AWS
AWS_REGION=ap-south-1
AWS_POLLY_REGION=us-east-1
S3_BUCKET_NAME=your-bucket
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key
POLLY_ACCESS_KEY=your_polly_access_key
POLLY_SECRET_KEY=your_polly_secret_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email (Brevo SMTP)
BREVO_USER=your_brevo_smtp_login
BREVO_PASS=your_brevo_smtp_password
BREVO_FROM=noreply@newsglance.com

# Payments (Cashfree)
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

---

### Docker (Recommended)

```bash
# Development — hot reload, Redis bundled
pnpm docker:dev

# Production
pnpm docker:up

# Stop and remove volumes
pnpm docker:down

# Tail logs
pnpm docker:logs
```

API available at **`http://localhost:5000`**

---

### Local Development

```bash
pnpm install

# Generate Prisma client
pnpm db:g

# Run migrations
pnpm db:m

# Start dev server with hot reload
pnpm dev
```

---

## API Reference

> **Interactive docs:** [newsglance.apidog.io](https://newsglance.apidog.io)
> **Postman collection:** import [`POSTMAN_DOCS.json`](./POSTMAN_DOCS.json)

### Response Envelope

Every response — success or error — is wrapped by the `responseWrapper` middleware:

```json
// Success
{ "success": true,  "error": false, "message": "...", "data": { ... } }

// Error
{ "success": false, "error": true,  "message": "..." }
```

### Authentication

Protected routes (marked 🔐) require a valid JWT. It is issued as an **httpOnly cookie** named `token` on login (72h expiry). You can also pass it via header:

```
Authorization: Bearer <token>
```

On logout, the token is **blacklisted in Redis** — re-use is rejected even before expiry.

### Rate Limiting

| Scope               | Limit                 |
| ------------------- | --------------------- |
| Global (all routes) | 300 requests / 15 min |
| `/api/auth/*`       | 30 requests / 15 min  |

---

### 🔧 Utility

| Method | Path                | Description                                            |
| ------ | ------------------- | ------------------------------------------------------ |
| `GET`  | `/api/health`       | Server liveness check — used by Docker healthcheck     |
| `GET`  | `/api/test`         | Alias for `/api/health`                                |
| `POST` | `/api/generate-otp` | Generate + email a 6-digit OTP                         |
| `GET`  | `/api/reset-limit`  | Reset free-tier AI credits for all users (cron target) |

#### `POST /api/generate-otp`

```json
{ "email": "user@example.com", "type": "register" }
```

| `type` value      | Precondition             |
| ----------------- | ------------------------ |
| `register`        | Email must **not** exist |
| `login`           | Email must exist         |
| `forget-password` | Email must exist         |
| `delete-account`  | Email must exist         |

---

### 🔑 Auth — Credential (`/api/auth/cr`)

| Method | Path                         | Description                             |
| ------ | ---------------------------- | --------------------------------------- |
| `POST` | `/api/auth/cr/register`      | Create account (OTP-gated)              |
| `POST` | `/api/auth/cr/login`         | Login — sets `token` cookie             |
| `POST` | `/api/auth/cr/forget/verify` | Verify OTP for password reset           |
| `POST` | `/api/auth/cr/forget/update` | Set new password after OTP verification |

**Register body:**

```json
{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass@123",
  "otp": "123456",
  "phoneNumber": "+919876543210",
  "defaultCountry": "IN"
}
```

**Login body:**

```json
{ "email": "john@example.com", "password": "StrongPass@123", "otp": "123456" }
```

**Login / Register response** sets `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=None`:

```json
{
  "message": "Logged in successfully!",
  "data": {
    "id": "clxyz123",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "newsBalance": 2,
    "audioBalance": 2,
    "isPremium": false,
    "avatar": { "url": "https://s3.amazonaws.com/.../avatar.png" }
  }
}
```

---

### 🔑 Auth — Google (`/api/auth/google`)

| Method | Path                         | Description                                    |
| ------ | ---------------------------- | ---------------------------------------------- |
| `POST` | `/api/auth/google/authorize` | Google OAuth2 — sign-up or sign-in in one call |

```json
{ "googleToken": "<Google ID Token from client>" }
```

Returns `201` for new account creation, `200` for existing user sign-in. Both set the `token` cookie.

---

### 🔑 Auth — General (`/api/auth`)

| Method   | Path                     | Auth | Description                                          |
| -------- | ------------------------ | ---- | ---------------------------------------------------- |
| `GET`    | `/api/auth/logout`       | —    | Clear cookie + blacklist JWT in Redis                |
| `GET`    | `/api/auth/verify-token` | 🔐   | Return current user data from cache/DB               |
| `DELETE` | `/api/auth/delete`       | 🔐   | Permanently delete account (OTP + password required) |

**Delete body:** `{ "email": "...", "password": "...", "otp": "..." }`

---

### 👤 User (`/api/user`) — All routes 🔐

| Method   | Path               | Description                                                      |
| -------- | ------------------ | ---------------------------------------------------------------- |
| `PATCH`  | `/api/user/update` | Update profile fields                                            |
| `PATCH`  | `/api/user/avatar` | Upload a new avatar image (multipart/form-data, field: `avatar`) |
| `DELETE` | `/api/user/avatar` | Reset avatar to system default, deletes old S3 file              |

**Update body** (any combination of):

```json
{
  "username": "newname",
  "name": "New Name",
  "defaultCountry": "US",
  "phoneNumber": "+1..."
}
```

---

### 📰 News (`/api/news`)

News IDs use The Guardian's format (e.g. `world/2024/jan/01/article-slug`). Routes with `:newsId` use wildcard matching to support slashes in IDs.

| Method   | Path                                  | Auth | Description                                           |
| -------- | ------------------------------------- | ---- | ----------------------------------------------------- |
| `GET`    | `/api/news/homepage?page=1`           | —    | Curated homepage — featured, finance, tech            |
| `GET`    | `/api/news/category/:category?page=1` | —    | News by Guardian section                              |
| `GET`    | `/api/news/country/:country?page=1`   | —    | News by country code (e.g. `IN`, `US`)                |
| `GET`    | `/api/news/search?q=query&page=1`     | —    | Full-text search (`q` required)                       |
| `GET`    | `/api/news/single/:newsId`            | —    | Full article detail with body HTML                    |
| `POST`   | `/api/news/bookmark/:newsId`          | 🔐   | Save to bookmarks                                     |
| `GET`    | `/api/news/bookmark`                  | 🔐   | Get all bookmarked articles                           |
| `GET`    | `/api/news/bookmark/check/:newsId`    | 🔐   | Check if article is bookmarked                        |
| `DELETE` | `/api/news/bookmark/:newsId`          | 🔐   | Remove from bookmarks                                 |
| `GET`    | `/api/news/summary/:newsId`           | 🔐   | AI summary (Gemini) — costs 1 `newsBalance` credit    |
| `GET`    | `/api/news/audio/:newsId`             | 🔐   | TTS audio (AWS Polly) — costs 1 `audioBalance` credit |

**Homepage response shape:**

```json
{
  "data": {
    "currentPage": 1,
    "hasNextPage": true,
    "featured": ["<ArticleCard[]>"],
    "finance": ["<ArticleCard[]>"],
    "tech": ["<ArticleCard[]>"]
  }
}
```

**Single article response shape:**

```json
{
  "data": {
    "id": "world/2024/jan/01/article-slug",
    "title": "...",
    "excerpt": "...",
    "thumbnail": "https://media.guim.co.uk/...",
    "author": "Jane Journalist",
    "publishedAt": "2024-01-01T10:00:00Z",
    "readTime": 5,
    "section": "World",
    "body": "<p>Full HTML content...</p>",
    "heroImage": "https://media.guim.co.uk/...",
    "publication": "The Guardian",
    "updatedAt": "2024-01-02T08:00:00Z"
  }
}
```

**AI Summary response:**

```json
{
  "data": {
    "summary": "This article examines...",
    "user": { "newsBalance": 1, "audioBalance": 2, "isPremium": false }
  }
}
```

**Audio response:**

```json
{
  "data": {
    "audio": {
      "id": "...",
      "url": "https://s3.amazonaws.com/.../audio.mp3",
      "type": "audio",
      "duration": 124.5
    },
    "user": { "audioBalance": 1, "isPremium": false }
  }
}
```

> **Caching strategy:** Homepage, category, country, and single article responses are cached in Redis. AI summaries and audio files are cached in PostgreSQL after first generation.

---

### 💳 Payment (`/api/payment`)

| Method | Path                           | Auth | Description                                    |
| ------ | ------------------------------ | ---- | ---------------------------------------------- |
| `GET`  | `/api/payment/create`          | 🔐   | Create a Cashfree order for premium membership |
| `GET`  | `/api/payment/verify/:orderId` | —    | Verify payment status with Cashfree            |
| `GET`  | `/api/payment/history`         | 🔐   | List all payment records for the user          |

**Create order response (201):**

```json
{
  "data": {
    "order_id": "order_abc123",
    "order_amount": 299,
    "order_currency": "INR",
    "payment_session_id": "session_xyz456"
  }
}
```

**Verify response:**

```json
{
  "data": {
    "paymentStatus": "SUCCESS",
    "user": { "isPremium": true, "planExpiryDate": "2025-01-01T00:00:00Z" }
  }
}
```

---

## Data Models

### `UserDataType`

```typescript
{
  id: string; // cuid
  name: string;
  username: string; // unique
  email: string; // unique
  phoneNumber: string; // unique
  avatarId: string;
  avatar: ImageFileType;
  newsBalance: number; // free-tier AI summary credits (default: 2/day)
  audioBalance: number; // free-tier audio credits (default: 2/day)
  isPremium: boolean;
  planExpiryDate: Date | null;
  defaultCountry: string; // ISO country code e.g. "IN"
  createdAt: Date;
  updatedAt: Date;
}
```

### `ArticleCard`

```typescript
{
  id: string; // Guardian article ID e.g. "world/2024/jan/01/slug"
  title: string;
  excerpt: string;
  thumbnail: string | null;
  author: string;
  publishedAt: string;
  readTime: number; // estimated minutes
  section: string;
}
```

### Database Schema (Prisma)

```
User ──────── Bookmark ──── NewsData ──── Comment
  │                              │
  └── File (avatar)          AudioFile (File)
  └── Payment
```

Enums: `FileType { image | audio }` · `PaymentStatus { SUCCESS | FAILED | PENDING }`

---

## API Docs & Postman

| Resource                | Link                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| 📖 Interactive API Docs | [newsglance.apidog.io](https://newsglance.apidog.io)                                                          |
| 📬 Postman Collection   | Import [`POSTMAN_DOCS.json`](./POSTMAN_DOCS.json) — covers all 26 endpoints with example bodies and responses |

**To import Postman collection:**

1. Open Postman → **Import**
2. Select `POSTMAN_DOCS.json`
3. Set the `BASE_URL` variable (default: `http://localhost:5000`)

---

## Available Scripts

| Script             | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start dev server with hot reload (tsx watch) |
| `pnpm build`       | Compile TypeScript to `dist/`                |
| `pnpm start`       | Run compiled production build                |
| `pnpm docker:dev`  | Start dev environment in Docker              |
| `pnpm docker:up`   | Start production Docker stack                |
| `pnpm docker:down` | Stop and remove Docker volumes               |
| `pnpm docker:logs` | Stream container logs                        |
| `pnpm db:g`        | Generate Prisma client                       |
| `pnpm db:m`        | Run database migrations                      |
| `pnpm db:s`        | Open Prisma Studio                           |

---

## License

ISC © [Joydeep Das](https://github.com/joydeep-git)
