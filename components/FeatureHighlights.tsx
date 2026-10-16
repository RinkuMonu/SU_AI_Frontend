'use client';

import React from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Video,
  Camera,
  UserCircle,
  Percent,
  Bot,
  Calendar,
  PartyPopper,
  MessageCircle,
  MessageSquare,
  Star,
  Globe,
  BarChart2,
  Users,
  ShoppingBag,
  Brain,
  Sparkles,
  Languages,
  Pin,
  Send
} from 'lucide-react';

const allFeatures = [
  // 1. Create
  {
    name: 'AI Post Maker',
    icon: ImageIcon,
    route: '/features/ai-post-maker',
    colorClass: 'bg-pink-50 text-pink-600 border border-pink-100',
  },
  {
    name: 'AI Reel Maker',
    icon: Video,
    route: '/features/ai-reel-maker',
    colorClass: 'bg-purple-50 text-purple-600 border border-purple-100',
  },
  {
    name: 'AI Photoshoot',
    icon: Camera,
    route: '/features/ai-photoshoot',
    colorClass: 'bg-amber-50 text-amber-600 border border-amber-100',
  },
  {
    name: 'AI Presenter & Avatar',
    icon: UserCircle,
    route: '/features/ai-avatar',
    colorClass: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  },
  // 2. Marketing
  {
    name: 'AI Ads Maker',
    icon: Percent,
    route: '/features/ai-ads',
    colorClass: 'bg-blue-50 text-blue-600 border border-blue-100',
  },
  {
    name: 'AI Marketing Agent',
    icon: Bot,
    route: '/features/marketing-agent',
    colorClass: 'bg-violet-50 text-violet-600 border border-violet-100',
  },
  {
    name: 'Social Media Calendar',
    icon: Calendar,
    route: '/features/social-calendar',
    colorClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  },
  {
    name: 'Festival Engine',
    icon: PartyPopper,
    route: '/features/festival-engine',
    colorClass: 'bg-rose-50 text-rose-600 border border-rose-100',
  },
  // 3. Publish & Automate
  {
    name: 'Instagram DM AI',
    icon: MessageCircle,
    route: '/features/instagram-dm',
    colorClass: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100',
  },
  {
    name: 'WhatsApp AI Assistant',
    icon: MessageSquare,
    route: '/features/whatsapp-ai',
    colorClass: 'bg-green-50 text-green-600 border border-green-100',
  },
  {
    name: 'AI Review Manager',
    icon: Star,
    route: '/features/review-manager',
    colorClass: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
  },
  // 4. Business
  {
    name: 'AI Website Builder',
    icon: Globe,
    route: '/features/website-builder',
    colorClass: 'bg-cyan-50 text-cyan-600 border border-cyan-100',
  },
  {
    name: 'Business Analytics',
    icon: BarChart2,
    route: '/features/analytics',
    colorClass: 'bg-teal-50 text-teal-600 border border-teal-100',
  },
  {
    name: 'Leads CRM',
    icon: Users,
    route: '/features/crm',
    colorClass: 'bg-sky-50 text-sky-600 border border-sky-100',
  },
  {
    name: 'Product Catalogue',
    icon: ShoppingBag,
    route: '/features/catalogue',
    colorClass: 'bg-orange-50 text-orange-600 border border-orange-100',
  },
  // 5. Intelligence
  {
    name: 'AI Brand Brain',
    icon: Brain,
    route: '/features/brand-brain',
    colorClass: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  },
  {
    name: 'UNI AI Assistant',
    icon: Sparkles,
    route: '/features/uni-ai',
    colorClass: 'bg-purple-50 text-purple-600 border border-purple-100',
  },
  {
    name: 'Hindi & Hinglish AI',
    icon: Languages,
    route: '/features/indian-ai',
    colorClass: 'bg-amber-50 text-amber-600 border border-amber-100',
  },
  {
    name: 'Pinterest AI Growth',
    icon: Pin,
    route: '/#section-pinterest',
    colorClass: 'bg-red-50 text-red-600 border border-red-100',
  },
  {
    name: 'X (Twitter) Threads AI',
    icon: MessageSquare,
    route: '/#section-twitter',
    colorClass: 'bg-slate-100 text-slate-900 border border-slate-200',
  },
  {
    name: 'Telegram AI Broadcast',
    icon: Send,
    route: '/#section-telegram',
    colorClass: 'bg-sky-50 text-sky-600 border border-sky-100',
  },
];

export function FeatureHighlights() {
  return (
    <section className="pt-5 sm:pt-7 pb-4 sm:pb-6 bg-white relative z-10 w-full overflow-hidden">
      {/* Edge gradient fade masks for smooth infinite entrance & exit */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

      <div className="w-full flex items-center">
        <div className="feature-marquee-track">
          {/* Repeating groups to ensure 100% seamless infinite loop on any screen width */}
          {[1, 2].map((groupNum) => (
            <div
              key={`feature-group-${groupNum}`}
              className="feature-marquee-group flex items-center gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0"
              aria-hidden={groupNum > 1 ? 'true' : undefined}
            >
              {allFeatures.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <Link
                    key={`feat-${groupNum}-${idx}`}
                    href={feature.route}
                    className="flex flex-col justify-between w-[170px] sm:w-[195px] h-[128px] sm:h-[138px] bg-white rounded-[20px] border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 px-3.5 py-3.5 shrink-0 select-none group cursor-pointer"
                  >
                    {/* Top Logo / Icon Area */}
                    <div className="flex-1 flex items-center justify-center">
                      <div
                        className={`w-11 h-11 rounded-[14px] ${feature.colorClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Divider Line */}
                    <div className="w-full h-px bg-slate-100 group-hover:bg-slate-200 transition-colors my-1.5" />

                    {/* Bottom Title Area */}
                    <div className="text-center px-1">
                      <span className="text-[12.5px] sm:text-[13px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-1 block">
                        {feature.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
