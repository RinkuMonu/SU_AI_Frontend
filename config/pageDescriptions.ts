export interface PageMeta {
  path: string;
  name: string;
  badge?: string;
  category: string;
  shortDescription: string;
  detailedDescription: string;
}

export const PAGE_DESCRIPTIONS: Record<string, PageMeta> = {
  "/dashboard": {
    path: "/dashboard",
    name: "Dashboard",
    badge: "Command Center",
    category: "Overview",
    shortDescription: "Real-time AI marketing summary, 7-day KPIs, quick studios & today's suggestions.",
    detailedDescription: "Your central command center to monitor marketing performance score, remaining AI credits, live activity, and AI-driven growth recommendations.",
  },
  "/brand": {
    path: "/brand",
    name: "Brand Kit",
    badge: "Core Identity",
    category: "Branding",
    shortDescription: "Manage brand colors, logos, typography, slogans & business tone of voice.",
    detailedDescription: "Define your company's core identity so all generated reels, posters, and websites strictly adhere to your brand guidelines.",
  },
  "/content": {
    path: "/content",
    name: "AI Content Generation",
    badge: "Copywriting",
    category: "AI Studio",
    shortDescription: "Generate high-converting ad copy, Instagram captions, hashtags & slogans.",
    detailedDescription: "Gemini-powered creative copywriter for punchy headlines, WhatsApp broadcast messages, and social media hooks.",
  },
  "/create/reel": {
    path: "/create/reel",
    name: "Create Reel",
    badge: "9:16 Video",
    category: "Video Studio",
    shortDescription: "Generate 9:16 vertical short videos with trending audio, hooks & AI captions.",
    detailedDescription: "Turn product ideas or marketing topics into viral Instagram and Facebook reels with animated subtitles and background tracks.",
  },
  "/ai-post": {
    path: "/ai-post",
    name: "AI Post Maker",
    badge: "1-Click Poster",
    category: "Design Studio",
    shortDescription: "1-click social media poster maker for festivals, sales offers & product flyers.",
    detailedDescription: "Create studio-quality promotional graphics with automatic business branding, contact details, and custom themes.",
  },
  "/ai-calendar": {
    path: "/ai-calendar",
    name: "AI Calendar",
    badge: "Auto Scheduler",
    category: "Planning",
    shortDescription: "Automate and schedule your monthly social media campaigns in advance.",
    detailedDescription: "Intelligent calendar planner aligning posts with Indian festivals, weekend sales, and peak customer engagement windows.",
  },
  "/ai-photoshoot/avatar": {
    path: "/ai-photoshoot/avatar",
    name: "AI Avatar Photoshoot",
    badge: "Virtual Actor",
    category: "Virtual Models",
    shortDescription: "Generate hyper-realistic Indian presenters & digital brand avatars.",
    detailedDescription: "Create professional model visuals and presenter-led promos without booking expensive studios or hiring models.",
  },
  "/ai-photoshoot/product": {
    path: "/ai-photoshoot/product",
    name: "AI Product Photography",
    badge: "Studio 3D",
    category: "Photography Studio",
    shortDescription: "Transform raw product pictures into studio-grade commercial product shots.",
    detailedDescription: "Remove backgrounds and position your products in luxury, lifestyle, or festive settings with AI lighting.",
  },
  "/website-builder": {
    path: "/website-builder",
    name: "Website Builder",
    badge: "No-Code Web",
    category: "Web Presence",
    shortDescription: "Generate and launch high-converting, mobile-friendly websites in minutes.",
    detailedDescription: "No-code AI website generator featuring responsive layouts, lead capture forms, WhatsApp chat, and custom domains.",
  },
  "/festivals": {
    path: "/festivals",
    name: "Festival Engine",
    badge: "Trending Events",
    category: "Indian Celebrations",
    shortDescription: "Explore upcoming Indian festivals & create festive campaigns in 1 click.",
    detailedDescription: "Pre-designed regional and national festive calendars with instant greeting templates tailored to your business sector.",
  },
  "/influencers": {
    path: "/influencers",
    name: "Influencers",
    badge: "Creator Collabs",
    category: "Growth & Collabs",
    shortDescription: "Discover & partner with relevant local social media influencers and creators.",
    detailedDescription: "Search vetted creators by niche, city, follower size, and engagement rate to drive viral word-of-mouth campaigns.",
  },
  "/content-library": {
    path: "/content-library",
    name: "Plan Content (Calendar)",
    badge: "Asset Hub",
    category: "Asset Management",
    shortDescription: "Store, organize, review, and manage all your generated creatives & schedules.",
    detailedDescription: "Your centralized media repository for published posts, drafted reels, approved templates, and scheduled social queues.",
  },
  "/uni-ai": {
    path: "/uni-ai",
    name: "UNI AI (Hinglish)",
    badge: "24/7 Consultant",
    category: "AI Advisor",
    shortDescription: "Chat with your 24/7 AI business marketing consultant in Hinglish & English.",
    detailedDescription: "Get actionable growth hacks, pricing advice, local marketing strategies, and festival campaign ideas in natural language.",
  },
  "/social-platforms": {
    path: "/social-platforms",
    name: "Social Platforms",
    badge: "Omnichannel",
    category: "Social Channels",
    shortDescription: "Connect, synchronize & automate Instagram, Facebook & LinkedIn channels.",
    detailedDescription: "Centralized social dashboard to manage account authorization, permissions, multi-platform publishing, and performance.",
  },
  "/social-platforms/instagram": {
    path: "/social-platforms/instagram",
    name: "Instagram Channel",
    badge: "IG Graph API",
    category: "Social Channels",
    shortDescription: "Automate reels, posts, stories, auto-replies & engagement tracking.",
    detailedDescription: "Direct Instagram Graph API integration for one-tap publishing, follower growth tracking, and audience engagement.",
  },
  "/social-platforms/facebook": {
    path: "/social-platforms/facebook",
    name: "Facebook Channel",
    badge: "FB Pages",
    category: "Social Channels",
    shortDescription: "Sync Facebook Page posts, community updates & ad account connectivity.",
    detailedDescription: "Manage your business Facebook Page, publish updates automatically, and analyze reach across community groups.",
  },
  "/social-platforms/linkedin": {
    path: "/social-platforms/linkedin",
    name: "LinkedIn Channel",
    badge: "B2B Reach",
    category: "Social Channels",
    shortDescription: "Share B2B thought leadership, company updates & industry news.",
    detailedDescription: "Expand your professional network and attract corporate clients by scheduling articles and company achievements.",
  },
  "/analytics": {
    path: "/analytics",
    name: "Analytics",
    badge: "Deep Insights",
    category: "Reports & Insights",
    shortDescription: "Track reach, engagement rates, AI usage trends & 0-100 marketing score.",
    detailedDescription: "Deep-dive visual charts, channel comparisons, Gemini-driven insights, and weekly performance growth indicators.",
  },
  "/subscription": {
    path: "/subscription",
    name: "Billing & Plans",
    badge: "Growth Plans",
    category: "Billing",
    shortDescription: "Choose Starter, Growth or Scale plans with flexible billing & AI credits.",
    detailedDescription: "Upgrade or renew your plan, configure auto-pay, and view inclusive credit allowances for posts, reels & websites.",
  },
  "/subscription/transactions": {
    path: "/subscription/transactions",
    name: "Transactions & AutoPay",
    badge: "Tax Invoices",
    category: "Billing",
    shortDescription: "Download GST invoices, payment receipts & auto-renewal status.",
    detailedDescription: "Verified transaction history with instant PDF download, Razorpay order IDs, and auto-debit management.",
  },
  "/subscription/credits": {
    path: "/subscription/credits",
    name: "AI Token & Credits",
    badge: "Token Usage",
    category: "Billing",
    shortDescription: "Live breakdown of credits spent on posts, reels, avatars & websites.",
    detailedDescription: "Detailed audit trail of all AI operations, credit balance deductions, top-ups, and expiration dates.",
  },
  "/support": {
    path: "/support",
    name: "Support & Help",
    badge: "24/7 Care",
    category: "Assistance",
    shortDescription: "24/7 priority support via WhatsApp, ticket system & knowledge base.",
    detailedDescription: "Get prompt help from our technical specialists, watch video tutorials, or raise tickets for billing and integration queries.",
  },
  "/settings": {
    path: "/settings",
    name: "Settings",
    badge: "Preferences",
    category: "Account",
    shortDescription: "Manage personal profile, business info, security & notifications.",
    detailedDescription: "Update your profile photo, business registration details, change password, and customize automated notification preferences.",
  },
};

export function getPageMeta(pathname: string): PageMeta {
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "") || "/dashboard";
  
  if (PAGE_DESCRIPTIONS[cleanPath]) {
    return PAGE_DESCRIPTIONS[cleanPath];
  }

  // Prefix match fallback
  for (const key of Object.keys(PAGE_DESCRIPTIONS)) {
    if (cleanPath.startsWith(key) && key !== "/dashboard") {
      return PAGE_DESCRIPTIONS[key];
    }
  }

  return {
    path: cleanPath,
    name: "DhandaGrow AI",
    category: "Workspace",
    shortDescription: "AI-powered marketing automation suite for modern Indian businesses.",
    detailedDescription: "Grow your business with autonomous AI creative generation, multi-platform publishing, and performance analytics.",
  };
}

