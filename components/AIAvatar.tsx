"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Radio, 
  Send, 
  PartyPopper, 
  Check,
  CheckCircle2,
  UserCheck,
  Volume2,
  Mic,
  Languages,
  Film,
  Play
} from 'lucide-react';

interface AvatarPreset {
  id: string;
  label: string;
  avatarName: string;
  avatarRole: string;
  script: string;
  videoUrl: string;
  voiceName: string;
  voiceLanguage: string;
  category: string;
  targetAudience: string;
  subtitles: string;
  resolution: string;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'founder-pitch',
    label: '👔 Founder Keynote Avatar',
    avatarName: 'Vikram Mehta',
    avatarRole: 'Executive Founder Avatar',
    script: 'Scaling a business requires repeatable automated systems. DhandaGrow AI runs your marketing, reels, and ads 24/7 autonomously.',
    videoUrl: '/reels/businessman_founder_speech.mp4',
    voiceName: 'Arjun Pro',
    voiceLanguage: 'Hinglish / English (Executive)',
    category: 'Founders & Enterprise Leaders',
    targetAudience: 'CEOs, Founders & Startups',
    subtitles: '"DhandaGrow AI runs your marketing, reels & ads 24/7 autonomously."',
    resolution: '1080p 60fps • 4K Neural'
  },
  {
    id: 'fashion-ambassador',
    label: '👗 Boutique Fashion Host',
    avatarName: 'Ananya Sharma',
    avatarRole: 'Luxury Brand Ambassador',
    script: 'Festive Season Luxury Sale is LIVE! Flat 40% OFF on all handcrafted Banarasi silks and bridal designer sarees. Tap WhatsApp link below to order!',
    videoUrl: '/reels/fashion_runway_reel.mp4',
    voiceName: 'Priya Studio',
    voiceLanguage: 'Hindi / Hinglish (Warm & Friendly)',
    category: 'Clothing Brands & Retail',
    targetAudience: 'Fashion Stores & Boutiques',
    subtitles: '"Flat 40% OFF on handcrafted Banarasi silks. Order via WhatsApp!"',
    resolution: '1080p 60fps • Studio HDR'
  },
  {
    id: 'tech-founder-demo',
    label: '🚀 Tech Entrepreneur Pitch',
    avatarName: 'Kabir Singhania',
    avatarRole: 'SaaS Growth Specialist',
    script: 'Stop spending lakhs on agencies. Generate viral reels, ad creatives, and 8K photoshoots in seconds with AI.',
    videoUrl: '/reels/businessman_avatar_3.mp4',
    voiceName: 'Rohan Ultra',
    voiceLanguage: 'Indian English (High-Energy)',
    category: 'Tech & Modern Businesses',
    targetAudience: 'Online Brands & Sellers',
    subtitles: '"Generate viral reels, ad creatives & 8K photoshoots in seconds."',
    resolution: '1080p 60fps • Neural LipSync'
  },
  {
    id: 'streetwear-host',
    label: '🧢 Gen-Z Creator Avatar',
    avatarName: 'Aaryan Deshmukh',
    avatarRole: 'D2C Brand Host',
    script: 'Yo guys! Urban Desi heavy-cotton drop is finally here. Flat 599 with free Pan-India Cash on Delivery. Tap link before stock ends!',
    videoUrl: '/reels/streetwear_creator_reel.mp4',
    voiceName: 'Dev Dynamic',
    voiceLanguage: 'Hinglish (Conversational)',
    category: 'D2C Apparel Brands',
    targetAudience: 'Youth & Streetwear Brands',
    subtitles: '"Urban Desi heavy-cotton drop is here. Flat 599 with Free COD!"',
    resolution: '1080p 60fps • Mobile Vertical'
  }
];

type AvatarPhase = 'typing' | 'tap_button' | 'generating' | 'playing' | 'publishing' | 'published_popup';

interface AvatarPublishChannel {
  id: string;
  name: string;
  format: string;
  gradient: string;
}

const AVATAR_CHANNELS: AvatarPublishChannel[] = [
  {
    id: 'youtube',
    name: 'YouTube Shorts',
    format: '9:16 Vertical HD • Auto-Subtitles',
    gradient: 'from-red-600 to-rose-700'
  },
  {
    id: 'instagram',
    name: 'Instagram Reels',
    format: 'Beat-Synced Voice • High Retention',
    gradient: 'from-amber-500 via-rose-500 to-purple-600'
  },
  {
    id: 'facebook',
    name: 'Facebook Video Feed',
    format: 'Sponsored Pitch Ad Video',
    gradient: 'from-blue-600 to-blue-500'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Status & Broadcast',
    format: 'HD Compressed Mobile Video',
    gradient: 'from-emerald-500 to-green-600'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Video Post',
    format: 'Thought Leadership Keynote',
    gradient: 'from-sky-700 to-blue-600'
  }
];

// QWERTY keyboard layout rows
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ['123', '🌐', 'space', 'Return']
];

export function AIAvatar() {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  
  // Phase state machine:
  // typing -> tap_button -> generating -> playing -> publishing -> published_popup -> next preset
  const [phase, setPhase] = useState<AvatarPhase>('typing');
  
  const [generatingProgress, setGeneratingProgress] = useState<number>(0);
  const [generatingStage, setGeneratingStage] = useState<string>('');
  
  const [publishedChannels, setPublishedChannels] = useState<string[]>([]);
  const [publishingProgress, setPublishingProgress] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activePreset = AVATAR_PRESETS[activePresetIndex];

  // Derived active key for virtual keyboard glow - No separate setState needed!
  const activeKey = 
    phase === 'tap_button' 
      ? 'Return' 
      : phase === 'typing' && displayedText.length > 0
      ? (displayedText[displayedText.length - 1] === ' ' ? 'space' : displayedText[displayedText.length - 1].toUpperCase())
      : '';

  // Autonomous showcase loop
  useEffect(() => {
    let isCancelled = false;
    let typingInterval: NodeJS.Timeout | null = null;
    let progressInterval: NodeJS.Timeout | null = null;
    let timeoutRef: NodeJS.Timeout | null = null;

    const preset = AVATAR_PRESETS[activePresetIndex];
    const targetText = preset.script;

    // Reset state for new preset cycle
    setDisplayedText('');
    setPhase('typing');
    setGeneratingProgress(0);
    setPublishedChannels([]);
    setPublishingProgress(0);

    let charIdx = 0;

    // STEP 1: Auto-type avatar script with Virtual Keyboard OPEN on device
    typingInterval = setInterval(() => {
      if (isCancelled) return;
      charIdx++;
      setDisplayedText(targetText.slice(0, charIdx));

      // When full script has been typed
      if (charIdx >= targetText.length) {
        if (typingInterval) clearInterval(typingInterval);

        // Pause showing full script, then auto-tap generate button
        timeoutRef = setTimeout(() => {
          if (isCancelled) return;
          setPhase('tap_button');

          // STEP 2: Virtual Keyboard slides down and closes! Voice & LipSync kicks in
          timeoutRef = setTimeout(() => {
            if (isCancelled) return;
            setPhase('generating');
            setGeneratingProgress(16);
            setGeneratingStage('Synthesizing studio voice & emotional tone...');

            const stages = [
              { p: 40, msg: 'Generating 3D phonetic mouth shapes & visemes...' },
              { p: 70, msg: 'Syncing micro-facial expressions & eye blinks...' },
              { p: 92, msg: 'Rendering 1080p 60fps photorealistic avatar...' },
              { p: 100, msg: 'AI Avatar video ready! Playing live preview...' }
            ];

            let stageStep = 0;
            progressInterval = setInterval(() => {
              if (isCancelled) return;
              if (stageStep < stages.length) {
                setGeneratingProgress(stages[stageStep].p);
                setGeneratingStage(stages[stageStep].msg);
                stageStep++;
              } else {
                if (progressInterval) clearInterval(progressInterval);

                // STEP 3: Video Plays with Avatar speaking the script
                timeoutRef = setTimeout(() => {
                  if (isCancelled) return;
                  setPhase('playing');
                  setGeneratingProgress(100);

                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(() => {});
                  }

                  // Play avatar video for 5.5 seconds, then auto-publish
                  timeoutRef = setTimeout(() => {
                    if (isCancelled) return;
                    
                    // STEP 4: Auto-Publishing across YouTube, Instagram, Facebook, WhatsApp, LinkedIn
                    setPhase('publishing');
                    setPublishedChannels([]);
                    setPublishingProgress(15);

                    // Channel 1: YouTube Shorts
                    timeoutRef = setTimeout(() => {
                      if (isCancelled) return;
                      setPublishedChannels((prev) => [...prev, 'youtube']);
                      setPublishingProgress(35);

                      // Channel 2: Instagram Reels
                      timeoutRef = setTimeout(() => {
                        if (isCancelled) return;
                        setPublishedChannels((prev) => [...prev, 'instagram']);
                        setPublishingProgress(55);

                        // Channel 3: Facebook Video Feed
                        timeoutRef = setTimeout(() => {
                          if (isCancelled) return;
                          setPublishedChannels((prev) => [...prev, 'facebook']);
                          setPublishingProgress(75);

                          // Channel 4: WhatsApp Status
                          timeoutRef = setTimeout(() => {
                            if (isCancelled) return;
                            setPublishedChannels((prev) => [...prev, 'whatsapp']);
                            setPublishingProgress(90);

                            // Channel 5: LinkedIn Video Post
                            timeoutRef = setTimeout(() => {
                              if (isCancelled) return;
                              setPublishedChannels((prev) => [...prev, 'linkedin']);
                              setPublishingProgress(100);

                              // STEP 5: "AI Avatar Published Successfully!" Celebration Popup
                              timeoutRef = setTimeout(() => {
                                if (isCancelled) return;
                                setPhase('published_popup');

                                // Show celebration modal for 2.8 seconds, then cycle to next preset
                                timeoutRef = setTimeout(() => {
                                  if (isCancelled) return;
                                  setActivePresetIndex((prev) => (prev + 1) % AVATAR_PRESETS.length);
                                }, 2800);

                              }, 400);

                            }, 400);

                          }, 400);

                        }, 400);

                      }, 400);

                    }, 350);

                  }, 5500);

                }, 250);
              }
            }, 320);

          }, 350);

        }, 500);
      }
    }, 28);

    return () => {
      isCancelled = true;
      if (typingInterval) clearInterval(typingInterval);
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [activePresetIndex]);

  return (
    <section id="ai-avatar" className="pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 bg-gradient-to-b from-[#f8f9fe] via-white to-[#f9faff] border-b border-slate-100 relative overflow-hidden select-none scroll-mt-20">
      
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-indigo-100/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[520px] h-[360px] bg-violet-100/40 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Showcase: Device on LEFT, Studio Content on RIGHT */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ============================================================
              LEFT COLUMN: Device Mockup with AI Avatar & Virtual Keyboard
              "ai avatr hoo left side"
             ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-start w-full order-2 lg:order-1 relative group">
            
            {/* Ambient Backlight Glow behind device */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-pink-500/20 rounded-[50px] blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Smartphone Chassis with subtle hover float */}
            <div className="relative w-full max-w-[360px] sm:max-w-[390px] bg-slate-900 rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 transform transition-transform duration-700 hover:scale-[1.01]">
              
              {/* Outer Bezel */}
              <div className="absolute inset-0 rounded-[44px] border-2 border-white/20 pointer-events-none" />

              {/* Inner Phone Display (9:16 Aspect for Video Reels & Avatars) */}
              <div className="relative w-full aspect-[9/16] rounded-[36px] overflow-hidden bg-slate-950 flex flex-col justify-between">
                
                {/* 1. Phone Top Status Bar */}
                <div className="pt-2 px-4 flex items-center justify-between z-30 pointer-events-none text-white/90">
                  <span className="text-[11px] font-bold">11:30 AM</span>
                  
                  {/* Dynamic Island Pill */}
                  <div className="w-20 h-4 rounded-full bg-black/80 border border-white/10 flex items-center justify-center gap-1.5 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[8px] font-extrabold text-white tracking-widest uppercase">AVATAR 4K</span>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400">100%</span>
                </div>

                {/* 2. Main Canvas: Video & Avatar Live Speech */}
                <div className="relative flex-1 w-full h-full flex flex-col justify-center items-center overflow-hidden">
                  
                  {/* The AI Avatar Video Component */}
                  <video
                    ref={videoRef}
                    key={activePreset.videoUrl}
                    src={activePreset.videoUrl}
                    playsInline
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Dark subtle overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                  {/* Top Avatar Info Pill */}
                  <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                        AI
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-white leading-none">{activePreset.avatarName}</p>
                        <p className="text-[8px] text-indigo-300 font-medium">{activePreset.avatarRole}</p>
                      </div>
                    </div>

                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
                      Lip-Sync Active
                    </span>
                  </div>

                  {/* Speech Subtitles Bar during playing */}
                  {phase === 'playing' && (
                    <div className="absolute bottom-16 inset-x-3 z-20 bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-center animate-fadeIn pointer-events-none">
                      <p className="text-[11px] font-semibold text-white leading-snug">
                        {activePreset.subtitles}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-1 text-[9px] font-bold text-indigo-300">
                        <Volume2 className="w-3 h-3 text-indigo-400 animate-pulse" />
                        <span>Voice: {activePreset.voiceName} ({activePreset.voiceLanguage})</span>
                      </div>
                    </div>
                  )}

                  {/* Voice Equalizer Waveform Bars */}
                  {phase === 'playing' && (
                    <div className="absolute bottom-4 inset-x-6 z-20 flex items-end justify-center gap-1 h-6 pointer-events-none">
                      {[14, 22, 10, 26, 18, 28, 12, 24, 16, 26, 12, 20, 26, 14, 22].map((height, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-indigo-400 to-purple-400 rounded-full animate-pulse"
                          style={{ 
                            height: `${height}px`,
                            animationDelay: `${i * 60}ms`,
                            animationDuration: '600ms'
                          }}
                        />
                      ))}
                    </div>
                  )}

                </div>

                {/* ============================================================
                    3. VIRTUAL KEYBOARD IN DEVICE PREVIEW
                    "make it with preview devices keyyboard and type prompt and keybord bnd ho jayegaa"
                   ============================================================ */}
                <div
                  className={`absolute inset-x-0 bottom-0 bg-slate-900/98 backdrop-blur-2xl border-t border-white/15 p-2.5 pb-4 transition-transform duration-500 ease-in-out z-40 ${
                    phase === 'typing' || phase === 'tap_button'
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full opacity-0 pointer-events-none'
                  }`}
                >
                  
                  {/* Prompt Text Bar above keyboard - FULL SCRIPT DISPLAYED WITH ZERO TRUNCATE */}
                  <div className="mb-2.5 px-3 py-2 bg-slate-800/95 rounded-xl border border-white/20 text-left shadow-inner flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider">
                          Avatar Script & Speech
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        {phase === 'tap_button' ? 'Auto-Submitting...' : 'Typing...'}
                      </span>
                    </div>

                    {/* FULL PROMPT DISPLAY */}
                    <p className="text-[11px] sm:text-xs text-white/95 font-mono leading-snug break-words min-h-[38px]">
                      {displayedText}
                      {phase === 'typing' && (
                        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
                      )}
                    </p>
                  </div>

                  {/* Virtual Keyboard Keys */}
                  <div className="space-y-1.5">
                    {KEYBOARD_ROWS.map((row, rowIdx) => (
                      <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
                        {row.map((key) => {
                          const isPressed = activeKey === key || (key === 'space' && activeKey === 'space');
                          const isWide = key === 'space' || key === 'Return' || key === '123' || key === '⇧' || key === '⌫';
                          return (
                            <div
                              key={key}
                              className={`h-7 sm:h-8 flex items-center justify-center rounded-md text-[10px] sm:text-xs font-bold transition-all duration-100 ${
                                isWide
                                  ? key === 'space'
                                    ? 'w-36 bg-slate-700/80 text-white/80'
                                    : key === 'Return'
                                    ? phase === 'tap_button'
                                      ? 'px-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-slate-950 font-black shadow-lg shadow-indigo-500/50 scale-105'
                                      : 'px-2.5 bg-slate-700/90 text-white/90'
                                    : 'px-2.5 bg-slate-700/90 text-white/90'
                                  : 'w-7 sm:w-8 bg-slate-800 text-white'
                              } ${
                                isPressed && key !== 'Return'
                                  ? 'bg-gradient-to-tr from-indigo-400 to-purple-500 text-slate-950 scale-105 shadow-md shadow-indigo-500/40 font-black'
                                  : 'border border-white/10 shadow-xs'
                              }`}
                            >
                              {key}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Virtual Keyboard Down Swipe Bar */}
                  <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mt-2" />
                </div>

                {/* ============================================================
                    4. AI GENERATING & LIP-SYNC SYNTHESIS OVERLAY
                   ============================================================ */}
                {phase === 'generating' && (
                  <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-fadeIn pointer-events-none">
                    
                    {/* Pulsing AI Generator Icon */}
                    <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-600 blur-lg opacity-40 animate-pulse" />
                      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-indigo-500/40 flex items-center justify-center shadow-xl">
                        <Mic className="w-9 h-9 text-indigo-400 animate-bounce" />
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-white tracking-wide mb-1">
                      Neural Lip-Sync & Voice Engine
                    </h4>
                    <p className="text-[11px] text-indigo-200 font-medium max-w-[240px] mb-4">
                      {generatingStage}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-[240px]">
                      <div className="flex items-center justify-between text-[10px] font-bold text-white/70 mb-1">
                        <span>Rendering 1080p 60fps</span>
                        <span>{generatingProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${generatingProgress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ============================================================
                    5. AUTO-PUBLISHING OVERLAY (MULTI-CHANNEL)
                    "jase ai reel maker m facebook p[r jaa raha aase hi"
                   ============================================================ */}
                {phase === 'publishing' && (
                  <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between p-5 text-white animate-fadeIn pointer-events-none">
                    
                    {/* Header */}
                    <div className="pt-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
                        Live Multi-Channel Sync
                      </div>
                      <h4 className="text-sm font-black tracking-tight text-white">
                        Publishing Avatar Video to 5 Channels...
                      </h4>
                      <p className="text-[10px] text-white/70 font-medium">
                        Syncing auto-captions, 9:16 vertical & audio stems
                      </p>
                    </div>

                    {/* Social Media Channel Sync List */}
                    <div className="space-y-2 my-auto">
                      {AVATAR_CHANNELS.map((channel) => {
                        const isDone = publishedChannels.includes(channel.id);
                        return (
                          <div
                            key={channel.id}
                            className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                              isDone
                                ? 'bg-white/10 border-emerald-500/50 shadow-xs'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${channel.gradient} flex items-center justify-center shrink-0`}>
                                {channel.id === 'youtube' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                )}
                                {channel.id === 'instagram' && (
                                  <svg className="w-3.5 h-3.5 stroke-white fill-none" viewBox="0 0 24 24">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                                {channel.id === 'facebook' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                )}
                                {channel.id === 'whatsapp' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                  </svg>
                                )}
                                {channel.id === 'linkedin' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                )}
                              </div>

                              <div className="text-left">
                                <p className="text-[11px] font-bold text-white leading-tight">
                                  {channel.name}
                                </p>
                                <p className="text-[9px] text-white/60 font-medium">
                                  {channel.format}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  Live
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-white/50">
                                  <div className="w-2.5 h-2.5 border border-white/20 border-t-white rounded-full animate-spin" />
                                  <span>Syncing...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress Bar */}
                    <div className="pb-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-white/80 mb-1">
                        <span>Multi-Channel Video Distribution</span>
                        <span>{publishingProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 via-purple-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${publishingProgress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ============================================================
                    6. SUCCESS CELEBRATION POPUP MODAL
                   ============================================================ */}
                {phase === 'published_popup' && (
                  <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-white animate-fadeIn pointer-events-none">
                    
                    <div className="w-full max-w-[340px] bg-gradient-to-b from-slate-900/95 to-black/95 border border-emerald-500/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(16,185,129,0.25)] relative overflow-hidden">
                      
                      {/* Top Accent Glow */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400" />
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-500/25 blur-2xl rounded-full" />

                      {/* Success Icon */}
                      <div className="relative w-12 h-12 mx-auto mb-2.5 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <CheckCircle2 className="w-7 h-7 text-white stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Success Headline */}
                      <h3 className="text-sm sm:text-base font-black text-white tracking-tight mb-0.5">
                        🎉 AI Avatar Published Successfully!
                      </h3>
                      <p className="text-[10px] text-emerald-300 font-semibold mb-3">
                        Live on YouTube Shorts, Instagram, Facebook & WhatsApp
                      </p>

                      {/* Live Platform Badges */}
                      <div className="grid grid-cols-2 gap-1.5 mb-3 text-left">
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">YouTube Shorts</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">Instagram Reels</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">Facebook Video</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">WhatsApp Status</span>
                        </div>
                      </div>

                      {/* Metrics Highlight */}
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2 mb-2.5 text-left">
                        <div className="flex items-center justify-between text-[9px] text-emerald-200/90 font-medium">
                          <span>⚡ Production Cost</span>
                          <span className="font-bold text-emerald-300">₹0 Studio & Camera Crew</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-white mt-0.5">
                          <span>Quality & Lip-Sync</span>
                          <span className="text-emerald-400 font-mono">1080p 60fps Neural Audio</span>
                        </div>
                      </div>

                      {/* Countdown */}
                      <div className="flex items-center justify-center gap-1.5 text-[9px] font-semibold text-white/60">
                        <div className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Loading Next Avatar Pitch...</span>
                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* Phone Bottom Home Indicator */}
              <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2" />

            </div>

          </div>

          {/* ============================================================
              RIGHT COLUMN: Studio Content & Voice Customization Panel
              "and conetntent right side m with animation ke sath"
             ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-start z-10 pointer-events-none select-none cursor-default pt-1 sm:pt-2 order-1 lg:order-2">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-3 sm:mb-4 animate-fadeIn">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-xs sm:text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                AI Digital Human & Brand Spokesperson
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.12] mb-3.5 tracking-tight animate-fadeIn">
              Instant AI Avatar <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Type Script & Watch It Speak
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-7 leading-relaxed font-medium max-w-xl animate-fadeIn">
              Create photorealistic AI brand spokespersons and founder pitch videos without camera, crew, or studio. Auto-sync speech in Hindi, Hinglish, or English, and publish in 1-click across social channels.
            </p>

            {/* Studio Card */}
            <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(99,102,241,0.06),0_2px_8px_rgba(0,0,0,0.02)] transition-all">
              
              {/* Studio Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-indigo-600" />
                  Spokesperson Script & Speech
                </label>
                
                {/* Category Chip */}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                  {activePreset.category}
                </span>
              </div>

              {/* Textarea Mockup showing FULL Script */}
              <div className="relative mb-3.5">
                <div className="w-full min-h-[96px] p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium leading-relaxed shadow-inner">
                  <p className="break-words">
                    {displayedText}
                    {phase === 'typing' && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-600 animate-pulse align-middle" />
                    )}
                  </p>
                </div>
              </div>

              {/* Voice & Language Selection Bar */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">{activePreset.voiceName}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{activePreset.voiceLanguage}</p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  ⚡ 60fps Lip-Sync
                </span>
              </div>

              {/* Preset Selector Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {AVATAR_PRESETS.map((preset, index) => {
                  const isActive = index === activePresetIndex;
                  return (
                    <div
                      key={preset.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
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
                    ? 'scale-[0.98] ring-4 ring-indigo-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-indigo-500/30'
                    : phase === 'generating'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : phase === 'publishing'
                    ? 'bg-purple-600 text-white shadow-purple-500/20'
                    : phase === 'published_popup'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'
                }`}
              >
                {phase === 'tap_button' ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Auto-Tapping Generate...</span>
                  </>
                ) : phase === 'generating' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering Lip-Sync Video ({generatingProgress}%)...</span>
                  </>
                ) : phase === 'publishing' ? (
                  <>
                    <Send className="w-4 h-4 animate-bounce" />
                    <span>Publishing Across Channels ({publishingProgress}%)...</span>
                  </>
                ) : phase === 'published_popup' ? (
                  <>
                    <PartyPopper className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <span>AI Avatar Live on YouTube, Instagram & FB!</span>
                  </>
                ) : phase === 'playing' ? (
                  <>
                    <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span>Avatar Speaking Live Video</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Avatar Video</span>
                  </>
                )}
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${phase === 'published_popup' ? 'bg-emerald-500' : phase === 'publishing' ? 'bg-purple-500 animate-ping' : 'bg-indigo-500 animate-pulse'}`} />
                  {phase === 'publishing' ? '1-Click Multi-Channel Sync' : phase === 'published_popup' ? 'Live on 5 Channels' : 'Target: ' + activePreset.targetAudience}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Shorts</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Reels</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">WhatsApp</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">LinkedIn</span>
                </div>
              </div>

            </div>

            {/* Feature Trust Badges */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mt-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">Hindi & Eng</p>
                <p className="text-[11px] font-semibold text-slate-500">Multi-Language Audio</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">60fps Neural</p>
                <p className="text-[11px] font-semibold text-slate-500">Perfect Lip-Sync</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">Zero Camera</p>
                <p className="text-[11px] font-semibold text-slate-500">No Studio / Actor</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
