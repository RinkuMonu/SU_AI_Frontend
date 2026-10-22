"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Share2,
  Sparkles,
  Briefcase, 
  FileText,
  FileImage, 
  MessageSquare,
  IndianRupee,
  Wallet,
  BarChart3,
  Calendar,
  Star,
  Bell,
  Settings,
  LogOut, 
  Menu, 
  X, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Logo } from '@/components/ui/Logo';

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationGroups = [
    {
      group: "Core Hub",
      items: [
        { name: 'Dashboard', href: '/influencer', icon: LayoutDashboard, badge: null },
        { name: 'My Profile', href: '/influencer/profile', icon: User, badge: null },
        { name: 'Social Accounts', href: '/influencer/social-accounts', icon: Share2, badge: null },
      ]
    },
    {
      group: "Campaigns & Deals",
      items: [
        { name: 'Brand Offers', href: '/influencer/brand-offers', icon: Sparkles, badge: 'Offers' },
        { name: 'Content & Deliverables', href: '/influencer/content', icon: FileImage, badge: null },
      ]
    },
    {
      group: "Finance & Growth",
      items: [
        { name: 'Wallet & Earnings', href: '/influencer/earnings', icon: Wallet, badge: 'Wallet' },
        { name: 'Analytics & Portfolio', href: '/influencer/analytics', icon: BarChart3, badge: null },
      ]
    },
    {
      group: "Feedback & Settings",
      items: [
        { name: 'Reviews & Ratings', href: '/influencer/reviews', icon: Star, badge: null },
        { name: 'Notifications', href: '/influencer/notifications', icon: Bell, badge: null },
        { name: 'Settings & Support', href: '/influencer/settings', icon: Settings, badge: null },
      ]
    }
  ];

  const userInitial = mounted && user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : (mounted && user?.email ? user.email.charAt(0).toUpperCase() : 'C');
  const userName = mounted && (user?.name || user?.fullName) ? (user.name || user.fullName) : 'Verified Creator';
  const userEmail = mounted && user?.email ? user.email : 'creator@sevenunique.ai';

  return (
    <div className="min-h-screen bg-[#08090d] text-white flex flex-col md:flex-row antialiased selection:bg-[#be32ff]/30">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/10 bg-[#0d0e15]/95 backdrop-blur-md sticky top-0 z-40">
        <Link href="/influencer" className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#be32ff]/20 to-[#fc9a5d]/20 text-[#fc9a5d] border border-[#fc9a5d]/30">
            Influencer
          </span>
        </Link>
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
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
          <Link href="/influencer" className="flex items-center gap-2.5 min-w-0">
            <Logo size="sm" />
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#be32ff]/20 to-[#fc9a5d]/20 text-[#fc9a5d] border border-[#fc9a5d]/30">
              Influencer
            </span>
          </Link>
        </div>

        {/* Navigation Tabs (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 custom-scrollbar">
          {navigationGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {grp.group}
              </div>
              {grp.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold group ${
                      isActive
                        ? "bg-gradient-to-r from-[#be32ff]/20 to-[#f0449b]/10 text-white border border-[#be32ff]/40 shadow-[0_0_20px_rgba(190,50,255,0.15)]"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        isActive ? "bg-gradient-to-br from-[#fc9a5d] to-[#be32ff] text-white shadow" : "bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Switch to Business Hub */}
          <div className="pt-2 border-t border-white/5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors border border-transparent"
            >
              <div className="p-1.5 rounded-lg bg-white/5 text-neutral-400">
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
              <span>Switch to Business App</span>
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-white/10 bg-[#07080d]/80 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div 
              suppressHydrationWarning 
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center font-bold text-white text-xs shadow-md ring-1 ring-white/20 shrink-0"
            >
              {userInitial}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p suppressHydrationWarning className="text-xs font-bold text-white truncate">{userName}</p>
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
              <p suppressHydrationWarning className="text-[10px] text-neutral-400 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
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
              <Link href="/influencer" className="flex items-center gap-2">
                <Logo size="sm" />
                <span className="text-[10px] font-bold text-[#fc9a5d]">Influencer</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 space-y-4 overflow-y-auto custom-scrollbar">
              {navigationGroups.map((grp) => (
                <div key={grp.group} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {grp.group}
                  </div>
                  {grp.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                          isActive
                            ? "bg-[#be32ff]/20 text-white border border-[#be32ff]/40"
                            : "text-neutral-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-[#be32ff]" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
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
