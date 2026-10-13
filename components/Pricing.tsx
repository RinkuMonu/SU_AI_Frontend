"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

interface PlanPricing {
  price: number;
  originalPrice?: number;
  pricePrefix?: string;
  period: string;
  gstText: string;
  billedText?: string;
}

interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  credits: string;
  popular: boolean;
  features: string[];
  ctaText: string;
  pricing: Record<BillingCycle, PlanPricing>;
}

const LANDING_PLANS: PlanItem[] = [
  {
    id: "FREE",
    name: "FREE",
    tagline: "Explore AI",
    description: "For students, beginners and first-time users.",
    credits: "5 credits",
    popular: false,
    pricing: {
      monthly: {
        price: 0,
        period: "/ forever",
        gstText: "No GST applicable"
      },
      quarterly: {
        price: 0,
        period: "/ forever",
        gstText: "No GST applicable"
      },
      yearly: {
        price: 0,
        period: "/ forever",
        gstText: "No GST applicable"
      }
    },
    features: [
      "5 AI social media posts/month",
      "1 AI reel/month",
      "5 AI credits/month",
      "Basic caption generation",
      "1 brand profile",
      "Explore AI tools before upgrading"
    ],
    ctaText: "Get Started Free"
  },
  {
    id: "STARTER",
    name: "STARTER",
    tagline: "Create",
    description: "For shopkeepers, freelancers and small businesses starting online marketing.",
    credits: "100 monthly credits",
    popular: false,
    pricing: {
      monthly: {
        price: 799,
        period: "/ month",
        gstText: "+ 18% GST (₹942.82 incl. GST)"
      },
      quarterly: {
        price: 719,
        originalPrice: 799,
        period: "/ month",
        gstText: "+ 18% GST (₹2,545.26 incl. GST)",
        billedText: "Billed ₹2,157 / quarter (Save 10%)"
      },
      yearly: {
        price: 639,
        originalPrice: 799,
        period: "/ month",
        gstText: "+ 18% GST (₹9,050.60 incl. GST)",
        billedText: "Billed ₹7,670 / year (Save 20%)"
      }
    },
    features: [
      "100 monthly credits",
      "30 AI posts/month",
      "10 AI reels/month",
      "30 AI captions/month",
      "Basic hashtag suggestions",
      "1 brand and 1 user",
      "Brand-ready social media creatives"
    ],
    ctaText: "Choose Starter"
  },
  {
    id: "GROWTH",
    name: "GROWTH",
    tagline: "Market",
    description: "For creators, D2C brands and growing businesses that want consistent marketing.",
    credits: "400 monthly credits",
    popular: true,
    pricing: {
      monthly: {
        price: 2999,
        period: "/ month",
        gstText: "+ 18% GST (₹3,538.82 incl. GST)"
      },
      quarterly: {
        price: 2699,
        originalPrice: 2999,
        period: "/ month",
        gstText: "+ 18% GST (₹9,554.46 incl. GST)",
        billedText: "Billed ₹8,097 / quarter (Save 10%)"
      },
      yearly: {
        price: 2399,
        originalPrice: 2999,
        period: "/ month",
        gstText: "+ 18% GST (₹33,972.20 incl. GST)",
        billedText: "Billed ₹28,790 / year (Save 20%)"
      }
    },
    features: [
      "400 monthly credits",
      "100 AI posts/month",
      "30 AI reels/month",
      "100 AI captions/month",
      "AI Photoshoot, Fashion AI and Avatar tools",
      "Advanced brand customization",
      "Social media content calendar",
      "Post scheduling tools",
      "2 users"
    ],
    ctaText: "Choose Growth"
  },
  {
    id: "BUSINESS",
    name: "BUSINESS",
    tagline: "Automate",
    description: "For established businesses, marketing teams and agencies.",
    credits: "1,000 monthly credits",
    popular: false,
    pricing: {
      monthly: {
        price: 4999,
        period: "/ month",
        gstText: "+ 18% GST (₹5,898.82 incl. GST)"
      },
      quarterly: {
        price: 4499,
        originalPrice: 4999,
        period: "/ month",
        gstText: "+ 18% GST (₹15,926.46 incl. GST)",
        billedText: "Billed ₹13,497 / quarter (Save 10%)"
      },
      yearly: {
        price: 3999,
        originalPrice: 4999,
        period: "/ month",
        gstText: "+ 18% GST (₹56,628.20 incl. GST)",
        billedText: "Billed ₹47,990 / year (Save 20%)"
      }
    },
    features: [
      "1,000 monthly credits",
      "200 AI posts/month",
      "60 AI reels/month",
      "200 AI captions/month",
      "5 team members",
      "Multiple brand profiles",
      "Advanced scheduling & campaign tools",
      "Business analytics & AI Marketing Agent",
      "WhatsApp AI & Instagram DM AI",
      "Leads CRM and product catalogue"
    ],
    ctaText: "Choose Business"
  },
  {
    id: "INFLUENCER",
    name: "INFLUENCER",
    tagline: "Collaborate",
    description: "For brands that want creator partnerships and influencer-led campaigns.",
    credits: "Influencer Suite",
    popular: false,
    pricing: {
      monthly: {
        price: 9999,
        pricePrefix: "From ",
        period: "/ month",
        gstText: "+ 18% GST (₹11,798.82 incl. GST)"
      },
      quarterly: {
        price: 8999,
        pricePrefix: "From ",
        originalPrice: 9999,
        period: "/ month",
        gstText: "+ 18% GST (₹31,856.46 incl. GST)",
        billedText: "Billed ₹26,997 / quarter (Save 10%)"
      },
      yearly: {
        price: 7999,
        pricePrefix: "From ",
        originalPrice: 9999,
        period: "/ month",
        gstText: "+ 18% GST (₹1,13,268.20 incl. GST)",
        billedText: "Billed ₹95,990 / year (Save 20%)"
      }
    },
    features: [
      "Influencer discovery and shortlisting",
      "Creator audience and engagement review",
      "Brand-influencer collaboration coordination",
      "Campaign briefs and content planning",
      "Influencer outreach assistance",
      "Campaign tracking and reporting",
      "AI-generated promotional creatives and captions",
      "Performance analytics, where data is available",
      "Custom campaign packages for larger brands"
    ],
    ctaText: "Choose Influencer"
  }
];

export function Pricing() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("GROWTH");

  return (
    <section id="pricing" className="py-24 relative bg-[#090b14] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide">Simple, Transparent Pricing with 18% GST</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Choose the plan that fits your growth
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Start free, scale with AI automation, or collaborate directly with influencers to elevate your brand.
          </p>
        </div>

        {/* Billing Cycle Selector (Monthly / Quarterly / Yearly) */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center p-1.5 rounded-full bg-[#111623] border border-white/10 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("quarterly")}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                billingCycle === "quarterly"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Quarterly</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                billingCycle === "quarterly"
                  ? "bg-white/20 text-white border-white/30"
                  : "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
              }`}>
                Save 10%
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Yearly</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                billingCycle === "yearly"
                  ? "bg-white/20 text-white border-white/30"
                  : "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (5 columns on large screen) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          {LANDING_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const pricingInfo = plan.pricing[billingCycle];

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`rounded-[24px] p-6 flex flex-col transition-all duration-300 relative cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#111623] border-2 border-[#f0449b] shadow-[0_0_40px_rgba(240,68,155,0.25)] md:-translate-y-2 ring-1 ring-[#f0449b]/40"
                    : "bg-[#111623] border border-white/10 hover:border-white/25 hover:-translate-y-1"
                }`}
              >
                {/* Floating Top Badge */}
                {isSelected ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{plan.id === "GROWTH" ? "Most Popular" : "Selected Plan"}</span>
                  </div>
                ) : plan.id === "GROWTH" ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white/10 text-pink-300 text-[10px] font-semibold px-3 py-0.5 rounded-full uppercase tracking-wider border border-pink-500/30 whitespace-nowrap">
                    Most Popular
                  </div>
                ) : null}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {plan.name} <span className="text-slate-400 text-sm font-normal">— {plan.tagline}</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 min-h-[38px] leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-4 pt-3 border-t border-white/5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    {pricingInfo.pricePrefix && (
                      <span className="text-purple-400 text-xs font-semibold">{pricingInfo.pricePrefix}</span>
                    )}
                    {pricingInfo.originalPrice && (
                      <span className="text-slate-500 text-sm line-through">
                        ₹{pricingInfo.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      ₹{pricingInfo.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-400 text-xs">{pricingInfo.period}</span>
                  </div>

                  <div className="flex flex-col gap-0.5 mt-1.5 min-h-[34px]">
                    {pricingInfo.billedText && (
                      <div className="text-[11px] text-purple-300/90 font-medium">
                        {pricingInfo.billedText}
                      </div>
                    )}
                    <div className="text-[11px] text-emerald-400 font-medium leading-tight">
                      {pricingInfo.gstText}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple bg-brand-purple/10 px-3 py-1.5 rounded-lg mb-4 border border-brand-purple/20">
                  <Zap className="w-3.5 h-3.5 fill-brand-purple" />
                  <span>{plan.credits}</span>
                </div>

                <div className="space-y-2 flex-1 mb-6 text-xs text-slate-300">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#f0449b]' : 'text-emerald-400'}`} />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

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
                  className={`w-full py-3 rounded-xl font-semibold text-center text-xs block transition-all shadow-md ${
                    isSelected
                      ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] text-white hover:opacity-95 shadow-[0_0_20px_rgba(240,68,155,0.3)] scale-[1.02]"
                      : "bg-[#1c2333] border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

