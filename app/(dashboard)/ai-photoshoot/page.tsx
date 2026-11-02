"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AIPhotoshootIndexPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const savedTab = sessionStorage.getItem("dhandagrow_photoshoot_active_tab");
      if (savedTab === "product") {
        router.replace("/ai-photoshoot/product");
        return;
      }
    } catch (_) {}
    router.replace("/ai-photoshoot/avatar");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-3">
      <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
      <p className="text-sm text-neutral-400">Loading AI Photoshoot Studio...</p>
    </div>
  );
}
