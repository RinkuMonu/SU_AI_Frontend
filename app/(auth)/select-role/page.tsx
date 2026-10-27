"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { authService } from "@/services/auth.service";
import {
  normalizeRole,
  needsRoleSelection,
  getDashboardRouteForRole,
} from "@/lib/role-routing";

type SelectedRole = "businessman" | "influencer" | null;

// Storefront Icon matching reference
const StoreIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M9 12a3 3 0 0 1-6 0" />
    <path d="M15 12a3 3 0 0 1-6 0" />
    <path d="M21 12a3 3 0 0 1-6 0" />
  </svg>
);

// Creator viewfinder smile icon matching reference
const CreatorIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M5 8.5V6a1 1 0 0 1 1-1h2.5"
      stroke="#F0449B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15.5 5H18a1 1 0 0 1 1 1v2.5"
      stroke="#FC9A5D"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 15.5V18a1 1 0 0 1-1 1h-2.5"
      stroke="#BE32FF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8.5 19H6a1 1 0 0 1-1-1v-2.5"
      stroke="#F0449B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="12"
      r="4.8"
      fill="#F0449B"
      fillOpacity="0.2"
      stroke="#F0449B"
      strokeWidth="1.5"
    />
    <circle cx="10.4" cy="10.8" r="0.75" fill="#FFFFFF" />
    <circle cx="13.6" cy="10.8" r="0.75" fill="#FFFFFF" />
    <path
      d="M10 13.2c.5.8 1.3 1.2 2 1.2s1.5-.4 2-1.2"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

interface RoleOption {
  id: "businessman" | "influencer";
  title: string;
  badge: string;
  badgeStyle: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  iconBoxStyle: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "businessman",
    title: "Business / Businessman",
    badge: "Merchant",
    badgeStyle: "bg-[#701a75]/40 text-[#f472b6] border border-[#f472b6]/30",
    description:
      "For shop owners, companies and D2C brands looking to automate marketing, publish multi-platform ads, manage customer reviews, and boost sales.",
    features: [
      "Business identity, brand kit & logo",
      "Local area & target demographics",
      "Ai ad generator & multi-channel posts",
    ],
    icon: StoreIcon,
    iconBoxStyle: "bg-white/5 border border-white/10 text-white/90",
  },
  {
    id: "influencer",
    title: "Influencer / Creator",
    badge: "Influencer",
    badgeStyle: "bg-[#4c1d95]/40 text-[#c084fc] border border-[#c084fc]/30",
    description:
      "For content creators, public figures and social influencers looking to grow follower reach, collaborate with top brands and monetize sponsorships.",
    features: [
      "Brand collaboration & sponsorship media kit",
      "Viral reel scripts & trending audio hooks",
      "Multi-platform audience analytics & growth",
    ],
    icon: CreatorIcon,
    iconBoxStyle: "bg-purple-950/60 border border-purple-500/20 text-purple-300",
  },
];

export default function SelectRolePage() {
  const router = useRouter();
  const { user, isLoading, login, updateUser, logout } = useAuth();

  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-select current role if already set, or check stored preference, without forcing redirect away
  useEffect(() => {
    if (user && user.role) {
      const norm = normalizeRole(user.role);
      if (norm === "businessman" || norm === "influencer") {
        setSelectedRole(norm);
      }
    } else if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const queryRole = searchParams.get("role") || sessionStorage.getItem("selected_role") || localStorage.getItem("selected_role");
      const norm = normalizeRole(queryRole);
      if (norm === "businessman" || norm === "influencer") {
        setSelectedRole(norm);
      }
    }
  }, [user]);

  const handleCardClick = (roleId: "businessman" | "influencer") => {
    setSelectedRole(roleId);
    if (errorMessage) setErrorMessage(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    roleId: "businessman" | "influencer"
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(roleId);
    }
  };

  const handleContinue = async () => {
    if (!selectedRole || isSubmitting) return;

    const targetDashboard = getDashboardRouteForRole(selectedRole);

    // Direct entry for visitors: allow any user to enter directly without auth blocker
    if (!user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selected_role", selectedRole);
        localStorage.setItem("selected_role", selectedRole);
      }
      const directUser: any = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        name: selectedRole === "businessman" ? "Business User" : "Creator",
        role: selectedRole,
        accountType: selectedRole === "businessman" ? "business" : "influencer",
        phone_verified: true,
        onboardingCompleted: true,
      };
      login("direct_web_token", directUser);
      router.replace(targetDashboard);
      return;
    }

    // Authenticated user selecting/updating their role
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updatedUser = await authService.selectRole(selectedRole);
      if (updatedUser) {
        updateUser(updatedUser);
      }
      const authoritativeRole = updatedUser?.role || selectedRole;
      router.replace(getDashboardRouteForRole(authoritativeRole));
    } catch (_) {
      // Direct navigation fallback
      updateUser({ role: selectedRole });
      router.replace(targetDashboard);
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else if (user && user.role) {
      router.push(getDashboardRouteForRole(user.role));
    } else {
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090A15] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
          <p className="text-sm text-text-muted">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#090A15] text-white flex flex-col justify-between selection:bg-brand-purple selection:text-white">
      {/* Background radial gradient glow effects matching the reference design */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#6B21A8]/25 via-[#BE32FF]/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[300px] bg-gradient-to-tl from-[#F0449B]/15 via-[#FC9A5D]/10 to-transparent blur-[100px] pointer-events-none -z-10" />

      {/* Main Content Container */}
      <main className="w-full max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        {/* Top Header Bar - Clean navigation, no sign in / sign up buttons */}
        <header className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/50 cursor-pointer"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {user && !user.id?.startsWith("user_") && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted hidden sm:inline">
                Signed in as{" "}
                <span className="text-white font-medium">
                  {user.name || user.phone || "User"}
                </span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-text-muted hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/10 transition-colors cursor-pointer"
                title="Switch Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </header>

        {/* Title and Subtitle */}
        <div className="mb-7 sm:mb-9 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            How will you use{" "}
            <span className="bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] bg-clip-text text-transparent">
              DhandhaGrow AI?
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300/80 leading-relaxed max-w-xl">
            We will customize your onboarding stepper and features accordingly.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm flex items-start gap-3 animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-200">Unable to save role</p>
              <p className="mt-0.5 text-xs text-red-300/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Role Cards Grid: Stacked on mobile, 2 columns on larger desktop */}
        <div
          role="radiogroup"
          aria-label="How will you use DhandhaGrow AI?"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 items-stretch"
        >
          {ROLE_OPTIONS.map((option) => {
            const isSelected = selectedRole === option.id;
            const IconComponent = option.icon;

            return (
              <div
                key={option.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleCardClick(option.id)}
                onKeyDown={(e) => handleKeyDown(e, option.id)}
                className={`group relative rounded-2xl cursor-pointer transition-all duration-300 flex flex-col focus:outline-none focus:ring-2 focus:ring-brand-purple ${isSelected
                    ? "p-[1.8px] bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] shadow-[0_0_35px_rgba(190,50,255,0.32)] scale-[1.01]"
                    : "p-[1px] bg-white/10 hover:bg-white/20 hover:scale-[1.005]"
                  }`}
              >
                {/* Inner Card Body */}
                <div
                  className={`flex-1 rounded-[15px] p-5 sm:p-7 flex flex-col justify-between transition-colors ${isSelected
                      ? "bg-[#111327]"
                      : "bg-[#0E1022]/90 hover:bg-[#12152c]"
                    }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Title + Pill Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${option.iconBoxStyle}`}
                        >
                          {option.id === "businessman" ? (
                            <StoreIcon className="w-6 h-6" />
                          ) : (
                            <CreatorIcon className="w-6 h-6" />
                          )}
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                          {option.title}
                        </h2>
                      </div>

                      {/* Role Pill Badge */}
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${option.badgeStyle}`}
                      >
                        {option.badge}
                      </span>
                    </div>

                    {/* Role Description */}
                    <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Green Bullet Points */}
                    <ul className="space-y-2.5 pt-1.5">
                      {option.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0 mt-1.5 shadow-[0_0_8px_#10b981]" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selection Indicator Footer */}
                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {isSelected ? "Role Selected" : "Click to select"}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected
                          ? "bg-gradient-to-r from-[#BE32FF] to-[#F0449B] border-transparent text-white"
                          : "border-white/20 group-hover:border-white/40"
                        }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Continue Button */}
        <div className="w-full flex flex-col items-center">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            className={`w-full sm:max-w-md h-14 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-purple/40 ${!selectedRole || isSubmitting
                ? "bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-orange-950/40 text-white/40 cursor-not-allowed border border-white/5"
                : "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving your role...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {!selectedRole && (
            <p className="text-xs text-text-muted mt-3">
              Please choose a role above to proceed to your dashboard.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-text-muted/60">
        DhandhaGrow AI &copy; {new Date().getFullYear()} &bull; Onboarding Stepper
      </footer>
    </div>
  );
}
