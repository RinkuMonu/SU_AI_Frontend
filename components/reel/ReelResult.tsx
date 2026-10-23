"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ReelJobStatus } from "@/types/reel";
import { 
  Loader2, 
  Share2, 
  CheckCircle2, 
  Zap, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Music, 
  Camera, 
  ChevronLeft, 
  Home, 
  Search, 
  PlusSquare, 
  User, 
  BadgeCheck, 
  Copy, 
  Check, 
  Smartphone, 
  Film, 
  X,
  Flame,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { socialService } from "@/services/social.service";
import { getBaseUrl } from "@/lib/api";

interface ReelResultProps {
  result: ReelJobStatus;
  onReset: () => void;
}

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

export function ReelResult({ result, onReset }: ReelResultProps) {
  const isVideo = (url?: string) => {
    if (!url) return false;
    if (url.includes("pollinations.ai")) return false;
    return true;
  };
  const hasRealVideo = isVideo(result.video_url);

  const videoUrl = resolveMediaUrl(result.video_url);
  const audioUrl = resolveMediaUrl(result.audio_url);
  const productImage = resolveMediaUrl(result.thumbnail_url || (result.video_url?.includes("pollinations") ? result.video_url : null));
  const productName = result.product_name || result.script?.title || "Trending Product";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video and Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayIndicator, setShowPlayIndicator] = useState(false);
  const [playIndicatorIcon, setPlayIndicatorIcon] = useState<"play" | "pause">("play");

  // Instagram Interactive State
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [viewMode, setViewMode] = useState<"instagram" | "raw">("instagram");
  const [captionExpanded, setCaptionExpanded] = useState(false);

  // Scenes & Fallback Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const scenes = result.script?.scenes || [];

  // Publishing State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishingFacebook, setIsPublishingFacebook] = useState(false);
  const [isPublishingInstagram, setIsPublishingInstagram] = useState(false);
  const [isPublishingLinkedIn, setIsPublishingLinkedIn] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);
  const [publishErrorMessage, setPublishErrorMessage] = useState<string | null>(null);

  // Dynamic Viral Hooks Extraction (matching Screenshot 2)
  const rawHook = result.script?.hook || "Stop scrolling! Exclusive Flash Sale";
  const rawHeadline = result.hook_headline || result.script?.hook_headline;
  const rawHighlight = result.hook_highlight || result.script?.hook_highlight;

  let hookHeadline = rawHeadline;
  let hookHighlight = rawHighlight;

  if (!hookHeadline || !hookHighlight) {
    if (rawHook.includes("?")) {
      const parts = rawHook.split("?");
      hookHeadline = parts[0].trim() + "?";
      hookHighlight = parts[1]?.trim() || "Exclusive Offer 🔥";
    } else if (rawHook.includes("!")) {
      const parts = rawHook.split("!");
      hookHeadline = parts[0].trim() + "!";
      hookHighlight = parts[1]?.trim() || `${productName} ✨`;
    } else {
      const words = rawHook.split(" ");
      if (words.length > 2) {
        hookHeadline = words.slice(0, 2).join(" ");
        hookHighlight = words.slice(2).join(" ");
      } else {
        hookHeadline = "Stop scrolling!";
        hookHighlight = rawHook || `${productName} 🔥`;
      }
    }
  }

  // Dynamic Creator Profile & Sound Meta
  const creatorName = result.creator_name || result.script?.creator_name || "SevenUnique Studio";
  const followerCount = result.follower_count || result.script?.follower_count || "34.8K followers";
  const trendingAudio = result.trending_audio || result.script?.trending_audio || "🎵 Trending Viral Audio • Beats";
  
  // Likes Counter Handling
  const [likesDisplayCount, setLikesDisplayCount] = useState<string>(result.likes_count || result.script?.likes_count || "26.3K");
  const commentsDisplayCount = result.comments_count || result.script?.comments_count || "874";

  // Autoplay video on load
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    video.volume = 1.0;
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            console.warn("Autoplay muted blocked:", err);
            setIsPlaying(false);
          });
        });
    }
  }, [videoUrl]);

  // Synchronize audio playback for non-video reels (e.g. image mode or audio voiceover)
  useEffect(() => {
    if (!hasRealVideo && audioRef.current && audioUrl) {
      const audio = audioRef.current;
      audio.volume = 1.0;
      audio.loop = true;
      if (isPlaying) {
        audio.muted = isMuted;
        audio.play().catch(console.warn);
      } else {
        audio.pause();
      }
    }
  }, [hasRealVideo, audioUrl, isPlaying, isMuted]);

  const handleToggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (video) {
      video.muted = nextMuted;
      video.volume = 1.0;
      if (video.paused && !nextMuted) {
        video.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
    if (audio) {
      audio.muted = nextMuted;
      audio.volume = 1.0;
      if (audio.paused && !nextMuted) {
        audio.play().catch(console.warn);
      }
    }
  };

  const handleSingleClickScreen = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    // If currently muted due to browser policy, first tap UNMUTES sound!
    if (isMuted) {
      setIsMuted(false);
      if (video) {
        video.muted = false;
        video.volume = 1.0;
        video.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
      if (audio) {
        audio.muted = false;
        audio.volume = 1.0;
        if (!hasRealVideo) {
          audio.play().then(() => setIsPlaying(true)).catch(console.warn);
        }
      }
      setPlayIndicatorIcon("play");
      setShowPlayIndicator(true);
      setTimeout(() => setShowPlayIndicator(false), 650);
      return;
    }

    if (video) {
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(console.warn);
        setPlayIndicatorIcon("play");
      } else {
        video.pause();
        setIsPlaying(false);
        setPlayIndicatorIcon("pause");
      }
    } else if (audio && !hasRealVideo) {
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(console.warn);
        setPlayIndicatorIcon("play");
      } else {
        audio.pause();
        setIsPlaying(false);
        setPlayIndicatorIcon("pause");
      }
    }

    setShowPlayIndicator(true);
    setTimeout(() => setShowPlayIndicator(false), 650);
  };

  const handleScreenClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      // Double tap detected: trigger like with heart pop
      triggerLikeEffect();
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        handleSingleClickScreen();
        clickTimeoutRef.current = null;
      }, 250);
    }
  };

  const triggerLikeEffect = () => {
    setIsLiked(true);
    setShowHeartPop(true);
    setLikesDisplayCount("26.4K");
    setTimeout(() => setShowHeartPop(false), 900);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      setShowHeartPop(true);
      setLikesDisplayCount("26.4K");
      setTimeout(() => setShowHeartPop(false), 900);
    } else {
      setIsLiked(false);
      setLikesDisplayCount("26.3K");
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleCopyCaption = () => {
    if (!result.caption) return;
    navigator.clipboard?.writeText(result.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handlePublish = async (publishPlatform: 'facebook' | 'instagram' | 'linkedin') => {
    if (publishPlatform === 'whatsapp') {
      setIsPublishingWhatsApp(true);
      let shareText = (result.caption || rawHeadline || productName || "Check out this reel!").trim();
      if (result.hashtags && result.hashtags.length > 0) {
        shareText += `\n\n${result.hashtags.map((h: string) => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
      }
      if (videoUrl) {
        shareText += `\n\n🎬 Watch Reel: ${videoUrl}`;
      }
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setIsPublishingWhatsApp(false);
      setShowPublishModal(false);
      setPublishSuccessMessage("Opened WhatsApp with reel ready to share!");
      setTimeout(() => setPublishSuccessMessage(null), 5000);
      return;
    }

    const reelId = result.job_id || (result as any)._id || (result as any).id;

    if (publishPlatform === 'linkedin') {
      setIsPublishingLinkedIn(true);
      try {
        if (reelId) {
          await socialService.publishToLinkedin(reelId);
          setShowPublishModal(false);
          setPublishSuccessMessage("Successfully Published Reel to LinkedIn!");
          setTimeout(() => setPublishSuccessMessage(null), 6000);
        } else {
          let shareText = (result.caption || rawHeadline || productName || "Check out this reel!").trim();
          if (result.hashtags && result.hashtags.length > 0) {
            shareText += `\n\n${result.hashtags.map((h: string) => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
          }
          if (videoUrl) shareText += `\n\n${videoUrl}`;
          const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
          window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
          setShowPublishModal(false);
          setPublishSuccessMessage("Opened LinkedIn with reel ready to publish!");
          setTimeout(() => setPublishSuccessMessage(null), 5000);
        }
      } catch (err: any) {
        console.error("LinkedIn publish error:", err);
        const msg = err.response?.data?.detail || err.message || "Failed to publish to LinkedIn";
        setPublishErrorMessage(msg);
      } finally {
        setIsPublishingLinkedIn(false);
      }
      return;
    }

    if (publishPlatform === 'facebook') {
      setIsPublishingFacebook(true);
      try {
        if (!reelId) {
          throw new Error("Reel ID not found. Please regenerate or save the reel first.");
        }
        await socialService.publishToFacebook(reelId);
        setShowPublishModal(false);
        setPublishSuccessMessage("Successfully Published Reel to Facebook Page!");
        setTimeout(() => setPublishSuccessMessage(null), 6000);
      } catch (error: any) {
        console.error("Facebook publish error:", error);
        const msg = error.response?.data?.detail || error.message || "Failed to publish to Facebook";
        setPublishErrorMessage(msg);
      } finally {
        setIsPublishingFacebook(false);
      }
      return;
    }

    if (publishPlatform === 'instagram') {
      setIsPublishingInstagram(true);
      try {
        if (!reelId) {
          throw new Error("Reel ID not found. Please regenerate or save the reel first.");
        }
        await socialService.publishToInstagram(reelId);
        setShowPublishModal(false);
        setPublishSuccessMessage("Successfully Published Reel to Instagram!");
        setTimeout(() => setPublishSuccessMessage(null), 6000);
      } catch (error: any) {
        console.error("Instagram publish error:", error);
        const msg = error.response?.data?.detail || error.message || "Failed to publish to Instagram";
        setPublishErrorMessage(msg);
      } finally {
        setIsPublishingInstagram(false);
      }
      return;
    }
  };

  // Scene Carousel Navigation
  const openPreview = () => {
    setCurrentScene(0);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const goToScene = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentScene(idx);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Hidden audio element for preview mode */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

        {/* Real-time Credit Deduction Callout Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#0d1630] to-rose-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-white text-sm">🎉 AI Video Reel Generated Successfully!</span>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-rose-400 fill-rose-400" />
                  -10 Credits Deducted
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Generated 1 AI Video Reel • 10 Credits deducted and recorded in your Credit History.
              </p>
            </div>
          </div>
          <Link
            href="/subscription"
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition-all flex items-center gap-1.5 shrink-0 hover:scale-[1.02]"
          >
            <span>View Credit History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 rounded-2xl shadow-lg shadow-pink-500/20 text-white">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  Crazy Viral Instagram Reel
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30">
                  <Flame className="w-3 h-3 text-pink-400" /> Ultra Dynamic
                </span>
              </div>
              <p className="text-sm text-text-muted mt-0.5">
                Full-bleed 9:16 vertical video with synchronized hook, trending audio pill &amp; interactive Instagram player.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-surface-elevated p-1 rounded-2xl border border-border/80 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("instagram")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "instagram"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Instagram Phone Mockup
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "raw"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <Film className="w-4 h-4" />
              Clean Video
            </button>
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div className="flex flex-col xl:flex-row gap-10 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: The Crazy Instagram Smartphone Mockup Player (Screenshot 2) */}
          {/* ========================================================================= */}
          <div className="w-full xl:w-1/2 flex flex-col items-center justify-center">
            
            {/* Phone Outer Shell */}
            <div 
              className="relative w-full max-w-[365px] rounded-[48px] p-2.5 bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 border-2 border-neutral-600/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.25)] transition-all group"
              style={{ aspectRatio: "9/19" }}
            >
              {/* Inner Screen Bezel */}
              <div 
                onClick={handleScreenClick}
                className="w-full h-full relative rounded-[40px] overflow-hidden bg-black select-none cursor-pointer flex flex-col justify-between"
              >
                {/* 1. MEDIA LAYER (Video or Fallback Scene Image) */}
                {hasRealVideo ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    playsInline
                    autoPlay
                    loop
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    poster={productImage || undefined}
                  />
                ) : (
                  <div className="absolute inset-0 z-0">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-full h-full object-cover animate-[scale_10s_ease-in-out_infinite_alternate]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-950" />
                    )}
                  </div>
                )}

                {/* Subtle Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent via-50% to-black/90 pointer-events-none z-10" />

                {/* =================================================================== */}
                {/* 2. DYNAMIC ISLAND & IOS STATUS BAR (Top Header)                     */}
                {/* =================================================================== */}
                <div className="relative z-30 pt-3 px-6 flex items-center justify-between pointer-events-none">
                  {/* Status Bar Left: Time */}
                  <span className="text-white font-bold text-xs tracking-tight">9:16</span>

                  {/* Dynamic Island Notch */}
                  <div className="w-24 h-5 bg-black rounded-full border border-neutral-800/80 flex items-center justify-end px-2.5 gap-1.5 shadow-md pointer-events-auto">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/60" />
                    <div className="w-2 h-2 rounded-full bg-blue-950/80" />
                  </div>

                  {/* Status Bar Right: Signal / Wifi / Battery */}
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-[10px] font-black tracking-widest text-white/90">5G</span>
                    <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                      <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" />
                    </svg>
                    <div className="w-5 h-2.5 border border-white/80 rounded-sm p-0.5 flex items-center">
                      <div className="h-full w-3.5 bg-white rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* =================================================================== */}
                {/* 3. INSTAGRAM TOP NAVIGATION BAR                                     */}
                {/* =================================================================== */}
                {viewMode === "instagram" && (
                  <div className="relative z-30 px-4 pt-2 flex items-center justify-between text-white drop-shadow-md">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onReset(); }}
                      className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Audio Mute Button Pill */}
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-semibold text-white hover:bg-black/60 transition-all cursor-pointer"
                      >
                        {isMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                            <span className="text-[11px]">Unmute</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-[11px]">Sound On</span>
                          </>
                        )}
                      </button>

                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); }}
                        className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                {/* =================================================================== */}
                {/* 4. CRAZY DYNAMIC HOOK TYPOGRAPHY (Screenshot 2 Match)               */}
                {/* =================================================================== */}
                {viewMode === "instagram" && (
                  <div className="relative z-30 px-5 text-center mt-6 transition-all transform hover:scale-[1.02]">
                    {/* Hook Line 1 (White Ultra Bold with Deep Shadow) */}
                    <div className="inline-block px-3 py-1 rounded-xl bg-black/30 backdrop-blur-[2px] border border-white/10 shadow-2xl mb-1">
                      <h2 
                        className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)] uppercase"
                        style={{ WebkitTextStroke: "1px rgba(0,0,0,0.8)" }}
                      >
                        {hookHeadline}
                      </h2>
                    </div>

                    {/* Hook Line 2 (Vibrant Radiant Sunset / Gold Gradient with Dark Outline) */}
                    <div>
                      <h3 
                        className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,1)] bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent"
                        style={{
                          filter: "drop-shadow(0 2px 8px rgba(245, 158, 11, 0.9)) drop-shadow(0 4px 12px rgba(0,0,0,0.95))",
                        }}
                      >
                        {hookHighlight}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Play / Pause Indicator Burst on Tap */}
                {showPlayIndicator && (
                  <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_forwards]">
                    <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-2xl">
                      {playIndicatorIcon === "play" ? (
                        <Play className="w-8 h-8 fill-white ml-1" />
                      ) : (
                        <Pause className="w-8 h-8 fill-white" />
                      )}
                    </div>
                  </div>
                )}

                {/* Double-tap Floating Heart Burst */}
                {showHeartPop && (
                  <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                    <div className="animate-[bounce_0.6s_ease-in-out_infinite] transform scale-150">
                      <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]" />
                    </div>
                  </div>
                )}

                {/* Floating Tap to Unmute Overlay when Autoplay Muted */}
                {isMuted && (
                  <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-amber-400/60 text-amber-300 text-xs font-bold flex items-center gap-2 shadow-2xl animate-pulse cursor-pointer hover:bg-black/95 hover:scale-105 transition-all shadow-black/80"
                    >
                      <VolumeX className="w-4 h-4 text-amber-400 animate-bounce" />
                      <span>Tap to Unmute Audio</span>
                    </button>
                  </div>
                )}

                {/* Spacer to push controls to bottom */}
                <div className="flex-1 pointer-events-none" />

                {/* =================================================================== */}
                {/* 5. BOTTOM OVERLAY: Creator Info + Right Action Stack                */}
                {/* =================================================================== */}
                {viewMode === "instagram" && (
                  <div className="relative z-30 px-3.5 pb-2 flex items-end justify-between gap-3">
                    
                    {/* Bottom-Left: Creator Avatar + Name + Audio Pill */}
                    <div className="flex-1 min-w-0 pb-1 text-white space-y-2">
                      {/* Creator Profile Row */}
                      <div className="flex items-center gap-2">
                        {/* Gradient Story Ring Avatar */}
                        <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md flex-shrink-0">
                          <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center">
                            {productImage ? (
                              <img src={productImage} alt={creatorName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-black text-amber-300">SU</span>
                            )}
                          </div>
                        </div>

                        {/* Username + Verified Badge */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs truncate max-w-[130px] drop-shadow-md text-white">
                              {creatorName}
                            </span>
                            <BadgeCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400 flex-shrink-0" />
                          </div>
                          <span className="text-[10px] text-white/80 block drop-shadow-sm font-medium">
                            {followerCount}
                          </span>
                        </div>

                        {/* Follow Button Pill */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); }}
                          className="ml-1 px-2.5 py-0.5 rounded-md border border-white/40 bg-white/10 backdrop-blur-md text-[10px] font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
                        >
                          Follow
                        </button>
                      </div>

                      {/* Caption removed from screen as requested */}
                      {/* Trending Audio Pill with Animated Sound Equalizer */}
                      <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md max-w-[210px] truncate">
                        <Music className="w-3 h-3 text-white flex-shrink-0" />
                        {/* 3-Bar Equalizer Animation */}
                        <div className="flex items-end gap-0.5 h-2.5 flex-shrink-0">
                          <div className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-full" />
                          <div className="w-0.5 bg-amber-300 rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-2" />
                          <div className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                        </div>
                        <span className="text-[11px] font-semibold text-white/90 truncate">
                          {trendingAudio}
                        </span>
                      </div>
                    </div>

                    {/* Right-Side Action Stack (Like, Comment, Share, Bookmark, Vinyl) */}
                    <div className="flex flex-col items-center gap-3.5 pb-1 flex-shrink-0">
                      {/* Heart (Like) */}
                      <button
                        type="button"
                        onClick={handleLikeToggle}
                        className="group flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-75"
                      >
                        <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition-all group-hover:bg-black/50">
                          <Heart 
                            className={`w-5 h-5 transition-colors ${
                              isLiked ? "text-red-500 fill-red-500 scale-110 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-white fill-none stroke-[2.2]"
                            }`} 
                          />
                        </div>
                        <span className="text-[10px] font-extrabold text-white drop-shadow">
                          {likesDisplayCount}
                        </span>
                      </button>

                      {/* Comment */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
                        className="group flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-75"
                      >
                        <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition-all group-hover:bg-black/50">
                          <MessageCircle className="w-5 h-5 text-white stroke-[2.2]" />
                        </div>
                        <span className="text-[10px] font-extrabold text-white drop-shadow">
                          {commentsDisplayCount}
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={handleShareClick}
                        className="group flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-75"
                      >
                        <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition-all group-hover:bg-black/50">
                          <Send className="w-4.5 h-4.5 text-white stroke-[2.2] -rotate-12" />
                        </div>
                        <span className="text-[10px] font-extrabold text-white drop-shadow">
                          Share
                        </span>
                      </button>

                      {/* Bookmark Save */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
                        className="group flex flex-col items-center cursor-pointer transition-transform active:scale-75"
                      >
                        <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition-all group-hover:bg-black/50">
                          <Bookmark 
                            className={`w-4.5 h-4.5 transition-colors ${
                              isSaved ? "text-amber-400 fill-amber-400" : "text-white stroke-[2.2]"
                            }`} 
                          />
                        </div>
                      </button>

                      {/* More (...) */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); }}
                        className="w-7 h-7 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Spinning Vinyl Record with Floating Music Notes */}
                      <div className="relative mt-0.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleToggleMute(); }}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-900 border-2 border-neutral-700/80 shadow-lg flex items-center justify-center animate-[spin_3.5s_linear_infinite]">
                          {productImage ? (
                            <img src={productImage} alt="disc" className="w-4.5 h-4.5 rounded-full object-cover" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                          )}
                        </div>
                        {/* Floating mini music note */}
                        <span className="absolute -top-2 -left-1 text-[11px] text-amber-300 animate-bounce pointer-events-none">
                          ♪
                        </span>
                      </div>

                    </div>
                  </div>
                )}

                {/* =================================================================== */}
                {/* 6. INSTAGRAM BOTTOM NAVIGATION BAR (Home, Search, +, Reels, User)   */}
                {/* =================================================================== */}
                {viewMode === "instagram" && (
                  <div className="relative z-30 px-6 py-2.5 bg-black/70 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-white/80">
                    <Home className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
                    <Search className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
                    <PlusSquare className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
                    <div className="relative cursor-pointer">
                      <Film className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="w-5 h-5 rounded-full border border-white/50 overflow-hidden cursor-pointer">
                      {productImage ? (
                        <img src={productImage} alt="profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full text-white/80 p-0.5" />
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom Gesture Bar */}
                <div className="w-28 h-1 bg-white/50 rounded-full mx-auto my-1.5 z-30 pointer-events-none" />

                {/* =================================================================== */}
                {/* 7. SLIDE-UP COMMENTS DRAWER                                         */}
                {/* =================================================================== */}
                {showComments && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-x-0 bottom-0 h-[65%] bg-neutral-900/95 backdrop-blur-xl rounded-t-3xl border-t border-white/15 p-4 z-50 flex flex-col justify-between shadow-2xl animate-[slide-up_0.3s_ease-out]"
                  >
                    <div>
                      {/* Drawer Handle */}
                      <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3" />
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <span>Comments</span>
                          <span className="text-neutral-400 font-normal">({commentsDisplayCount})</span>
                        </h4>
                        <button 
                          type="button"
                          onClick={() => setShowComments(false)}
                          className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Mock Verified Buyer Comments */}
                      <div className="mt-3 space-y-3 overflow-y-auto max-h-[160px] pr-1">
                        <div className="flex items-start gap-2.5 text-xs text-white">
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                            R
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[11px] text-white/90">rohit_verma</span>
                              <span className="text-[9px] text-neutral-400">1h</span>
                            </div>
                            <p className="text-[11px] text-neutral-300 mt-0.5">Quality looks absolutely insane! Is cash on delivery available? 🔥</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs text-white">
                          <div className="w-6 h-6 rounded-full bg-pink-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                            P
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[11px] text-white/90">priya.sharma</span>
                              <span className="text-[9px] text-neutral-400">3h</span>
                            </div>
                            <p className="text-[11px] text-neutral-300 mt-0.5">Just placed order for this! Exactly what I was looking for 😍✨</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs text-white">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                            A
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[11px] text-white/90">ananya_style</span>
                              <span className="text-[9px] text-neutral-400">5h</span>
                            </div>
                            <p className="text-[11px] text-neutral-300 mt-0.5">Price kitna hai? DM check please 🙏</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Comment Input */}
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className="flex-1 bg-white/10 text-white placeholder-neutral-400 text-xs px-3 py-1.5 rounded-full border border-white/10 outline-none focus:border-purple-400" 
                      />
                      <button type="button" className="text-xs font-bold text-purple-400 hover:text-purple-300 px-2 py-1 cursor-pointer">
                        Post
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Link Copied Toast Notification */}
            {showShareToast && (
              <div className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg shadow-purple-500/30 flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instagram Reel link copied to clipboard!</span>
              </div>
            )}

            {/* Quick Helper Text */}
            <p className="text-xs text-text-muted text-center mt-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Tap to pause/play &bull; Double-tap to heart &bull; Click sound button to unmute
            </p>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Script Intelligence, Captions, Hashtags & Social Publishing */}
          {/* ========================================================================= */}
          <div className="w-full xl:w-1/2 flex flex-col relative z-20 space-y-6">
            
            {/* 1. Product & Hook Card */}
            <div className="bg-surface-elevated/70 backdrop-blur-md p-6 rounded-2xl border border-border shadow-md space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-md border border-brand-purple/20">
                    AI Optimized Reel Script
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-2 leading-tight">
                    {result.script?.title || productName}
                  </h3>
                </div>
                {result.script?.cta && (
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md">
                    {result.script.cta}
                  </span>
                )}
              </div>

              {/* Hook Quote Box */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <span className="text-3xl text-brand-purple/70 font-serif leading-none">&ldquo;</span>
                <div>
                  <p className="text-base text-white/95 italic font-semibold leading-relaxed">
                    {rawHook}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1 font-normal">
                    Proven opening hook engineered to stop thumbs in the first 3 seconds
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Suggested Caption Box */}
            {result.caption && (
              <div className="bg-surface-elevated/70 backdrop-blur-md p-6 rounded-2xl border border-border shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Suggested Caption
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCaption ? "Copied!" : "Copy Caption"}</span>
                  </button>
                </div>
                <p className="text-white whitespace-pre-wrap leading-relaxed text-sm bg-black/30 p-4 rounded-xl border border-white/5 font-normal">
                  {result.caption}
                </p>
              </div>
            )}

            {/* 3. Viral Hashtags */}
            {result.hashtags && result.hashtags.length > 0 && (
              <div className="bg-surface-elevated/70 backdrop-blur-md p-6 rounded-2xl border border-border shadow-md">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                  High-Reach Instagram Hashtags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag) => (
                    <span 
                      key={tag} 
                      className="rounded-lg bg-black/40 border border-brand-purple/30 px-3 py-1.5 text-xs font-bold text-brand-purple shadow-sm hover:border-brand-purple transition-all cursor-default"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Action Buttons (Download HD, Publish to IG / FB, Create New) */}
            <div className="pt-4 space-y-4 border-t border-border/80">
              {publishSuccessMessage && (
                <div className="w-full rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 p-4 text-center font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> {publishSuccessMessage}
                </div>
              )}
              {publishErrorMessage && (
                <div className="w-full rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-center font-bold flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" /> {publishErrorMessage}
                </div>
              )}

              <div className={`grid gap-3 ${hasRealVideo ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                {hasRealVideo && (
                  <a
                    href={videoUrl}
                    download={`${(productName || "reel").replace(/[^a-zA-Z0-9]/g, "_")}.mp4`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 rounded-xl bg-[#0a142c] hover:bg-[#111e40] border border-border px-4 py-3.5 font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm text-sm"
                  >
                    <Download className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>Download HD</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setShowPublishModal(true)}
                  className="flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-4 py-3.5 font-bold text-white hover:opacity-95 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-purple-500/25 cursor-pointer text-sm"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Publish Reel</span>
                </button>

                <button
                  type="button"
                  onClick={onReset}
                  className="flex justify-center items-center gap-2 rounded-xl bg-surface border border-border px-4 py-3.5 font-bold text-white hover:bg-surface-elevated transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
                >
                  <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
                  <span>Generate Another</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Scene-by-Scene Visual Breakdown (Below Fold) */}
        {scenes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Scene-by-Scene Visual Storyboard
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Individual scene script, pacing, voiceover prompts, and visual camera direction
                </p>
              </div>
              <button
                type="button"
                onClick={openPreview}
                className="flex items-center gap-2 text-xs font-bold text-brand-purple bg-brand-purple/10 px-4 py-2 rounded-xl border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-all cursor-pointer"
              >
                <span>Interactive Storyboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scenes.map((scene: any) => (
                <div 
                  key={scene.scene_number} 
                  className="bg-surface-elevated/60 backdrop-blur-sm rounded-2xl p-5 border border-border hover:border-brand-purple/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                        Scene {scene.scene_number}
                      </span>
                      <span className="text-xs text-text-muted font-bold">
                        {scene.duration_seconds}s
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 block">
                          Camera &amp; Visual
                        </span>
                        <p className="text-xs text-neutral-300 leading-relaxed mt-0.5">
                          {scene.visual}
                        </p>
                      </div>

                      {scene.voiceover && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-pink-400 block">
                            Voiceover
                          </span>
                          <p className="text-xs text-white/90 italic leading-relaxed mt-0.5 bg-black/30 p-2.5 rounded-lg border border-white/5">
                            &ldquo;{scene.voiceover}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {scene.on_screen_text && (
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">
                        Text Badge
                      </span>
                      <span className="inline-block text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 mt-1">
                        {scene.on_screen_text}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Interactive Scene Preview Modal */}
      {isPreviewOpen && scenes.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-sm mx-auto"
            style={{ aspectRatio: "9/16", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 rounded-[40px] overflow-hidden border-4 border-neutral-800 shadow-2xl bg-black">
              {productImage ? (
                <img src={productImage} alt={productName} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

              {/* Progress Bars */}
              <div className="absolute top-6 left-4 right-4 flex gap-1 z-20">
                {scenes.map((_: any, i: number) => (
                  <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-white/20">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        i < currentScene ? 'bg-white w-full' : i === currentScene ? 'bg-amber-400 w-full' : 'bg-transparent w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Scene content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-20 space-y-4">
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-bold text-amber-400">
                  Scene {currentScene + 1} of {scenes.length}
                </span>

                {scenes[currentScene]?.voiceover && (
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 max-w-[280px]">
                    <p className="text-white text-sm font-semibold leading-relaxed">
                      &ldquo;{scenes[currentScene].voiceover}&rdquo;
                    </p>
                  </div>
                )}

                {scenes[currentScene]?.on_screen_text && (
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl px-4 py-2 border border-white/20 text-white font-black text-base shadow-lg">
                    {scenes[currentScene].on_screen_text}
                  </div>
                )}
              </div>

              {/* Nav buttons */}
              <div className="absolute bottom-6 left-4 right-4 flex justify-between items-center z-20">
                <button
                  type="button"
                  onClick={() => goToScene(Math.max(0, currentScene - 1))}
                  disabled={currentScene === 0}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/40 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white/80 text-xs font-bold">Tap to switch scenes</span>
                <button
                  type="button"
                  onClick={() => goToScene(Math.min(scenes.length - 1, currentScene + 1))}
                  disabled={currentScene === scenes.length - 1}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/40 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Island Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-30" />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={closePreview}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:bg-neutral-200 transition-all cursor-pointer z-30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Publish Platform Selection Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0b1630] border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-brand-purple" /> Select Platform to Publish Reel
              </h3>
              <button 
                type="button"
                onClick={() => { setShowPublishModal(false); setPublishErrorMessage(null); }}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {publishErrorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="flex-1 leading-relaxed">{publishErrorMessage}</span>
                </div>
                {publishErrorMessage.toLowerCase().includes("not connected") && (
                  <div className="pt-1 flex gap-2">
                    <a
                      href="/social-platforms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-[11px] font-bold transition-colors"
                    >
                      Connect Account in Settings &rarr;
                    </a>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-text-muted">Choose which platform you want to publish this reel to:</p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handlePublish('instagram')}
                disabled={isPublishingInstagram || isPublishingFacebook || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isPublishingInstagram ? (
                  <><Loader2 className="w-5 h-5 animate-spin shrink-0" /> Publishing to Instagram...</>
                ) : (
                  <>
                    <InstagramIcon className="w-5 h-5 shrink-0" />
                    Publish to Instagram
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handlePublish('facebook')}
                disabled={isPublishingFacebook || isPublishingInstagram || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isPublishingFacebook ? (
                  <><Loader2 className="w-5 h-5 animate-spin shrink-0" /> Publishing to Facebook...</>
                ) : (
                  <>
                    <FacebookIcon className="w-5 h-5 shrink-0" />
                    Publish to Facebook
                  </>
                )}
              </button>



              <button
                type="button"
                onClick={() => handlePublish('linkedin')}
                disabled={isPublishingLinkedIn || isPublishingInstagram || isPublishingFacebook}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#095196] text-white font-bold transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isPublishingLinkedIn ? (
                  <><Loader2 className="w-5 h-5 animate-spin shrink-0" /> Opening LinkedIn...</>
                ) : (
                  <>
                    <LinkedinIcon className="w-5 h-5 shrink-0" />
                    Publish to LinkedIn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
