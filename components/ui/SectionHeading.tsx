import React from 'react';

export function SectionHeading({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-white/70 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
