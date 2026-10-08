'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { 
  Search, Rocket, Sparkles, Share2, MessageCircle, BarChart3, CreditCard, 
  Globe, ShieldCheck, ChevronDown, ArrowRight, Bot, MessageSquare, 
  Mail, HelpCircle, Activity, CheckCircle2, FileText, Command
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const categories = [
  {
    title: "Getting Started",
    icon: Rocket,
    desc: "Learn how to create your account, set up your business and get started.",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "group-hover:border-blue-400/30",
    links: ["Create your account", "Business setup", "Brand setup", "First AI creation"]
  },
  {
    title: "AI Features",
    icon: Sparkles,
    desc: "Learn how to use DhandaGrow's AI-powered tools.",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "group-hover:border-purple-400/30",
    links: ["AI Post Maker", "AI Reel Maker", "AI Photoshoot", "AI Avatar", "AI Website Builder"]
  },
  {
    title: "Social Media",
    icon: Share2,
    desc: "Connect and manage your social media presence.",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "group-hover:border-pink-400/30",
    links: ["Instagram connection", "Instagram Autopilot", "Instagram DM AI", "Social Media Calendar", "Publishing"]
  },
  {
    title: "WhatsApp AI",
    icon: MessageCircle,
    desc: "Set up AI-powered customer conversations on WhatsApp.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "group-hover:border-emerald-400/30",
    links: ["Connect WhatsApp", "Product catalogue", "Automated replies", "Customer questions", "WhatsApp campaigns"]
  },
  {
    title: "Business & Analytics",
    icon: BarChart3,
    desc: "Understand your marketing performance and business growth.",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "group-hover:border-orange-400/30",
    links: ["Analytics dashboard", "Marketing score", "Leads", "Campaign performance", "Reports"]
  },
  {
    title: "Account & Billing",
    icon: CreditCard,
    desc: "Manage your account, subscription and AI credits.",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "group-hover:border-indigo-400/30",
    links: ["Account settings", "Subscription", "AI credits", "Payments", "Invoices"]
  },
  {
    title: "Website Builder",
    icon: Globe,
    desc: "Create and manage your AI-powered business website.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "group-hover:border-cyan-400/30",
    links: ["Create website", "Edit website", "Domain", "Website settings", "Publishing"]
  },
  {
    title: "Security & Privacy",
    icon: ShieldCheck,
    desc: "Learn how we protect your account and information.",
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    borderColor: "group-hover:border-slate-400/30",
    links: ["Account security", "Privacy", "Data", "Cookies", "Security practices"]
  }
];

const popularGuides = [
  { title: "Create your first AI post", icon: Sparkles, desc: "A step-by-step guide to generating your first AI social media post." },
  { title: "Generate your first AI reel", icon: Share2, desc: "Learn how to turn text into highly engaging Instagram Reels instantly." },
  { title: "Set up your business profile", icon: Rocket, desc: "Complete your brand profile so AI understands your tone and style." },
  { title: "Connect Instagram", icon: MessageSquare, desc: "Link your Instagram account to enable Autopilot and DM AI features." },
  { title: "Connect WhatsApp", icon: MessageCircle, desc: "Start automating your WhatsApp business conversations in 5 minutes." },
  { title: "Create your first campaign", icon: BarChart3, desc: "Launch an AI-generated ad campaign and track your leads effortlessly." }
];

const faqs = [
  { q: "What is DhandaGrow?", a: "DhandaGrow is an all-in-one AI platform designed to help businesses create content, manage social media, and accelerate growth using advanced artificial intelligence." },
  { q: "How do I create my first AI post?", a: "Navigate to the AI Post Maker from your dashboard, describe what you want to post about, and let UNI AI generate the image, caption, and hashtags for you." },
  { q: "How do AI credits work?", a: "Each AI generation (post, reel, photoshoot) consumes credits. Your monthly subscription includes a set number of credits which reset every billing cycle." },
  { q: "How can I connect Instagram?", a: "Go to Settings > Integrations and click 'Connect Instagram'. You will be redirected to securely authenticate with your Facebook/Instagram account." },
  { q: "How can I connect WhatsApp?", a: "In the WhatsApp AI tab, scan the provided QR code with your WhatsApp Business app to link your account to our AI responders." },
  { q: "Can I cancel my subscription?", a: "Yes, you can cancel or downgrade your subscription at any time from the Account & Billing settings page." },
  { q: "How do I create an AI Reel?", a: "Open the AI Reel Maker, select your product or enter a script prompt, choose a voiceover style, and hit generate." },
  { q: "How do I contact support?", a: "You can use the Live Chat widget in the bottom right corner of your dashboard, or email us directly at support@dhandagrow.ai." }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#05050A] text-slate-300 selection:bg-purple-500/30 selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-36 pb-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05050A]/80 to-[#05050A]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <HelpCircle className="w-4 h-4 text-blue-400" /> DhandaGrow Help Center
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Find answers, explore guides and get the most out of DhandaGrow AI.
          </p>

          {/* Search Box */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-2 backdrop-blur-xl transition-all duration-300 focus-within:bg-white/[0.05] focus-within:border-purple-500/50">
              <div className="pl-4 pr-2">
                <Search className="w-6 h-6 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers, guides and features..." 
                className="w-full h-14 bg-transparent border-0 text-white text-lg placeholder:text-slate-500 focus:ring-0 outline-none"
              />
              <div className="pr-4 hidden sm:flex items-center gap-1 opacity-50">
                <kbd className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-sans text-xs border border-white/10 text-white">⌘</kbd>
                <kbd className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-sans text-xs border border-white/10 text-white">K</kbd>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-slate-500 mr-2">Popular searches:</span>
            {["AI Post Maker", "AI Reel Maker", "AI Photoshoot", "WhatsApp AI", "Instagram Automation", "Billing", "Account"].map((tag) => (
              <button 
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Explore Help Topics</h2>
            <p className="text-lg text-slate-400 font-medium">Everything you need to get started and grow with DhandaGrow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "group bg-white/[0.02] border border-white/5 rounded-[24px] p-6 backdrop-blur-sm transition-all duration-500",
                  "hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col h-full",
                  cat.borderColor
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110", cat.bgColor)}>
                    <cat.icon className={cn("w-6 h-6", cat.color)} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{cat.title}</h3>
                </div>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed flex-grow">{cat.desc}</p>
                
                <ul className="space-y-3 mt-auto">
                  {cat.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link href="#" className="flex items-center text-sm font-medium text-slate-300 hover:text-white group/link transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover/link:bg-white mr-3 transition-colors" />
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-20 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Popular Guides</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGuides.map((guide, idx) => (
              <Link 
                key={idx} 
                href="#"
                className="group flex gap-5 bg-white/[0.02] border border-white/5 rounded-[20px] p-6 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 shrink-0 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  <guide.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{guide.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{guide.desc}</p>
                  <span className="text-sm font-semibold text-indigo-400 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    Read Guide <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ask UNI AI & Contact */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Ask UNI AI */}
          <div className="lg:col-span-7 relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#130927] to-[#0a1930] border border-white/10 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white mb-8 shadow-lg shadow-purple-500/25">
                <Bot className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Ask UNI AI</h2>
              <p className="text-lg text-slate-300 font-medium mb-8">
                Can't find what you're looking for? Ask our AI assistant and get help instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input 
                  type="text" 
                  placeholder="Ask anything about DhandaGrow..." 
                  className="flex-1 h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
                <Button className="h-14 px-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  Ask UNI AI <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-slate-500 mr-2 py-1">Example questions:</span>
                {["How do I create a Reel?", "How do I connect Instagram?", "How do AI credits work?"].map((q) => (
                  <button key={q} className="text-sm text-purple-400 bg-purple-400/10 hover:bg-purple-400/20 px-3 py-1 rounded-full transition-colors font-medium">
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Still need help?</h2>
              <p className="text-lg text-slate-400 font-medium">Our support team is here to help you.</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-[20px] p-5 flex items-center gap-4 hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Live Chat</h3>
                  <p className="text-sm text-slate-400">Chat with our support team.</p>
                </div>
                <Button variant="outline" className="shrink-0 border-white/10 hover:bg-white/10 hover:text-white rounded-lg">
                  Start Chat
                </Button>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[20px] p-5 flex items-center gap-4 hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Email Support</h3>
                  <p className="text-sm text-slate-400 truncate max-w-[150px]">Send us your question.</p>
                </div>
                <Button variant="outline" className="shrink-0 border-white/10 hover:bg-white/10 hover:text-white rounded-lg">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ & System Status */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FAQs */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "bg-white/[0.02] border rounded-[20px] overflow-hidden transition-all duration-300",
                    openFaq === idx ? "border-white/20 bg-white/[0.04]" : "border-white/5 hover:border-white/10"
                  )}
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="text-lg font-bold text-white tracking-tight">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ml-4", openFaq === idx ? "rotate-180" : "")} />
                  </button>
                  <div 
                    className={cn(
                      "transition-all duration-300 ease-in-out px-6",
                      openFaq === idx ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-slate-400 leading-relaxed font-medium pt-2 border-t border-white/5">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="lg:col-span-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">System Status</h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    All systems operational
                  </div>
                </div>
              </div>
              
              <ul className="space-y-4">
                {[
                  "AI Services",
                  "Image Generation",
                  "Video Generation",
                  "Social Integrations",
                  "Dashboard"
                ].map((sys) => (
                  <li key={sys} className="flex items-center justify-between text-sm font-medium">
                    <span className="text-slate-300">{sys}</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <Link href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1">
                  View Detailed Status <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
