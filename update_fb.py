import os
import re

path = "app/(dashboard)/social-platforms/facebook/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix import
content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";')

# Add ShieldCheck to lucide-react imports if not present
if 'ShieldCheck' not in content:
    content = content.replace('import { Loader2, Check } from "lucide-react";', 'import { Loader2, Check, ShieldCheck } from "lucide-react";')

old_component_start = """export default function FacebookIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  
  const [fbPageId, setFbPageId] = useState("");
  const [fbToken, setFbToken] = useState("");"""

new_component_start = """export default function FacebookIntegrationPage() {
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
  };"""

content = content.replace(old_component_start, new_component_start)


old_ui = """      <div className="flex items-center gap-2">
        <FacebookIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Facebook Integration</h1>
          <p className="text-text-muted mt-1">Connect your Facebook Page to automate publishing.</p>
        </div>
      </div>

      <Card className="bg-surface border-border shadow-lg">"""

new_ui = """      <div className="flex items-center justify-between">
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

      <Card className="bg-surface border-border shadow-lg">"""

content = content.replace(old_ui, new_ui)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully")
