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
  selected_services?: string[];
  selectedServices?: string[];
  business_services?: string[];
  online_presence?: string | null;
  business_type?: string | null;
  role?: string;
  can_access_dashboard?: boolean;
  requires_onboarding?: boolean;
  next_step?: string;
  steps?: {
    step_1_brand_kit?: any;
    step_2_social_connectivity?: any;
    step_3_subscription_plan?: any;
    [key: string]: any;
  };
}

export interface GoogleMapsSelectPayload {
  place_id: string;
  name: string;
  formatted_address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  review_count?: number;
  website?: string;
  phone_number?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  types?: string[];
  photos?: string[];
  google_maps_url?: string;
}

export interface GoogleMapsProfilePayload {
  business_name: string;
  promotion_goal: string;
  target_audience?: string;
  differentiators?: string[];
  logo_url?: string;
  tagline?: string;
  products_services?: string[];
}

export interface SavePlatformsPayload {
  selected_platforms: string[];
  platform_urls?: Record<string, string>;
  custom_platform_name?: string;
  other_platform_name?: string;
  website_url?: string;
  skip_website?: boolean;
  onboarding_source?: 'marketplace_seller' | 'wholesale_b2b';
}

export const OnboardingService = {
  /**
   * Get full onboarding status from backend
   */
  getStatus: async (): Promise<OnboardingStatus> => {
    const response = await api.get('/api/v1/onboarding/status');
    return response.data?.data || response.data;
  },

  /**
   * Check if onboarding has been marked completed on the backend
   */
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

  /**
   * Save onboarding progress (step number, partial metadata)
   */
  updateProgress: async (payload: Partial<OnboardingStatus> & Record<string, any>) => {
    const { data } = await api.patch('/api/v1/onboarding/progress', payload);
    return data;
  },

  /**
   * Finalize onboarding: marks account active & completed in database
   */
  completeOnboarding: async () => {
    try {
      const { data } = await api.post('/api/v1/onboarding/complete', {});
      return data;
    } catch (err: any) {
      // Fallback to progress patch if POST /complete is blocked
      const { data } = await api.patch('/api/v1/onboarding/progress', {
        onboarding_completed: true,
        is_completed: true,
      });
      return data;
    }
  },

  // ─── Business Services Endpoints ───
  saveSelectedServices: async (selected_services: string[]): Promise<string[]> => {
    const response = await api.post('/api/v1/onboarding/services', { selected_services });
    const data = response.data?.data || response.data;
    return data?.selected_services || selected_services;
  },

  getSelectedServices: async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/v1/onboarding/services');
      const data = response.data?.data || response.data;
      return data?.selected_services || (Array.isArray(data) ? data : []);
    } catch (_) {
      return [];
    }
  },

  // ─── Online Presence (Business Source) Endpoints ───
  saveOnlinePresence: async (presence: string, extraDetails: Record<string, any> = {}): Promise<any> => {
    const payload = {
      online_presence: presence,
      ...extraDetails,
    };
    const response = await api.post('/api/v1/onboarding/online-presence', payload);
    return response.data?.data || response.data;
  },

  getOnlinePresence: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/onboarding/online-presence');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  // ─── Website Analysis Onboarding Endpoints ───
  startWebsiteAnalysis: async (website_url: string, business_name?: string): Promise<any> => {
    const response = await api.post('/api/v1/onboarding/website-analysis', {
      website_url,
      url: website_url,
      onboarding_type: 'website',
      business_name,
    });
    return response.data?.data || response.data;
  },

  getWebsiteAnalysisLatest: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/onboarding/website-analysis/latest');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  saveBusinessDetails: async (details: Record<string, any>): Promise<any> => {
    const response = await api.put('/api/v1/onboarding/business-details', details);
    return response.data?.data || response.data;
  },

  saveBrandPreferences: async (preferences: Record<string, any>): Promise<any> => {
    const response = await api.put('/api/v1/onboarding/brand-preferences', preferences);
    return response.data?.data || response.data;
  },

  getBusinessProfile: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/onboarding/business-profile');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  // ─── Google Maps Onboarding Endpoints ───
  selectGoogleMapsShop: async (shopData: GoogleMapsSelectPayload): Promise<any> => {
    const response = await api.post('/api/v1/onboarding/google-maps/select', shopData);
    return response.data?.data || response.data;
  },

  getGoogleMapsState: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/onboarding/google-maps/state');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  updateGoogleMapsProfile: async (profile: GoogleMapsProfilePayload): Promise<any> => {
    const response = await api.put('/api/v1/onboarding/google-maps/profile', profile);
    return response.data?.data || response.data;
  },

  completeGoogleMaps: async (): Promise<any> => {
    try {
      const response = await api.post('/api/v1/onboarding/google-maps/complete', {});
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  // ─── Marketplace Seller Onboarding Endpoints ───
  saveMarketplacePlatforms: async (payload: SavePlatformsPayload): Promise<any> => {
    const response = await api.post('/api/v1/onboarding/marketplace-seller/platforms', {
      ...payload,
      onboarding_source: 'marketplace_seller',
    });
    return response.data?.data || response.data;
  },

  saveMarketplaceWebsite: async (website_url: string, skip: boolean = false): Promise<any> => {
    const response = await api.post('/api/v1/onboarding/marketplace-seller/website', {
      website_url,
      skip,
    });
    return response.data?.data || response.data;
  },

  getMarketplaceState: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/onboarding/marketplace-seller/state');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  // ─── Wholesale / B2B Onboarding Endpoints ───
  saveWholesalePlatforms: async (payload: SavePlatformsPayload): Promise<any> => {
    const response = await api.post('/api/v1/onboarding/wholesale-b2b/platforms', {
      ...payload,
      onboarding_source: 'wholesale_b2b',
    });
    return response.data?.data || response.data;
  },

  saveWholesaleWebsite: async (website_url: string, skip: boolean = false): Promise<any> => {
    const response = await api.post('/api/v1/onboarding/wholesale-b2b/website', {
      website_url,
      skip,
    });
    return response.data?.data || response.data;
  },

  getWholesaleState: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/onboarding/wholesale-b2b/state');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  // ─── First Content Creation Choice ───
  saveFirstContentChoice: async (content_choice: 'post_maker' | 'ai_photoshoot' | 'reel_maker'): Promise<any> => {
    const response = await api.post('/api/v1/onboarding/first-content/choice', {
      content_choice,
    });
    return response.data?.data || response.data;
  },

  // ─── Social Media & Subscription Onboarding Status ───
  getSocialOnboardingStatus: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/social/onboarding-status');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },

  skipSocialOnboarding: async (): Promise<any> => {
    try {
      const response = await api.post('/api/v1/social/onboarding/skip', {});
      return response.data?.data || response.data;
    } catch (_) {
      try {
        const fallback = await api.post('/api/v1/social/skip', {});
        return fallback.data?.data || fallback.data;
      } catch {
        return null;
      }
    }
  },

  getSubscriptionOnboardingStatus: async (): Promise<any> => {
    try {
      const response = await api.get('/api/v1/subscription/onboarding-status');
      return response.data?.data || response.data;
    } catch (_) {
      return null;
    }
  },
};

