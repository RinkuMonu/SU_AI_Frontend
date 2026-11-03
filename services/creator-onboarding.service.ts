import api from '@/lib/api';
import { CreatorOnboardingData, INITIAL_ONBOARDING_DATA } from '@/components/influencer-onboarding/types';

const BASE_STORAGE_KEY = 'dhandagrow_creator_onboarding_draft';

const getStorageKey = (userId?: string): string => {
  if (userId && typeof userId === 'string' && userId.trim()) {
    return `${BASE_STORAGE_KEY}_${userId.trim()}`;
  }
  return BASE_STORAGE_KEY;
};

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    return null;
  }
  return token.replace(/^Bearer\s+/i, '').trim();
};

export interface InfluencerOnboardingStatusResult {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  targetRoute: string;
}

export const creatorOnboardingService = {
  getLocalDraft(userId?: string): Partial<CreatorOnboardingData> | null {
    if (typeof window === 'undefined') return null;
    try {
      // First try user-scoped key
      const key = getStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);

      // Fallback only if no userId provided
      if (!userId) {
        const base = localStorage.getItem(BASE_STORAGE_KEY);
        return base ? JSON.parse(base) : null;
      }
      return null;
    } catch {
      return null;
    }
  },

  saveLocalDraft(data: Partial<CreatorOnboardingData>, userId?: string) {
    if (typeof window === 'undefined') return;
    try {
      const key = getStorageKey(userId);
      const current = this.getLocalDraft(userId) || {};
      const merged = { ...current, ...data };
      localStorage.setItem(key, JSON.stringify(merged));
    } catch (e) {
      console.warn('Failed to save creator draft to localStorage:', e);
    }
  },

  clearLocalDraft(userId?: string) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(BASE_STORAGE_KEY);
      if (userId) {
        localStorage.removeItem(getStorageKey(userId));
      }
      localStorage.removeItem('creator_onboarding_completed');
    } catch {}
  },

  /**
   * Fetch authoritative creator onboarding status directly from the backend.
   * Returns whether onboarding is completed, current saved step, and target route.
   */
  async getInfluencerOnboardingStatus(): Promise<InfluencerOnboardingStatusResult> {
    const token = getAuthToken();
    if (!token) {
      return {
        status: 'NOT_STARTED',
        currentStep: 1,
        completedSteps: [],
        isCompleted: false,
        targetRoute: '/onboarding/influencer',
      };
    }

    try {
      const res = await api.get('/api/v1/influencer/onboarding', {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      const data = res?.data;
      if (res && res.status === 200 && data && (data.success || data.onboarding_status)) {
        const rawStatus = String(data.onboarding_status || 'NOT_STARTED').toUpperCase();
        const currentStep = Math.min(Math.max(Number(data.current_step) || 1, 1), 7);
        const completedSteps = Array.isArray(data.completed_steps) ? data.completed_steps : [];
        const isCompleted = rawStatus === 'COMPLETED';

        return {
          status: rawStatus as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
          currentStep: isCompleted ? 7 : (rawStatus === 'NOT_STARTED' ? 1 : Math.min(currentStep, 6)),
          completedSteps,
          isCompleted,
          targetRoute: isCompleted ? '/influencer' : '/onboarding/influencer',
        };
      }
    } catch (_) {
      // Silently fall back without throwing
    }

    // Default safe fallback: incomplete, route to screen 1 of onboarding (never silently grant dashboard)
    return {
      status: 'NOT_STARTED',
      currentStep: 1,
      completedSteps: [],
      isCompleted: false,
      targetRoute: '/onboarding/influencer',
    };
  },

  /**
   * Load authoritative onboarding data from backend and restore into UI form state.
   */
  async loadOnboardingData(user?: any): Promise<CreatorOnboardingData> {
    const userId = user?.id || user?._id || user?.userId;
    const token = getAuthToken();
    let backendState: any = null;

    if (token) {
      try {
        const res = await api.get('/api/v1/influencer/onboarding', {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        });
        if (res && res.status === 200 && res.data && (res.data.success || res.data.onboarding_status)) {
          backendState = res.data;
        }
      } catch (_) {
        // Silently fall back
      }
    }

    const rawStatus = String(backendState?.onboarding_status || 'NOT_STARTED').toUpperCase();
    const isCompleted = rawStatus === 'COMPLETED';

    // CASE 1: Brand new influencer (NOT_STARTED or no prior record in DB)
    if (rawStatus === 'NOT_STARTED' || !backendState) {
      // Purge any stale draft from deleted MongoDB user or previous session
      this.clearLocalDraft(userId);

      const resolvedFullName = user?.name || user?.fullName || '';
      const resolvedUsername = user?.username || (user?.email ? user.email.split('@')[0] : '');
      const resolvedImage = user?.profileImageUrl || user?.image || '';

      return {
        ...INITIAL_ONBOARDING_DATA,
        step: 1,
        fullName: resolvedFullName,
        username: resolvedUsername,
        profileImage: resolvedImage,
        isCompleted: false,
      };
    }

    // CASE 2: Completed influencer (already finalized in MongoDB)
    if (isCompleted) {
      return {
        ...INITIAL_ONBOARDING_DATA,
        step: 7,
        isCompleted: true,
      };
    }

    // CASE 3: IN_PROGRESS influencer (restore saved steps and form fields from MongoDB)
    const local = this.getLocalDraft(userId);
    const profile = backendState?.profile || {};
    const niches = backendState?.niches || {};
    const socials = backendState?.social_accounts || {};
    const goals = backendState?.goals || [];

    const resolvedFullName = profile.full_name || local?.fullName || user?.name || user?.fullName || '';
    const resolvedUsername = profile.username || local?.username || user?.username || (user?.email ? user.email.split('@')[0] : '');
    const resolvedImage = profile.profile_image || local?.profileImage || user?.profileImageUrl || user?.image || '';
    const resolvedBio = profile.bio || local?.bio || '';
    const resolvedLocation = profile.location || local?.location || 'Jaipur, India';
    const resolvedGender = profile.gender || local?.gender || 'Female';
    const resolvedNiches = niches.niches?.length ? niches.niches : (local?.niches?.length ? local.niches : INITIAL_ONBOARDING_DATA.niches);
    const resolvedGoals = goals.length ? goals : (local?.goals?.length ? local.goals : INITIAL_ONBOARDING_DATA.goals);

    const baseSocials = INITIAL_ONBOARDING_DATA.socialAccounts;
    const resolvedSocials = baseSocials.map((acc) => {
      const remoteItem = socials[acc.platform];
      if (remoteItem && (remoteItem.url || remoteItem.handle)) {
        return {
          ...acc,
          url: remoteItem.url || '',
          handle: remoteItem.handle || (remoteItem.url ? remoteItem.url.split('/').filter(Boolean).pop() : ''),
          connected: Boolean(remoteItem.connected || remoteItem.url),
          isVerified: Boolean(remoteItem.verified),
        };
      }
      const localAcc = local?.socialAccounts?.find((s) => s.platform === acc.platform);
      if (localAcc) return localAcc;
      return acc;
    });

    // In-progress active step: clamp between 1 and 6 (NEVER 7)
    const backendStep = Number(backendState?.current_step) || 1;
    const resolvedStep = Math.min(Math.max(backendStep, 1), 6);

    return {
      step: resolvedStep,
      fullName: resolvedFullName,
      username: resolvedUsername,
      profileImage: resolvedImage,
      bio: resolvedBio,
      location: resolvedLocation,
      gender: resolvedGender,
      niches: resolvedNiches,
      customNiche: niches.custom_niche || local?.customNiche || '',
      socialAccounts: resolvedSocials,
      goals: resolvedGoals,
      isCompleted: false,
    };
  },

  /**
   * Upload profile image to backend /api/v1/influencer/onboarding/avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    const token = getAuthToken();
    if (!token) {
      return URL.createObjectURL(file);
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/api/v1/influencer/onboarding/avatar', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true,
      });
      if (res && res.status === 200 && res.data?.url) {
        return res.data.url;
      }
    } catch {}

    try {
      const res2 = await api.post('/api/v1/users/me/avatar', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true,
      });
      if (res2 && res2.status === 200) {
        return res2.data?.image_url || res2.data?.data?.profileImageUrl || res2.data?.data?.image || '';
      }
    } catch {}

    return URL.createObjectURL(file);
  },

  /**
   * Live username availability check
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean; message: string }> {
    const token = getAuthToken();
    const clean = username.replace(/^@/, '').trim();
    if (clean.length < 3) {
      return { available: false, message: "Username must be at least 3 characters." };
    }

    try {
      const res = await api.get(`/api/v1/influencer/onboarding/check-username?username=${encodeURIComponent(clean)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        validateStatus: () => true,
      });
      if (res && res.status === 200 && res.data) {
        return {
          available: Boolean(res.data.available),
          message: res.data.message || (res.data.available ? "Username is available!" : "Username is taken."),
        };
      }
    } catch {}

    return { available: true, message: "Username looks good." };
  },

  /**
   * Save Step 2: Creator Profile
   */
  async saveProfileStep(data: Partial<CreatorOnboardingData>, userId?: string) {
    this.saveLocalDraft(data, userId);
    const token = getAuthToken();
    if (!token) return;

    const payload: Record<string, any> = {};
    if (data.fullName !== undefined) payload.full_name = data.fullName.trim();
    if (data.username !== undefined) payload.username = data.username.replace(/^@/, '').trim();
    if (data.bio !== undefined) payload.bio = data.bio.trim();
    if (data.location !== undefined) payload.location = data.location.trim();
    if (data.gender !== undefined) payload.gender = data.gender.trim();
    if (data.profileImage !== undefined) payload.profile_image = data.profileImage.trim();

    if (Object.keys(payload).length > 0) {
      const res = await api.patch('/api/v1/influencer/onboarding/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      if (res && res.status >= 400 && res.data?.detail) {
        throw new Error(res.data.detail);
      }
    }
  },

  /**
   * Save Step 3: Niches
   */
  async saveNichesStep(data: Partial<CreatorOnboardingData>, userId?: string) {
    this.saveLocalDraft(data, userId);
    const token = getAuthToken();
    if (!token) return;

    if (data.niches !== undefined) {
      const res = await api.patch('/api/v1/influencer/onboarding/niches', {
        niches: data.niches,
        primary_niche: data.niches[0] || 'Fashion & Style',
        custom_niche: data.customNiche || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      if (res && res.status >= 400 && res.data?.detail) {
        throw new Error(res.data.detail);
      }
    }
  },

  /**
   * Save Step 4: Social Accounts
   */
  async saveSocialAccountsStep(data: Partial<CreatorOnboardingData>, userId?: string) {
    this.saveLocalDraft(data, userId);
    const token = getAuthToken();
    if (!token) return;

    if (data.socialAccounts !== undefined) {
      const payload: Record<string, any> = {};
      data.socialAccounts.forEach((s) => {
        const cleanHandle = s.handle ? s.handle.replace(/^@/, '').trim() : '';
        payload[s.platform] = {
          handle: cleanHandle || null,
          url: s.url ? s.url.trim() : (cleanHandle ? `https://${s.platform}.com/${cleanHandle}` : null),
          connected: Boolean(s.connected && cleanHandle),
          verified: Boolean(s.isVerified),
        };
      });
      const res = await api.patch('/api/v1/influencer/onboarding/social-accounts', payload, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      if (res && res.status >= 400 && res.data?.detail) {
        throw new Error(res.data.detail);
      }
    }
  },

  /**
   * Save Step 5: Goals
   */
  async saveGoalsStep(data: Partial<CreatorOnboardingData>, userId?: string) {
    this.saveLocalDraft(data, userId);
    const token = getAuthToken();
    if (!token) return;

    if (data.goals !== undefined) {
      const res = await api.patch('/api/v1/influencer/onboarding/goals', {
        goals: data.goals,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      if (res && res.status >= 400 && res.data?.detail) {
        throw new Error(res.data.detail);
      }
    }
  },

  /**
   * Update current active step progress
   */
  async saveProgressStep(stepNumber: number, userId?: string) {
    this.saveLocalDraft({ step: stepNumber }, userId);
    const token = getAuthToken();
    if (!token) return;

    const completedSteps = Array.from({ length: Math.max(stepNumber - 1, 0) }, (_, i) => i + 1);

    await api.patch('/api/v1/influencer/onboarding/progress', {
      current_step: Math.min(Math.max(stepNumber, 1), 6),
      completed_steps: completedSteps,
    }, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    });
  },

  /**
   * Finalize Creator Onboarding (Step 7)
   */
  async completeOnboarding(data: CreatorOnboardingData, userId?: string): Promise<{ success: boolean; message?: string }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error("You must be logged in to finalize creator onboarding.");
    }

    // 1. Ensure all steps are progressively committed to backend
    await this.saveProfileStep(data, userId);
    await this.saveNichesStep(data, userId);
    await this.saveSocialAccountsStep(data, userId);
    await this.saveGoalsStep(data, userId);

    // 2. Call backend complete endpoint
    const res = await api.post('/api/v1/influencer/onboarding/complete', {}, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    });

    if (res && res.status === 200 && (res.data?.success || res.data?.onboarding_status === 'COMPLETED')) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('creator_onboarding_completed', 'true');
        this.clearLocalDraft(userId);
      }
      return { success: true };
    }

    const errorMsg =
      res?.data?.detail ||
      res?.data?.message ||
      "Could not finalize creator account. Please verify all required details.";
    throw new Error(errorMsg);
  },
};
