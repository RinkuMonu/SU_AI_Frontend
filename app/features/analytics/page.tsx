import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BarChart2, PieChart, Activity, TrendingUp, Search, MousePointerClick, ChevronRight, Zap, Target, LayoutDashboard } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 border border-cyan-200 mb-8 mx-auto">
          <BarChart2 className="w-4 h-4 text-cyan-600" />
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Business Analytics</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.05]">
          Stop drowning in data.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Start making decisions.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
          One unified dashboard for your entire business. AI analyzes your website traffic, ad spend, and sales to tell you exactly what's working and what's wasting money.
        </p>
        
        <div className="flex justify-center gap-4 mb-16">
          <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 border-0" asChild>
            <a href="/download">Connect Your Data</a>
          </Button>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative mx-auto w-full max-w-5xl perspective-1000">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none -z-10" />
           
           <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden transform rotate-x-6">
             {/* Dashboard Header */}
             <div className="h-14 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-6">
                <div className="flex items-center gap-2 font-bold text-slate-700"><LayoutDashboard className="w-5 h-5"/> Main Overview</div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold">Last 30 Days</div>
                  <div className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-md text-xs font-bold flex items-center gap-1"><Zap className="w-3 h-3"/> AI Insights</div>
                </div>
             </div>
             
             {/* Dashboard Grid */}
             <div className="p-6 bg-slate-50/50 flex flex-col gap-6 text-left">
               {/* Top Stats */}
               <div className="grid grid-cols-4 gap-4">
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-xs font-semibold text-slate-500 mb-1">Total Revenue</p>
                   <h4 className="text-2xl font-bold text-slate-900">₹2,45,000</h4>
                   <p className="text-[10px] font-bold text-emerald-500 mt-1">↑ +14.5% vs last month</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-xs font-semibold text-slate-500 mb-1">Active Leads</p>
                   <h4 className="text-2xl font-bold text-slate-900">842</h4>
                   <p className="text-[10px] font-bold text-emerald-500 mt-1">↑ +5.2% vs last month</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-xs font-semibold text-slate-500 mb-1">Ad Spend ROI</p>
                   <h4 className="text-2xl font-bold text-slate-900">3.2x</h4>
                   <p className="text-[10px] font-bold text-emerald-500 mt-1">↑ +1.1x vs last month</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-xs font-semibold text-slate-500 mb-1">CAC</p>
                   <h4 className="text-2xl font-bold text-slate-900">₹450</h4>
                   <p className="text-[10px] font-bold text-red-500 mt-1">↓ -12% vs last month (Good)</p>
                 </div>
               </div>

               {/* AI Alert Overlay Simulation */}
               <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white">
                        <Zap className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="font-bold text-slate-900 text-sm">Action Required: Turn off Meta Ad Campaign #4</p>
                       <p className="text-xs text-slate-600">It has spent ₹5,000 in the last 48 hours with 0 conversions. Redirect budget to Campaign #2.</p>
                     </div>
                  </div>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-8 text-xs">Apply Recommendation</Button>
               </div>
               
               {/* Main Chart Area */}
               <div className="bg-white h-48 rounded-2xl border border-slate-100 shadow-sm p-4 relative overflow-hidden flex items-end">
                  {/* Fake Line Chart */}
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <path d="M0 100 L 0 80 Q 25 70, 50 50 T 100 20 L 100 100 Z" fill="url(#gradient)" opacity="0.2"/>
                     <path d="M0 80 Q 25 70, 50 50 T 100 20" fill="none" stroke="#0891b2" strokeWidth="2" />
                     <defs>
                       <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                         <stop offset="0%" stopColor="#0891b2" />
                         <stop offset="100%" stopColor="transparent" />
                       </linearGradient>
                     </defs>
                  </svg>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Everything connected. Finally.</h2>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">No more logging into Google Analytics, Facebook Ads, and Shopify separately to piece together your numbers.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all flex flex-col gap-4">
                 <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Target className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Marketing Attribution</h3>
                 <p className="text-slate-600 leading-relaxed text-sm">
                   Know exactly where your sales are coming from. The AI tracks the customer journey across Instagram, Google, and WhatsApp so you know which channel actually drove the purchase.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all flex flex-col gap-4">
                 <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Activity className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Real-Time Traffic</h3>
                 <p className="text-slate-600 leading-relaxed text-sm">
                   Watch visitors navigate your website in real-time. See which buttons they click, where they drop off, and let AI suggest UI changes to improve your conversion rate.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all flex flex-col gap-4">
                 <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                   <PieChart className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Customer Demographics</h3>
                 <p className="text-slate-600 leading-relaxed text-sm">
                   Understand exactly who is buying from you. The platform automatically builds profiles based on age, location, and interests so you can target your next ad campaign perfectly.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-all flex flex-col gap-4">
                 <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                   <TrendingUp className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Predictive Forecasting</h3>
                 <p className="text-slate-600 leading-relaxed text-sm">
                   Based on historical data, the AI predicts your sales for the next month, warns you about potential inventory shortages, and suggests optimal discount strategies.
                 </p>
              </div>

           </div>
        </div>
      </section>

      {/* Integration Logos */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden text-center">
         <h2 className="text-2xl font-bold text-slate-400 mb-10">Integrates seamlessly with your current stack</h2>
         <div className="flex flex-wrap justify-center gap-10 opacity-70">
            {/* Fake logos using text for now */}
            <span className="text-2xl font-bold">Meta Ads</span>
            <span className="text-2xl font-bold">Google Analytics</span>
            <span className="text-2xl font-bold">Shopify</span>
            <span className="text-2xl font-bold">WooCommerce</span>
            <span className="text-2xl font-bold">Razorpay</span>
            <span className="text-2xl font-bold">WhatsApp API</span>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-cyan-600 text-center text-white">
         <div className="max-w-4xl mx-auto px-4">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Stop guessing. Know your numbers.</h2>
           <p className="text-cyan-100 text-xl mb-10">Get the insights you need to scale your business profitably.</p>
           <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-cyan-700 hover:bg-slate-100 font-bold shadow-xl border-0" asChild>
             <a href="/download">View Your Dashboard</a>
           </Button>
         </div>
      </section>

      <Footer />
    </main>
  );
}
