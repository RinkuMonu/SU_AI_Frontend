import api from '@/lib/api';
import { User, APIResponse } from '@/types';
import { OnboardingService } from '@/services/onboarding.service';

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      const raw = response.data;
      const data = raw?.data || raw;
      const user = data?.user || raw?.user || {};
      const token = data?.accessToken || data?.access_token || data?.token || raw?.accessToken || raw?.access_token || raw?.token || '';
      
      const normalizedUser: User = {
        ...user,
        id: user.id || user._id || '',
        name: user.name || user.fullName || email.split('@')[0],
        fullName: user.fullName || user.name || email.split('@')[0],
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: user.lastName || '',
        email: user.email || email,
        role: user.role || 'user',
        accountType: user.accountType || 'user',
        email_verified: user.email_verified ?? user.emailVerified ?? true,
        onboardingCompleted: user.onboardingCompleted ?? false,
        onboarding_step: user.onboarding_step ?? 1,
      };

      return {
        token,
        user: normalizedUser
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'An error occurred during login');
    }
  },

  signup: async (data: any): Promise<{ token?: string; user?: User; detail?: string }> => {
    try {
      const response = await api.post('/api/v1/auth/signup', data);
      const resData = response.data?.data || response.data;
      const token = resData?.access_token || resData?.token || resData?.accessToken || response.data?.access_token || response.data?.token || response.data?.accessToken;
      const user = resData?.user || response.data?.user;
      return {
        token,
        user,
        detail: response.data?.detail || response.data?.message
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
      const authRes = await api.get('/api/v1/auth/me');
      const rawUser = authRes.data?.data || authRes.data?.user || authRes.data || {};

      let onboardingDone = Boolean(rawUser.onboardingCompleted || rawUser.onboarding_completed);

      // Verify onboarding status using /api/v1/onboarding/status as instructed
      try {
        const isDone = await OnboardingService.isCompleted();
        if (isDone) {
          onboardingDone = true;
        }
      } catch (_) {}

      const profileImg = rawUser.image || rawUser.profileImageUrl || rawUser.avatar || rawUser.picture || rawUser.photoURL || rawUser.profile_image_url || null;

      return {
        ...rawUser,
        id: rawUser.id || rawUser._id || '',
        name: rawUser.name || rawUser.fullName || '',
        fullName: rawUser.fullName || rawUser.name || '',
        email: rawUser.email || '',
        role: rawUser.role || 'user',
        accountType: rawUser.accountType || 'user',
        image: profileImg || undefined,
        profileImageUrl: profileImg || undefined,
        email_verified: rawUser.email_verified ?? rawUser.emailVerified ?? true,
        onboardingCompleted: onboardingDone,
        onboarding_step: rawUser.onboarding_step ?? 1,
      };
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
  },

  facebookLogin: async ({
    access_token,
    code,
    accountType = 'business',
    mode = 'login',
  }: {
    access_token?: string;
    code?: string;
    accountType?: string;
    mode?: 'login' | 'signup';
  }): Promise<{ token: string; user: User }> => {
    try {
      const endpoint = mode === 'signup' ? '/api/v1/auth/facebook/signup' : '/api/v1/auth/facebook/login';
      const response = await api.post(endpoint, {
        access_token: access_token || undefined,
        code: code || undefined,
        accountType: accountType || 'business',
        mode: mode || 'login',
      });
      const raw = response.data;
      const data = raw?.data || raw;
      const user = data?.user || raw?.user || {};
      const token =
        data?.accessToken ||
        data?.access_token ||
        data?.token ||
        raw?.accessToken ||
        raw?.access_token ||
        raw?.token ||
        '';

      const normalizedUser: User = {
        ...user,
        id: user.id || user._id || '',
        name: user.name || user.fullName || (user.email ? user.email.split('@')[0] : 'Facebook User'),
        fullName: user.fullName || user.name || (user.email ? user.email.split('@')[0] : 'Facebook User'),
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'Facebook'),
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        accountType: user.accountType || accountType || 'business',
        email_verified: user.email_verified ?? user.emailVerified ?? true,
        onboardingCompleted: Boolean(user.onboardingCompleted || user.onboarding_completed),
        onboarding_step: user.onboarding_step ?? 1,
      };

      return {
        token,
        user: normalizedUser,
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'An error occurred during Facebook login');
    }
  },

  instagramLogin: async ({
    access_token,
    code,
    accountType = 'business',
    mode = 'login',
  }: {
    access_token?: string;
    code?: string;
    accountType?: string;
    mode?: 'login' | 'signup';
  }): Promise<{ token: string; user: User }> => {
    try {
      const endpoint = mode === 'signup' ? '/api/v1/auth/instagram/signup' : '/api/v1/auth/instagram/login';
      const response = await api.post(endpoint, {
        access_token: access_token || undefined,
        code: code || undefined,
        accountType: accountType || 'business',
        mode: mode || 'login',
      });
      const raw = response.data;
      const data = raw?.data || raw;
      const user = data?.user || raw?.user || {};
      const token =
        data?.accessToken ||
        data?.access_token ||
        data?.token ||
        raw?.accessToken ||
        raw?.access_token ||
        raw?.token ||
        '';

      const normalizedUser: User = {
        ...user,
        id: user.id || user._id || '',
        name: user.name || user.fullName || (user.email ? user.email.split('@')[0] : 'Instagram User'),
        fullName: user.fullName || user.name || (user.email ? user.email.split('@')[0] : 'Instagram User'),
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'Instagram'),
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        accountType: user.accountType || accountType || 'business',
        email_verified: user.email_verified ?? user.emailVerified ?? true,
        onboardingCompleted: Boolean(user.onboardingCompleted || user.onboarding_completed),
        onboarding_step: user.onboarding_step ?? 1,
      };

      return {
        token,
        user: normalizedUser,
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'An error occurred during Instagram login');
    }
  },
};

