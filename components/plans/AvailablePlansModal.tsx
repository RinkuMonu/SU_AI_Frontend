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
import { PaymentModal } from "@/components/payment/PaymentModal";
import { Subscription, PlanConfig } from "@/types/subscription";
import {
  AVAILABLE_PLANS,
  BillingCycle,
  PlanDefinition,
  calculatePlanPrice,
  formatCurrencyINR,
  isQualifyingPlanActive,
} from "@/lib/plan-onboarding";

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
  // Billing cycle tab: "monthly" | "quarterly" | "yearly"
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>("monthly");

  // Dynamic backend data
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [backendPlans, setBackendPlans] = useState<Record<string, PlanConfig>>({});
  const [mergedPlans, setMergedPlans] = useState<PlanDefinition[]>(AVAILABLE_PLANS);

  // UI state
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<string | null>(null);
  const [activePaymentOrder, setActivePaymentOrder] = useState<CreatePaymentResponse | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  /**
   * Loads plans and current subscription from authoritative backend.
   */
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

      // Merge backend prices dynamically without hardcoding
      const updated = AVAILABLE_PLANS.map((def) => {
        // Match backend plan key (e.g. FREE, STARTER, PRO for Growth, BUSINESS)
        const beKey = Object.keys(fetchedPlans).find(
          (k) => k.toUpperCase() === def.id.toUpperCase()
        );
        const bePlan = beKey ? fetchedPlans[beKey] : null;

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
    } catch (err: any) {
      console.warn("Failed to fetch backend subscription plans", err);
      setErrorMessage("Unable to fetch latest plan pricing. Showing default rates.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPlansData();
    }
  }, [isOpen, loadPlansData]);

  // Check URL query parameters for payment return (e.g. order_id)
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

  /**
   * Verifies payment order status with backend before marking plan active.
   * Strictly enforces backend source of truth rule.
   */
  const verifyPaymentOrder = async (orderId: string) => {
    setProcessingPlanId("VERIFYING");
    setPendingPaymentOrder(orderId);
    setErrorMessage(null);

    try {
      const statusRes = await paymentService.getPaymentStatus(orderId);

      if (statusRes.status === "success") {
        // Payment verified! Re-query authoritative subscription from backend
        const latestSub = await subscriptionService.getMySubscription();
        setCurrentSubscription(latestSub);
        setSuccessMessage(`Plan activated successfully! Welcome to your new plan.`);
        setPendingPaymentOrder(null);

        if (onPlanActivated) {
          onPlanActivated(latestSub.plan_id);
        }
      } else if (statusRes.status === "pending") {
        setErrorMessage("Payment is being processed by your bank. Please check back in a few moments.");
      } else {
        setErrorMessage(statusRes.message || "Payment verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to verify payment status", err);
      // Re-check subscription to see if webhook already updated it
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

  /**
   * Handles plan selection and checkout:
   * - If Free plan: calls backend upgradePlan("FREE")
   * - If Paid plan: creates payment order via paymentService and redirects to checkout gateway
   */
  const handleSelectPlan = async (plan: PlanDefinition) => {
    if (processingPlanId) return; // Prevent duplicate clicks
    setProcessingPlanId(plan.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (plan.monthlyPrice === 0 || plan.id === "FREE") {
        // Free plan selection
        await subscriptionService.upgradePlan("FREE");
        const updatedSub = await subscriptionService.getMySubscription();
        setCurrentSubscription(updatedSub);
        setSuccessMessage("Free Plan activated successfully!");

        if (onPlanActivated) {
          onPlanActivated("FREE");
        }
      } else {
        // Paid plan selection: initiate secure payment flow with chosen billing cycle
        const response = await paymentService.createPayment(plan.id, selectedCycle);

        if (response.order_id) {
          setActivePaymentOrder(response);
          setShowPaymentModal(true);
        } else if (response.payment_url) {
          window.location.href = response.payment_url;
        } else {
          throw new Error("No checkout URL received from payment service.");
        }
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
    setExpandedFeatures((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  if (!isOpen) return null;

  const currentActivePlanId = (currentSubscription?.plan_id || "").toUpperCase();

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="available-plans-title"
      className="relative w-full max-w-xl max-h-[92vh] bg-gradient-to-b from-[#130B24] via-[#0E071D] to-[#070310] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 text-white flex flex-col overflow-hidden"
    >
      {/* Background radial glows */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between shrink-0 relative z-10 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            aria-label="Decline and close for now"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all border border-white/10 shadow-sm cursor-pointer"
            title="Decline for now"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2
            id="available-plans-title"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2"
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
            <span>Loading...</span>
          </div>
        )}
      </div>

      {/* Alerts / Error / Success / Active Plan Banners */}
      {currentSubscription && isQualifyingPlanActive(currentSubscription) && (
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-purple-500/30 flex items-center justify-between gap-3 text-xs text-purple-200 shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Crown className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400/20" />
            <span>
              Your business currently has an active <strong>{mergedPlans.find((p) => p.id.toUpperCase() === currentActivePlanId)?.name || currentActivePlanId}</strong> subscription. Review your inclusions or switch plans below.
            </span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-200 shrink-0 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-between gap-2.5 text-xs text-red-200 shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={loadPlansData}
            aria-label="Retry loading plans"
            className="p-1 text-red-300 hover:text-white shrink-0"
            title="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Billing Cycle Tabs (Monthly, Quarterly, Yearly) */}
      <div className="mt-4 shrink-0 relative z-10 flex justify-center">
        <div className="bg-[#1C1335] p-1.5 rounded-full border border-white/10 flex items-center gap-1 w-full max-w-md shadow-inner">
          <button
            type="button"
            onClick={() => setSelectedCycle("monthly")}
            className={`flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
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
            className={`flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
              selectedCycle === "quarterly"
                ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Quarterly</span>
            <span className="hidden sm:inline text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full">
              -10%
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCycle("yearly")}
            className={`flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
              selectedCycle === "yearly"
                ? "bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Yearly</span>
            <span className="hidden sm:inline text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Stack (Scrollable container) */}
      <div className="mt-5 space-y-4 overflow-y-auto custom-scrollbar pr-1 relative z-10 flex-1">
        {mergedPlans.map((plan) => {
          const isCurrent = currentActivePlanId === plan.id.toUpperCase();
          const isProcessing = processingPlanId === plan.id;
          const priceInfo = calculatePlanPrice(plan.monthlyPrice, selectedCycle);
          const isExpanded = Boolean(expandedFeatures[plan.id]);

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-5 sm:p-6 transition-all relative overflow-hidden ${
                isCurrent
                  ? "bg-[#1E1238] border-2 border-[#EC4899] shadow-lg shadow-pink-500/10"
                  : "bg-[#18102E]/90 border border-white/10 hover:border-purple-500/30"
              }`}
            >
              {/* Current Plan Badge over Top Right */}
              {isCurrent && (
                <div className="absolute top-3 right-4 z-20">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-[#F43F5E] via-[#FB7185] to-[#F59E0B] shadow-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>Current Plan</span>
                  </span>
                </div>
              )}

              {/* Top Row: Plan Badge & Price & Credits */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block bg-[#4C1D95]/80 text-[#E9D5FF] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-400/20">
                    {plan.planBadge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-2.5">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  {/* Credit Badge */}
                  <div className="bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span>{plan.creditBadge}</span>
                  </div>

                  {/* Price display */}
                  <div className="mt-2.5">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {formatCurrencyINR(priceInfo.displayPrice)}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      {priceInfo.intervalLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 3 Feature Highlights (Horizontal Grid / Flex) */}
              <div className="mt-4 pt-3.5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {plan.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 font-bold" />
                    <span className="leading-snug">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Expandable "View all features" Accordion */}
              {isExpanded && (
                <div className="mt-3.5 pt-3 border-t border-white/5 space-y-2 animate-in fade-in duration-200">
                  <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                    Full Plan Inclusions:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.allFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions: View all features toggle & Select/Upgrade Button */}
              <div className="mt-4 pt-3 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => toggleFeatures(plan.id)}
                  className="text-purple-400 hover:text-purple-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{isExpanded ? "Hide features" : "View all features"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div>
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="py-2 px-5 rounded-full text-xs font-bold bg-white/10 text-gray-300 border border-white/10 cursor-default flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Active</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isProcessing || processingPlanId !== null}
                      className={`py-2 px-5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-[#BE32FF] via-[#E040FB] to-[#FF6B8B] hover:opacity-95 text-white"
                          : "bg-[#2D1B54] hover:bg-[#3D2570] text-white border border-white/10"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>{plan.monthlyPrice === 0 ? "Select Free" : "Choose Plan"}</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer text / Decline link */}
      <div className="mt-4 pt-3 border-t border-white/5 text-center shrink-0 relative z-10">
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
        {modalContent}
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        orderData={activePaymentOrder}
        onClose={() => {
          setShowPaymentModal(false);
          setActivePaymentOrder(null);
          setProcessingPlanId(null);
        }}
        onSuccess={async (confirmedOrderId) => {
          setShowPaymentModal(false);
          const latestSub = await subscriptionService.getMySubscription();
          setCurrentSubscription(latestSub);
          setSuccessMessage("Plan verified and activated successfully!");
          if (onPlanActivated) onPlanActivated(latestSub.plan_id);
        }}
      />
    </>
  );
}
