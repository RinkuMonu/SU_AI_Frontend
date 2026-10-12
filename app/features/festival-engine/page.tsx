import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { PartyPopper, Calendar, ImageIcon, Bell, Flame, ChevronRight, Share2, Palette } from 'lucide-react';

export default function FestivalEnginePage() {
  return (
    <main className="min-h-screen bg-[#FFFDF7] text-slate-900 font-sans selection:bg-amber-500/30">
      <Navbar />
      
      {/* Vibrant Festive Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        {/* Colorful Gradients for Festive Vibe */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-200 mb-8 mx-auto shadow-sm">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Indian Festival Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-[1.1]">
            Never miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600">Festival</span> again.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
            Automatically generate branded wishes, sale announcements, and campaigns for Diwali, Holi, Navratri, Eid, and 100+ other Indian festivals.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold shadow-xl shadow-orange-500/20 border-0 flex items-center gap-2 transition-transform hover:scale-105" asChild>
              <a href="/download">
                Explore Calendar <PartyPopper className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Masonry Mockup of Festival Posters */}
        <div className="mt-20 relative z-10 w-full max-w-5xl mx-auto">
           {/* Connecting Line */}
           <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-rose-200 to-purple-200 rounded-full opacity-50 -z-10" />
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
             
             {/* Poster 1 */}
             <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 rotate-[-4deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
               <div className="aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden relative group">
                 <img src="/images/about-social-posts.jpg" alt="Diwali Poster" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                   <span className="text-white font-bold text-lg">Diwali Sale</span>
                   <span className="text-orange-300 text-xs font-semibold">24 Oct</span>
                 </div>
               </div>
             </div>

             {/* Poster 2 */}
             <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 translate-y-8 rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
               <div className="aspect-[4/5] bg-rose-900 rounded-xl overflow-hidden relative group">
                 <img src="/images/about-campaigns.jpg" alt="Holi Poster" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                   <span className="text-white font-bold text-lg">Holi Wishes</span>
                   <span className="text-rose-300 text-xs font-semibold">8 Mar</span>
                 </div>
               </div>
             </div>

             {/* Poster 3 */}
             <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 -translate-y-4 rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 hidden md:block">
               <div className="aspect-[4/5] bg-emerald-900 rounded-xl overflow-hidden relative group">
                 <img src="/images/about-analytics.jpg" alt="Eid Poster" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                   <span className="text-white font-bold text-lg">Eid Greetings</span>
                   <span className="text-emerald-300 text-xs font-semibold">10 Apr</span>
                 </div>
               </div>
             </div>

             {/* Poster 4 */}
             <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 translate-y-6 rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-300 hidden md:block">
               <div className="aspect-[4/5] bg-blue-900 rounded-xl overflow-hidden relative group">
                 <img src="/images/about-business.jpg" alt="Navratri Poster" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                   <span className="text-white font-bold text-lg">Navratri Offers</span>
                   <span className="text-blue-300 text-xs font-semibold">3 Oct</span>
                 </div>
               </div>
             </div>

           </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-amber-50/50 border border-amber-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-orange-500">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pre-loaded Calendar</h3>
              <p className="text-slate-600 leading-relaxed">
                Over 100 Indian festivals, national holidays, and important days are pre-loaded into your calendar. The AI notifies you weeks in advance.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-rose-500">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Branded Templates</h3>
              <p className="text-slate-600 leading-relaxed">
                The engine doesn't just give you generic images. It generates beautiful festival posters featuring your logo, brand colors, and products.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-purple-500">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1-Click WhatsApp Blast</h3>
              <p className="text-slate-600 leading-relaxed">
                Generate personalized festive wishes for your customers and send them directly to your WhatsApp broadcast list instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#FFFDF7]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Don't miss the next big sale opportunity.</h2>
          <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-xl border-0" asChild>
            <a href="/download">Prepare Your Next Campaign</a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
