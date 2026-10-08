import React from 'react';
import { Button } from './ui/button';
import { Rocket, ArrowRight, MessageCircle, Pen, Heart, Send } from 'lucide-react';

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#f8f9ff] via-[#f0f3ff] to-[#fff0f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col items-start max-w-xl z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-8">
              <Rocket className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">
                From Idea to Impact
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Everything your <br className="hidden sm:block" />
              business needs <br className="hidden sm:block" />
              in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">one platform.</span>
            </h2>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              DhandaGrow provides AI-powered tools to help you create, market, and grow your business faster than ever before.
            </p>

            <Button variant="default" size="lg" className="h-14 px-8 text-base shadow-lg shadow-indigo-500/25 group font-semibold">
              Explore Features
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - UI Mockup Composition */}
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square z-10">
            {/* Background Glows for Depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-200/50 blur-[100px] rounded-full pointer-events-none" />

            {/* Main Window */}
            <div className="absolute top-10 right-10 left-4 md:left-10 md:right-32 bottom-20 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white p-6 md:p-8 z-10 flex flex-col">
              <h3 className="text-[22px] font-bold text-slate-900 mb-6">Create Amazing Content with AI</h3>
              
              {/* Tabs */}
              <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <div className="px-5 py-2.5 bg-[#7d36fa] text-white rounded-full text-sm font-semibold whitespace-nowrap shadow-md">
                  Social Media
                </div>
                {['Blog Post', 'Ad Copy', 'Email', 'Images'].map(tab => (
                  <div key={tab} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-slate-100 cursor-pointer transition-colors">
                    {tab}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-[#fafafa] relative flex-1">
                <p className="text-slate-400 text-[15px] mb-4">Describe what you want to create...</p>
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-indigo-100 rounded-xl shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Pen className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">A promotional Instagram post for my clothing brand</span>
                </div>

                <div className="absolute bottom-6 right-6">
                  <Button size="sm" className="bg-[#5218f2] hover:bg-[#4012c4] text-white rounded-xl shadow-lg shadow-indigo-500/30 h-11 px-5 text-sm font-semibold group">
                    Generate with AI
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Social Icons */}
            <div className="absolute top-4 right-20 md:right-16 z-30 flex flex-col gap-5">
              <div className="w-[72px] h-[72px] bg-white rounded-2xl shadow-xl flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white">
                  {/* Custom Instagram SVG */}
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
              </div>
              <div className="w-[72px] h-[72px] bg-white rounded-2xl shadow-xl flex items-center justify-center transform -translate-x-6 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-[52px] h-[52px] rounded-[14px] bg-[#1877F2] flex items-center justify-center text-white">
                  {/* Custom Facebook SVG */}
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
              </div>
              <div className="w-[72px] h-[72px] bg-white rounded-2xl shadow-xl flex items-center justify-center transform translate-x-2 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-[52px] h-[52px] rounded-[14px] bg-[#25D366] flex items-center justify-center text-white">
                  {/* Custom WhatsApp Icon */}
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </div>
              </div>
            </div>

            {/* Floating Phone Mockup */}
            <div className="absolute -right-2 md:right-8 top-32 bottom-4 w-[240px] md:w-[260px] bg-slate-900 rounded-[32px] shadow-2xl z-20 border-[6px] border-slate-900 overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-white relative flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500 text-[10px] font-bold tracking-tighter">SU</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">DhandaGrow</span>
                  </div>
                </div>
                {/* Image */}
                <div className="w-full h-[220px] bg-slate-100 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2940&auto=format&fit=crop" alt="Shoe" className="w-full h-full object-cover" />
                </div>
                {/* Content */}
                <div className="p-4 flex-1">
                  <h4 className="font-bold text-slate-900 text-lg md:text-xl leading-[1.2]">New Collection<br />Now Live! 🔥</h4>
                </div>
                {/* Footer */}
                <div className="flex items-center gap-4 p-4 border-t border-slate-50">
                  <Heart className="w-5 h-5 text-slate-400" />
                  <MessageCircle className="w-5 h-5 text-slate-400" />
                  <Send className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
