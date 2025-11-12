import { Router } from 'express';
import { articlesController } from '../controllers/articles.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/v1/articles - List all articles (with filters)
router.get('/', optionalAuthMiddleware, articlesController.list);

// GET /api/v1/articles/:id - Get single article
router.get('/:id', optionalAuthMiddleware, articlesController.getById);

// POST /api/v1/articles - Create new article
router.post('/', authMiddleware, articlesController.create);

// PATCH /api/v1/articles/:id - Update article
router.patch('/:id', authMiddleware, articlesController.update);

// DELETE /api/v1/articles/:id - Delete article
router.delete('/:id', authMiddleware, articlesController.delete);

export default router;
