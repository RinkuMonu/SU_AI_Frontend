"use client";

import { FileText } from "lucide-react";
import { Insight } from "@/types/insights";
import { useRouter } from "next/navigation";

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  const router = useRouter();

  const currentInsight: Insight = insights && insights.length > 0 ? insights[0] : {
    _id: "rec-default",
    title: "AI Recommendation",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit do eiusmod tempor incididunt.",
    priority: "High",
    recommendedAction: "Take action now to improve your marketing score.",
    actionType: "Create Reel",
    actionTarget: "reel",
  };

  const handleAction = () => {
    if (currentInsight.actionType === "Create Reel" || currentInsight.actionTarget === "reel") {
      router.push("/create/reel");
    } else if (currentInsight.actionType === "Create Post") {
      router.push("/ai-post");
    } else {
      router.push("/analytics");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Top Card matching Reference Image 2 */}
      <div className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
        {/* Row 1: Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-orange-400" />
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {currentInsight.title || "AI Recommendation"}
          </h4>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentInsight.description || "Lorem ipsum dolor sit amet consectetur adipiscing elit do eiusmod tempor incididunt."}
        </p>

        {/* Recommendation Box */}
        <div className="p-3 rounded-xl bg-surface/80 border border-purple-500/20 text-xs text-slate-300 leading-relaxed">
          <span className="text-[#be32ff] font-semibold">Recommendation:</span>{" "}
          <span>{currentInsight.recommendedAction || "Take action now to improve your marketing score."}</span>
        </div>

        {/* Action Button: Gradient Pill matching Reference Image 2 */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAction}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            {currentInsight.actionType || "Create Reel"}
          </button>
        </div>
      </div>
    </div>
  );
}
