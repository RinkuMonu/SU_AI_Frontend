"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, 
  Check, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  UserCheck,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Link2,
  ChevronRight,
  Info
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { InstagramService } from "@/services/instagram.service";
import { FacebookService } from "@/services/facebook.service";
import { ActivityService } from "@/services/activity.service";

const InstagramIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad-icon" cx="0.3" cy="1" r="1">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad-icon)" />
    <path
      d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"
      fill="#ffffff"
    />
  </svg>
);

const FacebookIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.117 8.52h-1.808c-.282 0-.603.37-.603.882v1.548h2.411l-.328 2.45h-2.083V20h-2.528v-6.6H8.225v-2.45h1.953V9.395c0-1.895 1.155-2.928 2.85-2.928.812 0 1.512.06 1.716.088v1.965z"
      fill="#ffffff"
    />
  </svg>
);

interface LinkedInstagramFromFB {
  id: string;
  username: string;
  name?: string;
  profilePicture?: string;
  pageName?: string;
  token: string;
}

export default function InstagramIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isConnectingFb, setIsConnectingFb] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [igAccountId, setIgAccountId] = useState("");
  const [igToken, setIgToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Linked Instagram account auto-detected from connected Facebook Page
  const [linkedIgFromFacebook, setLinkedIgFromFacebook] = useState<LinkedInstagramFromFB | null>(null);
  const [isDetectingLinked, setIsDetectingLinked] = useState(false);

  // Safety timer to ensure the button never gets stuck indefinitely
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoggingIn || isConnectingFb) {
      timer = setTimeout(() => {
        setIsLoggingIn(false);
        setIsConnectingFb(false);
      }, 10000); // 10s auto-reset
    }
    return () => clearTimeout(timer);
  }, [isLoggingIn, isConnectingFb]);

  useEffect(() => {
    // 0. Pre-hydrate immediately from localStorage
    const stored = InstagramService.getStoredCredentials();
    if (stored.accountId) {
      setIgAccountId(stored.accountId);
    }
    if (stored.accessToken) {
      setIgToken(stored.accessToken);
    }
    if (stored.accountId || stored.accessToken) {
      setIsConnected(true);
    }

    let tokenFromUrl: string | null = null;
    let accIdFromUrl: string | null = null;
    let codeFromUrl: string | null = null;
    
    // 1. Check URL parameters after OAuth redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      tokenFromUrl = params.get('access_token') || params.get('token') || params.get('ig_access_token');
      const isConnectedSuccess = params.get('instagram_connected') === 'true';
      accIdFromUrl = params.get('ig_account_id') || params.get('account_id') || params.get('ig_user_id');
      codeFromUrl = params.get('code');
      const errorFromUrl = params.get('error') || params.get('error_description') || params.get('instagram_error');

      if (errorFromUrl) {
        setErrorMessage(decodeURIComponent(errorFromUrl));
        setIsLoggingIn(false);
        setIsConnectingFb(false);
      }
      
      // Token or Success flag in URL
      if (tokenFromUrl || isConnectedSuccess) {
        const finalToken = tokenFromUrl || stored.accessToken;
        const finalAccId = accIdFromUrl || stored.accountId;

        if (finalToken) setIgToken(finalToken);
        if (finalAccId) setIgAccountId(finalAccId);
        setIsConnected(true);
        setSuccessMessage("Instagram connected successfully!");
        
        // Clean URL to hide token
        window.history.replaceState({}, document.title, window.location.pathname);
        
        InstagramService.saveInstagramCredentials({
          accountId: finalAccId || "",
          accessToken: finalToken || "",
          syncBackend: true
        });

        ActivityService.logActivity({
          title: "Instagram Account Connected",
          description: `Connected Instagram Professional account (ID: ${finalAccId || "Active"}).`,
          category: "social",
          platform: "instagram",
          status: "Active",
          actionUrl: "/social-platforms/instagram"
        });
      } 
      // If code is returned, exchange it with backend
      else if (codeFromUrl) {
        setIsLoggingIn(true);
        const cleanFrontendUrl = window.location.origin + window.location.pathname;
        
        api.post('/api/instagram/exchange-token', {
          code: codeFromUrl,
          redirect_uri: cleanFrontendUrl
        }).then((res) => {
          const exchangedToken = res.data?.access_token;
          const exchangedAccId = res.data?.user_id || res.data?.account_id || "";

          if (exchangedToken) {
            setIgToken(exchangedToken);
            if (exchangedAccId) setIgAccountId(exchangedAccId);
            setIsConnected(true);
            setSuccessMessage("Instagram connected successfully via authorization code!");
            InstagramService.saveInstagramCredentials({
              accountId: exchangedAccId,
              accessToken: exchangedToken,
              syncBackend: true
            });
            ActivityService.logActivity({
              title: "Instagram Account Connected",
              description: `Exchanged code for active Instagram access token.`,
              category: "social",
              platform: "instagram",
              status: "Active",
              actionUrl: "/social-platforms/instagram"
            });
          }
        }).catch((err) => {
          console.warn("Instagram code exchange:", err);
          // Don't show hard error if user already has credentials
          if (!stored.accessToken) {
            setErrorMessage("Could not complete code exchange. Try connecting via Facebook Page.");
          }
        }).finally(() => {
          setIsLoggingIn(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      }
    }

    // 2. Load business details from backend
    async function fetchBusinessData() {
      try {
        const res = await api.get('/api/v1/businesses/me');
        if (res.data) {
          const backendAccountId = res.data.ig_account_id || res.data.instagram_account_id || "";
          const backendToken = res.data.ig_access_token || res.data.instagram_token || "";

          if (backendAccountId && !accIdFromUrl) {
            setIgAccountId(backendAccountId);
            localStorage.setItem("ig_account_id", backendAccountId);
          }
          if (backendToken && !tokenFromUrl) {
            setIgToken(backendToken);
            localStorage.setItem("ig_access_token", backendToken);
            setIsConnected(true);
          }
        }
      } catch (e) {
        console.warn("Could not load business details from backend", e);
      } finally {
        setLoadingData(false);
      }
    }
    fetchBusinessData();

    // 3. Auto-detect if connected Facebook Page has a linked Instagram Professional Account
    async function checkLinkedInstagramFromFacebook() {
      const fbCreds = FacebookService.getStoredCredentials();
      if (!fbCreds.isExpired && fbCreds.pageId && (fbCreds.pageAccessToken || fbCreds.userAccessToken)) {
        setIsDetectingLinked(true);
        const tokenToUse = fbCreds.pageAccessToken || fbCreds.userAccessToken;
        try {
          const graphRes = await fetch(
            `https://graph.facebook.com/v19.0/${fbCreds.pageId}?fields=instagram_business_account{id,username,name,profile_picture_url}&access_token=${tokenToUse}`
          );
          const graphData = await graphRes.json();
          if (graphData?.instagram_business_account?.id) {
            const igAcc = graphData.instagram_business_account;
            setLinkedIgFromFacebook({
              id: igAcc.id,
              username: igAcc.username || "",
              name: igAcc.name || "",
              profilePicture: igAcc.profile_picture_url || "",
              pageName: fbCreds.pageName,
              token: tokenToUse
            });
          }
        } catch (e) {
          console.warn("Notice: Facebook graph linked IG lookup:", e);
        } finally {
          setIsDetectingLinked(false);
        }
      }
    }
    checkLinkedInstagramFromFacebook();
  }, []);

  // Connect detected Instagram Account from Facebook Page
  const handleConnectLinkedFromFacebook = async () => {
    if (!linkedIgFromFacebook) return;
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      setIgAccountId(linkedIgFromFacebook.id);
      setIgToken(linkedIgFromFacebook.token);
      setIsConnected(true);

      await InstagramService.saveInstagramCredentials({
        accountId: linkedIgFromFacebook.id,
        accessToken: linkedIgFromFacebook.token,
        syncBackend: true
      });

      setSuccessMessage(`Instagram account @${linkedIgFromFacebook.username || linkedIgFromFacebook.id} connected successfully from Facebook Page!`);

      ActivityService.logActivity({
        title: `Connected Instagram: @${linkedIgFromFacebook.username || linkedIgFromFacebook.id}`,
        description: `Linked via Facebook Page "${linkedIgFromFacebook.pageName || 'Facebook'}" for reels & post publishing.`,
        category: "social",
        platform: "instagram",
        status: "Active",
        actionUrl: "/social-platforms/instagram"
      });
    } catch (e: any) {
      setErrorMessage("Failed to save linked Instagram account.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Direct Instagram Login via backend
  const handleInstagramLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const cleanFrontendUrl = typeof window !== "undefined" 
        ? window.location.origin + window.location.pathname 
        : "";
      
      const queryStr = cleanFrontendUrl ? `?frontend_url=${encodeURIComponent(cleanFrontendUrl)}` : "";
      const res = await api.get(`/api/instagram/connect${queryStr}`);
      const authUrl = res.data.authorization_url;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setErrorMessage("Failed to get authorization URL from server.");
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      console.error("Failed to fetch Instagram connect URL:", error);
      const msg = error.response?.data?.detail || "Could not initialize Instagram login. Check backend configuration.";
      setErrorMessage(msg);
      setIsLoggingIn(false);
    }
  };

  // Connect via Facebook Login (Meta Graph API with Instagram Permissions)
  const handleConnectViaFacebook = async () => {
    setIsConnectingFb(true);
    setErrorMessage(null);
    try {
      const cleanFrontendUrl = typeof window !== "undefined" 
        ? window.location.origin + window.location.pathname 
        : "";
      
      const scopes = "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish";
      const res = await api.get(`/api/facebook/connect?scopes=${encodeURIComponent(scopes)}&frontend_url=${encodeURIComponent(cleanFrontendUrl)}`);
      const authUrl = res.data.authorization_url || res.data.url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setErrorMessage("Facebook authorization URL was not returned.");
        setIsConnectingFb(false);
      }
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Failed to start Facebook OAuth for Instagram permissions.";
      setErrorMessage(msg);
      setIsConnectingFb(false);
    }
  };

  // Quick Connect Demo Mode (Development / Offline test)
  const handleQuickConnect = async () => {
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      const fbCreds = FacebookService.getStoredCredentials();
      const demoId = "17841400000000001";
      const effectiveToken = fbCreds.pageAccessToken || fbCreds.userAccessToken || "DEMO_IG_ACCESS_TOKEN";

      setIgAccountId(demoId);
      setIgToken(effectiveToken);
      setIsConnected(true);

      await InstagramService.saveInstagramCredentials({
        accountId: demoId,
        accessToken: effectiveToken,
        syncBackend: true
      });

      setSuccessMessage("Instagram Quick Connect activated successfully!");
      ActivityService.logActivity({
        title: "Instagram Quick Connect",
        description: "Instagram account activated for AI post and reel publishing.",
        category: "social",
        platform: "instagram",
        status: "Active",
        actionUrl: "/social-platforms/instagram"
      });
    } catch {
      setErrorMessage("Failed to activate Instagram connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (accId = igAccountId, token = igToken) => {
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      await InstagramService.saveInstagramCredentials({
        accountId: accId,
        accessToken: token,
        syncBackend: true
      });
      setUpdated(true);
      if (accId || token) {
        setIsConnected(true);
      }
      setSuccessMessage("Instagram credentials saved and synchronized successfully!");
      setTimeout(() => setUpdated(false), 3000);
    } catch (error: any) {
      console.error("Failed to update Instagram", error);
      InstagramService.saveInstagramCredentials({
        accountId: accId,
        accessToken: token,
        syncBackend: false
      });
      setUpdated(true);
      if (accId || token) {
        setIsConnected(true);
      }
      setSuccessMessage("Credentials saved locally in browser.");
      setTimeout(() => setUpdated(false), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Instagram?")) return;
    setIsDisconnecting(true);
    setErrorMessage(null);
    try {
      await InstagramService.clearStoredCredentials(true);
      setIgAccountId("");
      setIgToken("");
      setIsConnected(false);
      setSuccessMessage("Instagram disconnected successfully.");
    } catch (err: any) {
      console.error("Failed to disconnect Instagram", err);
      setErrorMessage("Failed to disconnect Instagram.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const isActuallyConnected = Boolean(isConnected || (igAccountId && igToken) || igToken);

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white shadow-lg">
            <InstagramIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Instagram Integration</h1>
            <p className="text-text-muted text-sm mt-0.5">Connect your Instagram Business account to auto-publish Posts and Reels.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isActuallyConnected ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
                <ShieldCheck className="w-4 h-4" /> Connected {igAccountId ? `• ID: ${igAccountId}` : ""}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-8 px-2.5"
                title="Disconnect Instagram"
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
              <p className="font-semibold text-red-300">Notice</p>
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

      {/* Found Linked Instagram Account from Facebook Page Banner */}
      {linkedIgFromFacebook && !isActuallyConnected && (
        <Card className="bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-surface border-emerald-500/40 shadow-xl overflow-hidden animate-in fade-in">
          <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Recommended • 1-Click
                </span>
                <span className="text-xs text-gray-300 flex items-center gap-1">
                  <FacebookIcon className="w-3.5 h-3.5" /> From Facebook Page: {linkedIgFromFacebook.pageName || "Active"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <InstagramIcon className="w-5 h-5" />
                Linked Instagram Account: @{linkedIgFromFacebook.username || linkedIgFromFacebook.id}
              </h3>
              <p className="text-xs text-gray-300 max-w-lg leading-relaxed">
                We detected that your connected Facebook Page is already linked to this Instagram Business account. Connect it in one click!
              </p>
            </div>

            <Button
              onClick={handleConnectLinkedFromFacebook}
              disabled={isUpdating}
              className="w-full md:w-auto px-5 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Connect @{linkedIgFromFacebook.username || "Instagram"}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Primary Connect / Connected Management Card */}
      {isActuallyConnected ? (
        <Card className="bg-gradient-to-r from-emerald-950/30 via-surface to-surface border-emerald-500/30 shadow-xl overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">Instagram Account Connected</h3>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Saved & Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Your Instagram Business account is active and ready for automated social media posting.
                    </p>
                  </div>
                </div>

                {igAccountId && (
                  <div className="flex items-center gap-2 text-xs text-gray-300 bg-surface-elevated/70 border border-border/80 px-3 py-1.5 rounded-lg w-fit">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Account ID:</span>
                    <span className="font-mono text-emerald-400 font-medium">{igAccountId}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs h-9 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium cursor-pointer"
                >
                  {isDisconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Disconnect Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Fast Instagram Connect Card */
        <Card className="bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-surface border-pink-500/30 shadow-xl overflow-hidden relative">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <InstagramIcon className="w-5 h-5" /> Fast Instagram Connect
              </h3>
              <p className="text-sm text-gray-300 max-w-md leading-relaxed">
                Connect your Instagram account to automatically authorize graph permissions and enable 1-click publishing for AI posts and reels.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full md:w-auto shrink-0">
              {/* Option 1: Connect via Facebook Login (Meta Graph API) - Most reliable */}
              <Button
                onClick={handleConnectViaFacebook}
                disabled={isConnectingFb || isLoggingIn}
                className="px-5 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                title="Connect Instagram via official Meta Facebook permissions"
              >
                {isConnectingFb ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FacebookIcon className="h-4 w-4" />
                    Connect via Facebook
                  </>
                )}
              </Button>

              {/* Option 2: Direct Instagram Login */}
              <Button
                variant="outline"
                onClick={handleInstagramLogin}
                disabled={isLoggingIn || isConnectingFb}
                className="px-4 py-5 border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Direct login on instagram.com"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <InstagramIcon className="h-4 w-4" />
                    Instagram.com Login
                  </>
                )}
              </Button>

              {/* Option 3: Quick Connect for Testing */}
              <Button
                variant="outline"
                onClick={handleQuickConnect}
                disabled={isUpdating}
                className="px-3 py-5 border-gray-600/40 bg-surface-elevated/40 hover:bg-surface-elevated text-gray-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Instant connect for testing AI posts and reels"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Credentials Card */}
      <Card className="bg-surface border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <InstagramIcon className="h-5 w-5 text-pink-500" />
              <CardTitle className="text-white text-base">Instagram Graph API Credentials</CardTitle>
            </div>
            <span className="text-xs text-text-muted">Meta Graph API v19.0</span>
          </div>
          <CardDescription className="text-xs">
            Credentials are saved locally in your browser and synchronized with your business account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm font-medium">Instagram Account ID</Label>
              {igAccountId && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Locally Saved
                </span>
              )}
            </div>
            <Input 
              placeholder="e.g. 178414..." 
              value={igAccountId}
              onChange={(e) => setIgAccountId(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm font-medium">Permanent Access Token</Label>
              <div className="flex items-center gap-3">
                {igToken && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Locally Saved
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-xs text-text-muted hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="relative">
              <Input 
                type={showToken ? "text" : "password"}
                placeholder="IGAGZABUPI... or EAAP..." 
                value={igToken}
                onChange={(e) => setIgToken(e.target.value)}
                className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-xs pr-10"
              />
            </div>
          </div>

          <Button 
            onClick={() => handleUpdate()} 
            disabled={isUpdating || isLoggingIn} 
            className="w-full bg-brand-gradient hover:opacity-90 text-white transition-opacity font-semibold h-11 cursor-pointer"
          >
            {isUpdating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Credentials...</>
            ) : updated ? (
              <><Check className="mr-2 h-4 w-4" /> Saved Successfully</>
            ) : (
              "Save Instagram Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
