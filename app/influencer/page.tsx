"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Briefcase, Star, Clock } from 'lucide-react';
import influencerService from '@/services/influencer.service';
import Link from 'next/link';

export default function InfluencerDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    influencerService.getMyProfile()
      .then(res => {
        if (res.data) setProfile(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err.message);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.username || 'Creator'}! ?</h1>
        <p className="text-text-muted mt-2">Here is what's happening with your brand collaborations today.</p>
      </div>

      {!profile && (
        <div className="bg-brand-purple/10 border border-brand-purple/30 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Complete Your Profile</h2>
          <p className="text-text-muted mb-4">Brands are waiting! Add your social links, bio, and portfolio to get discovered.</p>
          <Link href="/influencer/profile" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-brand-purple text-primary-foreground shadow hover:bg-brand-purple/90 h-9 px-4 py-2">
            Set Up Profile
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Available Campaigns</CardTitle>
            <Briefcase className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-brand-pink mt-1">2 new since yesterday</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Active Collabs</CardTitle>
            <Clock className="h-4 w-4 text-brand-coral" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-text-muted mt-1">1 deadline approaching</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Pending Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">?15,000</div>
            <p className="text-xs text-text-muted mt-1">Awaiting brand approval</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Profile Views</CardTitle>
            <Star className="h-4 w-4 text-brand-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">84</div>
            <p className="text-xs text-brand-pink mt-1">+12% from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
