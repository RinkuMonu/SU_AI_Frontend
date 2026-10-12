import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, ShieldAlert, HeartHandshake, TrendingUp, Sparkles, MessageSquareReply, ThumbsUp, MapPin } from 'lucide-react';

export default function ReviewManagerPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 blur-[100px] rounded-full -z-10" />
        
        <div className="w-full lg:w-1/2 relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200 mb-6">
              <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">AI Review Manager</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-[1.05]">
              Own your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">reputation.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium max-w-lg">
              Manage your Google My Business, Trustpilot, and Facebook reviews on autopilot. The AI drafts personalized, SEO-optimized replies to 5-star reviews and intelligently escalates negative feedback.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl border-0" asChild>
                <a href="/download">Connect Google My Business</a>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm inline-flex">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/150?img=12" /></div>
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/150?img=32" /></div>
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/150?img=47" /></div>
              </div>
              <div className="flex flex-col">
                 <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                 </div>
                 <span className="text-xs font-bold text-slate-700">"Saved me 10 hours a week."</span>
              </div>
            </div>
        </div>
        
        {/* Review Mockups UI */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 relative">
           
           {/* Positive Review */}
           <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 transform translate-x-4">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">JD</div>
                  <div>
                    <h4 className="font-bold text-sm">John Doe</h4>
                    <span className="text-xs text-slate-500">Local Guide • 2 days ago</span>
                  </div>
               </div>
               <div className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
             </div>
             <p className="text-slate-700 text-sm mb-4 leading-relaxed">
               Amazing experience at the store today! The staff was incredibly helpful and I found exactly what I was looking for. Will definitely be coming back.
             </p>
             
             {/* AI Reply */}
             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 ml-6 relative">
               <div className="absolute -left-3 top-4 w-6 h-6 bg-amber-100 rounded-full border-2 border-white flex items-center justify-center">
                 <Sparkles className="w-3 h-3 text-amber-600" />
               </div>
               <p className="text-xs font-bold text-slate-900 mb-1">Response from Owner (Auto-Drafted)</p>
               <p className="text-sm text-slate-600 leading-relaxed">
                 Thank you so much for the 5-star review, John! We're thrilled to hear you had a great experience with our staff. We look forward to seeing you again soon at DhandaGrow!
               </p>
               <div className="flex items-center gap-2 mt-3">
                 <Button size="sm" className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"><ThumbsUp className="w-3 h-3 mr-1" /> Approve & Post</Button>
               </div>
             </div>
           </div>

           {/* Negative Review Flag */}
           <div className="bg-white rounded-3xl p-6 shadow-xl border border-red-100 transform -translate-x-4">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">SM</div>
                  <div>
                    <h4 className="font-bold text-sm">Sarah M.</h4>
                    <span className="text-xs text-slate-500">1 review • Just now</span>
                  </div>
               </div>
               <div className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-slate-200"/><Star className="w-4 h-4 text-slate-200"/><Star className="w-4 h-4 text-slate-200"/><Star className="w-4 h-4 text-slate-200"/></div>
             </div>
             <p className="text-slate-700 text-sm mb-4 leading-relaxed">
               I waited for 30 minutes and no one attended to me. Very disappointing service.
             </p>
             
             <div className="bg-red-50 rounded-2xl p-3 border border-red-100 flex items-center gap-3">
               <ShieldAlert className="w-5 h-5 text-red-500" />
               <div className="flex-1">
                 <p className="text-xs font-bold text-red-800">Critical Alert: Poor Service Flag</p>
                 <p className="text-[10px] text-red-600">AI paused auto-reply and escalated to Manager.</p>
               </div>
               <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-700 bg-white">Handle Manually</Button>
             </div>
           </div>
           
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Why managing reviews matters.</h2>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">Replying to reviews isn't just polite—it's the #1 driver for local SEO and customer trust.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
                 <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                    <MessageSquareReply className="w-6 h-6 text-amber-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">SEO-Optimized Replies</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our AI doesn't just say "Thanks". It weaves your business keywords (e.g., "best coffee shop in Mumbai") into the replies, helping you rank higher on Google Maps.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-red-200 transition-colors">
                 <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 text-red-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Crisis Management</h3>
                    <p className="text-slate-600 leading-relaxed">
                      If a review contains keywords like "bad", "angry", or 1-star, the AI immediately alerts you on WhatsApp/Email so you can step in and save the customer relationship.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                 <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Multi-Location Support</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Manage 50 different franchise locations from a single dashboard. The AI knows which location the review is for and tailors the reply dynamically.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                 <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Sentiment Analytics</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Get a monthly report breaking down exactly what customers love (e.g., "fast service") and what they hate, so you can fix operational issues before they spread.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-center">
         <div className="max-w-4xl mx-auto px-4">
           <HeartHandshake className="w-16 h-16 text-amber-500 mx-auto mb-6" />
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Build a 5-Star Brand.</h2>
           <p className="text-xl text-slate-400 mb-10">Protect your online reputation without spending hours writing replies.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-amber-500 text-slate-900 hover:bg-amber-400 font-bold shadow-xl border-0" asChild>
             <a href="/download">Start Managing Reviews</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
