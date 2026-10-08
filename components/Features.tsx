import React from 'react';
import { features } from '@/data/features';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';

export function Features() {
  return (
    <section id="features" className="py-32 relative bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Everything you need to grow."
          subtitle="A complete suite of AI-powered tools designed to put your marketing on autopilot."
          tone="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={idx} className="group">
                <div className="w-12 h-12 rounded-xl bg-[#fc9a5d]/10 flex items-center justify-center mb-6 group-hover:bg-[#f0449b]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#7d36fa]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
                
                {/* Decorative background element */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#fc9a5d]/5 rounded-full blur-2xl group-hover:bg-[#be32ff]/10 transition-colors" />
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
