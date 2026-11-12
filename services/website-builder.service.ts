import api from "@/lib/api";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  type?:
    | "text"
    | "recommendation"
    | "template_selection"
    | "confirmation"
    | "summary"
    | "generation_status"
    | "edit_status";
  options?: any[];
  data?: any;
}

export interface WebsiteTheme {
  primary?: string;
  secondary?: string;
  accent?: string;
  font?: string;
  backgroundColor?: string;
  textColor?: string;
  [key: string]: any;
}

export interface WebsiteSectionItem {
  title?: string;
  name?: string;
  description?: string;
  price?: string;
  image_url?: string;
  imagePrompt?: string;
  author?: string;
  role?: string;
  quote?: string;
  [key: string]: any;
}

export interface WebsiteSection {
  id?: string;
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  cta?: string;
  secondary_cta?: string;
  image_url?: string;
  items?: WebsiteSectionItem[];
  testimonials?: WebsiteSectionItem[];
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  [key: string]: any;
}

export interface WebsitePage {
  name?: string;
  title?: string;
  path?: string;
  sections?: WebsiteSection[];
  [key: string]: any;
}

export interface GeneratedSiteData {
  business_name?: string;
  business_category?: string;
  tagline?: string;
  logo?: string | { url?: string };
  theme?: WebsiteTheme;
  pages?: WebsitePage[];
  template_id?: string;
  template_name?: string;
  html?: string;
  [key: string]: any;
}

export interface WebsiteSession {
  sessionId: string;
  siteId?: string | null;
  language?: string;
  messages: ChatMessage[];
  generatedSiteData?: GeneratedSiteData | null;
  templateId?: string | null;
  templateName?: string | null;
  collected_data?: Record<string, any>;
}

export interface FrontendMessageResponse {
  message?: string;
  type?: string;
  messages: ChatMessage[];
  siteId?: string | null;
  generatedSiteData?: GeneratedSiteData | null;
  data?: any;
}

export interface EditWebsiteRequest {
  user_instruction: string;
  current_state: any;
}

export interface EditWebsiteResponse {
  action: string;
  target?: string;
  changes?: Record<string, any>;
  message: string;
  options?: any[];
  updated_state: any;
}

export interface RestoreVersionResponse {
  success: boolean;
  message: string;
}

export interface FinalizeWebsiteResponse {
  success: boolean;
  message: string;
}

export interface ExportWebsiteResponse {
  success: boolean;
  download_url: string;
}

export interface SiteDetailsResponse {
  id: string;
  business_id: string;
  business_name: string;
  template_id?: string;
  pages: WebsitePage[];
  theme: WebsiteTheme;
}

export const websiteBuilderService = {
  startSession: async (language: string): Promise<WebsiteSession> => {
    try {
      const response = await api.post("/api/v1/website-builder/session", { language });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSession: async (sessionId: string): Promise<WebsiteSession | null> => {
    // MongoDB ObjectID is a 24-character hexadecimal string
    if (!sessionId || !/^[0-9a-fA-F]{24}$/.test(sessionId)) {
      return null;
    }
    try {
      const response = await api.get(`/api/v1/website-builder/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  sendMessage: async (
    sessionId: string,
    message: string,
    data?: any
  ): Promise<FrontendMessageResponse> => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/message`, {
        message,
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  reviseSite: async (
    siteId: string,
    instructions: string
  ): Promise<{ generatedSiteData: GeneratedSiteData }> => {
    try {
      const response = await api.post(`/api/v1/website-builder/site/${siteId}/revise`, {
        instructions,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clearSession: async (sessionId: string): Promise<FrontendMessageResponse> => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/clear`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSite: async (siteId: string): Promise<SiteDetailsResponse> => {
    try {
      const response = await api.get(`/api/v1/website-builder/site/${siteId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editWebsite: async (
    sessionId: string,
    userInstruction: string,
    currentState: any
  ): Promise<EditWebsiteResponse> => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/edit`, {
        user_instruction: userInstruction,
        current_state: currentState,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  restoreVersion: async (sessionId: string, version: number): Promise<RestoreVersionResponse> => {
    try {
      const response = await api.post(
        `/api/v1/website-builder/session/${sessionId}/restore?version=${version}`,
        { version }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  finalizeWebsite: async (sessionId: string): Promise<FinalizeWebsiteResponse> => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/finalize`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportPdf: async (sessionId: string): Promise<ExportWebsiteResponse> => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/export/pdf`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportZip: async (sessionId: string): Promise<ExportWebsiteResponse> => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/export/zip`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
