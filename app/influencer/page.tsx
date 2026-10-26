"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  Search, 
  Filter, 
  RefreshCw, 
  SlidersHorizontal,
  ExternalLink,
  Send,
  Building2,
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
  Eye
} from 'lucide-react';

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Youtube = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import marketplaceService, { HiringRequest } from '@/services/marketplace.service';
import influencerService, { 
  InfluencerProfile, 
  DashboardSummary, 
  OpportunityItem, 
  OpportunityFilters 
} from '@/services/influencer.service';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencerDashboard() {
  const { user } = useAuth();
  
  // Data States
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary>({
    available_opportunities: 0,
    new_opportunities: 0,
    active_collaborations: 0,
    completed_collaborations: 0,
    total_earnings: 0
  });
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [directHiringRequests, setDirectHiringRequests] = useState<HiringRequest[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, total_pages: 1 });
  
  // UI States
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Modal / Detail States
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pitchMessage, setPitchMessage] = useState('');
  const [proposedBudget, setProposedBudget] = useState<number | ''>('');
  const [submittingPitch, setSubmittingPitch] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);
  const [pitchError, setPitchError] = useState<string | null>(null);

  // Load Profile and Summary
  const loadProfileAndSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const [profileRes, summaryRes] = await Promise.allSettled([
        influencerService.getMyProfile(),
        influencerService.getDashboardSummary()
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.success) {
        setProfile(profileRes.value.data);
      }
      if (summaryRes.status === 'fulfilled' && summaryRes.value?.success) {
        setSummary(summaryRes.value.data);
      }
      try {
        const hiringRes = await marketplaceService.getMyHiringRequests();
        if (hiringRes?.success && Array.isArray(hiringRes.data)) {
          setDirectHiringRequests(hiringRes.data);
        }
      } catch {
        // Fallback
      }
    } catch (err: any) {
      console.error('Failed to load profile or summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Load Opportunities
  const loadOpportunities = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const filters: OpportunityFilters = {
        page,
        limit: 6,
        search: searchQuery.trim() || undefined,
        niche: selectedNiche !== 'all' ? selectedNiche : undefined,
        platform: selectedPlatform !== 'all' ? selectedPlatform : undefined,
        collaboration_type: selectedType !== 'all' ? selectedType : undefined
      };

      const res = await influencerService.getOpportunities(filters);
      if (res.success && res.data) {
        setOpportunities(res.data.items || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } else {
        setOpportunities([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch opportunities:', err);
      setError(err?.response?.data?.detail || err.message || 'Failed to load brand opportunities.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedNiche, selectedPlatform, selectedType]);

  // Initial Load
  useEffect(() => {
    setMounted(true);
    loadProfileAndSummary();
  }, [loadProfileAndSummary]);

  useEffect(() => {
    loadOpportunities(1);
  }, [loadOpportunities]);

  // Handle Manual Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProfileAndSummary(), loadOpportunities(pagination.page)]);
    setRefreshing(false);
  };

  // Open Opportunity Details Modal
  const handleOpenDetails = (opp: OpportunityItem) => {
    setSelectedOpportunity(opp);
    setPitchMessage(`Hi ${opp.business.name}, I would love to collaborate on your "${opp.campaign.title}" campaign! My audience engages deeply with authentic creative recommendations.`);
    setProposedBudget(opp.campaign.budget || 5000);
    setPitchSuccess(false);
    setPitchError(null);
    setShowDetailModal(true);
  };

  // Submit Application
  const handleSubmitPitch = async () => {
    if (!selectedOpportunity) return;
    if (!pitchMessage.trim() || pitchMessage.trim().length < 5) {
      setPitchError('Please provide a short pitch message (at least 5 characters).');
      return;
    }

    try {
      setSubmittingPitch(true);
      setPitchError(null);
      const res = await influencerService.applyForOpportunity(selectedOpportunity.id, {
        pitch_message: pitchMessage.trim(),
        proposed_budget: typeof proposedBudget === 'number' ? proposedBudget : undefined,
        deliverables: selectedOpportunity.campaign.deliverables
      });

      if (res.success) {
        setPitchSuccess(true);
        // Update local status of this opportunity
        setOpportunities(prev => prev.map(o => o.id === selectedOpportunity.id ? { ...o, is_applied: true, application_status: 'applied' } : o));
        // Refresh summary count
        loadProfileAndSummary();
        setTimeout(() => {
          setShowDetailModal(false);
        }, 1800);
      } else {
        setPitchError(res.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setPitchError(err?.response?.data?.detail || err.message || 'Failed to submit proposal.');
    } finally {
      setSubmittingPitch(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedNiche('all');
    setSelectedPlatform('all');
    setSelectedType('all');
  };

  const displayName = mounted ? (profile?.fullName || user?.name || 'Creator') : 'Creator';
  const displayUsername = mounted ? (profile?.username || (user?.email ? `@${user.email.split('@')[0]}` : '@creator')) : '@creator';
  const completionPercent = profile?.profile_completion || 65;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ========================================================
          PART 1A: DASHBOARD HEADER WITH PROFILE & SOCIAL STATUS
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#141522] via-[#0f1019] to-[#161224] border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#be32ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fc9a5d]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Welcome Info */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] p-0.5 shadow-xl shadow-purple-500/20">
                <div className="w-full h-full rounded-[14px] bg-[#0b0c13] flex items-center justify-center overflow-hidden">
                  {profile?.profile_image ? (
                    <img src={profile.profile_image} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-tr from-[#fc9a5d] to-[#be32ff] bg-clip-text text-transparent">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-[#0b0c13]" title="Verified Active Influencer">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, <span suppressHydrationWarning className="bg-gradient-to-r from-white via-purple-100 to-[#be32ff] bg-clip-text text-transparent">{displayName}</span>! 👋
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#be32ff]/15 text-[#d87aff] border border-[#be32ff]/30">
                  Creator Partner
                </span>
              </div>
              <p suppressHydrationWarning className="text-xs sm:text-sm text-neutral-400">
                {displayUsername} &bull; <span className="text-neutral-300 font-medium">{profile?.category || 'Fashion & Lifestyle'}</span> &bull; {profile?.location || 'India'}
              </p>

              {/* Social Channels Connection Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <span className="text-[11px] text-neutral-400 font-medium">Platforms:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                  profile?.instagram_url 
                    ? "bg-pink-500/15 text-pink-300 border-pink-500/30" 
                    : "bg-white/5 text-neutral-400 border-white/10"
                }`}>
                  <Instagram className="w-3 h-3" />
                  {profile?.instagram_url ? "Instagram Connected" : "Instagram"}
                </span>

                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                  profile?.youtube_url 
                    ? "bg-red-500/15 text-red-300 border-red-500/30" 
                    : "bg-white/5 text-neutral-400 border-white/10"
                }`}>
                  <Youtube className="w-3 h-3" />
                  {profile?.youtube_url ? "YouTube Connected" : "YouTube"}
                </span>

                {profile?.follower_count ? (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {Number(profile.follower_count).toLocaleString()} Followers
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: Profile Progress & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Completion Widget */}
            <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-center min-w-[190px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-400 font-medium">Profile Score</span>
                <span className="font-bold text-white">{completionPercent}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] transition-all duration-500 rounded-full" 
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <Link 
                href="/influencer/profile"
                className="text-[10px] text-[#f0449b] hover:text-[#fc9a5d] mt-1.5 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                {completionPercent < 100 ? "Complete profile for 3x deals" : "Manage Media Kit"} &rarr;
              </Link>
            </div>

            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="h-11 px-4 rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#be32ff]" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================
          PART 1A.5: DIRECT BRAND HIRING PROPOSALS & AGREEMENTS
         ======================================================== */}
      {directHiringRequests.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-purple" />
              Direct Brand Proposals &amp; Bilateral Agreements ({directHiringRequests.length})
            </h2>
            <Link 
              href="/influencer/content" 
              className="text-xs text-[#be32ff] hover:text-[#d87aff] font-semibold flex items-center gap-1"
            >
              <span>Manage All in Content Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {directHiringRequests.slice(0, 3).map((req) => {
              const isActionNeeded = req.status === 'agreement_pending' || req.status === 'accepted' || req.status === 'pending_influencer_response';
              const isSigned = req.status === 'influencer_signed' || req.influencer_signed;

              return (
                <Card 
                  key={req.id || req.hiring_request_id}
                  className={`bg-[#0f1019] border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ${
                    isActionNeeded 
                      ? 'border-brand-purple/40 shadow-[0_0_20px_rgba(190,50,255,0.12)]' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-white/50 block font-medium">Brand Partner</span>
                        <h4 className="font-bold text-white text-sm truncate">{req.business_name}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        req.status === 'agreement_pending' || req.status === 'accepted'
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          : req.status === 'pending_influencer_response'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : req.status === 'in_progress'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-white/5 text-white/70 border-white/10'
                      }`}>
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-xs font-semibold text-white/90 line-clamp-1">{req.campaign_name}</h5>
                      <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{req.deliverables?.join(', ')}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="text-white/40">Agreed Payout:</span>
                      <span className="font-extrabold text-emerald-400">₹{req.proposed_compensation.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/5">
                    <Link href="/influencer/content" className="block">
                      <Button 
                        size="sm" 
                        className={`w-full text-xs font-semibold h-8 rounded-xl flex items-center justify-center gap-1.5 ${
                          isActionNeeded
                            ? 'bg-brand-purple hover:bg-brand-purple/90 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {req.status === 'agreement_pending' || req.status === 'accepted'
                            ? 'Review & Sign Agreement'
                            : req.status === 'pending_influencer_response'
                            ? 'Review Brand Proposal'
                            : isSigned
                            ? 'View Agreement (Signed)'
                            : 'View Collaboration'}
                        </span>
                        <ChevronRight className="w-3 h-3 ml-auto text-white/50" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          PART 1B: DASHBOARD SUMMARY CARDS (REAL DATA DERIVED)
         ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#be32ff]" />
            Performance &amp; Collaboration Metrics
          </h2>
          <span className="text-[11px] text-neutral-400">Live platform aggregation</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Total Available Opportunities */}
          <Card className="bg-[#0f1017]/90 border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Available Collabs</span>
              <div className="w-8 h-8 rounded-lg bg-[#be32ff]/15 flex items-center justify-center text-[#d87aff] group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {summaryLoading ? <span className="animate-pulse opacity-50">...</span> : summary.available_opportunities}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Brand open briefs</p>
            </div>
          </Card>

          {/* Card 2: New Opportunities (Last 7 Days) */}
          <Card className="bg-[#0f1017]/90 border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">New Opportunities</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {summaryLoading ? <span className="animate-pulse opacity-50">...</span> : summary.new_opportunities}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Added in past 7 days</p>
            </div>
          </Card>

          {/* Card 3: Active Collaborations */}
          <Card className="bg-[#0f1017]/90 border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Active Deals</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
                {summaryLoading ? <span className="animate-pulse opacity-50">...</span> : summary.active_collaborations}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Under production</p>
            </div>
          </Card>

          {/* Card 4: Completed Collaborations */}
          <Card className="bg-[#0f1017]/90 border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Completed Collabs</span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {summaryLoading ? <span className="animate-pulse opacity-50">...</span> : summary.completed_collaborations}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Delivered &amp; closed</p>
            </div>
          </Card>

          {/* Card 5: Total Earnings / Budget */}
          <Card className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#1a1426] to-[#0f1017] border border-[#be32ff]/30 shadow-[0_0_20px_rgba(190,50,255,0.1)] rounded-2xl p-4 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#d87aff]">Total Earnings</span>
              <div className="w-8 h-8 rounded-lg bg-[#be32ff]/20 flex items-center justify-center text-[#be32ff] group-hover:scale-110 transition-transform">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {summaryLoading ? <span className="animate-pulse opacity-50">...</span> : `₹${summary.total_earnings.toLocaleString()}`}
              </div>
              <p className="text-[11px] text-[#fc9a5d] mt-0.5 font-medium">Verified payout volume</p>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================
          PART 1C & 1D: BRAND OPPORTUNITIES & SEARCH / FILTERS
         ======================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#f0449b]" />
              Business &amp; Retailer Collaboration Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Live collaboration requests published by registered businesses looking for creator partnerships.
            </p>
          </div>
          <div className="text-xs text-neutral-400">
            Showing <span className="text-white font-bold">{opportunities.length}</span> of <span className="text-white font-bold">{pagination.total}</span> available deals
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0f1017]/90 border border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search brand or campaign..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl bg-black/40 border-white/10 text-xs text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#be32ff]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Niche / Category Filter */}
            <div>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full h-10 rounded-xl bg-black/40 border border-white/10 px-3 text-xs text-neutral-200 focus:outline-none focus:border-[#be32ff] cursor-pointer"
              >
                <option value="all">All Niches &amp; Categories</option>
                <option value="fashion">Fashion &amp; Apparel</option>
                <option value="beauty">Beauty &amp; Skincare</option>
                <option value="food">Food &amp; Dining</option>
                <option value="tech">Tech &amp; Electronics</option>
                <option value="fitness">Fitness &amp; Wellness</option>
                <option value="retail">Retail &amp; Shopping</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full h-10 rounded-xl bg-black/40 border border-white/10 px-3 text-xs text-neutral-200 focus:outline-none focus:border-[#be32ff] cursor-pointer"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            {/* Collab Type Filter & Reset */}
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 h-10 rounded-xl bg-black/40 border border-white/10 px-3 text-xs text-neutral-200 focus:outline-none focus:border-[#be32ff] cursor-pointer"
              >
                <option value="all">All Deal Types</option>
                <option value="paid">Paid Promotion</option>
                <option value="barter">Barter Collaboration</option>
                <option value="product promotion">Product Promotion</option>
              </select>

              {(searchQuery || selectedNiche !== 'all' || selectedPlatform !== 'all' || selectedType !== 'all') && (
                <Button
                  onClick={handleResetFilters}
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 text-xs text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            PART 1F: LOADING, ERROR, EMPTY, AND OPPORTUNITY CARDS
           ======================================================== */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#0f1017]/80 border border-white/5 p-6 animate-pulse flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10" />
                  <div className="space-y-2 flex-1">
                    <div className="w-24 h-4 bg-white/10 rounded" />
                    <div className="w-36 h-3 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-white/10 rounded" />
                  <div className="w-3/4 h-3 bg-white/5 rounded" />
                </div>
                <div className="w-full h-9 bg-white/10 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Failed to load opportunities</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">{error}</p>
            <Button
              onClick={() => loadOpportunities(pagination.page)}
              className="h-9 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
            >
              Retry Connection
            </Button>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0f1017]/60 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#be32ff]/10 text-[#be32ff] flex items-center justify-center mx-auto ring-1 ring-[#be32ff]/20">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No collaboration opportunities found</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                No active brand briefs match your current filter parameters. Try broadening your search or resetting filters.
              </p>
            </div>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((opp) => {
              const biz = opp.business;
              const camp = opp.campaign;
              const isPaid = camp.collaboration_type?.toLowerCase() === 'paid';

              return (
                <Card 
                  key={opp.id} 
                  className="bg-[#0f1017] border-white/10 hover:border-white/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden group"
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Business Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-sm text-white overflow-hidden shrink-0 shadow-inner">
                          {biz.logo ? (
                            <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="bg-gradient-to-tr from-[#fc9a5d] to-[#be32ff] bg-clip-text text-transparent">
                              {biz.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-[#fc9a5d] transition-colors">
                              {biz.name}
                            </h4>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          </div>
                          <p className="text-[11px] text-neutral-400 flex items-center gap-1 truncate">
                            <Tag className="w-3 h-3 text-[#be32ff] shrink-0" />
                            <span>{biz.category}</span>
                            &bull; 
                            <span className="truncate">{biz.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Type Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                        isPaid 
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                          : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                      }`}>
                        {camp.collaboration_type}
                      </span>
                    </div>

                    {/* Campaign Title & Description */}
                    <div className="space-y-1.5 pt-1">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-purple-200 transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    {/* Deliverables & Budget Pill */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">Compensation</span>
                        <span className="font-extrabold text-sm text-white flex items-center">
                          {camp.budget_display || 'Barter Package'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">Deliverables</span>
                        <span className="text-xs font-semibold text-neutral-300">
                          {camp.deliverables?.[0] || '1 Instagram Reel'}
                        </span>
                      </div>
                    </div>

                    {/* Platforms & Target Audience Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {camp.platforms.map((p, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-neutral-300 border border-white/5">
                          {p.toLowerCase().includes('instagram') ? <Instagram className="w-2.5 h-2.5 text-pink-400" /> : <Youtube className="w-2.5 h-2.5 text-red-400" />}
                          {p}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-400 border border-white/5">
                        Target: {camp.target_audience}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between gap-3 bg-white/[0.01]">
                    <div className="text-[11px] text-neutral-400">
                      Duration: <span className="text-neutral-300 font-medium">{camp.duration}</span>
                    </div>

                    {opp.is_applied ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" /> Proposal Sent
                      </span>
                    ) : (
                      <Button
                        onClick={() => handleOpenDetails(opp)}
                        size="sm"
                        className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-neutral-400">
            <div>
              Page <span className="text-white font-bold">{pagination.page}</span> of <span className="text-white font-bold">{pagination.total_pages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => loadOpportunities(pagination.page - 1)}
                className="h-8 px-3 rounded-lg border-white/15 bg-white/5 text-xs text-white disabled:opacity-30"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.total_pages}
                onClick={() => loadOpportunities(pagination.page + 1)}
                className="h-8 px-3 rounded-lg border-white/15 bg-white/5 text-xs text-white disabled:opacity-30"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          PART 1E: OPPORTUNITY DETAILS & COLLABORATION PROPOSAL MODAL
         ======================================================== */}
      {selectedOpportunity && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl bg-[#0f1017] border border-white/15 text-white p-6 sm:p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="space-y-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center font-bold text-white text-base shadow-lg">
                  {selectedOpportunity.business.logo ? (
                    <img src={selectedOpportunity.business.logo} alt={selectedOpportunity.business.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    selectedOpportunity.business.name.charAt(0)
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    {selectedOpportunity.campaign.title}
                  </DialogTitle>
                  <p className="text-xs text-neutral-400">
                    By <span className="text-white font-semibold">{selectedOpportunity.business.name}</span> &bull; {selectedOpportunity.business.category} &bull; {selectedOpportunity.business.location}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-3">
              {/* Brand Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">About the Brand</h4>
                <p className="text-xs text-neutral-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  {selectedOpportunity.business.description}
                </p>
              </div>

              {/* Campaign Overview */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Campaign Brief &amp; Objective</h4>
                <p className="text-xs text-neutral-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  {selectedOpportunity.campaign.description}
                </p>
              </div>

              {/* Scope & Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">Deliverables Required</span>
                  <ul className="space-y-1 text-xs text-neutral-200">
                    {selectedOpportunity.campaign.deliverables.map((deliv, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">Terms &amp; Budget</span>
                  <div className="text-lg font-extrabold text-white">
                    {selectedOpportunity.campaign.budget_display || 'Barter Collaboration'}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Timeline: {selectedOpportunity.campaign.duration} &bull; Payout upon brand sign-off
                  </p>
                </div>
              </div>

              {/* Application Pitch Section */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#fc9a5d] flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    Submit Collaboration Pitch
                  </h4>
                  {selectedOpportunity.is_applied && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Already Applied
                    </span>
                  )}
                </div>

                {pitchSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Your proposal was sent directly to {selectedOpportunity.business.name}! The business team will review your media kit.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">
                        Pitch / Collaboration Proposal
                      </label>
                      <textarea
                        rows={3}
                        value={pitchMessage}
                        onChange={(e) => setPitchMessage(e.target.value)}
                        placeholder="Explain why your content style and audience align with this brand..."
                        className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-neutral-300">
                          Proposed Budget (₹ INR)
                        </label>
                        <Input
                          type="number"
                          value={proposedBudget}
                          onChange={(e) => setProposedBudget(e.target.value ? Number(e.target.value) : '')}
                          placeholder="e.g. 5000"
                          className="h-10 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-neutral-300">
                          Influencer Handle
                        </label>
                        <Input
                          disabled
                          value={displayUsername}
                          className="h-10 rounded-xl bg-white/5 border-white/10 text-xs text-neutral-400"
                        />
                      </div>
                    </div>

                    {pitchError && (
                      <p className="text-xs text-rose-400 font-medium">{pitchError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailModal(false)}
                className="h-10 px-4 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Close
              </Button>

              {!selectedOpportunity.is_applied && !pitchSuccess && (
                <Button
                  onClick={handleSubmitPitch}
                  disabled={submittingPitch}
                  size="sm"
                  className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-500/20 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  {submittingPitch ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Proposal to Brand</span>
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
