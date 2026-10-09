import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
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
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">How the Agent Works</h2>
            <p className="text-slate-500 text-lg">It's not just a chat bot. It's a proactive execution engine.</p>
          </div>
          
          <div className="relative border-l-2 border-indigo-100 ml-6 md:ml-1/2 space-y-16 pb-12">
             {/* Step 1 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                 <Target className="w-4 h-4 text-indigo-600" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">1. Objective Setting</h3>
               <p className="text-slate-600 leading-relaxed text-lg">
                 Tell the agent what you want. "More local leads", "Push dead stock", or "Build brand awareness". The agent asks clarifying questions to narrow down the exact KPI.
               </p>
             </div>
             
             {/* Step 2 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                 <Zap className="w-4 h-4 text-indigo-600" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">2. Strategy Generation</h3>
               <p className="text-slate-600 leading-relaxed text-lg">
                 The agent analyzes competitor data and industry trends to create a step-by-step roadmap. It decides the platforms, content types, and budget allocation automatically.
               </p>
             </div>
             
             {/* Step 3 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                 <MessageSquare className="w-4 h-4 text-indigo-600" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">3. Content Creation</h3>
               <p className="text-slate-600 leading-relaxed text-lg">
                 It doesn't just plan; it creates. The agent automatically writes the captions, generates the images, and creates the video scripts needed for the entire campaign.
               </p>
             </div>
             
             {/* Step 4 */}
             <div className="relative pl-10 md:pl-16">
               <div className="absolute -left-5 top-0 w-10 h-10 bg-indigo-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                 <LineChart className="w-4 h-4 text-indigo-600" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">4. Autonomous Execution</h3>
               <p className="text-slate-600 leading-relaxed text-lg">
                 Once you approve, it schedules the posts, sets up the Meta/Google ads, monitors the performance daily, and pauses underperforming ads automatically.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-indigo-600 text-center">
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
