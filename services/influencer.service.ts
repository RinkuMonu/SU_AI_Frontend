import api from '@/lib/api';

export interface InfluencerProfile {
  id?: string;
  user_id?: string;
  username?: string;
  bio?: string;
  category?: string;
  location?: string;
  languages?: string[];
  gender?: string;
  age_range?: string;
  instagram_url?: string;
  youtube_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  follower_count?: number;
  engagement_rate?: number;
  portfolio?: any[];
  profile_image?: string;
  cover_image?: string;
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

const influencerService = {
  // --- BUSINESS SIDE ---
  discover: async (params?: { category?: string; min_followers?: number; location?: string; platform?: string }): Promise<{ success: boolean; data: InfluencerProfile[] }> => {
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
    return res.data;
  },

  searchLocations: async (text: string): Promise<{ success: boolean; data: any }> => {
    const res = await api.get(`/api/v1/influencers/locations/search?text=${encodeURIComponent(text)}`);
    return res.data;
  },

  addInfluencer: async (data: Omit<Influencer, 'id'>): Promise<{ success: boolean; data: Influencer }> => {
    const res = await api.post('/api/v1/influencers/add', data);
    return res.data;
  },

  deleteInfluencer: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete('/api/v1/influencers/' + id);
    return res.data;
  },

  generatePitch: async (influencerId: string, style?: string): Promise<{ success: boolean; pitch: string }> => {
    const res = await api.post('/api/v1/influencers/' + influencerId + '/generate-pitch', { style });
    return res.data;
  },

  createCampaign: async (influencerId: string, message: string, budget: number = 0, deliverables: string[] = []): Promise<{ success: boolean; data: Campaign }> => {
    const res = await api.post('/api/v1/influencers/campaigns', { influencer_id: influencerId, message, budget, deliverables });
    return res.data;
  },

  getCampaigns: async (): Promise<{ success: boolean; data: Campaign[] }> => {
    const res = await api.get('/api/v1/influencers/campaigns');
    return res.data;
  },

  getCampaignDashboard: async (campaignId: string): Promise<{ success: boolean; data: any }> => {
    const res = await api.get('/api/v1/influencers/campaigns/' + campaignId + '/dashboard');
    return res.data;
  },

  getCampaignInsights: async (campaignId: string): Promise<{ success: boolean; data: { insights: string; recommendations: string } }> => {
    const res = await api.get('/api/v1/influencers/campaigns/' + campaignId + '/insights');
    return res.data;
  },

  toggleShortlist: async (influencerId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/api/v1/influencers/' + influencerId + '/shortlist');
    return res.data;
  },

  getShortlist: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await api.get('/api/v1/influencers/shortlist');
    return res.data;
  },

  // --- INFLUENCER SIDE ---
  getMyProfile: async (): Promise<{ success: boolean; data: InfluencerProfile | null }> => {
    const res = await api.get('/api/v1/influencer/profile/me');
    return res.data;
  },

  updateMyProfile: async (data: InfluencerProfile): Promise<{ success: boolean; data: InfluencerProfile }> => {
    const res = await api.put('/api/v1/influencer/profile/me', data);
    return res.data;
  },
  
  addPortfolioItem: async (data: any): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/api/v1/influencer/profile/me/portfolio', data);
    return res.data;
  },
  getBusinessApplications: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await api.get('/api/v1/business/collaborations/applications');
    return res.data;
  },

  updateApplicationStatus: async (appId: string, status: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.put('/api/v1/business/collaborations/applications/' + appId + '/status', { status });
    return res.data;
  },

  getBusinessCollaborations: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await api.get('/api/v1/business/collaborations');
    return res.data;
  },

  // --- MARKETPLACE ---
  getMarketplaceCampaigns: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await api.get('/api/v1/influencer/marketplace/campaigns');
    return res.data;
  },

  applyForCampaign: async (campaignId: string, message: string, proposedPrice?: number): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/api/v1/influencer/marketplace/campaigns/' + campaignId + '/apply', { message, proposed_price: proposedPrice });
    return res.data;
  },

  getMyApplications: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await api.get('/api/v1/influencer/marketplace/applications');
    return res.data;
  },
  // --- CONTENT SUBMISSION ---
  submitContent: async (collabId: string, payload: any): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/api/v1/influencer/content/' + collabId, payload);
    return res.data;
  },

  updateLiveUrl: async (submissionId: string, liveUrl: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.put('/api/v1/influencer/content/' + submissionId + '/live-url', { live_url: liveUrl });
    return res.data;
  },

  getMySubmissions: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await api.get('/api/v1/influencer/content');
    return res.data;
  },

  getCollaborationSubmissions: async (collabId: string): Promise<{ success: boolean; data: any[] }> => {
    const res = await api.get('/api/v1/business/collaborations/' + collabId + '/submissions');
    return res.data;
  },

  reviewSubmission: async (submissionId: string, status: string, feedback: string = ""): Promise<{ success: boolean; message: string }> => {
    const res = await api.put('/api/v1/business/collaborations/submissions/' + submissionId + '/review', { status, feedback });
    return res.data;
  },
  // --- EARNINGS ---
  getMyEarnings: async (): Promise<{ success: boolean; data: any }> => {
    const res = await api.get('/api/v1/influencer/earnings');
    return res.data;
  }
};

export default influencerService;




