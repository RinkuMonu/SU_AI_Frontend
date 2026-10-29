"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { format } from "date-fns";
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
  Clock,
  RefreshCw,
  Copy,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { paymentService, CreatePaymentResponse } from "@/services/payment.service";
import { Subscription, CreditTransaction, PlanConfig } from "@/types/subscription";
import {
  AVAILABLE_PLANS,
  BillingCycle,
  PlanDefinition,
  calculatePlanPrice,
  formatCurrencyINR,
} from "@/lib/plan-onboarding";
import { PaymentModal } from "@/components/payment/PaymentModal";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [paymentTransactions, setPaymentTransactions] = useState<any[]>([]);
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

  // Active Report Tab: "credits" | "transactions"
  const [activeReportTab, setActiveReportTab] = useState<"credits" | "transactions">("transactions");
  const [verifyingTxId, setVerifyingTxId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Payment Modal state
  const [activePaymentOrder, setActivePaymentOrder] = useState<CreatePaymentResponse | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState<boolean>(false);

  const reportsSectionRef = useRef<HTMLDivElement | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [sub, hist, availablePlans, billingReport] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getCreditTransactions(),
        subscriptionService.getPlans(),
        subscriptionService.getBillingReport().catch(() => null),
      ]);
      setSubscription(sub);
      setHistory(hist || []);
      setPlans(availablePlans || {});

      if (billingReport?.payment_transactions) {
        setPaymentTransactions(billingReport.payment_transactions);
      }

      // Merge backend pricing dynamically
      const updated = AVAILABLE_PLANS.map((def) => {
        const beKey = Object.keys(availablePlans || {}).find(
          (k) => k.toUpperCase() === def.id.toUpperCase()
        );
        const bePlan = beKey ? availablePlans[beKey] : null;
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

  // Check URL query parameters for tab switching or payment verification return
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const orderId = params.get("order_id") || params.get("orderId");
    const paymentStatus = params.get("status");

    if (tabParam === "transactions" || tabParam === "transaction") {
      setActiveReportTab("transactions");
      setTimeout(() => {
        reportsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else if (tabParam === "credits" || tabParam === "usage") {
      setActiveReportTab("credits");
      setTimeout(() => {
        reportsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }

    if (orderId) {
      setActiveReportTab("transactions");
      verifyPaymentOrder(orderId);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      setUpgradeError("Payment was not completed. Please try again or select another plan.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const verifyPaymentOrder = async (orderId: string) => {
    setUpgradingPlan("VERIFYING");
    setUpgradeError(null);

    try {
      const verifyRes = await paymentService.verifyPayment(orderId);
      if (verifyRes.verified || verifyRes.status === "success") {
        await loadData();
        setActiveReportTab("transactions");
        setUpgradeSuccess(`Payment for order ${orderId} verified! Plan is active.`);
        setTimeout(() => {
          reportsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
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
          setActiveReportTab("transactions");
          setUpgradeSuccess("Plan is active!");
        } else {
          setUpgradeError("Unable to verify payment with backend. Please retry.");
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
        if (response.order_id) {
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

  const handleManualVerifyTransaction = async (orderId: string) => {
    try {
      setVerifyingTxId(orderId);
      const verifyRes = await paymentService.verifyPayment(orderId);
      await loadData();
      if (verifyRes.verified || verifyRes.status === "success") {
        setUpgradeSuccess(`Transaction ${orderId} verified successfully! Plan is active.`);
      } else {
        setUpgradeError(verifyRes.message || `Transaction ${orderId} is still pending.`);
      }
    } catch (err: any) {
      setUpgradeError(err?.response?.data?.detail || "Verification check failed. Please retry.");
    } finally {
      setVerifyingTxId(null);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(text);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const toggleFeatures = (planId: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
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
        <Button onClick={loadData} variant="outline">
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
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Subscription &amp; Billing
          </h1>
          <p className="text-text-muted">
            Manage your AI usage, upgrade your plan, and audit billing transactions.
          </p>
        </div>
        <Button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          variant="outline"
          className="border-border hover:bg-surface-elevated text-white shrink-0 flex items-center gap-2 cursor-pointer"
        >
          {generatingReport ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          ) : (
            <Download className="w-4 h-4 text-purple-400" />
          )}
          <span>Download Billing Report</span>
        </Button>
      </div>

      {upgradeSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm">{upgradeSuccess}</span>
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
            <CardTitle className="text-sm font-medium text-text-muted">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white uppercase">{currentPlanId}</div>
            <p className="text-xs text-brand-purple mt-1 flex items-center gap-1">
              Status: <span className="uppercase font-semibold">{subscription.status}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-brand-purple/10 rounded-bl-full blur-xl" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
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
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Posts Created</CardTitle>
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
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Reels Created</CardTitle>
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
          </CardContent>
        </Card>
      </div>

      {/* Available Plans Section */}
      <div id="available-plans-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-brand-purple" />
              Available Plans
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Choose the best plan for your brand and business scale.
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
              <span className="bg-pink-500/20 text-pink-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch">
          {mergedPlans.map((plan) => {
            const isCurrent = currentPlanId === plan.id.toUpperCase();
            const isProcessing = upgradingPlan === plan.id || isCreatingPayment;
            const priceInfo = calculatePlanPrice(plan.monthlyPrice, selectedCycle);
            const isExpanded = Boolean(expandedFeatures[plan.id]);

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isCurrent
                    ? "bg-[#1E1238] border-2 border-[#EC4899] shadow-lg shadow-pink-500/10"
                    : "bg-[#18102E]/90 border border-white/10 hover:border-purple-500/30"
                }`}
              >
                {/* Crown Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-[#F43F5E] via-[#FB7185] to-[#F59E0B] shadow-md flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-current" />
                      <span>Current</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Badge & Title */}
                  <span className="inline-block bg-[#4C1D95]/80 text-[#E9D5FF] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-purple-400/20">
                    {plan.planBadge}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 min-h-[32px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price & Credit Row */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-2xl font-extrabold text-white">
                        {formatCurrencyINR(priceInfo.displayPrice)}
                      </div>
                      <div className="text-[11px] text-gray-400">{priceInfo.intervalLabel}</div>
                    </div>
                    <div className="bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <Zap className="w-3 h-3 text-amber-400 fill-current" />
                      <span>{plan.creditBadge}</span>
                    </div>
                  </div>

                  {/* Top 3 Feature Highlights */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    {plan.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Features */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 animate-in fade-in">
                      <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider mb-1">
                        All Features:
                      </div>
                      {plan.allFeatures.map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-gray-300">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-3 border-t border-white/5 space-y-3">
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

      {/* Billing & Plans Sidebar Dropdown Reports Section */}
      <div ref={reportsSectionRef} id="billing-reports-section" className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-brand-purple" />
              <span>Billing &amp; Usage Reports</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Select a report to view audit logs, payment history, and credit usage.
            </p>
          </div>

          {/* Exactly Two Report Tabs Switcher */}
          <div className="bg-[#1C1335] p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 shadow-inner self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveReportTab("transactions")}
              className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeReportTab === "transactions"
                  ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Transaction Report</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                {paymentTransactions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveReportTab("credits")}
              className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeReportTab === "credits"
                  ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AI Token/Credit Usage Report</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                {history.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab: Transaction Report */}
        {activeReportTab === "transactions" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-purple" />
                <span>Payment &amp; Gateway Transactions</span>
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">
                  Total Orders: <strong className="text-white">{paymentTransactions.length}</strong>
                </span>
                <Link
                  href="/subscription/transactions"
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <Card className="bg-surface border-border overflow-hidden">
              {paymentTransactions.length === 0 ? (
                <CardContent className="py-12 text-center text-text-muted space-y-2">
                  <CreditCard className="w-8 h-8 text-text-muted/40 mx-auto" />
                  <p className="text-sm">No payment transactions recorded yet.</p>
                  <p className="text-xs text-text-muted/70">
                    Upgrade to a subscription plan to see transactions appear here.
                  </p>
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-text-muted">
                    <thead className="text-xs uppercase bg-surface-elevated/50 text-text-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Date &amp; Time</th>
                        <th className="px-6 py-4 font-medium">Plan Name</th>
                        <th className="px-6 py-4 font-medium">Transaction Reference</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Purchased Credits</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentTransactions.map((tx: any, idx: number) => {
                        const isSuccess = tx.status === "success";
                        const isPending = tx.status === "pending" || tx.status === "initiated";
                        const isCancelled = tx.status === "cancelled";
                        const isVerifying = verifyingTxId === tx.order_id;

                        return (
                          <tr
                            key={tx.order_id || tx.id || idx}
                            className={`border-b border-border/50 hover:bg-surface-elevated/20 transition-colors ${
                              tx.order_id === "ORDER_93D2B32FE1A5" ? "bg-purple-950/20" : ""
                            }`}
                          >
                            <td className="px-6 py-4 text-xs font-mono">
                              {tx.created_at
                                ? format(new Date(tx.created_at), "MMM d, yyyy h:mm a")
                                : "Recent"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-white">
                              {tx.plan_name || tx.plan_id || "Plan"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 font-mono text-xs text-purple-300">
                                <span>{tx.order_id || tx.id}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(tx.order_id || tx.id)}
                                  className="hover:text-white transition-colors cursor-pointer"
                                  title="Copy Order Reference"
                                >
                                  {copiedOrderId === (tx.order_id || tx.id) ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-white">
                              ₹{(tx.amount || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              {tx.purchased_credits ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                  <Zap className="w-3 h-3 fill-purple-300" />
                                  {tx.purchased_credits} Credits
                                </span>
                              ) : (
                                <span className="text-xs text-text-muted">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                  isSuccess
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : isPending
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : isCancelled
                                    ? "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                                }`}
                              >
                                {isSuccess ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : isPending ? (
                                  <Clock className="w-3 h-3" />
                                ) : isCancelled ? (
                                  <XCircle className="w-3 h-3" />
                                ) : (
                                  <AlertCircle className="w-3 h-3" />
                                )}
                                <span>{tx.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isPending && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isVerifying}
                                  onClick={() => handleManualVerifyTransaction(tx.order_id)}
                                  className="text-xs border-border text-white hover:bg-surface-elevated cursor-pointer"
                                >
                                  {isVerifying ? (
                                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                  )}
                                  <span>Verify</span>
                                </Button>
                              )}
                              {isSuccess && (
                                <span className="text-xs text-emerald-400 font-medium flex items-center justify-end gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Verified
                                </span>
                              )}
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
        )}

        {/* Tab: AI Token / Credit Usage Report */}
        {activeReportTab === "credits" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-purple fill-brand-purple" />
                <span>AI Token / Credit Ledger</span>
              </h3>
              <span className="text-xs text-text-muted">
                Available Credits: <strong className="text-brand-purple">{subscription.credits_remaining}</strong>
              </span>
            </div>

            <Card className="bg-surface border-border overflow-hidden">
              {history.length === 0 ? (
                <CardContent className="py-12 text-center text-text-muted space-y-2">
                  <Zap className="w-8 h-8 text-text-muted/40 mx-auto" />
                  <p className="text-sm">No credit usage transactions found.</p>
                  <p className="text-xs text-text-muted/70">
                    Use AI posts, reels, or photoshoot features to see transactions recorded here.
                  </p>
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-text-muted">
                    <thead className="text-xs uppercase bg-surface-elevated/50 text-text-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Date &amp; Time</th>
                        <th className="px-6 py-4 font-medium">Action / Feature</th>
                        <th className="px-6 py-4 font-medium">Credits Changed</th>
                        <th className="px-6 py-4 font-medium">Balance After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((tx, idx) => (
                        <tr
                          key={tx.id || idx}
                          className="border-b border-border/50 hover:bg-surface-elevated/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-xs font-mono">
                            {tx.created_at
                              ? format(new Date(tx.created_at), "MMM d, yyyy h:mm a")
                              : "Recent"}
                          </td>
                          <td className="px-6 py-4 font-medium text-white">
                            {tx.action || (tx as any).transaction_type || (tx as any).feature || "Credit Adjustment"}
                          </td>
                          <td
                            className={`px-6 py-4 font-bold ${
                              tx.amount < 0 ? "text-red-400" : "text-emerald-400"
                            }`}
                          >
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount}
                          </td>
                          <td className="px-6 py-4 font-semibold text-white">{tx.balance_after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
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
          setActiveReportTab("transactions");
          setUpgradeSuccess(`Payment for order ${confirmedOrderId} verified and plan activated!`);
          setTimeout(() => {
            reportsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }}
      />
    </div>
  );
}
