"use client";

import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { creditService } from "@/services/credit.service";
import { CreditBalance } from "@/types/credits";

export function CreditIndicator() {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await creditService.getCredits();
      setBalance(data);
    } catch (err) {
      console.error("Failed to fetch credits", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();

    const handleUpdate = () => {
      fetchCredits();
    };

    window.addEventListener("credit-update", handleUpdate);
    return () => window.removeEventListener("credit-update", handleUpdate);
  }, []);

  if (loading && !balance) {
    return (
      <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-text-muted bg-surface-elevated animate-pulse">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-purple" />
        Loading...
      </div>
    );
  }

  if (error && !balance) {
    return (
      <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-400 bg-red-400/10">
        <Zap className="mr-2 h-4 w-4" />
        Error
      </div>
    );
  }

  if (!balance) return null;

  const rawPlan = (balance.plan || "FREE").toUpperCase();
  const displayPlan = rawPlan === "PRO" ? "GROWTH" : rawPlan === "BASIC" ? "STARTER" : rawPlan;

  return (
    <Link href="/subscription" className="group block mb-2" title="Manage Subscription">
      <div className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 transition-all">
        <div className="flex items-center gap-1.5 min-w-0">
          <Zap className="h-4 w-4 fill-brand-purple text-brand-purple shrink-0" />
          <span className="font-semibold text-xs text-white truncate">{balance.credits_remaining} Credits</span>
        </div>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-purple/25 text-purple-300 border border-brand-purple/40 shrink-0">
          {displayPlan}
        </span>
      </div>
    </Link>
  );
}
