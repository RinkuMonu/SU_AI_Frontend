'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Users,
  Smartphone,
  Globe,
  Megaphone,
  Video,
  Camera,
  MessageSquare,
  FileText,
  CheckCircle2,
  Share2,
  Target,
  BarChart3,
  Bot,
  Send,
  Layers,
  ShoppingBag,
  Calendar
} from 'lucide-react';

export type TabType = 'facebook' | 'instagram' | 'linkedin' | 'threads' | 'snapchat' | 'pinterest' | 'twitter' | 'telegram' | 'youtube';

// Brand Social Icons
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.222-8.184-3.56C2.234 18.19 1.44 15.064 1.63 11.12 1.88 5.927 5.72 1.832 10.977 1.155c4.717-.61 9.28 1.87 11.077 6.017a.998.998 0 0 1-1.838.784c-1.464-3.38-5.187-5.4-9.034-4.903-4.324.557-7.482 3.923-7.689 8.19-.158 3.255.498 5.82 1.95 7.625 1.492 1.856 3.734 2.809 6.666 2.829h.007c2.65-.018 4.79-.844 6.36-2.455 1.503-1.544 2.302-3.666 2.313-6.136-.015-3.04-.972-5.46-2.766-7.001-1.741-1.494-4.148-2.274-7.155-2.317-3.23.044-5.83 1.05-7.728 2.988-1.802 1.84-2.81 4.475-2.84 7.42-.036 3.513 1.258 6.467 3.743 8.544.757.632.784 1.765.06 2.43-.725.666-1.844.607-2.52-.164C.887 21.688-.535 18.258-.493 14.156c.036-3.486 1.246-6.613 3.407-8.82C5.163 3.018 8.24 1.83 12.062 1.782c3.55.05 6.425.986 8.548 2.782 2.185 1.85 3.35 4.754 3.37 8.397-.014 2.946-.967 5.513-2.756 7.424-1.87 1.996-4.472 3.036-7.731 3.058l-.307.557z" />
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.065 1.5c-4.14 0-6.84 2.87-6.84 6.72 0 .84.18 1.95.45 2.76-.75.39-1.53.84-2.01 1.62-.42.66-.42 1.47-.03 2.13.48.81 1.41 1.29 2.43 1.53-.06.39-.09.78-.09 1.17 0 .81.24 1.53.69 2.16-1.02.45-2.07 1.05-2.07 2.19 0 1.23 1.56 1.77 3.51 1.83.66.03 1.35-.06 2.04-.24.51-.15.99-.33 1.44-.33.39 0 .81.18 1.29.33.81.24 1.71.36 2.61.36.93 0 1.83-.12 2.64-.36.48-.15.9-.33 1.29-.33.45 0 .93.18 1.44.33.69.18 1.38.27 2.04.24 1.95-.06 3.51-.6 3.51-1.83 0-1.14-1.05-1.74-2.07-2.19.45-.63.69-1.35.69-2.16 0-.39-.03-.78-.09-1.17 1.02-.24 1.95-.72 2.43-1.53.39-.66.39-1.47-.03-2.13-.48-.78-1.26-1.23-2.01-1.62.27-.81.45-1.92.45-2.76 0-3.85-2.7-6.72-6.84-6.72z" />
  </svg>
);
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12C24 5.372 18.627 0 12 0z" />
  </svg>
);

const XTwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z" />
  </svg>
);

interface SubItem {
  id: string;
  navTitle: string;
  heading: string;
  inputCard: {
    label: string;
    flag: string;
    value: string;
    badge: string;
  };
  hubIcon: React.ReactNode;
  outputCard: {
    title: string;
    status: string;
    progressText: string;
    items: {
      icon: React.ReactNode;
      label: string;
      value: string;
    }[];
  };
  benefits: {
    icon: React.ReactNode;
    title: string;
    desc: string;
  }[];
}

interface SectionCategory {
  id: TabType;
  label: string;
  badge: string;
  description: string;
  themeColor: string;
  themeGradient: string;
  icon: (props: { className?: string }) => React.ReactNode;
  subItems: SubItem[];
}

const sectionsData: SectionCategory[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    badge: 'Meta Ads & Page Growth Engine',
    description: 'Scale your business on Facebook with AI-automated high-ROAS ad creatives, smart local targeting, and automated community posting.',
    themeColor: '#1877F2',
    themeGradient: 'linear-gradient(135deg, #1877F2 0%, #0866FF 50%, #0052CC 100%)',
    icon: FacebookIcon,
    subItems: [
      {
        id: 'facebook-ads',
        navTitle: 'AI Ad Campaigns & Creatives',
        heading: 'AI High-ROAS Facebook & Meta Ads',
        inputCard: {
          label: 'Campaign Objective & Budget',
          flag: '📢',
          value: '₹1,500/day • Direct WhatsApp Leads',
          badge: 'Meta Ads Input'
        },
        hubIcon: <FacebookIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Meta Campaign Optimization',
          status: 'AI Running & Converting',
          progressText: 'Expected ROAS: 4.8x',
          items: [
            {
              icon: <Target className="w-4 h-4 text-[#1877F2]" />,
              label: 'Audience Targeting',
              value: 'High-Intent Indian Buyers (Tier 1 & 2)'
            },
            {
              icon: <Video className="w-4 h-4 text-[#1877F2]" />,
              label: 'Ad Creative Engine',
              value: 'High-Converting Video & Hinglish Copy'
            },
            {
              icon: <Zap className="w-4 h-4 text-[#1877F2]" />,
              label: 'Cost Per Lead',
              value: '₹18.40 (62% cheaper than avg)'
            },
            {
              icon: <Smartphone className="w-4 h-4 text-[#1877F2]" />,
              label: 'Lead Delivery',
              value: 'Instant WhatsApp CRM Sync'
            }
          ]
        },
        benefits: [
          {
            icon: <TrendingUp className="w-5 h-5 text-[#1877F2]" />,
            title: '4.8x Higher Return on Ad Spend',
            desc: 'AI tests dozens of hooks, headlines, and angles to find winning ads.'
          },
          {
            icon: <Bot className="w-5 h-5 text-[#1877F2]" />,
            title: 'Automated 1-Click Launch',
            desc: 'Create and launch Meta Ads without needing an expensive marketing agency.'
          },
          {
            icon: <MessageSquare className="w-5 h-5 text-[#1877F2]" />,
            title: 'Direct WhatsApp Leads',
            desc: 'Route customer enquiries directly to your sales team in seconds.'
          }
        ]
      },
      {
        id: 'facebook-page',
        navTitle: 'Automated Page Engagement',
        heading: 'Facebook Page & Community Growth Engine',
        inputCard: {
          label: 'Content Schedule & Goal',
          flag: '📅',
          value: 'Daily 10:00 AM • Organic Reach',
          badge: 'Scheduled'
        },
        hubIcon: <FacebookIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Meta Distribution Engine',
          status: 'Active & Publishing',
          progressText: '140K+ Monthly Reach',
          items: [
            {
              icon: <Layers className="w-4 h-4 text-[#1877F2]" />,
              label: 'Post Format',
              value: 'Regional Festival & Offer Posts'
            },
            {
              icon: <BarChart3 className="w-4 h-4 text-[#1877F2]" />,
              label: 'Viral Score',
              value: '94/100 Engagement Index'
            },
            {
              icon: <Bot className="w-4 h-4 text-[#1877F2]" />,
              label: 'Auto Comment Reply',
              value: 'Replies within 8 seconds'
            },
            {
              icon: <Users className="w-4 h-4 text-[#1877F2]" />,
              label: 'Follower Growth',
              value: '+2,450 Organic Followers/Month'
            }
          ]
        },
        benefits: [
          {
            icon: <CheckCircle2 className="w-5 h-5 text-[#1877F2]" />,
            title: 'Consistent Daily Presence',
            desc: 'Never run out of creative business posts and festival wishes.'
          },
          {
            icon: <MessageSquare className="w-5 h-5 text-[#1877F2]" />,
            title: 'Instant Comment Conversion',
            desc: 'Automatically reply to comments with product details and order links.'
          },
          {
            icon: <Globe className="w-5 h-5 text-[#1877F2]" />,
            title: 'Hinglish & Regional AI',
            desc: 'Craft authentic posts in Hindi, Hinglish, English, or regional languages.'
          }
        ]
      }
    ]
  },
  {
    id: 'instagram',
    label: 'Instagram',
    badge: 'Viral Reels & Creator Studio',
    description: 'Skyrocket your brand visibility on Instagram with 9:16 viral reels, stunning product posts, and 24/7 automated DM sales funnels.',
    themeColor: '#E1306C',
    themeGradient: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
    icon: InstagramIcon,
    subItems: [
      {
        id: 'instagram-reels',
        navTitle: 'AI Viral Reels & Posts',
        heading: 'AI Viral Reels & 9:16 Video Maker',
        inputCard: {
          label: 'Product URL / Video Idea',
          flag: '🎬',
          value: 'Product Launch • Trending Audio',
          badge: 'AI Reel Input'
        },
        hubIcon: <InstagramIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Instagram Algorithm Engine',
          status: 'Viral Potential: High',
          progressText: 'Viral Index: 96/100',
          items: [
            {
              icon: <Zap className="w-4 h-4 text-[#E1306C]" />,
              label: '3-Second Hook',
              value: 'High-Retention Visual Opening'
            },
            {
              icon: <Sparkles className="w-4 h-4 text-[#E1306C]" />,
              label: 'AI Hinglish Voiceover',
              value: 'Natural Studio Quality Audio'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#E1306C]" />,
              label: 'Trending Sound',
              value: 'Top 1% Instagram Audio Sync'
            },
            {
              icon: <Share2 className="w-4 h-4 text-[#E1306C]" />,
              label: 'Hashtags & Captions',
              value: '#DhandaGrow #BusinessIndia'
            }
          ]
        },
        benefits: [
          {
            icon: <TrendingUp className="w-5 h-5 text-[#E1306C]" />,
            title: '10x Organic Reel Views',
            desc: 'Algorithm-optimized reels designed to hit the Instagram Explore feed.'
          },
          {
            icon: <Camera className="w-5 h-5 text-[#E1306C]" />,
            title: 'Zero Camera Shyness',
            desc: 'Generate viral AI avatars or faceless product showcase reels effortlessly.'
          },
          {
            icon: <Sparkles className="w-5 h-5 text-[#E1306C]" />,
            title: 'Dynamic Captions & Subtitles',
            desc: 'Auto-styled animated subtitles that keep viewers hooked till the end.'
          }
        ]
      },
      {
        id: 'instagram-dm-funnel',
        navTitle: 'Auto DM & Comment Funnel',
        heading: '24/7 AI Direct Message Sales Pipeline',
        inputCard: {
          label: 'Reel Comment Trigger',
          flag: '💬',
          value: 'Comment "BUY" or "PRICE"',
          badge: 'Trigger Event'
        },
        hubIcon: <InstagramIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Instagram Conversion Funnel',
          status: 'Auto-Responded in 0.3s',
          progressText: '38% Chat-to-Sale Rate',
          items: [
            {
              icon: <Send className="w-4 h-4 text-[#E1306C]" />,
              label: 'Public Comment Reply',
              value: '"Check your DM! Sent catalog 📩"'
            },
            {
              icon: <MessageSquare className="w-4 h-4 text-[#E1306C]" />,
              label: 'Direct Message',
              value: 'Product Link + 15% Off Coupon'
            },
            {
              icon: <Users className="w-4 h-4 text-[#E1306C]" />,
              label: 'Lead Capture',
              value: 'WhatsApp Number & Name Saved'
            },
            {
              icon: <Zap className="w-4 h-4 text-[#E1306C]" />,
              label: 'Instant Checkout',
              value: 'UPI / Razorpay Link Dispatched'
            }
          ]
        },
        benefits: [
          {
            icon: <Bot className="w-5 h-5 text-[#E1306C]" />,
            title: 'Turn Followers into Paying Customers',
            desc: 'Automatically message anyone who comments on your reels or posts.'
          },
          {
            icon: <Zap className="w-5 h-5 text-[#E1306C]" />,
            title: 'Zero Missed Sales Inquiries',
            desc: 'AI handles customer DMs even while you sleep or focus on business.'
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-[#E1306C]" />,
            title: '3x Higher Conversion',
            desc: 'Fast conversational checkout reduces cart abandonment dramatically.'
          }
        ]
      }
    ]
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    badge: 'B2B Leads & Thought Leadership',
    description: 'Win high-ticket corporate clients, enterprise partnerships, and establish unmatched industry authority with AI viral carousels and outreach.',
    themeColor: '#0A66C2',
    themeGradient: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
    icon: LinkedinIcon,
    subItems: [
      {
        id: 'linkedin-b2b',
        navTitle: 'B2B Lead Generation',
        heading: 'Verified B2B Decision-Maker Pipeline',
        inputCard: {
          label: 'Target Decision-Maker Filter',
          flag: '💼',
          value: 'Founders & MDs • Manufacturing & Retail',
          badge: 'B2B Filter'
        },
        hubIcon: <LinkedinIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'B2B Prospecting & Verification',
          status: 'Pipeline Active & Warm',
          progressText: '98% Inbox Delivery',
          items: [
            {
              icon: <Users className="w-4 h-4 text-[#0A66C2]" />,
              label: 'Verified Prospects',
              value: '1,250+ Active Indian MDs & Founders'
            },
            {
              icon: <FileText className="w-4 h-4 text-[#0A66C2]" />,
              label: 'Personalized InMail',
              value: 'Custom tailored B2B pitch generated'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-[#0A66C2]" />,
              label: 'Meeting Conversion',
              value: '18 Direct Discovery Calls Booked'
            },
            {
              icon: <BarChart3 className="w-4 h-4 text-[#0A66C2]" />,
              label: 'Projected Value',
              value: '₹24.5 Lakhs Pipeline Deal Flow'
            }
          ]
        },
        benefits: [
          {
            icon: <Users className="w-5 h-5 text-[#0A66C2]" />,
            title: 'Close High-Ticket Clients',
            desc: 'Reach actual business decision-makers who have real purchasing budgets.'
          },
          {
            icon: <Bot className="w-5 h-5 text-[#0A66C2]" />,
            title: 'Personalized at Scale',
            desc: 'AI references their recent posts and company updates for ultra-high replies.'
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-[#0A66C2]" />,
            title: '5x More Discovery Calls',
            desc: 'Fill your business sales calendar with qualified corporate inquiries.'
          }
        ]
      },
      {
        id: 'linkedin-carousels',
        navTitle: 'Viral PDF Carousels & Decks',
        heading: 'Thought Leadership & Multi-Slide Decks',
        inputCard: {
          label: 'Business Case Study / Idea',
          flag: '📊',
          value: '"How We Scaled From 10 to 500 Daily Orders"',
          badge: 'Topic Input'
        },
        hubIcon: <LinkedinIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'LinkedIn Authority Builder',
          status: 'Carousel Ready to Post',
          progressText: '5.2x Higher Impressions',
          items: [
            {
              icon: <Layers className="w-4 h-4 text-[#0A66C2]" />,
              label: 'PDF Carousel Slides',
              value: '7 Aesthetic Multi-Slide Story Deck'
            },
            {
              icon: <Zap className="w-4 h-4 text-[#0A66C2]" />,
              label: 'Pattern-Interrupt Hook',
              value: 'Bold, insightful opening statement'
            },
            {
              icon: <Globe className="w-4 h-4 text-[#0A66C2]" />,
              label: 'Organic Reach',
              value: 'Shared across B2B founder networks'
            },
            {
              icon: <MessageSquare className="w-4 h-4 text-[#0A66C2]" />,
              label: 'Inbound Inquiries',
              value: 'Generates organic inbound messages'
            }
          ]
        },
        benefits: [
          {
            icon: <Sparkles className="w-5 h-5 text-[#0A66C2]" />,
            title: 'Instant Industry Authority',
            desc: 'Position yourself and your company as the undisputed leader in your niche.'
          },
          {
            icon: <FileText className="w-5 h-5 text-[#0A66C2]" />,
            title: 'Automated Multi-Slide PDFs',
            desc: 'Generate beautifully formatted PDF slide documents in 1 single click.'
          },
          {
            icon: <ArrowRight className="w-5 h-5 text-[#0A66C2]" />,
            title: 'Inbound Deal Flow',
            desc: 'Attract investors, partners, and high-value buyers directly to your inbox.'
          }
        ]
      }
    ]
  },
  {
    id: 'threads',
    label: 'Threads',
    badge: 'Viral Conversational Growth',
    description: 'Tap into Meta’s fast-growing text community with AI-written viral hooks, hot takes, and effortless Instagram audience cross-pollination.',
    themeColor: '#101010',
    themeGradient: 'linear-gradient(135deg, #2a2a2a 0%, #101010 60%, #000000 100%)',
    icon: ThreadsIcon,
    subItems: [
      {
        id: 'threads-viral',
        navTitle: 'Viral Discussions & Hot Takes',
        heading: 'AI Micro-Conversations & Viral Hot Takes',
        inputCard: {
          label: 'Topic Hook & Industry Perspective',
          flag: '🗣️',
          value: 'D2C Brand Secrets • High-Curiosity Hook',
          badge: 'Threads Input'
        },
        hubIcon: <ThreadsIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Threads Algorithm Discussion Multiplier',
          status: 'Trending in Brand Feeds',
          progressText: 'Viral Engagement: 96%',
          items: [
            {
              icon: <Target className="w-4 h-4 text-[#101010]" />,
              label: 'Pattern-Interrupt Hook',
              value: 'High-Curiosity Opening Line'
            },
            {
              icon: <MessageSquare className="w-4 h-4 text-[#101010]" />,
              label: 'Discussion Prompt',
              value: 'Triggers 45+ Replies per Hour'
            },
            {
              icon: <Share2 className="w-4 h-4 text-[#101010]" />,
              label: 'Instagram Cross-Traffic',
              value: 'Direct Profile Visits Boost (+64%)'
            },
            {
              icon: <Users className="w-4 h-4 text-[#101010]" />,
              label: 'Follower Velocity',
              value: '+820 New Engaged Followers'
            }
          ]
        },
        benefits: [
          {
            icon: <TrendingUp className="w-5 h-5 text-[#101010]" />,
            title: 'Zero-Friction Text Virality',
            desc: 'Rank high on Meta’s algorithm without needing to record videos or design complex graphics.'
          },
          {
            icon: <Sparkles className="w-5 h-5 text-[#101010]" />,
            title: 'Direct Instagram Audience Lift',
            desc: 'Cross-post your top Threads seamlessly into Instagram Stories and feed for double exposure.'
          },
          {
            icon: <Users className="w-5 h-5 text-[#101010]" />,
            title: 'High-Trust Founder Branding',
            desc: 'Build authentic human connection with your buyers through real-time discussions.'
          }
        ]
      },
      {
        id: 'threads-community',
        navTitle: 'Daily Engagement & Niche Reply Bot',
        heading: 'Automated Brand Persona & Community Growth',
        inputCard: {
          label: 'Brand Tone & Response Trigger',
          flag: '💬',
          value: 'Witty & Helpful • Auto-Reply to Mentions',
          badge: 'Active Persona'
        },
        hubIcon: <ThreadsIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Threads 24/7 Community Presence',
          status: 'Top Mentioned in Niche',
          progressText: 'Reply Response Time: < 30s',
          items: [
            {
              icon: <Bot className="w-4 h-4 text-[#101010]" />,
              label: 'Smart Keyword Listener',
              value: 'Tracks product searches & pain points'
            },
            {
              icon: <Zap className="w-4 h-4 text-[#101010]" />,
              label: 'Conversational Soft-Sell',
              value: 'Directs warm inquiries to link-in-bio'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#101010]" />,
              label: 'Post Velocity',
              value: '3 Optimized Daily Drops (Peak Times)'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-[#101010]" />,
              label: 'Anti-Spam Safety',
              value: '100% Meta Graph API Compliant'
            }
          ]
        },
        benefits: [
          {
            icon: <CheckCircle2 className="w-5 h-5 text-[#101010]" />,
            title: 'Consistent Daily Visibility',
            desc: 'Stay relevant every single day without spending hours manually brainstorming posts.'
          },
          {
            icon: <MessageSquare className="w-5 h-5 text-[#101010]" />,
            title: 'Turn Debates into Customers',
            desc: 'Engage with people asking for product recommendations right when they need help.'
          },
          {
            icon: <Globe className="w-5 h-5 text-[#101010]" />,
            title: 'Automated Cross-Platform Sync',
            desc: 'Repurpose high-performing X threads to Threads with 1 single click.'
          }
        ]
      }
    ]
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    badge: 'Gen-Z Stories & Spotlight Video',
    description: 'Dominate Gen-Z and millennial discovery with AI-generated vertical Spotlight clips, interactive AR story filters, and hyper-local retail footfall ads.',
    themeColor: '#D99800',
    themeGradient: 'linear-gradient(135deg, #FFFC00 0%, #FFD600 50%, #FF9900 100%)',
    icon: SnapchatIcon,
    subItems: [
      {
        id: 'snapchat-spotlight',
        navTitle: 'AI Spotlight Viral 9:16 Videos',
        heading: 'AI Vertical Video & Gen-Z Spotlight Engine',
        inputCard: {
          label: 'Product Showcase & Sound Beat',
          flag: '👻',
          value: '9:16 Gen-Z Aesthetic • Trending Beats',
          badge: 'Spotlight Mode'
        },
        hubIcon: <SnapchatIcon className="w-6 h-6 text-black" />,
        outputCard: {
          title: 'Snapchat Spotlight Discovery Algorithm',
          status: 'Viral Spotlight Distribution',
          progressText: 'Projected Plays: 450K+ Views',
          items: [
            {
              icon: <Video className="w-4 h-4 text-[#D99800]" />,
              label: 'Video Format',
              value: '9:16 Fullscreen Instant Dynamic Hook'
            },
            {
              icon: <Sparkles className="w-4 h-4 text-[#D99800]" />,
              label: 'Trending Audio Sync',
              value: 'Matched to Top Trending India Audio'
            },
            {
              icon: <ShoppingBag className="w-4 h-4 text-[#D99800]" />,
              label: 'Swipe-Up Store Link',
              value: 'Direct to WhatsApp / Shopify Checkout'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#D99800]" />,
              label: 'Completion Rate',
              value: '84.6% (Top 5% on Platform)'
            }
          ]
        },
        benefits: [
          {
            icon: <Users className="w-5 h-5 text-[#D99800]" />,
            title: 'Reach 100M+ Active Gen-Z Shoppers',
            desc: 'Tap into India’s fastest-growing young consumer audience with high disposable intent.'
          },
          {
            icon: <Video className="w-5 h-5 text-[#D99800]" />,
            title: 'Zero Camera Shyness',
            desc: 'AI generates stunning animated product videos with realistic voiceovers and subtitles automatically.'
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-[#D99800]" />,
            title: 'High Organic Virality',
            desc: 'Spotlight gives brand-new accounts equal distribution based on watch time, not follower count.'
          }
        ]
      },
      {
        id: 'snapchat-ads',
        navTitle: 'Local Store Footfall & Snap Ads',
        heading: 'Hyper-Local Snap Ads & AR Filter Campaigns',
        inputCard: {
          label: 'Ad Budget & Store Location',
          flag: '📍',
          value: '₹500/day • 7km Radius Around Store',
          badge: 'Local Campaign'
        },
        hubIcon: <SnapchatIcon className="w-6 h-6 text-black" />,
        outputCard: {
          title: 'Snapchat Local Geo-Targeting Engine',
          status: 'Low-Cost High-Conversion Active',
          progressText: 'Avg CPC: ₹0.85 (Ultra Low)',
          items: [
            {
              icon: <Target className="w-4 h-4 text-[#D99800]" />,
              label: 'Local Pin-Code Filter',
              value: 'Shoppers within 15-min walk/drive'
            },
            {
              icon: <Zap className="w-4 h-4 text-[#D99800]" />,
              label: 'Swipe-to-Call / WhatsApp',
              value: '1-Tap Instant Chat with Store Owner'
            },
            {
              icon: <Users className="w-4 h-4 text-[#D99800]" />,
              label: 'Footfall Inquiries',
              value: '120+ Store Visit Inquiries / Week'
            },
            {
              icon: <BarChart3 className="w-4 h-4 text-[#D99800]" />,
              label: 'Ad Cost Efficiency',
              value: '3.8x Cheaper than Traditional Ads'
            }
          ]
        },
        benefits: [
          {
            icon: <Target className="w-5 h-5 text-[#D99800]" />,
            title: 'Fill Your Physical Store with Walk-Ins',
            desc: 'Target students, college crowds, and local shoppers right near your retail store.'
          },
          {
            icon: <BarChart3 className="w-5 h-5 text-[#D99800]" />,
            title: 'Unmatched Ad Cost Efficiency',
            desc: 'Snapchat ads cost significantly less per click than Facebook and Instagram in India.'
          },
          {
            icon: <Zap className="w-5 h-5 text-[#D99800]" />,
            title: 'Instant Swipe-to-WhatsApp Action',
            desc: 'Customers swipe up and directly start a conversation with you on WhatsApp.'
          }
        ]
      }
    ]
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    badge: 'Visual Search & E-Commerce Pins',
    description: 'Drive high-intent buyer traffic and passive sales with AI-generated 2:3 vertical pins, rich carousels, and keyword-ranked boards.',
    themeColor: '#E60023',
    themeGradient: 'linear-gradient(135deg, #E60023 0%, #AD081B 100%)',
    icon: PinterestIcon,
    subItems: [
      {
        id: 'pinterest-pins',
        navTitle: 'Viral Aesthetic Pins & Idea Pins',
        heading: 'AI-Generated High-Converting Pinterest Pins',
        inputCard: {
          label: 'Product Showcase & Aesthetic',
          flag: '📌',
          value: 'Home & Lifestyle • Viral Board',
          badge: 'AI Pin Input'
        },
        hubIcon: <PinterestIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Pinterest Visual Discovery Engine',
          status: 'Ranked #1 in Visual Search',
          progressText: '2.8M+ Monthly Impressions',
          items: [
            {
              icon: <Target className="w-4 h-4 text-[#E60023]" />,
              label: 'Audience Intent',
              value: 'High-LTV Female & Home Buyers'
            },
            {
              icon: <Layers className="w-4 h-4 text-[#E60023]" />,
              label: 'Pin Format',
              value: '2:3 Vertical Pins & Rich Carousels'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#E60023]" />,
              label: 'Outbound Click Rate',
              value: '8.4% Direct Store Traffic'
            },
            {
              icon: <ShoppingBag className="w-4 h-4 text-[#E60023]" />,
              label: 'E-Commerce Sync',
              value: 'Direct Shopify & Amazon Links'
            }
          ]
        },
        benefits: [
          {
            icon: <TrendingUp className="w-5 h-5 text-[#E60023]" />,
            title: 'Long-Lasting Organic Traffic',
            desc: 'Unlike standard social feeds, Pins rank on Google and Pinterest search for up to 6+ months.'
          },
          {
            icon: <Sparkles className="w-5 h-5 text-[#E60023]" />,
            title: 'Automated 2:3 Visual Design',
            desc: 'Turn simple product photos into aesthetic, clickable Pinterest graphics in seconds.'
          },
          {
            icon: <ShoppingBag className="w-5 h-5 text-[#E60023]" />,
            title: 'Direct Store Conversions',
            desc: 'Send ready-to-buy shoppers straight to your product checkout or WhatsApp catalogue.'
          }
        ]
      },
      {
        id: 'pinterest-seo',
        navTitle: 'Keyword SEO Boards & Scheduler',
        heading: 'Automated Board Scheduling & Keyword SEO',
        inputCard: {
          label: 'Target Niche & Keywords',
          flag: '🔍',
          value: 'Daily 5:00 PM • Trending Keywords',
          badge: 'Scheduled'
        },
        hubIcon: <PinterestIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Pinterest Algorithmic Distribution',
          status: 'Viral In Niche',
          progressText: 'Domain Authority: 92/100',
          items: [
            {
              icon: <Globe className="w-4 h-4 text-[#E60023]" />,
              label: 'Search Ranking',
              value: 'Top 3 for High-Volume Search Terms'
            },
            {
              icon: <BarChart3 className="w-4 h-4 text-[#E60023]" />,
              label: 'Save & Repin Rate',
              value: '14.2% (Viral Repin Velocity)'
            },
            {
              icon: <Bot className="w-4 h-4 text-[#E60023]" />,
              label: 'Smart Tag Generator',
              value: 'Top 20 Trending SEO Hashtags'
            },
            {
              icon: <Users className="w-4 h-4 text-[#E60023]" />,
              label: 'Audience Growth',
              value: '+18,500 Monthly Engaged Pinners'
            }
          ]
        },
        benefits: [
          {
            icon: <CheckCircle2 className="w-5 h-5 text-[#E60023]" />,
            title: 'Keyword-Rich Descriptions',
            desc: 'AI writes search-optimized Pin titles and descriptions that rank at the top of search.'
          },
          {
            icon: <Calendar className="w-5 h-5 text-[#E60023]" />,
            title: 'Hands-Free Daily Pinning',
            desc: 'Schedule dozens of fresh pins ahead of time with algorithmic interval pacing.'
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-[#E60023]" />,
            title: 'Compounding Evergreen Sales',
            desc: 'Build passive discovery funnels that compound daily customer traffic over time.'
          }
        ]
      }
    ]
  },
  {
    id: 'twitter',
    label: 'X',
    badge: 'Viral Threads & Thought Leadership',
    description: 'Build an authoritative industry brand on X with AI-written viral threads, breaking news hooks, and 24/7 automated lead funnels.',
    themeColor: '#0F1419',
    themeGradient: 'linear-gradient(135deg, #2c3540 0%, #0F1419 60%, #000000 100%)',
    icon: XTwitterIcon,
    subItems: [
      {
        id: 'twitter-threads',
        navTitle: 'Viral Threads & Hook Engine',
        heading: 'AI Viral X (Twitter) Threads & Storytelling',
        inputCard: {
          label: 'Topic / Industry Playbook',
          flag: '🧵',
          value: 'Business Growth • Viral Hook',
          badge: 'Thread Input'
        },
        hubIcon: <XTwitterIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'X Algorithm Retention Engine',
          status: 'Viral Probability: 95%',
          progressText: 'Projected Reach: 380K+',
          items: [
            {
              icon: <Zap className="w-4 h-4 text-[#0F1419]" />,
              label: 'Hook Strength',
              value: '98/100 (Instant Scroll Stopper)'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#0F1419]" />,
              label: 'Engagement Rate',
              value: '7.8% Retweet & Reply Ratio'
            },
            {
              icon: <Layers className="w-4 h-4 text-[#0F1419]" />,
              label: 'Thread Structure',
              value: '8-Part Narrative with Strong CTA'
            },
            {
              icon: <Share2 className="w-4 h-4 text-[#0F1419]" />,
              label: 'Bookmark Velocity',
              value: '1,800+ Bookmarks in 24 Hours'
            }
          ]
        },
        benefits: [
          {
            icon: <Zap className="w-5 h-5 text-[#0F1419]" />,
            title: 'High-Retention Narrative Hooks',
            desc: 'AI crafts compelling first-tweet hooks proven to maximize read-through and retweet rate.'
          },
          {
            icon: <Bot className="w-5 h-5 text-[#0F1419]" />,
            title: 'Instant Founder Branding',
            desc: 'Position yourself and your company as an industry authority without spending hours drafting.'
          },
          {
            icon: <MessageSquare className="w-5 h-5 text-[#0F1419]" />,
            title: 'Automated DM Lead Funnels',
            desc: 'Deliver links, PDFs, and lead magnets automatically to everyone who comments or retweets.'
          }
        ]
      },
      {
        id: 'twitter-growth',
        navTitle: 'Trend Jacking & Auto-Reply CRM',
        heading: 'Real-Time Trend Jacking & Auto-Engagement',
        inputCard: {
          label: 'Trending Keywords & Accounts',
          flag: '⚡',
          value: 'Tech & Market Trends • Auto-Monitor',
          badge: 'Active Monitor'
        },
        hubIcon: <XTwitterIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'X Smart Engagement Engine',
          status: 'Active & Listening',
          progressText: '500+ Qualified Interactions/Day',
          items: [
            {
              icon: <Target className="w-4 h-4 text-[#0F1419]" />,
              label: 'Influencer Tracking',
              value: 'Top 100 Industry Accounts'
            },
            {
              icon: <Bot className="w-4 h-4 text-[#0F1419]" />,
              label: 'Smart Reply Speed',
              value: 'Sub-60s on Key Viral Posts'
            },
            {
              icon: <Users className="w-4 h-4 text-[#0F1419]" />,
              label: 'Follower Conversion',
              value: '+3,200 High-Value Followers/Month'
            },
            {
              icon: <BarChart3 className="w-4 h-4 text-[#0F1419]" />,
              label: 'Profile Visits',
              value: '42K Monthly Profile Clicks'
            }
          ]
        },
        benefits: [
          {
            icon: <CheckCircle2 className="w-5 h-5 text-[#0F1419]" />,
            title: 'First-to-Reply Advantage',
            desc: 'Drop witty, insightful replies on trending viral posts to siphon massive attention.'
          },
          {
            icon: <Bot className="w-5 h-5 text-[#0F1419]" />,
            title: '24/7 Buying Intent Tracking',
            desc: 'Detect purchase-intent tweets and reply with personalized, helpful recommendations.'
          },
          {
            icon: <ArrowRight className="w-5 h-5 text-[#0F1419]" />,
            title: 'Effortless B2B Dealflow',
            desc: 'Turn casual Twitter conversations into high-ticket DM appointments and product sales.'
          }
        ]
      }
    ]
  },
  {
    id: 'telegram',
    label: 'Telegram',
    badge: 'Channel Broadcasts & Community AI Bot',
    description: 'Scale your VIP subscriber channel and automate group commerce with AI broadcast campaigns, instant alerts, and 24/7 smart customer service bots.',
    themeColor: '#229ED9',
    themeGradient: 'linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)',
    icon: TelegramIcon,
    subItems: [
      {
        id: 'telegram-broadcast',
        navTitle: 'AI Channel Broadcasts & Alerts',
        heading: 'AI-Powered Telegram Broadcasts & Flash Sales',
        inputCard: {
          label: 'Broadcast Offer & Segment',
          flag: '📢',
          value: 'Flash Sale • VIP 25K Members',
          badge: 'Broadcast Input'
        },
        hubIcon: <TelegramIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Telegram Channel Broadcast Engine',
          status: 'Instant 100% Delivery',
          progressText: 'Open Rate: 91%',
          items: [
            {
              icon: <Zap className="w-4 h-4 text-[#229ED9]" />,
              label: 'Delivery Speed',
              value: '< 3 Seconds to 25,000+ Members'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#229ED9]" />,
              label: 'Click-Through Rate',
              value: '34.6% Interactive Button Clicks'
            },
            {
              icon: <Bot className="w-4 h-4 text-[#229ED9]" />,
              label: 'Format Engine',
              value: 'Rich Markdown with Inline Buttons'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-[#229ED9]" />,
              label: 'Anti-Spam Score',
              value: '100% Whitelisted Delivery'
            }
          ]
        },
        benefits: [
          {
            icon: <TrendingUp className="w-5 h-5 text-[#229ED9]" />,
            title: '90%+ Read & Open Rate',
            desc: 'Telegram notifications enjoy near-100% open rates with zero algorithm throttling.'
          },
          {
            icon: <Sparkles className="w-5 h-5 text-[#229ED9]" />,
            title: 'Interactive Inline Buy Buttons',
            desc: 'Embed direct checkout buttons, product links, and UPI payments into every post.'
          },
          {
            icon: <Calendar className="w-5 h-5 text-[#229ED9]" />,
            title: 'Automated Drip Broadcasts',
            desc: 'Schedule daily updates, tips, and promotional drops without manual posting.'
          }
        ]
      },
      {
        id: 'telegram-bot',
        navTitle: '24/7 AI Community & Sales Bot',
        heading: 'Automated Group Moderator & Sales Concierge',
        inputCard: {
          label: 'Community Rules & FAQ',
          flag: '🤖',
          value: 'Auto-Welcome • Product Orders',
          badge: 'Active Bot'
        },
        hubIcon: <TelegramIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Telegram AI Concierge Intelligence',
          status: '24/7 Online & Protecting',
          progressText: 'Resolved Inquiries: 99.2%',
          items: [
            {
              icon: <Users className="w-4 h-4 text-[#229ED9]" />,
              label: 'Community Protection',
              value: 'Instant Spam & Raid Shield'
            },
            {
              icon: <MessageSquare className="w-4 h-4 text-[#229ED9]" />,
              label: 'Response Speed',
              value: '< 1 Second Instant AI Reply'
            },
            {
              icon: <ShoppingBag className="w-4 h-4 text-[#229ED9]" />,
              label: 'Catalog Inquiries',
              value: 'Shares Live Prices & Buy Links'
            },
            {
              icon: <BarChart3 className="w-4 h-4 text-[#229ED9]" />,
              label: 'Leads Captured',
              value: '1,450 New Leads/Month'
            }
          ]
        },
        benefits: [
          {
            icon: <Bot className="w-5 h-5 text-[#229ED9]" />,
            title: 'Instant 24/7 Customer Support',
            desc: 'Answer product specs, shipping inquiries, and order queries in milliseconds.'
          },
          {
            icon: <CheckCircle2 className="w-5 h-5 text-[#229ED9]" />,
            title: 'Zero-Spam Community Shield',
            desc: 'Auto-detect and delete spam bots, scam links, and abusive messages instantly.'
          },
          {
            icon: <ShoppingBag className="w-5 h-5 text-[#229ED9]" />,
            title: 'Direct In-Chat Checkout',
            desc: 'Let customers browse your product catalogue and place orders without leaving Telegram.'
          }
        ]
      }
    ]
  },
  {
    id: 'youtube',
    label: 'YouTube',
    badge: 'Shorts & Long-Form Video Engine',
    description: 'Grow a high-converting video channel with AI-scripted YouTube Shorts, automated SEO chapters, high-CTR thumbnails, and 24/7 evergreen buyer discovery.',
    themeColor: '#FF0000',
    themeGradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 55%, #990000 100%)',
    icon: YoutubeIcon,
    subItems: [
      {
        id: 'youtube-shorts',
        navTitle: 'AI YouTube Shorts & Viral Hooks',
        heading: 'AI-Generated YouTube Shorts & Viral Scripting',
        inputCard: {
          label: 'Video Concept & Target Hook',
          flag: '🎬',
          value: 'High-Retention Script • 60-Sec Short',
          badge: 'Shorts Engine'
        },
        hubIcon: <YoutubeIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'YouTube Shorts Algorithm Accelerator',
          status: 'Viral on Shorts Shelf',
          progressText: 'Avg View Duration: 112%',
          items: [
            {
              icon: <Video className="w-4 h-4 text-[#FF0000]" />,
              label: 'Pattern-Interrupt Hook',
              value: '97/100 (Instant Curiosity Gap)'
            },
            {
              icon: <Sparkles className="w-4 h-4 text-[#FF0000]" />,
              label: 'AI B-Roll & Captions',
              value: 'Auto-Synced Bold Kinetic Subtitles'
            },
            {
              icon: <Users className="w-4 h-4 text-[#FF0000]" />,
              label: 'Subscribers Lift',
              value: '+2,400 Organic Subs / Week'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#FF0000]" />,
              label: 'Shorts Shelf Reach',
              value: '750K+ Algorithm Impressions'
            }
          ]
        },
        benefits: [
          {
            icon: <Video className="w-5 h-5 text-[#FF0000]" />,
            title: 'Dominate the YouTube Shorts Shelf',
            desc: 'Get discovered by millions of daily viewers without expensive cameras or video editing teams.'
          },
          {
            icon: <Sparkles className="w-5 h-5 text-[#FF0000]" />,
            title: 'High-Retention Script Generator',
            desc: 'AI writes retention-optimized pacing with built-in pattern interrupts every 4 seconds.'
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-[#FF0000]" />,
            title: 'Automated Channel Monetization',
            desc: 'Fast-track your 4,000 watch hours and 10M Shorts views to unlock YouTube Partner revenue.'
          }
        ]
      },
      {
        id: 'youtube-seo',
        navTitle: 'Search SEO, Chapters & Clickbait Thumbnails',
        heading: 'Long-Form Video SEO & High-CTR Packaging',
        inputCard: {
          label: 'Video Topic & Primary Keyword',
          flag: '🎯',
          value: '"Digital Marketing Growth Blueprint 2026"',
          badge: 'SEO Packaging'
        },
        hubIcon: <YoutubeIcon className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'YouTube Search Ranking & Funnel Engine',
          status: 'Ranked #1 for Target Keyword',
          progressText: 'Click-Through Rate: 14.8%',
          items: [
            {
              icon: <Target className="w-4 h-4 text-[#FF0000]" />,
              label: 'Search Ranking',
              value: '#1 on Google & YouTube Search'
            },
            {
              icon: <Layers className="w-4 h-4 text-[#FF0000]" />,
              label: 'Smart Chapters',
              value: '8 Keyword-Optimized Timestamp Sections'
            },
            {
              icon: <ShoppingBag className="w-4 h-4 text-[#FF0000]" />,
              label: 'Store & WhatsApp Funnel',
              value: 'Automated Pinned Comment & Bio Links'
            },
            {
              icon: <BarChart3 className="w-4 h-4 text-[#FF0000]" />,
              label: 'Search Traffic Share',
              value: '68% Inbound High-Intent Buyers'
            }
          ]
        },
        benefits: [
          {
            icon: <Target className="w-5 h-5 text-[#FF0000]" />,
            title: 'Evergreen 24/7 Video Traffic',
            desc: 'Rank your business tutorials and product reviews at the top of search results for years.'
          },
          {
            icon: <Sparkles className="w-5 h-5 text-[#FF0000]" />,
            title: 'Instant High-CTR Thumbnail Concepts',
            desc: 'AI generates emotional facial expressions, bold color contrasts, and clickable text hooks.'
          },
          {
            icon: <ShoppingBag className="w-5 h-5 text-[#FF0000]" />,
            title: 'Automated Lead Capture In Descriptions',
            desc: 'Direct warm viewers into your WhatsApp community, CRM, or online store effortlessly.'
          }
        ]
      }
    ]
  }
];

export function PaymentsStackSection() {
  const [activeTab, setActiveTab] = useState<TabType>('facebook');
  const [activeCardId, setActiveCardId] = useState<string>('facebook-ads');
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pillBarRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the pill bar so the active tab is always centered and visible
  useEffect(() => {
    if (pillBarRef.current) {
      const activeEl = pillBarRef.current.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  // Scroll listener to update sticky pill tabs and active sub-item highlights
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const pageY = window.pageYOffset || document.documentElement.scrollTop;

          const tabs: TabType[] = ['facebook', 'instagram', 'linkedin', 'threads', 'snapchat', 'pinterest', 'twitter', 'telegram', 'youtube'];

          // Near-bottom guard: if user scrolled near the bottom of the page, activate the last tab
          const isNearBottom = window.innerHeight + pageY >= document.documentElement.scrollHeight - 160;
          if (isNearBottom) {
            setActiveTab(tabs[tabs.length - 1]);
            ticking = false;
            return;
          }

          // Trigger line: 38% from the top of the viewport
          const triggerLine = window.innerHeight * 0.38;

          // Find the active section intersecting the trigger line
          let matchedTab: TabType | null = null;
          for (const tab of tabs) {
            const el = document.getElementById(`section-${tab}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= triggerLine && rect.bottom > triggerLine) {
                matchedTab = tab;
                break;
              }
            }
          }

          if (matchedTab) {
            setActiveTab(matchedTab);
          } else {
            // Fallback: pick the section closest to triggerLine whose top is <= triggerLine
            let bestTab: TabType = tabs[0];
            let bestDist = Infinity;
            for (const tab of tabs) {
              const el = document.getElementById(`section-${tab}`);
              if (el) {
                const rect = el.getBoundingClientRect();
                const dist = Math.abs(rect.top - triggerLine);
                if (rect.top <= triggerLine + 150 && dist < bestDist) {
                  bestDist = dist;
                  bestTab = tab;
                }
              }
            }
            setActiveTab(bestTab);
          }

          // Determine which sub-card is currently active
          const cardIds = [
            'facebook-ads',
            'facebook-page',
            'instagram-reels',
            'instagram-dm-funnel',
            'linkedin-b2b',
            'linkedin-carousels',
            'threads-viral',
            'threads-community',
            'snapchat-spotlight',
            'snapchat-ads',
            'pinterest-pins',
            'pinterest-seo',
            'twitter-threads',
            'twitter-growth',
            'telegram-broadcast',
            'telegram-bot',
            'youtube-shorts',
            'youtube-seo'
          ];

          for (let i = cardIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(`card-${cardIds[i]}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.45) {
                setActiveCardId(cardIds[i]);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToSection = (tabId: TabType) => {
    setActiveTab(tabId);
    isClickScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 2200);

    const targetEl = document.getElementById(`section-${tabId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCard = (cardId: string) => {
    setActiveCardId(cardId);
    isClickScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 2200);

    const targetEl = document.getElementById(`card-${cardId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="pt-3 sm:pt-4 pb-3 sm:pb-4 bg-[#faf9f6] relative z-10 w-full transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Sticky Top Floating Navigation Pill Bar */}
        <div className="sticky top-20 sm:top-24 z-40 pointer-events-none flex justify-center mb-4 sm:mb-5 py-1 px-2">
          <div
            ref={pillBarRef}
            className="pointer-events-auto inline-flex items-center p-1 sm:p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200/90 gap-0.5 sm:gap-1 max-w-full overflow-x-auto scrollbar-hide scroll-smooth"
          >

            {sectionsData.map((category, idx) => {
              const isCurrent = activeTab === category.id;
              const isPast = sectionsData.findIndex(s => s.id === activeTab) >= idx;

              return (
                <React.Fragment key={category.id}>
                  {/* Connecting Line between Tabs */}
                  {idx > 0 && (
                    <div className="hidden xl:block relative w-1.5 xl:w-2 h-[2px] bg-slate-200/80 rounded-full overflow-hidden shrink-0">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: isPast ? '100%' : '0%',
                          backgroundColor: category.themeColor
                        }}
                      />
                    </div>
                  )}

                  {/* Tab Button */}
                  <button
                    data-tab={category.id}
                    onClick={() => scrollToSection(category.id)}
                    className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                      isCurrent
                        ? 'font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    style={{
                      color: isCurrent ? category.themeColor : undefined
                    }}
                  >
                    {isCurrent && (
                      <motion.div
                        layoutId="activeStickyPill"
                        className="absolute inset-0 rounded-full border shadow-xs"
                        style={{
                          backgroundColor: `${category.themeColor}12`,
                          borderColor: `${category.themeColor}35`
                        }}
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <category.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 shrink-0" />
                    <span className="relative z-10">{category.label}</span>
                  </button>
                </React.Fragment>
              );
            })}

          </div>
        </div>

        {/* Sequential Sections */}
        <div className="space-y-10 sm:space-y-12">
          {sectionsData.map((category) => (
            <div
              key={category.id}
              id={`section-${category.id}`}
              className="scroll-mt-28 sm:scroll-mt-32"
            >
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* Left Column: Sticky alongside cards */}
                <div className="lg:col-span-3 lg:sticky lg:top-32 pt-1">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs"
                    style={{
                      backgroundColor: `${category.themeColor}15`,
                      borderColor: `${category.themeColor}30`,
                      color: category.themeColor,
                    }}
                  >
                    <category.icon className="w-3.5 h-3.5" />
                    <span>{category.label}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                    {category.badge}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3.5 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="space-y-2 border-l-2 border-slate-200/70 pl-3">
                    {category.subItems.map((sub) => {
                      const isSubSelected = activeCardId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => scrollToCard(sub.id)}
                          className="w-full text-left flex items-start gap-2.5 group transition-colors cursor-pointer py-0.5"
                        >
                          <div className="relative w-2.5 h-2.5 mt-1.5 shrink-0 flex items-center justify-center">
                            {isSubSelected ? (
                              <>
                                <span
                                  className="w-2.5 h-2.5 rounded-full scale-110 shadow-sm"
                                  style={{ backgroundColor: category.themeColor }}
                                />
                                <span
                                  className="absolute inset-0 rounded-full animate-ping opacity-60"
                                  style={{ backgroundColor: category.themeColor }}
                                />
                              </>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                            )}
                          </div>
                          <span
                            className={`text-sm sm:text-base leading-snug transition-colors ${
                              isSubSelected
                                ? 'text-slate-900 font-bold'
                                : 'text-slate-500 font-medium group-hover:text-slate-800'
                            }`}
                          >
                            {sub.navTitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Content Cards */}
                <div className="lg:col-span-9 space-y-6 sm:space-y-7 min-w-0">
                  {category.subItems.map((sub) => (
                    <div
                      key={sub.id}
                      id={`card-${sub.id}`}
                      className="scroll-mt-28 sm:scroll-mt-32 bg-[#fffdfa] rounded-[24px] sm:rounded-[28px] border border-orange-200/50 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.05)] p-4 sm:p-6 relative overflow-hidden"
                    >
                      {/* Main Heading */}
                      <h4 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight mb-4 leading-tight">
                        {sub.heading}
                      </h4>

                      {/* Interactive Diagram Canvas */}
                      <div className="relative rounded-2xl bg-gradient-to-br from-[#fffdfa] via-white to-slate-50/60 border border-slate-200/80 p-3.5 sm:p-5 mb-4 sm:mb-5 overflow-hidden shadow-xs">
                        {/* Subtle Grid Overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none opacity-30"
                          style={{
                            backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
                            backgroundSize: '32px 32px'
                          }}
                        />

                        {/* Connecting Diagram: Left Input -> Center Glowing Hub -> Right Intelligence Card */}
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-3">

                          {/* 1. Left Input Card */}
                          <div className="w-full lg:w-[240px] xl:w-[260px] shrink-0 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-md">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className="text-[11px] sm:text-xs font-semibold"
                                style={{ color: category.themeColor }}
                              >
                                {sub.inputCard.label}
                              </span>
                              <span
                                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: `${category.themeColor}15`,
                                  color: category.themeColor,
                                }}
                              >
                                {sub.inputCard.badge}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 bg-[#faf8f5] border border-slate-100 rounded-xl px-3 py-2.5 mt-2">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs"
                                style={{
                                  backgroundColor: `${category.themeColor}15`,
                                  borderColor: `${category.themeColor}30`,
                                  color: category.themeColor
                                }}
                              >
                                <category.icon className="w-4 h-4 shrink-0" />
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide font-mono truncate">
                                {sub.inputCard.value}
                              </span>
                            </div>
                          </div>

                          {/* 2. Center Connector Network Lines & Glowing Processing Hub */}
                          <div className="relative flex items-center justify-center my-3 lg:my-0 shrink-0 w-full lg:w-auto px-1">
                            {/* Left line connecting Input to Center Hub */}
                            <div className="hidden lg:flex items-center w-10 xl:w-16 h-[2px] bg-gradient-to-r from-slate-200 via-slate-300 to-indigo-200 relative">
                              <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-ping"
                                style={{ backgroundColor: category.themeColor }}
                              />
                            </div>

                            {/* Center Glowing Hub with Official Social Media Brand Icon */}
                            <div
                              className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white scale-100 hover:scale-105 transition-transform p-3 shrink-0 mx-1"
                              style={{
                                background: category.themeGradient,
                                boxShadow: `0 8px 24px ${category.themeColor}50`
                              }}
                            >
                              <category.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" />
                            </div>

                            {/* Right Outgoing Line: STRAIGHT LINE ARROW FROM CENTER TO RIGHT SIDE! */}
                            <div className="hidden lg:flex items-center w-12 xl:w-20 h-[2px] relative select-none">
                              {/* Straight line */}
                              <div
                                className="w-full h-full rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, ${category.themeColor}, #f0449b)`
                                }}
                              />

                              {/* Animated glowing energy dot */}
                              <div
                                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-sm animate-ping"
                                style={{ backgroundColor: category.themeColor }}
                              />
                              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />

                              {/* Arrow Head pointing right directly into the output card */}
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                                <svg
                                  className="w-3.5 h-3.5 fill-current translate-x-1"
                                  style={{ color: category.themeColor }}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M5 3l14 9-14 9V3z" />
                                </svg>
                              </div>
                            </div>

                            {/* Mobile / Tablet vertical line pointing downwards */}
                            <div className="lg:hidden flex flex-col items-center my-1 select-none">
                              <div
                                className="w-[2px] h-6 rounded-full relative"
                                style={{
                                  background: `linear-gradient(180deg, ${category.themeColor}, #f0449b)`
                                }}
                              >
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
                                  <svg
                                    className="w-3 h-3 fill-current rotate-90"
                                    style={{ color: category.themeColor }}
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M5 3l14 9-14 9V3z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Right Output / Intelligence Card */}
                          <div className="w-full lg:flex-1 lg:min-w-[280px] lg:max-w-[380px] bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-lg">
                            <div className="flex items-center justify-between mb-2.5 gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                  style={{
                                    backgroundColor: `${category.themeColor}15`,
                                    color: category.themeColor
                                  }}
                                >
                                  <category.icon className="w-3.5 h-3.5 shrink-0" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {sub.outputCard.title}
                                </span>
                              </div>
                              <span
                                className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                style={{
                                  backgroundColor: `${category.themeColor}15`,
                                  color: category.themeColor
                                }}
                              >
                                {sub.outputCard.progressText}
                              </span>
                            </div>

                            {/* Progress Line */}
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                              <div
                                className="h-full rounded-full w-[85%] animate-pulse"
                                style={{
                                  background: `linear-gradient(90deg, ${category.themeColor}, #FE8036)`
                                }}
                              />
                            </div>

                            {/* Verified Signal Items */}
                            <div className="space-y-2.5">
                              {sub.outputCard.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs sm:text-[13px] border-b border-slate-100 pb-2 last:border-none last:pb-0 gap-2">
                                  <div className="flex items-center gap-2 text-slate-600 font-medium shrink-0">
                                    {item.icon}
                                    <span>{item.label}</span>
                                  </div>
                                  <span className="font-semibold text-slate-900 text-right text-xs truncate max-w-[170px] sm:max-w-[200px]" title={item.value}>
                                    {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Bottom 3 Feature Benefit Badges */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-3.5 sm:pt-4 border-t border-slate-200/60">
                        {sub.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3 group">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border"
                              style={{
                                backgroundColor: `${category.themeColor}12`,
                                borderColor: `${category.themeColor}25`,
                              }}
                            >
                              {benefit.icon}
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 leading-snug">
                                {benefit.title}
                              </h5>
                              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                                {benefit.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
