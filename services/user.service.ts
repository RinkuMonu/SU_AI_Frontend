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

  uploadAvatar: async (file: File): Promise<{ success: boolean; image_url: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/v1/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      throw new Error(typeof detail === 'string' ? detail : error.message || 'Failed to upload avatar');
    }
  },
};
