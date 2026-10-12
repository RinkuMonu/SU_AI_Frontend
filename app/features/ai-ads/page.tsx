import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Zap, MousePointerClick, BarChart3, LayoutTemplate, Layers, SplitSquareHorizontal, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AIAdsPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white selection:bg-emerald-500/30 selection:text-white font-sans">
      <Navbar />
      
      {/* High-Performance Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Abstract Data Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                AI Advertisement Maker
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.05]">
              Ads that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">convert.</span><br/>
              On autopilot.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 font-light max-w-lg">
              Stop guessing what works. Generate high-converting Meta, Google, and TikTok ad creatives instantly. Optimized by AI for maximum ROI and lower acquisition costs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-base rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] border-0 flex items-center gap-2" asChild>
                <a href="/download">
                  Generate Ad Creatives <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-10">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white tracking-tight">3.5x</span>
                <span className="text-sm text-slate-500 font-medium">Avg. CTR Increase</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white tracking-tight">-40%</span>
                <span className="text-sm text-slate-500 font-medium">Lower CPA</span>
              </div>
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="w-full lg:w-1/2 relative">
            <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
              {/* Fake Window Header */}
              <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-slate-800" />
                <div className="w-3 h-3 rounded-full bg-slate-800" />
                <div className="w-3 h-3 rounded-full bg-slate-800" />
                <div className="ml-4 text-xs text-slate-500 font-mono">campaign-dashboard.exe</div>
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="flex-1 p-6 flex gap-6 relative">
                {/* Sidebar */}
                <div className="w-1/3 flex flex-col gap-4">
                  <div className="h-24 bg-slate-800 rounded-xl border border-slate-700 p-3 relative overflow-hidden">
                     <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Variant A (Winning)</div>
                     <div className="text-2xl font-bold text-emerald-400">4.8% CTR</div>
                     <TrendingUp className="absolute bottom-3 right-3 w-8 h-8 text-emerald-500/20" />
                  </div>
                  <div className="h-24 bg-slate-800/50 rounded-xl border border-slate-700/50 p-3 relative overflow-hidden">
                     <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Variant B</div>
                     <div className="text-2xl font-bold text-slate-300">1.2% CTR</div>
                  </div>
                </div>
                
                {/* Main Preview */}
                <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative group">
                  <img src="/images/about-social-posts.jpg" className="w-full h-full object-cover opacity-80" alt="Ad Creative Preview" />
                  
                  {/* Overlay UI */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                     <div className="flex justify-between items-start">
                        <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">HIGH CONVERSION</span>
                        <span className="bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Instagram Story</span>
                     </div>
                     <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 border border-white/10 translate-y-8 group-hover:translate-y-0 transition-transform">
                        <p className="text-xs font-semibold text-white mb-1">Generated Hook:</p>
                        <p className="text-[11px] text-emerald-300">"Stop wasting time on manual posts. Do this instead 👇"</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Element */}
            <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.2)] flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">AI Suggestion</p>
                <p className="text-sm text-white font-medium">Target audience match: 98%</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-[#05080f] relative border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              One platform. Every ad format.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We've trained our models on millions of high-performing ads to know exactly what drives clicks on each specific platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Box 1 (Spans 2 columns on desktop) */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
              <div className="relative z-10 w-2/3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
                  <SplitSquareHorizontal className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Automated A/B Testing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Never rely on gut feelings. AI generates 10 distinct variations of your ad (different hooks, imagery, and CTAs) so you can test and find the absolute winner immediately.
                </p>
              </div>
              {/* Graphic */}
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 aspect-square bg-slate-900 border border-slate-800 rounded-tl-3xl shadow-2xl flex flex-col gap-2 p-4">
                <div className="h-10 w-full bg-emerald-500/20 rounded border border-emerald-500/30 flex items-center px-3"><span className="text-emerald-400 text-xs font-bold">Variant A: 4.8% CTR</span></div>
                <div className="h-10 w-3/4 bg-slate-800 rounded flex items-center px-3"><span className="text-slate-500 text-xs font-bold">Variant B: 1.2% CTR</span></div>
                <div className="h-10 w-1/2 bg-slate-800 rounded flex items-center px-3"><span className="text-slate-500 text-xs font-bold">Variant C: 0.8% CTR</span></div>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-8 overflow-hidden relative group">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 border border-pink-500/30">
                <LayoutTemplate className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Omnichannel Resize</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Design once. Our AI automatically resizes and re-layouts your creative for Instagram Stories (9:16), Facebook Feed (4:5), and Google Display banners perfectly.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-8 overflow-hidden relative group">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Persuasive Copywriting</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The AI writes scroll-stopping hooks, persuasive primary text, and high-converting headlines tailored to your specific audience demographics.
              </p>
            </div>

            {/* Box 4 (Spans 2 columns) */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-8 overflow-hidden relative group flex items-center">
              <div className="w-1/2 pr-8 relative z-10">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30">
                  <MousePointerClick className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Direct Integration</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Connect your Facebook Ads Manager and Google Ads account. Push winning creatives directly into your live campaigns without downloading a single file.
                </p>
              </div>
              <div className="w-1/2 h-full relative">
                <div className="absolute inset-y-0 right-0 w-[150%] bg-slate-950 rounded-l-3xl border-y border-l border-slate-800 shadow-xl p-6 flex flex-col justify-center gap-4">
                   <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                     <span className="font-semibold text-sm">Meta Ads Manager</span>
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                     <span className="font-semibold text-sm">Google Ads</span>
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0A0F1C] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <BarChart3 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Stop burning ad spend on bad creatives.
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
            Join performance marketers who use DhandaGrow to generate, test, and scale winning ads automatically.
          </p>
          <Button size="lg" className="h-16 px-12 text-lg rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] border-0" asChild>
            <a href="/download">Launch Your Campaign</a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
