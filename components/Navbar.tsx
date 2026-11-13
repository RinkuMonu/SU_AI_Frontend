'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Building2,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { featuresMenu } from '@/data/features';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDarkFeaturePage = pathname === '/features/ai-ads';
  const isLightPage = !isDarkFeaturePage && (
    pathname.startsWith('/legal') ||
    pathname === '/careers' ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/features') ||
    pathname === '/download'
  );

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user, logout } = useAuth();
  const webHref = '/login/user';
  const destinationHref = (mounted && user)
    ? user.role === 'influencer'
      ? (user.onboardingCompleted ? '/influencer' : '/onboarding/influencer')
      : (user.onboardingCompleted ? '/dashboard' : '/onboarding')
    : '/login/user';

  const isLightNav = isLightPage || isScrolled;

  const textColorClass = isLightNav
    ? 'text-slate-700 hover:text-slate-950'
    : 'text-white/80 hover:text-white';

  const pillClass = isLightNav
    ? (isScrolled
      ? 'bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-black/8'
      : 'bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-sm')
    : 'bg-transparent border border-transparent';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full px-2 py-2 sm:px-4 md:px-5 lg:px-8 transition-all duration-300 ',
        isScrolled ? 'pt-2 ' : 'pt-3 sm:pt-4 lg:pt-5'
      )}
    >
      <div
        className={cn(
          'w-full max-w-7xl mx-auto flex items-center justify-between rounded-full px-3 py-2 sm:px-5  sm:py-3 lg:px-6  transition-all duration-300 relative',
          pillClass
        )}
      >

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/dhandagrow.png"
            alt="DhandaGrow"
            width={120}
            height={32}
            className={cn(" w-auto h-5  object-contain transition-all duration-300", isLightNav ? "" : "brightness-0 invert")}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          {/* Features Mega Menu Wrapper */}
          <div className="group relative">
            <Link
              href="/#features"
              className={cn('text-sm font-medium transition-colors flex items-center gap-1 py-2', textColorClass)}
            >
              Features
              <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-rotate-180 transition-all duration-300" />
            </Link>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
              {/* Invisible bridge to keep hover active */}
              <div className="absolute -top-4 left-0 w-full h-8 bg-transparent" />

              <div className="w-[1000px] max-w-[calc(100vw-32px)] md:ml-24 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border border-slate-100 p-8 grid grid-cols-5 gap-6">
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

          {/* Company Dropdown Wrapper */}
          <div className="group relative">
            <Link
              href="/about"
              className={cn('text-sm font-medium transition-colors flex items-center gap-1 py-2', textColorClass)}
            >
              Company
              <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-rotate-180 transition-all duration-300" />
            </Link>

            {/* Company Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
              {/* Invisible bridge to keep hover active */}
              <div className="absolute -top-4 left-0 w-full h-8 bg-transparent" />

              <div className="w-[280px] bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] border border-slate-100 p-3 flex flex-col">
                <Link href="/about" className="group/item flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shrink-0 shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 group-hover/item:text-indigo-600 transition-colors leading-tight">
                      About Us
                    </span>
                    <span className="text-[11.5px] text-slate-500 leading-snug mt-1">
                      Our mission, story, and vision
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <Link href="/#blog" className={cn('text-sm font-medium transition-colors', textColorClass)}>
            Blog
          </Link>
          <Link href="/pricing" className={cn('text-sm font-medium transition-colors', textColorClass)}>
            Pricing
          </Link>
          <Link href="/#contact" className={cn('text-sm font-medium transition-colors', textColorClass)}>
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSelector align="right" />
          {mounted && user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className={cn(
                  'hidden lg:flex transition-all',
                  isLightNav
                    ? 'border-slate-300 text-slate-800 bg-slate-50/50 hover:bg-slate-100 hover:text-slate-950'
                    : 'border-white/20 text-white bg-white/5 hover:bg-white/10'
                )}
              >
                <Link href={destinationHref}>Dashboard</Link>
              </Button>
              <button
                type="button"
                onClick={logout}
                className={cn(
                  'hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer',
                  isLightNav
                    ? 'border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                    : 'border-white/15 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                )}
                title="Log out from your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              asChild
              className={cn(
                'hidden lg:flex transition-all',
                isLightNav
                  ? 'border-slate-300 text-slate-800 bg-slate-50/50 hover:bg-slate-100 hover:text-slate-950'
                  : 'border-white/20 text-white bg-white/5 hover:bg-white/10'
              )}
            >
              <Link href={webHref}>Use on Web</Link>
            </Button>
          )}
          <Button variant="default" size="sm" asChild>
            <Link href="/download">Get the App</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            'lg:hidden flex items-center justify-center w-10 h-10 shrink-0 rounded-full  transition-colors',
            isLightNav ? 'text-slate-700 hover:text-slate-950' : 'text-white/80 hover:text-white')}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="
        lg:hidden absolute top-full left-2 right-2 sm:left-4 sm:right-4 mt-2  bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6  shadow-2xl flex flex-col gap-5 sm:gap-6 max-h-[calc(100dvh-100px)] overflow-y-auto">
          {/* Features Accordion */}
          <div className="flex flex-col gap-4">
            <span className="text-base sm:text-lg  font-medium text-white/90">
              Features
            </span>
            <div className="pl-4 flex flex-col gap-5">
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

          {/* Company */}
          <div className="flex flex-col gap-2">
            <span className="text-base sm:text-lg font-medium text-white/90">Company</span>
            <div className="pl-4 flex flex-col gap-2 border-l border-white/10 ml-2">
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 text-white/70 hover:text-white text-sm">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>About Us</span>
              </Link>
            </div>
          </div>

          <Link href="/#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-base sm:text-lg  font-medium text-white/90 hover:text-white transition-colors">Blog</Link>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base sm:text-lg font-medium text-white/90 hover:text-white transition-colors">Pricing</Link>
          <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base sm:text-lg font-medium text-white/90 hover:text-white transition-colors">Contact</Link>

          <div className="flex items-center justify-between py-2 border-t border-white/10">
            <span className="text-sm font-medium text-white/80">Language</span>
            <LanguageSelector align="right" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {mounted && user ? (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={destinationHref} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full h-10 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <Link href={webHref} onClick={() => setIsMobileMenuOpen(false)}>Use on Web</Link>
              </Button>
            )}
            <Button variant="default" className="w-full" asChild>
              <Link href="/download" onClick={() => setIsMobileMenuOpen(false)}>Get the App</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
