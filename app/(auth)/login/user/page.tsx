"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Bot,
  Zap,
  Camera,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { authService } from "@/services/auth.service";
import { OnboardingService } from "@/services/onboarding.service";
import { FacebookService } from "@/services/facebook.service";
import api from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthCenterModal, AuthModalStatus, AuthProviderType } from "@/components/auth/AuthCenterModal";

// Prevent duplicate callback execution in React StrictMode and concurrent renders
let inFlightGoogleCode: string | null = null;
let inFlightFbAuth: string | null = null;
let inFlightIgAuth: string | null = null;
let inFlightLiAuth: string | null = null;

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const SHOWCASE_SLIDES = [
  {
    id: "ai-marketing",
    image: "/images/ai-marketing-workspace.png",
    alt: "DhandaGrow AI Marketing Engine",
    badge: "AI Creative Intelligence",
    badgeIcon: "bot",
    title: "DhandaGrow AI Marketing Engine",
    description: "Autonomous AI generating campaigns, ads, reels & creative content",
    gradient: "from-[#f0449b] to-[#fc9a5d]",
    glow1: "bg-purple-600/30",
    glow2: "bg-pink-600/20",
    objectFit: "object-contain",
  },
  {
    id: "reel-studio",
    image: "/images/ai-reel-maker-hero.jpg",
    alt: "AI Viral Reel Studio",
    badge: "Viral Reels Studio",
    badgeIcon: "sparkles",
    title: "AI Script & Viral Hook Engine",
    description: "0-3s thumb-stopping hooks, multi-scene audio directions & instant video rendering",
    gradient: "from-[#a855f7] to-[#ec4899]",
    glow1: "bg-indigo-600/30",
    glow2: "bg-purple-600/20",
    objectFit: "object-cover",
  },
  {
    id: "postmaker-ads",
    image: "/images/ai-postmaker-hero.jpg",
    alt: "AI Postmaker & Multi-Platform Publisher",
    badge: "Multi-Platform Publisher",
    badgeIcon: "zap",
    title: "1-Click Social Ads & Posters",
    description: "Create scroll-stopping Instagram, Facebook & WhatsApp posters in seconds",
    gradient: "from-[#38bdf8] to-[#818cf8]",
    glow1: "bg-cyan-600/25",
    glow2: "bg-blue-600/30",
    objectFit: "object-cover",
  },
  {
    id: "product-photoshoot",
    image: "/images/ai-photoshoot-hero.jpg",
    alt: "AI Virtual Studio Photoshoot",
    badge: "Virtual Studio Photoshoot",
    badgeIcon: "camera",
    title: "Commercial-Grade Product Shots",
    description: "Transform raw phone clicks into 8K luxury catalog studio photography",
    gradient: "from-[#f59e0b] to-[#f43f5e]",
    glow1: "bg-amber-600/25",
    glow2: "bg-rose-600/25",
    objectFit: "object-cover",
  },
];

export default function LoginPage() {
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    status: AuthModalStatus;
    provider?: AuthProviderType;
    title?: string;
    message?: string;
    actionText?: string;
    actionHref?: string;
  } | null>(null);

  // Dynamic Showcase Slides Auto-Rotation (2.8s)
  const [slideIndex, setSlideIndex] = useState(0);
  const [isShowcasePaused, setIsShowcasePaused] = useState(false);

  useEffect(() => {
    if (isShowcasePaused) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isShowcasePaused]);

  const currentSlide = SHOWCASE_SLIDES[slideIndex];

  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Common completion handler for Facebook authentication
  const processFacebookAuth = async (opts: {
    accessToken?: string;
    token?: string;
    code?: string;
    mode?: "login" | "signup";
  }) => {
    const isSignup = opts.mode === "signup";
    setSocialLoading("Facebook");
    setSocialNotice(
      isSignup
        ? "Completing your Facebook registration..."
        : "Signing in with Facebook... Verifying your account."
    );
    setError("");
    setAuthModal({
      open: true,
      status: "analyzing",
      provider: "Facebook",
      title: isSignup ? "Creating Facebook Account" : "Connecting with Facebook",
      message: isSignup
        ? "Analyzing profile and creating your secure account..."
        : "Analyzing credentials and verifying your Facebook profile...",
    });

    try {
      let token = opts.token;
      let userObj: any = null;

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", token);
        }
        try {
          userObj = await authService.getCurrentUser();
        } catch (_) {
          userObj = { onboardingCompleted: false };
        }
      } else {
        const authResult = await authService.facebookLogin({
          access_token: opts.accessToken,
          code: opts.code,
          accountType: "user",
          mode: opts.mode || "login",
        });
        token = authResult.token;
        userObj = authResult.user;

        if (!token || !userObj) {
          throw new Error("Facebook authentication did not return session token.");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", token);
        }
      }

      // Extract & discover Facebook Page Token, User Token, and Page ID
      const userAccessToken = opts.accessToken;
      let pageToken = "";
      let pageId = "";
      let pageName = "";

      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        pageToken = searchParams.get("fb_access_token") || searchParams.get("page_access_token") || "";
        pageId = searchParams.get("fb_page_id") || searchParams.get("page_id") || "";
        pageName = searchParams.get("fb_page_name") || searchParams.get("page_name") || "";
      }

      if (userAccessToken) {
        try {
          const pages = await FacebookService.fetchPagesFromUserToken(userAccessToken);
          if (pages.length > 0) {
            const first = pages[0];
            pageId = pageId || first.id;
            pageName = pageName || first.name;
            pageToken = pageToken || first.access_token;
          }
        } catch (err) {
          console.warn("Could not query Facebook Graph API:", err);
        }
      }

      // Automatically save and print credentials on /social-platforms/facebook
      try {
        await FacebookService.saveFacebookCredentials({
          userAccessToken: userAccessToken || undefined,
          pageAccessToken: pageToken || undefined,
          pageId: pageId || undefined,
          pageName: pageName || undefined,
          authToken: token,
        });
      } catch (_) {}

      const finalUser = {
        ...userObj,
        accountType: userObj?.accountType || "user",
        role: userObj?.role || "user",
        onboardingCompleted: true,
      };

      login(token, finalUser);
      sessionStorage.removeItem("facebook_auth_mode");

      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const redirectAfter = sessionStorage.getItem("auth_redirect_after");
      setAuthModal({
        open: true,
        status: "navigating",
        provider: "Facebook",
        title: "Facebook Verified!",
        message: "Account verified! Navigating to your dashboard...",
      });
      if (redirectAfter) {
        sessionStorage.removeItem("auth_redirect_after");
        router.push(redirectAfter);
      } else {
        const pendingPlan = sessionStorage.getItem("pending_plan");
        const pendingBilling = sessionStorage.getItem("pending_billing") || "monthly";
        if (pendingPlan) {
          sessionStorage.removeItem("pending_plan");
          sessionStorage.removeItem("pending_billing");
          router.push(`/subscription?plan=${pendingPlan}&billing=${pendingBilling}`);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Facebook authentication error:", err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        (isSignup ? "Failed to register with Facebook." : "Failed to sign in with Facebook.");
      setError(msg);
      setAuthModal({
        open: true,
        status: "error",
        provider: "Facebook",
        title: "Facebook Authentication Failed",
        message: msg,
      });
      sessionStorage.removeItem("facebook_auth_mode");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } finally {
      setSocialLoading(null);
      setSocialNotice(null);
    }
  };

  // Common completion handler for Instagram authentication
  const processInstagramAuth = async (opts: {
    accessToken?: string;
    token?: string;
    code?: string;
    mode?: "login" | "signup";
  }) => {
    const isSignup = opts.mode === "signup";
    setSocialLoading("Instagram");
    setSocialNotice(
      isSignup
        ? "Completing your Instagram registration..."
        : "Signing in with Instagram... Verifying your account."
    );
    setError("");

    try {
      let sessionToken = opts.token;
      let userObj: any = null;

      if (sessionToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", sessionToken);
        }
        try {
          userObj = await authService.getCurrentUser();
        } catch (_) {
          userObj = { onboardingCompleted: false };
        }
      } else {
        const authResult = await authService.instagramLogin({
          access_token: opts.accessToken,
          code: opts.code,
          accountType: "business",
          mode: opts.mode || "login",
        });
        sessionToken = authResult.token;
        userObj = authResult.user;

        if (!sessionToken || !userObj) {
          throw new Error("Instagram authentication did not return session token.");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", sessionToken);
        }
      }

      // Check onboarding completion via OnboardingService.isCompleted
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

      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (!isDone) {
        router.push("/onboarding");
      } else {
        const pendingPlan = sessionStorage.getItem("pending_plan");
        const pendingBilling = sessionStorage.getItem("pending_billing") || "monthly";
        if (pendingPlan) {
          sessionStorage.removeItem("pending_plan");
          sessionStorage.removeItem("pending_billing");
          router.push(`/subscription?plan=${pendingPlan}&billing=${pendingBilling}`);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Instagram authentication error:", err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        (isSignup ? "Failed to register with Instagram." : "Failed to sign in with Instagram.");
      setError(msg);
      sessionStorage.removeItem("instagram_auth_mode");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } finally {
      setSocialLoading(null);
      setSocialNotice(null);
    }
  };

  // Common completion handler for LinkedIn authentication
  const processLinkedInAuth = async (opts: {
    accessToken?: string;
    token?: string;
    code?: string;
    mode?: "login" | "signup";
  }) => {
    const isSignup = opts.mode === "signup";
    setSocialLoading("LinkedIn");
    setSocialNotice(
      isSignup
        ? "Completing your LinkedIn registration..."
        : "Signing in with LinkedIn... Verifying your account."
    );
    setError("");
    setAuthModal({
      open: true,
      status: "analyzing",
      provider: "LinkedIn",
      title: isSignup ? "Completing LinkedIn Registration" : "Connecting with LinkedIn",
      message: isSignup
        ? "Analyzing profile & finalizing registration..."
        : "Analyzing credentials & verifying secure session...",
    });

    try {
      let sessionToken = opts.token;
      let userObj: any = null;

      if (sessionToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", sessionToken);
        }
        try {
          userObj = await authService.getCurrentUser();
        } catch (_) {
          userObj = { onboardingCompleted: false };
        }
      } else {
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const redirectUri = `${origin}/login/user`;
        const authResult = await authService.linkedinLogin({
          access_token: opts.accessToken,
          code: opts.code,
          redirect_uri: redirectUri,
          accountType: "business",
          mode: opts.mode || "login",
        });
        sessionToken = authResult.token;
        userObj = authResult.user;

        if (!sessionToken || !userObj) {
          throw new Error("LinkedIn authentication did not return session token.");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", sessionToken);
        }
      }

      // Extract & save LinkedIn credentials to localStorage and business
      try {
        const liAuthorId = 
          userObj?.linkedin_author_id || 
          userObj?.linkedinId || 
          userObj?.linkedin_id ||
          (userObj as any)?.author_id ||
          "";
        const liAccessToken = 
          userObj?.linkedin_access_token || 
          (userObj as any)?.access_token ||
          "";

        if (typeof window !== "undefined") {
          if (liAuthorId) localStorage.setItem("linkedin_author_id", liAuthorId);
          if (liAccessToken) localStorage.setItem("linkedin_access_token", liAccessToken);
        }

        // Persist to business endpoint immediately
        if (liAuthorId || liAccessToken) {
          await api.put("/api/v1/businesses/me", {
            linkedin_author_id: liAuthorId || undefined,
            linkedin_access_token: liAccessToken || undefined,
            linkedin_connected: true,
          }).catch((e) => console.warn("Notice: /api/v1/businesses/me sync:", e));
        }
      } catch (saveErr) {
        console.warn("Could not sync LinkedIn credentials on login:", saveErr);
      }

      // Check onboarding completion via OnboardingService.isCompleted
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
      sessionStorage.removeItem("linkedin_auth_mode");

      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const isPendingOauth = typeof window !== "undefined" && Boolean(localStorage.getItem("linkedin_oauth_pending"));
      if (typeof window !== "undefined") {
        localStorage.removeItem("linkedin_oauth_pending");
      }

      const redirectAfter = sessionStorage.getItem("auth_redirect_after") || (isPendingOauth ? "/social-platforms/linkedin" : null);
      setAuthModal({
        open: true,
        status: "navigating",
        provider: "LinkedIn",
        title: "LinkedIn Verified!",
        message: "Account verified! Navigating to your dashboard...",
      });
      if (redirectAfter) {
        sessionStorage.removeItem("auth_redirect_after");
        router.push(redirectAfter);
      } else if (!isDone) {
        router.push("/onboarding");
      } else {
        const pendingPlan = sessionStorage.getItem("pending_plan");
        const pendingBilling = sessionStorage.getItem("pending_billing") || "monthly";
        if (pendingPlan) {
          sessionStorage.removeItem("pending_plan");
          sessionStorage.removeItem("pending_billing");
          router.push(`/subscription?plan=${pendingPlan}&billing=${pendingBilling}`);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("LinkedIn authentication error:", err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        (isSignup ? "Failed to register with LinkedIn." : "Failed to sign in with LinkedIn.");
      setError(msg);
      setAuthModal({
        open: true,
        status: "error",
        provider: "LinkedIn",
        title: "LinkedIn Authentication Failed",
        message: msg,
      });
      sessionStorage.removeItem("linkedin_auth_mode");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } finally {
      setSocialLoading(null);
      setSocialNotice(null);
    }
  };

  // Handle OAuth redirect callbacks (Google, Facebook, Instagram & LinkedIn)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash || "";
    const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.substring(1) : hash);
    const searchParams = new URLSearchParams(window.location.search);

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error") || searchParams.get("error_description") || hashParams.get("error");
    const stateParam = searchParams.get("state") || hashParams.get("state") || "";

    const fbHashToken = hashParams.get("access_token");
    const fbSearchToken = searchParams.get("user_access_token") || searchParams.get("fb_access_token") || searchParams.get("access_token");
    const savedFbMode = sessionStorage.getItem("facebook_auth_mode") as "login" | "signup" | null;
    const savedLiMode = sessionStorage.getItem("linkedin_auth_mode") as "login" | "signup" | null;

    const callbackToken = searchParams.get("token");
    const igConnected = Boolean(searchParams.get("instagram_connected"));
    const isInstagramAuth =
      stateParam.includes("instagram") ||
      stateParam.includes("ig_") ||
      igConnected ||
      Boolean(searchParams.get("ig_username")) ||
      Boolean(sessionStorage.getItem("instagram_auth_mode"));

    const isFacebookAuth =
      stateParam.includes("facebook") ||
      stateParam.includes("fb_") ||
      Boolean(fbHashToken) ||
      Boolean(searchParams.get("facebook_connected")) ||
      Boolean(savedFbMode);

    const isLinkedInAuth =
      stateParam.includes("linkedin") ||
      stateParam.includes("li_") ||
      searchParams.get("provider") === "linkedin" ||
      Boolean(savedLiMode);

    if (errorParam) {
      const providerName = isLinkedInAuth ? "LinkedIn" : (isInstagramAuth ? "Instagram" : (isFacebookAuth ? "Facebook" : "Google"));
      const decodedErr = decodeURIComponent(errorParam);
      setError(`${providerName} authentication failed: ` + decodedErr);
      setAuthModal({
        open: true,
        status: "error",
        provider: (providerName === "Google" ? "Gmail" : providerName) as AuthProviderType,
        title: `${providerName} Authorization Failed`,
        message: decodedErr,
      });
      sessionStorage.removeItem("facebook_auth_mode");
      sessionStorage.removeItem("instagram_auth_mode");
      sessionStorage.removeItem("google_auth_mode");
      sessionStorage.removeItem("linkedin_auth_mode");
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // 1. Process LinkedIn callback if detected
    if (isLinkedInAuth && (callbackToken || code)) {
      const mode = (stateParam.includes("signup") || savedLiMode === "signup") ? "signup" : "login";
      processLinkedInAuth({
        token: callbackToken || undefined,
        code: code || undefined,
        mode,
      });
      return;
    }

    // 2. Process Instagram callback if detected
    if (isInstagramAuth && (callbackToken || code || igConnected)) {
      const savedIgMode = sessionStorage.getItem("instagram_auth_mode") as "login" | "signup" | null;
      const mode = (stateParam.includes("signup") || savedIgMode === "signup") ? "signup" : "login";
      processInstagramAuth({
        token: callbackToken || undefined,
        code: code || undefined,
        mode,
      });
      return;
    }

    // 3. Process Facebook callback if detected
    if (isFacebookAuth && (fbHashToken || fbSearchToken || code || callbackToken)) {
      const mode = (stateParam.includes("signup") || savedFbMode === "signup") ? "signup" : "login";
      processFacebookAuth({
        accessToken: fbHashToken || fbSearchToken || undefined,
        token: callbackToken || undefined,
        code: code || undefined,
        mode,
      });
      return;
    }

    // 4. Process Google OAuth code
    if (code) {
      if (
        inFlightGoogleCode === code ||
        (typeof window !== "undefined" && sessionStorage.getItem(`google_code_processed_${code}`))
      ) {
        return;
      }
      inFlightGoogleCode = code;
      try {
        sessionStorage.setItem(`google_code_processed_${code}`, "true");
      } catch (_) {}

      // Immediately remove query params from URL address bar so remounts / refreshes don't re-trigger
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const processGoogleCode = async () => {
        const savedMode = sessionStorage.getItem("google_auth_mode");
        const isSignup = stateParam.startsWith("signup") || savedMode === "signup";
        const mode = isSignup ? "signup" : "login";

        setSocialLoading("Gmail");
        setSocialNotice(isSignup ? "Completing your Google registration..." : "Signing in with Google... Verifying your account.");
        setError("");
        setAuthModal({
          open: true,
          status: "analyzing",
          provider: "Gmail",
          title: isSignup ? "Completing Google Registration" : "Connecting with Google",
          message: isSignup ? "Analyzing account & creating profile..." : "Analyzing credentials & verifying your account...",
        });
        try {
          const redirectUri = `${window.location.origin}/login/user`;
          const endpoint = isSignup ? "/api/v1/auth/google/signup" : "/api/v1/auth/google/login";
          const res = await api.post(endpoint, {
            code,
            redirect_uri: redirectUri,
            redirectUri: redirectUri,
            mode,
          });

          const data = res.data?.data || res.data;
          const token = data?.access_token || data?.token || data?.accessToken;
          const userObj = data?.user;

          if (token && userObj) {
            let isDone = Boolean(userObj.onboardingCompleted);
            try {
              const statusDone = await OnboardingService.isCompleted(token);
              if (statusDone) isDone = true;
            } catch (_) {}

            const finalUser = {
              ...userObj,
              onboardingCompleted: isDone,
            };
            login(token, finalUser);
            sessionStorage.removeItem("google_auth_mode");

            setAuthModal({
              open: true,
              status: "navigating",
              provider: "Gmail",
              title: "Google Verified!",
              message: "Account verified! Navigating to your dashboard...",
            });

            if (!isDone) {
              router.push("/onboarding");
            } else {
              const pendingPlan = sessionStorage.getItem("pending_plan");
              const pendingBilling = sessionStorage.getItem("pending_billing") || "monthly";
              if (pendingPlan) {
                sessionStorage.removeItem("pending_plan");
                sessionStorage.removeItem("pending_billing");
                router.push(`/subscription?plan=${pendingPlan}&billing=${pendingBilling}`);
              } else {
                router.push("/dashboard");
              }
            }
          } else {
            throw new Error(res.data?.message || "Google authentication did not return session token.");
          }
        } catch (err: any) {
          console.error("Google authentication error:", err);

          // If session token was already set by a parallel flow, safely navigate to dashboard
          const existingToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
          if (existingToken) {
            router.push("/dashboard");
            return;
          }

          let msg = err.response?.data?.detail || err.message || (isSignup ? "Failed to register with Google." : "Failed to sign in with Google.");
          if (typeof msg === "string") {
            try {
              const match = msg.match(/\{.*\}/);
              if (match) {
                const parsed = JSON.parse(match[0]);
                if (parsed.error === "invalid_grant") {
                  msg = "Google authorization code expired or was already verified. Please try signing in again.";
                } else if (parsed.error_description) {
                  msg = parsed.error_description;
                }
              } else if (msg.includes("invalid_grant")) {
                msg = "Google authorization code expired or was already verified. Please try signing in again.";
              }
            } catch (_) {}
          }

          setError(msg);
          setAuthModal({
            open: true,
            status: "error",
            provider: "Gmail",
            title: "Google Authentication Failed",
            message: msg,
          });
          sessionStorage.removeItem("google_auth_mode");
        } finally {
          inFlightGoogleCode = null;
          setSocialLoading(null);
          setSocialNotice(null);
        }
      };

      processGoogleCode();
    }
  }, [login, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");
    setSocialNotice(null);
    setAuthModal({
      open: true,
      status: "analyzing",
      provider: "Email",
      title: "Signing In",
      message: "Verifying your credentials and securing session...",
    });
    try {
      const response = await authService.login(data.email, data.password);
      if (response?.user?.role === "admin") {
        throw new Error("Administrators must log in through the Admin Portal.");
      }
      if (response?.token && response?.user) {
        let isDone = Boolean(response.user.onboardingCompleted);
        try {
          const statusDone = await OnboardingService.isCompleted(response.token);
          if (statusDone) isDone = true;
        } catch (_) {}

        const finalUser = {
          ...response.user,
          onboardingCompleted: isDone,
        };
        login(response.token, finalUser);

        setAuthModal({
          open: true,
          status: "navigating",
          provider: "Email",
          title: "Welcome Back!",
          message: "Credentials verified! Navigating to dashboard...",
        });

        const pendingPlan = typeof window !== 'undefined' ? sessionStorage.getItem('pending_plan') : null;
        const pendingBilling = typeof window !== 'undefined' ? sessionStorage.getItem('pending_billing') || 'monthly' : 'monthly';
        if (pendingPlan) {
          sessionStorage.removeItem('pending_plan');
          sessionStorage.removeItem('pending_billing');
          router.push(`/subscription?plan=${pendingPlan}&billing=${pendingBilling}`);
        } else if (finalUser.role === 'influencer' || finalUser.accountType === 'influencer') {
          router.push("/influencer");
        } else if (!isDone) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error("Authentication failed: Missing token or user data.");
      }
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      if (
        msg.includes("EMAIL_NOT_VERIFIED") ||
        msg.toLowerCase().includes("verification")
      ) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(msg);
        setAuthModal({
          open: true,
          status: "error",
          provider: "Email",
          title: "Login Failed",
          message: msg,
        });
      }
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "Gmail" | "Facebook" | "Instagram" | "LinkedIn") => {
    setError("");
    if (provider === "Gmail") {
      setSocialLoading("Gmail");
      setAuthModal({
        open: true,
        status: "analyzing",
        provider: "Gmail",
        title: "Connecting with Google",
        message: "Preparing secure Google OAuth handshake...",
      });
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const redirectUri = `${origin}/login/user`;
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "260412504334-00s4ah5tslv9rgso3g86fcb079bb84nr.apps.googleusercontent.com";
        const scope = "openid email profile";
        const state = "login_" + Math.random().toString(36).substring(7);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("google_auth_mode", "login");
        }
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account&state=${state}`;
        setAuthModal({
          open: true,
          status: "navigating",
          provider: "Gmail",
          title: "Redirecting to Google",
          message: "Navigating to Google sign-in portal. Please wait...",
        });
        setTimeout(() => {
          window.location.href = authUrl;
        }, 300);
        return;
      } catch (err: any) {
        console.error("Google connect error:", err);
        const errMsg = "Failed to initialize Google Login: " + (err.response?.data?.detail || err.message);
        setError(errMsg);
        setAuthModal({
          open: true,
          status: "error",
          provider: "Gmail",
          title: "Google Connection Failed",
          message: errMsg,
        });
        setSocialLoading(null);
        return;
      }
    }
    if (provider === "Facebook") {
      setSocialLoading("Facebook");
      setAuthModal({
        open: true,
        status: "analyzing",
        provider: "Facebook",
        title: "Connecting with Facebook",
        message: "Analyzing authentication request & initializing secure session...",
      });
      try {
        await FacebookService.startFacebookAuth("login", async (userToken) => {
          await processFacebookAuth({ accessToken: userToken, mode: "login" });
        });
        return;
      } catch (err: any) {
        console.error("Facebook connect error:", err);
        try {
          const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
          const res = await api.get(`/api/facebook/connect?frontend_url=${encodeURIComponent(origin + '/login/user')}&rerequest=true`);
          const authUrl = res.data?.authorization_url || res.data?.url;
          if (authUrl) {
            setAuthModal({
              open: true,
              status: "navigating",
              provider: "Facebook",
              title: "Redirecting to Facebook",
              message: "Navigating to Facebook portal. Please wait...",
            });
            setTimeout(() => {
              window.location.href = authUrl;
            }, 300);
            return;
          }
        } catch (backendErr: any) {
          const errMsg = "Failed to initialize Facebook Login: " + (err.message || backendErr.message);
          setError(errMsg);
          setAuthModal({
            open: true,
            status: "error",
            provider: "Facebook",
            title: "Facebook Connection Failed",
            message: errMsg,
          });
        }
        setSocialLoading(null);
        setSocialNotice(null);
        return;
      }
    }
    if (provider === "Instagram") {
      setSocialLoading("Instagram");
      setAuthModal({
        open: true,
        status: "analyzing",
        provider: "Instagram",
        title: "Connecting with Instagram",
        message: "Initializing secure Instagram connection...",
      });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("instagram_auth_mode", "login");
      }
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const res = await api.get(`/api/instagram/connect?frontend_url=${encodeURIComponent(origin + '/login/user')}`);
        const authUrl = res.data?.authorization_url || res.data?.url;
        if (authUrl) {
          setAuthModal({
            open: true,
            status: "navigating",
            provider: "Instagram",
            title: "Redirecting to Instagram",
            message: "Navigating to Instagram authorization portal. Please wait...",
          });
          setTimeout(() => {
            window.location.href = authUrl;
          }, 300);
          return;
        }
      } catch (err: any) {
        console.error("Instagram connect error:", err);
        const errMsg = "Failed to initialize Instagram Login: " + (err.response?.data?.detail || err.message);
        setError(errMsg);
        setAuthModal({
          open: true,
          status: "error",
          provider: "Instagram",
          title: "Instagram Connection Failed",
          message: errMsg,
        });
        setSocialLoading(null);
        setSocialNotice(null);
        return;
      }
    }
    if (provider === "LinkedIn") {
      setSocialLoading("LinkedIn");
      setAuthModal({
        open: true,
        status: "analyzing",
        provider: "LinkedIn",
        title: "Connecting with LinkedIn",
        message: "Analyzing credentials & initializing secure OAuth handshake...",
      });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("linkedin_auth_mode", "login");
      }
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const redirectUri = `${origin}/login/user`;
        const res = await api.get(`/api/v1/auth/linkedin/connect?redirect_uri=${encodeURIComponent(redirectUri)}&mode=login`);
        const authUrl = res.data?.authorization_url || res.data?.url;
        if (authUrl) {
          setAuthModal({
            open: true,
            status: "navigating",
            provider: "LinkedIn",
            title: "Redirecting to LinkedIn",
            message: "Navigating to LinkedIn secure sign-in portal. Please wait...",
          });
          setTimeout(() => {
            window.location.href = authUrl;
          }, 300);
          return;
        }
        // Fallback to direct OAuth URL if endpoint response is missing authUrl
        const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "868tp3n7eu94td";
        const scope = "openid profile email w_member_social";
        const state = "login_linkedin_" + Math.random().toString(36).substring(7);
        const directUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
        setAuthModal({
          open: true,
          status: "navigating",
          provider: "LinkedIn",
          title: "Redirecting to LinkedIn",
          message: "Navigating to LinkedIn secure sign-in portal. Please wait...",
        });
        setTimeout(() => {
          window.location.href = directUrl;
        }, 300);
        return;
      } catch (err: any) {
        console.error("LinkedIn connect error:", err);
        try {
          const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
          const redirectUri = `${origin}/login/user`;
          const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "868tp3n7eu94td";
          const scope = "openid profile email w_member_social";
          const state = "login_linkedin_" + Math.random().toString(36).substring(7);
          const directUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
          setAuthModal({
            open: true,
            status: "navigating",
            provider: "LinkedIn",
            title: "Redirecting to LinkedIn",
            message: "Navigating to LinkedIn secure sign-in portal. Please wait...",
          });
          setTimeout(() => {
            window.location.href = directUrl;
          }, 300);
          return;
        } catch (fallbackErr: any) {
          const errMsg = "Failed to initialize LinkedIn Login: " + (err.response?.data?.detail || err.message);
          setError(errMsg);
          setAuthModal({
            open: true,
            status: "error",
            provider: "LinkedIn",
            title: "LinkedIn Connection Failed",
            message: errMsg,
          });
          setSocialLoading(null);
          setSocialNotice(null);
          return;
        }
      }
    }
    setSocialLoading(provider);
    setSocialNotice(`Connecting with ${provider}... Initializing secure session.`);
    setTimeout(() => {
      setSocialLoading(null);
      setSocialNotice(
        `OAuth notice: ${provider} integration is active in development mode. You can sign in using your registered email and password.`
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#f1f1f5] flex flex-col justify-between px-6 py-6 md:px-12 lg:px-16 selection:bg-[#be32ff]/30 relative overflow-hidden">
      {/* Background ambient subtle glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header / Brand Logo */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto pb-4">
        <Link href="/" className="flex items-center group">
          <img
            src="/images/dhandagrow.png"
            alt="DhandaGrow AI"
            className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </header>

      {/* Main Container - Split View inspired by Claude */}
      <main className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-6">
        {/* Left Column: Headline & Auth Box */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center max-w-md mx-auto lg:mx-0 w-full">
          {/* Headlines */}
          <div className="mb-7">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white font-normal mb-3 leading-[1.15]">
              Question what&apos;s next
            </h1>
            <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed">
              Your thinking partner for big ambitions
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#15161b]/95 border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-3.5 transition-all">
            {/* 1. Continue with Gmail */}
            <button
              type="button"
              onClick={() => handleSocialLogin("Gmail")}
              disabled={socialLoading !== null}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#1c1d24] hover:bg-[#23252e] hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] text-neutral-200 text-sm font-medium flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
            >
              {socialLoading === "Gmail" ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
              ) : (
                <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Gmail</span>
            </button>

            {/* 2. Login with Facebook */}
            <button
              type="button"
              onClick={() => handleSocialLogin("Facebook")}
              disabled={socialLoading !== null}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#1c1d24] hover:bg-[#23252e] hover:border-[#1877F2]/40 hover:shadow-[0_0_20px_rgba(24,119,242,0.15)] text-neutral-200 text-sm font-medium flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
            >
              {socialLoading === "Facebook" ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1877F2]" />
              ) : (
                <svg className="w-4 h-4 shrink-0 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span>Login with Facebook</span>
            </button>


            {/* 3. Login with LinkedIn */}
            <button
              type="button"
              onClick={() => handleSocialLogin("LinkedIn")}
              disabled={socialLoading !== null}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#1c1d24] hover:bg-[#23252e] hover:border-[#0A66C2]/40 hover:shadow-[0_0_20px_rgba(10,102,194,0.15)] text-neutral-200 text-sm font-medium flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
            >
              {socialLoading === "LinkedIn" ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0A66C2]" />
              ) : (
                <svg className="w-4 h-4 shrink-0 text-[#0A66C2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              )}
              <span>Login with LinkedIn</span>
            </button>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#15161b] px-3 text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">
                OR
              </span>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="space-y-1.5">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`w-full h-11 px-4 rounded-xl bg-[#0f1014] text-white placeholder:text-neutral-500 text-sm border ${
                    errors.email ? "border-red-500" : "border-white/10 hover:border-white/20"
                  } focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/20 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1014_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 pl-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full h-11 px-4 pr-11 rounded-xl bg-[#0f1014] text-white placeholder:text-neutral-500 text-sm border ${
                      errors.password ? "border-red-500" : "border-white/10 hover:border-white/20"
                    } focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/20 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1014_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between px-1">
                  {errors.password ? (
                    <p className="text-xs text-red-400">{errors.password.message}</p>
                  ) : <span />}
                  <Link
                    href="#"
                    className="text-xs text-neutral-400 hover:text-[#fc9a5d] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>



              {error && (
                <div className="p-3.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in flex flex-col gap-2">
                  <span className="leading-relaxed font-medium">{error}</span>
                  {error.toLowerCase().includes("sign up") && (
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-1 font-semibold text-[#be32ff] hover:text-[#d364ff] transition-colors underline underline-offset-4"
                    >
                      Don&apos;t have an account yet? Register here &rarr;
                    </Link>
                  )}
                </div>
              )}

              {/* Action Button: Clean White Button with Micro-Interaction */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.25)]"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-neutral-900" />
                ) : (
                  "Continue with email"
                )}
              </button>
            </form>
          </div>

          {/* Bottom Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-white hover:text-[#fc9a5d] hover:underline font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column: Clean, High-End Dynamic AI Showcase (2.8s Auto-Rotation) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 justify-center items-center">
          <div 
            onMouseEnter={() => setIsShowcasePaused(true)}
            onMouseLeave={() => setIsShowcasePaused(false)}
            className="relative w-full max-w-xl h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-gradient-to-b from-[#141523] via-[#0d0e17] to-[#090a0f] flex items-center justify-center group select-none"
          >
            {/* Dynamic Ambient Background Glows */}
            <div className={`absolute top-1/4 left-1/4 w-80 h-80 ${currentSlide.glow1} rounded-full blur-3xl pointer-events-none transition-all duration-1000`} />
            <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${currentSlide.glow2} rounded-full blur-3xl pointer-events-none transition-all duration-1000`} />

            {/* Slide Images with Silky Smooth Crossfade */}
            {SHOWCASE_SLIDES.map((slide, idx) => {
              const isActive = idx === slideIndex;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 p-6 flex items-center justify-center transition-all duration-700 ease-in-out ${
                    isActive 
                      ? "opacity-100 scale-100 z-10 pointer-events-auto" 
                      : "opacity-0 scale-105 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className={`w-full h-full ${slide.objectFit} rounded-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.6)]`}
                  />
                </div>
              );
            })}

            {/* Aesthetic Vignette & Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30 pointer-events-none z-10" />

            {/* Top Navigation & Status Bar */}
            <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between pointer-events-auto">
              {/* Story / Carousel Progress Bars */}
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                {SHOWCASE_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === slideIndex 
                        ? "w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" 
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                    title={`Slide ${idx + 1}: ${s.title}`}
                  />
                ))}
              </div>

              {/* Dynamic Floating Badge */}
              <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-lg transition-all duration-500">
                {currentSlide.badgeIcon === "bot" && <Bot className="w-3.5 h-3.5 text-[#fc9a5d]" />}
                {currentSlide.badgeIcon === "sparkles" && <Sparkles className="w-3.5 h-3.5 text-[#ec4899]" />}
                {currentSlide.badgeIcon === "zap" && <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />}
                {currentSlide.badgeIcon === "camera" && <Camera className="w-3.5 h-3.5 text-[#f59e0b]" />}
                <span className="text-xs text-white/90 font-medium tracking-wide">
                  {currentSlide.badge}
                </span>
              </div>
            </div>

            {/* Prev / Next Quick Arrow Buttons (visible on hover) */}
            <button
              type="button"
              onClick={() => setSlideIndex((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-lg"
              title="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-lg"
              title="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Floating Info Card with Slide Details */}
            <div className="absolute bottom-6 left-6 right-6 z-20 p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-between transition-all duration-500">
              <div className="flex-1 pr-3">
                <p className={`text-xs uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${currentSlide.gradient} font-extrabold transition-all duration-500`}>
                  {currentSlide.title}
                </p>
                <p className="text-sm text-neutral-200 font-medium mt-0.5 line-clamp-1 transition-all duration-500">
                  {currentSlide.description}
                </p>
              </div>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-[#fc9a5d]" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} DhandaGrow AI. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <Link href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
        </div>
      </footer>

      {/* Centered Beautiful Status / Analysis / Error / Navigation Modal */}
      {authModal && (
        <AuthCenterModal
          open={authModal.open}
          onClose={() => {
            setAuthModal(null);
            setError("");
            setSocialLoading(null);
          }}
          status={authModal.status}
          provider={authModal.provider}
          title={authModal.title}
          message={authModal.message}
          actionText={authModal.actionText}
          actionHref={authModal.actionHref}
        />
      )}
    </div>
  );
}
