"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Suspense } from "react";

function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login/user");
    }
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("No email specified. Please start the signup process again.");
      return;
    }
    if (otp.length < 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await authService.verifyEmail(email, otp);
      setSuccessMsg("Email verified successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push('/login/user');
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid OTP or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("No email specified.");
      return;
    }
    
    setError("");
    setSuccessMsg("");
    setCountdown(60); // 60 seconds cooldown
    
    try {
      await authService.resendOtp(email);
      setSuccessMsg("OTP has been resent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
      setCountdown(0);
    }
  };

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">No email address provided for verification.</p>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/login/user")} variant="default">
            Go to Login
          </Button>
          <Button onClick={() => router.push("/signup")} variant="outline">
            Return to Signup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Logo withText={false} className="scale-125 mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-white">Verify your email</h1>
        <p className="text-sm text-text-muted">
          We've sent a 6-digit code to <span className="font-semibold text-white">{email}</span>
        </p>
      </div>

      <Card className="bg-card shadow-lg border-border">
        <CardContent className="pt-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Confirmation Code</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  className="pl-10 text-center tracking-widest text-lg font-semibold"
                />
              </div>
            </div>

            {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">{error}</div>}
            {successMsg && <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-md">{successMsg}</div>}

            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading || otp.length < 6}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-text-muted">Didn't receive the code?</p>
            <Button
              variant="outline"
              className="w-full h-10 border-border text-text-secondary hover:text-white"
              onClick={handleResend}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `Resend Code in ${countdown}s` : "Resend Code"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-brand-pink" />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
