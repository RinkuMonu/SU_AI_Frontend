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
    <section className="py-16 bg-white relative z-10 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className={`w-[60px] h-[60px] rounded-[18px] ${feature.colorClass} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-1.5`}>
                {feature.icon}
              </div>
              <h3 className="text-[16px] font-extrabold text-[#111827] mb-1.5 tracking-tight">{feature.title}</h3>
              <p className="text-[13px] text-[#6b7280] font-medium leading-[1.4] px-1 whitespace-pre-line">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
