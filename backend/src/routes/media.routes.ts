import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { mediaController } from '../controllers/media.controller';
import { authMiddleware } from '../middleware/auth';
import {
  validate,
  mediaMetadataSchema,
  mediaQuerySchema,
  uuidParamSchema,
  attachMediaSchema,
  validateFileUpload,
} from '../middleware/stories.validation';

const router: any = Router();

// ============================================
// MULTER CONFIGURATION
// ============================================

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Temporary upload directory (will be moved after validation)
    cb(null, 'uploads/temp');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req: any, file: any, cb: any) => {
  // Allowed file types
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    // Audio
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not supported: ${file.mimetype}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/v1/media/upload
 * Upload media file
 */
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  validateFileUpload,
  validate(mediaMetadataSchema, 'body'),
  mediaController.upload
);

/**
 * GET /api/v1/media
 * Get all media for current user
 */
router.get(
  '/',
  authMiddleware,
  validate(mediaQuerySchema, 'query'),
  mediaController.getAll
);

/**
 * GET /api/v1/media/:id
 * Get media by ID
 */
router.get(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  mediaController.getById
);

/**
 * PATCH /api/v1/media/:id
 * Update media metadata
 */
router.patch(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  validate(mediaMetadataSchema, 'body'),
  mediaController.update
);

/**
 * DELETE /api/v1/media/:id
 * Delete media
 */
router.delete(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  mediaController.delete
);

/**
 * POST /api/v1/media/attach
 * Attach media to story
 */
router.post(
  '/attach',
  authMiddleware,
  validate(attachMediaSchema, 'body'),
  mediaController.attachToStory
);

/**
 * POST /api/v1/media/detach
 * Detach media from story
 */
router.post(
  '/detach',
  authMiddleware,
  validate(attachMediaSchema.pick({ storyId: true, mediaId: true }), 'body'),
  mediaController.detachFromStory
);

/**
 * GET /api/v1/media/storage/usage
 * Get storage usage statistics
 */
router.get(
  '/storage/usage',
  authMiddleware,
  mediaController.getStorageUsage
);

export default router;
