'use client';

import React, { useState, useEffect } from 'react';
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

export type TabType = 'facebook' | 'instagram' | 'whatsapp' | 'linkedin';

// Brand Social Icons
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
        hubIcon: <Megaphone className="w-6 h-6 text-white fill-white" />,
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
        hubIcon: <Share2 className="w-6 h-6 text-white" />,
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
    themeColor: '#FE8036',
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
        hubIcon: <Camera className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Instagram Algorithm Engine',
          status: 'Viral Potential: High',
          progressText: 'Viral Index: 96/100',
          items: [
            {
              icon: <Zap className="w-4 h-4 text-[#FE8036]" />,
              label: '3-Second Hook',
              value: 'High-Retention Visual Opening'
            },
            {
              icon: <Sparkles className="w-4 h-4 text-[#FE8036]" />,
              label: 'AI Hinglish Voiceover',
              value: 'Natural Studio Quality Audio'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#FE8036]" />,
              label: 'Trending Sound',
              value: 'Top 1% Instagram Audio Sync'
            },
            {
              icon: <Share2 className="w-4 h-4 text-[#FE8036]" />,
              label: 'Hashtags & Captions',
              value: '#DhandaGrow #BusinessIndia'
            }
          ]
        },
        benefits: [
          {
            icon: <TrendingUp className="w-5 h-5 text-[#FE8036]" />,
            title: '10x Organic Reel Views',
            desc: 'Algorithm-optimized reels designed to hit the Instagram Explore feed.'
          },
          {
            icon: <Camera className="w-5 h-5 text-[#FE8036]" />,
            title: 'Zero Camera Shyness',
            desc: 'Generate viral AI avatars or faceless product showcase reels effortlessly.'
          },
          {
            icon: <Sparkles className="w-5 h-5 text-[#FE8036]" />,
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
        hubIcon: <MessageSquare className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Instagram Conversion Funnel',
          status: 'Auto-Responded in 0.3s',
          progressText: '38% Chat-to-Sale Rate',
          items: [
            {
              icon: <Send className="w-4 h-4 text-[#FE8036]" />,
              label: 'Public Comment Reply',
              value: '"Check your DM! Sent catalog 📩"'
            },
            {
              icon: <MessageSquare className="w-4 h-4 text-[#FE8036]" />,
              label: 'Direct Message',
              value: 'Product Link + 15% Off Coupon'
            },
            {
              icon: <Users className="w-4 h-4 text-[#FE8036]" />,
              label: 'Lead Capture',
              value: 'WhatsApp Number & Name Saved'
            },
            {
              icon: <Zap className="w-4 h-4 text-[#FE8036]" />,
              label: 'Instant Checkout',
              value: 'UPI / Razorpay Link Dispatched'
            }
          ]
        },
        benefits: [
          {
            icon: <Bot className="w-5 h-5 text-[#FE8036]" />,
            title: 'Turn Followers into Paying Customers',
            desc: 'Automatically message anyone who comments on your reels or posts.'
          },
          {
            icon: <Zap className="w-5 h-5 text-[#FE8036]" />,
            title: 'Zero Missed Sales Inquiries',
            desc: 'AI handles customer DMs even while you sleep or focus on business.'
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-[#FE8036]" />,
            title: '3x Higher Conversion',
            desc: 'Fast conversational checkout reduces cart abandonment dramatically.'
          }
        ]
      }
    ]
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    badge: 'AI Marketing & Conversational CRM',
    description: 'Turn WhatsApp into your highest-converting sales channel with automated broadcasts, AI sales bots, and instant UPI checkout.',
    themeColor: '#25D366',
    icon: WhatsAppIcon,
    subItems: [
      {
        id: 'whatsapp-broadcast',
        navTitle: 'Smart AI Broadcasts & Catalog',
        heading: '1-Click WhatsApp Marketing & Catalog Blast',
        inputCard: {
          label: 'Customer Segment & Offer',
          flag: '📱',
          value: '5,000 Inactive Customers • Festive Offer',
          badge: 'Broadcast Input'
        },
        hubIcon: <ShoppingBag className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'WhatsApp Engine & CRM',
          status: 'Dispatched in 120s',
          progressText: '98% Open Rate',
          items: [
            {
              icon: <Send className="w-4 h-4 text-[#25D366]" />,
              label: 'Delivery Speed',
              value: '5,000 Messages in 120 Seconds'
            },
            {
              icon: <Sparkles className="w-4 h-4 text-[#25D366]" />,
              label: 'Personalization',
              value: 'Customer Name & Past Order Ref'
            },
            {
              icon: <ShoppingBag className="w-4 h-4 text-[#25D366]" />,
              label: 'Interactive CTA',
              value: '"View Catalog" & "Order Now"'
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-[#25D366]" />,
              label: 'Sales Generated',
              value: '₹1.45 Lakhs Same-Day Sales'
            }
          ]
        },
        benefits: [
          {
            icon: <TrendingUp className="w-5 h-5 text-[#25D366]" />,
            title: '98% Guaranteed Open Rates',
            desc: 'Connect directly with customers where they check messages dozens of times a day.'
          },
          {
            icon: <Bot className="w-5 h-5 text-[#25D366]" />,
            title: 'Official Green-Tick API',
            desc: 'Send bulk messages safely without any number ban or spam risks.'
          },
          {
            icon: <Zap className="w-5 h-5 text-[#25D366]" />,
            title: 'Smart Inactive Reactivation',
            desc: 'Automatically re-engage old buyers with customized discount incentives.'
          }
        ]
      },
      {
        id: 'whatsapp-chatbot',
        navTitle: '24/7 AI Sales Agent & Checkout',
        heading: 'Conversational AI Sales Bot with UPI Payments',
        inputCard: {
          label: 'Incoming Customer Query',
          flag: '💬',
          value: '"Bhaiya size M available hai kya?"',
          badge: 'Live Query'
        },
        hubIcon: <Bot className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'AI Sales Intelligence Hub',
          status: 'Replied in 1.2s',
          progressText: 'Hinglish AI Agent',
          items: [
            {
              icon: <MessageSquare className="w-4 h-4 text-[#25D366]" />,
              label: 'Natural AI Reply',
              value: '"Haanji! In stock. Checkout link sent"'
            },
            {
              icon: <Layers className="w-4 h-4 text-[#25D366]" />,
              label: 'Catalog Images',
              value: 'Auto-dispatched with size chart'
            },
            {
              icon: <Zap className="w-4 h-4 text-[#25D366]" />,
              label: 'Direct UPI Pay',
              value: 'Dynamic PhonePe/GPay QR generated'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-[#25D366]" />,
              label: 'Order Confirmation',
              value: 'Automated invoice & tracking dispatched'
            }
          ]
        },
        benefits: [
          {
            icon: <Bot className="w-5 h-5 text-[#25D366]" />,
            title: 'Never Miss a Midnight Customer',
            desc: 'Close sales automatically even at 2 AM without hiring extra support staff.'
          },
          {
            icon: <Globe className="w-5 h-5 text-[#25D366]" />,
            title: 'Native Hinglish & Regional Tone',
            desc: 'Talks just like a friendly shop assistant in Hindi, Hinglish, or English.'
          },
          {
            icon: <Zap className="w-5 h-5 text-[#25D366]" />,
            title: 'Instant 1-Click UPI Payments',
            desc: 'Customers can pay instantly through GPay, PhonePe, or Paytm inside WhatsApp.'
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
        hubIcon: <Users className="w-6 h-6 text-white" />,
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
        hubIcon: <FileText className="w-6 h-6 text-white" />,
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
  }
];

export function PaymentsStackSection() {
  const [activeTab, setActiveTab] = useState<TabType>('facebook');
  const [activeCardId, setActiveCardId] = useState<string>('facebook-ads');

  // Scroll listener to update sticky pill tabs and active sub-item highlights
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const pageY = window.pageYOffset || document.documentElement.scrollTop;
          const triggerY = pageY + 240;

          const tabs: TabType[] = ['facebook', 'instagram', 'whatsapp', 'linkedin'];

          // Determine which section is currently active
          let currentTab: TabType = 'facebook';
          for (const tab of tabs) {
            const el = document.getElementById(`section-${tab}`);
            if (el) {
              const top = el.getBoundingClientRect().top + pageY;
              if (triggerY >= top - 100) {
                currentTab = tab;
              }
            }
          }
          setActiveTab(currentTab);

          // Determine which sub-card is currently active
          const cardIds = [
            'facebook-ads',
            'facebook-page',
            'instagram-reels',
            'instagram-dm-funnel',
            'whatsapp-broadcast',
            'whatsapp-chatbot',
            'linkedin-b2b',
            'linkedin-carousels'
          ];

          for (let i = cardIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(`card-${cardIds[i]}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 320) {
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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (tabId: TabType) => {
    setActiveTab(tabId);
    const targetEl = document.getElementById(`section-${tabId}`);
    if (targetEl) {
      const yOffset = -140; // Clearance for navbar + sticky pill
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToCard = (cardId: string) => {
    setActiveCardId(cardId);
    const targetEl = document.getElementById(`card-${cardId}`);
    if (targetEl) {
      const yOffset = -140;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#faf9f6] relative z-10 w-full transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Sticky Top Floating Navigation Pill Bar */}
        <div className="sticky top-20 sm:top-24 z-40 pointer-events-none flex justify-center mb-10 sm:mb-14 py-2">
          <div className="pointer-events-auto inline-flex items-center p-1.5 sm:p-2 rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200/90 gap-1 sm:gap-2 max-w-full overflow-x-auto scrollbar-hide">

            {sectionsData.map((category, idx) => {
              const isCurrent = activeTab === category.id;
              const isPast = sectionsData.findIndex(s => s.id === activeTab) >= idx;

              return (
                <React.Fragment key={category.id}>
                  {/* Connecting Line between Tabs */}
                  {idx > 0 && (
                    <div className="hidden sm:block relative w-6 md:w-10 h-1 bg-slate-200/80 rounded-full overflow-hidden shrink-0">
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
                    onClick={() => scrollToSection(category.id)}
                    className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${isCurrent
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
        <div className="space-y-24 sm:space-y-36">
          {sectionsData.map((category) => (
            <div
              key={category.id}
              id={`section-${category.id}`}
              className="scroll-mt-36"
            >
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                {/* Left Column: Sticky alongside cards */}
                <div className="lg:col-span-3 lg:sticky lg:top-36 pt-2">
                  <div
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs"
                    style={{
                      backgroundColor: `${category.themeColor}15`,
                      borderColor: `${category.themeColor}30`,
                      color: category.themeColor,
                    }}
                  >
                    <category.icon className="w-3.5 h-3.5" />
                    <span>{category.label}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-tight">
                    {category.badge}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="space-y-3 border-l-2 border-slate-200/70 pl-3">
                    {category.subItems.map((sub) => {
                      const isSubSelected = activeCardId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => scrollToCard(sub.id)}
                          className="w-full text-left flex items-start gap-2.5 group transition-colors cursor-pointer py-1"
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
                            className={`text-sm sm:text-base leading-snug transition-colors ${isSubSelected
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
                <div className="lg:col-span-9 space-y-10 sm:space-y-14 min-w-0">
                  {category.subItems.map((sub) => (
                    <div
                      key={sub.id}
                      id={`card-${sub.id}`}
                      className="scroll-mt-36 bg-[#fffdfa] rounded-[24px] sm:rounded-[32px] border border-orange-200/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] p-5 sm:p-7 relative overflow-hidden"
                    >
                      {/* Main Heading */}
                      <h4 className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                        {sub.heading}
                      </h4>

                      {/* Interactive Diagram Canvas */}
                      <div className="relative rounded-2xl bg-gradient-to-br from-[#fffdfa] via-white to-slate-50/60 border border-slate-200/80 p-4 sm:p-6 mb-6 overflow-hidden shadow-xs">
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
                              <span className="text-lg">{sub.inputCard.flag}</span>
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

                            {/* Center Glowing Hub */}
                            <div
                              className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white scale-100 hover:scale-105 transition-transform p-3 shrink-0 mx-1"
                              style={{
                                background: `linear-gradient(135deg, ${category.themeColor} 0%, #7C3AED 50%, #FE8036 100%)`,
                                boxShadow: `0 8px 24px ${category.themeColor}40`
                              }}
                            >
                              {sub.hubIcon}
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
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {sub.outputCard.title}
                              </span>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-slate-200/60">
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
