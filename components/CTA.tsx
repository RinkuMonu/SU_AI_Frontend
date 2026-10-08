import React from 'react';
import { Button } from './ui/button';

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden border-t border-white/5">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111111]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6">
          Ready to grow with AI?
        </h2>
        
        <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
          Start building smarter marketing workflows today. Join thousands of brands scaling their business on autopilot.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="default" size="lg" className="w-full sm:w-auto px-10">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-10">
            Contact Us
          </Button>
        </div>
        
        <p className="mt-8 text-white/40 text-sm">
          No credit card required. 14-day free trial.
        </p>
      </div>
    </section>
  );
}
