"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Users, 
  Wand2, 
  Sparkles, 
  Check, 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  BarChart2, 
  Trash2, 
  Plus,
  ShieldCheck,
  FileText,
  CreditCard,
  MessageSquare,
  Send,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  IndianRupee,
  ChevronRight,
  Info
} from 'lucide-react';
import influencerService, { Influencer, InfluencerProfile, Campaign } from '@/services/influencer.service';
import marketplaceService, { 
  MarketplaceInfluencer, 
  HiringRequest, 
  AgreementDocument, 
  PlatformServiceFee,
  ChatMessage 
} from '@/services/marketplace.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencersPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState('discover');

  // Discovery State
  const [influencers, setInfluencers] = useState<MarketplaceInfluencer[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([]);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [crmCampaigns, setCrmCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    min_followers: '',
    location: '',
    platform: '',
    sort_by: 'followers_desc'
  });
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Platform Fee Config
  const [platformFee, setPlatformFee] = useState<PlatformServiceFee>({
    service_fee: 199,
    currency: 'INR',
    tax_percentage: 18,
    tax_amount: 35.82,
    total_fee: 234.82,
    fee_description: 'Platform Escrow & Contract Protection Fee'
  });

  // Selected Creator for Pitch / Hiring
  const [selectedInfluencer, setSelectedInfluencer] = useState<MarketplaceInfluencer | null>(null);

  // PHASE 2: HIRING MODAL STATE
  const [showHireModal, setShowHireModal] = useState(false);
  const [hiringForm, setHiringForm] = useState({
    influencer_id: '',
    campaign_name: '',
    product_or_service: '',
    campaign_objectives: 'Boost brand awareness, engagement, and direct conversion via authentic video review.',
    deliverables: ['1 Dedicated Instagram Reel (9:16)', '2 Instagram Stories with product tag'],
    customDeliverable: '',
    social_platform: 'Instagram',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    proposed_compensation: 5000,
    revision_requirements: 'Up to 2 creative revisions included.',
    special_instructions: 'Ensure clear lighting, prominent product framing, and proper #ad tag.'
  });
  const [isSubmittingHiring, setIsSubmittingHiring] = useState(false);

  // PHASE 3: AGREEMENT MODAL STATE
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [activeAgreementRequest, setActiveAgreementRequest] = useState<HiringRequest | null>(null);
  const [agreementDoc, setAgreementDoc] = useState<AgreementDocument | null>(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [signerLegalName, setSignerLegalName] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSigningAgreement, setIsSigningAgreement] = useState(false);

  // PHASE 4: PAYMENT MODAL STATE
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<HiringRequest | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // PHASE 5: PRIVATE CHAT MODAL STATE
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState<HiringRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // PHASE 6: DELIVERABLES REVIEW MODAL STATE
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRequest, setReviewRequest] = useState<HiringRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Manual Add Creator Modal
  const [showAddInfluencerModal, setShowAddInfluencerModal] = useState(false);
  const [newInfluencer, setNewInfluencer] = useState({ name: '', platform: 'Instagram', niche: '', followers_count: 0, engagement_rate: 0, contact_email: '' });
  const [isAddingInfluencer, setIsAddingInfluencer] = useState(false);

  // AI Pitch Modal
  const [showPitchDialog, setShowPitchDialog] = useState(false);
  const [pitchStyle, setPitchStyle] = useState('Professional');
  const [pitchDeliverables, setPitchDeliverables] = useState('1 Reel, 2 Stories');
  const [pitchBudget, setPitchBudget] = useState('5000');
  const [pitchLoading, setPitchLoading] = useState(false);

  // Insights Dialog
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);
  const [activeInsightCampaign, setActiveInsightCampaign] = useState<any>(null);
  const [campaignDashboardData, setCampaignDashboardData] = useState<any>(null);
  const [campaignInsightsData, setCampaignInsightsData] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Outside click for location dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Location search debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationSearchTerm.length > 2) {
        setIsLocationLoading(true);
        try {
          const res = await influencerService.searchLocations(locationSearchTerm);
          if (res.success && res.data) {
            let formattedOptions: string[] = [];
            if (res.data.features && Array.isArray(res.data.features)) {
              formattedOptions = res.data.features.map((f: any) => {
                if (f.properties?.formatted) return f.properties.formatted;
                const { city, state, country } = f.properties || {};
                return [city, state, country].filter(Boolean).join(', ');
              }).filter(Boolean);
            } else if (res.data.suggestions && Array.isArray(res.data.suggestions)) {
              formattedOptions = res.data.suggestions.map((s: any) => s.placePrediction?.text?.text).filter(Boolean);
            }
            setLocationOptions(Array.from(new Set(formattedOptions)));
            setShowLocationDropdown(true);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLocationLoading(false);
        }
      } else {
        setLocationOptions([]);
        setShowLocationDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [locationSearchTerm]);

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
    fetchPlatformFee();
  }, []);

  const fetchPlatformFee = async () => {
    try {
      const res = await marketplaceService.getServiceFee();
      if (res.success && res.data) {
        setPlatformFee(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [infRes, hiringRes, colRes, shortRes, crmRes] = await Promise.all([
        marketplaceService.discover({
          search: filters.search,
          niche: filters.category,
          min_followers: filters.min_followers ? Number(filters.min_followers) : undefined,
          location: filters.location,
          platform: filters.platform,
          sort_by: filters.sort_by
        }).catch(() => ({ success: false, data: { items: [], pagination: {} } })),
        marketplaceService.getMyHiringRequests().catch(() => ({ success: false, data: [] })),
        influencerService.getBusinessCollaborations().catch(() => ({ success: true, data: [] })),
        influencerService.getShortlist().catch(() => ({ data: [] })),
        influencerService.getCampaigns().catch(() => ({ data: [] }))
      ]);

      setInfluencers(infRes.data?.items || []);
      setHiringRequests(hiringRes.data || []);
      setCollaborations(colRes?.data || []);
      setShortlist(shortRes?.data || []);
      setCrmCampaigns(crmRes?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleToggleShortlist = async (id: string) => {
    try {
      await influencerService.toggleShortlist(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const isShortlisted = (id: string) => {
    return shortlist.some(item => item.influencer_id === id || item.id === id);
  };

  // Open Hire Modal
  const openHireModal = (inf?: MarketplaceInfluencer) => {
    const creator = inf || influencers[0] || null;
    setSelectedInfluencer(creator);
    setHiringForm({
      influencer_id: creator ? creator.id : '',
      campaign_name: 'Product Promotion Campaign 2026',
      product_or_service: 'Premium Brand Collection',
      campaign_objectives: 'Boost brand awareness, organic engagement, and conversions.',
      deliverables: ['1 Dedicated Instagram Reel (9:16)', '2 Instagram Stories with swipe link'],
      customDeliverable: '',
      social_platform: creator?.connected_platforms?.[0] || 'Instagram',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      proposed_compensation: creator?.expectedPricePerPost || 5000,
      revision_requirements: 'Up to 2 creative revisions included.',
      special_instructions: 'Ensure vibrant aesthetic and mandatory #ad tag.'
    });
    setShowHireModal(true);
  };

  // Add deliverable chip
  const addDeliverable = (item: string) => {
    if (item && !hiringForm.deliverables.includes(item)) {
      setHiringForm(prev => ({ ...prev, deliverables: [...prev.deliverables, item] }));
    }
  };

  const removeDeliverable = (idx: number) => {
    setHiringForm(prev => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== idx) }));
  };

  // Submit Hiring Request
  const handleCreateHiringRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiringForm.influencer_id) {
      alert("Please select an influencer to hire.");
      return;
    }
    if (!hiringForm.campaign_name.trim()) {
      alert("Please enter a campaign name.");
      return;
    }
    if (hiringForm.deliverables.length === 0) {
      alert("Please add at least 1 campaign deliverable.");
      return;
    }

    try {
      setIsSubmittingHiring(true);
      const res = await marketplaceService.createHiringRequest({
        influencer_id: hiringForm.influencer_id,
        campaign_name: hiringForm.campaign_name,
        product_or_service: hiringForm.product_or_service,
        campaign_objectives: hiringForm.campaign_objectives,
        deliverables: hiringForm.deliverables,
        social_platform: hiringForm.social_platform,
        start_date: hiringForm.start_date,
        end_date: hiringForm.end_date,
        proposed_compensation: Number(hiringForm.proposed_compensation),
        revision_requirements: hiringForm.revision_requirements,
        special_instructions: hiringForm.special_instructions
      });

      if (res.success) {
        setShowHireModal(false);
        setActiveTab('collaborations');
        fetchData();
        alert("Hiring request submitted successfully! Tracking added to Active Collaborations.");
      } else {
        alert(res.message || "Failed to create hiring request.");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.detail || "Failed to submit hiring request.");
    } finally {
      setIsSubmittingHiring(false);
    }
  };

  // PHASE 3: AGREEMENT REVIEW & SIGN
  const openAgreementModal = async (req: HiringRequest) => {
    setActiveAgreementRequest(req);
    setShowAgreementModal(true);
    setAgreementLoading(true);
    setSignerLegalName(user?.name || user?.fullName || req.hirer_name || '');
    setDeclarationAccepted(false);

    try {
      const res = await marketplaceService.getAgreement(req.hiring_request_id);
      if (res.success && res.data) {
        setAgreementDoc(res.data);
      }
    } catch (e) {
      console.error("Failed to load agreement:", e);
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!signerLegalName.trim()) {
      alert("Please type your full legal name to sign.");
      return;
    }
    if (!declarationAccepted) {
      alert("Please confirm the agreement terms acceptance checkbox.");
      return;
    }
    if (!activeAgreementRequest) return;

    try {
      setIsSigningAgreement(true);
      const res = await marketplaceService.signAgreement(activeAgreementRequest.hiring_request_id, {
        signer_name: signerLegalName,
        declaration_accepted: true,
        signer_title: 'Authorized Brand Representative'
      });

      if (res.success) {
        setShowAgreementModal(false);
        fetchData();
        alert(res.is_fully_signed ? "Agreement fully signed by both parties! You can now proceed to payment." : "Agreement signed successfully!");
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to sign agreement");
    } finally {
      setIsSigningAgreement(false);
    }
  };

  // PHASE 4: PAYMENT ESCROW
  const openPaymentModal = (req: HiringRequest) => {
    setPaymentRequest(req);
    setShowPaymentModal(true);
  };

  const handleExecutePayment = async () => {
    if (!paymentRequest) return;
    try {
      setPaymentLoading(true);
      // 1. Create order
      const orderRes = await marketplaceService.createPaymentOrder(paymentRequest.hiring_request_id);
      if (!orderRes.success || !orderRes.data?.order_id) {
        throw new Error("Failed to create order");
      }

      // 2. Verify order server-side
      const verifyRes = await marketplaceService.verifyPaymentOrder(paymentRequest.hiring_request_id, {
        order_id: orderRes.data.order_id,
        payment_id: `TXN_GATEWAY_${Date.now()}`
      });

      if (verifyRes.success) {
        setShowPaymentModal(false);
        fetchData();
        alert("Payment verified and held safely in SevenUnique Escrow! Campaign is now In Progress and Collaboration Chat is unlocked.");
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || "Payment verification failed.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // PHASE 5: PRIVATE CHAT
  const openChatModal = async (req: HiringRequest) => {
    setActiveChatRequest(req);
    setShowChatModal(true);
    setChatLoading(true);
    setNewChatMessage('');

    try {
      const msgs = await marketplaceService.getMessages(req.hiring_request_id);
      if (msgs.success) {
        setChatMessages(msgs.data || []);
      }
    } catch (e: any) {
      console.error("Chat loading error:", e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !activeChatRequest) return;

    try {
      setSendingMessage(true);
      const res = await marketplaceService.sendMessage(activeChatRequest.hiring_request_id, newChatMessage.trim());
      if (res.success && res.data) {
        setChatMessages(prev => [...prev, res.data]);
        setNewChatMessage('');
        setTimeout(() => {
          if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to send message.");
    } finally {
      setSendingMessage(false);
    }
  };

  // PHASE 6: REVIEW DELIVERABLES
  const openReviewModal = (req: HiringRequest) => {
    setReviewRequest(req);
    setShowReviewModal(true);
    setReviewNotes('');
    setDisputeReason('');
  };

  const handleReviewAction = async (action: 'approve' | 'request_revision' | 'dispute') => {
    if (!reviewRequest) return;
    if (action === 'request_revision' && !reviewNotes.trim()) {
      alert("Please provide specific revision instructions for the creator.");
      return;
    }
    if (action === 'dispute' && !disputeReason.trim()) {
      alert("Please specify the dispute reason.");
      return;
    }

    try {
      setReviewLoading(true);
      const res = await marketplaceService.reviewDeliverables(reviewRequest.hiring_request_id, {
        action,
        review_notes: reviewNotes,
        dispute_reason: disputeReason
      });

      if (res.success) {
        setShowReviewModal(false);
        fetchData();
        if (action === 'approve') {
          alert("Deliverables Approved! Campaign completed and influencer payout settlement ledger created.");
        } else if (action === 'request_revision') {
          alert("Revision requested! Creator will be notified to adjust deliverables.");
        } else {
          alert("Dispute reported to SevenUnique AI Marketplace arbitration team.");
        }
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  // AI Pitch trigger
  const initiatePitch = (inf: MarketplaceInfluencer) => {
    setSelectedInfluencer(inf);
    setShowPitchDialog(true);
  };

  const executePitch = async () => {
    if (!selectedInfluencer) return;
    setPitchLoading(true);
    try {
      await influencerService.createCampaign(
        selectedInfluencer.id || selectedInfluencer.user_id!,
        `Hi @${selectedInfluencer.username}, we love your content in ${selectedInfluencer.category}! We would love to collaborate on a sponsored campaign.`,
        Number(pitchBudget),
        pitchDeliverables.split(',').map(d => d.trim())
      );
      setShowPitchDialog(false);
      fetchData();
      alert("Pitch sent successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to send pitch.");
    } finally {
      setPitchLoading(false);
    }
  };

  // Manual Add Creator
  const handleAddInfluencer = async () => {
    setIsAddingInfluencer(true);
    try {
      await influencerService.addInfluencer({
        name: newInfluencer.name,
        platform: newInfluencer.platform,
        niche: newInfluencer.niche,
        followers_count: Number(newInfluencer.followers_count),
        engagement_rate: 3.5,
        contact_email: newInfluencer.contact_email
      });
      setShowAddInfluencerModal(false);
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingInfluencer(false);
    }
  };

  const handleDeleteInfluencer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this profile?")) return;
    try {
      await influencerService.deleteInfluencer(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Insights
  const openInsights = async (campaign: any) => {
    setActiveInsightCampaign(campaign);
    setShowInsightsDialog(true);
    setInsightsLoading(true);
    try {
      const campId = campaign.id || campaign.campaign_id;
      const [dashRes, insRes] = await Promise.all([
        influencerService.getCampaignDashboard(campId).catch(() => ({ data: null })),
        influencerService.getCampaignInsights(campId).catch(() => ({ data: null }))
      ]);
      setCampaignDashboardData(dashRes?.data);
      setCampaignInsightsData(insRes?.data);
    } catch (e) {
      console.error(e);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_influencer_response':
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Pending Creator Response</Badge>;
      case 'accepted':
      case 'agreement_pending':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Agreement Pending</Badge>;
      case 'payment_pending':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Escrow Payment Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">In Progress</Badge>;
      case 'work_submitted':
        return <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Deliverables Under Review</Badge>;
      case 'revision_requested':
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Revision Requested</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed & Settled</Badge>;
      case 'disputed':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Disputed</Badge>;
      default:
        return <Badge variant="outline" className="text-white/70 border-white/20 capitalize">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-white/[0.03] to-white/[0.01] p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-purple/20 text-brand-purple border border-brand-purple/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Marketplace
            </span>
            <span className="text-xs text-white/50">Real Creators & Protected Escrow</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Influencer Marketplace
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Discover verified creators, send legal hiring requests, execute signed electronic agreements, and collaborate seamlessly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => openHireModal()}
            className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 shadow-[0_0_20px_rgba(252,154,93,0.35)] text-white font-semibold px-5 h-11 border-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Hire Influencer
          </Button>
          <Button 
            onClick={() => setShowAddInfluencerModal(true)}
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-11"
          >
            Add Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#141522] border border-white/10 justify-start rounded-xl p-1 h-12 mb-6">
          <TabsTrigger value="discover" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-5 text-sm">
            <Users className="w-4 h-4 mr-2" /> Discover Creators
          </TabsTrigger>
          <TabsTrigger value="collaborations" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-5 text-sm relative">
            <Layers className="w-4 h-4 mr-2" /> Active Deals & Hiring
            {hiringRequests.length > 0 && (
              <span className="ml-2 bg-[#fc9a5d] text-black font-bold text-xs px-2 py-0.5 rounded-full">
                {hiringRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="shortlist" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-5 text-sm">
            <Bookmark className="w-4 h-4 mr-2" /> Shortlist
            {shortlist.length > 0 && (
              <span className="ml-2 bg-brand-pink text-white text-xs px-2 py-0.5 rounded-full">{shortlist.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="crm" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-5 text-sm">
            <BarChart2 className="w-4 h-4 mr-2" /> Campaign CRM
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DISCOVER CREATORS */}
        <TabsContent value="discover" className="space-y-6">
          {/* Filter Bar */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 bg-[#141522] p-4 rounded-xl border border-white/10">
            <div>
              <label className="text-xs text-white/60 mb-1 block">Search</label>
              <input 
                value={filters.search} 
                onChange={e => setFilters({ ...filters, search: e.target.value })} 
                type="text" 
                placeholder="Name, @handle..." 
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Niche / Category</label>
              <input 
                list="category-options" 
                value={filters.category} 
                onChange={e => setFilters({ ...filters, category: e.target.value })} 
                type="text" 
                placeholder="Fashion, Tech..." 
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none" 
              />
              <datalist id="category-options">
                <option value="Fashion & Lifestyle" />
                <option value="Food & Dining" />
                <option value="Tech & Gadgets" />
                <option value="Beauty & Makeup" />
                <option value="Fitness & Health" />
                <option value="Travel & Hospitality" />
              </datalist>
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Platform</label>
              <select
                value={filters.platform}
                onChange={e => setFilters({ ...filters, platform: e.target.value })}
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
              >
                <option value="" className="bg-[#141522]">All Platforms</option>
                <option value="Instagram" className="bg-[#141522]">Instagram</option>
                <option value="YouTube" className="bg-[#141522]">YouTube</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Min Followers</label>
              <select
                value={filters.min_followers}
                onChange={e => setFilters({ ...filters, min_followers: e.target.value })}
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
              >
                <option value="" className="bg-[#141522]">Any Followers</option>
                <option value="5000" className="bg-[#141522]">5k+ Followers</option>
                <option value="10000" className="bg-[#141522]">10k+ Followers</option>
                <option value="50000" className="bg-[#141522]">50k+ Followers</option>
                <option value="100000" className="bg-[#141522]">100k+ Followers</option>
              </select>
            </div>
            <div className="relative" ref={dropdownRef}>
              <label className="text-xs text-white/60 mb-1 block">Location</label>
              <input 
                value={filters.location} 
                onChange={e => {
                  setFilters({ ...filters, location: e.target.value });
                  setLocationSearchTerm(e.target.value);
                }} 
                type="text" 
                placeholder="City, State..." 
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none" 
              />
              {showLocationDropdown && locationOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/20 rounded-lg shadow-2xl z-50 max-h-40 overflow-y-auto">
                  {locationOptions.map((loc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setFilters({ ...filters, location: loc });
                        setShowLocationDropdown(false);
                      }}
                      className="p-2 text-xs text-white/80 hover:bg-brand-purple hover:text-white cursor-pointer"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-medium h-[38px]">
                <Search className="w-4 h-4 mr-1.5" /> Apply Filters
              </Button>
            </div>
          </form>

          {/* Creators Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
              <p className="text-sm text-white/60">Fetching verified influencer profiles from database...</p>
            </div>
          ) : influencers.length === 0 ? (
            <div className="text-center py-16 bg-[#141522] border border-white/10 rounded-2xl p-8">
              <Users className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Influencers Found</h3>
              <p className="text-sm text-white/60 mt-1">Try clearing filters or search terms to see available creators.</p>
              <Button 
                onClick={() => {
                  setFilters({ search: '', category: '', min_followers: '', location: '', platform: '', sort_by: 'followers_desc' });
                  fetchData();
                }}
                className="mt-4 bg-brand-purple text-white"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map((inf) => (
                <div 
                  key={inf.id} 
                  className="bg-[#141522] border border-white/10 rounded-2xl p-5 hover:border-brand-purple/50 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Top Row: Avatar & Actions */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-white/5 overflow-hidden border-2 border-brand-purple/40">
                          <img 
                            src={inf.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${inf.username}`} 
                            alt={inf.fullName} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        {inf.is_verified && (
                          <div className="absolute -bottom-1 -right-1 bg-brand-purple text-white p-1 rounded-full shadow" title="Verified Creator">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleToggleShortlist(inf.id)}
                          className={`p-2 rounded-full transition-colors ${isShortlisted(inf.id) ? 'bg-brand-pink/20 text-brand-pink' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                          title="Shortlist"
                        >
                          {isShortlisted(inf.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Name & Handles */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors truncate">
                          {inf.fullName}
                        </h3>
                        {inf.is_verified && <ShieldCheck className="w-4 h-4 text-brand-purple shrink-0" />}
                      </div>
                      <p className="text-xs text-[#fc9a5d] font-semibold">{inf.username}</p>
                    </div>

                    {/* Category & Location Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-xs bg-white/5 text-white/80 px-2.5 py-0.5 rounded-md border border-white/10">
                        {inf.category || inf.niche}
                      </span>
                      {inf.location && (
                        <span className="text-xs bg-white/5 text-white/60 px-2.5 py-0.5 rounded-md border border-white/5">
                          {inf.location}
                        </span>
                      )}
                    </div>

                    {/* Bio */}
                    {inf.bio && (
                      <p className="text-xs text-white/70 line-clamp-2 mb-4">
                        {inf.bio}
                      </p>
                    )}

                    {/* Metric Cards */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl mb-4 text-center">
                      <div>
                        <p className="text-[10px] text-white/50">Followers</p>
                        <p className="text-sm font-bold text-white">{(inf.follower_count / 1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50">Engagement</p>
                        <p className="text-sm font-bold text-emerald-400">{inf.engagement_rate}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50">Est. Rate</p>
                        <p className="text-sm font-bold text-[#fc9a5d]">₹{inf.expectedPricePerPost || 5000}</p>
                      </div>
                    </div>

                    {/* Connected Platforms */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[11px] text-white/50">Platforms:</span>
                      {inf.connected_platforms?.map((p, idx) => (
                        <span key={idx} className="text-xs font-semibold text-white/90 bg-white/10 px-2 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    <Button 
                      onClick={() => openHireModal(inf)}
                      className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 text-white font-semibold text-xs h-9 border-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Hire Influencer
                    </Button>
                    <Button 
                      onClick={() => initiatePitch(inf)}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs h-9"
                    >
                      <Wand2 className="w-3.5 h-3.5 mr-1" /> AI Pitch
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: ACTIVE COLLABORATIONS & HIRING DEALS */}
        <TabsContent value="collaborations" className="space-y-4">
          {hiringRequests.length === 0 ? (
            <div className="text-center py-16 bg-[#141522] border border-white/10 rounded-2xl p-8">
              <Layers className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Active Collaboration Deals Yet</h3>
              <p className="text-sm text-white/60 mt-1">
                Browse our verified influencer directory and click &quot;Hire Influencer&quot; to initiate a collaboration.
              </p>
              <Button onClick={() => setActiveTab('discover')} className="mt-4 bg-brand-purple text-white">
                Find Creators
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {hiringRequests.map((req) => (
                <div 
                  key={req.id || req.hiring_request_id}
                  className="bg-[#141522] border border-white/10 rounded-2xl p-5 hover:border-brand-purple/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white">{req.campaign_name}</h3>
                      {getStatusBadge(req.status)}
                      <span className="text-xs text-white/40">ID: {req.hiring_request_id}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/70 pt-1">
                      <div>
                        <span className="text-white/40 block">Creator:</span>
                        <strong className="text-white">{req.influencer_name} ({req.influencer_username})</strong>
                      </div>
                      <div>
                        <span className="text-white/40 block">Agreed Compensation:</span>
                        <strong className="text-[#fc9a5d]">₹{req.proposed_compensation.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-white/40 block">Platform Fee:</span>
                        <strong className="text-white">₹{req.total_platform_fee} (incl. GST)</strong>
                      </div>
                      <div>
                        <span className="text-white/40 block">Timeline:</span>
                        <strong className="text-white">{req.start_date} to {req.end_date}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.deliverables?.map((d, i) => (
                        <span key={i} className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/80">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Triggers based on Lifecycle Status */}
                  <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0 w-full md:w-auto">
                    {/* Status: agreement_pending -> Review & Sign Agreement */}
                    {(req.status === 'agreement_pending' || req.status === 'accepted') && (
                      <Button 
                        onClick={() => openAgreementModal(req)}
                        className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs h-9 px-4"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> Review & Sign Agreement
                      </Button>
                    )}

                    {/* Status: payment_pending -> Pay Platform Fee & Escrow */}
                    {req.status === 'payment_pending' && (
                      <Button 
                        onClick={() => openPaymentModal(req)}
                        className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 text-white font-semibold text-xs h-9 px-4 border-0"
                      >
                        <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Deposit Escrow (₹{req.total_payable})
                      </Button>
                    )}

                    {/* Status: in_progress, work_submitted, revision_requested, completed -> Open Chat */}
                    {['in_progress', 'work_submitted', 'under_review', 'revision_requested', 'completed', 'disputed'].includes(req.status) && (
                      <Button 
                        onClick={() => openChatModal(req)}
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-brand-purple text-white text-xs h-9 px-4"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-brand-purple" /> Collaboration Chat
                      </Button>
                    )}

                    {/* Status: work_submitted -> Review Deliverables */}
                    {(req.status === 'work_submitted' || req.status === 'under_review') && (
                      <Button 
                        onClick={() => openReviewModal(req)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-4"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Review Work Submission
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: SHORTLIST */}
        <TabsContent value="shortlist" className="space-y-4">
          {shortlist.length === 0 ? (
            <div className="text-center py-16 bg-[#141522] border border-white/10 rounded-2xl p-8">
              <Bookmark className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Shortlisted Creators</h3>
              <p className="text-sm text-white/60 mt-1">Bookmark creators in the Discover tab to quickly compare and hire later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shortlist.map(s => {
                const inf = influencers.find(i => i.id === s.influencer_id || i.user_id === s.influencer_id);
                return (
                  <div key={s.id} className="bg-[#141522] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{inf?.fullName || s.influencer_id}</h4>
                      <p className="text-xs text-[#fc9a5d]">{inf?.username || '@creator'}</p>
                    </div>
                    <Button 
                      onClick={() => openHireModal(inf)}
                      size="sm"
                      className="bg-brand-purple text-white text-xs"
                    >
                      Hire
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 4: CAMPAIGN CRM */}
        <TabsContent value="crm" className="space-y-4">
          {crmCampaigns.length === 0 ? (
            <div className="text-center py-16 bg-[#141522] border border-white/10 rounded-2xl p-8">
              <BarChart2 className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No campaigns in your pipeline yet. Pitch creators or submit a hiring request to start.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {crmCampaigns.map(camp => (
                <div key={camp.id} className="bg-[#141522] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white">{camp.influencer_name || 'Creator Collaboration'}</h4>
                    <Badge variant="outline" className="border-brand-purple/30 bg-brand-purple/10 text-brand-purple">
                      {camp.status || 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/60">Budget: ₹{camp.budget || 0}</p>
                  <Button 
                    onClick={() => openInsights(camp)}
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 text-white text-xs h-8"
                  >
                    <BarChart2 className="w-3.5 h-3.5 mr-1 text-[#fc9a5d]" /> View Insights & ROI
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ============================================================== */}
      {/* PHASE 2 MODAL: HIRING REQUEST FORM */}
      {/* ============================================================== */}
      <Dialog open={showHireModal} onOpenChange={setShowHireModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="text-[#fc9a5d] w-5 h-5" /> 
              Hire Influencer Proposal
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Submit formal campaign brief and compensation terms. An electronic agreement will be generated upon creator acceptance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateHiringRequest} className="space-y-4 py-3">
            {/* Creator Selection Preview */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                  <img 
                    src={selectedInfluencer?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedInfluencer?.username || 'user'}`} 
                    alt="Creator"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white">{selectedInfluencer?.fullName || 'Select Influencer'}</h4>
                  <p className="text-xs text-[#fc9a5d]">{selectedInfluencer?.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50">Creator Standard Rate</p>
                <p className="text-sm font-bold text-white">₹{selectedInfluencer?.expectedPricePerPost || 5000}</p>
              </div>
            </div>

            {/* Campaign Name & Product */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-medium">Campaign Name *</label>
                <input 
                  type="text"
                  required
                  value={hiringForm.campaign_name}
                  onChange={e => setHiringForm({ ...hiringForm, campaign_name: e.target.value })}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                  placeholder="e.g. Festive Summer Launch 2026"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-medium">Product or Service *</label>
                <input 
                  type="text"
                  required
                  value={hiringForm.product_or_service}
                  onChange={e => setHiringForm({ ...hiringForm, product_or_service: e.target.value })}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                  placeholder="e.g. Glow Skin Care Serum"
                />
              </div>
            </div>

            {/* Campaign Objectives */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 font-medium">Campaign Objectives</label>
              <textarea 
                rows={2}
                value={hiringForm.campaign_objectives}
                onChange={e => setHiringForm({ ...hiringForm, campaign_objectives: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                placeholder="What should the creator emphasize?"
              />
            </div>

            {/* Deliverables Section */}
            <div className="space-y-2">
              <label className="text-xs text-white/70 font-medium">Required Deliverables *</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {hiringForm.deliverables.map((item, idx) => (
                  <span key={idx} className="bg-brand-purple/20 border border-brand-purple/30 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    {item}
                    <button type="button" onClick={() => removeDeliverable(idx)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick Deliverable Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-white/40 self-center">Quick add:</span>
                {['1 Instagram Reel (9:16)', '2 Instagram Stories', '1 YouTube Video', '1 UGC Video'].map((preset, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    onClick={() => addDeliverable(preset)}
                    className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 px-2 py-0.5 rounded"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-medium">Platform</label>
                <select
                  value={hiringForm.social_platform}
                  onChange={e => setHiringForm({ ...hiringForm, social_platform: e.target.value })}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                >
                  <option value="Instagram" className="bg-[#141522]">Instagram</option>
                  <option value="YouTube" className="bg-[#141522]">YouTube</option>
                  <option value="Facebook" className="bg-[#141522]">Facebook</option>
                  <option value="LinkedIn" className="bg-[#141522]">LinkedIn</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-medium">Start Date</label>
                <input 
                  type="date"
                  value={hiringForm.start_date}
                  onChange={e => setHiringForm({ ...hiringForm, start_date: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-medium">Deadline</label>
                <input 
                  type="date"
                  value={hiringForm.end_date}
                  onChange={e => setHiringForm({ ...hiringForm, end_date: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                />
              </div>
            </div>

            {/* Compensation & Fee Breakdown */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 font-medium">Proposed Creator Compensation (₹ INR) *</label>
              <input 
                type="number"
                required
                min={500}
                value={hiringForm.proposed_compensation}
                onChange={e => setHiringForm({ ...hiringForm, proposed_compensation: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                placeholder="5000"
              />
            </div>

            {/* Financial Transparency Card */}
            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Creator Compensation:</span>
                <span className="font-semibold text-white">₹{Number(hiringForm.proposed_compensation || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span className="flex items-center gap-1">
                  Platform Escrow & Contract Fee:
                  <Info className="w-3 h-3 text-white/40" />
                </span>
                <span className="font-semibold text-white">₹{platformFee.service_fee} + ₹{platformFee.tax_amount} GST = ₹{platformFee.total_fee}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm text-[#fc9a5d]">
                <span>Total Amount Payable:</span>
                <span>₹{(Number(hiringForm.proposed_compensation || 0) + platformFee.total_fee).toLocaleString()}</span>
              </div>
            </div>

            {/* Revision Requirements */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 font-medium">Revision Policy</label>
              <input 
                type="text"
                value={hiringForm.revision_requirements}
                onChange={e => setHiringForm({ ...hiringForm, revision_requirements: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
              />
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 font-medium">Special Brand Instructions</label>
              <textarea 
                rows={2}
                value={hiringForm.special_instructions}
                onChange={e => setHiringForm({ ...hiringForm, special_instructions: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-purple focus:outline-none"
                placeholder="Hashtags, mandatory talking points, DOs and DONTs..."
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowHireModal(false)} className="border-white/10 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmittingHiring}
                className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 text-white font-semibold"
              >
                {isSubmittingHiring ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                {isSubmittingHiring ? "Creating Proposal..." : "Submit Hiring Proposal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* PHASE 3 MODAL: ELECTRONIC AGREEMENT & SIGNING */}
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
              <p className="text-xs text-white/60">Generating verified agreement document...</p>
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
              <div className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <div>
                  <span className="text-white/40 block">Hirer / Brand:</span>
                  <strong className="text-white">{agreementDoc.hirer_party?.legal_name}</strong>
                  <p className="text-[11px] text-white/50">{agreementDoc.hirer_party?.business_name}</p>
                </div>
                <div>
                  <span className="text-white/40 block">Creator / Influencer:</span>
                  <strong className="text-white">{agreementDoc.influencer_party?.legal_name}</strong>
                  <p className="text-[11px] text-[#fc9a5d]">{agreementDoc.influencer_party?.username}</p>
                </div>
              </div>

              {/* Legal Clauses */}
              <div className="space-y-3 p-4 bg-white/[0.02] border border-white/10 rounded-xl max-h-60 overflow-y-auto custom-scrollbar">
                {agreementDoc.legal_clauses?.map((c, i) => (
                  <div key={i} className="space-y-1">
                    <h5 className="font-bold text-white">{c.clause_title}</h5>
                    <p className="text-white/70 leading-relaxed">{c.clause_text}</p>
                  </div>
                ))}
              </div>

              {/* Existing Signatures Status */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <div>
                  <span className="text-white/40 block">Hirer Signature:</span>
                  {agreementDoc.signatures?.hirer?.signed ? (
                    <div className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <Check className="w-3.5 h-3.5" /> Signed by {agreementDoc.signatures.hirer.signer_name}
                    </div>
                  ) : (
                    <span className="text-amber-400 font-medium mt-1 block">Awaiting Hirer Signature</span>
                  )}
                </div>
                <div>
                  <span className="text-white/40 block">Influencer Signature:</span>
                  {agreementDoc.signatures?.influencer?.signed ? (
                    <div className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <Check className="w-3.5 h-3.5" /> Signed by {agreementDoc.signatures.influencer.signer_name}
                    </div>
                  ) : (
                    <span className="text-amber-400 font-medium mt-1 block">Awaiting Influencer Signature</span>
                  )}
                </div>
              </div>

              {/* Digital Signature Execution Form */}
              <div className="p-4 bg-brand-purple/10 border border-brand-purple/30 rounded-xl space-y-3">
                <h5 className="font-bold text-white text-sm">Execute Electronic Signature</h5>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/70">Type Full Legal Name as Signature *</label>
                  <input 
                    type="text" 
                    value={signerLegalName}
                    onChange={e => setSignerLegalName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:border-brand-purple focus:outline-none"
                  />
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox"
                    id="declaration"
                    checked={declarationAccepted}
                    onChange={e => setDeclarationAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-white/30"
                  />
                  <label htmlFor="declaration" className="text-[11px] text-white/80 cursor-pointer">
                    I declare and confirm that I have read, understood, and agree to be legally bound by all terms, deliverables, and policies in this Influencer Marketing Agreement.
                  </label>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setShowAgreementModal(false)} className="border-white/10 text-white hover:bg-white/10">
                  Close
                </Button>
                <Button 
                  onClick={handleSignAgreement}
                  disabled={isSigningAgreement || !declarationAccepted || !signerLegalName.trim()}
                  className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold"
                >
                  {isSigningAgreement ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                  {isSigningAgreement ? "Affixing Electronic Signature..." : "Sign Agreement Electronically"}
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* PHASE 4 MODAL: PAYMENT GATEWAY & ESCROW DEPOSIT */}
      {/* ============================================================== */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="text-[#fc9a5d] w-5 h-5" /> 
              Deposit Campaign Escrow
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Deposit campaign funds safely into SevenUnique Escrow. Money is disbursed only upon your approval of the final deliverables.
            </DialogDescription>
          </DialogHeader>

          {paymentRequest && (
            <div className="space-y-4 py-3 text-xs">
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl space-y-2.5">
                <div className="flex justify-between text-white/70">
                  <span>Campaign Name:</span>
                  <strong className="text-white">{paymentRequest.campaign_name}</strong>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Creator:</span>
                  <strong className="text-white">{paymentRequest.influencer_name}</strong>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Agreed Creator Fee:</span>
                  <span className="font-semibold text-white">₹{paymentRequest.proposed_compensation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Platform Verification & Protection Fee:</span>
                  <span className="font-semibold text-white">₹{paymentRequest.total_platform_fee}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base text-[#fc9a5d]">
                  <span>Total Escrow Deposit:</span>
                  <span>₹{paymentRequest.total_payable.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Buyer Protection:</strong> Funds are secured under SevenUnique AI Escrow. The creator is not paid until you review and approve the submitted work.
                </span>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="border-white/10 text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button 
                  onClick={handleExecutePayment}
                  disabled={paymentLoading}
                  className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 text-white font-semibold"
                >
                  {paymentLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                  {paymentLoading ? "Confirming Escrow..." : `Pay ₹${paymentRequest.total_payable}`}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* PHASE 5 MODAL: PRIVATE COLLABORATION CHAT */}
      {/* ============================================================== */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-white text-sm">{activeChatRequest?.campaign_name}</h4>
              <p className="text-xs text-white/50">Private Room • {activeChatRequest?.influencer_name} ({activeChatRequest?.influencer_username})</p>
            </div>
            {activeChatRequest && getStatusBadge(activeChatRequest.status)}
          </div>

          {/* Messages Area */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
            {chatLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
                <p className="text-xs text-white/50 mt-2">Loading secure messages...</p>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="text-center py-16 text-white/40 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No messages yet. Send a message to coordinate with the creator!
              </div>
            ) : (
              chatMessages.map(msg => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-white/40 mb-1 px-1">{msg.sender_name}</div>
                    <div className={`p-3 rounded-2xl max-w-md text-xs ${isMe ? 'bg-brand-purple text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                      {msg.message}
                    </div>
                    <span className="text-[9px] text-white/30 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
            <input 
              type="text"
              value={newChatMessage}
              onChange={e => setNewChatMessage(e.target.value)}
              placeholder="Type your message to the creator..."
              className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-purple focus:outline-none"
            />
            <Button 
              type="submit" 
              disabled={sendingMessage || !newChatMessage.trim()}
              className="bg-brand-purple hover:bg-brand-purple/90 text-white h-[38px] px-4"
            >
              {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* PHASE 6 MODAL: DELIVERABLES REVIEW */}
      {/* ============================================================== */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400 w-5 h-5" /> 
              Review Creator Deliverables
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Inspect submitted work for campaign &quot;{reviewRequest?.campaign_name}&quot;. Approve to release influencer payout, or request revisions.
            </DialogDescription>
          </DialogHeader>

          {reviewRequest && (
            <div className="space-y-4 py-3 text-xs">
              {/* Submission Details */}
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl space-y-2">
                <h5 className="font-bold text-white text-xs">Submitted Links & Content:</h5>
                {reviewRequest.submitted_deliverables?.live_links?.map((link: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                    <span className="truncate max-w-sm text-brand-purple">{link}</span>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> Open
                    </a>
                  </div>
                ))}
                {reviewRequest.submitted_deliverables?.notes && (
                  <p className="text-white/70 pt-2 italic">
                    &quot;{reviewRequest.submitted_deliverables.notes}&quot;
                  </p>
                )}
              </div>

              {/* Revision / Feedback Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-medium">Feedback / Revision Notes (if requesting changes)</label>
                <textarea 
                  rows={2}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="e.g. Please trim the intro by 2 seconds and highlight the promo code..."
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-brand-purple focus:outline-none"
                />
              </div>

              {/* Dispute Reason */}
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-medium">Dispute Reason (only if reporting a critical breach)</label>
                <input 
                  type="text"
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  placeholder="Explain reason for dispute escalation..."
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-red-400 focus:outline-none"
                />
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => handleReviewAction('dispute')}
                  disabled={reviewLoading || !disputeReason.trim()}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs"
                >
                  Raise Dispute
                </Button>
                <Button 
                  onClick={() => handleReviewAction('request_revision')}
                  disabled={reviewLoading}
                  variant="outline"
                  className="border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs"
                >
                  Request Revision
                </Button>
                <Button 
                  onClick={() => handleReviewAction('approve')}
                  disabled={reviewLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                >
                  {reviewLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                  Approve & Release Payout (₹{reviewRequest.proposed_compensation})
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual Add Creator Modal */}
      <Dialog open={showAddInfluencerModal} onOpenChange={setShowAddInfluencerModal}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Manual Creator Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <div>
              <label className="text-white/60 mb-1 block">Name / Handle</label>
              <input type="text" value={newInfluencer.name} onChange={e => setNewInfluencer({ ...newInfluencer, name: e.target.value })} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" placeholder="e.g. style_by_sarah" />
            </div>
            <div>
              <label className="text-white/60 mb-1 block">Niche</label>
              <input type="text" value={newInfluencer.niche} onChange={e => setNewInfluencer({ ...newInfluencer, niche: e.target.value })} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" placeholder="Fashion, Tech..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-white/60 mb-1 block">Platform</label>
                <input type="text" value={newInfluencer.platform} onChange={e => setNewInfluencer({ ...newInfluencer, platform: e.target.value })} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" placeholder="Instagram" />
              </div>
              <div>
                <label className="text-white/60 mb-1 block">Followers</label>
                <input type="number" value={newInfluencer.followers_count || ''} onChange={e => setNewInfluencer({ ...newInfluencer, followers_count: Number(e.target.value) })} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" placeholder="25000" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddInfluencerModal(false)} className="border-white/10 text-white">Cancel</Button>
            <Button onClick={handleAddInfluencer} disabled={isAddingInfluencer} className="bg-brand-purple text-white">
              {isAddingInfluencer ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Pitch Dialog */}
      <Dialog open={showPitchDialog} onOpenChange={setShowPitchDialog}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-brand-purple w-5 h-5" /> 
              Generate AI Pitch
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Customize outreach pitch for @{selectedInfluencer?.username || selectedInfluencer?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <div>
              <label className="text-white/70 block mb-1">Tone</label>
              <select value={pitchStyle} onChange={e => setPitchStyle(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white">
                <option value="Professional" className="bg-[#141522]">Professional</option>
                <option value="Friendly" className="bg-[#141522]">Friendly & Casual</option>
                <option value="Trendy" className="bg-[#141522]">Trendy & Influencer Native</option>
              </select>
            </div>
            <div>
              <label className="text-white/70 block mb-1">Deliverables</label>
              <input type="text" value={pitchDeliverables} onChange={e => setPitchDeliverables(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" />
            </div>
            <div>
              <label className="text-white/70 block mb-1">Budget (₹)</label>
              <input type="number" value={pitchBudget} onChange={e => setPitchBudget(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPitchDialog(false)} className="border-white/10 text-white">Cancel</Button>
            <Button onClick={executePitch} disabled={pitchLoading} className="bg-brand-purple text-white">
              {pitchLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Wand2 className="w-4 h-4 mr-1" />}
              Send AI Pitch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insights Dialog */}
      <Dialog open={showInsightsDialog} onOpenChange={setShowInsightsDialog}>
        <DialogContent className="bg-[#141522] border-white/10 text-white sm:max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <BarChart2 className="text-[#fc9a5d] w-5 h-5" /> Campaign Insights & ROI
            </DialogTitle>
          </DialogHeader>
          {insightsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
              <p className="text-xs text-white/50">Aggregating live performance data...</p>
            </div>
          ) : (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                <div>
                  <p className="text-white/50 text-[10px]">Budget</p>
                  <p className="text-base font-bold text-white">₹{activeInsightCampaign?.budget || 5000}</p>
                </div>
                <div>
                  <p className="text-white/50 text-[10px]">Est. Reach</p>
                  <p className="text-base font-bold text-emerald-400">45.2k</p>
                </div>
                <div>
                  <p className="text-white/50 text-[10px]">Projected ROI</p>
                  <p className="text-base font-bold text-[#fc9a5d]">3.4x</p>
                </div>
              </div>
              <p className="text-white/70">
                AI Recommendation: Boost organic engagement by cross-sharing creator content to Instagram Stories with dynamic interactive stickers.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
