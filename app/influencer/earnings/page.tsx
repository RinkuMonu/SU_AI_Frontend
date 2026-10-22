"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  IndianRupee, 
  ShieldCheck, 
  ArrowUpRight, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Sparkles,
  Layers,
  History,
  Lock
} from 'lucide-react';
import marketplaceService from '@/services/marketplace.service';

export default function InfluencerWalletPage() {
  const [wallet, setWallet] = useState<any>({
    wallet_balance: 0,
    total_earned: 0,
    pending_escrow: 0,
    completed_deals: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await marketplaceService.getEarningsLedger();
      if (res.success && res.data) {
        setWallet(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load wallet data:", err);
      setError(err?.response?.data?.detail || err.message || "Failed to load wallet details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const walletBalance = Number(wallet.wallet_balance || 0);
  const totalEarned = Number(wallet.total_earned || wallet.total_net_payouts || 0);
  const pendingEscrow = Number(wallet.pending_escrow || 0);
  const transactions = wallet.transactions || wallet.payouts || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#be32ff]" /> Creator Wallet
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Official platform wallet. Campaign funds released by Admin upon work approval are credited here.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin text-[#be32ff]" : ""}`} />
            Refresh Wallet
          </Button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Wallet Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1329] via-[#11121d] to-[#151124] border border-[#be32ff]/30 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#be32ff]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fc9a5d]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Row: Wallet Brand & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Escrow Creator Wallet</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">Active Verified Account</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Admin Disbursed
            </span>
          </div>

          {/* Center: Available Balance */}
          <div className="py-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Available Wallet Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                INR Guaranteed
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-2">
              Credited directly by Admin through platform escrow upon deliverable approval.
            </p>
          </div>

          {/* Bottom Grid: Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-xs">Total Credited by Admin</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-lg font-black text-emerald-400">
                ₹{totalEarned.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-neutral-500 block">All-time wallet deposits</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-xs">In-Escrow Pending Release</span>
                <Lock className="w-4 h-4 text-[#fc9a5d]" />
              </div>
              <p className="text-lg font-black text-[#fc9a5d]">
                ₹{pendingEscrow.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-neutral-500 block">Funds deposited by Hirers</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-xs">Settled Campaigns</span>
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-lg font-black text-purple-300">
                {transactions.length} Deals
              </p>
              <span className="text-[10px] text-neutral-500 block">Approved &amp; wallet paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Passbook & Transaction Ledger */}
      <div className="rounded-2xl bg-[#0e0f17] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#fc9a5d]" /> Wallet Passbook &amp; Credit Ledger
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Official log of campaign funds deposited into your wallet by Platform Admin.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-neutral-300 border border-white/10">
            {transactions.length} Records
          </span>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-white/[0.02] text-neutral-400 border-b border-white/5 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Transaction ID</th>
                  <th className="py-3.5 px-4 font-semibold">Campaign / Deal</th>
                  <th className="py-3.5 px-4 font-semibold">Date &amp; Time</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Gross Fee</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Credited to Wallet</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Paid By</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t: any, idx: number) => {
                  const net = Number(t.net_amount || t.net_payout_amount || t.amount || 0);
                  const gross = Number(t.gross_amount || net);
                  const dateStr = t.created_at || t.settled_at;
                  return (
                    <tr key={t.transaction_id || t.payout_id || idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-mono font-medium text-purple-400">
                        {t.transaction_id || t.payout_id || `WLT-${idx + 1}`}
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        {t.campaign_name || "Sponsored Promotion Campaign"}
                      </td>
                      <td className="py-4 px-4 text-neutral-400">
                        {dateStr ? new Date(dateStr).toLocaleString() : "Recent"}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-neutral-300">
                        ₹{gross.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-emerald-400 text-sm">
                        +₹{net.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-bold border border-purple-500/20">
                          {t.credited_by || "Admin"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Credited to Wallet
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
              <Wallet className="w-7 h-7 text-[#fc9a5d]" />
            </div>
            <h4 className="text-sm font-bold text-white">Your Creator Wallet is Active</h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              When business clients hire you and approve your deliverables, the Platform Admin deposits your payment directly into this wallet. No bank account linking required.
            </p>
          </div>
        )}
      </div>

      {/* Escrow Guarantee Info Card */}
      <div className="p-6 rounded-2xl bg-[#0e0f17] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Guaranteed Escrow Protection</h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Every campaign budget is prepaid into Zaakpay escrow by the hiring brand. As soon as the work is delivered, the Admin releases funds directly into your wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
