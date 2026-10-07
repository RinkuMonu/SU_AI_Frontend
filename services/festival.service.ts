import api from "@/lib/api";

export interface FestivalAssetContent {
  headline?: string;
  body?: string;
  image_prompt?: string;
  hook?: string;
  script?: string;
  voiceover?: string;
  cta?: string;
  message?: string;
  primary_text?: string;
  concept?: string;
  scenes?: any[];
  on_screen_text?: string;
  caption?: string;
  description?: string;
  hashtags?: string;
  post_copy?: string;
  title?: string;
  duration?: string;
  reel?: any;
  post?: any;
}

export interface FestivalAsset {
  id: string;
  type: "post" | "reel" | "ad" | "whatsapp" | "content";
  platform: string;
  day: number;
  scheduled_date: string;
  content: FestivalAssetContent;
}

export interface FestivalCampaign {
  id: string;
  festival_name: string;
  festival_emoji: string;
  festival_date: string;
  days_left: number;
  status: "draft" | "approved" | "active";
  offer_strategy: string;
  assets: FestivalAsset[];
  created_at: string;
}

export interface UpcomingFestival {
  name: string;
  date: string;
  emoji: string;
  days_left: number;
}

const festivalService = {
  async getUpcoming(): Promise<{
    upcoming_festivals: UpcomingFestival[];
    campaigns: FestivalCampaign[];
  }> {
    const res = await api.get("/api/v1/festivals/upcoming");
    return res.data?.data || { upcoming_festivals: [], campaigns: [] };
  },


  async generateReel(festivalName: string): Promise<any> {
    const encoded = encodeURIComponent(festivalName);
    const res = await api.post(`/api/v1/festivals/${encoded}/generate-reel`);
    return res.data?.data || null;
  },

  async generatePost(festivalName: string): Promise<any> {
    const encoded = encodeURIComponent(festivalName);
    const res = await api.post(`/api/v1/festivals/${encoded}/generate-post`);
    return res.data?.data || null;
  },

  async generateAllContent(festivalName: string): Promise<any> {
    const encoded = encodeURIComponent(festivalName);
    const res = await api.post(`/api/v1/festivals/${encoded}/generate-all-content`);
    return res.data?.data || null;
  },

  async generateCampaign(festivalName: string): Promise<FestivalCampaign | null> {

    const encoded = encodeURIComponent(festivalName);
    const res = await api.post(`/api/v1/festivals/generate/?festival_name=${encoded}`);
    return res.data?.data || null;
  },

  async approveCampaign(campaignId: string): Promise<{ message: string }> {
    const res = await api.post(`/api/v1/festivals/${campaignId}/approve`);
    return res.data;
  },


  async saveDraft(campaignId: string): Promise<{ message: string }> {
    const res = await api.post(`/api/v1/festivals/${campaignId}/save-draft`, {});
    return res.data;
  },

  async scheduleContent(campaignId: string): Promise<{ message: string }> {
    const res = await api.post(`/api/v1/festivals/${campaignId}/schedule`, {});
    return res.data;
  },

  async publishContent(campaignId: string): Promise<{ message: string }> {
    const res = await api.post(`/api/v1/festivals/${campaignId}/publish`, {});
    return res.data;
  },

  async deleteCampaign(campaignId: string): Promise<void> {
    await api.delete(`/api/v1/festivals/${campaignId}`);
  },
};

export default festivalService;
