"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500 h-full flex items-center justify-center min-h-[80vh]">
      <div className="bg-surface border border-border rounded-xl p-12 shadow-2xl w-full max-w-lg text-center flex flex-col items-center space-y-6">
        <AlertCircle className="w-16 h-16 text-red-500" />
        
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Failed</h2>
          <p className="text-text-muted text-lg">
            Your payment was not completed.
          </p>
        </div>

        <div className="flex gap-4 w-full justify-center pt-4">
          <Button 
            onClick={() => router.push("/subscription")} 
            className="bg-brand-gradient text-white hover:opacity-90"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => router.push("/subscription")} 
            variant="outline"
            className="border-border text-white hover:bg-surface-elevated"
          >
            Back to Billing
          </Button>
        </div>
      </div>
    </div>
  );
}
