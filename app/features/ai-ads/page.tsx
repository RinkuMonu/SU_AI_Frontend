import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Zap, MousePointerClick, BarChart3, LayoutTemplate, Layers, SplitSquareHorizontal, CheckCircle2, ArrowRight } from 'lucide-react';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';

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
       <FeatureShowcaseSection feature="ai-ads" />

      <section className="relative overflow-hidden bg-[#0b1220] py-20 text-white sm:py-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-emerald-400 sm:text-sm">
              Inside the creative lab
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Test the idea before you scale the spend.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              Put different hooks and creative directions side by side. See how each version supports the campaign goal before deciding what to take forward.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: SplitSquareHorizontal, title: 'Compare distinct angles', detail: 'Explore different openings, offers, and calls to action.' },
                { icon: Target, title: 'Keep the audience in focus', detail: 'Shape each concept around the people you want to reach.' },
                { icon: TrendingUp, title: 'Build on what resonates', detail: 'Use campaign results as input for your next creative round.' },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Creative test</p>
                <p className="mt-1 font-semibold text-white">Summer launch · Round 01</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">In review</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'A', hook: 'Meet your new everyday essential', metric: 'Clear product benefit', width: 'w-[82%]', winner: true },
                { label: 'B', hook: 'The upgrade your routine has been waiting for', metric: 'Curiosity-led opening', width: 'w-[61%]', winner: false },
                { label: 'C', hook: 'A little more comfort, every day', metric: 'Lifestyle-led message', width: 'w-[45%]', winner: false },
              ].map((variant) => (
                <article key={variant.label} className={`rounded-2xl border p-4 ${variant.winner ? 'border-emerald-400/40 bg-emerald-400/[0.06]' : 'border-white/10 bg-slate-950/70'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${variant.winner ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                        {variant.label}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold leading-5 text-white">{variant.hook}</h3>
                        <p className="mt-1 text-xs text-slate-400">{variant.metric}</p>
                      </div>
                    </div>
                    {variant.winner && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />}
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${variant.winner ? 'bg-emerald-400' : 'bg-slate-600'} ${variant.width}`} />
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Preview concepts side by side, then use real campaign performance to inform your decisions.
            </p>
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

      <FeatureExpansionSections feature="ai-ads" />
      <section className="border-y border-white/10 bg-[#0b1220] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-sm">
              A more considered workflow
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Build, compare, and refine your next ad.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Give every creative a clear purpose, then use what you learn to make the next campaign more relevant.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Target,
                number: '01',
                title: 'Start with the audience',
                description: 'Define who you want to reach and what you want them to understand about your offer.',
              },
              {
                icon: Layers,
                number: '02',
                title: 'Explore creative angles',
                description: 'Create variations in hooks, messages, and layouts without losing sight of the campaign goal.',
              },
              {
                icon: TrendingUp,
                number: '03',
                title: 'Learn from each test',
                description: 'Compare the results, keep the ideas that connect, and use those signals to guide your next iteration.',
              },
            ].map(({ icon: Icon, number, title, description }) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold tracking-widest text-slate-500">{number}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1220] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-sm">
              Choose your campaign objective
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Every ad starts with a reason to show up.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              Keep the creative grounded in what you want people to do, whether you are introducing an offer or bringing interested shoppers back.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Zap, title: 'Build awareness', description: 'Introduce your brand or a new product with a message people can quickly understand.', tag: 'Reach new audiences' },
              { icon: MousePointerClick, title: 'Drive consideration', description: 'Give interested customers a clear reason to learn more about what you offer.', tag: 'Earn meaningful clicks' },
              { icon: BarChart3, title: 'Encourage action', description: 'Make the offer and next step easy to spot when customers are ready to decide.', tag: 'Support conversions' },
            ].map(({ icon: Icon, title, description, tag }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-emerald-400/30 sm:p-8">
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 min-h-[72px] leading-6 text-slate-300">{description}</p>
                <span className="mt-5 inline-flex rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">{tag}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080d17] py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-sm">
              Creative that fits the placement
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One campaign idea. Ready for every screen.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              Keep your offer recognizable as you adapt the format, message, and visual hierarchy for each place your audience sees it.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                'Choose a format that suits the placement',
                'Keep the offer and call to action clear',
                'Review each version before it goes live',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-200 sm:text-base">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Campaign preview</p>
                <p className="mt-1 font-semibold text-white">Spring product launch</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                3 placements
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: 'Social feed', format: '4:5 portrait', size: 'aspect-[4/5]' },
                { name: 'Story', format: '9:16 vertical', size: 'aspect-[9/16]' },
                { name: 'Display', format: 'Wide banner', size: 'aspect-[4/3]' },
              ].map((placement, index) => (
                <div key={placement.name} className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                  <div
                    className={`${placement.size} relative flex items-end overflow-hidden rounded-xl bg-gradient-to-br ${
                      index === 1 ? 'from-emerald-200 via-teal-100 to-cyan-100' : 'from-slate-200 via-emerald-100 to-teal-200'
                    } p-3`}
                  >
                    <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full border-[10px] border-white/40" />
                    <div className="relative w-full rounded-lg bg-white/90 p-2.5 shadow-sm backdrop-blur">
                      <span className="block text-[8px] font-bold uppercase tracking-wider text-emerald-800">New collection</span>
                      <span className="mt-1 block text-[10px] font-bold leading-tight text-slate-900">Made for your everyday</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-white">{placement.name}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{placement.format}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
