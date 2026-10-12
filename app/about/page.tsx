import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Quote } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FCF9F6] selection:bg-[#D95A2B]/30 selection:text-[#D95A2B] font-sans text-[#1F2937]">
      <Navbar />
      
      {/* Hero Section with Grid Background */}
      <section className="pt-40 pb-20 relative overflow-hidden flex flex-col items-center text-center">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, #EEDFCD 1px, transparent 1px), linear-gradient(to bottom, #EEDFCD 1px, transparent 1px)'
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-serif text-[#D95A2B] mb-8">
            Our Vision
          </h1>
          <p className="text-xl md:text-3xl font-medium leading-relaxed text-slate-700 max-w-3xl text-center">
            To build a world where every business, regardless of size, budget, or technical expertise, has access to enterprise-grade AI intelligence to scale, market, and grow their brand globally.
          </p>
        </div>
      </section>

      {/* Hero Image Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 -mt-4">
        <div className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="/images/about-business.jpg" 
            alt="DhandaGrow Team" 
            className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* Vertical Connector */}
      <div className="flex justify-center my-12">
        <div className="w-[1px] h-24 bg-[#EEDFCD]"></div>
      </div>

      {/* Message from Founder */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-3/5">
            <h2 className="text-[#D95A2B] text-2xl font-serif mb-6">
              A Message from the Founders
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-slate-700">
              <p>
                DhandaGrow was founded with a simple vision: to level the playing field for growing businesses. We noticed that enterprise companies had massive teams of marketers, designers, and data analysts, while smaller businesses and independent creators struggled to keep up with the demands of digital marketing.
              </p>
              <p>
                We knew there had to be a better way. We built DhandaGrow to be your all-in-one AI partner. By combining cutting-edge artificial intelligence with intuitive marketing tools, we enable you to create stunning content, automate your workflows, and grow faster than ever before.
              </p>
            </div>
            
            <div className="mt-10">
              <div className="font-serif text-3xl text-slate-400 mb-2 italic">Founders</div>
              <p className="text-[#D95A2B] font-bold text-lg">DhandaGrow Team</p>
              <p className="text-slate-500 text-sm">Building the future of AI marketing</p>
            </div>
          </div>
          
          <div className="w-full md:w-2/5">
            <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-xl border border-[#EEDFCD]/50 relative group">
              <img 
                src="/images/about-analytics.jpg" 
                alt="Founder" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Connector */}
      <div className="flex justify-center my-16">
        <div className="w-[1px] h-24 bg-[#EEDFCD]"></div>
      </div>

      {/* Our Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Side orange line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-[2px] bg-[#D95A2B]/40 hidden sm:block"></div>
        
        <div className="sm:pl-12">
          <h2 className="text-5xl md:text-6xl font-serif text-[#D95A2B] mb-8">
            Our Mission
          </h2>
          <div className="space-y-6 text-xl leading-relaxed text-slate-700">
            <p>
              To simplify digital marketing by providing an all-in-one AI ecosystem that completely automates the heavy lifting.
            </p>
            <p>
              We want to allow business owners and creators to focus entirely on authentic connections and building great products, while AI handles their growth engine.
            </p>
          </div>
        </div>
      </section>

      {/* Vertical Connector */}
      <div className="flex justify-center my-16">
        <div className="w-[1px] h-24 bg-[#EEDFCD]"></div>
      </div>

      {/* Story / Quote Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Quote className="w-12 h-12 text-[#D95A2B]/20 mx-auto mb-6" />
        <h3 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight mb-8">
          "We knew there had to be a better way to bring innovative marketing solutions to growing businesses, faster and cheaper."
        </h3>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Today, thousands of brands trust DhandaGrow to act as their 24/7 autonomous marketing team—generating ideas, building creatives, analyzing data, and interacting with customers in real-time. We bridge the gap between advanced technology and everyday business owners.
        </p>
      </section>

      {/* Vertical Connector */}
      <div className="flex justify-center my-20">
        <div className="w-[1px] h-24 bg-[#EEDFCD]"></div>
      </div>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-4xl md:text-5xl font-serif text-[#D95A2B] text-center mb-16">
          Our Core Values
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Innovation First",
              desc: "We constantly push the boundaries of AI to bring you the best tools possible.",
            },
            {
              title: "User Empathy",
              desc: "We build for business owners, prioritizing simplicity and actual results over hype.",
            },
            {
              title: "Relentless Quality",
              desc: "From the code we write to the AI outputs we generate, quality is non-negotiable.",
            },
            {
              title: "Radical Transparency",
              desc: "We believe in clear pricing, honest communication, and secure data handling.",
            }
          ].map((val, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-[#EEDFCD] hover:border-[#D95A2B]/30 shadow-sm hover:shadow-md transition-all flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-[#FCF9F6] flex items-center justify-center mb-6 text-[#D95A2B] font-serif text-xl border border-[#EEDFCD]">
                {idx + 1}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 font-serif">{val.title}</h4>
              <p className="text-slate-600 leading-relaxed text-sm">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-4xl md:text-5xl font-serif text-[#D95A2B] text-center mb-16">
          Meet Our Leadership Team
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Rahul Sharma', role: 'Co-founder & CEO' },
            { name: 'Sneha Patel', role: 'Co-founder & COO' },
            { name: 'Vikram Singh', role: 'Head of Technology' },
            { name: 'Priya Desai', role: 'Head of AI Research' }
          ].map((leader, idx) => (
            <div key={idx} className="flex flex-col group">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-slate-200 border border-[#EEDFCD]">
                <img 
                  src="/images/about-business.jpg" 
                  alt={leader.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <div>
                  <h4 className="text-[#D95A2B] font-bold text-lg">{leader.name}</h4>
                  <p className="text-slate-500 text-sm">{leader.role}</p>
                </div>
                {/* Small LinkedIn icon placeholder */}
                <a href="#" className="w-8 h-8 rounded-full bg-[#FCF9F6] border border-[#EEDFCD] flex items-center justify-center text-slate-400 hover:text-[#0A66C2] transition-colors">
                  <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EEDFCD] shadow-sm relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
            Come Work With Us
          </h2>
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
            Join the AI revolution. Help us empower millions of businesses with cutting-edge artificial intelligence and shape the future of digital marketing.
          </p>
          <Button className="bg-[#D95A2B] hover:bg-[#C04920] text-white px-8 py-6 rounded-full text-lg shadow-lg shadow-[#D95A2B]/25">
            View Careers <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
