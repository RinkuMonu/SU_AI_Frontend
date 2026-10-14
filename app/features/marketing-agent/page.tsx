import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import { Bot, MessageSquare, ArrowRight, Zap, Target, LineChart, Sparkles, CheckCircle2, CircleDashed } from 'lucide-react';

export default function MarketingAgentPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Hero: Split Conversational Interface */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 mb-8">
              <Bot className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Meet Your AI CMO</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-[1.1]">
              Marketing strategies that <span className="text-indigo-600">execute themselves.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium">
              Tell the AI your business goals. It researches your industry, builds a 30-day marketing strategy, generates the content, and runs the campaigns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg flex items-center gap-2" asChild>
                <a href="/download">Hire Your AI Agent <ArrowRight className="w-5 h-5" /></a>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm font-semibold text-slate-500">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 24/7 Execution</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Data-Driven</div>
            </div>
          </div>
          
          {/* Right: Mock Terminal/Chat UI */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col h-[500px]">
              {/* Header */}
              <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-4 bg-slate-50/50 shrink-0">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                   <Bot className="w-5 h-5 text-indigo-600" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 leading-none">DhandaGrow Agent</h3>
                   <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online & Thinking</span>
                 </div>
              </div>
              
              {/* Chat Body */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto bg-slate-50">
                 {/* User Message */}
                 <div className="self-end bg-slate-900 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                   <p className="text-sm font-medium">I run a local bakery. I need a campaign to get more foot traffic this weekend. Budget is ₹2000.</p>
                 </div>
                 
                 {/* AI Response */}
                 <div className="self-start bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm flex flex-col gap-4">
                   <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                     <Sparkles className="w-4 h-4" /> Analyzing local bakery trends...
                   </div>
                   <p className="text-sm text-slate-700 leading-relaxed">
                     I've built a "Weekend Treat" strategy tailored for local foot traffic:
                   </p>
                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Generated 3 Instagram Reels</div>
                     <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Wrote 5 local-SEO targeted posts</div>
                     <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><CircleDashed className="w-4 h-4 text-indigo-500 animate-spin" /> Setting up Meta Ads with 5km radius...</div>
                   </div>
                   <Button variant="outline" size="sm" className="w-full text-xs font-bold border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                     Review Campaign
                   </Button>
                 </div>
              </div>
              
              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <div className="h-12 bg-slate-100 rounded-full flex items-center px-4 justify-between">
                  <span className="text-slate-400 text-sm">Give your agent a task...</span>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Vertical Timeline Features */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#0b1220] py-24 text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">How the Agent Works</h2>
            <p className="text-slate-300 text-lg">It's not just a chat bot. It's a proactive execution engine.</p>
          </div>
          
          <div className="relative border-l-2 border-indigo-400/30 ml-6 md:ml-1/2 space-y-16 pb-12">
             {/* Step 1 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-400/15 rounded-full border-4 border-[#0b1220] flex items-center justify-center shadow-sm">
                 <Target className="w-4 h-4 text-indigo-300" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">1. Objective Setting</h3>
               <p className="text-slate-300 leading-relaxed text-lg">
                 Tell the agent what you want. "More local leads", "Push dead stock", or "Build brand awareness". The agent asks clarifying questions to narrow down the exact KPI.
               </p>
             </div>
             
             {/* Step 2 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-400/15 rounded-full border-4 border-[#0b1220] flex items-center justify-center shadow-sm">
                 <Zap className="w-4 h-4 text-indigo-300" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">2. Strategy Generation</h3>
               <p className="text-slate-300 leading-relaxed text-lg">
                 The agent analyzes competitor data and industry trends to create a step-by-step roadmap. It decides the platforms, content types, and budget allocation automatically.
               </p>
             </div>
             
             {/* Step 3 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-400/15 rounded-full border-4 border-[#0b1220] flex items-center justify-center shadow-sm">
                 <MessageSquare className="w-4 h-4 text-indigo-300" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">3. Content Creation</h3>
               <p className="text-slate-300 leading-relaxed text-lg">
                 It doesn't just plan; it creates. The agent automatically writes the captions, generates the images, and creates the video scripts needed for the entire campaign.
               </p>
             </div>
             
             {/* Step 4 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-400/15 rounded-full border-4 border-[#0b1220] flex items-center justify-center shadow-sm">
                 <LineChart className="w-4 h-4 text-indigo-300" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">4. Autonomous Execution</h3>
               <p className="text-slate-300 leading-relaxed text-lg">
                 Once you approve, it schedules the posts, sets up the Meta/Google ads, monitors the performance daily, and pauses underperforming ads automatically.
               </p>
             </div>
          </div>
        </div>
      </section>

      <section className="bg-[#070b14] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 sm:text-sm">
              Your campaign command center
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Keep the plan, content, and next steps connected.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              See the moving parts of a campaign together, from its objective and creative tasks to the signals worth reviewing.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active plan</p>
                  <h3 className="mt-1 text-xl font-bold">Weekend foot traffic</h3>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">On track</span>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Target, label: 'Campaign objective', value: 'Reach nearby customers', state: 'Defined' },
                  { icon: Sparkles, label: 'Creative direction', value: 'Weekend Treat offer', state: 'Ready to review' },
                  { icon: MessageSquare, label: 'Social content', value: '3 short-form concepts', state: 'Drafted' },
                  { icon: LineChart, label: 'Performance check', value: 'Review campaign signals', state: 'Next step' },
                ].map(({ icon: Icon, label, value, state }, index) => (
                  <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
                    </div>
                    <span className={`hidden text-right text-xs font-medium sm:block ${index < 2 ? 'text-emerald-300' : 'text-slate-400'}`}>{state}</span>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${index < 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex flex-col justify-between rounded-3xl border border-indigo-300/20 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-slate-950 p-6 sm:p-8">
              <div>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-300/10 text-indigo-200">
                  <Bot className="h-6 w-6" />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Agent insight</p>
                <h3 className="mt-3 text-2xl font-bold leading-snug">Make the next action clear to your team.</h3>
                <p className="mt-4 leading-7 text-slate-300">
                  Keep each task connected to the campaign goal, so it is easier to review what is ready and what needs attention.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Plan ready for review</p>
                  <p className="mt-1 text-xs text-slate-400">You stay in control of what goes live.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <FeatureShowcaseSection feature="marketing-agent" />
      <FeatureExpansionSections feature="marketing-agent" />
      <section className="py-24 bg-black text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Hire the smartest marketer.</h2>
          <p className="text-indigo-100 text-xl mb-10">Available 24/7. Never takes a day off. Constantly optimizing.</p>
          <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-indigo-600 hover:bg-slate-100 font-bold shadow-2xl border-0" asChild>
            <a href="/download">Start Free Trial</a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
