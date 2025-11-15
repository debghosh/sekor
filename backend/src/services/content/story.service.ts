import { PrismaClient, ContentStatus, ContentType, Language, Copyright } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateStoryInput {
  // Basic info
  title: string;
  titleBn?: string;
  titleEn?: string;
  
  abstract: string;
  abstractBn?: string;
  abstractEn?: string;
  
  body: any; // Quill Delta JSON
  bodyBn?: any;
  bodyEn?: any;
  
  // Media
  thumbnail?: string;
  thumbnailAlt?: string;
  
  // Categorization
  categoryId: string;
  tags?: string[];
  locationIds?: string[];
  
  // Metadata
  language?: Language;
  contentType?: ContentType;
  
  // Rights
  copyright?: Copyright;
  allowComments?: boolean;
  allowSharing?: boolean;
  isPremium?: boolean;
  
  // Co-authors
  coAuthorIds?: string[];
  
  // Sources
  sources?: Array<{
    type: string;
    title: string;
    author?: string;
    url?: string;
    dateAccessed?: Date;
    notes?: string;
  }>;
}

export interface UpdateStoryInput extends Partial<CreateStoryInput> {
  status?: ContentStatus;
  scheduledFor?: Date;
  expiryDate?: Date;
}

export interface GetStoriesFilter {
  authorId?: string;
  status?: ContentStatus | ContentStatus[];
  categoryId?: string;
  language?: Language;
  contentType?: ContentType;
  search?: string;
  locationId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'reactionCount';
  sortOrder?: 'asc' | 'desc';
}

export const storyService = {
  /**
   * Create a new story (defaults to DRAFT)
   */
  async create(userId: string, data: CreateStoryInput) {
    // Generate slug from title
    const slug = this.generateSlug(data.title);
    
    // Calculate reading time and word count
    const { readingTime, wordCount } = this.calculateReadingStats(data.body);
    
    const story = await prisma.story.create({
      data: {
        ...data,
        slug,
        authorId: userId,
        status: ContentStatus.DRAFT,
        readingTime,
        wordCount,
        
        // Connect tags (create if not exist)
    tags: data.tags ? {
      create: data.tags.map(tag => ({
        tag: {
          connectOrCreate: {
            where: { name: tag },
            create: { 
              name: tag, 
              slug: tag.toLowerCase().replace(/\s+/g, '-') 
            }
          }
        }
      }))
    } : undefined,
        
        // Connect locations
        locations: data.locationIds ? {
          connect: data.locationIds.map(id => ({ id })),
        } : undefined,
        
        // Connect co-authors
        coAuthors: data.coAuthorIds ? {
          connect: data.coAuthorIds.map(id => ({ id })),
        } : undefined,
        
        // Create sources
        sources: data.sources ? {
          create: data.sources,
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        category: true,
        tags: true,
        locations: true,
        coAuthors: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
    
    return story;
  },

  /**
   * Get story by ID (with access control)
   */
  async getById(storyId: string, userId?: string) {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        },
        category: true,
        tags: true,
        locations: true,
        coAuthors: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        sources: true,
        media: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    // Check access permissions
    if (story.status !== ContentStatus.PUBLISHED) {
      // Only author, co-authors, and reviewers can see unpublished stories
      const hasAccess = 
        story.authorId === userId ||
        story.coAuthors.some(coAuthor => coAuthor.id === userId) ||
        story.reviewerId === userId;
      
      if (!hasAccess) {
        throw new Error('Access denied');
      }
    }

    return story;
  },

  /**
   * Get all stories with filters
   */
  async getAll(filters: GetStoriesFilter) {
    const {
      authorId,
      status,
      categoryId,
      language,
      contentType,
      search,
      locationId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: any = {};

    // Filters
    if (authorId) where.authorId = authorId;
    if (status) {
      where.status = Array.isArray(status) ? { in: status } : status;
    }
    if (categoryId) where.categoryId = categoryId;
    if (language) where.language = language;
    if (contentType) where.contentType = contentType;
    if (locationId) {
      where.locations = {
        some: { id: locationId },
      };
    }
    
    // Search in title, abstract, or tags
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleBn: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { abstract: { contains: search, mode: 'insensitive' } },
        { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    // Get total count
    const total = await prisma.story.count({ where });

    // Get paginated stories
    const stories = await prisma.story.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        category: true,
        tags: true,
        locations: true,
        coAuthors: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

   return {
      data: stories,
      pagination: {
        page,
        per_page: limit,                      // ✅ Correct
        total,
        total_pages: Math.ceil(total / limit), // ✅ Correct
      },
    };
  },

  /**
   * Update story
   */
 async update(storyId: string, userId: string, data: UpdateStoryInput) {
    // Check ownership
    const existingStory = await prisma.story.findUnique({
      where: { id: storyId },
      include: { coAuthors: true },
    });

    if (!existingStory) {
      throw new Error('Story not found');
    }

    const isOwner = existingStory.authorId === userId;
    const isCoAuthor = existingStory.coAuthors.some(coAuthor => coAuthor.id === userId);

    if (!isOwner && !isCoAuthor) {
      throw new Error('Access denied');
    }

    // Update slug if title changed
    let slug = existingStory.slug;
    if (data.title && data.title !== existingStory.title) {
      slug = this.generateSlug(data.title);
    }

    // Recalculate reading stats if body changed
    let readingTime = existingStory.readingTime;
    let wordCount = existingStory.wordCount;
    if (data.body) {
      const stats = this.calculateReadingStats(data.body);
      readingTime = stats.readingTime;
      wordCount = stats.wordCount;
    }

    // Destructure to exclude relation fields
    const { tags, locationIds, coAuthorIds, sources, ...updateData } = data;

    const story = await prisma.story.update({
      where: { id: storyId },
      data: {
        ...updateData,  // Spread only the basic fields
        slug,
        readingTime,
        wordCount,
        
        // Update tags through junction table
        tags: tags ? {
          deleteMany: {},  // Clear existing
          create: tags.map(tag => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: { 
                  name: tag, 
                  slug: tag.toLowerCase().replace(/\s+/g, '-') 
                }
              }
            }
          }))
        } : undefined,
        
        // Update locations
        locations: locationIds ? {
          set: locationIds.map(id => ({ id })),
        } : undefined,
        
        // Update co-authors
        coAuthors: coAuthorIds ? {
          set: coAuthorIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        locations: true,
        coAuthors: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return story;
},

  /**
   * Delete story
   */
  async delete(storyId: string, userId: string) {
    // Check ownership
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    if (story.authorId !== userId) {
      throw new Error('Only the author can delete this story');
    }

    await prisma.story.delete({
      where: { id: storyId },
    });

    return { message: 'Story deleted successfully' };
  },

  /**
   * Submit story for review
   */
  async submit(storyId: string, userId: string) {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true, status: true, coAuthors: true },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    const isOwner = story.authorId === userId;
    const isCoAuthor = story.coAuthors.some((coAuthor: any) => coAuthor.id === userId);

    if (!isOwner && !isCoAuthor) {
      throw new Error('Access denied');
    }

    if (story.status !== ContentStatus.DRAFT && story.status !== ContentStatus.CHANGES_REQUESTED) {
      throw new Error('Only drafts or stories with requested changes can be submitted');
    }

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: { status: ContentStatus.SUBMITTED },
    });

    // TODO: Notify editors about new submission

    return updatedStory;
  },

  /**
   * Publish story (creator can publish if approved)
   */
  async publish(storyId: string, userId: string) {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true, status: true },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    if (story.authorId !== userId) {
      throw new Error('Only the author can publish');
    }

    if (story.status !== ContentStatus.APPROVED) {
      throw new Error('Story must be approved before publishing');
    }

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: {
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    return updatedStory;
  },

  /**
   * Archive story
   */
  async archive(storyId: string, userId: string) {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    if (story.authorId !== userId) {
      throw new Error('Only the author can archive');
    }

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: { status: ContentStatus.ARCHIVED },
    });

    return updatedStory;
  },

  /**
   * Increment view count
   */
  async incrementView(storyId: string) {
    await prisma.story.update({
      where: { id: storyId },
      data: {
        viewCount: { increment: 1 },
      },
    });
  },

  // ============ HELPER FUNCTIONS ============

  /**
   * Generate URL-friendly slug from title
   */
  generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')      // Replace spaces with -
      .replace(/-+/g, '-')       // Replace multiple - with single -
      .trim();
    
    // Add random suffix to ensure uniqueness
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${base}-${suffix}`;
  },

  /**
   * Calculate reading time and word count from Quill Delta
   */
  calculateReadingStats(body: any): { readingTime: number; wordCount: number } {
    let text = '';
    
    // Extract text from Quill Delta format
    if (body && body.ops && Array.isArray(body.ops)) {
      text = body.ops
        .map((op: any) => (typeof op.insert === 'string' ? op.insert : ''))
        .join('');
    }
    
    // Count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    
    return { readingTime, wordCount };
  },
};
