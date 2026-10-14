import api from "@/lib/api";

export const FACEBOOK_APP_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1590258016168448";

export interface FacebookPageData {
  id: string;
  name: string;
  access_token: string;
  category?: string;
}

export interface FacebookCredentials {
  userAccessToken: string;
  pageAccessToken: string;
  pageId: string;
  pageName: string;
}

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

export class FacebookService {
  /**
   * Dynamically loads and initializes the Facebook JavaScript SDK.
   */
  static loadFacebookSdk(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(null);
      if (window.FB) return resolve(window.FB);

      const existingScript = document.getElementById("facebook-jssdk");
      if (existingScript) {
        // Wait briefly for FB to finish initializing
        const interval = setInterval(() => {
          if (window.FB) {
            clearInterval(interval);
            resolve(window.FB);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve(window.FB || null);
        }, 2000);
        return;
      }

      window.fbAsyncInit = function () {
        try {
          window.FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: false,
            version: "v19.0",
          });
          resolve(window.FB);
        } catch (e) {
          console.warn("FB.init warning:", e);
          resolve(window.FB || null);
        }
      };

      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      js.crossOrigin = "anonymous";
      js.onerror = () => resolve(null);
      document.body.appendChild(js);
    });
  }

  /**
   * Starts Facebook OAuth flow:
   * 1. Attempts popup via Facebook SDK.
   * 2. If SDK unavailable or popup blocked, cleanly redirects to Facebook OAuth dialog.
   */
  static async startFacebookAuth(
    mode: "login" | "signup",
    onAccessTokenReceived?: (userToken: string) => Promise<void>
  ): Promise<void> {
    if (typeof window === "undefined") return;

    sessionStorage.setItem("facebook_auth_mode", mode);
    const origin = window.location.origin;
    const redirectUri = `${origin}/login/user`;
    const scopes =
      "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts";

    try {
      const fb = await Promise.race([
        this.loadFacebookSdk(),
        new Promise((r) => setTimeout(() => r(null), 1500)),
      ]);

      if (fb && typeof fb.login === "function" && onAccessTokenReceived) {
        return new Promise<void>((resolve, reject) => {
          fb.login(
            async (response: any) => {
              if (response.authResponse?.accessToken) {
                try {
                  await onAccessTokenReceived(response.authResponse.accessToken);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              } else {
                // If user closed dialog or popup was blocked, fallback to redirect
                FacebookService.redirectToFacebookOAuth(redirectUri, scopes, mode);
                resolve();
              }
            },
            { scope: scopes, auth_type: "rerequest" }
          );
        });
      }
    } catch (err) {
      console.warn("FB SDK login attempt fell back to redirect:", err);
    }

    // Direct OAuth redirect fallback
    this.redirectToFacebookOAuth(redirectUri, scopes, mode);
  }

  /**
   * Redirects browser to Facebook OAuth dialog
   */
  static redirectToFacebookOAuth(
    redirectUri: string,
    scopes: string,
    mode: "login" | "signup"
  ) {
    const state = `facebook_${mode}_${Math.random().toString(36).substring(7)}`;
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${encodeURIComponent(
      FACEBOOK_APP_ID
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token,code&scope=${encodeURIComponent(
      scopes
    )}&auth_type=rerequest&state=${state}`;

    window.location.href = authUrl;
  }

  /**
   * Discovers user's Facebook Pages and Page Access Tokens using Graph API.
   */
  static async fetchPagesFromUserToken(
    userAccessToken: string
  ): Promise<FacebookPageData[]> {
    if (!userAccessToken) return [];
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category&access_token=${userAccessToken}`
      );
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        return json.data.map((item: any) => ({
          id: String(item.id),
          name: String(item.name),
          access_token: String(item.access_token || ""),
          category: item.category ? String(item.category) : undefined,
        }));
      }
    } catch (e) {
      console.warn("Failed to fetch Facebook pages from Graph API:", e);
    }
    return [];
  }

  /**
   * Persists Facebook credentials to localStorage and synchronizes with the backend.
   */
  static async saveFacebookCredentials(creds: {
    userAccessToken?: string;
    pageAccessToken?: string;
    pageId?: string;
    pageName?: string;
    authToken?: string;
  }) {
    if (typeof window === "undefined") return;

    const { userAccessToken, pageAccessToken, pageId, pageName } = creds;

    if (userAccessToken) {
      localStorage.setItem("fb_user_access_token", userAccessToken);
    }
    if (pageAccessToken) {
      localStorage.setItem("fb_page_access_token", pageAccessToken);
    }
    if (pageId) {
      localStorage.setItem("fb_page_id", pageId);
    }
    if (pageName) {
      localStorage.setItem("fb_page_name", pageName);
    }

    const activePageToken = pageAccessToken || userAccessToken;

    // Persist to backend endpoints
    const promises: Promise<any>[] = [];

    if (activePageToken) {
      promises.push(
        api
          .post("/api/facebook/save-token", {
            access_token: activePageToken,
            user_access_token: userAccessToken || undefined,
            page_access_token: pageAccessToken || undefined,
            fb_page_id: pageId || undefined,
            fb_page_name: pageName || undefined,
          })
          .catch((e) => console.warn("Notice: /api/facebook/save-token sync:", e))
      );

      promises.push(
        api
          .put("/api/v1/businesses/me", {
            fb_page_id: pageId || undefined,
            fb_page_name: pageName || undefined,
            fb_access_token: activePageToken,
            fb_user_access_token: userAccessToken || undefined,
            fb_connected: true,
          })
          .catch((e) => console.warn("Notice: /api/v1/businesses/me sync:", e))
      );
    }

    await Promise.allSettled(promises);
  }

  /**
   * Retrieves saved Facebook credentials from localStorage.
   */
  static getStoredCredentials(): FacebookCredentials {
    if (typeof window === "undefined") {
      return {
        userAccessToken: "",
        pageAccessToken: "",
        pageId: "",
        pageName: "",
      };
    }

    return {
      userAccessToken: localStorage.getItem("fb_user_access_token") || "",
      pageAccessToken: localStorage.getItem("fb_page_access_token") || "",
      pageId: localStorage.getItem("fb_page_id") || "",
      pageName: localStorage.getItem("fb_page_name") || "",
    };
  }

  /**
   * Clears saved Facebook credentials.
   */
  static clearStoredCredentials() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("fb_user_access_token");
    localStorage.removeItem("fb_page_access_token");
    localStorage.removeItem("fb_page_id");
    localStorage.removeItem("fb_page_name");
  }
}
