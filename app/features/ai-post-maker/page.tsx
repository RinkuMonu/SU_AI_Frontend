import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Image as ImageIcon, Layout, Zap, Share2 } from 'lucide-react';
import Image from 'next/image';

export default function PostmakerPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary/30 selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-32 overflow-hidden relative min-h-[500px] lg:min-h-[600px] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50/40 via-transparent to-orange-50/40 pointer-events-none" />
        
        {/* Full-bleed right image (Desktop) */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-0 hidden lg:block">
          {/* Gradient to smooth out the left edge of the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent z-10 w-[30%]" />
          <img 
            src="/images/about-social-posts.jpg" 
            alt="AI Postmaker in action" 
            className="w-full h-full object-cover object-[center_top] [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_100%)]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="w-full lg:w-[45%] flex flex-col items-start py-10 lg:py-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 mb-6">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
                  AI-Powered Design
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                AI Postmaker
              </h1>
              
              <p className="text-xl md:text-[22px] text-slate-600 leading-relaxed max-w-lg font-medium mb-8">
                Generate stunning, high-converting social media posts in seconds. No design skills required. Let AI be your personal graphic designer.
              </p>
              
              <Button variant="default" size="lg" className="h-14 px-8 text-base shadow-lg shadow-purple-500/25 group font-semibold rounded-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 border-0">
                <span className="flex items-center gap-2 text-white">
                  Start Creating Now
                </span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-white" />
              </Button>
            </div>
            
            {/* Mobile Image (hidden on desktop) */}
            <div className="w-full relative lg:hidden">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="/images/about-social-posts.jpg" 
                  alt="AI Postmaker in action" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-100 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 divide-x-0 md:divide-x divide-slate-100 text-center">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-3 tracking-tight">10x</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Faster Creation</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-3 tracking-tight">5M+</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Posts Generated</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-3 tracking-tight">Zero</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Design Skills Needed</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-3 tracking-tight">100%</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">On-Brand Results</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 lg:py-32 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              How AI Postmaker Works
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Creating professional social media content has never been this easy.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl group">
                <img 
                  src="/images/about-analytics.jpg" 
                  alt="Person working on laptop" 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-slate-900">AI Generating...</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full" 
                        style={{
                          animation: "downloadProgress 2s ease-in-out infinite"
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <style>{`
                  @keyframes downloadProgress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                  }
                `}</style>
              </div>
            </div>
            
            {/* Right Content Steps */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-10">
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shadow-sm">
                  <span className="text-xl font-bold text-purple-600">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Tell AI what you need</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Just type a quick prompt like "Diwali sale post for a clothing brand" or choose from our smart templates. AI understands your intent instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shadow-sm">
                  <span className="text-xl font-bold text-orange-600">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">AI designs in seconds</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Our engine generates multiple stunning variations with perfect layouts, typography, and color schemes matched to your brand identity.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Publish & Grow</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Pick your favorite design, get an AI-generated caption with relevant hashtags, and publish directly to your social channels in one click.
                  </p>
                </div>
              </div>

            </div>
            
          </div>
        </div>
      </section>

      {/* Postmaker Features Section */}
      <section className="py-24 bg-[#090b14] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b14] to-[#111111]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Everything you need to stand out
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Packed with powerful features to make your brand look like a million bucks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Festival Templates",
                desc: "Never miss an Indian festival. Get ready-to-post creatives for Diwali, Holi, Navratri, and 100+ local events.",
                icon: <Layout className="w-6 h-6 text-[#fc9a5d]" />
              },
              {
                title: "Auto-Branding",
                desc: "Upload your logo once. AI automatically places it perfectly along with your brand colors and fonts on every post.",
                icon: <ImageIcon className="w-6 h-6 text-[#f0449b]" />
              },
              {
                title: "Smart Resize",
                desc: "One click to resize your post for Instagram Square, Stories, Reels, Facebook, and LinkedIn perfectly.",
                icon: <Zap className="w-6 h-6 text-[#be32ff]" />
              },
              {
                title: "Product Showcases",
                desc: "Upload a product photo, and AI will remove the background and place it in stunning professional scenes.",
                icon: <ImageIcon className="w-6 h-6 text-blue-400" />
              },
              {
                title: "Multi-Language Captions",
                desc: "Generate engaging captions in Hindi, Hinglish, English, or regional languages with trending hashtags.",
                icon: <Share2 className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "A/B Variations",
                desc: "Not sure which design works best? AI gives you 4 unique variations for every prompt to choose from.",
                icon: <Sparkles className="w-6 h-6 text-pink-400" />
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-600 to-orange-500 rounded-[40px] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">
              Ready to automate your social media?
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10 font-medium">
              Join thousands of businesses who are saving hours every week and getting better engagement with DhandaGrow's AI Postmaker.
            </p>
            <Button variant="secondary" size="lg" className="relative z-10 h-14 px-10 text-lg font-bold rounded-full text-purple-700 bg-white hover:bg-slate-50 border-0 shadow-xl">
              Try Postmaker for Free
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
