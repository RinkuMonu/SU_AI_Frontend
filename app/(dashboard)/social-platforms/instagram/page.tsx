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
      tokenFromUrl = params.get('access_token') || params.get('token') || params.get('ig_access_token') || params.get('fb_access_token') || params.get('user_access_token');
      const isConnectedSuccess = params.get('instagram_connected') === 'true' || params.get('facebook_connected') === 'true';
      accIdFromUrl = params.get('ig_account_id') || params.get('account_id') || params.get('ig_user_id');
      const fbPageToken = params.get('fb_access_token');
      const fbPageId = params.get('fb_page_id');
      if (fbPageToken) {
        FacebookService.saveCredentials({
          pageAccessToken: fbPageToken,
          pageId: fbPageId || undefined,
          userAccessToken: params.get('user_access_token') || undefined,
        });
      }
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
    <div 
      style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} 
      className="-my-6 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-6 min-h-[calc(100vh-64px)] overflow-y-auto animate-in fade-in duration-300"
    >
      <div className="max-w-4xl mx-auto w-full space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2a4a]">
          <div className="flex items-center gap-3.5">
            {/* Instagram logo with #081226 background (Image 2) and actual original Instagram icon */}
            <div 
              style={{ backgroundColor: "#081226" }} 
              className="w-12 h-12 rounded-2xl border border-[#1e2a4a] flex items-center justify-center shrink-0 shadow-md"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <defs>
                  <radialGradient id="ig-orig-gradient" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="5%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </radialGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-orig-gradient)" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="4.5" stroke="url(#ig-orig-gradient)" strokeWidth="2" fill="none" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-orig-gradient)" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-white">Instagram Integration</h1>
              <p className="text-slate-400 text-sm mt-1 font-normal tracking-wide">Connect your Instagram Business account to auto-publish Posts and Reels.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isActuallyConnected ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-normal shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Connected {igAccountId ? `• ID: ${igAccountId}` : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-8 px-3 rounded-xl cursor-pointer"
                  title="Disconnect Instagram"
                >
                  {isDisconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </Button>
              </div>
            ) : (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1c2333] border border-[#2a354c] text-slate-300 text-xs font-normal">
                Not Connected
              </span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start justify-between text-red-400 text-xs sm:text-sm animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-normal text-red-300">Notice</p>
                <p className="text-red-400/90 text-xs sm:text-sm mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-xs hover:underline ml-4 text-red-300 shrink-0">
              Dismiss
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start justify-between text-emerald-400 text-xs sm:text-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <p className="text-emerald-300 text-xs sm:text-sm">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-xs hover:underline ml-4 text-emerald-300 shrink-0">
              Dismiss
            </button>
          </div>
        )}

        {/* Primary Connect / Connected Management Card */}
        {isActuallyConnected ? (
          <Card className="bg-[#0c1630] border-[#1e2a4a] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-normal text-white tracking-wide">Instagram Account Connected</h3>
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-normal bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Saved &amp; Active
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 font-normal tracking-wide pl-11">
                    Your Instagram Business account is active and ready for automated social media posting.
                  </p>
                  {igAccountId && (
                    <div className="pt-1.5 pl-11">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#081226] border border-[#1e2a4a] text-xs font-mono text-emerald-400">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400 font-sans">ACCOUNT ID:</span>
                        {igAccountId}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs sm:text-sm h-9 px-4 rounded-xl flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
                >
                  {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Disconnect Account</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#0c1630] border-[#1e2a4a] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <InstagramIcon className="w-7 h-7 shrink-0" />
                  <h3 className="text-lg sm:text-xl font-normal text-white tracking-wide">Fast Instagram Connect</h3>
                </div>
                <p className="text-sm text-slate-300 font-normal tracking-wide max-w-xl leading-relaxed">
                  Connect your Instagram account to automatically authorize graph permissions and enable 1-click publishing for AI posts and reels.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap pt-1">
                <Button
                  onClick={handleInstagramLogin}
                  disabled={isLoggingIn || isConnectingFb}
                  className="h-10 px-4 bg-gradient-to-r from-[#ff7a59] via-[#e244b2] to-[#8a3ffc] hover:opacity-95 text-white font-normal text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Connect directly via Instagram Basic Display &amp; Graph API"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <InstagramIcon className="h-4 w-4" />
                      Connect Instagram Account
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleConnectViaFacebook}
                  disabled={isLoggingIn || isConnectingFb}
                  className="h-10 px-4 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-normal text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FacebookIcon className="h-4 w-4" />
                  Via Facebook Page
                </Button>

                <Button
                  variant="outline"
                  onClick={handleQuickConnect}
                  disabled={isUpdating}
                  className="h-10 px-4 border-[#1e2a4a] bg-[#162138] hover:bg-[#1e2d4d] text-slate-300 font-normal text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Instant connect for testing AI posts and reels"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Quick Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Credentials Card */}
        <Card className="bg-[#0c1630] border-[#1e2a4a] shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="py-4 px-5 sm:px-6 border-b border-[#1e2a4a]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <InstagramIcon className="w-7 h-7 shrink-0" />
                <CardTitle className="text-white text-lg sm:text-xl font-normal tracking-wide">
                  Instagram Graph API Credentials
                </CardTitle>
              </div>
              <span className="text-xs text-slate-400 font-normal">Meta Graph API v19.0</span>
            </div>
            <CardDescription className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
              Credentials are saved locally in your browser and synchronized with your business account.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white text-sm sm:text-base font-normal tracking-wide">Instagram Account ID</Label>
                {igAccountId && (
                  <span className="text-xs text-emerald-400 font-normal flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Locally Saved
                  </span>
                )}
              </div>
              <Input 
                placeholder="e.g. 178414..." 
                value={igAccountId}
                onChange={(e) => setIgAccountId(e.target.value)}
                className="border-[#1e2a4a] bg-[#081226] text-white focus:ring-2 focus:ring-[#8b5cf6]/50 outline-none text-sm font-normal h-10 px-3.5 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white text-sm sm:text-base font-normal tracking-wide">Permanent Access Token</Label>
                <div className="flex items-center gap-3">
                  {igToken && (
                    <span className="text-xs text-emerald-400 font-normal flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Locally Saved
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  className="border-[#1e2a4a] bg-[#081226] text-white focus:ring-2 focus:ring-[#8b5cf6]/50 outline-none text-sm font-normal h-10 px-3.5 pr-11 rounded-xl"
                />
              </div>
            </div>

            <Button 
              onClick={() => handleUpdate()} 
              disabled={isUpdating || isLoggingIn} 
              className="w-full bg-gradient-to-r from-[#ff7a59] via-[#e244b2] to-[#8a3ffc] hover:opacity-95 text-white transition-all font-normal text-sm sm:text-base tracking-wide h-11 cursor-pointer rounded-xl shadow-[0_0_12px_rgba(138,63,252,0.2)] mt-2"
            >
              {isUpdating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Credentials...</>
              ) : updated ? (
                <><Check className="mr-2 h-4 w-4 text-emerald-300" /> Saved Successfully</>
              ) : (
                "Save Instagram Settings"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
