"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Lock,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/ui/OtpInput";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { COUNTRY_CODES, validatePhoneNumber, maskPhoneNumber } from "@/lib/phone";
import { needsRoleSelection, getDashboardRouteForRole } from "@/lib/role-routing";

const loginSchema = z.object({
  countryCode: z.string().min(1, { message: "Country code is required" }),
  phone: z.string().min(5, { message: "Mobile number is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isRegisteredParam = searchParams.get("registered") === "true";
  const phoneParam = searchParams.get("phone") || "";

  // Split phoneParam into countryCode and digits if provided
  let initialCountryCode = "+91";
  let initialPhoneDigits = phoneParam;

  if (phoneParam.startsWith("+")) {
    const matched = COUNTRY_CODES.find((c) => phoneParam.startsWith(c.code));
    if (matched) {
      initialCountryCode = matched.code;
      initialPhoneDigits = phoneParam.slice(matched.code.length);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: initialCountryCode,
      phone: initialPhoneDigits,
      password: "",
    },
  });

  const selectedCountryCode = useWatch({
    control,
    name: "countryCode",
    defaultValue: initialCountryCode,
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  /**
   * Handle Step 1: Submit Mobile Number & Password
   */
  const onCredentialsSubmit = async (data: LoginFormValues) => {
    setError("");
    setPhoneError("");

    const phoneValidation = validatePhoneNumber(data.countryCode, data.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || "Please enter a valid mobile number");
      return;
    }

    const normalizedPhone = phoneValidation.e164;
    setIsLoading(true);

    try {
      // Attempt login
      const response = await authService.login(normalizedPhone, data.password);

      // If backend returns access_token immediately (user already verified)
      if (response.token && response.user) {
        if (response.user.role === "admin") {
          throw new Error("Administrators must log in through the Admin Portal.");
        }
        login(response.token, response.user);
        const destination = needsRoleSelection(response.user)
          ? "/select-role"
          : getDashboardRouteForRole(response.user.role);
        router.replace(destination);
        return;
      }
    } catch (err: any) {
      const msg = err.message || "Failed to sign in";
      const code = err.code || "";

      // If phone OTP verification is required (new user or unverified)
      if (
        code === "PHONE_NOT_VERIFIED" ||
        msg.toLowerCase().includes("verification required") ||
        msg.toLowerCase().includes("phone verification") ||
        msg.toLowerCase().includes("otp")
      ) {
        // Dispatch OTP to mobile number
        try {
          await authService.resendOtp(normalizedPhone);
        } catch {
          // If resend is rate-limited, proceed anyway so user can enter the received OTP
        }
        setCountdown(60);
        setStep("otp");
        setSuccessMsg(`A 6-digit verification code has been sent to ${maskPhoneNumber(normalizedPhone)}.`);
        setIsLoading(false);
        return;
      }

      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Step 2: Verify Mobile OTP
   */
  const onOtpVerify = async (e?: React.FormEvent, customOtp?: string) => {
    if (e) e.preventDefault();
    const finalOtp = (customOtp || otp).trim();

    if (finalOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    const data = getValues();
    const phoneValidation = validatePhoneNumber(data.countryCode, data.phone);
    const normalizedPhone = phoneValidation.e164;

    setIsVerifyingOtp(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await authService.verifyOtp(normalizedPhone, finalOtp);

      if (response.token && response.user) {
        setSuccessMsg("Mobile number verified successfully! Redirecting...");
        login(response.token, response.user);
        const destination = needsRoleSelection(response.user)
          ? "/select-role"
          : getDashboardRouteForRole(response.user.role);
        setTimeout(() => {
          router.replace(destination);
        }, 1000);
      } else {
        // Fallback: login now with stored password
        const loginRes = await authService.login(normalizedPhone, data.password);
        login(loginRes.token, loginRes.user);
        const destination = needsRoleSelection(loginRes.user)
          ? "/select-role"
          : getDashboardRouteForRole(loginRes.user.role);
        router.replace(destination);
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Resend OTP Action
   */
  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    const data = getValues();
    const phoneValidation = validatePhoneNumber(data.countryCode, data.phone);
    const normalizedPhone = phoneValidation.e164;

    setError("");
    setSuccessMsg("");
    setIsResending(true);

    try {
      await authService.resendOtp(normalizedPhone);
      setSuccessMsg("A new 6-digit OTP has been sent to your mobile phone.");
      setCountdown(60);
      setOtp("");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please wait before retrying.");
    } finally {
      setIsResending(false);
    }
  };

  const currentValues = getValues();
  const phoneValidation = validatePhoneNumber(currentValues.countryCode, currentValues.phone);
  const displayMaskedPhone = phoneValidation.isValid ? maskPhoneNumber(phoneValidation.e164) : currentValues.phone;

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Logo withText={false} className="scale-125 mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-white">User Sign In</h1>
        <p className="text-sm text-text-muted">
          Access your business dashboard securely
        </p>
      </div>

      <Card className="bg-card shadow-lg border-border">
        <CardContent className="pt-6">
          {/* Post-Registration Banner */}
          {isRegisteredParam && step === "credentials" && (
            <div className="mb-4 p-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Account created successfully! Please sign in with your mobile number and password.</span>
            </div>
          )}

          {/* STEP 1: Mobile Phone Number + Password */}
          {step === "credentials" && (
            <form onSubmit={handleSubmit(onCredentialsSubmit)} className="space-y-4">
              {/* Mobile Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Phone Number</Label>
                <div className="flex gap-2">
                  <div className="w-36 shrink-0">
                    <select
                      id="countryCode"
                      aria-label="Country Code"
                      {...register("countryCode")}
                      className="flex h-10 w-full rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
                    >
                      {COUNTRY_CODES.map((c, idx) => (
                        <option key={`${c.code}-${c.country}-${idx}`} value={c.code} className="bg-surface text-white">
                          {c.flag} {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="98765 43210"
                      {...register("phone")}
                      className={errors.phone || phoneError ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                {phoneError && (
                  <p className="text-xs text-red-500">{phoneError}</p>
                )}
                {errors.phone && !phoneError && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-brand-pink hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: Mobile OTP Verification */}
          {step === "otp" && (
            <form onSubmit={onOtpVerify} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-purple/20 text-brand-purple mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">Enter Mobile OTP</h2>
                <p className="text-xs text-text-muted">
                  We sent a 6-digit verification code to{" "}
                  <span className="font-medium text-white">{displayMaskedPhone}</span>
                </p>
              </div>

              {/* 6-Digit OTP Grid */}
              <OtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (error) setError("");
                }}
                onComplete={(val) => {
                  onOtpVerify(undefined, val);
                }}
                disabled={isVerifyingOtp}
                hasError={!!error}
                autoFocus
              />

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={otp.length !== 6 || isVerifyingOtp}
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>

              <div className="pt-2 flex flex-col items-center gap-3 text-sm">
                <div className="text-text-muted text-xs">
                  Didn&apos;t receive code?{" "}
                  {countdown > 0 ? (
                    <span className="text-white font-medium">
                      Resend in <span className="text-brand-purple">{countdown}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-brand-pink font-semibold hover:underline inline-flex items-center gap-1 focus:outline-none"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend OTP"
                      )}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-text-muted hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Change mobile number or password
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-pink font-medium hover:underline">
          Sign up with mobile & email
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
