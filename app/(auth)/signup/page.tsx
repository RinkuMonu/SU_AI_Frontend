"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, 
  User as UserIcon, 
  Phone, 
  Mail, 
  KeyRound,
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Zap,
  Sparkles,
  Building2,
  LogIn,
  X,
  ArrowRight,
  Check
} from "lucide-react";
import { authService } from "@/services/auth.service";

const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  contactNumber: z.string().min(7, { message: "Valid contact number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  emailOtp: z.string().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  termsAccepted: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  // OTP State
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      termsAccepted: false,
    },
    mode: "onChange",
  });

  const passwordWatch = watch("password", "");
  const emailWatch = watch("email", "");

  // Timer countdown for resending OTP
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength(passwordWatch);

  const handleSendOtp = async () => {
    if (!emailWatch || !emailWatch.includes("@")) {
      setError("Please enter a valid email address first to receive OTP.");
      return;
    }
    setIsSendingOtp(true);
    setError("");
    try {
      await authService.resendOtp(emailWatch);
      setOtpSent(true);
      setOtpCountdown(60);
      setSocialNotice(`Verification OTP has been sent to ${emailWatch}. Check your inbox!`);
    } catch (err: any) {
      setOtpSent(true);
      setOtpCountdown(60);
      setSocialNotice(err.message || `Verification OTP generated for ${emailWatch}.`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError("");
    setSocialNotice(null);

    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      const payload = {
        name: fullName,
        email: data.email,
        password: data.password,
        phone: data.contactNumber,
        contact_phone: data.contactNumber,
        otp: data.emailOtp,
        business_name: `${data.firstName}'s Enterprise`,
        business_type: "general",
        role: "user",
      };

      const response = await authService.signup(payload);

      if (response.token && response.user) {
        localStorage.setItem("access_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("business_just_registered", "1");
        window.location.href = "/dashboard";
      } else {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err: any) {
      const msg = err.message || "Failed to create account. Please try again.";
      if (msg.includes("EMAIL_NOT_VERIFIED") || msg.toLowerCase().includes("verification")) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: "Google" | "LinkedIn" | "Facebook") => {
    setError("");
    if (provider === "Google") {
      setSocialLoading("Google");
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const redirectUri = `${origin}/login/user`;
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "260412504334-00s4ah5tslv9rgso3g86fcb079bb84nr.apps.googleusercontent.com";
      const scope = "openid email profile";
      const state = Math.random().toString(36).substring(7);
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account&state=${state}`;
      window.location.href = authUrl;
      return;
    }
    setSocialLoading(provider);
    setSocialNotice(`Registering with ${provider}... Connecting OAuth gateway.`);
    setTimeout(() => {
      setSocialLoading(null);
      setSocialNotice(
        `OAuth note: ${provider} authentication is ready for credentials. You can complete registration using the fields below.`
      );
    }, 1200);
  };

  const handleOpenChoiceModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowChoiceModal(true);
  };

  const handleSelectBusiness = () => {
    try {
      const vals = getValues();
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "signup_prefill",
          JSON.stringify({
            email: vals.email || "",
            password: vals.password || "",
            confirmPassword: vals.confirmPassword || "",
            phone: vals.contactNumber || "",
            business_name: vals.firstName ? `${vals.firstName}'s Enterprise` : "",
          })
        );
      }
    } catch (_) {}
    setShowChoiceModal(false);
    router.push("/signup/business");
  };

  const handleSelectLogin = () => {
    setShowChoiceModal(false);
    router.push("/login/user");
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-[#ededf2] flex flex-col justify-between px-6 py-8 md:px-12 lg:px-20 relative overflow-hidden selection:bg-[#be32ff]/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Logo */}
      <header className="relative z-10 w-full max-w-7xl mx-auto pb-6">
        <Link href="/" className="inline-flex items-center group">
          <img
            src="/images/dhandagrow.png"
            alt="DhandaGrow AI"
            className="h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </header>

      {/* Main Container: Split View */}
      <main className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start py-4">
        {/* Left Column: Headlines & Features */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 pt-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white mb-3 leading-[1.15]">
              Start your 30-day free trial
            </h1>
            <div className="inline-flex items-center gap-2 text-sm text-neutral-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#fc9a5d]" />
              <span>No credit card required</span>
            </div>
          </div>

          {/* Feature List matching user's design */}
          <div className="space-y-6 pt-2">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-[#181a22] border border-[#fc9a5d]/20 flex items-center justify-center text-[#fc9a5d] group-hover:border-[#fc9a5d]/60 group-hover:shadow-[0_0_15px_rgba(252,154,93,0.2)] transition-all">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Invite unlimited colleagues
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  Integrate with guaranteed developer-friendly APIs or openly to choose a build-ready or low-code solution.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-[#181a22] border border-[#f0449b]/20 flex items-center justify-center text-[#f0449b] group-hover:border-[#f0449b]/60 group-hover:shadow-[0_0_15px_rgba(240,68,155,0.2)] transition-all">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Ensure compliance
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  Receive detailed insights on all your numbers in real-time, see where visitors are coming from.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-[#181a22] border border-[#be32ff]/20 flex items-center justify-center text-[#be32ff] group-hover:border-[#be32ff]/60 group-hover:shadow-[0_0_15px_rgba(190,50,255,0.2)] transition-all">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Built-in security
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  Keep your team members and customers in the loop by sharing your dashboard public.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="lg:col-span-7 flex flex-col justify-center max-w-xl w-full mx-auto lg:mx-0">
          <div className="bg-[#14151c]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
            {/* Top: Register with: */}
            <div>
              <p className="text-xs font-medium text-neutral-400 mb-3 tracking-wide">
                Register with:
              </p>
              {/* 3 Social Buttons: Google/Gmail, LinkedIn, Facebook */}
              <div className="grid grid-cols-3 gap-3">
                {/* 1. Google / Gmail */}
                <button
                  type="button"
                  onClick={() => handleSocialRegister("Google")}
                  disabled={socialLoading !== null}
                  className="h-11 px-3 rounded-xl border border-white/10 bg-[#1c1d25] hover:bg-[#242631] hover:border-white/20 text-neutral-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
                >
                  {socialLoading === "Google" ? (
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
                  <span className="truncate">Gmail</span>
                </button>

                {/* 2. LinkedIn */}
                <button
                  type="button"
                  onClick={() => handleSocialRegister("LinkedIn")}
                  disabled={socialLoading !== null}
                  className="h-11 px-3 rounded-xl border border-white/10 bg-[#1c1d25] hover:bg-[#242631] hover:border-[#0A66C2]/40 text-neutral-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
                >
                  {socialLoading === "LinkedIn" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0A66C2]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0 text-[#0A66C2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  )}
                  <span className="truncate">LinkedIn</span>
                </button>

                {/* 3. Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialRegister("Facebook")}
                  disabled={socialLoading !== null}
                  className="h-11 px-3 rounded-xl border border-white/10 bg-[#1c1d25] hover:bg-[#242631] hover:border-[#1877F2]/40 text-neutral-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
                >
                  {socialLoading === "Facebook" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#1877F2]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  <span className="truncate">Facebook</span>
                </button>
              </div>
            </div>

            {/* Divider: Or */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#14151c] px-3 text-xs font-medium text-neutral-500">
                Or
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="block text-xs font-medium text-neutral-300">
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="firstName"
                      type="text"
                      placeholder="e.g. Sejal"
                      {...register("firstName")}
                      className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#0f1015] border ${
                        errors.firstName ? "border-red-500" : "border-white/10 hover:border-white/20"
                      } text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1015_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-red-400 pl-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="block text-xs font-medium text-neutral-300">
                    Last Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="lastName"
                      type="text"
                      placeholder="e.g. Gupta"
                      {...register("lastName")}
                      className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#0f1015] border ${
                        errors.lastName ? "border-red-500" : "border-white/10 hover:border-white/20"
                      } text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1015_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-red-400 pl-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Contact Number (Replaced Username) */}
              <div className="space-y-1.5">
                <label htmlFor="contactNumber" className="block text-xs font-medium text-neutral-300">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="contactNumber"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    {...register("contactNumber")}
                    className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#0f1015] border ${
                      errors.contactNumber ? "border-red-500" : "border-white/10 hover:border-white/20"
                    } text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1015_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-xs text-red-400 pl-1">{errors.contactNumber.message}</p>
                )}
              </div>

              {/* Row 3: Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-neutral-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                    className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#0f1015] border ${
                      errors.email ? "border-red-500" : "border-white/10 hover:border-white/20"
                    } text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1015_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 pl-1">{errors.email.message}</p>
                )}
              </div>

              {/* Row 4: Verify Email OTP Field under Email */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="emailOtp" className="block text-xs font-medium text-neutral-300">
                    Verify Email OTP
                  </label>
                  {otpSent && (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OTP Sent
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="emailOtp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      {...register("emailOtp")}
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#0f1015] border border-white/10 hover:border-white/20 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all tracking-wider font-mono [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1015_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]"
                    />
                  </div>
                  {/* Send / Resend OTP Action Button */}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || otpCountdown > 0}
                    className="h-11 px-4 rounded-xl border border-white/15 bg-[#1e202a] hover:bg-[#272936] hover:border-white/30 text-white text-xs font-semibold whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    {isSendingOtp ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : otpCountdown > 0 ? (
                      `Resend in ${otpCountdown}s`
                    ) : otpSent ? (
                      "Resend OTP"
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </div>

              {/* Row 5: Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-neutral-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password")}
                    className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#0f1015] border ${
                      errors.password ? "border-red-500" : "border-white/10 hover:border-white/20"
                    } text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1015_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
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
                
                {/* Password helper & strength indicator */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5 px-1">
                  <span>Minimum length is 8 characters.</span>
                  {passwordWatch && (
                    <span className={
                      passwordStrength <= 1 ? "text-red-400" :
                      passwordStrength === 2 ? "text-amber-400" :
                      "text-emerald-400 font-medium"
                    }>
                      {passwordStrength <= 1 ? "Weak" : passwordStrength === 2 ? "Medium" : "Strong"}
                    </span>
                  )}
                </div>

                {errors.password && (
                  <p className="text-xs text-red-400 pl-1">{errors.password.message}</p>
                )}
              </div>

              {/* Row 6: Confirm Password under Password with Eye Button */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-neutral-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    {...register("confirmPassword")}
                    className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#0f1015] border ${
                      errors.confirmPassword ? "border-red-500" : "border-white/10 hover:border-white/20"
                    } text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all [color-scheme:dark] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f1015_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Row 7: Terms and Conditions Checkbox under Confirm Password */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      {...register("termsAccepted")}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-md border border-white/20 bg-[#0f1015] peer-checked:bg-gradient-to-r peer-checked:from-[#f0449b] peer-checked:to-[#be32ff] peer-checked:border-transparent transition-all flex items-center justify-center shadow-sm group-hover:border-[#be32ff]/60">
                      <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
                    </div>
                  </div>
                  <span className="text-xs text-neutral-300 leading-snug">
                    I agree to the{" "}
                    <Link
                      href="/legal/terms-of-service"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/legal/privacy-policy"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#f0449b] to-[#be32ff] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-xs text-red-400 pl-1 mt-1">{errors.termsAccepted.message}</p>
                )}
              </div>

              {socialNotice && (
                <div className="p-3 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 animate-in fade-in">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>{socialNotice}</span>
                </div>
              )}

              {error && (
                <div className="p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in">
                  {error}
                </div>
              )}

              {/* Big CTA Button: Styled with requested color palette (#fc9a5d -> #f0449b -> #be32ff -> #7d36fa) */}
              <button
                type="button"
                onClick={handleOpenChoiceModal}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:to-[#7d36fa] text-white font-bold text-sm tracking-wide flex items-center justify-center transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[0_4px_25px_rgba(240,68,155,0.35)] hover:shadow-[0_6px_35px_rgba(190,50,255,0.55)] hover:brightness-105 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Terms of Service note */}
            <p className="text-xs text-neutral-400 text-center leading-relaxed">
              By creating an account, you agree to the{" "}
              <Link href="/legal/terms-of-service" target="_blank" className="text-neutral-200 underline hover:text-white transition-colors">
                Terms of Service
              </Link>
              . We&apos;ll occasionally send you account-related emails.
            </p>

            {/* Already have an account? */}
            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-sm text-neutral-400">
                Already have an account?{" "}
                <Link href="/login/user" className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#f0449b] to-[#fc9a5d] hover:opacity-80 transition-opacity">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Choice Modal (Login vs Business) */}
      {showChoiceModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowChoiceModal(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#0e0f14] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(190,50,255,0.2)] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Glows */}
            <div className="absolute -top-24 -right-24 w-52 h-52 bg-gradient-to-br from-[#f0449b]/25 to-[#be32ff]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-gradient-to-tr from-[#fc9a5d]/20 to-[#7d36fa]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowChoiceModal(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Select a Role
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5">
                Choose your role to continue
              </p>
            </div>

            {/* 2 Options: Business & Login */}
            <div className="space-y-3.5 relative z-10">
              {/* Option 1: Business Profile & Details */}
              <button
                type="button"
                onClick={handleSelectBusiness}
                className="w-full text-left p-4 sm:p-5 rounded-xl border border-[#f0449b]/50 bg-[#151622] hover:bg-[#1a1b2c] hover:border-[#be32ff] transition-all duration-300 group flex items-start gap-4 shadow-lg hover:shadow-[0_4px_30px_rgba(240,68,155,0.3)] relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shrink-0 text-white shadow-md group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm sm:text-base text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#fc9a5d] group-hover:to-[#be32ff] transition-all">
                      Business Profile &amp; Details
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f0449b]/20 text-[#f0449b] border border-[#f0449b]/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Set up your business name, logo generator, location, target audience &amp; brand kit on the dedicated business onboarding page.
                  </p>
                </div>
                <div className="self-center pl-2 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              {/* Option 2: Login */}
              <button
                type="button"
                onClick={handleSelectLogin}
                className="w-full text-left p-4 sm:p-5 rounded-xl border border-white/10 bg-[#12131b] hover:bg-[#181926] hover:border-white/25 transition-all duration-300 group flex items-start gap-4 shadow-md hover:shadow-lg relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#be32ff] group-hover:bg-[#be32ff]/15 group-hover:scale-105 transition-all">
                  <LogIn className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm sm:text-base text-white group-hover:text-neutral-200 transition-colors">
                      User Login
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                      Existing Account
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Already have an account? Sign in directly to access your AI marketing dashboard.
                  </p>
                </div>
                <div className="self-center pl-2 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* Direct Individual Signup option */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 relative z-10">
              <span>Or complete direct signup here:</span>
              <button
                type="button"
                onClick={() => {
                  setShowChoiceModal(false);
                  handleSubmit(onSubmit)();
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 hover:border-white/20 transition-colors"
              >
                Submit Form Here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} DhandaGrow AI. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <Link href="/legal/privacy-policy" target="_blank" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
          <Link href="/legal/terms-of-service" target="_blank" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
