"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Headphones, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  Clock, 
  Check, 
  RotateCcw, 
  Bot, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  Search, 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight,
  ExternalLink,
  Star,
  CheckCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthProvider";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  senderName: string;
  text: string;
  timestamp: string;
  imageUrl?: string;
  imageName?: string;
}

interface Conversation {
  id: string;
  subject: string;
  relatedFeature: string;
  status: "Active" | "Resolved" | "Closed";
  createdAt: string;
  lastUpdated: string;
  unreadCount?: number;
  messages: ChatMessage[];
  rating?: number;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "CHAT-2094",
    subject: "Instagram Autopilot connection and permissions query",
    relatedFeature: "Instagram / Social Platforms",
    status: "Active",
    createdAt: "Today, 10:15 AM",
    lastUpdated: "Just now",
    unreadCount: 0,
    messages: [
      {
        id: "m-1",
        sender: "user",
        senderName: "Sejal Gupta",
        text: "Hi, I am trying to connect my business Instagram page to SevenUnique AI, but Facebook authorization says an Instagram Professional Account is required. How do I complete this?",
        timestamp: "10:15 AM",
      },
      {
        id: "m-2",
        sender: "agent",
        senderName: "Sarah Kapoor (Support Specialist)",
        text: "Hello Sejal! Good morning. Yes, Meta requires all automated scheduling and DM integrations to go through an Instagram Professional (Business or Creator) account. You can switch for free in your Instagram mobile app under Settings > Account Type > Switch to Professional Account. Once done, refresh the connection here!",
        timestamp: "10:18 AM",
      }
    ]
  },
  {
    id: "CHAT-2082",
    subject: "Reel rendering queue took longer than 3 minutes",
    relatedFeature: "AI Reel & Post Generation",
    status: "Resolved",
    createdAt: "Yesterday, 3:45 PM",
    lastUpdated: "Yesterday, 4:10 PM",
    rating: 5,
    messages: [
      {
        id: "m-3",
        sender: "user",
        senderName: "Sejal Gupta",
        text: "I generated a festival reel script and video, but the queue was at 80% for around 3 minutes.",
        timestamp: "Yesterday, 3:45 PM",
      },
      {
        id: "m-4",
        sender: "agent",
        senderName: "Arjun Verma (Tech Desk)",
        text: "Hi Sejal, our GPU cluster auto-scaled during yesterday's peak hours. Your reel is now fully rendered in your Content Library with complete HD quality, and we credited +10 bonus credits to your wallet.",
        timestamp: "Yesterday, 4:05 PM",
      },
      {
        id: "m-5",
        sender: "user",
        senderName: "Sejal Gupta",
        text: "Thank you! I see the reel and credits now. Looks amazing!",
        timestamp: "Yesterday, 4:09 PM",
      }
    ]
  },
  {
    id: "CHAT-2065",
    subject: "Need GSTIN added to monthly subscription invoice",
    relatedFeature: "Billing & Plans",
    status: "Resolved",
    createdAt: "12 Oct 2026",
    lastUpdated: "12 Oct 2026",
    rating: 5,
    messages: [
      {
        id: "m-6",
        sender: "user",
        senderName: "Sejal Gupta",
        text: "Please add our company GSTIN 27AAAAA0000A1Z5 to invoice #INV-904.",
        timestamp: "12 Oct, 11:20 AM",
      },
      {
        id: "m-7",
        sender: "agent",
        senderName: "Vikram (Billing Desk)",
        text: "Hello! We have added the GST number to your profile and sent the updated 18% GST tax invoice to your email.",
        timestamp: "12 Oct, 11:45 AM",
      }
    ]
  }
];

export default function SupportPage() {
  const { user } = useAuth();

  // 3 Core Tabs: 'chatroom' | 'contact' | 'conversations'
  const [activeTab, setActiveTab] = useState<"chatroom" | "contact" | "conversations">("chatroom");

  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string>("CHAT-2094");

  // Chat Input State
  const [messageInput, setMessageInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<{ url: string; name: string } | null>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Contact Support Form State
  const [contactSubject, setContactSubject] = useState("");
  const [contactDescription, setContactDescription] = useState("");
  const [contactFeature, setContactFeature] = useState("AI Reel & Post Generation");
  const [contactAttachedImage, setContactAttachedImage] = useState<{ url: string; name: string } | null>(null);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccessMessage, setContactSuccessMessage] = useState<string | null>(null);

  // My Conversations Filter State
  const [convFilter, setConvFilter] = useState<"All" | "Unresolved" | "Resolved">("All");
  const [convSearch, setConvSearch] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("su_support_conversations_v2");
      if (saved) {
        setConversations(JSON.parse(saved));
      }
    } catch (_) {}
  }, []);

  // Save to localStorage helper
  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    try {
      localStorage.setItem("su_support_conversations_v2", JSON.stringify(updated));
    } catch (_) {}
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (activeTab === "chatroom") {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeChatId, activeTab, isAgentTyping]);

  // Active Conversation
  const activeConversation = conversations.find(c => c.id === activeChatId) || conversations[0];

  // Handle Image Upload for Chat
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({
        url: reader.result as string,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachedImage) return;
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "user",
      senderName: user?.name || "Customer",
      text: messageInput.trim(),
      timestamp: "Just now",
      imageUrl: attachedImage?.url,
      imageName: attachedImage?.name,
    };

    const updatedConv: Conversation = {
      ...activeConversation,
      status: activeConversation.status === "Closed" || activeConversation.status === "Resolved" ? "Active" : activeConversation.status,
      lastUpdated: "Just now",
      messages: [...activeConversation.messages, newMsg]
    };

    const updatedList = conversations.map(c => c.id === activeConversation.id ? updatedConv : c);
    saveConversations(updatedList);
    setMessageInput("");
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Simulate realistic Support Agent response
    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
      const agentReplies = [
        "Thanks for sharing that update! I am checking our system logs right now.",
        "Got it! Let me verify this with our backend pipeline and update your ticket status.",
        "Understood. I have applied this configuration to your account. Could you please refresh your page and check?",
        "Thank you! Our engineering team has logged this issue. We will ensure this is resolved for you immediately."
      ];
      const randomReply = agentReplies[Math.floor(Math.random() * agentReplies.length)];

      const agentMsg: ChatMessage = {
        id: `m-agent-${Date.now()}`,
        sender: "agent",
        senderName: "Sarah Kapoor (Support Specialist)",
        text: randomReply,
        timestamp: "Just now"
      };

      const finalConv: Conversation = {
        ...updatedConv,
        lastUpdated: "Just now",
        messages: [...updatedConv.messages, agentMsg]
      };

      const finalList = updatedList.map(c => c.id === finalConv.id ? finalConv : c);
      saveConversations(finalList);
    }, 1800);
  };

  // Handle Resolve / Close Query
  const handleResolveChat = (rating?: number) => {
    if (!activeConversation) return;

    const updatedConv: Conversation = {
      ...activeConversation,
      status: "Resolved",
      lastUpdated: "Just now",
      rating: rating || 5,
      messages: [
        ...activeConversation.messages,
        {
          id: `sys-${Date.now()}`,
          sender: "agent",
          senderName: "System",
          text: "✓ This query was marked as Resolved. Thank you for choosing SevenUnique AI! You can reopen this chat anytime if you need more help.",
          timestamp: "Just now"
        }
      ]
    };

    const updatedList = conversations.map(c => c.id === activeConversation.id ? updatedConv : c);
    saveConversations(updatedList);
    setShowResolveModal(false);
    setShowRatingSuccess(true);
    setTimeout(() => setShowRatingSuccess(false), 3000);
  };

  // Handle Reopen Conversation
  const handleReopenConversation = (convId: string) => {
    const updatedList = conversations.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          status: "Active" as const,
          lastUpdated: "Just now",
          messages: [
            ...c.messages,
            {
              id: `sys-${Date.now()}`,
              sender: "user" as const,
              senderName: user?.name || "Customer",
              text: "Conversation reopened by customer.",
              timestamp: "Just now"
            }
          ]
        };
      }
      return c;
    });

    saveConversations(updatedList);
    setActiveChatId(convId);
    setActiveTab("chatroom");
  };

  // Handle Contact Support Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSubject.trim() || !contactDescription.trim()) return;

    setIsSubmittingContact(true);
    setTimeout(() => {
      const newChatId = `CHAT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newConv: Conversation = {
        id: newChatId,
        subject: contactSubject.trim(),
        relatedFeature: contactFeature,
        status: "Active",
        createdAt: "Just now",
        lastUpdated: "Just now",
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: "user",
            senderName: user?.name || "Customer",
            text: contactDescription.trim(),
            timestamp: "Just now",
            imageUrl: contactAttachedImage?.url,
            imageName: contactAttachedImage?.name
          },
          {
            id: `m-agent-${Date.now()}`,
            sender: "agent",
            senderName: "SevenUnique Auto-Desk",
            text: `Hello! We received your query regarding "${contactSubject.trim()}". A senior support agent has been assigned and will reply here in real-time shortly.`,
            timestamp: "Just now"
          }
        ]
      };

      const updated = [newConv, ...conversations];
      saveConversations(updated);
      setIsSubmittingContact(false);
      setContactSubject("");
      setContactDescription("");
      setContactAttachedImage(null);
      setContactSuccessMessage(`Your query ${newChatId} was sent! A dedicated support chat has been opened.`);

      setTimeout(() => {
        setContactSuccessMessage(null);
        setActiveChatId(newChatId);
        setActiveTab("chatroom");
      }, 1500);
    }, 700);
  };

  // Filtered Conversations for Tab 3
  const filteredConversations = conversations.filter(c => {
    const matchesFilter = 
      convFilter === "All" || 
      (convFilter === "Unresolved" && c.status === "Active") || 
      (convFilter === "Resolved" && (c.status === "Resolved" || c.status === "Closed"));
    
    const matchesSearch = 
      convSearch === "" ||
      c.id.toLowerCase().includes(convSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(convSearch.toLowerCase()) ||
      c.relatedFeature.toLowerCase().includes(convSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & STREAMLINED 3-TAB NAVIGATOR                              */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center text-white shadow-xl shadow-brand-purple/25 shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Support Center
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Support Team Online
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Direct live chat with support specialists, query submission, and complete conversation history.
              </p>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-elevated/80 rounded-2xl border border-border/70 self-start md:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("chatroom")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "chatroom"
                  ? "bg-brand-gradient text-white shadow-md shadow-brand-purple/20"
                  : "text-text-muted hover:text-white hover:bg-surface-secondary"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Chatroom</span>
              {activeConversation?.status === "Active" && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("contact")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "contact"
                  ? "bg-brand-gradient text-white shadow-md shadow-brand-purple/20"
                  : "text-text-muted hover:text-white hover:bg-surface-secondary"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Contact Support</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("conversations")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "conversations"
                  ? "bg-brand-gradient text-white shadow-md shadow-brand-purple/20"
                  : "text-text-muted hover:text-white hover:bg-surface-secondary"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>My Conversations</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/15 text-white font-medium">
                {conversations.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB 1: LIVE CHATROOM (Direct messaging, agent replies, image share, close) */}
      {/* ========================================================================= */}
      {activeTab === "chatroom" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
          
          {/* Left Mini Sidebar: Chat Channels / Recent Active Queries */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-surface border-border shadow-xl">
              <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-purple" />
                    Support Channels
                  </CardTitle>
                  <CardDescription className="text-[11px] text-text-muted">
                    Click to switch active chatroom
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("contact")}
                  className="text-xs h-7 px-2 border-border text-brand-pink hover:bg-brand-purple/10"
                >
                  + New Query
                </Button>
              </CardHeader>

              <CardContent className="p-2 space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                {conversations.map((c) => {
                  const isSelected = c.id === activeChatId;
                  const lastMsg = c.messages[c.messages.length - 1];
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveChatId(c.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-brand-purple/15 border-brand-purple/40 text-white shadow-md"
                          : "bg-surface-elevated/40 border-transparent hover:bg-surface-elevated hover:border-border text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-[11px] text-brand-pink">{c.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          c.status === "Active" 
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700/40 text-slate-400 border border-slate-600/30"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{c.subject}</h4>
                      <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                        {lastMsg ? `${lastMsg.sender === "user" ? "You" : "Agent"}: ${lastMsg.text}` : "No messages"}
                      </p>
                      <span className="text-[10px] text-text-muted/70 block mt-1">{c.lastUpdated}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Support Desk Info Pill */}
            <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Dedicated Enterprise Care</span>
              </div>
              <p className="text-text-muted text-[11px] leading-relaxed">
                Your chats are encrypted and routed directly to our priority support engineers with zero bots loop.
              </p>
            </div>
          </div>

          {/* Right Main Chatroom Window */}
          <div className="lg:col-span-8">
            <Card className="bg-surface border-border shadow-2xl flex flex-col h-[650px] relative overflow-hidden">
              
              {/* Chatroom Header */}
              <div className="p-4 border-b border-border/70 bg-surface-elevated/60 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-sm shadow-md">
                      SK
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">Sarah Kapoor</h3>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-brand-purple/20 text-brand-pink font-semibold border border-brand-purple/30">
                        Senior Specialist
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5">
                      <span>Ref: <strong className="text-white font-mono">{activeConversation?.id}</strong></span>
                      <span>•</span>
                      <span className="text-slate-300">{activeConversation?.relatedFeature}</span>
                    </p>
                  </div>
                </div>

                {/* Query Resolve & Status Actions */}
                <div className="flex items-center gap-2">
                  {activeConversation?.status === "Active" ? (
                    <Button
                      size="sm"
                      onClick={() => setShowResolveModal(true)}
                      className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold h-8 px-3 rounded-lg shadow-md cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark Resolved
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReopenConversation(activeConversation.id)}
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold h-8 px-3 rounded-lg cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Reopen Query
                    </Button>
                  )}
                </div>
              </div>

              {/* Resolved / Rating Banner */}
              {activeConversation?.status === "Resolved" && (
                <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>This query has been marked as <strong>Resolved</strong>. You can still message or reopen anytime.</span>
                  </div>
                  {activeConversation.rating && (
                    <span className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                      Rated {activeConversation.rating} <Star className="w-3 h-3 fill-amber-400" />
                    </span>
                  )}
                </div>
              )}

              {/* Chat Message Scroll Area */}
              <CardContent className="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-4">
                {activeConversation?.messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted mb-1 px-1">
                        <span className="font-semibold text-slate-300">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? "bg-brand-gradient text-white rounded-br-xs shadow-md"
                            : "bg-surface-elevated text-slate-100 border border-border/80 rounded-bl-xs shadow-sm"
                        }`}
                      >
                        {/* Attached Image Preview inside bubble */}
                        {msg.imageUrl && (
                          <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 bg-black/40">
                            <img
                              src={msg.imageUrl}
                              alt={msg.imageName || "Attached screenshot"}
                              className="w-full max-h-60 object-contain hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => window.open(msg.imageUrl, "_blank")}
                            />
                            {msg.imageName && (
                              <div className="p-1 px-2 text-[10px] text-white/80 bg-black/60 truncate">
                                📎 {msg.imageName}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {isUser && (
                        <span className="text-[10px] text-text-muted flex items-center gap-1 px-1 mt-0.5">
                          <CheckCheck className="w-3 h-3 text-emerald-400" /> Delivered
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Agent Typing Animation */}
                {isAgentTyping && (
                  <div className="flex items-center gap-2 text-xs text-text-muted p-2.5 bg-surface-elevated/60 border border-border rounded-xl w-fit">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[11px] text-slate-300 font-medium">Sarah is typing a response...</span>
                  </div>
                )}

                <div ref={chatScrollRef} />
              </CardContent>

              {/* Attachment Preview Bar (If user selected an image) */}
              {attachedImage && (
                <div className="px-4 py-2 bg-surface-elevated border-t border-border flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-white">
                    <div className="h-8 w-8 rounded-lg overflow-hidden border border-border shrink-0">
                      <img src={attachedImage.url} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                    <span className="truncate max-w-[200px] text-[11px] font-medium">{attachedImage.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-text-muted hover:text-rose-400 p-1"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3.5 border-t border-border bg-surface-elevated/40 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                    id="chat-image-input"
                  />

                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-11 w-11 rounded-xl bg-surface hover:bg-surface-secondary border border-border flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Share screenshot or image"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Message Input */}
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      activeConversation?.status === "Resolved"
                        ? "Query is resolved. Type to reply and reopen..."
                        : "Type your message to support..."
                    }
                    className="h-11 rounded-xl bg-surface border-border text-white text-xs sm:text-sm flex-1 focus:border-brand-purple"
                  />

                  {/* Send Button */}
                  <Button
                    type="submit"
                    disabled={!messageInput.trim() && !attachedImage}
                    className="h-11 px-5 bg-brand-gradient hover:opacity-95 text-white rounded-xl shadow-md cursor-pointer shrink-0 font-semibold text-xs"
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    Send
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: CONTACT SUPPORT (Submit query when agent not immediately available) */}
      {/* ========================================================================= */}
      {activeTab === "contact" && (
        <Card className="bg-surface border-border shadow-2xl relative overflow-hidden max-w-3xl mx-auto animate-in fade-in duration-300">
          <CardHeader className="border-b border-border/60 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-pink" />
                  Contact Support
                </CardTitle>
                <CardDescription className="text-xs text-text-muted mt-1">
                  Submit your query directly to our support desk. A dedicated live chatroom will be created for you automatically.
                </CardDescription>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-purple/15 text-brand-pink border border-brand-purple/30 font-semibold">
                Direct Dispatch
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {contactSuccessMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{contactSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-5">
              {/* Query Subject */}
              <div className="space-y-2">
                <Label htmlFor="contactSubject" className="text-xs font-semibold text-slate-200">
                  Query Subject <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="contactSubject"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Reel generation stuck at 90%, or billing invoice update"
                  required
                  className="h-11 rounded-xl bg-surface-elevated/80 border-border text-white placeholder:text-text-muted/60 focus:border-brand-purple"
                />
              </div>

              {/* Related Feature */}
              <div className="space-y-2">
                <Label htmlFor="contactFeature" className="text-xs font-semibold text-slate-200">
                  Related Feature <span className="text-rose-400">*</span>
                </Label>
                <select
                  id="contactFeature"
                  value={contactFeature}
                  onChange={(e) => setContactFeature(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border bg-surface-elevated/80 px-3.5 py-2.5 text-sm text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all"
                >
                  <option value="AI Reel & Post Generation" className="bg-[#12141f]">AI Reel &amp; Post Generation</option>
                  <option value="UNI AI (Hinglish)" className="bg-[#12141f]">UNI AI (Hinglish Marketing Agent)</option>
                  <option value="Virtual Try-On" className="bg-[#12141f]">Virtual Try-On / Fashion AI</option>
                  <option value="Website Builder" className="bg-[#12141f]">AI Website Builder</option>
                  <option value="Instagram / Social Platforms" className="bg-[#12141f]">Instagram / Social Platforms</option>
                  <option value="Festival Engine" className="bg-[#12141f]">Festival Engine / Calendar</option>
                  <option value="Campaigns & Influencers" className="bg-[#12141f]">Campaigns &amp; Influencers</option>
                  <option value="Billing & Plans" className="bg-[#12141f]">Billing, Plans &amp; Credits</option>
                  <option value="Account & Login" className="bg-[#12141f]">Account &amp; Login</option>
                  <option value="Other" className="bg-[#12141f]">Other Inquiry</option>
                </select>
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <Label htmlFor="contactDescription" className="text-xs font-semibold text-slate-200">
                  Problem Description <span className="text-rose-400">*</span>
                </Label>
                <textarea
                  id="contactDescription"
                  rows={5}
                  value={contactDescription}
                  onChange={(e) => setContactDescription(e.target.value)}
                  placeholder="Describe your question or issue in detail. If there was an error message, please include it..."
                  required
                  className="w-full rounded-xl border border-border bg-surface-elevated/80 p-3.5 text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all"
                />
              </div>

              {/* Screenshot / File Attachment */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-brand-pink" />
                  Screenshot / Image Attachment (Optional)
                </Label>
                <div className="p-4 rounded-xl border-2 border-dashed border-border bg-surface-elevated/40 text-center">
                  <input
                    type="file"
                    id="contact-file-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setContactAttachedImage({ url: reader.result as string, name: file.name });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {contactAttachedImage ? (
                    <div className="flex items-center justify-center gap-3 text-xs text-white">
                      <div className="h-9 w-9 rounded-lg overflow-hidden border border-border shrink-0">
                        <img src={contactAttachedImage.url} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{contactAttachedImage.name}</span>
                      <button
                        type="button"
                        onClick={() => setContactAttachedImage(null)}
                        className="text-text-muted hover:text-rose-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="contact-file-upload" className="cursor-pointer block">
                      <ImageIcon className="w-6 h-6 mx-auto text-text-muted mb-1" />
                      <span className="text-xs text-white font-medium hover:underline">
                        Upload screenshot or photo (PNG, JPG)
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Action Submit */}
              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("chatroom")}
                  className="border-border text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="bg-brand-gradient hover:opacity-95 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-brand-purple/25 cursor-pointer"
                >
                  {isSubmittingContact ? (
                    <>Sending Message...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: MY CONVERSATIONS (Previous, unresolved, agent replies, reopen)   */}
      {/* ========================================================================= */}
      {activeTab === "conversations" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-brand-purple" />
                My Conversations ({conversations.length})
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                View previous conversations, check unresolved queries, review agent replies, and reopen resolved chats.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setActiveTab("contact")}
              className="bg-brand-gradient text-white text-xs font-semibold h-9 rounded-xl shadow-md"
            >
              + Submit New Query
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
                placeholder="Search conversations by ID (e.g. CHAT-2094), subject, or feature..."
                className="pl-10 h-10 rounded-xl bg-surface border-border text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(["All", "Unresolved", "Resolved"] as const).map((filterOpt) => (
                <button
                  key={filterOpt}
                  type="button"
                  onClick={() => setConvFilter(filterOpt)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                    convFilter === filterOpt
                      ? "bg-brand-purple text-white shadow-sm"
                      : "bg-surface text-text-muted hover:text-white border border-border"
                  }`}
                >
                  {filterOpt === "Unresolved" ? "Unresolved / Active" : filterOpt}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List Cards */}
          <div className="space-y-3.5">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isResolved = conv.status === "Resolved" || conv.status === "Closed";

                return (
                  <Card 
                    key={conv.id} 
                    className="bg-surface border-border hover:border-brand-purple/40 shadow-md transition-all group"
                  >
                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-bold text-xs bg-brand-purple/10 text-brand-pink border border-brand-purple/20 px-2 py-0.5 rounded-md">
                            {conv.id}
                          </span>
                          <h4 className="text-sm font-bold text-white group-hover:text-brand-pink transition-colors">
                            {conv.subject}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            conv.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-700/40 text-slate-400 border border-slate-600/30"
                          }`}>
                            {conv.status === "Active" ? "Active / Unresolved" : "Resolved"}
                          </span>
                        </div>

                        {/* Last message preview */}
                        <p className="text-xs text-text-muted line-clamp-2">
                          <strong className="text-slate-200">
                            {lastMsg?.sender === "user" ? "You" : lastMsg?.senderName || "Agent"}:
                          </strong>{" "}
                          {lastMsg?.text}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1">
                          <span>Feature: <strong className="text-slate-300 font-medium">{conv.relatedFeature}</strong></span>
                          <span>•</span>
                          <span>Messages: {conv.messages.length}</span>
                          <span>•</span>
                          <span>Last Activity: {conv.lastUpdated}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
                        {isResolved ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReopenConversation(conv.id)}
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs gap-1.5 h-9"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reopen Chat
                          </Button>
                        ) : null}

                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveChatId(conv.id);
                            setActiveTab("chatroom");
                          }}
                          className="bg-brand-gradient text-white text-xs font-semibold h-9 px-4 rounded-xl shadow-md gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Open in Chatroom
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface-elevated/30">
                <MessageSquare className="w-8 h-8 mx-auto text-text-muted mb-2" />
                <h4 className="text-sm font-bold text-white">No Conversations Found</h4>
                <p className="text-xs text-text-muted mt-1">
                  You don&apos;t have any support conversations matching this filter.
                </p>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("contact")}
                  className="mt-4 bg-brand-gradient text-white text-xs"
                >
                  Start a Conversation
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. RESOLVE QUERY MODAL DIALOG                                             */}
      {/* ========================================================================= */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-surface border-border shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Resolve Support Query?
              </CardTitle>
              <CardDescription className="text-xs text-text-muted">
                Has your problem or question been addressed to your satisfaction?
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Marking this query as resolved will update its status. You can reopen it at any time from <strong>My Conversations</strong> if you need further help.
              </p>

              <div>
                <Label className="text-xs text-slate-300 font-semibold mb-2 block">
                  Rate your support experience:
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleResolveChat(star)}
                      className="p-2 rounded-lg bg-surface-elevated hover:bg-amber-500/20 text-amber-400 transition-colors"
                      title={`${star} Star`}
                    >
                      <Star className="w-5 h-5 fill-amber-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResolveModal(false)}
                  className="border-border text-slate-300 hover:text-white text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleResolveChat(5)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4"
                >
                  Confirm &amp; Resolve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
