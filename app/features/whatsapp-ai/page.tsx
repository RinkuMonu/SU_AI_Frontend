'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import {
  Sparkles,
  Upload,
  Send,
  Copy,
  Check,
  Phone,
  CheckCheck,
  MessageCircle,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Bot,
  ShoppingBag,
  Receipt,
  Languages,
  BarChart,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Flame,
  Crown
} from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#25D366" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  phone: string;
  tag: string;
}

const recentAIContentItems: ContentItem[] = [
  {
    id: 'luxury-interior',
    title: "True luxury isn't about...",
    imageUrl: '/images/ai-marketing-workspace.jpg',
    caption: `True luxury isn't about shouting for attention. It's found in the quiet confidence of clean lines, muted tones, and uncompromising quality.\n\nWe designed this piece for those who appreciate the beauty of restraint. Stripped of the unnecessary, what remains is pure, functional art that seamlessly elevates your everyday routine.\n\nSometimes, the most powerful statement you can make is saying nothing at all.\n\nTap the link in our bio to explore the minimalist collection. 🕊️`,
    phone: '919876543210',
    tag: 'Minimalist Interior'
  },
  {
    id: 'royal-ethnic',
    title: 'Where modern luxury meets...',
    imageUrl: '/images/royal-ethnic-banner.jpg',
    caption: `✨ Royal Ethnic Festive Sale is Live!\n\nCelebrate every special occasion in pure Banarasi silk sarees and designer boutique lehengas with FLAT 40% OFF.\n\n🎁 Complimentary silver coin on all orders above ₹4,999.\n🚚 Same day express dispatch with insured transit.\n\nTap below to explore our wedding catalogue or reply with 'ORDER' to book a live video shopping consultation! 👗✨`,
    phone: '919829012345',
    tag: 'Bridal & Ethnic'
  },
  {
    id: 'fine-jewellery',
    title: 'In a world that never stops...',
    imageUrl: '/images/jewellery-festive-banner.jpg',
    caption: `🪙 Shubh Dhanteras & Festive Privileges from Rang Mahals Fine Jewellery!\n\nBring home prosperity and blessings with our 100% BIS Hallmarked 22KT Gold & Kundan Jewellery.\n\n✨ 0% Making Charges on Gold & Kundan\n💎 Flat 20% OFF on Certified Diamonds\n🪙 Free 1gm Gold Coin on purchases above ₹1,00,000\n\nShowroom appointments are filling fast. Reply 'BOOK' to reserve your VIP consultation lounge! 💍🪙`,
    phone: '919879555666',
    tag: 'Gold Jewellery'
  },
  {
    id: 'dining-feast',
    title: 'The countdown has begun...',
    imageUrl: '/images/food-feast-banner.jpg',
    caption: `🍛 Weekend Family Feast Special from Dawat-e-Khaas!\n\nIndulge in authentic slow-cooked Hyderabadi Dum Biryani and tender Galouti Kebabs prepared in clay handis with pure desi ghee.\n\n🔥 Flat 25% OFF on all family dine-in & takeaway packs\n🥘 Complimentary Gulab Jamun dessert with every biryani pot\n\nReply 'MENU' to get the full WhatsApp menu and place your order instantly in 30 seconds! 🤤🍗`,
    phone: '919811223344',
    tag: 'Royal Dining'
  }
];

export default function WhatsAppAIPage() {
  const [selectedItem, setSelectedItem] = useState<ContentItem>(recentAIContentItems[0]);
  const [targetPhone, setTargetPhone] = useState(recentAIContentItems[0].phone);
  const [messageText, setMessageText] = useState(recentAIContentItems[0].caption);
  const [mediaUrlInput, setMediaUrlInput] = useState(
    '/uploads/temp/gen_ea9ea59d3461.jpg'
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleSelect = (item: ContentItem) => {
    setSelectedItem(item);
    setTargetPhone(item.phone);
    setMessageText(item.caption);
    setMediaUrlInput(item.imageUrl);
  };

  const handleAddChip = (chip: string) => {
    setMessageText((prev) => `${prev} ${chip}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] text-white font-sans selection:bg-emerald-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Emerald Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
            <WhatsAppIcon className="w-4 h-4" />
            <span>Official WhatsApp Business Cloud API</span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
              Meta Approved
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Run your entire business on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#25D366] to-teal-300">
              WhatsApp.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium mb-10 max-w-3xl mx-auto">
            Transform your phone number into an automated 24/7 sales engine. Send AI-generated creative broadcasts, share product catalogues, answer questions instantly, and collect UPI payments directly inside WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold shadow-xl shadow-emerald-500/25 border-0 flex items-center gap-2 transition-transform hover:scale-105" asChild>
              <Link href="/login/user">
                <WhatsAppIcon className="w-5 h-5" /> Launch WhatsApp Assistant
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-8 text-base rounded-full border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white font-semibold" asChild>
              <a href="#interactive-whatsapp-studio">
                Test Live Chat Studio <Sparkles className="w-4 h-4 ml-2 text-emerald-400" />
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 98% Message Open Rate</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Broadcast to 1,000+ Contacts</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Product Catalogue & UPI Checkout</span>
          </div>
        </div>
      </section>

      {/* Interactive WhatsApp Assistant Studio (Exact Match to Project Dashboard) */}
      <section id="interactive-whatsapp-studio" className="py-16 md:py-24 bg-[#0E131F] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Live Dashboard Simulator
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Interactive WhatsApp Marketing Studio
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400">
              Experience the exact WhatsApp publisher tool from your DhandaGrow AI dashboard. Select AI posts, customize offers, and preview recipient messages in real time.
            </p>
          </div>

          {/* Main 2-Column Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: Content Selection & Message Configuration */}
            <div className="lg:col-span-7 space-y-6">

              {/* Card 1: Select AI Post or Upload Media */}
              <div className="bg-[#121726] rounded-2xl border border-slate-800 shadow-xl p-5 md:p-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    <div>
                      <h3 className="text-white text-base font-bold">Select AI Post or Upload Media</h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Pick an AI-generated post from your library or upload an image banner from your computer.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 shrink-0"
                    asChild
                  >
                    <Link href="/login/user">
                      <Upload className="w-3.5 h-3.5 mr-1" /> Custom Upload
                    </Link>
                  </Button>
                </div>

                {/* Horizontal Scroll of Recent AI Content Items */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">Recent AI Content Items:</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {recentAIContentItems.map((item) => {
                      const isSelected = selectedItem.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`min-w-[130px] max-w-[130px] p-2 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 shrink-0 ${isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-[1.02]'
                              : 'bg-[#181F33] border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                            }`}
                        >
                          <div className="w-full h-24 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center relative">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                            <span className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-xs text-[9px] text-slate-200 px-1 py-0.5 rounded text-center truncate">
                              {item.tag}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium truncate w-full text-center">
                            {item.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Horizontal indicator slider */}
                  <div className="flex items-center justify-between text-slate-500 text-xs pt-1 px-1">
                    <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-white" />
                    <div className="h-1 flex-1 mx-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-emerald-500 rounded-full" />
                    </div>
                    <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white" />
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-1.5 mt-5">
                  <label className="text-xs text-slate-300 font-semibold block">Media Image URL / Banner</label>
                  <input
                    type="text"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="/uploads/temp/gen_ea9ea59d3461.jpg"
                    className="w-full border border-slate-800 bg-[#161C2E] text-slate-200 text-xs font-mono h-10 px-3 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Card 2: Message & Recipient Details */}
              <div className="bg-[#121726] rounded-2xl border border-slate-800 shadow-xl p-5 md:p-6 text-left">
                <div className="pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-white text-base font-bold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-400" /> Message & Recipient Information
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Customize the caption message, emoji highlights, and target WhatsApp number.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Target Number */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-300 font-semibold">Target WhatsApp Phone Number</label>
                      <span className="text-[11px] text-slate-500">Include country code (e.g., 919876543210)</span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="tel"
                        value={targetPhone}
                        onChange={(e) => setTargetPhone(e.target.value)}
                        placeholder="e.g. 919876543210 or leave blank to choose in WhatsApp"
                        className="w-full border border-slate-800 bg-[#161C2E] text-white pl-9 h-10 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Caption / Message Text */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-300 font-semibold">WhatsApp Message Text</label>
                      <div className="flex gap-1.5">
                        {['🔥 Offer', '✨ New', '🛍️ Shop', '📞 Contact'].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleAddChip(chip)}
                            className="text-[10px] font-semibold bg-[#1A2238] hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={5}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your WhatsApp post message or offer description..."
                      className="w-full rounded-lg border border-slate-800 bg-[#161C2E] p-3 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-sans leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-500">
                      Tip: Use *bold* for emphasis, _italic_ for styling, and emojis to increase engagement!
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 border-0"
                      asChild
                    >
                      <Link href="/login/user">
                        <WhatsAppIcon className="h-5 w-5" /> Share on WhatsApp Web / App
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 h-12 rounded-xl text-xs font-semibold px-4 flex items-center justify-center gap-2 bg-[#121726]"
                      asChild
                    >
                      <Link href="/login/user">
                        <Send className="w-4 h-4" /> Send via Cloud API
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-12 w-12 rounded-xl border border-slate-800 bg-[#161C2E] text-slate-400 hover:text-white flex items-center justify-center shrink-0"
                      title="Copy Message Text"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: WhatsApp Live Chat Preview (Exact Mobile Frame) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-2 px-1 text-left">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <WhatsAppIcon className="w-4 h-4" /> WhatsApp Live Chat Preview
                  </span>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                    Recipient View
                  </span>
                </div>

                {/* Smartphone Frame Mockup */}
                <div className="rounded-[32px] border-4 border-slate-700 bg-[#0c1317] shadow-2xl overflow-hidden max-w-[340px] sm:max-w-[360px] mx-auto text-left">
                  {/* Phone Speaker Notch */}
                  <div className="bg-[#1f2c34] h-6 flex items-center justify-center">
                    <div className="w-16 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* WhatsApp Chat Header */}
                  <div className="bg-[#1f2c34] px-3.5 py-2.5 flex items-center justify-between text-white border-b border-slate-700/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-black text-xs shadow text-white">
                        DG
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">Your Business Store</p>
                        <p className="text-[10px] text-emerald-400 font-medium">Online</p>
                      </div>
                    </div>
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>

                  {/* WhatsApp Chat Body with Authentic Wallpaper Texture */}
                  <div className="p-3.5 space-y-3 min-h-[460px] max-h-[520px] overflow-y-auto bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] bg-[#0b141a] flex flex-col justify-start custom-scrollbar">
                    {/* Timestamp Pill */}
                    <div className="text-center text-[10px] font-semibold text-slate-400 bg-[#182229] w-max mx-auto px-2.5 py-0.5 rounded-md shadow-sm">
                      TODAY
                    </div>

                    {/* Chat Bubble (Green WhatsApp Style) */}
                    <div className="self-end bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[94%] shadow-md border border-[#005c4b]/50">
                      {/* Media Image */}
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 relative bg-slate-900">
                        <img
                          src={selectedItem.imageUrl}
                          alt="WhatsApp media preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Caption Text with Multi-Paragraph Rendering */}
                      <p className="text-xs text-slate-100 whitespace-pre-line leading-relaxed font-sans">
                        {messageText}
                      </p>

                      {/* Time & Double Blue Checkmark */}
                      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-emerald-200">
                        <span>12:30 PM</span>
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Chat Footer / Input Mockup */}
                  <div className="bg-[#1f2c34] p-2 flex items-center gap-2 border-t border-slate-700/50">
                    <div className="flex-1 bg-[#2a3942] h-9 rounded-full px-4 flex items-center text-slate-400 text-xs">
                      Type a message
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0 shadow">
                      <Send className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Pillars (Matching Project Capabilities) */}
      <section className="py-24 bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Everything happens right inside the chat.
            </h2>
            <p className="text-slate-400 text-base md:text-lg mt-3">
              Indian shoppers drop off when forced to download an app or browse slow websites. Keep conversations natural, responsive, and transactional on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="p-6 rounded-2xl bg-[#121726] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Native Catalogue Sync</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect your product catalogue. AI dynamically pulls photos, size variants, and prices into elegant interactive WhatsApp cards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121726] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant UPI & QR Checkout</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate Razorpay, PhonePe, Paytm, or WhatsApp Pay links in seconds. Customers pay without ever leaving the conversation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121726] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multilingual Indian AI</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Understands Hindi, Hinglish, Marathi, Gujarati, Tamil, and English. The AI replies naturally in the customer&apos;s preferred language.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121726] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1-Click Broadcast Blasts</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Send festival discounts, new arrival alerts, and flash sales to thousands of opted-in customers using the official Cloud API.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="whatsapp-ai" />
      <FeatureExpansionSections feature="whatsapp-ai" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0E131F] to-[#0A0D14] text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-6 border border-emerald-500/20">
            <WhatsAppIcon className="w-4 h-4" />
            <span>Join 10,000+ DhandaGrow WhatsApp Businesses</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Upgrade your business to WhatsApp Business AI.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Stop replying to enquiries manually. Let AI automate marketing broadcasts, customer support, and order bookings 24/7.
          </p>
          <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold shadow-xl border-0" asChild>
            <Link href="/login/user">
              Connect Your WhatsApp Number <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
