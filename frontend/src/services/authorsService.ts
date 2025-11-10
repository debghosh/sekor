import axios from 'axios';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
//const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api/v1';

const API_URL = 'http://localhost:3001/api/v1';

export interface Author {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  storiesCount: number;
  followersCount: number;
  isFollowing: boolean;
  createdAt: string;
}

export interface AuthorsResponse {
  data: Author[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  console.log('🔍 getAuthToken called, token:', token ? 'EXISTS' : 'NULL');
  console.log('🔍 Full token:', token);
  console.log('🔍 All localStorage keys:', Object.keys(localStorage));
  return token;
};

export const authorsService = {
  /**
   * Get all authors
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<AuthorsResponse> {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await axios.get(`${API_URL}/authors`, {
      ...config,
      params,
    });

    return response.data;
  },

  /**
   * Get a single author by ID
   */
  async getById(id: string): Promise<Author> {
    const token = getAuthToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await axios.get(`${API_URL}/authors/${id}`, config);
    return response.data;
  },

  /**
   * Follow an author
   */
  async follow(authorId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    await axios.post(
      `${API_URL}/authors/${authorId}/follow`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  /**
   * Unfollow an author
   */
  async unfollow(authorId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    await axios.delete(`${API_URL}/authors/${authorId}/follow`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Get authors that the current user is following
   */
  async getFollowing(params?: {
    page?: number;
    limit?: number;
  }): Promise<AuthorsResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_URL}/authors/following/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    return response.data;
  },
};
