'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          isScrolled 
            ? 'bg-white/90 backdrop-blur-lg border border-slate-200 shadow-2xl shadow-black/10' 
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
  className="h-8 w-auto object-contain"
/>
</Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
           <Link href="/about" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white')}>
           About Us
          </Link>
          <Link href="/#features" className={cn('text-sm font-medium transition-colors flex items-center gap-1 group', isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white')}>
            Features
            <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link href="/#blog" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white')}>
            Blog
          </Link>
          <Link href="/#pricing" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white')}>
            Pricing
          </Link>
          <Link href="/#contact" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white')}>
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
        <div className="md:hidden absolute top-20 left-4 right-4 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/90 hover:text-white transition-colors">About Us</Link>
          <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/90 hover:text-white transition-colors">Features</Link>
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
