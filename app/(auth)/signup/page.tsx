"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { authService } from "@/services/auth.service";
import { 
  COUNTRY_CODES, 
  validatePhoneNumber, 
  sanitizeNationalNumber 
} from "@/lib/phone";
import { AuthCenterModal, AuthModalStatus } from "@/components/auth/AuthCenterModal";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Registration Mode: Primary (Google with Mobile Phone) vs Email/Password
  const [signupMode, setSignupMode] = useState<"google" | "password">("google");

  // Phone states
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Email/Password states (alternative method)
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
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    status: AuthModalStatus;
    title?: string;
    message?: string;
  } | null>(null);

  /**
   * Launch Google Authentication for Signup
   */
  const handleGoogleSignup = (customPhone?: string, customCountryCode?: string) => {
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
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
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
      }, 300);
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
   * Step 1: User enters mobile number & country code -> Clicks Next
   */
  const handlePhoneNext = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setError("");

    const validation = validatePhoneNumber(countryCode, phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid mobile number");
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("google_auth_phone", validation.e164);
      sessionStorage.setItem("google_auth_country_code", countryCode);
      sessionStorage.setItem("google_auth_mode", "signup");
    }

    handleGoogleSignup(validation.e164, countryCode);
  };

  /**
   * Password Registration submission (Without mandatory OTP requirement)
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

  const passwordRequirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "uppercase letter", met: /[A-Z]/.test(password) },
    { label: "lowercase letter", met: /[a-z]/.test(password) },
    { label: "number", met: /[0-9]/.test(password) },
    { label: "passwords match", met: password !== "" && password === confirmPassword },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-brand-purple/30 relative overflow-hidden">
      {/* Ambient background glow */}
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
            {/* Top Continue with Google button */}
            <button
              type="button"
              onClick={() => handleGoogleSignup()}
              disabled={socialLoading !== null}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#1c1d24] hover:bg-[#23252e] hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] text-neutral-200 text-sm font-medium flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
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
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#15161b] px-3 text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">
                OR
              </span>
            </div>

            {error && (
              <div className="p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl">
                {error}
              </div>
            )}

            {signupMode === "google" ? (
              /* PRIMARY REGISTRATION FLOW: Mobile Number -> Next -> Google Auth */
              <form onSubmit={handlePhoneNext} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-phone" className="text-xs font-medium text-neutral-300">
                    Mobile Phone Number <span className="text-brand-pink">*</span>
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
                  <p className="text-[11px] text-neutral-500 pl-1">
                    Enter your mobile number and click Next to continue with Google registration.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <Button
                    type="submit"
                    disabled={socialLoading !== null}
                    className="w-full h-11 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.25)]"
                  >
                    {socialLoading === "Google" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                        Connecting with Google...
                      </>
                    ) : (
                      <>
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setSignupMode("password");
                      setError("");
                    }}
                    className="w-full text-center text-xs text-neutral-400 hover:text-[#be32ff] transition-colors py-1 cursor-pointer"
                  >
                    Prefer email? <span className="underline font-medium text-white hover:text-[#be32ff]">Register with Email & Password</span> &rarr;
                  </button>
                </div>
              </form>
            ) : (
              /* ALTERNATIVE REGISTRATION FLOW: Name, Email, Password */
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
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className="h-10 pr-10 rounded-xl bg-[#0f1014] text-white border-white/10"
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
                  <Label htmlFor="confirmPassword" className="text-xs font-medium text-neutral-300">
                    Confirm Password <span className="text-brand-pink">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className="h-10 pr-10 rounded-xl bg-[#0f1014] text-white border-white/10"
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

                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-text-muted pt-1">
                  {passwordRequirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1 ${
                        req.met ? "text-emerald-400" : "text-neutral-500"
                      }`}
                    >
                      {req.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setSignupMode("google");
                      setError("");
                    }}
                    className="w-full text-center text-xs text-neutral-400 hover:text-[#be32ff] transition-colors py-1 cursor-pointer"
                  >
                    &larr; <span className="underline font-medium text-white hover:text-[#be32ff]">Back to Google / Mobile registration</span>
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-text-muted pb-4">
          Already have an account?{" "}
          <Link href="/login/user" className="text-brand-pink font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      {/* Centered Feedback Modal */}
      {authModal && (
        <AuthCenterModal
          open={authModal.open}
          onClose={() => {
            setAuthModal(null);
            setError("");
            setSocialLoading(null);
          }}
          status={authModal.status}
          provider="Google"
          title={authModal.title}
          message={authModal.message}
        />
      )}
    </div>
  );
}
