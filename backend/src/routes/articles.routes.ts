import { Router } from 'express';
import { articlesController } from '../controllers/articles.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuthMiddleware, articlesController.getAll);
router.get('/:id', optionalAuthMiddleware, articlesController.getById);
router.get('/author/:authorId', articlesController.getByAuthor);

// Protected routes (authentication required)
router.post('/', authMiddleware, articlesController.create);
router.patch('/:id', authMiddleware, articlesController.update);
router.delete('/:id', authMiddleware, articlesController.delete);

export default router;
