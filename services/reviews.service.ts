import api from '@/lib/api';
import { Review } from '@/types/reviews';

export const reviewsService = {
  async getReviews(): Promise<{ data: Review[] }> {
    try {
      const res = await api.get('/api/v1/reviews');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return { data: res.data.data };
      }
      return { data: [] };
    } catch (error) {
      console.warn("Reviews API failed:", error);
      return { data: [] };
    }
  },

  async generateAiReviews(): Promise<{ data: Review[] }> {
    try {
      const res = await api.post('/api/v1/reviews/generate-ai-reviews');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return { data: res.data.data };
      }
      return { data: [] };
    } catch (error) {
      console.error("Generate AI reviews error:", error);
      throw error;
    }
  },

  async generateReply(
    reviewId: string, 
    reviewText?: string, 
    customerName?: string, 
    rating?: number
  ): Promise<{ data: string }> {
    try {
      const res = await api.post(`/api/v1/reviews/${reviewId}/generate-reply`, {
        review_text: reviewText || "",
        customer_name: customerName || "Customer",
        rating: rating || 5
      });
      return { data: res.data?.data || "Thank you for your feedback!" };
    } catch (error) {
      console.error("Generate reply error with Gemini:", error);
      return { 
        data: "Thank you so much for your valuable feedback! We truly appreciate your support and look forward to serving you again." 
      };
    }
  },

  async sendReply(reviewId: string, replyText: string): Promise<{ data: Review }> {
    try {
      const res = await api.put(`/api/v1/reviews/${reviewId}`, { 
        reply: replyText, 
        status: 'Replied' 
      });
      return { data: res.data?.data };
    } catch (error) {
      console.error("Send reply error:", error);
      throw error;
    }
  }
};
