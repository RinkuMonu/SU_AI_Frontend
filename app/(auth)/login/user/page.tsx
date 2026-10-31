"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  X,
  ChevronDown,
  Moon,
  Sun,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Phone
} from "lucide-react";
import { 
  COUNTRY_CODES, 
  validatePhoneNumber, 
  sanitizeNationalNumber,
  maskPhoneNumber 
} from "@/lib/phone";
import { authService, OtpDeliveryChannel } from "@/services/auth.service";
import { OnboardingService } from "@/services/onboarding.service";
import { FacebookService } from "@/services/facebook.service";
import api from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { needsRoleSelection, getDashboardRouteForRole } from "@/lib/role-routing";
import { AuthCenterModal, AuthModalStatus, AuthProviderType } from "@/components/auth/AuthCenterModal";
import { OtpInput } from "@/components/ui/OtpInput";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

// Prevent duplicate callback execution in React StrictMode
let inFlightGoogleCode: string | null = null;

// Official Google "G" Icon (Icon Only - no clutter)
const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
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
);

// Phone with Face ID & Glowing Blue Shield Illustration (Images 2 & 3)
const OtpPhoneShieldIllustration = () => (
  <svg
    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto select-none"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="phoneScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B1E48" />
        <stop offset="100%" stopColor="#051028" />
      </linearGradient>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Phone Body */}
    <rect
      x="24"
      y="8"
      width="44"
      height="68"
      rx="9"
      fill="url(#phoneScreenGrad)"
      stroke="#2563EB"
      strokeWidth="2.2"
    />

    {/* Speaker notch */}
    <rect x="40" y="13" width="12" height="2" rx="1" fill="#3B82F6" />

    {/* Face ID Viewfinder Corner Brackets */}
    <path
      d="M34 26 h -3 v 3 M58 26 h 3 v 3 M34 43 h -3 v -3 M58 43 h 3 v -3"
      stroke="#38BDF8"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Face Avatar */}
    <circle cx="46" cy="32" r="4.2" fill="#38BDF8" />
    <path
      d="M39 42 c 0 -3.6 3.1 -6.8 7 -6.8 s 7 3.2 7 6.8"
      stroke="#38BDF8"
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    {/* Text / Message placeholder lines */}
    <rect x="33" y="49" width="26" height="2.5" rx="1.25" fill="#1E40AF" />
    <rect x="33" y="54" width="18" height="2" rx="1" fill="#1E3A8A" />

    {/* Home indicator dot */}
    <circle cx="46" cy="69" r="1.3" fill="#3B82F6" />

    {/* Sparkle Accent Rays above Shield */}
    <path d="M74 38 L 78 34" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M80 43 L 85 42" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M72 47 L 76 49" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />

    {/* Blue Glowing Shield */}
    <path
      d="M58 46 C 68 46, 76 40, 76 40 C 76 40, 76 56, 76 60 C 76 70, 67 76, 58 80 C 49 76, 40 70, 40 60 C 40 56, 40 40, 40 40 C 40 40, 48 46, 58 46 Z"
      fill="url(#shieldGrad)"
      stroke="#60A5FA"
      strokeWidth="1.5"
      filter="url(#shieldGlow)"
    />

    {/* Checkmark inside Shield */}
    <path
      d="M51 59 L 56 64 L 66 53"
      stroke="white"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Official WhatsApp Brand Icon
const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);


async function navigateAfterAuth(user: any, router: any) {
  const pendingRole = typeof window !== "undefined" ? sessionStorage.getItem("selected_role") : null;
  if (pendingRole && (pendingRole === "businessman" || pendingRole === "influencer")) {
    try {
      await authService.selectRole(pendingRole);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("selected_role");
      }
    } catch (_) {}
  }
  const pendingPlan = typeof window !== "undefined" ? sessionStorage.getItem("pending_plan") : null;
  const pendingBilling = typeof window !== "undefined" ? sessionStorage.getItem("pending_billing") || "monthly" : "monthly";
  if (pendingPlan) {
    sessionStorage.removeItem("pending_plan");
    sessionStorage.removeItem("pending_billing");
    router.push(`/subscription?plan=${pendingPlan}&billing=${pendingBilling}`);
    return;
  }

  // Check if onboarding is completed
  const isCompleted = Boolean(
    user?.onboardingCompleted === true ||
    user?.onboarding_completed === true ||
    user?.is_completed === true
  );

  if (isCompleted) {
    router.push(getDashboardRouteForRole(user?.role));
  } else {
    // New users and users with incomplete onboarding route to Role Selection (/select-role)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("show_onboarding_plan", "true");
    }
    router.push("/select-role");
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Screen flow: "phone" -> "otp"
  const [step, setStep] = useState<"phone" | "otp" | "get_started">("phone");
  const [pendingAuthUser, setPendingAuthUser] = useState<any>(null);

  // Phone input states
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<OtpDeliveryChannel>("sms");

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showRightNumberAlert, setShowRightNumberAlert] = useState(true);

  // Status & Notifications
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  // Language Translation Hook
  const { t } = useLanguage();

  // Modal for OAuth / handshakes
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    status: AuthModalStatus;
    provider?: AuthProviderType;
    title?: string;
    message?: string;
    actionText?: string;
    actionHref?: string;
  } | null>(null);

  // Track the last phone number OTP was automatically sent to avoid duplicate trigger loops
  const lastAutoSentPhoneRef = useRef<string>("");
  const autoSendTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer for OTP resend (60s)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Read URL query parameters on initial mount (e.g. registered=true, verified=true, phone=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const regParam = searchParams.get("registered");
    const verParam = searchParams.get("verified");
    const phoneParam = searchParams.get("phone");
    const stepParam = searchParams.get("step");

    if (stepParam === "get_started" || stepParam === "2") {
      setStep("get_started");
    } else if (stepParam === "otp" || stepParam === "1") {
      setStep("otp");
    }

    if (regParam === "true") {
      setSuccessMsg("Account registered successfully! Please log in.");
    } else if (verParam === "true") {
      setSuccessMsg("Phone number verified successfully! Please log in.");
    }

    if (phoneParam) {
      if (phoneParam.startsWith("+")) {
        const matched = COUNTRY_CODES.find((c) => phoneParam.startsWith(c.code));
        if (matched) {
          setCountryCode(matched.code);
          setPhone(phoneParam.slice(matched.code.length));
        } else {
          setPhone(phoneParam);
        }
      } else {
        setPhone(phoneParam);
      }
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. AUTO-TRIGGER SEND OTP WHEN VALID NUMBER IS ENTERED
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "phone") return;

    const validation = validatePhoneNumber(countryCode, phone);
    const cleanNumber = phone.replace(/\D/g, "");

    // Check if the user reached valid number length (e.g. 10 digits in India)
    const isReadyForAutoSend = validation.isValid && (countryCode === "+91" ? cleanNumber.length === 10 : cleanNumber.length >= 8);

    if (isReadyForAutoSend && validation.e164 !== lastAutoSentPhoneRef.current && !isSendingOtp) {
      if (autoSendTimeoutRef.current) clearTimeout(autoSendTimeoutRef.current);
      autoSendTimeoutRef.current = setTimeout(() => {
        handleSendOtp(selectedChannel, validation.e164);
      }, 350);
    }

    return () => {
      if (autoSendTimeoutRef.current) clearTimeout(autoSendTimeoutRef.current);
    };
  }, [phone, countryCode, step, selectedChannel, isSendingOtp]);

  /**
   * Send OTP via SMS (Fast2SMS) or WhatsApp (MSG91)
   */
  const handleSendOtp = async (channel: OtpDeliveryChannel = "sms", targetE164?: string) => {
    setPhoneError("");
    setError("");
    setOtpError("");

    const validation = validatePhoneNumber(countryCode, phone);
    const e164 = targetE164 || (validation.isValid ? validation.e164 : (countryCode + phone));

    if (!targetE164 && !validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid mobile number");
      return;
    }

    if (isSendingOtp) return;
    setIsSendingOtp(true);
    setSelectedChannel(channel);
    lastAutoSentPhoneRef.current = e164;

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_auth_phone", e164);
        sessionStorage.setItem("google_auth_country_code", countryCode);
        sessionStorage.setItem("google_auth_mode", "login");
      }

      await authService.sendOtp({
        phone: e164,
        countryCode,
        channel,
      });

      setStep("otp");
      setCountdown(60);
      setOtp("");
      setShowRightNumberAlert(true);
      const channelLabel = channel === "whatsapp" ? "WhatsApp" : "SMS";
      setSuccessMsg(`6-digit verification code sent via ${channelLabel}.`);
    } catch (err: any) {
      console.warn("Failed to send OTP:", err?.message || err);
      const errMsg = err?.message || "";
      if (errMsg.toLowerCase().includes("not registered") || errMsg.toLowerCase().includes("not found")) {
        setError("No account found with this phone number. Please sign up below.");
      } else if (err.code === "SMS_GATEWAY_ERROR" || errMsg.toLowerCase().includes("sms")) {
        setError(errMsg || "SMS service is temporarily delayed. Try WhatsApp OTP instead.");
      } else if (err.code === "WHATSAPP_GATEWAY_ERROR" || errMsg.toLowerCase().includes("whatsapp")) {
        setError(errMsg || "WhatsApp service is temporarily delayed. Try SMS OTP instead.");
      } else {
        setError(errMsg || "Failed to send verification code. Please check your number and retry.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  /**
   * Verify 6-digit OTP (Auto-triggered immediately when 6 digits are typed)
   */
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const finalOtp = (codeToVerify || otp).trim();

    if (finalOtp.length !== 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }

    if (isVerifyingOtp) return;
    setIsVerifyingOtp(true);
    setOtpError("");
    setError("");

    const validation = validatePhoneNumber(countryCode, phone);
    const targetPhone = validation.isValid ? validation.e164 : (countryCode + phone);

    try {
      const response = await authService.verifyOtp(
        { phone: targetPhone, countryCode, channel: selectedChannel, mode: "login" },
        finalOtp
      );

      const token = response.token;
      const user = response.user;

      if (token && user) {
        login(token, user);

        let isDone = Boolean(user.onboardingCompleted);
        try {
          const statusDone = await OnboardingService.isCompleted(token);
          if (statusDone) isDone = true;
        } catch (_) {}

        const finalUser = {
          ...user,
          phone_verified: true,
          onboardingCompleted: isDone,
        };

        // Clear cached onboarding step & role so user follows the exact flow:
        // Mobile Number -> OTP Request -> OTP Verification -> Role Selection
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("onboarding_step");
          sessionStorage.removeItem("show_onboarding_plan");
          sessionStorage.removeItem("selected_role");
          localStorage.removeItem("selected_role");
        }
        login(token, finalUser);
        router.push("/select-role");
      } else {
        throw new Error(response.message || "OTP verification did not return session.");
      }
    } catch (err: any) {
      console.warn("OTP verification failed:", err?.message || err);
      setOtpError(err.message || "Invalid or expired OTP. Please check and try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Resend OTP with channel toggle support
   */
  const handleResend = async (targetChannel?: OtpDeliveryChannel) => {
    const channelToUse = targetChannel || selectedChannel;
    setOtp("");
    setOtpError("");
    lastAutoSentPhoneRef.current = ""; // Reset to allow re-sending
    await handleSendOtp(channelToUse);
  };

  /**
   * Return to phone input screen
   */
  const handleChangeNumber = () => {
    setStep("phone");
    setOtp("");
    setOtpError("");
    setError("");
    lastAutoSentPhoneRef.current = ""; // Allow re-entering/editing
  };

  /**
   * Continue with WhatsApp alternative option
   */
  const handleContinueWithWhatsApp = () => {
    const validation = validatePhoneNumber(countryCode, phone);
    if (!validation.isValid) {
      setSelectedChannel("whatsapp");
      setPhoneError("Please enter your mobile number above to receive OTP on WhatsApp");
      const phoneInput = document.getElementById("scaleo-phone");
      phoneInput?.focus();
      return;
    }
    handleSendOtp("whatsapp", validation.e164);
  };

  /**
   * Launch standard Google OAuth account chooser screen (Screenshot 3)
   */
  const handleGoogleLogin = () => {
    setError("");
    setSocialLoading("Google");
    setAuthModal({
      open: true,
      status: "analyzing",
      provider: "Google",
      title: "Connecting with Google",
      message: "Opening Google account chooser portal...",
    });

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "https://api.dhandagrow.com/api/v1/auth/google/callback";
      const clientId =
        (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim() ||
        "260412504334-00s4ah5tslv9rgso3g86fcb079bb84nr.apps.googleusercontent.com";
      const scope = "openid email profile";
      const state = "login_" + Math.random().toString(36).substring(7);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_auth_mode", "login");
        if (phone.trim()) {
          const validation = validatePhoneNumber(countryCode, phone);
          if (validation.isValid) {
            sessionStorage.setItem("google_auth_phone", validation.e164);
            sessionStorage.setItem("google_auth_country_code", countryCode);
          }
        }
      }

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${encodeURIComponent(
        scope
      )}&access_type=offline&prompt=select_account&state=${state}`;

      setAuthModal({
        open: true,
        status: "navigating",
        provider: "Google",
        title: "Redirecting to Google",
        message: "Navigating to Google account chooser...",
      });

      setTimeout(() => {
        window.location.href = authUrl;
      }, 250);
    } catch (err: any) {
      console.warn("Google connect error:", err?.message || err);
      setError(err.message || "Failed to initialize Google sign-in.");
      setSocialLoading(null);
      setAuthModal(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PRESERVED OAUTH CALLBACK LISTENER (Google, Facebook, Instagram, LinkedIn)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash || "";
    const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.substring(1) : hash);
    const searchParams = new URLSearchParams(window.location.search);

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error") || searchParams.get("error_description") || hashParams.get("error");
    const stateParam = searchParams.get("state") || hashParams.get("state") || "";

    if (errorParam) {
      setError(`Authentication error: ${errorParam}`);
      return;
    }

    if (code) {
      if (
        inFlightGoogleCode === code ||
        sessionStorage.getItem(`google_code_processed_${code}`)
      ) {
        return;
      }
      inFlightGoogleCode = code;
      try {
        sessionStorage.setItem(`google_code_processed_${code}`, "true");
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (_) {}

      const processGoogleCode = async () => {
        const savedMode = sessionStorage.getItem("google_auth_mode");
        const preservedPhone = sessionStorage.getItem("google_auth_phone") || undefined;
        const preservedCc = sessionStorage.getItem("google_auth_country_code") || undefined;
        const preservedToken =
          sessionStorage.getItem("google_auth_verification_token") ||
          sessionStorage.getItem("phone_verification_token") ||
          undefined;
        const isSignup = stateParam.startsWith("signup") || savedMode === "signup";
        const mode = isSignup ? "signup" : "login";

        setSocialLoading("Google");
        setAuthModal({
          open: true,
          status: "analyzing",
          provider: "Google",
          title: isSignup ? "Completing Google Registration" : "Connecting with Google",
          message: "Verifying your Google identity...",
        });

        try {
          const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "https://api.dhandagrow.com/api/v1/auth/google/callback";
          const res = await authService.googleLogin({
            code,
            redirect_uri: redirectUri,
            mode,
            phone: preservedPhone,
            countryCode: preservedCc,
            phone_verification_token: preservedToken,
            verification_token: preservedToken,
          });

          const token = res.token;
          const userObj = res.user;

          if (token && userObj) {
            const isExistingUser = Boolean(res.exists || res.is_existing_user || res.user_exists);

            if (isSignup && isExistingUser) {
              const existingMsg = "This email is already registered. Please log in instead.";
              setError(existingMsg);
              setAuthModal({
                open: true,
                status: "error",
                provider: "Google",
                title: "Email Already Registered",
                message: existingMsg,
                actionText: "Log In",
                actionHref: "/login/user",
              });
              sessionStorage.removeItem("google_auth_mode");
              sessionStorage.removeItem("google_auth_phone");
              sessionStorage.removeItem("google_auth_country_code");
              sessionStorage.removeItem("google_auth_verification_token");
              sessionStorage.removeItem("phone_verification_token");
              return;
            }

            let isDone = Boolean(userObj.onboardingCompleted);
            try {
              const statusDone = await OnboardingService.isCompleted(token);
              if (statusDone) isDone = true;
            } catch (_) {}

            const finalUser = {
              ...userObj,
              auth_provider: "google",
              phone_verified: true,
              onboardingCompleted: isDone,
            };
            login(token, finalUser);
            sessionStorage.removeItem("google_auth_mode");
            sessionStorage.removeItem("google_auth_phone");
            sessionStorage.removeItem("google_auth_country_code");
            sessionStorage.removeItem("google_auth_verification_token");
            sessionStorage.removeItem("phone_verification_token");

            navigateAfterAuth(finalUser, router);
          } else {
            throw new Error(res.message || "Google authentication did not return session token.");
          }
        } catch (err: any) {
          console.warn("Google authentication error:", err?.message || err);
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
              } else if (msg.includes("invalid_grant") || msg.toLowerCase().includes("already used") || msg.toLowerCase().includes("expired")) {
                msg = "Google authorization code expired or was already verified. Please try signing in again.";
              }
            } catch (_) {}
          }

          const isPhoneVerificationRequired =
            msg.toLowerCase().includes("verification is required") ||
            msg.toLowerCase().includes("verify your mobile number") ||
            msg.toLowerCase().includes("verification_token");

          if (isSignup && isPhoneVerificationRequired) {
            const reqMsg = "Mobile phone verification is required before completing signup. Please verify your mobile number first.";
            setError(reqMsg);
            setAuthModal({
              open: true,
              status: "error",
              provider: "Google",
              title: "Phone Verification Required",
              message: reqMsg,
              actionText: "Verify Phone",
              actionHref: preservedPhone ? `/signup?phone=${encodeURIComponent(preservedPhone)}` : "/signup",
            });
            return;
          }

          const isAlreadyRegistered =
            msg.toLowerCase().includes("already registered") ||
            msg.toLowerCase().includes("already exist") ||
            err.status === 409 ||
            err.code === "EMAIL_ALREADY_EXISTS";

          if (isSignup && isAlreadyRegistered) {
            const existingMsg = "This email is already registered. Please log in instead.";
            setError(existingMsg);
            setAuthModal({
              open: true,
              status: "error",
              provider: "Google",
              title: "Email Already Registered",
              message: existingMsg,
              actionText: "Log In",
              actionHref: "/login/user",
            });
            sessionStorage.removeItem("google_auth_mode");
            sessionStorage.removeItem("google_auth_phone");
            sessionStorage.removeItem("google_auth_country_code");
            sessionStorage.removeItem("google_auth_verification_token");
            sessionStorage.removeItem("phone_verification_token");
            return;
          }

          const isUnregistered =
            msg.toLowerCase().includes("no account found") ||
            msg.toLowerCase().includes("register") ||
            msg.toLowerCase().includes("not registered") ||
            err.status === 404 ||
            err.code === "USER_NOT_FOUND";

          setError(msg);

          if (isUnregistered) {
            setAuthModal({
              open: true,
              status: "error",
              provider: "Google",
              title: "Account Not Found",
              message: "No account found with this Google email. Click below to create your account in one tap!",
              actionText: "Sign Up with Google",
              actionHref: "/signup",
            });
          } else {
            setAuthModal({
              open: true,
              status: "error",
              provider: "Google",
              title: "Google Authentication Failed",
              message: msg,
              actionText: "Try Again with Google",
              actionHref: "/login/user",
            });
            sessionStorage.removeItem("google_auth_mode");
            sessionStorage.removeItem("google_auth_phone");
            sessionStorage.removeItem("google_auth_country_code");
            sessionStorage.removeItem(`google_code_processed_${code}`);
          }
        } finally {
          inFlightGoogleCode = null;
          setSocialLoading(null);
        }
      };

      processGoogleCode();
    }
  }, [login, router]);

  const formattedDisplayPhone = `${countryCode} ${phone || ""}`;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#071226] text-[#f1f1f5] flex items-center justify-center relative select-none font-sans p-[5px]">
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          BACKGROUND PURPLE WAVE: Exact organic wave matching reference design
         ───────────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute bottom-0 left-0 w-full h-[16vh] min-h-[90px] max-h-[160px]"
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleWaveGradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#4A229E" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#2E156D" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#1B0C46" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0B0522" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purpleWaveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E156D" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#6C35DE" stopOpacity="0.65" />
              <stop offset="68%" stopColor="#8747FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4E20B3" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path
            d="M0 168 C 300 155, 620 115, 980 75 C 1180 52, 1340 76, 1440 95 L 1440 180 L 0 180 Z"
            fill="url(#purpleWaveGradient)"
          />
          <path
            d="M0 168 C 300 155, 620 115, 980 75 C 1180 52, 1340 76, 1440 95"
            stroke="url(#purpleWaveStroke)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MAIN CONTENT: Centered Auth Card
         ───────────────────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full h-full flex items-center justify-between">

        {/* Left Column: 3D Phone Mockup Showcase (Dynamically updates on step and when typing OTP) */}
        <div className="hidden lg:flex w-[490px] xl:w-[550px] 2xl:w-[620px] h-[calc(100vh-10px)] items-center justify-center rounded-3xl overflow-hidden bg-[#201653] shadow-2xl relative select-none shrink-0 border border-white/10">
          <img
            key={step === "otp" && otp.length > 0 ? "otp-typing" : step}
            src={
              step === "otp"
                ? otp.length > 0
                  ? "/images/auth-reading-mockup.jpg"
                  : "/images/auth-otp-mockup.jpg"
                : "/images/auth-phone-mockup.jpg"
            }
            alt="DhandaGrow AI+"
            className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-300 animate-in fade-in"
          />
        </div>

        {/* Right Column: Dark Auth Card (#10131c) - Exact Images 1 & 2 */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-[375px] xl:max-w-[390px] bg-[#10131c] rounded-2xl border border-slate-700/60 shadow-2xl shadow-black/50 p-6 sm:p-7 space-y-4 sm:space-y-4.5 relative z-10 shrink-0">
          
          {/* Global Error Banner */}
          {error && (
            <div className="p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start justify-between gap-1.5 animate-in fade-in">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-snug">{error}</span>
              </div>
              {error.includes("No account found") || error.includes("sign up") ? (
                <Link
                  href="/signup"
                  className="shrink-0 font-bold text-xs text-purple-400 hover:underline"
                >
                  Sign Up &rarr;
                </Link>
              ) : (error.toLowerCase().includes("sms") || error.toLowerCase().includes("whatsapp") || error.toLowerCase().includes("temporarily unavailable")) ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextChannel = selectedChannel === "sms" ? "whatsapp" : "sms";
                    handleSendOtp(nextChannel);
                  }}
                  disabled={isSendingOtp}
                  className="shrink-0 font-bold text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Try {selectedChannel === "sms" ? "WhatsApp" : "SMS"} &rarr;
                </button>
              ) : null}
            </div>
          )}

          {/* Global Success Banner */}
          {successMsg && !error && (
            <div className="p-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════
              STEP 1: Phone Input Screen (Exact Image 1 Design)
             ═══════════════════════════════════════════════════════════════════════════ */}
          {step === "phone" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Logo & Subtitle inside Card */}
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo-icon.png"
                  alt="DhandaGrow"
                  className="h-12 sm:h-13 w-auto object-contain shrink-0 drop-shadow-[0_0_12px_rgba(240,68,155,0.4)]"
                />
                <div className="flex flex-col justify-center">
                  <img
                    src="/images/dhandagrow-text-logo.png"
                    alt="DhandaGrow AI"
                    className="h-6 w-auto object-contain select-none"
                  />
                  <span className="text-xs text-slate-300 font-normal tracking-wide mt-1">
                    India&apos;s AI Business Growth App
                  </span>
                </div>
              </div>

              {/* Phone Field Group with Exact Image 1 Box Size */}
              <div className="space-y-1.5 pt-0.5">
                <label
                  htmlFor="login-phone-input"
                  className="block text-xs font-normal text-slate-400"
                >
                  Enter your phone number
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="login-phone-input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith("+")) {
                        const matched = COUNTRY_CODES.find((c) => val.startsWith(c.code));
                        if (matched) {
                          setCountryCode(matched.code);
                          setPhone(sanitizeNationalNumber(matched.code, val.slice(matched.code.length)));
                          return;
                        }
                      }
                      setPhone(sanitizeNationalNumber(countryCode, val));
                      if (phoneError) setPhoneError("");
                      if (error) setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendOtp("sms");
                      }
                    }}
                    className={`w-full h-[46px] pl-10 pr-4 rounded-xl bg-[#242832] text-white placeholder:text-slate-400 text-sm font-normal border ${
                      phoneError ? "border-red-500" : "border-slate-700/60 hover:border-slate-600"
                    } focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all`}
                  />
                </div>

                {phoneError && (
                  <p className="text-xs text-red-400 pl-1">{phoneError}</p>
                )}
              </div>

              {/* Vibrant Gradient "Send OTP" Button */}
              <button
                type="button"
                onClick={() => handleSendOtp("sms")}
                disabled={isSendingOtp}
                className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:opacity-95 active:scale-[0.99] text-white font-medium text-sm tracking-wide transition-all shadow-md shadow-[#F2548E]/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>

              {/* OR Divider with comfortable spacing */}
              <div className="relative flex items-center justify-center py-3.5 sm:py-4">
                <div className="w-full border-t border-slate-700/50" />
                <span className="absolute bg-[#10131c] px-3 text-[11px] font-normal tracking-widest text-slate-500 uppercase">
                  OR
                </span>
              </div>

              {/* Full-width Stacked Social Buttons */}
              <div className="space-y-2.5">
                {/* Continue with Gmail */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={socialLoading !== null}
                  className="w-full h-[46px] rounded-xl bg-[#242832] hover:bg-[#2c313d] border border-slate-700/50 transition-all flex items-center justify-center gap-2.5 text-sm font-normal text-slate-200 cursor-pointer active:scale-[0.99] disabled:opacity-60"
                >
                  {socialLoading === "Google" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : (
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                  )}
                  <span>Continue with Gmail</span>
                </button>

                {/* Login with Whatsapp */}
                <button
                  type="button"
                  onClick={handleContinueWithWhatsApp}
                  disabled={isSendingOtp}
                  className="w-full h-[46px] rounded-xl bg-[#242832] hover:bg-[#2c313d] border border-slate-700/50 transition-all flex items-center justify-center gap-2.5 text-sm font-normal text-slate-200 cursor-pointer active:scale-[0.99] disabled:opacity-60"
                >
                  {isSendingOtp && selectedChannel === "whatsapp" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                      <WhatsAppIcon className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                  <span>Login with Whatsapp</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════
              STEP 2: 6-Digit OTP Verification Screen (Exact Images 2 & 3 Design)
             ═══════════════════════════════════════════════════════════════════════════ */}
          {step === "otp" && (
            <div className="space-y-4.5 sm:space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Phone + Shield Illustration (Images 2 & 3) */}
              <div className="pt-1">
                <OtpPhoneShieldIllustration />
              </div>

              {/* Title: "Enter Your OTP" (Images 2 & 3) */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Enter Your <span className="text-[#EC4899]">OTP</span>
                </h2>
                <div className="text-xs text-slate-400 space-y-0.5">
                  <p className="text-slate-300 font-normal">
                    We&apos;ve sent a 6-digit code to
                  </p>
                  <p className="text-white font-semibold tracking-wide text-xs">
                    {formattedDisplayPhone || "+91 1234567890"}
                  </p>
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs block mx-auto underline decoration-slate-600 underline-offset-2"
                  >
                    Change mobile number
                  </button>
                </div>
              </div>

              {/* Six-digit OTP Box Grid (Images 2 & 3) */}
              <div className="py-1 space-y-2">
                <OtpInput
                  value={otp}
                  length={6}
                  onChange={(val) => {
                    setOtp(val);
                    if (otpError) setOtpError("");
                  }}
                  onComplete={(val) => {
                    handleVerifyOtp(val);
                  }}
                  disabled={isVerifyingOtp}
                  hasError={!!otpError}
                  boxClassName="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold rounded-xl bg-[#10131c] text-white border border-slate-600/70 hover:border-slate-500 focus:border-[#8241fd] focus:ring-1 focus:ring-[#8241fd]/30"
                  autoFocus
                />

                {otpError && (
                  <div className="p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center animate-in fade-in">
                    {otpError}
                  </div>
                )}
              </div>

              {/* Verify OTP Button (Vibrant Purple-to-Pink-to-Coral Gradient from Images 2 & 3) */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={otp.length !== 6 || isVerifyingOtp}
                className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:opacity-95 active:scale-[0.99] text-white font-medium text-sm tracking-wide transition-all shadow-md shadow-[#d334d7]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <span>Verify &rarr;</span>
                )}
              </button>

              {/* Resend Actions & Channel Toggle */}
              <div className="pt-0.5 text-center space-y-1.5 text-xs text-slate-400">
                <div>
                  Didn&apos;t receive code?{" "}
                  {countdown > 0 ? (
                    <span className="font-semibold text-slate-300">
                      Resend in <span className="text-purple-400">{countdown}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleResend()}
                      disabled={isSendingOtp}
                      className="font-bold text-purple-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Code"
                      )}
                    </button>
                  )}
                </div>

                {/* Switch between SMS and WhatsApp */}
                <div className="flex items-center justify-center gap-2 text-[11px]">
                  <span className="text-slate-500">Try other method:</span>
                  {selectedChannel === "whatsapp" ? (
                    <button
                      type="button"
                      onClick={() => handleResend("sms")}
                      disabled={isSendingOtp}
                      className="text-purple-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Send via SMS
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleResend("whatsapp")}
                      disabled={isSendingOtp}
                      className="text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                      Send via WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </main>

      {/* Auth Center Modal for OAuth Handshakes */}
      {authModal && (
        <AuthCenterModal
          open={authModal.open}
          status={authModal.status}
          provider={authModal.provider}
          title={authModal.title}
          message={authModal.message}
          actionText={authModal.actionText}
          actionHref={authModal.actionHref}
          onClose={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}
