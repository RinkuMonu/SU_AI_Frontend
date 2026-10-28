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

export const getBrandKit = async (): Promise<BrandKit> => {
    try {
        const response = await api.get<ApiResponse<BrandKit>>(
            "/api/v1/brands"
        );
        return response.data?.data;
    } catch {
        return null as any;
    }
};

export const createBrandKit = async (
    data: BrandCreate
): Promise<BrandKit> => {
    const response = await api.post<ApiResponse<BrandKit>>(
        "/api/v1/brands",
        data
    );

    return response.data.data;
};

export const updateBrandKit = async (
    data: BrandUpdate
): Promise<BrandKit> => {
    const response = await api.put<ApiResponse<BrandKit>>(
        "/api/v1/brands",
        data
    );

    return response.data.data;
};

export const uploadBrandLogo = async (
    file: File
): Promise<string> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<
        ApiResponse<{ logo_url: string }>
    >(
        "/api/v1/brands/upload-logo",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
    );

    return response.data.data.logo_url;
};
export const generateBrandLogo = async (
    data: AILogoGenerateRequest
): Promise<AILogoGenerateResponse> => {
    const response = await api.post<ApiResponse<AILogoGenerateResponse>>(
        "/api/v1/brands/generate-logo",
        data
    );
    return response.data.data;
};
