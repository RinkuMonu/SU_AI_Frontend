import React from 'react';
import { Button } from './ui/button';

export function AISection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0449b]/10 text-[#f0449b] text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fc9a5d] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fc9a5d]"></span>
              </span>
              Always On
            </div>
            
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6">
              Your AI marketing team, always on.
            </h2>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Stop worrying about when to post or what to say. Our advanced AI analyzes your brand voice, creates engaging content, and publishes it at the perfect time.
            </p>

            <ul className="space-y-4 mb-10">
              {['Smart content generation', 'Predictive audience targeting', 'Automated A/B testing'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-[#be32ff]/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#7d36fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Button variant="default">See How It Works</Button>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative w-full aspect-[4/3] lg:aspect-square">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#fc9a5d]/10 via-transparent to-[#be32ff]/10 rounded-3xl" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#7d36fa]/5 blur-[100px] rounded-full pointer-events-none" />
            
            {/* Dashboard UI Frame */}
            <div className="relative w-full h-full rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden p-6 flex flex-col">
              
              {/* Fake Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f0449b]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#fc9a5d]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#7d36fa]/60" />
                </div>
                <div className="h-6 w-24 bg-slate-100 rounded-md" />
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Chart Mockup */}
                <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-end gap-2 h-40">
                  <div className="flex items-end justify-between h-full gap-2">
                    {[40, 70, 45, 90, 65, 100, 85].map((h, i) => (
                      <div key={i} className="w-full bg-[#f0449b]/20 rounded-t-sm" style={{ height: `${h}%` }}>
                        {i === 5 && <div className="w-full h-full bg-gradient-to-t from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] rounded-t-sm" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Element */}
            <div className="absolute -left-12 bottom-12 rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4 shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 rounded-full bg-[#7d36fa]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#fc9a5d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Engagement</p>
                <p className="text-sm font-bold text-slate-900">+24.8%</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
