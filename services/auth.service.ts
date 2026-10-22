import api from '@/lib/api';
import { User } from '@/types';

export interface SignupRequest {
  name: string;
  phone: string;
  email: string; // Mandatory email input on signup
  password: string;
}

export interface AuthSuccessResponse {
  token?: string;
  user?: User;
  status?: string;
  message?: string;
  requiresOtp?: boolean;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
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
   * Sign in using mobile phone number and password
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
      const payload = {
        name: data.name.trim(),
        phone_number: data.phone.trim(),
        phone: data.phone.trim(),
        mobile: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        confirmPassword: data.password,
      };

      const response = await api.post('/api/v1/auth/signup', payload);
      return {
        token: response.data?.access_token,
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
      const response = await api.get('/api/v1/auth/me');
      return response.data;
    } catch (error: any) {
      const { message } = parseErrorDetail(error, 'Failed to fetch user session.');
      throw new Error(message);
    }
  },

  /**
   * Verify 6-digit Mobile OTP
   */
  verifyOtp: async (
    phoneOrObj: string | { phone: string; email?: string },
    otpCode?: string,
    emailArg?: string
  ): Promise<AuthSuccessResponse> => {
    try {
      let rawPhone = typeof phoneOrObj === 'object' ? phoneOrObj.phone : phoneOrObj;
      let rawEmail = typeof phoneOrObj === 'object' ? phoneOrObj.email : emailArg;
      let rawOtp = otpCode || '';

      const cleanPhone = (rawPhone || '').trim();
      const payload: Record<string, any> = {
        phone_number: cleanPhone,
        phone: cleanPhone,
        mobile: cleanPhone,
        otp: rawOtp.trim(),
      };
      if (rawEmail && rawEmail.trim()) {
        payload.email = rawEmail.trim().toLowerCase();
      }

      const response = await api.post('/api/v1/auth/verify-otp', payload);
      return {
        token: response.data?.access_token,
        user: response.data?.user,
        status: response.data?.status || 'success',
        message: response.data?.detail || response.data?.message || 'Mobile OTP verified successfully.',
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Invalid or expired OTP. Please try again.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * Resend / Send Mobile OTP
   */
  resendOtp: async (
    phoneOrObj: string | { phone: string; email?: string },
    emailArg?: string
  ): Promise<{ status: string; message: string }> => {
    try {
      let rawPhone = typeof phoneOrObj === 'object' ? phoneOrObj.phone : phoneOrObj;
      let rawEmail = typeof phoneOrObj === 'object' ? phoneOrObj.email : emailArg;

      const cleanPhone = (rawPhone || '').trim();
      const payload: Record<string, any> = {
        phone_number: cleanPhone,
        phone: cleanPhone,
        mobile: cleanPhone,
      };
      if (rawEmail && rawEmail.trim()) {
        payload.email = rawEmail.trim().toLowerCase();
      }

      const response = await api.post('/api/v1/auth/resend-otp', payload);
      return {
        status: 'success',
        message: response.data?.detail || response.data?.message || 'Verification code sent to your mobile phone.',
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Failed to send OTP. Please wait before retrying.');
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
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
};

