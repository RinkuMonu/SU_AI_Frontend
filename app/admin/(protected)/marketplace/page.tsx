"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
  X,
  Eye,
  Clock,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import marketplaceService, { HiringRequest, AgreementDocument } from '@/services/marketplace.service';

export default function AdminMarketplacePage() {
  const [overview, setOverview] = useState<any>(null);
  const [requests, setRequests] = useState<HiringRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Admin Agreement Inspection Modal
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementDocument | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HiringRequest | null>(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [adminReviewNotes, setAdminReviewNotes] = useState('');
  const [isReviewingAgreement, setIsReviewingAgreement] = useState(false);

  // Real-time Agreement Review Alert Popup for Admin
  const [showPendingAlertModal, setShowPendingAlertModal] = useState(false);
  const [alertPendingRequest, setAlertPendingRequest] = useState<HiringRequest | null>(null);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  const handleAdminReviewAgreement = async (action: 'approve' | 'reject' | 'request_changes') => {
    if (!selectedRequest) return;
    const reqId = selectedRequest.hiring_request_id || selectedRequest.id;
    try {
      setIsReviewingAgreement(true);
      const res = await marketplaceService.adminReviewAgreement(reqId, {
        action,
        notes: adminReviewNotes.trim() || undefined
      });
      if (res.success) {
        alert(`Agreement ${action === 'approve' ? 'approved' : action} successfully!`);
        setAdminReviewNotes('');
        const agrRes = await marketplaceService.getAgreement(reqId);
        if (agrRes.success) setSelectedAgreement(agrRes.data);
        fetchData(true);
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || `Failed to ${action} agreement.`);
    } finally {
      setIsReviewingAgreement(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-poll every 3.5s so when a business hires & pays, the popup triggers for admin immediately!
    const interval = setInterval(() => {
      fetchData(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [statusFilter, dismissedAlertIds]);

  const fetchData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [ovRes, reqRes] = await Promise.all([
        marketplaceService.getAdminOverview().catch(() => ({ data: null })),
        marketplaceService.getAdminHiringRequests(statusFilter !== 'all' ? statusFilter : undefined).catch(() => ({ data: [] }))
      ]);
      setOverview(ovRes.data);
      const reqList: HiringRequest[] = reqRes.data || [];
      setRequests(reqList);

      // Detect pending agreement reviews and trigger real-time popup
      const pending = reqList.find(r => 
        r.status === 'awaiting_admin_approval' || 
        r.admin_approval?.status === 'pending_admin_review' ||
        (r as any).agreement_status === 'awaiting_admin_approval'
      );
      if (pending) {
        const pId = pending.hiring_request_id || pending.id;
        if (!dismissedAlertIds.includes(pId)) {
          setAlertPendingRequest(pending);
          setShowPendingAlertModal(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleOpenAgreement = async (req: HiringRequest) => {
    setSelectedRequest(req);
    setShowAgreementModal(true);
    setAgreementLoading(true);
    try {
      const res = await marketplaceService.getAgreement(req.hiring_request_id);
      if (res.success && res.data) {
        setSelectedAgreement(res.data);
      }
    } catch (e) {
      console.error("Failed to load agreement:", e);
    } finally {
      setAgreementLoading(false);
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
      case 'awaiting_admin_approval':
      case 'agreement_admin_review_pending':
        return <Badge className="bg-amber-100 text-amber-900 border-amber-400 font-bold">Awaiting Admin Review</Badge>;
      case 'ready_for_signature':
      case 'agreement_approved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 font-semibold">Ready for Signatures</Badge>;
      case 'agreement_rejected':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-300">Agreement Rejected</Badge>;
      case 'accepted':
      case 'agreement_pending':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Agreement Pending</Badge>;
      case 'hirer_signed':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Brand Signed</Badge>;
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

  const getAgreementStatusBadge = (agrStatus?: string, reqStatus?: string, adminStatus?: string) => {
    if (adminStatus === 'pending_admin_review' || reqStatus === 'awaiting_admin_approval') {
      return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300"><Clock className="w-3 h-3 text-amber-600" /> Awaiting Admin Review</span>;
    }
    if (adminStatus === 'rejected' || reqStatus === 'agreement_rejected') {
      return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300"><AlertTriangle className="w-3 h-3 text-rose-600" /> Admin Rejected</span>;
    }
    const s = agrStatus || (reqStatus === 'payment_pending' || reqStatus === 'in_progress' || reqStatus === 'completed' ? 'fully_signed' : 'pending_signatures');
    switch (s) {
      case 'fully_signed':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Fully Signed</span>;
      case 'hirer_signed':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300"><Check className="w-3 h-3 text-indigo-600" /> Brand Signed</span>;
      case 'influencer_signed':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300"><Check className="w-3 h-3 text-purple-600" /> Creator Signed</span>;
      case 'ready_for_signature':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300"><Sparkles className="w-3 h-3 text-blue-600" /> Approved • Ready to Sign</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300"><Clock className="w-3 h-3 text-amber-600" /> Pending Signatures</span>;
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
          onClick={() => fetchData()}
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
            <p className="text-xs text-slate-400 mt-1">Base fee ₹200 + 18% GST (₹236 total)</p>
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
            Hiring Requests, Bilateral Agreements &amp; Escrow Records
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-md p-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="awaiting_admin_approval">Awaiting Admin Review</option>
              <option value="ready_for_signature">Ready for Signatures</option>
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
                    <th className="p-3">Parties (Brand &bull; Creator)</th>
                    <th className="p-3">Agreement &amp; Version</th>
                    <th className="p-3">Signatures Audit</th>
                    <th className="p-3">Financials &amp; Escrow</th>
                    <th className="p-3">Lifecycle Status</th>
                    <th className="p-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(r => {
                    const isFullySigned = r.agreement_status === 'fully_signed' || (r.hirer_signed && r.influencer_signed) || ['payment_pending', 'in_progress', 'completed'].includes(r.status);
                    const isHirerSigned = r.hirer_signed || isFullySigned || r.status === 'hirer_signed';
                    const isCreatorSigned = r.influencer_signed || isFullySigned;

                    return (
                      <tr key={r.id || r.hiring_request_id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 pl-6">
                          <strong className="text-slate-900 block font-semibold">{r.campaign_name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{r.hiring_request_id}</span>
                        </td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <span className="text-slate-900 font-medium block">
                              <span className="text-slate-400 font-normal">Brand: </span>{r.business_name}
                            </span>
                            <span className="text-indigo-600 font-medium block">
                              <span className="text-slate-400 font-normal">Creator: </span>{r.influencer_name} <span className="text-[10px] text-slate-400 font-mono">({r.influencer_username})</span>
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="font-mono text-slate-800 text-[11px] font-semibold">
                              {r.agreement_number || `AGR-${r.hiring_request_id.slice(-6).toUpperCase()}`}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400">v{r.agreement_version || '1.0'}</span>
                              <span>&bull;</span>
                              {getAgreementStatusBadge(r.agreement_status, r.status, (r as any).admin_approval?.status)}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="text-slate-400 text-[10px]">Brand:</span>
                              {isHirerSigned ? (
                                <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                                  <Check className="w-3 h-3 text-emerald-600" /> Signed
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-amber-500" /> Pending
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="text-slate-400 text-[10px]">Creator:</span>
                              {isCreatorSigned ? (
                                <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                                  <Check className="w-3 h-3 text-emerald-600" /> Signed
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-amber-500" /> Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-900">₹{r.proposed_compensation.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500">Fee: ₹{r.total_platform_fee} (₹200+GST)</div>
                            {r.payment_id || r.payment_status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                <CreditCard className="w-2.5 h-2.5" /> {r.payment_id || 'Escrow Verified'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Escrow Pending</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(r.status)}</td>
                        <td className="p-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAgreement(r)}
                              className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs h-7 px-2.5 flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-indigo-600" />
                              <span>View Agreement</span>
                            </Button>

                            {r.status === 'disputed' && (
                              <>
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
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Agreement Review Modal */}
      <Dialog open={showAgreementModal} onOpenChange={setShowAgreementModal}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <FileText className="text-indigo-600 w-5 h-5" /> 
              Admin Agreement &amp; Audit Inspection
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Bilateral collaboration agreement and cryptographic audit log for {selectedRequest?.campaign_name}.
            </DialogDescription>
          </DialogHeader>

          {agreementLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-xs text-slate-500">Loading verified agreement document...</p>
            </div>
          ) : selectedAgreement ? (
            <div className="space-y-4 py-2 text-xs text-slate-700">
              {/* Header Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedAgreement.title}</h4>
                  <p className="text-slate-500 text-[11px]">Agreement No: {selectedAgreement.agreement_number} | Version {selectedAgreement.version}</p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                  {selectedAgreement.status.replace(/_/g, ' ')}
                </Badge>
              </div>

              {/* Contracting Parties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Party A: Hirer / Brand</span>
                  <div className="font-bold text-slate-900">{selectedAgreement.hirer_party?.legal_name || selectedRequest?.hirer_name}</div>
                  <div className="text-slate-600">{selectedAgreement.hirer_party?.business_name || selectedRequest?.business_name}</div>
                  <div className="text-[10px] text-slate-400">{selectedAgreement.hirer_party?.email || selectedRequest?.hirer_email}</div>
                </div>
                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Party B: Influencer / Creator</span>
                  <div className="font-bold text-slate-900">{selectedAgreement.influencer_party?.legal_name || selectedRequest?.influencer_name}</div>
                  <div className="text-indigo-600 font-medium">{selectedAgreement.influencer_party?.username || selectedRequest?.influencer_username}</div>
                  <div className="text-[10px] text-slate-400">Creator ID: {selectedAgreement.influencer_party?.user_id?.slice(0, 10)}...</div>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Scope of Work &amp; Deliverables
                </h5>
                <div className="space-y-1">
                  <div><span className="text-slate-500">Target Social Platform: </span><span className="font-medium text-slate-800">{selectedAgreement.campaign_details?.social_platform || selectedRequest?.social_platform}</span></div>
                  <div><span className="text-slate-500">Deliverables: </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(selectedAgreement.campaign_details?.deliverables || selectedRequest?.deliverables || []).map((d: string, i: number) => (
                        <span key={i} className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] px-2 py-0.5 rounded font-medium">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Terms & Escrow */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Financial Terms &amp; Escrow Deposit
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">Creator Compensation:</span>
                    <span className="font-bold text-slate-900 text-sm">₹{(selectedAgreement.financial_terms?.agreed_compensation || selectedRequest?.proposed_compensation || 0).toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">Platform Fee (₹200 + GST):</span>
                    <span className="font-bold text-slate-900 text-sm">₹{selectedRequest?.total_platform_fee || 236}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="text-emerald-700 text-[10px] block font-semibold">Total Escrow Deposited:</span>
                    <span className="font-extrabold text-emerald-700 text-sm">₹{((selectedAgreement.financial_terms?.agreed_compensation || selectedRequest?.proposed_compensation || 0) + (selectedRequest?.total_platform_fee || 236)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Legal Clauses */}
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-44 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enforceable Legal Clauses</div>
                {selectedAgreement.legal_clauses?.map((c, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-indigo-600" />
                      <span>{c.clause_title}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed pl-4">{c.clause_text}</p>
                  </div>
                ))}
              </div>

              {/* Signatures Audit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Party A: Hirer Signature</span>
                  {selectedAgreement.signatures?.hirer?.signed ? (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-0.5">
                      <div className="text-emerald-800 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Signed by {selectedAgreement.signatures.hirer.signer_name}
                      </div>
                      <div className="text-[10px] text-slate-500">Designation: {selectedAgreement.signatures.hirer.signer_title || 'Authorized Signatory'}</div>
                      <div className="text-[10px] text-slate-500">Date: {new Date(selectedAgreement.signatures.hirer.signed_at || '').toLocaleString()}</div>
                      <div className="text-[9px] font-mono text-emerald-700 truncate pt-0.5">
                        Hash: {selectedAgreement.signatures.hirer.signature_hash}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Awaiting Hirer Signature</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Party B: Influencer Signature</span>
                  {selectedAgreement.signatures?.influencer?.signed ? (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-0.5">
                      <div className="text-emerald-800 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Signed by {selectedAgreement.signatures.influencer.signer_name}
                      </div>
                      <div className="text-[10px] text-slate-500">Date: {new Date(selectedAgreement.signatures.influencer.signed_at || '').toLocaleString()}</div>
                      <div className="text-[9px] font-mono text-emerald-700 truncate pt-0.5">
                        Hash: {selectedAgreement.signatures.influencer.signature_hash}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Awaiting Creator Signature</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* ADMIN MANUAL COMPLIANCE APPROVAL & DECISION PANEL */}
              {/* ========================================================= */}
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Admin Agreement Review Decision (Manual)
                  </h5>
                  {selectedAgreement.admin_approval?.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved by {selectedAgreement.admin_approval.reviewed_by || 'Admin'}
                    </span>
                  ) : selectedAgreement.admin_approval?.status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Rejected by Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Admin Review
                    </span>
                  )}
                </div>

                {selectedAgreement.admin_approval?.status === 'approved' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 space-y-1">
                    <p className="font-semibold">✓ Agreement manually approved for bilateral execution.</p>
                    <p className="text-[11px] text-emerald-700">
                      Reviewed on {new Date(selectedAgreement.admin_approval.reviewed_at || '').toLocaleString()}. Both parties can now sign through their respective portals.
                    </p>
                    {selectedAgreement.admin_approval.notes && (
                      <p className="text-[11px] text-emerald-600 italic">Notes: &quot;{selectedAgreement.admin_approval.notes}&quot;</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      As Administrator, verify that deliverables, licensing rights, revision limits, and ₹200 platform fee align with platform guidelines before approving.
                    </p>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Admin Review Notes / Rejection Reason (Optional):
                      </label>
                      <input 
                        type="text"
                        value={adminReviewNotes}
                        onChange={e => setAdminReviewNotes(e.target.value)}
                        placeholder="e.g. Terms verified. Deliverables and licensing clauses fully compliant."
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={() => handleAdminReviewAgreement('approve')}
                        disabled={isReviewingAgreement}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-lg shadow"
                      >
                        {isReviewingAgreement ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                        Approve Agreement
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleAdminReviewAgreement('reject')}
                        disabled={isReviewingAgreement}
                        variant="outline"
                        className="border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs h-9 px-4 rounded-lg"
                      >
                        <X className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                        Reject Agreement
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleAdminReviewAgreement('request_changes')}
                        disabled={isReviewingAgreement}
                        variant="outline"
                        className="border-amber-300 text-amber-800 hover:bg-amber-50 font-semibold text-xs h-9 px-4 rounded-lg"
                      >
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                        Request Revisions
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setShowAgreementModal(false)} className="border-slate-300 text-slate-700">
                  Close Inspection
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Agreement document not found.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Real-time Agreement E-Sign Verification Request Popup for Admin */}
      <Dialog open={showPendingAlertModal} onOpenChange={setShowPendingAlertModal}>
        <DialogContent className="bg-white border-2 border-amber-400 text-slate-900 sm:max-w-md shadow-2xl rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2 mx-auto">
              <AlertCircle className="w-6 h-6 text-amber-600 animate-bounce" />
            </div>
            <DialogTitle className="text-lg font-bold text-center text-slate-900">
              New Agreement E-Sign Verification Request!
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500">
              A hiring request requires your manual administrative approval before the brand and creator can affix electronic signatures.
            </DialogDescription>
          </DialogHeader>

          {alertPendingRequest && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Request ID:</span>
                  <span className="font-mono text-slate-900 font-bold">{alertPendingRequest.hiring_request_id || alertPendingRequest.id}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Campaign:</span>
                  <span className="font-bold text-slate-900">{alertPendingRequest.campaign_name || 'Influencer Campaign'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Brand / Hirer:</span>
                  <span className="font-semibold text-slate-900">{alertPendingRequest.hirer_name || alertPendingRequest.business_name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Creator / Influencer:</span>
                  <span className="font-bold text-indigo-700">{alertPendingRequest.influencer_name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Agreed Compensation:</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{alertPendingRequest.proposed_compensation?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-amber-200/60">
                  <span className="font-medium">Platform Fee Status:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Initial ₹200 Paid &amp; Verified
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={() => {
                    const id = alertPendingRequest.hiring_request_id || alertPendingRequest.id;
                    setDismissedAlertIds(prev => [...prev, id]);
                    setShowPendingAlertModal(false);
                    handleOpenAgreement(alertPendingRequest);
                  }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs h-9 shadow-md"
                >
                  <FileText className="w-4 h-4 mr-1.5" /> Review &amp; Approve Agreement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const id = alertPendingRequest.hiring_request_id || alertPendingRequest.id;
                    setDismissedAlertIds(prev => [...prev, id]);
                    setShowPendingAlertModal(false);
                  }}
                  className="border-slate-300 text-slate-600 hover:bg-slate-100 text-xs h-9"
                >
                  Later
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
