import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, RefreshCw, Wand2, Package, Tag, QrCode, Sparkles, Smartphone, Globe, CreditCard } from 'lucide-react';

export default function CataloguePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8 mx-auto">
          <ShoppingBag className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Smart Product Catalogue</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.05]">
          One central truth for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">your inventory.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
          Add a product here, and it instantly syncs to your Website, WhatsApp Shop, and Instagram. AI writes the SEO descriptions and manages your stock levels automatically.
        </p>
        
        <div className="flex justify-center gap-4 mb-16">
          <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 border-0" asChild>
            <a href="/download">Manage Inventory</a>
          </Button>
        </div>

        {/* Sync Animation UI Mockup */}
        <div className="relative mx-auto w-full max-w-4xl mt-8">
           
           {/* Center Database */}
           <div className="w-64 bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 mx-auto relative z-20 flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                 <Package className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Master Catalog</h3>
              <p className="text-xs text-slate-500">1,204 Products</p>
              
              <div className="mt-4 w-full bg-slate-50 rounded-xl p-3 border border-slate-100 text-left">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold">Nike Air Max</span>
                   <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">In Stock: 42</span>
                 </div>
                 <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-indigo-500 rounded-full" />
                 </div>
              </div>
           </div>

           {/* Sync Lines & Endpoints */}
           <div className="absolute top-1/2 left-0 w-full h-[1px] -z-10 hidden md:block">
              {/* Left line */}
              <div className="absolute left-[15%] right-[50%] h-0.5 bg-gradient-to-r from-emerald-400 to-indigo-200 top-0 -translate-y-1/2">
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-500 rounded-full -translate-y-1/2 -translate-x-1/2 animate-ping" />
              </div>
              {/* Right line */}
              <div className="absolute left-[50%] right-[15%] h-0.5 bg-gradient-to-l from-pink-400 to-indigo-200 top-0 -translate-y-1/2">
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-pink-500 rounded-full -translate-y-1/2 -translate-x-1/2 animate-ping" style={{animationDelay: '0.5s'}} />
              </div>
              
              {/* Left Endpoint (WhatsApp) */}
              <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-40 bg-white border border-emerald-200 rounded-2xl shadow-xl p-4 flex flex-col items-center">
                 <Smartphone className="w-6 h-6 text-emerald-500 mb-2" />
                 <span className="text-xs font-bold">WhatsApp Store</span>
                 <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1"><RefreshCw className="w-3 h-3" /> Synced</span>
              </div>
              
              {/* Right Endpoint (Website) */}
              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-40 bg-white border border-pink-200 rounded-2xl shadow-xl p-4 flex flex-col items-center">
                 <Globe className="w-6 h-6 text-pink-500 mb-2" />
                 <span className="text-xs font-bold">Live Website</span>
                 <span className="text-[10px] text-pink-600 flex items-center gap-1 mt-1"><RefreshCw className="w-3 h-3" /> Synced</span>
              </div>
           </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Upload a photo. We do the rest.</h2>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">Adding products used to take hours of data entry and copywriting. Now it takes 5 seconds.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
                 <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Wand2 className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Description Writer</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Upload a product photo and enter the price. The AI instantly identifies the product and writes a highly persuasive, SEO-optimized product description for your website.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
                 <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                   <RefreshCw className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Omnichannel Sync</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Change the price or stock in the Master Catalog, and it instantly updates across your Website, WhatsApp Shop, and Instagram Shopping automatically.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                 <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                   <CreditCard className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Instant Payment Links</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Every product automatically generates a unique checkout link (Stripe/Razorpay) that you can easily copy and paste into DMs or SMS to collect payments instantly.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-red-200 transition-all">
                 <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Tag className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart Inventory Alerts</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Never sell an out-of-stock item again. The system tracks sales across all channels and sends you a WhatsApp alert when a product is running low.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-center text-white">
         <div className="max-w-4xl mx-auto px-4">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Organize your products today.</h2>
           <p className="text-slate-400 text-xl mb-10">Stop managing inventory in Excel. Move to a smart, automated catalogue.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl border-0" asChild>
             <a href="/download">Create Your Catalogue</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
