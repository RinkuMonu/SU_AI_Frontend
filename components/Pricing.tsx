"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Gift, Check } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export interface PlanPricing {
  price: number;
  originalPrice?: number;
  pricePrefix?: string;
  period: string;
  gstText: string;
  billedText?: string;
}

export interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  description: string;
  shortBenefits: string;
  credits: string;
  popular: boolean;
  features: string[];
  ctaText: string;
  pricing: Record<BillingCycle, PlanPricing>;
}

export const LANDING_PLANS: PlanItem[] = [
  {
    id: "FREE",
    name: "FREE",
    tagline: "Explore AI",
    accentColor: "#7C3AED",
    description: "For students, beginners and first-time users.",
    shortBenefits: "50 one-time credits; limited posts and reels; basic captions; 1 brand profile.",
    credits: "50 one-time credits",
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
    features: [
      "5 AI social media posts/month",
      "1 AI reel/month",
      "50 AI credits (one time)",
      "Basic caption generation",
      "1 brand profile"
    ],
    ctaText: "Get Started Free"
  },
  {
    id: "PRO_STARTER",
    name: "PRO",
    tagline: "Create",
    accentColor: "#7C3AED",
    description: "AI creation, marketing, publishing and business tools.",
    shortBenefits: "300 monthly credits; 50 one-time signup bonus; AI creation, marketing and publishing tools.",
    credits: "300 monthly credits",
    popular: false,
    pricing: {
      monthly: {
        price: 799,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 2157,
        originalPrice: 2397,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹240 (10% off)"
      },
      yearly: {
        price: 7670,
        originalPrice: 9588,
        period: "/yr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹1,918 (20% off)"
      }
    },
    features: [
      "AI Post Maker, Image Generator and Content + Image",
      "AI Photoshoot, Reel Maker, Avatar, Actor and Photobooth",
      "AI Advertisement Maker and Marketing Agent",
      "Social Media Calendar, Indian Festival Engine and AI messaging",
      "AI Website Builder",
      "50 signup bonus credits on first paid subscription"
    ],
    ctaText: "Choose Pro"
  },
  {
    id: "PRO_PLUS",
    name: "PRO PLUS",
    tagline: "Market",
    accentColor: "#7C3AED",
    description: "Everything in Pro, plus advanced intelligence and business tools.",
    shortBenefits: "1,500 monthly credits; 50 one-time signup bonus; analytics, CRM and AI intelligence.",
    credits: "1,500 monthly credits",
    popular: true,
    pricing: {
      monthly: {
        price: 2999,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 8097,
        originalPrice: 8997,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹900 (10% off)"
      },
      yearly: {
        price: 28790,
        originalPrice: 35988,
        period: "/yr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹7,198 (20% off)"
      }
    },
    features: [
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
    name: "BUSINESS",
    tagline: "Automate",
    accentColor: "#7C3AED",
    description: "Everything in Pro Plus, with the complete business service suite.",
    shortBenefits: "2,500 monthly credits; 50 one-time signup bonus; complete AI and business intelligence suite.",
    credits: "2,500 monthly credits",
    popular: false,
    pricing: {
      monthly: {
        price: 4999,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 13497,
        originalPrice: 14997,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹1,500 (10% off)"
      },
      yearly: {
        price: 47990,
        originalPrice: 59988,
        period: "/yr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹11,998 (20% off)"
      }
    },
    features: [
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
    name: "BUSINESS PREMIUM",
    tagline: "Premium",
    accentColor: "#7C3AED",
    description: "Everything in Business, plus premium services and company brand kit.",
    shortBenefits: "5,000 monthly credits; 50 one-time signup bonus; premium services and company brand kit.",
    credits: "5,000 monthly credits",
    popular: false,
    pricing: {
      monthly: {
        price: 9999,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 26997,
        originalPrice: 29997,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹3,000 (10% off)"
      },
      yearly: {
        price: 95990,
        originalPrice: 119988,
        period: "/yr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹23,998 (20% off)"
      }
    },
    features: [
      "Everything included in Business",
      "Premium Influencer Marketing and Customer Support",
      "Physical Training Provider and 24/7 Website Technical Support",
      "Company Logo, Visiting Cards, Employee ID Cards, Company Letterhead and Stamp",
      "50 signup bonus credits on first paid subscription"
    ],
    ctaText: "Choose Business Premium"
  },
];

export function Pricing() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>("PRO_PLUS");

  const activePlan = LANDING_PLANS.find((p) => p.id === selectedPlanId) || LANDING_PLANS[2];
  const monthlyPricing = activePlan.pricing.monthly;
  const yearlyPricing = activePlan.pricing.yearly;

  return (
    <section id="pricing" className="w-full max-w-full pt-10 sm:pt-14 pb-14 sm:pb-20 relative bg-white overflow-hidden border-t border-slate-100 scroll-mt-24">
      {/* Soft ambient background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-100/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-100/30 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center w-full mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-pink-200/90 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#f0449b] shrink-0" />
            <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] tracking-wide">
              Simple, Transparent Pricing
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2.5">
            Predictable Pricing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">Zero Surprises</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
            Choose the plan that fits your business stage. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Plan Selector Tabs with Signature Brand Gradient */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {LANDING_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
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

        {/* ================= MODERN PRICING CARD WITH DHANDAGROW SIGNATURE GRADIENT ================= */}
        <div className="p-[2.5px] rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-[0_20px_60px_-15px_rgba(240,68,155,0.25)] relative w-full max-w-2xl mx-auto transition-all duration-300">
          <div className="w-full bg-white rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 md:p-10">

            {/* Top Billing Selector (Side-by-Side as in Image 2) */}
            {activePlan.id !== 'FREE' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full">
                {/* Option 1: Pay monthly */}
                <div
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    billingCycle === 'monthly'
                      ? 'border-2 border-pink-400 bg-gradient-to-br from-pink-50/40 via-purple-50/20 to-orange-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">Pay monthly</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      billingCycle === 'monthly' ? 'bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] border-transparent' : 'border-slate-300 bg-white'
                    }`}>
                      {billingCycle === 'monthly' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        ₹{monthlyPricing.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-500">/month</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      That's ₹{(monthlyPricing.price * 12).toLocaleString('en-IN')} a year
                    </p>
                  </div>
                </div>

                {/* Option 2: Pay once a year (Highlighted with brand gradient) */}
                <div
                  onClick={() => setBillingCycle('yearly')}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between relative ${
                    billingCycle === 'yearly'
                      ? 'border-2 border-pink-400 bg-gradient-to-br from-pink-50/40 via-purple-50/20 to-orange-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">Pay once a year</span>
                      <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] px-2 py-0.5 rounded-full shadow-2xs">
                        Save 20%
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      billingCycle === 'yearly' ? 'bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] border-transparent' : 'border-slate-300 bg-white'
                    }`}>
                      {billingCycle === 'yearly' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        ₹{yearlyPricing.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-500">/year</span>
                      {yearlyPricing.originalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                          ₹{yearlyPricing.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Just ₹{Math.round(yearlyPricing.price / 12).toLocaleString('en-IN')}/month, billed yearly
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-pink-400 bg-gradient-to-br from-pink-50/40 via-purple-50/20 to-orange-50/20 w-full flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900">Free Starter Plan</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">₹0</span>
                    <span className="text-xs sm:text-sm text-slate-500">/forever</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-white bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] px-3 py-1 rounded-full shadow-2xs">
                  No Payment Required
                </span>
              </div>
            )}

            {/* Bonus / Promo Banner in Soft Brand Theme */}
            <div className="w-full p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-orange-50/60 via-pink-50/60 to-purple-50/60 border border-pink-200/80 flex items-center gap-3.5 my-6">
              <div className="w-10 h-10 rounded-xl bg-white border border-pink-200/90 flex items-center justify-center text-[#f0449b] shadow-2xs shrink-0">
                <Gift className="w-5 h-5 text-[#f0449b]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
                  Get {activePlan.credits}
                </span>
                <span className="text-xs sm:text-[13px] text-pink-900/80 font-medium">
                  {activePlan.shortBenefits}
                </span>
              </div>
            </div>

            {/* Feature Checklist with Theme Gradient Checkmarks */}
            <div className="flex flex-col divide-y divide-slate-100 my-2">
              {activePlan.features.map((feature, idx) => (
                <div key={idx} className="py-3.5 sm:py-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-[15px] leading-relaxed font-normal text-slate-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Buy Now Button with DhandaGrow Signature Brand Gradient */}
            <div className="mt-8 w-full">
              <Link
                href={user ? "/subscription" : `/login/user?redirect=/subscription`}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('pending_plan', activePlan.id);
                    sessionStorage.setItem('pending_billing', billingCycle);
                  }
                }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-base sm:text-lg flex items-center justify-center shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {activePlan.id === 'FREE' ? 'Get Started Free' : 'Buy Now'}
              </Link>
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
