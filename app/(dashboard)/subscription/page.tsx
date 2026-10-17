"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { creditService } from "@/services/credit.service";
import { paymentService } from "@/services/payment.service";
import { Subscription, CreditTransaction } from "@/types/subscription";
import { CreditBalance } from "@/types/credits";
import { LANDING_PLANS, BillingCycle, PlanItem } from "@/components/Pricing";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  
  // Hover & selection states for fully dynamic interactivity
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("GROWTH");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  // Read URL query params (?plan=GROWTH&billing=monthly) if user was redirected from landing/login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan");
      const billingParam = params.get("billing");
      if (planParam) {
        setSelectedPlanId(planParam.toUpperCase());
      }
      if (billingParam && ["monthly", "quarterly", "yearly"].includes(billingParam.toLowerCase())) {
        setBillingCycle(billingParam.toLowerCase() as BillingCycle);
      }
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
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

        if (sub?.plan_id) {
          const planKey = sub.plan_id.toUpperCase() === "PRO" ? "GROWTH" : sub.plan_id.toUpperCase();
          setSelectedPlanId(planKey);
        }
      } catch (err) {
        console.error("Failed to load subscription data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpgrade = async (planId: string) => {
    const normalizedPlan = (planId || "").trim().toUpperCase();
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

  const rawPlanId = subscription.plan_id || "FREE";
  const normalizedUserPlan = rawPlanId.toUpperCase() === "PRO" ? "GROWTH" : rawPlanId.toUpperCase();
  const currentPlanConfig = LANDING_PLANS.find(p => p.id === normalizedUserPlan) || LANDING_PLANS[0];

  // Dynamic actively viewed plan (changes dynamically on hover or click as requested)
  const activePlanId = (hoveredPlanId || selectedPlanId || normalizedUserPlan).toUpperCase();
  const activePlanConfig = LANDING_PLANS.find(p => p.id === activePlanId) || currentPlanConfig;
  const isActualUserPlan = activePlanId === normalizedUserPlan;

  // Real user data
  const creditsRemaining = creditBalance?.credits_remaining ?? subscription.credits_remaining ?? 0;
  const creditsUsed = creditBalance?.credits_used ?? (subscription as any).credits_used ?? 0;
  const creditsTotal = creditBalance?.credits_total || (subscription.plan_details?.credits ? Number(subscription.plan_details.credits) : 0);
  const postsCreated = subscription.usage?.posts_created ?? (subscription as any).posts_created ?? 0;
  const reelsCreated = subscription.usage?.reels_created ?? (subscription as any).reels_created ?? 0;

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

      {/* 1. Account Usage Overview Section - Dynamically updates with the hovered/selected plan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Current / Selected Plan */}
        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Current Plan" : "Selected Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white uppercase flex items-center gap-2">
              <span>{activePlanConfig.name}</span>
              {isActualUserPlan ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold normal-case">
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
                <>Tier: <span className="font-semibold text-slate-300">{activePlanConfig.tagline}</span></>
              )}
            </p>
          </CardContent>
        </Card>
        
        {/* Card 2: Credits Remaining / Plan Credits */}
        <Card className="bg-surface border-border shadow-md relative overflow-hidden transition-all duration-300">
          <div className="absolute right-0 top-0 w-16 h-16 bg-brand-purple/10 rounded-bl-full blur-xl" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Credits Remaining" : "Plan Credits"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isActualUserPlan ? (
              <>
                <div className="text-3xl font-bold text-brand-purple flex items-baseline gap-1.5">
                  <Zap className="h-6 w-6 fill-brand-purple self-center" />
                  <span>{creditsRemaining.toLocaleString("en-IN")}</span>
                  {creditsTotal > creditsRemaining && (
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
                  Monthly credit allocation
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Posts Created / Monthly Posts */}
        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Posts Created" : "Monthly Posts"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isActualUserPlan ? (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>{postsCreated.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Total AI posts created
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>
                    {activePlanConfig.id === "FREE" ? "5 Posts" : activePlanConfig.id === "STARTER" ? "30 Posts" : activePlanConfig.id === "GROWTH" ? "100 Posts" : activePlanConfig.id === "BUSINESS" ? "200 Posts" : "Unlimited"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Monthly generation limit
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Reels Created / Monthly Reels */}
        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {isActualUserPlan ? "Reels Created" : "Monthly Reels"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isActualUserPlan ? (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>{reelsCreated.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Total AI reels rendered
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>
                    {activePlanConfig.id === "FREE" ? "1 Reel" : activePlanConfig.id === "STARTER" ? "10 Reels" : activePlanConfig.id === "GROWTH" ? "30 Reels" : activePlanConfig.id === "BUSINESS" ? "60 Reels" : "Unlimited"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Monthly video render limit
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
              const isPlanActive = activePlanId === plan.id.toUpperCase();
              const isUserActualPlan = normalizedUserPlan.toUpperCase() === plan.id.toUpperCase();
              const isUpgradingThis = upgradingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setHoveredPlanId(plan.id)}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`rounded-[32px] sm:rounded-[36px] xl:rounded-[30px] 2xl:rounded-[38px] p-5 sm:p-6 xl:px-3.5 xl:py-6 2xl:px-5 2xl:py-7 flex flex-col items-center text-center transition-all duration-300 relative cursor-pointer select-none group ${
                    isPlanActive
                      ? "bg-[#F2EFFE] border-2 border-[#DDD6FE] shadow-[0_16px_38px_rgba(124,58,237,0.18),0_2px_8px_rgba(124,58,237,0.08)] -translate-y-2 z-10"
                      : "bg-white border border-slate-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.02)] hover:border-purple-200 hover:shadow-[0_22px_45px_rgba(124,58,237,0.08),0_4px_12px_rgba(124,58,237,0.04)] hover:-translate-y-1.5"
                  }`}
                >
                  {/* Dynamic Signature Purple-Indigo Badge (No green, shifts to active plan dynamically) */}
                  {isPlanActive && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white text-[11px] font-extrabold rounded-full shadow-[0_4px_16px_rgba(124,58,237,0.4)] tracking-wider uppercase whitespace-nowrap z-20 animate-in fade-in duration-200">
                      CURRENT PLAN
                    </div>
                  )}

                  {/* 3D Floating Top Pill Box */}
                  <div 
                    className={`w-[86%] max-w-[165px] py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-2xl bg-white border shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] flex items-center justify-center text-xs sm:text-[13px] font-bold tracking-wide transition-all duration-200 group-hover:scale-105 ${
                      isPlanActive
                        ? "border-purple-200/90 text-[#7C3AED]"
                        : "border-slate-200/90 text-slate-700 group-hover:text-[#7C3AED]"
                    }`}
                  >
                    {plan.tagline}
                  </div>

                  {/* Plan Name */}
                  <h3 
                    className={`text-2xl sm:text-[26px] xl:text-[22px] 2xl:text-[26px] font-black uppercase tracking-wider mt-4 sm:mt-5 mb-2.5 sm:mb-3 transition-colors ${
                      isPlanActive
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
                          isPlanActive
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25"
                            : "bg-purple-50/80 text-purple-700 hover:bg-[#7C3AED] hover:text-white border border-purple-200/70"
                        }`}
                      >
                        {isUpgradingThis ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                          </span>
                        ) : (
                          <span>Get Started Free</span>
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
                          isPlanActive
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

      {/* 3. History Section: Credit Transactions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Credit Transactions</h2>
        <Card className="bg-surface border-border overflow-hidden">
          {history.length === 0 ? (
            <CardContent className="py-8 text-center text-text-muted">
              No credit transactions found.
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-text-muted">
                <thead className="text-xs uppercase bg-surface-elevated/50 text-text-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                    <th className="px-6 py-4 font-medium">Credits</th>
                    <th className="px-6 py-4 font-medium">Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx, idx) => (
                    <tr key={tx.id || idx} className="border-b border-border/50 hover:bg-surface-elevated/20 transition-colors">
                      <td className="px-6 py-4">{format(new Date(tx.created_at), "MMM d, yyyy h:mm a")}</td>
                      <td className="px-6 py-4 font-medium text-white">{tx.action || (tx as any).transaction_type || (tx as any).feature}</td>
                      <td className={`px-6 py-4 font-bold ${tx.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </td>
                      <td className="px-6 py-4">{tx.balance_after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
