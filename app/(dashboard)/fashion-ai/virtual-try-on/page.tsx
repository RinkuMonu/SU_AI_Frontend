"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function VirtualTryOnRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ai-photoshoot");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-3">
      <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
      <p className="text-sm text-neutral-400">Redirecting to Unified AI Product Photoshoot Studio...</p>
    </div>
  );
}
