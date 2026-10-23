"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function VerifyEmailRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  useEffect(() => {
    const target = phone || email;
    if (target) {
      router.replace(
        `/verify-phone?phone=${encodeURIComponent(target)}&email=${encodeURIComponent(email || "")}`
      );
    } else {
      router.replace("/signup");
    }
  }, [email, phone, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      <p className="text-text-muted text-sm">Redirecting to phone verification...</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      }
    >
      <VerifyEmailRedirect />
    </Suspense>
  );
}
