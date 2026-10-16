"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Disc,
  Film
} from "lucide-react";

export interface ReelSceneItem {
  scene_number?: number;
  duration?: string;
  visual?: string;
  on_screen_text?: string;
  voiceover?: string;
  image_prompt?: string;
}

export interface FestivalReelPlayerProps {
  festivalName: string;
  festivalEmoji?: string;
  imageUrl: string;
  title: string;
  hook?: string;
  music?: string;
  duration?: string;
  scenes?: ReelSceneItem[] | string[];
  activeSceneIndex?: number;
  onSceneSelect?: (index: number) => void;
}

export default function FestivalReelPlayer({
  festivalName,
  festivalEmoji = "🎉",
  imageUrl,
  title,
  hook,
  music = "Trending Festive Audio • Indian Festive Beats",
  duration = "30s",
  scenes = [],
  activeSceneIndex: controlledSceneIndex,
  onSceneSelect,
}: FestivalReelPlayerProps) {
  // Normalize scenes
  const normalizedScenes: ReelSceneItem[] = Array.isArray(scenes) && scenes.length > 0
    ? scenes.map((s, idx) => {
        if (typeof s === "string") {
          return {
            scene_number: idx + 1,
            duration: `${idx * 7}-${(idx + 1) * 7}s`,
            visual: s,
            on_screen_text: s,
            voiceover: s,
          };
        }
        return {
          scene_number: s.scene_number || idx + 1,
          duration: s.duration || `${idx * 7}-${(idx + 1) * 7}s`,
          visual: s.visual || "",
          on_screen_text: s.on_screen_text || "",
          voiceover: s.voiceover || "",
        };
      })
    : [
        {
          scene_number: 1,
          duration: "0-7s",
          visual: `Festive celebration of ${festivalName} with authentic joy and traditional wear`,
          on_screen_text: hook || `Celebrate ${festivalName}! ✨`,
          voiceover: hook || `Wishing you a joyous ${festivalName} filled with warmth and celebration!`,
        },
        {
          scene_number: 2,
          duration: "7-18s",
          visual: `Family gathering, colorful festive rituals, and delightful festive treats`,
          on_screen_text: `Special ${festivalName} Moments ❤️`,
          voiceover: `Cherishing traditional moments and creating lifelong festive memories with loved ones.`,
        },
        {
          scene_number: 3,
          duration: "18-30s",
          visual: `Celebratory finale with exclusive festive festive offers and greetings`,
          on_screen_text: `Shop The Festive Collection Today! 🛍️`,
          voiceover: `Explore our exclusive ${festivalName} festive collection and make this season unforgettable.`,
        },
      ];

  const totalScenes = normalizedScenes.length;
  const [internalSceneIndex, setInternalSceneIndex] = useState(0);
  const activeIndex = controlledSceneIndex !== undefined ? controlledSceneIndex : internalSceneIndex;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1420);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  // Switch to specific scene
  const selectScene = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, totalScenes - 1));
    setInternalSceneIndex(clamped);
    if (onSceneSelect) onSceneSelect(clamped);
    setProgress((clamped / totalScenes) * 100);
  }, [totalScenes, onSceneSelect]);

  // Audio Engine: Native Web Audio Festive Beats
  const startAudioEngine = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      if (audioCtxRef.current && !audioIntervalRef.current) {
        let beat = 0;
        audioIntervalRef.current = setInterval(() => {
          if (!audioCtxRef.current || isMuted) return;
          const ctx = audioCtxRef.current;
          const now = ctx.currentTime;

          // Rhythmic dhol/tabla base pulse on beat 0 and 2
          if (beat % 2 === 0) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
          }

          // Percussion high tap on beat 1 and 3
          const tapOsc = ctx.createOscillator();
          const tapGain = ctx.createGain();
          tapOsc.type = "triangle";
          tapOsc.frequency.setValueAtTime(beat % 4 === 1 ? 520 : 380, now);
          tapGain.gain.setValueAtTime(0.08, now);
          tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          tapOsc.connect(tapGain);
          tapGain.connect(ctx.destination);
          tapOsc.start(now);
          tapOsc.stop(now + 0.08);

          // Melodic festive chime every 4 beats
          if (beat % 4 === 0) {
            const chime = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chime.type = "sine";
            const scale = [587.33, 659.25, 783.99, 880.00, 1046.50];
            const note = scale[(beat / 4) % scale.length];
            chime.frequency.setValueAtTime(note, now);
            chimeGain.gain.setValueAtTime(0.06, now);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            chime.connect(chimeGain);
            chimeGain.connect(ctx.destination);
            chime.start(now);
            chime.stop(now + 0.35);
          }

          beat = (beat + 1) % 16;
        }, 240);
      }
    } catch (e) {
      console.warn("AudioEngine start warning:", e);
    }
  }, [isMuted]);

  const stopAudioEngine = useCallback(() => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.suspend();
      } catch {}
    }
  }, []);

  // Web Speech API Voiceover narration
  const speakCurrentScene = useCallback((sceneText: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (!sceneText) return;
      const utterance = new SpeechSynthesisUtterance(sceneText);
      utterance.rate = 1.05;
      utterance.pitch = 1.05;
      utterance.volume = isMuted ? 0 : 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("hi-IN"));
      if (indianVoice) utterance.voice = indianVoice;
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
    }
  }, [isMuted]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudioEngine();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      startAudioEngine();
      const currentVoiceover = normalizedScenes[activeIndex]?.voiceover || normalizedScenes[activeIndex]?.on_screen_text;
      if (currentVoiceover) {
        speakCurrentScene(currentVoiceover);
      }
    }
  };

  // Timer loop for video playback & scene progression
  useEffect(() => {
    if (!isPlaying) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const sceneDurationSec = 6;
    const totalDurationSec = totalScenes * sceneDurationSec;
    const intervalMs = 100;
    const stepPercent = (intervalMs / (totalDurationSec * 1000)) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepPercent;
        if (next >= 100) {
          selectScene(0);
          return 0;
        }

        const computedScene = Math.min(
          Math.floor((next / 100) * totalScenes),
          totalScenes - 1
        );

        if (computedScene !== activeIndex) {
          setInternalSceneIndex(computedScene);
          if (onSceneSelect) onSceneSelect(computedScene);
          const vo = normalizedScenes[computedScene]?.voiceover || normalizedScenes[computedScene]?.on_screen_text;
          if (vo) speakCurrentScene(vo);
        }

        return next;
      });
    }, intervalMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, totalScenes, activeIndex, selectScene, normalizedScenes, onSceneSelect, speakCurrentScene]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioEngine();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopAudioEngine]);

  const currentScene = normalizedScenes[activeIndex] || normalizedScenes[0];

  const motionStyles = [
    "scale(1.12) translate(-3%, -2%)",
    "scale(1.18) translate(3%, 2%)",
    "scale(1.10) translate(0%, -3%)",
    "scale(1.15) translate(-2%, 2%)",
  ];
  const activeMotion = isPlaying 
    ? motionStyles[activeIndex % motionStyles.length] 
    : "scale(1.03) translate(0px, 0px)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Phone / Reel Player Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 320,
          aspectRatio: "9/16",
          borderRadius: 24,
          overflow: "hidden",
          background: "#080812",
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(124,58,237,0.3)",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={togglePlay}
      >
        {/* Cinematic Animated Background Visual */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: activeMotion,
              transition: "transform 4.5s cubic-bezier(0.25, 1, 0.5, 1)",
              filter: isPlaying ? "brightness(0.95) contrast(1.05)" : "brightness(0.85)",
            }}
          />

          {/* Vignette & Festive Ambient Gradients */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.85) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Golden Festive Particle Shimmer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 30%, rgba(249,115,22,0.15) 0%, transparent 60%)",
              pointerEvents: "none",
              animation: isPlaying ? "pulseGlow 3s ease-in-out infinite" : "none",
            }}
          />
        </div>

        {/* Top Storyboard Progress Bars */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 10,
            display: "flex",
            gap: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {normalizedScenes.map((s, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const sceneStep = 100 / totalScenes;
            const sceneProgress = isCurrent 
              ? Math.max(0, Math.min(100, ((progress - idx * sceneStep) / sceneStep) * 100))
              : isCompleted ? 100 : 0;

            return (
              <div
                key={idx}
                onClick={() => selectScene(idx)}
                style={{
                  flex: 1,
                  height: 3,
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${sceneProgress}%`,
                    background: "#fff",
                    transition: isPlaying && isCurrent ? "width 0.1s linear" : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Top Header: Badge, Scene & Mute Control */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 12,
            right: 12,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                background: "rgba(124,58,237,0.85)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: isPlaying ? "#22C55E" : "#EF4444",
                  boxShadow: isPlaying ? "0 0 8px #22C55E" : "none",
                  display: "inline-block",
                }}
              />
              SCENE {activeIndex + 1}/{totalScenes}
            </span>
            <span
              style={{
                background: "rgba(0,0,0,0.5)",
                color: "#ddd",
                fontSize: 10,
                padding: "3px 6px",
                borderRadius: 4,
              }}
            >
              {duration}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
              if (!isMuted) {
                stopAudioEngine();
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
              } else if (isPlaying) {
                startAudioEngine();
              }
            }}
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: "50%",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>

        {/* Center: Live Subtitles / On-Screen Text with Pop Animation */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {currentScene.on_screen_text && (
            <div
              key={activeIndex}
              style={{
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(249,115,22,0.45)",
                color: "#FEF08A",
                padding: "10px 14px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 800,
                lineHeight: 1.35,
                textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                maxWidth: 260,
                animation: "textPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              {currentScene.on_screen_text}
            </div>
          )}
        </div>

        {/* Play / Pause Center Overlay Button */}
        {!isPlaying && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #EC4899, #7C3AED)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(236,72,153,0.6)",
                border: "2px solid rgba(255,255,255,0.4)",
              }}
            >
              <Play size={28} style={{ marginLeft: 3 }} />
            </div>
          </div>
        )}

        {/* Right Floating Actions (Instagram Reel Style) */}
        <div
          style={{
            position: "absolute",
            right: 10,
            bottom: 70,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Like */}
          <button
            onClick={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: liked ? "#EF4444" : "#fff",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.4)",
                borderRadius: "50%",
                padding: 7,
              }}
            >
              <Heart size={18} fill={liked ? "#EF4444" : "none"} />
            </div>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>{likeCount}</span>
          </button>

          {/* Comment */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: "50%", padding: 7, color: "#fff" }}>
              <MessageCircle size={18} />
            </div>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>184</span>
          </div>

          {/* Share */}
          <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: "50%", padding: 7, color: "#fff" }}>
            <Send size={18} />
          </div>

          {/* Spinning Music Vinyl */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #111, #333)",
              border: "2px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: isPlaying ? "spinDisc 3s linear infinite" : "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            <Disc size={16} color="#EC4899" />
          </div>
        </div>

        {/* Bottom Left: Reel Info & Scrolling Audio Bar */}
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 60,
            bottom: 12,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            pointerEvents: "none",
          }}
        >
          {/* Creator Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F97316, #EC4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {festivalEmoji}
            </div>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
              @{festivalName.toLowerCase().replace(/[^a-z0-9]/g, "")}
            </span>
          </div>

          {/* Reel Hook / Title Snippet */}
          <div
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: 500,
              lineHeight: 1.3,
              textShadow: "0 1px 4px rgba(0,0,0,0.9)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </div>

          {/* Music Scrolling Marquee */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#ccc",
              fontSize: 10,
              marginTop: 2,
            }}
          >
            <Music size={11} color="#EC4899" />
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 190,
              }}
            >
              {music}
            </span>

            {/* Audio Waveform Equalizer when playing */}
            {isPlaying && !isMuted && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 10 }}>
                <span style={{ width: 2, height: "100%", background: "#EC4899", animation: "bounceBar 0.5s ease-in-out infinite alternate" }} />
                <span style={{ width: 2, height: "60%", background: "#7C3AED", animation: "bounceBar 0.4s ease-in-out infinite alternate 0.1s" }} />
                <span style={{ width: 2, height: "80%", background: "#F97316", animation: "bounceBar 0.6s ease-in-out infinite alternate 0.2s" }} />
              </div>
            )}
          </div>
        </div>

        {/* Global Keyframes Style */}
        <style>{`
          @keyframes spinDisc {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes textPop {
            0% { transform: scale(0.85); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          @keyframes bounceBar {
            0% { height: 2px; }
            100% { height: 10px; }
          }
        `}</style>
      </div>

      {/* Reel Playback Controls Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          maxWidth: 320,
        }}
      >
        <button
          onClick={togglePlay}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 16px",
            background: isPlaying
              ? "rgba(255,255,255,0.15)"
              : "linear-gradient(135deg, #7C3AED, #EC4899)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: isPlaying ? "none" : "0 4px 15px rgba(124,58,237,0.4)",
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? "Pause Reel" : "▶ Play Reel with Audio"}
        </button>

        <button
          onClick={() => {
            selectScene(0);
            if (!isPlaying) togglePlay();
          }}
          title="Restart Reel"
          style={{
            padding: "10px 12px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
