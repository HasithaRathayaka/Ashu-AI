import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Configure dynamic authorization token for requests
 * @param {string} token - Clerk session token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// AI Tool Service Methods
export const generateArticleApi = async (data) => {
  const response = await api.post('/ai/article', data);
  return response.data;
};

export const generateBlogTitlesApi = async (data) => {
  const response = await api.post('/ai/titles', data);
  return response.data;
};

export const generateImageApi = async (data) => {
  const response = await api.post('/ai/image', data);
  return response.data;
};

export const removeBackgroundApi = async (formData) => {
  const response = await api.post('/ai/remove-bg', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const removeObjectApi = async (formData) => {
  const response = await api.post('/ai/remove-object', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const reviewResumeApi = async (formDataOrData) => {
  const isFormData = formDataOrData instanceof FormData;
  const response = await api.post('/ai/review-resume', formDataOrData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
  });
  return response.data;
};

// User History & Community Feed Methods
export const getUserCreationsApi = async (userId) => {
  const response = await api.get('/user/creations', { params: { userId } });
  return response.data;
};

export const getCommunityCreationsApi = async () => {
  const response = await api.get('/user/community');
  return response.data;
};

export const toggleLikeCreationApi = async (id, userId) => {
  const response = await api.post(`/user/like/${id}`, { userId });
  return response.data;
};

export default api;
