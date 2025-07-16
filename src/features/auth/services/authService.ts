import { api } from '@/shared/services/api';
import { User, LoginCredentials } from '../types/auth';
import { setAuthToken, removeAuthToken } from '@/shared/utils/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<{ user: User; token: string }>('/api/auth/login', credentials);

    // Store token
    setAuthToken(response.token);

    return response.user;
  },

  async logout(): Promise<void> {
    removeAuthToken();
    // Optionally call logout endpoint
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout endpoint failed:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await api.get<User>('/api/auth/me');
    } catch (error) {
      removeAuthToken();
      return null;
    }
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/update-password', {
      currentPassword,
      newPassword,
    });
  },
};
