import api from '@/lib/api';

export interface SocialPlatformStatusItem {
  platform: 'instagram' | 'facebook' | 'linkedin';
  connected: boolean;
  account_id?: string | null;
  account_name?: string | null;
  account_type?: string | null;
  profile_picture_url?: string | null;
  reauthorization_required?: boolean;
  connected_at?: string | null;
}

export interface SocialOnboardingStatusResponse {
  role?: string | null;
  brand_kit_completed: boolean;
  social_connectivity_completed: boolean;
  social_connectivity_completed_at?: string | null;
  should_show_modal: boolean;
  connected_count: number;
  platforms: Record<'instagram' | 'facebook' | 'linkedin', SocialPlatformStatusItem>;
  create_account_urls: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
}

export const socialService = {
  // ──────────────────────────────────────────────
  // Social Publishing
  // ──────────────────────────────────────────────

  async publishToInstagram(contentId: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-instagram/${contentId}`);
    return res.data;
  },

  async publishToFacebook(contentId: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-facebook/${contentId}`);
    return res.data;
  },

  async publishToLinkedin(contentId: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-linkedin/${contentId}`);
    return res.data;
  },

  // ──────────────────────────────────────────────
  // Social Onboarding & Connectivity Management
  // ──────────────────────────────────────────────

  /**
   * Fetches the authoritative social onboarding status from backend.
   */
  async getOnboardingStatus(): Promise<SocialOnboardingStatusResponse> {
    const res = await api.get('/api/v1/social/onboarding-status');
    return res.data;
  },

  /**
   * Retrieves connection info across all 3 platforms.
   */
  async getPlatforms(): Promise<{
    success: boolean;
    platforms: Record<'instagram' | 'facebook' | 'linkedin', SocialPlatformStatusItem>;
    create_account_urls: Record<string, string>;
  }> {
    const res = await api.get('/api/v1/social/platforms');
    return res.data;
  },

  /**
   * Requests official OAuth initiation authorization URL from backend.
   */
  async getConnectUrl(platform: 'instagram' | 'facebook' | 'linkedin'): Promise<string> {
    const endpoint = `/api/${platform}/connect`;
    const res = await api.get(endpoint);
    const authUrl = res.data?.authorization_url || res.data?.url;
    if (!authUrl) {
      throw new Error(`No authorization URL returned from ${endpoint}`);
    }
    return authUrl;
  },

  /**
   * Disconnects a connected platform and recalculates onboarding status.
   */
  async disconnect(platform: 'instagram' | 'facebook' | 'linkedin'): Promise<{
    success: boolean;
    platform: string;
    message: string;
    social_connectivity_completed: boolean;
    should_show_modal: boolean;
  }> {
    const res = await api.post(`/api/v1/social/disconnect/${platform}`);
    return res.data;
  },

  /**
   * Syncs connection credentials/tokens directly to the business profile if needed.
   */
  async syncBusinessTokens(payload: {
    ig_account_id?: string;
    ig_access_token?: string;
    fb_page_id?: string;
    fb_access_token?: string;
    linkedin_author_id?: string;
    linkedin_access_token?: string;
  }): Promise<any> {
    const res = await api.put('/api/v1/businesses/me', payload);
    return res.data;
  }
};
