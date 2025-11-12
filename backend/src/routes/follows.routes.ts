import { Router } from 'express';
import { authorsController } from '../controllers/authors.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/v1/follows - Get list of followed author IDs
router.get('/', authMiddleware, authorsController.getFollowing);

// POST /api/v1/follows/:authorId - Follow an author
router.post('/:authorId', authMiddleware, authorsController.followAuthor);

// DELETE /api/v1/follows/:authorId - Unfollow an author
router.delete('/:authorId', authMiddleware, authorsController.unfollowAuthor);

export default router;
