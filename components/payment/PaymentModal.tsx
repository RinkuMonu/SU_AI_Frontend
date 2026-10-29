"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react";
import { paymentService, CreatePaymentResponse } from "@/services/payment.service";
import { subscriptionService } from "@/services/subscription.service";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  isOpen: boolean;
  orderData: CreatePaymentResponse | null;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export function PaymentModal({
  isOpen,
  orderData,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "verifying" | "success" | "cancelled" | "failed">("pending");
  const [statusMessage, setStatusMessage] = useState("Waiting for your payment confirmation...");
  const [copied, setCopied] = useState(false);
  const [verifyingManual, setVerifyingManual] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const [verifiedDetails, setVerifiedDetails] = useState<any>(null);

  const orderId = orderData?.order_id || "";
  const paymentUrl = orderData?.payment_url || "";
  const upiUrl = orderData?.upi_url || (orderId ? `upi://pay?pa=finuniques.zkp@icici&pn=FINUNIQUES&tr=${orderId}&am=${orderData?.amount || 1.0}&cu=INR&mc=4900` : "");
  const amount = orderData?.amount ?? 1;
  const planName = orderData?.plan_name || "Plan Subscription";

  // Stable reference to onSuccess callback to avoid re-triggering polling timers on re-render
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // Render QR Code on canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !upiUrl) return;

    QRCode.toCanvas(
      canvasRef.current,
      upiUrl,
      {
        width: 210,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      },
      (error) => {
        if (error) {
          console.error("QR Code generation error:", error);
        }
      }
    );
  }, [isOpen, upiUrl]);

  // Intercept Browser Back Navigation
  useEffect(() => {
    if (!isOpen || paymentStatus === "success" || paymentStatus === "cancelled") return;

    window.history.pushState({ inPaymentModal: true }, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState({ inPaymentModal: true }, "", window.location.href);
      setShowBackWarning(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, paymentStatus]);

  // Real-time Status Polling Loop
  useEffect(() => {
    if (!isOpen || !orderId || paymentStatus === "success" || paymentStatus === "cancelled") return;

    let isMounted = true;
    let pollTimer: NodeJS.Timeout | null = null;

    const runPoll = async () => {
      if (!isMounted) return;

      try {
        const res = await paymentService.getPaymentStatus(orderId);
        const st = (res.status || "").toLowerCase();

        if (st === "success" || st === "completed") {
          if (!isMounted) return;
          setPaymentStatus("success");
          setStatusMessage("Payment verified successfully!");
          setVerifiedDetails(res);
          try {
            await subscriptionService.getMySubscription();
          } catch (e) {
            console.error("Failed to refresh subscription:", e);
          }
          if (onSuccessRef.current) {
            onSuccessRef.current(orderId);
          }
          return;
        } else if (st === "cancelled" || st === "canceled") {
          if (!isMounted) return;
          setPaymentStatus("cancelled");
          setStatusMessage("This payment was cancelled.");
          return;
        } else if (st === "failed") {
          if (!isMounted) return;
          setPaymentStatus("failed");
          setStatusMessage(res.message || "Payment processing failed. Please retry.");
          return;
        }
      } catch (err) {
        console.error("Status polling check error:", err);
      }

      // Schedule next poll in 2.5 seconds
      if (isMounted) {
        pollTimer = setTimeout(runPoll, 2500);
      }
    };

    // Run first check immediately
    runPoll();

    return () => {
      isMounted = false;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [isOpen, orderId, paymentStatus]);

  // Auto redirect countdown on successful payment
  useEffect(() => {
    if (paymentStatus !== "success") return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/subscription?tab=transactions");
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus, router, onClose]);

  // Manual Instant Verification Trigger
  const handleManualVerify = async () => {
    if (!orderId) return;
    try {
      setVerifyingManual(true);
      setStatusMessage("Verifying status with gateway provider...");

      // 1. Try verify endpoint
      const verifyRes = await paymentService.verifyPayment(orderId);
      const verifySt = (verifyRes.status || "").toLowerCase();

      if (verifyRes.verified || verifySt === "success" || verifySt === "completed") {
        setPaymentStatus("success");
        setStatusMessage("Payment confirmed and active!");
        setVerifiedDetails(verifyRes);
        try {
          await subscriptionService.getMySubscription();
        } catch (e) {}
        if (onSuccessRef.current) {
          onSuccessRef.current(orderId);
        }
        return;
      }

      // 2. Fallback to status check
      const statusRes = await paymentService.getPaymentStatus(orderId);
      const st = (statusRes.status || "").toLowerCase();
      if (st === "success" || st === "completed") {
        setPaymentStatus("success");
        setStatusMessage("Payment confirmed and active!");
        setVerifiedDetails(statusRes);
        try {
          await subscriptionService.getMySubscription();
        } catch (e) {}
        if (onSuccessRef.current) {
          onSuccessRef.current(orderId);
        }
        return;
      }

      setStatusMessage(
        statusRes.message ||
        verifyRes.message ||
        "Payment is still processing with the bank. If you completed payment, it will confirm in a few moments."
      );
    } catch (e: any) {
      // In case of error, still check status in DB
      try {
        const fallbackRes = await paymentService.getPaymentStatus(orderId);
        if (fallbackRes.status === "success") {
          setPaymentStatus("success");
          setStatusMessage("Payment confirmed and active!");
          setVerifiedDetails(fallbackRes);
          if (onSuccessRef.current) {
            onSuccessRef.current(orderId);
          }
          return;
        }
      } catch (_) {}
      setStatusMessage(e?.response?.data?.detail || "Could not verify payment yet. Please ensure payment was finished.");
    } finally {
      setVerifyingManual(false);
    }
  };

  // Back Navigation Options Handlers
  const handleStayAndComplete = () => {
    setShowBackWarning(false);
  };

  const handleCancelPayment = async () => {
    try {
      setIsCancelling(true);
      if (orderId) {
        await paymentService.cancelPayment(orderId);
      }
      setShowBackWarning(false);
      onClose();
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to cancel payment:", err);
      setShowBackWarning(false);
      onClose();
      router.push("/dashboard");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowBackWarning(false);
    onClose();
    router.push("/dashboard");
  };

  const handleViewReportNow = () => {
    onClose();
    router.push("/subscription?tab=transactions");
  };

  const copyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Main Payment Modal */}
      <div className="relative w-full max-w-lg bg-[#0F1322] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-pink-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-brand-purple" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Secure UPI &amp; Gateway Payment
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                <span>Finunique PayIn Gateway</span>
                <span>&bull;</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live 256-bit SSL
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowBackWarning(true)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Leave / Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {paymentStatus === "success" ? (
            /* Successful Payment Confirmation Report */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Payment Confirmed!
                </h3>
                <p className="text-sm text-text-muted mt-1">
                  Your plan has been officially verified and activated.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-text-muted">
                  <span>Order Reference</span>
                  <span className="font-mono text-white font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Plan Activated</span>
                  <span className="text-purple-300 font-bold">{planName}</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Amount Paid</span>
                  <span className="text-white font-bold text-sm">₹{Number(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px]">
                    Verified &amp; Active
                  </span>
                </div>
              </div>

              <div className="pt-2 text-xs text-text-muted flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                <span>Redirecting to your transaction report in {redirectCountdown}s...</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleViewReportNow}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Transaction Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard?payment=success")}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Pending / In-progress Payment View */
            <>
              {/* Plan & Amount Summary Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div>
                  <div className="text-xs text-text-muted">Selected Plan</div>
                  <div className="text-sm font-bold text-white mt-0.5">{planName}</div>
                  <div className="text-[11px] font-mono text-purple-300/80 mt-0.5 flex items-center gap-1">
                    <span>{orderId}</span>
                    <button
                      onClick={copyOrderId}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-muted">Amount Due</div>
                  <div className="text-xl font-extrabold text-white">
                    ₹{Number(amount).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">All taxes incl.</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center relative">
                <div className="bg-white p-2.5 rounded-2xl shadow-xl shadow-purple-950/20 mb-3 border border-purple-200">
                  <canvas ref={canvasRef} className="rounded-lg" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span>Scan with any UPI App</span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED
                  </p>
                </div>

                {/* Direct UPI Intent Link for Mobile Devices */}
                {upiUrl && (
                  <a
                    href={upiUrl}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 cursor-pointer"
                  >
                    <span>Tap here to open installed UPI App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Real-time Status Badge */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500" />
                  </span>
                  <span className="text-xs text-purple-200 font-medium">
                    {statusMessage}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleManualVerify}
                  disabled={verifyingManual}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 underline cursor-pointer disabled:opacity-50"
                >
                  {verifyingManual ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  <span>Verify</span>
                </button>
              </div>

              {/* Alternative Checkout Link */}
              {paymentUrl && (
                <div className="text-center pt-1">
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                    <span>Pay via Cards / NetBanking / Web Checkout</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBackWarning(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                >
                  Cancel / Back
                </button>
                <button
                  type="button"
                  onClick={handleManualVerify}
                  disabled={verifyingManual}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {verifyingManual ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>I Have Completed Payment</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Back-Navigation / Leave Warning Popup Modal */}
      {showBackWarning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="relative w-full max-w-md bg-[#13172B] border border-white/15 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Clock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Leave Payment Screen?
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Your payment for <span className="text-white font-semibold">{planName}</span> (₹{amount}) is currently pending. Please choose an option below:
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* Option 1: Complete Payment */}
              <button
                type="button"
                onClick={handleStayAndComplete}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-md transition-all cursor-pointer"
              >
                Complete Payment
              </button>

              {/* Option 2: Cancel Payment */}
              <button
                type="button"
                onClick={handleCancelPayment}
                disabled={isCancelling}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>Cancel Payment &amp; Return to Dashboard</span>
              </button>

              {/* Option 3: Go to Dashboard */}
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Go to Dashboard (Keep Payment Pending)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
