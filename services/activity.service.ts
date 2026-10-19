import api from "@/lib/api";
import { FacebookService } from "@/services/facebook.service";
import { InstagramService } from "@/services/instagram.service";

export type ActivityCategory = "content" | "social" | "ai_generation" | "campaign" | "account";
export type ActivityPlatform = "facebook" | "instagram" | "whatsapp" | "linkedin" | "ai" | "general";
export type ActivityStatus = "Completed" | "Published" | "Scheduled" | "Active" | "Draft";

export interface UserActivityItem {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  platform?: ActivityPlatform;
  status: ActivityStatus;
  timestamp: string;
  actionUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

const LOCAL_STORAGE_KEY = "su_user_recent_activities";

export class ActivityService {
  /**
   * Log a new activity to local storage
   */
  static logActivity(activity: {
    title: string;
    description: string;
    category: ActivityCategory;
    platform?: ActivityPlatform;
    status?: ActivityStatus;
    actionUrl?: string;
    imageUrl?: string;
    timestamp?: string;
  }): UserActivityItem {
    if (typeof window === "undefined") {
      return {
        id: "srv-" + Date.now(),
        ...activity,
        status: activity.status || "Completed",
        timestamp: activity.timestamp || new Date().toISOString(),
      };
    }

    const newItem: UserActivityItem = {
      id: "act-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      title: activity.title,
      description: activity.description,
      category: activity.category,
      platform: activity.platform || "general",
      status: activity.status || "Completed",
      actionUrl: activity.actionUrl,
      imageUrl: activity.imageUrl,
      timestamp: activity.timestamp || new Date().toISOString(),
    };

    try {
      const stored = this.getLocalActivities();
      // Keep most recent 50
      const updated = [newItem, ...stored.filter(a => a.id !== newItem.id)].slice(0, 50);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save activity to localStorage", e);
    }

    return newItem;
  }

  /**
   * Get activities stored in localStorage
   */
  static getLocalActivities(): UserActivityItem[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Fetch all recent activities aggregated from:
   * 1. Backend content items (/api/v1/content)
   * 2. Live Social account connections (Facebook, Instagram, WhatsApp)
   * 3. Local activity history (AI photoshoot, Reels, Post maker, etc.)
   */
  static async getAllRecentActivities(): Promise<UserActivityItem[]> {
    const activities: UserActivityItem[] = [];

    // 1. Fetch live content from backend
    try {
      const res = await api.get("/api/v1/content");
      const contentItems = Array.isArray(res.data) 
        ? res.data 
        : Array.isArray(res.data?.data) 
        ? res.data.data 
        : [];

      for (const item of contentItems) {
        const plat = (item.platform || "ai").toLowerCase() as ActivityPlatform;
        activities.push({
          id: item._id || "cnt-" + Math.random(),
          title: item.title || `Created ${item.type || "AI Post"}`,
          description: item.caption 
            ? (item.caption.length > 90 ? item.caption.substring(0, 90) + "..." : item.caption)
            : "Generated AI marketing post with caption and hashtags.",
          category: "content",
          platform: ["facebook", "instagram", "whatsapp", "linkedin"].includes(plat) ? plat : "ai",
          status: item.status || "Completed",
          timestamp: item.createdAt || item.updatedAt || new Date().toISOString(),
          imageUrl: item.imageUrl || item.image_url || item.media_url,
          actionUrl: "/content",
        });
      }
    } catch (e) {
      console.warn("Could not fetch remote content activities:", e);
    }

    // 2. Check Facebook Live Connection
    if (typeof window !== "undefined") {
      const fbCreds = FacebookService.getStoredCredentials();
      if (!fbCreds.isExpired && fbCreds.pageId && (fbCreds.pageAccessToken || fbCreds.userAccessToken)) {
        activities.push({
          id: "act-fb-connected",
          title: "Facebook Page Connected",
          description: `Active Page: "${fbCreds.pageName || 'Facebook Page'}" (ID: ${fbCreds.pageId}). 24h auto-sync active.`,
          category: "social",
          platform: "facebook",
          status: "Active",
          timestamp: fbCreds.savedAt ? new Date(fbCreds.savedAt).toISOString() : new Date().toISOString(),
          actionUrl: "/social-platforms/facebook",
        });
      }

      // Check Instagram Live Connection
      const igCreds = InstagramService.getStoredCredentials();
      if (igCreds.accountId || igCreds.accessToken) {
        activities.push({
          id: "act-ig-connected",
          title: "Instagram Account Linked",
          description: `Account ID: ${igCreds.accountId || "Connected"}. Ready for reel & post publishing.`,
          category: "social",
          platform: "instagram",
          status: "Active",
          timestamp: new Date().toISOString(),
          actionUrl: "/social-platforms/instagram",
        });
      }

      // Check WhatsApp
      const waPhone = localStorage.getItem("whatsapp_phone_id");
      if (waPhone) {
        activities.push({
          id: "act-wa-connected",
          title: "WhatsApp Business Configured",
          description: `WhatsApp phone ID configured for promotional broadcasting.`,
          category: "social",
          platform: "whatsapp",
          status: "Active",
          timestamp: new Date().toISOString(),
          actionUrl: "/social-platforms/whatsapp",
        });
      }
    }

    // 3. Merge Local Activities
    const local = this.getLocalActivities();
    activities.push(...local);

    // 4. If list has very few items, add helpful default activities so new users have a lively timeline
    if (activities.length < 3) {
      const now = Date.now();
      activities.push(
        {
          id: "default-1",
          title: "AI Studio Initialized",
          description: "Marketing engine & AI prompt models ready for generation.",
          category: "ai_generation",
          platform: "ai",
          status: "Completed",
          timestamp: new Date(now - 1000 * 60 * 35).toISOString(), // 35 mins ago
          actionUrl: "/content?type=post",
        },
        {
          id: "default-2",
          title: "Brand Profile Created",
          description: "Business profile and target audience preferences successfully configured.",
          category: "account",
          platform: "general",
          status: "Completed",
          timestamp: new Date(now - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          actionUrl: "/settings",
        },
        {
          id: "default-3",
          title: "AI Photoshoot Ready",
          description: "Upload product photos to instantly generate professional model shots.",
          category: "ai_generation",
          platform: "ai",
          status: "Active",
          timestamp: new Date(now - 1000 * 60 * 60 * 20).toISOString(), // 20 hours ago
          actionUrl: "/ai-photoshoot",
        }
      );
    }

    // 5. Deduplicate by ID and sort descending by timestamp
    const seen = new Set<string>();
    const unique: UserActivityItem[] = [];

    for (const act of activities) {
      if (!seen.has(act.id)) {
        seen.add(act.id);
        unique.push(act);
      }
    }

    unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return unique;
  }
}
