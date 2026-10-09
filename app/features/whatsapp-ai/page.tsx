import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShoppingBag, Languages, Receipt, ArrowRight, Bot, BarChart, CheckCircle2 } from 'lucide-react';

export default function WhatsAppAIPage() {
  return (
    <main className="min-h-screen bg-[#F0FDF4] text-slate-900 font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      {/* WhatsApp Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 blur-[100px] rounded-full -z-10" />
        
        <div className="w-full lg:w-1/2">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
              <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">WhatsApp Business AI</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-[1.05]">
              Run your entire business on <span className="text-emerald-600">WhatsApp.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium">
              Transform your WhatsApp number into a fully automated store. The AI answers queries, showcases products from your catalogue, and collects payments seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold shadow-xl shadow-emerald-500/20 border-0" asChild>
                <a href="/download">Connect WhatsApp</a>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-sm">Official API Partner</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-sm">Meta Approved</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-sm">No Coding Required</span>
               </div>
            </div>
        </div>
        
        {/* Chat UI */}
        <div className="w-full lg:w-1/2 flex justify-center">
           <div className="w-[340px] h-[680px] bg-[#efeae2] rounded-[40px] shadow-2xl border-[8px] border-slate-900 overflow-hidden flex flex-col relative z-10">
             {/* WhatsApp Header */}
             <div className="h-16 bg-[#008069] flex items-center px-4 gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">DhandaGrow Store</h3>
                  <p className="text-xs text-white/80">bot • always online</p>
                </div>
             </div>
             
             {/* Background Pattern */}
             <div className="absolute inset-0 top-16 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
             
             {/* Chat Flow */}
             <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto z-10 relative">
               <div className="text-center text-xs text-slate-500 bg-white/50 w-fit mx-auto px-2 py-1 rounded-md mb-2">Today</div>
               
               {/* User Msg */}
               <div className="self-end bg-[#d9fdd3] text-slate-900 p-2.5 rounded-lg rounded-tr-none max-w-[85%] text-sm shadow-sm relative">
                  Hi, do you have running shoes for men?
                  <span className="text-[9px] text-slate-500 float-right ml-2 mt-2">10:00 AM</span>
               </div>
               
               {/* AI Product Carousel Msg */}
               <div className="self-start bg-white text-slate-900 p-2.5 rounded-lg rounded-tl-none max-w-[90%] text-sm shadow-sm relative">
                  <p className="mb-2">Yes! We have 4 new arrivals in Men's Running Shoes. Here is our catalog:</p>
                  <div className="bg-slate-50 border border-slate-100 rounded p-2 flex gap-3 mb-2">
                     <div className="w-12 h-12 bg-slate-200 rounded object-cover overflow-hidden"><img src="/images/about-business.jpg" alt="Shoe" className="w-full h-full object-cover"/></div>
                     <div>
                        <p className="font-bold text-xs">Nike Air Zoom</p>
                        <p className="text-xs text-emerald-600 font-bold">₹4,999</p>
                     </div>
                  </div>
                  <div className="w-full text-center border-t border-slate-100 pt-2 text-[#008069] font-bold text-xs cursor-pointer">
                    View full catalog (4 items)
                  </div>
                  <span className="text-[9px] text-slate-400 float-right ml-2 mt-1">10:00 AM</span>
               </div>
               
               {/* User Msg */}
               <div className="self-end bg-[#d9fdd3] text-slate-900 p-2.5 rounded-lg rounded-tr-none max-w-[85%] text-sm shadow-sm relative">
                  I'll take the Nike Air Zoom in Size 10.
                  <span className="text-[9px] text-slate-500 float-right ml-2 mt-2">10:02 AM</span>
               </div>
               
               {/* AI Payment Msg */}
               <div className="self-start bg-white text-slate-900 p-2.5 rounded-lg rounded-tl-none max-w-[90%] text-sm shadow-sm relative">
                  <p className="mb-2">Great choice! Total is ₹4,999.</p>
                  <Button className="w-full bg-[#008069] hover:bg-[#005c4b] h-8 text-xs font-bold rounded">Pay Securely via UPI</Button>
                  <span className="text-[9px] text-slate-400 float-right ml-2 mt-1">10:02 AM</span>
               </div>
             </div>
             
             {/* Input Bar */}
             <div className="h-14 bg-[#f0f2f5] flex items-center px-2 gap-2 z-10 shrink-0">
               <div className="flex-1 bg-white h-10 rounded-full px-4 flex items-center text-slate-400 text-sm shadow-sm">Message</div>
               <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center shadow-sm">
                 <ArrowRight className="w-5 h-5 text-white" />
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything happens in the chat.</h2>
               <p className="text-slate-500 text-lg max-w-2xl mx-auto">Users drop off when you force them to download an app or visit a slow website. Keep them on WhatsApp.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               
               <div className="flex gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <ShoppingBag className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-3">Native Catalog Integration</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Connect your existing product catalog (Shopify, WooCommerce, or custom). The AI will fetch products, variants, and prices dynamically and showcase them beautifully as WhatsApp cards.
                    </p>
                 </div>
               </div>

               <div className="flex gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Receipt className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-3">Instant UPI & Card Payments</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Generate Razorpay, Stripe, or native WhatsApp Pay links instantly. Customers can pay for their orders without ever leaving the chat window, boosting conversion rates by up to 60%.
                    </p>
                 </div>
               </div>
               
               <div className="flex gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Languages className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-3">Multilingual Indian Support</h3>
                    <p className="text-slate-600 leading-relaxed">
                      The AI automatically detects the customer's language. If they type in Hindi, Marathi, or Hinglish, the bot will seamlessly reply in the exact same language and tone.
                    </p>
                 </div>
               </div>

               <div className="flex gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <BarChart className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-3">Broadcast Marketing</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Send personalized festival wishes, discount codes, or abandoned cart reminders to thousands of opted-in customers at once using the official WhatsApp Business API.
                    </p>
                 </div>
               </div>
               
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#008069] text-center text-white">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Upgrade to WhatsApp Business AI.</h2>
            <p className="text-emerald-100 text-xl max-w-2xl mx-auto mb-10">Stop replying manually. Let AI handle the sales, support, and payments 24/7.</p>
            <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-[#008069] hover:bg-slate-100 font-bold shadow-xl border-0" asChild>
               <a href="/download">Connect Your Number</a>
            </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
