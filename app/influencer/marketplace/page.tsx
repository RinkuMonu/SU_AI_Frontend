"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building2, Tag, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import influencerService, { OpportunityItem } from '@/services/influencer.service';
import Link from 'next/link';

export default function InfluencerMarketplacePage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    influencerService.getOpportunities({ limit: 12 })
      .then(res => {
        if (res.success && res.data) {
          setOpportunities(res.data.items || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#fc9a5d]" />
            Brand Collaboration Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse all open brand sponsorships, barter packages, and commercial promotion briefs.
          </p>
        </div>
        <Link href="/influencer">
          <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-white/15 bg-white/5 text-xs text-white">
            &larr; Back to Dashboard
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-60 rounded-2xl bg-[#0f1017] p-6 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0f1017]/60 p-12 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Marketplace Deals Open Right Now</h3>
          <p className="text-xs text-neutral-400">Registered businesses post briefs daily. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((opp) => (
            <Card key={opp.id} className="bg-[#0f1017] border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fc9a5d] to-[#be32ff] flex items-center justify-center font-bold text-white text-sm">
                    {opp.business.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{opp.business.name}</h4>
                    <p className="text-[11px] text-neutral-400">{opp.business.category} &bull; {opp.business.location}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{opp.campaign.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{opp.campaign.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-[11px] text-neutral-400">Budget:</span>
                  <span className="font-extrabold text-white">{opp.campaign.budget_display || 'Barter Package'}</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">Duration: {opp.campaign.duration}</span>
                <Link href="/influencer">
                  <Button size="sm" className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold">
                    View &amp; Pitch &rarr;
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
