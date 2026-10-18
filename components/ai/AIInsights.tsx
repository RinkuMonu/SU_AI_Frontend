"use client";

import { Button } from '@/components/ui/button';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { Insight } from '@/types/insights';
import { useRouter } from 'next/navigation';

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  const router = useRouter();

  const handleAction = (insight: Insight) => {
    if (insight.actionType === 'Create Post' || insight.actionType === 'Create Reel') {
      router.push(`/content?type=${insight.actionTarget || (insight.actionType === 'Create Reel' ? 'reel' : 'post')}`);
    } else if (insight.actionType === 'View Analytics' || insight.actionTarget === 'analytics') {
      router.push('/analytics');
    } else if (insight.actionType === 'Create Ad') {
      router.push('/campaigns');
    } else if (insight.actionTarget) {
      router.push(`/${insight.actionTarget}`);
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10">
        <div className="h-12 w-12 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mb-3">
          <TrendingUp className="h-6 w-6 text-brand-purple/60" />
        </div>
        <p className="text-sm font-medium text-white">No insights available right now</p>
        <p className="text-xs text-text-muted mt-1 max-w-[260px]">
          Check back later for personalized AI recommendations based on your activity.
        </p>
      </div>
    );
  }

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'High') {
      return (
        <span className="shrink-0 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-full shadow-xs">
          High Priority
        </span>
      );
    }
    if (priority === 'Medium') {
      return (
        <span className="shrink-0 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full shadow-xs">
          Medium Priority
        </span>
      );
    }
    if (priority === 'Low') {
      return (
        <span className="shrink-0 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full shadow-xs">
          Low Priority
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 w-full">
      {insights.map((insight) => (
        <div
          key={insight._id}
          className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-brand-pink/30 hover:bg-white/[0.05] transition-all duration-300 shadow-sm"
        >
          {/* Top Row: Icon + Title + Priority */}
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 border border-brand-pink/30 flex items-center justify-center shrink-0 shadow-sm shadow-brand-pink/10">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-brand-pink" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  {insight.title}
                </h4>
              </div>
            </div>

            {getPriorityBadge(insight.priority)}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
            {insight.description}
          </p>

          {/* Recommendation Box */}
          {insight.recommendedAction && (
            <div className="p-2.5 sm:p-3 rounded-lg bg-surface/80 border border-white/5 text-xs text-slate-300 leading-relaxed">
              <span className="text-brand-pink font-semibold">Recommendation:</span>{" "}
              <span>{insight.recommendedAction}</span>
            </div>
          )}

          {/* Action Button: Responsive Placement */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end">
            <Button
              size="sm"
              className="w-full sm:w-auto h-9 px-4 text-xs font-semibold cursor-pointer shadow-md shadow-brand-pink/20 hover:shadow-brand-pink/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => handleAction(insight)}
            >
              <span>{insight.actionType}</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1.5 shrink-0" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
