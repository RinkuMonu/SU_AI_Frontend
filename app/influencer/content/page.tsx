"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  FileImage, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Check, 
  X, 
  FileText, 
  MessageSquare, 
  UploadCloud, 
  Send, 
  AlertCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Building2,
  IndianRupee,
  Layers,
  Sparkles,
  RefreshCw,
  Upload,
  Trash2
} from 'lucide-react';
import marketplaceService, { 
  HiringRequest, 
  AgreementDocument, 
  ChatMessage 
} from '@/services/marketplace.service';
import influencerService from '@/services/influencer.service';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function InfluencerContentPage() {
  const { user } = useAuth();
  const [deals, setDeals] = useState<HiringRequest[]>([]);
  const [legacyCollabs, setLegacyCollabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Deliverable Submission Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeDeal, setActiveDeal] = useState<HiringRequest | null>(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Agreement Modal
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementDoc, setAgreementDoc] = useState<AgreementDocument | null>(null);
  const [signerLegalName, setSignerLegalName] = useState('');
  const [signerTitle, setSignerTitle] = useState('Content Creator / Influencer');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSigningAgreement, setIsSigningAgreement] = useState(false);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const signatureFileInputRef = useRef<HTMLInputElement | null>(null);

  // Chat Modal
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const [hiringRes, colRes] = await Promise.all([
        marketplaceService.getMyHiringRequests().catch(() => ({ success: false, data: [] })),
        influencerService.getMyCollaborations().catch(() => ({ success: false, data: [] }))
      ]);
      setDeals(hiringRes.data || []);
      setLegacyCollabs(colRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Accept / Decline Deal
  const handleDealResponse = async (dealId: string, action: 'accept' | 'reject') => {
    try {
      const res = await marketplaceService.respondToHiringRequest(dealId, action);
      if (res.success) {
        fetchDeals();
        alert(action === 'accept' ? "Deal accepted! Please review and sign the electronic agreement." : "Deal rejected.");
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to respond to deal.");
    }
  };

  // Agreement Review & Sign
  const openAgreement = async (deal: HiringRequest) => {
    setActiveDeal(deal);
    setShowAgreementModal(true);
    setAgreementLoading(true);
    setSignerLegalName(user?.name || user?.fullName || deal.influencer_name || '');
    setSignerTitle('Content Creator / Influencer');
    setDeclarationAccepted(false);
    setUploadedSignature(null);

    try {
      const res = await marketplaceService.getAgreement(deal.hiring_request_id);
      if (res.success && res.data) {
        setAgreementDoc(res.data);
      }
    } catch (e) {
      console.error("Failed to load agreement:", e);
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (PNG, JPG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedSignature(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSignAgreement = async () => {
    if (!signerLegalName.trim() || !declarationAccepted || !activeDeal) return;
    try {
      setIsSigningAgreement(true);
      const res = await marketplaceService.signAgreement(activeDeal.hiring_request_id, {
        signer_name: signerLegalName.trim(),
        declaration_accepted: true,
        signer_title: signerTitle || 'Content Creator / Influencer',
        signature_image: uploadedSignature || undefined
      });
      if (res.success) {
        if (res.agreement) {
          setAgreementDoc(res.agreement);
        }
        await fetchDeals();
        if (res.is_fully_signed) {
          alert("🎉 Bilateral Agreement fully executed by both parties! Status is now Payment Pending. Waiting for brand escrow deposit to commence work.");
        } else {
          alert("✅ Agreement signed successfully! Your cryptographic SHA-256 signature digest has been recorded on the audit trail. Waiting for brand signature.");
        }
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to sign agreement");
    } finally {
      setIsSigningAgreement(false);
    }
  };

  // Submit Deliverables
  const openSubmitModal = (deal: HiringRequest) => {
    setActiveDeal(deal);
    setLiveUrl('');
    setSubmissionNotes('');
    setShowSubmitModal(true);
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveUrl.trim() || !activeDeal) {
      alert("Please provide the published post/reel URL.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await marketplaceService.submitDeliverables(activeDeal.hiring_request_id, {
        live_links: [liveUrl.trim()],
        notes: submissionNotes.trim()
      });
      if (res.success) {
        setShowSubmitModal(false);
        fetchDeals();
        alert("Deliverables submitted! Brand has been notified to review your work.");
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to submit deliverables.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chat
  const openChat = async (deal: HiringRequest) => {
    setActiveDeal(deal);
    setShowChatModal(true);
    setChatLoading(true);
    setNewChatMessage('');
    try {
      const res = await marketplaceService.getMessages(deal.hiring_request_id);
      if (res.success) {
        setChatMessages(res.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !activeDeal) return;
    try {
      setSendingMessage(true);
      const res = await marketplaceService.sendMessage(activeDeal.hiring_request_id, newChatMessage.trim());
      if (res.success && res.data) {
        setChatMessages(prev => [...prev, res.data]);
        setNewChatMessage('');
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to send message.");
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_influencer_response':
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Action Needed: Review Proposal</Badge>;
      case 'awaiting_admin_approval':
      case 'agreement_admin_review_pending':
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold">Awaiting Admin Review</Badge>;
      case 'ready_for_signature':
      case 'agreement_approved':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold">Action Needed: Sign Agreement</Badge>;
      case 'accepted':
      case 'agreement_pending':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Action Needed: Sign Agreement</Badge>;
      case 'payment_pending':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Awaiting Brand Escrow</Badge>;
      case 'in_progress':
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">In Progress — Create Content</Badge>;
      case 'work_submitted':
        return <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Under Brand Review</Badge>;
      case 'revision_requested':
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Revision Requested by Brand</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed &amp; Payout Settled</Badge>;
      default:
        return <Badge variant="outline" className="text-white/70 border-white/20 capitalize">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileImage className="w-6 h-6 text-[#be32ff]" />
            Brand Collaboration Deals &amp; Content Hub
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Review brand hiring proposals, sign electronic agreements, chat with brand marketers, and submit verified deliverables.
          </p>
        </div>
        <Link href="/influencer/marketplace">
          <Button size="sm" className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold">
            Explore Open Briefs
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-[#0f1017] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : deals.length === 0 && legacyCollabs.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0f1017]/60 p-12 text-center space-y-4">
          <Layers className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Collaboration Deals Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            When brands send you hiring proposals, they will appear right here with full contract terms.
          </p>
          <Link href="/influencer/marketplace">
            <Button size="sm" className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold">
              Apply to Brand Campaigns
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => (
            <div 
              key={deal.id || deal.hiring_request_id}
              className="bg-[#0f1017] border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-purple/40 transition-all shadow"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-white">{deal.campaign_name}</h4>
                  {getStatusBadge(deal.status)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-white/70">
                  <div>
                    <span className="text-white/40 block">Hiring Brand:</span>
                    <strong className="text-white">{deal.business_name}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 block">Your Net Compensation:</span>
                    <strong className="text-[#fc9a5d]">₹{deal.proposed_compensation.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 block">Platform:</span>
                    <strong className="text-white">{deal.social_platform}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 block">Deadline:</span>
                    <strong className="text-white">{deal.end_date}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {deal.deliverables?.map((d, i) => (
                    <span key={i} className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/80">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Influencer */}
              <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0 w-full md:w-auto">
                {/* 1. Pending Response: Accept or Decline + Review Agreement Draft */}
                {deal.status === 'pending_influencer_response' && (
                  <div className="flex flex-wrap gap-1.5">
                    <Button 
                      onClick={() => handleDealResponse(deal.hiring_request_id, 'accept')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-3"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Accept Deal
                    </Button>
                    <Button 
                      onClick={() => handleDealResponse(deal.hiring_request_id, 'reject')}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs h-9 px-3"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Decline
                    </Button>
                    <Button 
                      onClick={() => openAgreement(deal)}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/15 text-white text-xs h-9 px-3 flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-purple" /> Review Terms
                    </Button>
                  </div>
                )}

                {/* 2. Agreement Signing / Review Stage */}
                {['agreement_pending', 'accepted', 'hirer_signed', 'influencer_signed'].includes(deal.status) && (
                  <Button 
                    onClick={() => openAgreement(deal)}
                    className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs h-9 px-4 flex items-center justify-center gap-1.5 shadow-md shadow-brand-purple/20"
                  >
                    <FileText className="w-3.5 h-3.5" /> 
                    <span>{deal.influencer_signed || deal.status === 'influencer_signed' ? 'View Agreement (Signed)' : 'Review & Sign Agreement'}</span>
                  </Button>
                )}

                {/* In other stages: View Agreement button */}
                {['payment_pending', 'in_progress', 'work_submitted', 'under_review', 'revision_requested', 'completed', 'disputed'].includes(deal.status) && (
                  <Button 
                    onClick={() => openAgreement(deal)}
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/15 text-white/90 text-xs h-9 px-3 flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-purple" />
                    <span>View Agreement</span>
                  </Button>
                )}

                {/* 3. In Progress / Revision Requested: Submit Work */}
                {(deal.status === 'in_progress' || deal.status === 'revision_requested') && (
                  <Button 
                    onClick={() => openSubmitModal(deal)}
                    className="bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] hover:opacity-95 text-white font-semibold text-xs h-9 px-4 border-0"
                  >
                    <UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Submit Deliverables
                  </Button>
                )}

                {/* 4. Active Room: Chat with Brand */}
                {['in_progress', 'work_submitted', 'under_review', 'revision_requested', 'completed'].includes(deal.status) && (
                  <Button 
                    onClick={() => openChat(deal)}
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs h-9 px-4"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-brand-purple" /> Chat with Brand
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deliverable Submission Dialog */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UploadCloud className="text-[#fc9a5d] w-5 h-5" /> Submit Deliverables
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Provide published post or reel link for &quot;{activeDeal?.campaign_name}&quot;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitDeliverable} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-white/70 font-medium">Published Live Link (Instagram / YouTube URL) *</label>
              <input 
                type="url"
                required
                value={liveUrl}
                onChange={e => setLiveUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/70 font-medium">Proof Notes / Metrics Summary</label>
              <textarea 
                rows={3}
                value={submissionNotes}
                onChange={e => setSubmissionNotes(e.target.value)}
                placeholder="Content published as agreed with required hashtag and brand tag..."
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-brand-purple focus:outline-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowSubmitModal(false)} className="border-white/10 text-white">Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <UploadCloud className="w-4 h-4 mr-1" />}
                Confirm Submission
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* AGREEMENT REVIEW & ELECTRONIC SIGNATURE MODAL */}
      {/* ============================================================== */}
      <Dialog open={showAgreementModal} onOpenChange={setShowAgreementModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-brand-purple w-5 h-5" /> 
              Bilateral Influencer Marketing Agreement
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Legally binding collaboration contract. Both parties must execute electronic signatures to activate the campaign.
            </DialogDescription>
          </DialogHeader>

          {agreementLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
              <p className="text-xs text-white/60">Loading verified agreement document...</p>
            </div>
          ) : agreementDoc ? (
            <div className="space-y-4 py-3 text-xs text-white/80">
              {/* Document Header */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{agreementDoc.title}</h4>
                  <p className="text-white/50 text-[11px]">Agreement No: {agreementDoc.agreement_number} | Version {agreementDoc.version}</p>
                </div>
                <Badge className="bg-brand-purple/20 text-brand-purple border-brand-purple/30">
                  {agreementDoc.status.replace(/_/g, ' ')}
                </Badge>
              </div>

              {/* Contracting Parties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Hirer / Brand (Party A)</span>
                  <div className="text-white font-semibold text-xs">{agreementDoc.hirer_party?.legal_name || 'Brand Representative'}</div>
                  <div className="text-[11px] text-white/70">{agreementDoc.hirer_party?.business_name || 'Registered Business'}</div>
                  <div className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                    <span>ID: {agreementDoc.hirer_party?.user_id?.slice(0, 10)}...</span>
                    <span>•</span>
                    <span className="truncate">{agreementDoc.hirer_party?.email}</span>
                  </div>
                </div>
                <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-3">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Creator / Influencer (Party B)</span>
                  <div className="text-white font-semibold text-xs">{agreementDoc.influencer_party?.legal_name || 'Creator'}</div>
                  <div className="text-[11px] text-[#fc9a5d] font-medium">{agreementDoc.influencer_party?.username}</div>
                  <div className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                    <span>Creator ID: {agreementDoc.influencer_party?.user_id?.slice(0, 10)}...</span>
                    <span className="text-emerald-400 font-mono bg-emerald-500/10 px-1 py-0.2 rounded text-[9px]">Verified</span>
                  </div>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#fc9a5d]" /> Scope of Work & Deliverables
                </h5>
                <div className="space-y-1 text-xs text-white/80">
                  <div>
                    <span className="text-white/40">Campaign Objectives: </span>
                    <span>{agreementDoc.campaign_details?.campaign_objectives || activeDeal?.campaign_objectives || 'Brand awareness and engagement'}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Target Social Platform: </span>
                    <span className="font-medium text-white">{agreementDoc.campaign_details?.social_platform || activeDeal?.social_platform || 'Instagram'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-1">Contract Deliverables:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(agreementDoc.campaign_details?.deliverables || activeDeal?.deliverables || []).map((d: string, idx: number) => (
                        <span key={idx} className="bg-brand-purple/20 border border-brand-purple/30 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" /> {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Terms & Escrow Schedule */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Financial Terms & Escrow Payout
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/40 block text-[10px]">Agreed Creator Compensation:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">₹{(agreementDoc.financial_terms?.agreed_compensation || activeDeal?.proposed_compensation || 0).toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/40 block text-[10px]">Escrow Release Schedule:</span>
                    <span className="font-medium text-white/90 text-xs">100% Payout released upon Brand approval of deliverables.</span>
                  </div>
                </div>
              </div>

              {/* Legal Clauses */}
              <div className="space-y-3 p-4 bg-white/[0.02] border border-white/10 rounded-xl max-h-52 overflow-y-auto custom-scrollbar">
                <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Enforceable Legal Clauses</div>
                {agreementDoc.legal_clauses?.map((c, i) => (
                  <div key={i} className="space-y-1 p-2 rounded-lg bg-white/[0.02]">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                      <span>{c.clause_title}</span>
                    </h5>
                    <p className="text-white/70 text-xs leading-relaxed pl-5">{c.clause_text}</p>
                  </div>
                ))}
              </div>

              {/* Both Signatures Audit Trail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white/[0.02] border border-white/10 rounded-xl">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Party A: Hirer Signature</span>
                  {agreementDoc.signatures?.hirer?.signed ? (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs">
                      <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Signed by {agreementDoc.signatures.hirer.signer_name}</span>
                      </div>
                      <div className="text-[10px] text-white/60">Title: {agreementDoc.signatures.hirer.signer_title || 'Authorized Signatory'}</div>
                      <div className="text-[10px] text-white/50">
                        Date: {new Date(agreementDoc.signatures.hirer.signed_at || '').toLocaleString()}
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400/90 truncate pt-0.5">
                        SHA256: {agreementDoc.signatures.hirer.signature_hash || agreementDoc.signatures.hirer.digest || 'Cryptographic Checksum Verified'}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Awaiting Hirer Signature</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Party B: Influencer Signature</span>
                  {agreementDoc.signatures?.influencer?.signed ? (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs">
                      <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Signed by {agreementDoc.signatures.influencer.signer_name}</span>
                      </div>
                      <div className="text-[10px] text-white/50">
                        Date: {new Date(agreementDoc.signatures.influencer.signed_at || '').toLocaleString()}
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400/90 truncate pt-0.5">
                        SHA256: {agreementDoc.signatures.influencer.signature_hash || agreementDoc.signatures.influencer.digest || 'Cryptographic Checksum Verified'}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Awaiting Your Signature</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bilateral Fully Signed Banner */}
              {(agreementDoc.status === 'fully_signed' || (agreementDoc.signatures?.hirer?.signed && agreementDoc.signatures?.influencer?.signed)) ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white text-sm">Bilateral Agreement Fully Executed!</span>
                  </div>
                  <p className="text-xs text-emerald-200/90">
                    Both parties have executed binding electronic signatures with cryptographic SHA-256 verification. The brand can now deposit escrow funds to initiate campaign deliverables.
                  </p>
                </div>
              ) : agreementDoc.admin_approval?.status === 'pending_admin_review' ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold">Awaiting Admin Approval:</span>
                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                      The agreement draft is currently under manual admin review. Bilateral signing will unlock automatically once approved.
                    </p>
                  </div>
                </div>
              ) : agreementDoc.admin_approval?.status === 'rejected' ? (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold">Agreement Rejected by Admin:</span>
                    <p className="text-[11px] text-rose-200/90 mt-0.5">
                      {agreementDoc.rejection_reason || 'Compliance review failed. Please contact support.'}
                    </p>
                  </div>
                </div>
              ) : !agreementDoc.signatures?.influencer?.signed ? (
                /* Influencer E-Signature Execution Form */
                <div className="p-4 bg-brand-purple/10 border border-brand-purple/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-purple" />
                      <span>Execute Electronic Signature (Content Creator)</span>
                    </h5>
                    <span className="text-[10px] text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded font-mono">
                      Legally Binding
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Full Legal Signatory Name *</label>
                      <input 
                        type="text" 
                        value={signerLegalName}
                        onChange={e => setSignerLegalName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs focus:border-brand-purple focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Signatory Title / Designation *</label>
                      <input 
                        type="text" 
                        value={signerTitle}
                        onChange={e => setSignerTitle(e.target.value)}
                        placeholder="e.g. Content Creator / Influencer"
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs focus:border-brand-purple focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* SIGNATURE UPLOAD BUTTON & PREVIEW SECTION */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#fc9a5d]" />
                        <span>Upload Handwritten / Digital Signature</span>
                        <span className="text-[10px] text-white/40 font-normal">(Optional • PNG, JPG, WebP)</span>
                      </label>
                      {uploadedSignature && (
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedSignature(null);
                            if (signatureFileInputRef.current) signatureFileInputRef.current.value = '';
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove Signature
                        </button>
                      )}
                    </div>

                    <input 
                      type="file"
                      ref={signatureFileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleSignatureFileChange}
                      className="hidden"
                    />

                    {uploadedSignature ? (
                      <div className="p-3 bg-white/5 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-44 bg-white rounded-lg p-1.5 flex items-center justify-center border border-white/20 shadow-sm">
                            <img 
                              src={uploadedSignature} 
                              alt="Uploaded Signature Preview" 
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Signature Ready to Embed</span>
                            </div>
                            <p className="text-[10px] text-white/50 mt-0.5">
                              Will be affixed to your official agreement certificate
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => signatureFileInputRef.current?.click()}
                          className="border-white/20 text-white hover:bg-white/10 text-xs h-8"
                        >
                          <Upload className="w-3 h-3 mr-1 text-[#fc9a5d]" /> Change Signature
                        </Button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => signatureFileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        className="w-full p-4 border-2 border-dashed border-white/20 hover:border-[#fc9a5d]/70 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl flex items-center justify-center gap-3 text-xs text-white/70 hover:text-white cursor-pointer transition-all group select-none"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-[#fc9a5d]/20 flex items-center justify-center text-[#fc9a5d] transition-colors">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-white block group-hover:text-[#fc9a5d] transition-colors">
                            Click to Upload Signature Image
                          </span>
                          <span className="text-[10px] text-white/40">
                            Upload a photo or scanned image of your handwritten signature (PNG, JPG)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input 
                      type="checkbox"
                      id="creator-declaration"
                      checked={declarationAccepted}
                      onChange={e => setDeclarationAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-white/30"
                    />
                    <label htmlFor="creator-declaration" className="text-[11px] text-white/80 cursor-pointer">
                      I declare that I am the authorized content creator named above, and I agree to be legally bound by all terms, deliverables, revision policies, and advertising compliance standards in this agreement.
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-white/70">
                  You have affixed your electronic signature. Awaiting brand signature / escrow deposit to activate campaign work.
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setShowAgreementModal(false)} className="border-white/10 text-white hover:bg-white/10 text-xs">
                  Close
                </Button>
                {!agreementDoc.signatures?.influencer?.signed && (
                  <Button 
                    onClick={handleSignAgreement}
                    disabled={isSigningAgreement || !declarationAccepted || !signerLegalName.trim()}
                    className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs"
                  >
                    {isSigningAgreement ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                    {isSigningAgreement ? "Affixing Electronic Signature..." : "Sign Agreement Electronically"}
                  </Button>
                )}
              </DialogFooter>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <div className="text-white font-semibold text-sm">Agreement Document Ready</div>
              <p className="text-xs text-white/60 max-w-sm">
                Click below to load the bilateral agreement draft for this collaboration.
              </p>
              <Button 
                onClick={() => activeDeal && openAgreement(activeDeal)}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white text-xs h-9 px-4 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Load Agreement
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-2xl h-[75vh] flex flex-col p-0 overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/10">
            <h4 className="font-bold text-white text-sm">{activeDeal?.campaign_name}</h4>
            <p className="text-xs text-white/50">Chatting with Brand: {activeDeal?.business_name}</p>
          </div>

          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
            {chatLoading ? (
              <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-purple" /></div>
            ) : chatMessages.length === 0 ? (
              <div className="text-center py-16 text-white/40 text-xs">No messages yet. Send a greeting to the brand!</div>
            ) : (
              chatMessages.map(msg => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-white/40 mb-1">{msg.sender_name}</span>
                    <div className={`p-3 rounded-2xl max-w-sm text-xs ${isMe ? 'bg-brand-purple text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
            <input 
              type="text"
              value={newChatMessage}
              onChange={e => setNewChatMessage(e.target.value)}
              placeholder="Type message to the brand..."
              className="flex-1 p-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
            />
            <Button type="submit" disabled={sendingMessage || !newChatMessage.trim()} className="bg-brand-purple text-white h-9 px-4">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
