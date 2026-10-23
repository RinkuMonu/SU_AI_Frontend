"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WhatsAppRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/social-platforms");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-text-muted">
      <p>Redirecting to Social Platforms...</p>
    </div>
  );
}
