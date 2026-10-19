"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, IndianRupee, ShieldCheck, ArrowUpRight } from 'lucide-react';
import influencerService, { DashboardSummary } from '@/services/influencer.service';

export default function InfluencerEarningsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    influencerService.getDashboardSummary()
      .then(res => {
        if (res.success && res.data) {
          setSummary(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-[#be32ff]" />
          Creator Earnings &amp; Payouts
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Review your completed brand deal disbursements, active contract budgets, and payout ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="bg-gradient-to-br from-[#1a1426] to-[#0f1017] border border-[#be32ff]/30 p-6 rounded-3xl">
          <span className="text-xs font-semibold text-neutral-400">Total Contract Value</span>
          <div className="text-3xl font-extrabold text-white mt-2">
            ₹{summary ? summary.total_earnings.toLocaleString() : '0'}
          </div>
          <p className="text-[11px] text-[#fc9a5d] mt-1 font-medium">From verified brand deals</p>
        </Card>

        <Card className="bg-[#0f1017] border-white/10 p-6 rounded-3xl">
          <span className="text-xs font-semibold text-neutral-400">Active Contracts</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2">
            {summary ? summary.active_collaborations : '0'}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Escrow secured milestones</p>
        </Card>

        <Card className="bg-[#0f1017] border-white/10 p-6 rounded-3xl">
          <span className="text-xs font-semibold text-neutral-400">Completed Payouts</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            {summary ? summary.completed_collaborations : '0'}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Direct bank / UPI transfers</p>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-[#0f1017] border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">DhandaGrow AI Escrow Protection</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          All collaboration deals on DhandaGrow AI are verified before project start. When a brand approves your proposal, funds are secured in escrow and released directly to your verified payout account upon delivery.
        </p>
      </div>
    </div>
  );
}
