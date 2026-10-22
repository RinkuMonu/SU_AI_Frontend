"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkedInIcon } from "@/components/social/SocialIcons";
import api from "@/lib/api";

export default function LinkedinIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [authorId, setAuthorId] = useState("");
  const [token, setToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for tokens or success flag from URL after OAuth redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const isConnectedSuccess = params.get("linkedin_connected") === "true";
      const tokenFromUrl = params.get("access_token") || params.get("token") || params.get("linkedin_token");
      const authorIdFromUrl = params.get("author_id") || params.get("linkedin_author_id");
      const err = params.get("linkedin_error") || params.get("error");

      if (isConnectedSuccess || tokenFromUrl) {
        if (tokenFromUrl) setToken(tokenFromUrl);
        if (authorIdFromUrl) setAuthorId(authorIdFromUrl);
        setIsConnected(true);
        setSuccessMessage("LinkedIn account connected successfully!");

        // Clean URL to prevent leaking tokens or parameters
        window.history.replaceState({}, document.title, window.location.pathname);

        if (tokenFromUrl) {
          api
            .put("/api/v1/businesses/me", {
              linkedin_author_id: authorIdFromUrl || "",
              linkedin_access_token: tokenFromUrl,
            })
            .catch((err) => console.error("Failed to sync LinkedIn token to API", err));
        }
      } else if (err) {
        setErrorMessage(`LinkedIn authorization: ${decodeURIComponent(err)}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    async function fetchBusinessData() {
      try {
        const res = await api.get("/api/v1/businesses/me");
        if (res.data) {
          if (res.data.linkedin_author_id) setAuthorId(res.data.linkedin_author_id);
          if (res.data.linkedin_access_token) {
            setToken(res.data.linkedin_access_token);
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

  const handleLinkedInLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.get("/api/linkedin/connect");
      const authUrl = res.data?.authorization_url || res.data?.url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("Authorization URL not found");
      }
    } catch (error: any) {
      console.error("Failed to fetch LinkedIn connect URL:", error);
      const detail = error?.response?.data?.detail || error?.message || "Failed to reach LinkedIn connect service.";
      setErrorMessage(detail);
      setIsLoggingIn(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      await api.put("/api/v1/businesses/me", {
        linkedin_author_id: authorId,
        linkedin_access_token: token,
      });
      setUpdated(true);
      setIsConnected(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (error: any) {
      console.error("Failed to update LinkedIn", error);
      setErrorMessage("Failed to save LinkedIn settings. Please check your connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500 mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-700 via-sky-600 to-indigo-700 text-white shadow-lg">
            <LinkedInIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">LinkedIn Integration</h1>
            <p className="text-text-muted mt-1">Connect your LinkedIn Profile or Company Page to automate publishing.</p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Connected
          </div>
        )}
      </div>

      {/* Success / Error Banners */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-sm text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-sm text-red-300">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* OAuth Fast Connect Banner */}
      <Card className="bg-gradient-to-r from-blue-950/40 via-sky-950/30 to-surface border-blue-500/30 shadow-xl overflow-hidden relative">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              Fast LinkedIn Connect
            </h3>
            <p className="text-sm text-gray-300 max-w-md">
              Log in with your LinkedIn account to authorize posting permissions and link your professional profile.
            </p>
          </div>

          <Button
            onClick={handleLinkedInLogin}
            disabled={isLoggingIn || isUpdating}
            className="w-full md:w-auto px-6 py-6 bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-base flex items-center justify-center gap-3 shrink-0"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LinkedInIcon className="h-5 w-5 text-white" />
                Login with LinkedIn
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Manual API Credentials Card */}
      <Card className="bg-surface border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkedInIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-white">LinkedIn API Settings</CardTitle>
          </div>
          <CardDescription>Enter your LinkedIn API credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">LinkedIn Author ID</Label>
            <Input
              placeholder="e.g. urn:li:person:12345..."
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Access Token</Label>
            <Input
              type="password"
              placeholder="AQV..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none font-mono text-xs"
            />
          </div>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full bg-brand-gradient hover:opacity-90 text-white transition-opacity font-semibold"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : updated ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Saved Successfully
              </>
            ) : (
              "Save LinkedIn Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
