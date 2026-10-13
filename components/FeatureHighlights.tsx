import React from 'react';
import { Sparkles, MessageSquare, Hammer, TrendingUp, Settings, Users } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
    title: 'AI Content',
    description: 'Create stunning content\nin seconds',
    colorClass: 'bg-indigo-100/80 shadow-[0_4px_20px_rgba(79,70,229,0.2)]'
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-pink-500" />,
    title: 'Social Media',
    description: 'Schedule & publish\nautomatically',
    colorClass: 'bg-pink-100/80 shadow-[0_4px_20px_rgba(236,72,153,0.2)]'
  },
  {
    icon: <Hammer className="w-6 h-6 text-blue-500" />,
    title: 'SEO Tools',
    description: 'Rank higher on Google',
    colorClass: 'bg-blue-100/80 shadow-[0_4px_20px_rgba(59,130,246,0.2)]'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
    title: 'Analytics',
    description: 'Track your growth',
    colorClass: 'bg-emerald-100/80 shadow-[0_4px_20px_rgba(16,185,129,0.2)]'
  },
  {
    icon: <Settings className="w-6 h-6 text-orange-500" />,
    title: 'Automation',
    description: 'Save time, do more',
    colorClass: 'bg-orange-100/80 shadow-[0_4px_20px_rgba(249,115,22,0.2)]'
  },
  {
    icon: <Users className="w-6 h-6 text-purple-500" />,
    title: 'Team Collaboration',
    description: 'Work with your team',
    colorClass: 'bg-purple-100/80 shadow-[0_4px_20px_rgba(168,85,247,0.2)]'
  }
];

export function FeatureHighlights() {
  return (
    <section className="py-14 sm:py-16 bg-white relative z-10 w-full overflow-hidden">
      {/* Edge gradient fade masks for seamless infinite entrance & exit */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

      <div className="w-full flex items-center">
        <div className="feature-marquee-track">
          {/* Repeating groups to ensure 100% seamless infinite loop on any screen width */}
          {[1, 2, 3, 4].map((groupNum) => (
            <div 
              key={`group-${groupNum}`} 
              className="feature-marquee-group flex items-center gap-10 sm:gap-14 pr-10 sm:pr-14 shrink-0"
              aria-hidden={groupNum > 1 ? 'true' : undefined}
            >
              {features.map((feature, idx) => (
                <div 
                  key={`feature-${groupNum}-${idx}`} 
                  className="flex flex-col items-center text-center group shrink-0 w-[170px] sm:w-[195px] cursor-pointer select-none"
                >
                  <div className={`w-[60px] h-[60px] rounded-[18px] ${feature.colorClass} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-[15px] sm:text-[16px] font-extrabold text-[#111827] mb-1.5 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-[#6b7280] font-medium leading-[1.4] px-1 whitespace-pre-line">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

