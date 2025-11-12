import { PrismaClient, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateArticleInput {
  title: string;
  content: string;
  summary?: string;
  categoryId: string;
  authorId: string;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: string;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

export const articlesService = {
  async getAll(options: {
    page?: number;
    limit?: number;
    categoryId?: string;
    authorId?: string;
    status?: string;
    search?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      authorId,
      status,
      search,
    } = options;

    const skip = (page - 1) * limit;

    const where: any = { type: 'ARTICLE' };

    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    //if (status) where.status = status;
    if (status) {
      where.status = status.toUpperCase() as ContentStatus;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.content.count({ where }),
    ]);

    // Map to match expected Article structure
    const articles = contents.map((content: any) => ({
      id: content.id,
      title: content.title,
      summary: content.summary,
      content: (content.typeData as any)?.body || '',
      image: (content.typeData as any)?.featuredImage || null,
      status: content.status,
      views: content.views,
      categoryId: content.categoryId,
      authorId: content.authorId,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      author: {
        id: content.author.id,
        name: content.author.name,
        email: content.author.email,
        avatar: content.author.avatarUrl,
      },
      category: content.category,
    }));

    return {
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const content: any = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatarUrl: true,
          },
        },
        category: true,
      },
    });

    if (!content) {
      throw new Error('Article not found');
    }

    // Increment view count
    await prisma.content.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Map to match expected Article structure
    return {
      id: content.id,
      title: content.title,
      summary: content.summary,
      content: (content.typeData as any)?.body || '',
      image: (content.typeData as any)?.featuredImage || null,
      status: content.status,
      views: content.views,
      categoryId: content.categoryId,
      authorId: content.authorId,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      author: {
        id: content.author.id,
        name: content.author.name,
        email: content.author.email,
        bio: content.author.bio,
        avatar: content.author.avatarUrl,
      },
      category: content.category,
    };
  },

  async create(input: CreateArticleInput) {
    // Generate slug from title
    const slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const content: any = await prisma.content.create({
      data: {
        type: 'ARTICLE',
        title: input.title,
        slug,
        summary: input.summary,
        categoryId: input.categoryId,
        authorId: input.authorId,
        status: input.status || 'DRAFT',
        typeData: {
          body: input.content,
          featuredImage: input.image || null,
        },
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
      },
    });

    return {
      id: content.id,
      title: content.title,
      summary: content.summary,
      content: (content.typeData as any).body,
      image: (content.typeData as any).featuredImage,
      status: content.status,
      views: content.views,
      categoryId: content.categoryId,
      authorId: content.authorId,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      author: {
        id: content.author.id,
        name: content.author.name,
        email: content.author.email,
        avatar: content.author.avatarUrl,
      },
      category: content.category,
    };
  },

  async update(id: string, input: UpdateArticleInput, userId: string) {
    // Check if content exists and user is the author
    const existingContent = await prisma.content.findUnique({
      where: { id },
    });

    if (!existingContent) {
      throw new Error('Article not found');
    }

    if (existingContent.authorId !== userId) {
      throw new Error('Unauthorized to update this article');
    }

    const updateData: any = {};
    if (input.title) {
      updateData.title = input.title;
      // Update slug if title changes
      updateData.slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (input.summary !== undefined) updateData.summary = input.summary;
    if (input.categoryId) updateData.categoryId = input.categoryId;
    if (input.status) updateData.status = input.status;

    // Update typeData
    const currentTypeData = (existingContent.typeData as any) || {};
    const newTypeData = { ...currentTypeData };
    
    if (input.content !== undefined) newTypeData.body = input.content;
    if (input.image !== undefined) newTypeData.featuredImage = input.image;
    
    updateData.typeData = newTypeData;

    const content: any = await prisma.content.update({
      where: { id },
      data: updateData,
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
      },
    });

    return {
      id: content.id,
      title: content.title,
      summary: content.summary,
      content: (content.typeData as any).body,
      image: (content.typeData as any).featuredImage,
      status: content.status,
      views: content.views,
      categoryId: content.categoryId,
      authorId: content.authorId,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      author: {
        id: content.author.id,
        name: content.author.name,
        email: content.author.email,
        avatar: content.author.avatarUrl,
      },
      category: content.category,
    };
  },

  async delete(id: string, userId: string) {
    // Check if content exists and user is the author
    const existingContent = await prisma.content.findUnique({
      where: { id },
    });

    if (!existingContent) {
      throw new Error('Article not found');
    }

    if (existingContent.authorId !== userId) {
      throw new Error('Unauthorized to delete this article');
    }

    await prisma.content.delete({
      where: { id },
    });

    return { message: 'Article deleted successfully' };
  },

  async getByAuthor(authorId: string) {
    const contents = await prisma.content.findMany({
      where: { 
        authorId,
        type: 'ARTICLE',
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contents.map((content: any) => ({
      id: content.id,
      title: content.title,
      summary: content.summary,
      content: (content.typeData as any)?.body || '',
      image: (content.typeData as any)?.featuredImage || null,
      status: content.status,
      views: content.views,
      categoryId: content.categoryId,
      authorId: content.authorId,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      author: {
        id: content.author.id,
        name: content.author.name,
        email: content.author.email,
        avatar: content.author.avatarUrl,
      },
      category: content.category,
    }));
  },
};
