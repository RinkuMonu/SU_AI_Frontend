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
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthCenterModal, AuthModalStatus } from "@/components/auth/AuthCenterModal";
import { OtpInput } from "@/components/ui/OtpInput";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

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


export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Screen flow: "phone" -> "otp" -> "google_handshake"
  const [step, setStep] = useState<"phone" | "otp" | "google_handshake">("phone");

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
  const [existingUserPrompt, setExistingUserPrompt] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Language Translation Hook
  const { t } = useLanguage();

  // Modal for OAuth / handshakes
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    status: AuthModalStatus;
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

  // Read URL query parameters on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const phoneParam = searchParams.get("phone");

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
    setExistingUserPrompt(null);

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
        sessionStorage.setItem("google_auth_mode", "signup");
        sessionStorage.setItem("google_auth_otp_channel", channel);
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
      if (errMsg.toLowerCase().includes("already registered") || errMsg.toLowerCase().includes("already exist")) {
        setExistingUserPrompt(e164);
        setError("An account with this phone number already exists. Please log in instead.");
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
        { phone: targetPhone, countryCode, channel: selectedChannel, mode: "signup" },
        finalOtp
      );

      const vToken = response.phone_verification_token || response.verification_token || response.token;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("phone_verified", "true");
        sessionStorage.setItem("google_auth_phone", targetPhone);
        sessionStorage.setItem("google_auth_country_code", countryCode);
        sessionStorage.setItem("google_auth_mode", "signup");
        if (vToken) {
          sessionStorage.setItem("google_auth_verification_token", vToken);
          sessionStorage.setItem("phone_verification_token", vToken);
        }
      }

      setSuccessMsg("Phone verified successfully! Continuing to Google authorization...");
      setStep("google_handshake");
      setTimeout(() => {
        handleGoogleSignup(targetPhone, countryCode, vToken);
      }, 400);
    } catch (err: any) {
      console.warn("OTP verification failed:", err?.message || err);
      const errMsg = err.message || "";
      if (
        errMsg.toLowerCase().includes("already registered") ||
        errMsg.toLowerCase().includes("already exist") ||
        errMsg.toLowerCase().includes("please log in")
      ) {
        setExistingUserPrompt(targetPhone);
        setOtpError("An account with this mobile number already exists. Please log in instead.");
      } else {
        setOtpError(errMsg || "Invalid or expired OTP. Please check and try again.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Resend OTP with channel switch support
   */
  const handleResend = async (targetChannel?: OtpDeliveryChannel) => {
    const channelToUse = targetChannel || selectedChannel;
    setOtp("");
    setOtpError("");
    lastAutoSentPhoneRef.current = "";
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
    lastAutoSentPhoneRef.current = "";
  };

  /**
   * Continue with WhatsApp alternative option
   */
  const handleContinueWithWhatsApp = () => {
    const validation = validatePhoneNumber(countryCode, phone);
    if (!validation.isValid) {
      setSelectedChannel("whatsapp");
      setPhoneError("Please enter your mobile number above to receive OTP on WhatsApp");
      const phoneInput = document.getElementById("scaleo-signup-phone");
      phoneInput?.focus();
      return;
    }
    handleSendOtp("whatsapp", validation.e164);
  };

  /**
   * Launch Google Authentication for Signup (Screenshot 3)
   */
  const handleGoogleSignup = (customPhone?: string, customCountryCode?: string, customVerificationToken?: string) => {
    setError("");
    setSocialLoading("Google");
    setAuthModal({
      open: true,
      status: "analyzing",
      title: "Connecting with Google",
      message: "Preparing secure Google OAuth account chooser...",
    });

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "https://api.dhandagrow.com/api/v1/auth/google/callback";
      const clientId =
        (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim() ||
        "260412504334-00s4ah5tslv9rgso3g86fcb079bb84nr.apps.googleusercontent.com";
      const scope = "openid email profile";
      const state = "signup_" + Math.random().toString(36).substring(7);

      const effectivePhone = customPhone || phone;
      const effectiveCc = customCountryCode || countryCode;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_auth_mode", "signup");
        if (effectivePhone && effectivePhone.trim()) {
          const validation = validatePhoneNumber(effectiveCc, effectivePhone);
          if (validation.isValid) {
            sessionStorage.setItem("google_auth_phone", validation.e164);
            sessionStorage.setItem("google_auth_country_code", effectiveCc);
          }
        }
        const vToken =
          customVerificationToken ||
          sessionStorage.getItem("google_auth_verification_token") ||
          sessionStorage.getItem("phone_verification_token");
        if (vToken) {
          sessionStorage.setItem("google_auth_verification_token", vToken);
          sessionStorage.setItem("phone_verification_token", vToken);
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
        title: "Redirecting to Google",
        message: "Opening Google account chooser portal...",
      });

      setTimeout(() => {
        window.location.href = authUrl;
      }, 250);
    } catch (err: any) {
      console.warn("Google connect error:", err?.message || err);
      setError(err.message || "Failed to initialize Google registration.");
      setSocialLoading(null);
      setAuthModal(null);
    }
  };

  const formattedDisplayPhone = `${countryCode} ${phone || ""}`;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#071226] text-[#f1f1f5] flex items-center justify-center relative select-none font-sans px-4 sm:px-6 pt-2 pb-2 sm:pt-3 sm:pb-3">

      {/* ─────────────────────────────────────────────────────────────────────────────
          BOTTOM WAVES: Flowing organic curves matching Image 1
         ───────────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Bottom Left Sunset Gradient Wave */}
        <svg
          className="absolute bottom-0 left-0 w-[55vw] max-w-[650px] h-[34vh] max-h-[320px]"
          viewBox="0 0 650 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveSunsetSignup" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA8366" />
              <stop offset="25%" stopColor="#F2548E" />
              <stop offset="60%" stopColor="#7E32A0" />
              <stop offset="100%" stopColor="#2A125E" />
            </linearGradient>
          </defs>
          <path
            d="M0 90 C 160 120, 320 190, 650 260 L 650 260 L 0 260 Z"
            fill="url(#waveSunsetSignup)"
          />
        </svg>

        {/* Bottom Right Deep Violet Wave Layer */}
        <svg
          className="absolute bottom-0 right-0 w-[45vw] max-w-[550px] h-[22vh] max-h-[220px]"
          viewBox="0 0 550 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveVioletRightSignup" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B124C" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#2E176E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#4A1E9E" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path
            d="M0 220 C 180 200, 340 140, 550 120 L 550 220 Z"
            fill="url(#waveVioletRightSignup)"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MAIN CONTENT: Centered Auth Card
         ───────────────────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-md h-full flex items-center justify-center px-4">

        {/* Centered Auth Card (#10131c) - Exact Figma Styling */}
        <div className="w-full max-w-[375px] xl:max-w-[390px] self-center bg-[#10131c] rounded-2xl border border-slate-700/60 shadow-2xl shadow-black/50 p-6 sm:p-7 space-y-4 sm:space-y-4.5 relative z-10 shrink-0">

          {/* Global Error Banner */}
          {error && (
            <div className="p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start justify-between gap-1.5 animate-in fade-in">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-snug">{error}</span>
              </div>
              {existingUserPrompt ? (
                <Link
                  href={`/login/user?phone=${encodeURIComponent(existingUserPrompt)}`}
                  className="shrink-0 font-bold text-xs text-purple-400 hover:underline"
                >
                  Log In &rarr;
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
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-xl font-bold tracking-tight text-[#4F75FF]">
                      Dhanda<span className="text-[#FA5D42]">Grow</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white tracking-wider">
                      AI+
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 font-normal tracking-wide mt-1">
                    India&apos;s AI Business Growth App
                  </span>
                </div>
              </div>

              {/* Phone Field Group with Exact Image 1 Box Size */}
              <div className="space-y-1.5 pt-0.5">
                <label
                  htmlFor="signup-phone-input"
                  className="block text-xs font-normal text-slate-400"
                >
                  Enter your phone number
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="signup-phone-input"
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
                    className={`w-full h-[46px] pl-10 pr-4 rounded-xl bg-[#242832] text-white placeholder:text-slate-400 text-sm font-normal border ${phoneError ? "border-red-500" : "border-slate-700/60 hover:border-slate-600"
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
                className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#F59B67] via-[#F2548E] to-[#9035FC] hover:opacity-95 active:scale-[0.99] text-white font-medium text-sm tracking-wide transition-all shadow-md shadow-[#F2548E]/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
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
                  onClick={() => handleGoogleSignup()}
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
                  <p>
                    OTP sent to <span className="text-slate-200 font-semibold">{formattedDisplayPhone}</span>
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
                  <div className="p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center animate-in fade-in space-y-1">
                    <p>{otpError}</p>
                    {(otpError.toLowerCase().includes("already exist") || existingUserPrompt) && (
                      <div className="pt-1">
                        <Link
                          href={`/login/user?phone=${encodeURIComponent(phone)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold hover:bg-pink-500/30 transition-all"
                        >
                          <span>Go to Login</span>
                          &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Verify OTP Button (Vibrant Purple-to-Pink-to-Coral Gradient from Images 2 & 3) */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={otp.length !== 6 || isVerifyingOtp}
                className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#8241fd] via-[#d334d7] to-[#f56983] hover:opacity-95 active:scale-[0.99] text-white font-medium text-sm tracking-wide transition-all shadow-md shadow-[#d334d7]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <span>Verify OTP &rarr;</span>
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
      </main>

      {/* Auth Center Modal for OAuth Handshakes */}
      {authModal && (
        <AuthCenterModal
          open={authModal.open}
          status={authModal.status}
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
