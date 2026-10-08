"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle, RefreshCw, Download } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { subscriptionService } from "@/services/subscription.service";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<"loading" | "success" | "pending" | "failed" | "cancelled">("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    let isMounted = true;

    const checkStatus = async () => {
      try {
        const response = await paymentService.getPaymentStatus(orderId);
        
        if (!isMounted) return;

        if (response.status === "success" || response.status === "completed") {
          try {
            await Promise.all([
              subscriptionService.getMySubscription(),
              subscriptionService.getCreditTransactions()
            ]);
          } catch (e) {
            console.error("Error refreshing subscription data:", e);
          }
          setStatus("success");
        } else if (response.status === "pending" || response.status === "processing") {
          if (retryCount < 5) {
            setStatus("pending");
            setTimeout(() => {
              if (isMounted) setRetryCount(r => r + 1);
            }, 3000);
          } else {
            setStatus("pending");
          }
        } else if (response.status === "cancelled" || response.status === "canceled") {
           setStatus("cancelled");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Failed to fetch payment status", error);
        if (isMounted) setStatus("failed");
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [orderId, retryCount]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <Loader2 className="w-12 h-12 text-brand-purple animate-spin" />
        <h2 className="text-2xl font-bold text-white">Verifying Payment...</h2>
        <p className="text-text-muted">Please wait while we confirm your payment securely.</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <RefreshCw className="w-12 h-12 text-yellow-400 animate-spin" />
        <h2 className="text-2xl font-bold text-white">Payment Processing</h2>
        <p className="text-text-muted">We are confirming your payment.</p>
        <Button onClick={() => setRetryCount(0)} variant="outline" className="mt-4 border-border text-white hover:bg-surface-elevated">
          Check Again
        </Button>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">Payment Cancelled</h2>
        <p className="text-text-muted">No amount was added to your SevenUnique subscription.</p>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => router.push("/subscription")} className="bg-brand-gradient text-white hover:opacity-90">
            Try Again
          </Button>
          <Button onClick={() => router.push("/subscription")} variant="outline" className="border-border text-white hover:bg-surface-elevated">
            Back to Billing
          </Button>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Payment Failed</h2>
        <p className="text-text-muted">Your payment was not completed.</p>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => router.push("/subscription")} className="bg-brand-gradient text-white hover:opacity-90">
            Try Again
          </Button>
          <Button onClick={() => router.push("/subscription")} variant="outline" className="border-border text-white hover:bg-surface-elevated">
            Back to Billing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <CheckCircle2 className="w-16 h-16 text-green-500" />
      <h2 className="text-3xl font-bold text-white">Payment Successful!</h2>
      <p className="text-text-muted text-lg max-w-md">
        Your plan has been activated.<br/>
        Credits have been added to your account.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button onClick={() => window.print()} className="bg-green-600 text-white hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        <Button onClick={() => router.push("/dashboard")} className="bg-brand-gradient text-white hover:opacity-90">
          Go to Dashboard
        </Button>
        <Button onClick={() => router.push("/subscription")} variant="outline" className="border-border text-white hover:bg-surface-elevated">
          View Billing
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500 h-full flex items-center justify-center">
      <div className="bg-surface border border-border rounded-xl p-8 shadow-2xl w-full max-w-2xl">
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
