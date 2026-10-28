import api from '@/lib/api';
import { User } from '@/types';

export interface UpdateUserProfilePayload {
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  phone?: string;
  profileImageUrl?: string;
  image?: string;
  avatar?: string;
  accountType?: string;
  role?: string;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get('/api/v1/users/me');
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      throw new Error(typeof detail === 'string' ? detail : error.message || 'Failed to fetch user profile');
    }
  },

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
      try {
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
      } catch {
        return null as any;
      }
    }
  },

  updateProfile: async (payload: UpdateUserProfilePayload): Promise<User> => {
    try {
      const response = await api.patch('/api/v1/users/me', payload);
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      throw new Error(typeof detail === 'string' ? detail : error.message || 'Failed to update profile');
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

  changePassword: async (currentPassword: string, newPassword: string, confirmPassword?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/api/v1/users/me/change-password', {
        currentPassword,
        newPassword,
        confirmPassword: confirmPassword || newPassword,
      });
      return response.data;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      throw new Error(typeof detail === 'string' ? detail : error.message || 'Failed to change password');
    }
  },

  uploadAvatar: async (file: File): Promise<{ success?: boolean; image_url: string; user?: User }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/v1/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      throw new Error(typeof detail === 'string' ? detail : error.message || 'Failed to upload avatar');
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
