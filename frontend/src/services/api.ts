import apiClient from '../lib/apiClient';

// Re-export the configured apiClient as 'api' for backwards compatibility
export const api = apiClient;

// Follow/unfollow functions using apiClient (cookies automatic)
export const followAuthor = async (authorId: string): Promise<void> => {
  console.log("api.ts → followAuthor arg:", authorId, typeof authorId);
  
  if (!authorId) {
    throw new Error("api.ts: missing authorId");
  }

  const response = await apiClient.post(`/follows/${authorId}`);
  return response.data;
};

export const unfollowAuthor = async (authorId: string): Promise<void> => {
  if (!authorId) {
    throw new Error("api.ts: missing authorId");
  }

  const response = await apiClient.delete(`/follows/${authorId}`);
  return response.data;
};

// Get followed authors
export const getFollowedAuthors = async (): Promise<string[]> => {
  console.log('🔑 Fetching followed authors');

  const response = await apiClient.get('/follows');

  // Backend returns { data: [...] } format
  // Extract author IDs from the author objects
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data.map((author: any) => author.id);
  }

  return [];
};

export default api;
