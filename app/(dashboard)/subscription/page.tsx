"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Zap, CheckCircle2, AlertCircle, ArrowUpRight, Check, ChevronDown, LayoutList, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { paymentService } from "@/services/payment.service";
import { Subscription, CreditTransaction, PlanConfig } from "@/types/subscription";

const FALLBACK_PLANS: Record<string, PlanConfig> = {
  FREE: {
    name: "FREE",
    tagline: "Explore AI",
    description: "For students, beginners and first-time users.",
    price: 0,
    base_price: 0,
    gst_rate: 0,
    gst_percent: 18,
    gst_amount: 0,
    total_price: 0,
    currency: "INR",
    billing_cycle: "forever",
    credits: 5,
    post_limit: 5,
    reel_limit: 1,
    team_members: 1,
    watermark: true,
    multiple_businesses: false,
    api_access: false,
    white_label: false,
    features: ["ai_post", "ai_reel", "ai_caption", "brand_profile", "explore_tools"],
    bullet_points: [
      "5 AI social media posts/month",
      "1 AI reel/month",
      "5 AI credits/month",
      "Basic caption generation",
      "1 brand profile",
      "Explore AI tools before upgrading"
    ]
  },
  STARTER: {
    name: "STARTER",
    tagline: "Create",
    description: "For shopkeepers, freelancers and small businesses starting online marketing.",
    price: 799,
    base_price: 799,
    gst_rate: 0.18,
    gst_percent: 18,
    gst_amount: 143.82,
    total_price: 942.82,
    currency: "INR",
    billing_cycle: "monthly",
    credits: 100,
    post_limit: 30,
    reel_limit: 10,
    team_members: 1,
    watermark: false,
    multiple_businesses: false,
    api_access: false,
    white_label: false,
    features: ["ai_post", "ai_reel", "ai_caption", "hashtags", "brand_profile", "brand_ready_creatives"],
    bullet_points: [
      "100 monthly credits",
      "30 AI posts/month",
      "10 AI reels/month",
      "30 AI captions/month",
      "Basic hashtag suggestions",
      "1 brand and 1 user",
      "Brand-ready social media creatives"
    ]
  },
  GROWTH: {
    name: "GROWTH",
    tagline: "Market",
    description: "For creators, D2C brands and growing businesses that want consistent marketing.",
    price: 2999,
    base_price: 2999,
    gst_rate: 0.18,
    gst_percent: 18,
    gst_amount: 539.82,
    total_price: 3538.82,
    currency: "INR",
    billing_cycle: "monthly",
    credits: 400,
    post_limit: 100,
    reel_limit: 30,
    team_members: 2,
    watermark: false,
    multiple_businesses: false,
    api_access: false,
    white_label: false,
    features: ["ai_avatar", "ai_photoshoot", "fashion_ai", "brand_customization", "content_calendar", "post_scheduling"],
    bullet_points: [
      "400 monthly credits",
      "100 AI posts/month",
      "30 AI reels/month",
      "100 AI captions/month",
      "AI Photoshoot, Fashion AI and Avatar tools",
      "Advanced brand customization",
      "Social media content calendar",
      "Post scheduling tools",
      "2 users"
    ]
  },
  BUSINESS: {
    name: "BUSINESS",
    tagline: "Automate",
    description: "For established businesses, marketing teams and agencies.",
    price: 4999,
    base_price: 4999,
    gst_rate: 0.18,
    gst_percent: 18,
    gst_amount: 899.82,
    total_price: 5898.82,
    currency: "INR",
    billing_cycle: "monthly",
    credits: 1000,
    post_limit: 200,
    reel_limit: 60,
    team_members: 5,
    watermark: false,
    multiple_businesses: true,
    api_access: true,
    white_label: true,
    features: ["ai_avatar", "ai_actor", "ai_photoshoot", "ads", "whatsapp_ai", "instagram_ai", "advanced_analytics", "crm"],
    bullet_points: [
      "1,000 monthly credits",
      "200 AI posts/month",
      "60 AI reels/month",
      "200 AI captions/month",
      "5 team members",
      "Multiple brand profiles",
      "Advanced scheduling and campaign management",
      "Business analytics",
      "AI Marketing Agent",
      "WhatsApp AI and Instagram DM AI, where integrations are supported",
      "Leads CRM and product catalogue tools"
    ]
  },
  INFLUENCER: {
    name: "INFLUENCER",
    tagline: "Collaborate",
    description: "For brands that want creator partnerships and influencer-led campaigns.",
    price: 9999,
    base_price: 9999,
    gst_rate: 0.18,
    gst_percent: 18,
    gst_amount: 1799.82,
    total_price: 11798.82,
    currency: "INR",
    billing_cycle: "monthly",
    credits: 2000,
    post_limit: -1,
    reel_limit: -1,
    team_members: 10,
    watermark: false,
    multiple_businesses: true,
    api_access: true,
    white_label: true,
    features: [
      "influencer_discovery", "creator_review", "collaboration_coordination",
      "campaign_briefs", "outreach_assistance", "campaign_tracking",
      "ai_promotional_creatives", "performance_analytics", "custom_packages"
    ],
    bullet_points: [
      "Influencer discovery and shortlisting",
      "Creator audience and engagement review",
      "Brand-influencer collaboration coordination",
      "Campaign briefs and content planning",
      "Influencer outreach assistance",
      "Campaign tracking and reporting",
      "AI-generated promotional creatives and captions",
      "Performance analytics, where data is available",
      "Custom campaign packages for larger brands"
    ]
  }
};

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [plans, setPlans] = useState<Record<string, PlanConfig>>(FALLBACK_PLANS);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"horizontal" | "grid">("horizontal");

  const toggleExpandPlan = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(false);
        const [sub, hist, availablePlans] = await Promise.all([
          subscriptionService.getMySubscription(),
          subscriptionService.getCreditTransactions(),
          subscriptionService.getPlans()
        ]);
        setSubscription(sub);
        setHistory(hist);
        
        const publicKeys = ["FREE", "STARTER", "GROWTH", "BUSINESS", "INFLUENCER"];
        const sanitizedPlans: Record<string, PlanConfig> = {};
        
        publicKeys.forEach((key) => {
          if (availablePlans && availablePlans[key]) {
            sanitizedPlans[key] = {
              ...FALLBACK_PLANS[key],
              ...availablePlans[key]
            };
          } else {
            sanitizedPlans[key] = FALLBACK_PLANS[key];
          }
        });
        
        setPlans(sanitizedPlans);
      } catch (err) {
        console.error("Failed to load subscription data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpgrade = async (planId: string) => {
    const normalizedPlan = (planId || "").trim().toUpperCase();
    if (normalizedPlan === "FREE") {
      await handleFreePlan();
      return;
    }

    try {
      setUpgradingPlan(normalizedPlan);
      const response = await paymentService.createPayment(normalizedPlan);
      
      if (response.payment_url) {
        window.location.href = response.payment_url;
      } else {
        throw new Error("Invalid payment URL returned");
      }
    } catch (err: any) {
      console.error("Failed to initiate payment", err);
      
      if (err?.response?.status === 401) {
        window.location.href = "/login/user";
      } else {
        alert("Failed to initiate secure payment. Please try again.");
      }
      setUpgradingPlan(null);
    }
  };

  const handleFreePlan = async () => {
    try {
      setUpgradingPlan("FREE");
      await subscriptionService.upgradePlan("FREE");
      setUpgradeSuccess("Successfully activated Free Plan!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setUpgradeSuccess("Free Plan is active on your account.");
    } finally {
      setUpgradingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-text-muted space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-lg">Unable to load billing information. Please try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </div>
    );
  }

  const rawPlanId = subscription.plan_id || "FREE";
  const normalizedUserPlan = rawPlanId.toUpperCase() === "PRO" ? "GROWTH" : rawPlanId.toUpperCase();

  const activePlanKey = (hoveredPlanId || normalizedUserPlan).toUpperCase();
  const activePlan = plans[activePlanKey] || FALLBACK_PLANS[activePlanKey] || plans[normalizedUserPlan];
  const isActualUserPlan = activePlanKey === normalizedUserPlan;
  
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 py-6 px-2 sm:px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Subscription &amp; Billing</h1>
        <p className="text-text-muted">Manage your AI subscription plan with 18% GST transparent pricing.</p>
      </div>

      {upgradeSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-500 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {upgradeSuccess}
        </div>
      )}

      {/* Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              {hoveredPlanId ? "Selected Plan" : "Current Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white uppercase flex items-center gap-2">
              <span>{activePlanKey}</span>
              {hoveredPlanId && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 font-medium normal-case">
                  Preview
                </span>
              )}
            </div>
            <p className="text-xs text-brand-purple mt-1 flex items-center gap-1">
              Status: <span className="uppercase font-semibold">{isActualUserPlan ? (subscription.status || "ACTIVE") : "AVAILABLE"}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border shadow-md relative overflow-hidden transition-all duration-300">
          <div className="absolute right-0 top-0 w-16 h-16 bg-brand-purple/10 rounded-bl-full blur-xl" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Credits Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-purple flex items-center gap-2">
              <Zap className="h-6 w-6 fill-brand-purple" />
              {isActualUserPlan ? subscription.credits_remaining : (activePlan?.credits || 0)}
              <span className="text-sm text-text-muted font-normal">/ {activePlan?.credits || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Posts Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {subscription.usage?.posts_created ?? 0} 
              <span className="text-sm text-text-muted font-normal ml-1">
                / {activePlan?.post_limit === -1 ? "Unlimited" : (activePlan?.post_limit ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Reels Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {subscription.usage?.reels_created ?? 0}
              <span className="text-sm text-text-muted font-normal ml-1">
                / {activePlan?.reel_limit === -1 ? "Unlimited" : (activePlan?.reel_limit ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-6 h-6 text-brand-purple" />
              Available Plans
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Select the plan that best fits your workflow. All paid subscriptions include 18% GST.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#101726] p-1 rounded-xl border border-border shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("horizontal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "horizontal"
                  ? "bg-brand-purple/20 text-white border border-brand-purple/40 shadow-sm"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Horizontal View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-brand-purple/20 text-white border border-brand-purple/40 shadow-sm"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {viewMode === "horizontal" ? (
          /* Horizontal Plan Cards */
          <div 
            className="flex flex-col gap-4"
            onMouseLeave={() => setHoveredPlanId(null)}
          >
            {Object.entries(plans).map(([planId, plan], index) => {
              const isActualCurrentPlan = 
                normalizedUserPlan.toUpperCase() === planId.toUpperCase() ||
                rawPlanId.toUpperCase() === planId.toUpperCase();

              const isHighlighted = hoveredPlanId 
                ? hoveredPlanId.toUpperCase() === planId.toUpperCase() 
                : isActualCurrentPlan;

              const isFree = Number(plan.price) === 0;
              const isInfluencer = planId.toUpperCase() === "INFLUENCER";
              const basePrice = Number(plan.price);

              const bullets = plan.bullet_points && plan.bullet_points.length > 0
                ? plan.bullet_points
                : [
                    `${plan.credits} monthly credits`,
                    `${plan.post_limit === -1 ? "Unlimited" : plan.post_limit} Posts / mo`,
                    `${plan.reel_limit === -1 ? "Unlimited" : plan.reel_limit} Reels / mo`,
                    plan.watermark ? "Includes Watermark" : "No Watermarks"
                  ];

              const isExpanded = !!expandedPlans[planId];
              const visibleBullets = isExpanded ? bullets : bullets.slice(0, 5);
              const hasMoreBullets = bullets.length > 5;

              return (
                <div 
                  key={planId} 
                  onMouseEnter={() => setHoveredPlanId(planId)}
                  className={`bg-[#0d111d] relative transition-all duration-300 rounded-2xl cursor-pointer p-5 sm:p-6 border ${
                    isHighlighted 
                      ? "border-brand-purple shadow-[0_0_25px_rgba(190,50,255,0.25)] scale-[1.008] border-2 ring-1 ring-brand-purple/40" 
                      : isInfluencer
                      ? "border-purple-500/40 hover:border-purple-400 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(168,85,247,0.08)]"
                      : "border-border hover:border-brand-purple/50 hover:-translate-y-0.5"
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-6 px-3.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg tracking-wide uppercase whitespace-nowrap animate-in fade-in duration-200">
                      CURRENT PLAN
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Left Section: Plan Name, Tagline & Pricing */}
                    <div className="lg:col-span-4 space-y-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold tracking-wider text-brand-purple uppercase bg-brand-purple/10 px-2.5 py-0.5 rounded-full border border-brand-purple/20">
                          Plan {index + 1}
                        </span>
                        {plan.tagline && (
                          <span className="text-[11px] font-medium text-purple-300/80">
                            — {plan.tagline}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {plan.name}
                      </h3>

                      {plan.description && (
                        <p className="text-xs text-text-muted leading-relaxed max-w-sm">
                          {plan.description}
                        </p>
                      )}

                      <div className="pt-1 flex items-baseline gap-2 flex-wrap">
                        {isInfluencer && (
                          <span className="text-purple-400 font-semibold text-xs">From</span>
                        )}
                        <span className="text-3xl font-extrabold text-white tracking-tight">
                          ₹{basePrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-text-muted text-xs font-medium">
                          {isFree ? "/ forever" : "/ month + GST"}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-2 text-brand-purple font-semibold bg-brand-purple/10 px-3 py-1.5 rounded-lg text-xs border border-brand-purple/20">
                        <Zap className="h-3.5 w-3.5 fill-brand-purple shrink-0" />
                        <span>
                          {isInfluencer ? "Influencer Campaign Suite" : `${plan.credits.toLocaleString("en-IN")} Credits / Month`}
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Features List */}
                    <div className="lg:col-span-5 lg:border-l lg:border-r border-border/50 lg:px-6 space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Included Features
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-300">
                        {visibleBullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-snug">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {hasMoreBullets && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandPlan(planId);
                          }}
                          className="text-[11px] font-semibold text-brand-purple hover:text-purple-300 transition-colors flex items-center gap-1 pt-1.5 cursor-pointer"
                        >
                          <span>{isExpanded ? "Show Less" : `+${bullets.length - 5} More Features`}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    {/* Right Section: Action Button */}
                    <div className="lg:col-span-3 flex flex-col items-stretch lg:items-end justify-center">
                      {isFree ? (
                        <button
                          type="button"
                          onClick={handleFreePlan}
                          disabled={upgradingPlan !== null}
                          className="w-full lg:w-48 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] hover:opacity-90 shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {upgradingPlan === "FREE" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>Get Free Plan</span>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpgrade(planId)}
                          disabled={upgradingPlan !== null}
                          className="w-full lg:w-48 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] hover:opacity-90 shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {upgradingPlan === planId ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>Upgrade to {plan.name}</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch"
            onMouseLeave={() => setHoveredPlanId(null)}
          >
            {Object.entries(plans).map(([planId, plan], index) => {
              const isActualCurrentPlan = 
                normalizedUserPlan.toUpperCase() === planId.toUpperCase() ||
                rawPlanId.toUpperCase() === planId.toUpperCase();

              const isHighlighted = hoveredPlanId 
                ? hoveredPlanId.toUpperCase() === planId.toUpperCase() 
                : isActualCurrentPlan;

              const isFree = Number(plan.price) === 0;
              const isInfluencer = planId.toUpperCase() === "INFLUENCER";
              const basePrice = Number(plan.price);

              const bullets = plan.bullet_points && plan.bullet_points.length > 0
                ? plan.bullet_points
                : [
                    `${plan.credits} monthly credits`,
                    `${plan.post_limit === -1 ? "Unlimited" : plan.post_limit} Posts / mo`,
                    `${plan.reel_limit === -1 ? "Unlimited" : plan.reel_limit} Reels / mo`,
                    plan.watermark ? "Includes Watermark" : "No Watermarks"
                  ];

              const isExpanded = !!expandedPlans[planId];
              const visibleBullets = isExpanded ? bullets : bullets.slice(0, 5);
              const hasMoreBullets = bullets.length > 5;

              return (
                <Card 
                  key={planId} 
                  onMouseEnter={() => setHoveredPlanId(planId)}
                  className={`bg-[#0d111d] flex flex-col relative transition-all duration-300 rounded-2xl cursor-pointer ${
                    isHighlighted 
                      ? "border-brand-purple shadow-[0_0_25px_rgba(190,50,255,0.25)] scale-[1.02] border-2 ring-1 ring-brand-purple/40" 
                      : isInfluencer
                      ? "border-purple-500/40 hover:border-purple-400 hover:-translate-y-1 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                      : "border-border hover:border-brand-purple/50 hover:-translate-y-1"
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg tracking-wide uppercase whitespace-nowrap animate-in fade-in duration-200">
                      CURRENT PLAN
                    </div>
                  )}
                  
                  <CardHeader className="pt-6 pb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold tracking-wider text-brand-purple uppercase bg-brand-purple/10 px-2.5 py-0.5 rounded-full border border-brand-purple/20">
                        Plan {index + 1}
                      </span>
                      {plan.tagline && (
                        <span className="text-[11px] font-medium text-purple-300/80 truncate max-w-[120px]">
                          {plan.tagline}
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-2xl font-extrabold text-white tracking-tight">
                      {plan.name}
                    </CardTitle>
                    
                    {plan.description && (
                      <CardDescription className="text-xs text-text-muted mt-1.5 h-10 line-clamp-2 leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    )}

                    <div className="mt-4 pt-3 border-t border-border/50 h-[64px] flex flex-col justify-end">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        {isInfluencer && (
                          <span className="text-purple-400 font-semibold text-xs">From</span>
                        )}
                        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                          ₹{basePrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-text-muted text-xs font-medium">
                          {isFree ? "/ forever" : "/ month + GST"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3.5 pt-0">
                    <div className="h-9 flex items-center gap-2 text-brand-purple font-semibold bg-brand-purple/10 px-2.5 rounded-lg text-[11px] border border-brand-purple/20">
                      <Zap className="h-3.5 w-3.5 fill-brand-purple shrink-0" />
                      <span className="truncate">
                        {isInfluencer ? "Influencer Campaign Suite" : `${plan.credits.toLocaleString("en-IN")} Credits / Month`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        {visibleBullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-snug">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {hasMoreBullets && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandPlan(planId);
                          }}
                          className="text-[11px] font-semibold text-brand-purple hover:text-purple-300 transition-colors flex items-center gap-1 pt-1 cursor-pointer"
                        >
                          <span>{isExpanded ? "Show Less" : `+${bullets.length - 5} More`}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 pb-6 px-4 w-full block">
                    {isFree ? (
                      <button
                        type="button"
                        onClick={handleFreePlan}
                        disabled={upgradingPlan !== null}
                        className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] hover:opacity-90 shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {upgradingPlan === "FREE" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>Get Free Plan</span>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpgrade(planId)}
                        disabled={upgradingPlan !== null}
                        className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] hover:opacity-90 shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {upgradingPlan === planId ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>Upgrade to {plan.name}</span>
                        )}
                      </button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Credit Transactions</h2>
        <Card className="bg-surface border-border overflow-hidden">
          {history.length === 0 ? (
            <CardContent className="py-8 text-center text-text-muted">
              No credit transactions found.
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-text-muted">
                <thead className="text-xs uppercase bg-surface-elevated/50 text-text-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                    <th className="px-6 py-4 font-medium">Credits</th>
                    <th className="px-6 py-4 font-medium">Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx, idx) => (
                    <tr key={tx.id || idx} className="border-b border-border/50 hover:bg-surface-elevated/20 transition-colors">
                      <td className="px-6 py-4">{format(new Date(tx.created_at), "MMM d, yyyy h:mm a")}</td>
                      <td className="px-6 py-4 font-medium text-white">{tx.action || (tx as any).transaction_type || (tx as any).feature}</td>
                      <td className={`px-6 py-4 font-bold ${tx.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </td>
                      <td className="px-6 py-4">{tx.balance_after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
