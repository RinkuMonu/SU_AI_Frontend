import api from '@/lib/api';
import { Business } from '@/types';

export interface BusinessCreateRequest {
  name: string;
  category: string;
  location: string;
  website?: string;
  instagram?: string;
  target_customer?: string;
  preferred_language?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

export interface BusinessUpdateRequest {
  name?: string;
  category?: string;
  location?: string;
  website?: string;
  instagram?: string;
  target_customer?: string;
  preferred_language?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

export const businessService = {
  createBusiness: async (data: any): Promise<Business> => {
    try {
      const payload = {
        ...data,
        businessName: data.businessName || data.name || "My Business",
        businessType: data.businessType || data.business_type || "Retail",
        industry: data.industry || data.category || data.business_category || "General",
        preferredLanguage: data.preferredLanguage || data.preferred_language || "hinglish",
        targetAudience: data.targetAudience || data.target_location || data.target_customer || "Local",
      };
      const response = await api.post('/api/v1/businesses/', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to create your business. Please try again.');
    }
  },

  getMyBusiness: async (): Promise<Business> => {
    try {
      const response = await api.get('/api/v1/businesses/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to fetch your business.');
    }
  },

  updateBusiness: async (data: BusinessUpdateRequest): Promise<Business> => {
    try {
      const response = await api.put('/api/v1/businesses/me', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to save your business information. Please try again.');
    }
  },

  deleteBusiness: async (): Promise<void> => {
    try {
      await api.delete('/api/v1/businesses/me');
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to delete your business. Please try again.');
    }
  }
};
