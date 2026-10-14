"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { OnboardingService } from "@/services/onboarding.service";
import { FacebookService } from "@/services/facebook.service";
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/lib/api";

export default function FacebookCallbackHandlerPage() {
  const [statusText, setStatusText] = useState("Completing Facebook authentication...");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const processCallback = async () => {
      try {
        const hash = window.location.hash || "";
        const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.substring(1) : hash);
        const searchParams = new URLSearchParams(window.location.search);

        const errorParam = searchParams.get("error") || searchParams.get("error_description") || hashParams.get("error");
        if (errorParam) {
          throw new Error("Facebook authentication failed: " + decodeURIComponent(errorParam));
        }

        const userAccessToken =
          searchParams.get("user_access_token") ||
          hashParams.get("access_token") ||
          searchParams.get("access_token");

        let pageToken = searchParams.get("fb_access_token") || searchParams.get("page_access_token") || "";
        let pageId = searchParams.get("fb_page_id") || searchParams.get("page_id") || "";
        let pageName = searchParams.get("fb_page_name") || searchParams.get("page_name") || "";
        let sessionToken = searchParams.get("token") || "";

        if (!userAccessToken && !sessionToken) {
          throw new Error("No Facebook access token returned from authorization.");
        }

        setStatusText("Authenticating Facebook profile & discovering business pages...");

        let userObj: any = null;

        // Exchange Facebook user access token with backend for fresh session and user profile
        if (userAccessToken) {
          const authResult = await authService.facebookLogin({
            access_token: userAccessToken,
            accountType: "business",
          });
          sessionToken = authResult.token;
          userObj = authResult.user;
          api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
          localStorage.setItem("access_token", sessionToken);
        } else if (sessionToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
          localStorage.setItem("access_token", sessionToken);
          try {
            userObj = await authService.getCurrentUser();
          } catch (_) {
            userObj = { onboardingCompleted: false };
          }
        }

        // Discover Facebook Pages if page token is missing
        if (userAccessToken && (!pageToken || !pageId)) {
          try {
            const pages = await FacebookService.fetchPagesFromUserToken(userAccessToken);
            if (pages.length > 0) {
              const first = pages[0];
              pageId = pageId || first.id;
              pageName = pageName || first.name;
              pageToken = pageToken || first.access_token;
            }
          } catch (pErr) {
            console.warn("Could not discover pages from user token:", pErr);
          }
        }

        // Save tokens immediately so they are available on /social-platforms/facebook
        try {
          await FacebookService.saveFacebookCredentials({
            userAccessToken: userAccessToken || undefined,
            pageAccessToken: pageToken || undefined,
            pageId: pageId || undefined,
            pageName: pageName || undefined,
            authToken: sessionToken,
          });
        } catch (_) {}

        // Check onboarding completion via /api/v1/onboarding/status
        setStatusText("Verifying onboarding status...");
        let isDone = Boolean(userObj?.onboardingCompleted || userObj?.onboarding_completed);
        try {
          const statusDone = await OnboardingService.isCompleted(sessionToken);
          if (statusDone) isDone = true;
        } catch (_) {}

        const finalUser = {
          ...userObj,
          onboardingCompleted: isDone,
        };

        login(sessionToken, finalUser);
        sessionStorage.removeItem("facebook_auth_mode");

        // If incomplete onboarding -> route to onboarding!
        // If completed -> route to dashboard!
        if (!isDone) {
          router.replace("/onboarding");
        } else {
          const pendingPlan = sessionStorage.getItem("pending_plan");
          const pendingBilling = sessionStorage.getItem("pending_billing") || "monthly";
          if (pendingPlan) {
            sessionStorage.removeItem("pending_plan");
            sessionStorage.removeItem("pending_billing");
            router.replace(`/subscription?plan=${pendingPlan}&billing=${pendingBilling}`);
          } else {
            router.replace("/dashboard");
          }
        }
      } catch (err: any) {
        console.error("Facebook callback error:", err);
        setErrorMessage(err.message || "Failed to complete Facebook authentication.");
      }
    };

    processCallback();
  }, [login, router]);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white flex flex-col items-center justify-center p-6 selection:bg-[#be32ff]/30">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#13141b] border border-border/80 shadow-2xl flex flex-col items-center text-center space-y-5">
        <img
          src="/images/dhandagrow.png"
          alt="DhandaGrow AI"
          className="h-9 w-auto object-contain mb-2"
        />

        {errorMessage ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              ✕
            </div>
            <h3 className="text-lg font-bold text-white">Facebook Sign-In Error</h3>
            <p className="text-xs text-red-300/90 leading-relaxed bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {errorMessage}
            </p>
            <button
              onClick={() => router.replace("/login/user")}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-surface border border-border text-xs font-semibold text-gray-200 hover:text-white hover:bg-surface-elevated transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-semibold text-white">Facebook Authentication</h3>
              <p className="text-xs text-gray-400 mt-1">{statusText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
