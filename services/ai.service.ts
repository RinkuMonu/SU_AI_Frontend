import api from "@/lib/api";

export interface WebsiteAnalysisRequest {
  website_url: string;
  primary_goal?: string;
  target_audience?: string;
}

export interface WebsiteAnalysisData {
  website_url?: string;
  business_name?: string;
  category?: string;
  sub_category?: string;
  business_types?: string[];
  primary_business_type?: string;
  city?: string;
  logo_url?: string;
  tagline?: string;
  description?: string;
  business_description?: string;
  target_audience?: string;
  differentiators?: string[];
  products_services?: string[];
  brand_colors?: string[];
  palette?: string[];
  tones?: string[];
  language?: string;
  photos?: string[];
  images?: string[];
  overall_health_score?: number;
  brand_messaging_clarity?: string;
  conversion_funnel_audit?: {
    strengths?: string[];
    critical_friction_points?: string[];
    cta_recommendations?: string[];
  };
  seo_and_content_recommendations?: {
    recommended_keywords?: string[];
    meta_improvements?: string;
  };
  actionable_next_steps?: string[];
  job_id?: string;
  status?: string;
}

export interface WebsiteAnalysisResult {
  success: boolean;
  message?: string;
  data: WebsiteAnalysisData;
}

// Helper to extract clean domain title if business_name isn't returned directly
export function formatDomainToBusinessName(url: string): string {
  try {
    let clean = url.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, "").replace(/^www\./, "");
    clean = clean.split("/")[0].split("?")[0];
    const parts = clean.split(".")[0];
    // Split camelCase or hyphenated or common patterns
    const words = parts.replace(/[-_]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
    return words
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  } catch {
    return "Your Business";
  }
}

export const aiService = {
  analyzeWebsite: async (payload: WebsiteAnalysisRequest): Promise<WebsiteAnalysisData> => {
    try {
      const response = await api.post("/api/v1/ai/website-analysis", payload);
      const resData = response.data?.data || response.data || {};

      // If backend returns photos/images, ensure clean array
      const rawPhotos = resData.photos || resData.images || resData.scraped_images || [];
      const photos = Array.isArray(rawPhotos) ? rawPhotos.map((p: any) => (typeof p === "string" ? p : p?.url || "")).filter((u: string) => typeof u === "string" && u.startsWith("http")) : [];

      // Differentiators
      const diffs =
        resData.differentiators ||
        resData.conversion_funnel_audit?.strengths ||
        resData.key_differentiators ||
        [];

      // Products / Services
      const prods =
        resData.products_services ||
        resData.services ||
        resData.products ||
        resData.seo_and_content_recommendations?.recommended_keywords ||
        [];

      // Colors
      const rawColors = resData.palette || resData.brand_colors || [];
      const palette = Array.isArray(rawColors) && rawColors.length > 0 ? rawColors : undefined;

      // Do not invent fake business details if website does not provide them
      const businessName = resData.business_name || (payload.website_url ? formatDomainToBusinessName(payload.website_url) : undefined);
      const category = resData.category || resData.business_category || undefined;
      const subCategory = resData.sub_category || undefined;
      const city = resData.city || resData.location || undefined;
      const logoUrl = resData.logo_url || resData.logo || (payload.website_url ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(payload.website_url)}&sz=128` : undefined);
      const tagline = resData.tagline || resData.brand_messaging_clarity || undefined;
      const targetAudience = resData.target_audience || undefined;
      const businessDescription = resData.business_description || resData.description || undefined;

      return {
        ...resData,
        website_url: resData.website_url || payload.website_url,
        business_name: businessName,
        category: category,
        sub_category: subCategory,
        business_types: resData.business_types,
        primary_business_type: resData.primary_business_type,
        city: city,
        logo_url: logoUrl,
        tagline: tagline,
        business_description: businessDescription,
        target_audience: targetAudience,
        differentiators: Array.isArray(diffs) && diffs.length > 0 ? diffs : undefined,
        products_services: Array.isArray(prods) && prods.length > 0 ? prods : undefined,
        palette: palette,
        brand_colors: palette,
        tones: Array.isArray(resData.tones) && resData.tones.length > 0 ? resData.tones : undefined,
        language: resData.language,
        photos: photos,
      };
    } catch (error: any) {
      console.warn("Website analysis API call error:", error?.message || error);
      // Re-throw so caller can display a useful retry option and avoid silently populating fake details
      throw new Error(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to analyze website. Please check the URL and retry."
      );
    }
  },
};

export default aiService;

