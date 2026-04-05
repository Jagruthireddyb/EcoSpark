// Issues API — create, list, get, resolve, upload image
import { api } from './client';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const issuesAPI = {
  /**
   * Create a new issue
   * POST /issues
   */
  create: (title, description, category, latitude, longitude) =>
    api.post('/issues', { title, description, category, latitude, longitude }),

  /**
   * Get all issues (optionally filter by status or category)
   * GET /issues
   */
  list: () => api.get('/issues'),

  /**
   * Get a single issue by ID
   * GET /issues/:id
   */
  get: (id) => api.get(`/issues/${id}`),

  /**
   * Resolve an issue — AUTHORITY only
   * POST /issues/:id/resolve
   */
  resolve: (id) => api.post(`/issues/${id}/resolve`, { status: 'RESOLVED' }),

  /**
   * Upload an image for an issue
   * POST /issues/:id/image  (multipart/form-data)
   */
  uploadImage: async (issueId, file) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/issues/${issueId}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Image upload failed');
    return data;
  },
};
