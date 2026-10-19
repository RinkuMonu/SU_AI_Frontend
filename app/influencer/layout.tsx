"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileImage, 
  DollarSign, 
  LogOut, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/influencer', icon: LayoutDashboard, badge: null },
    { name: 'Profile', href: '/influencer/profile', icon: User, badge: null },
    { name: 'Marketplace', href: '/influencer/marketplace', icon: Briefcase, badge: 'Deals' },
    { name: 'My Content', href: '/influencer/content', icon: FileImage, badge: null },
    { name: 'Earnings', href: '/influencer/earnings', icon: DollarSign, badge: null },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'I');

  return (
    <div className="min-h-screen bg-[#08090d] text-white flex flex-col md:flex-row antialiased selection:bg-[#be32ff]/30">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/10 bg-[#0d0e15]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white via-purple-100 to-[#be32ff] bg-clip-text text-transparent">
              SevenUnique
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#fc9a5d]">
              Creator Studio
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0b0c13] flex-col hidden md:flex fixed h-full z-30 shadow-2xl">
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-lg shadow-[#be32ff]/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">SevenUnique</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#be32ff]/20 text-[#d87aff] border border-[#be32ff]/30">AI</span>
              </div>
              <span className="text-[11px] font-medium text-neutral-400 block -mt-0.5">
                Creator &amp; Influencer
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Navigation Menu
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold group ${
                  isActive
                    ? "bg-gradient-to-r from-[#be32ff]/20 to-[#f0449b]/10 text-white border border-[#be32ff]/40 shadow-[0_0_20px_rgba(190,50,255,0.15)]"
                    : "text-neutral-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? "bg-gradient-to-br from-[#fc9a5d] to-[#be32ff] text-white shadow" : "bg-white/5 text-neutral-300 group-hover:text-white group-hover:bg-white/10"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Quick Actions
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors border border-transparent"
          >
            <div className="p-1.5 rounded-lg bg-white/5 text-neutral-300">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Switch to Brand App</span>
          </Link>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-white/10 bg-[#07080d]/80 space-y-2">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center font-bold text-white text-sm shadow-md ring-1 ring-white/20">
              {userInitial}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Verified Creator'}</p>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[11px] text-neutral-400 truncate">{user?.email || 'influencer@sevenunique.ai'}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-[#0b0c13] h-full border-r border-white/10 flex flex-col p-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-white">Creator Studio</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? "bg-[#be32ff]/20 text-white border border-[#be32ff]/40"
                        : "text-neutral-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#be32ff]" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-[#08090d]">
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
