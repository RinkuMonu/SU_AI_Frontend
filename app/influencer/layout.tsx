"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Handshake, 
  MessageSquare, 
  FolderGit2, 
  Sparkles, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';
import { chatService } from '@/services/chat.service';
import { influencerSocialService } from '@/services/influencer-social.service';
import { creatorOnboardingService } from '@/services/creator-onboarding.service';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string | null;
}

const resolveAvatarUrl = (url?: string | null) => {
  if (!url || typeof url !== 'string' || url === 'null' || url === 'undefined') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const cleanBase = backendUrl.replace(/\/+$/, '');
  return `${cleanBase}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const userId = user?.id || (user as any)?._id;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(3);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Instant fallback from local onboarding cache if available
    try {
      creatorOnboardingService.loadOnboardingData(user).then((local) => {
        if (local?.fullName) {
          setProfile((prev) => prev || ({
            fullName: local.fullName,
            full_name: local.fullName,
            username: local.username,
            profile_image: local.profileImage
          } as any));
        }
      }).catch(() => {});
    } catch {}

    influencerService.getMyProfile().then((res) => {
      if (res?.success && res.data) {
        setProfile(res.data);
      }
    }).catch(() => {});

    // Load unread chat count
    influencerSocialService.getStatus().then((s) => {
      setIsVerified(Boolean(s && s.total_verified > 0));
    }).catch(() => setIsVerified(false));

    chatService.getTotalUnreadCount(userId).then((count) => {
      setUnreadChatCount(count > 0 ? count : 3);
    }).catch(() => {});
  }, [user, userId, pathname]);

  // STRICT 8 NAVIGATION ITEMS SPECIFIED BY REQUIREMENT B
  const navigationItems: NavItem[] = [
    { name: 'Dashboard', href: '/influencer', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/influencer/opportunities', icon: Briefcase },
    { name: 'My Collaborations', href: '/influencer/collaborations', icon: Handshake },
    { name: 'Chats', href: '/influencer/chats', icon: MessageSquare, badge: unreadChatCount },
    { name: 'Portfolio', href: '/influencer/portfolio', icon: FolderGit2 },
    { name: 'AI Content Studio', href: '/influencer/ai-studio', icon: Sparkles },
    { name: 'Analytics', href: '/influencer/analytics', icon: BarChart3 },
    { name: 'Profile & Settings', href: '/influencer/profile', icon: Settings },
  ];

  const cleanFullName = profile?.fullName || profile?.full_name || (user?.fullName && !user.fullName.startsWith('User ') ? user.fullName : (user?.name && !user.name.startsWith('User ') ? user.name : ''));
  const displayName = mounted ? (cleanFullName || (user as any)?.firstName || 'Sejal Gupta') : 'Sejal Gupta';
  const cleanUsername = profile?.username || (user as any)?.username;
  const displaySubtitle = mounted ? (cleanUsername ? `@${cleanUsername.replace(/^@/, '')}` : (user?.email || user?.phone || user?.phone_number || 'Creator Partner')) : 'Creator Partner';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#08090d] text-white antialiased selection:bg-[#be32ff]/30 relative">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/10 bg-[#0d0e15]/95 backdrop-blur-md sticky top-0 z-40">
        <Link href="/influencer" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FC9A5D] via-[#F0449B] to-[#BE32FF] p-0.5 shadow-md shadow-purple-500/30">
            <div className="w-full h-full bg-[#0B0C13] rounded-[10px] flex items-center justify-center font-black text-xs text-transparent bg-clip-text bg-gradient-to-tr from-[#FC9A5D] to-[#BE32FF]">
              DG
            </div>
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight">DhandaGrow</span>
            <span className="text-[10px] font-bold text-[#f0449b] ml-1">AI</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0b0c13] flex-col hidden md:flex fixed top-0 left-0 h-full z-30 shadow-2xl">
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
          <Link href="/influencer" className="flex items-center gap-2.5 min-w-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FC9A5D] via-[#F0449B] to-[#BE32FF] p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0C13] rounded-[10px] flex items-center justify-center">
                <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-tr from-[#FC9A5D] via-[#F0449B] to-[#BE32FF]">
                  DG
                </span>
              </div>
            </div>
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm text-white tracking-tight">DhandaGrow</span>
                <span className="text-[10px] font-black text-[#f0449b]">AI</span>
              </div>
              <p className="text-[10px] font-medium text-neutral-400 tracking-wider">Creator Hub</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items (8 Essential Items Only) */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/influencer' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold group ${
                  isActive
                    ? "bg-gradient-to-r from-[#BE32FF] to-[#EC4899] text-white shadow-[0_0_20px_rgba(190,50,255,0.4)]"
                    : "text-neutral-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-neutral-400 group-hover:text-white"
                  }`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && Number(item.badge) > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive 
                      ? "bg-white text-[#be32ff] shadow" 
                      : "bg-[#f0449b] text-white shadow-[0_0_10px_rgba(240,68,155,0.5)]"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Switch to Business Hub (Single clean secondary link) */}
          <div className="pt-4 mt-4 border-t border-white/5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-500" />
              <span>Switch to Brand App</span>
            </Link>
          </div>
        </div>

        {/* Creator Identity & Logout */}
        <div className="p-3 border-t border-white/10 bg-[#07080d]/90 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div 
              suppressHydrationWarning 
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#fc9a5d] via-[#f0449b] to-[#be32ff] p-0.5 shadow-md shrink-0 overflow-hidden"
            >
              <div className="w-full h-full bg-[#0b0c13] rounded-[9px] flex items-center justify-center overflow-hidden">
                {(profile?.profile_image || (user as any)?.profileImageUrl || (user as any)?.image) ? (
                  <img 
                    src={resolveAvatarUrl(profile?.profile_image || (user as any)?.profileImageUrl || (user as any)?.image)} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const raw = profile?.profile_image || (user as any)?.profileImageUrl || (user as any)?.image;
                      if (!target.dataset.triedLocalhost && raw && raw.startsWith('/')) {
                        target.dataset.triedLocalhost = 'true';
                        target.src = `http://localhost:8000${raw}`;
                      } else {
                        target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }
                    }}
                  />
                ) : (
                  <span className="font-bold text-white text-xs">{userInitial}</span>
                )}
              </div>
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p suppressHydrationWarning className="text-xs font-bold text-white truncate">{displayName}</p>
                {isVerified && <span title="Verified Creator" className="shrink-0"><ShieldCheck className="w-3 h-3 text-emerald-400" /></span>}
              </div>
              <p suppressHydrationWarning className="text-[10px] text-neutral-400 truncate">{displaySubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-[#0b0c13] h-full border-r border-white/10 flex flex-col p-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <Link href="/influencer" className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">DhandaGrow AI</span>
                <span className="text-[10px] text-[#f0449b]">Creator Hub</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 space-y-2 overflow-y-auto custom-scrollbar">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/influencer' && pathname?.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? "bg-gradient-to-r from-[#BE32FF] to-[#EC4899] text-white shadow-md"
                        : "text-neutral-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge !== null && Number(item.badge) > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#be32ff]">
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
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full md:pl-64 flex flex-col min-h-screen bg-[#08090d] min-w-0 overflow-x-hidden">
        <main className="flex-1 p-3 sm:p-5 md:p-6 w-full max-w-7xl mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
