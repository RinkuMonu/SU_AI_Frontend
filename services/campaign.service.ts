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
    } catch (e) {
      console.warn("Campaign API failed, returning mock data");
      return { data: [] };
    }
  },

  async generateAdCopy(campaignId: string, context?: { name: string, goal: string, audience: string }): Promise<{ data: string }> {
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!groqKey) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { data: "Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local to see dynamic AI generated content!" };
    }

    try {
      const prompt = context 
        ? `Write a short, engaging ad copy for a marketing campaign.\nCampaign Name: ${context.name}\nGoal: ${context.goal}\nTarget Audience: ${context.audience}\nKeep it under 3 sentences, use emojis, and be highly persuasive.`
        : `Write a short, engaging ad copy for a marketing campaign. Keep it under 3 sentences, use emojis, and be highly persuasive.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_GROQ_MODEL || "llama3-8b-8192",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate from Groq");
      }

      const json = await response.json();
      return { data: json.choices[0].message.content };
    } catch (e) {
      console.error(e);
      return { data: "Failed to generate dynamic copy. Ensure your Groq API key is valid." };
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