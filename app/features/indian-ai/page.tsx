import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Languages, MessageSquare, Globe2, Sparkles, Volume2, Mic, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function IndianAIPage() {
  return (
    <main className="min-h-screen bg-[#FFFAF0] text-slate-900 font-sans selection:bg-orange-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 mb-8 shadow-sm">
            <Languages className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold text-orange-800 uppercase tracking-widest">Hindi & Hinglish AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold mb-6 tracking-tight leading-[1.05] text-slate-900">
            Speak to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">Bharat.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-12 font-medium max-w-2xl mx-auto">
            Stop using robotic Google Translate for your marketing. Our AI natively understands Indian cultural nuances, slang, and Hinglish to connect with your true audience.
          </p>

          {/* Translation/Localization UI Mockup */}
          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">
             
             {/* English Input */}
             <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 text-left relative overflow-hidden">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-4"><Globe2 className="w-4 h-4" /> English (Input)</div>
                <p className="text-xl font-medium text-slate-800 mb-8">
                  "Get this stylish jacket today at 50% off. It looks very cool and is good for the winter season. Buy now before stocks run out."
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200" />
             </div>

             {/* Arrow (Desktop) */}
             <div className="hidden md:flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white shadow-lg">
                  <ArrowRight className="w-6 h-6" />
                </div>
             </div>

             {/* Hinglish Output */}
             <div className="flex-1 bg-gradient-to-br from-orange-50 to-rose-50 rounded-3xl border border-orange-200 shadow-xl p-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4"><Sparkles className="w-5 h-5 text-orange-400" /></div>
                <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase mb-4"><Languages className="w-4 h-4" /> Hinglish (Localized)</div>
                <p className="text-xl font-bold text-slate-900 mb-4 leading-relaxed">
                  "Sardiyon ka swag on karo! 😎 Get this stylish jacket at flat 50% off. Ekdum fire lag rahi hai. 🔥 Stock khatam hone se pehle order karlo!"
                </p>
                <div className="bg-white/60 p-2 rounded-lg inline-flex items-center gap-2 text-xs font-bold text-orange-700">
                   <Zap className="w-3 h-3" /> +140% better conversion than basic Hindi
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400" />
             </div>

          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Not just translated. Localized.</h2>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">India doesn't speak pure textbook Hindi. We speak a mix of English, regional words, and slang. The AI gets that.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                 <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                   <Languages className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">True Hinglish Support</h3>
                 <p className="text-slate-600 text-sm leading-relaxed">
                   Generates content exactly how Indians type on WhatsApp. It perfectly blends English words with Hindi grammar for maximum relatability.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                 <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                   <MessageSquare className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Multilingual DM Bot</h3>
                 <p className="text-slate-600 text-sm leading-relaxed">
                   If a customer messages "Bhai iska price kya hai?" on Instagram, the AI instantly detects the language and replies back in the same casual Hinglish tone.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                   <Globe2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">10+ Regional Languages</h3>
                 <p className="text-slate-600 text-sm leading-relaxed">
                   Beyond Hindi and Hinglish, the engine supports native generation in Marathi, Bengali, Tamil, Telugu, Gujarati, and more.
                 </p>
              </div>

           </div>
        </div>
      </section>

      {/* Side by Side Comparison */}
      <section className="py-24 bg-slate-900 text-white">
         <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Google Translate vs DhandaGrow AI</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Basic Translation */}
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                  <h3 className="font-bold text-red-400 mb-2">Standard Translation AI</h3>
                  <p className="text-slate-400 text-xs mb-6">Input: "Check out our crazy weekend sale."</p>
                  
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-300 font-medium">"Hamari pagal saptahant bikri ki jaanch karen."</p>
                  </div>
                  <p className="text-red-400 text-xs font-bold mt-4">✗ Sounds robotic and awkward</p>
               </div>

               {/* AI Localization */}
               <div className="bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-8 rounded-3xl border border-orange-500/30">
                  <h3 className="font-bold text-orange-400 mb-2">DhandaGrow Hinglish AI</h3>
                  <p className="text-slate-400 text-xs mb-6">Input: "Check out our crazy weekend sale."</p>
                  
                  <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                    <p className="text-white font-bold text-lg">"Weekend ki crazy sale live hai! Check out karo abhi."</p>
                  </div>
                  <p className="text-emerald-400 text-xs font-bold mt-4">✓ Sounds natural, native, and high-converting</p>
               </div>
               
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#FFFAF0] text-center">
         <div className="max-w-4xl mx-auto px-4">
           <Volume2 className="w-16 h-16 text-orange-500 mx-auto mb-6" />
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Speak your customer's language.</h2>
           <p className="text-xl text-slate-600 mb-10">Start generating marketing copy in perfect Hindi and Hinglish today.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold shadow-xl border-0" asChild>
             <a href="/download">Try Hinglish AI</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
