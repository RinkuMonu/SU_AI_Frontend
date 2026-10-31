"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService, OtpDeliveryChannel } from "@/services/auth.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OtpInput } from "@/components/ui/OtpInput";
import { Loader2, Phone, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, MessageSquare } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { maskPhoneNumber } from "@/lib/phone";
import { needsRoleSelection, getDashboardRouteForRole } from "@/lib/role-routing";

// WhatsApp Brand Icon
const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

function VerifyPhoneContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const isVerifyingRef = useRef(false);
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

  // Channel can be 'whatsapp' or 'sms'
  const initialChannel: OtpDeliveryChannel = (searchParams.get("channel") as OtpDeliveryChannel) || "whatsapp";
  const [channel, setChannel] = useState<OtpDeliveryChannel>(initialChannel);

  // Auto-redirect authenticated users who don't require phone verification
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

      const hasSelectedRole = true;
      if (isOAuth || !uPhone || user.phone_verified === true || hasSelectedRole) {
        const destination = getDashboardRouteForRole(user.role);
        router.replace(destination);
      }
    }
  }, [user, phone, router]);

  // 60-second cooldown timer
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

    if (isVerifyingRef.current || isVerifying) return;
    isVerifyingRef.current = true;
    setIsVerifying(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await authService.verifyOtp({ phone, email }, finalOtp);

      const vToken = response.phone_verification_token || response.verification_token || response.token;

      setSuccessMsg("Phone number verified successfully! Redirecting...");

      if (typeof window !== "undefined") {
        sessionStorage.setItem("phone_verified", "true");
        sessionStorage.setItem("google_auth_phone", phone);
        if (vToken) {
          sessionStorage.setItem("google_auth_verification_token", vToken);
          sessionStorage.setItem("phone_verification_token", vToken);
        }
      }

      if (response.token && response.user) {
        login(response.token, response.user);
        const destination = getDashboardRouteForRole(response.user.role);
        setTimeout(() => {
          router.replace(destination);
        }, 800);
        return;
      }

      const isFromSignup = searchParams.get("from") === "signup" || searchParams.get("mode") === "signup" || (typeof window !== "undefined" && sessionStorage.getItem("google_auth_mode") === "signup");

      if (isFromSignup) {
        setTimeout(() => {
          router.replace(`/signup?verified=true&phone=${encodeURIComponent(phone)}`);
        }, 800);
        return;
      } else {
        setTimeout(() => {
          router.replace(`/login/user?verified=true&phone=${encodeURIComponent(phone)}`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code. Please try again.");
    } finally {
      isVerifyingRef.current = false;
      setIsVerifying(false);
    }
  };

  const handleResend = async (targetChannel?: OtpDeliveryChannel) => {
    if (!phone) {
      setError("No phone number found.");
      return;
    }
    const effChannel = targetChannel || channel;
    if (countdown > 0 && effChannel === channel) return;
    if (isResending) return;

    setError("");
    setSuccessMsg("");
    setIsResending(true);
    if (targetChannel) setChannel(targetChannel);

    try {
      const res = await authService.resendOtp({ phone, email, channel: effChannel });
      const channelLabel = effChannel === "whatsapp" ? "WhatsApp (MSG91)" : "SMS (Fast2SMS)";
      setSuccessMsg(`A new 6-digit verification code has been sent via ${channelLabel}.`);
      setCountdown(60);
      setOtp("");
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please wait before retrying.");
    } finally {
      setIsResending(false);
    }
  };

  if (!phone) {
    if (user) {
      const destination = getDashboardRouteForRole(user.role);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-brand-purple/30 relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <Logo withText={false} className="scale-125 mb-2" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-surface border-white/10 text-white">
            {channel === "whatsapp" ? (
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Verify your phone</h1>
          <p className="text-sm text-text-muted max-w-xs">
            We sent a 6-digit code via {channel === "whatsapp" ? "WhatsApp" : "SMS"} to{" "}
            <span className="font-semibold text-white whitespace-nowrap">{maskedPhone}</span>
          </p>
        </div>

        <Card className="bg-[#15161b]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-xl rounded-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* 6-Digit OTP Box Grid */}
              <div className="space-y-2">
                <OtpInput
                  value={otp}
                  length={6}
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
                <div className="p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Verify Action Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50"
                disabled={otp.length !== 6 || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                    Verifying Code...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              {/* Resend & Channel Switch Actions */}
              <div className="space-y-3 pt-2 text-center text-xs">
                <div className="text-text-muted">
                  Didn&apos;t receive the code?{" "}
                  {countdown > 0 ? (
                    <span className="text-white font-medium">
                      Resend in <span className="text-brand-purple font-bold">{countdown}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleResend()}
                      disabled={isResending}
                      className="text-pink-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isResending ? (
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
                  {channel === "whatsapp" ? (
                    <button
                      type="button"
                      onClick={() => handleResend("sms")}
                      disabled={isResending}
                      className="text-purple-300 font-semibold hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Send via SMS (Fast2SMS)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleResend("whatsapp")}
                      disabled={isResending}
                      className="text-emerald-400 font-semibold hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                      Send via WhatsApp (MSG91)
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-white/10 w-full text-center">
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
