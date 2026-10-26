"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Music, 
  Wand2, 
  CheckCircle2,
  Share2,
  Radio,
  Send,
  PartyPopper,
  Check
} from 'lucide-react';

interface ReelPreset {
  id: string;
  label: string;
  prompt: string;
  videoUrl: string;
  tag: string;
  category: string;
  likes: string;
  comments: string;
  shares: string;
  musicTitle: string;
  targetAudience: string;
}

// 100% genuine vertical 9:16 videos tailored specifically for:
// 1. Fashion & Clothing Businesses (Runway Couture Designer Model)
// 2. Businessmen & Startup Founders (Keynote Speaker in Suit)
// 3. Fashion Influencers & Creators (Chic Outfit Lifestyle Reel)
// 4. Urban Streetwear D2C Brands (Beat-Synced Streetwear Creator)
const PRESET_REELS: ReelPreset[] = [
  {
    id: 'fashion-couture',
    label: '👗 Luxury Fashion Runway',
    prompt: 'A high-fashion runway model showcasing an exclusive metallic couture designer collection under cinematic studio runway lighting.',
    videoUrl: '/reels/fashion_runway_reel.mp4',
    tag: '#FashionAI',
    category: 'Clothing & Fashion Brands',
    likes: '194.2K',
    comments: '2,140',
    shares: '48.6K',
    musicTitle: 'Paris Runway Beats • DhandaGrow AI',
    targetAudience: 'Clothing & Fashion Boutiques'
  },
  {
    id: 'businessman-founder',
    label: '👔 Businessman & Keynote',
    prompt: 'A confident corporate entrepreneur in a formal tailored suit delivering a high-impact keynote on 10x business scaling, revenue growth, and leadership.',
    videoUrl: '/reels/businessman_founder_speech.mp4',
    tag: '#FounderKeynote',
    category: 'Business & Leadership',
    likes: '312.8K',
    comments: '3,890',
    shares: '71.4K',
    musicTitle: 'Leadership Momentum • Executive Audio',
    targetAudience: 'Businessmen & Founders'
  },
  {
    id: 'influencer-lifestyle',
    label: '📱 Fashion Creator Reel',
    prompt: 'Viral Instagram fashion creator doing an aesthetic lifestyle reel showcasing chic casual summer outfits with dynamic beat-synced motion.',
    videoUrl: '/reels/influencer_outfit_reel.mp4',
    tag: '#OOTDReel',
    category: 'Influencers & Creators',
    likes: '248.5K',
    comments: '3,120',
    shares: '56.3K',
    musicTitle: 'Summer Aesthetics • Trending Sound',
    targetAudience: 'Fashion Creators & Influencers'
  },
  {
    id: 'streetwear-urban',
    label: '🧢 Urban Streetwear Launch',
    prompt: 'High-energy urban streetwear clothing launch reel for Instagram & TikTok featuring dynamic beat cuts and modern neon aesthetic.',
    videoUrl: '/reels/streetwear_creator_reel.mp4',
    tag: '#StreetwearBrand',
    category: 'D2C Apparel Brands',
    likes: '185.6K',
    comments: '1,980',
    shares: '39.2K',
    musicTitle: 'Tokyo Bass Drift • Viral Mix',
    targetAudience: 'D2C Clothing Brands'
  }
];

type ShowcasePhase = 'typing' | 'tap_button' | 'generating' | 'playing' | 'publishing' | 'published_popup';

interface SocialPlatform {
  id: string;
  name: string;
  type: string;
  color: string;
  bgGradient: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    type: 'Reels (9:16)',
    color: '#E1306C',
    bgGradient: 'from-amber-500 via-rose-500 to-purple-600'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    type: 'Reels & Watch',
    color: '#1877F2',
    bgGradient: 'from-blue-600 to-blue-500'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    type: 'Video Feed',
    color: '#0A66C2',
    bgGradient: 'from-sky-700 to-blue-600'
  },
  {
    id: 'youtube',
    name: 'YouTube Shorts',
    type: 'Shorts 4K',
    color: '#FF0000',
    bgGradient: 'from-red-600 to-rose-600'
  }
];

export function Features() {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  
  // Showcase Phase Machine:
  // typing -> tap_button -> generating -> playing -> publishing -> published_popup -> next preset
  const [phase, setPhase] = useState<ShowcasePhase>('typing');
  
  const [generatingProgress, setGeneratingProgress] = useState<number>(0);
  const [generationStage, setGenerationStage] = useState<string>('');
  
  // Published platforms progress
  const [publishedPlatforms, setPublishedPlatforms] = useState<string[]>([]);
  const [publishingProgress, setPublishingProgress] = useState<number>(0);

  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(PRESET_REELS[0].videoUrl);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activePreset = PRESET_REELS[activePresetIndex];

  // Self-running Autonomous Showcase Loop with bulletproof timer tracking
  useEffect(() => {
    let isCancelled = false;
    const timers: NodeJS.Timeout[] = [];

    const safeTimeout = (cb: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (!isCancelled) cb();
      }, delay);
      timers.push(id);
      return id;
    };

    const preset = PRESET_REELS[activePresetIndex];
    const targetText = preset.prompt;

    // Sync video URL immediately with active preset
    setCurrentVideoUrl(preset.videoUrl);
    setDisplayedText('');
    setPhase('typing');
    setGeneratingProgress(0);
    setPublishedPlatforms([]);
    setPublishingProgress(0);

    let charIdx = 0;

    // STEP 1: Auto-Type Prompt character by character (recursive safeTimeout avoids setInterval flooding)
    const typeNextChar = () => {
      if (isCancelled) return;
      charIdx++;
      setDisplayedText(targetText.slice(0, charIdx));

      if (charIdx < targetText.length) {
        safeTimeout(typeNextChar, 22);
      } else {
        // STEP 2: Auto-Tap "Generate Reel" Button
        safeTimeout(() => {
          setPhase('tap_button');

          safeTimeout(() => {
            // STEP 3: Circular Spinner inside Phone
            setPhase('generating');
            setGeneratingProgress(12);
            setGenerationStage('Interpreting prompt & visual styling...');

            const stages = [
              { p: 32, msg: 'Synthesizing 3D character motion & physics...' },
              { p: 62, msg: 'Generating dynamic 9:16 vertical camera path...' },
              { p: 88, msg: 'Rendering 1080p 60fps high-impact AI reel...' },
              { p: 98, msg: 'Finalizing color grading & audio sync...' },
              { p: 100, msg: 'Reel ready! Playing preview...' }
            ];

            let stageStep = 0;
            const runProgressStage = () => {
              if (isCancelled) return;
              if (stageStep < stages.length) {
                setGeneratingProgress(stages[stageStep].p);
                setGenerationStage(stages[stageStep].msg);
                stageStep++;
                safeTimeout(runProgressStage, 380);
              } else {
                // STEP 4: Video Plays inside Smartphone
                safeTimeout(() => {
                  setPhase('playing');
                  setGeneratingProgress(100);

                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(() => {});
                  }

                  // Play video for 6.5 seconds, then transition to Auto-Publishing animation
                  safeTimeout(() => {
                    // STEP 5: "Publishing on Facebook, Instagram, LinkedIn & Shorts"
                    setPhase('publishing');
                    setPublishedPlatforms([]);
                    setPublishingProgress(15);

                    // Platform 1: Instagram
                    safeTimeout(() => {
                      setPublishedPlatforms((prev) => [...prev, 'instagram']);
                      setPublishingProgress(40);

                      // Platform 2: Facebook
                      safeTimeout(() => {
                        setPublishedPlatforms((prev) => [...prev, 'facebook']);
                        setPublishingProgress(65);

                        // Platform 3: LinkedIn
                        safeTimeout(() => {
                          setPublishedPlatforms((prev) => [...prev, 'linkedin']);
                          setPublishingProgress(85);

                          // Platform 4: YouTube Shorts
                          safeTimeout(() => {
                            setPublishedPlatforms((prev) => [...prev, 'youtube']);
                            setPublishingProgress(100);

                            // STEP 6: "Successfully Published! 🎉" Celebration Modal
                            safeTimeout(() => {
                              setPhase('published_popup');

                              // Display Celebration Popup for 3.2 seconds, then cycle to next preset
                              safeTimeout(() => {
                                setActivePresetIndex((prev) => (prev + 1) % PRESET_REELS.length);
                              }, 3200);

                            }, 450);

                          }, 500);

                        }, 500);

                      }, 500);

                    }, 450);

                  }, 6500);

                }, 250);
              }
            };

            safeTimeout(runProgressStage, 380);

          }, 300);

        }, 550);
      }
    };

    safeTimeout(typeNextChar, 22);

    return () => {
      isCancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [activePresetIndex]);

  // Video play watcher
  useEffect(() => {
    if (videoRef.current) {
      if (phase === 'playing' || phase === 'typing') {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentVideoUrl, phase]);

  return (
    <section id="features" className="pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-14 bg-gradient-to-b from-[#f9faff] via-white to-[#f8f9fe] border-y border-slate-100 relative overflow-hidden select-none scroll-mt-20">
      <div id="ai-reels" className="absolute -top-24 left-0" />
      
      {/* Soft Ambient Glow in White Theme */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-100/35 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[350px] bg-purple-100/40 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ============================================================
              LEFT COLUMN: Pure White Theme Studio with Auto-Typing
              Pointer events disabled so user cannot edit or trigger redirects
             ============================================================ */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 pointer-events-none select-none cursor-default pt-1 sm:pt-2">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-xs sm:text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED]">
                AI Reel Generator & Multi-Channel Publisher
              </span>
            </div>

            {/* High-Contrast White Theme Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.12] mb-3.5 tracking-tight">
              Create & Auto-Publish <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED]">
                High-Converting AI Reels
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-7 leading-relaxed font-medium max-w-xl">
              From clothing brands and business founders to top influencers — watch our AI turn creative prompts into 9:16 vertical reels and auto-publish them across Instagram, Facebook, and LinkedIn.
            </p>

            {/* Studio Card (Purely animated autonomous display) */}
            <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(124,58,237,0.06),0_2px_8px_rgba(0,0,0,0.02)] transition-all">
              
              {/* Studio Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                  Creative Video Prompt
                </label>
                
                {/* Active Category Chip */}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200/70">
                  {activePreset.category}
                </span>
              </div>

              {/* Auto-Typing Textarea Mockup */}
              <div className="relative mb-4">
                <div className="w-full min-h-[96px] p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium leading-relaxed shadow-inner">
                  <span>{displayedText}</span>
                  {phase === 'typing' && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-[#7C3AED] animate-pulse align-middle" />
                  )}
                </div>
              </div>

              {/* Preset Selector Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {PRESET_REELS.map((preset, index) => {
                  const isActive = index === activePresetIndex;
                  return (
                    <div
                      key={preset.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                          : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      <span>{preset.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Auto-Tapping Generate Button */}
              <div
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md ${
                  phase === 'tap_button'
                    ? 'scale-[0.98] ring-4 ring-orange-300 bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white'
                    : phase === 'generating'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : phase === 'publishing'
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : phase === 'published_popup'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white'
                }`}
              >
                {phase === 'generating' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering AI Reel ({generatingProgress}%)...</span>
                  </>
                ) : phase === 'publishing' ? (
                  <>
                    <Send className="w-4 h-4 animate-bounce" />
                    <span>Auto-Publishing Across Channels ({publishingProgress}%)...</span>
                  </>
                ) : phase === 'published_popup' ? (
                  <>
                    <PartyPopper className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <span>Published Successfully to All Channels!</span>
                  </>
                ) : phase === 'playing' ? (
                  <>
                    <Radio className="w-4 h-4 text-rose-300 animate-pulse" />
                    <span>Playing AI Reel Preview...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Reel</span>
                  </>
                )}
              </div>

              {/* Live Distribution Status Indicators */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${phase === 'published_popup' ? 'bg-emerald-500' : phase === 'publishing' ? 'bg-blue-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                  {phase === 'publishing' ? '1-Click Multi-Channel Distribution' : phase === 'published_popup' ? 'Live on 4 Major Platforms' : 'Target: ' + activePreset.targetAudience}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">IG</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">FB</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">LinkedIn</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Shorts</span>
                </div>
              </div>

            </div>

            {/* Feature Trust Badges */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mt-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">1080p</p>
                <p className="text-[11px] font-semibold text-slate-500">60 FPS 9:16 Video</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">Virtual Model</p>
                <p className="text-[11px] font-semibold text-slate-500">Fashion & Founders</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">1-Click</p>
                <p className="text-[11px] font-semibold text-slate-500">Auto-Publish</p>
              </div>
            </div>

          </div>

          {/* ============================================================
              RIGHT COLUMN: Smartphone Mockup with Autonomous Preview,
              Circular Spinner, and Multi-Platform Publishing Animation
             ============================================================ */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start w-full">
            
            {/* Realistic Smartphone Chassis */}
            <div className="relative w-full max-w-[325px] sm:max-w-[340px] bg-slate-900 rounded-[48px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800">
              
              {/* Outer Phone Bezel Highlights */}
              <div className="absolute inset-0 rounded-[48px] border-2 border-white/20 pointer-events-none" />

              {/* Inner Smartphone Screen */}
              <div className="relative w-full aspect-[9/19] rounded-[40px] overflow-hidden bg-black flex flex-col justify-between">
                
                {/* 1. Pure 9:16 Vertical Video Element (No split screens, no GIFs) */}
                <video
                  ref={videoRef}
                  src={currentVideoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    phase === 'generating' ? 'opacity-20 filter blur-[4px]' : 'opacity-100'
                  }`}
                />

                {/* 2. Top Screen Bar with Dynamic Island */}
                <div className="absolute top-0 inset-x-0 pt-3 px-4 flex items-center justify-between z-30 pointer-events-none">
                  <span className="text-[11px] font-bold text-white/90 drop-shadow-md">
                    9:41
                  </span>

                  {/* Dynamic Island */}
                  <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-end pr-2.5 shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-blue-900/60" />
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400 drop-shadow-md">
                    5G
                  </span>
                </div>

                {/* 3. CIRCULAR SPINNER IN PHONE PREVIEW ("device preview m genarte reel ka circle m ghume") */}
                {phase === 'generating' && (
                  <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center px-6 text-center animate-fadeIn pointer-events-none">
                    
                    {/* Rotating Circular Progress Ring */}
                    <div className="relative w-28 h-28 flex items-center justify-center mb-5">
                      {/* Ambient Rotating Glow Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF6B00] via-[#E11D48] to-[#7C3AED] blur-lg opacity-40 animate-pulse" />
                      
                      {/* SVG Circle Spinner */}
                      <svg className="w-28 h-28 -rotate-90 animate-[spin_5s_linear_infinite]" viewBox="0 0 100 100">
                        {/* Background Track Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="stroke-white/15"
                          strokeWidth="7"
                          fill="transparent"
                        />
                        {/* Dynamic Progress Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#reel-circle-gradient)"
                          strokeWidth="7"
                          strokeLinecap="round"
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * generatingProgress) / 100}
                          className="transition-all duration-300 ease-out"
                        />
                        <defs>
                          <linearGradient id="reel-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF6B00" />
                            <stop offset="50%" stopColor="#E11D48" />
                            <stop offset="100%" stopColor="#7C3AED" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Inside Circle Content: Percentage */}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white tracking-tight">{generatingProgress}%</span>
                        <span className="text-[9px] font-extrabold uppercase text-[#FF6B00] tracking-wider">AI Render</span>
                      </div>
                    </div>

                    {/* Animated Sound Wave Bars */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-1 h-4 bg-[#FF6B00] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1 h-7 bg-[#E11D48] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-9 bg-[#7C3AED] rounded-full animate-bounce [animation-delay:-0.4s]" />
                      <div className="w-1 h-6 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                      <div className="w-1 h-8 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.35s]" />
                    </div>

                    <h4 className="text-sm font-black text-white mb-1 tracking-wide">Generating Reel</h4>
                    <p className="text-[11px] text-white/80 leading-tight max-w-[210px] font-medium">
                      {generationStage}
                    </p>
                  </div>
                )}

                {/* 4. Realistic Instagram Reel HUD Overlay (Visible during 'playing') */}
                <div className={`absolute inset-x-0 bottom-0 p-3.5 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end transition-opacity duration-300 pointer-events-none ${
                  phase === 'playing' ? 'opacity-100' : 'opacity-0'
                }`}>
                  
                  <div className="flex items-end justify-between gap-3">
                    
                    {/* Left: Account & Caption */}
                    <div className="flex-1 space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 p-[1.5px] shrink-0">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white">
                            DG
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white tracking-wide drop-shadow-sm flex items-center gap-1">
                          dhandagrow.ai
                          <span className="w-3 h-3 rounded-full bg-blue-500 text-[8px] text-white flex items-center justify-center font-bold">✓</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-white/95 line-clamp-2 leading-snug font-medium drop-shadow-sm">
                        {activePreset.prompt}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/80 pt-0.5">
                        <Music className="w-3 h-3 text-[#FF6B00]" />
                        <span className="truncate max-w-[140px]">{activePreset.musicTitle}</span>
                      </div>
                    </div>

                    {/* Right: Instagram Actions */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      {/* Like */}
                      <div className="flex flex-col items-center gap-0.5 text-white">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        </div>
                        <span className="text-[10px] font-bold text-white">{activePreset.likes}</span>
                      </div>

                      {/* Comment */}
                      <div className="flex flex-col items-center gap-0.5 text-white">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-white">{activePreset.comments}</span>
                      </div>

                      {/* Share */}
                      <div className="flex flex-col items-center gap-0.5 text-white">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-white">{activePreset.shares}</span>
                      </div>

                      {/* Spinning Vinyl Disc */}
                      <div className="w-7 h-7 rounded-full bg-neutral-900 border-2 border-white/50 p-1 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600" />
                      </div>
                    </div>

                  </div>

                  {/* Scrubber Timeline Bar */}
                  <div className="w-full h-1 bg-white/30 rounded-full mt-2.5 overflow-hidden">
                    <div className="h-full bg-white rounded-full animate-[progress_6.5s_linear]" />
                  </div>

                </div>

                {/* ============================================================
                    5. AUTO-PUBLISHING TO SOCIAL MEDIA ANIMATION
                    Triggers right after the video finishes playing!
                   ============================================================ */}
                {phase === 'publishing' && (
                  <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col justify-between p-5 text-white animate-fadeIn pointer-events-none">
                    
                    {/* Header */}
                    <div className="pt-8 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                        <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
                        Multi-Channel Sync
                      </div>
                      <h4 className="text-base font-black tracking-tight text-white">
                        Publishing to Channels...
                      </h4>
                      <p className="text-[11px] text-white/70 mt-0.5 font-medium">
                        Syncing vertical 9:16 format & hashtags
                      </p>
                    </div>

                    {/* Social Media Channel Sync List */}
                    <div className="space-y-2.5 my-auto">
                      {SOCIAL_PLATFORMS.map((platform) => {
                        const isDone = publishedPlatforms.includes(platform.id);
                        return (
                          <div
                            key={platform.id}
                            className={`p-2.5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                              isDone
                                ? 'bg-white/10 border-emerald-500/50 shadow-xs'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Brand Icon Badge */}
                              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${platform.bgGradient} flex items-center justify-center shrink-0 shadow-xs`}>
                                {platform.id === 'instagram' && (
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" className="stroke-white" strokeWidth="2" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" className="stroke-white" strokeWidth="2" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                                {platform.id === 'facebook' && (
                                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                )}
                                {platform.id === 'linkedin' && (
                                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                )}
                                {platform.id === 'youtube' && (
                                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                )}
                              </div>

                              <div className="text-left">
                                <p className="text-xs font-bold text-white leading-tight">
                                  {platform.name}
                                </p>
                                <p className="text-[10px] text-white/60 font-medium">
                                  {platform.type}
                                </p>
                              </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-1.5">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  Published
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/50">
                                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  <span>Syncing...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall Distribution Progress Bar */}
                    <div className="pb-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-white/80 mb-1.5">
                        <span>Multi-Platform Sync</span>
                        <span>{publishingProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 via-rose-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${publishingProgress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ============================================================
                    6. "SUCCESSFULLY PUBLISHED!" CELEBRATION POPUP
                    Shows celebratory modal with live reach and multi-channel chips!
                   ============================================================ */}
                {phase === 'published_popup' && (
                  <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center text-white animate-fadeIn pointer-events-none">
                    
                    {/* Celebration Popup Card */}
                    <div className="w-full bg-gradient-to-b from-slate-900/95 to-black/95 border border-emerald-500/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(16,185,129,0.25)] relative overflow-hidden">
                      
                      {/* Top Emerald Accent Glow */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500" />
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-500/25 blur-2xl rounded-full" />

                      {/* Animated Success Check Icon */}
                      <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Success Headline */}
                      <h3 className="text-base font-black text-white tracking-tight mb-1">
                        🎉 Reel Published!
                      </h3>
                      <p className="text-[11px] text-emerald-300 font-semibold mb-3">
                        Live Across All 4 Connected Platforms
                      </p>

                      {/* Live Platform Chips */}
                      <div className="grid grid-cols-2 gap-1.5 mb-3.5">
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1.5 rounded-xl border border-white/10 text-left">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-white truncate">Instagram Reels</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1.5 rounded-xl border border-white/10 text-left">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-white truncate">Facebook Watch</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1.5 rounded-xl border border-white/10 text-left">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-white truncate">LinkedIn Video</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1.5 rounded-xl border border-white/10 text-left">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-white truncate">YouTube Shorts</span>
                        </div>
                      </div>

                      {/* Reach & Analytics Metric Highlight */}
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 mb-3 text-left">
                        <div className="flex items-center justify-between text-[10px] text-emerald-200/90 font-medium">
                          <span>⚡ Peak Audience Slot</span>
                          <span className="font-bold text-emerald-300">Auto-Scheduled</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-white mt-1">
                          <span>Est. Initial Reach</span>
                          <span className="text-emerald-400 font-mono">~45K-80K Views</span>
                        </div>
                      </div>

                      {/* Next Reel Loop Countdown Badge */}
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-white/60">
                        <div className="w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating Next AI Reel...</span>
                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* Bottom Phone Bar */}
              <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-2" />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
