import api from '@/lib/api';

export interface OnboardingStatus {
  onboarding_completed?: boolean;
  onboardingCompleted?: boolean;
  is_completed?: boolean;
  is_pending?: boolean;
  business_profile_completed: boolean;
  social_connection_completed: boolean;
  connected_platforms: string[];
  onboarding_step: number;
  subscription_status: string;
  selected_plan_id: string;
  onboarding_completed_at: string | null;
}

export const OnboardingService = {
  getStatus: async (): Promise<OnboardingStatus> => {
    const response = await api.get('/api/v1/onboarding/status');
    return response.data?.data || response.data;
  },

  isCompleted: async (token?: string): Promise<boolean> => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
      const response = await api.get('/api/v1/onboarding/status', config);
      const data = response.data?.data || response.data;
      if (!data) return false;
      return Boolean(
        data.onboarding_completed === true ||
        data.onboardingCompleted === true ||
        data.is_completed === true ||
        Boolean(data.onboarding_completed_at)
      );
    } catch (_) {
      return false;
    }
  },

  updateProgress: async (payload: Partial<OnboardingStatus> & Record<string, any>) => {
    const { data } = await api.patch('/api/v1/onboarding/progress', payload);
    return data;
  },

  completeOnboarding: async () => {
    try {
      const { data } = await api.patch('/api/v1/onboarding/progress', {
        onboarding_completed: true,
        is_completed: true,
      });
      return data;
    } catch (_) {
      return null;
    }
  }
};

