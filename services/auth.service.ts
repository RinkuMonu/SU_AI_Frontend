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
  phone_verification_token?: string;
  requires_role_selection?: boolean;
  dashboard_route?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  countryCode?: string;
  country_code?: string;
  email?: string;
  channel?: OtpDeliveryChannel;
  mode?: 'signup' | 'login';
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
  if (error.response?.data?.message && typeof error.response.data.message === 'string') {
    return { message: error.response.data.message, code };
  }
  if (typeof error.response?.data === 'string' && error.response.data.trim() && !error.response.data.trim().startsWith('<')) {
    return { message: error.response.data.trim(), code };
  }
  if (error.response?.status === 500) {
    return {
      message: 'Server error (500): The authentication service is temporarily unavailable or the backend server is unreachable. Please verify that the backend server is running on port 8000 and try again.',
      code: 'SERVER_500'
    };
  }
  if (error.response?.status === 502 || error.response?.status === 503 || error.response?.status === 504) {
    return {
      message: 'Gateway error: Unable to reach the backend server. Please verify the backend is running.',
      code: 'GATEWAY_ERROR'
    };
  }
  if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
    return {
      message: 'Connection failed: Unable to connect to the backend server at http://127.0.0.1:8000. Please ensure the backend is running.',
      code: 'ECONNREFUSED'
    };
  }
  return { message: error.message || fallbackMessage, code };
}

export type OtpDeliveryChannel = 'sms' | 'whatsapp';

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

      const hasPhone = Boolean((rawUser.phone || rawUser.phone_number || rawUser.mobile || '').trim());
      const isOAuth = Boolean(
        rawUser.auth_provider === 'google' ||
        rawUser.provider === 'google' ||
        rawUser.auth_provider === 'facebook' ||
        rawUser.provider === 'facebook' ||
        rawUser.auth_provider === 'instagram' ||
        rawUser.provider === 'instagram' ||
        rawUser.auth_provider === 'linkedin' ||
        rawUser.provider === 'linkedin' ||
        rawUser.google_id ||
        rawUser.googleId ||
        (!hasPhone && rawUser.email)
      );

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
        phone_verified: isOAuth || !hasPhone ? true : (rawUser.phone_verified ?? true),
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
    phoneOrObj: string | { phone: string; countryCode?: string; country_code?: string; email?: string; channel?: OtpDeliveryChannel; mode?: 'signup' | 'login' },
    otpCode?: string,
    emailArg?: string
  ): Promise<AuthSuccessResponse> => {
    try {
      const rawPhone = typeof phoneOrObj === 'object' ? phoneOrObj.phone : phoneOrObj;
      const rawCc = typeof phoneOrObj === 'object' ? (phoneOrObj.countryCode || phoneOrObj.country_code) : undefined;
      const rawEmail = typeof phoneOrObj === 'object' ? phoneOrObj.email : emailArg;
      const rawChannel = typeof phoneOrObj === 'object' ? phoneOrObj.channel : undefined;
      const rawMode = typeof phoneOrObj === 'object' ? phoneOrObj.mode : undefined;
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
      if (rawChannel) {
        payload.channel = rawChannel;
      }
      if (rawMode) {
        payload.mode = rawMode;
      }

      const response = await api.post('/api/v1/auth/verify-otp', payload);
      const resData = response.data;
      const vToken = resData?.phone_verification_token || resData?.verification_token || resData?.access_token || resData?.token;

      return {
        token: resData?.access_token || resData?.token,
        user: resData?.user,
        status: resData?.status || 'success',
        message: resData?.detail || resData?.message || 'Mobile OTP verified successfully.',
        verification_token: vToken,
        phone_verification_token: vToken,
        requires_role_selection: resData?.requires_role_selection,
        dashboard_route: resData?.dashboard_route,
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'Invalid or expired OTP. Please try again.');
      const err = new Error(message) as any;
      err.code = code;
      err.status = error.response?.status;
      err.response = error.response;
      throw err;
    }
  },

  /**
   * Send Mobile OTP via SMS (Fast2SMS) or WhatsApp (MSG91)
   */
  sendOtp: async (
    phoneOrObj: string | { phone: string; countryCode?: string; country_code?: string; email?: string; channel?: OtpDeliveryChannel },
    emailArg?: string,
    channelArg?: OtpDeliveryChannel
  ): Promise<{ status: string; message: string; canonical_phone_number?: string; channel?: OtpDeliveryChannel }> => {
    try {
      const rawPhone = typeof phoneOrObj === 'object' ? phoneOrObj.phone : phoneOrObj;
      const rawCc = typeof phoneOrObj === 'object' ? (phoneOrObj.countryCode || phoneOrObj.country_code) : undefined;
      const rawEmail = typeof phoneOrObj === 'object' ? phoneOrObj.email : emailArg;
      const channel: OtpDeliveryChannel = (typeof phoneOrObj === 'object' ? phoneOrObj.channel : channelArg) || 'sms';

      const cleanPhone = (rawPhone || '').trim();
      const payload: Record<string, any> = {
        phone_number: cleanPhone,
        phone: cleanPhone,
        mobile: cleanPhone,
        channel,
        delivery_method: channel,
        medium: channel,
        provider: channel === 'whatsapp' ? 'msg91' : 'fast2sms',
      };
      if (rawCc) {
        payload.country_code = rawCc;
        payload.countryCode = rawCc;
      }
      if (rawEmail && rawEmail.trim()) {
        payload.email = rawEmail.trim().toLowerCase();
      }

      const response = await api.post('/api/v1/auth/send-otp', payload);
      const fallbackMsg = channel === 'whatsapp'
        ? 'Verification code sent to your WhatsApp via MSG91.'
        : 'Verification code sent to your mobile phone via SMS.';

      return {
        status: response.data?.status || 'success',
        message: response.data?.detail || response.data?.message || fallbackMsg,
        canonical_phone_number: response.data?.canonical_phone_number,
        channel,
      };
    } catch (error: any) {
      const defaultErr = 'Failed to send verification code. Please wait before retrying.';
      const { message, code } = parseErrorDetail(error, defaultErr);
      const err = new Error(message) as any;
      err.code = code;
      throw err;
    }
  },

  /**
   * Resend Mobile OTP (alias to sendOtp with channel support)
   */
  resendOtp: async (
    phoneOrObj: string | { phone: string; countryCode?: string; country_code?: string; email?: string; channel?: OtpDeliveryChannel },
    emailArg?: string,
    channelArg?: OtpDeliveryChannel
  ): Promise<{ status: string; message: string; canonical_phone_number?: string; channel?: OtpDeliveryChannel }> => {
    return authService.sendOtp(phoneOrObj, emailArg, channelArg);
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
    country_code,
    phone_verification_token,
    verification_token,
  }: {
    code?: string;
    access_token?: string;
    id_token?: string;
    redirect_uri?: string;
    accountType?: string;
    mode?: 'login' | 'signup';
    phone?: string;
    countryCode?: string;
    country_code?: string;
    phone_verification_token?: string;
    verification_token?: string;
  }): Promise<{
    token: string;
    user: User;
    message?: string;
    exists?: boolean;
    is_existing_user?: boolean;
    user_exists?: boolean;
    next_step?: string;
    requires_role_selection?: boolean;
  }> => {
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
      const cc = countryCode || country_code;
      if (cc) {
        payload.country_code = cc;
        payload.countryCode = cc;
      }
      const vToken = phone_verification_token || verification_token;
      if (vToken) {
        payload.phone_verification_token = vToken;
        payload.verification_token = vToken;
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

      const isExisting = Boolean(
        raw?.exists ?? 
        data?.exists ?? 
        raw?.is_existing_user ?? 
        data?.is_existing_user ?? 
        raw?.user_exists ?? 
        data?.user_exists
      );

      return {
        token,
        user: normalizedUser,
        message: raw?.message || data?.message,
        exists: isExisting,
        is_existing_user: isExisting,
        user_exists: isExisting,
        next_step: raw?.next_step ?? data?.next_step,
        requires_role_selection: raw?.requires_role_selection ?? data?.requires_role_selection,
      };
    } catch (error: any) {
      const { message, code } = parseErrorDetail(error, 'An error occurred during Google authentication');
      const err = new Error(message) as any;
      err.code = code;
      err.status = error.response?.status;
      err.response = error.response;
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
