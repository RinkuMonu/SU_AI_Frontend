"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileImage, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import influencerService from '@/services/influencer.service';
import Link from 'next/link';

export default function InfluencerContentPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    influencerService.getMyCollaborations()
      .then(res => {
        if (res.success && res.data) {
          setCollaborations(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileImage className="w-6 h-6 text-[#be32ff]" />
          My Collaborations &amp; Content Submissions
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Track the status of your applications, submitted reels, and brand review stages.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-[#0f1017] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : collaborations.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0f1017]/60 p-12 text-center space-y-4">
          <FileImage className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Collaborations Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You haven't applied to any campaigns yet. Head over to the dashboard and pitch your media kit to open briefs!
          </p>
          <Link href="/influencer">
            <Button size="sm" className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold">
              Browse Open Opportunities
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {collaborations.map(collab => (
            <Card key={collab.id} className="bg-[#0f1017] border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{collab.opportunity?.campaign?.title || 'Brand Deal'}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {collab.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Brand: {collab.opportunity?.business?.name || 'Partner Brand'} &bull; Proposed: ₹{Number(collab.proposed_budget || 0).toLocaleString()}
                </p>
                <p className="text-xs text-neutral-300 italic">
                  "{collab.pitch_message}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-neutral-400">
                  {collab.created_at ? new Date(collab.created_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
