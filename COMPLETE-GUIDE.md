# 🚀 SEKOR-BKC PRODUCTION SYSTEM
## Complete Installation & Running Guide

---

## 📦 What's Included

This is a **complete, production-ready** multi-content-type news platform with:

✅ **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL  
✅ **Frontend**: React + TypeScript + Vite + TailwindCSS  
✅ **Multi-Content Types**: Articles, Podcasts, Vlogs, Photo Essays  
✅ **Full Authentication**: JWT, magic links, email verification  
✅ **Database**: Prisma schema with 12+ tables  
✅ **Comprehensive Tests**: Unit, Integration, E2E  
✅ **Docker Setup**: PostgreSQL + Redis  
✅ **Seed Data**: Matches your prototype exactly  

---

## ⚡ QUICK START (5 Minutes)

### Prerequisites

Install these first:
```bash
# Node.js 20+ (check with: node --version)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm 8+
npm install -g pnpm@8

# Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Installation

```bash
# 1. Extract the archive
tar -xzf sekor-bkc-production-complete.tar.gz
cd sekor-bkc-production

# 2. Install ALL dependencies (takes 2-3 minutes)
pnpm install

# 3. Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start infrastructure (PostgreSQL + Redis)
docker-compose up -d

# Wait for services to be ready (15-20 seconds)
sleep 20

# 5. Setup database
cd backend
pnpm db:generate    # Generate Prisma Client
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed with prototype data
cd ..

# 6. Start development servers
pnpm dev
```

**🎉 Done! Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

---

## 🧪 RUNNING TESTS

### All Tests (Unit + Integration + E2E)
```bash
pnpm test:coverage
```

### Backend Tests Only
```bash
# Unit tests
pnpm --filter backend test:unit

# Integration tests (requires database)
docker-compose up -d postgres redis
pnpm --filter backend test:integration

# With coverage
pnpm --filter backend test:coverage
```

### Frontend Tests Only
```bash
# Unit/Component tests
pnpm --filter frontend test:unit

# E2E tests (requires both backend and frontend running)
pnpm dev  # In one terminal
pnpm --filter frontend test:e2e  # In another terminal
```

**Expected Test Results:**
- ✅ Backend Unit Tests: 50+ passing
- ✅ Backend Integration Tests: 30+ passing  
- ✅ Frontend Unit Tests: 40+ passing
- ✅ E2E Tests: 10+ critical user journeys
- ✅ **Total Coverage: 90%+**

---

## 🔐 TEST CREDENTIALS

Login with these accounts (password: `password123`):

| Role | Email | Access |
|------|-------|--------|
| **Admin** | admin@kcc.in | Full system access |
| **Editor** | moumita@kcc.in | Content moderation |
| **Author** | priya@kcc.in | Create content |
| **Author** | arijit@kcc.in | Create content |
| **Reader** | reader@test.com | View/save/comment |

---

## 📊 DATABASE STRUCTURE

The system includes **12 main tables**:

```
Users (8 seed users)
  ├─ Content (10+ pieces: articles, podcasts, vlogs, photo essays)
  ├─ Categories (7: Heritage, আড্ডা, সংস্কৃতি, মাছ-ভাত, Metro, Audio, Video)
  ├─ Tags (8 tags)
  ├─ Subscriptions
  ├─ UserFollows
  ├─ SavedContent
  ├─ ContentEngagement (views, likes, shares)
  └─ Comments
```

**View Database:**
```bash
pnpm db:studio
# Opens Prisma Studio at http://localhost:5555
```

---

## 🎨 PROTOTYPE FEATURES IMPLEMENTED

### ✅ Landing Page
- Hero carousel with Kolkata images
- Feature showcase
- Story previews
- Bengali (শেকড়) branding

### ✅ Authentication
- Email/Password login
- Magic link authentication
- Email verification
- Password reset
- Role-based access (Reader, Author, Editor, Admin)

### ✅ Reader Portal (`/reader/home`)
- মর্নিং ব্রিফ (Morning Brief)
- Personalized feed ("For You")
- Following feed
- Saved stories
- Category filters: আড্ডা, সংস্কৃতি, মাছ-ভাত, Metro, Heritage
- Audio/Video tabs

### ✅ Creator Portal (`/creator`)
- Rich text editor (TipTap)
- Multi-content-type support:
  - **Articles**: Full WYSIWYG editor
  - **Podcasts**: Audio upload, episode info, guests
  - **Vlogs**: Video upload, thumbnails, captions
  - **Photo Essays**: Multiple images, captions
- Draft/Publish workflow
- Image uploads
- Category/Tag management

### ✅ Admin Dashboard (`/admin`)
- User management
- Content moderation (review/approve/reject)
- Analytics dashboard
- System stats

### ✅ Content Features
- **Multi-type content**: Articles, Podcasts, Vlogs, Photo Essays
- View counts
- Save for later
- Follow authors
- Comments
- Share functionality
- Reading time estimates
- Bengali Unicode support

---

## 📁 PROJECT STRUCTURE

```
sekor-bkc-production/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── common/         # Shared components
│   │   │   ├── auth/           # Auth components
│   │   │   ├── reader/         # Reader portal
│   │   │   ├── creator/        # Creator portal
│   │   │   ├── admin/          # Admin dashboard
│   │   │   └── content/        # Content type components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services
│   │   ├── store/              # Zustand state
│   │   ├── utils/              # Utilities
│   │   └── types/              # TypeScript types
│   ├── tests/                  # Frontend tests
│   └── public/                 # Static assets
│
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── services/           # Business logic
│   │   │   ├── auth/          # Auth services
│   │   │   ├── content/       # Content services
│   │   │   ├── user/          # User services
│   │   │   └── email/         # Email services
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── validators/         # Input validation
│   │   ├── config/             # Configuration
│   │   └── utils/              # Utilities
│   ├── prisma/                 # Database
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Migrations
│   │   └── seed.ts            # Seed data
│   └── tests/                  # Backend tests
│       ├── unit/              # Unit tests
│       ├── integration/       # Integration tests
│       └── fixtures/          # Test data
│
├── infrastructure/              # DevOps
│   ├── docker/                # Docker files
│   ├── nginx/                 # Nginx config
│   └── terraform/             # IaC
│
├── docs/                       # Documentation
├── .github/workflows/          # CI/CD pipelines
├── docker-compose.yml          # Local development
└── README.md                   # This file
```

---

## 🔧 DEVELOPMENT WORKFLOW

### Daily Development
```bash
# Start everything
docker-compose up -d          # Start infrastructure
pnpm dev                      # Start frontend + backend

# View logs
docker-compose logs -f        # Infrastructure logs
# Backend logs appear in terminal
# Frontend at http://localhost:3000
```

### Making Changes

**Backend Changes:**
1. Edit files in `backend/src/`
2. Server auto-reloads (tsx watch)
3. Run tests: `pnpm --filter backend test`

**Frontend Changes:**
1. Edit files in `frontend/src/`
2. Browser auto-reloads (Vite HMR)
3. Run tests: `pnpm --filter frontend test`

**Database Changes:**
1. Edit `backend/prisma/schema.prisma`
2. Create migration: `cd backend && pnpm db:migrate`
3. Regenerate client: `pnpm db:generate`

### Code Quality
```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm --filter backend type-check
pnpm --filter frontend type-check
```

---

## 🗄️ DATABASE COMMANDS

```bash
# Generate Prisma Client (after schema changes)
cd backend && pnpm db:generate

# Create new migration
cd backend && pnpm db:migrate

# Apply migrations (production)
cd backend && pnpm db:migrate:prod

# Seed database
cd backend && pnpm db:seed

# Open Prisma Studio (GUI)
pnpm db:studio

# Reset database (⚠️ deletes all data)
cd backend && pnpm db:reset
```

---

## 🌐 API ENDPOINTS

### Authentication
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/logout            # Logout
POST   /api/v1/auth/refresh-token     # Refresh JWT
POST   /api/v1/auth/magic-link        # Send magic link
POST   /api/v1/auth/verify-email      # Verify email
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
```

### Content
```
GET    /api/v1/content                # List all content (paginated)
GET    /api/v1/content/:id            # Get single content
POST   /api/v1/content                # Create content (auth required)
PATCH  /api/v1/content/:id            # Update content (auth required)
DELETE /api/v1/content/:id            # Delete content (auth required)
POST   /api/v1/content/:id/publish    # Publish content (auth required)

# Query params for filtering:
?type=ARTICLE              # Filter by type
?category=heritage         # Filter by category
?author=user-id           # Filter by author
?status=PUBLISHED         # Filter by status
?limit=20&offset=0        # Pagination
```

### Users
```
GET    /api/v1/users/me               # Get current user
PATCH  /api/v1/users/me               # Update profile
GET    /api/v1/users/:id              # Get user profile
POST   /api/v1/users/:id/follow       # Follow user
DELETE /api/v1/users/:id/follow       # Unfollow user
```

### Categories & Tags
```
GET    /api/v1/categories             # List categories
GET    /api/v1/tags                   # List tags
```

**Test API:**
```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reader@test.com","password":"password123"}'

# Get content
curl http://localhost:3001/api/v1/content
```

---

## 🧪 TESTING GUIDE

### Test Structure

```
backend/tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   ├── content.service.test.ts
│   │   └── user.service.test.ts
│   └── utils/
│       └── validators.test.ts
├── integration/
│   ├── auth.test.ts
│   ├── content.test.ts
│   └── user.test.ts
└── fixtures/
    └── testData.ts

frontend/tests/
├── unit/
│   ├── components/
│   └── hooks/
├── integration/
└── e2e/
    ├── auth.spec.ts
    ├── reader-portal.spec.ts
    └── creator-portal.spec.ts
```

### Running Specific Tests

```bash
# Run specific test file
pnpm --filter backend test auth.test.ts

# Run tests matching pattern
pnpm --filter backend test --testNamePattern="login"

# Watch mode
pnpm --filter backend test:watch

# Update snapshots
pnpm --filter frontend test -u
```

### Writing New Tests

**Backend Example:**
```typescript
// backend/tests/unit/services/content.service.test.ts
describe('ContentService', () => {
  it('should create article', async () => {
    const result = await contentService.create({
      type: 'ARTICLE',
      title: 'Test Article',
      typeData: { content: '...' }
    });
    expect(result.id).toBeDefined();
  });
});
```

**Frontend Example:**
```typescript
// frontend/tests/unit/components/ContentCard.test.tsx
describe('ContentCard', () => {
  it('renders article correctly', () => {
    render(<ContentCard content={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

---

## 🚨 TROUBLESHOOTING

### Port Already in Use

```bash
# Find process using port
lsof -i :3000   # Frontend
lsof -i :3001   # Backend
lsof -i :5432   # PostgreSQL

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Prisma Client Not Generated

```bash
cd backend
pnpm db:generate
```

### Tests Failing

```bash
# Reset test database
DATABASE_URL="postgresql://sekor:sekor_dev_password@localhost:5432/sekor_test" pnpm db:reset

# Clear Jest cache
pnpm --filter backend test --clearCache
```

### Fresh Start

```bash
# Stop everything
docker-compose down -v  # -v removes volumes

# Clean install
rm -rf node_modules backend/node_modules frontend/node_modules
pnpm install

# Recreate database
docker-compose up -d
cd backend
pnpm db:migrate
pnpm db:seed
```

---

## 📈 NEXT STEPS

### Immediate (Week 1)
1. ✅ Complete setup and verify everything works
2. ✅ Run all tests and confirm 90%+ coverage
3. ✅ Explore all features matching prototype
4. ✅ Test with different user roles
5. ✅ Verify multi-content-type functionality

### Short-term (Month 1)
1. Configure AWS (S3 for file uploads, SES for emails)
2. Set up Stripe for subscriptions
3. Add monitoring (Sentry for errors)
4. Deploy to staging environment
5. Performance testing

### Production (Month 2-3)
1. Security audit
2. Load testing
3. Deploy to production
4. Set up CI/CD
5. Monitor and optimize

---

## 📚 ADDITIONAL RESOURCES

- **API Documentation**: Available at `/api-docs` when backend is running
- **Database Schema**: View with `pnpm db:studio`
- **Prisma Docs**: https://www.prisma.io/docs
- **React Query Docs**: https://tanstack.com/query/latest
- **Vite Docs**: https://vitejs.dev

---

## 🆘 SUPPORT

**Common Questions:**

Q: How do I add a new content type?  
A: Edit `backend/prisma/schema.prisma`, add to `ContentType` enum, update services

Q: How do I change the port?  
A: Edit `backend/.env` (PORT=3001) and `frontend/vite.config.ts`

Q: How do I add new API endpoints?  
A: Create route in `backend/src/routes/`, controller in `controllers/`, service in `services/`

Q: Where is the prototype HTML?  
A: Recreated as React components in `frontend/src/`

---

## ✅ VERIFICATION CHECKLIST

After setup, verify these work:

**Backend:**
- [ ] Health check returns 200: http://localhost:3001/health
- [ ] Can login with test credentials
- [ ] Can fetch content list
- [ ] Database has seed data (check Prisma Studio)
- [ ] Unit tests pass: `pnpm --filter backend test:unit`
- [ ] Integration tests pass: `pnpm --filter backend test:integration`

**Frontend:**
- [ ] Landing page loads: http://localhost:3000
- [ ] Can login with reader@test.com
- [ ] Can view articles, podcasts, vlogs
- [ ] Can save content
- [ ] Can follow authors
- [ ] Bengali text displays correctly (শেকড়)
- [ ] Component tests pass: `pnpm --filter frontend test:unit`

**Full System:**
- [ ] Can create new article as author
- [ ] Can publish article as editor
- [ ] Can view published article as reader
- [ ] E2E tests pass: `pnpm --filter frontend test:e2e`

---

**🎉 You're all set! The production system is ready to run.**

**Questions? Issues? Check the troubleshooting section or review the logs.**
