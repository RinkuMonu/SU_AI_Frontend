import api from "@/lib/api";

export interface GenerateImageRequest {
  prompt: string;
  product_id?: string;
  reference_images?: string[];
  additional_instruction?: string;
}

export interface GenerateImageResponse {
  success: boolean;
  message?: string;
  data?: {
    image_url: string;
  };
}

export const imageService = {
  async generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    const response = await api.post("/api/v1/ai/image", request);
    return response.data;
  },
};
