# SEKOR-BKC Backend Refactor Guide

## Overview
Complete backend refactoring to production-grade REST API with standardized endpoints, error handling, and comprehensive documentation.

## Major Changes

### 1. Route Standardization
All routes now follow REST conventions under `/api/v1/`:

#### Old → New Route Mappings

**Articles:**
- `GET /api/v1/articles` → Same (standardized response)
- `GET /api/v1/articles/:id` → Same (standardized response)
- `GET /api/v1/articles/author/:authorId` → Use `GET /api/v1/articles?authorId={id}`
- `POST /api/v1/articles` → Same
- `PATCH /api/v1/articles/:id` → Same
- `DELETE /api/v1/articles/:id` → Same

**Authors:**
- `GET /api/v1/authors` → Same
- `GET /api/v1/authors/:id` → Same
- `POST /api/v1/authors/:id/follow` → Same
- `DELETE /api/v1/authors/:id/follow` → Same
- `GET /api/v1/authors/following/list` → `GET /api/v1/follows`

**Auth:**
- `POST /api/v1/auth/register` → Same
- `POST /api/v1/auth/login` → Same
- `GET /api/v1/auth/profile` → Same
- `POST /api/v1/auth/logout` → Same

**Deprecated Routes (with automatic redirect):**
- `GET /api/auth/*` → Redirects to `/api/v1/auth/*` with 307 status

### 2. Response Format Standardization

**Success Response:**
```json
{
  "data": { ... },
  "meta": { ... },
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Article not found",
    "details": [
      {
        "field": "articleId",
        "issue": "Invalid UUID format"
      }
    ],
    "request_id": "req_abc123"
  }
}
```

### 3. New Features

**Pagination:**
- Query params: `?page=1&per_page=20&sort=createdAt&order=desc`
- Max per_page: 100
- Link headers for next/prev/first/last pages
- Total count in pagination meta

**Request Tracking:**
- Every request gets unique `X-Request-ID` header
- Request IDs included in error responses
- Useful for debugging and tracing

**Deprecation Handling:**
- Old routes redirect with 307 status
- `Deprecation` and `Sunset` headers included
- Usage logged for telemetry

### 4. Middleware Stack

1. **Request ID** - Assigns unique ID to each request
2. **Deprecation** - Handles old route redirects
3. **Logging** - Structured request logging
4. **Auth** - JWT bearer token validation
5. **Error Handler** - Standardized error responses

### 5. File Structure

```
backend_refactored/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── articles.controller.ts
│   │   ├── authors.controller.ts
│   │   └── auth.controller.ts
│   ├── routes/               # Route definitions
│   │   ├── articles.routes.ts
│   │   ├── authors.routes.ts
│   │   ├── auth.routes.ts
│   │   └── follows.routes.ts
│   ├── services/             # Business logic
│   │   ├── content/
│   │   └── auth/
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts
│   │   ├── requestId.ts
│   │   └── deprecation.ts
│   ├── utils/                # Utilities
│   │   ├── response.ts
│   │   ├── pagination.ts
│   │   ├── jwt.ts
│   │   └── password.ts
│   └── server.ts             # Main application
├── tests/
│   ├── contracts/            # API contract tests
│   ├── integration/          # Integration tests
│   └── unit/                 # Unit tests
├── prisma/                   # Database schema
├── docs/                     # Documentation
├── openapi.yaml              # OpenAPI 3.1 spec
└── package.json
```

## Breaking Changes

1. **Response structure changed** - All responses now use standardized format
2. **Error codes introduced** - Error responses include machine-readable codes
3. **Pagination changed** - Now uses `page` and `per_page` instead of `skip` and `limit`
4. **Some routes merged** - Author articles accessible via articles endpoint with filter

## Non-Breaking Changes

1. All existing functionality preserved
2. Old routes redirect automatically
3. Authentication mechanism unchanged
4. Database schema unchanged

## Migration Steps

1. **Update frontend API calls** to expect new response format:
   ```typescript
   // Old
   const articles = await response.json();
   
   // New
   const { data, pagination } = await response.json();
   const articles = data;
   ```

2. **Handle pagination changes**:
   ```typescript
   // Old
   fetch('/api/v1/articles?skip=20&limit=10')
   
   // New
   fetch('/api/v1/articles?page=3&per_page=10')
   ```

3. **Update error handling**:
   ```typescript
   if (!response.ok) {
     const { error } = await response.json();
     console.error(error.code, error.message);
   }
   ```

## Testing

Run tests:
```bash
npm test                    # All tests
npm run test:contracts      # Contract tests only
npm run test:coverage       # With coverage report
```

## OpenAPI Documentation

View full API specification in `openapi.yaml` or use tools like Swagger UI:
```bash
npx swagger-ui-dist openapi.yaml
```

## Deprecation Timeline

- **2025-01-01**: Old routes deprecated (redirects active)
- **2025-06-01**: Old routes sunset (removed entirely)

## Support

For issues or questions about the refactor:
- Check `API_REFERENCE.md` for endpoint details
- Review `openapi.yaml` for complete specifications
- See `MIGRATION_LOG.md` for detailed changelog
