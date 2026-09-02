# ExpertListing Assessment

## 1. Overview
This is the backend implementation for the ExpertListing take-home assessment. It provides a RESTful API built with Node.js, Express, and PostgreSQL to support the Flutter mobile client (located in a separate repository). It handles feed pagination, post creation, image uploads, and interactions like comments and likes.

## 2. Implemented Features
- Feed
- Stories
- Post creation
- Image upload
- Location
- Transaction type
- Likes
- Comments
- Filters (category and tag)
- Pagination
- Error handling

## 3. Architecture
```text
Flutter App (External)
    |
    | REST API (JSON / Multipart)
    v
Backend API (Node.js / Express)
    |
    +---- PostgreSQL (Relational Data)
    |
    +---- Cloudinary (Image Storage)
```

## 4. Frontend Implementation
The frontend is a Flutter application located in a separate repository. It communicates with this backend via standard HTTP requests and is responsible for managing its own local state, UI navigation, and image selection. 

## 5. Backend Implementation
- **Framework**: Express.js using Node.js ES Modules.
- **Routes**: Modular route handlers (`postRoutes.js`, `storyRoutes.js`).
- **Controllers & Services**: Strict layer separation where controllers handle HTTP transport and services handle business logic and raw SQL database access.
- **Validation**: Strict runtime validation of request bodies and query parameters using Zod.
- **Error Handling**: Centralized error middleware catching both Zod validation errors and database exceptions, returning a standardized JSON envelope.
- **Pagination**: Offset-based pagination executed directly in SQL.
- **Database Access**: Direct raw SQL queries using `pg` (node-postgres) with parameterized inputs to prevent injection.
- **Image Upload Flow**: Multer captures `multipart/form-data` in memory, which is then streamed directly to Cloudinary.

## 6. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Fetch paginated feed posts. Supports filtering by category/tag. |
| POST | `/api/posts` | Create a new post. Accepts `multipart/form-data` for image uploads. |
| POST | `/api/posts/:id/like` | Toggle the current user's like status on a post. |
| GET | `/api/posts/:id/comments` | Retrieve chronological comments for a post. |
| POST | `/api/posts/:id/comments` | Add a new comment to a post. |
| GET | `/api/stories` | Retrieve a list of active stories. |

## 7. Database Schema
The database uses PostgreSQL with the following core tables:

- `users`: Stores user profiles.
- `posts`: Stores feed content, location, transaction types (`tag`), and image URLs (`media_url`).
  - **Relationship**: A user can create multiple posts.
- `comments`: Stores text comments.
  - **Relationship**: A post can have multiple comments. A user can create multiple comments.
- `likes`: Composite join table tracking post likes.
  - **Relationship**: A user can like multiple posts. A post can have multiple likes.
- `stories`: Stores temporary story media.
  - **Relationship**: A user can have multiple stories.

## 8. Image Upload
Image uploads are fully handled on the backend to avoid exposing credentials on the mobile client.
- **Selection**: The mobile app selects an image and attaches it to a `multipart/form-data` request.
- **Upload**: The backend receives the binary using `multer` (in-memory storage).
- **Storage Service**: The backend pipes the buffer to **Cloudinary** using `streamifier`.
- **Database**: Cloudinary returns a secure URL, which the backend stores in the PostgreSQL `posts` table (`media_url` column).
- **Retrieval**: The mobile app receives the URL in the API response and renders it via standard network image widgets.

## 9. Pagination
The feed implements **offset pagination**.
- **Parameters**: Accepts `page` and `limit` queries.
- **Response**: Returns a `pagination` object containing `currentPage`, `totalPages`, `totalItems`, and a boolean `hasNextPage` flag for the mobile client to manage infinite scrolling.

## 10. Error Handling
- **Backend**: Uses a global error handling middleware. Zod validation failures are mapped to `400 Bad Request`. Missing resources throw custom `NotFoundError` instances mapping to `404 Not Found`. Unhandled exceptions map to `500 Internal Server Error`.
- **API Requests**: All responses follow a strict envelope: `{ success: boolean, data?: any, error?: string }`.

## 11. Running Locally

### Backend Setup
1. **Node.js**: Requires Node.js v18 or newer.
2. **Install dependencies**: 
   ```bash
   npm install
   ```
3. **Environment**: 
   ```bash
   cp .env.example .env
   ```
   Fill in your local or remote PostgreSQL `DATABASE_URL` and Cloudinary credentials.
4. **Database Configuration**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. **Start Server**:
   ```bash
   npm run dev
   ```

## 12. Environment Variables
The following environment variables are required (see `.env.example`):
- `PORT`: The port the server runs on (e.g., 5001).
- `NODE_ENV`: Application environment (e.g., `development`).
- `DATABASE_URL`: Full PostgreSQL connection string.
- `CORS_ORIGIN`: Allowed CORS origins.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

## 13. Deployment
- **Backend**: Can be hosted on any Node.js provider (e.g., Render, Railway, Heroku).
- **Database**: PostgreSQL (e.g., Supabase, Neon).
- **Image Storage**: Cloudinary.

## 14. Assessment Scope and Assumptions
- Authentication was explicitly out of scope. A mocked/hardcoded current user ("Your Story") is provided via middleware to satisfy user relation constraints.
- The mobile client can optionally pass an `x-user-id` header to test actions as different users.
- The `transactionType` required by the assessment is mapped to the existing `tag` column to adhere to the instruction to avoid rewriting architecture or adding unnecessary columns.

## 15. What Was Skipped
- Authentication and login.
- Email verification.
- Payments processing.
- Real-time WebSockets for live feed/comment updates.

## 16. Known Limitations
- Images uploaded to Cloudinary are not actively deleted if a post fails to insert due to an unexpected constraint error in edge cases, though standard try/catch cleanup is implemented.
- Deleting posts is not currently implemented.

## 17. Screenshots / Demo
[Placeholder for Demo Video URL]

## 18. Technical Decisions
- **PostgreSQL**: Chosen for strict relational integrity, foreign key constraints, and standard aggregation capabilities.
- **Raw SQL (`pg`) over ORMs**: Selected to demonstrate SQL competency and minimize overhead, utilizing parameterized queries for security.
- **Layered Architecture**: Keeps route definitions clean while isolating business logic in services, making the codebase highly testable.
- **Zod Validation**: Provides strict runtime validation for incoming data, preventing malformed requests from hitting the database layer.

## 19. Assessment Submission
- **Mobile Repository**: https://github.com/Oghosa1/Realtor_UI
- **Live Backend**: https://realtor-backend-service.onrender.com/health
- **Mobile Build**: https://drive.google.com/file/d/1UBuwp8cdKY6F9_uyLMqqWqbf3J2L3Typ/view?usp=drivesdk
