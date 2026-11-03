"use client";

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { InstagramIcon, FacebookIcon, LinkedInIcon } from '@/components/social/SocialIcons';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';
import { 
  influencerSocialService, 
  PlatformKey, 
  InfluencerSocialStatus, 
  SocialPlatformInfo 
} from '@/services/influencer-social.service';

function SocialAccountsContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [socialStatus, setSocialStatus] = useState<InfluencerSocialStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Manual Link dialog
  const [manualPlatform, setManualPlatform] = useState<PlatformKey | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  // Handle URL callback parameters after OAuth redirect
  useEffect(() => {
    const isConnected = searchParams.get('social_connected');
    const platform = searchParams.get('platform');
    const username = searchParams.get('username');
    const socialError = searchParams.get('social_error');

    if (isConnected === 'true' && platform) {
      setStatusNotification({
        type: 'success',
        message: `Successfully connected & verified your ${platform.toUpperCase()} account${username ? ` (@${decodeURIComponent(username)})` : ''}!`,
      });
    } else if (socialError) {
      setStatusNotification({
        type: 'error',
        message: `Social connection failed: ${decodeURIComponent(socialError)}`,
      });
    }
  }, [searchParams]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileRes, statusRes] = await Promise.allSettled([
        influencerService.getMyProfile(),
        influencerSocialService.getStatus(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.success) {
        setProfile(profileRes.value.data);
      }
      if (statusRes.status === 'fulfilled') {
        setSocialStatus(statusRes.value);
      }
    } catch (err: any) {
      console.error("Failed to load social accounts data:", err);
      setError(err?.response?.data?.detail || err.message || "Failed to load social accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Initiate OAuth Connection
  const handleConnectOAuth = async (platform: PlatformKey) => {
    try {
      setActionLoading(`connect_${platform}`);
      setError(null);
      const authUrl = await influencerSocialService.getConnectUrl(platform);
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || `Unable to initiate ${platform} connection.`);
      setActionLoading(null);
    }
  };

  // Disconnect Platform
  const handleDisconnect = async (platform: PlatformKey) => {
    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    if (!confirm(`Are you sure you want to disconnect ${platformName}? Your verified status will be removed.`)) {
      return;
    }

    try {
      setActionLoading(`disconnect_${platform}`);
      await influencerSocialService.disconnect(platform);

      // Also clear manual link if desired
      const clearData: Record<string, string> = {};
      if (platform === 'instagram') clearData.instagram_url = '';
      if (platform === 'facebook') clearData.facebook_url = '';
      if (platform === 'linkedin') clearData.linkedin_url = '';
      await influencerService.updateMyProfile(clearData).catch(() => {});

      setStatusNotification({
        type: 'success',
        message: `${platformName} disconnected successfully.`,
      });
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || `Failed to disconnect ${platform}.`);
    } finally {
      setActionLoading(null);
    }
  };

  // Save Manual Link (Clearly marked unverified)
  const handleSaveManual = async () => {
    if (!manualPlatform) return;
    try {
      setIsSavingManual(true);
      const updateData: Partial<InfluencerProfile> = {};
      if (manualPlatform === 'instagram') updateData.instagram_url = inputUrl.trim();
      if (manualPlatform === 'facebook') updateData.facebook_url = inputUrl.trim();
      if (manualPlatform === 'linkedin') updateData.linkedin_url = inputUrl.trim();

      const res = await influencerService.updateMyProfile(updateData);
      if (res.success) {
        setStatusNotification({
          type: 'success',
          message: `${manualPlatform.toUpperCase()} link saved (unverified). Connect via OAuth anytime to get the verified badge.`,
        });
        setManualPlatform(null);
        setInputUrl('');
        await loadData();
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Failed to update profile link.");
    } finally {
      setIsSavingManual(false);
    }
  };

  const platformsConfig: Array<{
    id: PlatformKey;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    borderColor: string;
    manualUrl?: string;
  }> = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: InstagramIcon,
      gradient: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-500/30',
      manualUrl: profile?.instagram_url,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FacebookIcon,
      gradient: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-500/30',
      manualUrl: profile?.facebook_url,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: LinkedInIcon,
      gradient: 'from-sky-600 to-blue-800',
      borderColor: 'border-sky-500/30',
      manualUrl: profile?.linkedin_url,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#be32ff]/15 border border-[#be32ff]/30 text-[#d87aff] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Channel Verification &amp; Reach</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Share2 className="w-7 h-7 text-[#be32ff]" /> Connected Social Accounts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Connect your official creator accounts via OAuth. Verified accounts receive top placement in brand discovery and bilateral hiring campaigns.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="h-10 px-4 border-white/15 bg-white/5 text-xs text-neutral-200 hover:text-white rounded-xl cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-1.5" />
          )}
          <span>Sync Status</span>
        </Button>
      </div>

      {/* Notifications */}
      {statusNotification && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 ${
            statusNotification.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-white/60 hover:text-white text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Policy Notice: Real Verification Only */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-black/40 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-[#d87aff] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Authoritative Verification Standards
            </h4>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              A green &quot;Verified&quot; badge is issued exclusively through official OAuth authentication. Manually entered URLs are marked unverified.
            </p>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {/* Platform Cards (Strictly Instagram, Facebook, LinkedIn) */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {platformsConfig.map((p) => {
            const Icon = p.icon;
            const backendInfo: SocialPlatformInfo | undefined = socialStatus?.platforms?.[p.id];
            
            // STRICT VERIFICATION CHECK: Only true if verified via OAuth from backend
            const isOAuthVerified = Boolean(
              backendInfo && 
              backendInfo.is_verified && 
              backendInfo.verification_method === 'oauth'
            );

            // Connected without OAuth or manual handle
            const hasManualUrl = Boolean(p.manualUrl && p.manualUrl.trim().length > 0);
            const isConnected = isOAuthVerified || Boolean(backendInfo?.status === 'VERIFIED') || hasManualUrl;

            const isConnecting = actionLoading === `connect_${p.id}`;
            const isDisconnecting = actionLoading === `disconnect_${p.id}`;

            const verifiedHandle = backendInfo?.platform_username 
              ? `@${backendInfo.platform_username}`
              : backendInfo?.display_name || null;

            return (
              <Card
                key={p.id}
                className={`bg-[#0c0d16] border ${p.borderColor} rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all shadow-xl`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon & Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${p.gradient} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{p.name}</h3>
                        <p className="text-[11px] text-neutral-400">
                          {p.id === 'instagram' ? 'Reels & Media' : p.id === 'facebook' ? 'Pages & Groups' : 'Professional & B2B'}
                        </p>
                      </div>
                    </div>

                    {/* Verification Status Pill */}
                    {isOAuthVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </span>
                    ) : hasManualUrl ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30" title="Manual URL - OAuth verification pending">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Unverified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 text-neutral-400 border border-white/10">
                        <Clock className="w-3 h-3" />
                        <span>Not Linked</span>
                      </span>
                    )}
                  </div>

                  {/* Channel Details */}
                  {isOAuthVerified ? (
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 text-[11px]">Verified Handle:</span>
                        <span className="text-emerald-300 font-bold truncate max-w-[150px]">
                          {verifiedHandle || 'Verified Account'}
                        </span>
                      </div>
                      {backendInfo?.profile_url && (
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="text-neutral-400 text-[11px]">Profile:</span>
                          <a
                            href={backendInfo.profile_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#d87aff] hover:underline flex items-center gap-1 truncate max-w-[150px]"
                          >
                            <span>Open Channel</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Live OAuth sync active</span>
                      </div>
                    </div>
                  ) : hasManualUrl ? (
                    <div className="p-3.5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 text-[11px]">Manual Link:</span>
                        <a
                          href={p.manualUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-300 hover:underline flex items-center gap-1 truncate max-w-[150px]"
                        >
                          <span className="truncate">{p.manualUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                      <p className="text-[10px] text-amber-400/80 leading-relaxed">
                        ⚠️ Not verified via OAuth. Brands require verified channels to offer higher payouts.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-neutral-400 space-y-1">
                      <p className="text-[11px] leading-relaxed">
                        Connect {p.name} to authenticate your follower reach and enable automated campaign performance metrics.
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  {isOAuthVerified ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isDisconnecting}
                      onClick={() => handleDisconnect(p.id)}
                      className="w-full h-10 rounded-xl border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold cursor-pointer transition-all"
                    >
                      {isDisconnecting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      ) : (
                        <Unlink className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      <span>Disconnect {p.name}</span>
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        disabled={isConnecting}
                        onClick={() => handleConnectOAuth(p.id)}
                        className="w-full h-10 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-500/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <span>Connect via OAuth</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setManualPlatform(p.id);
                          setInputUrl(p.manualUrl || '');
                        }}
                        className="text-[11px] text-neutral-400 hover:text-white transition-colors text-center cursor-pointer py-1"
                      >
                        {hasManualUrl ? 'Edit manual handle' : 'Or add manual handle (unverified)'}
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Manual Link Input Dialog */}
      {manualPlatform && (
        <Dialog open={!!manualPlatform} onOpenChange={() => setManualPlatform(null)}>
          <DialogContent className="bg-[#0e0f17] border-white/10 text-white max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold capitalize flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-purple-400" /> Enter {manualPlatform} Profile Link
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                You can add your public link for informational display. Note: To obtain the genuine Verified badge, connect via OAuth.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <label className="text-neutral-300 font-semibold block">
                {manualPlatform.toUpperCase()} Profile URL or Handle:
              </label>
              <Input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder={
                  manualPlatform === 'instagram'
                    ? 'https://instagram.com/yourhandle'
                    : manualPlatform === 'facebook'
                    ? 'https://facebook.com/yourpage'
                    : 'https://linkedin.com/in/yourprofile'
                }
                className="bg-white/5 border-white/10 text-white text-xs h-11 rounded-xl"
              />
              <p className="text-[11px] text-amber-300/80 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                ⚠️ Notice: Manually entered links will be marked &quot;Unverified&quot;. Official verification requires direct OAuth authorization.
              </p>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setManualPlatform(null)}
                className="border-white/10 bg-white/5 text-neutral-300 text-xs h-10 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSavingManual}
                onClick={handleSaveManual}
                className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white text-xs font-bold h-10 px-5 rounded-xl"
              >
                {isSavingManual ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                Save Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function SocialAccountsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400 text-xs">Loading social accounts...</div>}>
      <SocialAccountsContent />
    </Suspense>
  );
}
