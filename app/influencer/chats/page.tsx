"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send, 
  CheckCheck, 
  Check, 
  Sparkles, 
  Building2, 
  Briefcase, 
  FileText, 
  Download, 
  X, 
  Image as ImageIcon, 
  ExternalLink, 
  ChevronRight, 
  MessageSquare, 
  ShieldCheck,
  Clock,
  Info,
  Circle
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { chatService, ChatConversation, ChatMessageItem, ChatAttachment } from '@/services/chat.service';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';

type FilterCategory = 'all' | 'brands' | 'collaborations' | 'unread';

function InfluencerChatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const userId = user?.id || (user as any)?._id;

  // Conversations state
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Active chat state
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<InfluencerProfile | null>(null);

  // Mobile state (true = in chat thread, false = viewing inbox list)
  const [mobileInThread, setMobileInThread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Load profile and conversations on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      try {
        setLoading(true);
        const [loadedConvs, profRes] = await Promise.all([
          chatService.getConversations(userId),
          influencerService.getMyProfile().catch(() => null)
        ]);

        if (!isMounted) return;

        if (profRes?.success && profRes.data) {
          setCreatorProfile(profRes.data);
        }

        setConversations(loadedConvs);

        // Check if query params specify a conversation
        const queryConvId = searchParams.get('id');
        const queryBrand = searchParams.get('brand');

        let targetId = loadedConvs[0]?.id || null;
        if (queryConvId && loadedConvs.some(c => c.id === queryConvId)) {
          targetId = queryConvId;
        } else if (queryBrand) {
          const matched = loadedConvs.find(c => c.business_name.toLowerCase() === queryBrand.toLowerCase());
          if (matched) targetId = matched.id;
        }

        if (targetId) {
          setActiveConvId(targetId);
        }
      } catch (err) {
        console.error('Failed to load chats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitial();
    return () => { isMounted = false; };
  }, [userId, searchParams]);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConvId) return;

    let isMounted = true;
    async function loadThread() {
      const msgs = await chatService.getMessages(activeConvId!, userId);
      if (isMounted) {
        setMessages(msgs);
        // Mark conversation as read
        await chatService.markConversationAsRead(activeConvId!, userId);
        // Update local unread counter in list
        setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, unread_count: 0 } : c));
      }
    }

    loadThread();
    return () => { isMounted = false; };
  }, [activeConvId, userId]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Active conversation object
  const activeConversation = conversations.find(c => c.id === activeConvId) || null;

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = conv.business_name.toLowerCase().includes(q);
      const matchMsg = conv.last_message.toLowerCase().includes(q);
      const matchCamp = conv.campaign_name?.toLowerCase().includes(q);
      if (!matchName && !matchMsg && !matchCamp) return false;
    }

    // Category match
    if (activeCategory === 'brands') return conv.category === 'brands';
    if (activeCategory === 'collaborations') return conv.category === 'collaborations';
    if (activeCategory === 'unread') return conv.unread_count > 0;
    return true;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? messageInput).trim();
    if ((!text && !pendingAttachment) || !activeConvId || sending) return;

    setSending(true);
    const creatorName = creatorProfile?.fullName || creatorProfile?.full_name || user?.name || user?.fullName || 'Creator';

    try {
      const sentMsg = await chatService.sendMessage(
        activeConvId,
        text,
        creatorName,
        userId,
        pendingAttachment ? [pendingAttachment] : undefined
      );

      setMessages(prev => [...prev, sentMsg]);
      setMessageInput('');
      setPendingAttachment(null);
      setShowEmojiPicker(false);

      // Update conversation in list
      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            last_message: text || (pendingAttachment ? 'Sent an attachment' : ''),
            last_message_at: 'Just now'
          };
        }
        return c;
      }));

      // Focus back on input
      setTimeout(() => chatInputRef.current?.focus(), 50);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  // Quick replies
  const quickReplies = [
    "Hi! I'm interested in this campaign! ✨",
    "Please find my media kit and pricing card attached 📄",
    "Uploaded the final draft reel for your team's review! 🎬",
    "Let me know if you need any adjustments to the hook or caption 🙌"
  ];

  // Quick emojis
  const quickEmojis = ["👍", "❤️", "🔥", "✨", "🙌", "🤩", "🤝", "🚀"];

  // Select conversation
  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    setMobileInThread(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] md:h-[calc(100vh-3rem)] max-w-7xl mx-auto rounded-2xl md:rounded-3xl border border-white/10 bg-[#08090d] overflow-hidden shadow-2xl">
      
      {/* Split-Screen Container */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">

        {/* ========================================================
            LEFT COLUMN: CONVERSATION LIST (Desktop + Mobile list)
           ======================================================== */}
        <div 
          className={`
            w-full md:w-80 lg:w-96 border-r border-white/10 bg-[#0c0d15] flex flex-col shrink-0 transition-all duration-300
            ${mobileInThread ? 'hidden md:flex' : 'flex'}
          `}
        >
          {/* Top Header */}
          <div className="p-3.5 sm:p-4 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Link
                  href="/influencer"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Chats
                  </h1>
                  {totalUnread > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#f0449b] text-white shadow-sm shadow-pink-500/30">
                      {totalUnread}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className={`p-2 rounded-xl transition-colors ${showSearchInput ? 'bg-[#be32ff]/20 text-[#be32ff]' : 'hover:bg-white/10 text-neutral-400 hover:text-white'}`}
                  title="Search messages"
                >
                  <Search className="w-4 h-4" />
                </button>
                <Link
                  href="/influencer/brand-deals"
                  className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  title="Explore new brand deals"
                >
                  <Briefcase className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Collapsible Search Input */}
            {showSearchInput && (
              <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brands, messages..."
                  className="w-full h-8 pl-8 pr-7 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#be32ff]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Category Filter Pills (Exact Option 3 Styling) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] font-bold">
              {/* All */}
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-[#f0449b] text-white shadow-md shadow-pink-500/20'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                All
              </button>

              {/* Brands */}
              <button
                type="button"
                onClick={() => setActiveCategory('brands')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === 'brands'
                    ? 'bg-[#f0449b] text-white shadow-md shadow-pink-500/20'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Brands
              </button>

              {/* Collaborations */}
              <button
                type="button"
                onClick={() => setActiveCategory('collaborations')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === 'collaborations'
                    ? 'bg-[#f0449b] text-white shadow-md shadow-pink-500/20'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Collaborations
              </button>

              {/* Unread */}
              <button
                type="button"
                onClick={() => setActiveCategory('unread')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  activeCategory === 'unread'
                    ? 'bg-[#f0449b] text-white shadow-md shadow-pink-500/20'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Unread</span>
                {totalUnread > 0 && <span>({totalUnread})</span>}
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/10">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                    <div className="w-11 h-11 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-white/10 rounded w-1/3" />
                      <div className="h-3 bg-white/5 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="text-xs font-bold text-white">No chats found</p>
                <p className="text-[11px] text-neutral-400">
                  {searchQuery ? 'Try another search keyword' : 'Apply to brand deals to initiate conversations'}
                </p>
                <Link
                  href="/influencer/brand-deals"
                  className="inline-block mt-2 px-3 py-1.5 rounded-full bg-[#be32ff]/20 hover:bg-[#be32ff]/30 text-[#d87aff] text-xs font-bold transition-colors"
                >
                  Explore Brand Deals
                </Link>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    type="button"
                    className={`
                      w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer group relative
                      ${isActive ? 'bg-[#181926] border-l-4 border-l-[#f0449b]' : 'hover:bg-white/[0.03]'}
                    `}
                  >
                    {/* Brand Logo with Online Status */}
                    <div className="relative shrink-0">
                      {conv.business_logo ? (
                        <img
                          src={conv.business_logo}
                          alt={conv.business_name}
                          className="w-11 h-11 rounded-full object-cover border border-white/10 shadow-sm"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Fallback avatar initial if image missing */}
                      <div
                        style={{ display: conv.business_logo ? 'none' : 'flex' }}
                        className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-700 to-pink-600 items-center justify-center font-black text-sm text-white border border-white/10"
                      >
                        {conv.business_name.charAt(0)}
                      </div>

                      {/* Online indicator */}
                      {conv.is_online && (
                        <span 
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c0d15]"
                          title="Online now"
                        />
                      )}
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>
                            {conv.business_name}
                          </span>
                          {conv.is_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 fill-[#38bdf8]/10" />
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 shrink-0 font-medium">
                          {conv.last_message_at}
                        </span>
                      </div>

                      {/* Campaign tag if exists */}
                      {conv.campaign_name && (
                        <div className="text-[10px] text-[#be32ff] truncate font-medium mb-0.5">
                          {conv.campaign_name}
                        </div>
                      )}

                      {/* Last Message Snippet */}
                      <p className={`text-[11px] truncate leading-snug ${conv.unread_count > 0 ? 'text-white font-semibold' : 'text-neutral-400'}`}>
                        {conv.last_message}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {conv.unread_count > 0 && (
                      <span className="self-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#f0449b] text-white shrink-0 shadow-sm shadow-pink-500/30">
                        {conv.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: ACTIVE CHAT THREAD (Desktop + Mobile)
           ======================================================== */}
        <div 
          className={`
            flex-1 bg-[#090a12] flex flex-col min-w-0
            ${mobileInThread ? 'flex' : 'hidden md:flex'}
          `}
        >
          {activeConversation ? (
            <>
              {/* Active Conversation Top Bar */}
              <div className="h-16 px-4 border-b border-white/10 bg-[#0c0d17]/80 backdrop-blur-md flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileInThread(false)}
                    className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {/* Brand Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={activeConversation.business_logo}
                      alt={activeConversation.business_name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    {activeConversation.is_online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090a12]" />
                    )}
                  </div>

                  {/* Brand Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-xs sm:text-sm font-black text-white truncate">
                        {activeConversation.business_name}
                      </h2>
                      {activeConversation.is_verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 fill-[#38bdf8]/10" />
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {activeConversation.business_category || 'Brand Partner'} &bull; Active Now
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                  {/* Toggle Campaign Info Drawer */}
                  {activeConversation.campaign_name && (
                    <button
                      type="button"
                      onClick={() => setShowCampaignDetails(!showCampaignDetails)}
                      className={`h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${showCampaignDetails ? 'bg-[#be32ff]/20 text-[#d87aff] border border-[#be32ff]/40' : 'bg-white/5 hover:bg-white/10 text-neutral-300'}`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Campaign Brief</span>
                    </button>
                  )}

                  {/* Simulated Audio Call */}
                  <button
                    type="button"
                    onClick={() => alert(`Connecting voice call with ${activeConversation.business_name} representative...`)}
                    className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Audio call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  {/* More options */}
                  <button
                    type="button"
                    onClick={() => setShowCampaignDetails(!showCampaignDetails)}
                    className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Conversation details"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Linked Campaign Info Bar (Collapsible or Banner) */}
              {activeConversation.campaign_name && (
                <div className={`border-b border-white/10 bg-[#121320] px-4 py-2.5 transition-all text-xs ${showCampaignDetails ? 'block' : 'hidden sm:block'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#be32ff]/20 text-[#d87aff] font-bold text-[10px] border border-[#be32ff]/30">
                        {activeConversation.campaign_status || 'Active Deal'}
                      </span>
                      <span className="font-bold text-white truncate">
                        {activeConversation.campaign_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-300">
                      {activeConversation.campaign_budget && (
                        <span className="font-black text-emerald-400">
                          ₹{activeConversation.campaign_budget.toLocaleString('en-IN')} Payout
                        </span>
                      )}
                      <Link
                        href="/influencer/collaborations"
                        className="text-[#be32ff] hover:text-[#d87aff] font-bold flex items-center gap-0.5"
                      >
                        <span>Collaborations</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Deliverables snippet */}
                  {showCampaignDetails && activeConversation.campaign_deliverables && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[10px]">
                      <span className="text-neutral-400 font-medium">Deliverables:</span>
                      {activeConversation.campaign_deliverables.map((deliv, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                          {deliv}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Message Thread Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {/* Date separator */}
                <div className="flex items-center justify-center my-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-semibold text-neutral-400 border border-white/5">
                    Today
                  </span>
                </div>

                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#be32ff]" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Start the conversation</h3>
                    <p className="text-xs text-neutral-400 max-w-sm">
                      Pitch your creative concepts, ask questions about campaign briefs, or agree on deliverables.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_role === 'influencer' || msg.sender_id === userId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Business avatar for incoming messages */}
                        {!isMe && (
                          <img
                            src={activeConversation.business_logo}
                            alt={activeConversation.business_name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-white/10"
                          />
                        )}

                        {/* Bubble */}
                        <div
                          className={`
                            max-w-[85%] sm:max-w-md rounded-2xl p-3.5 space-y-1.5 shadow-md
                            ${isMe 
                              ? 'bg-gradient-to-r from-[#6b1cb0] via-[#8a2be2] to-[#be32ff] text-white rounded-br-xs' 
                              : 'bg-[#181926] text-neutral-100 border border-white/10 rounded-bl-xs'
                            }
                          `}
                        >
                          {/* Sender name for business */}
                          {!isMe && (
                            <span className="text-[10px] font-bold text-neutral-400 block">
                              {msg.sender_name}
                            </span>
                          )}

                          {/* Message Body */}
                          {msg.text && (
                            <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">
                              {msg.text}
                            </p>
                          )}

                          {/* Attachments preview */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {msg.attachments.map((att) => (
                                <div
                                  key={att.id}
                                  className="flex items-center justify-between gap-3 p-2 rounded-xl bg-black/20 border border-white/10 text-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-4 h-4 text-[#fc9a5d] shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-[11px] font-bold text-white truncate">{att.name}</p>
                                      {att.size && <span className="text-[9px] text-neutral-400">{att.size}</span>}
                                    </div>
                                  </div>
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white"
                                    title="View attachment"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Footer: Time + Read receipts */}
                          <div className={`flex items-center justify-end gap-1 text-[9px] ${isMe ? 'text-white/80' : 'text-neutral-500'}`}>
                            <span>{msg.created_at}</span>
                            {isMe && (
                              <span>
                                {msg.read || msg.status === 'read' ? (
                                  <CheckCheck className="w-3 h-3 text-[#38bdf8] stroke-[2.5]" />
                                ) : (
                                  <Check className="w-3 h-3 text-white/70 stroke-[2]" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-4 py-1.5 bg-[#0c0d17]/60 border-t border-white/5 overflow-x-auto scrollbar-none flex items-center gap-1.5">
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(qr)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-neutral-300 hover:text-white whitespace-nowrap transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Attachment Preview Chip */}
              {pendingAttachment && (
                <div className="px-4 py-2 bg-[#141525] border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#fc9a5d]" />
                    <span className="font-bold text-white">{pendingAttachment.name}</span>
                    <span className="text-[10px] text-neutral-400">({pendingAttachment.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Bottom Message Input Bar */}
              <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0c0d17] relative">
                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-4 p-2.5 rounded-2xl bg-[#161726] border border-white/15 shadow-xl flex items-center gap-2 z-20 animate-in fade-in slide-in-from-bottom-2">
                    {quickEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageInput(prev => prev + emoji);
                          setShowEmojiPicker(false);
                          chatInputRef.current?.focus();
                        }}
                        className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => {
                      // Attach sample creator media kit
                      setPendingAttachment({
                        id: `att-${Date.now()}`,
                        name: 'SejalGupta_MediaKit_2026.pdf',
                        url: '#',
                        type: 'campaign_brief',
                        size: '2.1 MB'
                      });
                    }}
                    className="p-2.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Attach file or brief"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Input field */}
                  <div className="flex-1 relative">
                    <input
                      ref={chatInputRef}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full h-11 pl-4 pr-10 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#be32ff] transition-colors"
                    />
                    {/* Emoji toggle inside input */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                      title="Insert emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Send Button (Gradient circle button) */}
                  <button
                    type="submit"
                    disabled={(!messageInput.trim() && !pendingAttachment) || sending}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg shadow-purple-500/20 cursor-pointer shrink-0 transition-transform active:scale-95"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State: No active conversation */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#fc9a5d]/20 via-[#f0449b]/20 to-[#be32ff]/20 border border-white/10 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#be32ff]" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h2 className="text-lg font-black text-white">Your Conversations Start Here</h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Select a brand from the list on the left to review messages, negotiate sponsorship rates, or submit campaign deliverables.
                </p>
              </div>
              <Link
                href="/influencer/brand-deals"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white font-bold text-xs shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform"
              >
                Explore Brand Deals &rarr;
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}



export default function InfluencerChatsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#be32ff] border-t-transparent animate-spin" />
      </div>
    }>
      <InfluencerChatsContent />
    </Suspense>
  );
}
