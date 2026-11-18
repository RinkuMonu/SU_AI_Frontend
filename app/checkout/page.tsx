"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Zap,
  Smartphone,
  CheckCircle2,
  Building,
} from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { subscriptionService } from "@/services/subscription.service";
import { launchCashfreeCheckout } from "@/lib/cashfree";
import {
  AVAILABLE_PLANS,
  BillingCycle,
  PlanDefinition,
  calculatePlanPriceWithGST,
  formatCurrencyINR,
} from "@/lib/plan-onboarding";
import { useAuth } from "@/components/auth/AuthProvider";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // Extract query parameters
  const paramSessionId = searchParams.get("session_id") || searchParams.get("payment_session_id") || "";
  const paramOrderId = searchParams.get("order_id") || searchParams.get("reference") || searchParams.get("sub_id") || "";
  const paramPlan = (searchParams.get("plan") || "PRO_STARTER").toUpperCase().trim();
  const paramCycle = (searchParams.get("cycle") || searchParams.get("billing_cycle") || "monthly").toLowerCase() as BillingCycle;
  const paramAmount = searchParams.get("amount") ? parseFloat(searchParams.get("amount") || "0") : 0;
  const paramMode = (searchParams.get("mode") || "ALL").toUpperCase() as "ALL" | "AUTOPAY";

  // State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(paramPlan);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(paramCycle);
  const [paymentMode, setPaymentMode] = useState<"ALL" | "AUTOPAY">(paramMode);
  const [sessionId, setSessionId] = useState<string>(paramSessionId);
  const [orderId, setOrderId] = useState<string>(paramOrderId);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");

  // Find plan details
  const activePlan: PlanDefinition =
    AVAILABLE_PLANS.find((p) => p.id === selectedPlanId) ||
    AVAILABLE_PLANS.find((p) => p.id === "PRO_STARTER") ||
    AVAILABLE_PLANS[1];

  // Price calculations
  const priceInfo = calculatePlanPriceWithGST(activePlan.monthlyPrice, selectedCycle);
  const displayTotal = paramAmount > 0 && paramSessionId ? paramAmount : priceInfo.totalPayable;
  const displayBase = paramAmount > 0 && paramSessionId ? priceInfo.basePrice : priceInfo.basePrice;
  const displayGst = paramAmount > 0 && paramSessionId ? priceInfo.gstAmount : priceInfo.gstAmount;

  // Initialize phone from user if logged in
  useEffect(() => {
    if (user) {
      const rawUserPhone = user.phone || (user as any).phone_number || "";
      const uPhone = String(rawUserPhone).replace(/\D/g, "");
      if (uPhone) setPhone(uPhone.slice(-10));
    }
  }, [user]);

  // Initiate Cashfree checkout
  const handleProceedToPayment = async () => {
    if (isProcessing) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      let activeSession = sessionId;
      let activeOrder = orderId;

      // If we don't have a session ID yet, generate one via backend
      if (!activeSession) {
        const createRes = await paymentService.createPayment(
          selectedPlanId,
          selectedCycle,
          phone || undefined,
          paymentMode
        );

        activeSession = (createRes.payment_session_id || createRes.subscription_session_id || "").trim();
        activeOrder = createRes.order_id || createRes.subscription_id || "";

        if (activeSession) {
          setSessionId(activeSession);
          setOrderId(activeOrder);
        } else if (createRes.payment_url) {
          window.location.href = createRes.payment_url;
          return;
        } else {
          throw new Error("Unable to create Cashfree payment session. Please retry.");
        }
      }

      if (typeof window !== "undefined" && activeOrder) {
        sessionStorage.setItem("pending_payment_order_id", activeOrder);
      }

      // Launch Cashfree SDK checkout
      const result = await launchCashfreeCheckout({
        paymentSessionId: activeSession,
        environment: "production",
        redirectTarget: "_self",
      });

      if (result.status === "SUCCESS") {
        router.push(`/payment/success?order_id=${encodeURIComponent(activeOrder)}`);
        return;
      }

      if (result.status === "CANCELLED") {
        setErrorMessage("Payment was cancelled. You have not been charged. You can retry whenever ready.");
        setIsProcessing(false);
        return;
      }

      if (result.status === "FAILED") {
        setErrorMessage(result.error || "Payment was not successful. Please try another card or UPI.");
        setIsProcessing(false);
        return;
      }
    } catch (err: any) {
      console.error("Checkout execution error:", err);
      const detail = err?.response?.data?.detail || err?.message || "Failed to launch payment checkout.";
      setErrorMessage(detail);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
          <Link
            href="/subscription"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Plans</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Bank Grade Security</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DhandaGrow AI • Official Checkout</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Complete Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
              Subscription Upgrade
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Unlock AI Post Maker, HD Photoshoots, CRM automation, and high-conversion reels for your business.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Payment Notification</p>
              <p className="mt-0.5 text-xs text-red-200/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Main Grid: Plan & Payment Mode (Left) + Order Summary & Pay (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Plan Info & Payment Methods (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            {/* Selected Plan Details Card */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    {activePlan.planBadge}
                  </span>
                  <h3 className="text-2xl font-bold mt-1 text-white">{activePlan.name} Plan</h3>
                  <p className="text-xs text-gray-400 mt-1">{activePlan.tagline}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 font-semibold">
                    {activePlan.creditBadge}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-5 pt-5 border-t border-white/10 space-y-2.5">
                {activePlan.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Details (Cards, UPI, NetBanking) */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-pink-500/40 bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-transparent backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-semibold text-white">Payment Method: Cards, UPI & Net Banking</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cards Enabled • Instant
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-white">
                      All Credit &amp; Debit Cards, UPI &amp; Net Banking
                    </h5>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Pay securely with any Visa, MasterCard, RuPay debit/credit card, Google Pay, PhonePe, Paytm, or 50+ Banks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Payment Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-pink-500/30 text-pink-300 font-medium">💳 Credit Cards (Visa, MC, RuPay)</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-purple-500/30 text-purple-300 font-medium">💳 Debit Cards (All Banks)</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-emerald-500/30 text-emerald-300 font-medium">⚡ Instant UPI (GPay, PhonePe, Paytm)</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-blue-500/30 text-blue-300 font-medium">🏦 50+ Net Banking Banks</span>
              </div>
            </div>

            {/* Supported Payment Logos & Security Badges */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Accepted Payment Methods
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">Credit Cards</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">Debit Cards</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">UPI (GPay / PhonePe / Paytm)</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">50+ Net Banking Banks</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">AutoPay Mandate</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative">
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-white/10">
                Order Summary
              </h3>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>{activePlan.name} Plan ({selectedCycle})</span>
                  <span className="font-semibold text-white">{formatCurrencyINR(displayBase)}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>18% GST (CGST 9% + SGST 9%)</span>
                  <span>{formatCurrencyINR(displayGst)}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-white block">Total Payable</span>
                    <span className="text-[11px] text-gray-400">Inclusive of all taxes</span>
                  </div>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
                    {formatCurrencyINR(displayTotal)}
                  </span>
                </div>
              </div>

              {/* Pay Now Action Button */}
              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Opening Secure Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay {formatCurrencyINR(displayTotal)} Securely</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Guarantee Notes */}
              <div className="mt-5 space-y-2 text-[11px] text-gray-400 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>RBI Compliant Cashfree Payment Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Instant Plan Activation & Credits Credited</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                  <span>Official GST Tax Invoice sent to your email</span>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-gray-400">
              Need assistance? Email us at{" "}
              <a href="mailto:support@dhandagrow.com" className="text-pink-400 hover:underline">
                support@dhandagrow.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070913] flex items-center justify-center text-white">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin text-pink-400" />
            <span>Loading Checkout...</span>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
