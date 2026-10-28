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
  Sparkles
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
  const [step, setStep] = useState<"phone" | "otp">("phone");

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

        navigateAfterAuth(finalUser, router);
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
      const redirectUri = `${origin}/login/user`;
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
          const redirectUri = `${window.location.origin}/login/user`;
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

  const formattedDisplayPhone = `${countryCode}-${phone || "7857889083"}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0d0e12] text-neutral-900 dark:text-[#f1f1f5] flex flex-col justify-between selection:bg-brand-purple/20 transition-colors duration-200">
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          TOP NAVBAR: DhandaGrow Brand Logo + Language Selector + Theme Toggle
         ───────────────────────────────────────────────────────────────────────────── */}
      <header className="w-full px-6 py-4 md:px-12 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/images/dhandagrow.png"
            alt="DhandaGrow AI"
            className="h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            className="w-9 h-9 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#15161b] text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* Scaleo-style Language Dropdown */}
          <LanguageSelector align="right" />
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MAIN SECTION: Scaleo Desktop Split View & Mobile Centered Card
         ───────────────────────────────────────────────────────────────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Scaleo Promotional Left Banner (Desktop only - Screenshots 2 & 3) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 flex-col justify-between rounded-3xl overflow-hidden relative min-h-[580px] shadow-2xl border border-neutral-200 dark:border-white/10 p-8 select-none bg-neutral-900">
          <img
            src="/images/ai-reel-maker-hero.jpg"
            alt="DhandaGrow AI Studio"
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Top pill badge */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t("banner_badge", "Get the app • DhandaGrow AI")}
            </span>
          </div>

          {/* Hero text from Scaleo screenshot */}
          <div className="relative z-10 space-y-3 max-w-md">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t("banner_title", "Turn viewers into buyers")}
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t("banner_desc", "Put your business in front of thousands. Create viral reels, studio photoshoots, and ads that get noticed across every feed, and turn them into paying customers.")}
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            RIGHT COLUMN: The Scaleo-style Centered Auth Card
           ───────────────────────────────────────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-6 xl:col-span-6 flex flex-col justify-center items-center w-full">
          <div className="w-full max-w-[440px] bg-white dark:bg-[#15161b] rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-xl shadow-neutral-200/40 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-8 space-y-6 transition-all relative">
            
            {/* Global Error Banner */}
            {error && (
              <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start justify-between gap-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-relaxed">{error}</span>
                </div>
                {error.includes("No account found") || error.includes("sign up") ? (
                  <Link
                    href="/signup"
                    className="shrink-0 font-bold text-xs text-brand-purple hover:underline"
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
                    className="shrink-0 font-bold text-xs text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Try {selectedChannel === "sms" ? "WhatsApp" : "SMS"} &rarr;
                  </button>
                ) : null}
              </div>
            )}

            {/* Global Success Banner */}
            {successMsg && !error && (
              <div className="p-3 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════════
                STEP 1: Scaleo Phone Input Screen (Screenshot 1)
               ═══════════════════════════════════════════════════════════════════════════ */}
            {step === "phone" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Heading */}
                <div className="text-center space-y-1">
                  <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    {t("welcome_title", "Welcome to DhandaGrow")}
                  </h1>
                </div>

                {/* Phone Field Group */}
                <div className="space-y-2">
                  <label
                    htmlFor="scaleo-phone"
                    className="block text-[11px] font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase"
                  >
                    {t("phone_label", "ENTER YOUR PHONE NUMBER")}
                  </label>

                  <div className="flex gap-2">
                    {/* Country Code Pill */}
                    <div className="w-28 sm:w-32 shrink-0">
                      <select
                        id="scaleo-country-code"
                        aria-label="Country Code"
                        value={countryCode}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          setCountryCode(newCode);
                          setPhone(sanitizeNationalNumber(newCode, phone));
                          if (phoneError) setPhoneError("");
                        }}
                        className="flex h-12 w-full rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#0f1014] px-3 py-2 text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer shadow-xs"
                      >
                        {COUNTRY_CODES.map((c, idx) => (
                          <option key={`${c.code}-${c.country}-${idx}`} value={c.code} className="bg-white dark:bg-[#15161b] text-neutral-900 dark:text-white">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mobile Number Input */}
                    <div className="flex-1">
                      <input
                        id="scaleo-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder={t("phone_placeholder", "7857889083")}
                        value={phone}
                        onChange={(e) => {
                          const sanitized = sanitizeNationalNumber(countryCode, e.target.value);
                          setPhone(sanitized);
                          if (phoneError) setPhoneError("");
                          if (error) setError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendOtp("sms");
                          }
                        }}
                        className={`w-full h-12 px-4 rounded-xl bg-white dark:bg-[#0f1014] text-neutral-900 dark:text-white placeholder:text-neutral-400 text-base font-medium border ${
                          phoneError ? "border-red-500" : "border-neutral-300 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/20"
                        } focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs`}
                      />
                    </div>
                  </div>

                  {phoneError && (
                    <p className="text-xs text-red-500 pl-1">{phoneError}</p>
                  )}
                </div>

                {/* Scaleo Soft Mint Green "Send OTP" Button */}
                <button
                  type="button"
                  onClick={() => handleSendOtp("sms")}
                  disabled={isSendingOtp}
                  className="w-full h-12 rounded-xl bg-[#6ee7b7] hover:bg-[#34d399] active:bg-[#10b981] text-emerald-950 font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-950" />
                      <span>{t("sending_otp", "Sending OTP...")}</span>
                    </>
                  ) : (
                    <span>{t("send_otp", "Send OTP")}</span>
                  )}
                </button>

                {/* Scaleo OR Divider */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-neutral-200 dark:border-white/10" />
                  <span className="absolute bg-white dark:bg-[#15161b] px-3 text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                    {t("or_divider", "OR")}
                  </span>
                </div>

                {/* Alternative Authentication: Google (G Logo Only) + WhatsApp (Logo Only) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Google Button: ONLY Google "G" Logo - Clean & Clutter-Free */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={socialLoading !== null}
                    aria-label={t("google_login_title", "Sign in with Google")}
                    title={t("google_login_title", "Sign in with Google")}
                    className="h-12 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1c1d24] hover:bg-neutral-50 dark:hover:bg-[#242630] hover:border-neutral-300 dark:hover:border-white/25 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.98] group"
                  >
                    {socialLoading === "Google" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                    ) : (
                      <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* WhatsApp Button: ONLY WhatsApp Logo - Clean & Clutter-Free */}
                  <button
                    type="button"
                    onClick={handleContinueWithWhatsApp}
                    disabled={isSendingOtp}
                    aria-label={t("whatsapp_login_title", "Continue with WhatsApp")}
                    title={t("whatsapp_login_title", "Continue with WhatsApp")}
                    className="h-12 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1c1d24] hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.98] group"
                  >
                    {isSendingOtp && selectedChannel === "whatsapp" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    ) : (
                      <WhatsAppIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    )}
                  </button>
                </div>

                {/* Need an account? Link */}
                <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                  {t("no_account", "Don't have an account?")}{" "}
                  <Link href="/signup" className="font-bold text-brand-purple hover:underline">
                    {t("signup_link", "Sign up")}
                  </Link>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════════
                STEP 2: Scaleo Clean 6-Digit OTP Screen (Screenshot 2)
               ═══════════════════════════════════════════════════════════════════════════ */}
            {step === "otp" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Header: "Enter your OTP" with Scaleo "X" close button */}
                <div className="relative text-center pt-1">
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    aria-label="Close and return to phone screen"
                    className="absolute right-0 top-0 w-8 h-8 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    {t("enter_otp_title", "Enter your OTP")}
                  </h2>

                  <div className="mt-2 space-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <p>
                      {t("otp_sent_to", "OTP sent to")}{" "}
                      <strong className="text-neutral-800 dark:text-neutral-200">
                        {formattedDisplayPhone}
                      </strong>
                    </p>
                    <button
                      type="button"
                      onClick={handleChangeNumber}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer block mx-auto"
                    >
                      {t("change_mobile_number", "change mobile number")}
                    </button>
                  </div>
                </div>

                {/* Six-digit OTP Box Grid (Auto-verifies immediately on 6th digit) */}
                <div className="py-2 space-y-2">
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
                    autoFocus
                  />

                  {otpError && (
                    <div className="p-2.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-center animate-in fade-in">
                      {otpError}
                    </div>
                  )}
                </div>

                {/* Scaleo Alert Banner (Screenshot 2) */}
                {showRightNumberAlert && (
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 leading-snug">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        {t("right_number_alert_part1", "Sent the OTP to")} <strong>{formattedDisplayPhone}</strong>{t("right_number_alert_part2", ". Is that the right number?")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowRightNumberAlert(false)}
                        className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
                      >
                        {t("keep_waiting", "Keep waiting")}
                      </button>

                      <button
                        type="button"
                        onClick={handleChangeNumber}
                        className="px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        {t("change_number", "Change number")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Scaleo "Verify OTP" Button */}
                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={otp.length !== 6 || isVerifyingOtp}
                  className="w-full h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 disabled:cursor-not-allowed enabled:bg-emerald-500 enabled:hover:bg-emerald-600 enabled:text-white enabled:cursor-pointer"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{t("verifying_otp", "Verifying OTP...")}</span>
                    </>
                  ) : (
                    <span>{t("verify_otp", "Verify OTP")}</span>
                  )}
                </button>

                {/* Resend Actions & Channel Toggle */}
                <div className="pt-1 text-center space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <div>
                    {t("didnt_receive_otp", "Didn't receive the OTP?")}{" "}
                    {countdown > 0 ? (
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {t("resend_in", "Resend in")} <span className="text-emerald-600 dark:text-emerald-400">{countdown}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResend()}
                        disabled={isSendingOtp}
                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        {isSendingOtp ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            {t("sending", "Sending...")}
                          </>
                        ) : (
                          t("resend_code", "Resend Code")
                        )}
                      </button>
                    )}
                  </div>

                  {/* Switch between SMS and WhatsApp */}
                  <div className="pt-1 flex items-center justify-center gap-3 text-[11px]">
                    <span className="text-neutral-400">{t("try_other_method", "Try other method:")}</span>
                    {selectedChannel === "whatsapp" ? (
                      <button
                        type="button"
                        onClick={() => handleResend("sms")}
                        disabled={isSendingOtp}
                        className="text-brand-purple font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {t("send_via_sms", "Send via SMS")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResend("whatsapp")}
                        disabled={isSendingOtp}
                        className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3 h-3 text-emerald-500" />
                        {t("send_via_whatsapp", "Send via WhatsApp")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Scaleo Footer Links (Terms · Privacy · Need help? · v1.9.7) */}
            <div className="pt-2 border-t border-neutral-100 dark:border-white/5 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("terms", "Terms")}
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("privacy", "Privacy")}
                </Link>
                <span>•</span>
                <Link href="/support" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("need_help", "Need help?")}
                </Link>
              </div>
            </div>

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
