"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Zap,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Crown,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { subscriptionService } from "@/services/subscription.service";
import { paymentService, CreatePaymentResponse } from "@/services/payment.service";
import { Subscription, PlanConfig } from "@/types/subscription";
import {
  AVAILABLE_PLANS,
  BillingCycle,
  PlanDefinition,
  calculatePlanPrice,
  formatCurrencyINR,
  isQualifyingPlanActive,
  normalizePlanId,
} from "@/lib/plan-onboarding";
import { launchCashfreeCheckout } from "@/lib/cashfree";

interface AvailablePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanActivated?: (planId: string) => void;
  isModal?: boolean;
}

export function AvailablePlansModal({
  isOpen,
  onClose,
  onPlanActivated,
  isModal = true,
}: AvailablePlansModalProps) {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>("monthly");
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [backendPlans, setBackendPlans] = useState<Record<string, PlanConfig>>({});
  const [mergedPlans, setMergedPlans] = useState<PlanDefinition[]>(AVAILABLE_PLANS);
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<string | null>(null);

  const loadPlansData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [subRes, plansRes] = await Promise.allSettled([
        subscriptionService.getMySubscription(),
        subscriptionService.getPlans(),
      ]);

      let sub: Subscription | null = null;
      if (subRes.status === "fulfilled") {
        sub = subRes.value;
        setCurrentSubscription(sub);
      }

      let fetchedPlans: Record<string, PlanConfig> = {};
      if (plansRes.status === "fulfilled") {
        fetchedPlans = plansRes.value || {};
        setBackendPlans(fetchedPlans);
      }

      const updated = AVAILABLE_PLANS.map((def) => {
        const beKey = Object.keys(fetchedPlans).find(
          (k) => k.toUpperCase() === def.id.toUpperCase()
        );
        const bePlan = beKey ? fetchedPlans[beKey] : null;
        if (bePlan && typeof bePlan.price === "number") {
          return { ...def, monthlyPrice: bePlan.price };
        }
        return def;
      });

      setMergedPlans(updated);
    } catch (err: any) {
      console.warn("Failed to fetch backend subscription plans", err);
      setErrorMessage("Unable to fetch latest plan pricing. Showing default rates.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) loadPlansData();
  }, [isOpen, loadPlansData]);

  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id") || params.get("orderId");
    const paymentStatus = params.get("status");

    if (orderId) {
      verifyPaymentOrder(orderId);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      setErrorMessage("Payment was not completed. Please try again or select another plan.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isOpen]);

  const verifyPaymentOrder = async (orderId: string) => {
    setProcessingPlanId("VERIFYING");
    setPendingPaymentOrder(orderId);
    setErrorMessage(null);

    try {
      const statusRes = await paymentService.getPaymentStatus(orderId);
      if (statusRes.status === "success") {
        const latestSub = await subscriptionService.getMySubscription();
        setCurrentSubscription(latestSub);
        setSuccessMessage("Plan activated successfully! Welcome to your new plan.");
        setPendingPaymentOrder(null);
        if (onPlanActivated) onPlanActivated(latestSub.plan_id);
      } else if (statusRes.status === "pending") {
        setErrorMessage("Payment is being processed by your bank. Please check back in a few moments.");
      } else {
        setErrorMessage(statusRes.message || "Payment verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to verify payment status", err);
      try {
        const latestSub = await subscriptionService.getMySubscription();
        if (latestSub && isQualifyingPlanActive(latestSub)) {
          setCurrentSubscription(latestSub);
          setSuccessMessage("Plan activated successfully!");
          if (onPlanActivated) onPlanActivated(latestSub.plan_id);
        } else {
          setErrorMessage("Unable to verify payment status with backend. Please retry.");
        }
      } catch (_) {
        setErrorMessage("Unable to verify payment. Please retry.");
      }
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleSelectPlan = async (plan: PlanDefinition) => {
    if (processingPlanId) return;
    setProcessingPlanId(plan.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (plan.monthlyPrice === 0 || plan.id === "FREE") {
        await subscriptionService.upgradePlan("FREE");
        const updatedSub = await subscriptionService.getMySubscription();
        setCurrentSubscription(updatedSub);
        setSuccessMessage("Free Plan activated successfully!");
        if (onPlanActivated) onPlanActivated("FREE");
      } else {
        const response = await paymentService.createPayment(plan.id, selectedCycle);
        const sessionId = response.payment_session_id || response.subscription_session_id;
        await launchCashfreeCheckout({
          paymentSessionId: sessionId,
          environment: response.environment || "production",
          fallbackUrl: response.payment_url,
        });
        return;
      }
    } catch (err: any) {
      console.error(`Error activating plan ${plan.id}`, err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Payment initiation failed. Please verify your connection and try again.";
      setErrorMessage(detail);
      setProcessingPlanId(null);
    }
  };

  const toggleFeatures = (planId: string) => {
    setExpandedFeatures((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  if (!isOpen) return null;

  const currentActivePlanId = normalizePlanId(currentSubscription?.plan_id);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="available-plans-title"
      className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[92vh] bg-gradient-to-b from-[#130B24] via-[#0E071D] to-[#070310] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl text-white flex flex-col overflow-hidden"
    >
      {/* Background radial glows */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ===== HEADER (Fixed / Non-scrolling) ===== */}
      <div className="shrink-0 relative z-10 px-4 sm:px-6 pt-4 sm:pt-5 pb-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              aria-label="Decline and close for now"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all border border-white/10 shadow-sm cursor-pointer"
              title="Decline for now"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h2
              id="available-plans-title"
              className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2"
            >
              <span>Available</span>
              <span className="bg-gradient-to-r from-[#FF6B8B] via-[#E040FB] to-[#A855F7] bg-clip-text text-transparent">
                Plans
              </span>
            </h2>
          </div>

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-purple-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Loading...</span>
            </div>
          )}
        </div>

        {/* Alerts / Banners */}
        {currentSubscription && isQualifyingPlanActive(currentSubscription) && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-purple-500/30 flex items-center gap-2.5 text-xs text-purple-200 animate-in fade-in">
            <Crown className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400/20" />
            <span className="leading-snug">
              Active plan:{" "}
              <strong>
                {mergedPlans.find((p) => p.id.toUpperCase() === currentActivePlanId)?.name ||
                  currentActivePlanId}
              </strong>
              . Switch or upgrade below.
            </span>
          </div>
        )}

        {successMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-between gap-2 text-xs text-red-200 animate-in fade-in">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
            <button
              onClick={loadPlansData}
              aria-label="Retry loading plans"
              className="p-1.5 text-red-300 hover:text-white shrink-0 rounded-md hover:bg-white/5"
              title="Retry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Billing Cycle Tabs */}
        <div className="mt-4 flex justify-center">
          <div className="bg-[#1C1335] p-1 sm:p-1.5 rounded-full border border-white/10 flex items-center gap-0.5 sm:gap-1 w-full max-w-sm shadow-inner">
            {(
              [
                { cycle: "monthly" as BillingCycle, label: "Monthly", badge: null },
                { cycle: "quarterly" as BillingCycle, label: "Quarterly", badge: "-10%" },
                { cycle: "yearly" as BillingCycle, label: "Yearly", badge: "-20%" },
              ] as const
            ).map(({ cycle, label, badge }) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setSelectedCycle(cycle)}
                className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                  selectedCycle === cycle
                    ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>{label}</span>
                {badge && (
                  <span
                    className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-px rounded-full font-bold ${
                      cycle === "quarterly"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-pink-500/20 text-pink-300"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SCROLLABLE PLAN CARDS ===== */}
      <div className="mt-4 px-4 sm:px-6 pb-2 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar relative z-10 flex-1 min-h-0">
        {mergedPlans.map((plan) => {
          const isCurrent = currentActivePlanId === plan.id.toUpperCase();
          const isProcessing = processingPlanId === plan.id;
          const priceInfo = calculatePlanPrice(plan.monthlyPrice, selectedCycle);
          const isExpanded = Boolean(expandedFeatures[plan.id]);

          return (
            <div
              key={plan.id}
              className={`rounded-2xl transition-all relative overflow-hidden ${
                isCurrent
                  ? "bg-[#1E1238] border-2 border-[#EC4899] shadow-lg shadow-pink-500/10"
                  : "bg-[#18102E]/90 border border-white/10 hover:border-purple-500/30"
              }`}
            >
              {/* Card Inner Content */}
              <div className="p-4 sm:p-5">
                {/* Row 1: Badge + Current Plan Tag + Credit Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-block bg-[#4C1D95]/80 text-[#E9D5FF] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider border border-purple-400/20">
                    {plan.planBadge}
                  </span>

                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-white bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] shadow-sm">
                      <Crown className="w-3 h-3 fill-current" />
                      Current Plan
                    </span>
                  )}

                  <span className="ml-auto inline-flex items-center gap-1 bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-current" />
                    <span>{plan.creditBadge}</span>
                  </span>
                </div>

                {/* Row 2: Plan Name + Price */}
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl sm:text-2xl font-extrabold text-white whitespace-nowrap">
                      {formatCurrencyINR(priceInfo.displayPrice)}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                      {priceInfo.intervalLabel}
                    </div>
                    {selectedCycle !== "monthly" && plan.monthlyPrice > 0 && (
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[10px] text-gray-500 line-through">
                          {formatCurrencyINR(plan.monthlyPrice)}/mo
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400">
                          {selectedCycle === "quarterly" ? "Save 10%" : "Save 20%"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Feature Highlights — responsive 1-col on mobile, 3-col on sm+ */}
                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {plan.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-200">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                      <span className="leading-snug truncate">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Expanded Features */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 animate-in fade-in duration-200">
                    <div className="text-[10px] sm:text-[11px] font-semibold text-purple-300 uppercase tracking-wider mb-1">
                      Full Plan Inclusions:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {plan.allFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-300">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Row 4: Actions */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleFeatures(plan.id)}
                    className="text-purple-400 hover:text-purple-300 text-[11px] sm:text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{isExpanded ? "Hide features" : "View all features"}</span>
                    <ChevronDown
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="py-1.5 sm:py-2 px-4 sm:px-5 rounded-full text-[11px] sm:text-xs font-bold bg-white/10 text-gray-300 border border-white/10 cursor-default flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                      <span>Active</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isProcessing || processingPlanId !== null}
                      className={`py-1.5 sm:py-2 px-4 sm:px-5 rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-[#BE32FF] via-[#E040FB] to-[#FF6B8B] hover:opacity-95 text-white"
                          : "bg-[#2D1B54] hover:bg-[#3D2570] text-white border border-white/10"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>
                          {plan.monthlyPrice === 0
                            ? "Select Free"
                            : isCurrent
                            ? "Active"
                            : "Select Plan"}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== FOOTER (Fixed / Non-scrolling) ===== */}
      <div className="shrink-0 relative z-10 px-4 sm:px-6 py-3 border-t border-white/5 text-center">
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] sm:text-xs text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Skip for now (you can review and upgrade later in Billing & Plans)
        </button>
      </div>
    </div>
  );

  if (!isModal) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {modalContent}
    </div>
  );
}
