import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AutomaticBrandKitModal } from "@/components/brand/AutomaticBrandKitModal";
import { AutomaticSocialConnectivityModal } from "@/components/social/AutomaticSocialConnectivityModal";
import { AutomaticPlansModal } from "@/components/plans/AutomaticPlansModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Automatic Onboarding Modals for Businessman (Step 1, Step 2, Step 3) */}
      <AutomaticBrandKitModal />
      <AutomaticSocialConnectivityModal />
      <AutomaticPlansModal />
    </div>
  );
}
