import { Campaign, GenerateCampaignRequest } from '@/types/campaign';
import api from '@/lib/api';

export const campaignService = {
  async generateCampaign(request: GenerateCampaignRequest): Promise<{ data: Campaign }> {
    const response = await api.post('/api/v1/campaigns', request);
    return { data: response.data.data };
  },

  async getCampaigns(): Promise<{ data: Campaign[] }> {
    try {
      const response = await api.get('/api/v1/campaigns');
      return { data: response.data.data };
    } catch (e: any) {
      if (e?.response?.status !== 401 && e?.response?.status !== 404) {
        console.warn("Campaign API failed, returning mock data");
      }
      return { data: [] };
    }
  },

  async generateAdCopy(campaignId: string, context?: { name: string, goal: string, audience: string }): Promise<{ data: string }> {
    try {
      const response = await api.post(`/api/v1/campaigns/${campaignId}/ad-copy`, context || {});
      return { data: response.data.data };
    } catch (e) {
      console.error("Ad copy generation error:", e);
      return { data: "Discover our exclusive offers tailored just for you! ✨ Tap to explore now." };
    }
  },
  
  async getCampaign(id: string): Promise<{ data: Campaign }> {
    const response = await api.get(`/api/v1/campaigns/${id}`);
    return { data: response.data.data };
  },

  async updateCampaign(id: string, request: Partial<Campaign>): Promise<{ data: Campaign }> {
    const response = await api.put(`/api/v1/campaigns/${id}`, request);
    return { data: response.data.data };
  },

  async deleteCampaign(id: string): Promise<void> {
    await api.delete(`/api/v1/campaigns/${id}`);
  }
};