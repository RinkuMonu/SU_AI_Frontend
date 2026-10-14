"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { OnboardingService } from "@/services/onboarding.service";
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/lib/api";

export default function InstagramCallbackHandlerPage() {
  const [statusText, setStatusText] = useState("Completing Instagram authentication...");
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

        const errorParam =
          searchParams.get("error") ||
          searchParams.get("error_description") ||
          searchParams.get("instagram_error") ||
          hashParams.get("error");

        if (errorParam) {
          throw new Error("Instagram authentication failed: " + decodeURIComponent(errorParam));
        }

        const userAccessToken =
          searchParams.get("user_access_token") ||
          searchParams.get("ig_access_token") ||
          hashParams.get("access_token") ||
          searchParams.get("access_token");

        const authCode = searchParams.get("code");
        let sessionToken = searchParams.get("token") || "";

        if (!userAccessToken && !sessionToken && !authCode) {
          throw new Error("No Instagram access token or authorization code returned.");
        }

        setStatusText("Authenticating Instagram profile & establishing session...");

        let userObj: any = null;

        // Exchange Instagram credentials with backend for fresh session and user profile
        if (sessionToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
          localStorage.setItem("access_token", sessionToken);
          try {
            userObj = await authService.getCurrentUser();
          } catch (_) {
            userObj = { onboardingCompleted: false };
          }
        } else {
          const authResult = await authService.instagramLogin({
            access_token: userAccessToken || undefined,
            code: authCode || undefined,
            accountType: "business",
          });
          sessionToken = authResult.token;
          userObj = authResult.user;
          api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
          localStorage.setItem("access_token", sessionToken);
        }

        // Verify onboarding completion status via OnboardingService.isCompleted
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
        sessionStorage.removeItem("instagram_auth_mode");

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
        console.error("Instagram callback error:", err);
        setErrorMessage(err.message || "Failed to complete Instagram authentication.");
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
            <h3 className="text-lg font-bold text-white">Instagram Sign-In Error</h3>
            <p className="text-xs text-red-300/90 leading-relaxed bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {errorMessage}
            </p>
            <button
              onClick={() => router.replace("/login/user")}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-surface border border-border text-xs font-semibold text-gray-200 hover:text-white hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-[#E1306C] animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-semibold text-white">Instagram Authentication</h3>
              <p className="text-xs text-gray-400 mt-1">{statusText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
