import React from 'react';
import { SectionHeading } from './ui/SectionHeading';

const examples = [
  { id: 1, type: 'Instagram Post', title: 'Product Launch' },
  { id: 2, type: 'Facebook Ad', title: 'Summer Sale' },
  { id: 3, type: 'Blog Post', title: 'Industry Insights' },
  { id: 4, type: 'Email Campaign', title: 'Newsletter' },
  { id: 5, type: 'Twitter Thread', title: 'Thought Leadership' },
  { id: 6, type: 'LinkedIn Post', title: 'Company Update' },
];

export function Examples() {
  return (
    <section id="examples" className="py-24 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="See what AI can create."
          subtitle="From social media to long-form content, everything is generated instantly."
          tone="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {examples.map((item) => (
            <div 
              key={item.id}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-lg transition-all duration-500 cursor-pointer"
            >
              {/* Fake Content / Skeleton to look like a marketing asset */}
              <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div>
                    <div className="w-24 h-3 bg-slate-200 rounded-full mb-2" />
                    <div className="w-16 h-2 bg-slate-100 rounded-full" />
                  </div>
                </div>
                
                <div className="flex-1 w-full rounded-xl bg-slate-100 mb-4 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#fc9a5d]/10 via-[#f0449b]/10 to-[#7d36fa]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="w-3/4 h-3 bg-slate-200 rounded-full mb-2" />
                <div className="w-1/2 h-3 bg-slate-100 rounded-full" />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <span className="text-[#be32ff] text-sm font-semibold tracking-wider uppercase mb-2">
                  {item.type}
                </span>
                <span className="text-2xl font-semibold text-slate-900">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
