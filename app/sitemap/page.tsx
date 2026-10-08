'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { 
  ChevronDown, ArrowRight, Sparkles, Box, Briefcase, 
  BookOpen, Building, Scale, User, 
  Home, Info, Star, CreditCard, PenTool, Phone,
  ImageIcon, Video, Camera, UserSquare, Shirt, Layout, 
  Megaphone, Bot, Calendar, Hash, MessageCircle, MessageSquare, 
  StarHalf, BarChart, Users, ShoppingBag, Brain, Zap,
  PlaySquare, FileText, Target, BookMarked, HelpCircle, FileQuestion, 
  CheckCircle, Shield, Lock, ScrollText,
  LogIn, UserPlus, Play, LayoutDashboard, Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const sitemapData = [
  {
    category: "Main Pages",
    icon: Compass,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "group-hover:border-blue-400/30",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "About Us", href: "/about", icon: Info },
      { name: "Features", href: "/#features", icon: Star },
      { name: "Pricing", href: "/#pricing", icon: CreditCard },
      { name: "Blog", href: "/#blog", icon: PenTool },
      { name: "Contact", href: "/#contact", icon: Phone },
    ]
  },
  {
    category: "AI Features",
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "group-hover:border-purple-400/30",
    items: [
      { name: "AI Post Maker", href: "/features/ai-post-maker", icon: ImageIcon },
      { name: "AI Reel Maker", href: "/features/ai-reel-maker", icon: Video },
      { name: "AI Photoshoot", href: "/features/ai-photoshoot", icon: Camera },
      { name: "AI Avatar & AI Actor", href: "/features/ai-avatar", icon: UserSquare },
      { name: "Fashion AI", href: "/features/fashion-ai", icon: Shirt },
      { name: "AI Website Builder", href: "/features/website-builder", icon: Layout },
      { name: "AI Advertisement Maker", href: "/features/ads", icon: Megaphone },
      { name: "AI Marketing Agent", href: "/features/marketing-agent", icon: Bot },
      { name: "Social Media Calendar", href: "/features/social-calendar", icon: Calendar },
      { name: "Instagram Autopilot", href: "/features/ig-autopilot", icon: Hash },
      { name: "WhatsApp AI Assistant", href: "/features/whatsapp-ai", icon: MessageCircle },
      { name: "Instagram DM AI", href: "/features/ig-dm", icon: MessageSquare },
      { name: "AI Review Manager", href: "/features/review-manager", icon: StarHalf },
      { name: "Business Analytics", href: "/features/analytics", icon: BarChart },
      { name: "Leads CRM", href: "/features/crm", icon: Users },
      { name: "Product Catalogue", href: "/features/catalogue", icon: ShoppingBag },
      { name: "AI Brand Brain", href: "/features/brand-brain", icon: Brain },
      { name: "UNI AI", href: "/features/uni-ai", icon: Zap },
    ]
  },
  {
    category: "Business Tools",
    icon: Briefcase,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "group-hover:border-orange-400/30",
    items: [
      { name: "Create Content", href: "#", icon: PenTool },
      { name: "Create Social Posts", href: "#", icon: ImageIcon },
      { name: "Create Reels", href: "#", icon: PlaySquare },
      { name: "Generate Product Images", href: "#", icon: Camera },
      { name: "Create Advertisements", href: "#", icon: Target },
      { name: "Manage Social Media", href: "#", icon: Calendar },
      { name: "Manage Leads", href: "#", icon: Users },
      { name: "Manage Products", href: "#", icon: Box },
      { name: "Track Business Growth", href: "#", icon: BarChart },
      { name: "Build Website", href: "#", icon: Layout },
    ]
  },
  {
    category: "Resources",
    icon: BookOpen,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "group-hover:border-emerald-400/30",
    items: [
      { name: "Blog", href: "/#blog", icon: FileText },
      { name: "AI Marketing Guides", href: "#", icon: BookMarked },
      { name: "Business Growth Tips", href: "#", icon: Target },
      { name: "Social Media Tips", href: "#", icon: Hash },
      { name: "AI Tutorials", href: "#", icon: PlaySquare },
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "FAQ", href: "/help", icon: FileQuestion },
    ]
  },
  {
    category: "Company",
    icon: Building,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "group-hover:border-pink-400/30",
    items: [
      { name: "About Us", href: "/about", icon: Info },
      { name: "Our Mission", href: "/about", icon: Target },
      { name: "Our Vision", href: "/about", icon: Compass },
      { name: "Careers", href: "/careers", icon: Briefcase },
      { name: "Contact Us", href: "/#contact", icon: Phone },
      { name: "Support", href: "/help", icon: HelpCircle },
    ]
  },
  {
    category: "Legal",
    icon: Scale,
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    borderColor: "group-hover:border-slate-400/30",
    items: [
      { name: "Privacy Policy", href: "/legal/privacy-policy", icon: Shield },
      { name: "Terms of Service", href: "/legal/terms-of-service", icon: ScrollText },
      { name: "Cookie Policy", href: "/legal/cookie-policy", icon: Lock },
      { name: "Refund Policy", href: "/legal/refund-policy", icon: CheckCircle },
    ]
  },
  {
    category: "Account",
    icon: User,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "group-hover:border-indigo-400/30",
    items: [
      { name: "Sign In", href: "/login", icon: LogIn },
      { name: "Create Account", href: "/login", icon: UserPlus },
      { name: "Get Started", href: "/login", icon: Play },
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]
  }
];

export default function SitemapPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#05050A] text-slate-300 selection:bg-purple-500/30 selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-36 pb-20 relative overflow-hidden">
        {/* Animated Neon Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05050A]/80 to-[#05050A]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-4 h-4 text-purple-400" /> Explore DhandaGrow
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Sitemap
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Explore everything DhandaGrow has to offer and find the right tools, resources and information for your business.
          </p>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop/Tablet Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitemapData.map((category, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "group bg-white/[0.02] border border-white/5 rounded-[32px] p-8 backdrop-blur-sm transition-all duration-500",
                  "hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]",
                  category.borderColor,
                  idx === 1 ? "md:row-span-2" : "" // Make AI features span more rows since it's large
                )}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110", category.bgColor)}>
                    <category.icon className={cn("w-6 h-6", category.color)} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{category.category}</h3>
                </div>
                
                <ul className="space-y-2">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-3 py-2.5 px-4 rounded-xl hover:bg-white/5 transition-all duration-300 group/link"
                      >
                        <item.icon className="w-4 h-4 text-slate-500 group-hover/link:text-white transition-colors" />
                        <span className="font-medium text-slate-400 group-hover/link:text-white transition-colors">
                          {item.name}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-auto text-slate-600 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:text-purple-400 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-4">
            {sitemapData.map((category, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "bg-white/[0.02] border rounded-[24px] overflow-hidden transition-all duration-300",
                  openAccordion === idx ? "border-white/20" : "border-white/5"
                )}
              >
                <button 
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", category.bgColor)}>
                      <category.icon className={cn("w-5 h-5", category.color)} />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{category.category}</h3>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", openAccordion === idx ? "rotate-180" : "")} />
                </button>
                
                <div 
                  className={cn(
                    "transition-all duration-300 ease-in-out px-6",
                    openAccordion === idx ? "max-h-[1000px] pb-6 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <ul className="space-y-1 pt-2 border-t border-white/5">
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link 
                          href={item.href} 
                          className="flex items-center gap-3 py-3 rounded-lg active:bg-white/5 transition-all group/link"
                        >
                          <item.icon className="w-4 h-4 text-slate-500 group-active/link:text-white transition-colors" />
                          <span className="font-medium text-slate-400 group-active/link:text-white transition-colors">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[#130927] to-[#0a1930] border border-white/10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Ambient glows inside CTA */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to grow your business with AI?
              </h2>
              <p className="text-lg text-slate-300 font-medium mb-10 leading-relaxed">
                Create, market, publish and grow — all from one powerful AI platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-slate-950 hover:bg-slate-200 hover:scale-105 transition-all text-base font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 transition-all text-base font-semibold backdrop-blur-md">
                  Explore Features
                </Button>
              </div>
            </div>

            {/* Robot Image */}
            <div className="relative z-10 w-full md:w-[400px] flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 animate-[float_6s_ease-in-out_infinite]">
                {/* Robot glow */}
                <div className="absolute inset-0 bg-blue-500/30 blur-[60px] rounded-full" />
                <img 
                  src="/images/ai_bg.png" 
                  alt="AI Assistant" 
                  className="absolute right-[-250px] top-[-100px] w-[250%] h-[250%] max-w-none object-cover object-right"
                  style={{ clipPath: 'circle(35% at 75% 50%)' }} // Mask just the robot from the bg image if it's there
                />
                {/* Fallback box if image mapping fails visually */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[40px] border border-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl">
                   <Bot className="w-32 h-32 text-white/50" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
