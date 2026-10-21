"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  DollarSign, 
  IndianRupee, 
  ShieldCheck, 
  ArrowUpRight, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Save,
  Check,
  RefreshCw,
  Wallet
} from 'lucide-react';
import influencerService, { DashboardSummary } from '@/services/influencer.service';
import marketplaceService from '@/services/marketplace.service';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencerEarningsPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ledger, setLedger] = useState<any>({ total_gross_earnings: 0, total_net_payouts: 0, payouts: [] });
  const [payoutAccount, setPayoutAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Payout Account Modal
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [sumRes, ledgerRes, accRes] = await Promise.all([
        influencerService.getDashboardSummary().catch(() => ({ success: false, data: null })),
        marketplaceService.getEarningsLedger().catch(() => ({ success: false, data: null })),
        influencerService.getPayoutAccount().catch(() => ({ success: false, data: null }))
      ]);

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
      if (ledgerRes.success && ledgerRes.data) {
        setLedger(ledgerRes.data);
      }
      if (accRes.success && accRes.data) {
        setPayoutAccount(accRes.data);
        setAccountHolder(accRes.data.account_holder_name || '');
        setBankName(accRes.data.bank_name || '');
        setAccountNumber(accRes.data.account_number || '');
        setIfscCode(accRes.data.ifsc_code || '');
        setUpiId(accRes.data.upi_id || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePayoutAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAccount(true);
    setAccountError(null);
    setAccountSuccess(false);

    try {
      const res = await influencerService.savePayoutAccount({
        account_holder_name: accountHolder,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        upi_id: upiId
      });

      if (res.success) {
        setAccountSuccess(true);
        setPayoutAccount(res.data);
        setTimeout(() => {
          setShowAccountModal(false);
          setAccountSuccess(false);
        }, 1500);
      } else {
        setAccountError(res.message || "Failed to save payout account");
      }
    } catch (err: any) {
      setAccountError(err?.response?.data?.detail || "Failed to update payout details");
    } finally {
      setSavingAccount(false);
    }
  };

  const grossEarnings = ledger?.total_gross_earnings || (summary ? summary.total_earnings : 0);
  const netEarnings = ledger?.total_net_payouts || Math.round(grossEarnings * 0.95);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-[#be32ff]" />
            Creator Earnings &amp; Payouts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Review completed brand disbursements, active contract budgets, and payout ledger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setRefreshing(true); loadData(); }}
            disabled={refreshing}
            className="border-white/10 text-white bg-white/5 hover:bg-white/10 text-xs h-9 px-3 rounded-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAccountModal(true)}
            className="bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold h-9 px-4 rounded-xl shadow-md"
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            {payoutAccount ? "Edit Payout Bank/UPI" : "Link Payout Bank/UPI"}
          </Button>
        </div>
      </div>

      {/* Payout Destination Banner */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#0f1017] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Settlement Destination:</span>
              {payoutAccount ? (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Active
                </span>
              ) : (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {payoutAccount ? (
                `${payoutAccount.bank_name || 'Bank'} (${payoutAccount.account_number ? '••••' + payoutAccount.account_number.slice(-4) : ''}) ${payoutAccount.upi_id ? '• UPI: ' + payoutAccount.upi_id : ''}`
              ) : (
                "Please link your bank account or UPI ID to receive direct deposits upon deliverable approval."
              )}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAccountModal(true)}
          className="border-white/10 text-xs text-neutral-300 hover:text-white shrink-0"
        >
          {payoutAccount ? "Change Details" : "Set Up Now"}
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#1a1426] to-[#0f1017] border border-[#be32ff]/30 p-5 rounded-2xl">
          <span className="text-xs font-semibold text-neutral-400">Total Contract Value</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 flex items-center">
            <span>₹</span>
            <span>{grossEarnings.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-[#fc9a5d] mt-1 font-medium">From verified brand deals</p>
        </Card>

        <Card className="bg-[#0f1017] border-white/10 p-5 rounded-2xl">
          <span className="text-xs font-semibold text-neutral-400">Active Contracts</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1.5">
            {summary ? summary.active_collaborations : 0}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Escrow secured milestones</p>
        </Card>

        <Card className="bg-[#0f1017] border-white/10 p-5 rounded-2xl">
          <span className="text-xs font-semibold text-neutral-400">Completed Deals</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1.5">
            {summary ? summary.completed_collaborations : 0}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Approved deliverables</p>
        </Card>

        <Card className="bg-gradient-to-br from-[#0e1a14] to-[#0f1017] border border-emerald-500/20 p-5 rounded-2xl">
          <span className="text-xs font-semibold text-neutral-400">Net Disbursed Payouts</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1.5 flex items-center">
            <span>₹</span>
            <span>{netEarnings.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">After 5% platform fee</p>
        </Card>
      </div>

      {/* Payout Transactions Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1017] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Disbursement &amp; Payout Ledger</h3>
            <p className="text-xs text-neutral-400">Official log of milestone disbursements and releases</p>
          </div>
          <span className="text-xs text-neutral-400">
            {ledger?.payouts?.length || 0} Records
          </span>
        </div>

        {ledger?.payouts && ledger.payouts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-neutral-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Payout ID</th>
                  <th className="py-3 px-4 font-semibold">Campaign / Deal</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Gross Amount</th>
                  <th className="py-3 px-4 font-semibold text-right">Fee (5%)</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Released</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ledger.payouts.map((p: any) => (
                  <tr key={p.payout_id || p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-mono text-neutral-300">
                      {p.payout_id || p.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {p.campaign_name || "Sponsored Promotion Deal"}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      {p.settled_at ? new Date(p.settled_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-300 font-medium">
                      ₹{Number(p.gross_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-400">
                      ₹{Number(p.platform_commission || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      ₹{Number(p.net_payout_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Settled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center space-y-2">
            <IndianRupee className="w-8 h-8 text-neutral-500 mx-auto" />
            <h4 className="text-xs font-bold text-white">No Payout Records Yet</h4>
            <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
              When brands review and approve your submitted collaboration deliverables, payouts are automatically credited here.
            </p>
          </div>
        )}
      </div>

      {/* Escrow Guarantee Note */}
      <div className="p-6 rounded-2xl bg-[#0f1017] border border-white/10 space-y-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">DhandaGrow AI Escrow &amp; Payout Protection</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          All brand collaboration budgets are secured in platform escrow before production starts. Once you submit finished links and the brand approves them, your earnings are automatically settled to your registered bank account or UPI ID with 100% financial security.
        </p>
      </div>

      {/* Payout Account Modal */}
      <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
        <DialogContent className="bg-[#12131b] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#be32ff]" />
              Payout Destination Settings
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Enter your bank account or UPI ID to receive direct disbursement of collaboration earnings.
            </DialogDescription>
          </DialogHeader>

          {accountSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Payout account details saved successfully!</span>
            </div>
          )}

          {accountError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{accountError}</span>
            </div>
          )}

          <form onSubmit={handleSavePayoutAccount} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs text-white/80 font-medium">Account Holder Legal Name *</Label>
              <Input
                value={accountHolder}
                onChange={e => setAccountHolder(e.target.value)}
                placeholder="As per bank records"
                required
                className="bg-white/5 border-white/10 text-white text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-white/80 font-medium">Bank Name *</Label>
                <Input
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                  required
                  className="bg-white/5 border-white/10 text-white text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-white/80 font-medium">IFSC Code *</Label>
                <Input
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234"
                  required
                  className="bg-white/5 border-white/10 text-white text-xs h-9 uppercase font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-white/80 font-medium">Account Number *</Label>
              <Input
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Enter bank account number"
                required
                className="bg-white/5 border-white/10 text-white text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-white/80 font-medium">UPI VPA (Optional)</Label>
              <Input
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="e.g. creator@okhdfcbank"
                className="bg-white/5 border-white/10 text-white text-xs h-9 font-mono"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAccountModal(false)}
                className="border-white/10 text-xs text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={savingAccount}
                className="bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold"
              >
                {savingAccount ? "Saving..." : "Save Details"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
