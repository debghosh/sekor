import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authorsController } from '../controllers/authors.controller';
import { articlesController } from '../controllers/articles.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router: Router = Router();

// Validation schema
const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// GET /api/v1/authors - List all authors
router.get('/', optionalAuthMiddleware, authorsController.list);

// GET /api/v1/authors/following - Get list of followed authors (MUST be before /:id)
router.get('/following', authMiddleware, authorsController.getFollowing);

// GET /api/v1/authors/:id - Get author profile
router.get('/:id', 
  validate(uuidParamSchema, 'params'),
  optionalAuthMiddleware, 
  authorsController.getById
);

// GET /api/v1/authors/:id/articles - Get author's articles (NEW ROUTE)

router.get('/:id/articles',
  validate(uuidParamSchema, 'params'),
  optionalAuthMiddleware,
  authorsController.getArticles
);

// POST /api/v1/authors/:id/follow - Follow an author
router.post('/:id/follow', 
  validate(uuidParamSchema, 'params'),
  authMiddleware, 
  authorsController.followAuthor
);

// DELETE /api/v1/authors/:id/follow - Unfollow an author
router.delete('/:id/follow', 
  validate(uuidParamSchema, 'params'),
  authMiddleware, 
  authorsController.unfollowAuthor
);

export default router;