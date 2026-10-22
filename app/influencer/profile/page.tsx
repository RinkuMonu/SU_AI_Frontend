"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ShieldCheck, Sparkles, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Youtube = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
import influencerService, { InfluencerProfile } from '@/services/influencer.service';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('Fashion & Lifestyle');
  const [location, setLocation] = useState('India');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [followerCount, setFollowerCount] = useState<number | ''>('');
  const [engagementRate, setEngagementRate] = useState<number | ''>('');
  const [expectedRate, setExpectedRate] = useState<number | ''>('');

  useEffect(() => {
    influencerService.getMyProfile()
      .then(res => {
        if (res.success && res.data) {
          const d = res.data;
          setProfile(d);
          setFullName(d.fullName || user?.name || '');
          setUsername(d.username || '');
          setBio(d.bio || '');
          setCategory(d.category || 'Fashion & Lifestyle');
          setLocation(d.location || 'India');
          setInstagramUrl(d.instagram_url || '');
          setYoutubeUrl(d.youtube_url || '');
          setFollowerCount(d.follower_count || '');
          setEngagementRate(d.engagement_rate || '');
          setExpectedRate(d.expectedPricePerPost || '');
        }
      })
      .catch(err => {
        setError('Failed to load profile.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await influencerService.updateMyProfile({
        fullName,
        username,
        bio,
        category,
        location,
        instagram_url: instagramUrl,
        youtube_url: youtubeUrl,
        follower_count: typeof followerCount === 'number' ? followerCount : 0,
        engagement_rate: typeof engagementRate === 'number' ? engagementRate : 0,
        expectedPricePerPost: typeof expectedRate === 'number' ? expectedRate : 0
      });

      if (res.success) {
        setSuccess(true);
        setProfile(res.data);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#be32ff]" />
          Creator Media Kit &amp; Profile
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Keep your media kit up to date. Verified brands look at these details before sending paid deals.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile &amp; Media Kit updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card className="bg-[#0f1017] border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300 font-semibold">Full Creator Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Patel"
                className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300 font-semibold">Username / Handle</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. @mayacreates"
                className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-300 font-semibold">Bio / Media Kit Summary</Label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands about your aesthetic, audience demographics, and top achievements..."
              className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300 font-semibold">Primary Niche</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-3 text-xs text-neutral-200 cursor-pointer"
              >
                <option value="Fashion & Lifestyle">Fashion &amp; Lifestyle</option>
                <option value="Beauty & Skincare">Beauty &amp; Skincare</option>
                <option value="Food & Travel">Food &amp; Travel</option>
                <option value="Tech & Gaming">Tech &amp; Gaming</option>
                <option value="Fitness & Health">Fitness &amp; Health</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300 font-semibold">Location / Base City</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300 font-semibold">Expected Rate / Reel (₹)</Label>
              <Input
                type="number"
                value={expectedRate}
                onChange={(e) => setExpectedRate(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 5000"
                className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#fc9a5d] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Social Handles &amp; Audience Reach
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram Profile URL
                </Label>
                <Input
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-400" /> YouTube Channel URL
                </Label>
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@channel"
                  className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-semibold">Total Follower Count</Label>
                <Input
                  type="number"
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 25000"
                  className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-semibold">Avg Engagement Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 4.5"
                  className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-500/20 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Media Kit'}</span>
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
