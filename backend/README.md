# SEKOR-BKC Backend - Refactored

Production-grade REST API for শেকড় - The Kolkata Chronicle

## Quick Start

### Installation
```bash
pnpm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Database Setup
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### Development
```bash
pnpm dev
```

Server starts at http://localhost:3001

### Production Build
```bash
pnpm build
pnpm start
```

## Testing

```bash
pnpm test                    # Run all tests
pnpm test:contracts          # Contract tests only
pnpm test:coverage           # With coverage report
```

## API Documentation

- OpenAPI spec: `openapi.yaml`
- Full guide: `BACKEND_REFACTOR_GUIDE.md`
- API reference: `API_REFERENCE.md`

## Project Structure

```
backend_refactored/
├── src/
│   ├── controllers/        # HTTP request handlers
│   ├── routes/             # Route definitions
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utilities
│   └── server.ts           # Main application
├── tests/                  # Test suites
├── prisma/                 # Database schema
├── docs/                   # Documentation
└── openapi.yaml            # API specification
```

## Key Features

- ✅ RESTful API design
- ✅ Standardized responses
- ✅ Request tracking
- ✅ Pagination support
- ✅ JWT authentication
- ✅ OpenAPI 3.1 spec
- ✅ Comprehensive tests
- ✅ TypeScript strict mode
- ✅ Production-ready

## Scripts

- `pnpm dev` - Development with hot reload
- `pnpm build` - TypeScript compilation
- `pnpm start` - Production server
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run migrations
- `pnpm db:seed` - Seed database

## pnpm Workspace

This backend is part of a pnpm monorepo. From project root:

```bash
# Run backend only
pnpm --filter backend dev

# Run both frontend and backend
pnpm dev
```

## Environment Variables

See `.env.example` for required configuration:
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - CORS origin

## Migration from Old Backend

See `BACKEND_REFACTOR_GUIDE.md` for complete migration instructions.

## Support

For issues or questions, check the documentation:
- `BACKEND_REFACTOR_GUIDE.md`
- `API_REFERENCE.md`
- `MIGRATION_LOG.md`
- `INSTALLATION_PNPM.md`
