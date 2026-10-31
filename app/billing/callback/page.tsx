"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function BillingCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const subId =
      searchParams.get("sub_id") ||
      searchParams.get("subscription_id") ||
      searchParams.get("order_id") ||
      searchParams.get("orderId");

    if (subId) {
      router.replace(`/payment/success?sub_id=${encodeURIComponent(subId)}&order_id=${encodeURIComponent(subId)}`);
    } else {
      router.replace("/subscription");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      <p className="text-sm text-gray-400">Verifying your subscription mandate...</p>
    </div>
  );
}

export default function BillingCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    }>
      <BillingCallbackContent />
    </Suspense>
  );
}

