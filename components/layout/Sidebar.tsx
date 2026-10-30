"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Store,
  Palette,
  Package,
  Settings,
  LogOut,
  Sparkles,
  MessageSquare,
  Library,
  Share2,
  ChevronDown,
  ChevronRight,
  Globe,
  TrendingUp,
  Bot,
  PartyPopper,
  Users,
  Headphones,
  X,
  FileText,
  Zap,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import { CreditIndicator } from "@/components/layout/CreditIndicator";
import { useSidebar } from "@/components/layout/SidebarContext";

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
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Brand Kit", href: "/brand", icon: Palette },
  { name: "AI Content Generation", href: "/content", icon: Sparkles },
  { 
    name: "Image and Reel Generation", 
    icon: Share2, 
    children: [
      { name: "Create Reel", href: "/create/reel" },
      { name: "AI Post Maker", href: "/ai-post" },
      { name: "AI Calendar", href: "/ai-calendar" },
    ]
  },
  {
    name: "AI Avatar",
    icon: Sparkles,
    children: [
      { name: "AI Photoshoot", href: "/fashion-ai/photoshoot" },
      { name: "Virtual Try-On", href: "/fashion-ai/virtual-try-on" },
      { name: "History", href: "/fashion-ai/history" },
    ]
  },
  { name: "Website Builder", href: "/website-builder", icon: Globe },
  { name: "Festival Engine", href: "/festivals", icon: PartyPopper },
  { name: "Influencers", href: "/influencers", icon: Users },
  { name: "Plan Content (Calendar)", href: "/content-library", icon: Library },
  { name: "UNI AI (Hinglish)", href: "/uni-ai", icon: Sparkles },
  {
    name: "Social Platforms",
    icon: Globe,
    children: [
      { name: "Overview", href: "/social-platforms", icon: Globe },
      { name: "Instagram", href: "/social-platforms/instagram", icon: InstagramIcon },
      { name: "Facebook", href: "/social-platforms/facebook", icon: FacebookIcon },
      { name: "LinkedIn", href: "/social-platforms/linkedin", icon: LinkedinIcon },
    ]
  },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  {
    name: "Billing & Plans",
    icon: Store,
    children: [
      { name: "All Subscription Plans", href: "/subscription", icon: Crown },
      { name: "Transaction Report", href: "/subscription/transactions", icon: FileText },
      { name: "AI Token/Credit Usage", href: "/subscription/credits", icon: Zap },
    ],
  },
  { name: "Support", href: "/support", icon: Headphones },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "Image and Reel Generation": ["/create/reel", "/ai-post", "/ai-calendar"].some(p => pathname.startsWith(p)),
    "AI Avatar": ["/fashion-ai"].some(p => pathname.startsWith(p)),
    "Social Platforms": ["/social-platforms"].some(p => pathname.startsWith(p)),
    "Billing & Plans": pathname.startsWith("/subscription"),
  });

  useEffect(() => {
    if (pathname.startsWith("/subscription")) {
      setOpenDropdowns((prev) => ({ ...prev, "Billing & Plans": true }));
    }
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderNavItems = (onItemClick?: () => void) => (
    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
      {navigation.map((item: any) => {
        if (item.children) {
          const isOpen = openDropdowns[item.name];
          const isChildActive = item.children.some((child: any) => {
            const childBasePath = child.href.split("?")[0];
            return pathname === childBasePath || pathname.startsWith(childBasePath + "/");
          });
          const isParentActive = item.href ? pathname === item.href : false;
          
          return (
            <div key={item.name} className="space-y-1">
              <div
                className={cn(
                  "group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  (isChildActive || isParentActive) && !isOpen
                    ? "bg-brand-purple/15 border border-brand-purple/35 text-white"
                    : "text-text-muted hover:bg-surface-elevated hover:text-white"
                )}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => onItemClick && onItemClick()}
                    className="flex items-center flex-1 min-w-0"
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        (isChildActive || isParentActive) && !isOpen ? "text-brand-purple" : "text-text-muted group-hover:text-white"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isChildActive && !isOpen ? "text-brand-purple" : "text-text-muted group-hover:text-white"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(item.name);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
                  title={`Toggle ${item.name}`}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-text-muted" />
                  )}
                </button>
              </div>
              
              {isOpen && (
                <div className="pl-11 pr-3 space-y-1">
                  {item.children.map((child: any) => {
                    const isExactActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => onItemClick && onItemClick()}
                        className={cn(
                          "group flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors",
                          isExactActive
                            ? "bg-brand-purple/20 border border-brand-purple/40 text-white"
                            : "text-text-muted hover:bg-surface-elevated hover:text-white"
                        )}
                      >
                        {child.icon && (
                          <child.icon
                            className={cn(
                              "mr-2.5 h-3.5 w-3.5 flex-shrink-0",
                              isExactActive ? "text-brand-purple" : "opacity-80 group-hover:opacity-100"
                            )}
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate">{child.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        const isActive = item.href === "/dashboard" 
          ? pathname === "/dashboard" 
          : (pathname === item.href || pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.name}
            href={item.href as string}
            onClick={() => onItemClick && onItemClick()}
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
  );

  return (
    <>
      {/* Desktop & Laptop Sidebar (md+ screens) */}
      <div className="hidden md:flex h-full w-64 flex-col bg-surface border-r border-border shrink-0">
        <div className="flex h-16 items-center px-6 border-b border-border min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
            <Logo size="sm" />
          </Link>
        </div>

        {renderNavItems()}

        <div className="p-4 border-t border-border">
          <CreditIndicator />
          <button
            onClick={logout}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut className="mr-3 h-5 w-5 text-text-muted group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer (< md screens) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in" 
            onClick={() => setSidebarOpen(false)} 
          />

          {/* Slide-in Drawer */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-surface border-r border-border shadow-2xl z-10 animate-in slide-in-from-left duration-250">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border min-w-0">
              <Link 
                href="/dashboard" 
                onClick={() => setSidebarOpen(false)} 
                className="flex items-center gap-2 overflow-hidden min-w-0 flex-1"
              >
                <Logo size="sm" />
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderNavItems(() => setSidebarOpen(false))}

            <div className="p-4 border-t border-border">
              <CreditIndicator />
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  logout();
                }}
                className="group flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
              >
                <LogOut className="mr-3 h-5 w-5 text-text-muted group-hover:text-red-500" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
