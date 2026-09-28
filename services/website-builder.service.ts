import api from "@/lib/api";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  type?: "text" | "recommendation" | "template_selection" | "confirmation" | "summary" | "generation_status";
  options?: any[];
  data?: any;
}

export interface WebsiteSession {
  sessionId: string;
  siteId?: string;
  language?: string;
  messages: ChatMessage[];
  generatedSiteData?: any;
}

export const websiteBuilderService = {
  startSession: async (language: string) => {
    try {
      const response = await api.post("/api/v1/website-builder/session", { language });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (sessionId: string, message: string, data?: any) => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/message`, { message, data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  reviseSite: async (siteId: string, instructions: string) => {
    try {
      const response = await api.post(`/api/v1/website-builder/site/${siteId}/revise`, { instructions });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  clearSession: async (sessionId: string) => {
    try {
      const response = await api.post(`/api/v1/website-builder/session/${sessionId}/clear`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getSession: async (sessionId: string) => {
    try {
      const response = await api.get(`/api/v1/website-builder/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
