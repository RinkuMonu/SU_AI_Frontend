"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
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
    shortBenefits: "5 credits; limited posts and reels; basic captions; 1 brand profile.",
    credits: "5 credits",
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
      "5 AI credits/month",
      "Basic caption generation",
      "1 brand profile"
    ],
    ctaText: "Get Started Free"
  },
  {
    id: "STARTER",
    name: "STARTER",
    tagline: "Create",
    accentColor: "#7C3AED",
    description: "For shopkeepers, freelancers and small businesses starting online marketing.",
    shortBenefits: "100 monthly credits; 30 AI posts; 10 AI reels; 1 brand and 1 user.",
    credits: "100 monthly credits",
    popular: false,
    pricing: {
      monthly: {
        price: 799,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 2277,
        originalPrice: 2397,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹120 (5% off)"
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
      "100 monthly credits",
      "30 AI posts/month",
      "10 AI reels/month",
      "30 AI captions/month",
      "1 brand and 1 user"
    ],
    ctaText: "Choose Starter"
  },
  {
    id: "GROWTH",
    name: "GROWTH",
    tagline: "Market",
    accentColor: "#7C3AED",
    description: "For creators, D2C brands and growing businesses that want consistent marketing.",
    shortBenefits: "400 credits; 100 posts; 30 reels; photoshoot/fashion/avatar tools; calendar and scheduling.",
    credits: "400 monthly credits",
    popular: true,
    pricing: {
      monthly: {
        price: 2999,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 8547,
        originalPrice: 8997,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹450 (5% off)"
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
      "400 monthly credits",
      "100 AI posts/month",
      "30 AI reels/month",
      "AI Photoshoot & Avatar tools",
      "Social media content calendar"
    ],
    ctaText: "Choose Growth"
  },
  {
    id: "BUSINESS",
    name: "BUSINESS",
    tagline: "Automate",
    accentColor: "#7C3AED",
    description: "For established businesses, marketing teams and agencies.",
    shortBenefits: "1,000 credits; 200 posts; 60 reels; team members; analytics, CRM and AI messaging tools.",
    credits: "1,000 monthly credits",
    popular: false,
    pricing: {
      monthly: {
        price: 4999,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 14247,
        originalPrice: 14997,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹750 (5% off)"
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
      "1,000 monthly credits",
      "200 AI posts/month",
      "60 AI reels/month",
      "5 team members & CRM",
      "Instagram DM & Social AI"
    ],
    ctaText: "Choose Business"
  },
  {
    id: "INFLUENCER",
    name: "INFLUENCER",
    tagline: "Collaborate",
    accentColor: "#7C3AED",
    description: "For brands and businesses scaling creator partnerships and influencer campaigns.",
    shortBenefits: "Influencer Suite; creator discovery; pitch generation; collaboration CRM and tracking.",
    credits: "Influencer Suite",
    popular: false,
    pricing: {
      monthly: {
        price: 9999,
        period: "/mo",
        gstText: "+ 18% GST where applicable"
      },
      quarterly: {
        price: 28497,
        originalPrice: 29997,
        period: "/qtr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹1,500 (5% off)"
      },
      yearly: {
        price: 107989,
        originalPrice: 119988,
        period: "/yr",
        gstText: "+ 18% GST where applicable",
        billedText: "Save ₹11,999 (10% off)"
      }
    },
    features: [
      "Influencer Engine & Discovery",
      "Creator outreach & AI pitch generator",
      "Inbound application manager",
      "Campaign CRM & deliverable reviews",
      "Live campaign ROI analytics"
    ],
    ctaText: "Choose Influencer"
  },
];

export function Pricing() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("GROWTH");

  return (
    <section id="pricing" className="pt-8 pb-10 sm:pt-10 sm:pb-12 relative bg-[#f8f9fe] overflow-hidden border-t border-slate-100">
      {/* Soft ambient background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-100/40 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-4 2xl:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-7 sm:mb-9">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-slate-700 tracking-wide">Simple, Transparent Pricing with 18% GST</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            Predictable Pricing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED]">Zero Surprises</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Choose the plan that fits your business stage. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing Cycle 3D Pill Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200/80 shadow-sm gap-1 mt-4">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("quarterly")}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                billingCycle === "quarterly"
                  ? "bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Quarterly</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                billingCycle === "quarterly" ? "bg-white/25 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
              }`}>
                Save 5%
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Yearly</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                billingCycle === "yearly" ? "bg-white/25 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3D Pricing Cards Grid matching user's reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 xl:gap-3 2xl:gap-5 items-stretch">
          {LANDING_PLANS.map((plan) => {
            const pricingInfo = plan.pricing[billingCycle];
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('pending_plan', plan.id);
                    sessionStorage.setItem('pending_billing', billingCycle);
                  }
                }}
                className={`rounded-[32px] sm:rounded-[36px] xl:rounded-[30px] 2xl:rounded-[38px] p-5 sm:p-6 xl:px-3.5 xl:py-6 2xl:px-5 2xl:py-7 flex flex-col items-center text-center transition-all duration-300 relative cursor-pointer select-none group ${
                  isSelected
                    ? "bg-[#F2EFFE] border-2 border-[#DDD6FE] shadow-[0_16px_38px_rgba(124,58,237,0.15),0_2px_8px_rgba(124,58,237,0.06)] -translate-y-2 z-10"
                    : "bg-white border border-slate-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.02)] hover:border-purple-200 hover:shadow-[0_22px_45px_rgba(124,58,237,0.08),0_4px_12px_rgba(124,58,237,0.04)] hover:-translate-y-1.5"
                }`}
              >
                {/* 3D Floating Top Pill Box (Explore AI, Create, Market, Automate, Collaborate) */}
                <div 
                  className={`w-[86%] max-w-[165px] py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-2xl bg-white border shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] flex items-center justify-center text-xs sm:text-[13px] font-bold tracking-wide transition-all duration-200 group-hover:scale-105 ${
                    isSelected
                      ? "border-purple-200/90 text-[#7C3AED]"
                      : "border-slate-200/90 text-slate-700 group-hover:text-[#7C3AED]"
                  }`}
                >
                  {plan.tagline}
                </div>

                {/* Plan Name in signature style */}
                <h3 
                  className={`text-2xl sm:text-[26px] xl:text-[22px] 2xl:text-[26px] font-black uppercase tracking-wider mt-4 sm:mt-5 mb-2.5 sm:mb-3 transition-colors ${
                    isSelected
                      ? "text-[#7C3AED]"
                      : "text-slate-900 group-hover:text-[#7C3AED]"
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Price Display: cleanly structured so original price and active price never overflow */}
                <div className="flex flex-col items-center justify-center min-h-[58px] sm:min-h-[64px] mb-1 w-full">
                  {/* Top Row: Strikethrough Original Price & Discount Badge (or placeholder space) */}
                  <div className="flex items-center justify-center gap-1.5 min-h-[20px] mb-1">
                    {pricingInfo.originalPrice ? (
                      <>
                        <span className="text-slate-400 text-xs sm:text-[13px] line-through font-semibold">
                          ₹{pricingInfo.originalPrice.toLocaleString('en-IN')}
                        </span>
                        {pricingInfo.billedText && (
                          <span className="text-[10px] font-extrabold text-[#7C3AED] bg-purple-100/70 border border-purple-200/80 px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                            {pricingInfo.billedText.match(/\d+%\s*off/i)?.[0] || 'Save'}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="inline-block h-4" />
                    )}
                  </div>

                  {/* Main Active Price Line */}
                  <div className="flex items-baseline justify-center max-w-full">
                    {pricingInfo.pricePrefix && (
                      <span className="text-xs sm:text-sm font-bold text-slate-500 mr-1 shrink-0">
                        {pricingInfo.pricePrefix}
                      </span>
                    )}
                    <span className={`font-black text-slate-900 tracking-tight leading-none ${
                      pricingInfo.price >= 100000 
                        ? "text-2xl sm:text-[28px] xl:text-[25px] 2xl:text-[32px]" 
                        : "text-3xl sm:text-[34px] xl:text-[28px] 2xl:text-[34px]"
                    }`}>
                      ₹{pricingInfo.price.toLocaleString('en-IN')}
                    </span>
                    {plan.id !== 'FREE' && (
                      <span className="text-xs sm:text-sm font-bold text-slate-600 ml-1 shrink-0">
                        {billingCycle === 'monthly' ? '/mo' : billingCycle === 'quarterly' ? '/qtr' : '/yr'}
                      </span>
                    )}
                  </div>
                </div>

                {/* GST Text Note */}
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mb-4 sm:mb-5">
                  {plan.id === 'FREE' ? 'No GST shown' : '+ 18% GST where applicable'}
                </p>

                {/* Short Way Benefits */}
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal text-center min-h-[76px] sm:min-h-[84px] flex items-center justify-center px-1 sm:px-2 flex-1">
                  {plan.shortBenefits}
                </p>

                {/* Sleek Action Button */}
                <div className="w-full mt-5 pt-1">
                  <Link
                    href="/login/user"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(plan.id);
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('pending_plan', plan.id);
                        sessionStorage.setItem('pending_billing', billingCycle);
                      }
                    }}
                    className={`w-full py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-center block transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.98] ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25"
                        : "bg-purple-50/80 text-purple-700 hover:bg-[#7C3AED] hover:text-white border border-purple-200/70"
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
