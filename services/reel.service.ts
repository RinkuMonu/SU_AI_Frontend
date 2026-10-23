import { 
  GenerateReelRequest, 
  ReelGenerationResponse, 
  ReelJobStatus, 
  Reel 
} from '@/types/reel';
import api from "@/lib/api";

export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  subcategories?: {
    id: string;
    name: string;
    productTypes?: string[];
    subcategory_id?: string;
  }[];
}

export interface EnhanceImagePayload {
  image_url: string;
  prompt?: string;
  product_name?: string;
  category?: string;
  skip_enhancement?: boolean;
}

export interface EnhanceImageResult {
  success: boolean;
  original_image_url: string;
  enhanced_image_url: string;
  enhanced: boolean;
  message?: string;
  provider?: string;
}

export const reelService = {
  // ──────────────────────────────────────────────
  // Category & Taxonomy API
  // ──────────────────────────────────────────────
  async getCategories(query?: string): Promise<{ success: boolean; data: CategoryItem[] }> {
    try {
      const url = query ? `/api/v1/content/reels/categories?q=${encodeURIComponent(query)}` : '/api/v1/content/reels/categories';
      const response = await api.get(url);
      return response.data;
    } catch (err) {
      console.warn("Categories API unavailable, falling back to local taxonomy", err);
      return { success: false, data: [] };
    }
  },

  async getSubcategories(categoryId?: string): Promise<{ success: boolean; data: any[] }> {
    try {
      const url = categoryId 
        ? `/api/v1/content/reels/subcategories?category_id=${encodeURIComponent(categoryId)}`
        : '/api/v1/content/reels/subcategories';
      const response = await api.get(url);
      return response.data;
    } catch (err) {
      console.warn("Subcategories API unavailable", err);
      return { success: false, data: [] };
    }
  },

  async searchProducts(query: string): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await api.get(`/api/v1/content/reels/products/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (err) {
      console.warn("Product search API unavailable", err);
      return { success: false, data: [] };
    }
  },

  async getProductsByCategory(categoryId?: string): Promise<{ success: boolean; data: any[] }> {
    try {
      const url = categoryId 
        ? `/api/v1/content/reels/products?category_id=${encodeURIComponent(categoryId)}`
        : '/api/v1/content/reels/products';
      const response = await api.get(url);
      return response.data;
    } catch (err) {
      console.warn("Products by category API unavailable", err);
      return { success: false, data: [] };
    }
  },

  // ──────────────────────────────────────────────
  // Asset Uploads
  // ──────────────────────────────────────────────
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/api/v1/content/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data?.image_url) {
        return response.data.image_url;
      }
    } catch (err) {
      console.warn("Reels upload-image endpoint failed, attempting fashion upload fallback:", err);
      try {
        const fallbackRes = await api.post('/api/v1/fashion/products/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (fallbackRes.data?.image_url) {
          return fallbackRes.data.image_url;
        }
      } catch (fErr) {
        console.warn("Fashion upload fallback failed, using FileReader DataURL:", fErr);
      }
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  },

  async uploadAudio(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/api/v1/content/upload-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data?.audio_url) {
        return response.data.audio_url;
      }
    } catch (err) {
      console.warn("Upload audio API fallback to local URL", err);
    }

    return URL.createObjectURL(file);
  },

  // ──────────────────────────────────────────────
  // AI Image Enhancement
  // ──────────────────────────────────────────────
  async enhanceImage(payload: EnhanceImagePayload): Promise<EnhanceImageResult> {
    try {
      const response = await api.post('/api/v1/content/reels/enhance-image', payload);
      return response.data;
    } catch (err: any) {
      console.warn("Enhance image API error:", err);
      return {
        success: false,
        original_image_url: payload.image_url,
        enhanced_image_url: payload.image_url,
        enhanced: false,
        message: err?.response?.data?.detail || err?.message || "Failed to enhance image"
      };
    }
  },

  // ──────────────────────────────────────────────
  // Reel Generation & Status Management
  // ──────────────────────────────────────────────
  async generateReel(request: GenerateReelRequest): Promise<ReelGenerationResponse> {
    const response = await api.post("/api/v1/content/generate-reel", request);
    return response.data;
  },

  async getReelStatus(jobId: string): Promise<ReelJobStatus> {
    const response = await api.get(`/api/v1/content/reel/${jobId}/status`);
    return response.data;
  },

  async retryReel(jobId: string): Promise<{ success: boolean; job_id: string; message: string }> {
    const response = await api.post(`/api/v1/content/reel/${jobId}/retry`);
    return response.data;
  },

  async getReels(): Promise<{ data: Reel[] }> {
    const response = await api.get("/api/v1/content/reels");
    return response.data;
  },

  async getReel(reelId: string): Promise<{ data: Reel }> {
    const response = await api.get(`/api/v1/content/reel/${reelId}`);
    return response.data;
  },

  async deleteReel(reelId: string): Promise<void> {
    await api.delete(`/api/v1/content/reel/${reelId}`);
  }
};
