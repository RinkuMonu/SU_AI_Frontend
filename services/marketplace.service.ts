import api from '@/lib/api';

export interface InfluencerSocialPlatform {
  platform: string;
  username?: string;
  url?: string;
  followers: number;
  engagement_rate?: number;
}

export interface MarketplaceInfluencer {
  id: string;
  user_id?: string;
  fullName: string;
  username: string;
  email?: string;
  niche: string;
  category: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  location: string;
  profile_image?: string;
  is_verified: boolean;
  follower_count: number;
  engagement_rate: number;
  expectedPricePerPost?: number;
  connected_platforms: string[];
  platforms_data: InfluencerSocialPlatform[];
  collaboration_info?: string;
}

export interface PlatformServiceFee {
  service_fee: number;
  currency: string;
  tax_percentage: number;
  tax_amount: number;
  total_fee: number;
  fee_description: string;
}

export interface HiringRequestPayload {
  influencer_id: string;
  campaign_name: string;
  product_or_service: string;
  campaign_objectives: string;
  deliverables: string[];
  social_platform?: string;
  start_date?: string;
  end_date?: string;
  proposed_compensation: number;
  revision_requirements?: string;
  special_instructions?: string;
  business_name?: string;
}

export interface HiringRequest {
  id: string;
  hiring_request_id: string;
  hirer_id: string;
  business_id: string;
  business_name: string;
  hirer_name: string;
  hirer_email: string;
  influencer_id: string;
  influencer_user_id: string;
  influencer_name: string;
  influencer_username: string;
  campaign_name: string;
  product_or_service: string;
  campaign_objectives: string;
  deliverables: string[];
  social_platform: string;
  start_date: string;
  end_date: string;
  proposed_compensation: number;
  platform_fee: number;
  platform_fee_tax: number;
  total_platform_fee: number;
  total_payable: number;
  revision_requirements: string;
  special_instructions?: string;
  status: string;
  fee_paid?: boolean;
  hire_fee_paid?: boolean;
  chat_active?: boolean;
  payment_id?: string;
  order_id?: string;
  payment_status?: string;
  agreement_number?: string;
  agreement_version?: string;
  agreement_status?: string;
  hirer_signed?: boolean;
  influencer_signed?: boolean;
  hirer_signature_hash?: string;
  influencer_signature_hash?: string;
  hirer_signed_at?: string;
  influencer_signed_at?: string;
  submitted_deliverables?: any;
  review_notes?: string;
  admin_approval?: {
    status: string;
    reviewed_by?: string;
    reviewed_at?: string;
    notes?: string;
  };
  admin_reviewed?: boolean;
  admin_review_decision?: string;
  rejection_reason?: string;
  audit_trail: any[];
  created_at: string;
  updated_at: string;
}

export interface AgreementSignatureInfo {
  signed: boolean;
  signer_name?: string;
  signer_title?: string;
  signed_at?: string;
  ip_address?: string;
  signature_hash?: string;
  digest?: string;
  signature_image?: string;
}

export interface AgreementDocument {
  id?: string;
  _id?: string;
  agreement_number: string;
  hiring_request_id: string;
  version: string;
  title: string;
  hirer_party: {
    user_id?: string;
    legal_name?: string;
    business_name?: string;
    email?: string;
    role?: string;
  };
  influencer_party: {
    user_id?: string;
    legal_name?: string;
    username?: string;
    role?: string;
  };
  campaign_details?: {
    campaign_name?: string;
    product_or_service?: string;
    campaign_objectives?: string;
    deliverables?: string[];
    social_platform?: string;
    start_date?: string;
    end_date?: string;
  };
  scope_of_work?: any;
  financial_terms: {
    agreed_compensation?: number;
    creator_compensation?: number;
    platform_service_fee?: number;
    gst_amount?: number;
    total_deal_value?: number;
    currency?: string;
    payment_schedule?: string;
  };
  legal_clauses: Array<{ clause_title: string; clause_text: string }>;
  signatures: {
    hirer: AgreementSignatureInfo;
    influencer: AgreementSignatureInfo;
  };
  admin_approval?: {
    status: string;
    reviewed_by?: string;
    admin_id?: string;
    reviewed_at?: string;
    notes?: string;
  };
  rejection_reason?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  hiring_request_id: string;
  sender_id: string;
  sender_name: string;
  sender_role?: string;
  message: string;
  attachments?: any[];
  timestamp: string;
  read: boolean;
}

export const marketplaceService = {
  // Discovery
  discover: async (params?: {
    search?: string;
    platform?: string;
    min_followers?: number;
    max_followers?: number;
    location?: string;
    niche?: string;
    min_engagement?: number;
    is_verified?: boolean;
    sort_by?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { items: MarketplaceInfluencer[]; pagination: any } }> => {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        if (params.search) searchParams.append('search', params.search);
        if (params.platform && params.platform !== 'all') searchParams.append('platform', params.platform);
        if (params.min_followers) searchParams.append('min_followers', params.min_followers.toString());
        if (params.max_followers) searchParams.append('max_followers', params.max_followers.toString());
        if (params.location && params.location !== 'all') searchParams.append('location', params.location);
        if (params.niche && params.niche !== 'all') searchParams.append('niche', params.niche);
        if (params.min_engagement) searchParams.append('min_engagement', params.min_engagement.toString());
        if (params.is_verified !== undefined) searchParams.append('is_verified', params.is_verified.toString());
        if (params.sort_by) searchParams.append('sort_by', params.sort_by);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
      }
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      try {
        const res = await api.get(`/api/v1/marketplace/discover${query}`);
        if (res.data?.data) return res.data;
      } catch {
        // Fallback to influencers endpoint if marketplace route is not mounted
        try {
          const infRes = await api.get(`/api/v1/influencers/discover${query}`);
          if (infRes.data?.data && Array.isArray(infRes.data.data)) {
            const mappedItems: MarketplaceInfluencer[] = infRes.data.data.map((inf: any) => {
              const cleanUsername = (inf.username || "creator").replace(/^@+/, "");
              const cleanLocation = inf.location && !inf.location.toLowerCase().includes("none") && !inf.location.toLowerCase().includes("null") ? inf.location : "";
              const realFollowers = (inf.follower_count !== undefined && inf.follower_count !== null) ? Number(inf.follower_count) : 0;
              const realEngagement = (inf.engagement_rate !== undefined && inf.engagement_rate !== null) ? Number(inf.engagement_rate) : 0.0;
              const realPrice = (inf.expectedPricePerPost !== undefined && inf.expectedPricePerPost !== null) ? Number(inf.expectedPricePerPost) : 5000;
              return {
                id: inf.id,
                user_id: inf.user_id,
                fullName: inf.fullName || cleanUsername.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
                username: cleanUsername,
                email: inf.email,
                niche: inf.category || inf.niche || "Fashion",
                category: inf.category || inf.niche || "Fashion",
                bio: inf.bio,
                location: cleanLocation,
                profile_image: inf.profile_image,
                is_verified: inf.is_verified !== undefined ? inf.is_verified : true,
                follower_count: realFollowers,
                engagement_rate: realEngagement,
                expectedPricePerPost: realPrice,
                connected_platforms: inf.connected_platforms && inf.connected_platforms.length > 0 ? inf.connected_platforms : ["instagram"],
                platforms_data: [
                  {
                    platform: "instagram",
                    username: cleanUsername,
                    followers: realFollowers,
                    engagement_rate: realEngagement,
                  }
                ]
              };
            });
            return {
              success: true,
              data: {
                items: mappedItems,
                pagination: { total: mappedItems.length, page: 1, limit: 12, total_pages: 1 }
              }
            };
          }
        } catch {
          // Silently return empty items
        }
      }
      return { success: false, data: { items: [], pagination: { total: 0, page: 1, limit: 12, total_pages: 1 } } };
    } catch {
      return { success: false, data: { items: [], pagination: { total: 0, page: 1, limit: 12, total_pages: 1 } } };
    }
  },

  // Platform Service Fee
  getCategories: async (): Promise<{ success: boolean; data: string[] }> => {
    try {
      const res = await api.get('/api/v1/marketplace/categories');
      return res.data;
    } catch {
      return { success: true, data: [] };
    }
  },

  getServiceFee: async (): Promise<{ success: boolean; data: PlatformServiceFee }> => {
    try {
      const res = await api.get('/api/v1/marketplace/service-fee');
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          service_fee: 200,
          currency: 'INR',
          tax_percentage: 18,
          tax_amount: 36,
          total_fee: 236,
          fee_description: 'Platform Escrow & Contract Protection Fee (₹200 base + 18% GST)'
        }
      };
    }
  },

  // Hiring Requests
  createHiringRequest: async (payload: HiringRequestPayload): Promise<{ success: boolean; data: HiringRequest; message?: string }> => {
    const res = await api.post('/api/v1/marketplace/hiring', payload);
    return res.data;
  },

  getMyHiringRequests: async (status?: string): Promise<{ success: boolean; data: HiringRequest[] }> => {
    try {
      const query = status && status !== 'all' ? `?status=${status}` : '';
      const res = await api.get(`/api/v1/marketplace/hiring${query}`);
      return res.data;
    } catch {
      return { success: true, data: [] };
    }
  },

  getHiringRequestDetail: async (requestId: string): Promise<{ success: boolean; data: HiringRequest }> => {
    const res = await api.get(`/api/v1/marketplace/hiring/${requestId}`);
    return res.data;
  },

  respondToHiringRequest: async (requestId: string, action: 'accept' | 'reject', note?: string): Promise<{ success: boolean; message: string; hiring_request?: HiringRequest }> => {
    const res = await api.put(`/api/v1/marketplace/hiring/${requestId}/respond`, { action, note });
    return res.data;
  },

  makeAgreement: async (requestId: string): Promise<{ success: boolean; message: string; hiring_request?: HiringRequest; agreement?: AgreementDocument }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/make-agreement`);
    return res.data;
  },

  // Agreement
  getAgreement: async (requestId: string): Promise<{ success: boolean; data: AgreementDocument }> => {
    const res = await api.get(`/api/v1/marketplace/hiring/${requestId}/agreement`);
    return res.data;
  },

  signAgreement: async (requestId: string, payload: { signer_name: string; declaration_accepted: boolean; signer_title?: string; signature_image?: string }): Promise<{ success: boolean; message: string; is_fully_signed?: boolean; agreement?: AgreementDocument }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/sign-agreement`, payload);
    return res.data;
  },

  downloadAgreementPdf: async (requestId: string): Promise<Blob> => {
    const res = await api.get(`/api/v1/marketplace/hiring/${requestId}/agreement/pdf`, {
      responseType: 'blob'
    });
    return res.data;
  },

  downloadAgreementPdfByNumber: async (agreementNumber: string): Promise<Blob> => {
    const res = await api.get(`/api/v1/marketplace/agreements/${agreementNumber}/pdf`, {
      responseType: 'blob'
    });
    return res.data;
  },

  getAllAgreements: async (status?: string): Promise<{ success: boolean; data: AgreementDocument[] }> => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get(`/api/v1/marketplace/agreements${query}`);
    return res.data;
  },

  listMyAgreements: async (status?: string): Promise<{ success: boolean; data: AgreementDocument[] }> => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get(`/api/v1/marketplace/agreements${query}`);
    return res.data;
  },

  declineAgreement: async (requestId: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/decline-agreement`, { reason });
    return res.data;
  },

  getAgreementAudit: async (requestId: string): Promise<{ success: boolean; data: any }> => {
    const res = await api.get(`/api/v1/marketplace/hiring/${requestId}/agreement/audit`);
    return res.data;
  },

  // Payment
  createPaymentOrder: async (requestId: string): Promise<{ success: boolean; data: any }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/payment/create`);
    return res.data;
  },

  verifyPaymentOrder: async (requestId: string, payload: { order_id: string; payment_id?: string; signature?: string }): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/payment/verify`, payload);
    return res.data;
  },

  // Chat
  getChatRoom: async (requestId: string): Promise<{ success: boolean; data: any }> => {
    const res = await api.get(`/api/v1/marketplace/hiring/${requestId}/chat`);
    return res.data;
  },

  getMessages: async (requestId: string): Promise<{ success: boolean; data: ChatMessage[] }> => {
    const res = await api.get(`/api/v1/marketplace/hiring/${requestId}/messages`);
    return res.data;
  },

  sendMessage: async (requestId: string, message: string, attachments?: any[]): Promise<{ success: boolean; data: ChatMessage }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/messages`, { message, attachments });
    return res.data;
  },

  // Deliverables
  submitDeliverables: async (requestId: string, payload: { live_links: string[]; attachments?: any[]; notes?: string }): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/submit-deliverables`, payload);
    return res.data;
  },

  reviewDeliverables: async (requestId: string, payload: { action: 'approve' | 'request_revision' | 'dispute'; review_notes?: string; dispute_reason?: string }): Promise<{ success: boolean; message: string; status?: string }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/review-deliverables`, payload);
    return res.data;
  },

  // Zaakpay Influencer Hiring Fee (₹200)
  payHireFee: async (requestId: string): Promise<{ success: boolean; order_id: string; payment_url: string; amount: number; message?: string }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/pay-hire-fee`);
    return res.data;
  },

  verifyHirePayment: async (requestId: string, payload: { order_id: string; payment_id?: string }): Promise<{ success: boolean; message: string; data?: any }> => {
    const res = await api.post(`/api/v1/marketplace/hiring/${requestId}/verify-hire-fee`, payload);
    return res.data;
  },

  // Creator Earnings
  getEarningsLedger: async (): Promise<{ success: boolean; data: any }> => {
    const res = await api.get('/api/v1/marketplace/earnings');
    return res.data;
  },

  // Admin
  getAdminOverview: async (): Promise<{ success: boolean; data: any }> => {
    const res = await api.get('/api/v1/marketplace/admin/overview');
    return res.data;
  },

  getAdminHiringRequests: async (status?: string): Promise<{ success: boolean; data: HiringRequest[] }> => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get(`/api/v1/marketplace/admin/hiring-requests${query}`);
    return res.data;
  },

  adminResolveDispute: async (requestId: string, payload: { action: 'favor_hirer' | 'favor_influencer' | 'mutual_cancel'; resolution_notes: string }): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(`/api/v1/marketplace/admin/hiring-requests/${requestId}/resolve-dispute`, payload);
    return res.data;
  },

  adminReviewAgreement: async (requestId: string, payload: { action: 'approve' | 'reject' | 'request_changes'; notes?: string }): Promise<{ success: boolean; message: string; status: string; admin_approval: any }> => {
    const res = await api.post(`/api/v1/marketplace/admin/hiring-requests/${requestId}/review-agreement`, payload);
    return res.data;
  },

  // Creator Wallet APIs
  getWallet: async (): Promise<{ success: boolean; data: any }> => {
    const res = await api.get('/api/v1/marketplace/wallet');
    return res.data;
  },

  adminReleasePayoutToWallet: async (requestId: string, notes?: string): Promise<{ success: boolean; message: string; credited_amount?: number; wallet_balance?: number; transaction_id?: string }> => {
    const res = await api.post(`/api/v1/marketplace/admin/hiring-requests/${requestId}/release-payout-to-wallet${notes ? `?notes=${encodeURIComponent(notes)}` : ''}`);
    return res.data;
  }
};

export default marketplaceService;