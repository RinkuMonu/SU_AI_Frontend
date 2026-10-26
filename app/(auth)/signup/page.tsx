"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuth } from "@/components/auth/AuthProvider";
import { authService, OtpDeliveryChannel } from "@/services/auth.service";
import { 
  COUNTRY_CODES, 
  validatePhoneNumber, 
  sanitizeNationalNumber,
  maskPhoneNumber
} from "@/lib/phone";
import { AuthCenterModal, AuthModalStatus } from "@/components/auth/AuthCenterModal";

// WhatsApp Brand Icon
const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Registration Mode: Primary (Phone Verification -> Google Handshake) vs Email/Password
  const [signupMode, setSignupMode] = useState<"phone_google" | "password">("phone_google");

  // Step in Phone Flow: 'phone' -> 'otp' -> 'google_handshake'
  const [signupStep, setSignupStep] = useState<"phone" | "otp" | "google_handshake">("phone");

  // Phone states
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // OTP Verification states
  const [otpChannel, setOtpChannel] = useState<OtpDeliveryChannel>("whatsapp");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [successMsg, setSuccessMsg] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Email/Password states (alternative fallback method)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Status & modal states
  const [error, setError] = useState("");
  const [existingUserPrompt, setExistingUserPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    status: AuthModalStatus;
    title?: string;
    message?: string;
    actionText?: string;
    actionHref?: string;
  } | null>(null);

  // Pre-fill phone if passed from login redirect or preserved in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPhone = sessionStorage.getItem("google_auth_phone");
      const storedCc = sessionStorage.getItem("google_auth_country_code");
      const isVerified = sessionStorage.getItem("phone_verified") === "true";

      if (storedCc) setCountryCode(storedCc);
      if (storedPhone) {
        const national = sanitizeNationalNumber(storedCc || "+91", storedPhone);
        setPhone(national);
        if (isVerified) {
          setPhoneVerified(true);
          setSignupStep("google_handshake");
        }
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPhone = urlParams.get("phone");
        if (urlPhone) {
          const national = sanitizeNationalNumber(countryCode, urlPhone);
          setPhone(national);
        }
      }
    }
  }, [countryCode]);

  // 60-second cooldown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (signupStep === "otp" && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [signupStep, countdown]);

  /**
   * Launch Google Authentication for Signup
   */
  const handleGoogleSignup = (customPhone?: string, customCountryCode?: string, customVerificationToken?: string) => {
    setError("");
    setSocialLoading("Google");
    setAuthModal({
      open: true,
      status: "analyzing",
      title: "Connecting with Google",
      message: "Preparing secure Google OAuth handshake...",
    });

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const redirectUri = `${origin}/login/user`;
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error("Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.");
      }
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
        message: "Navigating to Google sign-in portal. Please wait...",
      });

      setTimeout(() => {
        window.location.href = authUrl;
      }, 350);
    } catch (err: any) {
      console.error("Google connect error:", err);
      const errMsg = "Failed to initialize Google Registration: " + (err.response?.data?.detail || err.message);
      setError(errMsg);
      setAuthModal({
        open: true,
        status: "error",
        title: "Google Connection Failed",
        message: errMsg,
      });
      setSocialLoading(null);
    }
  };

  /**
   * Step 1: Send OTP via either WhatsApp (MSG91) or SMS (Fast2SMS)
   */
  const handleSendOtp = async (channel: OtpDeliveryChannel) => {
    setPhoneError("");
    setError("");
    setOtpError("");
    setExistingUserPrompt(null);

    const validation = validatePhoneNumber(countryCode, phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid mobile number");
      return;
    }

    if (isSendingOtp) return; // Prevent duplicate requests
    setIsSendingOtp(true);
    setOtpChannel(channel);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_auth_phone", validation.e164);
        sessionStorage.setItem("google_auth_country_code", countryCode);
        sessionStorage.setItem("google_auth_mode", "signup");
        sessionStorage.setItem("google_auth_otp_channel", channel);
      }

      const res = await authService.sendOtp({
        phone: validation.e164,
        countryCode,
        channel,
      });

      setSignupStep("otp");
      setCountdown(60);
      setOtp("");
      const channelLabel = channel === "whatsapp" ? "WhatsApp (MSG91)" : "Mobile SMS (Fast2SMS)";
      setSuccessMsg(`6-digit verification code sent via ${channelLabel}.`);
    } catch (err: any) {
      console.error("Failed to send OTP:", err);
      const errMsg = err.message || "";
      if (errMsg.toLowerCase().includes("already registered") || errMsg.toLowerCase().includes("already exists")) {
        setExistingUserPrompt(validation.e164);
        setError("An account with this phone number already exists. Please log in instead.");
      } else {
        setError(errMsg || "Failed to send verification code. Please check your number and retry.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  /**
   * Step 2: Verify 6-digit WhatsApp or SMS OTP
   */
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const finalOtp = (codeToVerify || otp).trim();

    if (finalOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (isVerifyingOtp) return; // Prevent duplicate submission
    setIsVerifyingOtp(true);
    setOtpError("");
    setError("");

    const validation = validatePhoneNumber(countryCode, phone);
    const targetPhone = validation.isValid ? validation.e164 : (countryCode + phone);

    try {
      const response = await authService.verifyOtp(
        { phone: targetPhone, countryCode, channel: otpChannel, mode: "signup" },
        finalOtp
      );

      const vToken = response.phone_verification_token || response.verification_token || response.token;

      setPhoneVerified(true);
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
      setSignupStep("google_handshake");
      setTimeout(() => {
        handleGoogleSignup(targetPhone, countryCode, vToken);
      }, 500);
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
        setOtpError(errMsg || "Invalid or expired verification code. Please check and try again.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Switch OTP Channel and resend code
   */
  const handleSwitchChannelAndResend = async (newChannel: OtpDeliveryChannel) => {
    setOtp("");
    setOtpError("");
    await handleSendOtp(newChannel);
  };

  /**
   * Alternative Email/Password Registration
   */
  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setError("");

    let hasErr = false;
    if (!name.trim()) {
      setNameError("Full name is required");
      hasErr = true;
    }
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Valid email address is required");
      hasErr = true;
    }
    const phoneValidation = validatePhoneNumber(countryCode, phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || "Valid mobile number is required");
      hasErr = true;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasErr = true;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      hasErr = true;
    }

    if (hasErr) return;

    setIsLoading(true);
    try {
      const res = await authService.signup({
        name: name.trim(),
        email: email.trim(),
        phone: phoneValidation.e164,
        countryCode: countryCode,
        password: password,
        confirmPassword: confirmPassword,
      });

      if (res.token && res.user) {
        login(res.token, res.user);
        router.push("/select-role");
      } else {
        router.push(`/login/user?registered=true&phone=${encodeURIComponent(phoneValidation.e164)}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  const maskedPhone = maskPhoneNumber(phone ? `${countryCode} ${phone}` : "");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-brand-purple/30 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Logo withText={false} className="scale-125 mb-2" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-text-muted">
            Start growing your business with AI Marketing
          </p>
        </div>

        <Card className="bg-[#15161b]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-xl rounded-2xl">
          <CardContent className="pt-6 space-y-4">
            
            {/* Global Error Banner */}
            {error && (
              <div className="p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
                {existingUserPrompt && (
                  <Link
                    href={`/login/user?phone=${encodeURIComponent(existingUserPrompt)}`}
                    className="shrink-0 font-bold text-xs text-pink-400 underline hover:text-white"
                  >
                    Log In &rarr;
                  </Link>
                )}
              </div>
            )}

            {/* Global Success Banner */}
            {successMsg && !error && (
              <div className="p-3 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {signupMode === "phone_google" ? (
              <>
                {/* ─────────────────────────────────────────────────────────────
                    STEP 1: Phone Entry & Channel Choice (WhatsApp vs SMS)
                   ───────────────────────────────────────────────────────────── */}
                {signupStep === "phone" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-phone" className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                        <span>Mobile Phone Number <span className="text-brand-pink">*</span></span>
                        <span className="text-[11px] text-text-muted">Step 1 of 2: Phone Verification</span>
                      </Label>
                      <div className="flex gap-2">
                        <div className="w-32 sm:w-36 shrink-0">
                          <select
                            id="signup-countryCode"
                            aria-label="Country Code"
                            value={countryCode}
                            onChange={(e) => {
                              const newCode = e.target.value;
                              setCountryCode(newCode);
                              setPhone(sanitizeNationalNumber(newCode, phone));
                              if (phoneError) setPhoneError("");
                            }}
                            className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1014] px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/20 transition-all cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c, idx) => (
                              <option key={`${c.code}-${c.country}-${idx}`} value={c.code} className="bg-[#15161b] text-white">
                                {c.flag} {c.code} ({c.country})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <Input
                            id="signup-phone"
                            type="tel"
                            inputMode="tel"
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => {
                              setPhone(sanitizeNationalNumber(countryCode, e.target.value));
                              if (phoneError) setPhoneError("");
                              if (error) setError("");
                            }}
                            className={`h-11 rounded-xl bg-[#0f1014] text-white placeholder:text-neutral-500 text-sm border ${
                              phoneError ? "border-red-500" : "border-white/10 hover:border-white/20"
                            } focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/20 transition-all`}
                          />
                        </div>
                      </div>
                      {phoneError && (
                        <p className="text-xs text-red-400 pl-1">{phoneError}</p>
                      )}
                    </div>

                    {/* Verification Method Choice */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 pl-1">
                        Select Verification Method:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Option A: WhatsApp OTP via MSG91 */}
                        <button
                          type="button"
                          onClick={() => handleSendOtp("whatsapp")}
                          disabled={isSendingOtp}
                          className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/50 text-left transition-all group flex flex-col justify-between gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Fast &amp; Free
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1">
                              WhatsApp OTP
                            </div>
                            <div className="text-[10px] text-gray-400">
                              6-digit code via MSG91
                            </div>
                          </div>
                        </button>

                        {/* Option B: Mobile SMS OTP via Fast2SMS */}
                        <button
                          type="button"
                          onClick={() => handleSendOtp("sms")}
                          disabled={isSendingOtp}
                          className="p-3 rounded-xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/40 hover:border-purple-500/50 text-left transition-all group flex flex-col justify-between gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MessageSquare className="w-4 h-4 text-purple-300" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Direct SMS
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1">
                              Mobile SMS OTP
                            </div>
                            <div className="text-[10px] text-gray-400">
                              6-digit code via Fast2SMS
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Primary Send Button */}
                      <Button
                        type="button"
                        onClick={() => handleSendOtp(otpChannel)}
                        disabled={isSendingOtp || !phone.trim()}
                        className="w-full h-11 mt-1 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.25)]"
                      >
                        {isSendingOtp ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                            Sending 6-Digit Code...
                          </>
                        ) : (
                          <>
                            <span>Send Verification Code</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Footer Links */}
                    <div className="pt-2 text-center space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSignupMode("password");
                          setError("");
                        }}
                        className="text-xs text-neutral-400 hover:text-[#be32ff] transition-colors py-1 cursor-pointer block w-full"
                      >
                        Prefer password? <span className="underline font-medium text-white hover:text-[#be32ff]">Register with Email &amp; Password</span> &rarr;
                      </button>

                      <div className="text-xs text-text-muted">
                        Already have an account?{" "}
                        <Link href="/login/user" className="text-pink-400 font-semibold hover:underline">
                          Log in
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 2: In-Flow 6-Digit OTP Verification (WhatsApp / SMS)
                   ───────────────────────────────────────────────────────────── */}
                {signupStep === "otp" && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-1 bg-surface border-white/10 text-white">
                        {otpChannel === "whatsapp" ? (
                          <>
                            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp OTP (MSG91)</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 text-purple-300" />
                            <span>SMS OTP (Fast2SMS)</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-white">Verify Phone Number</h2>
                      <p className="text-xs text-text-muted">
                        Enter the 6-digit verification code sent to{" "}
                        <strong className="text-white">{maskedPhone}</strong>
                      </p>
                    </div>

                    {/* 6-Digit Box Grid */}
                    <div className="space-y-2 py-1">
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
                        <div className="space-y-2 pt-1 text-center">
                          <p className="text-xs text-red-400">{otpError}</p>
                          {(otpError.toLowerCase().includes("already exist") || otpError.toLowerCase().includes("please log in") || existingUserPrompt) && (
                            <div className="flex justify-center pt-1">
                              <Link
                                href={`/login/user?phone=${encodeURIComponent(phone)}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold hover:bg-pink-500/30 transition-all cursor-pointer"
                              >
                                <span>Go to Login</span>
                                &rarr;
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Verify Button */}
                    <Button
                      type="button"
                      onClick={() => handleVerifyOtp()}
                      disabled={otp.length !== 6 || isVerifyingOtp}
                      className="w-full h-11 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                          Verifying Code...
                        </>
                      ) : (
                        <>
                          <span>Verify &amp; Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {/* Resend & Channel Switcher Options */}
                    <div className="space-y-3 pt-2 text-center text-xs">
                      {/* Resend Countdown */}
                      <div className="text-text-muted">
                        Didn&apos;t receive the code?{" "}
                        {countdown > 0 ? (
                          <span className="text-white font-medium">
                            Resend in <span className="text-brand-purple font-bold">{countdown}s</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendOtp(otpChannel)}
                            disabled={isSendingOtp}
                            className="text-pink-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
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

                      {/* Channel Switch link */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Try other method:</span>
                        {otpChannel === "whatsapp" ? (
                          <button
                            type="button"
                            onClick={() => handleSwitchChannelAndResend("sms")}
                            disabled={isSendingOtp}
                            className="text-purple-300 font-semibold hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Send via SMS (Fast2SMS)
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSwitchChannelAndResend("whatsapp")}
                            disabled={isSendingOtp}
                            className="text-emerald-400 font-semibold hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                            Send via WhatsApp (MSG91)
                          </button>
                        )}
                      </div>

                      {/* Change Number */}
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setSignupStep("phone");
                            setOtp("");
                            setOtpError("");
                          }}
                          className="text-neutral-400 hover:text-white transition-colors underline cursor-pointer"
                        >
                          &larr; Change mobile number
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 3: Google Identity Link Handshake
                   ───────────────────────────────────────────────────────────── */}
                {signupStep === "google_handshake" && (
                  <div className="space-y-5 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Phone Verified: {phone}
                      </div>
                      <h2 className="text-2xl font-bold text-white">Complete with Google</h2>
                      <p className="text-xs text-text-muted max-w-xs mx-auto">
                        Step 2 of 2: Continue with Google to verify your email identity and activate your account.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGoogleSignup()}
                      disabled={socialLoading !== null}
                      className="w-full h-12 px-4 rounded-xl border border-white/10 bg-[#1c1d24] hover:bg-[#23252e] hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] text-white text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
                    >
                      {socialLoading === "Google" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                          <span>Connecting with Google...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
                          <span>Continue with Google</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSignupStep("phone");
                          setPhoneVerified(false);
                        }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors underline cursor-pointer"
                      >
                        &larr; Start over with a different number
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ─────────────────────────────────────────────────────────────
                  ALTERNATIVE: Email & Password Registration
                 ───────────────────────────────────────────────────────────── */
              <form onSubmit={handlePasswordSignup} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-neutral-300">
                    Full Name <span className="text-brand-pink">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    className={`h-10 rounded-xl bg-[#0f1014] text-white border ${
                      nameError ? "border-red-500" : "border-white/10"
                    }`}
                  />
                  {nameError && <p className="text-xs text-red-400">{nameError}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-neutral-300">
                    Email Address <span className="text-brand-pink">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`h-10 rounded-xl bg-[#0f1014] text-white border ${
                      emailError ? "border-red-500" : "border-white/10"
                    }`}
                  />
                  {emailError && <p className="text-xs text-red-400">{emailError}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone-pwd" className="text-xs font-medium text-neutral-300">
                    Mobile Phone Number <span className="text-brand-pink">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-28 shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          setCountryCode(newCode);
                          setPhone(sanitizeNationalNumber(newCode, phone));
                        }}
                        className="flex h-10 w-full rounded-xl border border-white/10 bg-[#0f1014] px-2 py-1.5 text-xs text-white"
                      >
                        {COUNTRY_CODES.map((c, idx) => (
                          <option key={`${c.code}-${idx}`} value={c.code} className="bg-[#15161b]">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <Input
                        id="phone-pwd"
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(sanitizeNationalNumber(countryCode, e.target.value));
                          if (phoneError) setPhoneError("");
                        }}
                        className={`h-10 rounded-xl bg-[#0f1014] text-white border ${
                          phoneError ? "border-red-500" : "border-white/10"
                        }`}
                      />
                    </div>
                  </div>
                  {phoneError && <p className="text-xs text-red-400">{phoneError}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-neutral-300">
                    Password <span className="text-brand-pink">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className={`h-10 rounded-xl bg-[#0f1014] text-white pr-10 border ${
                        passwordError ? "border-red-500" : "border-white/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-xs font-medium text-neutral-300">
                    Confirm Password <span className="text-brand-pink">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className="h-10 rounded-xl bg-[#0f1014] text-white pr-10 border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                      Creating Account...
                    </>
                  ) : (
                    "Register Account"
                  )}
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupMode("phone_google");
                      setError("");
                    }}
                    className="text-xs text-neutral-400 hover:text-[#be32ff] transition-colors underline cursor-pointer"
                  >
                    &larr; Switch back to Mobile + Google Sign Up
                  </button>
                </div>
              </form>
            )}

          </CardContent>
        </Card>

        <div className="text-center text-xs text-neutral-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-neutral-400 hover:text-white underline">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-neutral-400 hover:text-white underline">Privacy Policy</Link>.
        </div>
      </div>

      {/* Auth Center Feedback & Status Modal */}
      {authModal && (
        <AuthCenterModal
          open={authModal.open}
          onClose={() => setAuthModal(null)}
          status={authModal.status}
          provider="Google"
          title={authModal.title}
          message={authModal.message}
          actionText={authModal.actionText}
          actionHref={authModal.actionHref}
        />
      )}
    </div>
  );
}
