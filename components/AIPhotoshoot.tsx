"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Wand2, 
  Camera, 
  CheckCircle2, 
  Radio, 
  Send, 
  PartyPopper, 
  Check,
  Shirt,
  Scan,
  Share2
} from 'lucide-react';

interface PhotoshootPreset {
  id: string;
  label: string;
  outfitName: string;
  prompt: string;
  rawImage: string;
  photoshootImage: string;
  category: string;
  avatarType: string;
  fabricDetails: string;
  costSaved: string;
  resolution: string;
  badge: string;
}

const PHOTOSHOOT_PRESETS: PhotoshootPreset[] = [
  {
    id: 'banarasi-saree-tryon',
    label: '👗 Banarasi Silk Saree',
    outfitName: 'Royal Banarasi Silk Saree with Gold Zari Border',
    prompt: 'Snap selfie -> Fit royal crimson Banarasi silk saree on Indian avatar with gold jewelry in luxury studio setting.',
    rawImage: '/images/raw-selfie-woman.jpg',
    photoshootImage: '/images/fashion-photoshoot-hero.jpg',
    category: 'Ethnic Fashion & Boutiques',
    avatarType: 'Indian Female Avatar',
    fabricDetails: 'Pure Katan Silk • Zari Brocade',
    costSaved: '₹35,000 Studio Cost Saved',
    resolution: '8K Ultra-HD',
    badge: 'Boutique Bestseller'
  },
  {
    id: 'mens-luxury-suit-tryon',
    label: '👔 Italian Tailored Tuxedo',
    outfitName: 'Bespoke Midnight Navy 3-Piece Italian Wool Suit',
    prompt: 'Upload phone selfie -> Fit bespoke Italian 3-piece tuxedo with silk bow tie on founder avatar in luxury skyline penthouse.',
    rawImage: '/images/raw-selfie-man.jpg',
    photoshootImage: '/images/mens-luxury-photoshoot.jpg',
    category: 'Founders & Men\'s Formal Wear',
    avatarType: 'Corporate Founder Avatar',
    fabricDetails: 'Super 150s Italian Wool • Satin Lapel',
    costSaved: '₹42,000 Model Fee Saved',
    resolution: '8K Ultra-HD',
    badge: 'Executive Collection'
  },
  {
    id: 'bridal-lehenga-tryon',
    label: '👑 Velvet Bridal Lehenga',
    outfitName: 'Heritage Maroon Velvet Bridal Lehenga with Zardozi',
    prompt: 'Upload casual photo -> Dress avatar in heavy maroon velvet bridal lehenga with kundan jewelry in royal palace hall.',
    rawImage: '/images/raw-selfie-woman.jpg',
    photoshootImage: '/images/bridal-lehenga-photoshoot.jpg',
    category: 'Bridal Boutiques & Designers',
    avatarType: 'Royal Bridal Avatar',
    fabricDetails: 'Micro-Velvet • Hand-Crafted Zardozi',
    costSaved: '₹55,000 Production Saved',
    resolution: '8K Ultra-HD',
    badge: 'Bridal Couture'
  }
];

type PhotoshootPhase = 'photo_upload' | 'typing' | 'tap_button' | 'generating' | 'showing_photoshoot' | 'exporting' | 'exported_popup';

interface SocialChannel {
  id: string;
  name: string;
  format: string;
  gradient: string;
}

const PUBLISH_CHANNELS: SocialChannel[] = [
  {
    id: 'instagram',
    name: 'Instagram Feed & Story',
    format: '8K Fashion Post • High-Res',
    gradient: 'from-amber-500 via-rose-500 to-purple-600'
  },
  {
    id: 'facebook',
    name: 'Facebook Page & Feed',
    format: 'HD Photoshoot Ad Post',
    gradient: 'from-blue-600 to-blue-500'
  },
  {
    id: 'social',
    name: 'Social Business',
    format: 'HD Product Catalog & Broadcast',
    gradient: 'from-emerald-500 to-green-600'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Showcase',
    format: 'Executive & Brand Editorial',
    gradient: 'from-sky-700 to-blue-600'
  },
  {
    id: 'pinterest',
    name: 'Pinterest Fashion Pin',
    format: 'Visual Outfit Pin • High Saves',
    gradient: 'from-red-600 to-rose-700'
  }
];

// QWERTY keyboard layout rows
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ['123', '🌐', 'space', 'Return']
];

export function AIPhotoshoot() {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  
  // Phase state machine:
  // photo_upload -> typing -> tap_button -> generating -> showing_photoshoot -> exporting -> exported_popup -> next preset
  const [phase, setPhase] = useState<PhotoshootPhase>('photo_upload');
  
  const [generatingProgress, setGeneratingProgress] = useState<number>(0);
  const [generatingStage, setGeneratingStage] = useState<string>('');
  
  const [publishedChannels, setPublishedChannels] = useState<string[]>([]);
  const [publishingProgress, setPublishingProgress] = useState<number>(0);

  const activePreset = PHOTOSHOOT_PRESETS[activePresetIndex];

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

    const preset = PHOTOSHOOT_PRESETS[activePresetIndex];
    const targetText = preset.prompt;

    // Reset state for new preset cycle
    setDisplayedText('');
    setPhase('photo_upload');
    setGeneratingProgress(0);
    setPublishedChannels([]);
    setPublishingProgress(0);

    // STEP 1: Photo snap / upload animation (1.2 seconds)
    timeoutRef = setTimeout(() => {
      if (isCancelled) return;
      setPhase('typing');

      let charIdx = 0;

      // STEP 2: Auto-type outfit prompt with Virtual Keyboard OPEN on device
      typingInterval = setInterval(() => {
        if (isCancelled) return;
        charIdx++;
        setDisplayedText(targetText.slice(0, charIdx));

        // When full prompt has been typed
        if (charIdx >= targetText.length) {
          if (typingInterval) clearInterval(typingInterval);

          // Pause showing full prompt, then auto-tap generate button
          timeoutRef = setTimeout(() => {
            if (isCancelled) return;
            setPhase('tap_button');

            // STEP 3: Virtual Keyboard slides down and closes! Garment fitting kicks in
            timeoutRef = setTimeout(() => {
              if (isCancelled) return;
              setPhase('generating');
              setGeneratingProgress(16);
              setGeneratingStage('Detecting 3D body posture & torso contours...');

              const stages = [
                { p: 38, msg: 'Synthesizing fabric weave, folds & natural drape...' },
                { p: 68, msg: 'Transferring intricate garment embroidery & textures...' },
                { p: 90, msg: 'Rendering 8K editorial studio lighting & backdrop...' },
                { p: 100, msg: 'AI Photoshoot ready! Revealing studio result...' }
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

                  // STEP 4: High-Fashion 8K Photoshoot Result Revealed
                  timeoutRef = setTimeout(() => {
                    if (isCancelled) return;
                    setPhase('showing_photoshoot');
                    setGeneratingProgress(100);

                    // Display the photoshoot for 3.4 seconds, then auto-publish to Facebook, Social, Instagram
                    timeoutRef = setTimeout(() => {
                      if (isCancelled) return;
                      
                      // STEP 5: Auto-Publishing across Facebook, Social, Instagram, LinkedIn, Pinterest
                      setPhase('exporting');
                      setPublishedChannels([]);
                      setPublishingProgress(15);

                      // Channel 1: Instagram Feed & Story
                      timeoutRef = setTimeout(() => {
                        if (isCancelled) return;
                        setPublishedChannels((prev) => [...prev, 'instagram']);
                        setPublishingProgress(35);

                        // Channel 2: Facebook Page & Feed
                        timeoutRef = setTimeout(() => {
                          if (isCancelled) return;
                          setPublishedChannels((prev) => [...prev, 'facebook']);
                          setPublishingProgress(55);

                          // Channel 3: Social Business & Catalog
                          timeoutRef = setTimeout(() => {
                            if (isCancelled) return;
                            setPublishedChannels((prev) => [...prev, 'social']);
                            setPublishingProgress(75);

                            // Channel 4: LinkedIn Showcase
                            timeoutRef = setTimeout(() => {
                              if (isCancelled) return;
                              setPublishedChannels((prev) => [...prev, 'linkedin']);
                              setPublishingProgress(90);

                              // Channel 5: Pinterest Fashion Pin
                              timeoutRef = setTimeout(() => {
                                if (isCancelled) return;
                                setPublishedChannels((prev) => [...prev, 'pinterest']);
                                setPublishingProgress(100);

                                // STEP 6: "Photoshoot Published Successfully!" Celebration Popup
                                timeoutRef = setTimeout(() => {
                                  if (isCancelled) return;
                                  setPhase('exported_popup');

                                  // Show celebration modal for 2.8 seconds, then cycle to next preset
                                  timeoutRef = setTimeout(() => {
                                    if (isCancelled) return;
                                    setActivePresetIndex((prev) => (prev + 1) % PHOTOSHOOT_PRESETS.length);
                                  }, 2800);

                                }, 400);

                              }, 400);

                            }, 400);

                          }, 400);

                        }, 400);

                      }, 350);

                    }, 3400);

                  }, 300);
                }
              }, 340);

            }, 350);

          }, 500);
        }
      }, 28);

    }, 1200);

    return () => {
      isCancelled = true;
      if (typingInterval) clearInterval(typingInterval);
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [activePresetIndex]);

  return (
    <section id="ai-photoshoot" className="pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 bg-gradient-to-b from-[#f9faff] via-white to-[#f8f9fe] border-b border-slate-100 relative overflow-hidden select-none scroll-mt-20">
      
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 right-1/4 w-[520px] h-[360px] bg-fuchsia-100/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[520px] h-[360px] bg-purple-100/40 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ============================================================
              LEFT COLUMN: Studio Panel with Live Category & Auto-Typing
             ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-start z-10 pointer-events-none select-none cursor-default pt-1 sm:pt-2">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-3 sm:mb-4">
              <Camera className="w-4 h-4 text-fuchsia-600" />
              <span className="text-xs sm:text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600">
                AI Virtual Model & Photoshoot Studio
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.12] mb-3.5 tracking-tight">
              Instant AI Photoshoot <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600">
                Snap Photo & Publish to Social
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-7 leading-relaxed font-medium max-w-xl">
              Snap a simple phone selfie or upload customer photo. Watch AI map 3D body contours, drape luxury designer clothes on your avatar, and publish 8K studio photography directly to Facebook, Instagram, and Social.
            </p>

            {/* Studio Card */}
            <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(217,70,239,0.06),0_2px_8px_rgba(0,0,0,0.02)] transition-all">
              
              {/* Studio Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-fuchsia-600" />
                  Virtual Try-On & Outfit Prompt
                </label>
                
                {/* Category Chip */}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200/70">
                  {activePreset.category}
                </span>
              </div>

              {/* Textarea Mockup showing FULL Prompt */}
              <div className="relative mb-4">
                <div className="w-full min-h-[96px] p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium leading-relaxed shadow-inner">
                  <p className="break-words">
                    {displayedText}
                    {phase === 'typing' && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-fuchsia-600 animate-pulse align-middle" />
                    )}
                  </p>
                </div>
              </div>

              {/* Preset Selector Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {PHOTOSHOOT_PRESETS.map((preset, index) => {
                  const isActive = index === activePresetIndex;
                  return (
                    <div
                      key={preset.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-500/20'
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
                    ? 'scale-[0.98] ring-4 ring-fuchsia-300 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-fuchsia-500/30'
                    : phase === 'generating'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : phase === 'exporting'
                    ? 'bg-purple-600 text-white shadow-purple-500/20'
                    : phase === 'exported_popup'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : phase === 'photo_upload'
                    ? 'bg-slate-800 text-white'
                    : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white'
                }`}
              >
                {phase === 'photo_upload' ? (
                  <>
                    <Camera className="w-4 h-4 animate-pulse text-fuchsia-300" />
                    <span>Snapping & Uploading Photo...</span>
                  </>
                ) : phase === 'tap_button' ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-fuchsia-200" />
                    <span>Auto-Tapping Try-On...</span>
                  </>
                ) : phase === 'generating' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Fitting Garment on Avatar ({generatingProgress}%)...</span>
                  </>
                ) : phase === 'exporting' ? (
                  <>
                    <Send className="w-4 h-4 animate-bounce" />
                    <span>Publishing Across Channels ({publishingProgress}%)...</span>
                  </>
                ) : phase === 'exported_popup' ? (
                  <>
                    <PartyPopper className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <span>Published to Facebook, Instagram & Facebook!</span>
                  </>
                ) : phase === 'showing_photoshoot' ? (
                  <>
                    <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span>8K Photoshoot Ready for Publish</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Photoshoot</span>
                  </>
                )}
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${phase === 'exported_popup' ? 'bg-emerald-500' : phase === 'exporting' ? 'bg-purple-500 animate-ping' : 'bg-fuchsia-500 animate-pulse'}`} />
                  {phase === 'exporting' ? '1-Click Multi-Channel Sync' : phase === 'exported_popup' ? 'Live on Facebook, Social & Insta' : activePreset.costSaved}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Facebook</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Social</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Instagram</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">LinkedIn</span>
                </div>
              </div>

            </div>

            {/* Feature Trust Badges */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mt-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">8K Ultra-HD</p>
                <p className="text-[11px] font-semibold text-slate-500">Zero Studio Cost</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">Cloth Drape</p>
                <p className="text-[11px] font-semibold text-slate-500">Natural Physics</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">1-Click Publish</p>
                <p className="text-[11px] font-semibold text-slate-500">FB, WA & Insta</p>
              </div>
            </div>

          </div>

          {/* ============================================================
              RIGHT COLUMN: Device Mockup with Virtual Keyboard
              "make it with preview devices keyyboard and type prompt and keybord bnd ho jayegaa"
             ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-start w-full">
            
            {/* Tablet Chassis */}
            <div className="relative w-full max-w-[430px] sm:max-w-[470px] bg-slate-900 rounded-[40px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800">
              
              {/* Outer Bezel */}
              <div className="absolute inset-0 rounded-[40px] border-2 border-white/20 pointer-events-none" />

              {/* Inner Tablet Display */}
              <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-950 flex flex-col justify-between">
                
                {/* 1. Tablet Top Status Bar */}
                <div className="pt-2 px-4 flex items-center justify-between z-30 pointer-events-none text-white/80">
                  <span className="text-[11px] font-bold">11:15 AM</span>
                  <div className="w-16 h-4 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">100%</span>
                </div>

                {/* 2. Main Content Canvas */}
                <div className="relative flex-1 w-full h-full flex flex-col justify-center items-center p-3 overflow-hidden">
                  
                  {/* (A) RAW PHOTO CAPTURE / UPLOAD STATE (Visible during photo_upload, typing, tap_button) */}
                  {(phase === 'photo_upload' || phase === 'typing' || phase === 'tap_button') && (
                    <div className="w-full max-w-[360px] h-full flex flex-col justify-start items-center relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 animate-fadeIn">
                      
                      {/* Raw Photo Background */}
                      <div className="relative w-full h-full min-h-[300px]">
                        <Image
                          src={activePreset.rawImage}
                          alt="Raw Uploaded Selfie"
                          fill
                          className="object-cover"
                          sizes="(max-width: 470px) 100vw, 470px"
                          priority
                        />

                        {/* Camera Viewfinder Overlay */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none bg-black/20">
                          
                          {/* Top Camera Header */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
                              <Camera className="w-3 h-3 text-fuchsia-400" />
                              Raw Selfie Photo
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                              ✓ 3D Avatar Pose Locked
                            </span>
                          </div>

                          {/* Center Viewfinder Target Brackets */}
                          <div className="relative w-36 h-36 mx-auto border-2 border-dashed border-fuchsia-400/60 rounded-3xl flex items-center justify-center">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fuchsia-400" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-fuchsia-400" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fuchsia-400" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-400" />
                            
                            <div className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-bold text-white/90 border border-white/10 flex items-center gap-1">
                              <Scan className="w-3 h-3 text-fuchsia-400 animate-pulse" />
                              Ready for Try-On
                            </div>
                          </div>

                          {/* Shutter Snap Pulse Effect during photo_upload */}
                          {phase === 'photo_upload' && (
                            <div className="absolute inset-0 bg-white/40 animate-ping pointer-events-none" />
                          )}

                          {/* Bottom Info Pill */}
                          <div className="bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/10 text-left flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-white leading-tight">Selected Garment:</p>
                              <p className="text-[9px] text-fuchsia-300 font-medium truncate max-w-[200px]">{activePreset.outfitName}</p>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                              {activePreset.badge}
                            </span>
                          </div>

                        </div>
                      </div>

                    </div>
                  )}

                  {/* (B) GENERATED 8K PHOTOSHOOT RESULT (Visible during showing_photoshoot, exporting, exported_popup) */}
                  {(phase === 'showing_photoshoot' || phase === 'exporting' || phase === 'exported_popup') && (
                    <div className="w-full max-w-[360px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 transition-all duration-700 scale-100 opacity-100 animate-fadeIn relative">
                      
                      {/* Photoshoot Header */}
                      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-indigo-600 p-[1px] flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                              DG
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1 leading-none">
                              DhandaGrow AI Studio
                              <span className="w-3 h-3 rounded-full bg-fuchsia-600 text-[8px] text-white flex items-center justify-center font-bold">✓</span>
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">{activePreset.resolution} • Studio Render</p>
                          </div>
                        </div>

                        <div className="text-[10px] font-bold text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded-full border border-fuchsia-200/60">
                          Ready for Social
                        </div>
                      </div>

                      {/* 8K Studio Photoshoot Image */}
                      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                        <Image
                          src={activePreset.photoshootImage}
                          alt={activePreset.label}
                          fill
                          className="object-cover"
                          sizes="(max-width: 470px) 100vw, 470px"
                          priority
                        />

                        {/* Top-Right Resolution & Quality Badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[9px] font-extrabold text-white flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-fuchsia-400" />
                          <span>8K Master</span>
                        </div>

                        {/* Floating "After: AI Studio Photoshoot" Pill */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[9px] font-bold text-white shadow-md">
                          ✨ After: AI Studio
                        </div>
                      </div>

                      {/* Photoshoot Product Details Footer */}
                      <div className="p-2.5 bg-white text-left">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] font-bold text-slate-900 truncate max-w-[220px]">
                            {activePreset.outfitName}
                          </p>
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            {activePreset.costSaved}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-500 font-medium">
                          Fabric: <span className="font-semibold text-slate-700">{activePreset.fabricDetails}</span>
                        </p>
                      </div>

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
                  
                  {/* Prompt Text Bar above keyboard - FULL PROMPT DISPLAYED WITH ZERO TRUNCATE */}
                  <div className="mb-2.5 px-3 py-2 bg-slate-800/95 rounded-xl border border-white/20 text-left shadow-inner flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold text-fuchsia-300 uppercase tracking-wider">
                          AI Photoshoot Prompt
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                        {phase === 'tap_button' ? 'Auto-Submitting...' : 'Typing...'}
                      </span>
                    </div>

                    {/* FULL PROMPT DISPLAY */}
                    <p className="text-[11px] sm:text-xs text-white/95 font-mono leading-snug break-words min-h-[38px]">
                      {displayedText}
                      {phase === 'typing' && (
                        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-fuchsia-400 animate-pulse align-middle" />
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
                                      ? 'px-3 bg-gradient-to-r from-fuchsia-400 to-purple-500 text-slate-950 font-black shadow-lg shadow-fuchsia-500/50 scale-105'
                                      : 'px-2.5 bg-slate-700/90 text-white/90'
                                    : 'px-2.5 bg-slate-700/90 text-white/90'
                                  : 'w-7 sm:w-8 bg-slate-800 text-white'
                              } ${
                                isPressed && key !== 'Return'
                                  ? 'bg-gradient-to-tr from-fuchsia-400 to-purple-500 text-slate-950 scale-105 shadow-md shadow-fuchsia-500/40 font-black'
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
                    4. AI GENERATING & CLOTH DRAPING SCANLINE OVERLAY
                   ============================================================ */}
                {phase === 'generating' && (
                  <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-fadeIn pointer-events-none">
                    
                    {/* Laser Scanning Beam moving across person */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_15px_#d946ef] animate-pulse" />

                    {/* Pulsing AI Generator Icon */}
                    <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-indigo-600 blur-lg opacity-40 animate-pulse" />
                      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-fuchsia-500/40 flex items-center justify-center shadow-xl">
                        <Wand2 className="w-9 h-9 text-fuchsia-400 animate-bounce" />
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-white tracking-wide mb-1">
                      AI 3D Garment Draping & Synthesis
                    </h4>
                    <p className="text-[11px] text-fuchsia-200 font-medium max-w-[240px] mb-4">
                      {generatingStage}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-[240px]">
                      <div className="flex items-center justify-between text-[10px] font-bold text-white/70 mb-1">
                        <span>Rendering 8K Master Canvas</span>
                        <span>{generatingProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fuchsia-400 via-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${generatingProgress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ============================================================
                    5. AUTO-PUBLISHING TO FACEBOOK, INSTAGRAM, LINKEDIN
                    "muje publish krni hai facebook whstaapp ins sab pr"
                   ============================================================ */}
                {phase === 'exporting' && (
                  <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between p-5 text-white animate-fadeIn pointer-events-none">
                    
                    {/* Header */}
                    <div className="pt-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <Radio className="w-3 h-3 text-fuchsia-400 animate-pulse" />
                        Multi-Channel Social Sync
                      </div>
                      <h4 className="text-sm font-black tracking-tight text-white">
                        Publishing 8K Photoshoot to 5 Channels...
                      </h4>
                      <p className="text-[10px] text-white/70 font-medium">
                        Optimizing captions, hashtags & 8K studio photography
                      </p>
                    </div>

                    {/* Social Channels Sync List with Official SVGs */}
                    <div className="space-y-2 my-auto">
                      {PUBLISH_CHANNELS.map((channel) => {
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
                                {channel.id === 'social' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                  </svg>
                                )}
                                {channel.id === 'linkedin' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                )}
                                {channel.id === 'pinterest' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
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
                                  <span>Publishing...</span>
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
                        <span>Multi-Channel Photo Distribution</span>
                        <span>{publishingProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fuchsia-400 via-purple-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${publishingProgress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ============================================================
                    6. SUCCESS CELEBRATION POPUP MODAL
                   ============================================================ */}
                {phase === 'exported_popup' && (
                  <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-white animate-fadeIn pointer-events-none">
                    
                    <div className="w-full max-w-[340px] bg-gradient-to-b from-slate-900/95 to-black/95 border border-emerald-500/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(16,185,129,0.25)] relative overflow-hidden">
                      
                      {/* Top Accent Glow */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />
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
                        🎉 Photoshoot Published Successfully!
                      </h3>
                      <p className="text-[10px] text-emerald-300 font-semibold mb-3">
                        Live on Facebook, Social, Instagram & LinkedIn
                      </p>

                      {/* Live Platform Badges */}
                      <div className="grid grid-cols-2 gap-1.5 mb-3 text-left">
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">Instagram Feed</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">Facebook Page</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">Social Catalog</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">LinkedIn Showcase</span>
                        </div>
                      </div>

                      {/* Cost Savings & Resolution Highlight */}
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2 mb-2.5 text-left">
                        <div className="flex items-center justify-between text-[9px] text-emerald-200/90 font-medium">
                          <span>⚡ Production Cost</span>
                          <span className="font-bold text-emerald-300">₹0 Studio & Model Cost</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-white mt-0.5">
                          <span>Resolution & Quality</span>
                          <span className="text-emerald-400 font-mono">8K Editorial HDR</span>
                        </div>
                      </div>

                      {/* Countdown */}
                      <div className="flex items-center justify-center gap-1.5 text-[9px] font-semibold text-white/60">
                        <div className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Loading Next Avatar Outfit...</span>
                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* Tablet Bottom Home Indicator */}
              <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2" />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
