import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Bot, Mic, Sparkles, Code, Megaphone, LineChart, Headphones, ArrowRight, Zap, Play } from 'lucide-react';

export default function UNIAIPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-slate-700">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-100/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Bot className="w-4 h-4 text-slate-300" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Meet UNI AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-extrabold mb-6 tracking-tight leading-[1.0]">
            Your new <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Co-Founder.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12 font-medium max-w-2xl mx-auto">
            UNI isn't just a chatbot. It's the central brain that commands your entire business. Speak to it, and watch it execute marketing, sales, and analytics autonomously.
          </p>

          {/* Voice Command UI Mockup */}
          <div className="w-full max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-white/10 p-6 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
             
             <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] relative">
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                  <Mic className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 text-left">
                  <p className="text-slate-400 text-sm font-semibold mb-2">Try saying...</p>
                  <p className="text-xl md:text-2xl font-bold text-white leading-tight">
                    "UNI, launch a Diwali campaign with a 20% discount on all shoes across Meta and Instagram."
                  </p>
                </div>
                
                <Button className="h-16 w-16 md:w-auto md:px-8 rounded-full bg-white text-black hover:bg-slate-200 shrink-0">
                  <span className="hidden md:inline font-bold">Execute</span>
                  <Play className="w-6 h-6 md:hidden fill-black" />
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* The Execution Ripple (What happens after the command) */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">One command. Total execution.</h2>
           <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16">Here is what UNI automatically does when you give that single command:</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                <Megaphone className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-white mb-2">1. Ad Maker</h3>
                <p className="text-sm text-slate-400">Generates 10 different Diwali ad creatives and copywriting variants for A/B testing.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                <Code className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="font-bold text-white mb-2">2. Website Builder</h3>
                <p className="text-sm text-slate-400">Creates a dedicated /diwali-sale landing page and automatically applies the 20% discount.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <Headphones className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="font-bold text-white mb-2">3. CRM & DM AI</h3>
                <p className="text-sm text-slate-400">Instructs the Instagram DM bot to tell customers about the Diwali sale if they ask for prices.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
                <LineChart className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="font-bold text-white mb-2">4. Analytics</h3>
                <p className="text-sm text-slate-400">Sets up tracking links and creates a real-time dashboard to monitor the campaign's ROAS.</p>
              </div>

           </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">More than just a prompt box.</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              <div className="flex gap-6 p-8 rounded-3xl bg-black border border-white/10 hover:border-white/20 transition-all">
                 <div className="w-14 h-14 bg-white/5 text-white rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                   <Zap className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Proactive Intelligence</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      UNI doesn't just wait for you to ask. If traffic drops on a Tuesday, UNI sends you a WhatsApp message suggesting a quick flash sale to boost numbers.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-black border border-white/10 hover:border-white/20 transition-all">
                 <div className="w-14 h-14 bg-white/5 text-white rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                   <Mic className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Voice & Multi-Modal</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      Talk to UNI while driving. Send it a voice note saying "Generate a report for last week", and the PDF will be waiting in your email when you arrive.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-black border border-white/10 hover:border-white/20 transition-all">
                 <div className="w-14 h-14 bg-white/5 text-white rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                   <Bot className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Orchestration</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      UNI is the master controller of all DhandaGrow tools. It orchestrates the Brand Brain, the Ad Maker, and the CRM to work together in perfect sync.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-black border border-white/10 hover:border-white/20 transition-all">
                 <div className="w-14 h-14 bg-white/5 text-white rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                   <Sparkles className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Business Strategy</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      Ask complex questions like "How can I reduce my Customer Acquisition Cost?" and UNI will analyze your actual data to give you a step-by-step mathematical plan.
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
         
         <div className="max-w-4xl mx-auto px-4 relative z-10">
           <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">Talk to UNI today.</h2>
           <p className="text-xl text-slate-400 mb-10">Experience the future of business management.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-black hover:bg-slate-200 font-bold shadow-[0_0_40px_rgba(255,255,255,0.2)] border-0" asChild>
             <a href="/download">Wake Up UNI</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
