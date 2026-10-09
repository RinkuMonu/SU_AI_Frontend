import React from 'react';
import Link from 'next/link';
import { Rocket, ArrowRight, Play, CreditCard, Clock, XCircle } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 relative bg-[#090b14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* The Light Card */}
        <div className="relative bg-white rounded-[40px] p-10 md:p-20 overflow-hidden shadow-2xl text-center flex flex-col items-center">
          
          {/* Abstract Blurred Backgrounds inside the card */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-200/40 blur-[100px] rounded-full mix-blend-multiply pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-200/40 blur-[100px] rounded-full mix-blend-multiply pointer-events-none translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-200/30 blur-[100px] rounded-full mix-blend-multiply pointer-events-none -translate-x-1/2 -translate-y-1/2" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-8">
            <Rocket className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500">
              Ready to Grow?
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Start Growing Your Business <br className="hidden md:block" />
            with DhandaGrow Today
          </h2>
          
          {/* Subtitle */}
          <p className="relative z-10 text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of businesses already using AI to grow faster, smarter and bigger.
          </p>
          
          {/* Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full">
            <Link href="/download" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] text-white font-bold hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(240,68,155,0.3)] flex items-center justify-center gap-2 text-base">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-3 text-base">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <Play className="w-3 h-3 ml-0.5 fill-current" />
              </div>
              Watch Demo
            </button>
          </div>
          
          {/* Features */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Setup in Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>Cancel Anytime</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
