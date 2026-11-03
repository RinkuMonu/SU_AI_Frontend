"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Video, 
  Camera, 
  RefreshCw, 
  ChevronRight,
  Image as ImageIcon,
  User as UserIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityService, UserActivityItem } from "@/services/activity.service";

// Fallback items matching Reference Image 2 exactly
const DEFAULT_ACTIVITIES: UserActivityItem[] = [
  {
    id: "act-1",
    title: "Created Post",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "content",
    status: "Draft",
    timestamp: new Date().toISOString(),
    actionUrl: "/content?type=post",
  },
  {
    id: "act-2",
    title: "AI Created Studio",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "ai_generation",
    status: "Completed",
    timestamp: new Date().toISOString(),
    actionUrl: "/fashion-ai/photoshoot",
  },
  {
    id: "act-3",
    title: "Brand Profile Created",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "social",
    status: "Draft",
    timestamp: new Date().toISOString(),
    actionUrl: "/brand",
  },
];

export function RecentActivityList() {
  const [activities, setActivities] = useState<UserActivityItem[]>(DEFAULT_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "content" | "social" | "ai_generation">("all");

  const loadActivities = async () => {
    try {
      const items = await ActivityService.getAllRecentActivities();
      if (items && items.length > 0) {
        setActivities(items);
      } else {
        setActivities(DEFAULT_ACTIVITIES);
      }
    } catch {
      setActivities(DEFAULT_ACTIVITIES);
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

  const filteredActivities = activities.filter((act) => {
    if (filter === "all") return true;
    if (filter === "content") return act.category === "content";
    if (filter === "social") return act.category === "social";
    if (filter === "ai_generation") return act.category === "ai_generation";
    return true;
  });

  const renderIcon = (title: string, category: string) => {
    const t = title.toLowerCase();
    if (t.includes("post") || category === "content") {
      return (
        <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
          <ImageIcon className="w-4 h-4 text-orange-400" />
        </div>
      );
    }
    if (t.includes("studio") || t.includes("ai") || category === "ai_generation") {
      return (
        <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-pink-400" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
        <UserIcon className="w-4 h-4 text-purple-400" />
      </div>
    );
  };

  const renderStatusBadge = (status: string) => {
    if (status === "Completed" || status === "Published" || status === "Active") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
        Draft
      </span>
    );
  };

  return (
    <Card className="h-full bg-[#0c1020]/95 border-white/10 backdrop-blur-xl rounded-2xl hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden flex flex-col shadow-sm">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-white text-lg sm:text-xl font-bold tracking-tight">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm mt-1">
              Live record of your AI generations, social media publishing and platform syncs.
            </CardDescription>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            title="Refresh recent activity"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-400" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Pills matching Reference Image 2 */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto custom-scrollbar pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "all"
                ? "bg-[#be32ff] text-white shadow-md shadow-[#be32ff]/25"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter("content")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "content"
                ? "bg-[#be32ff] text-white shadow-md shadow-[#be32ff]/25"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            Posts &amp; Content
          </button>
          <button
            onClick={() => setFilter("social")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "social"
                ? "bg-[#be32ff] text-white shadow-md shadow-[#be32ff]/25"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            Social Accounts
          </button>
          <button
            onClick={() => setFilter("ai_generation")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === "ai_generation"
                ? "bg-[#be32ff] text-white shadow-md shadow-[#be32ff]/25"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            AI Studio
          </button>
        </div>
      </CardHeader>

      {/* Activity List Content matching Reference Image 2 */}
      <CardContent className="p-4 sm:p-6 pt-1 flex-1">
        <div className="space-y-2.5">
          {filteredActivities.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href={item.actionUrl || "/content"}
              className="group p-3 sm:p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-purple-500/30 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {renderIcon(item.title, item.category)}

                <div className="truncate flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                      {item.title}
                    </span>
                    {renderStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-slate-500 text-xs font-mono">
                <span>Just now</span>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-purple-600/30 transition-all">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
