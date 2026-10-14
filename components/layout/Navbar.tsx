"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  Menu, 
  Bell, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  User as UserIcon, 
  Building2, 
  Settings, 
  LogOut, 
  Sparkles, 
  Phone, 
  Mail,
  ShieldCheck,
  Headphones
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Google Review", message: "Sanjay Verma left a 5-star review.", time: "5m ago", unread: true },
    { id: 2, title: "Campaign Generated", message: "Summer Fashion Sale 2026 is ready.", time: "1h ago", unread: true },
    { id: 3, title: "New Message", message: "Customer asked a question about delivery.", time: "2h ago", unread: false },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some(n => n.unread);

  const isBusiness = user?.role === 'business' || user?.accountType === 'business';
  const initial = (user?.name?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-surface px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-text-muted hover:text-white lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-3 sm:gap-x-4 lg:gap-x-6">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifDropdownRef}>
            <button 
              type="button" 
              className="-m-2.5 p-2.5 text-text-muted hover:text-white relative transition-colors focus:outline-none"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              title="Notifications"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {hasUnread && (
                <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5 rounded-full bg-brand-pink border-2 border-surface animate-pulse"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-surface-elevated py-1 shadow-2xl border border-border ring-1 ring-black/20 focus:outline-none animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-white/[0.02]">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <button className="text-xs text-brand-coral hover:text-brand-pink font-medium transition-colors" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 hover:bg-surface-secondary cursor-pointer flex gap-3 transition-colors ${notif.unread ? 'bg-brand-purple/10' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="mt-0.5">
                        {notif.unread ? <Circle className="h-2.5 w-2.5 fill-brand-purple text-brand-purple" /> : <CheckCircle2 className="h-3 w-3 text-text-muted" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{notif.title}</p>
                        <p className="text-xs text-text-secondary">{notif.message}</p>
                        <p className="text-[10px] text-text-muted">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border text-center bg-white/[0.01]">
                  <button className="text-xs text-text-muted hover:text-white font-medium transition-colors" onClick={() => setShowNotifications(false)}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* Clickable User Profile Dropdown Button */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-x-3 p-1 rounded-xl hover:bg-surface-secondary/70 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
              id="user-menu-button"
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/15 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || "User"} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
              </div>

              <div className="hidden lg:flex lg:flex-col lg:items-start text-left">
                <span className="text-sm font-semibold leading-tight text-white group-hover:text-brand-pink transition-colors line-clamp-1 max-w-[150px]">
                  {user?.name || "User"}
                </span>
                <span className="text-[11px] text-text-muted leading-tight font-medium mt-0.5">
                  {isBusiness ? "Business Account" : "Personal Account"}
                </span>
              </div>

              <ChevronDown 
                className={`h-4 w-4 text-text-muted group-hover:text-white transition-transform duration-200 hidden lg:block ${
                  showProfileMenu ? 'rotate-180 text-white' : ''
                }`} 
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-72 origin-top-right rounded-2xl bg-surface-elevated shadow-2xl border border-border ring-1 ring-black/40 focus:outline-none animate-in fade-in slide-in-from-top-2 z-50 overflow-hidden divide-y divide-border">
                {/* User Header Summary */}
                <div className="p-4 bg-gradient-to-b from-white/[0.04] to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg shadow-inner border border-white/20 shrink-0 overflow-hidden">
                      {user?.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || "User"} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <span>{initial}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-white truncate">
                          {user?.name || "User"}
                        </p>
                      </div>
                      <p className="text-xs text-text-muted truncate mt-0.5" title={user?.email || ""}>
                        {user?.email || "No email available"}
                      </p>
                      {user?.contactNumber && (
                        <p className="text-[11px] text-text-muted/80 truncate mt-0.5 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{user.contactNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-purple/15 text-brand-pink border border-brand-purple/30">
                      {isBusiness ? (
                        <>
                          <Building2 className="w-3 h-3" />
                          <span>Business Profile</span>
                        </>
                      ) : (
                        <>
                          <UserIcon className="w-3 h-3" />
                          <span>User Profile</span>
                        </>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="py-1.5 px-1.5 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-surface-secondary transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-text-muted group-hover:text-brand-purple group-hover:bg-brand-purple/15 transition-colors border border-border/50">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-white">Profile & Settings</span>
                      <span className="text-[11px] text-text-muted">Manage name, photo & details</span>
                    </div>
                  </Link>

                  <Link
                    href="/subscription"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-surface-secondary transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-text-muted group-hover:text-amber-400 group-hover:bg-amber-400/15 transition-colors border border-border/50">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-white">Subscription & Plan</span>
                      <span className="text-[11px] text-text-muted">View credits & billing</span>
                    </div>
                  </Link>

                  <Link
                    href="/support"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-surface-secondary transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-text-muted group-hover:text-emerald-400 group-hover:bg-emerald-400/15 transition-colors border border-border/50">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-white">Live Support</span>
                      <span className="text-[11px] text-text-muted">Chat with support team</span>
                    </div>
                  </Link>
                </div>

                {/* Footer / Sign Out */}
                <div className="p-1.5 bg-white/[0.01]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
