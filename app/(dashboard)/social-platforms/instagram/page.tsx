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
  UserCheck 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { InstagramService } from "@/services/instagram.service";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function InstagramIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [igAccountId, setIgAccountId] = useState("");
  const [igToken, setIgToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 0. Pre-hydrate immediately from localStorage so locally saved data is visible in fields INSTANTLY
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
    
    // 1. Check for tokens from URL after OAuth redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      tokenFromUrl = params.get('access_token') || params.get('token') || params.get('ig_access_token');
      const isConnectedSuccess = params.get('instagram_connected') === 'true';
      accIdFromUrl = params.get('ig_account_id') || params.get('account_id');
      const errorFromUrl = params.get('error') || params.get('error_description');

      if (errorFromUrl) {
        setErrorMessage(decodeURIComponent(errorFromUrl));
      }
      
      if (tokenFromUrl || isConnectedSuccess) {
        const finalToken = tokenFromUrl || stored.accessToken;
        const finalAccId = accIdFromUrl || stored.accountId;

        if (finalToken) setIgToken(finalToken);
        if (finalAccId) setIgAccountId(finalAccId);
        setIsConnected(true);
        setSuccessMessage("Instagram connected successfully!");
        
        // Clean URL to hide token
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Persist to localStorage and sync backend
        InstagramService.saveInstagramCredentials({
          accountId: finalAccId || "",
          accessToken: finalToken || "",
          syncBackend: true
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

          // Populate fields and sync to localStorage
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
  }, []);

  const handleUpdate = async (accId = igAccountId, token = igToken) => {
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      // Save locally to localStorage so data persists immediately in browser
      await InstagramService.saveInstagramCredentials({
        accountId: accId,
        accessToken: token,
        syncBackend: true
      });
      setUpdated(true);
      if (accId || token) {
        setIsConnected(true);
      }
      setSuccessMessage("Instagram credentials saved locally and synchronized successfully!");
      setTimeout(() => setUpdated(false), 3000);
    } catch (error: any) {
      console.error("Failed to update Instagram", error);
      // Even if backend fails, locally save data
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

  const handleInstagramLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const res = await api.get('/api/instagram/connect');
      const authUrl = res.data.authorization_url;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        console.error("Auth URL not found in response:", res.data);
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

  // Connected state: either marked connected or has stored token/ID
  const isActuallyConnected = Boolean(isConnected || (igAccountId && igToken) || igToken);

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white shadow-lg">
            <InstagramIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Instagram Integration</h1>
            <p className="text-text-muted text-sm mt-1">Connect your Instagram Business account to auto-publish Posts and Reels.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isActuallyConnected ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-sm">
                <ShieldCheck className="w-4 h-4" /> Connected
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

      {/* Primary Connect / Connected Management Card */}
      {isActuallyConnected ? (
        /* Connected State Card: "Login with Instagram" button is completely hidden */
        <Card className="bg-gradient-to-r from-emerald-950/40 via-purple-950/20 to-surface border-emerald-500/30 shadow-xl overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
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
                      Your Instagram Business account is connected and ready for automated social media posting.
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
                  className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs h-9 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
                >
                  {isDisconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Disconnect Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Fast Instagram Connect Banner: Shown ONLY when NOT logged in / connected */
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-surface border-pink-500/30 shadow-xl overflow-hidden relative">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                Fast Instagram Connect
              </h3>
              <p className="text-sm text-gray-300 max-w-md">
                Log in with your Instagram account to automatically authorize graph permissions and generate a permanent access token.
              </p>
            </div>

            <Button
              onClick={handleInstagramLogin}
              disabled={isLoggingIn || isUpdating}
              className="w-full md:w-auto px-6 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all text-base flex items-center justify-center gap-3 shrink-0"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Access Token...
                </>
              ) : (
                <>
                  <InstagramIcon className="h-5 w-5 text-white" />
                  Login with Instagram
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Manual Credentials Card */}
      <Card className="bg-surface border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <InstagramIcon className="h-5 w-5 text-pink-500" />
            <CardTitle className="text-white">Instagram Graph API Credentials</CardTitle>
          </div>
          <CardDescription>
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
                  className="text-xs text-text-muted hover:text-white flex items-center gap-1"
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="relative">
              <Input 
                type={showToken ? "text" : "password"}
                placeholder="IGAGZABUPI..." 
                value={igToken}
                onChange={(e) => setIgToken(e.target.value)}
                className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-xs pr-10"
              />
            </div>
          </div>

          <Button 
            onClick={() => handleUpdate()} 
            disabled={isUpdating || isLoggingIn} 
            className="w-full bg-brand-gradient hover:opacity-90 text-white transition-opacity font-semibold h-11"
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
