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
  id: string; // Backend plan ID
  planBadge: string; // "PLAN 1", "PLAN 2", etc.
  name: string; // "Free", "Starter", "Growth", "Business", "Influencer"
  tagline: string;
  creditBadge: string;
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
    creditBadge: "50 Credits · one time",
    monthlyPrice: 0,
    highlights: [
      "5 AI social media posts/month",
      "1 AI reel/month",
      "50 AI credits (one time)",
    ],
    allFeatures: [
      "Basic AI Caption & Post Generator",
      "1 AI Reel creation per month",
      "50 one-time AI Credits",
      "1 Connected Social Media Account",
      "Standard Community Support",
      "Watermark on exported media",
    ],
  },
  {
    id: "PRO_STARTER",
    planBadge: "PLAN 1",
    name: "Pro",
    tagline: "AI creation, marketing, publishing and business tools.",
    creditBadge: "300 monthly + 50 signup bonus",
    monthlyPrice: 799,
    highlights: [
      "300 monthly credits",
      "50 signup bonus credits (one time)",
      "AI creation, marketing and publishing tools",
    ],
    allFeatures: [
      "AI Post Maker, Image Generator and Content + Image",
      "AI Photoshoot, Reel Maker, Avatar, Actor and Photobooth",
      "AI Advertisement Maker and Marketing Agent",
      "Social Media Calendar and Indian Festival Engine",
      "Instagram DM AI and AI Review Manager",
      "AI Website Builder",
      "50 signup bonus credits on first paid subscription",
    ],
  },
  {
    id: "PRO_PLUS",
    planBadge: "PLAN 2",
    name: "Pro Plus",
    tagline: "Everything in Pro, plus advanced intelligence and business tools.",
    creditBadge: "1,500 monthly + 50 signup bonus",
    monthlyPrice: 2999,
    isPopular: true,
    highlights: [
      "1,500 monthly credits",
      "50 signup bonus credits (one time)",
      "Business analytics, CRM and AI intelligence",
    ],
    allFeatures: [
      "Everything included in Pro",
      "Business Analytics, Leads CRM and Product Catalogue",
      "AI Brand Brain and UGC AI",
      "1,500 monthly credits",
      "50 signup bonus credits on first paid subscription",
    ],
  },
  {
    id: "BUSINESS",
    planBadge: "PLAN 3",
    name: "Business",
    tagline: "Everything in Pro Plus, with the complete business service suite.",
    creditBadge: "2,500 monthly + 50 signup bonus",
    monthlyPrice: 4999,
    highlights: [
      "2,500 monthly credits",
      "50 signup bonus credits (one time)",
      "Complete AI creation and business intelligence suite",
    ],
    allFeatures: [
      "Everything included in Pro Plus",
      "Business Analytics, Leads CRM and Product Catalogue",
      "AI Brand Brain and UGC AI",
      "2,500 monthly credits",
      "50 signup bonus credits on first paid subscription",
    ],
  },
  {
    id: "BUSINESS_PREMIUM",
    planBadge: "PLAN 4",
    name: "Business Premium",
    tagline: "Everything in Business, plus premium services and company brand kit.",
    creditBadge: "5,000 monthly + 50 signup bonus",
    monthlyPrice: 9999,
    highlights: [
      "5,000 monthly credits",
      "50 signup bonus credits (one time)",
      "Premium services and company brand kit",
    ],
    allFeatures: [
      "Everything included in Business",
      "Premium Influencer Marketing and Customer Support",
      "Physical Training Provider and 24/7 Website Technical Support",
      "Company Logo, Visiting Cards, Employee ID Cards, Company Letterhead and Stamp",
      "5,000 monthly credits",
      "50 signup bonus credits on first paid subscription",
    ],
  },
];

export function normalizePlanId(planId: string | null | undefined): string {
  const normalized = (planId || "").toUpperCase();
  if (normalized === "STARTER" || normalized === "BASIC") return "PRO_STARTER";
  if (normalized === "PRO" || normalized === "GROWTH") return "PRO_PLUS";
  if (normalized === "INFLUENCER") return "BUSINESS_PREMIUM";
  return normalized;
}

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
    const totalQuarterly = Math.round(baseMonthlyPrice * 3 * 0.9);
    return {
      displayPrice: totalQuarterly,
      perMonthPrice: totalQuarterly / 3,
      intervalLabel: "/ quarter",
      savingsPercent: 10,
    };
  }

  if (cycle === "yearly") {
    const totalYearly = Math.round(baseMonthlyPrice * 12 * 0.8);
    return {
      displayPrice: totalYearly,
      perMonthPrice: totalYearly / 12,
      intervalLabel: "/ year",
      savingsPercent: 20,
    };
  }

  // Monthly default
  return {
    displayPrice: baseMonthlyPrice,
    perMonthPrice: baseMonthlyPrice,
    intervalLabel: "/ month",
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
 * 2. It is an active upgraded/paid plan, OR
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
  const paidPlans = [
    "PRO",
    "PRO_PLUS",
    "BUSINESS",
    "BUSINESS_PREMIUM",
    "STARTER",
    "GROWTH",
    "INFLUENCER",
  ];
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
