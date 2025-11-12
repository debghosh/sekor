import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

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
    per_page: number;  // Changed from 'limit'
    total: number;
    total_pages: number;  // Changed from 'totalPages'
  };
}

const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  return token;
};

export const authorsService = {
  /**
   * Get all authors
   */
  async getAll(params?: {
    page?: number;
    per_page?: number;  // Changed from 'limit'
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

    // Backend returns { data, pagination } format
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
    // Extract from { data: {...} } wrapper
    return response.data.data;
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
   * ROUTE CHANGED: /authors/following/list -> /follows
   */
  async getFollowing(params?: {
    page?: number;
    per_page?: number;  // Changed from 'limit'
  }): Promise<AuthorsResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // IMPORTANT: Route changed from /authors/following/list to /follows
    const response = await axios.get(`${API_URL}/follows`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    // Backend returns { data: [...] } format
    return response.data;
  },
};
