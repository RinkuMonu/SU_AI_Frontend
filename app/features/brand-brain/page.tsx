import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Brain, Fingerprint, PaintBucket, Type, FileImage, Sparkles, Network, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function BrandBrainPage() {
  return (
    <main className="min-h-screen bg-[#050014] text-white font-sans selection:bg-fuchsia-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center relative">
        {/* Deep Space / Neural Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/20 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-8 mx-auto shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">DhandaGrow Brand Brain™</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold mb-6 tracking-tight leading-[1.05]">
            An AI that actually <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">knows your business.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
            Stop repeating yourself to ChatGPT. The Brand Brain remembers your company's tone of voice, hex codes, exact products, target audience, and past campaigns forever.
          </p>
          
          <div className="flex justify-center gap-4 mb-20">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_40px_rgba(139,92,246,0.3)] border-0 flex items-center gap-2" asChild>
              <a href="/download">
                Train Your AI <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Neural Network UI Mockup */}
        <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[500px] mt-10">
           {/* Center Node */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-900 rounded-full border border-violet-500/50 shadow-[0_0_60px_rgba(139,92,246,0.4)] flex items-center justify-center z-20">
              <Brain className="w-12 h-12 text-violet-400" />
           </div>

           {/* Lines */}
           <svg className="absolute inset-0 w-full h-full -z-10" style={{ stroke: 'rgba(139,92,246,0.2)', strokeWidth: 2 }}>
              <line x1="50%" y1="50%" x2="20%" y2="20%" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" />
              <line x1="50%" y1="50%" x2="25%" y2="80%" />
              <line x1="50%" y1="50%" x2="75%" y2="75%" />
           </svg>

           {/* Floating Nodes */}
           {/* Node 1: Visual Identity */}
           <div className="absolute top-[15%] left-[15%] w-48 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-2xl flex flex-col items-center shadow-lg">
              <PaintBucket className="w-6 h-6 text-fuchsia-400 mb-2" />
              <span className="text-xs font-bold text-slate-300">Visual Identity</span>
              <div className="flex gap-1 mt-2">
                <div className="w-4 h-4 rounded-full bg-[#FF5733]"/>
                <div className="w-4 h-4 rounded-full bg-[#1A1A1A]"/>
                <div className="w-4 h-4 rounded-full bg-[#F0F0F0]"/>
              </div>
           </div>

           {/* Node 2: Tone of Voice */}
           <div className="absolute top-[20%] right-[15%] w-48 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-2xl flex flex-col items-center shadow-lg">
              <Type className="w-6 h-6 text-blue-400 mb-2" />
              <span className="text-xs font-bold text-slate-300">Tone of Voice</span>
              <span className="text-[10px] text-slate-400 mt-1 text-center">"Professional, but witty. Uses emojis sparingly."</span>
           </div>

           {/* Node 3: Products */}
           <div className="absolute bottom-[15%] left-[20%] w-48 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-2xl flex flex-col items-center shadow-lg">
              <FileImage className="w-6 h-6 text-emerald-400 mb-2" />
              <span className="text-xs font-bold text-slate-300">Product Catalog</span>
              <span className="text-[10px] text-slate-400 mt-1">452 Skus Synced</span>
           </div>

           {/* Node 4: Audience */}
           <div className="absolute bottom-[20%] right-[20%] w-48 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-2xl flex flex-col items-center shadow-lg">
              <Fingerprint className="w-6 h-6 text-amber-400 mb-2" />
              <span className="text-xs font-bold text-slate-300">Target Audience</span>
              <span className="text-[10px] text-slate-400 mt-1 text-center">Gen Z, Urban India, Fashion-forward</span>
           </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Consistent branding across every AI output.</h2>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto">When every tool shares the same "Brain", your marketing never looks generic.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                 <div className="w-12 h-12 bg-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center mb-6">
                   <Type className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">Never Write Prompts Again</h3>
                 <p className="text-slate-400 leading-relaxed text-sm">
                   You don't need to type "Write a caption for this product in a funny tone targeting millennials". Just click "Generate". The Brain already knows your tone and audience.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                 <div className="w-12 h-12 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl flex items-center justify-center mb-6">
                   <PaintBucket className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">Color & Asset Memory</h3>
                 <p className="text-slate-400 leading-relaxed text-sm">
                   When the AI generates a Website, an Ad, or a Festival Poster, it automatically applies your exact brand colors, typography, and logo without you ever asking.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                 <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                   <Network className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">Cross-Tool Intelligence</h3>
                 <p className="text-slate-400 leading-relaxed text-sm">
                   The CRM talks to the Ad Maker. If the CRM notices people are buying red shirts, it tells the Brand Brain, which then tells the Ad Maker to generate more ads for red shirts.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                 <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">Rules & Guardrails</h3>
                 <p className="text-slate-400 leading-relaxed text-sm">
                   Set strict rules. E.g., "Never offer discounts above 20%", or "Never use competitor names". The AI enforces these rules across DM replies, ads, and website copy.
                 </p>
              </div>

           </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-24 bg-[#050014]">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center text-white">How to train your Brain.</h2>
            
            <div className="space-y-8">
               <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900 border border-slate-800 rounded-3xl p-8">
                  <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center font-bold text-2xl text-white shrink-0">1</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Paste your Website URL</h3>
                    <p className="text-slate-400">The AI crawls your existing website to automatically extract your colors, fonts, mission statement, and tone of voice in 10 seconds.</p>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900 border border-slate-800 rounded-3xl p-8">
                  <div className="w-16 h-16 rounded-full bg-fuchsia-600 flex items-center justify-center font-bold text-2xl text-white shrink-0">2</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Upload Assets</h3>
                    <p className="text-slate-400">Drop in your logo files and product catalogs. The AI stores them in a highly optimized vector database for instant retrieval.</p>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900 border border-slate-800 rounded-3xl p-8">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center font-bold text-2xl text-white shrink-0">3</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Auto-Updates Forever</h3>
                    <p className="text-slate-400">As you launch new campaigns and edit the AI's outputs, it learns your preferences and gets smarter every single day.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-violet-900 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
         <div className="max-w-4xl mx-auto px-4 relative z-10">
           <Cpu className="w-16 h-16 text-violet-300 mx-auto mb-6" />
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Give your business a memory.</h2>
           <p className="text-violet-200 text-xl mb-10">Stop treating AI like a blank slate. Start building a digital co-founder.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-violet-900 hover:bg-slate-100 font-bold shadow-xl border-0" asChild>
             <a href="/download">Setup Brand Brain</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
