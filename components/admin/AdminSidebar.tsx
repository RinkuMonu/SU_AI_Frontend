"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Building2, 
  CreditCard, 
  Coins, 
  BrainCircuit, 
  BarChart3, 
  FileText, 
  LifeBuoy, 
  Settings,
  LogOut,
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/ui/Logo";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
    { name: "Businesses", href: "/admin/businesses", icon: Building2 },
  { name: "Marketplace", href: "/admin/marketplace", icon: Sparkles },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Credits", href: "/admin/credits", icon: Coins },
  { name: "AI Usage", href: "/admin/ai-usage", icon: BrainCircuit },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Support", href: "/admin/support", icon: LifeBuoy },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-surface border-r border-border text-text-secondary">
      <div className="h-16 flex items-center px-6 border-b border-border min-w-0">
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
          <Logo size="sm" />
          <span className="text-[10px] text-brand-coral uppercase tracking-widest mt-1 flex-shrink-0">Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-brand-purple/15 border border-brand-purple/35 text-white"
                    : "text-text-muted hover:bg-surface-elevated hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-purple' : 'text-text-muted'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-text-muted rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
