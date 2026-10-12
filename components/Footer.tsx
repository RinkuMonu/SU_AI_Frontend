import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Globe2
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
  return (
    <footer className="font-sans bg-white pb-0">
      
      {/* 1. CTA Banner Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 pt-10">
        <div className="rounded-[32px] bg-gradient-to-r from-purple-100 via-pink-50 to-orange-100 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-purple-100/50 shadow-sm">
          
          {/* Decorative background elements can go here if needed */}
          
          <div className="flex-1 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 text-purple-600 text-[13px] font-semibold mb-6 shadow-sm border border-purple-100">
              <Rocket size={14} className="text-purple-600" />
              Grow Your Business with AI
            </div>
            
            <h2 className="text-3xl md:text-[42px] font-bold text-slate-900 leading-tight mb-4 tracking-tight">
              Ready to Create <span className="text-[#D95A2B]">Amazing Content?</span>
            </h2>
            
            <p className="text-slate-600 text-base md:text-lg mb-8 max-w-xl">
              Join thousands of businesses using DhandaGrow to create, automate and grow their social media presence with the power of AI.
            </p>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-10 relative z-10">
            <div className="flex flex-col gap-4 text-slate-700 font-medium">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purple-600" size={20} />
                <span>AI Content Creation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purple-600" size={20} />
                <span>Social Media Automation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purple-600" size={20} />
                <span>Grow Your Business Faster</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all w-full justify-center">
                Start Creating Now <ArrowRight size={18} />
              </button>
              <p className="text-xs text-slate-500 font-medium text-center">
                No credit card required • Get started in minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-200 mb-10"></div>

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
              <a href="#" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0A66C2] hover:text-white transition-all">
                <LinkedinIcon />
              </a>
              <a href="#" aria-label="YouTube" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#FF0000] hover:text-white transition-all">
                <YoutubeIcon />
              </a>
              <a href="#" aria-label="Facebook" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-all">
                <FacebookIcon />
              </a>
            </div>

            {/* Newsletter Box */}
            <div className="bg-purple-50/80 rounded-2xl p-6 border border-purple-100">
              <h4 className="text-slate-900 font-bold text-[15px] mb-2">Get AI Marketing Tips & Updates</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Join our newsletter and get the latest features, growth ideas and exclusive offers.
              </p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-purple-400"
                />
                <button type="submit" className="bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-6 lg:pl-10">
            
            {/* Products */}
            <div className="flex flex-col">
              <h4 className="text-[#D95A2B] font-bold text-[16px] mb-4">Products</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { title: 'AI Post Maker', desc: 'Create stunning social media posts' },
                  { title: 'AI Image Generator', desc: 'Generate high-quality images with AI' },
                  { title: 'AI Video & Reel Maker', desc: 'Create engaging reels and videos' },
                  { title: 'Social Media Scheduler', desc: 'Schedule & automate your content' },
                  { title: 'AI Caption & Hashtag Generator', desc: 'Get viral captions and hashtags' },
                  { title: 'Lead Management', desc: 'Manage and track your leads' },
                  { title: 'Templates & Resources', desc: 'Ready-to-use templates for your business' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="group block">
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
                  { title: 'Home', desc: 'Go to homepage' },
                  { title: 'About Us', desc: 'Our mission and story' },
                  { title: 'Features', desc: 'Explore all features' },
                  { title: 'Pricing', desc: 'Simple and affordable plans' },
                  { title: 'Blog', desc: 'Latest news and insights' },
                  { title: 'Careers', desc: 'Join our team' },
                  { title: 'Become a Partner', desc: 'Grow with us' },
                  { title: 'Contact Us', desc: 'Get in touch' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="group block">
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
                  { title: 'Help Center', desc: 'Find answers to your questions' },
                  { title: 'FAQs', desc: 'Frequently asked questions' },
                  { title: 'Getting Started', desc: 'Learn how to use DhandaGrow' },
                  { title: 'Tutorials & Guides', desc: 'Step-by-step guides' },
                  { title: 'Report a Problem', desc: 'Facing an issue? Let us know' },
                  { title: 'Payment & Subscription Help', desc: 'Manage your billing and plans' },
                  { title: 'Contact Support', desc: "We're here to help" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="group block">
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
                  { title: 'Privacy Policy', desc: 'How we protect your data' },
                  { title: 'Terms of Service', desc: 'Our terms and conditions' },
                  { title: 'Cookie Policy', desc: 'How we use cookies' },
                  { title: 'Refund Policy', desc: 'Refund and cancellation terms' },
                  { title: 'Security', desc: 'Your security is our priority' },
                  { title: 'Acceptable Use Policy', desc: 'Guidelines for using our platform' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="group block">
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
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-purple-100/50">
              <Image src="/logo.png" alt="Icon" width={30} height={30} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="text-slate-800 font-bold text-[13px] md:text-sm">Take DhandaGrow Everywhere</div>
              <div className="text-slate-500 text-[11px] md:text-xs">Download our mobile app and create on the go.</div>
            </div>
            <div className="flex gap-2 ml-4">
              <a href="#" className="h-10 px-3 bg-black hover:bg-slate-800 transition-colors rounded-lg flex items-center gap-2 text-white">
                <PlayStoreIcon />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[8px] text-slate-300 font-medium">GET IT ON</span>
                  <span className="text-[11px] font-bold">Google Play</span>
                </div>
              </a>
              <a href="#" className="h-10 px-3 bg-black hover:bg-slate-800 transition-colors rounded-lg flex items-center gap-2 text-white">
                <AppStoreIcon />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[8px] text-slate-300 font-medium">Download on the</span>
                  <span className="text-[11px] font-bold">App Store</span>
                </div>
              </a>
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
      <div className="bg-[#1C1E32] text-slate-300 py-5 text-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            © 2026 DhandaGrow. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <Link href="/legal/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <Link href="/legal/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <Link href="/legal/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <Globe2 size={16} />
            <span>English</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

    </footer>
  );
}
