import api from '@/lib/api';
import { CreatorOnboardingData, INITIAL_ONBOARDING_DATA } from '@/components/influencer-onboarding/types';

const STORAGE_KEY = 'dhandagrow_creator_onboarding_draft';

export interface InfluencerOnboardingStatusResult {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  targetRoute: string;
}

export const creatorOnboardingService = {
  getLocalDraft(): Partial<CreatorOnboardingData> | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveLocalDraft(data: Partial<CreatorOnboardingData>) {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getLocalDraft() || {};
      const merged = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Failed to save creator draft to localStorage:', e);
    }
  },

  clearLocalDraft() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('creator_onboarding_completed');
    } catch {}
  },

  /**
   * Fetch authoritative creator onboarding status directly from the backend.
   * Returns whether onboarding is completed, current saved step, and target route.
   */
  async getInfluencerOnboardingStatus(): Promise<InfluencerOnboardingStatusResult> {
    try {
      const res = await api.get('/api/v1/influencer/onboarding');
      const data = res.data;
      if (data && (data.success || data.onboarding_status)) {
        const rawStatus = String(data.onboarding_status || 'NOT_STARTED').toUpperCase();
        const currentStep = Math.min(Math.max(Number(data.current_step) || 1, 1), 7);
        const completedSteps = Array.isArray(data.completed_steps) ? data.completed_steps : [];
        const isCompleted = rawStatus === 'COMPLETED';

        return {
          status: rawStatus as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
          currentStep: isCompleted ? 7 : (rawStatus === 'NOT_STARTED' ? 1 : currentStep),
          completedSteps,
          isCompleted,
          targetRoute: isCompleted ? '/influencer' : '/onboarding/influencer',
        };
      }
    } catch (err) {
      console.warn('Failed to retrieve influencer onboarding status from backend:', err);
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

  async loadOnboardingData(user?: any): Promise<CreatorOnboardingData> {
    const local = this.getLocalDraft();
    let backendState: any = null;

    try {
      const res = await api.get('/api/v1/influencer/onboarding');
      if (res.data?.success || res.data?.onboarding_status) {
        backendState = res.data;
      }
    } catch (e) {
      console.warn('Could not fetch saved onboarding state, falling back:', e);
    }

    const profile = backendState?.profile || {};
    const niches = backendState?.niches || {};
    const socials = backendState?.social_accounts || {};
    const goals = backendState?.goals || [];

    // Is it strictly finalized? Never assume completed from generic user flags
    const rawStatus = String(backendState?.onboarding_status || '').toUpperCase();
    const isCompleted = rawStatus === 'COMPLETED';

    // Merge priority: Local draft > Remote profile > user metadata > Initial state
    const resolvedFullName = local?.fullName || profile.full_name || user?.name || user?.fullName || '';
    const resolvedUsername = local?.username || profile.username || user?.username || (user?.email ? user.email.split('@')[0] : '');
    const resolvedImage = local?.profileImage || profile.profile_image || user?.profileImageUrl || user?.image || '';
    const resolvedBio = local?.bio || profile.bio || '';
    const resolvedLocation = local?.location || profile.location || 'Jaipur, India';
    const resolvedGender = local?.gender || profile.gender || 'Female';
    const resolvedNiches = local?.niches?.length 
      ? local.niches 
      : (niches.niches?.length ? niches.niches : INITIAL_ONBOARDING_DATA.niches);
    const resolvedGoals = local?.goals?.length 
      ? local.goals 
      : (goals.length ? goals : INITIAL_ONBOARDING_DATA.goals);

    // Social accounts mapping
    const baseSocials = INITIAL_ONBOARDING_DATA.socialAccounts;
    const resolvedSocials = baseSocials.map((acc) => {
      const localAcc = local?.socialAccounts?.find((s) => s.platform === acc.platform);
      if (localAcc) return localAcc;

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
      return acc;
    });

    // Step determination:
    // - If COMPLETED -> step 7
    // - If NOT_STARTED -> step 1
    // - If IN_PROGRESS -> resume from saved step
    let resolvedStep = 1;
    if (isCompleted) {
      resolvedStep = 7;
    } else if (rawStatus === 'IN_PROGRESS') {
      const stepFromBackend = Number(backendState?.current_step) || 1;
      resolvedStep = Math.max(local?.step || 1, stepFromBackend);
    } else {
      // NOT_STARTED or newly initialized -> always Screen 1
      resolvedStep = local?.step && local.step > 1 ? local.step : 1;
    }

    return {
      step: Math.min(Math.max(resolvedStep, 1), 7),
      fullName: resolvedFullName,
      username: resolvedUsername,
      profileImage: resolvedImage,
      bio: resolvedBio,
      location: resolvedLocation,
      gender: resolvedGender,
      niches: resolvedNiches,
      customNiche: local?.customNiche || niches.custom_niche || '',
      socialAccounts: resolvedSocials,
      goals: resolvedGoals,
      isCompleted,
    };
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/api/v1/influencer/onboarding/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.url || '';
    } catch {
      const res2 = await api.post('/api/v1/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res2.data?.image_url || res2.data?.data?.profileImageUrl || res2.data?.data?.image || '';
    }
  },

  async syncStepToBackend(data: Partial<CreatorOnboardingData>) {
    this.saveLocalDraft(data);

    try {
      // 1. If profile fields are present (Step 2)
      if (
        data.fullName !== undefined ||
        data.username !== undefined ||
        data.bio !== undefined ||
        data.location !== undefined ||
        data.gender !== undefined ||
        data.profileImage !== undefined
      ) {
        await api.patch('/api/v1/influencer/onboarding/profile', {
          full_name: data.fullName,
          username: data.username ? data.username.replace(/^@/, '') : undefined,
          bio: data.bio,
          location: data.location,
          gender: data.gender,
          profile_image: data.profileImage,
        });
      }

      // 2. If niches are present (Step 3)
      if (data.niches !== undefined) {
        await api.patch('/api/v1/influencer/onboarding/niches', {
          niches: data.niches,
          primary_niche: data.niches[0] || 'Fashion & Style',
          custom_niche: data.customNiche,
        });
      }

      // 3. If social accounts are present (Step 4)
      if (data.socialAccounts !== undefined) {
        const payload: Record<string, any> = {};
        data.socialAccounts.forEach((s) => {
          payload[s.platform] = {
            handle: s.handle || (s.url ? s.url.split('/').filter(Boolean).pop() : null),
            url: s.url || null,
            connected: Boolean(s.connected),
            verified: Boolean(s.isVerified),
          };
        });
        await api.patch('/api/v1/influencer/onboarding/social-accounts', payload);
      }

      // 4. If goals are present (Step 5)
      if (data.goals !== undefined) {
        await api.patch('/api/v1/influencer/onboarding/goals', {
          goals: data.goals,
        });
      }

      // 5. Update progress step
      if (data.step !== undefined) {
        await api.patch('/api/v1/influencer/onboarding/progress', {
          current_step: data.step,
        });
      }
    } catch (e) {
      console.warn('Failed to sync creator step to onboarding API:', e);
    }
  },

  async completeOnboarding(data: CreatorOnboardingData): Promise<boolean> {
    try {
      // 1. Sync all current data to onboarding endpoints
      await this.syncStepToBackend(data);

      // 2. Call complete endpoint
      await api.post('/api/v1/influencer/onboarding/complete', {});

      if (typeof window !== 'undefined') {
        localStorage.setItem('creator_onboarding_completed', 'true');
      }
      this.saveLocalDraft({ ...data, step: 7, isCompleted: true });
      return true;
    } catch (err) {
      console.error('Failed to complete creator onboarding on backend:', err);
      if (typeof window !== 'undefined') {
        localStorage.setItem('creator_onboarding_completed', 'true');
      }
      this.saveLocalDraft({ ...data, step: 7, isCompleted: true });
      return true;
    }
  },
};
