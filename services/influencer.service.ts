import api from '@/lib/api';

export interface Influencer {
  id: string;
  name: string;
  platform: string;
  niche: string;
  followers_count: number;
  engagement_rate: number;
  contact_email: string;
  avatar_url?: string;
}

export interface Campaign {
  id: string;
  business_id: string;
  influencer_id: string;
  status: string;
  ai_pitch_message: string;
  budget: number;
  created_at?: string;
}

const influencerService = {
  discover: async (): Promise<{ success: boolean; data: Influencer[] }> => {
    const res = await api.get('/api/v1/influencers/discover');
    return res.data;
  },

  addInfluencer: async (data: Omit<Influencer, 'id'>): Promise<{ success: boolean; data: Influencer }> => {
    const res = await api.post('/api/v1/influencers/add', data);
    return res.data;
  },

  generatePitch: async (influencerId: string): Promise<{ success: boolean; pitch: string }> => {
    const res = await api.post('/api/v1/influencers/' + influencerId + '/generate-pitch');
    return res.data;
  },

  createCampaign: async (influencerId: string, message: string, budget: number = 0): Promise<{ success: boolean; data: Campaign }> => {
    const res = await api.post('/api/v1/influencers/campaigns', { influencer_id: influencerId, message, budget });
    return res.data;
  },

  getCampaigns: async (): Promise<{ success: boolean; data: Campaign[] }> => {
    const res = await api.get('/api/v1/influencers/campaigns');
    return res.data;
  }
};

export default influencerService;
