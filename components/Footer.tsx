'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck,
  ChevronDown,
  Globe2,
  Check
} from 'lucide-react';

const InstagramIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const YoutubeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
const FacebookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;

const PlayStoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.782 10.612L5.803 1.41C4.464.53 2.5 1.5 2.5 3.12v17.76c0 1.62 1.964 2.59 3.303 1.71l13.979-9.202c1.246-.82 1.246-2.596 0-3.416v.04z" />
  </svg>
);

const AppStoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.36 14.153c.08-.023.16-.046.24-.07a5.532 5.532 0 0 0-3.6-4.66 4.773 4.773 0 0 0-4.59 1.15c-1.38 1.4-1.28 3.82-.67 5.76.46 1.47 1.3 2.82 2.56 2.82 1.23 0 1.62-.77 3.03-.77 1.4 0 1.83.77 3.03.77 1.25 0 1.94-1.23 2.5-2.73 1.25-3.32-.42-5.46-.5-5.5zM12.92 8.7c-1.12.02-2.32-.67-2.97-1.36-.62-.64-1.07-1.63-1.02-2.6.02-.13.04-.26.06-.39 1.07.13 2.15.82 2.76 1.5.58.62 1 1.5 1 2.37v.48z" />
  </svg>
);

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="font-sans bg-white pb-0 pt-12 border-t border-slate-200">
      {/* 2. Main Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 lg:divide-x lg:divide-slate-200">
          
          {/* Column 1: Brand & Newsletter (Wider) */}
          <div className="w-full lg:w-[380px] shrink-0 lg:pr-10">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/dhandagrow.png"
                alt="DhandaGrow"
                width={200}
                height={55}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-500 text-[14px] leading-relaxed mb-8">
              DhandaGrow is your all-in-one AI platform to automate marketing, create stunning visuals, manage leads, and grow your business effortlessly. Built for modern Indian businesses to scale faster.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-8">
              <a 
                href="https://www.instagram.com/dhandagrow" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all shadow-xs"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://www.linkedin.com/company/dhandagrow/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0A66C2] hover:text-white transition-all shadow-xs"
              >
                <LinkedinIcon />
              </a>
              <a 
                href="https://www.youtube.com/@DhandhaGrow" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#FF0000] hover:text-white transition-all shadow-xs"
              >
                <YoutubeIcon />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61595209640733" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-all shadow-xs"
              >
                <FacebookIcon />
              </a>
            </div>

            {/* Newsletter Box */}
            <div className="bg-purple-50/80 rounded-2xl p-6 border border-purple-100">
              <h4 className="text-slate-900 font-bold text-[15px] mb-2">Get AI Marketing Tips & Updates</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Join our newsletter and get the latest features, growth ideas and exclusive offers.
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Thank you for subscribing! We&apos;ll be in touch.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-purple-400 bg-white"
                  />
                  <button type="submit" className="bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors shrink-0">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-6 lg:pl-10">
            
            {/* Products */}
            <div className="flex flex-col">
              <h4 className="text-[#D95A2B] font-bold text-[16px] mb-4">Products</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { title: 'AI Reel Maker', desc: 'Create engaging vertical reels & videos', href: '/#ai-reels' },
                  { title: 'AI Post Maker', desc: 'Create stunning social media posts', href: '/#ai-posts' },
                  { title: 'AI Photoshoot', desc: 'Turn product photos into 8K creatives', href: '/#ai-photoshoot' },
                  { title: 'AI Talking Avatar', desc: 'Create digital human spokesperson videos', href: '/#ai-avatar' },
                  { title: 'Social Media Scheduler', desc: 'Schedule & automate your content', href: '/#automation' },
                  { title: 'AI Ad Creatives & Copy', desc: 'High-converting ad copy & visuals', href: '/features/ai-ads' },
                  { title: 'Lead Management & CRM', desc: 'Manage and track customer leads', href: '/features/crm' },
                  { title: 'Indian Festival Engine', desc: 'Ready-to-use festival campaigns', href: '/features/festival-engine' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="group block">
                      <div className="text-slate-600 font-medium text-[14px] group-hover:text-[#D95A2B] transition-colors py-1">{item.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col">
              <h4 className="text-[#D95A2B] font-bold text-[16px] mb-4">Company</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { title: 'Home', desc: 'Go to homepage', href: '/' },
                  { title: 'About Us', desc: 'Our mission and story', href: '/about' },
                  { title: 'Mission & Vision', desc: 'Digitally empowered India', href: '/about#mission' },
                  { title: 'Features', desc: 'Explore all features', href: '/#features' },
                  { title: 'Pricing Plans', desc: 'Simple and affordable plans', href: '/#pricing' },
                  { title: 'Blog & Articles', desc: 'Latest news and insights', href: '/blog' },
                  { title: 'Careers', desc: 'Join our team', href: '/careers' },
                  { title: 'Contact Us', desc: 'Get in touch with support', href: '/#contact' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="group block">
                      <div className="text-slate-600 font-medium text-[14px] group-hover:text-[#D95A2B] transition-colors py-1">{item.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Support */}
            <div className="flex flex-col">
              <h4 className="text-[#D95A2B] font-bold text-[16px] mb-4">Resources & Support</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { title: 'Help Center', desc: 'Find answers to your questions', href: '/help' },
                  { title: 'FAQs', desc: 'Frequently asked questions', href: '/help#faqs' },
                  { title: 'How It Works', desc: 'Step-by-step workflow to get started', href: '/#how-it-works' },
                  { title: 'Tutorials & Guides', desc: 'Growth guides & marketing advice', href: '/blog' },
                  { title: 'Mobile App Download', desc: 'Get DhandaGrow on Android & iOS', href: '/download' },
                  { title: 'Payment & Subscription Help', desc: 'Manage your billing and plans', href: '/#pricing' },
                  { title: 'Contact Support', desc: "We're here 24/7 to help", href: '/#contact' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="group block">
                      <div className="text-slate-600 font-medium text-[14px] group-hover:text-[#D95A2B] transition-colors py-1">{item.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col">
              <h4 className="text-[#D95A2B] font-bold text-[16px] mb-4">Legal</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { title: 'Privacy Policy', desc: 'How we protect your data', href: '/legal/privacy-policy' },
                  { title: 'Terms of Service', desc: 'Our terms and conditions', href: '/legal/terms-of-service' },
                  { title: 'Cookie Policy', desc: 'How we use cookies', href: '/legal/cookie-policy' },
                  { title: 'Refund Policy', desc: 'Refund and cancellation terms', href: '/legal/refund-policy' },
                  { title: 'Security', desc: 'Your security is our priority', href: '/legal/terms-of-service#section-15' },
                  { title: 'Acceptable Use Policy', desc: 'Guidelines for using our platform', href: '/legal/terms-of-service#section-5' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="group block">
                      <div className="text-slate-600 font-medium text-[14px] group-hover:text-[#D95A2B] transition-colors py-1">{item.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* 3. App & Trust Badges */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="border-t border-slate-100 pt-8 flex flex-wrap xl:flex-nowrap items-center justify-between gap-8">
          
          {/* App Download */}
          <div className="flex items-center gap-4 bg-purple-50/50 p-3 rounded-2xl border border-purple-100/50">
            <Link href="/download" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-purple-100/50 group-hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="Icon" width={30} height={30} className="w-8 h-8 object-contain" />
              </div>
              <div>
                <div className="text-slate-800 font-bold text-[13px] md:text-sm group-hover:text-purple-600 transition-colors">Take DhandaGrow Everywhere</div>
                <div className="text-slate-500 text-[11px] md:text-xs">Download our mobile app and create on the go.</div>
              </div>
            </Link>
            <div className="flex gap-2 ml-4">
              <Link href="/download" className="h-10 px-3 bg-black hover:bg-slate-800 transition-colors rounded-lg flex items-center gap-2 text-white">
                <PlayStoreIcon />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[8px] text-slate-300 font-medium">GET IT ON</span>
                  <span className="text-[11px] font-bold">Google Play</span>
                </div>
              </Link>
              <Link href="/download" className="h-10 px-3 bg-black hover:bg-slate-800 transition-colors rounded-lg flex items-center gap-2 text-white">
                <AppStoreIcon />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[8px] text-slate-300 font-medium">Download on the</span>
                  <span className="text-[11px] font-bold">App Store</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 lg:gap-12 text-center">
            <div>
              <div className="text-slate-900 font-bold text-lg">50K+</div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Happy Users</div>
            </div>
            <div>
              <div className="text-slate-900 font-bold text-lg">1M+</div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">AI Posts Created</div>
            </div>
            <div>
              <div className="text-slate-900 font-bold text-lg">99.9%</div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Uptime</div>
            </div>
            <div>
              <div className="text-slate-900 font-bold text-lg">24/7</div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Support</div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Absolute Bottom Bar */}
      <div className="bg-[#1C1E32] text-slate-300 py-5 text-xs sm:text-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="text-center xl:text-left text-slate-400">
            © 2026 DhandaGrow AI • FINUNIQUE SMALL PRIVATE LIMITED. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-2 text-slate-300">
            <Link href="/legal/privacy-policy" className="hover:text-white transition-colors whitespace-nowrap">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
            <Link href="/legal/terms-of-service" className="hover:text-white transition-colors whitespace-nowrap">Terms of Service</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
            <Link href="/sitemap" className="hover:text-white transition-colors whitespace-nowrap">Sitemap</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
            <Link href="/legal/cookie-policy" className="hover:text-white transition-colors whitespace-nowrap">Cookie Policy</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
            <Link href="/legal/refund-policy" className="hover:text-white transition-colors whitespace-nowrap">Refund Policy</Link>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-slate-300">
            <Globe2 size={16} />
            <span>English</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

    </footer>
  );
}
