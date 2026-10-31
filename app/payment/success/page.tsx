"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Download,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { subscriptionService } from "@/services/subscription.service";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId =
    searchParams.get("order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("sub_id") ||
    searchParams.get("subscription_id");

  const [status, setStatus] = useState<"loading" | "success" | "pending" | "failed" | "cancelled">("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    let isMounted = true;

    const verifyTransaction = async () => {
      try {
        // Official backend verification with payment provider
        const verifyRes = await paymentService.verifyPayment(orderId);
        if (!isMounted) return;

        const st = (verifyRes.status || "").toLowerCase();
        if (verifyRes.verified || st === "success" || st === "completed") {
          try {
            await Promise.all([
              subscriptionService.getMySubscription(),
              subscriptionService.getCreditTransactions(),
            ]);
          } catch (e) {
            console.error("Error refreshing subscription data:", e);
          }
          setTransactionData(verifyRes);
          setStatus("success");
          return;
        }

        // If not immediately verified, fallback to status poll
        const statusRes = await paymentService.getPaymentStatus(orderId);
        if (!isMounted) return;

        const statusLower = (statusRes.status || "").toLowerCase();
        if (statusLower === "success" || statusLower === "completed") {
          try {
            await Promise.all([
              subscriptionService.getMySubscription(),
              subscriptionService.getCreditTransactions(),
            ]);
          } catch (e) {
            console.error("Error refreshing subscription data:", e);
          }
          setTransactionData(statusRes);
          setStatus("success");
        } else if (statusLower === "pending" || statusLower === "initiated" || statusLower === "processing") {
          if (retryCount < 5) {
            setStatus("pending");
            setTimeout(() => {
              if (isMounted) setRetryCount((r) => r + 1);
            }, 3000);
          } else {
            setStatus("pending");
          }
        } else if (statusLower === "cancelled" || statusLower === "canceled") {
          setStatus("cancelled");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Failed to verify payment status", error);
        if (isMounted) setStatus("failed");
      }
    };

    verifyTransaction();

    return () => {
      isMounted = false;
    };
  }, [orderId, retryCount]);

  // Auto-redirect to dashboard when payment is verified
  useEffect(() => {
    if (status !== "success") return;

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
  }, [status, router]);

  if (status === "loading") {
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

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <RefreshCw className="w-7 h-7 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Payment Processing</h2>
        <p className="text-sm text-text-muted max-w-md">
          Your transaction is currently awaiting confirmation from your bank or UPI provider.
        </p>
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => setRetryCount(0)}
            variant="outline"
            className="border-border text-white hover:bg-surface-elevated cursor-pointer"
          >
            Check Status Again
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

  if (status === "cancelled") {
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

  if (status === "failed") {
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
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left space-y-3 text-xs mt-2">
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
            <span>Amount Paid</span>
            <span className="text-white font-bold text-sm">₹{Number(transactionData.amount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-text-muted">
          <span>Status</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Verified &amp; Active
          </span>
        </div>
      </div>

      <div className="text-xs text-text-muted flex items-center gap-2 pt-2">
        <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
        <span>Automatically redirecting to dashboard in {redirectCountdown}s...</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md">
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
          View Transaction Report
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
