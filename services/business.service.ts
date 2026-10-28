import api from '@/lib/api';
import { Business } from '@/types';

export interface BusinessCreateRequest {
  name: string;
  category?: string;
  location?: string;
  website?: string;
  instagram?: string;
  target_customer?: string;
  preferred_language?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
  logo_url?: string;
  [key: string]: any;
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
  logo_url?: string;
  [key: string]: any;
}

export const businessService = {
  createBusiness: async (data: any): Promise<Business> => {
    try {
      const bName = data.name || data.business_name || data.businessName || "My Business";
      const payload = {
        ...data,
        name: bName,
        businessName: bName,
        business_name: bName,
        category: data.category || data.business_category || data.industry || "General",
        location: data.location || data.city || "India",
        businessType: data.businessType || data.business_type || "Retail",
        preferredLanguage: data.preferredLanguage || data.preferred_language || "hinglish",
        targetAudience: data.targetAudience || data.target_location || data.target_customer || "Local",
      };
      const response = await api.post('/api/v1/businesses/', payload);
      return response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error('Unable to create your business. Please try again.');
    }
  },

  getMyBusiness: async (): Promise<Business | null> => {
    try {
      const response = await api.get('/api/v1/businesses/me');
      const b = response.data?.data || response.data;
      return b && (b.id || b.name || b.business_name) ? b : null;
    } catch (error: any) {
      return null;
    }
  },

  updateBusiness: async (data: BusinessUpdateRequest | any): Promise<Business> => {
    try {
      const response = await api.put('/api/v1/businesses/me', data);
      return response.data?.data || response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return await businessService.createBusiness(data);
      }
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
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

