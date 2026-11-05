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
  Check,
  MapPin,
  Store,
  Coffee,
  ShoppingBag,
  Scissors,
  Dumbbell,
  Plane,
  GraduationCap,
  Home as HomeIcon,
  Rocket
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { chatService } from '@/services/chat.service';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';

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

export const BUSINESS_OPPORTUNITIES: BusinessOpportunity[] = [
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
    deliverables: ['1 High-energy Training Reel showcasing personal coaching and spa facilities', '1 Story Q&A'],
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
  },
  {
    id: 'opp-jaipur-pottery',
    business_name: 'Jaipur Blue Pottery & Decor Studio',
    business_logo: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80',
    campaign_title: 'Handmade Ceramic Decor & Studio Workshop',
    cover_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    category: 'Home and Lifestyle',
    location: 'Mansarovar, Jaipur',
    distance: '6.2 km away',
    format: 'Studio Reel',
    compensation_range: '₹14,000 – ₹22,000',
    budget_num: 18000,
    deliverables: ['1 Hands-on Pottery Wheel Experience Video', '1 Carousel highlighting dining tableware'],
    slots_left: 5,
    deadline: 'In 8 days',
    description: 'Collaborate with authentic artisanal blue pottery creators to showcase sustainable home decor craftsmanship.',
    is_verified: true,
    collaboration_type: 'Paid'
  },
  {
    id: 'opp-blue-tokai',
    business_name: 'Blue Tokai Coffee Roasters',
    business_logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&q=80',
    campaign_title: 'Cold Brew Summer Sessions & Cafe Workday',
    cover_image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80',
    category: 'Cafés and Restaurants',
    location: 'Indiranagar, Bengaluru',
    distance: 'Metro hub',
    format: 'Routine Reel',
    compensation_range: '₹15,000 – ₹24,000',
    budget_num: 19000,
    deliverables: ['1 Morning Work-from-Cafe Reel featuring specialty iced pour-overs', '2 Interactive Stories'],
    slots_left: 6,
    deadline: 'In 9 days',
    description: 'Looking for creators to film realistic, aesthetic remote-work routines centered around specialty estate coffees.',
    is_verified: true,
    collaboration_type: 'Paid'
  }
];

export const BUSINESS_CATEGORIES = [
  'All Categories',
  'Cafés and Restaurants',
  'Fashion and Boutiques',
  'Beauty and Salons',
  'Fitness and Gyms',
  'Local Shops',
  'Travel and Hospitality',
  'Education and Coaching',
  'Home and Lifestyle',
  'Startups and Other Services'
];

export default function OpportunitiesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || (user as any)?._id;

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompensation, setSelectedCompensation] = useState('All');
  const [savedOppIds, setSavedOppIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);

  // Proposal modal state
  const [selectedOpp, setSelectedOpp] = useState<BusinessOpportunity | null>(null);
  const [proposedBudget, setProposedBudget] = useState('');
  const [pitchMessage, setPitchMessage] = useState('');
  const [submittingPitch, setSubmittingPitch] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);

  useEffect(() => {
    influencerService.getMyProfile().then(res => {
      if (res?.success && res.data) setProfile(res.data);
    }).catch(() => {});
  }, []);

  const toggleSave = (id: string) => {
    setSavedOppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenPitch = (opp: BusinessOpportunity) => {
    setSelectedOpp(opp);
    setProposedBudget(opp.budget_num.toString());
    setPitchMessage(`Hi ${opp.business_name} Team! I love your campaign for "${opp.campaign_title}". My audience engages deeply with this content style and I would love to create an authentic, high-converting showcase for you.`);
    setPitchSuccess(false);
  };

  const handleSubmitPitch = async () => {
    if (!selectedOpp || submittingPitch) return;
    setSubmittingPitch(true);

    try {
      const budgetNum = parseInt(proposedBudget.replace(/[^0-9]/g, '')) || selectedOpp.budget_num;
      
      const newConvId = await chatService.connectDealToChat({
        id: selectedOpp.id,
        business_name: selectedOpp.business_name,
        business_logo: selectedOpp.business_logo,
        campaign_name: selectedOpp.campaign_title,
        budget: budgetNum,
        deliverables: selectedOpp.deliverables,
        initial_pitch: pitchMessage
      }, userId);

      setPitchSuccess(true);
      setTimeout(() => {
        setSelectedOpp(null);
        router.push(`/influencer/chats?id=${newConvId}`);
      }, 1200);
    } catch (err) {
      console.error('Failed to submit proposal:', err);
    } finally {
      setSubmittingPitch(false);
    }
  };

  // Filtered Opportunities
  const filteredOpps = BUSINESS_OPPORTUNITIES.filter(opp => {
    if (selectedCategory !== 'All Categories' && opp.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBiz = opp.business_name.toLowerCase().includes(q);
      const matchTitle = opp.campaign_title.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      const matchLoc = opp.location.toLowerCase().includes(q);
      if (!matchBiz && !matchTitle && !matchDesc && !matchLoc) return false;
    }
    if (selectedCompensation === 'under15') return opp.budget_num < 15000;
    if (selectedCompensation === '15to25') return opp.budget_num >= 15000 && opp.budget_num <= 25000;
    if (selectedCompensation === 'above25') return opp.budget_num > 25000;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
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
              Opportunities Marketplace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Discover verified commercial collaborations with small and medium-sized businesses, boutiques, and cafes.
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
              placeholder="Search by business name, campaign, city or category..."
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

          {/* Compensation Select */}
          <select
            value={selectedCompensation}
            onChange={(e) => setSelectedCompensation(e.target.value)}
            className="h-11 px-3.5 rounded-xl bg-[#0c0d15] border border-white/10 text-xs font-bold text-neutral-300 focus:outline-none focus:border-[#be32ff] cursor-pointer"
          >
            <option value="All">All Compensation</option>
            <option value="under15">Under ₹15,000</option>
            <option value="15to25">₹15,000 – ₹25,000</option>
            <option value="above25">Above ₹25,000</option>
          </select>
        </div>

        {/* Category Pills (SMB Categories) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          {BUSINESS_CATEGORIES.map(cat => (
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

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpps.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-3 rounded-2xl bg-[#0c0d15] border border-white/10">
            <Store className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Opportunities Found</h3>
            <p className="text-xs text-neutral-400">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        ) : (
          filteredOpps.map((opp) => {
            const isSaved = savedOppIds.includes(opp.id);

            return (
              <div
                key={opp.id}
                className="rounded-2xl bg-[#0d0e17] border border-white/10 hover:border-purple-500/30 transition-all p-4 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Top: Business Logo + Name + Category + Save Heart */}
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={opp.business_logo}
                        alt={opp.business_name}
                        className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-white">{opp.business_name}</span>
                          {opp.is_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 block">{opp.category}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSave(opp.id)}
                      className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Campaign Image Cover */}
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3 border border-white/5">
                    <img
                      src={opp.cover_image}
                      alt={opp.campaign_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Location Badge on cover */}
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#f0449b]" />
                      <span>{opp.location} {opp.distance ? `• ${opp.distance}` : ''}</span>
                    </span>

                    {/* Deadline Badge */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-purple-900/80 backdrop-blur-md text-[10px] font-bold text-purple-200 border border-purple-500/30">
                      {opp.deadline}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {opp.campaign_title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  {/* Deliverables snippet */}
                  <div className="pt-2 text-[10px] text-neutral-400 space-y-0.5">
                    {opp.deliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#be32ff]" />
                        <span className="truncate">{deliv}</span>
                      </div>
                    ))}
                  </div>

                  {/* Compensation Range */}
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-medium block">Expected Compensation</span>
                      <span className="text-xs font-black text-white">
                        {opp.compensation_range}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {opp.collaboration_type}
                    </span>
                  </div>
                </div>

                {/* Collaborate Now Button */}
                <div className="pt-3 mt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleOpenPitch(opp)}
                    className="w-full h-9 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Collaborate Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Collaboration Pitch Proposal Modal */}
      {selectedOpp && (
        <Dialog open={!!selectedOpp} onOpenChange={() => setSelectedOpp(null)}>
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
                <h3 className="text-sm font-bold text-white">Collaboration Proposal Sent!</h3>
                <p className="text-xs text-neutral-400">
                  Opening your chat thread with {selectedOpp.business_name}...
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {/* Proposed Compensation */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Your Proposed Compensation (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    placeholder="Enter amount in ₹"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Recommended range: {selectedOpp.compensation_range}
                  </span>
                </div>

                {/* Proposal Message */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Your Creative Concept &amp; Pitch
                  </label>
                  <textarea
                    rows={4}
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#be32ff] resize-none"
                    placeholder="Explain your creative concept, shooting plan, and why your audience matches this business..."
                  />
                </div>

                {/* Deliverables Confirmation */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] space-y-1">
                  <span className="text-neutral-400 font-semibold block">Deliverables Required:</span>
                  {selectedOpp.deliverables.map((deliv, idx) => (
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

