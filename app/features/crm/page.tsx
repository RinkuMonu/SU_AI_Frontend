'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import {
  Users,
  Filter,
  Plus,
  MessageCircle,
  Phone,
  Mail,
  MoreHorizontal,
  Inbox,
  Zap,
  Clock,
  UserCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Bot,
  ShieldCheck,
  Flame,
  RefreshCw,
  Send,
  Check,
  ChevronRight,
  BarChart3,
  Star,
  Layers,
  Calendar,
  Smartphone,
  QrCode,
  Search,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  Eye,
  Copy,
  ArrowUpRight,
  X,
  SlidersHorizontal,
  ChevronDown,
  Globe
} from 'lucide-react';

// Custom Crisp Social Icons
const YouTubeIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8m1.39 9.74v-8.37H5.07v8.37z"/>
  </svg>
);

const TwitterXIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface Lead {
  id: string;
  name: string;
  city: string;
  channel: 'whatsapp' | 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'twitter' | 'website';
  channelHandle: string;
  inquiry: string;
  category: string;
  dealValue: number;
  aiScore: number;
  aiTag: string;
  aiTagColor: string;
  aiSummary: string;
  chatSnippet: {
    sender: 'customer' | 'ai' | 'team';
    text: string;
    time: string;
  }[];
  suggestedReply: string;
  stage: 'new' | 'qualifying' | 'contacted' | 'won';
  timeAgo: string;
  avatarBg: string;
  avatarText: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Vikram Singh',
    city: 'Jaipur, Rajasthan',
    channel: 'whatsapp',
    channelHandle: '+91 98290-34120',
    inquiry: 'Namaste! Banarasi bridal lehenga ka catalogue bhej dijiye. Friday tak delivery ho sakti hai kya Jaipur me?',
    category: 'Bridal & Ethnic Wear',
    dealValue: 24500,
    aiScore: 96,
    aiTag: '🔥 Urgent Buyer',
    aiTagColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    aiSummary: 'Customer has immediate purchasing intent for Banarasi bridal lehenga before Friday in Jaipur. High willingness to pay advance via UPI.',
    chatSnippet: [
      { sender: 'customer', text: 'Namaste! Banarasi bridal lehenga ka catalogue bhej dijiye. Friday tak delivery ho sakti hai kya Jaipur me?', time: '11:15 AM' },
      { sender: 'ai', text: 'Namaste Vikram ji! 🙏 Ji bilkul, Jaipur me same-day and 24-hr express delivery available hai. Ye raha hamara latest Banarasi Bridal Catalogue with prices.', time: '11:15 AM' },
      { sender: 'customer', text: 'Great! Red and gold maroon piece bohot pasand aya. Size 38 available hai?', time: '11:18 AM' }
    ],
    suggestedReply: 'Ji Vikram ji! Maroon Red piece size 38 me exactly 2 sets in-stock hain. Flat 15% booking offer ke sath abhi reserve karein. Kya main instant UPI payment link bhej dun?',
    stage: 'new',
    timeAgo: '2m ago',
    avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    avatarText: 'VS'
  },
  {
    id: 'lead-2',
    name: 'Priya Sharma',
    city: 'New Delhi',
    channel: 'instagram',
    channelHandle: '@priya.fashionista',
    inquiry: 'Hey! Loved your reel on the 22KT Kundan choker necklace. Can you share prices and authenticity certificate details?',
    category: 'Fine Jewellery',
    dealValue: 48500,
    aiScore: 94,
    aiTag: '🔥 Hot Lead',
    aiTagColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    aiSummary: 'High-value customer coming directly from Instagram viral reel. Inquiring for BIS hallmarked certification and immediate price confirmation.',
    chatSnippet: [
      { sender: 'customer', text: 'Hey! Loved your reel on the 22KT Kundan choker necklace. Can you share prices and certificate details?', time: '10:45 AM' },
      { sender: 'ai', text: 'Hi Priya! ✨ Our Kundan Chokers are 100% BIS Hallmarked with complimentary IGI Diamond Certification. Price is ₹48,500 with zero making charge during Dhanteras.', time: '10:46 AM' }
    ],
    suggestedReply: 'Priya ji, showroom visit ya live video call shopping ke liye slot book karein? Special ₹2,000 festive voucher aapke account me apply kar diya hai!',
    stage: 'qualifying',
    timeAgo: '14m ago',
    avatarBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    avatarText: 'PS'
  },
  {
    id: 'lead-3',
    name: 'Rohan Deshmukh',
    city: 'Pune, Maharashtra',
    channel: 'youtube',
    channelHandle: 'YouTube Shorts @rohan_cafes',
    inquiry: 'Comment on Reel: "Price kya hai is commercial espresso machine ka? Need 2 units for my new cafe opening next week in Pune. GST invoice milega?"',
    category: 'Commercial Kitchen & Cafe',
    dealValue: 85000,
    aiScore: 95,
    aiTag: '🔥 Urgent Buyer',
    aiTagColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    aiSummary: 'YouTube viral short inquiry. Opening new cafe in Pune next week. Immediate requirement for 2 espresso machine units with 18% GST input credit.',
    chatSnippet: [
      { sender: 'customer', text: 'Price kya hai is commercial espresso machine ka? Need 2 units for my new cafe opening next week in Pune. GST invoice milega?', time: '09:20 AM' },
      { sender: 'ai', text: 'Hello Rohan ji! Commercial Dual-Boiler 2-Group machine is ₹85,000 with 100% official 18% GST invoice and 2-year doorstep warranty in Pune.', time: '09:21 AM' }
    ],
    suggestedReply: 'Namaste Rohan ji! Humne aapke liye 2 machine sets reserve kar diye hain with complimentary barista kit worth ₹6,500. Kya hum live video demo connect karein?',
    stage: 'new',
    timeAgo: '22m ago',
    avatarBg: 'bg-gradient-to-br from-red-600 to-rose-700',
    avatarText: 'RD'
  },
  {
    id: 'lead-4',
    name: 'Sunita Rao',
    city: 'Hyderabad, Telangana',
    channel: 'facebook',
    channelHandle: 'Facebook Lead Ad #BRIDAL_EXPO',
    inquiry: 'Submitted Lead Form: Interested in Designer Diamond Polki Bridal Exhibition collection. Requested morning consultation slot.',
    category: 'Diamond & Polki',
    dealValue: 52000,
    aiScore: 89,
    aiTag: '⚡ High Intent',
    aiTagColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    aiSummary: 'Facebook Meta Ad inquiry. Customer looking for bridal exhibition pieces. Preferred morning callback window between 11 AM - 1 PM.',
    chatSnippet: [
      { sender: 'customer', text: 'Submitted lead form for Diamond Polki Bridal set appointment.', time: '08:45 AM' },
      { sender: 'ai', text: 'Namaste Sunita ji! ✨ Thank you for choosing us. Our Banjara Hills jewellery lounge is reserved for you with our senior stylist.', time: '08:46 AM' }
    ],
    suggestedReply: 'Hello Sunita ji! Would 11:30 AM tomorrow suit you for a VIP consultation lounge visit, or would you prefer a private video preview?',
    stage: 'contacted',
    timeAgo: '35m ago',
    avatarBg: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    avatarText: 'SR'
  },
  {
    id: 'lead-5',
    name: 'Rajesh Singhania',
    city: 'Gurgaon, NCR',
    channel: 'linkedin',
    channelHandle: 'LinkedIn B2B Lead Gen',
    inquiry: 'InMail Form: "We operate 8 multi-brand luxury apparel retail outlets in Delhi NCR. Seeking enterprise AI marketing and omnichannel CRM deployment for 25 sales reps."',
    category: 'Enterprise B2B Retail Suite',
    dealValue: 150000,
    aiScore: 98,
    aiTag: '🏆 Enterprise Deal',
    aiTagColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    aiSummary: 'Enterprise B2B inquiry from VP of Retail. Multi-store rollout across 8 locations in Delhi NCR. High budget authority; requested executive demo.',
    chatSnippet: [
      { sender: 'customer', text: 'We operate 8 multi-brand retail outlets in NCR. Looking for enterprise AI marketing and CRM deployment.', time: 'Yesterday' },
      { sender: 'team', text: 'Mr. Singhania, our enterprise architecture team has reviewed your retail workflow. We can roll this out across all 8 stores in 48 hours.', time: 'Yesterday' },
      { sender: 'customer', text: 'Excellent. Please send NDA and schedule a 30-min Zoom demo with my tech director.', time: '10:05 AM' }
    ],
    suggestedReply: 'Thank you Mr. Singhania! NDA and enterprise pilot proposal sent to your email. Meeting invite sent for 3:00 PM today with our founding team.',
    stage: 'qualifying',
    timeAgo: '45m ago',
    avatarBg: 'bg-gradient-to-br from-sky-600 to-blue-800',
    avatarText: 'RS'
  },
  {
    id: 'lead-6',
    name: 'Aryan Malhotra',
    city: 'Mumbai, Maharashtra',
    channel: 'twitter',
    channelHandle: 'Twitter / X @aryan_growth',
    inquiry: 'X DM: "Hey team! Loved your autonomous reel generation launch on X. Can we get white-label API access for our performance marketing agency (40+ D2C clients)?"',
    category: 'Agency White-Label Suite',
    dealValue: 65000,
    aiScore: 91,
    aiTag: '⚡ Agency Partner',
    aiTagColor: 'bg-slate-200/20 text-slate-200 border-slate-500/30',
    aiSummary: 'Agency partnership inquiry from Twitter/X. Looking for white-label access to scale across 40+ D2C brand accounts with recurring monthly billing.',
    chatSnippet: [
      { sender: 'customer', text: 'Loved the AI Reel generator demo on X! Looking to white-label this suite for our 40+ agency clients.', time: '09:50 AM' },
      { sender: 'ai', text: 'Hey Aryan! 🚀 Yes, our DhandaGrow Agency Partner tier gives custom branding, unified client billing, and dedicated GPU rendering queues.', time: '09:51 AM' }
    ],
    suggestedReply: 'Aryan! We have 2 agency partner onboarding slots open this week with 30% revenue share. Click here to check the agency documentation and API sandbox.',
    stage: 'contacted',
    timeAgo: '1h ago',
    avatarBg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    avatarText: 'AM'
  },
  {
    id: 'lead-7',
    name: 'Ananya Verma',
    city: 'Bengaluru, Karnataka',
    channel: 'website',
    channelHandle: 'Web Chat #8942',
    inquiry: 'Do you deliver organic ayurvedic skin care bundles in Indiranagar within 24 hours? Also want to know return policy.',
    category: 'Beauty & Skincare',
    dealValue: 4299,
    aiScore: 78,
    aiTag: '💬 Warm Prospect',
    aiTagColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    aiSummary: 'Customer on product checkout page with cart value ₹4,299. Inquiring about fast hyperlocal delivery and return terms before completing payment.',
    chatSnippet: [
      { sender: 'customer', text: 'Do you deliver organic ayurvedic skin care bundles in Indiranagar within 24 hours?', time: '11:02 AM' },
      { sender: 'ai', text: 'Yes Ananya! Orders placed before 2 PM are delivered same-day in Indiranagar with hassle-free 7-day money back assurance.', time: '11:03 AM' }
    ],
    suggestedReply: 'Use coupon code GLOW10 for an instant ₹430 discount at checkout. Click here to complete your order securely via UPI or Card.',
    stage: 'qualifying',
    timeAgo: '1h 15m ago',
    avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    avatarText: 'AV'
  },
  {
    id: 'lead-8',
    name: 'Amit Mishra',
    city: 'Jaipur, Rajasthan',
    channel: 'whatsapp',
    channelHandle: '+91 87418-86688',
    inquiry: 'Corporate Diwali Gifting: We require 150 customised handcrafted gift boxes with branded sweets & dry fruit jars.',
    category: 'Corporate Gifting',
    dealValue: 75000,
    aiScore: 98,
    aiTag: '🏆 Won & Paid via UPI',
    aiTagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    aiSummary: 'High-ticket B2B inquiry. 150 corporate units requested. Budget confirmed at ₹75,000+. 50% advance cleared instantly via Razorpay UPI QR.',
    chatSnippet: [
      { sender: 'customer', text: 'Corporate Diwali Gifting: We require 150 customised handcrafted gift boxes with company logo.', time: 'Yesterday' },
      { sender: 'team', text: 'Namaste Amit ji, our corporate executive shared the customized mockups and bulk tiered pricing PDF on your email.', time: 'Yesterday' },
      { sender: 'customer', text: 'Quotation approved by management. 50% advance paid via UPI link #TXN98421.', time: '08:30 AM' }
    ],
    suggestedReply: 'Payment received successfully Amit ji! ₹37,500 advance recorded. Production batch #DG-892 started. Tracking updates will be shared here.',
    stage: 'won',
    timeAgo: '2h ago',
    avatarBg: 'bg-gradient-to-br from-violet-600 to-purple-800',
    avatarText: 'AM'
  }
];

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead>(INITIAL_LEADS[0]);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'simulator' | 'dashboard'>('simulator');
  const [copiedLink, setCopiedLink] = useState(false);

  // ROI Calculator states
  const [monthlyLeads, setMonthlyLeads] = useState<number>(350);
  const [avgDealValue, setAvgDealValue] = useState<number>(4500);
  const [currentCloseRate, setCurrentCloseRate] = useState<number>(8); // 8%

  // Calculations
  const currentDeals = Math.round((monthlyLeads * currentCloseRate) / 100);
  const improvedCloseRate = Math.min(35, currentCloseRate + 12);
  const newDeals = Math.round((monthlyLeads * improvedCloseRate) / 100);
  const extraDeals = newDeals - currentDeals;
  const recoveredRevenue = extraDeals * avgDealValue;

  const filteredLeads = leads.filter(l => {
    if (channelFilter === 'all') return true;
    return l.channel === channelFilter;
  });

  const getChannelBadge = (channel: Lead['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MessageCircle className="w-3 h-3 text-emerald-400" /> WhatsApp
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <MessageSquare className="w-3 h-3 text-pink-400" /> Instagram DM
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <YouTubeIcon className="w-3 h-3 text-red-500" /> YouTube
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FacebookIcon className="w-3 h-3 text-blue-400" /> Facebook
          </span>
        );
      case 'linkedin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <LinkedInIcon className="w-3 h-3 text-sky-400" /> LinkedIn
          </span>
        );
      case 'twitter':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-200 border border-slate-500/30">
            <TwitterXIcon className="w-2.5 h-2.5 text-white" /> Twitter (X)
          </span>
        );
      case 'website':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Globe className="w-3 h-3 text-amber-400" /> Website
          </span>
        );
    }
  };

  const moveStage = (leadId: string, newStage: Lead['stage']) => {
    setLeads(prev =>
      prev.map(item => (item.id === leadId ? { ...item, stage: newStage } : item))
    );
    if (selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, stage: newStage }));
    }
  };

  const handleCopyUPI = (amount: number) => {
    navigator.clipboard?.writeText(`upi://pay?pa=dhandagrow@icici&pn=DhandaGrowAI&am=${amount}&cu=INR`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-teal-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-500/20 via-emerald-500/15 to-purple-600/20 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <Bot className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              DhandaGrow AI • Omnichannel Leads CRM
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-teal-400" />
            <span className="hidden sm:inline-block text-[11px] text-teal-200/80 font-medium">
              6-Channel Unified Pipeline
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
            Turn WhatsApp, Instagram, YouTube, Facebook, LinkedIn & Twitter Leads into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300">
              Paid Customers.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300/90 leading-relaxed mb-8 max-w-3xl mx-auto font-normal">
            No more lost inquiries across fragmented chats and spreadsheets. Our AI automatically captures leads from WhatsApp, Instagram DMs, YouTube comments, Facebook Ads, LinkedIn B2B forms, and Twitter (X) messages, scores buyer urgency with Gemini AI, and closes deals with instant UPI checkout.
          </p>

          {/* Social Platforms Connected Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            <span className="text-xs text-slate-400 font-semibold mr-1">Directly Ingesting:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-400">
              <MessageSquare className="w-3.5 h-3.5" /> Instagram
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400">
              <YouTubeIcon className="w-3.5 h-3.5 text-red-500" /> YouTube
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
              <FacebookIcon className="w-3.5 h-3.5 text-blue-500" /> Facebook
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-bold text-sky-400">
              <LinkedInIcon className="w-3.5 h-3.5 text-sky-400" /> LinkedIn
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 border border-slate-500/30 text-xs font-bold text-slate-200">
              <TwitterXIcon className="w-3 h-3 text-white" /> Twitter (X)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              <Globe className="w-3.5 h-3.5" /> Website
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-9 text-base rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold shadow-[0_0_35px_rgba(20,184,166,0.35)] transition-all hover:scale-[1.02] border-0"
              asChild
            >
              <Link href="/download" className="flex items-center gap-2">
                Open Your Free Pipeline <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold backdrop-blur-md"
              onClick={() => {
                const el = document.getElementById('pipeline-demo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Sparkles className="w-4 h-4 text-teal-400 mr-2" />
              Try Live Interactive Demo
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl">
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">0 Sec</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">AI Instant Lead Response</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-400 tracking-tight">3.8x</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Higher Lead-to-Sale Rate</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">6 Channels</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">All Social Media Ingestion</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-tight">₹18.4L+</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Monthly Won Revenue</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div id="pipeline-demo" className="mt-16 flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'simulator'
                ? 'bg-teal-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Interactive Live Pipeline Simulator
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-teal-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            HD SaaS Dashboard Preview
          </button>
        </div>

        {/* Main Showcase Container */}
        <div className="mt-8 relative rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
          {activeTab === 'dashboard' ? (
            /* HD Image View */
            <div className="p-4 sm:p-8 flex flex-col items-center">
              <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="/images/leads-crm-dashboard.jpg"
                  alt="DhandaGrow AI Leads CRM Dashboard"
                  width={1400}
                  height={800}
                  className="w-full h-auto object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 max-w-lg">
                    <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">Live Omnichannel AI</p>
                    <p className="text-sm text-slate-200">
                      Real-time synchronization across YouTube, Instagram, Facebook, LinkedIn, Twitter (X), and WhatsApp. Automatically drafts replies and sends UPI checkout links.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 w-full text-xs text-slate-400 px-2">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  YouTube, Instagram, Facebook, LinkedIn & Twitter API Webhooks
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Gemini 2.0 AI Lead Scoring Engine (Hinglish + Regional)
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Automated Razorpay & UPI Payment Reconciliation
                </span>
              </div>
            </div>
          ) : (
            /* Interactive Live Pipeline Simulator */
            <div>
              {/* Header Bar */}
              <div className="p-4 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                      Master Sales Pipeline
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                        Live Auto-Sync
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Filter by social channel, click any lead card to review AI intent scores, and send 1-click replies.</p>
                  </div>
                </div>

                {/* Filter buttons - ALL Social Media Platforms */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Channel:
                  </span>
                  {[
                    { id: 'all', label: 'All Channels' },
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                    { id: 'instagram', label: 'Instagram', icon: MessageSquare },
                    { id: 'youtube', label: 'YouTube', icon: YouTubeIcon },
                    { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
                    { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
                    { id: 'twitter', label: 'Twitter (X)', icon: TwitterXIcon },
                    { id: 'website', label: 'Website', icon: Globe }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setChannelFilter(tab.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                          channelFilter === tab.id
                            ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {Icon && <Icon className="w-3 h-3" />}
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kanban Grid + Live Drawer Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                {/* 4-Column Pipeline (8 Cols) */}
                <div className="lg:col-span-8 p-4 sm:p-6 overflow-x-auto border-b lg:border-b-0 lg:border-r border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-w-[700px] md:min-w-0">
                    {/* Column 1: New Leads */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-blue-400">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          New Inquiries
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono font-bold">
                          {filteredLeads.filter(l => l.stage === 'new').length}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {filteredLeads
                          .filter(l => l.stage === 'new')
                          .map(lead => (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                                selectedLead.id === lead.id
                                  ? 'bg-slate-800 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.25)]'
                                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full ${lead.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                    {lead.avatarText}
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs text-white leading-tight">{lead.name}</p>
                                    <p className="text-[10px] text-slate-400">{lead.city}</p>
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-500">{lead.timeAgo}</span>
                              </div>

                              <div className="mb-2">{getChannelBadge(lead.channel)}</div>

                              <div className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-2 ${lead.aiTagColor}`}>
                                {lead.aiTag} ({lead.aiScore}%)
                              </div>

                              <p className="text-[11px] text-slate-300 line-clamp-2 italic mb-2">
                                "{lead.inquiry}"
                              </p>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                                <span className="font-extrabold text-teal-300">₹{lead.dealValue.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-slate-400 group-hover:text-teal-400 flex items-center gap-1 transition-colors">
                                  View details <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Column 2: Qualifying */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-purple-400">
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                          AI Qualifying
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono font-bold">
                          {filteredLeads.filter(l => l.stage === 'qualifying').length}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {filteredLeads
                          .filter(l => l.stage === 'qualifying')
                          .map(lead => (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                                selectedLead.id === lead.id
                                  ? 'bg-slate-800 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.25)]'
                                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full ${lead.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                    {lead.avatarText}
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs text-white leading-tight">{lead.name}</p>
                                    <p className="text-[10px] text-slate-400">{lead.category}</p>
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-500">{lead.timeAgo}</span>
                              </div>

                              <div className="mb-2">{getChannelBadge(lead.channel)}</div>

                              <div className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-2 ${lead.aiTagColor}`}>
                                {lead.aiTag} ({lead.aiScore}%)
                              </div>

                              <p className="text-[11px] text-slate-300 line-clamp-2 italic mb-2">
                                "{lead.inquiry}"
                              </p>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                                <span className="font-extrabold text-teal-300">₹{lead.dealValue.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-slate-400 group-hover:text-teal-400 flex items-center gap-1 transition-colors">
                                  View details <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Column 3: Contacted */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-400">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          In Discussion
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold">
                          {filteredLeads.filter(l => l.stage === 'contacted').length}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {filteredLeads
                          .filter(l => l.stage === 'contacted')
                          .map(lead => (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                                selectedLead.id === lead.id
                                  ? 'bg-slate-800 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.25)]'
                                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full ${lead.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                    {lead.avatarText}
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs text-white leading-tight">{lead.name}</p>
                                    <p className="text-[10px] text-slate-400">{lead.city}</p>
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-500">{lead.timeAgo}</span>
                              </div>

                              <div className="mb-2">{getChannelBadge(lead.channel)}</div>

                              <div className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-2 ${lead.aiTagColor}`}>
                                {lead.aiTag}
                              </div>

                              <p className="text-[11px] text-slate-300 line-clamp-2 italic mb-2">
                                "{lead.inquiry}"
                              </p>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                                <span className="font-extrabold text-teal-300">₹{lead.dealValue.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-slate-400 group-hover:text-teal-400 flex items-center gap-1 transition-colors">
                                  View details <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Column 4: Won / Paid */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Won & Paid (UPI)
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                          {filteredLeads.filter(l => l.stage === 'won').length}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {filteredLeads
                          .filter(l => l.stage === 'won')
                          .map(lead => (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full ${lead.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                    {lead.avatarText}
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs text-white leading-tight">{lead.name}</p>
                                    <p className="text-[10px] text-slate-400">{lead.city}</p>
                                  </div>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-bold">PAID</span>
                              </div>

                              <div className="mb-2">{getChannelBadge(lead.channel)}</div>

                              <div className="text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                                💸 Instant UPI Cleared
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-[11px]">
                                <span className="font-extrabold text-emerald-400">₹{lead.dealValue.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  Receipt Sent <Check className="w-3 h-3 text-emerald-400" />
                                </span>
                              </div>
                            </div>
                          ))}

                        {/* Drop zone placeholder */}
                        <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500 bg-slate-900/30">
                          Auto-moves here upon payment link confirmation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Intelligence & Action Drawer (4 Cols) */}
                <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-900/95 flex flex-col justify-between">
                  <div>
                    {/* Drawer Header */}
                    <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl ${selectedLead.avatarBg} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                          {selectedLead.avatarText}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-base leading-tight">{selectedLead.name}</h4>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedLead.channelHandle}</p>
                          <div className="mt-1">{getChannelBadge(selectedLead.channel)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">Estimated Deal</span>
                        <span className="text-lg font-black text-white">₹{selectedLead.dealValue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* AI Scoring Meter */}
                    <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-teal-400" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Gemini Intent Score</span>
                        </div>
                        <span className="text-sm font-black text-teal-300 font-mono">{selectedLead.aiScore}% Ready</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300 h-full rounded-full transition-all duration-500"
                          style={{ width: `${selectedLead.aiScore}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        <span className="font-bold text-teal-300">AI Analysis:</span> {selectedLead.aiSummary}
                      </p>
                    </div>

                    {/* Live Conversation Thread */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>Recent Interaction Thread</span>
                        <span className="text-[10px] text-teal-400">Live Sync</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 max-h-44 overflow-y-auto flex flex-col gap-2.5 text-xs">
                        {selectedLead.chatSnippet.map((chat, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                              chat.sender === 'customer'
                                ? 'bg-slate-800 text-slate-200 self-start rounded-tl-sm'
                                : chat.sender === 'ai'
                                ? 'bg-teal-950/70 border border-teal-500/30 text-teal-200 self-end rounded-tr-sm'
                                : 'bg-blue-950/70 border border-blue-500/30 text-blue-200 self-end rounded-tr-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[9px] opacity-75 mb-1 font-semibold">
                              <span>{chat.sender === 'customer' ? selectedLead.name : chat.sender === 'ai' ? '🤖 UNI AI Agent' : '👤 Sales Rep'}</span>
                              <span>{chat.time}</span>
                            </div>
                            <p className="text-[11px]">{chat.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggested Response */}
                    <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 mb-4">
                      <div className="flex items-center justify-between text-[11px] font-bold text-teal-400 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" /> AI Recommended Next Step
                        </span>
                        <span className="text-[10px] bg-teal-500/20 px-1.5 py-0.5 rounded text-teal-300">1-Click</span>
                      </div>
                      <p className="text-xs text-slate-200 italic mb-3 leading-relaxed">
                        "{selectedLead.suggestedReply}"
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg gap-1.5"
                          onClick={() => {
                            window.open(`https://wa.me/?text=${encodeURIComponent(selectedLead.suggestedReply)}`, '_blank');
                          }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Send WhatsApp / DM
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-bold border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg gap-1.5"
                          onClick={() => handleCopyUPI(selectedLead.dealValue)}
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <QrCode className="w-3.5 h-3.5 text-teal-400" />}
                          {copiedLink ? 'Copied UPI!' : 'UPI Link'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Stage Advancement Quick Controls */}
                  <div className="pt-3 border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 font-semibold mb-2">Advance Stage:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => moveStage(selectedLead.id, 'qualifying')}
                        className={`text-[10px] py-1.5 px-2 rounded-lg font-bold transition-colors ${
                          selectedLead.stage === 'qualifying'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        AI Qualify
                      </button>
                      <button
                        onClick={() => moveStage(selectedLead.id, 'contacted')}
                        className={`text-[10px] py-1.5 px-2 rounded-lg font-bold transition-colors ${
                          selectedLead.stage === 'contacted'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        In Discussion
                      </button>
                      <button
                        onClick={() => moveStage(selectedLead.id, 'won')}
                        className={`text-[10px] py-1.5 px-2 rounded-lg font-bold transition-colors ${
                          selectedLead.stage === 'won'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Mark as Won 🏆
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Omnichannel Conversion Funnel Visual Section */}
      <section className="py-20 lg:py-28 bg-[#090E1A] border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Visual Funnel Graphic */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="/images/leads-crm-funnel.jpg"
                  alt="Omnichannel AI Lead Conversion Funnel"
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover rounded-xl transition-all duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  6-Platform Funnel Automation
                </div>
              </div>
            </div>

            {/* Funnel Text Content */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5" /> Full Omnichannel Engine
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                From First Comment or DM to Paid Order in Under 3 Minutes.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                Indian buyers interact across YouTube Shorts, Instagram Reels, Facebook Ads, LinkedIn InMails, and Twitter DMs. DhandaGrow AI pulls them all into one pipeline so no lead ever slips away.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">1. YouTube, Meta, LinkedIn & X Ingestion</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Every YouTube comment, Instagram DM, Facebook lead form, LinkedIn B2B inquiry, Twitter message, and WhatsApp chat streams instantly into your pipeline with source attribution.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">2. Multilingual AI Scoring & Intent Detection</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Gemini 2.0 reads Hinglish, Hindi, and English across platforms, detecting budget, purchase urgency, and timeline, tagging "Hot", "Warm", or "Cold" within milliseconds.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">3. Direct UPI & Catalogue Checkout</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Send product cards and dynamic Razorpay / BHIM UPI payment links directly inside chat. Once paid, the lead automatically moves to "Won".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 AI Superpowers Grid */}
      <section className="py-20 lg:py-28 bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-3">
              Built for Modern High-Velocity Sales
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Everything You Need to Scale Deals Across All Social Channels.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Automate the repetitive busywork, empower your sales closers, and convert more leads into profitable repeat buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Buying Intent Scoring</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                The AI differentiates casual window shoppers from serious bulk buyers across YouTube, Instagram, LinkedIn, and WhatsApp. Stop wasting hours calling cold leads.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">6-in-1 Omnichannel Inbox</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Reply to WhatsApp messages, Instagram DMs, YouTube comments, Facebook leads, LinkedIn B2B inquiries, and Twitter DMs from one unified screen.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Autonomous Follow-Up Sequences</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                If a customer doesn't respond, DhandaGrow AI automatically sends polite Hinglish nudges 24 hours and 3 days later, offering limited-time festive coupons.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Product Catalogue Sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect your DhandaGrow product catalogue. When a lead asks for sarees, jewellery, or tech items, the AI attaches rich visual product cards right inside chat.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Sales Routing & Alerts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Route enterprise and high-ticket leads (₹50k+) directly to your senior closers with instant WhatsApp notifications, while AI handles tier-3 inquiries automatically.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Social Channel ROAS Attribution</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Know exactly which YouTube video, Instagram reel, LinkedIn post, or Meta ad generated every single rupee in revenue. Optimize ad spend with total clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI / Revenue Recovery Calculator */}
      <section className="py-20 lg:py-28 bg-[#0A101D] border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4">
              <DollarSign className="w-4 h-4" /> ROI Calculator
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              How Much Revenue Are You Leaving on the Table?
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Calculate the extra monthly profit you recover by having sub-second AI follow-ups across YouTube, Facebook, LinkedIn, Twitter, Instagram & WhatsApp.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sliders */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-300">Monthly Inquiries (Across All Channels):</span>
                  <span className="text-base font-extrabold text-teal-400 font-mono">{monthlyLeads} leads</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={monthlyLeads}
                  onChange={e => setMonthlyLeads(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50</span>
                  <span>500</span>
                  <span>1,000</span>
                  <span>2,000+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-300">Average Deal / Order Value (₹):</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">₹{avgDealValue.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={avgDealValue}
                  onChange={e => setAvgDealValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹500</span>
                  <span>₹10,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-300">Current Manual Close Rate:</span>
                  <span className="text-base font-extrabold text-cyan-300 font-mono">{currentCloseRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={currentCloseRate}
                  onChange={e => setCurrentCloseRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>2% (Slow manual)</span>
                  <span>10%</span>
                  <span>20% (Optimized)</span>
                </div>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-teal-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-teal-400 tracking-wider block mb-1">
                  Estimated Monthly Recovery
                </span>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 my-2">
                  +₹{recoveredRevenue.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Additional revenue recovered every single month by stopping dropped inquiries with AI instant response.
                </p>

                <div className="space-y-2 py-3 border-y border-slate-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Closed Deals:</span>
                    <span className="font-bold text-slate-200">{currentDeals} orders</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">With DhandaGrow AI CRM:</span>
                    <span className="font-bold text-teal-400">{newDeals} orders ({improvedCloseRate}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Extra Won Orders:</span>
                    <span className="font-bold text-emerald-400">+{extraDeals} deals/mo</span>
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl"
                asChild
              >
                <Link href="/download">Unlock This Revenue Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Excel & Old CRMs vs DhandaGrow AI Lead CRM */}
      <section className="py-20 lg:py-28 bg-[#070B14] border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-3">
              Why Indian Businesses Are Switching
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Traditional CRMs Weren’t Built for Modern Social Media Selling.
            </h2>
            <p className="text-slate-400 text-base">
              Traditional enterprise CRMs cost ₹30,000/month, don't ingest YouTube or Instagram comments, and require complex configurations. DhandaGrow AI connects all 6 platforms in 60 seconds.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-4 px-4 text-sm font-bold text-slate-400">Capability</th>
                  <th className="py-4 px-4 text-sm font-bold text-slate-400">Spreadsheets / Excel</th>
                  <th className="py-4 px-4 text-sm font-bold text-slate-400">HubSpot / Zoho</th>
                  <th className="py-4 px-4 text-sm font-bold text-teal-400 bg-teal-500/10 rounded-t-xl">
                    DhandaGrow AI Leads CRM
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-300">All-Channel Auto-Sync (WhatsApp, IG, YouTube, FB, LinkedIn, X)</td>
                  <td className="py-4 px-4 text-slate-500">❌ Manual copy-paste</td>
                  <td className="py-4 px-4 text-slate-400">⚠️ Expensive separate plugins</td>
                  <td className="py-4 px-4 font-bold text-teal-300 bg-teal-500/5">✅ Native 1-Click All-in-One API Sync</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-300">Hinglish & Regional AI Understanding</td>
                  <td className="py-4 px-4 text-slate-500">❌ None</td>
                  <td className="py-4 px-4 text-slate-500">❌ English only bots</td>
                  <td className="py-4 px-4 font-bold text-teal-300 bg-teal-500/5">✅ Native Gemini 2.0 Hinglish</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-300">Instant Lead Scoring (0-100%)</td>
                  <td className="py-4 px-4 text-slate-500">❌ None</td>
                  <td className="py-4 px-4 text-slate-400">⚠️ Complex rule builders only</td>
                  <td className="py-4 px-4 font-bold text-teal-300 bg-teal-500/5">✅ Autonomous AI Intent Detection</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-300">UPI QR & In-Chat Checkout</td>
                  <td className="py-4 px-4 text-slate-500">❌ Manual screenshots</td>
                  <td className="py-4 px-4 text-slate-400">⚠️ Stripe only (US-centric)</td>
                  <td className="py-4 px-4 font-bold text-teal-300 bg-teal-500/5">✅ Razorpay & Instant UPI Links</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-300">Automated Follow-Up Sequences</td>
                  <td className="py-4 px-4 text-slate-500">❌ 100% forgotten</td>
                  <td className="py-4 px-4 text-slate-400">⚠️ Requires custom Zapier/API</td>
                  <td className="py-4 px-4 font-bold text-teal-300 bg-teal-500/5">✅ Built-in 24h & 48h Multi-Channel Nudges</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feature Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="crm" />
      <FeatureExpansionSections feature="crm" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#070B14] to-[#04070D] text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Start Free Today
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Stop Losing Sales in Your DMs & Comments. Start Closing Them with AI.
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Join hundreds of Indian brands, boutiques, and agencies scaling with DhandaGrow AI Leads CRM across YouTube, Facebook, LinkedIn, Twitter, Instagram & WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-[0_0_40px_rgba(20,184,166,0.35)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/download">Launch Leads CRM Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-16 px-8 text-lg rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/features/whatsapp-ai">Explore WhatsApp AI</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
