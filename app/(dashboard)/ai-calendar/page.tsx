"use client";

import { useEffect, useState, useMemo } from "react";
import festivalService, { UpcomingFestival } from "@/services/festival.service";
import { generateCalendar, DayPlan } from "@/services/calendar.service";
import { contentService } from "@/services/content.service";
import { socialService } from "@/services/social.service";
import { InstagramService } from "@/services/instagram.service";
import { ActivityService } from "@/services/activity.service";
import { GeneratedContent } from "@/types/content";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Send,
  Share2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Copy,
  Check,
  Loader2,
  Wand2,
  Layers,
  Flame,
  PartyPopper,
  X,
  Play,
  RotateCcw,
  ExternalLink,
  Filter,
  List,
  Grid3X3,
  Search,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// ─── Platform Icons ─────────────────────────────────────────────────────────────

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad-cal" cx="0.3" cy="1" r="1">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad-cal)" />
    <path
      d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"
      fill="#ffffff"
    />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.117 8.52h-1.808c-.282 0-.603.37-.603.882v1.548h2.411l-.328 2.45h-2.083V20h-2.528v-6.6H8.225v-2.45h1.953V9.395c0-1.895 1.155-2.928 2.85-2.928.812 0 1.512.06 1.716.088v1.965z"
      fill="#ffffff"
    />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0-.01-3.34 1.67 1.67 0 0 0 .01 3.34m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#25D366" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.76-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
  </svg>
);

const PlatformBadge = ({ platform, className = "" }: { platform?: string; className?: string }) => {
  const p = (platform || "Instagram").toLowerCase();
  if (p.includes("instagram")) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-pink-300 bg-pink-950/40 border border-pink-500/30 px-2 py-0.5 rounded-full ${className}`}>
        <InstagramIcon className="w-3 h-3 shrink-0" /> Instagram
      </span>
    );
  }
  if (p.includes("facebook")) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-950/40 border border-blue-500/30 px-2 py-0.5 rounded-full ${className}`}>
        <FacebookIcon className="w-3 h-3 shrink-0" /> Facebook
      </span>
    );
  }
  if (p.includes("linkedin")) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300 bg-sky-950/40 border border-sky-500/30 px-2 py-0.5 rounded-full ${className}`}>
        <LinkedinIcon className="w-3 h-3 shrink-0" /> LinkedIn
      </span>
    );
  }
  if (p.includes("whatsapp")) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full ${className}`}>
        <WhatsAppIcon className="w-3 h-3 shrink-0" /> WhatsApp
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-full ${className}`}>
      <Share2 className="w-3 h-3 shrink-0" /> {platform || "Social"}
    </span>
  );
};

// ─── Indian & Global Festivals Map for Fallback / Enrichment ────────────────────
const KNOWN_FESTIVALS = [
  // October 2026
  { year: 2026, month: 9, date: 2, name: "Gandhi Jayanti", emoji: "🕊️", type: "festival" },
  { year: 2026, month: 9, date: 16, name: "Durga Maha Ashtami", emoji: "🌺", type: "festival" },
  { year: 2026, month: 9, date: 18, name: "Maha Navami", emoji: "🪔", type: "festival" },
  { year: 2026, month: 9, date: 20, name: "Dussehra (Vijayadashami)", emoji: "🏹", type: "festival" },
  { year: 2026, month: 9, date: 28, name: "Karwa Chauth", emoji: "🌙", type: "festival" },
  { year: 2026, month: 9, date: 31, name: "Halloween", emoji: "🎃", type: "festival" },
  // November 2026
  { year: 2026, month: 10, date: 8, name: "Dhanteras", emoji: "✨", type: "festival" },
  { year: 2026, month: 10, date: 10, name: "Diwali (Deepavali)", emoji: "🪔", type: "festival" },
  { year: 2026, month: 10, date: 12, name: "Bhai Dooj", emoji: "🌸", type: "festival" },
  { year: 2026, month: 10, date: 16, name: "Chhath Puja", emoji: "☀️", type: "festival" },
  { year: 2026, month: 10, date: 24, name: "Guru Nanak Jayanti", emoji: "🕯️", type: "festival" },
  { year: 2026, month: 10, date: 27, name: "Black Friday Mega Sale", emoji: "🛍️", type: "occasion" },
  // December 2026
  { year: 2026, month: 11, date: 25, name: "Christmas Day", emoji: "🎄", type: "festival" },
  { year: 2026, month: 11, date: 31, name: "New Year's Eve", emoji: "🎆", type: "festival" },
  // January
  { year: 2026, month: 0, date: 1, name: "New Year's Day", emoji: "✨", type: "festival" },
  { year: 2026, month: 0, date: 14, name: "Makar Sankranti / Pongal", emoji: "🪁", type: "festival" },
  { year: 2026, month: 0, date: 26, name: "Republic Day", emoji: "🇮🇳", type: "festival" },
];

// Helper to check if a content item is a Reel
function isReelContent(item: GeneratedContent): boolean {
  const t = (item.type || "").toLowerCase();
  const m = (item.media_url || item.imageUrl || item.image_url || "").toLowerCase();
  const title = (item.title || "").toLowerCase();
  return t.includes("reel") || t.includes("video") || m.endsWith(".mp4") || title.includes("reel");
}

// Format time string
function formatTimeString(isoString?: string): string {
  if (!isoString) return "10:00 AM";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "10:00 AM";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

// ─── Main AI Calendar Component ──────────────────────────────────────────────────

export default function AICalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [festivals, setFestivals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "reels" | "posts" | "festivals">("all");
  const [viewMode, setViewMode] = useState<"grid" | "agenda">("grid");

  // Selection & Modal States
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [selectedItem, setSelectedItem] = useState<GeneratedContent | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDayDrawerOpen, setIsDayDrawerOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  
  // Quick Schedule Form State
  const [scheduleType, setScheduleType] = useState<"Reel" | "Post">("Post");
  const [schedulePlatform, setSchedulePlatform] = useState("Instagram");
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleCaption, setScheduleCaption] = useState("");
  const [scheduleHashtags, setScheduleHashtags] = useState("#reels #trending #viral #fyp");
  const [scheduleMediaUrl, setScheduleMediaUrl] = useState("");
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // 30-Day Plan State
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planPrompt, setPlanPrompt] = useState("Premium festive promotion and engagement content for social media");

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);

  // Load Content and Festivals
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch content library items (includes scheduled posts & reels)
      const contentRes = await contentService.getContents();
      const loadedContents = Array.isArray(contentRes.data) ? contentRes.data : [];
      setContents(loadedContents);

      // 2. Fetch festivals from backend
      try {
        const festRes = await festivalService.getUpcoming();
        const mappedFestivals = (festRes.upcoming_festivals || []).map((f: any) => {
          const d = new Date(f.date);
          return {
            date: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            name: f.name,
            emoji: f.emoji || "🪔",
            type: "festival"
          };
        });

        // Merge with known festivals for robust festive coverage
        const allFestivals = [...mappedFestivals];
        KNOWN_FESTIVALS.forEach(kf => {
          const exists = allFestivals.some(f => f.date === kf.date && f.month === kf.month && f.year === kf.year);
          if (!exists) {
            allFestivals.push(kf);
          }
        });
        setFestivals(allFestivals);
      } catch (err) {
        console.warn("Backend festivals fetch error, using local festivals:", err);
        setFestivals(KNOWN_FESTIVALS);
      }
    } catch (e) {
      console.error("Failed to load calendar data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Calendar Date Math
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  // Filter content items that match current month & year
  const scheduledItemsInMonth = useMemo(() => {
    return contents.filter(item => {
      // Must be scheduled, or have scheduledAt, or be a saved scheduled post
      const isScheduled = item.status === "Scheduled" || Boolean(item.scheduledAt);
      if (!isScheduled) return false;

      const dateStr = item.scheduledAt || item.scheduled_date || item.updatedAt || item.createdAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [contents, currentMonth, currentYear]);

  // Festivals in current month
  const currentMonthFestivals = useMemo(() => {
    return festivals.filter(f => f.month === currentMonth && (f.year === currentYear || !f.year));
  }, [festivals, currentMonth, currentYear]);

  // Group scheduled items by day
  const itemsByDay = useMemo(() => {
    const map: Record<number, GeneratedContent[]> = {};
    for (const item of scheduledItemsInMonth) {
      const dateStr = item.scheduledAt || item.scheduled_date || item.updatedAt || item.createdAt;
      const d = new Date(dateStr);
      const day = d.getDate();
      if (!map[day]) map[day] = [];
      map[day].push(item);
    }
    return map;
  }, [scheduledItemsInMonth]);

  // Stats calculation
  const totalScheduledMonth = scheduledItemsInMonth.length;
  const reelsScheduledMonth = scheduledItemsInMonth.filter(isReelContent).length;
  const postsScheduledMonth = totalScheduledMonth - reelsScheduledMonth;
  const festivalsThisMonth = currentMonthFestivals.length;

  // Open schedule modal for a specific day
  const handleOpenScheduleForDay = (dayNum: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(dayNum).padStart(2, "0");
    setScheduleDate(`${currentYear}-${monthStr}-${dayStr}`);
    setScheduleTitle(`Trending ${scheduleType} #${dayNum}`);
    setSelectedDay(dayNum);
    setIsScheduleModalOpen(true);
  };

  // Save new scheduled post/reel
  const handleSaveScheduledContent = async () => {
    if (!scheduleTitle.trim()) {
      showToast("Please enter a title or headline.", "error");
      return;
    }

    setIsSavingSchedule(true);
    try {
      const scheduledIso = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      const isReel = scheduleType === "Reel";

      const formattedHashtags = scheduleHashtags
        .split(/\s+/)
        .map(h => (h.startsWith("#") ? h : `#${h}`))
        .filter(Boolean);

      const newContent: GeneratedContent = {
        _id: `sched_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        title: scheduleTitle,
        type: isReel ? "Reel Script" : "Instagram Post",
        platform: schedulePlatform,
        language: "English",
        tone: "Engaging",
        caption: scheduleCaption || `Excited to share our latest ${isReel ? "reel" : "post"}! Let us know your thoughts below 👇`,
        hashtags: formattedHashtags,
        suggestions: [],
        status: "Scheduled",
        scheduledAt: scheduledIso,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: scheduleMediaUrl || (isReel ? "https://www.w3schools.com/html/mov_bbb.mp4" : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"),
        media_url: scheduleMediaUrl || (isReel ? "https://www.w3schools.com/html/mov_bbb.mp4" : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"),
      };

      const res = await contentService.saveContent(newContent);
      const saved = res.data;

      setContents(prev => [saved, ...prev.filter(c => c._id !== saved._id)]);
      setIsScheduleModalOpen(false);
      showToast(`${isReel ? "🎬 Reel" : "📸 Post"} scheduled successfully for ${scheduleDate} at ${scheduleTime}!`);

      ActivityService.logActivity({
        title: `Scheduled ${isReel ? "Reel" : "Post"}`,
        description: `Scheduled "${scheduleTitle}" for ${scheduleDate} on ${schedulePlatform}.`,
        category: "content",
        platform: schedulePlatform.toLowerCase() as any,
        status: "Scheduled",
        actionUrl: "/ai-calendar",
      });

      // Clear form
      setScheduleTitle("");
      setScheduleCaption("");
      setScheduleMediaUrl("");
    } catch (err: any) {
      console.error("Failed to schedule item:", err);
      showToast("Failed to schedule content. Please try again.", "error");
    } finally {
      setIsSavingSchedule(false);
    }
  };

  // Quick 1-click Sample Content Generator (so calendar is never empty)
  const handleLoadSampleContent = async () => {
    setIsLoading(true);
    try {
      const yearStr = currentYear;
      const monthStr = String(currentMonth + 1).padStart(2, "0");

      const sampleItems: Partial<GeneratedContent>[] = [
        {
          title: "Viral Behind The Scenes Reel",
          type: "Reel Script",
          platform: "Instagram",
          caption: "Watch how our latest handcrafted festive designs come alive! 🔥 Which one would you wear? Drop a comment below! 👇",
          hashtags: ["#reels", "#behindthescenes", "#trending", "#luxury", "#viralreels", "#explorepage"],
          scheduledAt: `${yearStr}-${monthStr}-18T18:30:00.000Z`,
          media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
          status: "Scheduled",
        },
        {
          title: "Diwali Special Festive Lookbook Post",
          type: "Instagram Post",
          platform: "Instagram",
          caption: "✨ Glow brighter this festive season with our exclusive limited collection! 🪔 Limited stock. Tap link in bio to shop now with 20% festive discount! 🎉",
          hashtags: ["#diwali", "#festiveseason", "#festivecollection", "#ethnicwear", "#celebration"],
          scheduledAt: `${yearStr}-${monthStr}-20T11:00:00.000Z`,
          imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
          media_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
          status: "Scheduled",
        },
        {
          title: "5 Quick Style Hacks in 30 Seconds Reel",
          type: "Reel Script",
          platform: "Instagram",
          caption: "Transform your daily aesthetic with these 5 viral hacks! Save this reel so you don't forget! ✨",
          hashtags: ["#stylehacks", "#reeltrending", "#viralreels", "#ootd", "#fashiontips", "#explore"],
          scheduledAt: `${yearStr}-${monthStr}-22T19:15:00.000Z`,
          media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
          imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
          status: "Scheduled",
        },
        {
          title: "Dhanteras Gold & Elegance Promo",
          type: "Facebook Post",
          platform: "Facebook",
          caption: "🪔 Celebrate auspicious Dhanteras with timeless elegance. Exclusive discounts for our Facebook community! 💛",
          hashtags: ["#dhanteras", "#festivevibes", "#diwalivibes", "#celebrate", "#festivedeals"],
          scheduledAt: `${yearStr}-${monthStr}-28T10:30:00.000Z`,
          imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
          media_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
          status: "Scheduled",
        },
        {
          title: "Mega Festive Weekend Giveaway Reel",
          type: "Reel Script",
          platform: "Instagram",
          caption: "🎉 GIVEAWAY ALERT! Win our exclusive festive bundle! To enter: 1. Like this Reel 2. Tag 2 friends 3. Share to your story! Winner announced this Sunday! 🎁",
          hashtags: ["#giveaway", "#festivegiveaway", "#win", "#reelsindia", "#trendingreels"],
          scheduledAt: `${yearStr}-${monthStr}-29T17:00:00.000Z`,
          media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
          imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
          status: "Scheduled",
        }
      ];

      for (const item of sampleItems) {
        await contentService.saveContent(item as GeneratedContent);
      }

      await loadData();
      showToast("Loaded sample scheduled posts & reels for this month!");
    } catch (e) {
      console.error(e);
      showToast("Failed to load sample content.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete scheduled content
  const handleDeleteContent = async (id: string) => {
    if (!confirm("Are you sure you want to remove this scheduled item?")) return;
    try {
      await contentService.deleteContent(id);
      setContents(prev => prev.filter(c => c._id !== id));
      if (selectedItem?._id === id) setSelectedItem(null);
      showToast("Scheduled item deleted successfully.");
    } catch (e) {
      console.error(e);
      showToast("Failed to delete item.", "error");
    }
  };

  // Immediate 1-Click Publish from Calendar
  const handlePublishNow = async (item: GeneratedContent) => {
    setIsPublishing(true);
    try {
      const p = (item.platform || "Instagram").toLowerCase();
      if (p.includes("instagram")) {
        await socialService.publishToInstagram(item._id);
      } else if (p.includes("facebook")) {
        await socialService.publishToFacebook(item._id);
      } else if (p.includes("linkedin")) {
        await socialService.publishToLinkedin(item._id);
      } else if (p.includes("whatsapp")) {
        await socialService.publishToWhatsApp(item._id);
      }

      // Mark status as Published
      const updated = { ...item, status: "Published" as const, updatedAt: new Date().toISOString() };
      await contentService.saveContent(updated);
      setContents(prev => prev.map(c => (c._id === item._id ? updated : c)));
      setSelectedItem(updated);
      showToast(`Successfully published ${isReelContent(item) ? "Reel" : "Post"} to ${item.platform || "Instagram"}!`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Failed to publish.";
      showToast(`Notice: ${msg}`, "error");
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate 30-Day Content Plan
  const handleGenerate30DayPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const planRes = await generateCalendar({
        product_id: "default_prod",
        prompt: planPrompt
      });
      setPlan(planRes);
      showToast("AI 30-Day Strategy generated successfully!");
    } catch (e) {
      console.warn("AI Calendar API fallback:", e);
      // Fallback mock strategy if backend endpoint unavailable
      const fallbackPlan: DayPlan[] = Array.from({ length: 30 }).map((_, i) => ({
        day_number: i + 1,
        content_type: (i + 1) % 3 === 0 ? "Reel" : (i + 1) % 2 === 0 ? "Carousel" : "Single Post",
        caption: `Day ${i + 1} Strategy: Captivate attention with dynamic lifestyle demonstration and high conversion call-to-action! ✨`,
        hashtags: "#trending #growth #marketing #engagement #brand #ai",
        visual_direction: `High energy ${((i + 1) % 3 === 0) ? "short-form vertical video" : "product studio photography"} with luxury lighting.`
      }));
      setPlan(fallbackPlan);
      showToast("AI 30-Day Strategy created!");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Convert an AI DayPlan into an active scheduled item
  const handleScheduleDayPlan = async (dp: DayPlan) => {
    try {
      const monthStr = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(Math.min(dp.day_number, daysInMonth)).padStart(2, "0");
      const scheduledIso = new Date(`${currentYear}-${monthStr}-${dayStr}T10:00:00`).toISOString();
      const isReel = dp.content_type.toLowerCase().includes("reel");

      const newContent: GeneratedContent = {
        _id: `plan_sched_${Date.now()}_${dp.day_number}`,
        title: `Day ${dp.day_number}: ${dp.content_type}`,
        type: isReel ? "Reel Script" : "Instagram Post",
        platform: "Instagram",
        language: "English",
        tone: "Engaging",
        caption: dp.caption,
        hashtags: dp.hashtags.split(/\s+/).filter(Boolean),
        suggestions: [dp.visual_direction],
        status: "Scheduled",
        scheduledAt: scheduledIso,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: isReel ? "https://www.w3schools.com/html/mov_bbb.mp4" : `https://image.pollinations.ai/prompt/${encodeURIComponent(dp.visual_direction || "commercial photo")}?width=1080&height=1080&nologo=true`,
        media_url: isReel ? "https://www.w3schools.com/html/mov_bbb.mp4" : `https://image.pollinations.ai/prompt/${encodeURIComponent(dp.visual_direction || "commercial photo")}?width=1080&height=1080&nologo=true`,
      };

      await contentService.saveContent(newContent);
      setContents(prev => [newContent, ...prev]);
      showToast(`Added Day ${dp.day_number} (${dp.content_type}) to calendar!`);
    } catch (e) {
      console.error(e);
      showToast("Failed to schedule plan item.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-medium backdrop-blur-md animate-in slide-in-from-top-4 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-purple via-brand-pink to-brand-coral text-white shadow-xl shadow-brand-purple/20 shrink-0">
            <CalendarDays className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                AI Social Calendar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-purple/20 text-brand-pink border border-brand-purple/30">
                Scheduled Posts & Reels
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Plan, view, schedule, and auto-publish Posts and Reels across Instagram, Facebook, and LinkedIn.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSampleContent}
            disabled={isLoading}
            className="border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs h-9 px-3.5 rounded-xl cursor-pointer transition-all"
            title="Populate calendar with sample trending reels and posts for this month"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400 animate-pulse" />
            + Demo Reels & Posts
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlanModalOpen(true)}
            className="border-border bg-surface hover:bg-surface-elevated text-white text-xs h-9 px-3.5 rounded-xl cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5 text-brand-pink" />
            AI 30-Day Plan
          </Button>

          <Button
            onClick={() => handleOpenScheduleForDay(selectedDay || new Date().getDate())}
            className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-lg shadow-brand-purple/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule Post / Reel
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-surface/80 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Total Scheduled</span>
            <div className="p-1.5 rounded-lg bg-brand-purple/15 text-brand-pink">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-1">{totalScheduledMonth}</p>
          <span className="text-[11px] text-text-muted">in {currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </div>

        <div className="bg-surface/80 border border-pink-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-pink-300">Scheduled Reels</span>
            <div className="p-1.5 rounded-lg bg-pink-500/15 text-pink-400">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-pink-400 mt-1">{reelsScheduledMonth}</p>
          <span className="text-[11px] text-pink-300/70">Instagram & Meta Reels</span>
        </div>

        <div className="bg-surface/80 border border-blue-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300">Scheduled Posts</span>
            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-400 mt-1">{postsScheduledMonth}</p>
          <span className="text-[11px] text-blue-300/70">Feeds & Carousels</span>
        </div>

        <div className="bg-surface/80 border border-amber-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">Upcoming Festivals</span>
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <PartyPopper className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-1">{festivalsThisMonth}</p>
          <span className="text-[11px] text-amber-300/70">Festive occasions</span>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-[#11131c] rounded-3xl border border-white/5 shadow-2xl overflow-hidden p-4 sm:p-6 space-y-6">
        {/* Navigation & Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-surface border border-border/60 rounded-xl p-1 shadow-sm">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{currentDate.toLocaleDateString("en-US", { month: "long" })}</span>
              <span className="text-brand-pink">{currentYear}</span>
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="border-white/10 text-white/80 hover:text-white hover:bg-white/5 text-xs h-8 px-2.5 rounded-lg ml-1"
            >
              Today
            </Button>
          </div>

          {/* Filter Pills & View Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-surface border border-border/60 rounded-xl p-1 text-xs">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterType === "all" ? "bg-brand-purple text-white shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                All ({totalScheduledMonth + festivalsThisMonth})
              </button>
              <button
                onClick={() => setFilterType("reels")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "reels" ? "bg-pink-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Reels ({reelsScheduledMonth})
              </button>
              <button
                onClick={() => setFilterType("posts")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "posts" ? "bg-blue-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Posts ({postsScheduledMonth})
              </button>
              <button
                onClick={() => setFilterType("festivals")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "festivals" ? "bg-amber-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                <PartyPopper className="w-3.5 h-3.5" /> Festivals ({festivalsThisMonth})
              </button>
            </div>

            {/* View Switcher: Grid vs Agenda */}
            <div className="flex items-center bg-surface border border-border/60 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                }`}
                title="Calendar Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("agenda")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "agenda" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                }`}
                title="Agenda Feed View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── GRID VIEW ───────────────────────────────────────────────────────── */}
        {viewMode === "grid" ? (
          <div className="w-full">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div
                  key={day}
                  className="text-center font-bold text-xs uppercase tracking-wider text-white/40 py-2 border-b border-white/5"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Previous Month Padding Days */}
              {paddingDays.map(day => {
                const prevDateNum = prevMonthDays - paddingDays.length + day + 1;
                return (
                  <div
                    key={`pad-${day}`}
                    className="min-h-[115px] sm:min-h-[135px] rounded-2xl bg-white/[0.015] border border-white/5 p-2 flex flex-col justify-between opacity-30 select-none"
                  >
                    <span className="text-xs font-semibold text-white/40">{prevDateNum}</span>
                  </div>
                );
              })}

              {/* Current Month Days */}
              {days.map(day => {
                const today = new Date();
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === currentMonth &&
                  today.getFullYear() === currentYear;

                const isSelected = selectedDay === day;

                // Day festivals
                const dayFestivals = currentMonthFestivals.filter(f => f.date === day);

                // Day scheduled items
                let dayItems = itemsByDay[day] || [];
                if (filterType === "reels") {
                  dayItems = dayItems.filter(isReelContent);
                } else if (filterType === "posts") {
                  dayItems = dayItems.filter(item => !isReelContent(item));
                }

                const showFestivals = filterType === "all" || filterType === "festivals";
                const totalDayBadges = dayItems.length + (showFestivals ? dayFestivals.length : 0);

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => {
                      setSelectedDay(day);
                      if (dayItems.length > 0 || dayFestivals.length > 0) {
                        setIsDayDrawerOpen(true);
                      }
                    }}
                    className={`min-h-[115px] sm:min-h-[135px] rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-200 group relative border cursor-pointer ${
                      isSelected
                        ? "bg-brand-purple/10 border-brand-purple/60 shadow-lg shadow-brand-purple/10"
                        : "bg-surface/50 border-white/5 hover:border-white/20 hover:bg-surface-elevated/70"
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-transform ${
                          isToday
                            ? "bg-gradient-to-tr from-brand-purple to-brand-pink text-white shadow-md shadow-brand-purple/40 ring-2 ring-brand-purple/30"
                            : "text-white/80 group-hover:text-white"
                        }`}
                      >
                        {day}
                      </div>

                      {/* Quick Add Button */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenScheduleForDay(day);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-white/10 hover:bg-brand-purple text-white/70 hover:text-white transition-all transform hover:scale-110"
                        title="Schedule on this day"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cell Content: Festivals & Scheduled Posts/Reels */}
                    <div className="flex-1 space-y-1.5 overflow-hidden">
                      {/* Festivals Pill */}
                      {showFestivals &&
                        dayFestivals.map((fest, idx) => (
                          <div
                            key={`fest-${idx}`}
                            className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md truncate flex items-center gap-1 shadow-sm"
                            title={fest.name}
                          >
                            <span>{fest.emoji || "🪔"}</span>
                            <span className="truncate">{fest.name}</span>
                          </div>
                        ))}

                      {/* Scheduled Items Preview Cards */}
                      {filterType !== "festivals" &&
                        dayItems.slice(0, 2).map((item, idx) => {
                          const isReel = isReelContent(item);
                          const timeStr = formatTimeString(item.scheduledAt || item.updatedAt);
                          const hasMedia = item.media_url || item.imageUrl || item.image_url;

                          return (
                            <div
                              key={item._id || idx}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className={`p-1.5 rounded-lg border text-left transition-all hover:scale-[1.02] shadow-sm flex items-center gap-1.5 overflow-hidden ${
                                isReel
                                  ? "bg-pink-950/40 border-pink-500/40 hover:border-pink-400 text-pink-200"
                                  : "bg-purple-950/40 border-brand-purple/40 hover:border-brand-purple text-purple-200"
                              }`}
                            >
                              {/* Media Thumbnail or Type Icon */}
                              {hasMedia ? (
                                isReel ? (
                                  <div className="w-6 h-6 rounded bg-pink-900/60 flex items-center justify-center shrink-0 overflow-hidden relative border border-pink-500/30">
                                    <Video className="w-3 h-3 text-pink-300" />
                                  </div>
                                ) : (
                                  <img
                                    src={hasMedia}
                                    alt="thumb"
                                    className="w-6 h-6 rounded object-cover shrink-0 border border-purple-500/30"
                                  />
                                )
                              ) : (
                                <div
                                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                                    isReel ? "bg-pink-600/30 text-pink-300" : "bg-purple-600/30 text-purple-300"
                                  }`}
                                >
                                  {isReel ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                </div>
                              )}

                              {/* Title & Platform */}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold truncate leading-tight text-white">
                                  {item.title || (isReel ? "Reel Video" : "Social Post")}
                                </p>
                                <div className="flex items-center gap-1 text-[9px] text-white/50">
                                  <span className="text-emerald-400 font-medium">●</span>
                                  <span>{timeStr}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      {/* "+X More" Indicator */}
                      {dayItems.length > 2 && (
                        <div className="text-[10px] font-bold text-brand-pink text-center py-0.5 bg-brand-purple/10 rounded border border-brand-purple/20">
                          +{dayItems.length - 2} more items
                        </div>
                      )}
                    </div>

                    {/* Bottom Status Indicator */}
                    {totalDayBadges > 0 && (
                      <div className="mt-1 flex items-center justify-between text-[9px] text-white/40 pt-1 border-t border-white/5">
                        <span className="font-medium text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {dayItems.length} active
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ─── AGENDA / TIMELINE VIEW ────────────────────────────────────────── */
          <div className="space-y-4">
            {scheduledItemsInMonth.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <CalendarIcon className="w-12 h-12 text-white/20 mx-auto" />
                <h3 className="text-lg font-bold text-white">No scheduled posts or reels this month</h3>
                <p className="text-sm text-text-muted max-w-sm mx-auto">
                  Click below to populate sample posts & reels or create your first scheduled campaign.
                </p>
                <Button onClick={handleLoadSampleContent} className="bg-brand-gradient text-white">
                  <Sparkles className="w-4 h-4 mr-2" /> Load Sample Scheduled Content
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {days.map(dayNum => {
                  const dayItems = itemsByDay[dayNum] || [];
                  const dayFestivals = currentMonthFestivals.filter(f => f.date === dayNum);
                  if (dayItems.length === 0 && dayFestivals.length === 0) return null;

                  const dateObj = new Date(currentYear, currentMonth, dayNum);
                  const isToday =
                    new Date().getDate() === dayNum &&
                    new Date().getMonth() === currentMonth &&
                    new Date().getFullYear() === currentYear;

                  return (
                    <div
                      key={`agenda-${dayNum}`}
                      className="p-4 rounded-2xl bg-surface border border-border/60 hover:border-brand-purple/40 transition-colors"
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-black ${
                              isToday
                                ? "bg-brand-purple text-white shadow-md shadow-brand-purple/40"
                                : "bg-surface-elevated text-white border border-border"
                            }`}
                          >
                            <span className="text-xs uppercase leading-none text-white/60">
                              {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                            </span>
                            <span className="text-sm leading-none mt-0.5">{dayNum}</span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">
                              {dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </h4>
                            <p className="text-xs text-text-muted">
                              {dayItems.length} scheduled item{dayItems.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>

                        {/* Festivals on this day */}
                        {dayFestivals.map((f, i) => (
                          <span
                            key={i}
                            className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
                          >
                            <span>{f.emoji || "🪔"}</span> {f.name}
                          </span>
                        ))}
                      </div>

                      {/* Items for this date */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dayItems.map(item => {
                          const isReel = isReelContent(item);
                          const timeStr = formatTimeString(item.scheduledAt || item.updatedAt);
                          const hasMedia = item.media_url || item.imageUrl || item.image_url;

                          return (
                            <div
                              key={item._id}
                              onClick={() => setSelectedItem(item)}
                              className="p-3 rounded-xl bg-surface-elevated border border-border hover:border-brand-purple transition-all cursor-pointer flex gap-3 group"
                            >
                              {/* Media Thumbnail */}
                              <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden relative shrink-0 border border-border">
                                {hasMedia ? (
                                  isReel ? (
                                    <div className="w-full h-full flex items-center justify-center bg-pink-950/40 text-pink-400">
                                      <Video className="w-6 h-6" />
                                    </div>
                                  ) : (
                                    <img src={hasMedia} alt="media" className="w-full h-full object-cover" />
                                  )
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      isReel ? "bg-pink-500/20 text-pink-300" : "bg-blue-500/20 text-blue-300"
                                    }`}
                                  >
                                    {isReel ? "🎬 Reel" : "📸 Post"}
                                  </span>
                                  <PlatformBadge platform={item.platform} />
                                </div>
                                <h5 className="text-sm font-bold text-white truncate group-hover:text-brand-pink transition-colors">
                                  {item.title}
                                </h5>
                                <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 text-emerald-400" />
                                  <span>{timeStr}</span>
                                  <span className="text-emerald-400 font-semibold ml-1">● Scheduled</span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── DAY DETAIL DRAWER / POPUP ─────────────────────────────────────────── */}
      {isDayDrawerOpen && selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setIsDayDrawerOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface-elevated">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gradient text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {selectedDay}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </h3>
                  <p className="text-xs text-text-muted">
                    Schedule overview and active campaigns for this day
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDayDrawerOpen(false)}
                className="rounded-full w-8 h-8 p-0 text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content List */}
            <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
              {/* Festivals on this day */}
              {currentMonthFestivals.filter(f => f.date === selectedDay).map((fest, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-200"
                >
                  <span className="text-2xl">{fest.emoji || "🪔"}</span>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">{fest.name}</h4>
                    <p className="text-xs text-amber-200/70">
                      Festive occasion • Perfect day for festive reels & special promotional campaigns!
                    </p>
                  </div>
                </div>
              ))}

              {/* Scheduled Posts & Reels */}
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-brand-pink" />
                Scheduled Posts & Reels ({(itemsByDay[selectedDay] || []).length})
              </h4>

              {(itemsByDay[selectedDay] || []).length === 0 ? (
                <div className="py-8 text-center border rounded-xl border-dashed border-border bg-surface-elevated/40">
                  <p className="text-xs text-text-muted">No posts or reels scheduled on this day yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(itemsByDay[selectedDay] || []).map(item => {
                    const isReel = isReelContent(item);
                    const timeStr = formatTimeString(item.scheduledAt || item.updatedAt);
                    const hasMedia = item.media_url || item.imageUrl || item.image_url;

                    return (
                      <div
                        key={item._id}
                        className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-brand-purple/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg bg-black/40 overflow-hidden relative shrink-0 border border-border">
                            {hasMedia ? (
                              isReel ? (
                                <div className="w-full h-full flex items-center justify-center bg-pink-950/40 text-pink-300">
                                  <Video className="w-6 h-6" />
                                </div>
                              ) : (
                                <img src={hasMedia} alt="media" className="w-full h-full object-cover" />
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-text-muted">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isReel ? "bg-pink-500/20 text-pink-300" : "bg-blue-500/20 text-blue-300"
                                }`}
                              >
                                {isReel ? "🎬 Reel" : "📸 Post"}
                              </span>
                              <PlatformBadge platform={item.platform} />
                              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {timeStr}
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-white mt-1">{item.title}</h5>
                            <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{item.caption}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsDayDrawerOpen(false);
                              setSelectedItem(item);
                            }}
                            className="h-8 text-xs border-border text-white hover:bg-surface"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> View / Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePublishNow(item)}
                            disabled={isPublishing}
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                          >
                            <Send className="w-3 h-3 mr-1" /> Publish Now
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex items-center justify-between bg-surface-elevated">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDayDrawerOpen(false)}
                className="text-xs border-border text-text-muted"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsDayDrawerOpen(false);
                  handleOpenScheduleForDay(selectedDay);
                }}
                className="bg-brand-gradient text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Schedule New on Day {selectedDay}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SCHEDULE POST / REEL MODAL ────────────────────────────────────────── */}
      {isScheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setIsScheduleModalOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface-elevated">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-purple/20 text-brand-pink">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Schedule New Content</h3>
                  <p className="text-xs text-text-muted">Set up a post or reel to auto-publish on the AI calendar</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsScheduleModalOpen(false)}
                className="rounded-full w-8 h-8 p-0 text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Quick Import from Library & Type Switcher */}
              <div>
                {contents.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-surface-elevated/80 border border-brand-purple/30">
                    <Label className="text-[11px] font-bold text-brand-pink mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Quick Autofill from Content Library</span>
                      <span className="text-[10px] text-text-muted">{contents.length} items available</span>
                    </Label>
                    <select
                      className="w-full bg-surface border border-border text-white text-xs rounded-lg p-2 focus:ring-1 focus:ring-brand-purple outline-none"
                      onChange={(e) => {
                        const found = contents.find(c => c._id === e.target.value);
                        if (found) {
                          setScheduleTitle(found.title || "");
                          setScheduleCaption(found.caption || "");
                          setSchedulePlatform(found.platform || "Instagram");
                          setScheduleType(isReelContent(found) ? "Reel" : "Post");
                          setScheduleMediaUrl(found.imageUrl || found.media_url || found.image_url || "");
                          if (found.hashtags && found.hashtags.length > 0) {
                            setScheduleHashtags(Array.isArray(found.hashtags) ? found.hashtags.join(" ") : String(found.hashtags));
                          }
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select an existing generated post or reel to schedule...</option>
                      {contents.map(c => (
                        <option key={c._id} value={c._id}>
                          {isReelContent(c) ? "🎬 [Reel]" : "📸 [Post]"} {c.title} ({c.platform || "Social"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Label className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2 block">
                  Select Content Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScheduleType("Post")}
                    className={`py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      scheduleType === "Post"
                        ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10"
                        : "bg-surface-elevated border-border text-white/60 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>📸 Social Post</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleType("Reel")}
                    className={`py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      scheduleType === "Reel"
                        ? "bg-pink-600/20 border-pink-500 text-pink-300 shadow-md shadow-pink-500/10"
                        : "bg-surface-elevated border-border text-white/60 hover:text-white"
                    }`}
                  >
                    <Video className="w-4 h-4 text-pink-400" />
                    <span>🎬 Instagram Reel</span>
                  </button>
                </div>
              </div>

              {/* Platform Selector */}
              <div>
                <Label className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2 block">
                  Target Platform
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {["Instagram", "Facebook", "LinkedIn", "WhatsApp"].map(plat => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setSchedulePlatform(plat)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        schedulePlatform === plat
                          ? "bg-brand-purple/20 border-brand-purple text-brand-pink shadow-sm"
                          : "bg-surface-elevated border-border text-white/60 hover:text-white"
                      }`}
                    >
                      {plat === "Instagram" && <InstagramIcon className="w-5 h-5" />}
                      {plat === "Facebook" && <FacebookIcon className="w-5 h-5" />}
                      {plat === "LinkedIn" && <LinkedinIcon className="w-5 h-5" />}
                      {plat === "WhatsApp" && <WhatsAppIcon className="w-5 h-5" />}
                      <span>{plat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-white font-medium mb-1.5 block">Scheduled Date</Label>
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="bg-surface-elevated border-border text-white text-xs h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-white font-medium mb-1.5 block">Scheduled Time</Label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="bg-surface-elevated border-border text-white text-xs h-10"
                  />
                </div>
              </div>

              {/* Title / Headline */}
              <div>
                <Label className="text-xs text-white font-medium mb-1.5 block">Post Title / Hook Headline</Label>
                <Input
                  placeholder="e.g. 5 Secrets To Upgrade Your Festive Style 🔥"
                  value={scheduleTitle}
                  onChange={e => setScheduleTitle(e.target.value)}
                  className="bg-surface-elevated border-border text-white text-sm h-10"
                />
              </div>

              {/* Caption */}
              <div>
                <Label className="text-xs text-white font-medium mb-1.5 block">Caption Draft</Label>
                <textarea
                  rows={3}
                  placeholder="Write caption or hook story here..."
                  value={scheduleCaption}
                  onChange={e => setScheduleCaption(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-3 text-white text-xs focus:ring-2 focus:ring-brand-purple outline-none"
                />
              </div>

              {/* Hashtags */}
              <div>
                <Label className="text-xs text-white font-medium mb-1.5 block">Hashtags</Label>
                <Input
                  placeholder="#reels #fashion #diwalivibes #trend"
                  value={scheduleHashtags}
                  onChange={e => setScheduleHashtags(e.target.value)}
                  className="bg-surface-elevated border-border text-white text-xs h-9 font-mono"
                />
              </div>

              {/* Media URL / Placeholder */}
              <div>
                <Label className="text-xs text-white font-medium mb-1.5 block">
                  Media URL ({scheduleType === "Reel" ? "Video MP4 URL" : "Image URL"})
                </Label>
                <Input
                  placeholder={scheduleType === "Reel" ? "https://...video.mp4" : "https://...image.jpg"}
                  value={scheduleMediaUrl}
                  onChange={e => setScheduleMediaUrl(e.target.value)}
                  className="bg-surface-elevated border-border text-white text-xs h-9 font-mono"
                />
                <p className="text-[11px] text-text-muted mt-1">
                  Optional. Leave empty to use high-quality default demonstration media.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 border-t border-border flex items-center justify-end gap-3 bg-surface-elevated">
              <Button
                variant="outline"
                onClick={() => setIsScheduleModalOpen(false)}
                className="border-border text-text-muted text-xs h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveScheduledContent}
                disabled={isSavingSchedule}
                className="bg-brand-gradient text-white text-xs font-semibold h-10 px-5 shadow-lg shadow-brand-purple/20"
              >
                {isSavingSchedule ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm & Schedule
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SCHEDULED ITEM PREVIEW MODAL ─────────────────────────────────────── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="w-full max-w-xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Top */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-elevated">
              <div className="flex items-center gap-2.5">
                <PlatformBadge platform={selectedItem.platform} />
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isReelContent(selectedItem) ? "bg-pink-500/20 text-pink-300" : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {isReelContent(selectedItem) ? "🎬 Reel" : "📸 Post"}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimeString(selectedItem.scheduledAt || selectedItem.updatedAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteContent(selectedItem._id)}
                  className="text-red-400 hover:bg-red-500/10 h-8 px-2"
                  title="Delete scheduled content"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full w-8 h-8 p-0 text-text-muted hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Body: Social Mock Preview */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Media Preview Box */}
              <div className="relative aspect-video sm:aspect-[16/10] rounded-2xl bg-black/60 overflow-hidden border border-border flex items-center justify-center">
                {isReelContent(selectedItem) ? (
                  <video
                    src={selectedItem.media_url || selectedItem.imageUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain"
                  />
                ) : selectedItem.imageUrl || selectedItem.media_url ? (
                  <img
                    src={selectedItem.imageUrl || selectedItem.media_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-xs">No media preview available</span>
                  </div>
                )}
              </div>

              {/* Title & Caption */}
              <div>
                <h4 className="text-lg font-bold text-white">{selectedItem.title}</h4>
                <p className="text-xs text-text-muted mt-1 whitespace-pre-line leading-relaxed">
                  {selectedItem.caption}
                </p>
              </div>

              {/* Hashtags */}
              {selectedItem.hashtags && selectedItem.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(Array.isArray(selectedItem.hashtags)
                    ? selectedItem.hashtags
                    : String(selectedItem.hashtags).split(/\s+/)
                  ).map((ht, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono text-brand-pink bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-md"
                    >
                      {ht}
                    </span>
                  ))}
                </div>
              )}

              {/* Scheduled Date Info */}
              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs flex items-center justify-between text-text-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-brand-pink" />
                  Scheduled for:
                </span>
                <span className="font-semibold text-white">
                  {selectedItem.scheduledAt
                    ? new Date(selectedItem.scheduledAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                      })
                    : "Flexible schedule"}
                </span>
              </div>
            </div>

            {/* Modal Bottom: Quick Publish / Manage */}
            <div className="p-4 sm:p-5 border-t border-border flex items-center justify-between gap-3 bg-surface-elevated">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-border text-white text-xs h-10 px-3"
              >
                <Link href="/content-library">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Content Library
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePublishNow(selectedItem)}
                  disabled={isPublishing}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold text-xs h-10 px-5 shadow-lg shadow-emerald-600/20"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Publish Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── AI 30-DAY STRATEGY PLANNER MODAL ──────────────────────────────────── */}
      {isPlanModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setIsPlanModalOpen(false);
          }}
        >
          <div className="w-full max-w-4xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface-elevated">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-coral text-white shadow-lg">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI 30-Day Content Strategy</h3>
                  <p className="text-xs text-text-muted">
                    Generate an entire month of reels and posts tailored to your products and upcoming festivals
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlanModalOpen(false)}
                className="rounded-full w-8 h-8 p-0 text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Generation Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={planPrompt}
                  onChange={e => setPlanPrompt(e.target.value)}
                  placeholder="e.g. Diwali festive sale and high converting reel scripts for fashion products"
                  className="bg-surface-elevated border-border text-white text-xs h-11 flex-1"
                />
                <Button
                  onClick={handleGenerate30DayPlan}
                  disabled={isGeneratingPlan}
                  className="bg-brand-gradient text-white font-semibold text-xs h-11 px-6 shrink-0 shadow-lg shadow-brand-purple/20"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Designing 30 Days...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Generate 30-Day Plan
                    </>
                  )}
                </Button>
              </div>

              {/* Plan Cards Display */}
              {plan && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-pink uppercase tracking-wider">
                      Strategy Blueprint ({plan.length} Days Generated)
                    </span>
                    <span className="text-xs text-text-muted">Click &quot;Add to Calendar&quot; to schedule any idea</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {plan.slice(0, 12).map(dp => {
                      const isReel = dp.content_type.toLowerCase().includes("reel");
                      return (
                        <div
                          key={dp.day_number}
                          className="p-4 rounded-2xl bg-surface-elevated border border-border hover:border-brand-purple/50 transition-all flex flex-col justify-between gap-3 shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-purple/20 text-brand-pink border border-brand-purple/30">
                                Day {dp.day_number}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isReel ? "bg-pink-500/20 text-pink-300" : "bg-blue-500/20 text-blue-300"
                                }`}
                              >
                                {isReel ? "🎬 Reel Script" : "📸 " + dp.content_type}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-white/90 line-clamp-2">{dp.caption}</p>
                            <p className="text-[11px] text-text-muted mt-2 italic line-clamp-2">
                              💡 {dp.visual_direction}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-brand-coral truncate max-w-[160px]">
                              {dp.hashtags}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleScheduleDayPlan(dp)}
                              className="h-7 text-[11px] bg-brand-purple/20 hover:bg-brand-purple text-brand-pink hover:text-white border border-brand-purple/30"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add to Calendar
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
