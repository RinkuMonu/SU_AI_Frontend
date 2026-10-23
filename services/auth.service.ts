import api from '@/lib/api';
import { User } from '@/types';
import { OnboardingService } from '@/services/onboarding.service';

export interface SignupRequest {
  name: string;
  phone?: string;
  countryCode?: string;
  country_code?: string;
  email: string; // Mandatory email input on signup
  password: string;
  confirmPassword?: string;
  verification_token?: string;
  [key: string]: any;
}

export interface AuthSuccessResponse {
  token?: string;
  user?: User;
  status?: string;
  message?: string;
  requiresOtp?: boolean;
  verification_token?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  countryCode?: string;
  country_code?: string;
  email?: string;
}

function parseErrorDetail(error: any, fallbackMessage: string): { message: string; code?: string } {
  const code = error.response?.data?.code;
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') return { message: detail, code };
    if (Array.isArray(detail)) {
      return { message: detail.map((d: any) => d.msg || JSON.stringify(d)).join(', '), code };
    }
    return { message: JSON.stringify(detail), code };
  }
  if (error.response?.data?.message) {
    return { message: error.response.data.message, code };
  }
  return { message: error.message || fallbackMessage, code };
}

export const authService = {
  /**
   * Sign in using mobile phone number or email and password
   */
  login: async (phoneOrIdentifier: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const cleanId = phoneOrIdentifier.trim();
      const isEmail = cleanId.includes('@');

      const payload: Record<string, any> = {
        password,
      };

      if (isEmail) {
        payload.email = cleanId.toLowerCase();
        payload.username = cleanId.toLowerCase();
      } else {
        payload.phone_number = cleanId;
        payload.phone = cleanId;
        payload.mobile = cleanId;
      }

      const response = await api.post('/api/v1/auth/login', payload);
      return {
        token: response.data.access_token,
        user: response.data.user,
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Invalid mobile number or password.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * User registration with required email, mobile number, name, and password
   * (No email verification flow)
   */
  signup: async (data: SignupRequest): Promise<{ token?: string; user?: User; message?: string; detail?: string }> => {
    try {
      const phoneStr = data.phone?.trim() || "";
      const cc = data.countryCode || data.country_code || (phoneStr.startsWith("+") ? undefined : "+91");
      const payload: Record<string, any> = {
        ...data,
        name: data.name?.trim() || "",
        phone_number: phoneStr,
        phone: phoneStr,
        mobile: phoneStr,
        country_code: cc,
        email: data.email?.trim().toLowerCase() || "",
        password: data.password,
        confirmPassword: data.confirmPassword || data.password,
      };
      if (data.verification_token) {
        payload.verification_token = data.verification_token;
      }

      const response = await api.post('/api/v1/auth/signup', payload);
      return {
        token: response.data?.access_token || response.data?.token,
        user: response.data?.user,
        message: response.data?.detail || response.data?.message || 'Account created successfully.',
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Unable to create account. Please check your details.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * Fetch current authenticated session
   */
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
      const { message } = parseErrorDetail(error, 'Failed to fetch user session.');
      throw new Error(message);
    }
  },

  /**
   * Verify 6-digit Mobile OTP
   */
  verifyOtp: async (
    phoneOrObj: string | { phone: string; countryCode?: string; country_code?: string; email?: string },
    otpCode?: string,
    emailArg?: string
  ): Promise<AuthSuccessResponse> => {
    try {
      const rawPhone = typeof phoneOrObj === 'object' ? phoneOrObj.phone : phoneOrObj;
      const rawCc = typeof phoneOrObj === 'object' ? (phoneOrObj.countryCode || phoneOrObj.country_code) : undefined;
      const rawEmail = typeof phoneOrObj === 'object' ? phoneOrObj.email : emailArg;
      const rawOtp = otpCode || '';

      const cleanPhone = (rawPhone || '').trim();
      const payload: Record<string, any> = {
        phone_number: cleanPhone,
        phone: cleanPhone,
        mobile: cleanPhone,
        otp: rawOtp.trim(),
      };
      if (rawCc) {
        payload.country_code = rawCc;
        payload.countryCode = rawCc;
      }
      if (rawEmail && rawEmail.trim()) {
        payload.email = rawEmail.trim().toLowerCase();
      }

      const response = await api.post('/api/v1/auth/verify-otp', payload);
      return {
        token: response.data?.access_token || response.data?.token,
        user: response.data?.user,
        status: response.data?.status || 'success',
        message: response.data?.detail || response.data?.message || 'Mobile OTP verified successfully.',
        verification_token: response.data?.verification_token || response.data?.token,
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Invalid or expired OTP. Please try again.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * Send Mobile OTP
   */
  sendOtp: async (
    phoneOrObj: string | { phone: string; countryCode?: string; country_code?: string; email?: string },
    emailArg?: string
  ): Promise<{ status: string; message: string; canonical_phone_number?: string }> => {
    try {
      const rawPhone = typeof phoneOrObj === 'object' ? phoneOrObj.phone : phoneOrObj;
      const rawCc = typeof phoneOrObj === 'object' ? (phoneOrObj.countryCode || phoneOrObj.country_code) : undefined;
      const rawEmail = typeof phoneOrObj === 'object' ? phoneOrObj.email : emailArg;

      const cleanPhone = (rawPhone || '').trim();
      const payload: Record<string, any> = {
        phone_number: cleanPhone,
        phone: cleanPhone,
        mobile: cleanPhone,
      };
      if (rawCc) {
        payload.country_code = rawCc;
        payload.countryCode = rawCc;
      }
      if (rawEmail && rawEmail.trim()) {
        payload.email = rawEmail.trim().toLowerCase();
      }

      const response = await api.post('/api/v1/auth/send-otp', payload);
      return {
        status: response.data?.status || 'success',
        message: response.data?.detail || response.data?.message || 'Verification code sent to your mobile phone.',
        canonical_phone_number: response.data?.canonical_phone_number,
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Failed to send OTP. Please wait before retrying.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * Resend Mobile OTP (alias to sendOtp for semantic clarity)
   */
  resendOtp: async (
    phoneOrObj: string | { phone: string; countryCode?: string; country_code?: string; email?: string },
    emailArg?: string
  ): Promise<{ status: string; message: string }> => {
    return authService.sendOtp(phoneOrObj, emailArg);
  },

  /**
   * Persist user's selected role on post-signup onboarding
   * Supported backend roles: 'businessman' | 'influencer'
   */
  selectRole: async (role: 'businessman' | 'influencer' | string): Promise<User> => {
    try {
      const response = await api.post('/api/v1/auth/select-role', { role });
      const user = response.data?.user || response.data;
      return user;
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Failed to save role. Please try again.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * Retrieve authoritative dashboard route mapping from backend
   */
  getDashboardRoute: async (): Promise<{ role?: string; dashboard_route: string; dashboard_name: string }> => {
    try {
      const response = await api.get('/api/v1/auth/dashboard-route');
      return response.data;
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Failed to determine dashboard route.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * Google OAuth login and registration
   */
  googleLogin: async ({
    code,
    access_token,
    id_token,
    redirect_uri,
    accountType = 'business',
    mode = 'login',
    phone,
    countryCode,
  }: {
    code?: string;
    access_token?: string;
    id_token?: string;
    redirect_uri?: string;
    accountType?: string;
    mode?: 'login' | 'signup';
    phone?: string;
    countryCode?: string;
  }): Promise<{ token: string; user: User; message?: string }> => {
    try {
      const endpoint = mode === 'signup' ? '/api/v1/auth/google/signup' : '/api/v1/auth/google/login';
      const cleanPhone = (phone || '').trim();
      const payload: Record<string, any> = {
        code: code || undefined,
        access_token: access_token || undefined,
        id_token: id_token || undefined,
        redirect_uri: redirect_uri || undefined,
        redirectUri: redirect_uri || undefined,
        accountType: accountType || 'business',
        mode: mode || 'login',
      };
      if (cleanPhone) {
        payload.phone_number = cleanPhone;
        payload.phone = cleanPhone;
        payload.mobile = cleanPhone;
      }
      if (countryCode) {
        payload.country_code = countryCode;
        payload.countryCode = countryCode;
      }

      const response = await api.post(endpoint, payload);
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
        name: user.name || user.fullName || (user.email ? user.email.split('@')[0] : 'User'),
        fullName: user.fullName || user.name || (user.email ? user.email.split('@')[0] : 'User'),
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'User'),
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        accountType: user.accountType || accountType || 'business',
        email_verified: user.email_verified ?? user.emailVerified ?? true,
        phone_verified: user.phone_verified ?? false,
        phone_number: user.phone_number || user.phone || cleanPhone || undefined,
        phone: user.phone || user.phone_number || cleanPhone || undefined,
        onboardingCompleted: Boolean(user.onboardingCompleted || user.onboarding_completed),
        onboarding_step: user.onboarding_step ?? 1,
      };

      return {
        token,
        user: normalizedUser,
        message: raw?.message || data?.message,
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'An error occurred during Google authentication');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  facebookLogin: async ({
    access_token,
    code,
    accountType = 'user',
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
        accountType: accountType || 'user',
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

  linkedinLogin: async ({
    access_token,
    code,
    redirect_uri,
    accountType = 'business',
    mode = 'login',
  }: {
    access_token?: string;
    code?: string;
    redirect_uri?: string;
    accountType?: string;
    mode?: 'login' | 'signup';
  }): Promise<{ token: string; user: User }> => {
    try {
      const endpoint = mode === 'signup' ? '/api/v1/auth/linkedin/signup' : '/api/v1/auth/linkedin/login';
      const response = await api.post(endpoint, {
        access_token: access_token || undefined,
        code: code || undefined,
        redirect_uri: redirect_uri || undefined,
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
        name: user.name || user.fullName || (user.email ? user.email.split('@')[0] : 'LinkedIn User'),
        fullName: user.fullName || user.name || (user.email ? user.email.split('@')[0] : 'LinkedIn User'),
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'LinkedIn'),
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        accountType: user.accountType || accountType || 'business',
        email_verified: user.email_verified ?? user.emailVerified ?? true,
        onboardingCompleted: Boolean(user.onboardingCompleted || user.onboarding_completed),
        onboarding_step: user.onboarding_step ?? 1,
        linkedin_author_id: user.linkedin_author_id || data?.linkedin_author_id || raw?.linkedin_author_id || user.linkedinId || '',
        linkedin_access_token: user.linkedin_access_token || data?.linkedin_access_token || raw?.linkedin_access_token || '',
        linkedin_connected: user.linkedin_connected ?? data?.linkedin_connected ?? raw?.linkedin_connected ?? true,
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
      throw new Error(error.message || 'An error occurred during LinkedIn login');
    }
  },
};
