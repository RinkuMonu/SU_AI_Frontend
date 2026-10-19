import { GeneratedContent, GenerateContentRequest, GeneratePostRequest, GeneratedPost } from '@/types/content';
import api from "@/lib/api";

const LOCAL_STORAGE_KEY = "su_content_library_cache";

function getLocalCache(): GeneratedContent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToLocalCache(item: GeneratedContent) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalCache();
    const index = current.findIndex(c => 
      (c._id && c._id === item._id) || 
      (c.title && c.title === item.title && c.caption === item.caption)
    );
    if (index >= 0) {
      current[index] = { ...current[index], ...item };
    } else {
      current.unshift(item);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn("Failed to write to local cache:", e);
  }
}

function removeFromLocalCache(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalCache();
    const updated = current.filter(c => c._id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to delete from local cache:", e);
  }
}

export const contentService = {
  getLocalCache,
  saveToLocalCache,
  removeFromLocalCache,

  async generateContent(request: GenerateContentRequest): Promise<{ data: GeneratedContent }> {
    const response = await api.post("/api/v1/content/generate-post", {
      product_id: request.productId || "",
      platform: (request.platform || "instagram").toLowerCase(),
      objective: (request.type || "post").toLowerCase(),
      language: request.language || "English",
      additional_instruction: request.additionalInstructions
    });

    const apiData = response.data?.data || response.data || {};

    const rawHashtags = apiData.hashtags;
    const formattedHashtags = Array.isArray(rawHashtags) 
      ? rawHashtags 
      : typeof rawHashtags === 'string' 
      ? rawHashtags.split(/\s+/).filter(Boolean) 
      : [];

    const newContent: GeneratedContent = {
      _id: apiData._id || `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: request.type || 'Instagram Post',
      platform: request.platform || 'Instagram',
      language: request.language || 'English',
      tone: request.tone || 'Professional',
      productId: request.productId,
      targetAudience: request.targetAudience,
      topic: request.topic,
      callToAction: request.callToAction || apiData.call_to_action || '',
      additionalInstructions: request.additionalInstructions,
      
      title: apiData.headline || apiData.title || ("Generated " + (request.type || "Post")),
      caption: apiData.caption || apiData.text || "",
      hashtags: formattedHashtags,
      suggestions: apiData.creative_direction ? [apiData.creative_direction] : (apiData.suggestions || []),
      
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      media_url: apiData.media_url || apiData.image_url || "",
      imageUrl: apiData.image_url || apiData.media_url || "",
    };
    
    return { data: newContent };
  },

  async saveContent(content: GeneratedContent): Promise<{ data: GeneratedContent }> {
    const isValidMongoId = content._id && /^[0-9a-fA-F]{24}$/.test(content._id);
    
    const payload: Record<string, any> = {
      title: content.title || "Generated Post",
      caption: content.caption || "",
      hashtags: content.hashtags || [],
      suggestions: content.suggestions || [],
      type: content.type || "Instagram Post",
      platform: content.platform || "Instagram",
      language: content.language || "English",
      tone: content.tone || "Professional",
      status: content.status || "Draft",
      productId: content.productId || "",
      targetAudience: content.targetAudience || "",
      topic: content.topic || "",
      callToAction: content.callToAction || "",
      additionalInstructions: content.additionalInstructions || "",
      scheduledAt: content.scheduledAt || null,
      imageUrl: content.imageUrl || content.image_url || content.media_url || "",
      media_url: content.media_url || content.imageUrl || content.image_url || "",
      updatedAt: new Date().toISOString(),
    };

    // Only pass _id if it's an existing 24-character hexadecimal ObjectId
    if (isValidMongoId) {
      payload._id = content._id;
    }

    let savedItem: GeneratedContent;

    try {
      const response = await api.put("/api/v1/content/update", payload);
      const resData = response.data;
      const apiItem = resData?.data || resData?.content || (resData?._id ? resData : null);

      const assignedId = apiItem?._id || apiItem?.id || (isValidMongoId ? content._id : `saved_${Date.now()}`);

      savedItem = {
        ...content,
        ...(apiItem || {}),
        _id: assignedId,
        status: payload.status,
        scheduledAt: payload.scheduledAt,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn("Backend /api/v1/content/update failed, storing in persistent local store:", error);
      savedItem = {
        ...content,
        _id: content._id && !content._id.startsWith("temp_") ? content._id : `saved_${Date.now()}`,
        status: payload.status,
        scheduledAt: payload.scheduledAt,
        updatedAt: new Date().toISOString(),
      };
    }

    // Mirror to persistent local storage so it is guaranteed to show up in Content Library
    saveToLocalCache(savedItem);
    return { data: savedItem };
  },

  async updateContent(id: string, updates: Partial<GeneratedContent>): Promise<{ data: GeneratedContent }> {
    const existing = getLocalCache().find(c => c._id === id);
    const merged: GeneratedContent = {
      ...(existing || {} as any),
      ...updates,
      _id: id,
    };
    return this.saveContent(merged);
  },

  async getContents(): Promise<{ data: GeneratedContent[] }> {
    let remoteList: GeneratedContent[] = [];
    try {
      const response = await api.get("/api/v1/content");
      if (Array.isArray(response.data)) {
        remoteList = response.data;
      } else if (Array.isArray(response.data?.data)) {
        remoteList = response.data.data;
      } else if (Array.isArray(response.data?.contents)) {
        remoteList = response.data.contents;
      }
    } catch (error) {
      console.warn("Failed to fetch remote contents:", error);
    }

    const localList = getLocalCache();
    const map = new Map<string, GeneratedContent>();

    // Put remote items in map
    for (const item of remoteList) {
      if (!item) continue;
      const key = item._id || `${item.title}_${item.caption?.substring(0, 30)}`;
      map.set(key, item);
    }

    // Merge with any local cache items not yet in remote
    for (const item of localList) {
      if (!item) continue;
      const key = item._id || `${item.title}_${item.caption?.substring(0, 30)}`;
      if (!map.has(key)) {
        const matching = remoteList.some(r => r.title === item.title && r.caption === item.caption);
        if (!matching) {
          map.set(key, item);
        }
      }
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return { data: merged };
  },

  async getContent(id: string): Promise<{ data: GeneratedContent }> {
    const listRes = await this.getContents();
    const content = listRes.data.find((c: any) => c._id === id);
    if (!content) throw new Error('Content not found');
    return { data: content };
  },
  
  async deleteContent(id: string): Promise<void> {
    removeFromLocalCache(id);
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      try {
        await api.delete(`/api/v1/content/${id}`);
      } catch (err) {
        console.warn("Backend deleteContent error:", err);
      }
    }
  }
};

export async function generatePost(
  payload: GeneratePostRequest
): Promise<GeneratedPost> {

  const response = await api.post(
    "/api/v1/content/generate-post",
    payload
  );

  return response.data.data;
}