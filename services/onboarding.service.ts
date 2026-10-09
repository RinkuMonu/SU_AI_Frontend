import api from './api.service';

export interface OnboardingStatus {
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
    const { data } = await api.get('/api/v1/onboarding/status');
    return data;
  },
  updateProgress: async (payload: Partial<OnboardingStatus>) => {
    const { data } = await api.patch('/api/v1/onboarding/progress', payload);
    return data;
  }
};
