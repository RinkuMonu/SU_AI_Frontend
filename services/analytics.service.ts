import api from "@/lib/api";
import { AnalyticsApiResponse, AnalyticsData } from "@/types/analytics";

export const analyticsService = {
  getAnalyticsOverview: async (range: 7 | 30 | 90): Promise<AnalyticsData> => {
    try {
      const res = await api.get<AnalyticsApiResponse>(`/api/v1/analytics/overview?range=${range}d`);
      return res.data.data;
    } catch (error) {
      console.warn("Analytics API failed, returning mock data");
      return {
        content: { posts: 12, reels: 5 },
        ai_usage: { total_generations: 45 },
        marketing_score: { score: 85 }
      } as AnalyticsData;
    }
  },
};
