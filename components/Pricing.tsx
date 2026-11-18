"use client";

import React, { useState } from 'react';
import { Sparkles, Gift, Check } from 'lucide-react';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export interface PlanPricing {
  price: number;
  originalPrice?: number;
  period: string;
  gstText: string;
  billedText?: string;
}

export interface PlanItem {
  id: string;
  planBadge: string;
  name: string;
  tagline: string;
  creditBadge: string;
  description: string;
  popular: boolean;
  pricing: Record<BillingCycle, PlanPricing>;
  highlights: string[];
  allFeatures: string[];
  ctaText: string;
}

export const LANDING_PLANS: PlanItem[] = [
  {
    id: "FREE",
    planBadge: "FREE",
    name: "Free",
    tagline: "Explore AI",
    creditBadge: "50 Credits · one time",
    description: "For students, beginners and first-time users.",
    popular: false,
    pricing: {
      monthly: {
        price: 0,
        period: "/mo",
        gstText: "No GST shown"
      },
      quarterly: {
        price: 0,
        period: "/qtr",
        gstText: "No GST shown"
      },
      yearly: {
        price: 0,
        period: "/yr",
        gstText: "No GST shown"
      }
    },
    highlights: [
      "5 AI social media posts/month",
      "1 AI reel/month",
      "50 AI credits (one time)"
    ],
    allFeatures: [
      "Basic AI Caption & Post Generator",
      "1 AI Reel creation per month",
      "50 one-time AI Credits",
      "1 Connected Social Media Account",
      "Standard Community Support"
    ],
    ctaText: "Get Started Free"
  },
  {
    id: "PRO_STARTER",
    planBadge: "PLAN 1",
    name: "Pro",
    tagline: "Create",
    creditBadge: "300 monthly + 50 signup bonus",
    description: "AI creation, marketing, publishing and business tools.",
    popular: false,
    pricing: {
      monthly: {
        price: 799,
        period: "/month",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 2157,
        originalPrice: 2397,
        period: "/quarter",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹240 (10% off)"
      },
      yearly: {
        price: 7670,
        originalPrice: 9588,
        period: "/year",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹1,918 (20% off)"
      }
    },
    highlights: [
      "300 monthly credits",
      "50 signup bonus credits (one time)",
      "AI creation, marketing and publishing tools"
    ],
    allFeatures: [
      "AI Post Maker, Image Generator and Content + Image",
      "AI Photoshoot, Reel Maker, Avatar, Actor and Photobooth",
      "AI Advertisement Maker and Marketing Agent",
      "Social Media Calendar and Indian Festival Engine",
      "Instagram DM AI and AI Review Manager",
      "AI Website Builder",
      "50 signup bonus credits on first paid subscription"
    ],
    ctaText: "Choose Pro"
  },
  {
    id: "PRO_PLUS",
    planBadge: "PLAN 2",
    name: "Pro Plus",
    tagline: "Market",
    creditBadge: "1,500 monthly + 50 signup bonus",
    description: "Everything in Pro, plus advanced intelligence and business tools.",
    popular: true,
    pricing: {
      monthly: {
        price: 2999,
        period: "/month",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 8097,
        originalPrice: 8997,
        period: "/quarter",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹900 (10% off)"
      },
      yearly: {
        price: 28790,
        originalPrice: 35988,
        period: "/year",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹7,198 (20% off)"
      }
    },
    highlights: [
      "1,500 monthly credits",
      "50 signup bonus credits (one time)",
      "Business analytics, CRM and AI intelligence"
    ],
    allFeatures: [
      "Everything included in Pro",
      "Business Analytics, Leads CRM and Product Catalogue",
      "AI Brand Brain and UGC AI",
      "1,500 monthly credits",
      "50 signup bonus credits on first paid subscription"
    ],
    ctaText: "Choose Pro Plus"
  },
  {
    id: "BUSINESS",
    planBadge: "PLAN 3",
    name: "Business",
    tagline: "Automate",
    creditBadge: "2,500 monthly + 50 signup bonus",
    description: "Everything in Pro Plus, with the complete business service suite.",
    popular: false,
    pricing: {
      monthly: {
        price: 4999,
        period: "/month",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 13497,
        originalPrice: 14997,
        period: "/quarter",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹1,500 (10% off)"
      },
      yearly: {
        price: 47990,
        originalPrice: 59988,
        period: "/year",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹11,998 (20% off)"
      }
    },
    highlights: [
      "2,500 monthly credits",
      "50 signup bonus credits (one time)",
      "Complete AI creation and business intelligence suite"
    ],
    allFeatures: [
      "Everything included in Pro Plus",
      "Business Analytics, Leads CRM and Product Catalogue",
      "AI Brand Brain and UGC AI",
      "2,500 monthly credits",
      "50 signup bonus credits on first paid subscription"
    ],
    ctaText: "Choose Business"
  },
  {
    id: "BUSINESS_PREMIUM",
    planBadge: "PLAN 4",
    name: "Business Premium",
    tagline: "Premium",
    creditBadge: "5,000 monthly + 50 signup bonus",
    description: "Everything in Business, plus premium services and company brand kit.",
    popular: false,
    pricing: {
      monthly: {
        price: 9999,
        period: "/month",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 26997,
        originalPrice: 29997,
        period: "/quarter",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹3,000 (10% off)"
      },
      yearly: {
        price: 95990,
        originalPrice: 119988,
        period: "/year",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹23,998 (20% off)"
      }
    },
    highlights: [
      "5,000 monthly credits",
      "50 signup bonus credits (one time)",
      "Premium services and company brand kit"
    ],
    allFeatures: [
      "Everything included in Business",
      "Premium Influencer Marketing and Customer Support",
      "Physical Training Provider and 24/7 Website Technical Support",
      "Company Logo, Visiting Cards, Employee ID Cards, Company Letterhead and Stamp",
      "5,000 monthly credits",
      "50 signup bonus credits on first paid subscription"
    ],
    ctaText: "Choose Business Premium"
  },
];

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>("PRO_PLUS");

  const activePlan = LANDING_PLANS.find((p) => p.id === selectedPlanId) || LANDING_PLANS[2];
  const monthlyPricing = activePlan.pricing.monthly;
  const quarterlyPricing = activePlan.pricing.quarterly;
  const yearlyPricing = activePlan.pricing.yearly;
  const currentPricing = activePlan.pricing[billingCycle];

  return (
    <section id="pricing" className="w-full max-w-full pt-10 sm:pt-14 pb-14 sm:pb-20 relative bg-white overflow-hidden border-t border-slate-100 scroll-mt-24">
      {/* Soft ambient background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-100/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-100/30 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center w-full mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-pink-200/90 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#f0449b] shrink-0" />
            <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] tracking-wide">
              Simple, Transparent Pricing
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2.5">
            Predictable Pricing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">Zero Surprises</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
            Choose the plan that fits your business stage. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Plan Selector Tabs with Signature Brand Gradient */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6">
            {LANDING_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-md shadow-pink-500/25'
                      : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span>{plan.name}</span>
                  {plan.popular && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-pink-100 text-[#f0449b]'
                    }`}>
                      Popular
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= MODERN EXPANDED PRICING CARD WITH DHANDAGROW SIGNATURE GRADIENT ================= */}
        <div className="p-[2.5px] rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-[0_20px_60px_-15px_rgba(240,68,155,0.25)] relative w-full max-w-5xl xl:max-w-6xl mx-auto transition-all duration-300">
          <div className="w-full bg-white rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 md:p-12">

            {/* Plan Header Info (Matching Image 2 & 3: Plan Badge, Credit Badge, Title & Tagline) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
                    {activePlan.planBadge}
                  </span>
                  {activePlan.popular && (
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] text-white shadow-2xs">
                      Most Popular
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {activePlan.name}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-slate-500 mt-1 font-medium leading-relaxed max-w-2xl">
                  {activePlan.description}
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-slate-900 text-white shadow-md">
                  {activePlan.creditBadge}
                </span>
              </div>
            </div>

            {/* Top Billing Selector: ALL 3 PERIODS (Monthly, Quarterly, Yearly) */}
            {activePlan.id !== 'FREE' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full mb-8">
                {/* 1. Pay Monthly */}
                <div
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    billingCycle === 'monthly'
                      ? 'border-2 border-pink-400 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-orange-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm sm:text-base font-bold text-slate-900">Pay monthly</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      billingCycle === 'monthly' ? 'bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] border-transparent' : 'border-slate-300 bg-white'
                    }`}>
                      {billingCycle === 'monthly' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                        ₹{monthlyPricing.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      ₹{(monthlyPricing.price * 12).toLocaleString('en-IN')} billed yearly
                    </p>
                  </div>
                </div>

                {/* 2. Pay Quarterly (Save 10%) */}
                <div
                  onClick={() => setBillingCycle('quarterly')}
                  className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between relative ${
                    billingCycle === 'quarterly'
                      ? 'border-2 border-pink-400 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-orange-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm sm:text-base font-bold text-slate-900 truncate">Quarterly</span>
                      <span className="text-[10px] font-extrabold text-white bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] px-2 py-0.5 rounded-full shadow-2xs shrink-0">
                        10% OFF
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      billingCycle === 'quarterly' ? 'bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] border-transparent' : 'border-slate-300 bg-white'
                    }`}>
                      {billingCycle === 'quarterly' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                        ₹{quarterlyPricing.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">/qtr</span>
                      {quarterlyPricing.originalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                          ₹{quarterlyPricing.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      ₹{Math.round(quarterlyPricing.price / 3).toLocaleString('en-IN')}/mo, billed quarterly
                    </p>
                  </div>
                </div>

                {/* 3. Pay Once a Year (Save 20%) */}
                <div
                  onClick={() => setBillingCycle('yearly')}
                  className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between relative ${
                    billingCycle === 'yearly'
                      ? 'border-2 border-pink-400 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-orange-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm sm:text-base font-bold text-slate-900 truncate">Pay yearly</span>
                      <span className="text-[10px] font-extrabold text-white bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] px-2 py-0.5 rounded-full shadow-2xs shrink-0">
                        20% OFF
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      billingCycle === 'yearly' ? 'bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] border-transparent' : 'border-slate-300 bg-white'
                    }`}>
                      {billingCycle === 'yearly' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                        ₹{yearlyPricing.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">/year</span>
                      {yearlyPricing.originalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                          ₹{yearlyPricing.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      ₹{Math.round(yearlyPricing.price / 12).toLocaleString('en-IN')}/mo, billed yearly
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-2xl border-2 border-pink-400 bg-gradient-to-br from-pink-50/40 via-purple-50/20 to-orange-50/20 w-full flex items-center justify-between mb-8">
                <div>
                  <span className="text-base font-bold text-slate-900">Free Starter Tier</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-900">₹0</span>
                    <span className="text-sm text-slate-500">/forever</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] px-4 py-2 rounded-full shadow-2xs">
                  No Payment Required
                </span>
              </div>
            )}

            {/* Bonus Banner in Signature Theme */}
            <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50/70 via-pink-50/60 to-purple-50/60 border border-pink-200/80 flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white border border-pink-200/90 flex items-center justify-center text-[#f0449b] shadow-2xs shrink-0">
                <Gift className="w-6 h-6 text-[#f0449b]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  Get {activePlan.creditBadge}
                </span>
                <span className="text-xs sm:text-sm text-pink-950/80 font-medium mt-0.5">
                  {activePlan.description}
                </span>
              </div>
            </div>

            {/* FEATURES GRID: 2 COLUMNS ON WEB/DESKTOP (Key Highlights & All Features) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 pt-6 border-t border-slate-100">
              {/* Left Column: KEY HIGHLIGHTS */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider">Key Highlights</span>
                </div>
                <div className="space-y-3">
                  {activePlan.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: ALL FEATURES INCLUDED */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-[#f0449b] mb-4 border border-pink-200/60">
                  <span className="text-xs font-black uppercase tracking-wider">All Features Included</span>
                </div>
                <div className="space-y-3">
                  {activePlan.allFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-pink-300 bg-pink-50/70 flex items-center justify-center text-[#f0449b] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Buy Now Button with DhandaGrow Signature Brand Gradient (Centered & Expanded) */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col items-center">
              <button
                type="button"
                className="w-full max-w-xl py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-base sm:text-lg flex items-center justify-center shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {activePlan.id === 'FREE'
                  ? 'Get Started Free'
                  : `Buy Now — ₹${currentPricing.price.toLocaleString('en-IN')}${currentPricing.period}`}
              </button>
              <p className="text-center text-xs text-slate-400 mt-2.5">
                {activePlan.id === 'FREE' ? 'No credit card required' : '+ 18% GST where applicable • Instant activation'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
