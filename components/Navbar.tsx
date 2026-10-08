'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { featuresMenu } from '@/data/features';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLightPage = pathname === '/about' || pathname.startsWith('/legal') || pathname === '/careers' || pathname.startsWith('/blog');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColorClass = isScrolled || isLightPage 
    ? 'text-slate-700 hover:text-slate-950' 
    : 'text-white/80 hover:text-white';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 sm:px-6 lg:px-8',
        isScrolled ? 'pt-4' : 'pt-6'
      )}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300',
          (isScrolled || isLightPage)
            ? 'bg-white/90 backdrop-blur-lg border border-slate-200 shadow-xl shadow-black/5' 
            : 'bg-transparent border border-transparent'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/dhandagrow.png"
            alt="DhandaGrow"
            width={100}
            height={30}
            className={cn("h-8 w-auto object-contain transition-all", (isScrolled || isLightPage) ? "" : "brightness-0 invert")}
          />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 relative">
           <Link href="/about" className={cn('text-sm font-medium transition-colors', textColorClass)}>
             About Us
          </Link>
          
          {/* Mega Menu Wrapper */}
          <div className="group relative">
            <Link href="/#features" className={cn('text-sm font-medium transition-colors flex items-center gap-1 py-2', textColorClass)}>
              Features
              <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-rotate-180 transition-all duration-300" />
            </Link>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
              {/* Invisible bridge to keep hover active */}
              <div className="absolute -top-6 left-0 w-full h-12 bg-transparent" />
              
              <div className="w-[1000px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-8 grid grid-cols-5 gap-6">
                {featuresMenu.categories.map((category, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <category.icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm tracking-tight">{category.title}</h3>
                    </div>
                    <div className="flex flex-col gap-5">
                      {category.items.map((item, itemIdx) => (
                        <Link key={itemIdx} href={item.route} className="group/item flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 group-hover/item:border-indigo-100 transition-colors shrink-0">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700 group-hover/item:text-indigo-600 transition-colors leading-tight">{item.name}</span>
                            <span className="text-[11px] text-slate-500 line-clamp-2 leading-snug mt-1 transition-colors">{item.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/#blog" className={cn('text-sm font-medium transition-colors', textColorClass)}>
            Blog
          </Link>
          <Link href="/#pricing" className={cn('text-sm font-medium transition-colors', textColorClass)}>
            Pricing
          </Link>
          <Link href="/#contact" className={cn('text-sm font-medium transition-colors', textColorClass)}>
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn('hidden lg:flex transition-all', isScrolled && 'border-slate-300 text-slate-900 bg-transparent hover:bg-slate-100')}
          >
            <Link href="/dashboard">Use on Web</Link>
          </Button>
          <Button variant="default" size="sm">Get the App</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={cn('md:hidden transition-colors', isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white')}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/90 hover:text-white transition-colors">About Us</Link>
          
          <div className="flex flex-col gap-4">
            <span className="text-lg font-medium text-white/90">Features</span>
            <div className="pl-4 flex flex-col gap-6">
              {featuresMenu.categories.map((category, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#fc9a5d]">
                    <category.icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{category.title}</span>
                  </div>
                  <div className="flex flex-col gap-3 pl-6 border-l border-white/10">
                    {category.items.map((item, itemIdx) => (
                      <Link key={itemIdx} href={item.route} onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white text-sm">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/90 hover:text-white transition-colors">Blog</Link>
          <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/90 hover:text-white transition-colors">Pricing</Link>
          <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/90 hover:text-white transition-colors">Contact</Link>
          
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Use on Web</Link>
            </Button>
            <Button variant="default" className="w-full">Get the App</Button>
          </div>
        </div>
      )}
    </header>
  );
}
