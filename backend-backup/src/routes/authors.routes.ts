import express from 'express';
import { authorsController } from '../controllers/authors.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = express.Router();

// Protected routes (require authentication) - MUST come before /:id
router.get('/following/list', authMiddleware, authorsController.getFollowingAuthors);
router.post('/:id/follow', authMiddleware, authorsController.followAuthor);
router.delete('/:id/follow', authMiddleware, authorsController.unfollowAuthor);

// Public routes (with optional auth to check follow status)
router.get('/', optionalAuthMiddleware, authorsController.getAuthors);
router.get('/:id', optionalAuthMiddleware, authorsController.getAuthorById);

export default router;