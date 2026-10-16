"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { Loader2 } from "lucide-react";

import { SidebarProvider } from "@/components/layout/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login/user");
    }
  }, [user, isLoading, router]);

  // While checking auth, do not render dashboard content
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#090b14] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#f0449b] mb-3" />
        <p className="text-sm text-slate-400">Verifying session...</p>
      </div>
    );
  }

  // If not authenticated, block dashboard access completely and redirect
  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#090b14] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#f0449b] mb-3" />
        <p className="text-sm text-slate-400">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar">
            <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
              <OnboardingProvider>{children}</OnboardingProvider>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

