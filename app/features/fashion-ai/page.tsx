import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Shirt, Sparkles, MapPin, Users, Camera, Palette, ArrowRight, Upload, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export default function FashionAIPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] selection:bg-rose-200 selection:text-rose-900 font-sans text-slate-900">
      <Navbar />
      
      {/* High-Fashion Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-[55%] flex flex-col items-start text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-8">
            <Shirt className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-rose-600 tracking-widest uppercase">
              DhandaGrow Fashion AI
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-bold text-slate-900 mb-6 tracking-tighter leading-[1.05] font-serif">
            Virtual Runways. <br/>
            <span className="italic font-light text-slate-500">Real Sales.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mb-10 font-light">
            Skip the expensive photoshoots, models, and locations. Upload flat-lay photos of your clothing and let AI instantly generate hyper-realistic editorial shots on diverse virtual models.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 text-base rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 border-0 flex items-center gap-2" asChild>
              <a href="/download">
                Start Virtual Fitting <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-slate-200 hover:bg-slate-50 text-slate-900 flex items-center gap-2" asChild>
              <a href="#demo">
                See How It Works
              </a>
            </Button>
          </div>
        </div>

        {/* Editorial Image Composition */}
        <div className="w-full lg:w-[45%] relative mt-10 lg:mt-0">
          <div className="absolute -inset-10 bg-rose-100/50 blur-3xl rounded-full z-0" />
          <div className="relative z-10 flex gap-4 items-center">
            {/* Left Image (Flat lay or basic) */}
            <div className="w-1/2 flex flex-col gap-4 translate-y-8">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-lg border border-white">
                <img src="/images/about-business.jpg" alt="Fashion AI" className="w-full h-full object-cover filter grayscale contrast-125" />
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-900">T-Shirt Flatlay.png</p>
                   <p className="text-[10px] text-slate-500">Processing...</p>
                </div>
              </div>
            </div>
            {/* Right Image (Final Render) */}
            <div className="w-1/2 flex flex-col gap-4 -translate-y-8">
              <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">AI Render</p>
                   <Sparkles className="w-3 h-3 text-rose-500" />
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                   <div className="w-full h-full bg-rose-500" />
                </div>
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-2xl border border-white">
                <img src="/images/about-social-posts.jpg" alt="Fashion AI Render" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Casting Interactive UI Section */}
      <section id="demo" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Text Side */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">Cast the perfect model for your brand.</h2>
              <p className="text-slate-400 text-lg mb-8 font-light leading-relaxed">
                Choose from thousands of AI-generated models across all ethnicities, ages, and body types. Ensure your clothing resonates perfectly with your target demographic.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Users className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Infinite Diversity</h4>
                    <p className="text-slate-400 text-sm">Select the exact demographic that represents your brand.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Global Locations</h4>
                    <p className="text-slate-400 text-sm">Shoot in Paris, Tokyo, or a minimalist studio with one click.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Camera className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Dynamic Posing</h4>
                    <p className="text-slate-400 text-sm">Direct your virtual model to walk, sit, or strike a specific editorial pose.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup UI Side */}
            <div className="w-full lg:w-1/2">
              <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
                  <h3 className="font-bold text-lg">AI Casting Agency</h3>
                  <SlidersHorizontal className="w-5 h-5 text-slate-400" />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Select Model</p>
                    <div className="flex gap-3 overflow-hidden">
                      <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-rose-500 overflow-hidden ring-4 ring-rose-500/20"><img src="https://i.pravatar.cc/150?img=47" alt="Model 1" className="w-full h-full object-cover"/></div>
                      <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden opacity-50"><img src="https://i.pravatar.cc/150?img=32" alt="Model 2" className="w-full h-full object-cover"/></div>
                      <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden opacity-50"><img src="https://i.pravatar.cc/150?img=68" alt="Model 3" className="w-full h-full object-cover"/></div>
                      <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden opacity-50"><img src="https://i.pravatar.cc/150?img=12" alt="Model 4" className="w-full h-full object-cover"/></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Location Setup</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700 rounded-xl px-4 py-3 flex items-center justify-between border border-rose-500">
                        <span className="text-sm">Minimal Studio</span>
                        <CheckCircle2 className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="bg-slate-900 rounded-xl px-4 py-3 flex items-center justify-between border border-slate-700 text-slate-400">
                        <span className="text-sm">Urban Street</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold rounded-xl mt-4">
                    <Sparkles className="w-4 h-4 mr-2 text-rose-600" /> Generate Lookbook
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              Everything your fashion brand needs.
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Built specifically for apparel brands, designers, and e-commerce stores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-slate-100 hover:border-rose-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <Shirt className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Virtual Try-On</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Upload a picture of a garment and a picture of a person. Our AI seamlessly dresses the person in the garment, maintaining realistic fabric folds, lighting, and shadows.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-slate-100 hover:border-rose-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <Palette className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Color Variations</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Don't shoot the same shirt in 10 colors. Shoot it once, and let AI generate perfect, realistic color variations and fabric textures for your entire catalog instantly.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-slate-100 hover:border-rose-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <Camera className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ghost Mannequin</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Automatically remove mannequins from your product shots to create that premium invisible-model look for your e-commerce store in a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aesthetic CTA */}
      <section className="py-24 bg-[#FDFBF7] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10">
              Ready to redefine your catalog?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10 font-light">
              Join modern fashion brands saving 80% on production costs while launching collections faster.
            </p>
            <Button size="lg" className="relative z-10 h-16 px-12 text-lg font-bold rounded-full text-slate-900 bg-white hover:bg-rose-50 shadow-xl" asChild>
              <a href="/download">Start Creating for Free</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
