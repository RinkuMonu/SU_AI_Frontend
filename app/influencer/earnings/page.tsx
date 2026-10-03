"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';
import influencerService from '@/services/influencer.service';

export default function EarningsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    influencerService.getMyEarnings().then(res => {
      setData(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>;
  }

  const { earnings = [], summary = { total_pending: 0, total_paid: 0, total_earned: 0 } } = data || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-8 h-8 text-brand-coral" />
          Earnings & Payments
        </h1>
        <p className="text-text-muted mt-2">Track your revenue, pending payouts, and payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-brand-purple/20 to-brand-coral/20 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-brand-pink" />
              {summary.total_earned.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('?', '')}
            </div>
            <p className="text-xs text-brand-pink mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Lifetime revenue
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Available to Withdraw</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ?{summary.total_paid.toLocaleString('en-IN')}
            </div>
            <Button size="sm" className="w-full mt-4 bg-white/10 hover:bg-brand-purple text-white gap-2">
              Withdraw Funds <ArrowUpRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Pending Clearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-muted">
              ?{summary.total_pending.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-text-muted mt-4">
              Funds clear 7 days after brand approval.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-white">Payment History</h2>
        {earnings.length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-text-muted">No earning records found.</p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Brand</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((e: any) => (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-white">{e.campaign_name}</td>
                    <td className="p-4">{e.business_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${e.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-white">?{e.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
