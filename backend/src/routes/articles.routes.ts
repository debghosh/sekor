import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { articlesController } from '../controllers/articles.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router:any = Router();

// Validation schemas
const articleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).default(10),
  category: z.enum(['FOOD', 'HERITAGE', 'ARTS', 'LITERATURE', 'PEOPLE', 'PLACES', 'EVENTS', 'CULTURE'])
    .optional()
    .or(z.string().optional()), // Accept any string for flexibility
  search: z.string().max(100).optional(),
});

const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

const createArticleSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(100),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  category: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

const updateArticleSchema = createArticleSchema.partial();

// GET /api/v1/articles - List all articles (with filters)
router.get('/', 
  validate(articleQuerySchema, 'query'),
  optionalAuthMiddleware, 
  articlesController.list
);

// GET /api/v1/articles/:id - Get single article
router.get('/:id', 
  validate(uuidParamSchema, 'params'),
  optionalAuthMiddleware, 
  articlesController.getById
);

// POST /api/v1/articles - Create new article
router.post('/', 
  authMiddleware,
  validate(createArticleSchema, 'body'),
  articlesController.create
);

// PATCH /api/v1/articles/:id - Update article
router.patch('/:id', 
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  validate(updateArticleSchema, 'body'),
  articlesController.update
);

// DELETE /api/v1/articles/:id - Delete article
router.delete('/:id', 
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  articlesController.delete
);

export default router;