"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, ExternalLink, ShieldCheck } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function InstagramIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [igAccountId, setIgAccountId] = useState("");
  const [igToken, setIgToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let tokenFromUrl: string | null = null;
    let accIdFromUrl: string | null = null;
    
    // Check for tokens from URL after OAuth redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      tokenFromUrl = params.get('access_token') || params.get('token') || params.get('ig_access_token');
      const isConnectedSuccess = params.get('instagram_connected') === 'true';
      accIdFromUrl = params.get('ig_account_id') || params.get('account_id');
      
      if (tokenFromUrl || isConnectedSuccess) {
        console.log("Instagram Access Token:", tokenFromUrl);
        setIgToken(tokenFromUrl || "");
        if (accIdFromUrl) {
          setIgAccountId(accIdFromUrl);
        }
        setIsConnected(true);
        
        // Clean URL to hide token
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Send token to the backend API
        if (tokenFromUrl) {
          api.put('/api/v1/businesses/me', {
            ig_account_id: accIdFromUrl || "",
            ig_access_token: tokenFromUrl
          }).then(() => console.log("Token sent to API successfully"))
            .catch(err => console.error("Failed to send token to API", err));
        }
      }
    }

    async function fetchBusinessData() {
      try {
        const res = await api.get('/api/v1/businesses/me');
        if (res.data) {
          // Only overwrite if we didn't just get it from URL
          if (res.data.ig_account_id && !accIdFromUrl) setIgAccountId(res.data.ig_account_id);
          if (res.data.ig_access_token && !tokenFromUrl) {
            setIgToken(res.data.ig_access_token);
            setIsConnected(true);
          }
        }
      } catch (e) {
        console.warn("Could not load business details", e);
      } finally {
        setLoadingData(false);
      }
    }
    fetchBusinessData();
  }, []);

  const handleUpdate = async (accId = igAccountId, token = igToken) => {
    setIsUpdating(true);
    try {
      await api.put('/api/v1/businesses/me', {
        ig_account_id: accId,
        ig_access_token: token
      });
      setUpdated(true);
      setIsConnected(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (error) {
      console.error("Failed to update Instagram", error);
      alert("Failed to save settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInstagramLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      const res = await api.get('/api/instagram/connect');
      const authUrl = res.data.authorization_url;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        console.error("Auth URL not found in response:", res.data);
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Failed to fetch Instagram connect URL:", error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white shadow-lg">
            <InstagramIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Instagram Integration</h1>
            <p className="text-text-muted mt-1">Connect your Instagram Business account to auto-publish Posts and Reels.</p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Connected
          </div>
        )}
      </div>

      {/* OAuth Direct Login Banner */}
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

      <Card className="bg-surface border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <InstagramIcon className="h-5 w-5 text-pink-600" />
            <CardTitle className="text-white">Instagram Graph API Credentials</CardTitle>
          </div>
          <CardDescription>
            You can also manually view or update your Instagram Graph API credentials below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Instagram Account ID</Label>
            <Input 
              placeholder="e.g. 178414..." 
              value={igAccountId}
              onChange={(e) => setIgAccountId(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Permanent Access Token</Label>
            <Input 
              type="text" 
              placeholder="EAA..." 
              value={igToken}
              onChange={(e) => setIgToken(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-xs"
            />
          </div>
          <Button onClick={() => handleUpdate()} disabled={isUpdating || isLoggingIn} className="w-full bg-brand-gradient hover:opacity-90 text-white transition-opacity font-semibold">
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
