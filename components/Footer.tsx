import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Box, FileText, Shield, Zap, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden bg-[#090b14]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{
          backgroundImage: "url('/footer_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-[#090b14]/50 z-0 lg:bg-gradient-to-r lg:from-[#090b14]/95 lg:via-[#090b14]/80 lg:to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-0 mb-24">
          
          {/* Column 1: Brand & Social */}
          <div className="lg:col-span-4 lg:pr-12">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image
                src="/images/dhandagrow.png"
                alt="DhandaGrow"
                width={200}
                height={55}
                className="h-11 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-slate-300 text-[15px] leading-relaxed max-w-[280px] mb-8 font-medium">
              AI-powered tools to help your business create, publish and grow faster.
            </p>
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a href="https://facebook.com/dhandagrow" className="w-11 h-11 rounded-full bg-white/[0.02] hover:bg-[#1877F2]/90 transition-all duration-300 flex items-center justify-center text-white border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[#1877F2]/30 hover:scale-110">
                <svg className="w-[16px] h-[16px] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Twitter/X */}
              <a href="https://twitter.com/dhandagrow" className="w-11 h-11 rounded-full bg-white/[0.02] hover:bg-black/90 transition-all duration-300 flex items-center justify-center text-white border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-white/20 hover:scale-110">
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com/company/dhandagrow" className="w-11 h-11 rounded-full bg-white/[0.02] hover:bg-[#0A66C2]/90 transition-all duration-300 flex items-center justify-center text-white border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[#0A66C2]/30 hover:scale-110">
                <svg className="w-[16px] h-[16px] fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/dhandagrow" className="w-11 h-11 rounded-full bg-white/[0.02] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] transition-all duration-300 flex items-center justify-center text-white border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[#bc1888]/30 hover:scale-110">
                <svg className="w-[16px] h-[16px] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@DhandhaGrow" className="w-11 h-11 rounded-full bg-white/[0.02] hover:bg-[#FF0000]/90 transition-all duration-300 flex items-center justify-center text-white border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[#FF0000]/30 hover:scale-110">
                <svg className="w-[16px] h-[16px] fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Column 2: Company */}
          <div className="lg:col-span-2 relative z-10 lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="text-white font-bold mb-6 text-[16px] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Home className="w-4 h-4 text-white" />
              </div>
              Company
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Features', href: '/#features' },
                { name: 'Pricing', href: '/#pricing' },
                { name: 'Blog', href: '/#blog' },
                { name: 'Contact', href: '/#contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-300 hover:text-white transition-colors text-[14px] font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Product */}
          <div className="lg:col-span-3 relative z-10 lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="text-white font-bold mb-6 text-[16px] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Box className="w-4 h-4 text-white" />
              </div>
              Product
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'AI Post Maker', href: '/features/ai-post-maker' },
                { name: 'AI Reel Maker', href: '/features/ai-reel-maker' },
                { name: 'AI Photoshoot', href: '/features/ai-photoshoot' },
                { name: 'AI Avatar & Actor', href: '/features/ai-avatar' },
                { name: 'AI Website Builder', href: '/features/website-builder' },
                { name: 'Social Media Automation', href: '/features/social-calendar' },
                { name: 'Business Analytics', href: '/features/analytics' },
                { name: 'Leads CRM', href: '/features/crm' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-300 hover:text-white transition-colors text-[14px] font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="lg:col-span-3 relative z-10 lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="text-white font-bold mb-6 text-[16px] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <FileText className="w-4 h-4 text-white" />
              </div>
              Legal
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Privacy Policy', href: '/legal/privacy-policy' },
                { name: 'Terms of Service', href: '/legal/terms-of-service' },
                { name: 'Cookie Policy', href: '/legal/cookie-policy' },
                { name: 'Refund Policy', href: '/legal/refund-policy' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-300 hover:text-white transition-colors text-[14px] font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Left: Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shrink-0">
            <Image
              src="/dhandagrow.png"
              alt="DhandaGrow Icon"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <p className="text-slate-300 text-[14px] font-medium max-w-[200px] leading-tight sm:border-l sm:border-white/20 sm:pl-4">
              © 2026 DhandaGrow. All rights reserved.
            </p>
          </div>
          
          {/* Middle: Badges */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a1930] border border-[#0d6efd]/20 text-white text-[13px] font-medium shadow-lg shadow-black/20">
                <Shield className="w-4 h-4 text-[#0d6efd]" />
                Secure & Safe
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1d0e2e] border border-[#a855f7]/20 text-white text-[13px] font-medium shadow-lg shadow-black/20">
                <Zap className="w-4 h-4 text-[#a855f7]" />
                99.9% Uptime
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a1930] border border-[#0dcaf0]/20 text-white text-[13px] font-medium shadow-lg shadow-black/20">
                <Users className="w-4 h-4 text-[#0dcaf0]" />
                Trusted by 10,000+ Businesses
              </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111623] border border-white/5 text-white text-[13px] font-medium shadow-lg shadow-black/20">
              <div className="w-4 h-4 rounded-sm overflow-hidden flex flex-col border border-white/20">
                <div className="w-full h-1/3 bg-[#FF9933]"></div>
                <div className="w-full h-1/3 bg-white flex items-center justify-center">
                  <div className="w-[3px] h-[3px] rounded-full bg-[#000080]"></div>
                </div>
                <div className="w-full h-1/3 bg-[#138808]"></div>
              </div>
              Made in India
            </div>
          </div>
          
          {/* Right: Links */}
          <div className="flex items-center gap-6 text-slate-300 text-[14px] font-medium shrink-0">
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
