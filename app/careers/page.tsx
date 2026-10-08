import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Heart, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CareersPage() {
  const positions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote (India)",
      type: "Full-time",
      desc: "Join our core team to build and train generative models for marketing and content creation."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Bengaluru, India",
      type: "Full-time",
      desc: "Shape the future of our AI tools by crafting beautiful, intuitive, and highly functional interfaces."
    },
    {
      title: "Growth Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      desc: "Lead our user acquisition strategies and scale DhandaGrow to 100k+ active businesses."
    },
    {
      title: "Prompt Engineer",
      department: "AI Research",
      location: "Remote",
      type: "Contract",
      desc: "Design and optimize complex prompt architectures for our content generation engines."
    }
  ];

  const benefits = [
    { icon: <Globe />, title: "Work Anywhere", desc: "We are a remote-first company. Work from anywhere in the world." },
    { icon: <Heart />, title: "Health & Wellness", desc: "Comprehensive health coverage for you and your family." },
    { icon: <Zap />, title: "Continuous Learning", desc: "Annual budget for courses, books, and conferences." },
    { icon: <Sparkles />, title: "Latest Tech", desc: "Get the best hardware and software to do your best work." }
  ];

  return (
    <main className="min-h-screen bg-white selection:bg-primary/30 selection:text-white">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#f8f9fc] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-sm mb-6">
            <Briefcase className="w-4 h-4" /> We're Hiring!
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Build the future of <br className="hidden md:block"/> AI with us.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium mb-10">
            Join a passionate team dedicated to democratizing artificial intelligence for businesses around the globe.
          </p>
          <Button size="lg" className="h-14 px-8 rounded-full text-base shadow-lg shadow-indigo-500/25">
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Why join DhandaGrow?</h2>
            <p className="text-slate-600 text-lg font-medium">We take care of our team so they can take care of our users.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="bg-[#f8f9fc] rounded-3xl p-8 border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6 text-indigo-600">
                  {b.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{b.title}</h3>
                <p className="text-slate-600 text-sm font-medium">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-[#f8f9fc] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Open Positions</h2>
            <p className="text-slate-600 text-lg font-medium">Find your next opportunity.</p>
          </div>

          <div className="space-y-6">
            {positions.map((pos, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-indigo-100 transition-colors cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3 text-sm font-semibold">
                      <span className="text-indigo-600">{pos.department}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {pos.location}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                      <span className="text-slate-500 hidden sm:flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {pos.type}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{pos.title}</h3>
                    <p className="text-slate-600 font-medium">{pos.desc}</p>
                  </div>
                  <div className="shrink-0">
                    <Button variant="outline" className="rounded-full group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
