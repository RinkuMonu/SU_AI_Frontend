"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  FileText,
  Download,
  Loader2,
  X,
  CreditCard,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { subscriptionService } from "@/services/subscription.service";
import Link from "next/link";

interface BillingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BillingReportModal({ isOpen, onClose }: BillingReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionService.getBillingReport();
      setReport(data);
    } catch (err: any) {
      console.error("Failed to load billing report", err);
      setError(err?.response?.data?.detail || "Failed to load billing report from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    try {
      setDownloading(true);
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dhandagrow-billing-report-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  // Auto-fetch when modal opens if not already loaded
  if (isOpen && !report && !loading && !error) {
    fetchReport();
  }

  if (!isOpen) return null;

  const currentSub = report?.current_subscription;
  const transactions = report?.payment_transactions || report?.transactions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1322] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-pink-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Billing &amp; Payment Report</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Audit transactions, active subscription &amp; credit ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
              <p className="text-sm text-text-muted">Generating audit report from database...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
              <button
                onClick={fetchReport}
                className="text-xs font-semibold underline hover:no-underline ml-4 shrink-0 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && report && (
            <>
              {/* Current Status Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                  <span className="text-xs font-medium text-text-muted">Current Plan</span>
                  <div className="text-xl font-bold text-white mt-2 uppercase">
                    {currentSub?.plan_name || currentSub?.plan_id || "FREE"}
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {currentSub?.status || "Active"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                  <span className="text-xs font-medium text-text-muted">AI Credits</span>
                  <div className="text-xl font-bold text-brand-purple mt-2 flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-brand-purple" />
                    <span>{currentSub?.credits_remaining ?? 0}</span>
                  </div>
                  <span className="text-[11px] text-text-muted mt-1">Available for creations</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                  <span className="text-xs font-medium text-text-muted">Billing Cycle</span>
                  <div className="text-xl font-bold text-white mt-2 capitalize">
                    {currentSub?.billing_cycle || "Monthly"}
                  </div>
                  <span className="text-[11px] text-text-muted mt-1">Auto-renew cycle</span>
                </div>
              </div>

              {/* Payment Transactions Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>Recent Payment Transactions</span>
                  </h3>
                  <span className="text-xs text-text-muted font-medium">
                    {transactions.length} record{transactions.length === 1 ? "" : "s"}
                  </span>
                </div>

                {transactions.length === 0 ? (
                  <div className="py-8 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/5 text-text-muted text-xs">
                    No transactions recorded yet. Choose a plan to initiate payment.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {transactions.map((tx: any) => {
                      const isSuccess = tx.status === "success";
                      const isPending = tx.status === "pending" || tx.status === "initiated";
                      return (
                        <div
                          key={tx.order_id || tx.id}
                          className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="space-y-0.5">
                            <div className="font-mono text-slate-200 font-semibold flex items-center gap-2">
                              <span>{tx.order_id || tx.id}</span>
                              {tx.purchased_credits && (
                                <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/10 px-1.5 py-0.2 rounded-full border border-purple-500/20">
                                  {tx.purchased_credits} Credits
                                </span>
                              )}
                            </div>
                            <div className="text-text-muted text-[11px]">
                              {tx.plan_name || tx.plan_id || "Plan"} &bull;{" "}
                              {tx.created_at
                                ? format(new Date(tx.created_at), "MMM d, yyyy h:mm a")
                                : "Recent"}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-white text-sm">
                              ₹{(tx.amount || 0).toLocaleString("en-IN")}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                isSuccess
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : isPending
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-red-500/20 text-red-300 border border-red-500/30"
                              }`}
                            >
                              {isSuccess ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : isPending ? (
                                <Clock className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              <span>{tx.status}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B0E1B]">
          <Link
            href="/subscription"
            onClick={onClose}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Manage All Subscriptions &amp; Plans</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!report || downloading}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download Audit Report (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
