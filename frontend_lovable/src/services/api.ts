import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (username: string, email: string, password: string) =>
    api.post('/auth/signup', { username, email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  verifyToken: (token: string) =>
    api.post('/auth/verify-token', { token }),
};

// Articles endpoints
export const articlesAPI = {
  getAll: (skip = 0, limit = 20, sortBy = 'newest') =>
    api.get('/articles', { params: { skip, limit, sort_by: sortBy } }),

  getById: (id: number) =>
    api.get(`/articles/${id}`),

  create: (title: string, content: string, url: string, sourceName: string) =>
    api.post('/articles', { title, content, url, source_name: sourceName }),

  rate: (articleId: number, rating: number) =>
    api.post(`/articles/${articleId}/rate`, { rating_value: rating }),

  comment: (articleId: number, reason: string, explanation?: string) =>
    api.post(`/articles/${articleId}/comment`, { reason, explanation }),

  getComments: (articleId: number, skip = 0, limit = 20) =>
    api.get(`/articles/${articleId}/comments`, { params: { skip, limit } }),

  getRatingsBreakdown: (articleId: number) =>
    api.get(`/articles/${articleId}/ratings-breakdown`),

  report: (articleId: number, reason: string, explanation?: string) =>
    api.post(`/articles/${articleId}/report`, { reason, explanation }),
};

// Users endpoints
export const usersAPI = {
  getProfile: () =>
    api.get('/users/profile'),

  getUserById: (userId: number) =>
    api.get(`/users/${userId}`),

  getCredibilityProfile: (userId: number) =>
    api.get(`/users/${userId}/credibility-profile`),

  getUserRatings: (userId: number, skip = 0, limit = 20) =>
    api.get(`/users/${userId}/ratings`, { params: { skip, limit } }),

  recomputeCredibility: () =>
    api.post('/users/recompute-credibility'),

  getLeaderboard: (limit = 20) =>
    api.get('/users', { params: { limit } }),
};

// Source endpoints
export const sourcesAPI = {
  getAll: (skip = 0, limit = 20) =>
    api.get('/sources', { params: { skip, limit } }),

  getById: (id: number) =>
    api.get(`/sources/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard'),

  getFlaggedArticles: (skip = 0, limit = 20) =>
    api.get('/admin/flagged-articles', { params: { skip, limit } }),

  overrideScore: (articleId: number, newScore: number, justification: string) =>
    api.post(`/admin/${articleId}/override-score`, { new_score: newScore, justification }),

  softLock: (articleId: number, reason: string) =>
    api.post(`/admin/${articleId}/soft-lock`, { reason }),

  removeSoftLock: (articleId: number) =>
    api.post(`/admin/${articleId}/remove-soft-lock`),

  flagUser: (userId: number, reason: string) =>
    api.post(`/admin/user/${userId}/flag`, { reason }),

  unflagUser: (userId: number) =>
    api.post(`/admin/user/${userId}/unflag`),

  getPendingReports: (skip = 0, limit = 20) =>
    api.get('/admin/pending-reports', { params: { skip, limit } }),
};

// RSS endpoints
export const rssAPI = {
  getFeed: () => api.get('/rss/'),
};

// Comments endpoints
export const commentsAPI = {
  vote: (commentId: number, voteType: 'up' | 'down') =>
    api.post(`/comments/${commentId}/vote`, { vote_type: voteType }),
};

export default api;
