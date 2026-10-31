"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronDown,
  Crown,
  Download,
  FileText,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { paymentService, CreatePaymentResponse } from "@/services/payment.service";
import { Subscription, PlanConfig } from "@/types/subscription";
import {
  AVAILABLE_PLANS,
  BillingCycle,
  PlanDefinition,
  calculatePlanPrice,
  formatCurrencyINR,
} from "@/lib/plan-onboarding";
import { PaymentModal } from "@/components/payment/PaymentModal";

export default function SubscriptionPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Record<string, PlanConfig>>({});
  const [mergedPlans, setMergedPlans] = useState<PlanDefinition[]>(AVAILABLE_PLANS);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>("monthly");
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState<boolean>(false);

  // Payment Modal state
  const [activePaymentOrder, setActivePaymentOrder] = useState<CreatePaymentResponse | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [sub, availablePlans] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getPlans().catch(() => null),
      ]);
      setSubscription(sub);
      setPlans(availablePlans || {});

      // Merge backend pricing dynamically
      const plansObj = availablePlans || {};
      const updated = AVAILABLE_PLANS.map((def) => {
        const beKey = Object.keys(plansObj).find(
          (k) => k.toUpperCase() === def.id.toUpperCase()
        );
        const bePlan = beKey ? plansObj[beKey] : null;
        if (bePlan && typeof bePlan.price === "number") {
          return {
            ...def,
            monthlyPrice: bePlan.price,
            creditBadge: bePlan.credits ? `${bePlan.credits} Credits` : def.creditBadge,
          };
        }
        return def;
      });
      setMergedPlans(updated);
    } catch (err) {
      console.error("Failed to load subscription data", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL parameters for legacy tab routing and payment status verification
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const orderId = params.get("order_id") || params.get("orderId");
    const paymentStatus = params.get("status");

    // Seamlessly redirect legacy tab query params to their dedicated subroutes
    if (tabParam === "transactions" || tabParam === "transaction") {
      router.replace("/subscription/transactions");
      return;
    } else if (tabParam === "credits" || tabParam === "usage") {
      router.replace("/subscription/credits");
      return;
    }

    if (orderId) {
      verifyPaymentOrder(orderId);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      setUpgradeError("Payment was not completed. Please try again or choose another plan.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [router]);

  const verifyPaymentOrder = async (orderId: string) => {
    setUpgradingPlan("VERIFYING");
    setUpgradeError(null);

    try {
      const verifyRes = await paymentService.verifyPayment(orderId);
      if (verifyRes.verified || verifyRes.status === "success") {
        await loadData();
        setUpgradeSuccess(`Payment for order ${orderId} verified! Your plan is active.`);
      } else if (verifyRes.status === "pending") {
        setUpgradeError("Payment is currently being processed by your bank. Please check back shortly.");
      } else {
        setUpgradeError(verifyRes.message || "Payment verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to verify payment status", err);
      try {
        const latestSub = await subscriptionService.getMySubscription();
        if (latestSub && (latestSub.status || "").toLowerCase() === "active") {
          setSubscription(latestSub);
          setUpgradeSuccess("Your plan is verified and active!");
        } else {
          setUpgradeError("Unable to verify payment with server. Please retry.");
        }
      } catch (_) {
        setUpgradeError("Unable to verify payment status.");
      }
    } finally {
      setUpgradingPlan(null);
    }
  };

  const handleSelectPlan = async (plan: PlanDefinition) => {
    if (isCreatingPayment) return;

    try {
      setIsCreatingPayment(true);
      setUpgradingPlan(plan.id);
      setUpgradeError(null);
      setUpgradeSuccess(null);

      if (plan.monthlyPrice === 0 || plan.id === "FREE") {
        await subscriptionService.upgradePlan("FREE");
        const updatedSub = await subscriptionService.getMySubscription();
        setSubscription(updatedSub);
        setUpgradeSuccess("Free Plan activated successfully!");
      } else {
        const response = await paymentService.createPayment(plan.id, selectedCycle);
        if (response.payment_url) {
          window.location.href = response.payment_url;
        } else if (response.order_id) {
          setActivePaymentOrder(response);
          setShowPaymentModal(true);
        } else {
          throw new Error("Invalid payment response received from server.");
        }
      }
    } catch (err: any) {
      console.error("Failed to initiate payment", err);
      if (err?.response?.status === 401) {
        window.location.href = "/login/user";
      } else {
        setUpgradeError(
          err?.response?.data?.detail ||
            err?.message ||
            "Failed to initiate secure payment. Please try again."
        );
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } finally {
      setIsCreatingPayment(false);
      setUpgradingPlan(null);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      setUpgradeError(null);
      const reportData = await subscriptionService.getBillingReport();
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `billing-report-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setUpgradeSuccess("Billing report generated and downloaded successfully!");
    } catch (err: any) {
      console.error("Failed to generate billing report", err);
      setUpgradeError(
        err?.response?.data?.detail || "Failed to generate billing report from server."
      );
    } finally {
      setGeneratingReport(false);
    }
  };

  const toggleFeatures = (planId: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
        <p className="text-xs text-text-muted">Loading available subscription plans...</p>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-text-muted space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-lg text-white">Unable to load subscription plans. Please try again.</p>
        <Button onClick={loadData} variant="outline" className="border-border hover:bg-surface-elevated text-white">
          Retry
        </Button>
      </div>
    );
  }

  const currentPlanId = (subscription.plan_id || "FREE").toUpperCase();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <span>Billing &amp; Plans</span>
            <span>/</span>
            <span className="text-white font-medium">All Subscription Plans</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Crown className="w-7 h-7 text-brand-purple" />
            <span>All Subscription Plans</span>
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1">
            Choose the ideal AI plan for your business scale. Upgrade, renew, or manage your active subscription.
          </p>
        </div>

        {/* Quick Report Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/subscription/transactions"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-white bg-surface border border-border hover:border-brand-purple/40 transition-all cursor-pointer shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5 text-brand-purple" />
            <span>Transaction Report</span>
          </Link>

          <Link
            href="/subscription/credits"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-white bg-surface border border-border hover:border-brand-purple/40 transition-all cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-brand-purple fill-brand-purple" />
            <span>Credit Usage</span>
          </Link>

          <Button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            variant="outline"
            className="border-border hover:bg-surface-elevated text-white text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            {generatingReport ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span>Export Statement</span>
          </Button>
        </div>
      </div>

      {upgradeSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">{upgradeSuccess}</span>
          </div>
          <Link
            href="/subscription/transactions"
            className="text-xs font-semibold underline underline-offset-2 hover:text-green-300"
          >
            View in Transaction Report →
          </Link>
        </div>
      )}

      {upgradeError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm">{upgradeError}</span>
        </div>
      )}

      {/* Overview Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-text-muted uppercase tracking-wider">Current Active Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white uppercase flex items-center gap-2">
              <span>{currentPlanId}</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 border border-brand-purple/30">
                {subscription.status}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1">
              Active Tier: <span className="font-semibold text-white">{subscription.plan_details?.name || currentPlanId}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-brand-purple/10 rounded-bl-full blur-xl pointer-events-none" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Credits Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-purple flex items-center gap-2">
              <Zap className="h-6 w-6 fill-brand-purple" />
              {subscription.credits_remaining}
              <span className="text-sm text-text-muted font-normal">
                / {subscription.plan_details?.credits || 0}
              </span>
            </div>
            <Link
              href="/subscription/credits"
              className="text-[11px] text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 mt-1"
            >
              <span>View Usage Breakdown</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-text-muted uppercase tracking-wider">Posts Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {subscription.usage?.posts_created ?? 0}
              <span className="text-sm text-text-muted font-normal ml-1">
                /{" "}
                {subscription.plan_details?.post_limit === -1
                  ? "∞"
                  : (subscription.plan_details?.post_limit ?? 0)}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1.5">
              Available this monthly cycle
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-text-muted uppercase tracking-wider">Reels Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {subscription.usage?.reels_created ?? 0}
              <span className="text-sm text-text-muted font-normal ml-1">
                /{" "}
                {subscription.plan_details?.reel_limit === -1
                  ? "∞"
                  : (subscription.plan_details?.reel_limit ?? 0)}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1.5">
              AI videos created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans Section */}
      <div id="available-plans-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              <span>Available Subscription Tiers</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Choose the best plan for your brand and business scale. Instant activation via UPI &amp; Cards.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="bg-[#1C1335] p-1.5 rounded-full border border-white/10 flex items-center gap-1 w-full sm:w-auto shadow-inner">
            <button
              type="button"
              onClick={() => setSelectedCycle("monthly")}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCycle === "monthly"
                  ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setSelectedCycle("quarterly")}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedCycle === "quarterly"
                  ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Quarterly</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                10% OFF
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCycle("yearly")}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedCycle === "yearly"
                  ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Yearly</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mergedPlans.map((plan) => {
            const isCurrent = currentPlanId === plan.id.toUpperCase();
            const priceInfo = calculatePlanPrice(plan.monthlyPrice, selectedCycle);
            const isExpanded = expandedFeatures[plan.id];
            const isProcessing = upgradingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? "bg-gradient-to-b from-[#251545] to-[#120B24] border-2 border-[#C026D3] shadow-[0_0_30px_rgba(192,38,211,0.2)]"
                    : isCurrent
                    ? "bg-[#18102E] border-2 border-emerald-500/50 shadow-lg"
                    : "bg-[#140D26] border border-white/10 hover:border-white/20 shadow-md"
                }`}
              >
                {/* Popular or Current Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                    Most Popular
                  </div>
                )}
                {isCurrent && !plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                    Current Plan
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                        {plan.planBadge || "Plan"}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-0.5">{plan.name}</h3>
                    </div>
                    <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {plan.creditBadge}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 min-h-[32px] mb-4 leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Pricing */}
                  <div className="mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">
                        {formatCurrencyINR(priceInfo.displayPrice)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {plan.monthlyPrice === 0
                          ? "free forever"
                          : selectedCycle === "monthly"
                          ? "/month"
                          : selectedCycle === "quarterly"
                          ? "/mo (billed quarterly)"
                          : "/mo (billed annually)"}
                      </span>
                    </div>

                    {selectedCycle !== "monthly" && plan.monthlyPrice > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] text-gray-500 line-through">
                          {formatCurrencyINR(plan.monthlyPrice)}/mo
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {selectedCycle === "quarterly" ? "Save 10%" : "Save 20%"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 mb-6">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Key Highlights
                    </span>
                    {plan.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expanded Features */}
                  {isExpanded && (
                    <div className="space-y-2 mb-6 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                        All Features Included
                      </span>
                      {plan.allFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-[#C026D3] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => toggleFeatures(plan.id)}
                    className="text-purple-400 hover:text-purple-300 text-xs font-medium flex items-center justify-between w-full cursor-pointer transition-colors"
                  >
                    <span>{isExpanded ? "Hide features" : "View all features"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isCurrent ? (
                    <Button
                      disabled
                      className="w-full py-2 bg-white/10 text-gray-300 border border-white/10 cursor-default flex items-center justify-center gap-1.5 text-xs font-bold rounded-full"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Active Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isProcessing}
                      className={`w-full py-2 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] hover:opacity-90 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>{plan.monthlyPrice === 0 ? "Select Free" : "Upgrade"}</span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Gateway & QR Code Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        orderData={activePaymentOrder}
        onClose={() => {
          setShowPaymentModal(false);
          setActivePaymentOrder(null);
        }}
        onSuccess={async (confirmedOrderId) => {
          await loadData();
          setUpgradeSuccess(`Payment for order ${confirmedOrderId} verified and plan activated!`);
        }}
      />
    </div>
  );
}
