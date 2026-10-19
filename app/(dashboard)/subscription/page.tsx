"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  Loader2, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Film,
  Image as ImageIcon,
  Camera,
  User,
  Sparkles,
  Globe,
  Clock,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { creditService } from "@/services/credit.service";
import { paymentService } from "@/services/payment.service";
import { Subscription, CreditTransaction } from "@/types/subscription";
import { CreditBalance } from "@/types/credits";
import { LANDING_PLANS, BillingCycle, PlanItem } from "@/components/Pricing";

export const normalizePlanId = (rawPlan?: string | null): string => {
  if (!rawPlan) return "FREE";
  const upper = rawPlan.toString().trim().toUpperCase();
  if (upper === "PRO" || upper === "GROWTH" || upper === "2999") return "GROWTH";
  if (upper === "BASIC" || upper === "STARTER" || upper === "999" || upper === "799") return "STARTER";
  if (upper === "BUSINESS" || upper === "4999") return "BUSINESS";
  if (upper === "INFLUENCER" || upper === "9999") return "INFLUENCER";
  if (upper === "FREE" || upper === "0") return "FREE";
  return upper;
};

export const PLAN_LIMITS: Record<string, { posts: number; reels: number; credits: number; label: string }> = {
  FREE: { posts: 5, reels: 1, credits: 5, label: "5 Posts & 1 Reel" },
  STARTER: { posts: 30, reels: 10, credits: 100, label: "30 Posts & 10 Reels" },
  GROWTH: { posts: 100, reels: 30, credits: 400, label: "100 Posts & 30 Reels" },
  BUSINESS: { posts: 200, reels: 60, credits: 1000, label: "200 Posts & 60 Reels" },
  INFLUENCER: { posts: -1, reels: -1, credits: 2000, label: "Unlimited Posts & Reels" },
};

export function getTransactionMeta(tx: CreditTransaction) {
  const feat = (tx.feature || tx.action || "").toLowerCase();
  const txType = (tx.transaction_type || "").toLowerCase();
  const rawAmt = Math.abs(tx.amount ?? (tx as any).credits ?? 0);

  // Determine if this is a credit deduction (reel, post, photo, etc.) or an addition/recharge
  const isDeduction =
    txType === "deduction" ||
    (tx.amount !== undefined && tx.amount < 0) ||
    feat.includes("reel") ||
    feat.includes("post") ||
    feat.includes("photoshoot") ||
    feat.includes("avatar") ||
    feat.includes("actor") ||
    feat.includes("ad") ||
    feat.includes("website");

  if (feat.includes("reel")) {
    return {
      title: "AI Video Reel Generation",
      tag: "AI Reel",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      icon: "reel",
      isDeduction: true,
      amountText: `-${rawAmt || 10} Credits`,
      amountColor: "text-rose-400",
      description: "Generated 1 AI Video Reel • 10 Credits deducted",
    };
  }

  if (feat.includes("website")) {
    return {
      title: "AI Website Builder",
      tag: "Website",
      badgeColor: "bg-teal-500/15 text-teal-300 border-teal-500/30",
      icon: "website",
      isDeduction: true,
      amountText: `-${rawAmt || 10} Credits`,
      amountColor: "text-rose-400",
      description: "Built 1 AI Website • 10 Credits deducted",
    };
  }

  if (feat.includes("post")) {
    return {
      title: "AI Social Post Creation",
      tag: "AI Post",
      badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      icon: "post",
      isDeduction: true,
      amountText: `-${rawAmt || 1} Credit`,
      amountColor: "text-rose-400",
      description: "Created 1 AI Social Post • 1 Credit deducted",
    };
  }

  if (feat.includes("photoshoot")) {
    return {
      title: "AI Studio Photoshoot",
      tag: "Photoshoot",
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      icon: "photoshoot",
      isDeduction: true,
      amountText: `-${rawAmt || 5} Credits`,
      amountColor: "text-rose-400",
      description: "Generated 1 AI Studio Photoshoot • 5 Credits deducted",
    };
  }

  if (feat.includes("avatar")) {
    return {
      title: "AI Talking Avatar",
      tag: "Avatar",
      badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      icon: "avatar",
      isDeduction: true,
      amountText: `-${rawAmt || 15} Credits`,
      amountColor: "text-rose-400",
      description: "Generated 1 AI Talking Avatar • 15 Credits deducted",
    };
  }

  if (feat.includes("actor")) {
    return {
      title: "AI Virtual Actor Studio",
      tag: "Actor",
      badgeColor: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
      icon: "actor",
      isDeduction: true,
      amountText: `-${rawAmt || 20} Credits`,
      amountColor: "text-rose-400",
      description: "Generated 1 AI Virtual Actor • 20 Credits deducted",
    };
  }

  if (feat.includes("ad")) {
    return {
      title: "AI Ad Creative Studio",
      tag: "AI Ad",
      badgeColor: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      icon: "ad",
      isDeduction: true,
      amountText: `-${rawAmt || 5} Credits`,
      amountColor: "text-rose-400",
      description: "Generated 1 AI Ad Creative • 5 Credits deducted",
    };
  }

  if (isDeduction) {
    const isHinglish = tx.description && /(aapne|kiya|karein|huye|cut|banayi)/i.test(tx.description);
    return {
      title: tx.action || tx.feature || "Feature Usage Deduction",
      tag: "Deduction",
      badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      icon: "deduction",
      isDeduction: true,
      amountText: `-${rawAmt} Credits`,
      amountColor: "text-rose-400",
      description: isHinglish || !tx.description ? "Feature generation • Credits deducted" : tx.description,
    };
  }

  const isHinglishRecharge = tx.description && /(aapne|allotted|karein)/i.test(tx.description);
  return {
    title: tx.action || "Plan Recharge / Credit Allotment",
    tag: "Recharge",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: "recharge",
    isDeduction: false,
    amountText: `+${rawAmt} Credits`,
    amountColor: "text-emerald-400",
    description: isHinglishRecharge || !tx.description ? "Account Plan Top-up • Credits added" : tx.description,
  };
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  
  // Selection states: defaults dynamically to user's actual active plan
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  // Read URL query params (?plan=GROWTH&billing=monthly) if user was redirected from landing/login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan");
      const billingParam = params.get("billing");
      if (planParam) {
        setSelectedPlanId(normalizePlanId(planParam));
      }
      if (billingParam && ["monthly", "quarterly", "yearly"].includes(billingParam.toLowerCase())) {
        setBillingCycle(billingParam.toLowerCase() as BillingCycle);
      }
    }
  }, []);

  useEffect(() => {
    async function loadData(showLoading = true) {
      try {
        if (showLoading) setLoading(true);
        setError(false);
        const [sub, hist, creditBal] = await Promise.all([
          subscriptionService.getMySubscription(),
          subscriptionService.getCreditTransactions().catch(() => []),
          creditService.getCredits().catch(() => null)
        ]);
        setSubscription(sub);
        setHistory(hist);
        if (creditBal) {
          setCreditBalance(creditBal);
        }

        const effectivePlan = normalizePlanId(sub?.plan_id || (sub as any)?.plan || creditBal?.plan || "FREE");
        setSelectedPlanId((prev) => prev || effectivePlan);
      } catch (err) {
        console.error("Failed to load subscription data", err);
        setError(true);
      } finally {
        if (showLoading) setLoading(false);
      }
    }
    loadData(true);

    const handleCreditUpdate = () => {
      loadData(false);
    };

    window.addEventListener("credit-update", handleCreditUpdate);
    return () => window.removeEventListener("credit-update", handleCreditUpdate);
  }, []);

  const handleUpgrade = async (planId: string) => {
    const normalizedPlan = normalizePlanId(planId);
    if (normalizedPlan === "FREE") {
      await handleFreePlan();
      return;
    }

    try {
      setUpgradingPlan(normalizedPlan);
      const response = await paymentService.createPayment(normalizedPlan);
      
      if (response.payment_url) {
        window.location.href = response.payment_url;
      } else {
        throw new Error("Invalid payment URL returned");
      }
    } catch (err: any) {
      console.error("Failed to initiate payment", err);
      
      if (err?.response?.status === 401) {
        window.location.href = "/login/user";
      } else {
        alert("Failed to initiate secure payment. Please try again.");
      }
      setUpgradingPlan(null);
    }
  };

  const handleFreePlan = async () => {
    try {
      setUpgradingPlan("FREE");
      await subscriptionService.upgradePlan("FREE");
      setUpgradeSuccess("Successfully activated Free Plan!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setUpgradeSuccess("Free Plan is active on your account.");
    } finally {
      setUpgradingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-text-muted space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-lg">Unable to load billing information. Please try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </div>
    );
  }

  const rawPlanId = subscription.plan_id || (subscription as any)?.plan || creditBalance?.plan || "FREE";
  const normalizedUserPlan = normalizePlanId(rawPlanId);
  const currentPlanConfig = LANDING_PLANS.find(p => p.id === normalizedUserPlan) || LANDING_PLANS[0];

  // Dynamic actively viewed plan: defaults to user's actual plan, or previewed plan on user hover/click
  const activePlanId = normalizePlanId(hoveredPlanId || selectedPlanId || normalizedUserPlan);
  const activePlanConfig = LANDING_PLANS.find(p => p.id === activePlanId) || currentPlanConfig;
  const isActualUserPlan = activePlanId === normalizedUserPlan;

  const userLimits = PLAN_LIMITS[normalizedUserPlan] || PLAN_LIMITS.FREE;
  const activeLimits = PLAN_LIMITS[activePlanId] || userLimits;

  // Count actual reels & posts from history ledger if subscription usage counters are lagged
  const reelTxCount = history.filter(tx => {
    const feat = (tx.feature || tx.action || "").toLowerCase();
    return feat.includes("reel");
  }).length;
  const postTxCount = history.filter(tx => {
    const feat = (tx.feature || tx.action || "").toLowerCase();
    return feat.includes("post");
  }).length;

  // Real user data
  const creditsRemaining = creditBalance?.credits_remaining ?? subscription.credits_remaining ?? userLimits.credits;
  const creditsUsed = creditBalance?.credits_used ?? (subscription as any).credits_used ?? 0;
  const creditsTotal = creditBalance?.credits_total || (subscription.plan_details?.credits ? Number(subscription.plan_details.credits) : userLimits.credits);
  const postsCreated = Math.max(subscription.usage?.posts_created ?? (subscription as any).posts_created ?? 0, postTxCount);
  const reelsCreated = Math.max(subscription.usage?.reels_created ?? (subscription as any).reels_created ?? 0, reelTxCount);

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500 py-6 px-2 sm:px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Subscription &amp; Billing</h1>
        <p className="text-text-muted">Manage your AI subscription plan with 18% GST transparent pricing.</p>
      </div>

      {upgradeSuccess && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {upgradeSuccess}
        </div>
      )}

      {/* 1. Account Usage Overview Section - Dynamically updates with current plan & previewed tier */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Current / Previewed Plan */}
        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Current Plan" : "Previewing Tier"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white uppercase flex items-center gap-2">
              <span>{activePlanConfig.name}</span>
              {isActualUserPlan ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold normal-case flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {subscription.status ? subscription.status.toUpperCase() : "ACTIVE"}
                </span>
              ) : (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold uppercase tracking-wider">
                  PREVIEW
                </span>
              )}
            </div>
            <p className="text-xs text-brand-purple mt-1 flex items-center gap-1">
              {isActualUserPlan && subscription.current_period_end ? (
                <>Valid till: <span className="font-semibold text-slate-300">{format(new Date(subscription.current_period_end), "dd MMM yyyy")}</span></>
              ) : (
                <>
                  Tier: <span className="font-semibold text-slate-300">{activePlanConfig.tagline}</span>
                  {!isActualUserPlan && (
                    <button
                      type="button"
                      onClick={() => setSelectedPlanId(normalizedUserPlan)}
                      className="ml-1 text-[11px] underline text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      (Reset to My Plan)
                    </button>
                  )}
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        {/* Card 2: Credits Remaining / Plan Credits */}
        <Card className="bg-surface border-border shadow-md relative overflow-hidden transition-all duration-300">
          <div className="absolute right-0 top-0 w-16 h-16 bg-brand-purple/10 rounded-bl-full blur-xl" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Credits Remaining" : "Plan Credits on Upgrade"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isActualUserPlan ? (
              <>
                <div className="text-3xl font-bold text-brand-purple flex items-baseline gap-1.5">
                  <Zap className="h-6 w-6 fill-brand-purple self-center" />
                  <span>{creditsRemaining.toLocaleString("en-IN")}</span>
                  {creditsTotal > 0 && (
                    <span className="text-sm text-text-muted font-normal">
                      / {creditsTotal.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {creditsUsed > 0 
                    ? `${creditsUsed.toLocaleString("en-IN")} credits used this cycle`
                    : "Available for AI generation"}
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-brand-purple flex items-baseline gap-1.5">
                  <Zap className="h-6 w-6 fill-brand-purple self-center" />
                  <span>{activePlanConfig.credits}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Monthly credit allocation with {activePlanConfig.name}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Posts Created / Monthly Posts Limit */}
        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Posts Created" : "Monthly Posts Limit"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isActualUserPlan ? (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>{postsCreated.toLocaleString("en-IN")}</span>
                  {userLimits.posts > 0 ? (
                    <span className="text-sm text-text-muted font-normal">
                      / {userLimits.posts} Posts
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold">(Unlimited)</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mt-1">
                  <span>
                    {userLimits.posts > 0
                      ? `${Math.max(0, userLimits.posts - postsCreated)} posts remaining`
                      : "Unlimited AI social post generations"}
                  </span>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    ⚡ 1 cr/post
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>
                    {activeLimits.posts > 0 ? `${activeLimits.posts} Posts` : "Unlimited"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Monthly AI post generation limit
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Reels Created / Monthly Reels Limit */}
        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Reels Created" : "Monthly Reels Limit"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isActualUserPlan ? (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>{reelsCreated.toLocaleString("en-IN")}</span>
                  {userLimits.reels > 0 ? (
                    <span className="text-sm text-text-muted font-normal">
                      / {userLimits.reels} Reels
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold">(Unlimited)</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mt-1">
                  <span>
                    {userLimits.reels > 0
                      ? `${Math.max(0, userLimits.reels - reelsCreated)} reels remaining`
                      : "Unlimited AI video reels rendering"}
                  </span>
                  <span className="text-[11px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                    ⚡ 10 cr/reel
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>
                    {activeLimits.reels > 0 ? `${activeLimits.reels} Reels` : "Unlimited"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Monthly AI video reels rendering limit
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2. Clean Plans Section - Zero clipping with overflow-visible & matching purple theme */}
      <section className="pt-7 pb-10 sm:pt-8 sm:pb-12 relative bg-[#f8f9fe] rounded-[32px] sm:rounded-[40px] border border-slate-200/90 shadow-2xl">
        {/* Soft ambient background glow effects inside bounded container */}
        <div className="absolute inset-0 overflow-hidden rounded-[32px] sm:rounded-[40px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-purple-100/40 blur-[130px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-indigo-100/40 blur-[130px] rounded-full" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-4 2xl:px-8 relative z-10">
          
          {/* Centered Billing Cycle 3D Pill Toggle */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200/80 shadow-sm gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("quarterly")}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                  billingCycle === "quarterly"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Quarterly</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  billingCycle === "quarterly" ? "bg-white/25 text-white" : "bg-purple-50 text-purple-700 border border-purple-200/70"
                }`}>
                  Save 5%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Yearly</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  billingCycle === "yearly" ? "bg-white/25 text-white" : "bg-purple-50 text-purple-700 border border-purple-200/70"
                }`}>
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* 3D Pricing Cards Grid - pt-6 headroom prevents badge clipping */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 xl:gap-3 2xl:gap-5 items-stretch pt-6 sm:pt-7"
            onMouseLeave={() => setHoveredPlanId(null)}
          >
            {LANDING_PLANS.map((plan: PlanItem) => {
              const pricingInfo = plan.pricing[billingCycle];
              const isUserActualPlan = normalizedUserPlan.toUpperCase() === plan.id.toUpperCase();
              const isCardSelected = activePlanId.toUpperCase() === plan.id.toUpperCase();
              const isUpgradingThis = upgradingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setHoveredPlanId(plan.id)}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`rounded-[32px] sm:rounded-[36px] xl:rounded-[30px] 2xl:rounded-[38px] p-5 sm:p-6 xl:px-3.5 xl:py-6 2xl:px-5 2xl:py-7 flex flex-col items-center text-center transition-all duration-300 relative cursor-pointer select-none group ${
                    isUserActualPlan
                      ? "bg-[#F2EFFE] border-2 border-purple-500 shadow-[0_16px_38px_rgba(124,58,237,0.2),0_2px_8px_rgba(124,58,237,0.08)] -translate-y-2 z-10 ring-2 ring-purple-400/30"
                      : isCardSelected
                      ? "bg-purple-50/60 border-2 border-purple-300 shadow-[0_14px_34px_rgba(124,58,237,0.12)] -translate-y-1.5 z-10"
                      : "bg-white border border-slate-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.02)] hover:border-purple-200 hover:shadow-[0_22px_45px_rgba(124,58,237,0.08),0_4px_12px_rgba(124,58,237,0.04)] hover:-translate-y-1"
                  }`}
                >
                  {/* CURRENT PLAN Badge strictly on user's actual active plan */}
                  {isUserActualPlan && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white text-[11px] font-extrabold rounded-full shadow-[0_4px_16px_rgba(124,58,237,0.4)] tracking-wider uppercase whitespace-nowrap z-20 flex items-center gap-1.5 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      CURRENT PLAN
                    </div>
                  )}

                  {/* PREVIEWING TIER Badge if user hovered/selected another tier */}
                  {!isUserActualPlan && isCardSelected && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 text-white text-[10px] font-extrabold rounded-full shadow-[0_4px_16px_rgba(236,72,153,0.35)] tracking-wider uppercase whitespace-nowrap z-20 animate-in fade-in duration-200">
                      PREVIEWING TIER
                    </div>
                  )}

                  {/* 3D Floating Top Pill Box */}
                  <div 
                    className={`w-[86%] max-w-[165px] py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-2xl bg-white border shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] flex items-center justify-center text-xs sm:text-[13px] font-bold tracking-wide transition-all duration-200 group-hover:scale-105 ${
                      isUserActualPlan || isCardSelected
                        ? "border-purple-200/90 text-[#7C3AED]"
                        : "border-slate-200/90 text-slate-700 group-hover:text-[#7C3AED]"
                    }`}
                  >
                    {plan.tagline}
                  </div>

                  {/* Plan Name */}
                  <h3 
                    className={`text-2xl sm:text-[26px] xl:text-[22px] 2xl:text-[26px] font-black uppercase tracking-wider mt-4 sm:mt-5 mb-2.5 sm:mb-3 transition-colors ${
                      isUserActualPlan || isCardSelected
                        ? "text-[#7C3AED]"
                        : "text-slate-900 group-hover:text-[#7C3AED]"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Price Display */}
                  <div className="flex flex-col items-center justify-center min-h-[58px] sm:min-h-[64px] mb-1 w-full">
                    {/* Top Row: Strikethrough Original Price & Discount Badge */}
                    <div className="flex items-center justify-center gap-1.5 min-h-[20px] mb-1">
                      {pricingInfo.originalPrice ? (
                        <>
                          <span className="text-slate-400 text-xs sm:text-[13px] line-through font-semibold">
                            ₹{pricingInfo.originalPrice.toLocaleString('en-IN')}
                          </span>
                          {pricingInfo.billedText && (
                            <span className="text-[10px] font-extrabold text-[#7C3AED] bg-purple-100/70 border border-purple-200/80 px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                              {pricingInfo.billedText.match(/\d+%\s*off/i)?.[0] || 'Save'}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="inline-block h-4" />
                      )}
                    </div>

                    {/* Main Active Price Line */}
                    <div className="flex items-baseline justify-center max-w-full">
                      {pricingInfo.pricePrefix && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 mr-1 shrink-0">
                          {pricingInfo.pricePrefix}
                        </span>
                      )}
                      <span className={`font-black text-slate-900 tracking-tight leading-none ${
                        pricingInfo.price >= 100000 
                          ? "text-2xl sm:text-[28px] xl:text-[25px] 2xl:text-[32px]" 
                          : "text-3xl sm:text-[34px] xl:text-[28px] 2xl:text-[34px]"
                      }`}>
                        ₹{pricingInfo.price.toLocaleString('en-IN')}
                      </span>
                      {plan.id !== 'FREE' && (
                        <span className="text-xs sm:text-sm font-bold text-slate-600 ml-1 shrink-0">
                          {billingCycle === 'monthly' ? '/mo' : billingCycle === 'quarterly' ? '/qtr' : '/yr'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* GST Text Note */}
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium mb-4 sm:mb-5">
                    {plan.id === 'FREE' ? 'No GST shown' : '+ 18% GST where applicable'}
                  </p>

                  {/* Short Benefits */}
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal text-center min-h-[76px] sm:min-h-[84px] flex items-center justify-center px-1 sm:px-2 flex-1">
                    {plan.shortBenefits}
                  </p>

                  {/* Action Button - Fully harmonized with purple/indigo palette */}
                  <div className="w-full mt-5 pt-1">
                    {isUserActualPlan ? (
                      <div className="w-full py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 bg-purple-100/90 text-purple-800 border border-purple-300/80 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span>Active Plan</span>
                      </div>
                    ) : plan.id === "FREE" ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFreePlan();
                        }}
                        disabled={upgradingPlan !== null}
                        className={`w-full py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-center block transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.98] disabled:opacity-60 ${
                          isCardSelected
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25"
                            : "bg-purple-50/80 text-purple-700 hover:bg-[#7C3AED] hover:text-white border border-purple-200/70"
                        }`}
                      >
                        {isUpgradingThis ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                          </span>
                        ) : (
                          <span>Downgrade to Free</span>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(plan.id);
                        }}
                        disabled={upgradingPlan !== null}
                        className={`w-full py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-center block transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.98] disabled:opacity-60 ${
                          isCardSelected
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25"
                            : "bg-purple-50/80 text-purple-700 hover:bg-[#7C3AED] hover:text-white border border-purple-200/70"
                        }`}
                      >
                        {isUpgradingThis ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin" /> Upgrading...
                          </span>
                        ) : (
                          <span>{plan.ctaText}</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. History Section: Credit Transactions & Reel Usage */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Credit Transactions &amp; Reel History</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {history.length} {history.length === 1 ? "entry" : "entries"}
              </span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Real-time ledger of all reels generated, websites built, social posts published, and credit balance updates.
            </p>
          </div>

          {/* Feature Rate Card Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 font-semibold flex items-center gap-1.5 shadow-2xs">
              <Film className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Reel = 10 Credits</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-300 font-semibold flex items-center gap-1.5 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Website = 10 Credits</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-300 font-semibold flex items-center gap-1.5 shadow-2xs">
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Post = 1 Credit</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 font-semibold flex items-center gap-1.5 shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Photoshoot = 5 Credits</span>
            </span>
          </div>
        </div>

        <Card className="bg-surface border-border overflow-hidden shadow-xl">
          {history.length === 0 ? (
            <CardContent className="py-12 text-center text-text-muted space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Credit Transactions Found</h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                When you generate AI video reels, build websites, or create social posts, every credit deduction and balance update will be recorded here in real-time.
              </p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] uppercase tracking-wider bg-surface-elevated/70 text-text-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold">Date &amp; Time</th>
                    <th className="px-6 py-4 font-bold">Feature &amp; Details</th>
                    <th className="px-6 py-4 font-bold">Type</th>
                    <th className="px-6 py-4 font-bold text-right">Credits Cut / Added</th>
                    <th className="px-6 py-4 font-bold text-right">Balance After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {history.map((tx, idx) => {
                    const meta = getTransactionMeta(tx);
                    const formattedDate = tx.created_at
                      ? (() => {
                          try {
                            return format(new Date(tx.created_at), "MMM d, yyyy • h:mm a");
                          } catch {
                            return tx.created_at;
                          }
                        })()
                      : "Recently";

                    return (
                      <tr 
                        key={tx.id || idx} 
                        className="hover:bg-surface-elevated/40 transition-colors group"
                      >
                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-text-muted">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-text-muted/70 shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>

                        {/* Feature & Description */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                              meta.isDeduction ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {meta.icon === "reel" && <Film className="w-4 h-4 text-purple-400" />}
                              {meta.icon === "post" && <ImageIcon className="w-4 h-4 text-blue-400" />}
                              {meta.icon === "photoshoot" && <Camera className="w-4 h-4 text-amber-400" />}
                              {meta.icon === "avatar" && <User className="w-4 h-4 text-cyan-400" />}
                              {meta.icon === "actor" && <Sparkles className="w-4 h-4 text-fuchsia-400" />}
                              {meta.icon === "ad" && <Sparkles className="w-4 h-4 text-orange-400" />}
                              {meta.icon === "website" && <Globe className="w-4 h-4 text-teal-400" />}
                              {meta.icon === "recharge" && <Zap className="w-4 h-4 text-emerald-400" />}
                              {meta.icon === "deduction" && <Zap className="w-4 h-4 text-rose-400" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-sm">
                                  {meta.title}
                                </span>
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                                  {meta.tag}
                                </span>
                              </div>
                              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                                {meta.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {meta.isDeduction ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
                              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                              Deduction
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                              Addition
                            </span>
                          )}
                        </td>

                        {/* Credits Cut / Added */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`text-sm font-extrabold font-mono ${meta.amountColor}`}>
                            {meta.amountText}
                          </span>
                        </td>

                        {/* Balance After */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-xs font-bold text-slate-300 font-mono bg-surface-elevated px-2.5 py-1 rounded-lg border border-border/80">
                            {tx.balance_after !== undefined ? `${tx.balance_after} Credits` : "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
