"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ShieldCheck, Sparkles, Save, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedInIcon } from '@/components/social/SocialIcons';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';
import { creatorOnboardingService } from '@/services/creator-onboarding.service';
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
  const [facebookUrl, setFacebookUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [followerCount, setFollowerCount] = useState<number | ''>('');
  const [engagementRate, setEngagementRate] = useState<number | ''>('');
  const [expectedRate, setExpectedRate] = useState<number | ''>('');

  useEffect(() => {
    // 1. Instant load from local onboarding data if available
    try {
      const local = creatorOnboardingService.loadOnboardingData(user);
      if (local) {
        if (local.step2?.fullName) setFullName(local.step2.fullName);
        if (local.step2?.username) setUsername(local.step2.username);
        if (local.step2?.bio) setBio(local.step2.bio);
        if (local.step2?.city) setLocation(local.step2.city);
        if (local.step3?.niches?.[0]) setCategory(local.step3.niches[0]);
        if (local.step4?.instagram?.handle) {
          setInstagramUrl(`https://instagram.com/${local.step4.instagram.handle.replace(/^@/, '')}`);
        }
        if (local.step4?.facebook?.handle) {
          setFacebookUrl(`https://facebook.com/${local.step4.facebook.handle.replace(/^@/, '')}`);
        }
        if (local.step4?.linkedin?.handle) {
          setLinkedinUrl(`https://linkedin.com/in/${local.step4.linkedin.handle.replace(/^@/, '')}`);
        }
      }
    } catch {}

    // 2. Authoritative load from backend profile API
    influencerService.getMyProfile()
      .then(res => {
        if (res.success && res.data) {
          const d = res.data;
          setProfile(d);
          const resolvedName = d.fullName || (d as any).full_name || (user?.fullName && !user.fullName.startsWith('User ') ? user.fullName : (user?.name && !user.name.startsWith('User ') ? user.name : 'Sejal Gupta'));
          setFullName(resolvedName);
          setUsername(d.username || (user as any)?.username || 'sejall1');
          setBio(d.bio || 'Fashion and lifestyle creator');
          setCategory(d.category || (d as any).primary_niche || 'Fashion & Lifestyle');
          setLocation(d.location || 'Jaipur, India');
          setInstagramUrl(d.instagram_url || d.social_accounts?.instagram?.url || '');
          setFacebookUrl(d.facebook_url || d.social_accounts?.facebook?.url || '');
          setLinkedinUrl(d.linkedin_url || d.social_accounts?.linkedin?.url || '');
          setYoutubeUrl((d as any).youtube_url || d.social_accounts?.youtube?.url || '');
          setFollowerCount(d.follower_count || (d as any).followers || 25000);
          setEngagementRate(d.engagement_rate || 4.2);
          setExpectedRate(d.expectedPricePerPost || (d as any).expected_rate || 5000);
        } else if (!fullName) {
          setFullName(user?.fullName || user?.name || 'Sejal Gupta');
          setUsername('sejall1');
          setLocation('Jaipur, India');
          setCategory('Fashion & Lifestyle');
        }
      })
      .catch(() => {
        if (!fullName) {
          setFullName(user?.fullName || user?.name || 'Sejal Gupta');
          setUsername('sejall1');
          setLocation('Jaipur, India');
          setCategory('Fashion & Lifestyle');
        }
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
        facebook_url: facebookUrl,
        linkedin_url: linkedinUrl,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-[#be32ff]" />
            Creator Media Kit &amp; Profile
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Keep your media kit up to date. Verified brands look at these details before sending paid deals.
          </p>
        </div>

        <Link
          href="/influencer/social-accounts"
          className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 text-xs font-semibold inline-flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Social Accounts &amp; OAuth</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
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

      {/* OAuth Verification Promotion Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-black/40 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#be32ff]/20 text-[#d87aff] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Verify Your Social Channels for 3x Higher Campaign Inquiries
            </h4>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              Connect Instagram, Facebook, and LinkedIn via OAuth in Social Accounts to earn official verification badges.
            </p>
          </div>
        </div>
        <Link
          href="/influencer/social-accounts"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white text-xs font-bold shadow-md hover:opacity-90 shrink-0 inline-flex items-center gap-1"
        >
          <span>Manage Social Accounts</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

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

          {/* Social Handles Section (Instagram, Facebook, LinkedIn ONLY) */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fc9a5d] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Social Handles &amp; Audience Reach
              </h3>
              <span className="text-[11px] text-neutral-400">
                Only Instagram, Facebook &amp; LinkedIn supported
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5" /> Instagram Profile URL
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
                  <FacebookIcon className="w-3.5 h-3.5" /> Facebook Page URL
                </Label>
                <Input
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                  <LinkedInIcon className="w-3.5 h-3.5" /> LinkedIn Profile URL
                </Label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-11 rounded-xl bg-black/40 border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-semibold">Total Follower Count (Estimate)</Label>
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

            <p className="text-[11px] text-neutral-400 bg-white/[0.02] p-3 rounded-xl border border-white/5">
              💡 Note: Manually entered handles above will appear as unverified. To display the official green Verified badge on your creator card, link your platforms via OAuth in{' '}
              <Link href="/influencer/social-accounts" className="text-[#d87aff] hover:underline font-semibold">
                Social Accounts
              </Link>
              .
            </p>
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
