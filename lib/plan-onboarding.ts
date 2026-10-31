import { normalizeRole } from "./role-routing";
import { isBrandKitComplete } from "./brand-kit";
import { PlatformConnectionState } from "./social-connectivity";
import { BrandKit } from "@/types/brand";
import { Business } from "@/types";
import { Subscription } from "@/types/subscription";

export type BillingCycle = "monthly" | "quarterly" | "yearly";

export interface PlanFeatureItem {
  text: string;
  included: boolean;
}

export interface PlanDefinition {
  id: string; // Backend plan ID (e.g. FREE, STARTER, PRO, BUSINESS, INFLUENCER)
  planBadge: string; // "PLAN 1", "PLAN 2", etc.
  name: string; // "Free", "Starter", "Growth", "Business", "Influencer"
  tagline: string;
  creditBadge: string; // "5 Credits", "100 Credits", etc.
  monthlyPrice: number; // Base price in INR
  highlights: string[]; // 3 main bullet points shown by default
  allFeatures: string[]; // Expanded full feature list
  isPopular?: boolean;
}

export const AVAILABLE_PLANS: PlanDefinition[] = [
  {
    id: "FREE",
    planBadge: "PLAN 1",
    name: "Free",
    tagline: "For students, beginners and first timers.",
    creditBadge: "5 Credits",
    monthlyPrice: 0,
    highlights: [
      "5 AI social media posts/month",
      "1 AI reel/month",
      "5 AI credits/month",
    ],
    allFeatures: [
      "Basic AI Caption & Post Generator",
      "1 AI Reel creation per month",
      "5 monthly AI Credits",
      "1 Connected Social Media Account",
      "Standard Community Support",
      "Watermark on exported media",
    ],
  },
  {
    id: "STARTER",
    planBadge: "PLAN 2",
    name: "Starter",
    tagline: "For shopkeepers, freelancers and small businesses.",
    creditBadge: "100 Credits",
    monthlyPrice: 799,
    highlights: [
      "100 monthly credits",
      "30 AI posts/month",
      "10 AI reels/month",
    ],
    allFeatures: [
      "100 Monthly AI Generation Credits",
      "30 AI Social Media Posts per month",
      "10 High-definition AI Reels per month",
      "No Watermark on exported content",
      "Automated Instagram & Facebook Auto-publishing",
      "AI Photoshoot Studio with 10 templates",
      "Content Calendar Scheduling",
      "Standard Email & Chat Support",
    ],
  },
  {
    id: "PRO", // Backend represents Growth as PRO
    planBadge: "PLAN 3",
    name: "Growth",
    tagline: "For creator, D2C brands and growing businesses.",
    creditBadge: "400 Credits",
    monthlyPrice: 2999,
    isPopular: true,
    highlights: [
      "400 monthly credits",
      "100 AI posts/month",
      "30 AI reels/month",
    ],
    allFeatures: [
      "400 Monthly AI Generation Credits",
      "100 AI Posts & Carousels per month",
      "30 Ultra-HD AI Video Reels per month",
      "AI Human Avatars & Multilingual Voiceovers",
      "AI Ad Creative Generator with High-ROI CTAs",
      "Full Social Platform Publishing (IG, FB, LinkedIn)",
      "Website & Landing Page Builder (1 site)",
      "Performance Insights & Engagement Analytics",
      "Priority 24/7 Support",
    ],
  },
  {
    id: "BUSINESS",
    planBadge: "PLAN 4",
    name: "Business",
    tagline: "For established businesses",
    creditBadge: "1000 Credits",
    monthlyPrice: 4999,
    highlights: [
      "1000 monthly credits",
      "200 AI posts/month",
      "60 AI reels/month",
    ],
    allFeatures: [
      "1,000 Monthly AI Generation Credits",
      "200 AI Posts & Campaigns per month",
      "60 Production-grade AI Reels per month",
      "Multi-business Workspace (up to 5 businesses)",
      "Team Collaboration & Role Permissions (5 seats)",
      "White-label Content Export & Brand Kit lock",
      "AI Review Responder & Customer Messaging",
      "Developer API Access & Webhooks",
      "Dedicated Account Manager",
    ],
  },
  {
    id: "INFLUENCER",
    planBadge: "PLAN 5",
    name: "Influencer",
    tagline: "For brands that want creator partnerships",
    creditBadge: "Influencer...",
    monthlyPrice: 9999,
    highlights: [
      "Influencer discovery & shortlisting",
      "Creator audience",
      "Brand collaboration",
    ],
    allFeatures: [
      "Verified Creator Marketplace Direct Access",
      "Influencer Audience Analytics & Fraud Detection",
      "Automated Collaboration Contracts & Escrow",
      "Multi-Creator Campaign Tracking Dashboard",
      "Custom AI Video Avatar Training for Your Brand",
      "Unlimited Social Account Integrations",
      "Enterprise SLA & Dedicated Talent Liaison",
    ],
  },
];

/**
 * Calculates price based on selected billing cycle:
 * - Monthly: base price
 * - Quarterly: 10% discount per month (billed quarterly)
 * - Yearly: 20% discount per month (billed annually)
 */
export function calculatePlanPrice(
  baseMonthlyPrice: number,
  cycle: BillingCycle
): {
  displayPrice: number;
  perMonthPrice: number;
  intervalLabel: string;
  savingsPercent: number;
} {
  if (baseMonthlyPrice === 1) {
    return {
      displayPrice: 1,
      perMonthPrice: 1,
      intervalLabel: "/ test",
      savingsPercent: 0,
    };
  }

  if (baseMonthlyPrice === 0) {
    return {
      displayPrice: 0,
      perMonthPrice: 0,
      intervalLabel: "/ forever",
      savingsPercent: 0,
    };
  }

  if (cycle === "quarterly") {
    const discountedPerMonth = Math.round(baseMonthlyPrice * 0.9);
    const totalQuarterly = discountedPerMonth * 3;
    return {
      displayPrice: totalQuarterly,
      perMonthPrice: discountedPerMonth,
      intervalLabel: "/ quarter + GST",
      savingsPercent: 10,
    };
  }

  if (cycle === "yearly") {
    const discountedPerMonth = Math.round(baseMonthlyPrice * 0.8);
    const totalYearly = discountedPerMonth * 12;
    return {
      displayPrice: totalYearly,
      perMonthPrice: discountedPerMonth,
      intervalLabel: "/ year + GST",
      savingsPercent: 20,
    };
  }

  // Monthly default
  return {
    displayPrice: baseMonthlyPrice,
    perMonthPrice: baseMonthlyPrice,
    intervalLabel: "/ month + GST",
    savingsPercent: 0,
  };
}

/**
 * Formats an INR price into human-readable currency format (e.g. ₹2,999)
 */
/**
 * Calculates base price, 18% GST amount, and total payable dynamically.
 * Formula:
 * GST Amount = Base Price × 18 / 100
 * Total Payable = Base Price + GST Amount
 */
export function calculatePlanPriceWithGST(
  baseMonthlyPrice: number,
  cycle: BillingCycle
): {
  basePrice: number;
  gstAmount: number;
  totalPayable: number;
  gstRate: number;
  perMonthBase: number;
  savingsPercent: number;
  intervalLabel: string;
} {
  const priceInfo = calculatePlanPrice(baseMonthlyPrice, cycle);
  const isFree = baseMonthlyPrice === 0;
  const basePrice = priceInfo.displayPrice;
  const gstRate = isFree ? 0 : 0.18;
  const gstAmount = isFree ? 0 : Math.round(basePrice * gstRate * 100) / 100;
  const totalPayable = isFree ? 0 : Math.round((basePrice + gstAmount) * 100) / 100;

  return {
    basePrice,
    gstAmount,
    totalPayable,
    gstRate,
    perMonthBase: priceInfo.perMonthPrice,
    savingsPercent: priceInfo.savingsPercent,
    intervalLabel: priceInfo.intervalLabel,
  };
}

export function formatCurrencyINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

/**
 * Determines whether the user has a confirmed, active qualifying plan from the backend.
 * A plan is considered a qualifying active plan if:
 * 1. The subscription exists with status === "active"
 * 2. It is an active upgraded/paid plan (STARTER, PRO/GROWTH, BUSINESS, INFLUENCER), OR
 * 3. An explicit activation timestamp exists on the subscription or business record.
 */
export function isQualifyingPlanActive(
  subscription: Subscription | null | undefined,
  business?: Business | null
): boolean {
  if (!subscription) return false;

  const status = (subscription.status || "").toLowerCase();
  if (status !== "active") return false;

  const planId = (subscription.plan_id || "").toUpperCase();

  // Any paid plan confirmed active by the backend is a qualifying active plan
  const paidPlans = ["STARTER", "PRO", "GROWTH", "BUSINESS", "INFLUENCER"];
  if (paidPlans.includes(planId)) {
    return true;
  }

  // Explicit activation confirmed on business or subscription object
  if ((subscription as any)?.is_plan_activated === true) {
    return true;
  }

  if ((business as any)?.plan_activated === true) {
    return true;
  }

  return false;
}

import { isPlanPopupEligible } from "./popup-coordinator";

/**
 * Pure rule engine deciding whether to display the Available Plans modal.
 * Rules:
 * 1. User must be a Businessman (Influencers are excluded).
 * 2. Eligible after successful login.
 * 3. Does not auto-open on dedicated billing or management pages.
 * 4. Respects temporary session dismissal & reasonable cooldown.
 * 5. Does not overlap with other active popups.
 */
export function shouldDisplayPlansModal(params: {
  userRole?: string | null;
  brandKit?: BrandKit | null;
  business?: Business | null;
  socialConnections?: PlatformConnectionState;
  subscription?: Subscription | null | undefined;
  sessionDismissed: boolean;
  pathname?: string;
  hasSeenThisSession?: boolean;
}): boolean {
  const {
    userRole,
    business,
    subscription,
    sessionDismissed,
    pathname,
  } = params;

  // 1. Role must be Businessman
  if (normalizeRole(userRole) !== "businessman") {
    return false;
  }

  // 2. Cannot display if dismissed in current mounted session
  if (sessionDismissed) {
    return false;
  }

  // 3. Delegate to coordinator for route exclusions, active mutex, and cooldown checks
  const isEligible = isPlanPopupEligible({
    user: { role: userRole },
    pathname,
    hasActiveQualifyingPlan: isQualifyingPlanActive(subscription, business),
  });

  return isEligible;
}

