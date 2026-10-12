import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Send, Sparkles, Clock, TrendingUp, Users, Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function InstagramDMPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 relative">
          
          <div className="w-full lg:w-1/2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 border border-pink-200 mb-6">
              <MessageCircle className="w-4 h-4 text-pink-600" />
              <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">Instagram DM AI</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-[1.1]">
              Turn followers into <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">paying customers.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium">
              Don't lose sales because you replied too late. Our AI instantly answers DMs, recommends products, sends payment links, and books appointments 24/7 directly inside Instagram.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold shadow-xl shadow-pink-500/20 border-0" asChild>
                <a href="/download">Automate Your DMs</a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-200">
               <div>
                 <h4 className="text-3xl font-bold text-slate-900 mb-1">0s</h4>
                 <p className="text-sm font-semibold text-slate-500">Response Time</p>
               </div>
               <div>
                 <h4 className="text-3xl font-bold text-slate-900 mb-1">3x</h4>
                 <p className="text-sm font-semibold text-slate-500">More Conversions</p>
               </div>
               <div>
                 <h4 className="text-3xl font-bold text-slate-900 mb-1">24/7</h4>
                 <p className="text-sm font-semibold text-slate-500">Availability</p>
               </div>
            </div>
          </div>
          
          {/* Phone Mockup UI */}
          <div className="w-full lg:w-1/2 relative flex justify-center">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-[80px] rounded-full -z-10" />
             
             {/* Phone Container */}
             <div className="w-[320px] h-[650px] bg-white rounded-[40px] shadow-2xl border-[8px] border-slate-900 overflow-hidden relative flex flex-col">
               {/* Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
               
               {/* IG Header */}
               <div className="h-20 bg-white border-b border-slate-100 flex items-end justify-between px-4 pb-3 z-10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/150?img=32" alt="Avatar"/></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold leading-tight">Sarah Jenkins</span>
                      <span className="text-[10px] text-slate-500">Active now</span>
                    </div>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 bg-slate-50 p-4 flex flex-col gap-4 overflow-y-auto">
                 <div className="text-center text-[10px] text-slate-400 font-medium my-2">Today 2:45 PM</div>
                 
                 {/* User Msg */}
                 <div className="self-end bg-slate-200 text-slate-900 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-sm shadow-sm">
                   Hey! Is the floral summer dress still in stock in medium?
                 </div>

                 {/* AI Typing Indicator */}
                 <div className="self-start bg-white border border-slate-100 px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>

                 {/* AI Reply */}
                 <div className="self-start bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm shadow-md mt-[-8px]">
                   <p className="mb-2">Hi Sarah! 👋 Yes, we have exactly 3 pieces left in Medium for the Floral Summer Dress.</p>
                   <div className="bg-white/20 p-2 rounded-lg mb-2 flex gap-2">
                     <div className="w-12 h-12 bg-white/50 rounded-md overflow-hidden"><img src="/images/about-business.jpg" alt="Dress" className="w-full h-full object-cover" /></div>
                     <div className="flex flex-col justify-center">
                       <span className="font-bold text-xs">Floral Dress</span>
                       <span className="text-[10px] opacity-90">₹1,499</span>
                     </div>
                   </div>
                   <p className="font-semibold text-xs">Would you like me to send you a direct payment link to secure yours?</p>
                 </div>
               </div>

               {/* Input */}
               <div className="h-16 bg-white border-t border-slate-100 flex items-center px-4 gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600"><Sparkles className="w-4 h-4" /></div>
                  <div className="flex-1 h-10 bg-slate-100 rounded-full flex items-center px-4 text-xs text-slate-400">Message...</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">More than just an auto-responder.</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Our AI actually understands context, reads your product catalog, and closes sales like a human salesperson.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-pink-200 transition-all">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Comment to DM</h3>
                <p className="text-slate-600 leading-relaxed">
                  When someone comments "Price" or "Link" on your reel, the AI automatically likes their comment, replies to it, and sends the exact product link straight to their DM.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-purple-200 transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Lead Qualification</h3>
                <p className="text-slate-600 leading-relaxed">
                  The AI can ask a series of questions to qualify leads (e.g., "What's your budget?" or "When do you need this?"), collect their phone number, and save it to your CRM.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Human Handoff</h3>
                <p className="text-slate-600 leading-relaxed">
                  If a customer is angry or asks a highly complex question the AI doesn't know, it instantly pauses itself and notifies you or your human support team to take over.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-pink-200 transition-all">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Integration</h3>
                <p className="text-slate-600 leading-relaxed">
                  Stop losing customers by sending them to a complicated website. The AI generates and sends Razorpay or Stripe payment links directly inside the chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manual vs AI Comparison */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight">The Cost of Manual Replies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 opacity-80">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <h3 className="font-bold text-xl">Manual Support Team</h3>
                </div>
                <ul className="space-y-4 text-slate-400">
                  <li className="flex items-start gap-3"><span className="text-red-500">✗</span> Takes 2-4 hours to reply</li>
                  <li className="flex items-start gap-3"><span className="text-red-500">✗</span> Unavailable at 2 AM</li>
                  <li className="flex items-start gap-3"><span className="text-red-500">✗</span> Expensive monthly salaries</li>
                  <li className="flex items-start gap-3"><span className="text-red-500">✗</span> Forgets to follow up on abandoned carts</li>
                </ul>
             </div>
             
             <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8 rounded-3xl border border-pink-500/30 relative">
                <div className="absolute top-0 right-0 p-4"><Sparkles className="w-6 h-6 text-pink-400" /></div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <h3 className="font-bold text-xl text-white">DhandaGrow AI</h3>
                </div>
                <ul className="space-y-4 text-white font-medium">
                  <li className="flex items-start gap-3"><span className="text-emerald-400">✓</span> Instant replies within 1 second</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-400">✓</span> Always awake, works 24/7/365</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-400">✓</span> Fraction of the cost</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-400">✓</span> Automatically follows up to close sales</li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
         <div className="max-w-3xl mx-auto px-4">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to put your Instagram on autopilot?</h2>
           <p className="text-xl text-slate-500 mb-10">Set it up once in 5 minutes. Watch the sales roll in.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl" asChild>
             <a href="/download">Get Started Free</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
