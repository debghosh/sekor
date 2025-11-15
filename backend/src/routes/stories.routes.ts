import { Router } from 'express';
import { storiesController } from '../controllers/stories.controller';
import { authMiddleware } from '../middleware/auth';
import {
  validate,
  createStorySchema,
  updateStorySchema,
  storyQuerySchema,
  uuidParamSchema,
  validateQuillContent,
} from '../middleware/stories.validation';

const router: any = Router();

// ============================================
// PUBLIC ROUTES (No auth required)
// ============================================

/**
 * GET /api/v1/stories
 * Get all published stories
 */
router.get(
  '/',
  validate(storyQuerySchema, 'query'),
  storiesController.getAll
);

/**
 * GET /api/v1/stories/:id
 * Get story by ID (published or owner)
 */
router.get(
  '/:id',
  validate(uuidParamSchema, 'params'),
  storiesController.getById
);

// ============================================
// CREATOR ROUTES (Auth required)
// ============================================

/**
 * GET /api/v1/stories/me/all
 * Get my stories (creator dashboard)
 */
router.get(
  '/me/all',
  authMiddleware,
  validate(storyQuerySchema, 'query'),
  storiesController.getMyStories
);

/**
 * POST /api/v1/stories
 * Create a new story (draft)
 */
router.post(
  '/',
  authMiddleware,
  validate(createStorySchema, 'body'),
  validateQuillContent,
  storiesController.create
);

/**
 * PATCH /api/v1/stories/:id
 * Update story
 */
router.patch(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  validate(updateStorySchema, 'body'),
  storiesController.update
);

/**
 * DELETE /api/v1/stories/:id
 * Delete story
 */
router.delete(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  storiesController.delete
);

/**
 * POST /api/v1/stories/:id/submit
 * Submit story for review
 */
router.post(
  '/:id/submit',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  storiesController.submit
);

/**
 * POST /api/v1/stories/:id/publish
 * Publish approved story
 */
router.post(
  '/:id/publish',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  storiesController.publish
);

/**
 * POST /api/v1/stories/:id/archive
 * Archive story
 */
router.post(
  '/:id/archive',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  storiesController.archive
);

/**
 * GET /api/v1/stories/:id/stats
 * Get story statistics
 */
router.get(
  '/:id/stats',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  storiesController.getStats
);

export default router;
