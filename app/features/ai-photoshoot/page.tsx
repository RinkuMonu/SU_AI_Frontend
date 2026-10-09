import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Camera, Aperture, Layers, Sparkles, Droplet, MoveRight, Image as ImageIcon, Box } from 'lucide-react';

export default function PhotoshootPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white font-sans">
      <Navbar />
      
      {/* Cinematic Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Deep ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Aperture className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium tracking-widest uppercase text-slate-300">
              The Virtual Darkroom
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold mb-8 tracking-tighter leading-[0.9]">
            Studio Quality. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 font-serif italic pr-4">
              Zero Studio.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Upload a raw product photo. Let our AI magically build the set, adjust the lighting, and snap a million-dollar campaign shot in 3 seconds.
          </p>
          
          <Button variant="default" size="lg" className="h-16 px-10 text-lg rounded-full bg-white text-black hover:bg-slate-200 transition-all font-semibold shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Launch Virtual Studio
          </Button>
        </div>

        {/* Hero Panorama Image */}
        <div className="w-full max-w-[90vw] mx-auto mt-20 relative z-10 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img 
            src="/images/about-business.jpg" 
            alt="Cinematic AI Photography" 
            className="w-full h-[400px] md:h-[600px] object-cover filter contrast-125 saturate-50"
          />
          {/* Overlay UI elements to simulate camera viewfinder */}
          <div className="absolute inset-4 border border-white/20 z-20 pointer-events-none hidden md:block">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Interactive Hover Cards (Before / After simulation) */}
      <section className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Magic in motion.</h2>
              <p className="text-slate-400 text-lg font-light">Hover to reveal the AI transformation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 cursor-crosshair">
              {/* After */}
              <img src="/images/about-analytics.jpg" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 z-10 filter contrast-125" alt="After" />
              {/* Before */}
              <img src="/images/about-analytics.jpg" className="absolute inset-0 w-full h-full object-cover filter grayscale blur-[2px] opacity-50 z-0" alt="Before" />
              
              <div className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/10 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-500/30 transition-colors">
                <span className="group-hover:hidden">Raw Input</span>
                <span className="hidden group-hover:inline">Final Render</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 cursor-crosshair md:translate-y-12">
              {/* After */}
              <img src="/images/about-campaigns.jpg" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 z-10 filter contrast-125" alt="After" />
              {/* Before */}
              <img src="/images/about-campaigns.jpg" className="absolute inset-0 w-full h-full object-cover filter grayscale blur-[2px] opacity-50 z-0" alt="Before" />
              
              <div className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/10 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                <span className="group-hover:hidden">Raw Input</span>
                <span className="hidden group-hover:inline">Final Render</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 cursor-crosshair md:translate-y-24">
              {/* After */}
              <img src="/images/about-social-posts.jpg" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 z-10 filter contrast-125" alt="After" />
              {/* Before */}
              <img src="/images/about-social-posts.jpg" className="absolute inset-0 w-full h-full object-cover filter grayscale blur-[2px] opacity-50 z-0" alt="Before" />
              
              <div className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/10 group-hover:bg-purple-500/20 group-hover:text-purple-300 group-hover:border-purple-500/30 transition-colors">
                <span className="group-hover:hidden">Raw Input</span>
                <span className="hidden group-hover:inline">Final Render</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zig-Zag Features (Apple Style) */}
      <section className="py-32 bg-black overflow-hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Surgical cutout precision.</h2>
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                Our vision models don't just erase backgrounds. They understand depth, transparency, and complex geometry. Glass bottles, fuzzy textures, and intricate edges are extracted with pixel-perfect accuracy.
              </p>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="aspect-square rounded-[40px] bg-gradient-to-tr from-zinc-900 to-zinc-800 p-8 border border-white/10 shadow-2xl relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
                <div className="w-full h-full border border-dashed border-white/20 rounded-2xl flex items-center justify-center bg-black/40 backdrop-blur-sm relative z-10">
                  <Box className="w-32 h-32 text-emerald-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/3] rounded-[40px] bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden relative">
                 <img src="/images/about-analytics.jpg" className="w-full h-full object-cover opacity-80" alt="Shadows" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8">
                <Droplet className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Physically accurate shadows.</h2>
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                Forget fake drop-shadows. The AI reconstructs the 3D topology of your product to cast ray-traced shadows and reflections that perfectly match the lighting of your generated environment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Grid of Tools */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-16">The complete photographer's toolkit.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Cinematic Lighting",
              "Color Grading",
              "Props Generation",
              "Depth of Field",
              "Reflective Surfaces",
              "Infinite Backgrounds",
              "Batch Processing",
              "4K Upscaling"
            ].map((tool, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-black border border-white/5 hover:border-white/20 transition-colors flex flex-col items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-300">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sleek CTA Banner */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[40px] bg-zinc-900 border border-white/10 flex flex-col md:flex-row items-center justify-between p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
            
            <div className="mb-8 md:mb-0 relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Shoot your first campaign.</h2>
              <p className="text-slate-400 text-lg">No camera required. Start for free.</p>
            </div>
            
            <Button size="lg" className="h-16 px-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg flex items-center gap-2 relative z-10 border-0">
              Open Web App <MoveRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
