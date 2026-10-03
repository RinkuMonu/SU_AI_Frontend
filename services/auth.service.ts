import api from '@/lib/api';
import { User, APIResponse } from '@/types';

export const authService = {
  login: async (email: string, password: string):Promise<{token: string, user: User}> => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      return {
        token: response.data.access_token,
        user: response.data.user
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'An error occurred during login');
    }
  },

  signup: async (name: string, email: string, password: string, role: string = 'business'):Promise<{token?: string, user?: User, detail?: string}> => {
    try {
      const response = await api.post('/api/v1/auth/signup', { name, email, password, role });
      return {
        token: response.data.access_token,
        user: response.data.user,
        detail: response.data.detail
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'An error occurred during signup');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/api/v1/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch user');
    }
  },

  verifyEmail: async (email: string, otp: string): Promise<{status: string, message: string}> => {
    try {
      const response = await api.post('/api/v1/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'Failed to verify email');
    }
  },

  resendOtp: async (email: string): Promise<{status: string, message: string}> => {
    try {
      const response = await api.post('/api/v1/auth/resend-otp', { email });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'Failed to resend OTP');
    }
  }
};

