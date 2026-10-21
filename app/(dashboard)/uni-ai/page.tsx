"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  Plus, 
  MessageSquare, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Film, 
  Image as ImageIcon, 
  ArrowRight, 
  Camera, 
  Volume2, 
  Calendar, 
  Layers,
  Send
} from "lucide-react";
import Link from "next/link";
import agentService from "@/services/agent.service";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  action?: string;
  data?: any;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "ai",
  content:
    "Namaste! Main **UNI AI Assistant** hoon — powered by Google Gemini. Main aapke business ke liye high-converting social posts, viral reel scripts, festival campaigns aur marketing strategies natively Hindi & Hinglish mein bana sakta hoon.\n\nAap mujhse koi bhi marketing advice pooch sakte hain ya post/reel create karne ko keh sakte hain!",
};

const STARTER_PROMPTS = [
  { icon: "👗", label: "Diwali Sale Instagram Post", prompt: "Diwali festival sale ke liye ek attractive Instagram post bana do with caption, hashtags aur CTA" },
  { icon: "🎬", label: "Viral Reel Script (0-3s Hook)", prompt: "Mere clothing brand ke liye ek viral reel script banao with 3-second hook, visual directions aur voiceover" },
  { icon: "📈", label: "Sales Boost Marketing Advice", prompt: "Instagram par online sales boost karne ke liye 5 effective marketing tips aur offer ideas batao" },
  { icon: "🪔", label: "Festival Campaign Strategy", prompt: "Aane wale festive season ke liye complete marketing campaign plan aur discounts ki strategy batao" },
  { icon: "💡", label: "Catchy Slogans & Taglines", prompt: "Mere fashion aur apparel brand ke liye 5 catchy modern taglines aur slogans suggest karo" },
];

function createSession(): ChatSession {
  return {
    id: Date.now().toString(),
    title: "New Chat",
    messages: [WELCOME_MSG],
    createdAt: new Date(),
  };
}

// Markdown & Formatted Text Renderer for Gemini responses
function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed text-[14.5px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
        const isNumber = /^\d+\.\s/.test(trimmed);

        const cleanLine = isBullet
          ? trimmed.replace(/^[\*\-•]\s+/, "")
          : isNumber
          ? trimmed.replace(/^\d+\.\s+/, "")
          : line;

        // Parse bold (**text**), italics (*text*), and code (`code`)
        const parts = cleanLine.split(/(\*\*.*?\*\*|\*[^*]+?\*|`[^`]+?`)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-bold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*")) {
            return (
              <em key={pIdx} className="italic text-purple-200">
                {part.slice(1, -1)}
              </em>
            );
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code key={pIdx} className="bg-black/40 text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
              <div className="text-neutral-200 flex-1">{renderedLine}</div>
            </div>
          );
        }

        if (isNumber) {
          const numMatch = trimmed.match(/^(\d+)\./);
          const num = numMatch ? numMatch[1] : "";
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-brand-purple font-bold text-xs shrink-0 mt-0.5">{num}.</span>
              <div className="text-neutral-200 flex-1">{renderedLine}</div>
            </div>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-white font-bold text-base mt-3 mb-1">
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="text-white font-extrabold text-lg mt-3 mb-1">
              {trimmed.replace(/^##\s+/, "")}
            </h3>
          );
        }

        return (
          <p key={idx} className="text-neutral-200">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

export default function UniAIPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uni_ai_sessions");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [createSession()];
  });

  const [activeId, setActiveId] = useState<string>(() => sessions[0]?.id || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("uni_ai_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const startNewChat = () => {
    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
    setInput("");
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (updated.length === 0) {
        const fresh = createSession();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(updated[0].id);
      return updated;
    });
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (overridePrompt?: string) => {
    const commandToSend = (overridePrompt ?? input).trim();
    if (!commandToSend || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: commandToSend };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeId) return s;
        const isFirst = s.messages.filter((m) => m.role === "user").length === 0;
        return {
          ...s,
          title: isFirst ? commandToSend.slice(0, 36) + (commandToSend.length > 36 ? "…" : "") : s.title,
          messages: [...s.messages, userMsg],
        };
      })
    );
    if (!overridePrompt) setInput("");
    setLoading(true);

    try {
      const res = await agentService.sendCommand(userMsg.content);

      let aiContent = "";
      let customAction = res.action;

      // Dynamic Personalized Messaging from Gemini (No more hardcoded static replies)
      if (res.message && typeof res.message === "string" && res.message.trim().length > 0) {
        aiContent = res.message.trim();
      } else if (res.data && typeof res.data === "string" && res.data.trim().length > 0) {
        aiContent = res.data.trim();
      } else if (res.action === "create_post") {
        aiContent = "Ji zaroor! Maine aapke brand ke liye ek high-converting social post design kar diya hai. Preview aur details niche check karein:";
      } else if (res.action === "create_reel") {
        aiContent = "Zaroor! Maine aapke liye viral reel script, 0-3s hook aur camera scene breakdown taiyaar kar diya hai:";
      } else if (res.action === "generate_festival_campaign") {
        aiContent = "Badhiya! Aapka complete festival marketing campaign ready hai:";
      } else {
        aiContent = "Main aapki marketing growth ke liye ready hoon. Aap koi bhi strategy pooch sakte hain ya content banwa sakte hain!";
      }

      if (typeof aiContent === 'string' && aiContent.includes("Business profile not found")) {
        customAction = "setup_brand";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiContent,
        action: customAction,
        data: res.data,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id !== activeId ? s : { ...s, messages: [...s.messages, aiMsg] }
        )
      );
    } catch (e: any) {
      const errMsg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        (e?.response?.status === 401
          ? "Session expire ho gayi. Please dubara login karein."
          : e?.response?.status === 500
          ? "Server error aa gaya. Backend logs check karein."
          : "Network error aa gaya. Phir se try karein.");

      setSessions((prev) =>
        prev.map((s) =>
          s.id !== activeId
            ? s
            : {
                ...s,
                messages: [
                  ...s.messages,
                  { 
                    id: (Date.now() + 1).toString(), 
                    role: "ai", 
                    content: errMsg,
                    action: typeof errMsg === 'string' && errMsg.includes("Business profile not found") ? "setup_brand" : undefined,
                  },
                ],
              }
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDataCard = (action: string, data: any, msgId: string) => {
    if (action === "setup_brand") {
      return (
        <div className="mt-3">
          <Link href="/brand" className="inline-flex items-center gap-2 bg-brand-purple/20 border border-brand-purple/40 hover:bg-brand-purple/30 px-4 py-2 rounded-xl text-white font-semibold text-xs transition-all shadow-sm">
            <Settings size={14} className="text-brand-purple" />
            Setup Brand Kit & Products
          </Link>
        </div>
      );
    }

    if (!data) return null;

    // 1. Post / Banner Generation Card
    if (action === "create_post") {
      const hasMedia = data.image_url || data.media_url;
      const copyPayload = `${data.headline || ''}\n\n${data.caption || ''}\n\n👉 ${data.call_to_action || ''}\n\n${(data.hashtags || []).join(' ')}`.trim();

      return (
        <div className="bg-surface-elevated/80 border border-border/80 hover:border-brand-purple/40 transition-all rounded-2xl p-4 mt-3 space-y-3.5 shadow-xl max-w-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple text-[11px] font-bold flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Generated AI Social Post
            </span>
            <button
              onClick={() => copyToClipboard(copyPayload, `post-${msgId}`)}
              className="text-xs text-text-muted hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy entire post"
            >
              {copiedKey === `post-${msgId}` ? (
                <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400 text-[11px] font-semibold">Copied</span></>
              ) : (
                <><Copy className="w-3.5 h-3.5" /><span className="text-[11px]">Copy Post</span></>
              )}
            </button>
          </div>

          {hasMedia && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 group">
              <img 
                src={data.image_url || data.media_url} 
                alt="Generated post preview" 
                className="w-full max-h-72 object-cover transition-transform duration-300 group-hover:scale-[1.01]" 
              />
              <a
                href={data.image_url || data.media_url}
                target="_blank"
                download={`uni-post-${Date.now()}.jpg`}
                rel="noreferrer"
                className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-black transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </a>
            </div>
          )}

          {data.headline && (
            <h4 className="text-base font-bold text-white leading-snug">{data.headline}</h4>
          )}

          {data.caption && (
            <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {data.caption}
            </div>
          )}

          {data.call_to_action && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted font-medium">CTA:</span>
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-sm">
                👉 {data.call_to_action}
              </span>
            </div>
          )}

          {data.hashtags && data.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.hashtags.map((tag: string, idx: number) => (
                <span key={idx} className="text-[11px] font-semibold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <Link
              href="/ai-post"
              className="text-xs font-bold text-brand-purple hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Publish in AI Post Maker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      );
    }

    // 2. Reels & Video Scripts Card
    if (action === "create_reel") {
      const reelScriptPayload = `${data.title || 'Reel Script'}\n\nHOOK:\n${data.hook || ''}\n\nSCENES:\n${(data.scenes || []).map((s: any) => `Scene ${s.scene_number}: ${s.visual}\nVoiceover: ${s.voiceover}\nText: ${s.on_screen_text || ''}`).join('\n\n')}\n\nCTA: ${data.cta || ''}\n\n${data.caption || ''}`.trim();

      return (
        <div className="bg-surface-elevated/80 border border-border/80 hover:border-brand-purple/40 transition-all rounded-2xl p-4 mt-3 space-y-3.5 shadow-xl max-w-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center gap-1.5 border border-amber-500/20">
              <Film className="w-3.5 h-3.5" />
              Viral Reel Storyboard
            </span>
            <button
              onClick={() => copyToClipboard(reelScriptPayload, `reel-${msgId}`)}
              className="text-xs text-text-muted hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy entire script"
            >
              {copiedKey === `reel-${msgId}` ? (
                <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400 text-[11px] font-semibold">Copied</span></>
              ) : (
                <><Copy className="w-3.5 h-3.5" /><span className="text-[11px]">Copy Script</span></>
              )}
            </button>
          </div>

          {data.title && (
            <h4 className="text-base font-bold text-white">{data.title}</h4>
          )}

          {/* 0-3s Hook Box */}
          {data.hook && (
            <div className="bg-amber-500/10 border-l-3 border-amber-500 p-3 rounded-r-xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                0-3s Thumb-Stopping Hook
              </div>
              <p className="text-white text-xs sm:text-sm font-semibold italic">&ldquo;{data.hook}&rdquo;</p>
            </div>
          )}

          {/* Scene Breakdown */}
          {data.scenes && data.scenes.length > 0 && (
            <div className="space-y-2">
              <div className="text-text-muted font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-brand-purple" />
                Scene Directions ({data.scenes.length} Scenes)
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {data.scenes.map((scene: any, sIdx: number) => (
                  <div key={sIdx} className="bg-black/30 rounded-xl p-2.5 border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-text-muted font-semibold">
                      <span>Scene {scene.scene_number || sIdx + 1}</span>
                      {scene.duration_seconds && <span>{scene.duration_seconds}s</span>}
                    </div>
                    {scene.visual && (
                      <div className="text-neutral-300"><span className="text-text-muted font-medium">Visual:</span> {scene.visual}</div>
                    )}
                    {scene.voiceover && (
                      <div className="text-purple-200"><span className="text-text-muted font-medium">Voiceover:</span> &ldquo;{scene.voiceover}&rdquo;</div>
                    )}
                    {scene.on_screen_text && (
                      <div className="text-emerald-400 text-[11px] font-semibold">Text Overlay: {scene.on_screen_text}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.cta && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted font-medium">Reel CTA:</span>
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-sm">
                👉 {data.cta}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <Link
              href="/create/reel"
              className="text-xs font-bold text-brand-purple hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Produce in Reel Creator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      );
    }

    // 3. Festival Campaign Card
    if (action === "generate_festival_campaign") {
      return (
        <div className="bg-gradient-to-br from-purple-900/30 via-surface-elevated to-indigo-900/30 border border-brand-purple/40 rounded-2xl p-4 mt-3 space-y-3 shadow-xl max-w-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{data.festival_emoji || "🎉"}</span>
            <div>
              <h4 className="text-base font-bold text-white">{data.festival_name || "Festival"} Marketing Campaign</h4>
              <p className="text-xs text-text-muted">Structured promotional schedule, offers, and creative assets</p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Aapke festival campaign ke assets aur roadmap generate ho chuke hain. Aap inhein Content Calendar aur Campaign dashboard mein schedule kar sakte hain.
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
            <Link
              href="/campaigns"
              className="text-xs font-bold text-brand-purple hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Open Campaigns Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/plan-content"
              className="text-xs font-semibold text-text-muted hover:text-white transition-colors"
            >
              View Calendar
            </Link>
          </div>
        </div>
      );
    }

    return null;
  };

  const formatTime = (d: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(d).toLocaleDateString();
  };

  if (!mounted) return null;

  return (
    <div className="h-[calc(100vh-64px)] flex bg-[#0a0a14] relative overflow-hidden">
      {/* ── Sidebar ── */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden bg-[#0f0f1c] border-r border-white/5 flex flex-col shrink-0 ${
          sidebarOpen ? "w-64 min-w-[16rem]" : "w-0 min-w-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/5">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-gradient hover:opacity-90 rounded-xl text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* History Label */}
        <div className="px-4 py-3 text-[11px] font-bold text-text-muted tracking-wider uppercase">
          Recent Conversations
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all group ${
                s.id === activeId 
                  ? "bg-brand-purple/20 border border-brand-purple/40 text-white" 
                  : "hover:bg-white/5 border border-transparent text-text-muted hover:text-white"
              }`}
            >
              <MessageSquare size={14} className={s.id === activeId ? "text-brand-purple shrink-0" : "text-text-muted shrink-0"} />
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-semibold truncate">
                  {s.title}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">{formatTime(s.createdAt)}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 transition-opacity cursor-pointer shrink-0"
                title="Delete chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sidebar Toggle Button ── */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        className="absolute top-1/2 z-10 -translate-y-1/2 bg-[#1a1a2e] border border-white/10 text-text-muted hover:text-white py-2 px-1 rounded-r-lg transition-all duration-300 cursor-pointer shadow-lg"
        style={{ left: sidebarOpen ? 256 : 0 }}
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-white/5 bg-[#11111a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-xl shadow-lg shadow-purple-500/20 shrink-0">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white leading-tight">UNI AI Assistant</h1>
                <span className="px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple text-[10px] font-bold border border-brand-purple/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  Gemini Flash 3.8
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">Speaks Hindi &amp; Hinglish natively &bull; Marketing &amp; Creative Intelligence</p>
            </div>
          </div>
          <button
            onClick={startNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple/10 border border-brand-purple/30 hover:bg-brand-purple/20 rounded-xl text-purple-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus size={14} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSession?.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-lg transition-all ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs" 
                    : "bg-[#181824] border border-white/5 text-white rounded-bl-xs"
                }`}
              >
                {msg.role === "ai" ? (
                  <div className="space-y-2">
                    <FormattedMessage content={msg.content} />
                    {msg.action && renderDataCard(msg.action, msg.data, msg.id)}
                  </div>
                ) : (
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start">
              <div className="p-4 rounded-2xl bg-[#181824] border border-white/5 text-text-muted text-xs font-semibold flex items-center gap-2.5">
                <span className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span 
                      key={i} 
                      className="w-1.5 h-1.5 rounded-full bg-brand-purple inline-block animate-bounce" 
                      style={{ animationDelay: `${i * 0.15}s` }} 
                    />
                  ))}
                </span>
                <span>UNI AI is consulting Gemini...</span>
              </div>
            </div>
          )}

          {/* Starter Prompts on Fresh Chat */}
          {activeSession?.messages.length === 1 && !loading && (
            <div className="pt-4 max-w-2xl mx-auto space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Marketing Suggestions (1-Click Try)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STARTER_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.prompt)}
                    className="p-3 bg-surface-elevated/60 hover:bg-surface-elevated border border-border/80 hover:border-brand-purple/40 rounded-xl text-left transition-all group flex items-start gap-2.5 cursor-pointer shadow-sm"
                  >
                    <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">{p.icon}</span>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{p.label}</div>
                      <div className="text-[11px] text-text-muted truncate mt-0.5">{p.prompt}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 px-6 bg-[#11111a] border-t border-white/5">
          <div className="max-w-4xl mx-auto flex items-center gap-3 bg-surface-elevated/70 border border-white/10 rounded-2xl p-2 px-3 focus-within:border-brand-purple/50 transition-colors shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Poochiye (e.g. Diwali offers ki strategy batao ya kurta ka post bana do)..."
              className="flex-1 bg-transparent border-none text-white placeholder-text-muted outline-none text-sm px-2"
            />
            <button
              type="button"
              onClick={startListening}
              title={isListening ? "Listening..." : "Voice input (Hindi/English)"}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isListening 
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" 
                  : "bg-white/5 text-text-muted hover:text-white hover:bg-white/10"
              }`}
            >
              {isListening ? <span className="text-xs font-bold">●</span> : <Mic size={18} />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="py-2 px-4 rounded-xl bg-brand-gradient hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shrink-0"
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
