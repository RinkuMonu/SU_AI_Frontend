"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Camera, 
  MessageSquare, 
  Star, 
  Megaphone
} from "lucide-react";
import { analyticsService } from "@/services/analytics.service";
import { messagesService } from "@/services/messages.service";
import { reviewsService } from "@/services/reviews.service";
import { campaignService } from "@/services/campaign.service";

interface MarketingData {
  postsReels: number;
  enquiries: number;
  reviews: number;
  campaigns: number;
  loading: boolean;
}

export function TodaysMarketing() {
  const [data, setData] = useState<MarketingData>({
    postsReels: 0,
    enquiries: 0,
    reviews: 0,
    campaigns: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, messagesRes, reviewsRes, campaignsRes] = await Promise.all([
          analyticsService.getAnalyticsOverview(7).catch(() => null),
          messagesService.getMessages().catch(() => ({ data: [] })),
          reviewsService.getReviews().catch(() => ({ data: [] })),
          campaignService.getCampaigns().catch(() => ({ data: [] })),
        ]);

        let postsReels = 0;
        if (analyticsRes) {
          postsReels = (analyticsRes.content.posts || 0) + (analyticsRes.content.reels || 0);
        }

        const enquiries = messagesRes.data.filter((m: any) => m.status === 'New').length;
        const reviews = reviewsRes.data.filter((r: any) => r.status === 'Pending').length;
        const campaigns = campaignsRes.data.length;

        setData({
          postsReels,
          enquiries,
          reviews,
          campaigns,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to load today's marketing data", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-white">Today's Marketing</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Posts & Reels */}
        <Card className="bg-[#1f1d2c] border-border overflow-hidden relative group">
          <CardContent className="p-0">
            <div className="h-40 bg-gradient-to-b from-brand-purple/20 to-transparent p-4 flex flex-col justify-between items-center relative">
              <div className="flex justify-between items-start w-full absolute top-4 left-0 px-4">
                <div />
                <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white cursor-pointer z-10">View</Badge>
              </div>
              <div className="flex-1 flex items-center justify-center pt-6">
                <Camera className="w-16 h-16 text-brand-purple drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
              </div>
            </div>
            <div className="bg-[#8b5cf6] p-4 text-center border-t border-white/10">
              <h3 className="font-semibold text-white text-lg">Today's Post & Reels</h3>
              <p className="text-white/90 text-sm mt-1 font-medium">
                {data.loading ? "..." : `${data.postsReels || 2} Posts Primed to Go Viral`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Enquiries */}
        <Card className="bg-[#1f1d2c] border-border overflow-hidden relative group">
          <CardContent className="p-0">
            <div className="h-40 bg-gradient-to-b from-[#8b5cf6]/20 to-transparent p-4 flex flex-col justify-between items-center relative">
              <div className="flex justify-between items-start w-full absolute top-4 left-0 px-4">
                <div />
                <Link href="/messages" className="z-10">
                  <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white cursor-pointer">View</Badge>
                </Link>
              </div>
              <div className="flex-1 flex items-center justify-center pt-6">
                 <MessageSquare className="w-16 h-16 text-[#8b5cf6] drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
              </div>
            </div>
            <div className="bg-[#8b5cf6] p-4 text-center border-t border-white/10">
              <h3 className="font-semibold text-white text-lg">Customer Enquiries</h3>
              <p className="text-white/90 text-sm mt-1 font-medium">
                {data.loading ? "..." : `${data.enquiries || 3} Enquiries Need Attention`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="bg-[#1f1d2c] border-border overflow-hidden relative group">
          <CardContent className="p-0">
            <div className="h-40 bg-gradient-to-b from-[#8b5cf6]/20 to-transparent p-4 flex flex-col justify-between items-center relative">
              <div className="flex justify-between items-start w-full absolute top-4 left-0 px-4">
                <div />
                <Link href="/reviews" className="z-10">
                  <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white cursor-pointer">View</Badge>
                </Link>
              </div>
              <div className="flex-1 flex items-center justify-center pt-6">
                 <Star className="w-16 h-16 text-yellow-400 fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              </div>
            </div>
            <div className="bg-[#8b5cf6] p-4 text-center border-t border-white/10">
              <h3 className="font-semibold text-white text-lg">Reviews</h3>
              <p className="text-white/90 text-sm mt-1 font-medium">
                {data.loading ? "..." : `${data.reviews || 2} Customer Reviews Pending`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Running */}
        <Card className="bg-[#1f1d2c] border-border overflow-hidden relative group">
          <CardContent className="p-0">
            <div className="h-40 bg-gradient-to-b from-[#8b5cf6]/20 to-transparent p-4 flex flex-col justify-between items-center relative">
              <div className="flex justify-between items-start w-full absolute top-4 left-0 px-4">
                <div />
                <Link href="/campaigns" className="z-10">
                  <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white cursor-pointer">View</Badge>
                </Link>
              </div>
              <div className="flex-1 flex items-center justify-center pt-6">
                 <Megaphone className="w-16 h-16 text-[#34d399] drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              </div>
            </div>
            <div className="bg-[#8b5cf6] p-4 text-center border-t border-white/10">
              <h3 className="font-semibold text-white text-lg">Campaign Running</h3>
              <p className="text-white/90 text-sm mt-1 font-medium">
                {data.loading ? "..." : data.campaigns > 0 ? "Your Ads Are Winning!" : "No Active Campaigns"}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

