# শেকড় - The Kolkata Chronicle
## Production System with Multi-Content-Type Support

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/Coverage-90%25-success)](https://jestjs.io/)

A **modern, scalable, production-ready** news publication platform with Bengali cultural focus and multi-content-type support (Articles, Podcasts, Vlogs, Photo Essays).

---

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start infrastructure
docker-compose up -d

# 4. Setup database
cd backend && pnpm db:generate && pnpm db:migrate && pnpm db:seed && cd ..

# 5. Start servers
pnpm dev
```

**Access:** http://localhost:3000 | **API:** http://localhost:3001

**Test Login:** `reader@test.com` / `password123`

---

## 📖 Full Documentation

**→ [Read COMPLETE-GUIDE.md for detailed instructions](./COMPLETE-GUIDE.md)**

The complete guide includes:
- ✅ Detailed installation steps
- ✅ Running all tests (unit, integration, E2E)
- ✅ Database structure and seed data
- ✅ API endpoints reference
- ✅ Development workflow
- ✅ Troubleshooting guide
- ✅ Feature verification checklist

---

## 🎯 Features

### Multi-Content-Type Support
- **Articles**: Rich text editor with images
- **Podcasts**: Audio content with transcripts, guests, chapters
- **Vlogs**: Video content with thumbnails, captions, chapters
- **Photo Essays**: Image galleries with captions and narratives

### User Roles
- **Reader**: View, save, comment, follow authors
- **Author**: Create all content types
- **Editor**: Moderate content, manage workflow
- **Admin**: Full system access

### Core Features
- ✅ JWT Authentication + Magic Links
- ✅ Email Verification & Password Reset
- ✅ Personalized Feeds ("For You")
- ✅ Follow Authors
- ✅ Save Content
- ✅ Comments
- ✅ Bengali Unicode Support (শেকড়)
- ✅ SEO Optimization
- ✅ Analytics & Engagement Tracking

---

## 🧪 Testing

```bash
# All tests with coverage
pnpm test:coverage

# Backend tests
pnpm --filter backend test:unit        # 50+ unit tests
pnpm --filter backend test:integration # 30+ integration tests

# Frontend tests  
pnpm --filter frontend test:unit       # 40+ component tests
pnpm --filter frontend test:e2e        # 10+ E2E tests

# Expected: 90%+ coverage
```

---

## 🏗️ Architecture

```
Frontend (React + TypeScript + Vite)
    ↓
Backend API (Node.js + Express + TypeScript)
    ↓
PostgreSQL (with Prisma ORM) + Redis
```

**Database**: 12 tables with full relational integrity  
**Content Types**: Unified schema with JSONB for type-specific data  
**Authentication**: JWT with refresh tokens  
**Caching**: Redis for sessions and hot data

---

## 📊 Sample Data

The seed script populates:
- **8 Users** (admin, editors, authors, readers)
- **7 Categories** (Heritage, আড্ডা, সংস্কৃতি, মাছ-ভাত, Metro, Audio, Video)
- **4 Articles** matching your prototype
- **2 Podcasts** with episodes and guests
- **2 Vlogs** with video metadata
- **1 Photo Essay** with image galleries
- **Engagement data**: views, saves, follows, comments

---

## 🔑 Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@kcc.in | password123 | Admin |
| priya@kcc.in | password123 | Author |
| reader@test.com | password123 | Reader |

---

## 📁 Project Structure

```
sekor-bkc-production/
├── frontend/           # React application
├── backend/            # Node.js API
│   ├── prisma/        # Database schema & migrations
│   ├── src/           # Source code
│   └── tests/         # Test suites
├── infrastructure/     # Docker, Terraform, Nginx
├── docs/              # Documentation
└── .github/workflows/ # CI/CD pipelines
```

---

## 🚀 What's Different from Prototype?

**Prototype** (HTML/CSS/JS + localStorage):
- Static files
- Client-side only
- No real backend
- No database

**Production** (This system):
- Full-stack application
- Real backend API
- PostgreSQL database
- Multi-content types
- Comprehensive tests
- Production-ready infrastructure
- 90%+ test coverage
- CI/CD pipeline
- Docker containerization

---

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Query, Zustand  
**Backend**: Node.js 20, Express, TypeScript, Prisma, PostgreSQL, Redis  
**Testing**: Jest, Vitest, Playwright, Supertest  
**DevOps**: Docker, GitHub Actions, Terraform  
**Cloud Ready**: AWS (S3, SES, RDS, ElastiCache, ECS, CloudFront)

---

## 📚 Documentation Files

- **COMPLETE-GUIDE.md** - Full installation, testing, and development guide
- **README.md** - This file (quick overview)
- **PRODUCTION_IMPLEMENTATION_PLAN.md** - Architecture deep-dive
- **7-DAY-DEPLOYMENT-CHECKLIST.md** - Production deployment guide

---

## 🎯 Verification

After setup, verify:
```bash
# Backend health
curl http://localhost:3001/health

# Login test
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reader@test.com","password":"password123"}'

# Run tests
pnpm test:coverage
```

---

## 🆘 Troubleshooting

**Database won't connect?**
```bash
docker-compose restart postgres
```

**Port in use?**
```bash
lsof -i :3000 # or :3001
kill -9 <PID>
```

**Tests failing?**
```bash
cd backend && pnpm db:reset
```

**See COMPLETE-GUIDE.md for more troubleshooting**

---

## 📈 Next Steps

1. ✅ **Complete setup** following COMPLETE-GUIDE.md
2. ✅ **Run all tests** and verify 90%+ coverage
3. ✅ **Test all features** with different user roles
4. ✅ **Verify multi-content types** (articles, podcasts, vlogs, photo essays)
5. ⬜ Configure AWS services (S3, SES)
6. ⬜ Set up Stripe payments
7. ⬜ Deploy to staging
8. ⬜ Production deployment

---

## 🙏 Built With

- Original prototype concepts
- Modern web technologies
- Production-grade architecture
- Comprehensive testing
- Bengali cultural focus

---

**✨ Ready to launch! Follow COMPLETE-GUIDE.md for detailed instructions.**

**শেকড় - Connecting you to the heart of Kolkata**
