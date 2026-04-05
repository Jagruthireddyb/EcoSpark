// Leaderboard API
import { api } from './client';

export const leaderboardAPI = {
  /**
   * Get ranked list of users by XP
   * GET /leaderboard
   */
  get: () => api.get('/leaderboard'),
};
