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
  Loader2,
  ShieldCheck,
  Building2,
  IndianRupee,
  Layers
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
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSigningAgreement, setIsSigningAgreement] = useState(false);
  const [agreementLoading, setAgreementLoading] = useState(false);

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
    setDeclarationAccepted(false);

    try {
      const res = await marketplaceService.getAgreement(deal.hiring_request_id);
      if (res.success && res.data) {
        setAgreementDoc(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!signerLegalName.trim() || !declarationAccepted || !activeDeal) return;
    try {
      setIsSigningAgreement(true);
      const res = await marketplaceService.signAgreement(activeDeal.hiring_request_id, {
        signer_name: signerLegalName,
        declaration_accepted: true,
        signer_title: 'Content Creator'
      });
      if (res.success) {
        setShowAgreementModal(false);
        fetchDeals();
        alert("Agreement signed! Waiting for brand escrow deposit to commence work.");
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
                {/* 1. Pending Response: Accept or Decline */}
                {deal.status === 'pending_influencer_response' && (
                  <div className="flex gap-2">
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
                  </div>
                )}

                {/* 2. Agreement Pending: Review & Sign Agreement */}
                {(deal.status === 'agreement_pending' || deal.status === 'accepted') && (
                  <Button 
                    onClick={() => openAgreement(deal)}
                    className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs h-9 px-4"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" /> Sign Electronic Agreement
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

      {/* Agreement Dialog */}
      <Dialog open={showAgreementModal} onOpenChange={setShowAgreementModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-brand-purple w-5 h-5" /> 
              Sign Influencer Agreement
            </DialogTitle>
          </DialogHeader>

          {agreementLoading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-purple" /></div>
          ) : agreementDoc ? (
            <div className="space-y-4 py-2 text-xs text-white/80">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white">{agreementDoc.title}</h4>
                <p className="text-white/50 text-[11px]">Agreed Compensation: ₹{agreementDoc.financial_terms?.agreed_compensation}</p>
              </div>

              <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl max-h-48 overflow-y-auto custom-scrollbar">
                {agreementDoc.legal_clauses?.map((c, i) => (
                  <div key={i} className="space-y-0.5">
                    <strong className="text-white">{c.clause_title}</strong>
                    <p className="text-white/60">{c.clause_text}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-brand-purple/10 border border-brand-purple/30 rounded-xl space-y-2">
                <label className="block text-white font-medium">Type Full Legal Name *</label>
                <input 
                  type="text" 
                  value={signerLegalName}
                  onChange={e => setSignerLegalName(e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none"
                />
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="creator-dec" 
                    checked={declarationAccepted}
                    onChange={e => setDeclarationAccepted(e.target.checked)}
                    className="mt-0.5" 
                  />
                  <label htmlFor="creator-dec" className="text-[11px] text-white/80 cursor-pointer">
                    I agree to perform agreed deliverables according to schedule and adhere to legal advertising standards.
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAgreementModal(false)} className="border-white/10 text-white">Cancel</Button>
                <Button 
                  onClick={handleSignAgreement} 
                  disabled={isSigningAgreement || !declarationAccepted || !signerLegalName.trim()}
                  className="bg-brand-purple text-white font-semibold"
                >
                  {isSigningAgreement ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                  Sign &amp; Accept Deal
                </Button>
              </DialogFooter>
            </div>
          ) : null}
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
