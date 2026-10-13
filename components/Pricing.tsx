"use client";

import React from 'react';
import Link from 'next/link';
import { Check, Zap, Sparkles } from 'lucide-react';

const LANDING_PLANS = [
  {
    id: "FREE",
    name: "FREE",
    tagline: "Explore AI",
    description: "For students, beginners and first-time users.",
    price: 0,
    pricePrefix: "",
    period: "/ forever",
    gstText: "No GST applicable",
    credits: "5 credits",
    popular: false,
    features: [
      "5 AI social media posts/month",
      "1 AI reel/month",
      "5 AI credits/month",
      "Basic caption generation",
      "1 brand profile",
      "Explore AI tools before upgrading"
    ],
    ctaText: "Get Started Free",
    ctaHref: "/signup"
  },
  {
    id: "STARTER",
    name: "STARTER",
    tagline: "Create",
    description: "For shopkeepers, freelancers and small businesses starting online marketing.",
    price: 799,
    pricePrefix: "",
    period: "/ month",
    gstText: "+ 18% GST",
    credits: "100 monthly credits",
    popular: false,
    features: [
      "100 monthly credits",
      "30 AI posts/month",
      "10 AI reels/month",
      "30 AI captions/month",
      "Basic hashtag suggestions",
      "1 brand and 1 user",
      "Brand-ready social media creatives"
    ],
    ctaText: "Choose Starter",
    ctaHref: "/subscription"
  },
  {
    id: "GROWTH",
    name: "GROWTH",
    tagline: "Market",
    description: "For creators, D2C brands and growing businesses that want consistent marketing.",
    price: 2999,
    pricePrefix: "",
    period: "/ month",
    gstText: "+ 18% GST",
    credits: "400 monthly credits",
    popular: true,
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
    ctaText: "Choose Growth",
    ctaHref: "/subscription"
  },
  {
    id: "BUSINESS",
    name: "BUSINESS",
    tagline: "Automate",
    description: "For established businesses, marketing teams and agencies.",
    price: 4999,
    pricePrefix: "",
    period: "/ month",
    gstText: "+ 18% GST",
    credits: "1,000 monthly credits",
    popular: false,
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
    ctaText: "Choose Business",
    ctaHref: "/subscription"
  },
  {
    id: "INFLUENCER",
    name: "INFLUENCER",
    tagline: "Collaborate",
    description: "For brands that want creator partnerships and influencer-led campaigns.",
    price: 9999,
    pricePrefix: "From ",
    period: "/ month",
    gstText: "+ 18% GST (₹11,798.82 incl. GST)",
    credits: "Influencer Suite",
    popular: false,
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
    ctaText: "Choose Influencer",
    ctaHref: "/subscription"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative bg-[#090b14] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
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

        {/* Pricing Cards Grid (5 columns on large screen) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          {LANDING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-[24px] p-6 flex flex-col transition-all duration-300 relative ${
                plan.popular
                  ? "bg-[#111623] border-2 border-[#f0449b] shadow-[0_0_40px_rgba(240,68,155,0.2)] md:-translate-y-2"
                  : "bg-[#111623] border border-white/10 hover:border-white/20 hover:-translate-y-1"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">
                  {plan.name} <span className="text-slate-400 text-sm font-normal">— {plan.tagline}</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1 min-h-[38px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4 pt-3 border-t border-white/5">
                <div className="flex items-baseline gap-1 flex-wrap">
                  {plan.pricePrefix && (
                    <span className="text-purple-400 text-xs font-semibold">{plan.pricePrefix}</span>
                  )}
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 text-xs">{plan.period}</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-1 leading-tight">
                  {plan.gstText}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple bg-brand-purple/10 px-3 py-1.5 rounded-lg mb-4 border border-brand-purple/20">
                <Zap className="w-3.5 h-3.5 fill-brand-purple" />
                <span>{plan.credits}</span>
              </div>

              <div className="space-y-2 flex-1 mb-6 text-xs text-slate-300">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-[#f0449b]' : 'text-emerald-400'}`} />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.ctaHref}
                className={`w-full py-3 rounded-xl font-semibold text-center text-xs block transition-all shadow-md ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] text-white hover:opacity-90 shadow-[0_0_20px_rgba(240,68,155,0.3)]"
                    : "bg-[#1c2333] border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {plan.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
