import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) => api.post('/auth/register', { email, password, name }),
  getMe: () => api.get('/auth/me'),
};

// Board Members API
export const boardAPI = {
  getAll: () => api.get('/board-members'),
  create: (data) => api.post('/board-members', data),
  update: (id, data) => api.put(`/board-members/${id}`, data),
  delete: (id) => api.delete(`/board-members/${id}`),
};

// Events API
export const eventsAPI = {
  getPast: () => api.get('/events/past'),
  getUpcoming: () => api.get('/events/upcoming'),
  createPast: (data) => api.post('/events/past', data),
  createUpcoming: (data) => api.post('/events/upcoming', data),
  updatePast: (id, data) => api.put(`/events/past/${id}`, data),
  updateUpcoming: (id, data) => api.put(`/events/upcoming/${id}`, data),
  deletePast: (id) => api.delete(`/events/past/${id}`),
  deleteUpcoming: (id) => api.delete(`/events/upcoming/${id}`),
};

// News API
export const newsAPI = {
  getAll: () => api.get('/news'),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  create: (data) => api.post('/gallery', data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact/submit', data),
};

export default api;