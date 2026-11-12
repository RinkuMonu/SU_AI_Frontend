"use client";

import { useEffect, useState, useMemo, useRef } from "react";
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
  MessageSquare,
  Heart,
  MoreVertical,
  Pencil,
  ChevronDown,
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
  CalendarDays,
  Upload,
  FileVideo,
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VoiceInputButton } from "@/components/ui/VoiceInput";
import Link from "next/link";

// ─── Platform Icons ─────────────────────────────────────────────────────────────

const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ig-official-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffd600" />
        <stop offset="25%" stopColor="#ff0100" />
        <stop offset="50%" stopColor="#d800b9" />
        <stop offset="100%" stopColor="#7000ff" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-official-gradient)" />
    <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" fill="none" stroke="#ffffff" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3.2" fill="none" stroke="#ffffff" strokeWidth="1.6" />
    <circle cx="15.8" cy="8.2" r="0.85" fill="#ffffff" />
  </svg>
);

const FacebookIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#1877F2" />
    <path
      d="M13.5 22v-8h2.69l.4-3.13H13.5V8.87c0-.9.25-1.52 1.55-1.52h1.66V4.55c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.04 1.46-4.04 4.15v2.29H7.5V14h2.75v8h3.25z"
      fill="#ffffff"
    />
  </svg>
);

const LinkedinIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4.5" fill="#0A66C2" />
    <path
      d="M8.2 18.5V9.8H5.3v8.7h2.9zM6.75 8.6c1 0 1.63-.66 1.63-1.5-.02-.85-.63-1.5-1.61-1.5-.98 0-1.63.65-1.63 1.5 0 .84.63 1.5 1.6 1.5h.01zM18.7 18.5v-4.9c0-2.6-1.4-3.8-3.3-3.8-1.5 0-2.2.8-2.6 1.4v-1.2H9.9c.04.8 0 8.5 0 8.5h2.9v-4.7c0-.25.02-.5.1-.7.2-.5.7-1 1.5-1 1 0 1.5.8 1.5 2v4.4h2.8z"
      fill="#ffffff"
    />
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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<GeneratedContent | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDayDrawerOpen, setIsDayDrawerOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState<"all" | "scheduled" | "published" | "draft">("scheduled");
  
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
  const [scheduleMediaFile, setScheduleMediaFile] = useState<File | null>(null);
  const [scheduleMediaPreview, setScheduleMediaPreview] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const scheduleFileInputRef = useRef<HTMLInputElement>(null);
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
  // Monday-based start index (0=Mon, 1=Tue, ..., 6=Sun) matching Image 2
  const startDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevMonthDaysCount = new Date(currentYear, currentMonth, 0).getDate();
  const leadingDays = Array.from({ length: startDayIndex }, (_, i) => prevMonthDaysCount - startDayIndex + 1 + i);
  const totalCells = Math.ceil((startDayIndex + daysInMonth) / 7) * 7;
  const trailingDaysCount = totalCells - (startDayIndex + daysInMonth);
  const trailingDays = Array.from({ length: trailingDaysCount }, (_, i) => i + 1);
  const weekDays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

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
  const handleMediaFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUploadError(null);
    const isReel = scheduleType === "Reel";

    if (isReel) {
      const validVideoTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"];
      if (!validVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm|mkv)$/i)) {
        setMediaUploadError("Please upload a valid video file (MP4, MOV, or WebM) for reels.");
        return;
      }
      if (file.size > 60 * 1024 * 1024) {
        setMediaUploadError("Video size exceeds 60MB limit. Please select a smaller video.");
        return;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        setMediaUploadError("Please upload a valid image file (PNG, JPG, WebP) for posts.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setMediaUploadError("Image size exceeds 15MB limit. Please select a smaller image.");
        return;
      }
    }

    setIsUploadingMedia(true);
    setMediaUploadProgress(15);

    const progressTimer = setInterval(() => {
      setMediaUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 25;
      });
    }, 80);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(progressTimer);
      setMediaUploadProgress(100);
      setTimeout(() => {
        const resultUrl = reader.result as string;
        setScheduleMediaFile(file);
        setScheduleMediaPreview(resultUrl);
        setScheduleMediaUrl(resultUrl);
        setIsUploadingMedia(false);
        setMediaUploadProgress(0);
      }, 200);
    };

    reader.onerror = () => {
      clearInterval(progressTimer);
      setIsUploadingMedia(false);
      setMediaUploadError("Failed to read file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    setScheduleMediaFile(null);
    setScheduleMediaPreview(null);
    setScheduleMediaUrl("");
    setMediaUploadError(null);
    if (scheduleFileInputRef.current) scheduleFileInputRef.current.value = "";
  };

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
      setScheduleMediaFile(null);
      setScheduleMediaPreview(null);
      setMediaUploadError(null);
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

      {/* ──────────────────────────────────────────────────
          TOP HEADER MATCHING IMAGE 3 GRADIENT & BROAD DESKTOP WIDTH
         ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 max-w-4xl sm:max-w-5xl mx-auto">
        <div className="flex items-center gap-3.5">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-[#181d30] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shrink-0 shadow-sm"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight whitespace-nowrap">
            <span className="text-white">Calender & </span>
            <span
              className="font-medium bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #fc9a5d 0%, #f0449b 33%, #be32ff 66%, #7d36fa 100%)',
              }}
            >
              Plan Content
            </span>
          </h1>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          MAIN BROAD DESKTOP CONTAINER (MAX-W-4XL / MAX-W-5XL MX-AUTO)
         ────────────────────────────────────────────────── */}
      <div className="max-w-4xl sm:max-w-5xl mx-auto space-y-6">
        {/* 1. Broad Desktop Calendar Card: Hidden initially, shown only when calendar button is clicked */}
        <div className="rounded-3xl bg-[#111528]/95 border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative transition-all">
          {/* Calendar Card Top Controls */}
          <div className={`flex flex-wrap items-center justify-between gap-3 ${isCalendarOpen ? "pb-5 border-b border-white/5" : ""}`}>
            {/* Calendar Button: Clicking toggles full calendar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="inline-flex items-center gap-3 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[#1c2237] border border-white/10 hover:border-white/20 text-white text-sm sm:text-base font-normal transition-all cursor-pointer shadow-sm group"
                title={isCalendarOpen ? "Collapse Calendar" : "Expand Full Calendar"}
              >
                <CalendarDays className="w-5 h-5 text-slate-300 group-hover:text-purple-300 transition-colors" />
                <span>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-300 ${isCalendarOpen ? "rotate-180 text-purple-300" : ""}`} />
              </button>

              {/* Month & Year Selection Popup */}
              {isMonthPickerOpen && (
                <div className="absolute top-full left-0 mt-2 z-40 w-64 bg-[#141829] border border-white/10 rounded-2xl p-3 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => setCurrentDate(new Date(currentYear - 1, currentMonth, 1))}
                      className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-white">{currentYear}</span>
                    <button
                      type="button"
                      onClick={() => setCurrentDate(new Date(currentYear + 1, currentMonth, 1))}
                      className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ].map((mName, idx) => (
                      <button
                        key={mName}
                        type="button"
                        onClick={() => {
                          setCurrentDate(new Date(currentYear, idx, 1));
                          setIsMonthPickerOpen(false);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                          idx === currentMonth
                            ? "bg-[#38156d] text-white border border-[#5b21b6]/60"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {mName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prev / Next & Today buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-xl bg-[#1c2237] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-xl bg-[#1c2237] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="px-2.5 h-8 rounded-xl bg-[#1c2237] border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors cursor-pointer ml-1"
              >
                Today
              </button>
            </div>
          </div>

          {/* Full Calendar (Weekdays & Days Grid) - Only shown when calendar button is clicked */}
          {isCalendarOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-1">
              {/* Weekdays Row: Mon, Tue, Wed, Thur, Fri, Sat, Sun */}
              <div className="grid grid-cols-7 border-b border-white/5 py-3.5">
            {weekDays.map((day, idx) => (
              <div
                key={day}
                className={`text-center text-xs sm:text-sm font-normal text-slate-400 ${
                  idx < 6 ? "border-r border-white/10" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid with vertical dividers */}
          <div className="grid grid-cols-7">
            {/* Leading days from previous month */}
            {leadingDays.map((prevDay, idx) => (
              <div
                key={`lead-${prevDay}-${idx}`}
                className={`h-11 sm:h-12 flex flex-col items-center justify-center ${
                  (idx % 7) < 6 ? "border-r border-white/10" : ""
                }`}
              >
                <span className="text-slate-600 text-xs sm:text-sm font-normal select-none">
                  {prevDay}
                </span>
              </div>
            ))}

            {/* Days of current month */}
            {days.map((day) => {
              const dayItems = itemsByDay[day] || [];
              const dayFestivals = currentMonthFestivals.filter(f => f.date === day);
              const hasScheduled = dayItems.length > 0;
              const hasFestival = dayFestivals.length > 0;
              const isSelected = selectedDay === day;
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

              const cellIndexInWeek = (startDayIndex + day - 1) % 7;
              const isLastInRow = cellIndexInWeek === 6;

              // Solid deep purple circle only on selected day or if scheduled content exists
              const showPurpleCircle = isSelected || hasScheduled;

              return (
                <div
                  key={`curr-day-${day}`}
                  onClick={() => handleOpenScheduleForDay(day)}
                  className={`h-11 sm:h-12 flex flex-col items-center justify-center relative cursor-pointer group transition-colors ${
                    !isLastInRow ? "border-r border-white/10" : ""
                  }`}
                >
                  {showPurpleCircle ? (
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#43187d] border border-[#5b21b6]/60 text-white flex items-center justify-center text-xs sm:text-sm font-normal shadow-[0_0_14px_rgba(67,24,125,0.7)] transform group-hover:scale-105 transition-all"
                      title={`Day ${day}: ${dayItems.length} scheduled item(s)`}
                    >
                      {day}
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white flex items-center justify-center text-xs sm:text-sm font-normal group-hover:bg-white/10 transition-all">
                      {day}
                    </div>
                  )}

                  {/* Festival indicator dot (shown only if festival filter is active) */}
                  {hasFestival && filterType === "festivals" && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                      title={dayFestivals.map(f => f.name).join(", ")}
                    />
                  )}
                </div>
              );
            })}

            {/* Trailing days of next month */}
            {trailingDays.map((nextDay, idx) => {
              const totalLeadingAndCurrent = startDayIndex + daysInMonth;
              const cellIndexInWeek = (totalLeadingAndCurrent + idx) % 7;
              const isLastInRow = cellIndexInWeek === 6;

              return (
                <div
                  key={`trail-${nextDay}-${idx}`}
                  className={`h-11 sm:h-12 flex flex-col items-center justify-center ${
                    !isLastInRow ? "border-r border-white/10" : ""
                  }`}
                >
                  <span className="text-slate-600 text-xs sm:text-sm font-normal select-none">
                    {nextDay}
                  </span>
                </div>
              );
            })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Content Tabs Bar: All | Scheduled | Published | Draft (matching Image 2 gradient & dark bottom) */}
        <div className="rounded-2xl bg-[#121628] border border-white/10 p-1.5 flex items-center justify-between gap-1.5">
          {(["all", "scheduled", "published", "draft"] as const).map((tabKey) => {
            const isActive = activeContentTab === tabKey;
            const labelMap: Record<string, string> = {
              all: "All",
              scheduled: "Scheduled",
              published: "Published",
              draft: "Draft",
            };
            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveContentTab(tabKey)}
                className={`flex-1 py-2.5 px-3 sm:px-6 rounded-xl text-xs sm:text-sm font-normal transition-all cursor-pointer text-center ${
                  isActive
                    ? "text-white border border-[#5b21b6]/60 shadow-[0_4px_16px_rgba(40,16,80,0.5)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(180deg, #38156d 0%, #2c1056 65%, #180830 85%, #0a0314 100%)",
                      }
                    : undefined
                }
              >
                {labelMap[tabKey]}
              </button>
            );
          })}
        </div>

        {/* 3. Dynamic Top Banner for Selected Tab */}
        {activeContentTab === "all" && (
          // Image 1 Banner: AI Suggests
          <div className="rounded-2xl p-4 sm:p-4.5 bg-gradient-to-r from-[#21183c] via-[#1c1834] to-[#12162a] border border-purple-500/20 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-[#be32ff]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-white">AI Suggests:</h4>
                <p className="text-[11px] sm:text-xs text-slate-300">You haven't posted a reel in 3 days.</p>
              </div>
            </div>
            <Button
              onClick={() => handleOpenScheduleForDay(selectedDay || new Date().getDate())}
              className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white text-xs font-medium px-5 py-2 h-9 rounded-xl shadow-md cursor-pointer shrink-0"
            >
              Create
            </Button>
          </div>
        )}

        {activeContentTab === "scheduled" && (
          // Image 2 & 5 Banner: 2 Posts are scheduled for today
          <div className="rounded-2xl p-4 sm:p-4.5 bg-gradient-to-r from-[#1c1736] via-[#16172e] to-[#12162a] border border-purple-500/20 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-[#a855f7]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-white">
                  {scheduledItemsInMonth.length || 2} Posts are scheduled for today
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300">Keep your momentum going!</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenScheduleForDay(selectedDay || new Date().getDate())}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeContentTab === "published" && (
          // Image 3 Banner: Great work! Your content is reaching people
          <div className="rounded-2xl p-4 sm:p-4.5 bg-gradient-to-r from-[#1e1738] via-[#17192f] to-[#12162a] border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-[#be32ff]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-white">Great work!</h4>
                <p className="text-[11px] sm:text-xs text-slate-300">Your content is reaching people.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-white pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <span className="flex items-center gap-1.5"><InstagramIcon className="w-4 h-4" /> 14 Post</span>
              <span className="flex items-center gap-1.5 text-blue-400"><Play className="w-3.5 h-3.5 fill-current" /> 14 Post</span>
              <span className="flex items-center gap-1.5 text-emerald-400"><Eye className="w-4 h-4" /> 20.9k Total reach</span>
            </div>
          </div>
        )}

        {activeContentTab === "draft" && (
          // Image 4 Banner: Turn your draft into something great
          <div className="rounded-2xl p-4 sm:p-4.5 bg-gradient-to-r from-[#1c1736] via-[#16172e] to-[#12162a] border border-purple-500/20 flex items-center gap-3 shadow-lg">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-[#a855f7]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-white">Turn your draft into something great.</h4>
              <p className="text-[11px] sm:text-xs text-slate-300">Refine, edit or generate new content with AI.</p>
            </div>
          </div>
        )}

        {/* 4. Section Header with Optional Date Dropdown */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight">
            {activeContentTab === "all" && "Today"}
            {activeContentTab === "scheduled" && "Scheduled Content"}
            {activeContentTab === "published" && "Published Content"}
            {activeContentTab === "draft" && "Draft Content"}
          </h2>

          {(activeContentTab === "scheduled" || activeContentTab === "published") && (
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full bg-[#141829] border border-white/10 text-sm text-slate-300 hover:text-white cursor-pointer transition-colors shadow-sm"
              title="Toggle Calendar"
            >
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <span>{activeContentTab === "scheduled" ? "28 Sep 2026" : "28 - 30Sep 2026"}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCalendarOpen ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* 5. Dynamic Content Cards matching Images 1, 2, 3, 4 */}
        <div className="space-y-3.5">
          {activeContentTab === "all" && (
            // Image 1 Cards
            <>
              {/* Card 1: Today's Post - Flat 50% / New Winter Collection */}
              <div className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                  <img
                    src="/images/dashboard/quick-action-post.jpg"
                    alt="thumb"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80"; }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#7c3aed] text-white text-[10px] sm:text-[11px] font-medium shadow-sm">
                      Today&apos;s Post
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="hover:text-white cursor-pointer p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">New Winter Collection</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Instagram</span>
                    <span>•</span>
                    <span>Sep 29</span>
                    <span>•</span>
                    <span className="text-purple-300">Schedule 3 pm</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Reel - New Winter Collection */}
              <div className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                  <img
                    src="/images/dashboard/quick-action-reel.jpg"
                    alt="thumb"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80"; }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#9333ea] text-white text-[10px] sm:text-[11px] font-medium shadow-sm">
                      Reel
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="hover:text-white cursor-pointer p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">New Winter Collection</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <FacebookIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Facebook</span>
                    <span>•</span>
                    <span>8 Aug</span>
                    <span>•</span>
                    <span className="text-slate-300">Draft</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Post - New Winter Collection */}
              <div className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                  <img
                    src="/images/dashboard/quick-action-ai-avatar.jpg"
                    alt="thumb"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80"; }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#db2777] text-white text-[10px] sm:text-[11px] font-medium shadow-sm">
                      Post
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="hover:text-white cursor-pointer p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">New Winter Collection</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Instagram</span>
                    <span>•</span>
                    <span>18 Sep</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">Published</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeContentTab === "scheduled" && (
            // Image 2 & 5 Cards
            <>
              {/* Card 1: Today's Post - Flat 50% Off */}
              <div className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                  <img
                    src="/images/dashboard/quick-action-post.jpg"
                    alt="thumb"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80"; }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#7c3aed] text-white text-[10px] sm:text-[11px] font-medium shadow-sm">
                      Today&apos;s Post
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="hover:text-white cursor-pointer p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">Flat 50% Off</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Instagram</span>
                    <span>•</span>
                    <span>Nov 14</span>
                    <span>•</span>
                    <span className="text-purple-300">Schedule 10 am</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Reel - New Winter Collection */}
              <div className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                  <img
                    src="/images/dashboard/quick-action-reel.jpg"
                    alt="thumb"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80"; }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#9333ea] text-white text-[10px] sm:text-[11px] font-medium shadow-sm">
                      Reel
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="hover:text-white cursor-pointer p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">New Winter Collection</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <FacebookIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Facebook</span>
                    <span>•</span>
                    <span>8 Oct</span>
                    <span>•</span>
                    <span className="text-purple-300">Schedule 2 pm</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Post - New Summer Collection */}
              <div className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                  <img
                    src="/images/dashboard/quick-action-ai-avatar.jpg"
                    alt="thumb"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80"; }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#db2777] text-white text-[10px] sm:text-[11px] font-medium shadow-sm">
                      Post
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="hover:text-white cursor-pointer p-1">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">New Summer Collection</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Instagram</span>
                    <span>•</span>
                    <span>28 Sep</span>
                    <span>•</span>
                    <span className="text-purple-300">Schedule 12 pm</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeContentTab === "published" && (
            // Image 3 Cards with Verified Published Badge & Engagement Stats
            <>
              {[1, 2, 3, 4].map((itemNum) => (
                <div
                  key={`pub-item-${itemNum}`}
                  className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                    <img
                      src="/images/dashboard/quick-action-post.jpg"
                      alt="thumb"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80"; }}
                    />
                    <span className="absolute top-1.5 left-1.5 p-1 rounded-lg bg-black/60 backdrop-blur-sm">
                      <InstagramIcon className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] sm:text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
                        <Check className="w-3 h-3 text-emerald-400" /> Published
                      </span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" className="hover:text-white cursor-pointer p-1">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-white truncate">New Summer Collection</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <CalendarDays className="w-3 h-3" />
                      <span>28 - 30Sep 2026</span>
                      <span>•</span>
                      <span>Nov 14</span>
                    </div>
                    {/* Engagement Stats: Hearts, Comments, Shares */}
                    <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 text-pink-400 font-medium">
                        <Heart className="w-3.5 h-3.5 fill-current" /> 914
                      </span>
                      <span className="flex items-center gap-1 text-sky-400 font-medium">
                        <MessageSquare className="w-3.5 h-3.5" /> 45
                      </span>
                      <span className="flex items-center gap-1 text-purple-300 font-medium">
                        <Send className="w-3.5 h-3.5" /> 56
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeContentTab === "draft" && (
            // Image 4 Cards
            <>
              {[1, 2, 3].map((draftNum) => (
                <div
                  key={`draft-item-${draftNum}`}
                  className="rounded-2xl bg-[#131728] border border-white/10 hover:border-white/20 p-3 sm:p-4 transition-all flex items-center gap-3.5 sm:gap-4 shadow-sm group"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                    <img
                      src="/images/dashboard/quick-action-post.jpg"
                      alt="thumb"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-medium text-white truncate">Flat 50% Off</h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        <button type="button" onClick={() => handleOpenScheduleForDay(selectedDay || 4)} className="hover:text-white cursor-pointer p-1">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" className="hover:text-white cursor-pointer p-1">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">Edited Sep 24, • 9:30 PM</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                      <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>Instagram</span>
                      <span>•</span>
                      <span>0:15</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        
      </div>

      {/* ─── SCHEDULE POST / REEL MODAL ────────────────────────────────────────── */}
      {isScheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setIsScheduleModalOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-[#081226] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#081226]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#38156d] border border-[#5b21b6]/60 flex items-center justify-center text-white shadow-lg shadow-[#38156d]/50 shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-normal text-white">Schedule New Content</h3>
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

            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-[#081226]">
              {/* Quick Import from Library & Type Switcher */}
              <div>
                {contents.length > 0 && (
                  <div className="mb-4 p-3.5 rounded-xl bg-[#071023] border border-white/10">
                    <Label className="text-xs font-medium text-purple-300 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 fill-[#be32ff] text-[#be32ff]" /> Quick Autofill from Content Library
                      </span>
                      <span className="text-[11px] text-text-muted">{contents.length} items available</span>
                    </Label>
                    <select
                      className="w-full bg-[#081226] border border-white/10 text-white text-xs rounded-lg p-2.5 focus:border-[#a855f7] outline-none"
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

                <Label className="text-sm font-medium text-slate-200 mb-2.5 block">
                  Select Content Type
                </Label>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setScheduleType("Post")}
                    className={`h-12 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                      scheduleType === "Post"
                        ? "bg-gradient-to-r from-[#2F1262] to-[#071023] border-[#a855f7] text-white shadow-lg shadow-[#2F1262]/40"
                        : "bg-[#071023] border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <svg className={`w-5 h-5 ${scheduleType === "Post" ? "text-white fill-white" : "text-slate-400 fill-slate-400"}`} viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span>Social Post</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleType("Reel")}
                    className={`h-12 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                      scheduleType === "Reel"
                        ? "bg-gradient-to-r from-[#2F1262] to-[#071023] border-[#a855f7] text-white shadow-lg shadow-[#2F1262]/40"
                        : "bg-[#071023] border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <svg className={`w-5 h-5 ${scheduleType === "Reel" ? "text-white fill-white" : "text-slate-400 fill-slate-400"}`} viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                    <span>Instagram Reel</span>
                  </button>
                </div>
              </div>

              {/* Platform Selector */}
              <div>
                <Label className="text-sm font-medium text-slate-200 mb-2.5 block">
                  Target Platform
                </Label>
                <div className="grid grid-cols-3 gap-3.5">
                  {[
                    { id: "Instagram", name: "Instagram", icon: <InstagramIcon className="w-5 h-5" /> },
                    { id: "Facebook", name: "Facebook", icon: <FacebookIcon className="w-5 h-5" /> },
                    { id: "LinkedIn", name: "LinkedIn", icon: <LinkedinIcon className="w-5 h-5" /> },
                  ].map(plat => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setSchedulePlatform(plat.id)}
                      className={`py-3.5 px-3 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        schedulePlatform === plat.id
                          ? "bg-gradient-to-br from-[#2F1262] to-[#071023] border-[#a855f7] text-white shadow-lg shadow-[#2F1262]/40"
                          : "bg-[#071023] border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {plat.icon}
                      <span>{plat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <Label className="text-sm font-medium text-slate-200 mb-2.5 block">Scheduled Date</Label>
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="bg-[#071023] border-white/10 text-white text-sm h-12 rounded-xl focus:border-[#a855f7] outline-none"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-200 mb-2.5 block">Scheduled Time</Label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="bg-[#071023] border-white/10 text-white text-sm h-12 rounded-xl focus:border-[#a855f7] outline-none"
                  />
                </div>
              </div>

              {/* Title / Headline */}
              <div>
                <Label className="text-sm font-medium text-slate-200 mb-2.5 block">Post Title / Hook Headline</Label>
                <Input
                  placeholder="e.g. 5 Secrets To Upgrade Your Festive Style 🔥"
                  value={scheduleTitle}
                  onChange={e => setScheduleTitle(e.target.value)}
                  className="bg-[#071023] border-white/10 text-white text-sm h-12 rounded-xl focus:border-[#a855f7] outline-none"
                />
              </div>

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <Label className="text-sm font-medium text-slate-200 block">Caption Draft</Label>
                  <VoiceInputButton
                    onTranscript={(text) => setScheduleCaption(text)}
                    currentValue={scheduleCaption}
                    size="sm"
                    tooltip="Speak caption (English/Hindi)"
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Write caption or hook story here..."
                  value={scheduleCaption}
                  onChange={e => setScheduleCaption(e.target.value)}
                  className="w-full bg-[#071023] border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] outline-none transition-colors"
                />
              </div>

              {/* Hashtags */}
              <div>
                <Label className="text-sm font-medium text-slate-200 mb-2.5 block">Hashtags</Label>
                <Input
                  placeholder="#reels #fashion #diwalivibes #trend"
                  value={scheduleHashtags}
                  onChange={e => setScheduleHashtags(e.target.value)}
                  className="bg-[#071023] border-white/10 text-white text-sm h-12 rounded-xl focus:border-[#a855f7] outline-none font-mono"
                />
              </div>

              {/* Upload Post / Reel & Media Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-200 flex items-center gap-2 mb-2">
                    {scheduleType === "Reel" ? (
                      <>
                        <svg className="w-4 h-4 text-[#be32ff] fill-[#be32ff]" viewBox="0 0 24 24">
                          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                        </svg>
                        <span>Reel Video Content</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#be32ff] fill-[#be32ff]" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <span>Post Image Content</span>
                      </>
                    )}
                  </Label>
                  <span className="text-xs text-text-muted font-normal">
                    {scheduleType === "Reel" ? "MP4, MOV, WebM (Max 60MB)" : "PNG, JPG, WebP (Max 15MB)"}
                  </span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={scheduleFileInputRef}
                  onChange={handleMediaFileSelected}
                  accept={scheduleType === "Reel" ? "video/mp4,video/quicktime,video/webm" : "image/*"}
                  className="hidden"
                />

                {/* Upload Error Banner */}
                {mediaUploadError && (
                  <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{mediaUploadError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMediaUploadError(null)}
                      className="text-red-300 hover:text-white text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Media Preview or Upload Action Box */}
                {scheduleMediaPreview || scheduleMediaUrl ? (
                  <div className="relative rounded-2xl border border-white/15 bg-black/60 overflow-hidden shadow-lg">
                    {scheduleType === "Reel" || scheduleMediaPreview?.startsWith("data:video") || scheduleMediaUrl?.endsWith(".mp4") ? (
                      <div className="relative aspect-video max-h-56 bg-black flex items-center justify-center">
                        <video
                          src={scheduleMediaPreview || scheduleMediaUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-600/80 text-white text-[10px] font-medium uppercase tracking-wider shadow">
                          Reel Video
                        </span>
                      </div>
                    ) : (
                      <div className="relative aspect-video max-h-56 bg-[#0d172e] flex items-center justify-center overflow-hidden">
                        <img
                          src={scheduleMediaPreview || scheduleMediaUrl}
                          alt="Scheduled media preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#693780]/90 text-white text-[10px] font-medium uppercase tracking-wider shadow">
                          Post Image
                        </span>
                      </div>
                    )}

                    {/* Preview Toolbar */}
                    <div className="p-2.5 bg-surface/90 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-300 truncate max-w-[200px]">
                        {scheduleMediaFile?.name || (scheduleMediaUrl.length > 35 ? scheduleMediaUrl.substring(0, 32) + "..." : scheduleMediaUrl)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => scheduleFileInputRef.current?.click()}
                          className="h-7 text-xs text-purple-300 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          <Upload className="w-3 h-3 mr-1" /> Change
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveMedia}
                          className="h-7 text-xs text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Primary Upload Box matching Image 5 Figma spec (#693780 stroke, rgba(177,177,177,0.12) fill, inner shadow, no pink) */}
                    <button
                      type="button"
                      disabled={isUploadingMedia}
                      onClick={() => scheduleFileInputRef.current?.click()}
                      style={{
                        backgroundColor: "rgba(177, 177, 177, 0.12)",
                        borderColor: "#693780",
                        boxShadow: "inset 0px 4px 22.3px -2px #693780",
                      }}
                      className="w-full py-5 px-4 rounded-xl border border-[#693780] transition-all flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-[#b1b1b1]/15"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#693780]/30 border border-[#693780]/50 flex items-center justify-center mb-2.5 text-white shadow-md group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>
                      <span className="text-sm sm:text-base font-normal text-white">
                        Upload {scheduleType === "Reel" ? "Reel Video" : "Post Image"}
                      </span>
                      <span className="text-xs text-slate-300 mt-1">
                        Click to select media from your device
                      </span>
                    </button>

                    {/* Upload Progress Bar */}
                    {isUploadingMedia && (
                      <div className="p-3 rounded-xl bg-[#0d172e] border border-purple-500/30 space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs text-white">
                          <span className="flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                            <span>Uploading {scheduleType}...</span>
                          </span>
                          <span className="font-mono">{mediaUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-brand-gradient transition-all duration-200 rounded-full"
                            style={{ width: `${mediaUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions matching Image 4 & Image 5 */}
            <div className="p-4 sm:p-6 border-t border-white/10 flex items-center justify-end gap-3.5 bg-[#081226]">
              <Button
                variant="outline"
                onClick={() => setIsScheduleModalOpen(false)}
                className="border-white/10 bg-[#0e172e] hover:bg-white/10 text-white/80 hover:text-white text-sm sm:text-base font-normal h-12 px-6 rounded-full cursor-pointer transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveScheduledContent}
                disabled={isSavingSchedule}
                style={{
                  background: "linear-gradient(90deg, #fc9a5d 0%, #f0449b 33%, #be32ff 66%, #7d36fa 100%)",
                }}
                className="text-white text-sm sm:text-base font-normal h-12 px-8 rounded-full shadow-xl shadow-purple-600/30 cursor-pointer hover:opacity-95 transition-all flex items-center gap-2 border-0"
              >
                {isSavingSchedule ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scheduling...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 stroke-[2.2]" /> Confirm & Schedule
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
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-[#0d172e]">
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
              <div className="p-3.5 rounded-xl bg-[#0d172e] border border-border text-xs flex items-center justify-between text-text-muted">
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
            <div className="p-4 sm:p-5 border-t border-border flex items-center justify-between gap-3 bg-[#0d172e]">
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
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-[#0d172e]">
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
                  className="bg-[#0d172e] border-white/10 text-white text-xs h-11 flex-1"
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
                          className="p-4 rounded-2xl bg-[#0d172e] border border-border hover:border-brand-purple/50 transition-all flex flex-col justify-between gap-3 shadow-md"
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
