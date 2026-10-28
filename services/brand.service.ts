import api from "@/lib/api";

import {
  BrandKit,
  BrandCreate,
  BrandUpdate,
  AILogoGenerateRequest,
  AILogoGenerateResponse,
} from "@/types/brand";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getBrandKit = async (): Promise<BrandKit | null> => {
  try {
    try {
      const meRes = await api.get<any>("/api/v1/brands/me");
      if (meRes.data?.brand) {
        return meRes.data.brand as BrandKit;
      }
      if (meRes.data?.data) {
        return meRes.data.data as BrandKit;
      }
      if (meRes.data) {
        return meRes.data as BrandKit;
      }
    } catch (_) {}

    const response = await api.get<any>("/api/v1/brands");
    if (response.data?.brand) return response.data.brand as BrandKit;
    return (response.data?.data || response.data) as BrandKit;
  } catch {
    return null;
  }
};

export const createBrandKit = async (data: BrandCreate | any): Promise<BrandKit> => {
  try {
    const response = await api.post<ApiResponse<BrandKit>>("/api/v1/brands", data);
    return (response.data?.data || response.data) as BrandKit;
  } catch (err: any) {
    // Try fallback endpoint /api/v1/brands/submit-kit if needed
    const response = await api.post<ApiResponse<BrandKit>>("/api/v1/brands/submit-kit", data);
    return (response.data?.data || response.data) as BrandKit;
  }
};

export const updateBrandKit = async (data: BrandUpdate | any): Promise<BrandKit> => {
  try {
    const response = await api.put<ApiResponse<BrandKit>>("/api/v1/brands", data);
    return (response.data?.data || response.data) as BrandKit;
  } catch (err: any) {
    // If update fails because record doesn't exist yet, fallback to create
    return await createBrandKit(data);
  }
};

export const submitBrandKit = async (data: any): Promise<BrandKit> => {
  const response = await api.post<ApiResponse<BrandKit>>("/api/v1/brands/submit-kit", data);
  return (response.data?.data || response.data) as BrandKit;
};

export const uploadBrandLogo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<any>("/api/v1/brands/upload-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return (
    response.data?.data?.logo_url ||
    response.data?.logo_url ||
    response.data?.data?.url ||
    response.data?.url ||
    ""
  );
};

export const generateBrandLogo = async (
  data: AILogoGenerateRequest
): Promise<AILogoGenerateResponse> => {
  const response = await api.post<ApiResponse<AILogoGenerateResponse>>(
    "/api/v1/brands/generate-logo",
    data
  );
  return response.data?.data || (response.data as any);
};

