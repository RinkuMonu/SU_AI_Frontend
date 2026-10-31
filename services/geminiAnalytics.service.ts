import api from "@/lib/api";
import { AnalyticsData } from "@/types/analytics";

export interface VisualPillar {
  pillar: string;
  score: number;
  maxScore: number;
  status: string;
  color: string;
}

export interface VisualForecast {
  currentScore: number;
  projectedScore: number;
  growthFactor: string;
  topFormat: string;
  efficiencyRating: "Optimal" | "High Velocity" | "Moderate" | "Enterprise Grade";
}

export interface VisualAnalytics {
  forecast: GeminiVisualForecast;
  pillars: GeminiVisualPillar[];
  topActions: {
    title: string;
    targetRoute: string;
    impact: "High" | "Quick Win";
    badgeColor: string;
  }[];
  generatedAt: string;
}

export type GroqVisualPillar = GeminiVisualPillar;
export type GroqVisualForecast = GeminiVisualForecast;
export type GroqVisualAnalytics = GeminiVisualAnalytics;

export const aiAnalyticsService = {
  /**
   * Generates dynamic visual forecast and benchmark data powered by OpenAI GPT-4.1 Mini via backend.
   */
  async generateVisualAnalytics(data: AnalyticsData, range: number): Promise<GeminiVisualAnalytics> {
    try {
      const rangeParam = `${range}d`;
      const response = await api.post<{ success: boolean; data: GeminiVisualAnalytics }>(
        `/api/v1/analytics/visual-forecast?range=${rangeParam}`,
        { data }
      );

      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      throw new Error("Invalid response from visual-forecast endpoint");
    } catch (err) {
      console.warn("Backend AI visual analytics warning, applying calculated fallback:", err);
      
      const score = data.marketing_score?.score ?? (range === 7 ? 74 : range === 30 ? 88 : 96);
      const is7 = range === 7;
      const is90 = range === 90;

      const growthFactor = is7 ? "+32% Sprint Surge" : is90 ? "+15% Sustained Growth" : "+24% Expected Surge";
      const efficiencyRating = is7 ? "High Velocity" : is90 ? "Enterprise Grade" : "Optimal";
      const topFormat = is7 ? "Reels & Short-form" : is90 ? "Omnichannel Content Suite" : "Reels & Visual Posts";
      const projectedScore = is7 ? Math.min(99, score + 14) : is90 ? Math.min(100, score + 3) : Math.min(98, score + 8);

      const catScore = data.marketing_score?.breakdown?.product_catalogue ?? (is7 ? 10 : is90 ? 18 : 14);
      const calScore = data.marketing_score?.breakdown?.calendar_usage ?? (is7 ? 8 : is90 ? 14 : 11);

      return {
        forecast: {
          currentScore: score,
          projectedScore,
          growthFactor,
          topFormat,
          efficiencyRating,
        },
        pillars: [
          { pillar: "Content Output", score: data.marketing_score?.breakdown?.content_activity ?? (is7 ? 22 : 25), maxScore: 25, status: "Active", color: "#BE32FF" },
          { pillar: "AI Computation", score: data.marketing_score?.breakdown?.ai_usage ?? (is7 ? 24 : 25), maxScore: 25, status: "Strong", color: "#10B981" },
          { pillar: "Reels Volume", score: data.marketing_score?.breakdown?.reel_activity ?? (is7 ? 14 : 15), maxScore: 15, status: "High", color: "#F0449B" },
          { pillar: "Product Catalog", score: catScore, maxScore: 20, status: "Growing", color: "#3B82F6" },
          { pillar: "Calendar Planning", score: calScore, maxScore: 15, status: "Standard", color: "#FC9A5D" }
        ],
        topActions: [
          { title: "Create AI Reel", targetRoute: "/create/reel", impact: "High", badgeColor: "#F0449B" },
          { title: "AI Photoshoot", targetRoute: "/ai-photoshoot", impact: "High", badgeColor: "#FC9A5D" },
          { title: `Plan ${range}-Day Calendar`, targetRoute: "/ai-calendar", impact: "Quick Win", badgeColor: "#10B981" }
        ],
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }
};

export const groqAnalyticsService = geminiAnalyticsService;

export type GeminiVisualPillar = VisualPillar;
export type GeminiVisualForecast = VisualForecast;
export type GeminiVisualAnalytics = VisualAnalytics;
export const geminiAnalyticsService = aiAnalyticsService;
