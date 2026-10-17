"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Video, 
  Camera, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Calendar,
  Share2, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter,
  Layers,
  Megaphone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityService, UserActivityItem, ActivityCategory } from "@/services/activity.service";

// ── Official Brand Icons ───────────────────────────────────────────────────

const FacebookBrandIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.117 8.52h-1.808c-.282 0-.603.37-.603.882v1.548h2.411l-.328 2.45h-2.083V20h-2.528v-6.6H8.225v-2.45h1.953V9.395c0-1.895 1.155-2.928 2.85-2.928.812 0 1.512.06 1.716.088v1.965z"
      fill="#ffffff"
    />
  </svg>
);

const InstagramBrandIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-act-grad" cx="0.3" cy="1" r="1">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-act-grad)" />
    <path
      d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"
      fill="#ffffff"
    />
  </svg>
);

const WhatsAppBrandIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#25D366" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

function formatRelativeTime(dateString: string): string {
  try {
    const timestamp = new Date(dateString).getTime();
    if (isNaN(timestamp)) return "Recent";
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

export function RecentActivityList() {
  const [activities, setActivities] = useState<UserActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "content" | "social" | "ai_generation">("all");

  const loadActivities = async () => {
    try {
      const items = await ActivityService.getAllRecentActivities();
      setActivities(items);
    } catch (e) {
      console.error("Failed to load activities", e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadActivities();
  };

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (filter === "all") return true;
    if (filter === "content") return act.category === "content";
    if (filter === "social") return act.category === "social";
    if (filter === "ai_generation") return act.category === "ai_generation" || act.category === "content";
    return true;
  });

  // Render Category / Platform Icon
  const renderIcon = (item: UserActivityItem) => {
    if (item.platform === "facebook") {
      return (
        <div className="p-2.5 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shadow-sm">
          <FacebookBrandIcon className="w-4 h-4" />
        </div>
      );
    }
    if (item.platform === "instagram") {
      return (
        <div className="p-2.5 rounded-xl bg-pink-600/15 border border-pink-500/30 flex items-center justify-center shadow-sm">
          <InstagramBrandIcon className="w-4 h-4" />
        </div>
      );
    }
    if (item.platform === "whatsapp") {
      return (
        <div className="p-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center shadow-sm">
          <WhatsAppBrandIcon className="w-4 h-4" />
        </div>
      );
    }
    if (item.title.toLowerCase().includes("photoshoot") || item.category === "ai_generation") {
      return (
        <div className="p-2.5 rounded-xl bg-brand-coral/15 border border-brand-coral/30 flex items-center justify-center shadow-sm">
          <Camera className="w-4 h-4 text-brand-coral" />
        </div>
      );
    }
    if (item.title.toLowerCase().includes("reel")) {
      return (
        <div className="p-2.5 rounded-xl bg-brand-pink/15 border border-brand-pink/30 flex items-center justify-center shadow-sm">
          <Video className="w-4 h-4 text-brand-pink" />
        </div>
      );
    }
    if (item.category === "campaign") {
      return (
        <div className="p-2.5 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center shadow-sm">
          <Megaphone className="w-4 h-4 text-brand-cyan" />
        </div>
      );
    }

    return (
      <div className="p-2.5 rounded-xl bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center shadow-sm">
        <Sparkles className="w-4 h-4 text-brand-purple" />
      </div>
    );
  };

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
      case "Active":
      case "Completed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {status}
          </span>
        );
      case "Scheduled":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            {status}
          </span>
        );
      case "Draft":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <Card className="bg-gradient-to-br from-[#1E1128]/70 via-[#131124] to-[#0B1120] border-brand-purple/25 backdrop-blur-xl rounded-2xl hover:border-brand-purple/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col">
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan opacity-80" />

      {/* Header */}
      <CardHeader className="pb-3 pt-5 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-purple/20 border border-brand-purple/30 text-brand-purple">
                <Clock className="w-4 h-4" />
              </div>
              <CardTitle className="text-white text-lg font-bold tracking-tight flex items-center gap-2">
                Recent Activity
                {!loading && (
                  <Badge variant="secondary" className="bg-white/10 text-white/90 font-mono text-[11px] px-2 py-0.5">
                    {filteredActivities.length} items
                  </Badge>
                )}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-text-muted">
              Live record of your AI generations, social media publishing, and platform syncs.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              title="Refresh recent activity"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-purple" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto custom-scrollbar pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "all"
                ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter("content")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "content"
                ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            Posts & Content
          </button>
          <button
            onClick={() => setFilter("social")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "social"
                ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            Social Accounts
          </button>
          <button
            onClick={() => setFilter("ai_generation")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "ai_generation"
                ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            AI Studio
          </button>
        </div>
      </CardHeader>

      {/* Activity List Content */}
      <CardContent className="px-6 pb-6 pt-2 flex-1">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-white/10" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-1/3 h-3 bg-white/10 rounded" />
                  <div className="w-2/3 h-2.5 bg-white/5 rounded" />
                </div>
                <div className="w-16 h-3 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-text-muted">
            <Clock className="w-10 h-10 text-white/20 mb-3" />
            <p className="text-sm text-gray-300 font-medium">No activity in this category yet.</p>
            <p className="text-xs text-text-muted mt-1">Start generating AI posts or connect social platforms to see live updates!</p>
            <Link
              href="/content?type=post"
              className="mt-4 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-semibold shadow-md shadow-brand-purple/30 transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create AI Post
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
            {filteredActivities.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="group relative p-3.5 rounded-xl bg-[#141224]/80 hover:bg-[#1a172e] border border-white/5 hover:border-brand-purple/30 transition-all duration-300 flex items-center justify-between gap-3 shadow-sm hover:shadow-md hover:shadow-brand-purple/10"
              >
                {/* Left side: Icon + Content details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {renderIcon(item)}

                  <div className="truncate flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white group-hover:text-brand-purple transition-colors truncate">
                        {item.title}
                      </span>
                      {renderStatusBadge(item.status)}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5 max-w-md">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right side: Thumbnail preview + timestamp + action link */}
                <div className="flex items-center gap-3 shrink-0">
                  {item.imageUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 hidden sm:block bg-black/40">
                      <img 
                        src={item.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                  )}

                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] font-mono text-gray-400 block">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>

                  {item.actionUrl ? (
                    <Link
                      href={item.actionUrl}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white border border-white/5 transition-colors"
                      title="View details"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer shortcuts */}
        <div className="pt-4 mt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <Link
            href="/content"
            className="text-brand-pink hover:text-pink-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View all items in Content Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/social-platforms/facebook"
              className="text-gray-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <FacebookBrandIcon className="w-3.5 h-3.5" />
              <span>Facebook Sync</span>
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/analytics"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Full Analytics
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
