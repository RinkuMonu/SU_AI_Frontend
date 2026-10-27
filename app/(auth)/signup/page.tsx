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
      console.error("Failed to send OTP:", err);
      const errMsg = err.message || "";
      if (errMsg.toLowerCase().includes("already registered") || errMsg.toLowerCase().includes("already exist")) {
        setExistingUserPrompt(e164);
        setError("An account with this phone number already exists. Please log in instead.");
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
      console.error("OTP verification failed:", err);
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
      const redirectUri = `${origin}/login/user`;
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
      console.error("Google connect error:", err);
      setError(err.message || "Failed to initialize Google registration.");
      setSocialLoading(null);
      setAuthModal(null);
    }
  };

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

          {/* Scaleo-style Multi-Language Selector */}
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
            src="/images/ai-marketing-workspace.png"
            alt="DhandaGrow AI Studio"
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t("banner_badge_new", "New Account • DhandaGrow AI")}
            </span>
          </div>

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
                {existingUserPrompt && (
                  <Link
                    href={`/login/user?phone=${encodeURIComponent(existingUserPrompt)}`}
                    className="shrink-0 font-bold text-xs text-brand-purple hover:underline"
                  >
                    Log In &rarr;
                  </Link>
                )}
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
                <div className="text-center space-y-1">
                  <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    {t("signup_welcome_title", "Welcome to DhandaGrow")}
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t("signup_welcome_desc", "Create your account to start growing your business")}
                  </p>
                </div>

                {/* Phone Field Group */}
                <div className="space-y-2">
                  <label
                    htmlFor="scaleo-signup-phone"
                    className="block text-[11px] font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase"
                  >
                    {t("phone_label", "ENTER YOUR PHONE NUMBER")}
                  </label>

                  <div className="flex gap-2">
                    {/* Country Code Pill */}
                    <div className="w-28 sm:w-32 shrink-0">
                      <select
                        id="scaleo-signup-country-code"
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
                        id="scaleo-signup-phone"
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
                  {/* Google Button: ONLY Google "G" Logo */}
                  <button
                    type="button"
                    onClick={() => handleGoogleSignup()}
                    disabled={socialLoading !== null}
                    aria-label="Sign up with Google"
                    title="Sign up with Google"
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

                {/* Already have an account? Link */}
                <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                  {t("already_account", "Already have an account?")}{" "}
                  <Link href="/login/user" className="font-bold text-brand-purple hover:underline">
                    {t("login_link", "Log in")}
                  </Link>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════════
                STEP 2: Scaleo Clean 6-Digit OTP Screen (Screenshot 2)
               ═══════════════════════════════════════════════════════════════════════════ */}
            {step === "otp" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
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

                {/* Six-digit OTP Box Grid */}
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
                    <div className="p-2.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-center animate-in fade-in space-y-1.5">
                      <p>{otpError}</p>
                      {(otpError.toLowerCase().includes("already exist") || existingUserPrompt) && (
                        <div className="pt-1">
                          <Link
                            href={`/login/user?phone=${encodeURIComponent(phone)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/30 text-xs font-semibold hover:bg-pink-500/30 transition-all"
                          >
                            <span>{t("go_to_login", "Go to Login")}</span>
                            &rarr;
                          </Link>
                        </div>
                      )}
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

            {/* ═══════════════════════════════════════════════════════════════════════════
                STEP 3: Google Identity Link Handshake State
               ═══════════════════════════════════════════════════════════════════════════ */}
            {step === "google_handshake" && (
              <div className="space-y-6 text-center animate-in fade-in duration-300 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {t("phone_verified_title", "Phone Verified!")}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                    {t("phone_verified_desc", "Complete your registration with Google to secure your account.")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleSignup()}
                  disabled={socialLoading !== null}
                  className="w-full h-12 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1c1d24] hover:bg-neutral-50 dark:hover:bg-[#242630] font-semibold text-sm text-neutral-900 dark:text-white flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  {socialLoading === "Google" ? (
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                  ) : (
                    <GoogleIcon className="w-5 h-5" />
                  )}
                  <span>{t("continue_google_signup", "Continue with Google")}</span>
                </button>
              </div>
            )}

            {/* Scaleo Footer Links */}
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
