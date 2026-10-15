import api from '@/lib/api';

export interface InstagramCredentials {
  accountId: string;
  accessToken: string;
}

export class InstagramService {
  /**
   * Retrieves saved Instagram credentials from localStorage.
   */
  static getStoredCredentials(): InstagramCredentials {
    if (typeof window === "undefined") {
      return { accountId: "", accessToken: "" };
    }

    const accountId =
      localStorage.getItem("ig_account_id") ||
      localStorage.getItem("instagram_account_id") ||
      "";
    const accessToken =
      localStorage.getItem("ig_access_token") ||
      localStorage.getItem("instagram_access_token") ||
      localStorage.getItem("instagram_token") ||
      "";

    return { accountId, accessToken };
  }

  /**
   * Persists Instagram credentials to localStorage and synchronizes with backend business settings.
   */
  static async saveInstagramCredentials(creds: {
    accountId?: string;
    accessToken?: string;
    syncBackend?: boolean;
  }): Promise<void> {
    if (typeof window === "undefined") return;

    const { accountId, accessToken, syncBackend = true } = creds;

    if (accountId !== undefined) {
      if (accountId) {
        localStorage.setItem("ig_account_id", accountId);
        localStorage.setItem("instagram_account_id", accountId);
      } else {
        localStorage.removeItem("ig_account_id");
        localStorage.removeItem("instagram_account_id");
      }
    }

    if (accessToken !== undefined) {
      if (accessToken) {
        localStorage.setItem("ig_access_token", accessToken);
        localStorage.setItem("instagram_access_token", accessToken);
        localStorage.setItem("instagram_token", accessToken);
      } else {
        localStorage.removeItem("ig_access_token");
        localStorage.removeItem("instagram_access_token");
        localStorage.removeItem("instagram_token");
      }
    }

    if (syncBackend) {
      try {
        await api.put("/api/v1/businesses/me", {
          ig_account_id: accountId ?? "",
          ig_access_token: accessToken ?? "",
        });
      } catch (err) {
        console.warn("Notice: /api/v1/businesses/me Instagram sync failed:", err);
      }
    }
  }

  /**
   * Clears saved Instagram credentials from localStorage and backend.
   */
  static async clearStoredCredentials(syncBackend: boolean = true): Promise<void> {
    if (typeof window === "undefined") return;

    localStorage.removeItem("ig_account_id");
    localStorage.removeItem("instagram_account_id");
    localStorage.removeItem("ig_access_token");
    localStorage.removeItem("instagram_access_token");
    localStorage.removeItem("instagram_token");

    if (syncBackend) {
      try {
        await api.put("/api/v1/businesses/me", {
          ig_account_id: "",
          ig_access_token: "",
        });
      } catch (err) {
        console.warn("Notice: /api/v1/businesses/me Instagram clear failed:", err);
      }
    }
  }
}
