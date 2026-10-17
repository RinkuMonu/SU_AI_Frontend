'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { 
  PartyPopper, 
  Calendar, 
  Flame, 
  Sparkles, 
  Clock, 
  Share2, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ShoppingBag, 
  BadgePercent, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  Bot, 
  TrendingUp, 
  Smartphone, 
  Heart, 
  Bookmark, 
  Crown, 
  ShieldCheck,
  Music,
  CheckCheck,
  Disc,
  Film
} from 'lucide-react';

interface FestivalPreset {
  id: string;
  name: string;
  emoji: string;
  date: string;
  daysBadge: string;
  tag: string;
  accentColor: string;
  themeGradient: string;
  bannerImage: string;
  businessName: string;
  city: string;
  category: string;
  offerBadge: string;
  headline: string;
  subheadline: string;
  hinglishCaption: string;
  hindiCaption: string;
  whatsappMessage: string;
  adMetrics: {
    roas: string;
    reach: string;
    ctr: string;
    conversions: string;
  };
  reelInfo: {
    title: string;
    music: string;
    hook: string;
    scenes: {
      scene_number: number;
      duration: string;
      visual: string;
      on_screen_text: string;
      voiceover: string;
    }[];
  };
}

const festivalPresets: FestivalPreset[] = [
  {
    id: 'diwali',
    name: 'Diwali Mahotsav',
    emoji: '🪔',
    date: '24 Oct 2026',
    daysBadge: '8 Days Left • High Demand',
    tag: 'Peak Festive Season',
    accentColor: '#f59e0b',
    themeGradient: 'from-amber-500 via-orange-500 to-rose-600',
    bannerImage: '/images/festivals/diwali.png',
    businessName: 'Shyamal & Kumkum Ethnic Wear',
    city: 'Jaipur, Rajasthan',
    category: '👗 Ethnic Apparel & Silks',
    offerBadge: 'FLAT 40% OFF',
    headline: 'Royal Ethnic Luxury Sale: Pure Banarasi Silk & Designer Outfits',
    subheadline: 'Handcrafted royal weaves, pure Banarasi silk sarees & festive celebration attire.',
    hinglishCaption: 'Iss Diwali sajayein apne parivaar ko shahi banarasi andaaz mein! 🪔 Shyamal & Kumkum ki exclusive Diwali Festive Sale shuru ho chuki hai — Flat 40% OFF pure Banarasi sarees aur designer ethnic wear par. Free festive gift hamper har purchase ke saath! 🎁 Showroom visit karein ya WhatsApp par direct order book karein! ✨👗',
    hindiCaption: 'शुभ दीपावली महासेल! 🪔 इस पावन त्यौहार पर अपने परिवार के लिए घर लाएं शाही बनारसी साड़ियां और डिज़ाइनर लहंगे फ्लैट 40% की विशेष छूट पर। आज ही व्हाट्सएप पर आर्डर बुक करें! 🪔✨',
    whatsappMessage: 'Namaste Ji! 🙏 Iss Diwali Shyamal & Kumkum Boutique laaya hai aapke liye exclusive VIP Festive Offer! 🪔\n\n✨ Flat 40% OFF on all Designer Sarees & Kurtas\n🎁 Free Silver Coin on orders above ₹4,999\n🚚 Express Fast Delivery in Jaipur\n\nUse Code: DIWALI40\nReply "SHOW CATALOGUE" to view designs instantly!',
    adMetrics: {
      roas: '5.8x',
      reach: '48,500+',
      ctr: '4.2%',
      conversions: '340+ Orders'
    },
    reelInfo: {
      title: 'Diwali Festive Glamour & Ethnic Collection',
      music: 'Festive Dhol & Traditional Shehnai Beats • Trending Audio',
      hook: 'Kya aapne apni Diwali shopping complete ki? 🪔',
      scenes: [
        {
          scene_number: 1,
          duration: '0-5s',
          visual: 'Warm glowing earthen diyas with golden sparkles & festive entrance',
          on_screen_text: 'Iss Diwali Chamkein Sabse Khaas! ✨',
          voiceover: 'Iss Deepavali, sajayein apne aap ko shahi Banarasi andaaz mein.'
        },
        {
          scene_number: 2,
          duration: '5-12s',
          visual: 'Royal model in purple Banarasi silk saree twirling with festive jewelry',
          on_screen_text: 'Pure Banarasi Silks • Flat 40% OFF 👗',
          voiceover: 'Pure handcrafted silk collection aur designer festive outfits par Flat 40% OFF.'
        },
        {
          scene_number: 3,
          duration: '12-20s',
          visual: 'Happy festive boutique shopping bags & festive celebration greeting',
          on_screen_text: 'Tap To Order via WhatsApp 🛍️',
          voiceover: 'Aaj hi WhatsApp karein aur paayein special Diwali discount coupon!'
        }
      ]
    }
  },
  {
    id: 'navratri',
    name: 'Navratri Utsav',
    emoji: '💃',
    date: '21 Sep - 03 Oct',
    daysBadge: '15 Days Left • Garba Season',
    tag: '9 Days of Celebration',
    accentColor: '#e11d48',
    themeGradient: 'from-rose-500 via-pink-600 to-amber-500',
    bannerImage: '/images/festivals/navratri.png',
    businessName: 'Maa Durga Garba & Chaniya Choli',
    city: 'Ahmedabad, Gujarat',
    category: '💃 Ethnic Wear & Chaniya Choli',
    offerBadge: 'FLAT 30% OFF',
    headline: 'Shubh Navratri Mahotsav: 9 Days of Dandiya Beats & Festive Collection',
    subheadline: 'Handcrafted authentic mirror-work Chaniya Cholis, traditional Kedias & Garba jewellery.',
    hinglishCaption: 'Navratri ke 9 din chamkein sabse khaas! 💃 Maa Durga Garba Collection laaya hai authentic mirror-work Chaniya Choli aur Kedia outfits par Flat 30% OFF. Free Dandiya sticks har order ke saath! 🌸 Showroom visit karein ya WhatsApp par direct order book karein! Shubh Navratri! ✨👗',
    hindiCaption: 'शुभ नवरात्रि! 🌸 माँ दुर्गा के पावन नौ दिनों के अवसर पर चनिया चोली और डांडिया परिधानों पर पाएं 30% की विशेष छूट। आज ही आर्डर करें! 💃✨',
    whatsappMessage: 'Shubh Navratri! 🌸 Maa Durga Festive Collection laaya hai aapke liye special 9-day Garba offers!\n\n💃 Flat 30% OFF on Designer Chaniya Choli\n🎁 Free Dandiya Sticks with every order\n⚡ Same Day Delivery in Ahmedabad\n\nCode: NAVRATRI30\nReply "ORDER" to get festive collection!',
    adMetrics: {
      roas: '5.5x',
      reach: '52,000+',
      ctr: '4.8%',
      conversions: '380+ Orders'
    },
    reelInfo: {
      title: 'Navratri Garba Beats & Festive Fashion',
      music: 'Dandiya Raas High Energy Dholak Mix',
      hook: 'Kya aapka Garba look ready hai? 💃',
      scenes: [
        {
          scene_number: 1,
          duration: '0-5s',
          visual: 'Sacred Navratri Kalash and glowing earthen diyas with rhythmic garba dholak',
          on_screen_text: 'Shubh Navratri Aagman! 🌸✨',
          voiceover: 'Maa Durga ke aashirwaad se chamkein har Garba night.'
        },
        {
          scene_number: 2,
          duration: '5-12s',
          visual: 'Garba dancers twirling in colourful mirror-work traditional Chaniya Choli',
          on_screen_text: 'Authentic Chaniya Choli • Flat 30% OFF 💃',
          voiceover: 'Pure Kutchi mirror-work aur traditional Kedias par Flat 30 percent off.'
        },
        {
          scene_number: 3,
          duration: '12-20s',
          visual: 'Dandiya sticks celebration and festive shopping orders packed for dispatch',
          on_screen_text: 'Free Dandiya Sticks with Every Order! 🎁',
          voiceover: 'Aaj hi WhatsApp par message karein aur festive gift paayein!'
        }
      ]
    }
  },
  {
    id: 'holi',
    name: 'Holi Celebration',
    emoji: '🎨',
    date: '14 Mar 2027',
    daysBadge: '14 Days Advance Setup',
    tag: 'Spring Festival',
    accentColor: '#ec4899',
    themeGradient: 'from-pink-500 via-rose-500 to-amber-500',
    bannerImage: '/images/festivals/holi.png',
    businessName: 'Mithai Mahal & Festive Hampers',
    city: 'Indore, MP',
    category: '🥘 Sweets & Organic Hampers',
    offerBadge: 'FLAT 35% OFF',
    headline: 'Holi Celebration Mega Sale: Pure Kaju Gujiya & Organic Gulal Hampers',
    subheadline: 'Handcrafted pure desi ghee sweets, thandai packs & luxury organic herbal colors.',
    hinglishCaption: 'Rangon ke tyohar mein mithas gholein! 🎨 Pure desi ghee ki crispy Kaju Gujiya, Kesar Thandai aur toxic-free Herbal Gulal gift hampers par Flat 35% OFF. Limited festive pre-orders open now! WhatsApp par message karein aur fresh delivery schedule karein! 🌈🥟',
    hindiCaption: 'रंगों का महापर्व होली! 🎨 शुद्ध देसी घी की खस्ता गुजिया और हर्बल गुलाल के स्पेशल गिफ्ट बॉक्स पर पाएं 35% की विशेष छूट। आज ही व्हाट्सएप पर प्री-आर्डर बुक करें! 🌈✨',
    whatsappMessage: 'Holi Aayi Re! 🎨 Mithai Mahal lekar aaya hai aapke parivaar ke liye Shuddh Desi Ghee Gujiya aur Herbal Gulal Hampers!\n\n🌈 Flat 35% Pre-Order Discount\n🥛 Free Kesar Thandai Bottle on orders above ₹999\n⚡ Fresh Home Delivery on Holi Eve\n\nCoupon: HOLIRANG\nReply "ORDER" to get fresh sweets delivered!',
    adMetrics: {
      roas: '4.9x',
      reach: '36,200+',
      ctr: '3.9%',
      conversions: '280+ Orders'
    },
    reelInfo: {
      title: 'Holi Colors, Gujiya & Sweet Celebration',
      music: 'Holi Folk Dholak Fusion • Trending Track',
      hook: 'Mithas bina kaisa Holi ka celebration? 🎨',
      scenes: [
        {
          scene_number: 1,
          duration: '0-5s',
          visual: 'Vibrant organic pink and turquoise gulal explosion in cinematic slow motion',
          on_screen_text: 'Bura Na Mano Holi Hai! 🎨✨',
          voiceover: 'Rangon ke tyohar par gholein pure mithas Mithai Mahal ke saath.'
        },
        {
          scene_number: 2,
          duration: '5-12s',
          visual: 'Crisp golden Gujiya breaking open showing rich mawa and dry fruits',
          on_screen_text: 'Pure Desi Ghee Gujiya • 35% Pre-Book OFF 🥟',
          voiceover: 'Shuddh desi ghee mawa gujiya aur organic gulal ke special gift boxes.'
        },
        {
          scene_number: 3,
          duration: '12-20s',
          visual: 'Festive gift boxes with colorful ribbons ready for swift delivery',
          on_screen_text: 'Pre-Order Now on WhatsApp 📲',
          voiceover: 'Ghar baithe fresh delivery book karein abhi WhatsApp par!'
        }
      ]
    }
  },
  {
    id: 'dhanteras',
    name: 'Dhanteras & Navratri Gold',
    emoji: '🪙',
    date: '3 Oct 2026',
    daysBadge: 'Pre-Bookings Active',
    tag: 'Auspicious Days',
    accentColor: '#eab308',
    themeGradient: 'from-amber-400 via-yellow-500 to-emerald-600',
    bannerImage: '/images/festivals/dhanteras.png',
    businessName: 'Rang Mahals Fine Jewellery',
    city: 'Surat, Gujarat',
    category: '💍 Fine Jewellery & Gold',
    offerBadge: '0% MAKING CHARGES',
    headline: 'Royal Heritage Jewellery Collection: 22KT Gold & Kundan',
    subheadline: 'Exquisite 22KT BIS Hallmarked gold, certified diamonds & Kundan Polki collection.',
    hinglishCaption: 'Shubh Dhanteras par ghar laayein lakshmi aur barkat! 🪙 Rang Mahals ke pure 22KT Gold aur Bridal Polki collection par paayein ZERO Making Charges aur flat discount diamond rates par! ✨ Free Gold Coin offer for first 50 showroom bookings. Book slot now! 💍🪙',
    hindiCaption: 'शुभ धनतेरस व नवरात्रि! 🪙 100% बीआईएस हॉलमार्क 22KT गोल्ड एवं कुंदन ज्वेलरी पर पाएं 0% मेकिंग चार्ज। सीमित अवधि ऑफर। आज ही शोरूम विज़िट बुक करें! 💍✨',
    whatsappMessage: 'Shubh Dhanteras Greetings! 🪙 Rang Mahals Jewellers offers exclusive festival privileges:\n\n✨ 0% Making Charges on Gold & Kundan\n💎 Flat 20% OFF on Certified Diamonds\n🪙 Free 1gm Gold Coin on purchases above ₹1 Lakh\n\nVisit Showroom or reply "CALL" for VIP video catalogue!',
    adMetrics: {
      roas: '6.4x',
      reach: '62,000+',
      ctr: '5.1%',
      conversions: '190+ Bookings'
    },
    reelInfo: {
      title: 'Dhanteras Shubh Shagun & Gold Jewellery',
      music: 'Devotional Classical Sitar & Flute Ambient',
      hook: 'Iss Dhanteras ghar laayein Shubh Samriddhi! 🪙',
      scenes: [
        {
          scene_number: 1,
          duration: '0-5s',
          visual: 'Traditional brass bell and kalash surrounded by glowing golden diyas',
          on_screen_text: 'Shubh Shagun Ki Shuruaat 🪙✨',
          voiceover: 'Iss Dhanteras apne ghar laayein pure 22KT gold ki pavitra barkat.'
        },
        {
          scene_number: 2,
          duration: '5-12s',
          visual: 'Opulent gold and ruby necklace showcased on royal emerald velvet display',
          on_screen_text: '0% Making Charges on Hallmarked Gold 💍',
          voiceover: 'BIS 916 hallmarked bridal collection par 0 percent making charges.'
        },
        {
          scene_number: 3,
          duration: '12-20s',
          visual: 'Jewellery showroom VIP suite with warm lighting and certificates',
          on_screen_text: 'Book Showroom VIP Slot Today! 🌟',
          voiceover: 'Exclusive shagun offer ke liye showroom visit slot book karein.'
        }
      ]
    }
  },
  {
    id: 'eid',
    name: 'Eid Mubarak Festive',
    emoji: '🌙',
    date: '10 Apr 2027',
    daysBadge: 'Advance Campaign',
    tag: 'Celebration Season',
    accentColor: '#10b981',
    themeGradient: 'from-emerald-500 via-teal-600 to-indigo-700',
    bannerImage: '/images/eid-festive-banner.jpg',
    businessName: 'Zaraab Perfumes & Couture',
    city: 'Lucknow, UP',
    category: '🌿 Luxury Attars & Outfits',
    offerBadge: 'UP TO 50% OFF',
    headline: 'Eid Mubarak Royal Offers: Artisanal Oudh, Attars & Luxury Festive Couture',
    subheadline: 'Pure handcrafted fragrance oils, regal sherwanis & embroidered festive kurtas.',
    hinglishCaption: 'Eid ki khushiyan banayein aur bhi yaadgaar! 🌙 Zaraab ke pure luxury attars aur festive kurtas par paayein Up To 50% OFF. Pure rose, oudh aur amber fragrances ke festive hampers available. Free gift box packing! Order on WhatsApp now. ✨🌙',
    hindiCaption: 'ईद मुबारक की दिली मुबारकबाद! 🌙 ज़राब के खास शाही अत्तर और लक्ज़री कुर्तों पर पाएं 50% तक की छूट। आज ही व्हाट्सएप पर अपना फेस्टिव गिफ्ट पैक बुक करें! 🌙✨',
    whatsappMessage: 'Eid Mubarak Mubarakbaad! 🌙 Zaraab brings you the finest royal festive collection:\n\n✨ Up to 50% OFF on Luxury Oudh & Attars\n🎁 Free Premium Velvet Gift Box\n🚚 Express Fast Dispatch across India\n\nCoupon: EIDMUBARAK\nTap link to order festive gift sets!',
    adMetrics: {
      roas: '5.1x',
      reach: '41,000+',
      ctr: '4.6%',
      conversions: '310+ Orders'
    },
    reelInfo: {
      title: 'Eid Mubarak Royal Fragrance & Attar Showcase',
      music: 'Sufi Ambient Melody & Persian Strings',
      hook: 'Eid ki khushbu mein mehkein aap aur aapka ghar! 🌙',
      scenes: [
        {
          scene_number: 1,
          duration: '0-5s',
          visual: 'Golden lanterns hanging with glowing crescent moon and warm ambient lights',
          on_screen_text: 'Eid Mubarak! 🌙✨',
          voiceover: 'Eid ke mukaddas mauqe par mehkaayein apne rishton ko.'
        },
        {
          scene_number: 2,
          duration: '5-12s',
          visual: 'Ornate crystal attar bottle releasing golden fragrance mist',
          on_screen_text: 'Artisanal Oudh & Perfumes • Up to 50% OFF 💎',
          voiceover: 'Pure royal oudh aur authentic attars par Up to 50 percent off.'
        },
        {
          scene_number: 3,
          duration: '12-20s',
          visual: 'Luxury green velvet box with golden engraving and festive ribbon',
          on_screen_text: 'Send Eid Gift Hamper on WhatsApp 🎁',
          voiceover: 'Apne doston aur rishtedaaron ko bheinjiye luxury Eid gift hamper.'
        }
      ]
    }
  }
];

const annualCalendar = [
  { month: 'Jan', festivals: [{ name: 'Makar Sankranti / Pongal', date: 'Jan 14', tag: 'Harvest' }, { name: 'Republic Day Sale', date: 'Jan 26', tag: 'National' }] },
  { month: 'Feb', festivals: [{ name: 'Maha Shivratri', date: 'Feb 26', tag: 'Devotional' }, { name: "Valentine's Week", date: 'Feb 7-14', tag: 'Retail' }] },
  { month: 'Mar', festivals: [{ name: 'Holi Rangotsav', date: 'Mar 14', tag: 'Colors' }, { name: 'Gudi Padwa / Ugadi', date: 'Mar 30', tag: 'New Year' }] },
  { month: 'Apr', festivals: [{ name: 'Baisakhi & Tamil New Year', date: 'Apr 14', tag: 'Regional' }, { name: 'Akshaya Tritiya Gold', date: 'Apr 28', tag: 'Gold Buying' }] },
  { month: 'May', festivals: [{ name: "Mother's Day Promo", date: 'May 10', tag: 'Gifting' }, { name: 'Buddha Purnima', date: 'May 22', tag: 'Festival' }] },
  { month: 'Jun', festivals: [{ name: 'Eid ul-Adha (Bakrid)', date: 'Jun 16', tag: 'Celebration' }, { name: 'Father’s Day Sale', date: 'Jun 21', tag: 'Gifting' }] },
  { month: 'Jul', festivals: [{ name: 'Jagannath Rath Yatra', date: 'Jul 7', tag: 'Spiritual' }, { name: 'Guru Purnima', date: 'Jul 21', tag: 'Traditional' }] },
  { month: 'Aug', festivals: [{ name: 'Independence Day', date: 'Aug 15', tag: 'National' }, { name: 'Raksha Bandhan', date: 'Aug 19', tag: 'Siblings & Gifts' }, { name: 'Janmashtami', date: 'Aug 26', tag: 'Devotional' }] },
  { month: 'Sep', festivals: [{ name: 'Ganesh Chaturthi (10 Days)', date: 'Sep 7', tag: 'Mega Utsav' }, { name: 'Onam Harvest', date: 'Sep 15', tag: 'Harvest' }] },
  { month: 'Oct', festivals: [{ name: 'Navratri & Durga Puja (9 Days)', date: 'Oct 3', tag: 'Garba & Ethnic' }, { name: 'Dussehra Mega Offers', date: 'Oct 12', tag: 'Victory' }, { name: 'Karwa Chauth Specials', date: 'Oct 20', tag: 'Boutique & Salon' }, { name: 'Dhanteras & Diwali', date: 'Oct 29', tag: 'Peak Shopping' }] },
  { month: 'Nov', festivals: [{ name: 'Bhai Dooj', date: 'Nov 1', tag: 'Gifting' }, { name: 'Chhath Puja', date: 'Nov 7', tag: 'Regional' }, { name: 'Guru Nanak Jayanti', date: 'Nov 15', tag: 'Spiritual' }] },
  { month: 'Dec', festivals: [{ name: 'Wedding Season Peak', date: 'Dec 1-20', tag: 'Bridal & Gold' }, { name: 'Christmas Celebration', date: 'Dec 25', tag: 'Winter Sale' }, { name: 'New Year Bash', date: 'Dec 31', tag: 'Party' }] }
];

export default function FestivalEnginePage() {
  const [selectedFestivalId, setSelectedFestivalId] = useState('diwali');
  const [activeChannelTab, setActiveChannelTab] = useState<'post' | 'reel' | 'whatsapp' | 'ad'>('post');
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [activeReelScene, setActiveReelScene] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const selectedPreset = festivalPresets.find(f => f.id === selectedFestivalId) || festivalPresets[0];

  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#FFFDF7] text-slate-900 font-sans selection:bg-amber-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        {/* Festive Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border border-amber-200 mb-6 mx-auto shadow-sm">
            <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
            <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Indian Festival Engine</span>
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">100+ Festivals</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-[1.1]">
            Never miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600">Festival</span> again.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium max-w-3xl mx-auto">
            AI automatically tracks all 100+ Indian festivals, generates complete 10-day multi-channel marketing campaigns (Social Posts, Reels, WhatsApp Blasts & Meta Ads), and prepares your store before the festive shopping rush begins.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold shadow-xl shadow-orange-500/25 border-0 flex items-center gap-2 transition-transform hover:scale-105" asChild>
              <Link href="/login/user">
                Launch Festival Engine <PartyPopper className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-8 text-base rounded-full border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold" asChild>
              <a href="#interactive-simulator">
                Test Festival Demo <Sparkles className="w-4 h-4 ml-2 text-amber-500" />
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pre-loaded 100+ Indian festivals</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 10-Day Automated Campaign Blueprint</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp + Instagram + Ads Ready</span>
          </div>
        </div>

        {/* Masonry Mockup with Authentic Festive Posters */}
        <div className="mt-16 md:mt-24 relative z-10 w-full max-w-6xl mx-auto">
          {/* Connecting Festive Gradient Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-rose-300 to-purple-300 rounded-full opacity-60 -z-10" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 items-center">
            
            {/* Card 1: Navratri */}
            <div 
              className="bg-[#121422] p-2.5 rounded-2xl shadow-2xl border border-white/10 rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group cursor-pointer text-left"
              onClick={() => setSelectedFestivalId('navratri')}
            >
              <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden relative">
                <img 
                  src="/images/festivals/navratri.png" 
                  alt="Navratri Festival" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-[#121422]/40 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white font-extrabold text-base md:text-lg leading-tight">Navratri</h3>
                  <p className="text-slate-300 text-[11px] font-medium mt-0.5">2026-09-21 · -25 days away</p>
                </div>
              </div>
              <div className="pt-2.5">
                <Button className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5" asChild>
                  <Link href="/login/user">
                    <Sparkles className="w-3.5 h-3.5" /> Generate Content
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 2: Diwali */}
            <div 
              className="bg-[#121422] p-2.5 rounded-2xl shadow-2xl border border-amber-500/30 translate-y-4 rotate-[1deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group cursor-pointer text-left"
              onClick={() => setSelectedFestivalId('diwali')}
            >
              <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden relative">
                <img 
                  src="/images/festivals/diwali.png" 
                  alt="Diwali Festival" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-[#121422]/40 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white font-extrabold text-base md:text-lg leading-tight">Diwali</h3>
                  <p className="text-slate-300 text-[11px] font-medium mt-0.5">2026-10-09 · -7 days away</p>
                </div>
              </div>
              <div className="pt-2.5">
                <Button className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-1.5" asChild>
                  <Link href="/login/user">
                    <Sparkles className="w-3.5 h-3.5" /> Generate Content
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 3: Dhanteras */}
            <div 
              className="bg-[#121422] p-2.5 rounded-2xl shadow-2xl border border-white/10 -translate-y-2 rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group cursor-pointer text-left"
              onClick={() => setSelectedFestivalId('dhanteras')}
            >
              <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden relative">
                <img 
                  src="/images/festivals/dhanteras.png" 
                  alt="Dhanteras Festival" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-[#121422]/40 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white font-extrabold text-base md:text-lg leading-tight">Dhanteras</h3>
                  <p className="text-slate-300 text-[11px] font-medium mt-0.5">2026-10-08 · -8 days away</p>
                </div>
              </div>
              <div className="pt-2.5">
                <Button className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5" asChild>
                  <Link href="/login/user">
                    <Sparkles className="w-3.5 h-3.5" /> Generate Content
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 4: Holi */}
            <div 
              className="bg-[#121422] p-2.5 rounded-2xl shadow-2xl border border-white/10 translate-y-3 rotate-[3deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group cursor-pointer text-left"
              onClick={() => setSelectedFestivalId('holi')}
            >
              <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden relative">
                <img 
                  src="/images/festivals/holi.png" 
                  alt="Holi Festival" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-[#121422]/40 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white font-extrabold text-base md:text-lg leading-tight">Holi</h3>
                  <p className="text-slate-300 text-[11px] font-medium mt-0.5">2027-03-14 · 14 days away</p>
                </div>
              </div>
              <div className="pt-2.5">
                <Button className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-1.5" asChild>
                  <Link href="/login/user">
                    <Sparkles className="w-3.5 h-3.5" /> Generate Content
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Festival Campaign Simulator Section */}
      <section id="interactive-simulator" className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              Live Interactive Campaign Simulator
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Pick a Festival. Watch AI Build Your Complete 10-Day Campaign.
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-600">
              In your actual DhandaGrow dashboard, AI monitors the Indian calendar, prepares banners, reels, ad copy, and WhatsApp messages, and schedules them with zero stress.
            </p>
          </div>

          {/* Festival Selection Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {festivalPresets.map((fest) => {
              const isSelected = fest.id === selectedFestivalId;
              return (
                <button
                  key={fest.id}
                  onClick={() => {
                    setSelectedFestivalId(fest.id);
                    setActiveReelScene(0);
                    setIsPlayingReel(false);
                  }}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 border ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{fest.emoji}</span>
                  <div className="text-left">
                    <span className="block leading-tight">{fest.name}</span>
                    <span className={`text-[10px] font-medium ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                      {fest.date}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 10-Day Campaign Blueprint Tracker */}
          <div className="mb-12 p-6 rounded-3xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                  Automated Funnel Plan
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedPreset.name} 10-Day Marketing Blueprint
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 w-max">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedPreset.daysBadge}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Day 1</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Teaser Poster</p>
                <p className="text-[11px] text-slate-500 mt-1">Announce dates & build festive anticipation</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Day 3</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Catalogue Drop</p>
                <p className="text-[11px] text-slate-500 mt-1">Pre-order discount for early shoppers</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Day 5</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">VIP WhatsApp</p>
                <p className="text-[11px] text-slate-500 mt-1">Direct offer broadcast to existing customers</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Day 8</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Countdown Reel</p>
                <p className="text-[11px] text-slate-500 mt-1">High-energy festive reel with fast delivery hook</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Day 10</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Warm Greetings</p>
                <p className="text-[11px] text-slate-500 mt-1">Heartfelt wishes card with brand logo</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
              </div>
            </div>
          </div>

          {/* Multi-Channel Asset Showcase Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Channel Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
              <button
                onClick={() => setActiveChannelTab('post')}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeChannelTab === 'post'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📸</span> Social Media Poster
              </button>
              <button
                onClick={() => setActiveChannelTab('reel')}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeChannelTab === 'reel'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎬</span> AI Festive Reel
              </button>
              <button
                onClick={() => setActiveChannelTab('whatsapp')}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeChannelTab === 'whatsapp'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💬</span> WhatsApp Broadcast
              </button>
              <button
                onClick={() => setActiveChannelTab('ad')}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeChannelTab === 'ad'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📢</span> Meta & Google Ad
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 md:p-10">
              
              {/* 1. SOCIAL POST VIEW */}
              {activeChannelTab === 'post' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 relative group">
                      <div className="relative aspect-square">
                        <img 
                          src={selectedPreset.bannerImage} 
                          alt={selectedPreset.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-amber-300/30">
                          {selectedPreset.offerBadge}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">{selectedPreset.businessName}</p>
                          <p className="text-[10px] text-slate-400">{selectedPreset.city}</p>
                        </div>
                        <Button size="sm" className="h-8 px-3 text-xs bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-lg border-0" asChild>
                          <Link href="/login/user">Download HD</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                          AI-Generated Festive Copy
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{selectedPreset.category}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                        {selectedPreset.headline}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 font-medium">
                        {selectedPreset.subheadline}
                      </p>
                    </div>

                    {/* Hinglish Caption Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">Hinglish Caption (Ready to Post):</span>
                        <button
                          onClick={() => handleCopyCaption(selectedPreset.hinglishCaption)}
                          className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopied ? 'Copied!' : 'Copy Caption'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {selectedPreset.hinglishCaption}
                      </p>
                    </div>

                    {/* Hindi Caption Card */}
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                      <span className="text-xs font-bold text-amber-900 block mb-1">Hindi Shubhkaamnaye:</span>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {selectedPreset.hindiCaption}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-4 items-center">
                      <Button className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold" asChild>
                        <Link href="/login/user">
                          Schedule This Post <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <span className="text-xs text-slate-500 font-medium">
                        Auto-syncs with Instagram & Facebook Pages
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. REEL VIEW */}
              {activeChannelTab === 'reel' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex justify-center">
                    {/* Realistic Reel Player Mockup */}
                    <div className="w-[280px] sm:w-[300px] aspect-[9/16] rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 text-white">
                      {/* Background Visual */}
                      <img 
                        src={selectedPreset.bannerImage} 
                        alt="Reel scene background" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

                      {/* Reel Top Bar */}
                      <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          <Film className="w-3.5 h-3.5 text-rose-400" />
                          <span>Reels • Scene {activeReelScene + 1}/3</span>
                        </div>
                        <button 
                          onClick={() => setIsPlayingReel(!isPlayingReel)}
                          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30"
                        >
                          {isPlayingReel ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* On-Screen Text Overlay */}
                      <div className="relative z-10 my-auto text-center px-3">
                        <div className="inline-block bg-gradient-to-r from-orange-500 to-rose-600 text-white font-black text-sm px-3.5 py-1.5 rounded-xl shadow-lg mb-2">
                          {selectedPreset.reelInfo.scenes[activeReelScene].on_screen_text}
                        </div>
                        <p className="text-[11px] text-slate-200 drop-shadow-md">
                          Voiceover: &ldquo;{selectedPreset.reelInfo.scenes[activeReelScene].voiceover}&rdquo;
                        </p>
                      </div>

                      {/* Bottom Info & Audio */}
                      <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-500 font-bold flex items-center justify-center text-xs">
                            DG
                          </div>
                          <span className="text-xs font-bold">{selectedPreset.businessName}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg">
                          <Music className="w-3 h-3 text-pink-400 animate-spin" />
                          <span className="truncate">{selectedPreset.reelInfo.music}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-1 pt-1">
                          {selectedPreset.reelInfo.scenes.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveReelScene(idx)}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                idx === activeReelScene ? 'bg-orange-400' : 'bg-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div>
                      <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        AI-Generated Festive Reel Script
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 mt-2">
                        {selectedPreset.reelInfo.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5 text-orange-500" />
                        Audio: {selectedPreset.reelInfo.music}
                      </p>
                    </div>

                    {/* Scene Breakdown */}
                    <div className="space-y-3">
                      {selectedPreset.reelInfo.scenes.map((scene, idx) => (
                        <div
                          key={scene.scene_number}
                          onClick={() => setActiveReelScene(idx)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            activeReelScene === idx 
                              ? 'bg-rose-50/70 border-rose-300 shadow-md' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              Scene {scene.scene_number} ({scene.duration})
                            </span>
                            <span className="text-[11px] font-semibold text-rose-600">
                              {activeReelScene === idx ? '▶ Active Preview' : 'Click to preview'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800">
                            Caption: &ldquo;{scene.on_screen_text}&rdquo;
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            Voiceover: {scene.voiceover}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap gap-4 items-center">
                      <Button className="h-12 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold" asChild>
                        <Link href="/login/user">
                          Render Reel in AI Studio <Sparkles className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <span className="text-xs text-slate-500">
                        Exports with auto-synced Hindi voiceover & festive background audio
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. WHATSAPP BROADCAST VIEW */}
              {activeChannelTab === 'whatsapp' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex justify-center">
                    {/* Realistic WhatsApp Chat Box */}
                    <div className="w-full max-w-sm rounded-3xl bg-[#EFEAE2] border-4 border-slate-300 shadow-xl overflow-hidden text-left">
                      {/* WhatsApp Header */}
                      <div className="bg-[#075E54] text-white p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm">
                          {selectedPreset.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold leading-tight">{selectedPreset.businessName}</p>
                          <p className="text-[10px] text-emerald-200">Official Business Broadcast</p>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-4 space-y-3 min-h-[320px] flex flex-col justify-end bg-[radial-gradient(#d4cbbe_1px,transparent_1px)] [background-size:16px_16px]">
                        <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] border border-slate-200">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 relative">
                            <img src={selectedPreset.bannerImage} alt="WhatsApp Offer" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                              Offer Poster
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                            {selectedPreset.whatsappMessage}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-slate-400">
                            <span>10:30 AM</span>
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="bg-slate-100 p-2 text-center text-[10px] text-slate-500 font-medium border-t border-slate-200">
                        1-Click Send via DhandaGrow WhatsApp Engine
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        High Conversion WhatsApp Broadcast
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 mt-2">
                        Reach 1,000+ Customers Directly on Their Phones
                      </h3>
                      <p className="text-sm text-slate-600 mt-2">
                        Skip social media algorithms. Send festive greetings along with personal voucher codes directly to your customer contact list in seconds.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-900">Broadcast Template Message:</span>
                        <button
                          onClick={() => handleCopyCaption(selectedPreset.whatsappMessage)}
                          className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopied ? 'Copied!' : 'Copy Template'}
                        </button>
                      </div>
                      <pre className="text-xs text-slate-800 whitespace-pre-line font-sans leading-relaxed">
                        {selectedPreset.whatsappMessage}
                      </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500">Average Open Rate</p>
                        <p className="text-lg font-black text-slate-900 mt-0.5">94% within 2 Hours</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500">Automated Reply Bot</p>
                        <p className="text-lg font-black text-slate-900 mt-0.5">Instant Product Links</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold" asChild>
                        <Link href="/login/user">
                          Send WhatsApp Campaign <Send className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. META & GOOGLE AD VIEW */}
              {activeChannelTab === 'ad' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex justify-center">
                    {/* Realistic Ad Card Mockup */}
                    <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-left">
                      <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center justify-center text-xs">
                            {selectedPreset.emoji}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{selectedPreset.businessName}</p>
                            <p className="text-[10px] text-slate-400">Sponsored • Festive Special</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Meta Ad</span>
                      </div>

                      <div className="p-3 text-xs text-slate-700">
                        {selectedPreset.headline}
                      </div>

                      <div className="relative aspect-square bg-slate-900">
                        <img src={selectedPreset.bannerImage} alt="Ad creative" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {selectedPreset.offerBadge}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Festive Special</p>
                          <p className="text-xs font-bold text-slate-900">{selectedPreset.city}</p>
                        </div>
                        <span className="text-xs font-bold bg-blue-600 text-white px-3.5 py-1.5 rounded-lg shadow-sm">
                          Shop Now
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        High ROAS Festive Ad Creatives
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 mt-2">
                        Turn Festive Excitement into Paying Footfall & Orders
                      </h3>
                      <p className="text-sm text-slate-600 mt-2">
                        DhandaGrow automatically creates high-converting ad copy, selects targeted local audience hooks, and crafts compelling festival promotional banners.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                        <span className="text-[10px] font-bold text-amber-800 uppercase">Target ROAS</span>
                        <p className="text-xl font-black text-amber-950 mt-1">{selectedPreset.adMetrics.roas}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                        <span className="text-[10px] font-bold text-blue-800 uppercase">Est. Reach</span>
                        <p className="text-xl font-black text-blue-950 mt-1">{selectedPreset.adMetrics.reach}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase">Click-Through</span>
                        <p className="text-xl font-black text-emerald-950 mt-1">{selectedPreset.adMetrics.ctr}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                        <span className="text-[10px] font-bold text-purple-800 uppercase">Avg. Orders</span>
                        <p className="text-xl font-black text-purple-950 mt-1">{selectedPreset.adMetrics.conversions}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold" asChild>
                        <Link href="/login/user">
                          Launch Meta Ad Campaign <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* 12-Month Indian Festive Calendar Matrix */}
      <section className="py-24 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              Annual Indian Retail & Festival Calendar
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Pre-Loaded With 100+ Festivals Across All 12 Months
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-600">
              National celebrations, harvest festivals, state observances, and religious moments are pre-configured. Your brand is always ready weeks before everyone else.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {annualCalendar.map((item) => (
              <div key={item.month} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-base font-black text-slate-900">{item.month}</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    {item.festivals.length} Occasions
                  </span>
                </div>
                <div className="space-y-2.5">
                  {item.festivals.map((f, i) => (
                    <div key={i} className="text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{f.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{f.date}</span>
                      </div>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium inline-block mt-0.5">
                        {f.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Benefits Features Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-amber-50/50 border border-amber-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-orange-500">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Advance Countdown Engine</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                AI notifies you 14 days in advance before every festival. You review, approve, and schedule full campaigns while competitors are still scrambling last minute.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-rose-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Branded Templates</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                No generic greeting clipart. The engine embeds your real business name, logo, phone number, address, and product offers directly onto 4K festive posters.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-purple-500">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1-Click Multi-Channel Sync</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Send festive wishes and sale offers straight to your customer WhatsApp broadcast list, schedule Instagram reels, and launch Meta Ads in just one tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="festival-engine" />
      <FeatureExpansionSections feature="festival-engine" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#FFFDF7] to-amber-50/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-6">
            <Flame className="w-4 h-4 text-orange-600" />
            Join 10,000+ Indian Retailers & Brands
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Never lose festival sales to last-minute rush again.
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Prepare your store for the upcoming Indian festival season with AI-powered campaigns that build customer loyalty and multiply your festive revenue.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold shadow-xl border-0" asChild>
              <Link href="/login/user">
                Start Festival Engine Now <PartyPopper className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
