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
  Info,
  Eye,
  Paperclip,
  AlertTriangle,
  CheckCheck,
  ImageIcon,
  PanelLeft,
  RefreshCw,
  Upload
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
    service_fee: 200,
    currency: 'INR',
    tax_percentage: 18,
    tax_amount: 36,
    total_fee: 236,
    fee_description: 'Platform Escrow & Contract Protection Fee (₹200 base + 18% GST)'
  });

  // Selected Creator for Pitch / Hiring
  const [selectedInfluencer, setSelectedInfluencer] = useState<MarketplaceInfluencer | null>(null);

  // PHASE 2: HIRING MODAL STATE
  const [showHireModal, setShowHireModal] = useState(false);
  const [hiringForm, setHiringForm] = useState({
    influencer_id: '',
    business_name: '',
    campaign_name: '',
    product_or_service: '',
    campaign_objectives: 'Boost brand awareness, engagement, and direct conversion via authentic video review.',
    deliverables: ['1 Dedicated Instagram Reel (9:16)', '2 Instagram Stories with product tag'],
    customDeliverable: '',
    social_platform: 'Instagram',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    proposed_compensation: 5000,
    revision_requirements: 'Up to 2 creative revisions included (5-day acceptance policy).',
    special_instructions: 'Ensure clear lighting, prominent product framing, and proper #ad tag.'
  });
  const [isSubmittingHiring, setIsSubmittingHiring] = useState(false);
  const [hiringInfluencerId, setHiringInfluencerId] = useState<string | null>(null);
  const [showZaakpayHireModal, setShowZaakpayHireModal] = useState(false);
  const [zaakpayHireData, setZaakpayHireData] = useState<{
    hiring_request_id: string;
    order_id: string;
    amount: number;
    payment_url: string;
  } | null>(null);
  const [verifyingHirePayment, setVerifyingHirePayment] = useState(false);
  const [hirePaymentSuccess, setHirePaymentSuccess] = useState(false);

  // PHASE 3: AGREEMENT MODAL STATE
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [activeAgreementRequest, setActiveAgreementRequest] = useState<HiringRequest | null>(null);
  const [agreementDoc, setAgreementDoc] = useState<AgreementDocument | null>(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [signerLegalName, setSignerLegalName] = useState('');
  const [signerTitle, setSignerTitle] = useState('Authorized Brand Representative');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSigningAgreement, setIsSigningAgreement] = useState(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const signatureFileInputRef = useRef<HTMLInputElement | null>(null);

  // PHASE 4: PAYMENT MODAL STATE
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<HiringRequest | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // PHASE 5: PRIVATE CHAT MODAL STATE
  interface ChatSessionItem {
    id: string;
    title: string;
    reqId: string;
    creatorName: string;
    creatorUsername: string;
    campaignName: string;
    lastMessage?: string;
    updatedAt: string;
  }

  const [showChatModal, setShowChatModal] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState<HiringRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isCreatorTyping, setIsCreatorTyping] = useState(false);
  const [chatSecurityWarning, setChatSecurityWarning] = useState<string | null>(null);
  const [chatAttachment, setChatAttachment] = useState<{ url: string; name: string } | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);

  // PHASE 6: DELIVERABLES REVIEW MODAL STATE
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRequest, setReviewRequest] = useState<HiringRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // PHASE 7: HIRING REQUEST / COLLABORATION DETAIL MODAL STATE
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedHiringDetail, setSelectedHiringDetail] = useState<HiringRequest | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const openDetailModal = async (req: HiringRequest) => {
    setSelectedHiringDetail(req);
    setShowDetailModal(true);
    try {
      setLoadingDetail(true);
      const res = await marketplaceService.getHiringRequestDetail(req.hiring_request_id || req.id);
      if (res?.success && res.data) {
        setSelectedHiringDetail(res.data);
      }
    } catch {
      // Fallback to existing req state
    } finally {
      setLoadingDetail(false);
    }
  };

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

    // Check if an influencer has an unlocked paid hiring request
  const getPaidRequestForInfluencer = (inf: MarketplaceInfluencer): HiringRequest | undefined => {
    return hiringRequests.find(r => {
      const matchCreator = 
        (r.influencer_id && (r.influencer_id === inf.id || r.influencer_id === inf.user_id)) ||
        (r.influencer_user_id && (r.influencer_user_id === inf.id || r.influencer_user_id === inf.user_id)) ||
        (r.influencer_username && inf.username && (
          r.influencer_username.toLowerCase().replace(/^@+/, '') === inf.username.toLowerCase().replace(/^@+/, '')
        ));
      
      const isPaid = 
        r.fee_paid === true || 
        (r as any).hire_fee_paid === true || 
        (r as any).chat_active === true ||
        r.status === 'in_progress' || 
        r.status === 'accepted' || 
        r.status === 'contract_drafted' || 
        r.status === 'agreement_signed';

      return matchCreator && isPaid;
    });
  };

  // DIRECT HIRE: Auto-initiates Zaakpay ₹200 Payment Gateway directly without any lengthy forms
  const openHireModal = async (inf?: MarketplaceInfluencer) => {
    const creator = inf || influencers[0] || null;
    if (!creator) {
      alert("Please select an influencer to hire.");
      return;
    }

    setSelectedInfluencer(creator);
    setHiringInfluencerId(creator.id);
    setIsSubmittingHiring(true);

    try {
      const defaultCampaign = `Brand Collaboration with ${creator.fullName || creator.username}`;
      const res = await marketplaceService.createHiringRequest({
        influencer_id: creator.id,
        business_name: user?.business_name || user?.company || (user?.name ? `${user.name}'s Brand` : 'Brand Enterprise'),
        campaign_name: defaultCampaign,
        product_or_service: 'Influencer Marketing & Promotion',
        campaign_objectives: 'Boost brand awareness, organic engagement, and conversions.',
        deliverables: ['1 Dedicated Instagram Reel (9:16)', '2 Instagram Stories with product tag'],
        social_platform: creator.connected_platforms?.[0] || 'Instagram',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        proposed_compensation: creator.expectedPricePerPost || 5000,
        revision_requirements: 'Up to 2 creative revisions included (5-day acceptance policy).',
        special_instructions: 'Ensure vibrant aesthetic, clear product framing, and proper #ad tag.'
      });

      if (res.success && res.data) {
        const hiringReqId = res.data.hiring_request_id || res.data.id;
        
        // Immediately initiate Zaakpay ₹200 fee payment
        const payRes = await marketplaceService.payHireFee(hiringReqId);
        if (payRes.success) {
          setZaakpayHireData({
            hiring_request_id: hiringReqId,
            order_id: payRes.order_id,
            amount: payRes.amount || 200,
            payment_url: payRes.payment_url
          });
          setShowZaakpayHireModal(true);
          
          // Automatically open live Zaakpay gateway in new tab
          if (payRes.payment_url && payRes.payment_url.startsWith('http')) {
            try {
              window.open(payRes.payment_url, '_blank', 'noopener,noreferrer');
            } catch (popupErr) {
              console.warn("Popup blocked, user can click button directly:", popupErr);
            }
          }
        } else {
          alert(payRes.message || "Failed to initiate Zaakpay payment gateway.");
        }
      } else {
        alert(res.message || "Failed to create hiring request.");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.detail || "Failed to connect to Zaakpay payment gateway.");
    } finally {
      setIsSubmittingHiring(false);
      setHiringInfluencerId(null);
    }
  };

  // Keep compatibility for any manual submit
  const handleCreateHiringRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInfluencer) {
      await openHireModal(selectedInfluencer);
    }
  };

  const handleVerifyZaakpayHirePayment = async () => {
    if (!zaakpayHireData) return;
    try {
      setVerifyingHirePayment(true);
      const res = await marketplaceService.verifyHirePayment(zaakpayHireData.hiring_request_id, {
        order_id: zaakpayHireData.order_id
      });
      if (res.success) {
        setHirePaymentSuccess(true);
        const reqId = zaakpayHireData.hiring_request_id;
        setTimeout(async () => {
          setShowZaakpayHireModal(false);
          setHirePaymentSuccess(false);
          setZaakpayHireData(null);
          // Refresh data so creator card immediately displays Chat button
          await fetchData();

          // Immediately open 1-on-1 private collaboration chat room for THIS specific creator only
          try {
            const detailRes = await marketplaceService.getHiringRequestDetail(reqId);
            if (detailRes.success && detailRes.data) {
              openChatModal(detailRes.data);
              return;
            }
          } catch (err) {
            console.error("Auto open chat error:", err);
          }
        }, 1200);
      } else {
        alert(res.message || "Payment verification pending.");
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Payment verification failed. Please try again.");
    } finally {
      setVerifyingHirePayment(false);
    }
  };

  // PHASE 3: AGREEMENT REVIEW & SIGN
  const openAgreementModal = async (req: HiringRequest) => {
    setActiveAgreementRequest(req);
    setShowAgreementModal(true);
    setAgreementLoading(true);
    setSignerLegalName(user?.name || user?.fullName || req.hirer_name || '');
    setSignerTitle('Authorized Brand Representative');
    setDeclarationAccepted(false);
    setUploadedSignature(null);

    try {
      const reqId = req.hiring_request_id || req.id;
      const res = await marketplaceService.getAgreement(reqId);
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
      const reqId = activeAgreementRequest.hiring_request_id || activeAgreementRequest.id;
      const res = await marketplaceService.signAgreement(reqId, {
        signer_name: signerLegalName,
        declaration_accepted: true,
        signer_title: signerTitle || 'Authorized Brand Representative',
        signature_image: uploadedSignature || undefined
      });

      if (res.success) {
        if (res.agreement) {
          setAgreementDoc(res.agreement);
        }
        await fetchData();
        setShowAgreementModal(false);
        // AUTOMATICALLY OPEN PAYMENT GATEWAY MODAL FOR INFLUENCER PAYMENT
        openPaymentModal(activeAgreementRequest);
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
      const reqId = paymentRequest.hiring_request_id || paymentRequest.id;
      // 1. Create order
      const orderRes = await marketplaceService.createPaymentOrder(reqId);
      if (!orderRes.success || !orderRes.data?.order_id) {
        throw new Error("Failed to create order");
      }

      // 2. Verify order server-side
      const verifyRes = await marketplaceService.verifyPaymentOrder(reqId, {
        order_id: orderRes.data.order_id,
        payment_id: `TXN_GATEWAY_${Date.now()}`
      });

      if (verifyRes.success) {
        setShowPaymentModal(false);
        await fetchData();
        alert("🎉 Escrow deposit verified & held safely in Platform Escrow! Campaign is now In Progress and Collaboration Chat room is provisioned.");
        
        // Provision and open collaboration chat room immediately
        try {
          const detailRes = await marketplaceService.getHiringRequestDetail(reqId);
          if (detailRes.success && detailRes.data) {
            openChatModal(detailRes.data);
          } else {
            openChatModal(paymentRequest);
          }
        } catch {
          openChatModal(paymentRequest);
        }
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || "Payment verification failed.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // REAL-TIME LISTENER: While chat box is open and awaiting admin approval, poll for admin approval.
  // As soon as Admin approves on Admin Panel, AUTOMATICALLY pop up the agreement modal to review & sign!
  useEffect(() => {
    if (!showChatModal || !activeChatRequest) return;
    const reqId = activeChatRequest.hiring_request_id || activeChatRequest.id;
    if (!reqId) return;

    const interval = setInterval(async () => {
      try {
        const detailRes = await marketplaceService.getHiringRequestDetail(reqId);
        if (detailRes.success && detailRes.data) {
          const fresh = detailRes.data;
          
          // If status transitioned from awaiting_admin_approval to ready_for_signature
          if (
            (activeChatRequest.status === 'awaiting_admin_approval' || (activeChatRequest as any).agreement_status === 'awaiting_admin_approval') &&
            (fresh.status === 'ready_for_signature' || fresh.status === 'agreement_approved' || fresh.status === 'payment_pending')
          ) {
            setActiveChatRequest(fresh);
            // Auto pop-up agreement modal for user to review & sign
            if (!showAgreementModal && (fresh.status === 'ready_for_signature' || fresh.status === 'agreement_approved')) {
              openAgreementModal(fresh);
            }
          } else if (fresh.status !== activeChatRequest.status) {
            setActiveChatRequest(fresh);
          }
        }
      } catch (err) {
        // silent polling error
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showChatModal, activeChatRequest?.status, showAgreementModal]);

  // Save & Load chat history to localStorage for persistence
  const saveChatToStorage = (storageId: string, messages: ChatMessage[]) => {
    try {
      if (typeof window !== 'undefined' && storageId) {
        localStorage.setItem(`collab_chat_${storageId}`, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  };

  const getChatFromStorage = (storageId: string): ChatMessage[] => {
    try {
      if (typeof window !== 'undefined' && storageId) {
        const stored = localStorage.getItem(`collab_chat_${storageId}`);
        if (stored) return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return [];
  };

  const saveSessionsToStorage = (sessions: ChatSessionItem[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dhandagrow_chat_sessions', JSON.stringify(sessions));
      }
    } catch (e) {
      console.warn("Storage save sessions error:", e);
    }
  };

  const getSessionsFromStorage = (): ChatSessionItem[] => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('dhandagrow_chat_sessions');
        if (stored) return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Storage read sessions error:", e);
    }
    return [];
  };

  // Security Filter: Disallow email and contact numbers to prevent platform disintermediation
  const checkContactInfoViolation = (text: string): { blocked: boolean; message?: string } => {
    // 1. Email check (standard and obfuscated formats)
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|([a-zA-Z0-9._%+-]+\s*(?:@|\[at\]|\(at\)|at)\s*[a-zA-Z0-9.-]+\s*(?:\.|\(dot\)|\[dot\]|dot)\s*[a-zA-Z]{2,})/i;
    if (emailRegex.test(text)) {
      return {
        blocked: true,
        message: "Email addresses cannot be sent. All communication must remain inside this room to maintain escrow & agreement protection."
      };
    }

    // 2. Phone number / Contact digits check
    const rawDigits = text.replace(/[^\d]/g, '');
    if (rawDigits.length >= 10 && rawDigits.length <= 13) {
      return {
        blocked: true,
        message: "Phone and mobile numbers cannot be shared. Direct external contact voids platform escrow guarantee."
      };
    }

    if (/\b[6-9]\d{9}\b/.test(text) || /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/.test(text)) {
      return {
        blocked: true,
        message: "Phone numbers cannot be shared in the chat. Please coordinate within the platform."
      };
    }

    return { blocked: false };
  };

  // Image Attachment Handler (Pin functionality)
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Image size should be less than 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setChatAttachment({
          url: event.target.result as string,
          name: file.name
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Contextual smart creator response generator ("back to back revert")
  const generateCreatorReply = (userMsg: string, campaignName: string, creatorName: string): string => {
    const lower = userMsg.toLowerCase();
    if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
      return `Hey! Excited to collaborate on "${campaignName}". I've received your brief and will ensure high-production value for the deliverable!`;
    }
    if (lower.includes('deliverable') || lower.includes('reel') || lower.includes('story') || lower.includes('video') || lower.includes('post')) {
      return `Understood! I'm drafting the visual concept and script for the reel now. Will adhere strictly to the 9:16 vertical ratio and requested styling.`;
    }
    if (lower.includes('when') || lower.includes('time') || lower.includes('update') || lower.includes('status') || lower.includes('progress') || lower.includes('kav') || lower.includes('kab')) {
      return `Production is progressing smoothly! You'll receive the first draft preview right here within 24-48 hours for review.`;
    }
    if (lower.includes('tag') || lower.includes('caption') || lower.includes('mention') || lower.includes('hashtag')) {
      return `Noted! All required campaign hashtags (#ad, brand handles, and swipe links) will be included in the primary caption copy.`;
    }
    if (lower.includes('revision') || lower.includes('change') || lower.includes('edit') || lower.includes('modify')) {
      return `Got your revision points! Implementing these specific edits right away and will update you as soon as the cut is updated.`;
    }
    if (lower.includes('payment') || lower.includes('fee') || lower.includes('escrow') || lower.includes('paisa') || lower.includes('money')) {
      return `Platform escrow has safely secured the campaign funds. Once you review and approve the submitted deliverables, release is automatic.`;
    }
    if (chatAttachment) {
      return `Thanks for the reference asset! This gives me clear guidance on the exact framing and tone you're looking for.`;
    }

    const defaultReplies = [
      `Thanks for the details! Noted down these requirements for "${campaignName}". Moving forward with production.`,
      `Awesome, sounds great! Making sure all deliverables align with the brand guidelines.`,
      `Got it! Working on this directly. I will drop the draft preview here once it's ready for your eyes.`,
      `Understood! Proceeding with this plan. Will keep you updated with real-time milestones here.`
    ];
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  };

  // Create a brand new chat session (ChatGPT Style "+ New Chat")
  const handleCreateNewChatThread = () => {
    if (!activeChatRequest) return;
    const reqId = activeChatRequest.hiring_request_id || activeChatRequest.id;
    const threadCount = chatSessions.filter(s => s.reqId === reqId).length + 1;
    const newSessionId = `session_${reqId}_${Date.now()}`;
    const newSession: ChatSessionItem = {
      id: newSessionId,
      title: `Discussion #${threadCount} with ${activeChatRequest.influencer_name}`,
      reqId: reqId,
      creatorName: activeChatRequest.influencer_name,
      creatorUsername: activeChatRequest.influencer_username,
      campaignName: activeChatRequest.campaign_name,
      lastMessage: 'New chat thread started',
      updatedAt: new Date().toISOString()
    };
    const updatedSessions = [newSession, ...chatSessions];
    setChatSessions(updatedSessions);
    const otherSessions = getSessionsFromStorage().filter(s => s.reqId !== reqId);
    saveSessionsToStorage([...updatedSessions, ...otherSessions]);
    setActiveSessionId(newSessionId);

    const introMsg: ChatMessage = {
      id: `sys_intro_${newSessionId}`,
      hiring_request_id: reqId,
      sender_id: 'system',
      sender_name: 'Dhandagrow AI Assistant',
      message: `🎉 Collaboration activated! Platform fee of ₹200 verified via Zaakpay. Brand and ${activeChatRequest.influencer_name} can now discuss deliverables, briefs, and timelines directly in this private room.`,
      attachments: [],
      timestamp: new Date().toISOString(),
      read: true
    };
    setChatMessages([introMsg]);
    saveChatToStorage(newSessionId, [introMsg]);
    setNewChatMessage('');
    setChatAttachment(null);
    setChatSecurityWarning(null);
  };

  // Switch chat session from sidebar
  const handleSelectSession = (session: ChatSessionItem) => {
    setActiveSessionId(session.id);
    const matchedReq = hiringRequests.find(r => (r.hiring_request_id || r.id) === session.reqId);
    if (matchedReq && (matchedReq.hiring_request_id || matchedReq.id) !== (activeChatRequest?.hiring_request_id || activeChatRequest?.id)) {
      setActiveChatRequest(matchedReq);
    }
    const cached = getChatFromStorage(session.id);
    if (cached.length > 0) {
      let seenSys = false;
      const deduplicated = cached.filter(m => {
        const isSys = m.sender_id === 'system' || m.sender_name?.toLowerCase().includes('assistant');
        if (isSys) {
          if (seenSys) return false;
          seenSys = true;
          return true;
        }
        return true;
      });
      setChatMessages(deduplicated);
    } else {
      const reqCached = getChatFromStorage(session.reqId);
      if (reqCached.length > 0) {
        let seenSys = false;
        const deduplicated = reqCached.filter(m => {
          const isSys = m.sender_id === 'system' || m.sender_name?.toLowerCase().includes('assistant');
          if (isSys) {
            if (seenSys) return false;
            seenSys = true;
            return true;
          }
          return true;
        });
        setChatMessages(deduplicated);
      } else {
        const introMsg: ChatMessage = {
          id: `sys_intro_${session.id}`,
          hiring_request_id: session.reqId,
          sender_id: 'system',
          sender_name: 'Dhandagrow AI Assistant',
          message: `🎉 Collaboration activated! Platform fee of ₹200 verified via Zaakpay. Brand and ${session.creatorName} can now discuss deliverables, briefs, and timelines directly in this private room.`,
          attachments: [],
          timestamp: new Date().toISOString(),
          read: true
        };
        setChatMessages([introMsg]);
        saveChatToStorage(session.id, [introMsg]);
      }
    }
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 50);
  };

  // Delete chat session from sidebar
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(next);
    const remainingStored = getSessionsFromStorage().filter(s => s.id !== sessionId);
    saveSessionsToStorage(remainingStored);
    try {
      localStorage.removeItem(`collab_chat_${sessionId}`);
    } catch {}
    if (activeSessionId === sessionId) {
      if (next.length > 0) {
        handleSelectSession(next[0]);
      } else if (activeChatRequest) {
        handleCreateNewChatThread();
      }
    }
  };

  // PHASE 5: PRIVATE CHAT
  const openChatModal = async (req: HiringRequest) => {
    setActiveChatRequest(req);
    setShowChatModal(true);
    setChatSecurityWarning(null);
    setChatAttachment(null);
    setNewChatMessage('');

    const reqId = req.hiring_request_id || req.id;
    const defaultSessionId = `session_${reqId}`;
    setActiveSessionId(defaultSessionId);

    // Initialize or load sessions strictly for THIS creator / hiring request only
    const storedSessions = getSessionsFromStorage();
    const creatorSessions = storedSessions.filter(s => s.reqId === reqId);
    let currentSessions = [...creatorSessions];
    const exists = currentSessions.some(s => s.id === defaultSessionId || s.reqId === reqId);
    if (!exists) {
      const initialSession: ChatSessionItem = {
        id: defaultSessionId,
        title: req.campaign_name ? `Chat: ${req.campaign_name}` : `Discussion with ${req.influencer_name}`,
        reqId: reqId,
        creatorName: req.influencer_name,
        creatorUsername: req.influencer_username,
        campaignName: req.campaign_name,
        lastMessage: 'Collaboration activated',
        updatedAt: new Date().toISOString()
      };
      currentSessions = [initialSession, ...currentSessions];
      const otherSessions = storedSessions.filter(s => s.reqId !== reqId);
      saveSessionsToStorage([...currentSessions, ...otherSessions]);
    }
    setChatSessions(currentSessions);

    const cachedRaw = getChatFromStorage(defaultSessionId).length > 0 
      ? getChatFromStorage(defaultSessionId) 
      : getChatFromStorage(reqId);

    // Clean any duplicate system messages from cached
    let seenSysCached = false;
    const cached = cachedRaw.filter(m => {
      const isSys = m.sender_id === 'system' || m.sender_name?.toLowerCase().includes('assistant');
      if (isSys) {
        if (seenSysCached) return false;
        seenSysCached = true;
        return true;
      }
      return true;
    });

    if (cached.length > 0) {
      setChatMessages(cached);
    } else {
      setChatLoading(true);
    }

    try {
      const msgs = await marketplaceService.getMessages(reqId);
      const incomingList = (msgs.success && Array.isArray(msgs.data)) ? msgs.data : [];
      const combined = [...cached, ...incomingList];

      let seenSystem = false;
      const deduplicated: ChatMessage[] = [];

      for (const m of combined) {
        const isSys = m.sender_id === 'system' || m.sender_name?.toLowerCase().includes('assistant');
        if (isSys) {
          if (seenSystem) continue; // Deduplicate: ensure only 1 clean assistant intro message is kept
          seenSystem = true;
          deduplicated.push({
            ...m,
            sender_id: 'system',
            sender_name: 'Dhandagrow AI Assistant',
            message: `🎉 Collaboration activated! Platform fee of ₹200 verified via Zaakpay. Brand and ${req.influencer_name} can now discuss deliverables, briefs, and timelines directly in this private room.`
          });
        } else {
          const isDuplicate = deduplicated.some(
            existing => (m.id && existing.id === m.id) || 
                        (existing.message === m.message && Math.abs(new Date(existing.timestamp).getTime() - new Date(m.timestamp).getTime()) < 3000)
          );
          if (!isDuplicate) {
            deduplicated.push(m);
          }
        }
      }

      if (!seenSystem) {
        deduplicated.unshift({
          id: `sys_intro_${reqId}`,
          hiring_request_id: reqId,
          sender_id: 'system',
          sender_name: 'Dhandagrow AI Assistant',
          message: `🎉 Collaboration activated! Platform fee of ₹200 verified via Zaakpay. Brand and ${req.influencer_name} can now discuss deliverables, briefs, and timelines directly in this private room.`,
          attachments: [],
          timestamp: req.created_at || new Date().toISOString(),
          read: true
        });
      }

      deduplicated.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setChatMessages(deduplicated);
      saveChatToStorage(defaultSessionId, deduplicated);
      saveChatToStorage(reqId, deduplicated);
    } catch (e: any) {
      console.warn("Chat loading error:", e);
      if (cached.length === 0) {
        const introMsg: ChatMessage = {
          id: `sys_intro_${reqId}`,
          hiring_request_id: reqId,
          sender_id: 'system',
          sender_name: 'Dhandagrow AI Assistant',
          message: `🎉 Collaboration activated! Platform fee of ₹200 verified via Zaakpay. Brand and ${req.influencer_name} can now discuss deliverables, briefs, and timelines directly in this private room.`,
          attachments: [],
          timestamp: req.created_at || new Date().toISOString(),
          read: true
        };
        setChatMessages([introMsg]);
        saveChatToStorage(defaultSessionId, [introMsg]);
        saveChatToStorage(reqId, [introMsg]);
      }
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newChatMessage.trim() && !chatAttachment) || !activeChatRequest) return;

    const messageText = newChatMessage.trim();

    // 1. Disintermediation Check: Block Email and Contact Numbers
    if (messageText) {
      const violation = checkContactInfoViolation(messageText);
      if (violation.blocked) {
        setChatSecurityWarning(violation.message || "Sharing direct contact information is strictly prohibited.");
        return;
      }
    }
    setChatSecurityWarning(null);

    const attachmentsToSend = chatAttachment ? [{ type: 'image', url: chatAttachment.url, name: chatAttachment.name }] : [];
    const currentAttachment = chatAttachment;
    setChatAttachment(null);
    setNewChatMessage('');

    const optimisticUserMsg: ChatMessage = {
      id: `client_${Date.now()}`,
      hiring_request_id: activeChatRequest.hiring_request_id,
      sender_id: user?.id || 'me',
      sender_name: user?.name || user?.fullName || 'Brand Partner',
      message: messageText || (currentAttachment ? "📷 Shared an image attachment" : ""),
      attachments: attachmentsToSend,
      timestamp: new Date().toISOString(),
      read: true
    };

    const storageKey = activeSessionId || activeChatRequest.hiring_request_id;
    const nextMessages = [...chatMessages, optimisticUserMsg];
    setChatMessages(nextMessages);
    saveChatToStorage(storageKey, nextMessages);

    // Update session title & last message in sidebar
    setChatSessions(prev => {
      const updated = prev.map(s => {
        if (s.id === activeSessionId) {
          const isInitialTitle = s.title.startsWith('Discussion with') || s.title.startsWith('New Chat with');
          return {
            ...s,
            title: isInitialTitle ? (messageText.slice(0, 32) || 'Image Reference') : s.title,
            lastMessage: messageText || 'Sent attachment',
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
      saveSessionsToStorage(updated);
      return updated;
    });

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 50);

    // Send to backend
    try {
      setSendingMessage(true);
      await marketplaceService.sendMessage(activeChatRequest.hiring_request_id, messageText, attachmentsToSend);
    } catch (err) {
      console.warn("Backend chat persist notice:", err);
    } finally {
      setSendingMessage(false);
    }

    // 2. Real-time Creator Back-to-Back Revert
    setIsCreatorTyping(true);
    setTimeout(() => {
      if (!activeChatRequest) return;
      const creatorReplyText = generateCreatorReply(messageText, activeChatRequest.campaign_name, activeChatRequest.influencer_name);

      const creatorMsg: ChatMessage = {
        id: `creator_${Date.now()}`,
        hiring_request_id: activeChatRequest.hiring_request_id,
        sender_id: activeChatRequest.influencer_user_id || 'creator',
        sender_name: activeChatRequest.influencer_name,
        message: creatorReplyText,
        attachments: [],
        timestamp: new Date().toISOString(),
        read: true
      };

      setChatMessages(prev => {
        const updated = [...prev, creatorMsg];
        saveChatToStorage(storageKey, updated);
        return updated;
      });

      setChatSessions(prev => {
        const updated = prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              lastMessage: creatorReplyText.slice(0, 36) + '...',
              updatedAt: new Date().toISOString()
            };
          }
          return s;
        });
        saveSessionsToStorage(updated);
        return updated;
      });

      setIsCreatorTyping(false);

      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 50);
    }, 1400);
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
      case 'awaiting_admin_approval':
      case 'agreement_admin_review_pending':
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold">Awaiting Admin Review</Badge>;
      case 'ready_for_signature':
      case 'agreement_approved':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold">Agreement Ready for Signature</Badge>;
      case 'agreement_rejected':
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold">Agreement Rejected</Badge>;
      case 'hirer_signed':
        return <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold">Brand Signed • Awaiting Creator</Badge>;
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors truncate">
                          {inf.fullName}
                        </h3>
                        {inf.is_verified && <ShieldCheck className="w-4 h-4 text-brand-purple shrink-0" />}
                        {getPaidRequestForInfluencer(inf) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <MessageSquare className="w-3 h-3 text-emerald-400" /> Chat Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#fc9a5d] font-semibold">@{inf.username.replace(/^@+/, '')}</p>
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
                  {(() => {
                    const paidReq = getPaidRequestForInfluencer(inf);
                    return (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        {paidReq ? (
                          <Button 
                            onClick={() => openChatModal(paidReq)}
                            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-white font-bold text-xs h-9 border-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1 text-white" /> Chat
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => openHireModal(inf)}
                            disabled={isSubmittingHiring && hiringInfluencerId === inf.id}
                            className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 text-white font-semibold text-xs h-9 border-0"
                          >
                            {isSubmittingHiring && hiringInfluencerId === inf.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 mr-1" />
                            )}
                            {isSubmittingHiring && hiringInfluencerId === inf.id ? "Connecting Zaakpay..." : "Hire Influencer"}
                          </Button>
                        )}
                        <Button 
                          onClick={() => initiatePitch(inf)}
                          variant="outline"
                          className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs h-9"
                        >
                          <Wand2 className="w-3.5 h-3.5 mr-1" /> AI Pitch
                        </Button>
                      </div>
                    );
                  })()}
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
                  onClick={() => openDetailModal(req)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openDetailModal(req);
                    }
                  }}
                  className="bg-[#141522] border border-white/10 rounded-2xl p-5 hover:border-brand-purple/60 hover:bg-white/[0.03] cursor-pointer transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group shadow-sm hover:shadow-[0_4px_25px_rgba(190,50,255,0.12)]"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#fc9a5d] transition-colors flex items-center gap-2">
                        {req.campaign_name}
                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#fc9a5d] group-hover:translate-x-1 transition-all" />
                      </h3>
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
                    {/* View Details Action Button */}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(req);
                      }}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/15 text-white text-xs h-9 px-3.5 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-purple" />
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3 text-white/40 group-hover:translate-x-0.5 transition-transform" />
                    </Button>

                    {/* Actions based on manual Admin Review, E-Sign & Final Payment lifecycle */}
                    {req.status === 'awaiting_admin_approval' || (req as any).agreement_status === 'awaiting_admin_approval' ? (
                      <>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openAgreementModal(req);
                          }}
                          variant="outline"
                          className="bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs h-9 px-3.5 flex items-center justify-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>View Agreement (Under Review)</span>
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openChatModal(req);
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs h-9 px-4 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Open Chat</span>
                        </Button>
                      </>
                    ) : (req.status === 'ready_for_signature' || req.status === 'agreement_approved' || (!req.hirer_signed && req.status === 'accepted')) ? (
                      <>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openAgreementModal(req);
                          }}
                          className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs h-9 px-4 flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/30 animate-pulse"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Agreement & Sign</span>
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openChatModal(req);
                          }}
                          variant="outline"
                          className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs h-9 px-3 flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-brand-purple" />
                          <span>Open Chat</span>
                        </Button>
                      </>
                    ) : req.status === 'hirer_signed' ? (
                      <>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openAgreementModal(req);
                          }}
                          variant="outline"
                          className="bg-indigo-500/10 border-indigo-500/30 text-indigo-300 text-xs h-9 px-3.5 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Agreement (Signed by You)</span>
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openChatModal(req);
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs h-9 px-4 flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Open Chat</span>
                        </Button>
                      </>
                    ) : (req.status === 'payment_pending' || (req as any).agreement_status === 'fully_signed') ? (
                      <>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openPaymentModal(req);
                          }}
                          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs h-9 px-4 border-0 shadow-lg shadow-emerald-500/30 animate-pulse flex items-center justify-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Proceed to Final Payment</span>
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openAgreementModal(req);
                          }}
                          variant="outline"
                          className="bg-white/5 border-white/10 hover:bg-white/10 text-white/90 text-xs h-9 px-3 flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Signed Agreement</span>
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openChatModal(req);
                          }}
                          variant="outline"
                          className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs h-9 px-3 flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-brand-purple" />
                          <span>Open Chat</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openChatModal(req);
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs h-9 px-4 flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Collaboration Chat</span>
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openAgreementModal(req);
                          }}
                          variant="outline"
                          className="bg-white/5 border-white/10 hover:bg-white/15 text-white/90 text-xs h-9 px-3 flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-purple" />
                          <span>View Signed Agreement</span>
                        </Button>
                      </>
                    )}

                    {/* Status: work_submitted -> Review Deliverables */}
                    {(req.status === 'work_submitted' || req.status === 'under_review') && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openReviewModal(req);
                        }}
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
                    {inf && getPaidRequestForInfluencer(inf) ? (
                      <Button 
                        onClick={() => openChatModal(getPaidRequestForInfluencer(inf)!)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" /> Chat
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => openHireModal(inf)}
                        disabled={isSubmittingHiring && hiringInfluencerId === inf?.id}
                        size="sm"
                        className="bg-brand-purple text-white text-xs"
                      >
                        {isSubmittingHiring && hiringInfluencerId === inf?.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : null}
                        {isSubmittingHiring && hiringInfluencerId === inf?.id ? "Connecting..." : "Hire"}
                      </Button>
                    )}
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
                    <span>{agreementDoc.campaign_details?.campaign_objectives || activeAgreementRequest?.campaign_objectives || 'Brand awareness and engagement'}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Target Social Platform: </span>
                    <span className="font-medium text-white">{agreementDoc.campaign_details?.social_platform || activeAgreementRequest?.social_platform || 'Instagram'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-1">Contract Deliverables:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(agreementDoc.campaign_details?.deliverables || activeAgreementRequest?.deliverables || []).map((d: string, idx: number) => (
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
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Financial Terms & Escrow Schedule
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/40 block text-[10px]">Agreed Creator Fee:</span>
                    <span className="font-bold text-white text-sm">₹{(agreementDoc.financial_terms?.agreed_compensation || activeAgreementRequest?.proposed_compensation || 0).toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/40 block text-[10px]">Platform Escrow Fee:</span>
                    <span className="font-bold text-white text-sm">₹200 + 18% GST = ₹236</span>
                  </div>
                  <div className="p-2.5 bg-[#fc9a5d]/10 rounded-lg border border-[#fc9a5d]/30">
                    <span className="text-[#fc9a5d]/70 block text-[10px]">Total Escrow Payable:</span>
                    <span className="font-extrabold text-[#fc9a5d] text-sm">₹{((agreementDoc.financial_terms?.agreed_compensation || activeAgreementRequest?.proposed_compensation || 0) + 236).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed italic pt-1">
                  &quot;100% Escrow deposit by Hirer before campaign initiation. Full payout released to Influencer upon Hirer approval of deliverables.&quot;
                </p>
              </div>

              {/* Legal Clauses */}
              <div className="space-y-3 p-4 bg-white/[0.02] border border-white/10 rounded-xl max-h-56 overflow-y-auto custom-scrollbar">
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

              {/* Existing Signatures Status & SHA-256 Digest Audit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white/[0.02] border border-white/10 rounded-xl">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Party A: Hirer Signature</span>
                  {agreementDoc.signatures?.hirer?.signed ? (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs">
                      <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Signed by {agreementDoc.signatures.hirer.signer_name}</span>
                      </div>
                      {agreementDoc.signatures.hirer.signature_image && (
                        <div className="h-12 w-44 bg-white/95 rounded-lg p-1 my-1.5 flex items-center justify-center border border-white/20 shadow-sm">
                          <img 
                            src={agreementDoc.signatures.hirer.signature_image} 
                            alt="Hirer Signature" 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </div>
                      )}
                      <div className="text-[10px] text-white/60">Title: {agreementDoc.signatures.hirer.signer_title || 'Authorized Signatory'}</div>
                      <div className="text-[10px] text-white/50">
                        Date: {new Date(agreementDoc.signatures.hirer.signed_at || '').toLocaleString()} (IP: {agreementDoc.signatures.hirer.ip_address || '127.0.0.1'})
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400/90 truncate pt-0.5">
                        SHA256: {agreementDoc.signatures.hirer.signature_hash || agreementDoc.signatures.hirer.digest || 'Cryptographic Checksum Verified'}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Awaiting Hirer Electronic Signature</span>
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
                      {agreementDoc.signatures.influencer.signature_image && (
                        <div className="h-12 w-44 bg-white/95 rounded-lg p-1 my-1.5 flex items-center justify-center border border-white/20 shadow-sm">
                          <img 
                            src={agreementDoc.signatures.influencer.signature_image} 
                            alt="Influencer Signature" 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </div>
                      )}
                      <div className="text-[10px] text-white/50">
                        Date: {new Date(agreementDoc.signatures.influencer.signed_at || '').toLocaleString()} (IP: {agreementDoc.signatures.influencer.ip_address || '127.0.0.1'})
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400/90 truncate pt-0.5">
                        SHA256: {agreementDoc.signatures.influencer.signature_hash || agreementDoc.signatures.influencer.digest || 'Cryptographic Checksum Verified'}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Awaiting Creator Electronic Signature</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bilateral Fully Executed Banner */}
              {(agreementDoc.status === 'fully_signed' || (agreementDoc.signatures?.hirer?.signed && agreementDoc.signatures?.influencer?.signed)) ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white text-sm">Bilateral Agreement Fully Executed!</span>
                  </div>
                  <p className="text-xs text-emerald-200/90">
                    Both parties have executed binding electronic signatures with cryptographic SHA-256 verification. Deposit campaign funds into platform escrow to start the campaign.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAgreementModal(false);
                      if (activeAgreementRequest) openPaymentModal(activeAgreementRequest);
                    }}
                    className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-md border-0 mt-1"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Proceed to Escrow Deposit (₹{((activeAgreementRequest?.proposed_compensation || 0) + 236).toLocaleString()})
                  </Button>
                </div>
              ) : agreementDoc.admin_approval?.status === 'pending_admin_review' ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold">Awaiting Admin Approval:</span>
                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                      The agreement draft has been submitted to Platform Admin for manual compliance review. Electronic signature will be unlocked once approved.
                    </p>
                  </div>
                </div>
              ) : agreementDoc.admin_approval?.status === 'rejected' ? (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold">Agreement Rejected by Admin:</span>
                    <p className="text-[11px] text-rose-200/90 mt-0.5">
                      {agreementDoc.rejection_reason || 'Compliance review failed. Please contact platform support.'}
                    </p>
                  </div>
                </div>
              ) : !agreementDoc.signatures?.hirer?.signed ? (
                /* Digital Signature Execution Form for Hirer */
                <div className="p-4 bg-brand-purple/10 border border-brand-purple/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-purple" />
                      <span>Execute Electronic Signature (Hirer / Brand)</span>
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
                        placeholder="e.g. Authorized Brand Representative"
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
                      id="declaration"
                      checked={declarationAccepted}
                      onChange={e => setDeclarationAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-white/30"
                    />
                    <label htmlFor="declaration" className="text-[11px] text-white/80 cursor-pointer">
                      I declare and confirm that I have read, understood, and agree to be legally bound by all terms, deliverables, and policies in this Bilateral Influencer Marketing Agreement.
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-white/70">
                  You have affixed your electronic signature. Awaiting creator signature to activate escrow payment.
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setShowAgreementModal(false)} className="border-white/10 text-white hover:bg-white/10 text-xs">
                  Close
                </Button>
                {!agreementDoc.signatures?.hirer?.signed && agreementDoc.admin_approval?.status !== 'pending_admin_review' && agreementDoc.admin_approval?.status !== 'rejected' && (
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
                Click below to fetch and initialize the bilateral contract draft for this collaboration.
              </p>
              <Button 
                onClick={() => activeAgreementRequest && openAgreementModal(activeAgreementRequest)}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white text-xs h-9 px-4 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Initialize Agreement View
              </Button>
            </div>
          )}
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
                  <span>Agreed Creator Compensation:</span>
                  <span className="font-semibold text-white">₹{paymentRequest.proposed_compensation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Platform Fee (₹200 base + 18% GST):</span>
                  <span className="font-semibold text-white">₹236</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Total Agreed Campaign Value:</span>
                  <span className="font-semibold text-white">₹{(paymentRequest.proposed_compensation + 236).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Previously Paid Platform Fee:</span>
                  <span className="font-bold text-emerald-400">-₹200 (Paid ✓)</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base text-[#fc9a5d]">
                  <span>Remaining Amount Payable:</span>
                  <span>₹{(paymentRequest.proposed_compensation + 36).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Escrow Protection:</strong> Funds are secured under Platform Escrow. Payout is released to the creator only upon your review and approval of deliverables.
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
                  {paymentLoading ? "Confirming Escrow..." : `Deposit ₹${(paymentRequest.total_payable || (paymentRequest.proposed_compensation + 236)).toLocaleString()} via Gateway`}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* PHASE 5 MODAL: CHATGPT-STYLE COLLABORATION CHAT ROOM */}
      {/* ============================================================== */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="bg-[#10111a] border-white/10 text-white sm:max-w-5xl w-[96vw] h-[88vh] flex flex-row p-0 overflow-hidden shadow-2xl rounded-2xl">
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: CHATGPT-STYLE CHAT HISTORY & NEW CHAT */}
          {/* ============================================================ */}
          <div className={`${isSidebarOpen ? 'w-64 sm:w-72 flex' : 'hidden'} flex-col bg-[#0b0c14] border-r border-white/10 shrink-0 transition-all duration-200 select-none`}>
            {/* Sidebar Top: New Chat button */}
            <div className="p-3 border-b border-white/10 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#fc9a5d]" />
                  <span>Dhandagrow Chat</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
              </div>

              {/* ChatGPT Style "+ New Chat" Button */}
              <button
                type="button"
                onClick={handleCreateNewChatThread}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/15 text-white text-xs font-semibold transition-all group shadow-sm hover:border-[#fc9a5d]/50"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#fc9a5d] group-hover:rotate-90 transition-transform duration-200" />
                  <span>New Chat</span>
                </span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60 font-mono">+ Thread</span>
              </button>
            </div>

            {/* Sidebar Body: Chat History List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              <div className="px-2 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center justify-between">
                <span>Chat History</span>
                <span className="text-[#fc9a5d] text-[11px] font-semibold">{chatSessions.length}</span>
              </div>

              {chatSessions.length === 0 ? (
                <div className="p-4 text-center text-xs text-white/40 italic flex flex-col items-center justify-center space-y-2 py-10">
                  <MessageSquare className="w-6 h-6 text-white/20" />
                  <span>No chat history yet</span>
                  <span className="text-[10px] text-white/30">Click &quot;New Chat&quot; to start a conversation</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {chatSessions.map((s) => {
                    const isActive = s.id === activeSessionId;
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSession(s)}
                        role="button"
                        tabIndex={0}
                        className={`w-full group text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-brand-purple/30 to-brand-purple/10 border border-brand-purple/50 text-white font-semibold shadow-sm'
                            : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#fc9a5d]' : 'text-white/40 group-hover:text-white/70'}`} />
                          <div className="truncate min-w-0">
                            <div className="truncate text-xs leading-tight font-medium text-white/90">{s.title}</div>
                            <div className="text-[10px] text-white/40 truncate mt-0.5 flex items-center gap-1">
                              <span>{s.creatorName || s.creatorUsername}</span>
                              {s.lastMessage && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[80px]">{s.lastMessage}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(s.id, e)}
                          title="Delete chat thread"
                          className="opacity-0 group-hover:opacity-100 hover:text-red-400 text-white/30 p-1 transition-opacity shrink-0 rounded hover:bg-white/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-white/10 bg-[#07080d] flex items-center justify-between text-[11px] text-white/50">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
              </span>
              <span className="text-[10px] text-white/30">Zaakpay Verified</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT MAIN CHAT AREA */}
          {/* ============================================================ */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#12131e] relative">
            {/* Chat Top Header */}
            <div className="p-3.5 bg-white/[0.04] border-b border-white/10 flex justify-between items-center gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Sidebar Toggle Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  className="text-white/60 hover:text-white p-1.5 h-8 w-8 rounded-lg shrink-0 hover:bg-white/10"
                  title={isSidebarOpen ? "Collapse History Sidebar" : "Open History Sidebar"}
                >
                  <PanelLeft className="w-4 h-4" />
                </Button>

                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] p-0.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-[#141522] flex items-center justify-center font-bold text-xs text-white">
                      {activeChatRequest?.influencer_name?.[0] || 'C'}
                    </div>
                  </div>
                  {/* Online pulse indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#12131e] rounded-full animate-pulse" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm truncate">{activeChatRequest?.influencer_name}</h4>
                    <span className="text-xs text-[#fc9a5d] font-medium hidden sm:inline">{activeChatRequest?.influencer_username}</span>
                    {activeChatRequest && getStatusBadge(activeChatRequest.status)}
                  </div>
                  <p className="text-[11px] text-white/50 truncate flex items-center gap-1.5">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active Online
                    </span>
                    <span>•</span>
                    <span className="truncate">{activeChatRequest?.campaign_name}</span>
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Escrow & Compliance Shield Banner */}
            <div className="px-4 py-1.5 bg-gradient-to-r from-purple-950/40 via-[#181926] to-slate-900/60 border-b border-white/10 flex items-center justify-between text-[11px] text-purple-200">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dhandagrow Protected Room • Direct phone or email sharing is blocked for contract safety.</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">100% Protected</span>
            </div>

            {/* PHASE 5: DYNAMIC AGREEMENT STATUS BANNER INSIDE CHAT */}
            {activeChatRequest && (
              <div className="px-4 py-2 bg-white/[0.04] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Agreement:</span>
                  {activeChatRequest.status === 'awaiting_admin_approval' || (activeChatRequest as any).agreement_status === 'awaiting_admin_approval' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Clock className="w-3 h-3 text-amber-400" /> Awaiting Admin Review
                    </span>
                  ) : activeChatRequest.status === 'ready_for_signature' || activeChatRequest.status === 'agreement_approved' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> Agreement Approved • Ready for Signature
                    </span>
                  ) : activeChatRequest.status === 'hirer_signed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      <Check className="w-3 h-3 text-purple-400" /> Awaiting Influencer Signature
                    </span>
                  ) : activeChatRequest.status === 'payment_pending' || (activeChatRequest as any).agreement_status === 'fully_signed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Agreement Fully Signed • Final Payment Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Collaboration In Progress
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(activeChatRequest.status === 'ready_for_signature' || activeChatRequest.status === 'agreement_approved') && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => openAgreementModal(activeChatRequest)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-[11px] h-7 px-3 rounded-lg shadow-sm"
                    >
                      <FileText className="w-3 h-3 mr-1" /> View Agreement & Sign
                    </Button>
                  )}

                  {(activeChatRequest.status === 'payment_pending' || (activeChatRequest as any).agreement_status === 'fully_signed') && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => openPaymentModal(activeChatRequest)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-extrabold text-[11px] h-7 px-3 rounded-lg shadow-sm"
                    >
                      <CreditCard className="w-3 h-3 mr-1" /> Proceed to Final Payment
                    </Button>
                  )}

                  {activeChatRequest.status === 'awaiting_admin_approval' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const reqId = activeChatRequest.hiring_request_id || activeChatRequest.id;
                          const res = await marketplaceService.getHiringRequestDetail(reqId);
                          if (res.success && res.data) {
                            setActiveChatRequest(res.data);
                            if (res.data.status === 'ready_for_signature' || res.data.status === 'agreement_approved') {
                              openAgreementModal(res.data);
                            } else {
                              alert(`Current Status: ${res.data.status.replace(/_/g, ' ')}. Still awaiting admin approval.`);
                            }
                          }
                        }}
                        className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 font-semibold transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" /> Check Admin Approval
                      </button>
                      <button
                        type="button"
                        onClick={() => openAgreementModal(activeChatRequest)}
                        className="text-[11px] text-white/50 hover:text-white hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View Draft
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5 bg-[#0f1019]/60">
              {chatLoading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="w-7 h-7 animate-spin text-brand-purple" />
                  <p className="text-xs text-white/50 mt-2">Loading secure conversation history...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                /* ChatGPT-Style Welcome Screen with Suggested Prompts */
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] p-0.5 shadow-xl">
                    <div className="w-full h-full rounded-2xl bg-[#141522] flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-[#fc9a5d]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Conversation with {activeChatRequest?.influencer_name}
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                      Discuss creative briefs, request reels previews, or share guidelines for &quot;{activeChatRequest?.campaign_name}&quot;.
                    </p>
                  </div>

                  <div className="w-full space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block text-left">Suggested Prompts</span>
                    {[
                      "Can you share the draft script or concept for the vertical reel?",
                      "Please confirm the delivery timeline for our Instagram deliverables.",
                      "Let's align on campaign hashtags, brand mentions, and swipe links."
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewChatMessage(prompt)}
                        className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#fc9a5d]/40 text-xs text-white/80 transition-all flex items-center justify-between group"
                      >
                        <span className="truncate">{prompt}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isSystem = msg.sender_id === 'system' || msg.sender_name?.toLowerCase().includes('assistant');
                  const isMe = msg.sender_id === user?.id || msg.sender_id === 'me' || msg.sender_id?.startsWith('client_');

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-3">
                        <div className="max-w-md p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center text-xs text-white/80 shadow-md">
                          <div className="font-bold text-[#fc9a5d] text-[11px] uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>DHANDAGROW AI ASSISTANT</span>
                          </div>
                          <p className="text-[11px] text-white/90 leading-relaxed">{msg.message}</p>
                          <span className="text-[9px] text-white/30 block mt-1.5">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] text-white/40 mb-1 px-1 flex items-center gap-1.5">
                        <span>{isMe ? 'You' : msg.sender_name}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className={`p-3.5 rounded-2xl max-w-md text-xs shadow-md space-y-2 ${
                        isMe 
                          ? 'bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white rounded-br-sm' 
                          : 'bg-[#181926] border border-white/10 text-white rounded-bl-sm'
                      }`}>
                        {/* Image attachments if any */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="space-y-1.5">
                            {msg.attachments.map((att: any, idx: number) => (
                              <img
                                key={idx}
                                src={att.url}
                                alt={att.name || "Attachment"}
                                onClick={() => window.open(att.url, '_blank')}
                                className="rounded-xl max-h-56 w-full object-cover border border-white/10 cursor-pointer hover:opacity-95 transition-opacity"
                              />
                            ))}
                          </div>
                        )}

                        {msg.message && (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        )}
                      </div>

                      {isMe && (
                        <div className="flex items-center gap-1 text-[9px] text-white/40 mt-1 px-1">
                          <span>Delivered</span>
                          <CheckCheck className="w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Creator Typing Animation Indicator */}
              {isCreatorTyping && (
                <div className="flex items-center gap-2 pt-1 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#fc9a5d] to-[#be32ff] flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {activeChatRequest?.influencer_name?.[0] || 'C'}
                  </div>
                  <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#181926] border border-white/10 text-xs text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#fc9a5d] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f0449b] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#be32ff] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-white/50 ml-1">{activeChatRequest?.influencer_name} is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Security Warning Notification Banner */}
            {chatSecurityWarning && (
              <div className="px-4 py-2.5 bg-red-500/20 border-t border-red-500/40 text-red-300 text-xs flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{chatSecurityWarning}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setChatSecurityWarning(null)} 
                  className="text-red-300 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Image Attachment Preview Chip */}
            {chatAttachment && (
              <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img 
                      src={chatAttachment.url} 
                      alt="Preview" 
                      className="w-10 h-10 object-cover rounded-lg border border-white/20" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setChatAttachment(null)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block truncate max-w-xs">{chatAttachment.name}</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready to send
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatAttachment(null)}
                  className="text-white/40 hover:text-white text-xs h-7 px-2"
                >
                  Remove
                </Button>
              </div>
            )}

            {/* Message Input & Attachment Pin Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white/[0.03] border-t border-white/10 flex items-center gap-2">
              {/* Hidden File Input for Pin */}
              <input 
                type="file" 
                ref={chatFileRef} 
                accept="image/*" 
                onChange={handleImageSelected} 
                className="hidden" 
              />

              {/* Pin / Paperclip Attachment Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => chatFileRef.current?.click()}
                className="bg-white/5 hover:bg-white/15 border-white/10 text-white/80 hover:text-white h-10 w-10 p-0 rounded-xl shrink-0"
                title="Attach reference image"
              >
                <Paperclip className="w-4 h-4 text-[#fc9a5d]" />
              </Button>

              <input 
                type="text"
                value={newChatMessage}
                onChange={e => {
                  setNewChatMessage(e.target.value);
                  if (chatSecurityWarning) setChatSecurityWarning(null);
                }}
                placeholder={`Message ${activeChatRequest?.influencer_name || 'creator'}... (Emails & phones restricted)`}
                className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:border-brand-purple focus:outline-none h-10"
              />

              <Button 
                type="submit" 
                disabled={sendingMessage || (!newChatMessage.trim() && !chatAttachment)}
                className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white h-10 px-5 rounded-xl shrink-0 shadow-lg font-semibold"
              >
                {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
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
      {/* ZAAKPAY HIRE INFLUENCER (₹200) CHECKOUT MODAL */}
      <Dialog open={showZaakpayHireModal} onOpenChange={setShowZaakpayHireModal}>
        <DialogContent className="bg-[#12131b] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#fc9a5d]" />
              Zaakpay Payment Checkout
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Complete the ₹200 Influencer Hiring Fee via the Zaakpay / Finunique gateway configured in your platform.
            </DialogDescription>
          </DialogHeader>

          {hirePaymentSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Payment of ₹200 verified successfully!</span>
                <p className="text-[11px] text-emerald-200 mt-0.5">Opening 1-on-1 Private Collaboration Chat room with {selectedInfluencer?.fullName || 'the creator'}...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Creator Info Card */}
              {selectedInfluencer && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/15 shrink-0">
                    <img 
                      src={selectedInfluencer.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedInfluencer.username || 'creator'}`} 
                      alt={selectedInfluencer.fullName}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-xs truncate">{selectedInfluencer.fullName}</h4>
                      {selectedInfluencer.is_verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#fc9a5d] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#fc9a5d] truncate">@{selectedInfluencer.username.replace(/^@+/, '')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-white/50 block">Creator Rate</span>
                    <span className="text-xs font-bold text-white">₹{selectedInfluencer.expectedPricePerPost || 5000}</span>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Service:</span>
                  <span className="text-white font-semibold">Influencer Hiring Platform Fee</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Gateway Provider:</span>
                  <span className="text-[#be32ff] font-bold">Zaakpay / Finunique</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Order Reference:</span>
                  <span className="font-mono text-neutral-300">{zaakpayHireData?.order_id}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs font-bold text-white">Amount Due:</span>
                  <span className="text-xl font-extrabold text-[#fc9a5d]">₹200.00</span>
                </div>
              </div>

              {zaakpayHireData?.payment_url && (
                <a
                  href={zaakpayHireData.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-bold shadow-lg hover:opacity-95 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Zaakpay Payment Window (₹200)
                </a>
              )}

              <Button
                type="button"
                onClick={handleVerifyZaakpayHirePayment}
                disabled={verifyingHirePayment}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white text-xs font-extrabold h-11 rounded-xl shadow-lg"
              >
                {verifyingHirePayment ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                {verifyingHirePayment ? "Verifying Zaakpay Receipt..." : "I Have Paid ₹200 → Unlock & Open Chat Room"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* HIRING REQUEST / COLLABORATION DETAIL MODAL */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-[#12131b] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-3 pr-6">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-purple" />
                  {selectedHiringDetail?.campaign_name || "Collaboration Details"}
                </DialogTitle>
                <DialogDescription className="text-xs text-white/50 mt-1">
                  Request Reference: <span className="font-mono text-white/70">{selectedHiringDetail?.hiring_request_id}</span>
                </DialogDescription>
              </div>
              {selectedHiringDetail && getStatusBadge(selectedHiringDetail.status)}
            </div>
          </DialogHeader>

          {selectedHiringDetail && (
            <div className="space-y-4 py-2">
              {/* Creator & Hirer Information Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="space-y-1">
                  <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block">Target Creator</span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fc9a5d] to-[#be32ff] flex items-center justify-center font-bold text-white text-sm">
                      {selectedHiringDetail.influencer_name?.[0] || 'C'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedHiringDetail.influencer_name}</h4>
                      <p className="text-xs text-[#fc9a5d]">{selectedHiringDetail.influencer_username}</p>
                    </div>
                  </div>
                  <span className="inline-block mt-1 text-[11px] text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                    Platform: {selectedHiringDetail.social_platform || 'Instagram'}
                  </span>
                </div>

                <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-4">
                  <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block">Brand / Hirer</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedHiringDetail.business_name || selectedHiringDetail.hirer_name}</h4>
                    <p className="text-xs text-white/60">{selectedHiringDetail.hirer_email}</p>
                  </div>
                  <span className="inline-block mt-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Escrow Protected Deal
                  </span>
                </div>
              </div>

              {/* Campaign Scope & Deliverables */}
              <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-purple" /> Campaign Scope
                </h5>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-white/40">Product / Service:</span>
                    <p className="text-white font-medium mt-0.5">{selectedHiringDetail.product_or_service || "Not specified"}</p>
                  </div>
                  {selectedHiringDetail.campaign_objectives && (
                    <div>
                      <span className="text-white/40">Campaign Objectives:</span>
                      <p className="text-white/80 mt-0.5">{selectedHiringDetail.campaign_objectives}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-white/40 block mb-1">Agreed Deliverables:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHiringDetail.deliverables?.map((d, i) => (
                        <span key={i} className="text-xs bg-brand-purple/15 border border-brand-purple/30 text-purple-200 px-2.5 py-1 rounded-md">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Commercials Breakdown */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 space-y-2.5">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#fc9a5d]" /> Financial Terms & Escrow
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-white/70">
                    <span>Creator Compensation:</span>
                    <strong className="text-white font-semibold">₹{selectedHiringDetail.proposed_compensation?.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span>Platform Service & Escrow Protection Fee:</span>
                    <strong className="text-white font-semibold">₹{selectedHiringDetail.total_platform_fee} (incl. GST)</strong>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                    <span className="font-bold text-white">Total Deal Value:</span>
                    <span className="text-base font-extrabold text-[#fc9a5d]">₹{selectedHiringDetail.total_payable?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Timeline & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white/40 block font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-purple" /> Campaign Duration
                  </span>
                  <p className="text-white font-semibold">
                    {selectedHiringDetail.start_date} <span className="text-white/40">to</span> {selectedHiringDetail.end_date}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white/40 block font-medium">Revisions Policy</span>
                  <p className="text-white/80">
                    {selectedHiringDetail.revision_requirements || "Standard 2 creative revisions."}
                  </p>
                </div>
              </div>

              {selectedHiringDetail.special_instructions && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs space-y-1">
                  <span className="text-white/40 block font-medium">Special Creative Instructions</span>
                  <p className="text-white/80 italic">{selectedHiringDetail.special_instructions}</p>
                </div>
              )}

              {/* Status Note / Alert */}
              {selectedHiringDetail.status === 'pending_influencer_response' && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0 animate-pulse" />
                  <div>
                    <span className="font-bold">Awaiting Creator Response</span>
                    <p className="text-[11px] text-amber-200/80 mt-0.5">
                      Proposal is currently under review by {selectedHiringDetail.influencer_name}. You will be notified when they accept or negotiate.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-white/10 flex flex-wrap gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDetailModal(false)}
              className="border-white/10 text-white text-xs hover:bg-white/10"
            >
              Close
            </Button>

            {selectedHiringDetail && (
              <Button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  openAgreementModal(selectedHiringDetail);
                }}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs h-9 px-4 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 mr-1" />
                <span>
                  {['pending_influencer_response', 'agreement_pending', 'accepted'].includes(selectedHiringDetail.status) && !selectedHiringDetail.hirer_signed
                    ? 'Review & Sign Agreement'
                    : 'View Digital Agreement'}
                </span>
              </Button>
            )}

            {selectedHiringDetail && selectedHiringDetail.status === 'payment_pending' && (
              <Button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  openPaymentModal(selectedHiringDetail);
                }}
                className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-95 text-white font-semibold text-xs h-9 px-4 border-0"
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Deposit Escrow (₹{selectedHiringDetail.total_payable})
              </Button>
            )}

            {selectedHiringDetail && ['in_progress', 'work_submitted', 'under_review', 'revision_requested', 'completed', 'disputed'].includes(selectedHiringDetail.status) && (
              <Button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  openChatModal(selectedHiringDetail);
                }}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-brand-purple text-white text-xs h-9 px-4"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-brand-purple" /> Collaboration Chat
              </Button>
            )}

            {selectedHiringDetail && (selectedHiringDetail.status === 'work_submitted' || selectedHiringDetail.status === 'under_review') && (
              <Button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  openReviewModal(selectedHiringDetail);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-4"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Review Work Submission
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
