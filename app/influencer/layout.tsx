"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Briefcase, FileImage, DollarSign, MessageSquare, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/influencer', icon: LayoutDashboard },
    { name: 'Profile', href: '/influencer/profile', icon: User },
    { name: 'Marketplace', href: '/influencer/marketplace', icon: Briefcase },
    { name: 'My Content', href: '/influencer/content', icon: FileImage },
    { name: 'Earnings', href: '/influencer/earnings', icon: DollarSign },
    { name: 'Messages', href: '/influencer/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-[#0a0a0a] flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-coral bg-clip-text text-transparent">SevenUnique Influencer</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors " + (isActive ? "bg-brand-purple/10 text-brand-purple font-medium" : "text-text-muted hover:text-white hover:bg-white/5")}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-border space-y-2">
           <div className="flex items-center gap-3 px-2 py-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center font-bold">
               {user?.name?.charAt(0) || 'U'}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium truncate">{user?.name}</p>
               <p className="text-xs text-text-muted truncate">{user?.email}</p>
             </div>
           </div>
           <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
           </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
