import axios from 'axios';

//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const API_BASE_URL = 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const followAuthor = async (authorId: string): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/follows/${authorId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to follow author');
  }
};

export const unfollowAuthor = async (authorId: string): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/follows/${authorId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to unfollow author');
  }
};

export const getFollowedAuthors = async (): Promise<string[]> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('⚠️ No token found in localStorage');
    return [];
  }
  
  console.log('🔑 Token from localStorage:', token.substring(0, 20) + '...');
  
  const response = await fetch(`${API_BASE_URL}/follows/following`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch followed authors');
  }

  const data = await response.json();
  return data.followedAuthors;
};
export default api;
