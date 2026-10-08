import React from 'react';

export function SectionHeading({ title, subtitle, tone }: { title: string, subtitle?: string, tone?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-4 ${tone === 'light' ? 'text-slate-900' : 'text-white'}`}>{title}</h2>
      {subtitle && <p className={`text-lg max-w-2xl mx-auto ${tone === 'light' ? 'text-slate-600' : 'text-white/70'}`}>{subtitle}</p>}
    </div>
  );
}
