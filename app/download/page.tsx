'use client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ShieldCheck, Layers, RefreshCw, MessageSquare, Image as ImageIcon, Video, Code, FileText, Mic, CheckCircle2, Download, Search, Play, ChevronLeft, ChevronRight, Star, Plus, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function DownloadPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    { question: "Is the DhandaGrow app free to use?", answer: "Yes, the basic version is free." },
    { question: "How can I download the app?", answer: "You can download it from the Google Play Store or Apple App Store." },
    { question: "Is my data safe and private?", answer: "Yes, we prioritize your privacy and data security with industry-standard encryption." },
    { question: "Is the app available on both Android and iOS?", answer: "Yes, it is available on both major platforms." },
    { question: "Do I need an account to use the app?", answer: "You can use some features as a guest, but an account is required for full access." },
    { question: "Will I get regular updates?", answer: "Yes, we release regular updates with new features and improvements." }
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fc] selection:bg-primary/30 selection:text-white pb-0">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/50 via-purple-50/50 to-transparent blur-3xl rounded-full pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50/50 via-transparent to-transparent blur-3xl rounded-full pointer-events-none translate-y-1/4 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="w-full lg:w-[45%] flex flex-col items-start pt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">DhandaGrow Mobile App</span>
                </div>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">+ All AI Tools in Your Pocket</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Get the Power of AI On <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Your Mobile</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mb-8">
                Chat, create, design, write, code and so much more — anytime, anywhere. Download the DhandaGrow app and unlock endless possibilities on your smartphone.
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Fast & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">All AI Tools in One App</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Sync Across Devices</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full">
                <button className="h-[60px] bg-black rounded-xl px-6 flex items-center gap-3 hover:scale-105 transition-transform w-full sm:w-auto justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.164-.176-.265-.436-.265-.746V2.56c0-.31.101-.57.264-.746zm10.978 10.932l2.368 2.368-4.887 2.822-1.996-1.996 4.515-3.194zm4.515-3.194l-4.515-3.194 1.996-1.996 4.887 2.822-2.368 2.368zm-5.836 2.477L2.83 2.593c.189-.115.424-.182.68-.182.235 0 .452.057.632.155l14.863 8.58-5.74 5.883zM3.51 22.775c.18.098.397.155.632.155.256 0 .491-.067.68-.182l14.863-8.58-5.74-5.883-10.435 14.49z"/>
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider leading-none">GET IT ON</span>
                    <span className="text-xl text-white font-semibold leading-tight">Google Play</span>
                  </div>
                </button>
                <button className="h-[60px] bg-black rounded-xl px-6 flex items-center gap-3 hover:scale-105 transition-transform w-full sm:w-auto justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.56.03 2.88.54 3.92 1.44-2.58 1.63-2.12 4.79.52 5.86-1.01 2.36-2.1 4.54-3.02 5.67zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider leading-none">Download on the</span>
                    <span className="text-xl text-white font-semibold leading-tight">App Store</span>
                  </div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://su-ai.com/download" alt="QR Code" className="w-16 h-16 rounded-xl" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Scan QR Code</span>
                    <span className="text-xs text-slate-500">to Download App</span>
                  </div>
                </div>
                <div className="flex flex-col hidden sm:flex">
                  <div className="flex -space-x-2 mb-1">
                    <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-[#f8f9fc]" alt="user" />
                    <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-[#f8f9fc]" alt="user" />
                    <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-[#f8f9fc]" alt="user" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">Trusted by <span className="text-slate-900">1M+ users</span></span>
                  <span className="text-[11px] text-slate-500">worldwide</span>
                </div>
              </div>
            </div>
            
            {/* Right Hero Image */}
            <div className="w-full lg:w-[55%] relative flex justify-center mt-12 lg:mt-0">
              <div className="relative w-[300px] h-[600px] z-20 -rotate-12 translate-x-12 translate-y-12 hidden md:block">
                <div className="absolute inset-0 bg-black rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden shadow-black/50">
                  <div className="absolute top-0 w-full h-7 bg-black rounded-b-3xl z-10 mx-auto left-0 right-0 max-w-[150px]" />
                  <img src="/ss.png" alt="App screenshot" className="w-full h-full object-cover opacity-90" />
                </div>
              </div>
              <div className="relative w-[320px] h-[640px] z-30 absolute md:top-0 md:-rotate-6">
                <div className="absolute inset-0 bg-black rounded-[45px] border-[10px] border-black shadow-2xl overflow-hidden shadow-indigo-500/20">
                  <div className="absolute top-0 w-full h-7 bg-black rounded-b-3xl z-10 mx-auto left-0 right-0 max-w-[150px]" />
                  <img src="/splash.png" alt="App splash" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 bg-white relative z-20 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { icon: MessageSquare, color: "bg-blue-100 text-blue-600", title: "AI Chat", desc: "Get instant answers to any question" },
              { icon: ImageIcon, color: "bg-purple-100 text-purple-600", title: "Image Generation", desc: "Create stunning images with AI" },
              { icon: Video, color: "bg-pink-100 text-pink-600", title: "Video Creation", desc: "Generate videos in seconds" },
              { icon: Code, color: "bg-emerald-100 text-emerald-600", title: "Code Assistant", desc: "Write, debug and learn code" },
              { icon: FileText, color: "bg-orange-100 text-orange-600", title: "Document Tools", desc: "Summarize, rewrite and analyze files" },
              { icon: Mic, color: "bg-indigo-100 text-indigo-600", title: "Voice & More", desc: "Speak, transcribe and explore more" }
            ].map((tool, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white p-6 rounded-3xl hover:shadow-xl transition-all border border-slate-50 hover:border-slate-100 group">
                <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">{tool.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Section - One App Endless Possibilities */}
      <section className="py-24 bg-[#090b14] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Robot Graphic */}
            <div className="w-full lg:w-1/2 relative hidden md:block">
               <div className="w-full aspect-square md:aspect-[4/3] rounded-[40px] bg-gradient-to-tr from-indigo-900/40 to-slate-800/40 border border-white/10 relative overflow-hidden shadow-2xl flex items-center justify-center">
                  <div className="relative w-[280px] h-[580px] bg-black rounded-[40px] border-8 border-slate-800 shadow-xl overflow-hidden -rotate-6 scale-90 translate-y-10">
                     <div className="absolute top-0 w-full h-6 bg-black rounded-b-2xl z-10 mx-auto left-0 right-0 max-w-[120px]" />
                     <div className="absolute inset-0 bg-[#0d1117] flex flex-col items-center justify-center pt-20">
                       <div className="w-32 h-32 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-purple-500/20">
                          <img src="/logo.png" alt="DhandaGrow Logo" className="w-20 h-20 object-contain rounded-xl" />
                       </div>
                       <div className="text-white font-bold text-xl">DhandaGrow</div>
                       <div className="text-blue-400 text-sm mt-1 mb-8">Your AI Companion</div>
                       <div className="w-48 h-32 bg-slate-800 rounded-t-xl mt-auto relative overflow-hidden border-t border-slate-700">
                         <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-slate-600 rounded-full" />
                       </div>
                     </div>
                  </div>
                  {/* Floating Icons */}
                  <div className="absolute top-1/4 left-8 w-12 h-12 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center text-white animate-[bounce_4s_infinite]"><MessageSquare className="w-5 h-5"/></div>
                  <div className="absolute top-1/3 right-8 w-12 h-12 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center text-white animate-[bounce_5s_infinite]"><Code className="w-5 h-5"/></div>
                  <div className="absolute bottom-1/3 left-12 w-12 h-12 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center text-white animate-[bounce_6s_infinite]"><ImageIcon className="w-5 h-5"/></div>
                  <div className="absolute bottom-1/4 right-12 w-12 h-12 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center text-white animate-[bounce_3s_infinite]"><Mic className="w-5 h-5"/></div>
               </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                One App. Endless <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Possibilities.</span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 font-medium">
                Access all AI tools in a single, powerful app. Designed for creators, students, professionals and businesses.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  "User-Friendly Interface", "Light & Dark Mode",
                  "Regular Updates", "Works on All Devices",
                  "Secure & Private", "24/7 Support"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* How to Get the App */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Get the App</span>
              </h2>
              <p className="text-lg text-slate-500 mb-12 font-medium">
                Download and start using DhandaGrow in just a few simple steps.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between relative">
                {/* Step 1 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex-1 relative w-full sm:w-auto z-10 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold absolute -top-4 -left-4 shadow-lg">1</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Play className="w-8 h-8 text-slate-700" />
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-700 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.56.03 2.88.54 3.92 1.44-2.58 1.63-2.12 4.79.52 5.86-1.01 2.36-2.1 4.54-3.02 5.67zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Open App Store</h4>
                  <p className="text-xs text-slate-500">Go to Google Play Store or Apple App Store on your mobile device.</p>
                </div>
                
                <ArrowRight className="hidden sm:block w-6 h-6 text-slate-300 shrink-0" />
                
                {/* Step 2 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex-1 relative w-full sm:w-auto z-10 text-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold absolute -top-4 -left-4 shadow-lg">2</div>
                  <Download className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2">Search & Install</h4>
                  <p className="text-xs text-slate-500">Search for <strong>"DhandaGrow"</strong> and tap Install.</p>
                </div>

                <ArrowRight className="hidden sm:block w-6 h-6 text-slate-300 shrink-0" />

                {/* Step 3 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex-1 relative w-full sm:w-auto z-10 text-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold absolute -top-4 -left-4 shadow-lg">3</div>
                  <Zap className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2">Start Creating</h4>
                  <p className="text-xs text-slate-500">Open the app and explore powerful AI tools.</p>
                </div>
              </div>
            </div>

            {/* Right QR Box */}
            <div className="w-full lg:w-2/5">
               <div className="bg-[#f8f9fc] rounded-[40px] p-10 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/40 blur-[50px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/40 blur-[50px] rounded-full pointer-events-none" />
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Download Now</h3>
                  <p className="text-sm text-slate-500 mb-8 relative z-10">Scan the QR code or click below to get the app on your device.</p>
                  
                  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8 relative z-10">
                     <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://su-ai.com/download" alt="QR Code" className="w-32 h-32" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full max-w-[320px]">
                     <button className="h-[48px] bg-black rounded-xl flex-1 flex items-center justify-center gap-2 hover:scale-105 transition-transform px-4">
                        <Play className="w-4 h-4 text-white fill-current" />
                        <div className="flex flex-col items-start">
                           <span className="text-[8px] text-white/80 font-medium leading-none">GET IT ON</span>
                           <span className="text-sm text-white font-semibold leading-tight whitespace-nowrap">Google Play</span>
                        </div>
                     </button>
                     <button className="h-[48px] bg-black rounded-xl flex-1 flex items-center justify-center gap-2 hover:scale-105 transition-transform px-4">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.56.03 2.88.54 3.92 1.44-2.58 1.63-2.12 4.79.52 5.86-1.01 2.36-2.1 4.54-3.02 5.67zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        <div className="flex flex-col items-start">
                           <span className="text-[8px] text-white/80 font-medium leading-none">Download on the</span>
                           <span className="text-sm text-white font-semibold leading-tight whitespace-nowrap">App Store</span>
                        </div>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Glimpse Inside the App */}
      <section className="py-24 bg-[#f8f9fc] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              A Glimpse <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Inside</span> the App
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Clean, simple and powerful interface designed for everyone.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex justify-center items-center gap-6 overflow-hidden py-10 px-4">
              {/* Dummy Screenshots Carousel */}
              {[
                { title: "AI Chat", desc: "Get instant answers and creative ideas", color: "bg-blue-600", image: "/images/about-analytics.jpg" },
                { title: "Image Generation", desc: "Turn your imagination into reality", color: "bg-purple-600", image: "/images/about-reels.jpg" },
                { title: "Video Creation", desc: "Generate high-quality videos in seconds", color: "bg-pink-600", image: "/images/about-campaigns.jpg" },
                { title: "Code Assistant", desc: "Write, debug and learn code easily", color: "bg-emerald-600", image: "/images/about-social-posts.jpg" },
                { title: "Document Tools", desc: "Work smarter with your documents", color: "bg-orange-600", image: "/images/about-calendar.jpg" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[240px] hidden md:flex">
                  <div className="w-[240px] h-[500px] bg-slate-900 rounded-[35px] border-[6px] border-black shadow-2xl relative mb-6 overflow-hidden">
                    <div className="absolute top-0 w-full h-5 bg-black rounded-b-2xl z-10 mx-auto left-0 right-0 max-w-[100px]" />
                    <div className={`w-full h-full bg-slate-900 flex flex-col p-4 pt-10`}>
                       {/* Mock UI */}
                       <div className="w-full flex items-center justify-between mb-4 relative z-10">
                          <ChevronLeft className="w-5 h-5 text-white/50" />
                          <span className="text-white text-sm font-semibold">{item.title}</span>
                          <div className="w-5 h-5" />
                       </div>
                       <div className="flex-1 rounded-2xl bg-slate-800 border border-white/5 overflow-hidden flex items-center justify-center relative z-10">
                          <img src={item.image} alt="mock" className="w-full h-full object-cover opacity-60" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                          
                          {/* Floating UI Elements based on title */}
                          {item.title === 'Video Creation' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                              <Play className="w-5 h-5 text-white fill-current" />
                            </div>
                          )}
                          {item.title === 'Code Assistant' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 p-3 bg-slate-800 rounded-lg border border-slate-700 shadow-xl">
                              <div className="h-2 w-16 bg-blue-500 rounded mb-2"></div>
                              <div className="h-2 w-20 bg-green-400 rounded mb-2"></div>
                              <div className="h-2 w-12 bg-purple-400 rounded"></div>
                            </div>
                          )}
                       </div>
                       
                       <div className="mt-4 flex gap-2 relative z-10">
                          <div className="flex-1 bg-slate-800 rounded-xl h-10 flex items-center px-3 border border-slate-700">
                            <span className="text-white/30 text-[10px]">Type a message...</span>
                          </div>
                          <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                             <ArrowRight className="w-4 h-4 text-white" />
                          </div>
                       </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 text-center w-[200px]">{item.desc}</p>
                </div>
              ))}
              
              {/* Mobile Fallback View (Just 1 card) */}
              <div className="flex flex-col items-center min-w-[240px] md:hidden">
                  <div className="w-[280px] h-[580px] bg-slate-900 rounded-[40px] border-[8px] border-black shadow-2xl relative mb-6 overflow-hidden">
                    <div className="absolute top-0 w-full h-6 bg-black rounded-b-2xl z-10 mx-auto left-0 right-0 max-w-[120px]" />
                    <div className={`w-full h-full bg-slate-900 flex flex-col p-4 pt-12`}>
                       <div className="w-full flex items-center justify-between mb-4 relative z-10">
                          <ChevronLeft className="w-5 h-5 text-white/50" />
                          <span className="text-white text-sm font-semibold">AI Chat</span>
                          <div className="w-5 h-5" />
                       </div>
                       <div className="flex-1 rounded-3xl bg-slate-800 border border-white/5 overflow-hidden flex items-center justify-center relative z-10">
                          <img src="/images/about-analytics.jpg" alt="mock" className="w-full h-full object-cover opacity-60" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                       </div>
                       <div className="mt-4 flex gap-2 relative z-10">
                          <div className="flex-1 bg-slate-800 rounded-xl h-12 flex items-center px-4 border border-slate-700">
                            <span className="text-white/30 text-xs">Type a message...</span>
                          </div>
                          <div className={`w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center`}>
                             <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                       </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900">AI Chat</h4>
                  <p className="text-xs text-slate-500 text-center">Get instant answers and creative ideas</p>
                </div>
            </div>
            
            <button className="absolute left-0 top-[40%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20 hidden md:flex">
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <button className="absolute right-0 top-[40%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20 hidden md:flex">
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white relative border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Users</span> Worldwide
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Join millions who are already creating, learning and growing with DhandaGrow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Student", text: '"DhandaGrow app has made my study so much easier. I can get instant answers and create amazing notes."' },
              { name: "Rahul Mehta", role: "Content Creator", text: '"The image and video generation tools are incredible. Everything I need is in one app!"' },
              { name: "Aman Verma", role: "Developer", text: '"The code assistant saves me hours. Best AI app I have ever used."' }
            ].map((t, i) => (
              <div key={i} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl shadow-slate-200/40 relative">
                <div className="flex items-center gap-4 mb-6">
                  <img src={`https://i.pravatar.cc/150?img=${i+4}`} alt={t.name} className="w-14 h-14 rounded-full bg-slate-100 object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}</p>
                    <div className="flex text-yellow-400 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#f8f9fc] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Questions</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                Everything you need to know about the DhandaGrow app.
              </p>
            </div>
            <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 rounded-full">View All FAQs</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between font-semibold text-slate-900"
                >
                  <span className="pr-4">{faq.question}</span>
                  <Plus className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-45' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-slate-500 text-sm font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
