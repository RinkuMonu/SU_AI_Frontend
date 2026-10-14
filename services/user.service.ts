import api from '@/lib/api';
import { User } from '@/types';

export const userService = {
  getMe: async (): Promise<User> => {
    try {
      const response = await api.get('/api/v1/users/me');
      const data = response.data?.data || response.data;
      return {
        ...data,
        id: data.id || data._id || '',
        name: data.name || data.fullName || '',
        email: data.email || '',
        role: data.role || 'user',
        accountType: data.accountType || 'user',
        onboardingCompleted: data.onboardingCompleted ?? false,
      };
    } catch (err: any) {
      // Fallback to auth/me if users/me is not supported
      const response = await api.get('/api/v1/auth/me');
      const data = response.data?.data || response.data;
      return {
        ...data,
        id: data.id || data._id || '',
        name: data.name || data.fullName || '',
        email: data.email || '',
        role: data.role || 'user',
        accountType: data.accountType || 'user',
        onboardingCompleted: data.onboardingCompleted ?? false,
      };
    }
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch('/api/v1/users/me', data);
      const updated = response.data?.data || response.data;
      
      // Keep localStorage user in sync
      if (typeof window !== 'undefined' && updated) {
        const stored = localStorage.getItem('user');
        const prev = stored ? JSON.parse(stored) : {};
        const merged = { ...prev, ...updated };
        localStorage.setItem('user', JSON.stringify(merged));
      }
      return updated;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'Failed to update user profile');
    }
  },

  uploadAvatar: async (file: File): Promise<{ image_url: string; user?: User }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/v1/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to upload avatar');
    }
  },

  updatePreferences: async (prefs: {
    preferredLanguage?: string;
    primaryGoal?: string;
    targetPlatforms?: string[];
    onboardingCompleted?: boolean;
  }) => {
    try {
      const response = await api.patch('/api/v1/users/me/preferences', prefs);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update preferences');
    }
  },
};
