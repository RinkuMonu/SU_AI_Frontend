"use client";
import React, { useEffect, useState } from 'react';
import { Bell, Sparkles, FileText, CheckCircle2, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import marketplaceService from '@/services/marketplace.service';

export default function InfluencerNotificationsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceService.getMyHiringRequests()
      .then(res => {
        if (res.success && Array.isArray(res.data)) setCampaigns(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#be32ff]" /> Notifications &amp; Alerts
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Real-time updates regarding new offers, agreement signatures, escrow payments, and deliverable reviews.
        </p>
      </div>

      <div className="space-y-3">
        {campaigns.map((c, i) => (
          <Card key={i} className="bg-[#0e0f17] border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Campaign Update: {c.campaign_name}</h4>
                <p className="text-[11px] text-neutral-400">Status is currently <strong className="text-white capitalize">{c.status?.replace(/_/g, ' ')}</strong></p>
              </div>
            </div>
            <Link href="/influencer/brand-offers">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-xs text-white h-8">
                View <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </Card>
        ))}

        {campaigns.length === 0 && !loading && (
          <Card className="bg-[#0e0f17] border-white/10 p-8 text-center rounded-2xl">
            <Bell className="w-7 h-7 text-neutral-500 mx-auto mb-2" />
            <p className="text-xs text-neutral-400">All caught up! No unread notifications.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
