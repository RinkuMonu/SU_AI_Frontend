"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, ShieldCheck } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function FacebookIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [fbPageId, setFbPageId] = useState("");
  const [fbToken, setFbToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for tokens from URL after OAuth redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('access_token') || params.get('token') || params.get('fb_access_token');
      const isConnectedSuccess = params.get('facebook_connected') === 'true';
      const pageIdFromUrl = params.get('fb_page_id') || params.get('page_id');
      
      if (tokenFromUrl || isConnectedSuccess) {
        if (tokenFromUrl) {
          console.log("Facebook Access Token:", tokenFromUrl);
          setFbToken(tokenFromUrl);
        }
        if (pageIdFromUrl) {
          setFbPageId(pageIdFromUrl);
        }
        setIsConnected(true);
        
        // Clean URL to hide token
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Send token to the backend API
        if (tokenFromUrl) {
          api.put('/api/v1/businesses/me', {
            fb_page_id: pageIdFromUrl || "",
            fb_access_token: tokenFromUrl
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
          if (res.data.fb_page_id) setFbPageId(res.data.fb_page_id);
          if (res.data.fb_access_token) {
            setFbToken(res.data.fb_access_token);
            setIsConnected(true);
          }
        }
      } catch (e) {
        console.warn("Could not load business details", e);
      }
    }
    fetchBusinessData();
  }, []);

  const handleFacebookLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      const res = await api.get('/api/facebook/connect');
      const authUrl = res.data.authorization_url || res.data.url;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        console.error("Auth URL not found in response:", res.data);
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Failed to fetch Facebook connect URL:", error);
      setIsLoggingIn(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put('/api/v1/businesses/me', {
        fb_page_id: fbPageId,
        fb_access_token: fbToken
      });
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (error) {
      console.error("Failed to update Facebook", error);
      alert("Failed to save settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500 mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg">
            <FacebookIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Facebook Integration</h1>
            <p className="text-text-muted mt-1">Connect your Facebook Page to automate publishing.</p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Connected
          </div>
        )}
      </div>

      {/* OAuth Direct Login Banner */}
      <Card className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-surface border-blue-500/30 shadow-xl overflow-hidden relative">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              Fast Facebook Connect
            </h3>
            <p className="text-sm text-gray-300 max-w-md">
              Log in with your Facebook account to automatically authorize permissions and link your Facebook Page.
            </p>
          </div>

          <Button
            onClick={handleFacebookLogin}
            disabled={isLoggingIn || isUpdating}
            className="w-full md:w-auto px-6 py-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-base flex items-center justify-center gap-3 shrink-0"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <FacebookIcon className="h-5 w-5 text-white" />
                Login with Facebook
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-surface border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FacebookIcon className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-white">Facebook API Settings</CardTitle>
          </div>
          <CardDescription>Enter your Facebook Graph API credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Facebook Page ID</Label>
            <Input 
              placeholder="e.g. 10435..." 
              value={fbPageId}
              onChange={(e) => setFbPageId(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Page Access Token</Label>
            <Input 
              type="password" 
              placeholder="EAA..." 
              value={fbToken}
              onChange={(e) => setFbToken(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none"
            />
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-brand-gradient hover:opacity-90 text-white transition-opacity">
            {isUpdating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : updated ? (
              <><Check className="mr-2 h-4 w-4" /> Saved</>
            ) : (
              "Save Facebook Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}