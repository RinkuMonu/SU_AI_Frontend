import React from 'react';
import { SectionHeading } from './ui/SectionHeading';

const steps = [
  {
    number: '01',
    title: 'Connect your business',
    description: 'Link your social accounts, website, and ad platforms in one click.',
  },
  {
    number: '02',
    title: 'Let AI create and publish',
    description: 'Our engine generates content tailored to your brand voice and posts it when your audience is active.',
  },
  {
    number: '03',
    title: 'Track your growth',
    description: 'Watch your metrics improve with a unified dashboard that shows you exactly what works.',
  }
];

export function Automation() {
  return (
    <section className="py-24 relative bg-gradient-to-br from-black via-[#170021] to-[#fc9a5d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Automated from start to finish."
          subtitle="Three simple steps to put your digital marketing on autopilot."
        />

        <div className="mt-20 relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-[40px] md:left-1/2 md:-translate-x-1/2 w-0.5 h-[calc(100%-100px)] md:w-full md:h-0.5 md:top-12 md:left-0 bg-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-start md:items-center text-left md:text-center group">
                {/* Number Circle */}
                <div className="w-24 h-24 rounded-full bg-background border-4 border-white/10 flex items-center justify-center text-2xl font-semibold text-white/40 mb-8 relative z-10 group-hover:border-primary/50 group-hover:text-primary transition-colors duration-500">
                  {step.number}
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
