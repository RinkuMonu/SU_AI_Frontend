import api from '@/lib/api';
import { User } from '@/types';

export interface UpdateUserProfilePayload {
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  business_name?: string;
  businessName?: string;
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
    let raw: any = null;
    try {
      const response = await api.get('/api/v1/users/me');
      raw = response.data?.data || response.data;
    } catch (_) {
      try {
        const authRes = await api.get('/api/v1/auth/me');
        raw = authRes.data?.data || authRes.data?.user || authRes.data;
      } catch (err: any) {
        const detail = err.response?.data?.detail;
        throw new Error(typeof detail === 'string' ? detail : err.message || 'Failed to fetch user profile');
      }
    }

    if (!raw) throw new Error('Failed to fetch user profile');

    const resolvedName =
      raw.name ||
      raw.fullName ||
      raw.full_name ||
      (raw.first_name ? `${raw.first_name} ${raw.last_name || ''}`.trim() : '') ||
      (raw.firstName ? `${raw.firstName} ${raw.lastName || ''}`.trim() : '') ||
      raw.username ||
      '';

    const parts = resolvedName ? resolvedName.split(/\s+/) : [];
    const resolvedFirst = raw.firstName || raw.first_name || parts[0] || '';
    const resolvedLast = raw.lastName || raw.last_name || parts.slice(1).join(' ') || '';
    const resolvedPhone = raw.contactNumber || raw.contact_number || raw.phone || raw.phone_number || raw.mobile || '';
    const resolvedImage = raw.image || raw.profileImageUrl || raw.profile_image_url || raw.avatar || raw.picture || '';

    return {
      ...raw,
      id: raw.id || raw._id || '',
      name: resolvedName,
      fullName: resolvedName,
      firstName: resolvedFirst,
      lastName: resolvedLast,
      email: raw.email || '',
      contactNumber: resolvedPhone,
      phone: resolvedPhone,
      image: resolvedImage || undefined,
      profileImageUrl: resolvedImage || undefined,
      role: raw.role || 'user',
      accountType: raw.accountType || raw.role || 'user',
      businessName: raw.businessName || raw.business_name || '',
      businessCategory: raw.businessCategory || raw.business_category || raw.category || '',
    };
  },

  getMe: async (): Promise<User> => {
    return userService.getProfile();
  },



  updateProfile: async (payload: UpdateUserProfilePayload): Promise<User> => {
    try {
      const response = await api.patch('/api/v1/users/me', payload);
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      if (error?.response?.status === 405 || error?.response?.status === 404) {
        try {
          const resPut = await api.put('/api/v1/users/me', payload);
          return resPut.data?.data || resPut.data;
        } catch (_) {}
      }
      const detail = error.response?.data?.detail;
      throw new Error(typeof detail === 'string' ? detail : error.message || 'Failed to update profile');
    }
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch('/api/v1/users/me', data);
      const updated = response.data?.data || response.data;
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
