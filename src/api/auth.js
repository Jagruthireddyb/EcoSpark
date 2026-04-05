// Auth API — register, login, logout
import { api } from './client';

export const authAPI = {
  /**
   * Register a new user
   * POST /auth/register
   * role: "USER" | "AUTHORITY"
   */
  register: (email, password, role) =>
    api.post('/auth/register', { email, password, role }),

  /**
   * Login and receive JWT token
   * POST /auth/login
   * Stores token in localStorage automatically
   */
  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data?.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
    }
    return data;
  },

  /**
   * Logout — clears token from localStorage
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  },

  isAuthenticated: () => !!localStorage.getItem('access_token'),
};
