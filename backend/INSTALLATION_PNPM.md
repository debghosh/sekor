# SEKOR-BKC Backend - Installation Guide (pnpm)

## Quick Installation

### 1. Extract and Replace
```bash
# Backup current backend
mv backend backend_backup

# Extract refactored backend
unzip sekor-backend-refactored.zip

# Rename to 'backend'
mv backend_refactored backend
```

### 2. Install Dependencies (from project root)
```bash
# Install all workspace dependencies
pnpm install
```

### 3. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

### 4. Setup Database
```bash
# From project root
pnpm --filter backend db:generate
pnpm --filter backend db:migrate
pnpm --filter backend db:seed  # Optional
```

### 5. Start Server

**From project root (recommended):**
```bash
pnpm dev  # Starts both frontend and backend
```

**Or backend only:**
```bash
pnpm --filter backend dev
```

**Or from backend directory:**
```bash
cd backend
pnpm dev
```

Server runs at: http://localhost:3001

## pnpm Workspace Commands

Your project uses pnpm workspaces. Use these commands:

### From Project Root
```bash
# Install all dependencies
pnpm install

# Run both frontend and backend
pnpm dev

# Build everything
pnpm build

# Run tests
pnpm test

# Lint everything
pnpm lint

# Backend only
pnpm --filter backend dev
pnpm --filter backend build
pnpm --filter backend test

# Database commands
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

### From Backend Directory
```bash
cd backend

# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Tests
pnpm test
pnpm test:contracts
pnpm test:coverage

# Database
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Verification

Test the API:
```bash
# Health check
curl http://localhost:3001/health

# API root
curl http://localhost:3001/api/v1

# List articles
curl http://localhost:3001/api/v1/articles
```

## Running Tests

```bash
# From project root
pnpm --filter backend test

# Or from backend directory
cd backend
pnpm test
pnpm test:contracts
pnpm test:coverage
```

## Project Structure with pnpm

```
sekor-bkc-production/
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # Workspace definition
├── pnpm-lock.yaml         # Lock file
├── backend/               # Backend workspace
│   ├── package.json
│   ├── src/
│   └── ...
└── frontend/              # Frontend workspace
    ├── package.json
    └── ...
```

## Why pnpm?

Your project uses pnpm workspaces for:
- ✅ Faster installs
- ✅ Better disk space usage
- ✅ Monorepo management
- ✅ Shared dependencies

## Docker Deployment

If using Docker:
```bash
# From project root
pnpm docker:up
```

Or with docker-compose directly:
```bash
docker-compose up -d
```

## Production Build

```bash
# From project root
pnpm build

# Or backend only
pnpm --filter backend build

# Start production server
cd backend
pnpm start
```

## Environment Variables

See `.env.example` for required configuration:
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - CORS origin

## Troubleshooting

**pnpm command not found:**
```bash
npm install -g pnpm
```

**Dependencies not installing:**
```bash
# From project root
pnpm install --force
```

**Database connection fails:**
- Verify DATABASE_URL in .env
- Ensure PostgreSQL is running
- Run `pnpm --filter backend db:migrate`

**Build fails:**
```bash
pnpm install
pnpm --filter backend build
```

## Migration from npm to pnpm

If you see `npm` commands in documentation, convert them:
```bash
npm install     → pnpm install
npm run dev     → pnpm dev
npm test        → pnpm test
npm run build   → pnpm build
```

## Support

Documentation files:
- `README.md` - Overview
- `BACKEND_REFACTOR_GUIDE.md` - Migration guide
- `API_REFERENCE.md` - API documentation
- `MIGRATION_LOG.md` - Changelog

All endpoints tested and verified. Ready for production deployment.
