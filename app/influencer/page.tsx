"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  ExternalLink,
  Send,
  MapPin,
  Tag,
  AlertCircle,
  X,
  Share2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  FileText,
  Heart,
  Wallet,
  Megaphone,
  Bell,
  MessageSquare,
  FolderGit2,
  SlidersHorizontal,
  ArrowRight,
  Crown,
  BarChart3,
  Camera,
  Upload,
  Image as ImageIcon,
  Store,
  TrendingUp
} from 'lucide-react';

import { InfluencerSocialConnectionModal } from '@/components/influencer/InfluencerSocialConnectionModal';
import { influencerSocialService, InfluencerSocialStatus } from '@/services/influencer-social.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import marketplaceService, { HiringRequest } from '@/services/marketplace.service';
import influencerService, { 
  InfluencerProfile, 
  DashboardSummary 
} from '@/services/influencer.service';
import { useAuth } from '@/components/auth/AuthProvider';
import { creatorOnboardingService } from '@/services/creator-onboarding.service';
import { chatService } from '@/services/chat.service';

export interface BusinessOpportunity {
  id: string;
  business_name: string;
  business_logo: string;
  campaign_title: string;
  cover_image: string;
  category: string;
  location: string;
  distance?: string;
  format: string;
  compensation_range: string;
  budget_num: number;
  deliverables: string[];
  slots_left: number;
  deadline: string;
  description: string;
  is_verified: boolean;
  collaboration_type: 'Paid' | 'Barter' | 'Hybrid';
}

const RECOMMENDED_BUSINESSES: BusinessOpportunity[] = [
  {
    id: 'opp-roastery-cafe',
    business_name: 'The Roastery Coffee House',
    business_logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80',
    campaign_title: 'Artisan Weekend Brunch & Cold Brew Showcase',
    cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    category: 'Cafés and Restaurants',
    location: 'C-Scheme, Jaipur',
    distance: '2.2 km away',
    format: 'Reels & Stories',
    compensation_range: '₹12,000 – ₹20,000',
    budget_num: 16000,
    deliverables: ['1 Aesthetic Ambience & Food Tasting Reel (60s)', '2 Instagram Stories with Geo-tag and Menu Highlight'],
    slots_left: 3,
    deadline: 'In 4 days',
    description: 'Looking for local food and lifestyle creators to experience our new seasonal manual brew bar and artisan breakfast platters.',
    is_verified: true,
    collaboration_type: 'Paid'
  },
  {
    id: 'opp-anokhi-boutique',
    business_name: 'Anokhi Handcrafted Boutique',
    business_logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80',
    campaign_title: 'Block-Print Summer Edit & Heritage Lookbook',
    cover_image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion and Boutiques',
    location: 'Civil Lines, Jaipur',
    distance: '3.5 km away',
    format: 'Lookbook Reel',
    compensation_range: '₹18,000 – ₹32,000',
    budget_num: 25000,
    deliverables: ['1 Multi-outfit Styling Reel', '3 High-Resolution Carousel Photos'],
    slots_left: 2,
    deadline: 'In 5 days',
    description: 'Highlight traditional Rajasthani hand block printing with modern contemporary summer styling and ethical fashion storytelling.',
    is_verified: true,
    collaboration_type: 'Paid'
  },
  {
    id: 'opp-ozone-fitness',
    business_name: 'Ozone Fitness Club & Spa',
    business_logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80',
    campaign_title: 'Holistic Strength & Recovery Transformation',
    cover_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    category: 'Fitness and Gyms',
    location: 'Tonk Road, Jaipur',
    distance: '4.1 km away',
    format: 'Workout Vlog',
    compensation_range: '₹15,000 – ₹25,000',
    budget_num: 20000,
    deliverables: ['1 High-energy Training Reel', '1 Story Q&A session'],
    slots_left: 4,
    deadline: 'In 7 days',
    description: 'Inviting fitness and wellness creators to review our world-class gym floor, recovery ice baths, and specialized trainer workouts.',
    is_verified: true,
    collaboration_type: 'Paid'
  },
  {
    id: 'opp-kama-salon',
    business_name: 'Kama Wellness & Ayurvedic Salon',
    business_logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=150&q=80',
    campaign_title: 'Herbal Hair & Skin Detox Ritual Experience',
    cover_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    category: 'Beauty and Salons',
    location: 'Malviya Nagar, Jaipur',
    distance: '5.0 km away',
    format: 'Experience Vlog',
    compensation_range: '₹16,000 – ₹28,000',
    budget_num: 22000,
    deliverables: ['1 Calming Spa Experience Reel', '2 Detailed Review Stories with Booking Link'],
    slots_left: 3,
    deadline: 'In 6 days',
    description: 'Document an authentic Ayurvedic Kansa wand facial and botanical hair therapy with before-and-after results.',
    is_verified: true,
    collaboration_type: 'Paid'
  }
];

const SMB_CATEGORIES = [
  'All',
  'Cafés and Restaurants',
  'Fashion and Boutiques',
  'Beauty and Salons',
  'Fitness and Gyms',
  'Local Shops',
  'Travel and Hospitality',
  'Home and Lifestyle',
  'Startups and Other Services'
];

// Curated Creator Cover Banner Presets (Like YouTube/LinkedIn)
const BANNER_PRESETS = [
  {
    id: 'aurora',
    name: 'Cosmic Violet Nebula',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'neon',
    name: 'Neon Cyber Horizon',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'luxe',
    name: 'Midnight Luxe Sheen',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'minimal',
    name: 'Dark Studio Gradient',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80'
  }
];

const resolveAvatarUrl = (url?: string | null) => {
  if (!url || typeof url !== 'string' || url === 'null' || url === 'undefined') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const cleanBase = backendUrl.replace(/\/+$/, '');
  return `${cleanBase}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

export default function InfluencerDashboard() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id || (user as any)?._id;

  // Banner input ref
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Guard: incomplete influencers must complete onboarding first
  useEffect(() => {
    let isCancelled = false;

    async function checkAccess() {
      if (typeof window === 'undefined' || isAuthLoading) return;
      if (!user) return;

      try {
        const onbStatus = await creatorOnboardingService.getInfluencerOnboardingStatus();
        if (isCancelled) return;
        if (!onbStatus.isCompleted) {
          router.replace('/onboarding/influencer');
        }
      } catch (err) {
        if (!isCancelled) {
          router.replace('/onboarding/influencer');
        }
      }
    }

    checkAccess();

    return () => {
      isCancelled = true;
    };
  }, [user, isAuthLoading, router]);
  
  // Data States
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary>({
    available_opportunities: 12,
    new_opportunities: 3,
    active_collaborations: 5,
    completed_collaborations: 8,
    total_earnings: 45000
  });
  const [directHiringRequests, setDirectHiringRequests] = useState<HiringRequest[]>([]);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialStatus, setSocialStatus] = useState<InfluencerSocialStatus | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(3);
  
  // UI States
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Banner Customization States (YouTube/LinkedIn style)
  const [bannerImage, setBannerImage] = useState<string>('');
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Proposal Modal States
  const [selectedOpp, setSelectedOpp] = useState<BusinessOpportunity | null>(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchMessage, setPitchMessage] = useState('');
  const [proposedBudget, setProposedBudget] = useState<number | ''>('');
  const [submittingPitch, setSubmittingPitch] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);
  const [pitchError, setPitchError] = useState<string | null>(null);

  // Load Profile and Summary
  const loadProfileAndSummary = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, summaryRes, socialRes, hiringRes, unreadRes] = await Promise.allSettled([
        influencerService.getMyProfile(),
        influencerService.getDashboardSummary(),
        influencerSocialService.getStatus(),
        marketplaceService.getMyHiringRequests(),
        chatService.getTotalUnreadCount(userId)
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const p = profileRes.value.data;
        setProfile(p);
        
        // Restore custom banner image if set
        const savedBanner = p.cover_image || p.banner_image || (typeof window !== 'undefined' ? localStorage.getItem(`creator_banner_${userId}`) : '');
        if (savedBanner) {
          setBannerImage(savedBanner);
        }
      } else {
        // Local storage onboarding fallback
        try {
          const local = await creatorOnboardingService.loadOnboardingData(user);
          if (local) {
            setProfile({
              fullName: local.fullName,
              username: local.username,
              bio: local.bio,
              location: local.location,
              category: local.niches?.[0],
              profile_image: local.profileImage,
            } as any);
          }
        } catch {}
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
        setSummary(prev => ({
          ...prev,
          ...summaryRes.value.data,
          available_opportunities: summaryRes.value.data.available_opportunities || 12,
          new_opportunities: summaryRes.value.data.new_opportunities || 3,
          active_collaborations: summaryRes.value.data.active_collaborations || 5,
          total_earnings: summaryRes.value.data.total_earnings || 45000,
        }));
      }

      if (socialRes.status === 'fulfilled') {
        setSocialStatus(socialRes.value);
      }

      if (hiringRes.status === 'fulfilled' && hiringRes.value?.success && Array.isArray(hiringRes.value.data)) {
        setDirectHiringRequests(hiringRes.value.data);
      }

      if (unreadRes.status === 'fulfilled') {
        setUnreadCount(unreadRes.value > 0 ? unreadRes.value : 3);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, userId]);

  // Initial Load
  useEffect(() => {
    setMounted(true);
    loadProfileAndSummary();
  }, [loadProfileAndSummary]);

  // Handle Banner Upload from Device (YouTube / LinkedIn feature)
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setBannerImage(dataUrl);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`creator_banner_${userId}`, dataUrl);
        }
        // Save to backend profile
        try {
          await influencerService.updateMyProfile({
            cover_image: dataUrl,
            banner_image: dataUrl
          });
        } catch (err) {
          console.warn('Banner saved locally:', err);
        }
      }
      setUploadingBanner(false);
      setShowBannerModal(false);
    };
    reader.readAsDataURL(file);
  };

  // Select Curated Preset Banner
  const handleSelectPresetBanner = async (presetUrl: string) => {
    setBannerImage(presetUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`creator_banner_${userId}`, presetUrl);
    }
    setShowBannerModal(false);
    try {
      await influencerService.updateMyProfile({
        cover_image: presetUrl,
        banner_image: presetUrl
      });
    } catch (err) {}
  };

  // Reset Banner to Default
  const handleResetBanner = async () => {
    setBannerImage('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`creator_banner_${userId}`);
    }
    setShowBannerModal(false);
    try {
      await influencerService.updateMyProfile({
        cover_image: '',
        banner_image: ''
      });
    } catch (err) {}
  };

  // Toggle Favorite
  const toggleFavorite = (oppId: string) => {
    setFavorites(prev => ({ ...prev, [oppId]: !prev[oppId] }));
  };

  // Open Proposal Modal
  const handleOpenPitch = (opp: BusinessOpportunity) => {
    setSelectedOpp(opp);
    setPitchMessage(`Hi ${opp.business_name} Team! I would love to collaborate on the "${opp.campaign_title}". My audience engages deeply with creative reels and authentic local experiences.`);
    setProposedBudget(opp.budget_num);
    setPitchSuccess(false);
    setPitchError(null);
    setShowPitchModal(true);
  };

  // Submit Proposal & Message Business
  const handleSubmitPitch = async () => {
    if (!selectedOpp) return;
    if (!pitchMessage.trim() || pitchMessage.trim().length < 10) {
      setPitchError('Please enter a creative proposal (at least 10 characters).');
      return;
    }

    try {
      setSubmittingPitch(true);
      setPitchError(null);

      // Connect proposal directly to active chat conversation with the business
      await chatService.connectDealToChat({
        id: selectedOpp.id,
        business_name: selectedOpp.business_name,
        business_logo: selectedOpp.business_logo,
        campaign_name: selectedOpp.campaign_title,
        budget: typeof proposedBudget === 'number' ? proposedBudget : selectedOpp.budget_num,
        deliverables: selectedOpp.deliverables,
        initial_pitch: pitchMessage.trim()
      }, userId);

      setPitchSuccess(true);
      setTimeout(() => {
        setShowPitchModal(false);
        router.push(`/influencer/chats?brand=${encodeURIComponent(selectedOpp.business_name)}`);
      }, 1300);
    } catch (err: any) {
      setPitchError(err?.message || 'Failed to submit proposal.');
    } finally {
      setSubmittingPitch(false);
    }
  };

  // Computed Values
  const displayName = mounted ? (profile?.fullName || profile?.full_name || user?.fullName || user?.name || 'Sejal Gupta') : 'Sejal Gupta';
  const firstName = displayName.split(' ')[0] || displayName;
  const displayUsername = mounted ? (profile?.username ? profile.username.replace(/^@/, '') : 'sejall1') : 'sejall1';
  const displayLocation = mounted ? (profile?.location || 'Jaipur, India') : 'Jaipur, India';
  const niches = (profile?.niches && profile.niches.length > 0) ? profile.niches : ['Fashion & Style', 'Beauty & Skincare', 'Travel & Lifestyle'];

  // REAL AUTHENTIC SOCIAL VERIFICATION CHECK:
  // Account is ONLY verified if backend socialStatus confirms total_verified > 0
  // Manual handles/URLs entered during onboarding are NOT verified!
  const totalVerified = socialStatus?.total_verified || 0;
  const totalConnected = socialStatus?.total_connected || 0;
  const isVerified = Boolean(totalVerified > 0);
  const isPending = !isVerified && Boolean(totalConnected > 0);

  // Dynamic Profile Score Calculation:
  // Without verified social media connection, score cannot be 100%
  const calculateDynamicScore = (): number => {
    let score = 20; // base registered account
    if (profile?.fullName || profile?.full_name) score += 15;
    if (profile?.username) score += 10;
    if (profile?.bio) score += 10;
    if (profile?.location) score += 10;
    if (profile?.category || (profile?.niches && profile.niches.length > 0)) score += 10;
    if (isVerified) score += 25;
    else if (isPending) score += 10;
    return Math.min(score, 100);
  };
  const completionPercent = calculateDynamicScore();

  // Filtered Opportunities
  const filteredOpportunities = RECOMMENDED_BUSINESSES.filter(opp => {
    if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBiz = opp.business_name.toLowerCase().includes(q);
      const matchTitle = opp.campaign_title.toLowerCase().includes(q);
      const matchLoc = opp.location.toLowerCase().includes(q);
      if (!matchBiz && !matchTitle && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 font-sans pb-12 w-full max-w-full min-w-0 overflow-x-hidden">
      
      {/* Hidden File Input for Banner Upload (YouTube/LinkedIn feature) */}
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={handleBannerFileChange}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* ========================================================
          1. CREATOR HERO WITH CUSTOMIZABLE COVER BANNER
         ======================================================== */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-500/20 shadow-2xl p-4 sm:p-5 md:p-6 lg:p-7 space-y-5 sm:space-y-6 w-full min-w-0 group/banner">
        
        {/* Dynamic Background Banner Image (YouTube / LinkedIn Cover Feature) */}
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="Cover Banner"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover/banner:scale-[1.01]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0722] via-[#1a0c33] to-[#120622]" />
        )}

        {/* Ambient Dark Gradient Overlays for 100% Text Visibility & High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0722]/95 via-[#180a32]/90 to-[#0d0722]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080516] via-transparent to-black/50 pointer-events-none" />

        {/* Top Header Utilities: Greeting on Left | Change Banner, Search, Notifications, Avatar on Right */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-purple-300/80 tracking-wider block mb-0.5 uppercase">
              Creator Dashboard
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Hey {firstName}!</span>
              <span className="text-xl sm:text-2xl animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-neutral-400 font-medium">
              Here&apos;s your creator journey at a glance.
            </p>
          </div>

          {/* Action Utilities (Right side) - Fully responsive, no cut-off */}
          <div className="flex items-center gap-2 shrink-0">
            {/* YouTube/LinkedIn Style Upload Banner Button */}
            <button
              type="button"
              onClick={() => setShowBannerModal(true)}
              className="h-8 sm:h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105 shrink-0"
              title="Upload or change cover banner like YouTube and LinkedIn"
            >
              <Camera className="w-3.5 h-3.5 text-[#f0449b]" />
              <span className="whitespace-nowrap">Change Banner</span>
            </button>

            {/* Expandable Search Button */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="relative animate-in fade-in duration-200">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-32 sm:w-44 h-8 sm:h-9 pl-7 pr-6 rounded-full bg-black/80 border border-white/20 text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#be32ff] backdrop-blur-md"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSearchInput(true)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Search opportunities"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <Link
              href="/influencer/notifications"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors relative shrink-0"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="w-2 h-2 rounded-full bg-[#f0449b] absolute top-2 right-2 ring-2 ring-[#0d0722]" />
            </Link>

            {/* Profile Avatar Thumbnail */}
            <Link
              href="/influencer/profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
              title="View Profile"
            >
              <div className="w-full h-full rounded-full bg-[#0b0c13] overflow-hidden flex items-center justify-center">
                <img
                  src={resolveAvatarUrl(profile?.profile_image) || '/team/avatar-sejal-gupta.webp'}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const raw = profile?.profile_image;
                    if (!target.dataset.triedLocalhost && raw && raw.startsWith('/')) {
                      target.dataset.triedLocalhost = 'true';
                      target.src = `http://localhost:8000${raw}`;
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }
                  }}
                />
                <span className="text-[10px] font-bold text-white">
                  {displayName.charAt(0)}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Middle Row: Creator Profile Details & DYNAMIC VERIFICATION */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-1 min-w-0">
          {/* Avatar with Neon Glow Ring & Dynamic Badges */}
          <div className="relative shrink-0">
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-[0_0_25px_rgba(190,50,255,0.5)]">
              <div className="w-full h-full rounded-full bg-[#0b0c13] overflow-hidden">
                <img
                  src={resolveAvatarUrl(profile?.profile_image) || '/team/avatar-sejal-gupta.webp'}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const raw = profile?.profile_image;
                    if (!target.dataset.triedLocalhost && raw && raw.startsWith('/')) {
                      target.dataset.triedLocalhost = 'true';
                      target.src = `http://localhost:8000${raw}`;
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }
                  }}
                />
              </div>
            </div>

            {/* Top-Right Crown Badge: Only for verified creators */}
            {isVerified && (
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-[#f0449b] to-[#ff6baf] text-white flex items-center justify-center shadow-lg shadow-pink-500/50 ring-2 ring-[#0d0722]"
                title="Verified Creator"
              >
                <Crown className="w-3 h-3 fill-white stroke-none" />
              </div>
            )}

            {/* Bottom-Right Badge: Dynamic depending on actual verification */}
            {isVerified ? (
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 ring-2 ring-[#0d0722]"
                title="Verified Creator Profile"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : isPending ? (
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/50 ring-2 ring-[#0d0722]"
                title="Verification Pending"
              >
                <Clock className="w-3 h-3 stroke-[2.5]" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSocialModal(true)}
                className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1e1136] hover:bg-[#be32ff] border border-pink-500/40 text-pink-300 hover:text-white flex items-center justify-center shadow-lg ring-2 ring-[#0d0722] transition-colors cursor-pointer group"
                title="Unverified - Click to connect social accounts"
              >
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          {/* Identity Info */}
          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Name + Dynamic Verification Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
                {displayName}
              </h2>

              {/* Dynamic Badge Display */}
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Creator</span>
                </span>
              ) : isPending ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verification Pending</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 border border-white/20 text-neutral-300 shadow-sm backdrop-blur-sm">
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Unverified</span>
                </span>
              )}
            </div>

            {/* Handle */}
            <div className="text-xs sm:text-sm text-neutral-300 font-medium">
              @{displayUsername}
            </div>

            {/* Niches Individual Tags + Location + Connect Social */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
              {niches.map((n: string, idx: number) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-neutral-300 font-medium text-[11px] backdrop-blur-sm">
                  <Tag className="w-2.5 h-2.5 text-neutral-400" />
                  <span>{n}</span>
                </span>
              ))}

              <span className="inline-flex items-center gap-1 text-neutral-300 font-medium text-xs ml-0.5">
                <MapPin className="w-3 h-3 text-[#f0449b]" />
                <span>{displayLocation}</span>
              </span>

              {/* Connect Social Accounts Button */}
              <button
                type="button"
                onClick={() => setShowSocialModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-[11px] font-bold text-purple-200 transition-colors cursor-pointer ml-1"
                title="Manage connected social accounts"
              >
                <Sparkles className="w-3 h-3 text-[#f0449b]" />
                <span>{isVerified ? 'Connected Accounts' : 'Connect Social'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: 4 Dynamic Statistics Cards */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-2 min-w-0 w-full">
          {/* Card 1: Active Collaborations */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#140e2b]/80 backdrop-blur-md border border-white/10 hover:border-purple-500/40 transition-all flex items-center gap-2.5 sm:gap-3 shadow-lg min-w-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#26133d] border border-[#be32ff]/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#d87aff]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight truncate">
                {summary.active_collaborations || 5}
              </div>
              <p className="text-[11px] text-neutral-400 font-medium mt-1 truncate">Active Collaborations</p>
            </div>
          </div>

          {/* Card 2: Collaboration Requests */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#140e2b]/80 backdrop-blur-md border border-white/10 hover:border-purple-500/40 transition-all flex items-center gap-2.5 sm:gap-3 shadow-lg min-w-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#26133d] border border-[#be32ff]/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#d87aff]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight truncate">
                {summary.new_opportunities || 3}
              </div>
              <p className="text-[11px] text-neutral-400 font-medium mt-1 truncate">Collaboration Requests</p>
            </div>
          </div>

          {/* Card 3: Total Earnings */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#140e2b]/80 backdrop-blur-md border border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-2.5 sm:gap-3 shadow-lg min-w-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#361f18] border border-[#f59e0b]/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#fbbf24]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight truncate">
                ₹{summary.total_earnings ? summary.total_earnings.toLocaleString() : '45,000'}
              </div>
              <p className="text-[11px] text-neutral-400 font-medium mt-1 truncate">Total Earnings</p>
            </div>
          </div>

          {/* Card 4: Profile Completion (Dynamically calculated based on verified social media) */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#140e2b]/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 transition-all flex items-center gap-2.5 sm:gap-3 shadow-lg min-w-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0f2838] border border-[#06b6d4]/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#22d3ee]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight truncate">
                {completionPercent}%
              </div>
              <p className="text-[11px] text-neutral-400 font-medium mt-1 truncate">Profile Score</p>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================
          2. COLLABORATION OPPORTUNITIES (RECOMMENDED BUSINESSES)
         ======================================================== */}
      <section className="space-y-3.5 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Store className="w-5 h-5 text-[#f0449b]" />
              Recommended Businesses &amp; Opportunities
            </h2>
            <p className="text-xs text-neutral-400">
              Commercial collaboration briefs from verified local boutiques, cafes, fitness clubs and startups.
            </p>
          </div>

          <Link
            href="/influencer/opportunities"
            className="text-xs text-[#be32ff] hover:text-[#d87aff] font-bold flex items-center gap-1 self-start sm:self-auto transition-colors shrink-0"
          >
            <span>Explore All Businesses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filter Pills (SMB Categories) with hidden scrollbar */}
        <div className="w-full max-w-full overflow-x-auto pb-1 flex items-center gap-1.5 text-xs font-bold min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {SMB_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-md shadow-pink-500/20'
                  : 'bg-[#0e0f19] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Opportunity Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 min-w-0">
          {filteredOpportunities.length === 0 ? (
            <div className="col-span-full py-12 text-center space-y-2 rounded-2xl bg-[#0c0d15] border border-white/10">
              <Store className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-xs font-bold text-white">No opportunities found in this category</p>
              <p className="text-[11px] text-neutral-400">Switch category or search for other local businesses.</p>
            </div>
          ) : (
            filteredOpportunities.map((opp) => {
              const isFav = Boolean(favorites[opp.id]);
              return (
                <div
                  key={opp.id}
                  className="rounded-2xl bg-[#0d0e17] border border-white/10 hover:border-purple-500/40 transition-all p-3.5 flex flex-col justify-between group shadow-lg min-w-0"
                >
                  <div className="space-y-2.5 min-w-0">
                    {/* Top Business Row + Fav */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={opp.business_logo}
                          alt={opp.business_name}
                          className="w-7 h-7 rounded-md object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white truncate block">{opp.business_name}</span>
                          <span className="text-[10px] text-neutral-400 truncate block">{opp.category}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(opp.id)}
                        className="p-1 rounded-full text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Image Preview with Location */}
                    <div className="h-28 rounded-xl overflow-hidden bg-black/40 relative border border-white/5">
                      <img
                        src={opp.cover_image}
                        alt={opp.campaign_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#f0449b]" />
                        <span>{opp.location}</span>
                      </span>
                    </div>

                    {/* Campaign Title & Compensation */}
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {opp.campaign_title}
                      </h3>
                      <p className="text-[11px] font-black text-emerald-400">
                        {opp.compensation_range}
                      </p>
                    </div>

                    {/* Deliverables snippet */}
                    <div className="text-[10px] text-neutral-400 space-y-0.5 line-clamp-2">
                      {opp.deliverables.map((deliv, idx) => (
                        <div key={idx} className="truncate text-neutral-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#be32ff]" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button: Collaborate Now */}
                  <div className="pt-2.5 mt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleOpenPitch(opp)}
                      className="w-full h-8 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <span>Collaborate Now</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ========================================================
          3. MIDDLE SECTION: MY COLLABORATIONS & PERFORMANCE OVERVIEW
         ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
        
        {/* Left Column (7 cols): My Collaborations */}
        <div className="lg:col-span-7 space-y-3 min-w-0">
          <div className="rounded-2xl bg-[#0e0f19] border border-white/10 p-4 sm:p-5 space-y-3.5 shadow-lg min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#be32ff]" />
                  My Business Collaborations
                </h2>
                <p className="text-[11px] text-neutral-400">Active contracts &amp; deliverable milestones</p>
              </div>
              <Link
                href="/influencer/collaborations"
                className="text-xs text-[#be32ff] hover:text-[#d87aff] font-bold flex items-center gap-1 shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {/* Item 1 */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2.5 hover:bg-white/[0.04] transition-colors min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-xs font-black text-white shrink-0">
                    R
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">The Roastery &ndash; Brunch Tasting Reel</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold block truncate">In Progress &bull; Due in 3 days</span>
                  </div>
                </div>
                <Link
                  href="/influencer/chats?brand=The%20Roastery"
                  className="h-7 px-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-neutral-200 hover:text-white flex items-center gap-1 transition-colors shrink-0"
                >
                  <MessageSquare className="w-3 h-3 text-[#be32ff]" />
                  <span>Message Business</span>
                </Link>
              </div>

              {/* Item 2 */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2.5 hover:bg-white/[0.04] transition-colors min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-black text-white shrink-0">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">Anokhi Boutique &ndash; Summer Lookbook</h4>
                    <span className="text-[10px] text-amber-400 font-semibold block truncate">Pending Review &bull; Submitted</span>
                  </div>
                </div>
                <Link
                  href="/influencer/chats?brand=Anokhi"
                  className="h-7 px-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-neutral-200 hover:text-white flex items-center gap-1 transition-colors shrink-0"
                >
                  <MessageSquare className="w-3 h-3 text-[#be32ff]" />
                  <span>Message Business</span>
                </Link>
              </div>

              {/* Item 3 */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2.5 hover:bg-white/[0.04] transition-colors min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-black text-white shrink-0">
                    O
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">Ozone Fitness &ndash; Workout Reel</h4>
                    <span className="text-[10px] text-purple-400 font-semibold block truncate">Completed &bull; Payout Credited</span>
                  </div>
                </div>
                <Link
                  href="/influencer/collaborations"
                  className="h-7 px-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-neutral-300 flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Performance Overview */}
        <div className="lg:col-span-5 space-y-3 min-w-0">
          <div className="rounded-2xl bg-[#0e0f19] border border-white/10 p-4 sm:p-5 space-y-3.5 shadow-lg min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#f0449b]" />
                  Performance Overview
                </h2>
                <p className="text-[11px] text-neutral-400">Audience reach &amp; engagement</p>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-bold shrink-0">
                {(['7d', '30d', '90d'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAnalyticsRange(tab)}
                    className={`px-2 py-0.5 rounded-md transition-colors ${analyticsRange === tab ? 'bg-[#be32ff] text-white' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-0">
                <span className="text-[10px] text-neutral-400 font-medium truncate block">Total Reach</span>
                <p className="text-base sm:text-lg font-black text-white truncate">85.4K</p>
                <span className="text-[9px] text-emerald-400 font-semibold block">+14.2%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-0">
                <span className="text-[10px] text-neutral-400 font-medium truncate block">Avg. Engagement</span>
                <p className="text-base sm:text-lg font-black text-[#f0449b] truncate">4.82%</p>
                <span className="text-[9px] text-neutral-400 block">Industry: 2.1%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-0">
                <span className="text-[10px] text-neutral-400 font-medium truncate block">Followers</span>
                <p className="text-base sm:text-lg font-black text-white truncate">42.8K</p>
                <span className="text-[9px] text-emerald-400 font-semibold block">+340 this week</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-0">
                <span className="text-[10px] text-neutral-400 font-medium truncate block">Profile Views</span>
                <p className="text-base sm:text-lg font-black text-[#be32ff] truncate">1,420</p>
                <span className="text-[9px] text-neutral-400 block">By 48 businesses</span>
              </div>
            </div>

            {/* Visual Trend Bars */}
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                <span>Engagement Momentum</span>
                <span className="text-white font-bold">Active</span>
              </div>
              <div className="flex items-end gap-1.5 h-9 pt-1">
                {[45, 65, 55, 80, 70, 95, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/5 rounded-t-sm h-full flex items-end overflow-hidden">
                    <div 
                      className="w-full bg-gradient-to-t from-[#be32ff] to-[#f0449b] rounded-t-sm transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================
          4. RECENT ACTIVITY & QUICK ACTIONS
         ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
        
        {/* Left Column (7 cols): Recent Activity Feed */}
        <div className="lg:col-span-7 min-w-0">
          <div className="rounded-2xl bg-[#0e0f19] border border-white/10 p-4 sm:p-5 space-y-3 shadow-lg min-w-0">
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#fc9a5d]" />
              Recent Activity
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#f0449b] shrink-0" />
                  <span className="text-neutral-200 truncate">New collaboration request from <strong className="text-white">The Roastery Coffee House</strong></span>
                </div>
                <span className="text-[10px] text-neutral-500 shrink-0">1h ago</span>
              </div>

              <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 text-[#be32ff] shrink-0" />
                  <span className="text-neutral-200 truncate">New message from <strong className="text-white">Anokhi Boutique</strong></span>
                </div>
                <span className="text-[10px] text-neutral-500 shrink-0">3h ago</span>
              </div>

              <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-neutral-200 truncate">Deliverables approved by <strong className="text-white">Ozone Fitness Club</strong></span>
                </div>
                <span className="text-[10px] text-neutral-500 shrink-0">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Quick Actions */}
        <div className="lg:col-span-5 min-w-0">
          <div className="rounded-2xl bg-[#0e0f19] border border-white/10 p-4 sm:p-5 space-y-3 shadow-lg min-w-0">
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/influencer/opportunities"
                className="p-3 rounded-xl bg-[#11121d] hover:bg-white/[0.05] border border-white/10 text-xs font-bold text-white flex items-center gap-2 transition-all group min-w-0"
              >
                <Send className="w-3.5 h-3.5 text-[#f0449b] group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">Explore Businesses</span>
              </Link>

              <Link
                href="/influencer/chats"
                className="p-3 rounded-xl bg-[#11121d] hover:bg-white/[0.05] border border-white/10 text-xs font-bold text-white flex items-center justify-between transition-all group min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 text-[#be32ff] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">Open Chats</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#f0449b] text-white shrink-0">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/influencer/portfolio"
                className="p-3 rounded-xl bg-[#11121d] hover:bg-white/[0.05] border border-white/10 text-xs font-bold text-white flex items-center gap-2 transition-all group min-w-0"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">Update Portfolio</span>
              </Link>

              <Link
                href="/influencer/ai-studio"
                className="p-3 rounded-xl bg-gradient-to-r from-[#be32ff]/20 to-[#f0449b]/20 hover:from-[#be32ff]/30 hover:to-[#f0449b]/30 border border-[#be32ff]/40 text-xs font-bold text-white flex items-center gap-2 transition-all group min-w-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fc9a5d] group-hover:rotate-12 transition-transform shrink-0" />
                <span className="truncate">Create with AI</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================
          5. MODAL: YOUTUBE / LINKEDIN STYLE BANNER UPLOAD & PRESETS
         ======================================================== */}
      <Dialog open={showBannerModal} onOpenChange={() => setShowBannerModal(false)}>
        <DialogContent className="sm:max-w-lg bg-[#0e0f19] border border-white/15 text-white rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base sm:text-lg font-black flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#f0449b]" />
              Customize Creator Cover Banner
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Upload a wide banner image from your device like on YouTube and LinkedIn, or choose from curated creator presets.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-3">
            {/* Upload from Device Dropzone */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">
                Upload from Your Computer or Phone
              </label>
              <button
                type="button"
                onClick={() => bannerFileInputRef.current?.click()}
                disabled={uploadingBanner}
                className="w-full py-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-500/50 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-[#be32ff] group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    Click to select an image file
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG, or WebP (Recommended: 1400×400px)</p>
                </div>
              </button>
            </div>

            {/* Preset Options */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">
                Or Select a Curated Creator Preset
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {BANNER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPresetBanner(preset.url)}
                    className="relative h-18 rounded-xl overflow-hidden border border-white/10 hover:border-[#be32ff] group cursor-pointer text-left transition-all"
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white truncate">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset / Remove Banner */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetBanner}
                className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Reset to Default
              </button>
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="h-8 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          6. MODALS: SOCIAL CONNECTION & PROPOSAL
         ======================================================== */}
      <InfluencerSocialConnectionModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        userId={userId}
        onRefreshProfile={loadProfileAndSummary}
      />

      {/* Collaboration Pitch Proposal Modal */}
      {selectedOpp && (
        <Dialog open={showPitchModal} onOpenChange={() => setShowPitchModal(false)}>
          <DialogContent className="sm:max-w-md bg-[#0e0f19] border border-white/10 text-white rounded-2xl p-6">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base sm:text-lg font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f0449b]" />
                Collaborate with {selectedOpp.business_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                {selectedOpp.campaign_title} &bull; Expected: {selectedOpp.compensation_range}
              </DialogDescription>
            </DialogHeader>

            {pitchSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-sm font-bold text-white">Proposal Submitted!</h3>
                <p className="text-xs text-neutral-400">
                  Opening your chat thread with {selectedOpp.business_name}...
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {pitchError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{pitchError}</span>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Your Proposed Compensation (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value ? Number(e.target.value) : '')}
                    className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    placeholder="Enter amount in ₹"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Recommended range: {selectedOpp.compensation_range}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Your Creative Concept &amp; Pitch
                  </label>
                  <textarea
                    rows={4}
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#be32ff] resize-none"
                    placeholder="Describe your shooting concept, hook idea, and why your audience is the perfect match..."
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] space-y-1">
                  <span className="text-neutral-400 font-semibold block">Required Deliverables:</span>
                  {selectedOpp.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-neutral-300">
                      <Check className="w-3 h-3 text-[#be32ff]" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitPitch}
                  disabled={submittingPitch || !pitchMessage.trim()}
                  className="w-full h-10 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingPitch ? 'Sending Proposal...' : 'Send Proposal & Message Business'}</span>
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
