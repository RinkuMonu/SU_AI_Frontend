"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Building2, 
  Tag, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  IndianRupee, 
  ShieldCheck, 
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  ChevronRight,
  Filter,
  Check,
  CheckCheck,
  X,
  Search,
  Download,
  PenTool,
  Upload,
  Send,
  RefreshCw,
  Briefcase,
  Lock,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

import marketplaceService, { HiringRequest, AgreementDocument, ChatMessage } from '@/services/marketplace.service';
import { useAuth } from '@/components/auth/AuthProvider';

type CampaignTab = 'all' | 'pending' | 'agreement_pending' | 'awaiting_payment' | 'active' | 'in_review' | 'revision' | 'approved' | 'completed' | 'cancelled';

export default function BrandOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<HiringRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CampaignTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Offer Action Dialog (Accept, Negotiate, Decline)
  const [selectedOffer, setSelectedOffer] = useState<HiringRequest | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'negotiate' | 'decline' | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chat Dialog
  const [chatCampaign, setChatCampaign] = useState<HiringRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatGated, setChatGated] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Make Agreement & E-Sign Dialog
  const [signCampaign, setSignCampaign] = useState<HiringRequest | null>(null);
  const [agreementDetail, setAgreementDetail] = useState<AgreementDocument | null>(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [makingAgreementId, setMakingAgreementId] = useState<string | null>(null);

  // Download PDF State
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Deliverables Modal
  const [deliverableCampaign, setDeliverableCampaign] = useState<HiringRequest | null>(null);
  const [liveLinks, setLiveLinks] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await marketplaceService.getMyHiringRequests();
      if (res.success && Array.isArray(res.data)) {
        setOffers(res.data);
      } else {
        setOffers([]);
      }
    } catch (err: any) {
      console.error('Failed to load brand offers:', err);
      setError(err?.response?.data?.detail || err.message || 'Failed to load brand offers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const getStatusCategory = (status: string): CampaignTab => {
    const s = (status || '').toLowerCase();
    if (['pending', 'negotiation', 'pending_influencer', 'pending_influencer_response'].includes(s)) return 'pending';
    if (['agreement_pending', 'partially_signed', 'pending_signatures', 'awaiting_admin_approval', 'ready_for_signature'].includes(s)) return 'agreement_pending';
    if (['awaiting_payment', 'payment_pending', 'signed'].includes(s)) return 'awaiting_payment';
    if (['active', 'in_progress', 'paid'].includes(s)) return 'active';
    if (['content_under_review', 'deliverable_submitted', 'submitted'].includes(s)) return 'in_review';
    if (['revision_requested', 'revision_required', 'revision'].includes(s)) return 'revision';
    if (['approved', 'deliverable_approved'].includes(s)) return 'approved';
    if (['completed', 'payout_processing', 'paid_out'].includes(s)) return 'completed';
    if (['cancelled', 'declined', 'disputed', 'rejected'].includes(s)) return 'cancelled';
    return 'active';
  };

  const filteredOffers = offers.filter(o => {
    const matchesTab = activeTab === 'all' || getStatusCategory(o.status) === activeTab;
    const q = searchQuery.toLowerCase();
    const delivStr = Array.isArray(o.deliverables) ? o.deliverables.join(', ') : (o.deliverables || '');
    const matchesSearch = !q || 
      (o.campaign_name && o.campaign_name.toLowerCase().includes(q)) ||
      (delivStr && delivStr.toLowerCase().includes(q)) ||
      (o.hiring_request_id && o.hiring_request_id.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const tabs: { id: CampaignTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Offers & Campaigns', count: offers.length },
    { id: 'pending', label: 'New Offers', count: offers.filter(c => getStatusCategory(c.status) === 'pending').length },
    { id: 'agreement_pending', label: 'Agreement Pending', count: offers.filter(c => getStatusCategory(c.status) === 'agreement_pending').length },
    { id: 'awaiting_payment', label: 'Awaiting Escrow', count: offers.filter(c => getStatusCategory(c.status) === 'awaiting_payment').length },
    { id: 'active', label: 'Active', count: offers.filter(c => getStatusCategory(c.status) === 'active').length },
    { id: 'in_review', label: 'In Review', count: offers.filter(c => getStatusCategory(c.status) === 'in_review').length },
    { id: 'revision', label: 'Revisions', count: offers.filter(c => getStatusCategory(c.status) === 'revision').length },
    { id: 'approved', label: 'Approved', count: offers.filter(c => getStatusCategory(c.status) === 'approved').length },
    { id: 'completed', label: 'Completed', count: offers.filter(c => getStatusCategory(c.status) === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: offers.filter(c => getStatusCategory(c.status) === 'cancelled').length },
  ];

  const getNextAction = (offer: HiringRequest) => {
    const status = (offer.status || '').toLowerCase();
    const agrStatus = (offer.agreement_status || '').toLowerCase();
    const adminStatus = offer.admin_approval?.status;

    if (['pending', 'pending_influencer', 'pending_influencer_response'].includes(status)) {
      return { label: 'Respond to Offer', action: 'respond', color: 'text-amber-400' };
    }
    if (adminStatus === 'pending_admin_review' || agrStatus === 'awaiting_admin_approval' || status === 'awaiting_admin_approval') {
      return { label: 'Awaiting Admin Approval', action: 'view_agreement', color: 'text-yellow-400' };
    }
    if (['agreement_pending', 'ready_for_signature', 'pending_signatures'].includes(status) || ['ready_for_signature', 'pending_signatures', 'agreement_pending'].includes(agrStatus)) {
      return { label: 'Sign Legal Agreement', action: 'sign', color: 'text-purple-400' };
    }
    if (['awaiting_payment', 'payment_pending', 'signed'].includes(status)) {
      return { label: 'Awaiting Brand Payment', action: 'download_pdf', color: 'text-blue-400' };
    }
    if (['active', 'in_progress', 'paid'].includes(status)) {
      return { label: 'Submit Deliverables', action: 'deliverables', color: 'text-emerald-400' };
    }
    if (['content_under_review', 'deliverable_submitted', 'submitted'].includes(status)) {
      return { label: 'Under Brand Review', action: 'deliverables', color: 'text-cyan-400' };
    }
    if (['revision_requested', 'revision_required', 'revision'].includes(status)) {
      return { label: 'Submit Revised Deliverable', action: 'deliverables', color: 'text-orange-400' };
    }
    if (['approved', 'deliverable_approved'].includes(status)) {
      return { label: 'Deliverable Approved', action: 'download_pdf', color: 'text-emerald-400' };
    }
    if (['completed', 'payout_processing', 'paid_out'].includes(status)) {
      return { label: 'Campaign Finished', action: 'download_pdf', color: 'text-neutral-400' };
    }
    return { label: 'View Agreement & PDF', action: 'view_agreement', color: 'text-neutral-300' };
  };

  // 1. Respond (Accept / Negotiate / Decline)
  const handleRespond = async () => {
    if (!selectedOffer || !actionType) return;
    const reqId = selectedOffer.hiring_request_id || selectedOffer.id;
    if (!reqId) return;

    if (actionType === 'decline' && !notes.trim()) {
      alert("A mandatory reason is required to decline an offer.");
      return;
    }

    try {
      setIsSubmitting(true);
      const action = actionType === 'decline' ? 'reject' : 'accept';
      const res = await marketplaceService.respondToHiringRequest(reqId, action, notes);
      if (res.success) {
        alert(`Offer successfully ${actionType}ed!`);
        setSelectedOffer(null);
        setActionType(null);
        setNotes('');
        await fetchOffers();
      }
    } catch (err: any) {
      console.error(`Failed to ${actionType} offer:`, err);
      alert(err.response?.data?.detail || err.message || `Failed to ${actionType} offer.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Make Agreement (Sends request to Admin Panel)
  const handleMakeAgreement = async (offer: HiringRequest) => {
    const reqId = offer.hiring_request_id || offer.id;
    if (!reqId) return;
    try {
      setMakingAgreementId(reqId);
      const res = await marketplaceService.makeAgreement(reqId);
      if (res.success) {
        alert("Agreement request sent to Admin Panel! The admin will review, attach official platform seal & signature, and notify you.");
        await fetchOffers();
      }
    } catch (err: any) {
      console.error("Make agreement error:", err);
      alert(err.response?.data?.detail || err.message || "Failed to request agreement.");
    } finally {
      setMakingAgreementId(null);
    }
  };

  // 3. Open E-Sign / Agreement Modal
  const handleOpenAgreement = async (offer: HiringRequest) => {
    setSignCampaign(offer);
    const reqId = offer.hiring_request_id || offer.id;
    setAgreementLoading(true);
    setSignerName(user?.name || user?.fullName || '');
    try {
      const res = await marketplaceService.getAgreement(reqId);
      if (res.success && res.data) {
        setAgreementDetail(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load agreement:", err);
    } finally {
      setAgreementLoading(false);
    }
  };

  // 4. Sign Agreement
  const handleSignAgreement = async () => {
    if (!signCampaign || !signerName.trim()) {
      alert("Please enter your legal name as digital signature.");
      return;
    }
    const reqId = signCampaign.hiring_request_id || signCampaign.id;
    try {
      setIsSigning(true);
      const res = await marketplaceService.signAgreement(reqId, {
        signer_name: signerName.trim(),
        declaration_accepted: true
      });
      if (res.success) {
        alert("Agreement successfully signed by Influencer! You can now download the PDF.");
        setSignCampaign(null);
        setSignerName('');
        await fetchOffers();
      }
    } catch (err: any) {
      console.error("Sign agreement error:", err);
      alert(err.response?.data?.detail || err.message || "Failed to sign agreement.");
    } finally {
      setIsSigning(false);
    }
  };

  // 5. Download PDF
  const handleDownloadPdf = async (offer: HiringRequest) => {
    const reqId = offer.hiring_request_id || offer.id;
    if (!reqId) return;
    try {
      setDownloadingId(reqId);
      const blob = await marketplaceService.downloadAgreementPdf(reqId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Agreement_${reqId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Download PDF error:", err);
      alert(err.response?.data?.detail || err.message || "Failed to download agreement PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  // 6. Chat with Business
  const handleOpenChat = async (offer: HiringRequest) => {
    setChatCampaign(offer);
    const reqId = offer.hiring_request_id || offer.id;
    setChatLoading(true);
    setChatGated(false);
    try {
      const res = await marketplaceService.getMessages(reqId);
      if (res.success && Array.isArray(res.data)) {
        setChatMessages(res.data);
      } else {
        setChatMessages([]);
      }
    } catch (err: any) {
      console.error("Chat fetch error:", err);
      if (err.response?.status === 403 || err.response?.data?.detail?.includes("payment")) {
        setChatGated(true);
      }
      setChatMessages([]);
    } finally {
      setChatLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  // Auto-refresh chat messages every 3s while chat modal is open
  useEffect(() => {
    if (!chatCampaign) return;
    const reqId = chatCampaign.hiring_request_id || chatCampaign.id;
    if (!reqId) return;

    const interval = setInterval(async () => {
      try {
        const res = await marketplaceService.getMessages(reqId);
        if (res.success && Array.isArray(res.data)) {
          setChatMessages(res.data);
        }
      } catch {
        // silent poll catch
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [chatCampaign]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatCampaign || !chatText.trim() || chatSending) return;
    const reqId = chatCampaign.hiring_request_id || chatCampaign.id;
    try {
      setChatSending(true);
      const res = await marketplaceService.sendMessage(reqId, chatText.trim());
      if (res.success && res.data) {
        setChatMessages(prev => [...prev, res.data]);
        setChatText('');
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err: any) {
      console.error("Chat send error:", err);
      alert(err.response?.data?.detail || "Failed to send message.");
    } finally {
      setChatSending(false);
    }
  };

  // 7. Deliverables Submit
  const handleSubmitDeliverable = async () => {
    if (!deliverableCampaign) return;
    const reqId = deliverableCampaign.hiring_request_id || deliverableCampaign.id;
    const links = liveLinks.split('\n').map(l => l.trim()).filter(Boolean);
    if (links.length === 0) {
      alert("Please provide at least one published deliverable link.");
      return;
    }
    try {
      setIsSubmittingDeliverable(true);
      const res = await marketplaceService.submitDeliverables(reqId, {
        live_links: links,
        notes: deliverableNotes.trim()
      });
      if (res.success) {
        alert("Deliverables submitted successfully for Brand review!");
        setDeliverableCampaign(null);
        setLiveLinks('');
        setDeliverableNotes('');
        await fetchOffers();
      }
    } catch (err: any) {
      console.error("Submit deliverables error:", err);
      alert(err.response?.data?.detail || err.message || "Failed to submit deliverables.");
    } finally {
      setIsSubmittingDeliverable(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#be32ff]" /> Brand Hiring Offers
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review brand collaboration offers, negotiate, request admin seal agreements, and chat directly with verified businesses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOffers}
            disabled={loading}
            className="border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-md shadow-[#be32ff]/20"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-neutral-400"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by name, deliverable, or ID..."
            className="pl-10 bg-[#0e0f17] border-white/10 text-white text-xs h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-40 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOffers.length === 0 && (
        <Card className="bg-[#0e0f17] border-white/10 p-10 text-center rounded-2xl">
          <CardContent className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
              <Sparkles className="w-7 h-7 text-[#fc9a5d]" />
            </div>
            <h3 className="text-base font-bold text-white">No Offers Found in this Category</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              When brands discover your profile and send hiring proposals, they will appear here with compensation, deliverables, and legal agreement tools.
            </p>
            <div className="pt-2">
              <Link href="/influencer/profile">
                <Button size="sm" className="bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold">
                  Update Media Kit &amp; Rates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers & Campaigns Detailed Cards (Matches Image 2 Screen Exactly) */}
      {!loading && filteredOffers.length > 0 && (
        <div className="space-y-4">
          {filteredOffers.map(offer => {
            const reqId = offer.hiring_request_id || offer.id;
            const nextAction = getNextAction(offer);
            const isPendingOffer = ['pending', 'negotiation', 'pending_influencer', 'pending_influencer_response'].includes(offer.status);
            const hasAgreement = !!(offer.agreement_status || offer.admin_approval || ['agreement_pending', 'ready_for_signature', 'signed', 'active', 'payment_pending', 'completed'].includes(offer.status));
            const isAwaitingAdmin = offer.status === 'awaiting_admin_approval' || offer.agreement_status === 'awaiting_admin_approval' || offer.admin_approval?.status === 'pending_admin_review';

            return (
              <Card 
                key={reqId}
                className="bg-[#0e0f17] border-white/10 hover:border-[#be32ff]/40 transition-all rounded-2xl overflow-hidden p-5 space-y-4 shadow-xl"
              >
                {/* Top Row: Title, Status Badge, Short ID, Compensation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white">
                        {offer.campaign_name || "Sponsored Campaign"}
                      </h3>
                      <Badge className="text-[10px] bg-white/5 text-neutral-300 border-white/10 capitalize">
                        {offer.status.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {reqId?.slice(-8)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 flex items-center gap-3 flex-wrap">
                      <span>Platform: <strong className="text-white">{offer.social_platform || "Instagram"}</strong></span>
                      <span>Deliverables: <strong className="text-white truncate max-w-md inline-block align-bottom">{Array.isArray(offer.deliverables) ? offer.deliverables.join(', ') : (offer.deliverables || "1x Dedicated Post")}</strong></span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-neutral-400 block">Agreed Compensation</span>
                    <span className="text-lg font-black text-[#fc9a5d]">
                      ₹{Number(offer.proposed_compensation || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 3-Column Box (Agreement, Escrow Status, Next Action Required) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Agreement</span>
                    <span className="font-semibold text-white capitalize flex items-center gap-1.5 mt-0.5">
                      {isAwaitingAdmin ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Awaiting Admin Approval
                        </span>
                      ) : offer.agreement_status ? (
                        offer.agreement_status.replace(/_/g, ' ')
                      ) : hasAgreement ? (
                        "Generated"
                      ) : (
                        "Pending Initiation"
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[11px]">Escrow Status</span>
                    <span className="font-semibold text-white capitalize flex items-center gap-1.5 mt-0.5">
                      {offer.payment_status ? (
                        offer.payment_status.replace(/_/g, ' ')
                      ) : ['active', 'paid'].includes(offer.status) ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Escrow Funded
                        </span>
                      ) : (
                        "Awaiting Deposit"
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[11px]">Next Action Required</span>
                    <span className={`font-bold mt-0.5 block ${nextAction.color}`}>
                      {nextAction.label}
                    </span>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (isPendingOffer) {
                            setSelectedOffer(offer);
                            setActionType('accept');
                            setNotes('');
                          } else {
                            handleOpenAgreement(offer);
                          }
                        }}
                        className={`text-xs font-bold h-7 px-3 rounded-lg shadow-sm cursor-pointer ${
                          isAwaitingAdmin 
                            ? "bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 border border-amber-500/40" 
                            : isPendingOffer
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : "bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white"
                        }`}
                      >
                        {isAwaitingAdmin ? (
                          <>
                            <Clock className="w-3.5 h-3.5 mr-1 text-amber-300" /> Awaiting Admin Approval
                          </>
                        ) : isPendingOffer ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" /> Review &amp; Approve
                          </>
                        ) : (
                          <>
                            {nextAction.label} <ChevronRight className="w-3 h-3 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons Row */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
                  {/* Approve button (Green Color) */}
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (isPendingOffer) {
                        setSelectedOffer(offer);
                        setActionType('accept');
                        setNotes('');
                      } else {
                        handleOpenAgreement(offer);
                      }
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold h-8 px-3.5 rounded-lg shadow-md shadow-emerald-500/25 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>

                  {/* Make an Agreement button (in place of Agreement & E-Sign) */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      if (!isAwaitingAdmin) {
                        handleMakeAgreement(offer);
                      } else {
                        handleOpenAgreement(offer);
                      }
                    }}
                    disabled={makingAgreementId === reqId}
                    className="border-[#be32ff]/30 bg-[#be32ff]/10 hover:bg-[#be32ff]/20 text-[#be32ff] hover:text-white text-xs h-8 rounded-lg font-medium cursor-pointer"
                  >
                    {makingAgreementId === reqId ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 mr-1" />
                    )}
                    Make an Agreement
                  </Button>

                  {/* Download PDF button */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDownloadPdf(offer)}
                    disabled={downloadingId === reqId}
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs h-8 rounded-lg"
                  >
                    {downloadingId === reqId ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <Download className="w-3.5 h-3.5 mr-1" />
                    )}
                    Download PDF
                  </Button>

                  {/* Chat button (Direct between Business & Influencer) */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleOpenChat(offer)}
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs h-8 rounded-lg"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#fc9a5d]" /> Chat
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 1. Modal: Respond to Offer (Accept / Negotiate / Decline) */}
      {selectedOffer && actionType && (
        <Dialog open={!!actionType} onOpenChange={() => { setSelectedOffer(null); setActionType(null); }}>
          <DialogContent className="bg-[#0e0f17] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold capitalize flex items-center gap-2">
                {actionType === 'accept' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {actionType === 'negotiate' && <Clock className="w-5 h-5 text-amber-400" />}
                {actionType === 'decline' && <XCircle className="w-5 h-5 text-rose-400" />}
                {actionType} Brand Offer
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Campaign: <strong className="text-white">{selectedOffer.campaign_name}</strong> for ₹{Number(selectedOffer.proposed_compensation || 0).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              {actionType === 'accept' && (
                <p className="text-neutral-300 leading-relaxed bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  Accepting this offer confirms your participation. You can then click <strong className="text-white">&quot;Make an Agreement&quot;</strong> to send the bilateral contract directly to the Admin Panel for verification &amp; official platform seal!
                </p>
              )}

              {actionType === 'negotiate' && (
                <div className="space-y-2">
                  <label className="text-neutral-300 font-semibold block">Proposed Counter-Terms or Deliverables</label>
                  <textarea
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                    placeholder="Enter revised compensation request or deliverables adjustment..."
                    className="w-full bg-white/5 border border-white/10 text-white text-xs p-3 min-h-[90px] rounded-xl focus:outline-none focus:border-[#be32ff]"
                  />
                </div>
              )}

              {actionType === 'decline' && (
                <div className="space-y-2">
                  <label className="text-neutral-300 font-semibold block">
                    Reason for Declining <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                    placeholder="Provide a mandatory professional reason (e.g., schedule conflict, niche misalignment)..."
                    className="w-full bg-white/5 border border-white/10 text-white text-xs p-3 min-h-[90px] rounded-xl focus:outline-none focus:border-[#be32ff]"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelectedOffer(null); setActionType(null); }}
                className="border-white/10 bg-white/5 text-neutral-300 hover:text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSubmitting || (actionType === 'decline' && !notes.trim())}
                onClick={handleRespond}
                className={`text-xs font-bold ${
                  actionType === 'accept'
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : actionType === 'negotiate'
                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                    : "bg-rose-500 hover:bg-rose-600 text-white"
                }`}
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                Confirm {actionType.toUpperCase()}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 2. Modal: Direct Chat between Business & Influencer */}
      {chatCampaign && (
        <Dialog open={!!chatCampaign} onOpenChange={() => setChatCampaign(null)}>
          <DialogContent className="bg-[#08090d] border border-white/10 text-white max-w-6xl w-[96vw] h-[88vh] p-6 flex flex-col overflow-hidden rounded-2xl shadow-2xl">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 shrink-0 pr-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7d36fa] to-[#be32ff] flex items-center justify-center text-white shadow-lg shadow-[#be32ff]/20 shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">Collaboration Messages</h2>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> End-to-End Escrow Protected
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Secure, payment-gated collaboration chat directly with hiring brands and marketing directors.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenChat(chatCampaign)}
                  disabled={chatLoading}
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white h-8 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${chatLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* 2-Column Chat Interface */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0 mt-4 overflow-hidden">
              {/* Left Column (md:col-span-4): Campaign Conversations List */}
              <div className="md:col-span-4 bg-[#0e0f17] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-3 border-b border-white/10 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <Input
                      value={chatSearchQuery}
                      onChange={e => setChatSearchQuery(e.target.value)}
                      placeholder="Search conversations..."
                      className="pl-9 pr-7 bg-white/5 border-white/10 text-white text-xs h-9 rounded-xl focus:border-[#be32ff]"
                    />
                    {chatSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setChatSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
                    <span>Direct Conversations</span>
                    <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {offers.filter(c => {
                        const q = chatSearchQuery.toLowerCase();
                        const reqId = c.hiring_request_id || c.id || '';
                        return !q || 
                          (c.campaign_name && c.campaign_name.toLowerCase().includes(q)) ||
                          (c.business_name && c.business_name.toLowerCase().includes(q)) ||
                          (c.hirer_name && c.hirer_name.toLowerCase().includes(q)) ||
                          (reqId && reqId.toLowerCase().includes(q));
                      }).length} Active
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {offers.filter(c => {
                    const q = chatSearchQuery.toLowerCase();
                    const reqId = c.hiring_request_id || c.id || '';
                    return !q || 
                      (c.campaign_name && c.campaign_name.toLowerCase().includes(q)) ||
                      (c.business_name && c.business_name.toLowerCase().includes(q)) ||
                      (c.hirer_name && c.hirer_name.toLowerCase().includes(q)) ||
                      (reqId && reqId.toLowerCase().includes(q));
                  }).map(camp => {
                    const reqId = camp.hiring_request_id || camp.id;
                    const isSelected = (chatCampaign.hiring_request_id || chatCampaign.id) === reqId;
                    const brandInitial = (camp.business_name || camp.hirer_name || camp.campaign_name || 'B')[0].toUpperCase();
                    const deliverablesText = Array.isArray(camp.deliverables) ? camp.deliverables.join(', ') : (camp.deliverables || "1x Post");
                    return (
                      <button
                        key={reqId}
                        onClick={() => handleOpenChat(camp)}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border cursor-pointer relative group ${
                          isSelected
                            ? "bg-gradient-to-r from-[#be32ff]/15 to-[#7d36fa]/10 border-[#be32ff]/50 shadow-lg text-white ring-1 ring-[#be32ff]/30"
                            : "bg-white/[0.02] border-white/5 text-neutral-300 hover:bg-white/5 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 ${
                          isSelected
                            ? "bg-gradient-to-br from-[#fc9a5d] to-[#be32ff] text-white shadow-md shadow-[#be32ff]/20"
                            : "bg-white/10 text-neutral-200 border border-white/10"
                        }`}>
                          {brandInitial}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className="text-xs font-bold text-white truncate">
                              {camp.campaign_name || "Brand Campaign"}
                            </h4>
                            <span className="text-[10px] text-neutral-400 font-mono shrink-0">#{reqId?.slice(-4)}</span>
                          </div>

                          <div className="text-[11px] text-neutral-400 truncate mb-1">
                            {camp.business_name || camp.hirer_name || "Verified Brand"}
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5 gap-2">
                            <span className="truncate text-neutral-400 max-w-[170px]" title={deliverablesText}>
                              {deliverablesText}
                            </span>
                            <span className="text-[#fc9a5d] font-bold shrink-0">
                              ₹{Number(camp.proposed_compensation || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Left Column Footer */}
                <div className="p-3 border-t border-white/5 bg-white/[0.01] text-[10px] text-neutral-400 flex items-center gap-2 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Escrow held securely until deliverables approved</span>
                </div>
              </div>

              {/* Right Column (md:col-span-8): Active Conversation Thread */}
              <div className="md:col-span-8 bg-[#0e0f17] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fc9a5d] to-[#be32ff] p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full rounded-[10px] bg-[#12131f] flex items-center justify-center font-bold text-white text-sm">
                        {(chatCampaign.business_name || chatCampaign.hirer_name || chatCampaign.campaign_name || 'B')[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white truncate">
                          {chatCampaign.campaign_name || "Brand Collaboration"}
                        </h3>
                        <Badge className={`text-[10px] capitalize border ${
                          chatCampaign.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : chatCampaign.status.includes('pending')
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-white/5 text-neutral-300 border-white/10'
                        }`}>
                          {chatCampaign.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5 flex-wrap">
                        <span>Brand: <strong className="text-white font-medium">{chatCampaign.business_name || chatCampaign.hirer_name || "Verified Brand"}</strong></span>
                        <span>•</span>
                        <span className="truncate max-w-[280px]">
                          Deliverables: <strong className="text-neutral-200">{Array.isArray(chatCampaign.deliverables) ? chatCampaign.deliverables.join(', ') : (chatCampaign.deliverables || "1x Post")}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Escrow:{" "}
                          {chatCampaign.fee_paid || chatCampaign.payment_status === 'paid' ? (
                            <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                              <Check className="w-3 h-3" /> Funded &amp; Verified
                            </span>
                          ) : (
                            <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Awaiting Verification
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Compensation</div>
                      <div className="text-sm font-bold text-[#fc9a5d]">
                        ₹{Number(chatCampaign.proposed_compensation || 0).toLocaleString()}
                      </div>
                    </div>
                    {chatCampaign.hirer_signed && chatCampaign.influencer_signed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAgreement(chatCampaign)}
                        className="border-white/10 bg-white/5 hover:bg-white/10 text-xs text-neutral-200 h-8 px-2.5 rounded-lg"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-[#be32ff]" /> Agreement
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-[#090a10]">
                  {chatGated ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-lg">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Collaboration Chat Locked</h4>
                      <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                        Under marketplace security rules, private collaboration messaging unlocks automatically once both parties sign the bilateral agreement and the brand deposits the hiring compensation into escrow.
                      </p>
                    </div>
                  ) : chatLoading && chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-2">
                      <Loader2 className="w-7 h-7 animate-spin text-[#be32ff]" />
                      <p className="text-xs text-neutral-400">Loading secure messages...</p>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto my-auto">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] p-0.5 shadow-xl">
                        <div className="w-full h-full rounded-2xl bg-[#141522] flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-[#fc9a5d]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Direct Channel with {chatCampaign.business_name || chatCampaign.hirer_name || "Brand"}</h4>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          Coordinate creative briefs, scripts, revisions, and deliverable deadlines directly with the hiring team.
                        </p>
                      </div>
                      <div className="w-full space-y-2 pt-2 text-left">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Suggested Quick Replies</span>
                        {[
                          "Hi! Excited to collaborate on this campaign. Could you share the detailed creative brief?",
                          "Please confirm the expected publishing date and any mandatory hashtags or tags.",
                          "I will prepare the video concept and draft script for your review shortly."
                        ].map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setChatText(prompt)}
                            className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#be32ff]/40 text-xs text-neutral-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="truncate">{prompt}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((m, idx) => {
                      const isSystem = 
                        m.sender_id === 'system' || 
                        m.sender_role === 'system' || 
                        m.sender_name?.toLowerCase().includes('assistant') || 
                        m.sender_name?.toLowerCase().includes('system') || 
                        m.message?.startsWith('🎉') || 
                        m.message?.toLowerCase().includes('collaboration activated') ||
                        m.message?.toLowerCase().includes('platform fee');

                      const isMe = m.sender_id === (user?.id || user?._id) || m.sender_role === 'influencer';
                      const timeStr = m.timestamp;
                      const timeFormatted = timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                      if (isSystem) {
                        return (
                          <div key={m.id || idx} className="flex justify-center my-3 px-2">
                            <div className="max-w-lg w-full p-4 rounded-2xl bg-gradient-to-b from-[#be32ff]/10 via-[#be32ff]/5 to-transparent border border-[#be32ff]/25 text-center shadow-lg backdrop-blur-sm">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#be32ff]/20 text-[#fc9a5d] text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#be32ff]/30">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Collaboration Security Verified</span>
                              </div>
                              <p className="text-xs text-white/90 leading-relaxed font-normal">{m.message}</p>
                              <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-neutral-400">
                                <span>Room unlocked via Zaakpay Escrow</span>
                                {timeFormatted && (
                                  <>
                                    <span>•</span>
                                    <span>{timeFormatted}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={m.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-1 px-1">
                            <span className="font-medium text-neutral-300">
                              {isMe ? 'You' : (m.sender_name || chatCampaign.business_name || 'Brand')}
                            </span>
                            {timeFormatted && (
                              <>
                                <span>•</span>
                                <span>{timeFormatted}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-end gap-2 max-w-[85%]">
                            {!isMe && (
                              <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mb-1">
                                {(m.sender_name || chatCampaign.business_name || 'B')[0].toUpperCase()}
                              </div>
                            )}

                            <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                              isMe
                                ? 'bg-gradient-to-r from-[#7d36fa] to-[#be32ff] text-white rounded-br-xs shadow-[#7d36fa]/20'
                                : 'bg-[#181926] border border-white/10 text-neutral-100 rounded-bl-xs'
                            }`}>
                              <p className="whitespace-pre-wrap">{m.message}</p>
                            </div>
                          </div>

                          {isMe && (
                            <div className="flex items-center gap-1 text-[9px] text-neutral-400 mt-1 px-1">
                              <span>Delivered</span>
                              <CheckCheck className="w-3 h-3 text-emerald-400" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#0e0f17] flex flex-col gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        disabled={chatGated || chatLoading || chatSending}
                        value={chatText}
                        onChange={e => setChatText(e.target.value)}
                        placeholder={chatGated ? "Chat locked until payment verification..." : "Type your message or delivery update..."}
                        className="bg-white/5 border-white/10 text-white text-xs h-11 px-4 rounded-xl focus:border-[#be32ff] focus:ring-1 focus:ring-[#be32ff]/40 transition-all placeholder:text-neutral-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={chatGated || chatLoading || chatSending || !chatText.trim()}
                      className="bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] hover:opacity-95 text-white h-11 px-5 rounded-xl font-bold cursor-pointer shadow-lg shadow-[#be32ff]/20 transition-all shrink-0"
                    >
                      {chatSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between px-1 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Direct messages are encrypted and logged for escrow verification
                    </span>
                    <span className="hidden sm:inline">Press Enter ↵ to send</span>
                  </div>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 3. Modal: Agreement Preview & E-Signature with Seal */}
      {signCampaign && (
        <Dialog open={!!signCampaign} onOpenChange={() => setSignCampaign(null)}>
          <DialogContent className="bg-[#0e0f17] border-white/10 text-white max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-5 border-b border-white/10 shrink-0">
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#be32ff]" /> Bilateral Legal Agreement &amp; E-Sign
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Campaign: <strong className="text-white">{signCampaign.campaign_name}</strong> | Fee: ₹{Number(signCampaign.proposed_compensation || 0).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
              {agreementLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 animate-spin text-[#be32ff]" />
                </div>
              ) : agreementDetail ? (
                <>
                  {/* Status Banner */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Agreement Number</span>
                      <span className="text-white font-mono font-bold">{agreementDetail.agreement_number}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[11px]">Admin Seal &amp; Approval</span>
                      <Badge className={`text-[10px] ${
                        agreementDetail.admin_approval?.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {agreementDetail.admin_approval?.status === 'approved' ? 'Verified & Sealed' : 'Pending Admin Seal'}
                      </Badge>
                    </div>
                  </div>

                  {/* Signatures Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-neutral-400 block text-[11px]">Hirer / Business Signature</span>
                      <span className="text-white font-medium flex items-center gap-1.5 mt-1">
                        {agreementDetail.signatures?.hirer?.signed ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Signed ({agreementDetail.signatures.hirer.signer_name})
                          </span>
                        ) : (
                          <span className="text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Pending Signature
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-neutral-400 block text-[11px]">Influencer Signature &amp; Seal</span>
                      <span className="text-white font-medium flex items-center gap-1.5 mt-1">
                        {agreementDetail.signatures?.influencer?.signed ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Signed ({agreementDetail.signatures.influencer.signer_name})
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <PenTool className="w-3.5 h-3.5" /> Ready for Signature
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Legal Clauses Extract */}
                  <div className="space-y-2 p-3 rounded-xl bg-[#08090d] border border-white/5">
                    <span className="text-neutral-300 font-semibold block">Key Binding Clauses:</span>
                    <ul className="space-y-1.5 text-neutral-400 text-[11px] list-disc pl-4 leading-relaxed">
                      <li>Deliverables must conform to agreed brief and quality standards.</li>
                      <li>Escrow release occurs upon verified deliverable approval.</li>
                      <li>Protected under Information Technology Act, 2000 Section 10A electronic contracts.</li>
                    </ul>
                  </div>

                  {/* Signing input if not signed yet */}
                  {!agreementDetail.signatures?.influencer?.signed && (
                    <div className="space-y-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-[#be32ff]" /> Provide Electronic Signature
                      </h4>
                      <p className="text-[11px] text-neutral-300">
                        Enter your legal full name below. Your signature will be cryptographically hashed (SHA-256) and sealed on the official PDF document.
                      </p>
                      <div className="space-y-1">
                        <label className="text-[11px] text-neutral-400">Legal Signer Name</label>
                        <Input
                          value={signerName}
                          onChange={e => setSignerName(e.target.value)}
                          placeholder="e.g. Sejal Gupta"
                          className="bg-white/5 border-white/10 text-white text-xs h-9"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-neutral-400">
                  <p>Agreement document not generated yet. Click &quot;Make an Agreement&quot; to initiate it.</p>
                </div>
              )}
            </div>

            <DialogFooter className="p-4 border-t border-white/10 bg-[#08090d] flex items-center justify-between sm:justify-between gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadPdf(signCampaign)}
                disabled={downloadingId === (signCampaign.hiring_request_id || signCampaign.id)}
                className="border-white/10 bg-white/5 text-neutral-300 hover:text-white text-xs h-9"
              >
                {downloadingId === (signCampaign.hiring_request_id || signCampaign.id) ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                )}
                Download PDF
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSignCampaign(null)}
                  className="text-neutral-400 hover:text-white text-xs h-9"
                >
                  Close
                </Button>

                {agreementDetail && !agreementDetail.signatures?.influencer?.signed && (
                  <Button
                    size="sm"
                    disabled={isSigning || !signerName.trim()}
                    onClick={handleSignAgreement}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-lg shadow-emerald-500/20"
                  >
                    {isSigning ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />}
                    Accept &amp; Sign Agreement
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 4. Modal: Submit Deliverables */}
      {deliverableCampaign && (
        <Dialog open={!!deliverableCampaign} onOpenChange={() => setDeliverableCampaign(null)}>
          <DialogContent className="bg-[#0e0f17] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" /> Submit Campaign Deliverables
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Campaign: <strong className="text-white">{deliverableCampaign.campaign_name}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold block">Live Content Links (One per line) *</label>
                <textarea
                  value={liveLinks}
                  onChange={e => setLiveLinks(e.target.value)}
                  placeholder="https://www.instagram.com/reel/...&#10;https://www.youtube.com/watch?v=..."
                  className="w-full bg-white/5 border border-white/10 text-white text-xs p-3 min-h-[90px] rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold block">Notes for Brand Review (Optional)</label>
                <textarea
                  value={deliverableNotes}
                  onChange={e => setDeliverableNotes(e.target.value)}
                  placeholder="Mention view counts, tags included, or analytics summary..."
                  className="w-full bg-white/5 border border-white/10 text-white text-xs p-3 min-h-[70px] rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeliverableCampaign(null)}
                className="border-white/10 bg-white/5 text-neutral-300 hover:text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSubmittingDeliverable || !liveLinks.trim()}
                onClick={handleSubmitDeliverable}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
              >
                {isSubmittingDeliverable ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                Submit Deliverables
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
