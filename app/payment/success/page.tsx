"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Download,
  FileText,
} from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { subscriptionService } from "@/services/subscription.service";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { generateReceiptPdf, formatINR } from "@/lib/receipt-generator";

type TransactionDisplayData = {
  plan_id?: string;
  amount?: number;
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId =
    searchParams.get("order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("sub_id") ||
    searchParams.get("subscription_id");

  const [status, setStatus] = useState<"loading" | "success" | "pending" | "failed" | "cancelled">("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [transactionData, setTransactionData] = useState<TransactionDisplayData | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVerifyingNow, setIsVerifyingNow] = useState(false);
  const displayStatus = orderId ? status : "failed";

  const isSuccessStatus = (s?: string) => {
    const lower = (s || "").toLowerCase().trim();
    return (
      lower === "success" ||
      lower === "active" ||
      lower === "completed" ||
      lower === "authenticated" ||
      lower === "paid"
    );
  };

  const isPendingStatus = (s?: string) => {
    const lower = (s || "").toLowerCase().trim();
    return (
      lower === "pending" ||
      lower === "initiated" ||
      lower === "processing" ||
      lower === "initialized" ||
      lower === "approval_pending" ||
      lower === "bank_approval_pending" ||
      lower === "authenticating"
    );
  };

  const isFailureStatus = (s?: string) => {
    const lower = (s || "").toLowerCase().trim();
    return [
      "failed",
      "failure",
      "rejected",
      "expired",
      "terminated",
      "auth_failed",
      "authorization_failed",
      "subscription_failed",
    ].includes(lower);
  };

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;

    const verifyTransaction = async () => {
      try {
        setIsVerifyingNow(true);

        // 1. Instant check with server-side provider sync
        const verifyRes = await paymentService.verifyPayment(orderId);
        if (!isMounted) return;

        if (verifyRes.verified || isSuccessStatus(verifyRes.status)) {
          subscriptionService.getMySubscription().catch(() => {});
          subscriptionService.getCreditTransactions().catch(() => {});
          setTransactionData(verifyRes);
          setStatus("success");
          return;
        }

        // 2. Fallback check with live subscription status
        const statusRes = await paymentService.getPaymentStatus(orderId);
        if (!isMounted) return;

        if (isSuccessStatus(statusRes.status)) {
          subscriptionService.getMySubscription().catch(() => {});
          subscriptionService.getCreditTransactions().catch(() => {});
          setTransactionData(statusRes);
          setStatus("success");
          return;
        }

        // 3. Fast 1-second polling if pending confirmation
        if (isPendingStatus(statusRes.status) || isPendingStatus(verifyRes.status)) {
          if (retryCount < 30) {
            setStatus("pending");
            setTimeout(() => {
              if (isMounted) setRetryCount((r) => r + 1);
            }, 1000);
          } else {
            setStatus("pending");
          }
        } else if (
          (statusRes.status || "").toLowerCase() === "cancelled" ||
          (verifyRes.status || "").toLowerCase() === "cancelled"
        ) {
          setStatus("cancelled");
        } else if (isFailureStatus(statusRes.status) || isFailureStatus(verifyRes.status)) {
          setStatus("failed");
        } else {
          // Unknown provider statuses can be transient; never report failure
          // unless the provider explicitly returns a terminal failure status.
          if (retryCount < 30) {
            setStatus("pending");
            setTimeout(() => {
              if (isMounted) setRetryCount((r) => r + 1);
            }, 1000);
          } else {
            setStatus("pending");
          }
        }
      } catch (error) {
        console.error("Fast verify error:", error);
        if (retryCount < 10) {
          setTimeout(() => {
            if (isMounted) setRetryCount((r) => r + 1);
          }, 1000);
        } else if (isMounted) {
          setStatus("pending");
        }
      } finally {
        if (isMounted) setIsVerifyingNow(false);
      }
    };

    verifyTransaction();

    return () => {
      isMounted = false;
    };
  }, [orderId, retryCount]);

  // Auto-redirect to dashboard when payment is verified
  useEffect(() => {
    if (status !== "success" || isPaused || isDownloading) return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard?payment=success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, isPaused, isDownloading, router]);

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true);
      setIsPaused(true);
      await generateReceiptPdf({
        order_id: orderId || undefined,
        plan_id: transactionData?.plan_id,
        amount: transactionData?.amount,
        status: "success",
        payment_gateway: "Cashfree Subscriptions",
        payment_mode: "AutoPay Mandate",
        user,
      });
    } catch (err) {
      console.error("Receipt generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (displayStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <Loader2 className="w-12 h-12 text-brand-purple animate-spin" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Verifying Payment with Provider...</h2>
        <p className="text-sm text-text-muted max-w-sm">
          Please wait while our secure server verifies transaction status directly with the gateway.
        </p>
      </div>
    );
  }

  if (displayStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <RefreshCw className="w-7 h-7 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Payment Processing</h2>
        <p className="text-sm text-text-muted max-w-md">
          We are still checking your transaction with the payment provider. If your account was charged, please do not retry yet.
        </p>
        <div className="text-xs text-purple-300 font-mono flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
          <span>Syncing mandate with Cashfree &amp; Bank ({retryCount}/30s)...</span>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => setRetryCount(0)}
            disabled={isVerifyingNow}
            variant="outline"
            className="border-border text-white hover:bg-surface-elevated cursor-pointer"
          >
            {isVerifyingNow ? "Checking Live..." : "Check Status Now"}
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-brand-gradient text-white hover:opacity-90 cursor-pointer"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (displayStatus === "cancelled") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Payment Cancelled</h2>
        <p className="text-sm text-text-muted max-w-md">
          This payment was cancelled. No charges were deducted, and your subscription status remains unchanged.
        </p>
        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => router.push("/subscription")}
            className="bg-brand-gradient text-white hover:opacity-90 cursor-pointer"
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-border text-white hover:bg-surface-elevated cursor-pointer"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (displayStatus === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Payment Verification Failed</h2>
        <p className="text-sm text-text-muted max-w-md">
          We could not verify a successful transaction for this order. Please retry or contact support if amount was deducted.
        </p>
        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => router.push("/subscription")}
            className="bg-brand-gradient text-white hover:opacity-90 cursor-pointer"
          >
            Retry Payment
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-border text-white hover:bg-surface-elevated cursor-pointer"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Payment Successful!</h2>
        <p className="text-sm text-text-muted mt-1 max-w-md">
          Your transaction has been officially verified. Your active plan and AI credits have been updated.
        </p>
      </div>

      {/* Transaction Confirmation Report Card */}
      <div className="w-full max-w-md bg-white/[0.04] border border-white/10 rounded-2xl p-5 text-left space-y-3 text-xs mt-2 shadow-xl backdrop-blur-sm">
        <div className="flex justify-between items-center text-text-muted pb-2 border-b border-white/5">
          <span>Order ID</span>
          <span className="font-mono text-white font-semibold">{orderId}</span>
        </div>
        {transactionData?.plan_id && (
          <div className="flex justify-between items-center text-text-muted">
            <span>Plan Activated</span>
            <span className="text-purple-300 font-bold uppercase">{transactionData.plan_id}</span>
          </div>
        )}
        {transactionData?.amount && (
          <div className="flex justify-between items-center text-text-muted">
            <span>Total Amount Paid</span>
            <span className="text-white font-bold text-sm">{formatINR(transactionData.amount)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-text-muted">
          <span>Payment Gateway</span>
          <span className="text-slate-300 font-medium">Cashfree AutoPay</span>
        </div>
        <div className="flex justify-between items-center text-text-muted pt-1 border-t border-white/5">
          <span>Verification Status</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Verified &amp; Active
          </span>
        </div>
      </div>

      {/* Primary Action: Download Official Tax Invoice (PDF) */}
      <div className="w-full max-w-md pt-2">
        <Button
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold py-3 rounded-2xl shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Official Receipt...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Official Tax Invoice (PDF)</span>
            </>
          )}
        </Button>
      </div>

      <div className="text-xs text-text-muted flex items-center gap-2 pt-1">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-purple" />
        <span>
          {isPaused
            ? "Auto-redirect paused while viewing receipt."
            : `Automatically redirecting to dashboard in ${redirectCountdown}s...`}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full max-w-md">
        <Button
          onClick={() => router.push("/dashboard?payment=success")}
          className="flex-1 bg-brand-gradient text-white hover:opacity-90 font-bold cursor-pointer"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
        <Button
          onClick={() => router.push("/subscription?tab=transactions")}
          variant="outline"
          className="border-border text-white hover:bg-surface-elevated cursor-pointer"
        >
          View All Transactions
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500 min-h-[70vh] flex items-center justify-center">
      <div className="bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-2xl w-full max-w-xl">
        <Suspense
          fallback={
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
