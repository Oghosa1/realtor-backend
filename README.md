# Expert Listing Backend API (Node.js ESM + PostgreSQL)

Production-grade RESTful backend for the **Expert Listing** real estate assessment application, built with Node.js ES Modules, Express, PostgreSQL, and Zod validation.

---

## 🌟 Features & Highlights

- **Relational PostgreSQL Schema**: Normalized tables for `users`, `posts`, `comments`, `likes`, and `stories` with composite keys and indexing.
- **ES Modules (`"type": "module"`)**: Clean modern JavaScript with async/await and strict layer separation (`routes` → `controllers` → `services` → `db`).
- **Standard JSON Envelope**: All responses adhere to the standard envelope `{ success: true, data: ... }` and `{ success: false, error: ... }`.
- **Strict Validation**: Request bodies, queries, and route parameters validated via **Zod**.
- **Assessment Mock Data Seed**: Includes automated migration and seed scripts pre-populating all exact Figma mockup users (Felix Okon, Maurice U, Boyd From, etc.), stories, and posts.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v20+ LTS)
- **Framework**: Express.js 4.19.2
- **Database**: PostgreSQL 14+ (compatible with Supabase, Neon, Render, Railway)
- **Client**: `pg` (node-postgres connection pool)
- **Validation**: Zod 3.23.8
- **Logging & Security**: Morgan, CORS, Dotenv

---

## 🏛 Database Schema (PostgreSQL)

```
       +---------------+
       |     users     |
       +---------------+
       | id (UUID, PK) |<-----------+-----------------+
       | name          |            |                 |
       | handle        |            |                 |
       | role          |            |                 |
       | avatar_url    |            |                 |
       +---------------+            |                 |
               |                    |                 |
               | 1:N                | 1:N             | 1:N
               v                    |                 |
       +---------------+            |                 |
       |     posts     |            |                 |
       +---------------+            |                 |
       | id (UUID, PK) |<----+      |                 |
       | user_id (FK)  |     |      |                 |
       | category      |     |      |                 |
       | tag           |     |      |                 |
       | content       |     |      |                 |
       | location      |     |      |                 |
       | media_url     |     |      |                 |
       | is_video      |     |      |                 |
       | views_count   |     |      |                 |
       | created_at    |     |      |                 |
       +---------------+     |      |                 |
               |             |      |                 |
       +-------+-------+     |      |                 |
       | 1:N           | 1:N |      |                 |
       v               v     |      |                 |
+---------------+  +---------------+  +---------------+
|   comments    |  |     likes     |  |    stories    |
+---------------+  +---------------+  +---------------+
| id (UUID, PK) |  | post_id (PK)  |  | id (UUID, PK) |
| post_id (FK)  |  | user_id (PK)  |  | user_id (FK)  |
| user_id (FK)  |  | created_at    |  | media_url     |
| text          |  +---------------+  | created_at    |
| created_at    |                     +---------------+
+---------------+
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18 or later
- A PostgreSQL database instance (local PostgreSQL or cloud Supabase/Neon database URL)

### 2. Installation & Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:
```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expert_listing
CORS_ORIGIN=*
```

### 3. Run Migrations & Seed Data
```bash
# Create database tables and indexes
npm run db:migrate

# Seed realistic Figma assessment data
npm run db:seed
```

### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```
The server will start on `http://localhost:5001`.

---

## 📡 API Endpoints & Curl Examples

### Health Check
```bash
curl http://localhost:5001/health
```

### 1. Get Feed Posts (Paginated with Category/Tag Filters)
```bash
# Fetch page 1 of all posts
curl http://localhost:5001/api/posts?page=1&limit=10

# Filter by category (request, general, property)
curl http://localhost:5001/api/posts?category=request

# Filter by tag (Looking to Buy, For Rent, For Sale)
curl "http://localhost:5001/api/posts?tag=Looking%20to%20Buy"
```

### 2. Create Post
```bash
curl -X POST http://localhost:5001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Looking for a 2-bedroom apartment in Yaba. Moving in next month.",
    "category": "request",
    "tag": "Looking to Buy",
    "location": "Lekki Phase 1, Lagos"
  }'
```

### 3. Toggle Like on a Post
```bash
curl -X POST http://localhost:5001/api/posts/a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa/like \
  -H "x-user-id: 11111111-1111-1111-1111-111111111111"
```

### 4. Get Comments & Add Comment
```bash
# Get comments for a post
curl http://localhost:5001/api/posts/b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb/comments

# Add a comment
curl -X POST http://localhost:5001/api/posts/b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb/comments \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Thanks for the update on Admiralty road!"
  }'
```

### 5. Get Stories
```bash
curl http://localhost:5001/api/stories
```

---

## 📐 Assumptions & Design Decisions

1. **Authentication Scope**: As permitted by the assessment brief, full auth/email verification is mocked using a persistent current user context (supporting optional `x-user-id` header override).
2. **PostgreSQL Relational Design**: Used strict foreign keys (`ON DELETE CASCADE`) and composite primary keys (`post_id`, `user_id`) on the `likes` table to prevent duplicate likes and race conditions.
3. **Optimized Aggregation**: Single-query aggregate retrieval using PostgreSQL `json_build_object` and subqueries for like counts, comments count, and latest user avatars to minimize round trips.
