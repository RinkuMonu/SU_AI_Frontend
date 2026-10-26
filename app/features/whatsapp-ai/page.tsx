"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarketingAIPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/features/marketing-agent");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-text-muted">
      <p>Redirecting to Marketing AI Agent...</p>
    </div>
  );
}
