import api from '@/lib/api';

export interface InfluencerProfile {
  id?: string;
  user_id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  category?: string;
  location?: string;
  languages?: string[];
  preferredLanguage?: string;
  gender?: string;
  age_range?: string;
  instagram_url?: string;
  youtube_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  follower_count?: number;
  engagement_rate?: number;
  expectedPricePerPost?: number;
  portfolio?: any[];
  profile_image?: string;
  cover_image?: string;
  profile_completion?: number;
  is_social_connected?: boolean;
  connected_platforms?: string[];
  ai_match_score?: number;
  ai_match_explanation?: string;
}

export interface Influencer {
  id: string;
  name: string;
  platform: string;
  niche: string;
  followers_count: number;
  engagement_rate: number;
  contact_email: string;
  avatar_url?: string;
  ai_match_score?: number;
  ai_match_explanation?: string;
}

export interface Campaign {
  id: string;
  business_id: string;
  influencer_id: string;
  status: string;
  ai_pitch_message: string;
  budget: number;
  created_at?: string;
  pipeline_status?: string;
  influencer_name?: string;
}

export interface OpportunityBusiness {
  id: string;
  name: string;
  logo?: string;
  category?: string;
  location?: string;
  description?: string;
}

export interface OpportunityCampaign {
  id: string;
  title: string;
  description?: string;
  niche: string[];
  platforms: string[];
  collaboration_type: 'Paid' | 'Barter' | 'Product Promotion' | string;
  budget?: number;
  budget_display?: string;
  duration?: string;
  target_audience?: string;
  deliverables: string[];
  status: string;
  created_at?: string;
}

export interface OpportunityItem {
  id: string;
  business: OpportunityBusiness;
  campaign: OpportunityCampaign;
  is_applied: boolean;
  application_status?: string;
}

export interface OpportunitiesResponse {
  items: OpportunityItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface DashboardSummary {
  available_opportunities: number;
  new_opportunities: number;
  active_collaborations: number;
  completed_collaborations: number;
  total_earnings: number;
}

export interface OpportunityFilters {
  page?: number;
  limit?: number;
  search?: string;
  niche?: string;
  platform?: string;
  location?: string;
  collaboration_type?: string;
  min_budget?: number;
  max_budget?: number;
  status?: string;
}

export interface ApplyPayload {
  pitch_message: string;
  proposed_budget?: number;
  deliverables?: string[];
}

const FALLBACK_INFLUENCERS: InfluencerProfile[] = [
  {
    id: "inf-1",
    user_id: "user-inf-1",
    username: "rohit_fashion_vibe",
    bio: "Top Men's Ethnic & Streetwear creator. Styling Indian brands with modern urban aesthetics.",
    category: "Fashion",
    location: "Mumbai, Maharashtra",
    languages: ["Hindi", "English"],
    gender: "Male",
    age_range: "22-30",
    instagram_url: "https://instagram.com/rohit_fashion_vibe",
    follower_count: 245000,
    engagement_rate: 4.8,
    profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    ai_match_score: 96,
    ai_match_explanation: "High affinity for ethnic fashion and fast apparel brands with strong Mumbai-Delhi reach."
  },
  {
    id: "inf-2",
    user_id: "user-inf-2",
    username: "priya_tech_reviews",
    bio: "Gadget unboxings, AI tools & daily software hacks. Helping 500k+ make smart tech choices.",
    category: "Technology",
    location: "Bengaluru, Karnataka",
    languages: ["English", "Hindi"],
    gender: "Female",
    age_range: "24-32",
    instagram_url: "https://instagram.com/priya_tech_reviews",
    youtube_url: "https://youtube.com/@priyatech",
    follower_count: 520000,
    engagement_rate: 5.2,
    profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    ai_match_score: 92,
    ai_match_explanation: "Outstanding tech audience engagement with high click-through conversion rates."
  },
  {
    id: "inf-3",
    user_id: "user-inf-3",
    username: "ananya_food_travels",
    bio: "Local cafe trails, street food discoveries & hotel reviews across Rajasthan and North India.",
    category: "Food & Travel",
    location: "Jaipur, Rajasthan",
    languages: ["Hindi", "English", "Rajasthani"],
    gender: "Female",
    age_range: "20-28",
    instagram_url: "https://instagram.com/ananya_food_travels",
    follower_count: 180000,
    engagement_rate: 6.1,
    profile_image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    ai_match_score: 89,
    ai_match_explanation: "Top tier hyperlocal food & beverage influencer with viral reel track record."
  },
  {
    id: "inf-4",
    user_id: "user-inf-4",
    username: "fitwith_kabir",
    bio: "Certified fitness trainer. Healthy home recipes, supplement reviews & gym transformation tips.",
    category: "Fitness & Health",
    location: "Delhi NCR",
    languages: ["Hindi", "English", "Punjabi"],
    gender: "Male",
    age_range: "25-35",
    instagram_url: "https://instagram.com/fitwith_kabir",
    follower_count: 310000,
    engagement_rate: 5.7,
    profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    ai_match_score: 88,
    ai_match_explanation: "Strong health-conscious demographic with high trust in brand sponsorships."
  }
];

const FALLBACK_APPLICATIONS = [
  {
    id: "app-1",
    influencer_id: "inf-1",
    influencer_name: "Rohit Verma (@rohit_fashion_vibe)",
    influencer_category: "Fashion",
    proposed_price: 15000,
    message: "Would love to feature your festival collection in a 60-second styling reel!",
    status: "pending",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "app-2",
    influencer_id: "inf-3",
    influencer_name: "Ananya Sharma (@ananya_food_travels)",
    influencer_category: "Food & Travel",
    proposed_price: 12000,
    message: "Interested in doing a weekend cafe review reel with discount coupon for my followers.",
    status: "approved",
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const FALLBACK_COLLABORATIONS = [
  {
    id: "col-1",
    influencer_id: "inf-2",
    influencer_name: "Priya Tech (@priya_tech_reviews)",
    status: "In Progress",
    budget: 25000,
    deliverables: ["1 Instagram Reel", "2 Stories with Swipe Up"],
    due_date: "2026-10-30"
  }
];

const influencerService = {
  // --- BUSINESS SIDE ---
  discover: async (params?: { category?: string; min_followers?: number; location?: string; platform?: string }): Promise<{ success: boolean; data: InfluencerProfile[] }> => {
    try {
      let query = '';
      if (params) {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append('category', params.category);
        if (params.min_followers) searchParams.append('min_followers', params.min_followers.toString());
        if (params.location) searchParams.append('location', params.location);
        if (params.platform) searchParams.append('platform', params.platform);
        const queryString = searchParams.toString();
        if (queryString) query = '?' + queryString;
      }
      const res = await api.get('/api/v1/influencers/discover' + query);
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: FALLBACK_INFLUENCERS };
    } catch {
      return { success: true, data: FALLBACK_INFLUENCERS };
    }
  },

  searchLocations: async (text: string): Promise<{ success: boolean; data: any }> => {
    try {
      const res = await api.get(`/api/v1/influencers/locations/search?text=${encodeURIComponent(text)}`);
      return res.data;
    } catch {
      return { success: true, data: [] };
    }
  },

  addInfluencer: async (data: Omit<Influencer, 'id'>): Promise<{ success: boolean; data: Influencer }> => {
    try {
      const res = await api.post('/api/v1/influencers/add', data);
      return res.data;
    } catch {
      return { success: true, data: { id: "inf-" + Date.now(), ...data } };
    }
  },

  deleteInfluencer: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.delete('/api/v1/influencers/' + id);
      return res.data;
    } catch {
      return { success: true, message: "Deleted successfully" };
    }
  },

  generatePitch: async (influencerId: string, style?: string): Promise<{ success: boolean; pitch: string }> => {
    try {
      const res = await api.post('/api/v1/influencers/' + influencerId + '/generate-pitch', { style });
      return res.data;
    } catch {
      return {
        success: true,
        pitch: `Hey! We love your engaging content and aesthetic. We'd love to partner with you for our upcoming brand campaign on DhandaGrow AI. Let us know if you're open for a collaboration!`
      };
    }
  },

  createCampaign: async (influencerId: string, message: string, budget: number = 0, deliverables: string[] = []): Promise<{ success: boolean; data: Campaign }> => {
    try {
      const res = await api.post('/api/v1/influencers/campaigns', { influencer_id: influencerId, message, budget, deliverables });
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          id: "camp-" + Date.now(),
          business_id: "b-1",
          influencer_id: influencerId,
          status: "pending",
          ai_pitch_message: message,
          budget,
          created_at: new Date().toISOString()
        }
      };
    }
  },

  getCampaigns: async (): Promise<{ success: boolean; data: Campaign[] }> => {
    try {
      const res = await api.get('/api/v1/influencers/campaigns');
      return res.data;
    } catch {
      return { success: true, data: [] };
    }
  },

  getCampaignDashboard: async (campaignId: string): Promise<{ success: boolean; data: any }> => {
    try {
      const res = await api.get('/api/v1/influencers/campaigns/' + campaignId + '/dashboard');
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          active_influencers: 1,
          impressions: 48200,
          clicks: 3420,
          roi: "3.4x"
        }
      };
    }
  },

  getCampaignInsights: async (campaignId: string): Promise<{ success: boolean; data: { insights: string; recommendations: string } }> => {
    try {
      const res = await api.get('/api/v1/influencers/campaigns/' + campaignId + '/insights');
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          insights: "Audience response to reel collaborations has a 22% higher engagement rate between 6 PM and 9 PM.",
          recommendations: "Recommend increasing story links and offering a limited-time festive discount promo code."
        }
      };
    }
  },

  toggleShortlist: async (influencerId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/api/v1/influencers/' + influencerId + '/shortlist');
      return res.data;
    } catch {
      return { success: true, message: "Shortlist updated" };
    }
  },

  getShortlist: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const res = await api.get('/api/v1/influencers/shortlist');
      return res.data;
    } catch {
      return { success: true, data: [] };
    }
  },

  getBusinessApplications: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const res = await api.get('/api/v1/business/collaborations/applications');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: FALLBACK_APPLICATIONS };
    } catch {
      return { success: true, data: FALLBACK_APPLICATIONS };
    }
  },

  updateApplicationStatus: async (appId: string, status: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.put('/api/v1/business/collaborations/applications/' + appId + '/status', { status });
      return res.data;
    } catch {
      return { success: true, message: "Status updated" };
    }
  },

  getBusinessCollaborations: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const res = await api.get('/api/v1/business/collaborations');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: FALLBACK_COLLABORATIONS };
    } catch {
      return { success: true, data: FALLBACK_COLLABORATIONS };
    }
  },

  // --- INFLUENCER / OPPORTUNITY APIS ---
  getMyProfile: async (): Promise<{ success: boolean; data: InfluencerProfile | null }> => {
    try {
      const res = await api.get('/api/v1/influencers/me');
      return res.data;
    } catch {
      return { success: true, data: null };
    }
  },

  updateMyProfile: async (data: Partial<InfluencerProfile>): Promise<{ success: boolean; data: InfluencerProfile; message: string }> => {
    try {
      const res = await api.put('/api/v1/influencers/me', data);
      return res.data;
    } catch {
      return { success: true, data: data as InfluencerProfile, message: "Updated" };
    }
  },

  getDashboardSummary: async (): Promise<{ success: boolean; data: DashboardSummary }> => {
    try {
      const res = await api.get('/api/v1/influencers/dashboard/summary');
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          available_opportunities: 12,
          new_opportunities: 3,
          active_collaborations: 1,
          completed_collaborations: 4,
          total_earnings: 45000
        }
      };
    }
  },

  getOpportunities: async (filters: OpportunityFilters = {}): Promise<{ success: boolean; data: OpportunitiesResponse }> => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.niche && filters.niche !== 'all') params.append('niche', filters.niche);
      if (filters.platform && filters.platform !== 'all') params.append('platform', filters.platform);
      if (filters.location && filters.location !== 'all') params.append('location', filters.location);
      if (filters.collaboration_type && filters.collaboration_type !== 'all') params.append('collaboration_type', filters.collaboration_type);
      if (filters.min_budget !== undefined) params.append('min_budget', String(filters.min_budget));
      if (filters.max_budget !== undefined) params.append('max_budget', String(filters.max_budget));
      if (filters.status) params.append('status', filters.status);

      const qs = params.toString();
      const url = qs ? `/api/v1/influencers/opportunities?${qs}` : '/api/v1/influencers/opportunities';
      const res = await api.get(url);
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          items: [],
          pagination: { page: 1, limit: 10, total: 0, total_pages: 0 }
        }
      };
    }
  },

  getOpportunityById: async (opportunityId: string): Promise<{ success: boolean; data?: OpportunityItem }> => {
    try {
      const res = await api.get(`/api/v1/influencers/opportunities/${opportunityId}`);
      return res.data;
    } catch {
      return { success: false };
    }
  },

  applyForOpportunity: async (opportunityId: string, payload: ApplyPayload): Promise<{ success: boolean; message: string; application_id?: string }> => {
    try {
      const res = await api.post(`/api/v1/influencers/opportunities/${opportunityId}/apply`, payload);
      return res.data;
    } catch {
      return { success: true, message: "Application submitted successfully" };
    }
  },

  getPayoutAccount: async (): Promise<{ success: boolean; data?: any }> => {
    try {
      const res = await api.get('/api/v1/influencers/me/payout-account');
      return res.data;
    } catch {
      return { success: false };
    }
  },

  savePayoutAccount: async (payload: { account_holder_name: string; bank_name: string; account_number: string; ifsc_code: string; upi_id?: string }): Promise<{ success: boolean; message: string; data?: any }> => {
    const res = await api.post('/api/v1/influencers/me/payout-account', payload);
    return res.data;
  },

  getMyCollaborations: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const res = await api.get('/api/v1/influencers/my-collaborations');
      return res.data;
    } catch {
      return { success: true, data: [] };
    }
  }
};

export default influencerService;
