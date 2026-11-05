"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  Share2, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Users, 
  TrendingUp, 
  Eye, 
  Heart, 
  Copy, 
  Check, 
  ExternalLink,
  Tag,
  DollarSign,
  Play
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedInIcon } from '@/components/social/SocialIcons';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';
import { creatorOnboardingService } from '@/services/creator-onboarding.service';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencerPortfolioPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    influencerService.getMyProfile().then(res => {
      if (res?.success && res.data) {
        setProfile(res.data);
      } else {
        creatorOnboardingService.loadOnboardingData(user).then((local) => {
          if (local) {
            setProfile({
              fullName: local.fullName,
              username: local.username,
              bio: local.bio,
              location: local.location,
              category: local.niches?.[0],
              follower_count: 85000,
              engagement_rate: 4.8
            } as any);
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }, [user]);

  const fullName = profile?.fullName || profile?.full_name || user?.name || 'Sejal Gupta';
  const username = profile?.username?.replace(/^@/, '') || 'khushi.digilyf';
  const bio = profile?.bio || 'Fashion, lifestyle & beauty creator based in Jaipur. Creating authentic aesthetic lookbooks, styling edits, and honest skincare routines.';
  const location = profile?.location || 'Jaipur, India';
  const niches = profile?.category ? [profile.category, 'Lifestyle', 'Beauty'] : ['Fashion', 'Lifestyle', 'Beauty'];

  const stats = [
    { label: 'Followers', value: '85.4K', change: '+12% this month', icon: Users, color: 'text-purple-400' },
    { label: 'Avg Engagement', value: '4.82%', change: '2.3x platform avg', icon: TrendingUp, color: 'text-pink-400' },
    { label: 'Monthly Reach', value: '320K', change: '84% organic', icon: Eye, color: 'text-orange-400' },
    { label: 'Completed Deals', value: '28', change: '100% 5-star rating', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  const contentShowcase = [
    {
      id: '1',
      title: 'Summer Linen Styling Edit',
      brand: 'Zara Lifestyle',
      type: 'Instagram Reel',
      views: '124K',
      likes: '14.2K',
      thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      category: 'Fashion',
      deliverables: '1 Reel + 3 Stories',
      compensation: '₹28,000'
    },
    {
      id: '2',
      title: 'Glass Skin Morning Routine',
      brand: 'Nykaa Beauty',
      type: 'Dedicated Reel',
      views: '98K',
      likes: '11.8K',
      thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      category: 'Beauty',
      deliverables: '1 Video + Product Link',
      compensation: '₹22,000'
    },
    {
      id: '3',
      title: 'Festive Kurti Collection Unboxing',
      brand: 'Myntra Fashion',
      type: 'Carousel Post',
      views: '76K',
      likes: '8.4K',
      thumbnail: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
      category: 'Fashion',
      deliverables: '1 Carousel + 2 Stories',
      compensation: '₹25,000'
    },
    {
      id: '4',
      title: 'Artisan Cold Brew Tasting & Ambience',
      brand: 'The Roastery Coffee House',
      type: 'Experience Reel',
      views: '64K',
      likes: '7.1K',
      thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      category: 'Cafes & Dining',
      deliverables: '1 Ambience Reel',
      compensation: '₹16,000'
    },
    {
      id: '5',
      title: 'Pre-Workout Routine & Form Guide',
      brand: 'Ozone Fitness Club',
      type: 'Workout Vlog',
      views: '88K',
      likes: '9.6K',
      thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      category: 'Fitness',
      deliverables: '1 Workout Reel',
      compensation: '₹20,000'
    },
    {
      id: '6',
      title: 'Handcrafted Silver Jewellery Lookbook',
      brand: 'Jaipur Heritage Gems',
      type: 'Photo Gallery',
      views: '52K',
      likes: '6.3K',
      thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
      category: 'Jewellery',
      deliverables: '4 Hi-Res Photos',
      compensation: '₹18,000'
    }
  ];

  const packages = [
    {
      name: 'Essential Reel',
      price: '₹15,000',
      duration: '3–5 days delivery',
      deliverables: [
        '1 60s Aesthetic Reel with trending audio',
        '2 Instagram Stories with direct link',
        'Raw video footage provided',
        '1 revision included'
      ],
      popular: false
    },
    {
      name: 'Full Campaign Bundle',
      price: '₹35,000',
      duration: '5–7 days delivery',
      deliverables: [
        '2 High-production Reels / TikToks',
        '1 High-res 5-photo Carousel',
        '4 Strategic Stories with CTA sticker',
        '30-day paid usage rights included',
        '2 revisions included'
      ],
      popular: true
    },
    {
      name: 'Brand Ambassadorship',
      price: '₹85,000 / mo',
      duration: '3 months minimum',
      deliverables: [
        '4 Reels per month',
        '8 Stories with link stickers per month',
        'Bio link mention',
        'Full digital ad usage rights',
        'Exclusive category lock'
      ],
      popular: false
    }
  ];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans pb-16">
      
      {/* Top Breadcrumb & Share Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/influencer"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="h-8 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Media Kit Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Media Kit Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#120726] via-[#0d091f] to-[#070514] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#be32ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f0449b]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar with Glow */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-xl shadow-purple-500/30 shrink-0">
            <div className="w-full h-full rounded-full bg-[#0b0c13] overflow-hidden">
              <img
                src={profile?.profile_image || '/team/avatar-sejal-gupta.webp'}
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
          </div>

          {/* Identity & Bio */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#be32ff]/20 border border-[#be32ff]/40 text-[#d87aff]">
                Media Kit 2026
              </span>
            </div>

            <p className="text-sm text-neutral-300 font-medium">
              @{username}
            </p>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {bio}
            </p>

            {/* Tags & Meta */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              {niches.map((n, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-[#f0449b]" />
                  <span>{n}</span>
                </span>
              ))}

              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#be32ff]" />
                <span>{location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{s.label}</span>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {s.value}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  {s.change}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Collaboration Portfolio */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#f0449b]" />
              Featured Campaign Deliverables
            </h2>
            <p className="text-xs text-neutral-400">
              High-performing verified brand collaborations with real engagement metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentShowcase.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0e0f19] border border-white/10 hover:border-purple-500/40 p-4 space-y-3 transition-all group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Media Image */}
                <div className="h-44 rounded-xl overflow-hidden relative border border-white/5 bg-black/40">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                    {item.type}
                  </span>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold text-white">
                    <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      <Eye className="w-3 h-3 text-[#be32ff]" />
                      <span>{item.views}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>{item.likes}</span>
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <span className="text-[10px] font-bold text-[#f0449b] uppercase tracking-wider block">
                    {item.brand}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {item.deliverables} &bull; {item.compensation}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">Category: {item.category}</span>
                <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Deal
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing & Commercial Packages */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Standard Collaboration Rates
          </h2>
          <p className="text-xs text-neutral-400">
            Transparent starting package rates for small and medium businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all relative ${
                pkg.popular
                  ? 'bg-gradient-to-b from-[#1c0f33] to-[#0e091d] border-2 border-[#be32ff] shadow-xl shadow-purple-500/20'
                  : 'bg-[#0e0f19] border border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-[10px] font-black text-white uppercase tracking-wider shadow">
                  Most Popular
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{pkg.duration}</p>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-white">
                  {pkg.price}
                </div>

                <ul className="space-y-2 pt-2 border-t border-white/10 text-xs text-neutral-300">
                  {pkg.deliverables.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#be32ff] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/influencer/opportunities"
                className={`w-full h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                }`}
              >
                Inquire Package
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

