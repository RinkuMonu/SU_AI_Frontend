import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight, Info } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary/30 selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-32 overflow-hidden relative min-h-[500px] lg:min-h-[600px] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/40 via-transparent to-pink-50/40 pointer-events-none" />
        
        {/* Full-bleed right image (Desktop) */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-0 hidden lg:block">
          {/* Gradient to smooth out the left edge of the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent z-10 w-[30%]" />
          <img 
            src="/images/about-business.jpg" 
            alt="Team working together" 
            className="w-full h-full object-cover object-[center_top] [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_100%)]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="w-full lg:w-[45%] flex flex-col items-start py-10 lg:py-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 mb-6">
                <Rocket className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500">
                  Scale & Grow
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                About Us
              </h1>
              
              <p className="text-xl md:text-[22px] text-slate-600 leading-relaxed max-w-lg font-medium">
                We're on a mission to help businesses grow with the power of Artificial Intelligence.
              </p>
            </div>
            
            {/* Mobile Image (hidden on desktop) */}
            <div className="w-full relative lg:hidden">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="/images/about-business.jpg" 
                  alt="Team working together" 
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
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 tracking-tight">10K+</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Happy Businesses</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 tracking-tight">5M+</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Content Created</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 tracking-tight">98%</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 tracking-tight">24/7</h3>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 lg:py-32 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl">
                <img 
                  src="/images/about-analytics.jpg" 
                  alt="Man working on laptop" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Right Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <h2 className="text-4xl md:text-[44px] font-bold text-slate-900 mb-8 tracking-tight">
                Our Story
              </h2>
              
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-10 font-medium">
                <p>
                  DhandaGrow was founded with a simple vision: to level the playing field for growing businesses. We noticed that enterprise companies had massive teams of marketers, designers, and data analysts, while smaller businesses and independent creators struggled to keep up with the demands of digital marketing.
                </p>
                <p>
                  We knew there had to be a better way. We built DhandaGrow to be your all-in-one AI partner. By combining cutting-edge artificial intelligence with intuitive marketing tools, we enable you to create stunning content, automate your workflows, and grow faster than ever before. 
                </p>
                <p>
                  Today, thousands of brands trust DhandaGrow to act as their 24/7 autonomous marketing team—generating ideas, building creatives, analyzing data, and interacting with customers in real-time.
                </p>
              </div>
              
              <Button variant="default" size="lg" className="h-14 px-8 text-base shadow-lg shadow-indigo-500/25 group font-semibold rounded-full">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 text-white" />
                  </div>
                  Learn More
                </span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* Vision & Mission Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Vision Card */}
            <div className="bg-[#f8f9fc] rounded-[32px] p-10 md:p-14 border border-slate-100 flex flex-col items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/50 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8 relative z-10">
                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6 relative z-10 tracking-tight">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium relative z-10 mb-6">
                To build a world where every business, regardless of size, budget, or technical expertise, has access to enterprise-grade AI intelligence to scale, market, and grow their brand globally.
              </p>
              <ul className="space-y-3 mt-auto relative z-10 text-slate-600 font-medium">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"/> Global reach for local businesses</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"/> Democratizing advanced technology</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"/> Fostering infinite creativity</li>
              </ul>
            </div>

            {/* Mission Card */}
            <div className="bg-[#f8f9fc] rounded-[32px] p-10 md:p-14 border border-slate-100 flex flex-col items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/50 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="w-14 h-14 rounded-2xl bg-[#f0449b]/10 flex items-center justify-center mb-8 relative z-10">
                <svg className="w-7 h-7 text-[#f0449b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6 relative z-10 tracking-tight">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium relative z-10 mb-6">
                To simplify digital marketing by providing an all-in-one AI ecosystem that completely automates the heavy lifting—allowing business owners and creators to focus entirely on authentic connections and products.
              </p>
              <ul className="space-y-3 mt-auto relative z-10 text-slate-600 font-medium">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#f0449b] shrink-0"/> Continuous innovation in AI</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#f0449b] shrink-0"/> Hyper-localized native language support</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#f0449b] shrink-0"/> User-first intuitive design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-[#f8f9fc] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              The principles that drive every decision we make at DhandaGrow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Innovation First",
                desc: "We constantly push the boundaries of AI to bring you the best tools possible.",
                icon: "🚀"
              },
              {
                title: "User Empathy",
                desc: "We build for business owners, prioritizing simplicity and actual results over hype.",
                icon: "❤️"
              },
              {
                title: "Relentless Quality",
                desc: "From the code we write to the AI outputs we generate, quality is non-negotiable.",
                icon: "✨"
              },
              {
                title: "Radical Transparency",
                desc: "We believe in clear pricing, honest communication, and secure data handling.",
                icon: "🛡️"
              }
            ].map((val, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/20 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-6">{val.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-[#090b14] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b14] to-[#111111]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Our Core Features
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Everything you need to automate your entire business growth cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Content Creation",
                desc: "Generate stunning posts, reels, ads, and product shoots in seconds.",
                icon: (
                  <svg className="w-6 h-6 text-[#fc9a5d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: "Smart Marketing",
                desc: "Let AI build your social calendar, campaigns, and Indian festival posts.",
                icon: (
                  <svg className="w-6 h-6 text-[#f0449b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                )
              },
              {
                title: "Publish & Automate",
                desc: "Auto-post on Instagram, manage DMs, and WhatsApp customers effortlessly.",
                icon: (
                  <svg className="w-6 h-6 text-[#be32ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )
              },
              {
                title: "Business Management",
                desc: "Complete CRM, detailed analytics, website builder, and product cataloging.",
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Brand Intelligence",
                desc: "An AI brain that remembers your tone, audience, colors, and products.",
                icon: (
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "Native Languages",
                desc: "Create and manage your marketing naturally in Hindi and Hinglish.",
                icon: (
                  <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )
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
      
      <Footer />
    </main>
  );
}
