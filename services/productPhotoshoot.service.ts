import api from "@/lib/api";

export interface BackendUploadedImageItem {
  image_id: string;
  url: string;
  filename: string;
  angle: string;
  file_size: number;
  dimensions: { width: number; height: number };
  content_type: string;
}

export interface BackendProductUploadResponse {
  success: boolean;
  session_id: string;
  product_category?: string;
  total_uploaded: number;
  uploaded_images: BackendUploadedImageItem[];
  message: string;
}

export interface BackendProductAnalysisData {
  product_category: string;
  product_type: string;
  main_colors: string[];
  shape_and_design: string[];
  material_and_texture: string;
  brand_logo_and_text?: string;
  product_details: string[];
  suitable_for_model: boolean;
  recommended_model_type?: string;
  recommended_styles: string[];
  confidence_notes?: string;
}

export interface BackendProductAnalysisResponse {
  success: boolean;
  session_id: string;
  analysis: BackendProductAnalysisData;
  message: string;
}

export interface BackendEnhancedImageItem {
  image_id: string;
  source_image_id: string;
  style: string;
  url: string;
  is_selected: boolean;
  created_at: string;
}

export interface BackendProductEnhanceResponse {
  success: boolean;
  session_id: string;
  total_variations: number;
  enhanced_images: BackendEnhancedImageItem[];
  message: string;
}

export interface BackendAIModelItem {
  model_id: string;
  name: string;
  gender: string;
  ethnicity: string;
  thumbnail_url: string;
  preview_url: string;
  supported_categories: string[];
  description: string;
}

export interface BackendPhotographyStyleItem {
  id: string;
  name: string;
  description: string;
  category_fit: string[];
  requires_model: boolean;
  pose?: string;
  lighting: string;
  preview_url?: string;
}

export interface BackendPreparePromptResponse {
  success: boolean;
  session_id: string;
  prepared_prompt: string;
  detected_language: string;
  workflow_summary: Record<string, any>;
  message: string;
}

export interface BackendPhotoshootGenerateResponse {
  success: boolean;
  session_id: string;
  job_id: string;
  status: string;
  estimated_time_seconds: number;
  message: string;
}

export interface BackendGeneratedImageItem {
  image_id: string;
  session_id: string;
  style_applied: string;
  url: string;
  is_saved: boolean;
  created_at: string;
}

export interface BackendJobStatusResponse {
  success: boolean;
  job_id: string;
  session_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress_percent: number;
  completed_images: number;
  total_images: number;
  result_images: BackendGeneratedImageItem[];
  error?: string;
}

export interface BackendPhotoshootResultsResponse {
  success: boolean;
  session_id: string;
  status: string;
  total_images: number;
  use_model: boolean;
  results: BackendGeneratedImageItem[];
}

export interface BackendSaveImagesResponse {
  success: boolean;
  session_id: string;
  saved_count: number;
  saved_image_ids: string[];
  message: string;
}

export class ProductPhotoshootService {
  private baseRoute = "/api/v1/product-photoshoot";

  /**
   * Upload multiple product images for a photoshoot session
   */
  async uploadImages(params: {
    files: File[];
    category?: string;
    angles?: string[];
    sessionId?: string;
  }): Promise<BackendProductUploadResponse> {
    const formData = new FormData();
    params.files.forEach((file) => {
      formData.append("files", file);
    });

    if (params.category) {
      formData.append("product_category", params.category);
    }
    if (params.sessionId) {
      formData.append("session_id", params.sessionId);
    }
    if (params.angles && params.angles.length > 0) {
      formData.append("angles", JSON.stringify(params.angles));
    }

    const response = await api.post<BackendProductUploadResponse>(
      `${this.baseRoute}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }

  /**
   * Analyze uploaded product images for visual characteristics and recommended styles
   */
  async analyzeProduct(params: {
    sessionId: string;
    imageIds?: string[];
  }): Promise<BackendProductAnalysisResponse> {
    const response = await api.post<BackendProductAnalysisResponse>(
      `${this.baseRoute}/analyze`,
      {
        session_id: params.sessionId,
        image_ids: params.imageIds,
      }
    );
    return response.data;
  }

  /**
   * Generate studio clarity & lighting enhancement variations
   */
  async enhanceImages(params: {
    sessionId: string;
    imageId?: string;
    styles?: string[];
  }): Promise<BackendProductEnhanceResponse> {
    const response = await api.post<BackendProductEnhanceResponse>(
      `${this.baseRoute}/enhance`,
      {
        session_id: params.sessionId,
        image_id: params.imageId,
        styles: params.styles,
      }
    );
    return response.data;
  }

  /**
   * Select specific enhanced images for the photoshoot
   */
  async selectEnhancedImages(params: {
    sessionId: string;
    selectedImageIds: string[];
  }): Promise<{ success: boolean; session_id: string; selected_image_ids: string[]; message: string }> {
    const response = await api.post(
      `${this.baseRoute}/${params.sessionId}/select-enhanced`,
      {
        selected_image_ids: params.selectedImageIds,
      }
    );
    return response.data;
  }

  /**
   * Fetch available AI model gallery
   */
  async getModels(params?: {
    gender?: string;
    category?: string;
  }): Promise<BackendAIModelItem[]> {
    const response = await api.get<{ success: boolean; total: number; models: BackendAIModelItem[] }>(
      `${this.baseRoute}/models`,
      {
        params: {
          gender: params?.gender,
          category: params?.category,
        },
      }
    );
    return response.data.models || [];
  }

  /**
   * Fetch recommended photography styles based on product & model mode
   */
  async getStyles(params?: {
    category?: string;
    useModel?: boolean;
    modelId?: string;
  }): Promise<BackendPhotographyStyleItem[]> {
    const response = await api.get<{ success: boolean; styles: BackendPhotographyStyleItem[] }>(
      `${this.baseRoute}/styles`,
      {
        params: {
          category: params?.category,
          use_model: params?.useModel ?? false,
          model_id: params?.modelId,
        },
      }
    );
    return response.data.styles || [];
  }

  /**
   * Prepare/synthesize photographic prompt specifications
   */
  async preparePrompt(params: {
    sessionId: string;
    customPrompt?: string;
    language?: string;
    useModel?: boolean;
    modelId?: string;
    selectedStyles?: string[];
  }): Promise<BackendPreparePromptResponse> {
    const response = await api.post<BackendPreparePromptResponse>(
      `${this.baseRoute}/prepare-prompt`,
      {
        session_id: params.sessionId,
        custom_prompt: params.customPrompt,
        language: params.language || "en",
        use_model: params.useModel ?? false,
        model_id: params.modelId,
        selected_styles: params.selectedStyles || [],
      }
    );
    return response.data;
  }

  /**
   * Start async batch generation for final photoshoot
   */
  async generatePhotoshoot(params: {
    sessionId: string;
    selectedEnhancedImageIds?: string[];
    productCategory?: string;
    useModel: boolean;
    modelId?: string;
    selectedStyles: string[];
    customPrompt?: string;
    imageCount?: number;
  }): Promise<BackendPhotoshootGenerateResponse> {
    const response = await api.post<BackendPhotoshootGenerateResponse>(
      `${this.baseRoute}/generate`,
      {
        session_id: params.sessionId,
        selected_enhanced_image_ids: params.selectedEnhancedImageIds,
        product_category: params.productCategory,
        use_model: params.useModel,
        model_id: params.modelId,
        selected_styles: params.selectedStyles,
        custom_prompt: params.customPrompt,
        image_count: params.imageCount ?? 5,
      }
    );
    return response.data;
  }

  /**
   * Poll generation job status
   */
  async getJobStatus(jobId: string): Promise<BackendJobStatusResponse> {
    const response = await api.get<BackendJobStatusResponse>(
      `${this.baseRoute}/jobs/${jobId}`
    );
    return response.data;
  }

  /**
   * Get final results for a photoshoot session
   */
  async getSessionResults(sessionId: string): Promise<BackendPhotoshootResultsResponse> {
    const response = await api.get<BackendPhotoshootResultsResponse>(
      `${this.baseRoute}/${sessionId}/results`
    );
    return response.data;
  }

  /**
   * Save selected images to user's permanent gallery
   */
  async saveSelectedImages(params: {
    sessionId: string;
    imageIds: string[];
  }): Promise<BackendSaveImagesResponse> {
    const response = await api.post<BackendSaveImagesResponse>(
      `${this.baseRoute}/${params.sessionId}/save`,
      {
        image_ids: params.imageIds,
      }
    );
    return response.data;
  }

  /**
   * Regenerate single photoshoot image
   */
  async regenerateImage(params: {
    imageId: string;
    style?: string;
    customPrompt?: string;
  }): Promise<any> {
    const response = await api.post(
      `${this.baseRoute}/images/${params.imageId}/regenerate`,
      {
        style: params.style,
        custom_prompt: params.customPrompt,
      }
    );
    return response.data;
  }

  /**
   * Delete single photoshoot image
   */
  async deleteImage(imageId: string): Promise<any> {
    const response = await api.delete(
      `${this.baseRoute}/images/${imageId}`
    );
    return response.data;
  }

  /**
   * Download individual image asset as a Blob and trigger save
   */
  async downloadImageBlob(imageId: string, defaultFilename: string = "photoshoot.jpg"): Promise<void> {
    const response = await api.get(
      `${this.baseRoute}/images/${imageId}/download`,
      { responseType: "blob" }
    );
    const contentType = (response.headers["content-type"] as string) || "image/jpeg";
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Download entire photoshoot session as a ZIP archive
   */
  async downloadSessionZip(sessionId: string): Promise<void> {
    const response = await api.get(
      `${this.baseRoute}/${sessionId}/download`,
      { responseType: "blob" }
    );
    const blob = new Blob([response.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dhandagrow_photoshoot_${sessionId}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const productPhotoshootService = new ProductPhotoshootService();

