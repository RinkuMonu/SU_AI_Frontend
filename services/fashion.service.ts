import axios from 'axios';
import { 
  FashionConfig, 
  FashionProduct, 
  GenerationHistoryItem, 
  PhotoshootRequest, 
  VirtualTryOnRequest 
} from '@/types/fashion.types';
import api from '@/lib/api';

export const FashionService = {
  // ──────────────────────────────────────────────
  // Config
  // ──────────────────────────────────────────────
  async getConfig(): Promise<FashionConfig> {
    try {
      const response = await api.get('/api/v1/fashion/config');
      return response.data?.data || response.data;
    } catch {
      return {} as FashionConfig;
    }
  },

  // ──────────────────────────────────────────────
  // Products
  // ──────────────────────────────────────────────
  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/v1/fashion/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.image_url;
  },

  async uploadPersonImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/v1/fashion/products/upload-person-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.image_url;
  },

  async createProduct(data: Partial<FashionProduct>): Promise<FashionProduct> {
    const response = await api.post('/api/v1/fashion/products', data);
    return response.data.data;
  },

  async getProducts(): Promise<FashionProduct[]> {
    try {
      const response = await api.get('/api/v1/fashion/products');
      return response.data?.data || (Array.isArray(response.data) ? response.data : []);
    } catch {
      return [];
    }
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/api/v1/fashion/products/${id}`);
  },

  // ──────────────────────────────────────────────
  // Photoshoot
  // ──────────────────────────────────────────────
  async generatePhotoshoot(data: PhotoshootRequest): Promise<{ generation_id: string, message: string }> {
    const response = await api.post('/api/v1/fashion/photoshoot/generate', data);
    return response.data;
  },

  async getPhotoshootStatus(id: string): Promise<any> {
    const response = await api.get(`/api/v1/fashion/photoshoot/${id}/status`);
    return response.data;
  },

  // ──────────────────────────────────────────────
  // Virtual Try-On
  // ──────────────────────────────────────────────
  async generateVirtualTryOn(data: VirtualTryOnRequest): Promise<{ generation_id: string, message: string }> {
    const response = await api.post('/api/v1/fashion/virtual-tryon', data);
    return response.data;
  },

  async getVirtualTryOnStatus(id: string): Promise<any> {
    const response = await api.get(`/api/v1/fashion/virtual-tryon/${id}/status`);
    return response.data;
  },

  // ──────────────────────────────────────────────
  // History & Actions
  // ──────────────────────────────────────────────
  async getHistory(type?: 'photoshoot' | 'tryon', skip: number = 0, limit: number = 20): Promise<{ data: GenerationHistoryItem[], total: number }> {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/api/v1/fashion/history?${params.toString()}`);
      return response.data || { data: [], total: 0 };
    } catch {
      return { data: [], total: 0 };
    }
  },

  async deleteGeneration(id: string, type: 'photoshoot' | 'tryon'): Promise<void> {
    await api.delete(`/api/v1/fashion/generation/${id}?generation_type=${type}`);
  },

  async useForContent(id: string, type: 'photoshoot' | 'tryon'): Promise<any> {
    const response = await api.post(`/api/v1/fashion/generation/${id}/use-for-content?generation_type=${type}`);
    return response.data;
  },

  async useForAd(id: string, type: 'photoshoot' | 'tryon'): Promise<any> {
    const response = await api.post(`/api/v1/fashion/generation/${id}/use-for-ad?generation_type=${type}`);
    return response.data;
  },

  async useForReel(id: string, type: 'photoshoot' | 'tryon'): Promise<any> {
    const response = await api.post(`/api/v1/fashion/generation/${id}/use-for-reel?generation_type=${type}`);
    return response.data;
  },
};
