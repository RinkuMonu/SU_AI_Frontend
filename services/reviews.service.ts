import api from '@/lib/api';
import { Review } from '@/types/reviews';

const generateFallbackReviews = (): Review[] => {
  return [
    {
      _id: "rev-" + Date.now() + "-1",
      customerName: "Emily Carter",
      reviewText: "I was pleasantly surprised by the friendly staff and the quick service. The coffee was strong and the pastries were fresh. Overall, a great experience!",
      rating: 5,
      status: 'Pending',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: "rev-" + Date.now() + "-2",
      customerName: "Michael Nguyen",
      reviewText: "The ambiance was cozy, but the wait time was longer than expected. I still enjoyed the menu items, but next time I'll order earlier.",
      rating: 4,
      status: 'Pending',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      _id: "rev-" + Date.now() + "-3",
      customerName: "Sarah Jenkins",
      reviewText: "Absolutely phenomenal experience! Will definitely be coming back.",
      rating: 5,
      status: 'Pending',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];
};

export const reviewsService = {
  async getReviews(): Promise<{ data: Review[] }> {
    try {
      const res = await api.get('/api/v1/reviews');
      if (res.data?.data && res.data.data.length > 0) {
        return { data: res.data.data };
      }
      // If no reviews, return dynamic fallback
      return { data: generateFallbackReviews() };
    } catch (error) {
      console.warn("Reviews API failed, using fallback");
      return { data: generateFallbackReviews() };
    }
  },

  async generateReply(reviewId: string, reviewText?: string): Promise<{ data: string }> {
    try {
      // If it's a mock review (ID starts with rev-), simulate AI response
      if (reviewId.startsWith('rev-')) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI delay
        const isDetailed = reviewText && reviewText.length > 50;
        return { 
          data: isDetailed 
            ? "Thank you so much for your detailed feedback! We're thrilled you had a great experience and look forward to serving you again."
            : "Thank you for sharing your thoughts with us. We appreciate your feedback and hope to see you again soon!" 
        };
      }
      
      const res = await api.post(`/api/v1/reviews/${reviewId}/generate-reply`);
      return { data: res.data?.data || "Thank you for your feedback!" };
    } catch (error) {
      console.error("Generate reply error:", error);
      return { data: "Thank you for your review! We truly appreciate your feedback." };
    }
  },

  async sendReply(reviewId: string, replyText: string): Promise<{ data: Review }> {
    try {
      if (reviewId.startsWith('rev-')) {
        return { 
          data: {
            _id: reviewId,
            customerName: "Customer",
            reviewText: "...",
            rating: 5,
            status: 'Replied',
            reply: replyText,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Review
        };
      }

      const res = await api.put(`/api/v1/reviews/${reviewId}`, { reply: replyText, status: 'Replied' });
      return { data: res.data?.data };
    } catch (error) {
      console.error("Send reply error:", error);
      throw error;
    }
  }
};
