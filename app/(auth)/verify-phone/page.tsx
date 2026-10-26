"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OtpInput } from "@/components/ui/OtpInput";
import { Loader2, Phone, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { maskPhoneNumber } from "@/lib/phone";
import { needsRoleSelection, getDashboardRouteForRole } from "@/lib/role-routing";

function VerifyPhoneContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = useAuth();

  const phoneParam = searchParams.get("phone") || "";
  const rawUserPhone = user?.phone_number || (user as any)?.phone || (user as any)?.mobile || "";
  const phone = phoneParam || rawUserPhone;
  const email = searchParams.get("email") || user?.email || "";
  const name = searchParams.get("name") || user?.name || "";

  // Auto-redirect authenticated users who don't require phone verification (e.g. Gmail / OAuth / no phone registered / already verified)
  useEffect(() => {
    if (user) {
      const uPhone = (user.phone || user.phone_number || (user as any)?.mobile || "").trim();
      const isOAuth = Boolean(
        user.auth_provider === "google" ||
        user.provider === "google" ||
        user.google_id ||
        (user as any)?.googleId ||
        user.auth_provider === "facebook" ||
        user.provider === "facebook" ||
        user.auth_provider === "instagram" ||
        user.provider === "instagram" ||
        user.auth_provider === "linkedin" ||
        user.provider === "linkedin" ||
        (!uPhone && user.email)
      );

      const hasSelectedRole = !needsRoleSelection(user);
      if (isOAuth || !uPhone || user.phone_verified === true || hasSelectedRole) {
        const destination = needsRoleSelection(user)
          ? "/select-role"
          : getDashboardRouteForRole(user.role);
        router.replace(destination);
      }
    }
  }, [user, phone, router]);

  // 60-second cooldown timer for SMS OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e?: React.FormEvent, codeToVerify?: string) => {
    if (e) e.preventDefault();
    const finalOtp = (codeToVerify || otp).trim();

    if (!phone) {
      setError("No phone number specified. Please return to the signup page.");
      return;
    }

    if (finalOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (isVerifying) return; // Prevent duplicate submission

    setIsVerifying(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await authService.verifyOtp({ phone, email }, finalOtp);

      setSuccessMsg("Phone number verified successfully! Redirecting...");

      if (response.token && response.user) {
        login(response.token, response.user);
        const destination = needsRoleSelection(response.user)
          ? "/select-role"
          : getDashboardRouteForRole(response.user.role);
        setTimeout(() => {
          router.replace(destination);
        }, 1000);
      } else {
        setTimeout(() => {
          router.replace(`/login/user?verified=true&phone=${encodeURIComponent(phone)}`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!phone) {
      setError("No phone number found.");
      return;
    }
    if (countdown > 0 || isResending) return;

    setError("");
    setSuccessMsg("");
    setIsResending(true);

    try {
      await authService.resendOtp({ phone, email });
      setSuccessMsg("A new 6-digit code has been sent to your phone.");
      setCountdown(60); // Reset 60s cooldown
      setOtp(""); // Clear previous input
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please wait before retrying.");
    } finally {
      setIsResending(false);
    }
  };

  if (!phone) {
    if (user) {
      const destination = needsRoleSelection(user)
        ? "/select-role"
        : getDashboardRouteForRole(user.role);
      router.replace(destination);
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="flex items-center gap-3 text-text-muted">
            <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
            <span>Redirecting to your dashboard...</span>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md bg-card shadow-lg border-border">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Missing Phone Number</h2>
            <p className="text-sm text-text-muted">
              We couldn&apos;t find a phone number for verification. Please start the registration process again.
            </p>
            <Button
              onClick={() => router.push("/signup")}
              className="mt-2 w-full"
            >
              Return to Signup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maskedPhone = maskPhoneNumber(phone);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Logo withText={false} className="scale-125 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Verify your phone</h1>
          <p className="text-sm text-text-muted max-w-xs">
            We sent a 6-digit SMS verification code to{" "}
            <span className="font-semibold text-white whitespace-nowrap">{maskedPhone}</span>
          </p>
        </div>

        <Card className="bg-card shadow-lg border-border">
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* 6-Digit OTP Box Grid */}
              <div className="space-y-2">
                <OtpInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (error) setError("");
                  }}
                  onComplete={(val) => {
                    handleVerify(undefined, val);
                  }}
                  disabled={isVerifying}
                  hasError={!!error}
                  autoFocus
                />
              </div>

              {/* Status & Error Alerts */}
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Verify Action Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={otp.length !== 6 || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              {/* Resend OTP & Change Number Actions */}
              <div className="pt-2 flex flex-col items-center gap-3 text-sm">
                <div className="text-text-muted">
                  Didn&apos;t receive the SMS code?{" "}
                  {countdown > 0 ? (
                    <span className="text-white font-medium">
                      Resend in <span className="text-brand-purple">{countdown}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-brand-pink font-semibold hover:underline inline-flex items-center gap-1 focus:outline-none"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Code"
                      )}
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-border w-full text-center">
                  <Link
                    href={`/signup?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}${email ? `&email=${encodeURIComponent(email)}` : ''}`}
                    className="text-xs text-text-muted hover:text-white inline-flex items-center gap-1 mt-2 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Change phone number
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-text-muted pb-6">
          Already verified?{" "}
          <Link href="/login/user" className="text-brand-pink font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      }
    >
      <VerifyPhoneContent />
    </Suspense>
  );
}
