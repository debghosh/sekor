# SEKOR-BKC API Reference

## Base URL
```
Development: http://localhost:3001/api/v1
Production:  https://api.sekor-bkc.com/api/v1
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Articles

#### List Articles
```http
GET /articles
```

Query Parameters:
- `page` (integer, default: 1)
- `per_page` (integer, default: 20, max: 100)
- `categoryId` (UUID)
- `authorId` (UUID)
- `status` (DRAFT | REVIEW | PUBLISHED | ARCHIVED)
- `search` (string)
- `sort` (string, default: createdAt)
- `order` (asc | desc, default: desc)

Response: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Article Title",
      "summary": "Brief summary",
      "status": "PUBLISHED",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

#### Get Article
```http
GET /articles/{id}
```

Response: `200 OK`
```json
{
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "content": "Full article content...",
    "summary": "Brief summary",
    "categoryId": "uuid",
    "authorId": "uuid",
    "status": "PUBLISHED",
    "views": 1234,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Create Article
```http
POST /articles
Authorization: Bearer <token>
```

Request Body:
```json
{
  "title": "Article Title",
  "content": "Full article content",
  "summary": "Brief summary",
  "categoryId": "uuid",
  "image": "url",
  "status": "DRAFT"
}
```

Response: `201 Created`

#### Update Article
```http
PATCH /articles/{id}
Authorization: Bearer <token>
```

Request Body: (all fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "PUBLISHED"
}
```

Response: `200 OK`

#### Delete Article
```http
DELETE /articles/{id}
Authorization: Bearer <token>
```

Response: `204 No Content`

---

### Authors

#### List Authors
```http
GET /authors
```

Query Parameters:
- `page` (integer)
- `per_page` (integer)

Response: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Author Name",
      "bio": "Author biography",
      "avatarUrl": "url",
      "isFollowing": false
    }
  ],
  "pagination": { ... }
}
```

#### Get Author
```http
GET /authors/{id}
```

Response: `200 OK`
```json
{
  "data": {
    "id": "uuid",
    "name": "Author Name",
    "email": "author@example.com",
    "bio": "Biography",
    "avatarUrl": "url",
    "isFollowing": true,
    "followerCount": 123
  }
}
```

#### Follow Author
```http
POST /authors/{id}/follow
Authorization: Bearer <token>
```

Response: `201 Created`

#### Unfollow Author
```http
DELETE /authors/{id}/follow
Authorization: Bearer <token>
```

Response: `204 No Content`

---

### Follows

#### Get Following
```http
GET /follows
Authorization: Bearer <token>
```

Response: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Author Name",
      "avatarUrl": "url"
    }
  ]
}
```

---

### Authentication

#### Register
```http
POST /auth/register
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}
```

Response: `201 Created`
```json
{
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "READER"
    }
  }
}
```

#### Login
```http
POST /auth/login
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response: `200 OK`
```json
{
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "READER"
    }
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

Response: `200 OK`
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "READER",
    "avatarUrl": "url",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

Response: `200 OK`

---

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [
      {
        "field": "fieldName",
        "issue": "Description of issue"
      }
    ],
    "request_id": "req_abc123"
  }
}
```

### Error Codes

- `BAD_REQUEST` (400) - Invalid input
- `UNAUTHORIZED` (401) - Missing or invalid authentication
- `FORBIDDEN` (403) - Insufficient permissions
- `RESOURCE_NOT_FOUND` (404) - Resource doesn't exist
- `CONFLICT` (409) - Duplicate or conflicting resource
- `INTERNAL_SERVER_ERROR` (500) - Server error

---

## Headers

### Request Headers
- `Authorization: Bearer <token>` - For authenticated endpoints
- `Content-Type: application/json` - For request bodies

### Response Headers
- `X-Request-ID` - Unique request identifier
- `Link` - Pagination links (next, prev, first, last)
- `Deprecation` - For deprecated endpoints
- `Sunset` - Deprecation sunset date

---

## Rate Limiting

- Window: 15 minutes
- Max requests: 100 per window
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Versioning

Current version: v1
Base path: `/api/v1`

Future versions will use `/api/v2`, etc. with proper deprecation notices.
