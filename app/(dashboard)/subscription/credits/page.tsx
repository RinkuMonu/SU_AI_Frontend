"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Zap,
  ArrowLeft,
  RefreshCw,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { Subscription, CreditTransaction } from "@/types/subscription";

export default function CreditUsagePage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "DEBITS" | "CREDITS">("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const fetchCreditData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sub, history] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getCreditTransactions(),
      ]);
      setSubscription(sub);
      setTransactions(history || []);
    } catch (err: any) {
      console.error("Failed to load credit usage data", err);
      setError(err?.response?.data?.detail || "Failed to load AI token and credit usage records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

  const handleExportJSON = () => {
    if (transactions.length === 0) return;
    const blob = new Blob([JSON.stringify(transactions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-credit-usage-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter & Search logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Filter type
        if (typeFilter === "DEBITS" && tx.amount >= 0) return false;
        if (typeFilter === "CREDITS" && tx.amount < 0) return false;

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchAction = (tx.action || tx.transaction_type || tx.feature || "").toLowerCase().includes(q);
          const matchDesc = (tx.description || "").toLowerCase().includes(q);
          const matchId = (tx.id || "").toLowerCase().includes(q);
          return matchAction || matchDesc || matchId;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [transactions, typeFilter, searchTerm, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalRemaining = subscription?.credits_remaining ?? 0;
    const totalAllocated = subscription?.plan_details?.credits || (totalRemaining > 0 ? totalRemaining : 100);
    const totalUsed = Math.max(0, totalAllocated - totalRemaining);
    const usedPercent = totalAllocated > 0 ? Math.min(100, Math.round((totalUsed / totalAllocated) * 100)) : 0;

    const debits = transactions.filter((t) => t.amount < 0);
    const creditsAdded = transactions.filter((t) => t.amount > 0);
    const totalTokensConsumed = Math.abs(debits.reduce((acc, t) => acc + t.amount, 0));
    const totalTokensCredited = creditsAdded.reduce((acc, t) => acc + t.amount, 0);

    return {
      totalRemaining,
      totalAllocated,
      totalUsed,
      usedPercent,
      totalTokensConsumed,
      totalTokensCredited,
      postsCreated: subscription?.usage?.posts_created ?? 0,
      reelsCreated: subscription?.usage?.reels_created ?? 0,
    };
  }, [subscription, transactions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
        <p className="text-xs text-text-muted">Loading AI Token &amp; Credit usage records...</p>
      </div>
    );
  }

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
            <span className="text-white font-medium">AI Token/Credit Usage</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-brand-purple fill-brand-purple" />
            <span>AI Token/Credit Usage</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Audit your AI token consumption, remaining credit reserves, and deduction ledger per AI feature.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={fetchCreditData}
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

          <Link
            href="/subscription"
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#C026D3] to-[#9333EA] text-white shadow-md hover:brightness-110 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get More Credits</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Remaining Credits Card */}
        <Card className="bg-surface border-border shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-purple/10 rounded-bl-full blur-2xl pointer-events-none" />
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">Available Balance</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white flex items-center gap-1.5">
                <Zap className="w-6 h-6 text-brand-purple fill-brand-purple" />
                {stats.totalRemaining}
              </span>
              <span className="text-xs text-text-muted">/ {stats.totalAllocated} Total</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.totalAllocated > 0 ? Math.min(100, Math.round((stats.totalRemaining / stats.totalAllocated) * 100)) : 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Used Credits Card */}
        <Card className="bg-surface border-border shadow-md">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-medium text-text-muted">Credits Consumed</span>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1.5">
              <TrendingDown className="w-5 h-5 text-amber-400" />
              <span>{stats.totalUsed}</span>
              <span className="text-xs text-text-muted font-normal">({stats.usedPercent}% used)</span>
            </div>
            <span className="text-[11px] text-text-muted block">
              Deducted across posts, reels, and AI tools
            </span>
          </CardContent>
        </Card>

        {/* Plan Allocation Card */}
        <Card className="bg-surface border-border shadow-md">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-medium text-text-muted">Plan Credit Limit</span>
            <div className="text-2xl font-bold text-white flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>{stats.totalAllocated}</span>
            </div>
            <span className="text-[11px] text-text-muted block">
              Plan: <strong className="text-white uppercase">{subscription?.plan_id || "Free"}</strong>
            </span>
          </CardContent>
        </Card>

        {/* Generations Summary */}
        <Card className="bg-surface border-border shadow-md">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-medium text-text-muted">AI Output Produced</span>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span>{stats.postsCreated + stats.reelsCreated}</span>
              <span className="text-xs font-normal text-text-muted">creatives</span>
            </div>
            <div className="text-[11px] text-text-muted flex items-center gap-3">
              <span>Posts: <strong className="text-white">{stats.postsCreated}</strong></span>
              <span>•</span>
              <span>Reels: <strong className="text-white">{stats.reelsCreated}</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by action, AI feature name, or transaction description..."
            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-purple"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#150F26] p-1 rounded-xl border border-white/10 overflow-x-auto">
          {(["ALL", "DEBITS", "CREDITS"] as const).map((filter) => {
            const label = filter === "ALL" ? "All Activity" : filter === "DEBITS" ? "Usage / Debits (-)" : "Allocations / Credits (+)";
            return (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setTypeFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  typeFilter === filter
                    ? "bg-brand-purple text-white shadow-md"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Sort Order Toggle */}
        <button
          type="button"
          onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
          className="px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-white bg-white/[0.03] border border-white/10 transition-colors cursor-pointer shrink-0"
        >
          {sortOrder === "desc" ? "Newest First" : "Oldest First"}
        </button>
      </div>

      {/* Credit Usage Ledger Table */}
      <Card className="bg-surface border-border overflow-hidden shadow-lg">
        {filteredTransactions.length === 0 ? (
          <CardContent className="py-16 text-center text-text-muted space-y-3">
            <Zap className="w-10 h-10 text-text-muted/40 mx-auto" />
            <h3 className="text-base font-semibold text-white">No credit activity found</h3>
            <p className="text-xs text-text-muted/70 max-w-sm mx-auto">
              {searchTerm || typeFilter !== "ALL"
                ? "No transactions match your current search or filter criteria. Try resetting filters."
                : "Generate AI posts, video reels, or marketing avatars to see deductions recorded in real-time."}
            </p>
            {(searchTerm || typeFilter !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("ALL");
                  setCurrentPage(1);
                }}
                className="mt-2 text-xs border-border text-white hover:bg-surface-elevated"
              >
                Reset Filters
              </Button>
            )}
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-muted">
              <thead className="text-xs uppercase bg-surface-elevated/50 text-text-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date &amp; Time</th>
                  <th className="px-6 py-4 font-medium">Feature / Activity</th>
                  <th className="px-6 py-4 font-medium">Change</th>
                  <th className="px-6 py-4 font-medium">Balance After</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedTransactions.map((tx, idx) => {
                  const isDebit = tx.amount < 0;
                  const displayAction = tx.action || tx.transaction_type || tx.feature || tx.description || "Credit Adjustment";

                  return (
                    <tr
                      key={tx.id || idx}
                      className="hover:bg-surface-elevated/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs font-mono whitespace-nowrap text-text-muted">
                        {tx.created_at
                          ? format(new Date(tx.created_at), "MMM d, yyyy h:mm a")
                          : "Recent"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs sm:text-sm">
                            {displayAction}
                          </span>
                          {tx.description && tx.description !== displayAction && (
                            <span className="text-[11px] text-text-muted/70 hidden sm:inline truncate max-w-xs">
                              ({tx.description})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isDebit
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {isDebit ? (
                            <TrendingDown className="w-3 h-3 shrink-0" />
                          ) : (
                            <TrendingUp className="w-3 h-3 shrink-0" />
                          )}
                          <span>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-white font-mono text-xs">
                          {tx.balance_after}
                        </span>
                        <span className="text-[10px] text-text-muted ml-1">remaining</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Recorded
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredTransactions.length > pageSize && (
          <div className="flex items-center justify-between px-6 py-4 bg-surface-elevated/20 border-t border-border text-xs text-text-muted">
            <div>
              Showing <strong className="text-white">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
              <strong className="text-white">
                {Math.min(currentPage * pageSize, filteredTransactions.length)}
              </strong>{" "}
              of <strong className="text-white">{filteredTransactions.length}</strong> activity records
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 border-border hover:bg-surface-elevated text-white cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>

              <span className="px-2 font-medium text-white">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-8 px-2.5 border-border hover:bg-surface-elevated text-white cursor-pointer disabled:opacity-40"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

