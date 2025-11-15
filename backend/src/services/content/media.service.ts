import { PrismaClient, MediaType } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

// File upload configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024,      // 5MB
  VIDEO: 100 * 1024 * 1024,    // 100MB
  AUDIO: 50 * 1024 * 1024,     // 50MB
  DOCUMENT: 10 * 1024 * 1024,  // 10MB
};

const ALLOWED_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/webm', 'video/quicktime'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export interface CreateMediaInput {
  file: UploadedFile;
  altText?: string;
  caption?: string;
  credit?: string;
}

export interface GetMediaFilter {
  userId?: string;
  type?: MediaType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'size' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
}

export const mediaService = {
  /**
   * Upload and save media file
   */
  async upload(userId: string, data: CreateMediaInput) {
    const { file, altText, caption, credit } = data;

    // Determine media type
    const mediaType = this.getMediaType(file.mimetype);

    // Validate file
    this.validateFile(file, mediaType);

    // Generate unique filename
    const filename = this.generateFilename(file.originalname);
    const filePath = path.join(UPLOAD_DIR, mediaType.toLowerCase(), filename);

    // Ensure directory exists
    await this.ensureDirectory(path.dirname(filePath));

    // Move file to permanent location
    await fs.rename(file.path, filePath);

    // Get file dimensions (for images/videos)
    let width, height, duration;
    if (mediaType === MediaType.IMAGE) {
      // TODO: Implement image dimension extraction
      // const dimensions = await sharp(filePath).metadata();
      // width = dimensions.width;
      // height = dimensions.height;
    }

    // Generate URL
    const url = this.generateFileUrl(mediaType, filename);

    // Save to database
    const media = await prisma.media.create({
      data: {
        userId,
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        type: mediaType,
        url,
        altText,
        caption,
        credit,
        width,
        height,
        duration,
        storageProvider: 'local',
        storageKey: filePath,
      },
    });

    return media;
  },

  /**
   * Get media by ID
   */
  async getById(mediaId: string, userId: string) {
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      include: {
        stories: {
          include: {
            story: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!media) {
      throw new Error('Media not found');
    }

    // Check ownership
    if (media.userId !== userId) {
      throw new Error('Access denied');
    }

    return media;
  },

  /**
   * Get all media with filters
   */
  async getAll(filters: GetMediaFilter) {
    const {
      userId,
      type,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: any = {};

    if (userId) where.userId = userId;
    if (type) where.type = type;
    
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { filename: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.media.count({ where });

    const media = await prisma.media.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: media,
      pagination: {
        page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Update media metadata
   */
  async update(mediaId: string, userId: string, data: {
    altText?: string;
    caption?: string;
    credit?: string;
  }) {
    // Check ownership
    const existingMedia = await prisma.media.findUnique({
      where: { id: mediaId },
      select: { userId: true },
    });

    if (!existingMedia) {
      throw new Error('Media not found');
    }

    if (existingMedia.userId !== userId) {
      throw new Error('Access denied');
    }

    const media = await prisma.media.update({
      where: { id: mediaId },
      data,
    });

    return media;
  },

  /**
   * Delete media file
   */
  async delete(mediaId: string, userId: string) {
    // Check ownership
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      include: {
        stories: true,
      },
    });

    if (!media) {
      throw new Error('Media not found');
    }

    if (media.userId !== userId) {
      throw new Error('Access denied');
    }

    // Check if media is being used in stories
    if (media.usageCount > 0 || media.stories.length > 0) {
      throw new Error('Cannot delete media that is being used in stories');
    }

    // Delete file from disk
    if (media.storageProvider === 'local' && media.storageKey) {
      try {
        await fs.unlink(media.storageKey);
      } catch (error) {
        console.error('Failed to delete file from disk:', error);
      }
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: mediaId },
    });

    return { message: 'Media deleted successfully' };
  },

  /**
   * Attach media to story
   */
  async attachToStory(storyId: string, mediaId: string, order: number = 0) {
    // Check if media exists
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new Error('Media not found');
    }

    // Create story-media relationship
    const storyMedia = await prisma.storyMedia.create({
      data: {
        storyId,
        mediaId,
        order,
      },
    });

    // Increment usage count
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        usageCount: { increment: 1 },
      },
    });

    return storyMedia;
  },

  /**
   * Detach media from story
   */
  async detachFromStory(storyId: string, mediaId: string) {
    // Delete story-media relationship
    await prisma.storyMedia.deleteMany({
      where: {
        storyId,
        mediaId,
      },
    });

    // Decrement usage count
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        usageCount: { decrement: 1 },
      },
    });

    return { message: 'Media detached successfully' };
  },

  // ============ HELPER FUNCTIONS ============

  /**
   * Determine media type from MIME type
   */
  getMediaType(mimeType: string): MediaType {
    if (ALLOWED_TYPES.IMAGE.includes(mimeType)) return MediaType.IMAGE;
    if (ALLOWED_TYPES.VIDEO.includes(mimeType)) return MediaType.VIDEO;
    if (ALLOWED_TYPES.AUDIO.includes(mimeType)) return MediaType.AUDIO;
    if (ALLOWED_TYPES.DOCUMENT.includes(mimeType)) return MediaType.DOCUMENT;
    
    throw new Error(`Unsupported file type: ${mimeType}`);
  },

  /**
   * Validate uploaded file
   */
  validateFile(file: UploadedFile, mediaType: MediaType) {
    // Check file size
    const maxSize = MAX_FILE_SIZE[mediaType];
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed (${maxSize / 1024 / 1024}MB)`);
    }

    // Check MIME type
    const allowedTypes = ALLOWED_TYPES[mediaType];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type not allowed: ${file.mimetype}`);
    }
  },

  /**
   * Generate unique filename
   */
  generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}${ext}`;
  },

  /**
   * Generate public URL for file
   */
  generateFileUrl(mediaType: MediaType, filename: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/uploads/${mediaType.toLowerCase()}/${filename}`;
  },

  /**
   * Ensure directory exists
   */
  async ensureDirectory(dirPath: string) {
    if (!existsSync(dirPath)) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  },

  /**
   * Get storage usage for user
   */
  async getStorageUsage(userId: string) {
    const result = await prisma.media.aggregate({
      where: { userId },
      _sum: { size: true },
      _count: true,
    });

    return {
      totalFiles: result._count,
      totalSize: result._sum.size || 0,
      totalSizeMB: Math.round((result._sum.size || 0) / 1024 / 1024),
    };
  },
};
