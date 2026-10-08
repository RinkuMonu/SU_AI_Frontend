import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer id="contact" className="bg-white pt-24 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-3">
<Image
  src="/images/dhandagrow.png"
  alt="DhandaGrow"
  width={100}
  height={30}
  className="h-8 w-auto object-contain"
/>
</Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm mb-6">
              AI-powered tools that help your business create, publish and grow faster — while you focus on what matters.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <div key={social} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-slate-900">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current" style={{ maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\' fill=\'currentColor\'/%3E%3C/svg%3E")', WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\' fill=\'currentColor\'/%3E%3C/svg%3E")', maskSize: 'cover', WebkitMaskSize: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-medium mb-6">Product</h4>
            <ul className="space-y-4">
              {[  'Pricing', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-600 hover:text-slate-950 transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-medium mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Partners'].map((item) => (
                <li key={item}>
                  <Link href={item === 'About Us' ? '/about' : '#'} className="text-slate-600 hover:text-slate-950 transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-medium mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-600 hover:text-slate-950 transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DhandaGrow AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
