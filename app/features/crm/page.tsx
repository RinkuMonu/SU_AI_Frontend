import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Users, Filter, Plus, MessageCircle, Phone, Mail, MoreHorizontal, Inbox, Zap, Clock, UserCheck } from 'lucide-react';

export default function LeadsCRMPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 border border-teal-200 mb-8 mx-auto">
          <Users className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Omnichannel Leads CRM</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.05]">
          Never drop a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">lead</span> again.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
          WhatsApp, Instagram, Facebook, and Website leads all flow into one beautiful Kanban board. AI scores them, follows up automatically, and tells you exactly who to call today to close deals.
        </p>
        
        <div className="flex justify-center gap-4 mb-16">
          <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-500/20 border-0" asChild>
            <a href="/download">Open Your Pipeline</a>
          </Button>
        </div>

        {/* Kanban Board Mockup */}
        <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 bg-slate-100">
           {/* Top Bar */}
           <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
              <h3 className="font-bold text-slate-700 flex items-center gap-2"><Inbox className="w-5 h-5"/> Master Pipeline</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-2"><Filter className="w-3 h-3"/> Filter</Button>
                <Button size="sm" className="h-8 text-xs font-bold gap-2 bg-teal-600 hover:bg-teal-700 text-white"><Plus className="w-3 h-3"/> Add Lead</Button>
              </div>
           </div>
           
           {/* Columns */}
           <div className="p-6 flex gap-6 overflow-x-auto text-left min-h-[400px]">
              
              {/* New Leads Column */}
              <div className="w-80 shrink-0 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> <span className="font-bold text-sm">New Leads</span> <span className="bg-slate-200 text-xs px-2 py-0.5 rounded-full font-bold">24</span></div>
                 </div>
                 
                 {/* Card 1 */}
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group cursor-grab">
                    <div className="absolute top-4 right-4"><MoreHorizontal className="w-4 h-4 text-slate-300"/></div>
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">RK</div>
                       <div><p className="font-bold text-sm leading-tight">Rahul Kumar</p><p className="text-[10px] text-slate-500">via Instagram DM</p></div>
                    </div>
                    <div className="bg-orange-50 text-orange-700 border border-orange-100 text-[10px] font-bold px-2 py-1 rounded inline-block mb-3">🔥 Hot Lead (AI Scored: 92%)</div>
                    <p className="text-xs text-slate-600 line-clamp-2">"Hi, I want to book a consultation for tomorrow morning if possible."</p>
                 </div>
                 
                 {/* Card 2 */}
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group cursor-grab opacity-70">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">SP</div>
                       <div><p className="font-bold text-sm leading-tight">Sneha Patel</p><p className="text-[10px] text-slate-500">via WhatsApp</p></div>
                    </div>
                    <div className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded inline-block mb-3">❄️ Cold (AI Scored: 12%)</div>
                    <p className="text-xs text-slate-600 line-clamp-2">"Just looking at prices for now."</p>
                 </div>
              </div>

              {/* Contacted Column */}
              <div className="w-80 shrink-0 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"/> <span className="font-bold text-sm">Contacted</span> <span className="bg-slate-200 text-xs px-2 py-0.5 rounded-full font-bold">12</span></div>
                 </div>
                 
                 <div className="bg-white p-4 rounded-xl border border-teal-500 shadow-md ring-2 ring-teal-500/20 relative group cursor-grab">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">AM</div>
                       <div><p className="font-bold text-sm leading-tight">Amit Mishra</p><p className="text-[10px] text-slate-500">via Website Form</p></div>
                    </div>
                    <div className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2 py-1 rounded inline-block mb-3">⏳ Waiting for reply</div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100">
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] bg-green-50 hover:bg-green-100 text-green-700 border-green-200"><MessageCircle className="w-3 h-3 mr-1"/> WhatsApp</Button>
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] bg-slate-50 hover:bg-slate-100"><Phone className="w-3 h-3 mr-1"/> Call</Button>
                    </div>
                 </div>
              </div>
              
              {/* Closed Column */}
              <div className="w-80 shrink-0 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="font-bold text-sm">Won / Closed</span> <span className="bg-slate-200 text-xs px-2 py-0.5 rounded-full font-bold">145</span></div>
                 </div>
                 {/* Fake Empty State or simple card */}
                 <div className="h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm font-semibold bg-slate-50/50">
                    Drop to close lead
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Built for high-volume sales.</h2>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">No more spreadsheets. No more forgotten follow-ups. Just a smooth machine that turns traffic into revenue.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-all">
                 <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Zap className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Lead Scoring</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      The AI reads the conversation context and automatically tags leads as Hot, Warm, or Cold. It prioritizes the people who are actually ready to buy today.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                 <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Inbox className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Omnichannel Inbox</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Reply to Instagram DMs, WhatsApp messages, Facebook Messenger, and website live chat from one single unified dashboard. No more switching apps.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-all">
                 <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Clock className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Auto Follow-ups</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      If a lead goes cold, the AI can automatically send a polite nudge on WhatsApp 2 days later, offering a discount or asking if they still need help.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
                 <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                   <UserCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Team Assignments</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Have a sales team? Automatically route high-value leads to your best closers, and let the AI handle the tier-3 leads automatically.
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-center text-white">
         <div className="max-w-4xl mx-auto px-4">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Stop letting revenue slip through the cracks.</h2>
           <p className="text-slate-400 text-xl mb-10">Organize your sales process today and see your close rate jump by 40%.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-teal-500 text-slate-900 hover:bg-teal-400 font-bold shadow-xl border-0" asChild>
             <a href="/download">Start Using CRM Free</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
