"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ShieldCheck, 
  IndianRupee, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  RefreshCw,
  Search,
  Scale,
  Check,
  X
} from 'lucide-react';
import marketplaceService, { HiringRequest } from '@/services/marketplace.service';

export default function AdminMarketplacePage() {
  const [overview, setOverview] = useState<any>(null);
  const [requests, setRequests] = useState<HiringRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ovRes, reqRes] = await Promise.all([
        marketplaceService.getAdminOverview().catch(() => ({ data: null })),
        marketplaceService.getAdminHiringRequests(statusFilter !== 'all' ? statusFilter : undefined).catch(() => ({ data: [] }))
      ]);
      setOverview(ovRes.data);
      setRequests(reqRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (requestId: string, action: 'favor_hirer' | 'favor_influencer' | 'mutual_cancel') => {
    const notes = prompt(`Enter admin notes for resolving dispute (${action}):`, "Resolved following marketplace arbitration guidelines.");
    if (!notes) return;

    try {
      setResolvingId(requestId);
      const res = await marketplaceService.adminResolveDispute(requestId, {
        action,
        resolution_notes: notes
      });
      if (res.success) {
        alert("Dispute resolved successfully!");
        fetchData();
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to resolve dispute.");
    } finally {
      setResolvingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_influencer_response':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending Creator</Badge>;
      case 'accepted':
      case 'agreement_pending':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Agreement Pending</Badge>;
      case 'payment_pending':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Payment Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">In Progress</Badge>;
      case 'work_submitted':
        return <Badge className="bg-pink-100 text-pink-800 border-pink-300">Review Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed &amp; Settled</Badge>;
      case 'disputed':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Disputed</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Influencer Marketplace Oversight
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit hiring requests, bilateral agreements, platform service fees, and mediate collaboration disputes.
          </p>
        </div>
        <Button 
          onClick={fetchData}
          variant="outline"
          size="sm"
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Data
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deals</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{overview?.total_hiring_requests ?? 0}</div>
            <p className="text-xs text-slate-400 mt-1">{overview?.active_collaborations ?? 0} active in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transaction Volume</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">₹{(overview?.total_transaction_volume ?? 0).toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Deposited into Escrow</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Fees Collected</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">₹{(overview?.total_platform_fees_collected ?? 0).toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Base fee ₹199 + 18% GST</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disputes</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">{overview?.active_disputes ?? 0}</div>
            <p className="text-xs text-slate-400 mt-1">Require arbitration</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Requests Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-base font-bold text-slate-800">
            All Hiring Requests &amp; Contracts
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-md p-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending_influencer_response">Pending Creator</option>
              <option value="agreement_pending">Agreement Pending</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="work_submitted">Work Submitted</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No hiring requests matching filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 pl-6">ID &amp; Campaign</th>
                    <th className="p-3">Brand (Hirer)</th>
                    <th className="p-3">Influencer</th>
                    <th className="p-3">Compensation</th>
                    <th className="p-3">Platform Fee</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(r => (
                    <tr key={r.id || r.hiring_request_id} className="hover:bg-slate-50">
                      <td className="p-3 pl-6">
                        <strong className="text-slate-900 block">{r.campaign_name}</strong>
                        <span className="text-[10px] text-slate-400">{r.hiring_request_id}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-900 font-medium block">{r.business_name}</span>
                        <span className="text-[10px] text-slate-400">{r.hirer_email}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-900 font-medium block">{r.influencer_name}</span>
                        <span className="text-[10px] text-indigo-600">{r.influencer_username}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-900">₹{r.proposed_compensation.toLocaleString()}</td>
                      <td className="p-3 text-slate-600">₹{r.total_platform_fee}</td>
                      <td className="p-3">{getStatusBadge(r.status)}</td>
                      <td className="p-3 pr-6 text-right">
                        {r.status === 'disputed' ? (
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              size="sm"
                              disabled={resolvingId === r.hiring_request_id}
                              onClick={() => handleResolveDispute(r.hiring_request_id, 'favor_influencer')}
                              className="bg-emerald-600 text-white text-[10px] h-7 px-2"
                            >
                              Pay Creator
                            </Button>
                            <Button 
                              size="sm"
                              disabled={resolvingId === r.hiring_request_id}
                              onClick={() => handleResolveDispute(r.hiring_request_id, 'favor_hirer')}
                              variant="outline"
                              className="border-rose-300 text-rose-600 text-[10px] h-7 px-2"
                            >
                              Refund Brand
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Standard Flow</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
