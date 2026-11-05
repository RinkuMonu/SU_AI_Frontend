"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, 
  Check, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#0A66C2" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function LinkedinIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [authorId, setAuthorId] = useState("");
  const [token, setToken] = useState("");

  const isConnected = Boolean(authorId && token);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoadingData(true);
      try {
        let fetchedAuthorId = "";
        let fetchedToken = "";

        // 1. Try fetching from business
        try {
          const res = await api.get("/api/v1/businesses/me");
          const bizData = res.data?.data || res.data;
          if (bizData) {
            fetchedAuthorId = bizData.linkedin_author_id || "";
            fetchedToken = bizData.linkedin_access_token || "";
          }
        } catch (e) {
          console.warn("Could not fetch business:", e);
        }

        // 2. Fallback to user auth profile (/api/v1/auth/me)
        if (!fetchedAuthorId || !fetchedToken) {
          try {
            const userRes = await api.get("/api/v1/auth/me");
            const userData = userRes.data?.data || userRes.data;
            if (userData) {
              fetchedAuthorId = fetchedAuthorId || userData.linkedin_author_id || "";
              fetchedToken = fetchedToken || userData.linkedin_access_token || "";
            }
          } catch (e) {
            console.warn("Could not fetch user profile:", e);
          }
        }

        // 3. Fallback to /api/v1/auth/linkedin/status
        if (!fetchedAuthorId || !fetchedToken) {
          try {
            const statusRes = await api.get("/api/v1/auth/linkedin/status");
            const statusData = statusRes.data?.data || statusRes.data;
            if (statusData) {
              fetchedAuthorId = fetchedAuthorId || statusData.author_id || statusData.linkedin_author_id || "";
              fetchedToken = fetchedToken || statusData.access_token || statusData.linkedin_access_token || "";
            }
          } catch (e) {
            console.warn("Could not fetch linkedin status:", e);
          }
        }

        // 4. Fallback to localStorage
        if (typeof window !== "undefined") {
          fetchedAuthorId = fetchedAuthorId || localStorage.getItem("linkedin_author_id") || "";
          fetchedToken = fetchedToken || localStorage.getItem("linkedin_access_token") || "";
        }

        if (fetchedAuthorId) {
          setAuthorId(fetchedAuthorId);
          if (typeof window !== "undefined") {
            localStorage.setItem("linkedin_author_id", fetchedAuthorId);
          }
        }
        if (fetchedToken) {
          setToken(fetchedToken);
          if (typeof window !== "undefined") {
            localStorage.setItem("linkedin_access_token", fetchedToken);
          }
        }
      } catch (err) {
        console.warn("Could not fetch business LinkedIn settings:", err);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchSettings();
  }, []);

  const handleOAuthConnect = async () => {
    setIsConnecting(true);
    setMessage(null);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const redirectUri = `${origin}/login/user`;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("linkedin_auth_mode", "login");
        sessionStorage.setItem("auth_redirect_after", "/social-platforms/linkedin");
        localStorage.setItem("linkedin_oauth_pending", "true");
      }

      const res = await api.get(`/api/v1/auth/linkedin/connect?redirect_uri=${encodeURIComponent(redirectUri)}&mode=login`);
      const authUrl = res.data?.authorization_url || res.data?.url;
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
      // Direct LinkedIn OAuth fallback
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "868tp3n7eu94td";
      const scope = "openid profile email w_member_social";
      const state = "login_linkedin_" + Math.random().toString(36).substring(7);
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
    } catch (err: any) {
      console.error("LinkedIn OAuth initiation error:", err);
      setMessage({ type: "error", text: err.response?.data?.detail || err.message || "Failed to start LinkedIn connection." });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect LinkedIn? Automated publishing will pause.")) return;
    setIsDisconnecting(true);
    setMessage(null);
    try {
      await api.put("/api/v1/businesses/me", {
        linkedin_author_id: "",
        linkedin_access_token: "",
        linkedin_connected: false,
      });
      try {
        await api.post("/api/v1/auth/linkedin/disconnect");
      } catch (_) {}
      if (typeof window !== "undefined") {
        localStorage.removeItem("linkedin_author_id");
        localStorage.removeItem("linkedin_access_token");
        localStorage.removeItem("linkedin_oauth_pending");
      }
      setAuthorId("");
      setToken("");
      setMessage({ type: "success", text: "LinkedIn disconnected successfully." });
    } catch (err: any) {
      console.error("LinkedIn disconnect error:", err);
      setMessage({ type: "error", text: "Failed to disconnect LinkedIn." });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setMessage(null);
    try {
      const cleanAuthor = authorId.trim();
      const cleanToken = token.trim();
      const connected = Boolean(cleanAuthor && cleanToken);

      await api.put("/api/v1/businesses/me", {
        linkedin_author_id: cleanAuthor,
        linkedin_access_token: cleanToken,
        linkedin_connected: connected,
      });

      try {
        await api.post("/api/v1/auth/linkedin/save-credentials", {
          author_id: cleanAuthor,
          access_token: cleanToken,
          connected: connected,
        });
      } catch (saveErr) {
        console.warn("Secondary save endpoint notice:", saveErr);
      }

      if (typeof window !== "undefined") {
        if (cleanAuthor) localStorage.setItem("linkedin_author_id", cleanAuthor);
        else localStorage.removeItem("linkedin_author_id");
        if (cleanToken) localStorage.setItem("linkedin_access_token", cleanToken);
        else localStorage.removeItem("linkedin_access_token");
      }

      setUpdated(true);
      setMessage({ type: "success", text: "LinkedIn settings saved successfully." });
      setTimeout(() => setUpdated(false), 3000);
    } catch (error: any) {
      console.error("Failed to update LinkedIn", error);
      setMessage({ type: "error", text: error.response?.data?.detail || "Failed to save settings." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div 
      style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} 
      className="-my-6 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-6 min-h-[calc(100vh-64px)] overflow-y-auto animate-in fade-in duration-300"
    >
      <div className="max-w-4xl mx-auto w-full space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2a4a]">
          <div className="flex items-center gap-3.5">
            <div 
              style={{ backgroundColor: "#081226" }} 
              className="w-12 h-12 rounded-2xl border border-[#1e2a4a] flex items-center justify-center shrink-0 shadow-md"
            >
              <LinkedinIcon className="w-6 h-6 text-[#0A66C2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-white">LinkedIn Integration</h1>
              <p className="text-slate-400 text-sm mt-1 font-normal tracking-wide">
                Connect your personal profile or company page to auto-publish AI posts &amp; articles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isLoadingData ? (
              <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
            ) : isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-normal bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-normal bg-[#1c2333] border border-[#2a354c] text-slate-300">
                Not Connected
              </span>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-xs text-slate-400 hover:text-white ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1-Click Fast Connect Card */}
        <Card className="bg-[#0c1630] border-[#1e2a4a] shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="py-4 px-5 sm:px-6 border-b border-[#1e2a4a]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white text-lg sm:text-xl font-normal tracking-wide">
                  LinkedIn Connection Status
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
                Authorize to publish posts directly to your LinkedIn feed.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <div className="p-4 sm:p-5 rounded-xl bg-[#081226] border border-[#1e2a4a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm sm:text-base font-normal text-white flex items-center gap-2.5 tracking-wide">
                  <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" />
                  {isConnected ? "Account Connected" : "Connect LinkedIn with 1-Click"}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
                  {isConnected
                    ? `Active Author ID: ${authorId}`
                    : "Sign in with LinkedIn to authorize automatic post publishing."}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isConnected ? (
                  <Button
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    variant="outline"
                    className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs sm:text-sm h-9 px-4 rounded-xl cursor-pointer"
                  >
                    {isDisconnecting ? (
                      <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Disconnecting...</>
                    ) : (
                      <><Trash2 className="mr-1.5 h-4 w-4" /> Disconnect</>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleOAuthConnect}
                    disabled={isConnecting}
                    className="bg-[#0A66C2] hover:bg-[#004182] text-white text-xs sm:text-sm h-10 px-4 font-normal rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Connecting...</>
                    ) : (
                      <>
                        <LinkedinIcon className="h-4 w-4 fill-white" />
                        Connect LinkedIn Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced / Manual Credentials Card */}
        <Card className="bg-[#0c1630] border-[#1e2a4a] shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="py-4 px-5 sm:px-6 border-b border-[#1e2a4a]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" />
                <CardTitle className="text-white text-lg sm:text-xl font-normal tracking-wide">
                  Advanced: Manual Credentials
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
                Optionally specify a custom LinkedIn Author URN or long-lived Token.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-white font-normal text-sm sm:text-base tracking-wide">LinkedIn Author ID (URN)</Label>
              <Input 
                placeholder="e.g. urn:li:person:12345678 or urn:li:organization:123456" 
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="border-[#1e2a4a] bg-[#081226] text-white focus:ring-1 focus:ring-blue-500 font-mono text-sm h-10 px-3.5 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white font-normal text-sm sm:text-base tracking-wide">Access Token</Label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <Input 
                  type={showToken ? "text" : "password"} 
                  placeholder="AQV..." 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="border-[#1e2a4a] bg-[#081226] text-white focus:ring-1 focus:ring-blue-500 font-mono text-sm h-10 px-3.5 pr-11 rounded-xl"
                />
              </div>
            </div>

            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating} 
              className="w-full h-11 bg-gradient-to-r from-[#ff7a59] via-[#e244b2] to-[#8a3ffc] hover:opacity-95 text-white font-normal rounded-xl text-sm sm:text-base tracking-wide transition-all shadow-md cursor-pointer mt-2"
            >
              {isUpdating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : updated ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-300" /> Saved</>
              ) : (
                "Save LinkedIn Settings"
              )}
            </Button>

            <p className="text-xs text-slate-400 text-center font-normal pt-2">
              Need developer credentials?{" "}
              <a 
                href="https://www.linkedin.com/developers/apps" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                LinkedIn Developer Portal <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
