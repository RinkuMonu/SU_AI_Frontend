"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<InfluencerProfile>();

  useEffect(() => {
    influencerService.getMyProfile()
      .then(res => {
        if (res.data) reset(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: InfluencerProfile) => {
    setSaving(true);
    try {
      // Convert string numbers
      data.follower_count = Number(data.follower_count) || 0;
      data.engagement_rate = Number(data.engagement_rate) || 0;
      
      const res = await influencerService.updateMyProfile(data);
      if (res.success) {
        alert("Profile updated successfully!");
        reset(res.data);
      }
    } catch (e) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Setup</h1>
        <p className="text-text-muted mt-2">Manage your public influencer profile and portfolio.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input {...register("username")} placeholder="@yourhandle" />
              </div>
              <div className="space-y-2">
                <Label>Category / Niche</Label>
                <Input {...register("category")} placeholder="Fashion, Tech, Food..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea 
                {...register("bio")} 
                className="w-full min-h-[100px] p-3 rounded-md bg-transparent border border-input text-white focus:ring-1 focus:ring-ring"
                placeholder="Tell brands about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-white">Social Media & Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input {...register("instagram_url")} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input {...register("youtube_url")} placeholder="https://youtube.com/..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Followers</Label>
                <Input type="number" {...register("follower_count")} placeholder="10000" />
              </div>
              <div className="space-y-2">
                <Label>Avg Engagement Rate (%)</Label>
                <Input type="number" step="0.1" {...register("engagement_rate")} placeholder="4.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-brand-purple hover:bg-brand-purple/80 text-white min-w-[150px]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
