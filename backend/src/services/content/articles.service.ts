import { PrismaClient } from '@prisma/client';

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

    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
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
    const articles = contents.map(content => ({
      ...content,
      content: content.body, // Map body to content
      author: {
        ...content.author,
        avatar: content.author.avatarUrl,
      },
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
    const content = await prisma.content.findUnique({
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
      ...content,
      content: content.body,
      author: {
        ...content.author,
        avatar: content.author.avatarUrl,
      },
    };
  },

  async create(input: CreateArticleInput) {
    const content = await prisma.content.create({
      data: {
        title: input.title,
        body: input.content, // Map content to body
        summary: input.summary,
        categoryId: input.categoryId,
        authorId: input.authorId,
        featuredImage: input.image,
        status: input.status || 'DRAFT',
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
      ...content,
      content: content.body,
      image: content.featuredImage,
      author: {
        ...content.author,
        avatar: content.author.avatarUrl,
      },
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
    if (input.title) updateData.title = input.title;
    if (input.content) updateData.body = input.content;
    if (input.summary) updateData.summary = input.summary;
    if (input.categoryId) updateData.categoryId = input.categoryId;
    if (input.image) updateData.featuredImage = input.image;
    if (input.status) updateData.status = input.status;

    const content = await prisma.content.update({
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
      ...content,
      content: content.body,
      image: content.featuredImage,
      author: {
        ...content.author,
        avatar: content.author.avatarUrl,
      },
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
      where: { authorId },
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

    return contents.map(content => ({
      ...content,
      content: content.body,
      image: content.featuredImage,
      author: {
        ...content.author,
        avatar: content.author.avatarUrl,
      },
    }));
  },
};
