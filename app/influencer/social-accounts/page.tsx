"use client";
import React, { useEffect, useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Loader2, 
  Link as LinkIcon, 
  Unlink, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function SocialAccountsPage() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connect dialog
  const [editingPlatform, setEditingPlatform] = useState<'instagram' | 'youtube' | 'facebook' | 'linkedin' | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await influencerService.getMyProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      setError(err?.response?.data?.detail || err.message || "Failed to load social accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveSocial = async () => {
    if (!editingPlatform) return;
    try {
      setIsSaving(true);
      const updateData: any = {};
      if (editingPlatform === 'instagram') updateData.instagram_url = inputUrl.trim();
      if (editingPlatform === 'youtube') updateData.youtube_url = inputUrl.trim();
      if (editingPlatform === 'facebook') updateData.facebook_url = inputUrl.trim();
      if (editingPlatform === 'linkedin') updateData.linkedin_url = inputUrl.trim();

      const res = await influencerService.updateMyProfile(updateData);
      if (res.success) {
        alert(`${editingPlatform.toUpperCase()} profile updated!`);
        setEditingPlatform(null);
        setInputUrl('');
        await fetchProfile();
      }
    } catch (err: any) {
      console.error("Save social failed:", err);
      alert(err?.response?.data?.detail || err.message || "Failed to update platform link.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) return;
    try {
      const updateData: any = {};
      if (platform === 'Instagram') updateData.instagram_url = "";
      if (platform === 'YouTube') updateData.youtube_url = "";
      if (platform === 'Facebook') updateData.facebook_url = "";
      if (platform === 'LinkedIn') updateData.linkedin_url = "";

      const res = await influencerService.updateMyProfile(updateData);
      if (res.success) {
        alert(`${platform} disconnected.`);
        await fetchProfile();
      }
    } catch (err: any) {
      alert("Failed to disconnect platform.");
    }
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: InstagramIcon,
      color: 'from-pink-500 to-rose-500',
      url: profile?.instagram_url,
      connected: !!profile?.instagram_url,
      followers: profile?.follower_count || 0,
      engagement: profile?.engagement_rate ? `${profile.engagement_rate}%` : 'N/A'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: YoutubeIcon,
      color: 'from-red-600 to-rose-700',
      url: profile?.youtube_url,
      connected: !!profile?.youtube_url,
      followers: profile?.follower_count || 0,
      engagement: profile?.engagement_rate ? `${profile.engagement_rate}%` : 'N/A'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Share2,
      color: 'from-blue-600 to-indigo-600',
      url: profile?.facebook_url,
      connected: !!profile?.facebook_url,
      followers: 0,
      engagement: 'N/A'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Share2,
      color: 'from-sky-600 to-blue-700',
      url: profile?.linkedin_url,
      connected: !!profile?.linkedin_url,
      followers: 0,
      engagement: 'N/A'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-[#be32ff]" /> Connected Social Accounts
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Connect and verify your social channels to display genuine metrics, reach, and engagement to hiring brands.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchProfile}
          disabled={loading}
          className="border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
          Sync Accounts
        </Button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-44 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Platform Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map(p => {
            const Icon = p.icon;
            return (
              <Card key={p.id} className="bg-[#0e0f17] border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <p className="text-[11px] text-neutral-400">
                        {p.connected ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Connected &amp; Verified
                          </span>
                        ) : (
                          <span className="text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Not Connected
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {p.connected ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisconnect(p.name)}
                      className="border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs h-8 rounded-lg"
                    >
                      <Unlink className="w-3.5 h-3.5 mr-1" /> Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => { setEditingPlatform(p.id as any); setInputUrl(p.url || ''); }}
                      className="bg-white/10 hover:bg-white/15 text-white text-xs h-8 rounded-lg"
                    >
                      <LinkIcon className="w-3.5 h-3.5 mr-1" /> Connect
                    </Button>
                  )}
                </div>

                {p.connected ? (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Profile URL:</span>
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline flex items-center gap-1 truncate max-w-[200px]">
                        {p.url} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                      <div>
                        <span className="text-neutral-400 block text-[11px]">Followers</span>
                        <span className="font-bold text-white">{Number(p.followers).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px]">Avg Engagement</span>
                        <span className="font-bold text-emerald-400">{p.engagement}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-neutral-400">
                    Connect your {p.name} handle or URL to automatically include your metrics in bilateral campaign hiring proposals.
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Connect Platform Dialog */}
      {editingPlatform && (
        <Dialog open={!!editingPlatform} onOpenChange={() => setEditingPlatform(null)}>
          <DialogContent className="bg-[#0e0f17] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold capitalize flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-purple-400" /> Connect {editingPlatform}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Enter your public handle or profile link to sync metrics with your creator media kit.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <label className="text-neutral-300 font-semibold block">
                {editingPlatform.toUpperCase()} URL / Handle:
              </label>
              <Input
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder={editingPlatform === 'instagram' ? 'https://instagram.com/yourhandle' : 'https://youtube.com/@yourchannel'}
                className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPlatform(null)}
                className="border-white/10 bg-white/5 text-neutral-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSaving || !inputUrl.trim()}
                onClick={handleSaveSocial}
                className="bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-bold"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save &amp; Verify Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
