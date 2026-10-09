import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Globe, Wand2, Layout, Smartphone, Search, Zap, Code, ArrowRight, Gauge, CheckCircle2 } from 'lucide-react';

export default function WebsiteBuilderPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 mx-auto lg:mx-0">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">AI Website Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white leading-[1.1]">
              A complete website in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">60 seconds.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 font-medium max-w-lg mx-auto lg:mx-0">
              No drag-and-drop. No coding. Just tell the AI about your business, and it generates a stunning, fully-functional, SEO-optimized website instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="h-16 px-10 text-lg rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 border-0 flex items-center gap-2" asChild>
                <a href="/download">
                  Generate Your Website <Wand2 className="w-5 h-5" />
                </a>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Hosting</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom Domain</div>
            </div>
          </div>
          
          {/* Browser UI Mockup */}
          <div className="w-full lg:w-1/2 relative z-10 perspective-1000">
             <div className="w-[110%] -ml-[5%] lg:ml-0 lg:w-full bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden transform rotate-x-12 rotate-y-[-10deg] hover:rotate-0 transition-transform duration-700">
               {/* Browser Header */}
               <div className="h-10 bg-slate-950 flex items-center px-4 gap-2 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="ml-4 flex-1 h-6 bg-slate-800 rounded flex items-center px-3 text-[10px] text-slate-400 font-mono">
                    https://your-business.com
                  </div>
               </div>
               
               {/* Website Generation UI */}
               <div className="p-4 bg-slate-900 h-[400px] flex flex-col gap-4 relative overflow-hidden">
                  
                  {/* Generated Block 1 */}
                  <div className="bg-slate-800 rounded-lg p-6 flex items-center gap-6 animate-pulse" style={{ animationDuration: '3s' }}>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-700 rounded w-1/4" />
                      <div className="h-8 bg-slate-600 rounded w-3/4" />
                      <div className="h-3 bg-slate-700 rounded w-full" />
                      <div className="h-3 bg-slate-700 rounded w-5/6" />
                      <div className="h-10 bg-blue-500 rounded w-32 mt-4" />
                    </div>
                    <div className="w-1/3 aspect-square bg-slate-700 rounded-lg" />
                  </div>
                  
                  {/* Generated Block 2 */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="h-32 bg-slate-800 rounded-lg p-4 space-y-2">
                       <div className="w-8 h-8 bg-indigo-500/20 rounded-full" />
                       <div className="h-3 bg-slate-700 rounded w-3/4" />
                       <div className="h-2 bg-slate-700 rounded w-full" />
                     </div>
                     <div className="h-32 bg-slate-800 rounded-lg p-4 space-y-2">
                       <div className="w-8 h-8 bg-pink-500/20 rounded-full" />
                       <div className="h-3 bg-slate-700 rounded w-3/4" />
                       <div className="h-2 bg-slate-700 rounded w-full" />
                     </div>
                     <div className="h-32 bg-slate-800 rounded-lg p-4 space-y-2">
                       <div className="w-8 h-8 bg-emerald-500/20 rounded-full" />
                       <div className="h-3 bg-slate-700 rounded w-3/4" />
                       <div className="h-2 bg-slate-700 rounded w-full" />
                     </div>
                  </div>

                  {/* AI Overlay */}
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl flex items-center gap-4 shadow-2xl">
                      <Wand2 className="w-6 h-6 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
                      <div className="flex flex-col">
                        <span className="font-bold text-white">AI is building your site...</span>
                        <span className="text-xs text-slate-400">Writing copy & generating images</span>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
          </div>
          
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="py-24 bg-[#0B1120] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-white">From idea to live in 3 steps.</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-800 -z-10 -translate-y-1/2" />
              
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative">
                 <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">1</div>
                 <h3 className="text-xl font-bold mb-3 text-white">Tell the AI</h3>
                 <p className="text-slate-400 text-sm">Enter your business name, industry, and a short description. E.g., "A premium coffee shop in Mumbai."</p>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative">
                 <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">2</div>
                 <h3 className="text-xl font-bold mb-3 text-white">AI Generates</h3>
                 <p className="text-slate-400 text-sm">The engine writes persuasive copy, generates beautiful images, and builds the UI layout automatically.</p>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative">
                 <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">3</div>
                 <h3 className="text-xl font-bold mb-3 text-white">Publish Live</h3>
                 <p className="text-slate-400 text-sm">Click publish and your site is live on a custom domain instantly, ready to collect leads and payments.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Everything you need to grow online.</h2>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto">It's not just a beautiful webpage. It's a fully-functional business engine.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <Layout className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Infinite Re-designs</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Don't like the layout? Click "Regenerate" and the AI will completely rebuild the site with a new theme, color palette, and structure.</p>
              </div>
              
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <Smartphone className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">100% Mobile Responsive</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Over 80% of traffic comes from mobile. Your AI-generated site is perfectly optimized for phones and tablets right out of the box.</p>
              </div>

              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <Search className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Built-in Local SEO</h3>
                <p className="text-slate-400 text-sm leading-relaxed">The AI automatically writes meta tags, schema markup, and alt-text tailored to your local area so you rank higher on Google.</p>
              </div>

              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <Zap className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Lead Capture Forms</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Collect customer information easily. Forms are automatically generated and linked directly to your DhandaGrow CRM.</p>
              </div>

              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <Code className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">No Maintenance</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Forget about WordPress updates, plugin conflicts, and server crashes. We host and maintain everything on enterprise infrastructure.</p>
              </div>
              
              {/* Performance Card */}
              <div className="bg-gradient-to-br from-emerald-900/50 to-slate-800/50 p-8 rounded-3xl border border-emerald-500/30">
                <Gauge className="w-8 h-8 text-emerald-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Sites are statically generated on the edge for sub-second load times.</p>
                <div className="flex gap-2">
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-xs font-bold font-mono">Perf: 100</div>
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-xs font-bold font-mono">SEO: 100</div>
                </div>
              </div>
              
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0B1120] text-center border-t border-slate-800">
         <div className="max-w-4xl mx-auto px-4">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Stop paying agencies ₹50,000 for a website.</h2>
           <p className="text-xl text-slate-400 mb-10">Get a stunning, high-converting website live today for a fraction of the cost.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl border-0" asChild>
             <a href="/download">Generate My Website Now</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
