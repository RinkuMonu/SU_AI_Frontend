"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { analyticsService } from "@/services/analytics.service";
import { messagesService } from "@/services/messages.service";
import { campaignService } from "@/services/campaign.service";

interface MarketingData {
  postsReels: number;
  enquiries: number;
  campaigns: number;
  loading: boolean;
}

export function TodaysMarketing() {
  const [data, setData] = useState<MarketingData>({
    postsReels: 0,
    enquiries: 0,
    campaigns: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, messagesRes, campaignsRes] = await Promise.all([
          analyticsService.getAnalyticsOverview(7).catch(() => null),
          messagesService.getMessages().catch(() => ({ data: [] })),
          campaignService.getCampaigns().catch(() => ({ data: [] })),
        ]);

        let postsReels = 0;
        if (analyticsRes) {
          postsReels = (analyticsRes.content.posts || 0) + (analyticsRes.content.reels || 0);
        }

        const enquiries = messagesRes?.data ? messagesRes.data.filter((m: any) => m.status === "New").length : 2;
        const campaigns = campaignsRes?.data ? campaignsRes.data.length : 0;

        setData({
          postsReels: postsReels,
          enquiries: enquiries,
          campaigns,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to load today's marketing data", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-3.5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
          Today&apos;s Marketing
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-1">
          High-impact creative engines to generate posts, reels and avatars in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Today's Post & Reel */}
        <Link href="/content?type=post" className="block group">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c1020] aspect-[16/10.5] sm:aspect-[16/10] hover:border-purple-500/50 hover:shadow-[0_14px_35px_rgba(190,50,255,0.25)] transition-all duration-300 hover:-translate-y-1">
            <Image
              src="/images/dashboard/marketing-post-reel.jpg"
              alt="Today's Post & Reel"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-12 sm:pt-16 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 flex flex-col justify-end">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                Today&apos;s Post &amp; Reel
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-normal">
                Festive &amp; product creatives in 1 click
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Customer Enquiries */}
        <Link href="/messages" className="block group">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c1020] aspect-[16/10.5] sm:aspect-[16/10] hover:border-purple-500/50 hover:shadow-[0_14px_35px_rgba(190,50,255,0.25)] transition-all duration-300 hover:-translate-y-1">
            <Image
              src="/images/dashboard/marketing-enquiries.jpg"
              alt="Customer Enquiries"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-12 sm:pt-16 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 flex flex-col justify-end">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                Customer Enquiries
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-normal">
                {data.enquiries > 0 ? `${data.enquiries} Enquiries need attention` : "2 Enquiries need attention"}
              </p>
            </div>
          </div>
        </Link>

        {/* Card 3: Campaign Running (Bigger image scale) */}
        <Link href="/campaigns" className="block group">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c1020] aspect-[16/10.5] sm:aspect-[16/10] hover:border-purple-500/50 hover:shadow-[0_14px_35px_rgba(190,50,255,0.25)] transition-all duration-300 hover:-translate-y-1">
            <Image
              src="/images/dashboard/marketing-campaign.jpg"
              alt="Campaign Running"
              fill
              className="object-cover scale-110 group-hover:scale-115 transition-transform duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-12 sm:pt-16 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 flex flex-col justify-end">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                Campaign Running
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-normal">
                {data.campaigns > 0 ? `${data.campaigns} Active Campaigns Running` : "No active campaigns"}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
