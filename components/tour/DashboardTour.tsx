"use client";

import { useEffect, useCallback } from "react";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

export interface TourGuideProps {
  autoStart?: boolean;
}

export const SIDEBAR_TOUR_STEPS: DriveStep[] = [
  {
    element: "#tour-sidebar",
    popover: {
      title: "🧭 Sidebar Navigation",
      description:
        "Welcome to your main navigation menu! From here, you can access every AI studio, marketing tool, social integration, and settings in DhandaGrow.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-dashboard",
    popover: {
      title: "📊 1. Dashboard",
      description:
        "Your business command center. Monitor real-time 7-day marketing analytics, quick creative studios, daily post recommendations, and AI growth insights.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-brand",
    popover: {
      title: "🎨 2. Brand Kit",
      description:
        "Configure your official company logo, brand color palette, fonts, slogans, and voice. Every reel, post, and website generated automatically aligns with this identity.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-content",
    popover: {
      title: "✨ 3. AI Content Generation",
      description:
        "Gemini AI copywriter. Generate high-converting Instagram captions, viral hooks, WhatsApp broadcast copies, product descriptions, and promotional slogans.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-image-reel",
    popover: {
      title: "🎬 4. Image and Reel Generation",
      description:
        "Your creative multimedia engine. Includes 3 tools:\n• Create Reel (9:16 vertical short videos with trending audio)\n• AI Post Maker (1-click festive posters & flyers)\n• AI Calendar (monthly automated campaign scheduler)",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-photoshoot",
    popover: {
      title: "📸 5. AI Photoshoot Studio",
      description:
        "Professional commercial studio without cameras:\n• AI Avatar: Photorealistic virtual Indian presenters & models\n• AI Product Photography: Studio-grade commercial product shots with 3D lighting",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-website-builder",
    popover: {
      title: "🌐 6. Website Builder",
      description:
        "Generate and launch responsive, SEO-ready business websites and landing pages in minutes. Includes lead capture forms, WhatsApp chat, and custom domain support.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-festivals",
    popover: {
      title: "🎉 7. Festival Engine",
      description:
        "Never miss a celebration! Access an exhaustive calendar of Indian national and regional festivals with ready-made festive greeting creatives tailored to your business.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-influencers",
    popover: {
      title: "👥 8. Influencers",
      description:
        "Discover and partner with verified local creators and influencers in your niche. Filter by followers, city, and engagement rates to drive authentic brand collaborations.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-content-library",
    popover: {
      title: "📚 9. Plan Content (Calendar)",
      description:
        "Your centralized media repository. Organize scheduled social posts, drafted reels, approved templates, and oversee your multi-week publishing pipeline.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-uni-ai",
    popover: {
      title: "🤖 10. UNI AI (Hinglish Advisor)",
      description:
        "Your 24/7 dedicated marketing consultant. Chat in natural Hinglish or English for instant growth hacks, festival offers, pricing strategies, and local marketing advice.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-social-platforms",
    popover: {
      title: "🔗 11. Social Platforms",
      description:
        "Multi-channel connectivity hub. Connect and automate publishing across Instagram (Reels & Posts), Facebook Pages, and LinkedIn corporate updates.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-analytics",
    popover: {
      title: "📈 12. Performance Analytics",
      description:
        "Visual reports on audience reach, follower growth, engagement rates, and your dynamic 0–100 Marketing Performance Score with Gemini AI improvement tips.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-billing",
    popover: {
      title: "💳 13. Billing & Plans",
      description:
        "Manage your growth tier (Starter, Growth, Scale), view payment transaction receipts, download GST invoices, and inspect real-time AI token usage.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-sidebar-credits",
    popover: {
      title: "⚡ 14. Live Credits & Plan Meter",
      description:
        "Displays your active subscription tier and real-time remaining AI generation tokens for quick reference.",
      side: "right",
      align: "end",
    },
  },
  {
    element: "#tour-nav-support",
    popover: {
      title: "🎧 15. Support",
      description:
        "Get instant priority support via WhatsApp, submit help tickets, or browse our knowledge base to solve queries fast.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-nav-settings",
    popover: {
      title: "⚙️ 16. Settings",
      description:
        "Update profile details, business registration information, account security, passwords, and automated alert preferences.",
      side: "right",
      align: "start",
    },
  },
];

export const DASHBOARD_TOUR_STEPS: DriveStep[] = [
  // Tour starts with the sidebar elements
  ...SIDEBAR_TOUR_STEPS,

  // Seamlessly transitions to the main Dashboard elements
  {
    element: "#tour-header",
    popover: {
      title: "🏠 Main Dashboard Canvas",
      description:
        "Now let's explore your main workspace! Here is your personalized greeting and 7-day marketing snapshot summary.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-billing-credits",
    popover: {
      title: "⚡ Quick Actions & Billing",
      description:
        "Quickly view your active subscription plan, check remaining credits, download verified GST billing reports, or relaunch this tour guide.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-stats",
    popover: {
      title: "📊 Live Marketing Statistics",
      description:
        "Four live KPI cards tracking Posts Created, Reels Produced, Total AI Generations, and your overall Marketing Score (0-100).",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tour-quick-actions",
    popover: {
      title: "✨ 1-Click AI Creative Studios",
      description:
        "Launch high-impact creative engines in one click:\n• Create Post (promotional & festive creatives)\n• Create Reel (9:16 short video generator)\n• AI Avatar (Indian presenter photoshoot)",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour-todays-marketing",
    popover: {
      title: "📅 Today's Marketing Suggestion",
      description:
        "AI-curated daily marketing post ready for today! Preview the suggested creative, caption, and hashtags, then schedule with one click.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour-recent-activity",
    popover: {
      title: "🕒 Recent Activity & Creations",
      description:
        "Quickly review and re-download recent posts, reels, and photoshoot results generated by you and your team.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#tour-ai-insights",
    popover: {
      title: "💡 AI Recommendations & Insights",
      description:
        "Personalized AI growth recommendations based on your recent activity to maximize audience engagement and sales conversion.",
      side: "top",
      align: "end",
    },
  },
];

export function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function startSidebarTour() {
  if (typeof window === "undefined" || isMobileViewport()) return;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    skipMissingElement: true,
    stagePadding: 6,
    stageRadius: 14,
    overlayColor: "rgba(5, 7, 18, 0.85)",
    popoverClass: "dhandagrow-driver-popover",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Done 🎉",
    progressText: "{{current}} of {{total}}",
    steps: SIDEBAR_TOUR_STEPS,
  });

  driverObj.drive();
}

export function startDashboardTour() {
  if (typeof window === "undefined" || isMobileViewport()) return;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    skipMissingElement: true,
    stagePadding: 8,
    stageRadius: 16,
    overlayColor: "rgba(5, 7, 18, 0.85)",
    popoverClass: "dhandagrow-driver-popover",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Finish Tour 🎉",
    progressText: "{{current}} of {{total}}",
    onDestroyed: () => {
      localStorage.setItem("dhandagrow_dashboard_tour_seen", "true");
    },
    steps: DASHBOARD_TOUR_STEPS,
  });

  driverObj.drive();
}

export function DashboardTourTrigger({ className }: { className?: string }) {
  if (isMobileViewport()) return null;

  return (
    <button
      type="button"
      onClick={() => startDashboardTour()}
      className={
        className ||
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold shadow-sm transition-all cursor-pointer"
      }
      title="Start Dashboard Tour Guide"
    >
      <span className="text-sm">🎯</span>
      <span>Tour Guide</span>
    </button>
  );
}

export function DashboardTour({ autoStart = false }: TourGuideProps) {
  const triggerAutoTour = useCallback(() => {
    if (isMobileViewport()) return;
    if (typeof window === "undefined") return;
    const hasSeenTour = localStorage.getItem("dhandagrow_dashboard_tour_seen");
    if (!hasSeenTour) {
      // Allow DOM, charts, and animations to mount
      const timer = setTimeout(() => {
        startDashboardTour();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (autoStart) {
      triggerAutoTour();
    }
  }, [autoStart, triggerAutoTour]);

  return null;
}













// "use client";

// import { useEffect, useCallback } from "react";
// import { driver, DriveStep } from "driver.js";
// import "driver.js/dist/driver.css";

// export interface TourGuideProps {
//   autoStart?: boolean;
// }

// export const SIDEBAR_TOUR_STEPS: DriveStep[] = [
//   {
//     element: "#tour-sidebar",
//     popover: {
//       title: "🧭 Sidebar Navigation",
//       description:
//         "Welcome to your main navigation menu! From here, you can access every AI studio, marketing tool, social integration, and settings in DhandaGrow.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-dashboard",
//     popover: {
//       title: "📊 1. Dashboard",
//       description:
//         "Your business command center. Monitor real-time 7-day marketing analytics, quick creative studios, daily post recommendations, and AI growth insights.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-brand",
//     popover: {
//       title: "🎨 2. Brand Kit",
//       description:
//         "Configure your official company logo, brand color palette, fonts, slogans, and voice. Every reel, post, and website generated automatically aligns with this identity.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-content",
//     popover: {
//       title: "✨ 3. AI Content Generation",
//       description:
//         "Gemini AI copywriter. Generate high-converting Instagram captions, viral hooks, WhatsApp broadcast copies, product descriptions, and promotional slogans.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-image-reel",
//     popover: {
//       title: "🎬 4. Image and Reel Generation",
//       description:
//         "Your creative multimedia engine. Includes 3 tools:\n• Create Reel (9:16 vertical short videos with trending audio)\n• AI Post Maker (1-click festive posters & flyers)\n• AI Calendar (monthly automated campaign scheduler)",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-photoshoot",
//     popover: {
//       title: "📸 5. AI Photoshoot Studio",
//       description:
//         "Professional commercial studio without cameras:\n• AI Avatar: Photorealistic virtual Indian presenters & models\n• AI Product Photography: Studio-grade commercial product shots with 3D lighting",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-website-builder",
//     popover: {
//       title: "🌐 6. Website Builder",
//       description:
//         "Generate and launch responsive, SEO-ready business websites and landing pages in minutes. Includes lead capture forms, WhatsApp chat, and custom domain support.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-festivals",
//     popover: {
//       title: "🎉 7. Festival Engine",
//       description:
//         "Never miss a celebration! Access an exhaustive calendar of Indian national and regional festivals with ready-made festive greeting creatives tailored to your business.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-influencers",
//     popover: {
//       title: "👥 8. Influencers",
//       description:
//         "Discover and partner with verified local creators and influencers in your niche. Filter by followers, city, and engagement rates to drive authentic brand collaborations.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-content-library",
//     popover: {
//       title: "📚 9. Plan Content (Calendar)",
//       description:
//         "Your centralized media repository. Organize scheduled social posts, drafted reels, approved templates, and oversee your multi-week publishing pipeline.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-uni-ai",
//     popover: {
//       title: "🤖 10. UNI AI (Hinglish Advisor)",
//       description:
//         "Your 24/7 dedicated marketing consultant. Chat in natural Hinglish or English for instant growth hacks, festival offers, pricing strategies, and local marketing advice.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-social-platforms",
//     popover: {
//       title: "🔗 11. Social Platforms",
//       description:
//         "Multi-channel connectivity hub. Connect and automate publishing across Instagram (Reels & Posts), Facebook Pages, and LinkedIn corporate updates.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-analytics",
//     popover: {
//       title: "📈 12. Performance Analytics",
//       description:
//         "Visual reports on audience reach, follower growth, engagement rates, and your dynamic 0–100 Marketing Performance Score with Gemini AI improvement tips.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-billing",
//     popover: {
//       title: "💳 13. Billing & Plans",
//       description:
//         "Manage your growth tier (Starter, Growth, Scale), view payment transaction receipts, download GST invoices, and inspect real-time AI token usage.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-sidebar-credits",
//     popover: {
//       title: "⚡ 14. Live Credits & Plan Meter",
//       description:
//         "Displays your active subscription tier and real-time remaining AI generation tokens for quick reference.",
//       side: "right",
//       align: "end",
//     },
//   },
//   {
//     element: "#tour-nav-support",
//     popover: {
//       title: "🎧 15. Support",
//       description:
//         "Get instant priority support via WhatsApp, submit help tickets, or browse our knowledge base to solve queries fast.",
//       side: "right",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-nav-settings",
//     popover: {
//       title: "⚙️ 16. Settings",
//       description:
//         "Update profile details, business registration information, account security, passwords, and automated alert preferences.",
//       side: "right",
//       align: "start",
//     },
//   },
// ];

// export const DASHBOARD_TOUR_STEPS: DriveStep[] = [
//   // Tour starts with the sidebar elements
//   ...SIDEBAR_TOUR_STEPS,

//   // Seamlessly transitions to the main Dashboard elements
//   {
//     element: "#tour-header",
//     popover: {
//       title: "🏠 Main Dashboard Canvas",
//       description:
//         "Now let's explore your main workspace! Here is your personalized greeting and 7-day marketing snapshot summary.",
//       side: "bottom",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-billing-credits",
//     popover: {
//       title: "⚡ Quick Actions & Billing",
//       description:
//         "Quickly view your active subscription plan, check remaining credits, download verified GST billing reports, or relaunch this tour guide.",
//       side: "bottom",
//       align: "end",
//     },
//   },
//   {
//     element: "#tour-stats",
//     popover: {
//       title: "📊 Live Marketing Statistics",
//       description:
//         "Four live KPI cards tracking Posts Created, Reels Produced, Total AI Generations, and your overall Marketing Score (0-100).",
//       side: "bottom",
//       align: "center",
//     },
//   },
//   {
//     element: "#tour-quick-actions",
//     popover: {
//       title: "✨ 1-Click AI Creative Studios",
//       description:
//         "Launch high-impact creative engines in one click:\n• Create Post (promotional & festive creatives)\n• Create Reel (9:16 short video generator)\n• AI Avatar (Indian presenter photoshoot)",
//       side: "top",
//       align: "center",
//     },
//   },
//   {
//     element: "#tour-todays-marketing",
//     popover: {
//       title: "📅 Today's Marketing Suggestion",
//       description:
//         "AI-curated daily marketing post ready for today! Preview the suggested creative, caption, and hashtags, then schedule with one click.",
//       side: "top",
//       align: "center",
//     },
//   },
//   {
//     element: "#tour-recent-activity",
//     popover: {
//       title: "🕒 Recent Activity & Creations",
//       description:
//         "Quickly review and re-download recent posts, reels, and photoshoot results generated by you and your team.",
//       side: "top",
//       align: "start",
//     },
//   },
//   {
//     element: "#tour-ai-insights",
//     popover: {
//       title: "💡 AI Recommendations & Insights",
//       description:
//         "Personalized AI growth recommendations based on your recent activity to maximize audience engagement and sales conversion.",
//       side: "top",
//       align: "end",
//     },
//   },
// ];

// export function startSidebarTour() {
//   if (typeof window === "undefined") return;

//   const driverObj = driver({
//     showProgress: true,
//     animate: true,
//     allowClose: true,
//     smoothScroll: true,
//     skipMissingElement: true,
//     stagePadding: 6,
//     stageRadius: 14,
//     overlayColor: "rgba(5, 7, 18, 0.85)",
//     popoverClass: "dhandagrow-driver-popover",
//     nextBtnText: "Next →",
//     prevBtnText: "← Back",
//     doneBtnText: "Done 🎉",
//     progressText: "{{current}} of {{total}}",
//     steps: SIDEBAR_TOUR_STEPS,
//   });

//   driverObj.drive();
// }

// export function startDashboardTour() {
//   if (typeof window === "undefined") return;

//   const driverObj = driver({
//     showProgress: true,
//     animate: true,
//     allowClose: true,
//     smoothScroll: true,
//     skipMissingElement: true,
//     stagePadding: 8,
//     stageRadius: 16,
//     overlayColor: "rgba(5, 7, 18, 0.85)",
//     popoverClass: "dhandagrow-driver-popover",
//     nextBtnText: "Next →",
//     prevBtnText: "← Back",
//     doneBtnText: "Finish Tour 🎉",
//     progressText: "{{current}} of {{total}}",
//     onDestroyed: () => {
//       localStorage.setItem("dhandagrow_dashboard_tour_seen", "true");
//     },
//     steps: DASHBOARD_TOUR_STEPS,
//   });

//   driverObj.drive();
// }

// export function DashboardTourTrigger({ className }: { className?: string }) {
//   return (
//     <button
//       type="button"
//       onClick={() => startDashboardTour()}
//       className={
//         className ||
//         "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold shadow-sm transition-all cursor-pointer"
//       }
//       title="Start Dashboard Tour Guide"
//     >
//       <span className="text-sm">🎯</span>
//       <span>Tour Guide</span>
//     </button>
//   );
// }

// export function DashboardTour({ autoStart = false }: TourGuideProps) {
//   const triggerAutoTour = useCallback(() => {
//     if (typeof window === "undefined") return;
//     const hasSeenTour = localStorage.getItem("dhandagrow_dashboard_tour_seen");
//     if (!hasSeenTour) {
//       // Allow DOM, charts, and animations to mount
//       const timer = setTimeout(() => {
//         startDashboardTour();
//       }, 1200);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   useEffect(() => {
//     if (autoStart) {
//       triggerAutoTour();
//     }
//   }, [autoStart, triggerAutoTour]);

//   return null;
// }
