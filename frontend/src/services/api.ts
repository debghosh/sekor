import axios from 'axios';

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

// Handle response errors with new error format
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
    
    // New error format: { error: { code, message, details, request_id } }
    if (error.response?.data?.error) {
      const { code, message, details, request_id } = error.response.data.error;
      console.error(`[${request_id}] ${code}: ${message}`, details);
      // Attach formatted error for easier handling
      error.formattedError = { code, message, details, request_id };
    }
    
    return Promise.reject(error);
  }
);

// Updated follow/unfollow functions with new response format
export const followAuthor = async (authorId: string): Promise<void> => {

  console.log("api.ts → followAuthor arg:", authorId, typeof authorId);
  if (!authorId) throw new Error("api.ts: missing authorId");
  
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  if (!authorId) {
    throw new Error (authorId || " is not correct")
  }
  
  const response = await fetch(`${API_BASE_URL}/follows/${authorId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to follow author');
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
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to unfollow author');
  }
};

// Updated getFollowedAuthors with new endpoint and response format
export const getFollowedAuthors = async (): Promise<string[]> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('⚠️ No token found in localStorage');
    return [];
  }
  
  console.log('🔑 Fetching followed authors with token');
  
  // IMPORTANT: Endpoint changed from /follows/following to /follows
  const response = await fetch(`${API_BASE_URL}/follows`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch followed authors');
  }

  const responseData = await response.json();
  
  // Backend now returns { data: [...] } format
  // Extract author IDs from the author objects
  if (responseData.data && Array.isArray(responseData.data)) {
    return responseData.data.map((author: any) => author.id);
  }
  
  return [];
};

export default api;
