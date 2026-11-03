"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Search, 
  Filter, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Send, 
  X, 
  Building2, 
  Tag, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { chatService } from '@/services/chat.service';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';

interface BrandDeal {
  id: string;
  brand_name: string;
  brand_logo: string;
  campaign_title: string;
  cover_image: string;
  category: string;
  format: string;
  payout_min: number;
  payout_max: number;
  payout_range: string;
  deliverables: string[];
  slots_left: number;
  deadline: string;
  description: string;
  is_verified: boolean;
  saved?: boolean;
}

const BRAND_DEALS_CATALOG: BrandDeal[] = [
  {
    id: 'deal-myntra-fashion',
    brand_name: 'Myntra',
    brand_logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'Myntra Fashion Collab',
    cover_image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    format: 'Reels',
    payout_min: 15000,
    payout_max: 30000,
    payout_range: '₹15,000 – ₹30,000',
    deliverables: ['1 High-energy Fashion Styling Reel (45-60s)', '2 Instagram Stories with product swipe-up link'],
    slots_left: 4,
    deadline: 'In 5 days',
    description: 'Showcase 3 stylish looks from the new Myntra Summer Fest collection with engaging transitions and seasonal styling tips.',
    is_verified: true
  },
  {
    id: 'deal-nykaa-beauty',
    brand_name: 'Nykaa',
    brand_logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'Nykaa Beauty Campaign',
    cover_image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    category: 'Beauty',
    format: 'Instagram',
    payout_min: 10000,
    payout_max: 25000,
    payout_range: '₹10,000 – ₹25,000',
    deliverables: ['1 Authentic Skincare Routine Video', '3 High-resolution product showcase photos'],
    slots_left: 6,
    deadline: 'In 7 days',
    description: 'Authentic 7-day before-and-after experience using the Nykaa Glow serum with real close-up skin texture and honest feedback.',
    is_verified: true
  },
  {
    id: 'deal-zara-lifestyle',
    brand_name: 'ZARA',
    brand_logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'ZARA Lifestyle Campaign',
    cover_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    category: 'Lifestyle',
    format: 'Content',
    payout_min: 20000,
    payout_max: 40000,
    payout_range: '₹20,000 – ₹40,000',
    deliverables: ['1 Cinematic Aesthetic Reel', '1 Carousel Post (5 slides) featuring the Autumn capsule'],
    slots_left: 2,
    deadline: 'In 3 days',
    description: 'Clean, European street-style aesthetic capturing the ZARA Monochrome autumn collection in vibrant urban locations.',
    is_verified: true
  },
  {
    id: 'deal-puma-fitness',
    brand_name: 'PUMA',
    brand_logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'Puma Nitro Running Collab',
    cover_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    category: 'Fitness',
    format: 'Reels',
    payout_min: 25000,
    payout_max: 45000,
    payout_range: '₹25,000 – ₹45,000',
    deliverables: ['1 High-intensity workout / running reel with shoe feature', '1 Story Q&A session'],
    slots_left: 5,
    deadline: 'In 10 days',
    description: 'Runners and fitness enthusiasts testing Puma Nitro foam responsiveness during outdoor city runs or training sessions.',
    is_verified: true
  },
  {
    id: 'deal-boat-audio',
    brand_name: 'boAt',
    brand_logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'boAt Nirvana ANC Earbuds Launch',
    cover_image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    category: 'Tech',
    format: 'Reels',
    payout_min: 18000,
    payout_max: 35000,
    payout_range: '₹18,000 – ₹35,000',
    deliverables: ['1 Noise Cancellation testing reel in noisy surroundings', '2 Stories with coupon link'],
    slots_left: 8,
    deadline: 'In 8 days',
    description: 'Fun, relatable creators demonstrating active noise cancellation in bustling cafes, trains, or noisy gyms.',
    is_verified: true
  },
  {
    id: 'deal-hm-sustainability',
    brand_name: 'H&M',
    brand_logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'H&M Conscious Denim Fest',
    cover_image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    format: 'Content',
    payout_min: 20000,
    payout_max: 32000,
    payout_range: '₹20,000 – ₹32,000',
    deliverables: ['1 Denim styling lookbook reel', '3 Feed photo posts'],
    slots_left: 3,
    deadline: 'In 4 days',
    description: 'Promote eco-conscious recycled denim styling with creative everyday wear outfit combinations.',
    is_verified: true
  }
];

const CATEGORIES = ['All', 'Fashion', 'Beauty', 'Lifestyle', 'Fitness', 'Tech'];

export default function BrandDealsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || (user as any)?._id;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [savedDealIds, setSavedDealIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);

  // Pitch Modal State
  const [pitchDeal, setPitchDeal] = useState<BrandDeal | null>(null);
  const [proposedBudget, setProposedBudget] = useState('');
  const [pitchMessage, setPitchMessage] = useState('');
  const [submittingPitch, setSubmittingPitch] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);

  useEffect(() => {
    influencerService.getMyProfile().then(res => {
      if (res?.success && res.data) setProfile(res.data);
    }).catch(() => {});
  }, []);

  const toggleSave = (dealId: string) => {
    setSavedDealIds(prev => 
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const handleOpenPitch = (deal: BrandDeal) => {
    setPitchDeal(deal);
    setProposedBudget(deal.payout_min.toString());
    setPitchMessage(`Hi ${deal.brand_name} Team! I love your campaign for "${deal.campaign_title}". My audience engages deeply with this content style and I would love to create an authentic, high-converting showcase for you.`);
    setPitchSuccess(false);
  };

  const handleSubmitPitch = async () => {
    if (!pitchDeal || submittingPitch) return;
    setSubmittingPitch(true);

    try {
      const budgetNum = parseInt(proposedBudget.replace(/[^0-9]/g, '')) || pitchDeal.payout_min;
      
      // Connect pitch directly to Chat Service!
      const newConvId = await chatService.connectDealToChat({
        id: pitchDeal.id,
        business_name: pitchDeal.brand_name,
        business_logo: pitchDeal.brand_logo,
        campaign_name: pitchDeal.campaign_title,
        budget: budgetNum,
        deliverables: pitchDeal.deliverables,
        initial_pitch: pitchMessage
      }, userId);

      setPitchSuccess(true);
      setTimeout(() => {
        setPitchDeal(null);
        router.push(`/influencer/chats?id=${newConvId}`);
      }, 1200);
    } catch (err) {
      console.error('Failed to submit pitch:', err);
    } finally {
      setSubmittingPitch(false);
    }
  };

  // Filtered Deals
  const filteredDeals = BRAND_DEALS_CATALOG.filter(deal => {
    if (selectedCategory !== 'All' && deal.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBrand = deal.brand_name.toLowerCase().includes(q);
      const matchTitle = deal.campaign_title.toLowerCase().includes(q);
      const matchDesc = deal.description.toLowerCase().includes(q);
      if (!matchBrand && !matchTitle && !matchDesc) return false;
    }
    if (selectedBudget === 'under20') return deal.payout_max < 20000;
    if (selectedBudget === '20to35') return deal.payout_max >= 20000 && deal.payout_min <= 35000;
    if (selectedBudget === 'above35') return deal.payout_max > 35000;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/influencer"
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#f0449b]" />
              Brand Deals Marketplace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Browse verified commercial sponsorships, submit creative proposals, and get hired directly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/influencer/collaborations"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
          >
            My Collaborations
          </Link>
          <Link
            href="/influencer/chats"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-90 transition-opacity"
          >
            Open Chats
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, campaign, or niche..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0c0d15] border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#be32ff] transition-colors"
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

          {/* Budget Select */}
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="h-11 px-3.5 rounded-xl bg-[#0c0d15] border border-white/10 text-xs font-bold text-neutral-300 focus:outline-none focus:border-[#be32ff] cursor-pointer"
          >
            <option value="All">All Payout Ranges</option>
            <option value="under20">Under ₹20,000</option>
            <option value="20to35">₹20,000 – ₹35,000</option>
            <option value="above35">Above ₹35,000</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-md shadow-pink-500/20'
                  : 'bg-[#0e0f19] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDeals.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-3 rounded-2xl bg-[#0c0d15] border border-white/10">
            <Briefcase className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Brand Deals Found</h3>
            <p className="text-xs text-neutral-400">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        ) : (
          filteredDeals.map((deal) => {
            const isSaved = savedDealIds.includes(deal.id);

            return (
              <div
                key={deal.id}
                className="rounded-2xl bg-[#0d0e17] border border-white/10 hover:border-purple-500/30 transition-all p-3.5 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Top: Brand Logo + Verified + Save Heart */}
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={deal.brand_logo}
                        alt={deal.brand_name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-white">{deal.brand_name}</span>
                          {deal.is_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500">{deal.slots_left} slots left</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSave(deal.id)}
                      className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save deal'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Campaign Image Cover */}
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3 border border-white/5">
                    <img
                      src={deal.cover_image}
                      alt={deal.campaign_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Badge on cover */}
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                      {deal.deadline}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {deal.campaign_title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-semibold text-neutral-300 border border-white/10">
                      {deal.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-semibold text-neutral-300 border border-white/10">
                      {deal.format}
                    </span>
                  </div>

                  {/* Deliverables snippet */}
                  <div className="pt-2 text-[10px] text-neutral-400 space-y-0.5">
                    {deal.deliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-neutral-300">
                        <span className="w-1 h-1 rounded-full bg-[#be32ff]" />
                        <span className="truncate">{deliv}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payout */}
                  <div className="pt-3">
                    <span className="text-xs font-black text-white">
                      {deal.payout_range}
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-3 mt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleOpenPitch(deal)}
                    className="w-full h-9 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pitch Proposal Modal */}
      {pitchDeal && (
        <Dialog open={!!pitchDeal} onOpenChange={() => setPitchDeal(null)}>
          <DialogContent className="sm:max-w-md bg-[#0e0f19] border border-white/10 text-white rounded-2xl p-6">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base sm:text-lg font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f0449b]" />
                Apply to {pitchDeal.brand_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                {pitchDeal.campaign_title} &bull; Budget: {pitchDeal.payout_range}
              </DialogDescription>
            </DialogHeader>

            {pitchSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-sm font-bold text-white">Pitch Proposal Sent!</h3>
                <p className="text-xs text-neutral-400">
                  Opening your chat thread with {pitchDeal.brand_name}...
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {/* Proposed Budget */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Your Proposed Fee (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    placeholder="Enter amount in ₹"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Recommended range: {pitchDeal.payout_range}
                  </span>
                </div>

                {/* Pitch Message */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Pitch &amp; Creative Concept
                  </label>
                  <textarea
                    rows={4}
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#be32ff] resize-none"
                    placeholder="Describe your hook, angle, and why your audience is the perfect match..."
                  />
                </div>

                {/* Deliverables Confirmation */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] space-y-1">
                  <span className="text-neutral-400 font-semibold block">Required Deliverables:</span>
                  {pitchDeal.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-neutral-300">
                      <Check className="w-3 h-3 text-[#be32ff]" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleSubmitPitch}
                  disabled={submittingPitch || !pitchMessage.trim()}
                  className="w-full h-10 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingPitch ? 'Submitting Proposal...' : 'Submit Pitch & Start Chat'}</span>
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

