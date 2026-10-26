"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Wand2, 
  Layers, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Radio, 
  Send, 
  PartyPopper, 
  Check,
  Palette
} from 'lucide-react';

interface PostPreset {
  id: string;
  label: string;
  prompt: string;
  imageUrl: string;
  tag: string;
  category: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  targetAudience: string;
  accountHandle: string;
  postCaption: string;
}

const POST_PRESETS: PostPreset[] = [
  {
    id: 'ethnic-boutique-sale',
    label: '👗 Ethnic Boutique Sale',
    prompt: 'Royal luxury Banarasi silk festive sale ad with pure gold zari border and Flat 40% OFF discount badge.',
    imageUrl: '/images/royal-ethnic-banner.jpg',
    tag: '#RoyalEthnicSale',
    category: 'Clothing Brands & Boutiques',
    likes: '48.2K',
    comments: '1,290',
    shares: '8.4K',
    saves: '14.2K',
    targetAudience: 'Fashion Stores & Indian Boutiques',
    accountHandle: 'shyamal.ethnic.wear',
    postCaption: '✨ Royal Ethnic Luxury Sale is LIVE! Flat 40% OFF on all Handcrafted Banarasi Silks & Bridal Designer Wear. Visit our showroom or shop online 👑'
  },
  {
    id: 'businessman-leadership',
    label: '👔 Founder Leadership Post',
    prompt: 'High-authority Forbes-style corporate graphic on sustainable revenue systems and 10X scaling for founders.',
    imageUrl: '/images/businessman-leadership-post.jpg',
    tag: '#FounderPlaybook',
    category: 'Business & Leadership',
    likes: '62.5K',
    comments: '2,840',
    shares: '14.1K',
    saves: '28.9K',
    targetAudience: 'Businessmen, Founders & CEOs',
    accountHandle: 'dhandagrow.official',
    postCaption: '🚀 10X REVENUE PLAYBOOK: Build repeatable automated systems that scale your business autonomously. Read the full playbook 📈'
  },
  {
    id: 'creator-ootd-lookbook',
    label: '📱 Creator OOTD Lookbook',
    prompt: 'Viral Instagram carousel cover styling designer silk brocade with modern urban streetwear for fashion influencers.',
    imageUrl: '/images/influencer-ootd-post.jpg',
    tag: '#OOTDStyleGuide',
    category: 'Fashion Creators & Influencers',
    likes: '89.1K',
    comments: '3,650',
    shares: '21.8K',
    saves: '39.4K',
    targetAudience: 'Fashion Creators & Influencers',
    accountHandle: 'riya.styles.daily',
    postCaption: '✨ FUSION OOTD LOOKBOOK: 4 high-fashion ways to style designer brocade with everyday denim & leather. Swipe right for looks 👉'
  },
  {
    id: 'streetwear-drop-ad',
    label: '🧢 Urban Streetwear Drop',
    prompt: 'Cyberpunk urban streetwear poster for Gen-Z clothing brand with bold typography and Flat ₹599 offer.',
    imageUrl: '/images/streetwear-drop-banner.jpg',
    tag: '#StreetwearDrop',
    category: 'D2C Apparel Brands',
    likes: '54.7K',
    comments: '1,820',
    shares: '11.3K',
    saves: '18.7K',
    targetAudience: 'D2C Apparel Brands',
    accountHandle: 'urbandesi.apparel',
    postCaption: '⚡ URBAN DESI STREETWEAR DROP IS HERE! Oversized heavy-cotton tees & cargo pants starting Flat ₹599. Grab before stock ends 🔥'
  }
];

type PostMakerPhase = 'typing' | 'tap_button' | 'generating' | 'showing_post' | 'publishing' | 'published_popup';

interface SocialChannel {
  id: string;
  name: string;
  format: string;
  color: string;
  gradient: string;
}

const PUBLISH_CHANNELS: SocialChannel[] = [
  {
    id: 'instagram',
    name: 'Instagram Feed',
    format: 'Square 1:1 • High-Res',
    color: '#E1306C',
    gradient: 'from-amber-500 via-rose-500 to-purple-600'
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    format: 'Feed Ad Post',
    color: '#1877F2',
    gradient: 'from-blue-600 to-blue-500'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Feed',
    format: 'Executive Carousel/Image',
    color: '#0A66C2',
    gradient: 'from-sky-700 to-blue-600'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    format: 'Viral Image Tweet',
    color: '#000000',
    gradient: 'from-slate-800 to-slate-950'
  },
  {
    id: 'pinterest',
    name: 'Pinterest Pin',
    format: 'Visual Product Pin',
    color: '#BD081C',
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

export function AIPostMaker() {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  
  // Phase state machine:
  // typing -> tap_button -> generating -> showing_post -> publishing -> published_popup -> next preset
  const [phase, setPhase] = useState<PostMakerPhase>('typing');
  
  const [generatingProgress, setGeneratingProgress] = useState<number>(0);
  const [generatingStage, setGeneratingStage] = useState<string>('');
  
  const [publishedChannels, setPublishedChannels] = useState<string[]>([]);
  const [publishingProgress, setPublishingProgress] = useState<number>(0);

  const activePreset = POST_PRESETS[activePresetIndex];

  // Derived active key for virtual keyboard glow - No separate setState needed!
  const activeKey = 
    phase === 'tap_button' 
      ? 'Return' 
      : phase === 'typing' && displayedText.length > 0
      ? (displayedText[displayedText.length - 1] === ' ' ? 'space' : displayedText[displayedText.length - 1].toUpperCase())
      : '';

  // Self-running autonomous loop with bulletproof timer tracking
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

    const preset = POST_PRESETS[activePresetIndex];
    const targetText = preset.prompt;

    // Reset state for new preset cycle
    setDisplayedText('');
    setPhase('typing');
    setGeneratingProgress(0);
    setPublishedChannels([]);
    setPublishingProgress(0);

    let charIdx = 0;

    // STEP 1: Auto-type full prompt (recursive safeTimeout avoids setInterval flooding)
    const typeNextChar = () => {
      if (isCancelled) return;
      charIdx++;
      setDisplayedText(targetText.slice(0, charIdx));

      if (charIdx < targetText.length) {
        safeTimeout(typeNextChar, 25);
      } else {
        // Pause showing full prompt, then auto-tap generate button
        safeTimeout(() => {
          setPhase('tap_button');

          // STEP 2: Virtual Keyboard slides down and closes! Generation kicks in
          safeTimeout(() => {
            setPhase('generating');
            setGeneratingProgress(15);
            setGeneratingStage('Parsing campaign prompt & brand color palette...');

            const stages = [
              { p: 35, msg: 'Composing layout grid & visual hierarchy...' },
              { p: 65, msg: 'Synthesizing high-res 4K AI creative...' },
              { p: 88, msg: 'Rendering bold typography & offer badges...' },
              { p: 98, msg: 'Color grading & HDR lighting polish...' },
              { p: 100, msg: 'AI Post ready! Revealing creative...' }
            ];

            let stageStep = 0;
            const runProgressStage = () => {
              if (isCancelled) return;
              if (stageStep < stages.length) {
                setGeneratingProgress(stages[stageStep].p);
                setGeneratingStage(stages[stageStep].msg);
                stageStep++;
                safeTimeout(runProgressStage, 320);
              } else {
                // STEP 3: Finished AI Post appears in full glory on device
                safeTimeout(() => {
                  setPhase('showing_post');
                  setGeneratingProgress(100);

                  // Display the generated post for 3.2 seconds, then auto-publish
                  safeTimeout(() => {
                    // STEP 4: Auto-Publishing across all social channels
                    setPhase('publishing');
                    setPublishedChannels([]);
                    setPublishingProgress(15);

                    // Channel 1: Instagram Feed
                    safeTimeout(() => {
                      setPublishedChannels((prev) => [...prev, 'instagram']);
                      setPublishingProgress(35);

                      // Channel 2: Facebook Page
                      safeTimeout(() => {
                        setPublishedChannels((prev) => [...prev, 'facebook']);
                        setPublishingProgress(55);

                        // Channel 3: LinkedIn Feed
                        safeTimeout(() => {
                          setPublishedChannels((prev) => [...prev, 'linkedin']);
                          setPublishingProgress(75);

                          // Channel 4: Twitter / X
                          safeTimeout(() => {
                            setPublishedChannels((prev) => [...prev, 'twitter']);
                            setPublishingProgress(90);

                            // Channel 5: Pinterest Pin
                            safeTimeout(() => {
                              setPublishedChannels((prev) => [...prev, 'pinterest']);
                              setPublishingProgress(100);

                              // STEP 5: "Post Published Successfully!" Celebration Popup
                              safeTimeout(() => {
                                setPhase('published_popup');

                                // Show celebration modal for 2.8 seconds, then cycle to next preset
                                safeTimeout(() => {
                                  setActivePresetIndex((prev) => (prev + 1) % POST_PRESETS.length);
                                }, 2800);

                              }, 400);

                            }, 400);

                          }, 400);

                        }, 400);

                      }, 400);

                    }, 350);

                  }, 3200);

                }, 300);
              }
            };

            safeTimeout(runProgressStage, 320);

          }, 350);

        }, 500);
      }
    };

    safeTimeout(typeNextChar, 25);

    return () => {
      isCancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [activePresetIndex]);

  return (
    <section id="ai-posts" className="pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 bg-gradient-to-b from-[#f8f9fe] via-white to-[#f9faff] border-b border-slate-100 relative overflow-hidden select-none scroll-mt-20">
      
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-cyan-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[520px] h-[360px] bg-indigo-100/40 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Showcase: Left = Device Preview, Right = Content Studio Panel */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ============================================================
              LEFT COLUMN: Device Mockup with Virtual Keyboard & Backlight Glow
              "isme device proive left side m aaye"
             ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-start w-full order-2 lg:order-1 relative group">
            
            {/* Ambient Backlight Glow behind device */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 rounded-[50px] blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Tablet Chassis with subtle hover float */}
            <div className="relative w-full max-w-[430px] sm:max-w-[470px] bg-slate-900 rounded-[40px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 transform transition-transform duration-700 hover:scale-[1.01]">
              
              {/* Outer Bezel */}
              <div className="absolute inset-0 rounded-[40px] border-2 border-white/20 pointer-events-none" />

              {/* Inner Tablet Display */}
              <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-950 flex flex-col justify-between">
                
                {/* 1. Tablet Top Status Bar */}
                <div className="pt-2 px-4 flex items-center justify-between z-30 pointer-events-none text-white/80">
                  <span className="text-[11px] font-bold">10:42 AM</span>
                  <div className="w-16 h-4 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">100%</span>
                </div>

                {/* 2. Main Content Canvas */}
                <div className="relative flex-1 w-full h-full flex flex-col justify-center items-center p-3 overflow-hidden">
                  
                  {/* (A) WORKSPACE CANVAS during TYPING & TAP_BUTTON */}
                  {(phase === 'typing' || phase === 'tap_button') && (
                    <div className="w-full max-w-[360px] h-full flex flex-col justify-start items-center pt-2 text-center animate-fadeIn">
                      
                      {/* Top Canvas Header Bar */}
                      <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-3 mb-2 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white leading-tight">AI Ad Studio Canvas</p>
                            <p className="text-[10px] text-cyan-300 font-medium">1:1 Square Creative • Ready</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {activePreset.tag}
                        </span>
                      </div>

                      {/* Creative Draft Wireframe Blueprint */}
                      <div className="w-full flex-1 max-h-[160px] sm:max-h-[180px] rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-10 h-10 rounded-2xl bg-slate-900/90 border border-cyan-400/40 flex items-center justify-center mb-2 shadow-lg shadow-cyan-500/20">
                            <Palette className="w-5 h-5 text-cyan-400 animate-pulse" />
                          </div>
                          <p className="text-xs font-black text-white">
                            {activePreset.category}
                          </p>
                          <p className="text-[10px] text-cyan-200/80 font-medium mt-0.5">
                            Target: {activePreset.targetAudience}
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* (B) GENERATED POST MOCKUP (Visible during showing_post, publishing, published_popup) */}
                  {(phase === 'showing_post' || phase === 'publishing' || phase === 'published_popup') && (
                    <div className="w-full max-w-[360px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 transition-all duration-700 scale-100 opacity-100 animate-fadeIn">
                      
                      {/* Post Header */}
                      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                              DG
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1 leading-none">
                              {activePreset.accountHandle}
                              <span className="w-3 h-3 rounded-full bg-blue-500 text-[8px] text-white flex items-center justify-center font-bold">✓</span>
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">Sponsored • Ad</p>
                          </div>
                        </div>

                        <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                          Shop Now
                        </div>
                      </div>

                      {/* Post Creative Image */}
                      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                        <Image
                          src={activePreset.imageUrl}
                          alt={activePreset.label}
                          fill
                          className="object-cover"
                          sizes="(max-width: 470px) 100vw, 470px"
                          priority
                        />
                      </div>

                      {/* Post Engagement Bar */}
                      <div className="p-2.5 bg-white text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-3 text-slate-700">
                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                            <MessageCircle className="w-4 h-4" />
                            <Share2 className="w-4 h-4" />
                          </div>
                          <Bookmark className="w-4 h-4 text-slate-700" />
                        </div>

                        <p className="text-[10px] font-bold text-slate-900">
                          {activePreset.likes} likes
                        </p>

                        <p className="text-[10px] text-slate-700 line-clamp-1 leading-tight font-medium mt-0.5">
                          <span className="font-bold text-slate-900 mr-1">{activePreset.accountHandle}</span>
                          {activePreset.postCaption}
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
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider">
                          AI Post Prompt
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        {phase === 'tap_button' ? 'Auto-Submitting...' : 'Typing...'}
                      </span>
                    </div>

                    {/* FULL PROMPT DISPLAY */}
                    <p className="text-[11px] sm:text-xs text-white/95 font-mono leading-snug break-words min-h-[38px]">
                      {displayedText}
                      {phase === 'typing' && (
                        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-cyan-400 animate-pulse align-middle" />
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
                                      ? 'px-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-lg shadow-cyan-500/50 scale-105'
                                      : 'px-2.5 bg-slate-700/90 text-white/90'
                                    : 'px-2.5 bg-slate-700/90 text-white/90'
                                  : 'w-7 sm:w-8 bg-slate-800 text-white'
                              } ${
                                isPressed && key !== 'Return'
                                  ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 scale-105 shadow-md shadow-cyan-500/40 font-black'
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
                    4. AI GENERATING SCANLINE & PROGRESS OVERLAY
                   ============================================================ */}
                {phase === 'generating' && (
                  <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-fadeIn pointer-events-none">
                    
                    {/* Pulsing AI Generator Icon */}
                    <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 blur-lg opacity-40 animate-pulse" />
                      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-xl">
                        <Layers className="w-9 h-9 text-cyan-400 animate-bounce" />
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-white tracking-wide mb-1">
                      Composing AI Ad Creative
                    </h4>
                    <p className="text-[11px] text-cyan-200 font-medium max-w-[240px] mb-4">
                      {generatingStage}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-[240px]">
                      <div className="flex items-center justify-between text-[10px] font-bold text-white/70 mb-1">
                        <span>Rendering 4K Canvas</span>
                        <span>{generatingProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-300"
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
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                        Live Multi-Channel Sync
                      </div>
                      <h4 className="text-sm font-black tracking-tight text-white">
                        Publishing AI Post to 5 Channels...
                      </h4>
                      <p className="text-[10px] text-white/70 font-medium">
                        Syncing captions, hashtags & 1:1 image format
                      </p>
                    </div>

                    {/* Social Media Channel Sync List */}
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
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" className="stroke-white" strokeWidth="2" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" className="stroke-white" strokeWidth="2" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                                {channel.id === 'facebook' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                )}
                                {channel.id === 'linkedin' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                )}
                                {channel.id === 'twitter' && (
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
                        <span>Multi-Channel Post Distribution</span>
                        <span>{publishingProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full transition-all duration-300"
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
                        🎉 Post Published Successfully!
                      </h3>
                      <p className="text-[10px] text-emerald-300 font-semibold mb-3">
                        Live Across All 5 Connected Social Channels
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
                          <span className="text-[9px] font-bold text-white truncate">LinkedIn Feed</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-white truncate">Twitter / X</span>
                        </div>
                      </div>

                      {/* Metrics Highlight */}
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2 mb-2.5 text-left">
                        <div className="flex items-center justify-between text-[9px] text-emerald-200/90 font-medium">
                          <span>⚡ Auto-Scheduled</span>
                          <span className="font-bold text-emerald-300">Prime Engagement Slot</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-white mt-0.5">
                          <span>Est. Multi-Platform Impressions</span>
                          <span className="text-emerald-400 font-mono">~35K-60K Views</span>
                        </div>
                      </div>

                      {/* Countdown */}
                      <div className="flex items-center justify-center gap-1.5 text-[9px] font-semibold text-white/60">
                        <div className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating Next AI Post...</span>
                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* Tablet Bottom Home Indicator */}
              <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2" />

            </div>

          </div>

          {/* ============================================================
              RIGHT COLUMN: Studio Content & Auto-Typing Prompt Panel
              "and conetntent right side m with animation ke sath"
             ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-start z-10 pointer-events-none select-none cursor-default pt-1 sm:pt-2 order-1 lg:order-2">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-3 sm:mb-4 animate-fadeIn">
              <Palette className="w-4 h-4 text-cyan-600" />
              <span className="text-xs sm:text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">
                AI Social Post & Ad Creative Generator
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.12] mb-3.5 tracking-tight animate-fadeIn">
              Instant AI Post Maker <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">
                With 1-Click Publishing
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-7 leading-relaxed font-medium max-w-xl animate-fadeIn">
              Watch the device keyboard auto-type your campaign prompt, fold away, render 4K high-converting ad creatives, and publish directly to Facebook, Instagram, LinkedIn, and X.
            </p>

            {/* Studio Card */}
            <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(14,165,233,0.06),0_2px_8px_rgba(0,0,0,0.02)] transition-all">
              
              {/* Studio Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                  Campaign Post Prompt
                </label>
                
                {/* Category Chip */}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/70">
                  {activePreset.category}
                </span>
              </div>

              {/* Textarea Mockup showing FULL Prompt */}
              <div className="relative mb-4">
                <div className="w-full min-h-[96px] p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium leading-relaxed shadow-inner">
                  <p className="break-words">
                    {displayedText}
                    {phase === 'typing' && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-600 animate-pulse align-middle" />
                    )}
                  </p>
                </div>
              </div>

              {/* Preset Selector Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {POST_PRESETS.map((preset, index) => {
                  const isActive = index === activePresetIndex;
                  return (
                    <div
                      key={preset.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
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
                    ? 'scale-[0.98] ring-4 ring-cyan-300 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-cyan-500/30'
                    : phase === 'generating'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : phase === 'publishing'
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : phase === 'published_popup'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white'
                }`}
              >
                {phase === 'tap_button' ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Auto-Tapping Generate...</span>
                  </>
                ) : phase === 'generating' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering AI Creative ({generatingProgress}%)...</span>
                  </>
                ) : phase === 'publishing' ? (
                  <>
                    <Send className="w-4 h-4 animate-bounce" />
                    <span>Auto-Publishing Across Channels ({publishingProgress}%)...</span>
                  </>
                ) : phase === 'published_popup' ? (
                  <>
                    <PartyPopper className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <span>Post Published Across 5 Social Channels!</span>
                  </>
                ) : phase === 'showing_post' ? (
                  <>
                    <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span>AI Post Live in Social Feed</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Post</span>
                  </>
                )}
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${phase === 'published_popup' ? 'bg-emerald-500' : phase === 'publishing' ? 'bg-blue-500 animate-ping' : 'bg-cyan-500 animate-pulse'}`} />
                  {phase === 'publishing' ? '1-Click Multi-Channel Publishing' : phase === 'published_popup' ? 'Live on 5 Platforms' : 'Target: ' + activePreset.targetAudience}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">IG Feed</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">FB Page</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">LinkedIn</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Pinterest</span>
                </div>
              </div>

            </div>

            {/* Feature Trust Badges */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mt-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">4K Square</p>
                <p className="text-[11px] font-semibold text-slate-500">1:1 Feed Post</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">Auto Badges</p>
                <p className="text-[11px] font-semibold text-slate-500">Offers & Discounts</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-slate-900">Instant Post</p>
                <p className="text-[11px] font-semibold text-slate-500">Facebook & Insta</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
