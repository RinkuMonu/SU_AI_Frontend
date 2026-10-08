import React from 'react';
import { Button } from './ui/button';
import { Check, Star } from 'lucide-react';

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative bg-[#090b14] overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="text-[#f59e0b] text-sm">⭐</span>
            <span className="text-xs font-semibold text-slate-300 tracking-wide">Simple, Transparent Pricing</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Choose the plan that's right for you
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include AI-powered features.
          </p>

          {/* Toggle */}
          <div className="mt-10 flex items-center p-1 bg-[#151b2b] rounded-full border border-white/5">
            <button className="px-6 py-2.5 rounded-full bg-[#7d36fa] text-white text-sm font-semibold shadow-lg transition-all">
              Monthly
            </button>
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-full text-slate-400 text-sm font-medium hover:text-white transition-colors cursor-pointer">
              <span>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold tracking-wide">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          
          {/* Starter Card */}
          <div className="bg-[#111623] border border-white/5 rounded-[24px] p-8 flex flex-col hover:border-white/10 transition-colors">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-slate-400 text-sm">Perfect for individuals</p>
            </div>
            
            <div className="mb-8 flex items-end gap-1">
              <span className="text-5xl font-bold text-white tracking-tight">₹0</span>
              <span className="text-slate-400 text-sm mb-1">/month</span>
            </div>

            <div className="space-y-4 flex-1 mb-8">
              {[
                'AI Content Generation',
                '5 Social Accounts',
                'Basic Analytics',
                'Community Support'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-3.5 rounded-xl bg-transparent border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm">
              Get Started
            </button>
          </div>

          {/* Pro Card */}
          <div className="relative rounded-[24px] p-[2px] bg-gradient-to-b from-[#f0449b] via-[#7d36fa] to-transparent shadow-[0_0_40px_rgba(125,54,250,0.15)] flex flex-col z-10 transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Most Popular
            </div>
            
            <div className="bg-[#111623] rounded-[22px] p-8 flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-[#f0449b] text-sm font-medium">Most Popular</p>
              </div>
              
              <div className="mb-8 flex items-end gap-1">
                <span className="text-5xl font-bold text-white tracking-tight">₹499</span>
                <span className="text-slate-400 text-sm mb-1">/month</span>
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {[
                  'Unlimited Content',
                  '20 Social Accounts',
                  'Advanced Analytics',
                  'Ad Campaign Tools',
                  'Priority Support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#f0449b] shrink-0" />
                    <span className="text-slate-300 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] text-white font-bold hover:opacity-90 transition-opacity shadow-lg text-sm">
                Get Started
              </button>
            </div>
          </div>

          {/* Business Card */}
          <div className="bg-[#111623] border border-white/5 rounded-[24px] p-8 flex flex-col hover:border-white/10 transition-colors">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Business</h3>
              <p className="text-slate-400 text-sm">For growing teams</p>
            </div>
            
            <div className="mb-8 flex items-end gap-1">
              <span className="text-5xl font-bold text-white tracking-tight">₹1,499</span>
              <span className="text-slate-400 text-sm mb-1">/month</span>
            </div>

            <div className="space-y-4 flex-1 mb-8">
              {[
                'Everything in Pro',
                'Team Collaboration',
                'Custom Branding',
                'Dedicated Account Manager',
                'API Access'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-3.5 rounded-xl bg-transparent border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm">
              Get Started
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
