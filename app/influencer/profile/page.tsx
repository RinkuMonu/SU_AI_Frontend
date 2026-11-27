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
      creatorOnboardingService.loadOnboardingData(user).then((local) => {
        if (local) {
          if (local.fullName) setFullName(local.fullName);
          if (local.username) setUsername(local.username);
          if (local.bio) setBio(local.bio);
          if (local.location) setLocation(local.location);
          if (local.niches?.[0]) setCategory(local.niches[0]);
          const ig = local.socialAccounts?.find(s => s.platform === 'instagram')?.url;
          if (ig) setInstagramUrl(ig);
          const fb = local.socialAccounts?.find(s => s.platform === 'facebook')?.url;
          if (fb) setFacebookUrl(fb);
          const li = local.socialAccounts?.find(s => s.platform === 'linkedin')?.url;
          if (li) setLinkedinUrl(li);
        }
      }).catch(() => {});
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
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
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
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 hover:border-pink-500/60 transition-colors duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile &amp; Media Kit updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 hover:border-pink-500/60 transition-colors duration-200">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* OAuth Verification Promotion Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-black/40 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-pink-500/60 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#be32ff]/20 text-[#d87aff] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Verify Your Social Channels for 3x Higher Campaign Inquiries
            </h4>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              Connect Instagram, Facebook, and LinkedIn via OAuth in Social Accounts to earn official verification badges.
            </p>
          </div>
        </div>
        <Link
          href="/influencer/social-accounts"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white text-xs font-bold shadow-md shrink-0 inline-flex items-center gap-1 group enabled:hover:brightness-110 enabled:hover:shadow-lg enabled:hover:shadow-pink-500/30 enabled:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <span>Manage Social Accounts</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <form onSubmit={handleSave}>
        <Card className="bg-[#0f1017] border-white/10 rounded-3xl p-5 sm:p-8 space-y-6 sm:space-y-7 overflow-hidden hover:border-pink-500/60 transition-colors duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="min-w-0">
              <Label className="block mb-2 text-base font-semibold text-white">Full Creator Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Patel"
                className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
                required
              />
            </div>
            <div className="min-w-0">
              <Label className="block mb-2 text-base font-semibold text-white">Username / Handle</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. @mayacreates"
                className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="min-w-0">
            <Label className="block mb-2 text-base font-semibold text-white">Bio / Media Kit Summary</Label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands about your aesthetic, audience demographics, and top achievements..."
              className="w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400 focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/30 resize-y min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="min-w-0">
              <Label className="block mb-2 text-base font-semibold text-white">Primary Niche</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-12 rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white cursor-pointer focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/30"
              >
                <option value="Fashion & Lifestyle" className="bg-[#0f1017] text-white">Fashion &amp; Lifestyle</option>
                <option value="Beauty & Skincare" className="bg-[#0f1017] text-white">Beauty &amp; Skincare</option>
                <option value="Food & Travel" className="bg-[#0f1017] text-white">Food &amp; Travel</option>
                <option value="Tech & Gaming" className="bg-[#0f1017] text-white">Tech &amp; Gaming</option>
                <option value="Fitness & Health" className="bg-[#0f1017] text-white">Fitness &amp; Health</option>
              </select>
            </div>
            <div className="min-w-0">
              <Label className="block mb-2 text-base font-semibold text-white">Location / Base City</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
              />
            </div>
            <div className="min-w-0 md:col-span-2 xl:col-span-1">
              <Label className="block mb-2 text-base font-semibold text-white">Expected Rate / Reel (₹)</Label>
              <Input
                type="number"
                value={expectedRate}
                onChange={(e) => setExpectedRate(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 5000"
                className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Social Handles Section (Instagram, Facebook, LinkedIn ONLY) */}
          <div className="pt-6 border-t border-white/10 space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#fc9a5d] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Social Handles &amp; Audience Reach</span>
              </h3>
              <span className="text-sm text-slate-300">
                Only Instagram, Facebook &amp; LinkedIn supported
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div className="min-w-0">
                <Label className="mb-2 text-base font-semibold text-white flex items-center gap-2">
                  <InstagramIcon className="w-4 h-4 shrink-0" />
                  <span className="break-words">Instagram Profile URL</span>
                </Label>
                <Input
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
                />
              </div>

              <div className="min-w-0">
                <Label className="mb-2 text-base font-semibold text-white flex items-center gap-2">
                  <FacebookIcon className="w-4 h-4 shrink-0" />
                  <span className="break-words">Facebook Page URL</span>
                </Label>
                <Input
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
                />
              </div>

              <div className="min-w-0 md:col-span-2 xl:col-span-1">
                <Label className="mb-2 text-base font-semibold text-white flex items-center gap-2">
                  <LinkedInIcon className="w-4 h-4 shrink-0" />
                  <span className="break-words">LinkedIn Profile URL</span>
                </Label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div className="min-w-0">
                <Label className="block mb-2 text-base font-semibold text-white break-words">Total Follower Count (Estimate)</Label>
                <Input
                  type="number"
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 25000"
                  className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400"
                />
              </div>
              <div className="min-w-0">
                <Label className="block mb-2 text-base font-semibold text-white break-words">Avg Engagement Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 4.5"
                  className="h-auto min-h-12 w-full rounded-xl bg-white/[0.07] border border-white/20 px-4 py-3.5 text-base text-white placeholder:text-slate-400 hover:border-pink-500/60 transition-colors duration-200"
                />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-300 bg-white/[0.04] p-4 rounded-xl border border-white/10 hover:border-pink-500/60 transition-colors duration-200">
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
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2 group enabled:hover:brightness-110 enabled:hover:shadow-lg enabled:hover:shadow-pink-500/30 enabled:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
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
