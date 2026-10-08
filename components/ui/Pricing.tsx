import React from 'react';
import { pricingPlans } from '@/data/pricing';
import { SectionHeading } from './ui/SectionHeading';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Simple, transparent pricing."
          subtitle="Choose the plan that fits your growth stage."
          tone="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-center">
          {pricingPlans.map((plan, idx) => (
            <div 
              key={idx}
              className={cn(
                'rounded-3xl p-8 relative flex flex-col',
                plan.highlighted 
                  ? 'bg-white border border-primary/50 shadow-[0_0_50px_rgba(125,54,250,0.12)] py-12 z-10'
                  : 'bg-slate-50 border border-slate-200'
              )}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-background text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-600 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-slate-950 tracking-tight">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>

              <Button 
                variant={plan.highlighted ? 'primary' : 'outline'} 
                className={cn(
                  'w-full mb-8',
                  !plan.highlighted && 'border-slate-300 text-slate-900 hover:bg-slate-100'
                )}
              >
                {plan.cta}
              </Button>

              <div className="space-y-4 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
