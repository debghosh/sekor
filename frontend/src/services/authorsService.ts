import { api } from './api';

export interface Author {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  storiesCount?: number;
  followersCount?: number;
  isFollowing: boolean;
  createdAt: string;
}

export interface AuthorsResponse {
  data: Author[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export const authorsService = {
  /**
   * Get all authors
   */
  async getAll(params?: {
    page?: number;
    per_page?: number;
    role?: string;
  }): Promise<AuthorsResponse> {
    const response = await api.get('/authors', { params });
    // Backend returns { data, pagination } format
    return response.data;
  },

  /**
   * Get a single author by ID
   */
  async getById(id: string): Promise<Author> {
    const response = await api.get(`/authors/${id}`);
    // Extract from { data: {...} } wrapper
    return response.data.data;
  },

  /**
   * Follow an author
   */
  async follow(authorId: string): Promise<void> {
    await api.post(`/authors/${authorId}/follow`);
  },

  /**
   * Unfollow an author
   */
  async unfollow(authorId: string): Promise<void> {
    await api.delete(`/authors/${authorId}/follow`);
  },

  /**
   * Get authors that the current user is following
   */
  async getFollowing(params?: {
    page?: number;
    per_page?: number;
  }): Promise<AuthorsResponse> {
    const response = await api.get('/follows', { params });
    // Backend returns { data, pagination } format
    return response.data;
  },
};
