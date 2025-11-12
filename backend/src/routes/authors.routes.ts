import { Router } from 'express';
import { authorsController } from '../controllers/authors.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/v1/authors - List all authors
router.get('/', optionalAuthMiddleware, authorsController.list);

// GET /api/v1/authors/:id - Get author profile
router.get('/:id', optionalAuthMiddleware, authorsController.getById);

// POST /api/v1/authors/:id/follow - Follow an author
router.post('/:id/follow', authMiddleware, authorsController.followAuthor);

// DELETE /api/v1/authors/:id/follow - Unfollow an author
router.delete('/:id/follow', authMiddleware, authorsController.unfollowAuthor);

// GET /api/v1/authors/following - Get list of followed authors
router.get('/following', authMiddleware, authorsController.getFollowing);

export default router;
