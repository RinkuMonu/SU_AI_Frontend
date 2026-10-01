"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Store, Palette, Package, Settings, LogOut, Sparkles, Megaphone, MessageSquare, Star, Library, Share2, ChevronDown, ChevronRight, Globe, TrendingUp, Bot, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import { CreditIndicator } from "@/components/layout/CreditIndicator";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#25D366" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="url(#ig-grad)" className={className}>
    <defs>
      <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path d="M12,2.16c3.2,0,3.58,0,4.85,0.07c1.17,0.05,1.8,0.25,2.23,0.42c0.55,0.21,0.95,0.48,1.35,0.88c0.4,0.4,0.67,0.8,0.88,1.35c0.17,0.42,0.37,1.06,0.42,2.23C21.84,8.38,21.85,8.76,21.85,12s0,3.62-0.07,4.89c-0.05,1.17-0.25,1.8-0.42,2.23c-0.21,0.55-0.48,0.95-0.88,1.35c-0.4,0.4-0.8,0.67-1.35,0.88c-0.42,0.17-1.06,0.37-2.23,0.42c-1.27,0.06-1.65,0.07-4.85,0.07s-3.58,0-4.85-0.07c-1.17-0.05-1.8-0.25-2.23-0.42c-0.55-0.21-0.95-0.48-1.35-0.88c-0.4-0.4-0.67-0.8-0.88-1.35c-0.17-0.42-0.37-1.06-0.42-2.23C2.16,15.62,2.15,15.24,2.15,12s0-3.62,0.07-4.89c0.05-1.17,0.25-1.8,0.42-2.23c0.21-0.55,0.48-0.95,0.88-1.35c0.4-0.4,0.8-0.67,1.35-0.88C5.27,2.41,5.91,2.21,7.08,2.16C8.35,2.1,8.73,2.16,12,2.16 M12,0C8.74,0,8.33,0.01,7.05,0.07C5.77,0.13,4.9,0.33,4.14,0.63C3.36,0.93,2.68,1.33,2,2C1.33,2.68,0.93,3.36,0.63,4.14C0.33,4.9,0.13,5.77,0.07,7.05C0.01,8.33,0,8.74,0,12s0.01,3.67,0.07,4.95c0.06,1.28,0.26,2.15,0.56,2.91c0.3,0.78,0.7,1.46,1.38,2.14c0.68,0.68,1.36,1.08,2.14,1.38c0.76,0.3,1.63,0.5,2.91,0.56C8.33,23.99,8.74,24,12,24s3.67-0.01,4.95-0.07c1.28-0.06,2.15-0.26,2.91-0.56c0.78-0.3,1.46-0.7,2.14-1.38c0.68-0.68,1.08-1.36,1.38-2.14c0.3-0.76,0.5-1.63,0.56-2.91C23.99,15.67,24,15.26,24,12s-0.01-3.67-0.07-4.95c-0.06-1.28-0.26-2.15-0.56-2.91c-0.3-0.78-0.7-1.46-1.38-2.14c-0.68-0.68-1.36-1.08-2.14-1.38c-0.76-0.3-1.63-0.5-2.91-0.56C15.67,0.01,15.26,0,12,0z M12,5.84A6.16,6.16,0,1,0,18.16,12A6.16,6.16,0,0,0,12,5.84z M12,16A4,4,0,1,1,16,12A4,4,0,0,1,12,16z M18.41,4.15A1.44,1.44,0,1,0,19.85,5.59A1.44,1.44,0,0,0,18.41,4.15z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#0A66C2" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const navigation = [
  { name: "UNI AI (Hinglish)", href: "/uni-ai", icon: Sparkles },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Business", href: "/business", icon: Store },
  { name: "Brand Kit", href: "/brand", icon: Palette },
  { name: "Products", href: "/products", icon: Package },
  { name: "Website Builder", href: "/website-builder", icon: Globe },
  { 
    name: "Social Media", 
    icon: Share2, 
    children: [
      { name: "Create Ad", href: "/create-ad" },
      { name: "Create Reel", href: "/create/reel" },
      { name: "AI Post Maker", href: "/ai-post" },
      { name: "AI Image Generator", href: "/ai-image" },
      { name: "AI Calendar", href: "/ai-calendar" },
    ]
  },
  {
    name: "Fashion AI",
    icon: Sparkles,
    children: [
      { name: "AI Photoshoot", href: "/fashion-ai/photoshoot" },
      { name: "Virtual Try-On", href: "/fashion-ai/virtual-try-on" },
      { name: "History", href: "/fashion-ai/history" },
    ]
  },
  { name: "AI Content", href: "/content", icon: Sparkles },
  { name: "Festival Engine", href: "/festivals", icon: PartyPopper },
  { name: "Plan Content", href: "/content-library", icon: Library },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Reviews", href: "/reviews", icon: Star },
  {
    name: "Social Platforms",
    icon: Globe,
    children: [
      { name: "Instagram", href: "/social-platforms/instagram", icon: InstagramIcon },
      { name: "Facebook", href: "/social-platforms/facebook", icon: FacebookIcon },
      { name: "LinkedIn", href: "/social-platforms/linkedin", icon: LinkedinIcon },
    ]
  },
  { name: "Billing & Plans", href: "/subscription", icon: Store },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "Social Media": ["/create-ad", "/create/reel", "/ai-post", "/ai-image", "/ai-calendar"].some(p => pathname.startsWith(p)),
    "Fashion AI": ["/fashion-ai"].some(p => pathname.startsWith(p)),
    "Social Platforms": ["/social-platforms"].some(p => pathname.startsWith(p))
  });

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="hidden lg:flex h-full w-64 flex-col bg-surface border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border min-w-0">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
          <Logo size="sm" />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {navigation.map((item: any) => {
          if (item.children) {
            const isOpen = openDropdowns[item.name];
            const isChildActive = item.children.some((child: any) => pathname.startsWith(child.href));
            
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={cn(
                    "group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isChildActive && !isOpen
                      ? "bg-brand-purple/15 border border-brand-purple/35 text-white"
                      : "text-text-muted hover:bg-surface-elevated hover:text-white"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isChildActive && !isOpen ? "text-brand-purple" : "text-text-muted group-hover:text-white"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  ) : (
                     <ChevronRight className="h-4 w-4 text-text-muted" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="pl-11 pr-3 space-y-1">
                    {item.children.map((child: any) => {
                      const isActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-brand-purple/15 border border-brand-purple/35 text-white"
                              : "text-text-muted hover:bg-surface-elevated hover:text-white"
                          )}
                        >
                          {child.icon && (
                            <child.icon
                              className={cn(
                                "mr-3 h-4 w-4 flex-shrink-0",
                                isActive ? "" : "opacity-80 group-hover:opacity-100"
                              )}
                              aria-hidden="true"
                            />
                          )}
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname.startsWith(item.href as string);
          return (
            <Link
              key={item.name}
              href={item.href as string}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-brand-purple/15 border border-brand-purple/35 text-white"
                  : "text-text-muted hover:bg-surface-elevated hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-brand-purple" : "text-text-muted group-hover:text-white"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <CreditIndicator />
        <button
          onClick={logout}
          className="group flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-text-muted group-hover:text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
