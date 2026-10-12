import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Mic, Languages, Video, UserPlus, Sparkles, MoveRight, Volume2, Globe } from 'lucide-react';

export default function AIAvatarPage() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-200 selection:text-blue-900 font-sans">
      <Navbar />
      
      {/* Hero Section (Video Studio Vibe) */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 mb-6">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 tracking-wide">
              AI Spokesperson Studio
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Your Brand's <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">New Face.</span>
          </h1>
          
          <p className="text-xl md:text-[22px] text-slate-600 leading-relaxed max-w-lg font-medium mb-8">
            Create professional presenter videos in minutes. Just type your script, choose an AI actor (or clone yourself!), and let our engine generate a studio-quality video with perfect lip-sync.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 text-base rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 border-0 flex items-center gap-2" asChild>
              <a href="/download">
                Create First Video <Play className="w-4 h-4 fill-current" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-2xl border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2" asChild>
              <a href="/features/ai-reel-maker">
                View Reels Example
              </a>
            </Button>
          </div>
        </div>

        {/* Custom Video Player Mockup */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl rounded-[40px] z-0" />
          <div className="relative z-10 bg-white rounded-[32px] p-3 shadow-2xl border border-slate-100">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 group cursor-pointer">
              {/* Fake Video Thumbnail */}
              <img src="/images/about-analytics.jpg" alt="AI Avatar" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Lower Thirds UI */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-lg">
                  <p className="text-sm font-bold text-slate-900 leading-tight">"Welcome to DhandaGrow!"</p>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                       ))}
                     </div>
                     <span className="text-xs font-semibold text-slate-500 uppercase">Hindi (India)</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center border border-white/20">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Fake timeline controls */}
            <div className="flex items-center gap-3 px-4 py-5">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                 <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
               </div>
               <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="w-1/3 h-full bg-blue-500 rounded-full" />
               </div>
               <span className="text-xs font-semibold text-slate-400 font-mono">00:12 / 00:30</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating UI Elements Grid */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Everything in one studio.
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Replace expensive equipment, actors, and editors with a simple text box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Box 1 */}
            <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">100+ Diverse Avatars</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                Choose from a vast library of professional AI actors of different ages, ethnicities, and professional attire. Perfect for training videos, sales pitches, or social media.
              </p>
            </div>

            {/* Feature Box 2 */}
            <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <UserPlus className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Clone Yourself</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                Upload a 2-minute video of yourself speaking, and our AI will create your exact digital twin. Type a script anytime, and your clone will say it with your voice and gestures.
              </p>
            </div>

            {/* Feature Box 3 */}
            <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Languages className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Speak 50+ Languages</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                Type in English and have your avatar speak perfect Hindi, Marathi, Tamil, or Telugu. Expand your business reach without hiring translators or dubbing artists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Simulation */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">From script to screen in 3 steps.</h2>
           <p className="text-slate-400 text-xl font-light">It literally takes 2 minutes.</p>
        </div>

        <div className="max-w-5xl mx-auto px-4">
           {/* Step 1 */}
           <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-800/50 p-8 rounded-[32px] border border-slate-700/50 mb-8 backdrop-blur-sm">
             <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-2xl shrink-0">1</div>
             <div className="flex-1 text-left">
               <h3 className="text-2xl font-bold mb-2">Select your Actor</h3>
               <p className="text-slate-400">Browse the library or select your custom Digital Twin.</p>
             </div>
             <div className="flex gap-4 shrink-0">
               <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden"><img src="https://i.pravatar.cc/150?img=68" alt="Actor" /></div>
               <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-blue-500 overflow-hidden relative ring-4 ring-blue-500/30"><img src="https://i.pravatar.cc/150?img=32" alt="Actor" /></div>
               <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden"><img src="https://i.pravatar.cc/150?img=47" alt="Actor" /></div>
             </div>
           </div>

           {/* Step 2 */}
           <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-800/50 p-8 rounded-[32px] border border-slate-700/50 mb-8 backdrop-blur-sm">
             <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-2xl shrink-0">2</div>
             <div className="flex-1 text-left">
               <h3 className="text-2xl font-bold mb-2">Type your script</h3>
               <p className="text-slate-400">Or use our AI to write an engaging script for you.</p>
             </div>
             <div className="w-full md:w-80 bg-slate-900 rounded-xl p-4 border border-slate-700 shrink-0">
               <div className="text-sm text-slate-300 font-mono">
                 "Namaste! Are you looking to grow your business online? DhandaGrow can help you..."
                 <span className="w-2 h-4 inline-block bg-indigo-500 ml-1 animate-pulse" />
               </div>
             </div>
           </div>

           {/* Step 3 */}
           <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-800/50 p-8 rounded-[32px] border border-slate-700/50 backdrop-blur-sm">
             <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-2xl shrink-0">3</div>
             <div className="flex-1 text-left">
               <h3 className="text-2xl font-bold mb-2">Generate Video</h3>
               <p className="text-slate-400">The AI handles lip-sync, gestures, and rendering instantly.</p>
             </div>
             <Button className="h-14 px-8 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-lg shrink-0">
               <Sparkles className="w-5 h-5 mr-2 text-purple-600" /> Generate Now
             </Button>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Stop filming. Start creating.
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-10">
            Join modern creators and businesses who use AI Avatars to scale their video production by 100x.
          </p>
          <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/20 border-0" asChild>
            <a href="/download">Get Started for Free</a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
