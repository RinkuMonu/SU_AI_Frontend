"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Download,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { paymentService } from "@/services/payment.service";

interface PaymentTransaction {
  id: string;
  order_id: string;
  user_id?: string;
  plan_id?: string;
  plan_name?: string;
  amount: number;
  base_amount?: number;
  gst_amount?: number;
  currency?: string;
  status: "success" | "pending" | "initiated" | "cancelled" | "failed" | string;
  purchased_credits?: number;
  provider_reference?: string;
  external_transaction_id?: string;
  created_at?: string;
  updated_at?: string;
  verified_at?: string;
  failure_reason?: string;
}

export default function TransactionReportPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "PENDING" | "CANCELLED" | "FAILED">("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await subscriptionService.getBillingReport();
      const txs: PaymentTransaction[] = report?.payment_transactions || [];
      setTransactions(txs);
    } catch (err: any) {
      console.error("Failed to load transactions", err);
      setError(err?.response?.data?.detail || "Failed to load transactions from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerifyPending = async (orderId: string) => {
    try {
      setVerifyingOrderId(orderId);
      await paymentService.verifyPayment(orderId);
      await fetchTransactions();
    } catch (err) {
      console.error("Manual verify failed", err);
    } finally {
      setVerifyingOrderId(null);
    }
  };

  const handleExportJSON = () => {
    if (transactions.length === 0) return;
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dhandagrow-transactions-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter & Search logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Status filter
        if (statusFilter !== "ALL") {
          const st = (tx.status || "").toUpperCase();
          if (statusFilter === "PENDING" && (st === "PENDING" || st === "INITIATED")) {
            // match
          } else if (st !== statusFilter) {
            return false;
          }
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchOrder = (tx.order_id || "").toLowerCase().includes(q);
          const matchId = (tx.id || "").toLowerCase().includes(q);
          const matchPlan = (tx.plan_name || tx.plan_id || "").toLowerCase().includes(q);
          const matchRef = (tx.provider_reference || tx.external_transaction_id || "").toLowerCase().includes(q);
          return matchOrder || matchId || matchPlan || matchRef;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [transactions, statusFilter, searchTerm, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  // Statistics calculation
  const stats = useMemo(() => {
    const successList = transactions.filter((t) => t.status === "success");
    const cancelledList = transactions.filter((t) => t.status === "cancelled");
    const failedList = transactions.filter((t) => t.status === "failed");
    const totalSpent = successList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalCredits = successList.reduce((acc, curr) => acc + (curr.purchased_credits || 0), 0);

    return {
      totalCount: transactions.length,
      successCount: successList.length,
      cancelledCount: cancelledList.length,
      failedCount: failedList.length,
      totalSpent,
      totalCredits,
    };
  }, [transactions]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <Link href="/subscription" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Billing &amp; Plans</span>
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Transaction Report</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-brand-purple" />
            <span>Transaction Report</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Official billing and payment gateway audit records across all plans (successful, pending, failed, cancelled).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={fetchTransactions}
            disabled={loading}
            className="border-border hover:bg-surface-elevated text-white text-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleExportJSON}
            disabled={transactions.length === 0}
            className="border-border hover:bg-surface-elevated text-white text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
            <span>Export JSON</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface border-border shadow-md">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-text-muted">Total Orders</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.totalCount}</div>
            <span className="text-[11px] text-text-muted mt-0.5 block">Lifetime payment requests</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-text-muted">Successful Payments</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span>{stats.successCount}</span>
              <span className="text-xs font-semibold text-text-muted">
                (₹{stats.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })})
              </span>
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-0.5 block">Verified &amp; active</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-text-muted">Purchased Credits</span>
            <div className="text-2xl font-bold text-brand-purple mt-1 flex items-center gap-1.5">
              <Zap className="w-5 h-5 fill-brand-purple" />
              <span>{stats.totalCredits}</span>
            </div>
            <span className="text-[11px] text-text-muted mt-0.5 block">Total plan credits credited</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md">
          <CardContent className="p-5">
            <span className="text-xs font-medium text-text-muted">Cancelled &amp; Failed</span>
            <div className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-1.5">
              <span>{stats.cancelledCount + stats.failedCount}</span>
              <span className="text-xs text-text-muted">
                ({stats.cancelledCount} canc. / {stats.failedCount} fail)
              </span>
            </div>
            <span className="text-[11px] text-text-muted mt-0.5 block">Zero charges applied</span>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-border">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Transaction ID, Order Reference, or Plan Name..."
            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-purple"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#150F26] p-1 rounded-xl border border-white/10 overflow-x-auto">
          {(["ALL", "SUCCESS", "PENDING", "CANCELLED", "FAILED"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-brand-purple text-white shadow-md"
                  : "text-text-muted hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort Order Toggle */}
        <button
          type="button"
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-semibold text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
        </button>
      </div>

      {/* Main Transactions Table */}
      <Card className="bg-surface border-border overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
            <p className="text-sm text-text-muted">Loading transactions from backend database...</p>
          </div>
        ) : error ? (
          <div className="py-16 px-4 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm text-white font-medium">{error}</p>
            <Button onClick={fetchTransactions} variant="outline" className="text-xs border-border text-white">
              Retry
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-20 px-4 text-center space-y-3">
            <CreditCard className="w-10 h-10 text-text-muted/40 mx-auto" />
            <p className="text-sm text-white font-semibold">No transactions found</p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              {searchTerm || statusFilter !== "ALL"
                ? "No payment records match your search query or selected status filter."
                : "No payment transactions have been recorded yet. Select any plan to create an order."}
            </p>
            {(searchTerm || statusFilter !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
                className="text-xs border-border text-white mt-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-muted">
              <thead className="text-[11px] uppercase bg-surface-elevated/60 text-text-muted border-b border-border tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Transaction ID</th>
                  <th className="px-5 py-3.5 font-semibold">Payment Reference</th>
                  <th className="px-5 py-3.5 font-semibold">Plan Name</th>
                  <th className="px-5 py-3.5 font-semibold">Amount</th>
                  <th className="px-5 py-3.5 font-semibold">Currency</th>
                  <th className="px-5 py-3.5 font-semibold">Date &amp; Time</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Credits</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {paginatedTransactions.map((tx, idx) => {
                  const isSuccess = tx.status === "success";
                  const isPending = tx.status === "pending" || tx.status === "initiated";
                  const isCancelled = tx.status === "cancelled";
                  const isFailed = tx.status === "failed";
                  const isVerifying = verifyingOrderId === tx.order_id;

                  return (
                    <tr
                      key={tx.order_id || tx.id || idx}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Transaction ID */}
                      <td className="px-5 py-4 font-mono text-[11px] text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <span>{tx.id ? tx.id.slice(0, 10) + "..." : "N/A"}</span>
                          {tx.id && (
                            <button
                              type="button"
                              onClick={() => handleCopy(tx.id)}
                              className="hover:text-white transition-colors cursor-pointer"
                              title="Copy Full Transaction ID"
                            >
                              {copiedId === tx.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Payment Reference (Order ID / Gateway Ref) */}
                      <td className="px-5 py-4 font-mono text-purple-300 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>{tx.order_id || "N/A"}</span>
                          {tx.order_id && (
                            <button
                              type="button"
                              onClick={() => handleCopy(tx.order_id)}
                              className="hover:text-white transition-colors cursor-pointer"
                              title="Copy Order Reference"
                            >
                              {copiedId === tx.order_id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                        {tx.provider_reference && tx.provider_reference !== tx.order_id && (
                          <div className="text-[10px] text-text-muted font-normal mt-0.5">
                            Ref: {tx.provider_reference}
                          </div>
                        )}
                      </td>

                      {/* Plan Name */}
                      <td className="px-5 py-4 font-semibold text-white">
                        {tx.plan_name || tx.plan_id || "Plan"}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-bold text-white text-sm">
                        ₹{(tx.amount || 0).toFixed(2)}
                      </td>

                      {/* Currency */}
                      <td className="px-5 py-4 font-mono text-[11px] text-text-muted uppercase">
                        {tx.currency || "INR"}
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4 font-mono text-[11px] text-text-muted whitespace-nowrap">
                        {tx.created_at
                          ? format(new Date(tx.created_at), "MMM d, yyyy h:mm a")
                          : "Recent"}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isSuccess
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : isPending
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : isCancelled
                              ? "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isPending ? (
                            <Clock className="w-3 h-3" />
                          ) : isCancelled ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          <span>{tx.status}</span>
                        </span>
                      </td>

                      {/* Credits Purchased */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {tx.purchased_credits ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                            <Zap className="w-3 h-3 fill-purple-300" />
                            {tx.purchased_credits}
                          </span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {isPending && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isVerifying}
                            onClick={() => handleVerifyPending(tx.order_id)}
                            className="text-xs border-border text-white hover:bg-surface-elevated cursor-pointer"
                          >
                            {isVerifying ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <RefreshCw className="w-3 h-3 mr-1" />
                            )}
                            <span>Verify</span>
                          </Button>
                        )}
                        {isSuccess && (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Active
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[11px] text-text-muted">Cancelled</span>
                        )}
                        {isFailed && (
                          <span className="text-[11px] text-red-400" title={tx.failure_reason || "Payment failed"}>
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && filteredTransactions.length > pageSize && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <div>
              Showing{" "}
              <strong className="text-white">
                {(currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(currentPage * pageSize, filteredTransactions.length)}
              </strong>{" "}
              of <strong className="text-white">{filteredTransactions.length}</strong> transactions
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 p-0 border-border text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="px-3 py-1 font-semibold text-white">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 w-8 p-0 border-border text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

