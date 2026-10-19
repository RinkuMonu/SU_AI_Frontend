"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, 
  Check, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Copy, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  ChevronDown, 
  CheckCircle2,
  Trash2,
  Key,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { FacebookService } from "@/services/facebook.service";
import { authService } from "@/services/auth.service";
import { OnboardingService } from "@/services/onboarding.service";
import { ActivityService } from "@/services/activity.service";
import { useAuth } from "@/components/auth/AuthProvider";

const FacebookIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.117 8.52h-1.808c-.282 0-.603.37-.603.882v1.548h2.411l-.328 2.45h-2.083V20h-2.528v-6.6H8.225v-2.45h1.953V9.395c0-1.895 1.155-2.928 2.85-2.928.812 0 1.512.06 1.716.088v1.965z"
      fill="#ffffff"
    />
  </svg>
);

interface FacebookPageItem {
  page_id: string;
  page_name: string;
  page_access_token?: string;
  category?: string;
}

/**
 * Format raw Facebook OAuth errors into clean, friendly English messages.
 * Prevents raw Devanagari/Hindi strings or technical codes from leaking into the UI.
 */
function formatFacebookError(rawError: string): string {
  if (!rawError) return "";
  let decoded = "";
  try {
    decoded = decodeURIComponent(rawError).trim();
  } catch {
    decoded = rawError.trim();
  }

  // Handle single character or boolean strings like ?error=T or ?error=true
  if (decoded === "T" || decoded.toLowerCase() === "true" || decoded === "1") {
    return "Facebook connection was interrupted. Please click 'Login with Facebook' below to connect your page.";
  }

  const hasDevanagari = /[\u0900-\u097F]/.test(decoded);
  const lower = decoded.toLowerCase();

  if (hasDevanagari) {
    if (decoded.includes("विकास") || decoded.includes("मोड")) {
      return "The Facebook App is currently in Development mode. Your Facebook account must be registered as a Tester or Administrator in the Meta App Dashboard.";
    }
    if (decoded.includes("अनुमति") || decoded.includes("अस्वीकार")) {
      return "Facebook permissions were declined or cancelled. Please click 'Login with Facebook' and allow access to your Facebook Page.";
    }
    return "Facebook connection could not be completed. Please click 'Login with Facebook' below to try again.";
  }

  if (lower === "missing_code") {
    return "Facebook did not return an authorization code. Please click 'Login with Facebook' to try again.";
  }
  if (lower === "invalid_state") {
    return "Facebook login session expired. Please click 'Login with Facebook' to start a fresh connection.";
  }
  if (lower === "access_denied" || lower.includes("user_denied") || lower.includes("permissions were declined")) {
    return "Facebook permissions were declined. Please log in and allow the required page permissions.";
  }
  if (lower.includes("redirect_uri_mismatch")) {
    return "Facebook OAuth redirect URL mismatch. Please verify the callback URL in Meta App settings.";
  }
  if (lower.includes("invalid_scope")) {
    return "Some requested Facebook permissions are restricted. Please use 'Safe Connect (Basic Pages)' below.";
  }

  return decoded;
}

export default function FacebookIntegrationPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isReRequesting, setIsReRequesting] = useState(false);
  const [isFetchingPages, setIsFetchingPages] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  // Credentials State
  const [fbPageId, setFbPageId] = useState("");
  const [fbPageName, setFbPageName] = useState("");
  const [fbToken, setFbToken] = useState(""); // Page Access Token
  const [fbUserToken, setFbUserToken] = useState(""); // User Access Token (New field)
  
  const [isConnected, setIsConnected] = useState(false);
  const [showPageToken, setShowPageToken] = useState(false);
  const [showUserToken, setShowUserToken] = useState(false);
  const [copiedPageToken, setCopiedPageToken] = useState(false);
  const [copiedUserToken, setCopiedUserToken] = useState(false);
  const [tokenPermissionWarning, setTokenPermissionWarning] = useState<string | null>(null);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [discoveredPages, setDiscoveredPages] = useState<FacebookPageItem[]>([]);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  // Active 24-hour expiration watcher that updates countdown and auto-deletes when expired
  useEffect(() => {
    const checkExpiration = () => {
      const isExpired = FacebookService.checkAndExpireCredentials();
      if (isExpired) {
        setIsConnected(false);
        setFbToken("");
        setFbUserToken("");
        setFbPageId("");
        setFbPageName("");
        setRemainingTime(null);
        setErrorMessage("Facebook access tokens and page access codes have expired and were automatically deleted after 24 hours for security. Please reconnect your Facebook account.");
        return;
      }

      const formatted = FacebookService.getRemainingTimeFormatted();
      setRemainingTime(formatted);
    };

    checkExpiration();
    const timer = setInterval(checkExpiration, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 0. Pre-hydrate immediately from stored credentials so tokens and page are printed INSTANTLY
    const stored = FacebookService.getStoredCredentials();
    if (stored.isExpired) {
      setIsConnected(false);
      setFbUserToken("");
      setFbToken("");
      setFbPageId("");
      setFbPageName("");
      setRemainingTime(null);
      setErrorMessage("Facebook access tokens have expired and were automatically deleted after 24 hours for security. Please reconnect your Facebook account.");
    } else {
      if (stored.userAccessToken) setFbUserToken(stored.userAccessToken);
      if (stored.pageAccessToken) setFbToken(stored.pageAccessToken);
      if (stored.pageId) setFbPageId(stored.pageId);
      if (stored.pageName) setFbPageName(stored.pageName);
      if (stored.pageId && (stored.pageAccessToken || stored.userAccessToken)) {
        setIsConnected(true);
      }
      const formatted = FacebookService.getRemainingTimeFormatted();
      setRemainingTime(formatted);
    }

    // Auto-discover pages if user access token is stored but page token is missing
    if (stored.userAccessToken && !stored.pageAccessToken) {
      FacebookService.fetchPagesFromUserToken(stored.userAccessToken).then((pages) => {
        if (pages.length > 0) {
          const first = pages[0];
          setFbPageId(first.id);
          setFbPageName(first.name);
          if (first.access_token) setFbToken(first.access_token);
          setDiscoveredPages(pages.map(p => ({
            page_id: p.id,
            page_name: p.name,
            page_access_token: p.access_token,
            category: p.category
          })));
          FacebookService.saveFacebookCredentials({
            userAccessToken: stored.userAccessToken,
            pageAccessToken: first.access_token,
            pageId: first.id,
            pageName: first.name,
          });
        }
      }).catch(e => console.warn("Auto-discover on mount:", e));
    }

    // 1. Check for tokens and authorization codes from URL query parameters after OAuth redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get('code') || params.get('authorization_code');
      const pageTokenFromUrl = params.get('fb_access_token') || params.get('page_access_token');
      const userTokenFromUrl = params.get('user_access_token') || params.get('access_token') || params.get('token');
      const isConnectedSuccess = params.get('facebook_connected') === 'true';
      const pageIdFromUrl = params.get('fb_page_id') || params.get('page_id');
      const errorFromUrl = params.get('error') || params.get('error_description');
      
      // Instantly wipe authorization code and access tokens from browser address bar for security
      if (codeFromUrl || pageTokenFromUrl || userTokenFromUrl || errorFromUrl || isConnectedSuccess) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (errorFromUrl) {
        setErrorMessage(formatFacebookError(errorFromUrl));
      }

      if (pageTokenFromUrl || userTokenFromUrl || isConnectedSuccess) {
        let finalPageToken = pageTokenFromUrl || "";
        let finalUserToken = userTokenFromUrl || "";
        let finalPageId = pageIdFromUrl || "";
        let finalPageName = "";

        if (pageTokenFromUrl) setFbToken(pageTokenFromUrl);
        if (userTokenFromUrl) setFbUserToken(userTokenFromUrl);
        if (pageIdFromUrl) setFbPageId(pageIdFromUrl);
        setIsConnected(true);

        // Automatically fetch pages and auto-save without user needing to click anything
        const performAutoSave = async () => {
          const tokenToUse = finalPageToken || finalUserToken;

          // Check if user came from a Facebook Login / Signup flow or is unauthenticated
          const savedAuthMode = typeof window !== "undefined" ? sessionStorage.getItem("facebook_auth_mode") : null;
          const currentToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
          const isAuthAction = Boolean(savedAuthMode) || !currentToken;

          if (isAuthAction && finalUserToken) {
            try {
              const authResult = await authService.facebookLogin({
                access_token: finalUserToken,
                accountType: "user",
              });
              const sessToken = authResult.token;
              const userObj = authResult.user;

              if (sessToken && userObj) {
                api.defaults.headers.common["Authorization"] = `Bearer ${sessToken}`;
                localStorage.setItem("auth_token", sessToken);

                login(sessToken, {
                  ...userObj,
                  accountType: userObj?.accountType || "user",
                  role: userObj?.role || "user",
                  onboardingCompleted: true,
                });
                sessionStorage.removeItem("facebook_auth_mode");
              }
            } catch (authErr) {
              console.warn("Facebook auto-login during redirect notice:", authErr);
            }
          }

          if (finalUserToken && (!finalPageId || !finalPageToken)) {
            try {
              const graphRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category&access_token=${finalUserToken}`);
              const graphData = await graphRes.json();
              if (graphData.data && Array.isArray(graphData.data) && graphData.data.length > 0) {
                const first = graphData.data[0];
                finalPageId = first.id;
                finalPageName = first.name;
                if (first.access_token) finalPageToken = first.access_token;
                setFbPageId(finalPageId);
                setFbPageName(finalPageName);
                if (first.access_token) setFbToken(first.access_token);
                setDiscoveredPages(graphData.data.map((x: any) => ({
                  page_id: x.id,
                  page_name: x.name,
                  page_access_token: x.access_token,
                  category: x.category
                })));
              }
            } catch (e) {
              console.warn("Could not auto-fetch pages from user token", e);
            }
          }

          if (tokenToUse) {
            try {
              const saveRes = await api.post('/api/facebook/save-token', {
                access_token: finalPageToken || tokenToUse,
                fb_page_id: finalPageId || undefined,
                fb_page_name: finalPageName || undefined,
                user_access_token: finalUserToken || undefined
              });

              if (saveRes.data?.pages && Array.isArray(saveRes.data.pages) && saveRes.data.pages.length > 0) {
                const bPages = saveRes.data.pages.map((p: any) => ({
                  page_id: p.page_id || p.id,
                  page_name: p.page_name || p.name,
                  page_access_token: p.page_access_token || p.access_token,
                  category: p.category
                }));
                setDiscoveredPages(bPages);
                if (!finalPageId && bPages[0]) {
                  finalPageId = bPages[0].page_id;
                  finalPageName = bPages[0].page_name;
                  setFbPageId(finalPageId);
                  setFbPageName(finalPageName);
                  if (bPages[0].page_access_token) {
                    finalPageToken = bPages[0].page_access_token;
                    setFbToken(finalPageToken);
                  }
                }
              }

              await FacebookService.saveFacebookCredentials({
                userAccessToken: finalUserToken || undefined,
                pageAccessToken: finalPageToken || tokenToUse || undefined,
                pageId: finalPageId || undefined,
                pageName: finalPageName || undefined
              });
              setIsConnected(true);
              setSuccessMessage("Facebook connected & credentials saved automatically!");
            } catch (err) {
              console.warn("Auto save error:", err);
            }
          }
        };

        performAutoSave();
      }
    }

    // 2. Load existing connection details from backend
    async function loadFacebookStatus() {
      try {
        const res = await api.get('/api/facebook/status');
        if (res.data && res.data.connected) {
          setIsConnected(true);
          if (res.data.fb_page_id) setFbPageId(res.data.fb_page_id);
          if (res.data.fb_page_name) setFbPageName(res.data.fb_page_name);
          if (res.data.page_access_token) setFbToken(res.data.page_access_token);
          if (res.data.user_access_token) setFbUserToken(res.data.user_access_token);
          if (res.data.pages && Array.isArray(res.data.pages) && res.data.pages.length > 0) {
            setDiscoveredPages(res.data.pages);
          }

          // Sync tokens to localStorage for instant printing
          FacebookService.saveFacebookCredentials({
            userAccessToken: res.data.user_access_token || undefined,
            pageAccessToken: res.data.page_access_token || undefined,
            pageId: res.data.fb_page_id || undefined,
            pageName: res.data.fb_page_name || undefined
          });

          // Check token publish permissions
          try {
            const verifyRes = await api.get('/api/facebook/verify-token');
            if (verifyRes.data && verifyRes.data.valid && !verifyRes.data.has_publish_permission) {
              setTokenPermissionWarning("Your Facebook Page Token is missing the 'pages_manage_posts' permission. While connected, publishing to Facebook will fail. Please generate a token with 'pages_manage_posts' permission.");
            } else {
              setTokenPermissionWarning(null);
            }
          } catch (verErr) {
            console.warn("Token verification check skipped", verErr);
          }
        }
      } catch (e) {
        console.warn("Could not load /api/facebook/status", e);
      }

      // Check legacy business endpoint as fallback if tokens not populated
      try {
        const busRes = await api.get('/api/v1/businesses/me');
        if (busRes.data) {
          if (busRes.data.fb_connected || busRes.data.fb_access_token) {
            setIsConnected(true);
          }
          if (busRes.data.fb_page_id) setFbPageId(prev => prev || busRes.data.fb_page_id);
          if (busRes.data.fb_page_name) setFbPageName(prev => prev || busRes.data.fb_page_name);
          if (busRes.data.fb_access_token) setFbToken(prev => prev || busRes.data.fb_access_token);
          if (busRes.data.fb_user_access_token) setFbUserToken(prev => prev || busRes.data.fb_user_access_token);
          if (busRes.data.fb_pages && Array.isArray(busRes.data.fb_pages) && busRes.data.fb_pages.length > 0) {
            setDiscoveredPages(prev => prev.length > 0 ? prev : busRes.data.fb_pages);
          }

          FacebookService.saveFacebookCredentials({
            userAccessToken: busRes.data.fb_user_access_token || undefined,
            pageAccessToken: busRes.data.fb_access_token || undefined,
            pageId: busRes.data.fb_page_id || undefined,
            pageName: busRes.data.fb_page_name || undefined
          });
        }
      } catch (e) {
        console.warn("Could not load business details", e);
      }
    }

    loadFacebookStatus();
  }, []);

  const handleCopyPageToken = () => {
    if (!fbToken) return;
    navigator.clipboard.writeText(fbToken);
    setCopiedPageToken(true);
    setTimeout(() => setCopiedPageToken(false), 2000);
  };

  const handleCopyUserToken = () => {
    if (!fbUserToken) return;
    navigator.clipboard.writeText(fbUserToken);
    setCopiedUserToken(true);
    setTimeout(() => setCopiedUserToken(false), 2000);
  };

  // Standard Facebook Login with optional scopes
  const handleFacebookLogin = async (reRequest = false, customScope?: string) => {
    if (reRequest) setIsReRequesting(true);
    else setIsLoggingIn(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const params = new URLSearchParams();
      if (reRequest) params.append('rerequest', 'true');
      if (customScope) params.append('scopes', customScope);
      if (typeof window !== "undefined") {
        // Use clean pathname without query parameters
        const cleanFrontendUrl = window.location.origin + window.location.pathname;
        params.append('frontend_url', cleanFrontendUrl);
      }
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const endpoint = `/api/facebook/connect${queryStr}`;
      
      const res = await api.get(endpoint);
      const authUrl = res.data.authorization_url || res.data.url;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setErrorMessage("Facebook authorization URL was not returned by server.");
        setIsLoggingIn(false);
        setIsReRequesting(false);
      }
    } catch (error: any) {
      console.error("Failed to fetch Facebook connect URL:", error);
      const msg = error.response?.data?.detail || error.message || "Failed to start Facebook login";
      setErrorMessage(msg);
      setIsLoggingIn(false);
      setIsReRequesting(false);
    }
  };

  // Automatically fetch Pages & Page Access Tokens using User Access Token
  const handleFetchPagesFromUserToken = async () => {
    const tokenToUse = fbUserToken.trim() || fbToken.trim();
    if (!tokenToUse) {
      setErrorMessage("Please enter a User Access Token first or login with Facebook.");
      return;
    }

    setIsFetchingPages(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. First attempt direct Graph API /me/accounts call
      const graphRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category&access_token=${tokenToUse}`);
      const graphData = await graphRes.json();

      if (graphData.data && Array.isArray(graphData.data) && graphData.data.length > 0) {
        const pagesList: FacebookPageItem[] = graphData.data.map((p: any) => ({
          page_id: p.id,
          page_name: p.name,
          page_access_token: p.access_token,
          category: p.category
        }));

        setDiscoveredPages(pagesList);
        const first = pagesList[0];
        setFbPageId(first.page_id);
        setFbPageName(first.page_name);
        if (first.page_access_token) {
          setFbToken(first.page_access_token);
        }
        setSuccessMessage(`Successfully fetched ${pagesList.length} Facebook Page(s)! Selected "${first.page_name}".`);
        setIsFetchingPages(false);
        return;
      }

      if (graphData.error) {
        throw new Error(graphData.error.message);
      }

      // 2. Server-side discovery fallback via /api/facebook/save-token
      const backendRes = await api.post('/api/facebook/save-token', {
        access_token: tokenToUse,
        fb_page_id: fbPageId || undefined,
        user_access_token: fbUserToken || undefined
      });

      if (backendRes.data?.pages && backendRes.data.pages.length > 0) {
        const pagesList: FacebookPageItem[] = backendRes.data.pages.map((p: any) => ({
          page_id: p.page_id || p.id,
          page_name: p.page_name || p.name,
          page_access_token: p.page_access_token || p.access_token,
          category: p.category
        }));
        setDiscoveredPages(pagesList);
        const first = pagesList[0];
        setFbPageId(first.page_id);
        setFbPageName(first.page_name);
        if (first.page_access_token) setFbToken(first.page_access_token);
        setSuccessMessage(`Discovered ${pagesList.length} page(s) via server! Selected "${first.page_name}".`);
      } else {
        setErrorMessage("No Facebook Pages found for this token. Ensure your Facebook account is an Admin of at least one Facebook Page.");
      }
    } catch (err: any) {
      console.error("Fetch pages error:", err);
      const msg = err.message || err.response?.data?.detail || "Could not fetch pages. Check your token.";
      setErrorMessage(msg);
    } finally {
      setIsFetchingPages(false);
    }
  };

  const handleSelectPage = async (page: FacebookPageItem) => {
    setFbPageId(page.page_id);
    setFbPageName(page.page_name);
    const effectiveToken = page.page_access_token || fbToken || fbUserToken;
    if (page.page_access_token) {
      setFbToken(page.page_access_token);
    }
    
    // Auto-save selected page immediately
    try {
      await FacebookService.saveFacebookCredentials({
        userAccessToken: fbUserToken || undefined,
        pageAccessToken: effectiveToken,
        pageId: page.page_id,
        pageName: page.page_name
      });
      setIsConnected(true);
      setSuccessMessage(`Selected & saved Page: ${page.page_name} (ID: ${page.page_id})`);
      ActivityService.logActivity({
        title: `Connected Facebook Page: ${page.page_name}`,
        description: `Page ID: ${page.page_id} connected with 24-hour auto-sync.`,
        category: "social",
        platform: "facebook",
        status: "Active",
        actionUrl: "/social-platforms/facebook",
      });
    } catch (e) {
      setSuccessMessage(`Selected Page: ${page.page_name}`);
    }
  };

  // Save Facebook Credentials
  const handleSaveSettings = async () => {
    if (!fbPageId.trim()) {
      setErrorMessage("Facebook Page ID is required.");
      return;
    }
    if (!fbToken.trim() && !fbUserToken.trim()) {
      setErrorMessage("Please provide a Page Access Token or User Access Token.");
      return;
    }

    setIsUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const activeToken = fbToken.trim() || fbUserToken.trim();

    try {
      await FacebookService.saveFacebookCredentials({
        userAccessToken: fbUserToken.trim() || undefined,
        pageAccessToken: activeToken,
        pageId: fbPageId.trim(),
        pageName: fbPageName.trim() || undefined
      });

      setUpdated(true);
      setIsConnected(true);
      setSuccessMessage("Facebook Page settings saved & activated successfully!");
      ActivityService.logActivity({
        title: `Saved Facebook Credentials: ${fbPageName || fbPageId}`,
        description: `Active Facebook credentials saved with Meta Graph API.`,
        category: "social",
        platform: "facebook",
        status: "Active",
        actionUrl: "/social-platforms/facebook",
      });
      setTimeout(() => setUpdated(false), 3000);
    } catch (error: any) {
      console.error("Failed to update Facebook settings:", error);
      const msg = error.response?.data?.detail || error.message || "Failed to save Facebook settings";
      setErrorMessage(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Facebook? This will remove saved tokens.")) {
      return;
    }

    setIsDisconnecting(true);
    try {
      await api.post('/api/facebook/disconnect');
      FacebookService.clearStoredCredentials();
      setIsConnected(false);
      setFbToken("");
      setFbUserToken("");
      setFbPageId("");
      setFbPageName("");
      setDiscoveredPages([]);
      setSuccessMessage("Facebook disconnected successfully.");
    } catch (e: any) {
      setErrorMessage("Failed to disconnect Facebook.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const isActuallyConnected = isConnected || Boolean(fbPageId && (fbToken || fbUserToken));

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500 mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-600/15 border border-blue-500/30 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <FacebookIcon className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Facebook Integration
            </h1>
            <p className="text-text-muted text-sm mt-0.5">
              Connect your Facebook Page with valid Page & User Access Tokens to automate posting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {isActuallyConnected ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
                <ShieldCheck className="w-4 h-4" /> Connected {fbPageName ? `• ${fbPageName}` : ""}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-sm font-mono">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> {remainingTime ? `Expires in ${remainingTime}` : "24h Auto-Expiry"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFacebookLogin(true)}
                disabled={isLoggingIn || isReRequesting}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs h-8 px-2.5 flex items-center gap-1.5"
                title="Switch to another Facebook account or re-authorize permissions"
              >
                {isReRequesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-blue-400" />}
                <span className="hidden sm:inline">Switch Account</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-8 px-2.5"
                title="Disconnect Facebook"
              >
                {isDisconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </Button>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              Not Connected
            </span>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start justify-between text-red-400 text-sm animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-semibold text-red-300">Action Required</p>
              <p className="text-red-400/90 text-xs mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs hover:underline ml-4 text-red-300 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start justify-between text-emerald-400 text-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <p className="text-emerald-300 text-xs">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs hover:underline ml-4 text-emerald-300 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* Fast Facebook Connect Card (Shown ONLY when NOT logged in/connected) */}
      {!isActuallyConnected && (
        /* Fast Facebook Connect Card (Shown ONLY when NOT logged in/connected) */
        <Card className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-surface border-blue-500/30 shadow-xl overflow-hidden relative">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <FacebookIcon className="w-5 h-5" /> Fast Facebook OAuth Connect
              </h3>
              <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
                Log in with Facebook to automatically grant permissions (<code className="text-blue-300 font-mono text-xs">pages_show_list</code>, <code className="text-blue-300 font-mono text-xs">public_profile</code>) and retrieve your Facebook Pages securely.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full md:w-auto shrink-0">
              <Button
                onClick={() => handleFacebookLogin(false, "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts")}
                disabled={isLoggingIn || isReRequesting}
                className="px-5 py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FacebookIcon className="h-4 w-4 text-white" />
                    Login with Facebook
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleFacebookLogin(false, "public_profile,email,pages_show_list")}
                disabled={isLoggingIn || isReRequesting}
                className="px-4 py-5 border-blue-400/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                title="Safe connect with basic permissions (public_profile, pages_show_list)"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Safe Connect (Basic Pages)
              </Button>

              <Button
                variant="outline"
                onClick={() => handleFacebookLogin(true, "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts")}
                disabled={isLoggingIn || isReRequesting}
                className="px-4 py-5 border-gray-600/40 bg-surface-elevated/40 hover:bg-surface-elevated text-gray-300 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                title="Forces Facebook to re-prompt page selection and permissions if you skipped them earlier"
              >
                {isReRequesting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Re-requesting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 text-blue-400" />
                    Re-Login for Page Access
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discovered Pages Selection Card (if pages found) */}
      {discoveredPages.length > 0 && (
        <Card className="bg-surface-elevated/70 border-brand-purple/40 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-purple" />
              <CardTitle className="text-white text-base">Select Your Facebook Page</CardTitle>
            </div>
            <CardDescription className="text-xs text-text-muted">
              We discovered {discoveredPages.length} Facebook Page(s) linked to your account. Click to select:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {discoveredPages.map((page) => {
                const isSelected = fbPageId === page.page_id;
                return (
                  <button
                    key={page.page_id}
                    type="button"
                    onClick={() => handleSelectPage(page)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-brand-purple/15 border-brand-purple text-white shadow-md shadow-brand-purple/20"
                        : "bg-surface border-border hover:border-gray-500 text-gray-300"
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                        <FacebookIcon className="w-4 h-4 shrink-0" />
                        {page.page_name}
                      </div>
                      <div className="text-xs font-mono text-gray-400 mt-0.5 truncate">
                        ID: {page.page_id} {page.category ? `• ${page.category}` : ""}
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="p-1 rounded-full bg-brand-purple text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-xs text-blue-400 hover:underline shrink-0">
                        Select
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facebook API Credentials & Tokens Card */}
      <Card className="bg-surface border-border shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-white text-lg">Facebook Credentials & Access Tokens</CardTitle>
            </div>
            <span className="text-xs text-gray-400">Meta Graph API v19.0</span>
          </div>
          <CardDescription className="text-xs">
            Manage your User Access Token and Page Access Token separately for full publishing access.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {/* 1. User Access Token (NEW FIELD) */}
          <div className="space-y-2 p-4 rounded-xl bg-surface-elevated/40 border border-border/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Label className="text-white font-semibold flex items-center gap-2 text-sm">
                  User Access Token
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/15 text-blue-400 font-mono uppercase">
                    Personal Token
                  </span>
                </Label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Generated when logging into Facebook or from Meta Graph API Explorer.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {fbUserToken && (
                  <button
                    type="button"
                    onClick={handleCopyUserToken}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copiedUserToken ? "Copied" : "Copy"}
                  </button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFetchPagesFromUserToken}
                  disabled={isFetchingPages || !fbUserToken.trim()}
                  className="h-7 text-xs px-2.5 border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 gap-1.5"
                  title="Extract all Facebook Pages and Page Access Tokens from this User Token"
                >
                  {isFetchingPages ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Layers className="w-3 h-3 text-blue-400" />
                  )}
                  Fetch Pages & Tokens
                </Button>
              </div>
            </div>

            <div className="relative mt-2">
              <Input
                type={showUserToken ? "text" : "password"}
                placeholder="EAA... (Facebook User Access Token)"
                value={fbUserToken}
                onChange={(e) => setFbUserToken(e.target.value)}
                className="pr-10 border-border bg-black/40 text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowUserToken(!showUserToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                title={showUserToken ? "Hide token" : "Show token"}
              >
                {showUserToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. Facebook Page ID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white font-semibold text-sm">Facebook Page ID</Label>
              <span className="text-xs text-text-muted">Numeric ID of your Page (e.g. 10435...)</span>
            </div>
            <Input 
              placeholder="e.g. 104358912345678" 
              value={fbPageId}
              onChange={(e) => setFbPageId(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-sm"
            />
          </div>

          {/* 3. Page Access Token (Primary Publishing Token) */}
          <div className="space-y-2 p-4 rounded-xl bg-surface-elevated/40 border border-emerald-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Label className="text-white font-semibold flex items-center gap-2 text-sm">
                  Page Access Token
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 font-mono uppercase">
                    Required for Posts & Photos
                  </span>
                </Label>
                <p className="text-xs text-gray-400 mt-0.5">
                  The dedicated token required by Facebook Graph API to publish posts directly to your Page.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {fbToken && (
                  <button
                    type="button"
                    onClick={handleCopyPageToken}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copiedPageToken ? "Copied" : "Copy"}
                  </button>
                )}
                {!isActuallyConnected && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFacebookLogin(true)}
                    disabled={isLoggingIn || isReRequesting}
                    className="h-7 text-xs px-2.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 gap-1.5"
                    title="Re-run Facebook Login to grant page access permissions"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-400" />
                    Re-request Page Login
                  </Button>
                )}
              </div>
            </div>

            <div className="relative mt-2">
              <Input 
                type={showPageToken ? "text" : "password"} 
                placeholder="EAA... (Dedicated Page Access Token)" 
                value={fbToken}
                onChange={(e) => setFbToken(e.target.value)}
                className="pr-10 border-border bg-black/40 text-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPageToken(!showPageToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                title={showPageToken ? "Hide token" : "Show token"}
              >
                {showPageToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isActuallyConnected && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Facebook account is active & credentials are automatically saved.
                </span>
                <span className="font-mono text-[11px] text-emerald-400/80">Status: Active</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-300">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  24-Hour Auto-Delete Policy: Access codes and page access tokens are automatically purged after 24 hours.
                </span>
                <span className="font-mono text-[11px] text-blue-400 font-semibold">
                  {remainingTime ? `Expires in ${remainingTime}` : "24h Auto-Expiry"}
                </span>
              </div>
              {tokenPermissionWarning && (
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-300">Missing Publishing Permission</p>
                    <p className="mt-1 leading-relaxed text-amber-200/90">{tokenPermissionWarning}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleSaveSettings} 
            disabled={isUpdating} 
            className="w-full py-6 bg-brand-gradient hover:opacity-90 text-white font-semibold rounded-xl text-base transition-opacity shadow-lg"
          >
            {isUpdating ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Facebook Credentials...</>
            ) : updated ? (
              <><Check className="mr-2 h-5 w-5 text-emerald-400" /> Settings Saved Successfully!</>
            ) : isActuallyConnected ? (
              "Update Facebook Credentials"
            ) : (
              "Save Facebook Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}