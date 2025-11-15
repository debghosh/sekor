feat(creator-portal): Add comprehensive creator portal backend infrastructure

## Summary
Implemented complete backend infrastructure for the SEKOR-BKC Creator Portal,
enabling content creators (writers, poets, artists, historians) to create,
manage, and publish bilingual Bengali-English stories with rich media support.

## Database Schema Changes

### New Enums
- Language: BENGALI | ENGLISH | BILINGUAL
- Copyright: CREATOR | CC_BY | CC_BY_SA | PUBLIC_DOMAIN
- MediaType: IMAGE | VIDEO | AUDIO | DOCUMENT
- ReactionType: LOVE | INSIGHTFUL | NOSTALGIC | INSPIRING

### Extended Enums
- Role: Added CREATOR role for content authors
- ContentType: Added VIDEO, AUDIO, MULTIMEDIA types
- ContentStatus: Added SUBMITTED, IN_REVIEW, CHANGES_REQUESTED, APPROVED, 
  REJECTED, SCHEDULED for editorial workflow

### New Models (11 tables)
1. **Story**: Enhanced bilingual content model with Bengali/English support
   - Bilingual fields: title, abstract, body (Quill Delta format)
   - Metadata: slug, language, contentType, readingTime, wordCount
   - Publishing: status, publishedAt, scheduledFor, expiryDate
   - Rights: copyright, allowComments, allowSharing, isPremium
   - Analytics: viewCount, uniqueVisitors, reactionCount, commentCount
   - Review: reviewNotes, reviewerId, reviewedAt

2. **Media**: File upload and management system
   - Support for IMAGE, VIDEO, AUDIO, DOCUMENT types
   - Storage: local/cloud with provider configuration
   - Metadata: altText, caption, credit, dimensions, duration
   - Usage tracking: usageCount for references

3. **StoryMedia**: Junction table for story-media relationships
   - Many-to-many relationship between stories and media
   - Order field for sequencing (photo essays)

4. **Location**: Geographic tagging for hyperlocal content
   - Kolkata-specific locations (Kumartuli, Park Street, College Street)
   - Coordinates (JSON), area designation, historical flag
   - Bilingual naming (name, nameBn)

5. **StoryTag**: Junction table for story-tag relationships
   - Links stories to tags for categorization
   - Separate from existing ContentTag for future migration

6. **StoryAnalytics**: Daily snapshot metrics per story
   - Views: views, uniqueVisitors, avgTimeOnPage, completionRate
   - Engagement: reactions (JSON), comments, shares (JSON), bookmarks
   - Demographics: topLocations, devices, referrals, languages

7. **CreatorAnalytics**: Aggregated creator performance metrics
   - Story stats: totalStories, publishedStories
   - Engagement: totalViews, totalReactions, totalComments, totalShares
   - Audience: followers, followerGrowth
   - Revenue: earnings, supportCount, avgSupport

8. **Reaction**: Reader reactions on stories
   - Types: LOVE, INSIGHTFUL, NOSTALGIC, INSPIRING
   - Optional user association (anonymous supported)
   - Unique constraint: one reaction type per user per story

9. **StoryComment**: Moderated commenting system
   - Threaded comments (parent-child relationships)
   - Moderation: isApproved, isPinned flags
   - Optional user (anonymous comments supported)

10. **Source**: Citations and references
    - Type-specific: book, article, interview, archive, other
    - Standard fields: title, author, url, dateAccessed, notes

11. **ReaderSupport**: Monetization and creator support
    - Direct support for stories or creators
    - Payment tracking: amount, currency, paymentId, paymentStatus
    - Optional messages and anonymous support

### User Model Extensions
Added relations for creator portal functionality:
- stories (authored), coAuthoredStories, reviewedStories
- media, reactions, storyComments
- creatorAnalytics, receivedSupport, givenSupport

### Category & Tag Extensions
- Category: Added stories relation for new Story model
- Tag: Added stories relation via StoryTag junction

## Backend Services

### story.service.ts
Comprehensive story management with 15+ methods:
- **CRUD**: create, getById, getAll, update, delete
- **Workflow**: submit, publish, archive
- **Utilities**: generateSlug, calculateReadingStats, incrementView
- **Features**:
  - Automatic slug generation with uniqueness
  - Reading time calculation from Quill Delta
  - Word count tracking
  - Access control (author, co-author, reviewer permissions)
  - Tag management through junction table
  - Co-author support
  - Source/citation management
  - Status workflow enforcement

### media.service.ts
File upload and management with 10+ methods:
- **Upload**: Multer integration with type/size validation
- **CRUD**: upload, getById, getAll, update, delete
- **Relations**: attachToStory, detachFromStory
- **Storage**: Local storage with cloud provider hooks
- **Validation**: File type checking, size limits per media type
- **Tracking**: Usage count, storage usage calculation
- **Features**:
  - Unique filename generation
  - Thumbnail URL support
  - Metadata management (alt text, caption, credit)
  - Dimension extraction (width, height, duration)
  - Usage prevention (can't delete if in use)

## Controllers

### stories.controller.ts
10 REST endpoints with proper error handling:
- POST   /api/v1/stories - Create draft story
- GET    /api/v1/stories/:id - Get story (with access control)
- GET    /api/v1/stories - List published stories (filtered, paginated)
- GET    /api/v1/stories/me/all - Creator's stories dashboard
- PATCH  /api/v1/stories/:id - Update story
- DELETE /api/v1/stories/:id - Delete story (author only)
- POST   /api/v1/stories/:id/submit - Submit for editorial review
- POST   /api/v1/stories/:id/publish - Publish approved story
- POST   /api/v1/stories/:id/archive - Archive story
- GET    /api/v1/stories/:id/stats - Get analytics

### media.controller.ts
8 REST endpoints with file upload support:
- POST   /api/v1/media/upload - Upload file (multipart/form-data)
- GET    /api/v1/media - List creator's media (filtered, paginated)
- GET    /api/v1/media/:id - Get media details with usage info
- PATCH  /api/v1/media/:id - Update metadata
- DELETE /api/v1/media/:id - Delete (if not in use)
- POST   /api/v1/media/attach - Attach media to story
- POST   /api/v1/media/detach - Detach media from story
- GET    /api/v1/media/storage/usage - Storage usage stats

## Validation & Middleware

### stories.validation.ts
Comprehensive Zod schemas:
- **createStorySchema**: 25+ validated fields including:
  - Bilingual content (title, abstract, body in EN/BN)
  - Category, tags, locations
  - Metadata (language, contentType, copyright)
  - Rights (allowComments, allowSharing, isPremium)
  - Co-authors and sources
- **updateStorySchema**: Partial update with status transitions
- **storyQuerySchema**: Pagination, filters, sorting validation
- **mediaMetadataSchema**: Alt text, caption, credit validation
- **Custom validators**: 
  - validateQuillContent: Ensures valid Quill Delta format
  - validateFileUpload: File presence and size checks

### Multer Configuration
- Storage: Temporary upload with move after validation
- File filter: Type validation by MIME type
- Size limits: Per media type (5MB images, 100MB video, etc.)
- Unique filename generation with timestamp + random suffix

## Routes

### stories.routes.ts
- Public routes: GET /stories, GET /stories/:id
- Creator routes: All CRUD + workflow endpoints (auth required)
- Validation: All inputs validated with Zod schemas
- Error handling: Proper HTTP status codes and error messages

### media.routes.ts
- All routes require authentication
- Upload route uses multipart/form-data
- File validation middleware applied
- Pagination and filtering support

## Utilities & Response Handling

### response.ts Enhancements
Updated ResponseHandler.success() signature for flexibility:
- Supports both old pattern: success(res, data, pagination)
- Supports new pattern: success(res, data, message, pagination)
- Backward compatible with existing endpoints
- Added optional message field for better API responses

## Configuration

### File Upload Directories
```
uploads/
├── temp/       # Temporary uploads during validation
├── image/      # Image files
├── video/      # Video files
├── audio/      # Audio files
└── document/   # PDF and document files
```

### Environment Variables
- UPLOAD_DIR: Local upload directory path
- BASE_URL: Base URL for file URL generation
- MAX_*_SIZE: Per-type file size limits

## Migration

### Prisma Migration
- Migration name: `add_creator_portal`
- Generated SQL for all 11 new tables
- Updated existing tables with new relations
- Proper indexes on foreign keys and frequently queried fields
- Unique constraints for data integrity

### Seeding
- Sample locations: Park Street, Kumartuli, College Street
- Sample story with bilingual content
- Sample analytics data
- Extensible seed structure for production data

## Testing & Quality

### Type Safety
- Full TypeScript coverage
- Prisma Client types for database operations
- Zod runtime validation
- Express Request/Response typing

### Error Handling
- Try-catch blocks in all async operations
- Proper error messages and status codes
- Access control checks
- Validation error details

### Security
- JWT authentication on all creator routes
- Owner/co-author access control
- File type validation
- Size limit enforcement
- SQL injection prevention (Prisma parameterized queries)

## Frontend Compatibility

### Response Format
Maintains backward compatibility:
- Existing endpoints unchanged
- New optional `message` field
- Same `data` and `pagination` structure
- Frontend requires no changes

### API Versioning
All endpoints under `/api/v1/` namespace

## Performance Considerations

### Database Optimization
- Indexes on: authorId, categoryId, status, slug, publishedAt
- Efficient queries with Prisma includes
- Pagination support on all list endpoints
- Aggregated analytics for quick access

### File Handling
- Streamed uploads with Multer
- Lazy loading of media
- Usage tracking to prevent orphaned files
- Storage quota tracking per user

## Documentation

Created comprehensive guides:
- MIGRATION-GUIDE.md: Step-by-step database migration
- BACKEND-INTEGRATION.md: API integration instructions
- FRONTEND-BUILD-CONTEXT.md: Frontend development guide
- Response format examples and error codes

## Future Enhancements (Prepared For)

### Infrastructure Ready For:
- Cloud storage integration (S3, Cloudinary)
- Image processing pipeline
- Video transcoding
- CDN integration
- WebSocket for real-time analytics
- Advanced search with Elasticsearch
- Caching layer (Redis)
- Rate limiting per creator

### Data Model Supports:
- Story versioning (history tracking)
- Scheduled publishing
- Content expiry
- Multi-author collaboration
- Editorial workflow (review/approval)
- Reader support/monetization
- Advanced analytics and demographics

## Breaking Changes
None. All changes are additive:
- New routes do not conflict with existing routes
- Database schema is backward compatible
- Existing Content model untouched
- Response format maintains compatibility

## Dependencies Added
- multer: ^1.4.5-lts.1 (file uploads)
- @types/multer: ^1.4.12 (TypeScript types)

## Known Issues
None identified in testing.

## Tested On
- Node.js v20.x
- PostgreSQL 14+
- TypeScript 5.3+
- Prisma 5.22.0

---

**Migration Required**: Yes - Run `npx prisma migrate dev`
**Breaking Changes**: No
**Backward Compatible**: Yes
**Production Ready**: Yes (with comprehensive testing recommended)
