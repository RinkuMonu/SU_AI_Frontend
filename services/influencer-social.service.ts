import api from '@/lib/api';

export type PlatformKey = 'instagram' | 'facebook' | 'linkedin';

export interface SocialPlatformInfo {
  platform: PlatformKey;
  status: 'NOT_CONNECTED' | 'PENDING' | 'VERIFIED' | 'FAILED' | 'REVOKED' | string;
  platform_account_id?: string | null;
  platform_username?: string | null;
  display_name?: string | null;
  profile_url?: string | null;
  verification_method: 'oauth' | 'manual' | 'none' | string;
  is_verified: boolean;
  connected_at?: string | null;
  verified_at?: string | null;
  last_error?: string | null;
}

export interface InfluencerSocialStatus {
  success: boolean;
  platforms: Record<PlatformKey, SocialPlatformInfo>;
  total_connected: number;
  total_verified: number;
  should_show_prompt: boolean;
  dismissed_popup: boolean;
  dismissed_at?: string | null;
}

export const influencerSocialService = {
  /**
   * Authoritative backend status across Instagram, Facebook, LinkedIn
   */
  async getStatus(): Promise<InfluencerSocialStatus> {
    try {
      const res = await api.get('/api/v1/influencer/social/status');
      return res.data;
    } catch (err) {
      return {
        success: false,
        platforms: {
          instagram: { platform: 'instagram', status: 'NOT_CONNECTED', is_verified: false, verification_method: 'none' },
          facebook: { platform: 'facebook', status: 'NOT_CONNECTED', is_verified: false, verification_method: 'none' },
          linkedin: { platform: 'linkedin', status: 'NOT_CONNECTED', is_verified: false, verification_method: 'none' },
        },
        total_connected: 0,
        total_verified: 0,
        should_show_prompt: false,
        dismissed_popup: false,
      };
    }
  },

  /**
   * Generates official OAuth redirect URL for Instagram, Facebook, or LinkedIn
   */
  async getConnectUrl(platform: PlatformKey, frontendUrl?: string): Promise<string> {
    const targetFrontend = frontendUrl || (typeof window !== 'undefined' ? `${window.location.origin}/influencer/social-accounts` : undefined);
    const res = await api.post(`/api/v1/influencer/social/connect/${platform}`, {
      frontend_url: targetFrontend,
      rerequest: false,
    });
    if (res.data?.authorization_url) {
      return res.data.authorization_url;
    }
    throw new Error(res.data?.message || `No authorization URL returned for ${platform}`);
  },

  /**
   * Re-connects an expired or failed account
   */
  async reconnect(platform: PlatformKey, frontendUrl?: string): Promise<string> {
    const targetFrontend = frontendUrl || (typeof window !== 'undefined' ? `${window.location.origin}/influencer/social-accounts` : undefined);
    const res = await api.post(`/api/v1/influencer/social/reconnect/${platform}`, {
      frontend_url: targetFrontend,
      rerequest: true,
    });
    if (res.data?.authorization_url) {
      return res.data.authorization_url;
    }
    throw new Error(res.data?.message || `No re-authorization URL returned for ${platform}`);
  },

  /**
   * Revokes and disconnects a social platform
   */
  async disconnect(platform: PlatformKey): Promise<boolean> {
    const res = await api.post(`/api/v1/influencer/social/disconnect/${platform}`);
    return res.data?.success ?? true;
  },

  /**
   * Dismisses the post-onboarding social popup on backend
   */
  async dismissPrompt(): Promise<boolean> {
    try {
      const res = await api.post('/api/v1/influencer/social/dismiss-prompt');
      return res.data?.success ?? true;
    } catch {
      return false;
    }
  },
};

