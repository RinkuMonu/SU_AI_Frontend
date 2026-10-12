import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { companyProfile } from '@/data/about';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Target,
  Eye,
  Quote,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  CheckCircle2,
  Share2,
  Video,
  Calendar,
  MessageSquare,
  TrendingUp,
  Cpu,
  Store,
  Compass,
  BookmarkCheck,
  Award,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export default function AboutPage() {
  const navSections = [
    { label: "Our Team", href: "#our-team" },
    { label: "1. Director's Voice", href: "#directors-voice" },
    { label: "2. Our Mission", href: "#mission" },
    { label: "3. About Us", href: "#about-us" },
    { label: "4. Our Vision", href: "#vision" },
    { label: "5. Core Belief", href: "#core-belief" },
    { label: "6. Our Taglines", href: "#taglines" },
    { label: "7. Company Info", href: "#company-info" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b0e] text-slate-100 selection:bg-brand-purple/30 selection:text-white relative overflow-hidden font-sans">
      <Navbar />

      {/* Ambient Radial Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-gradient-to-tr from-orange-600/15 via-pink-600/15 to-purple-600/10 rounded-full blur-[170px]" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-[170px]" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/10 to-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* 1. TOP TEAM IMAGE (CLEAN, NO TEXT OVERLAY ON IMAGE) */}
      <section id="our-team" className="relative w-full pt-28 pb-0 overflow-hidden bg-black/40 border-b border-white/10">
        <div className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[660px]">
          <Image
            src="/team-goa.webp"
            alt="Seven Unique Leadership Team in Goa"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>


      {/* 2. MAIN CONTENT BODY */}
      <div className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* ABOUT DHANDAGROW AI HERO OVERVIEW */}
        <section className="text-center max-w-4xl mx-auto space-y-7 animate-in fade-in duration-700">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 border border-pink-500/25 backdrop-blur-md shadow-lg shadow-pink-500/10">
            <Sparkles className="w-4 h-4 text-[#fc9a5d] animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
              {companyProfile.taglines.primary}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Empowering Every Business to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
              Grow Digitally
            </span>
          </h2>

          {/* Summary Lead */}
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {companyProfile.aboutUs.paragraphs[0]}
          </p>

          {/* Tagline Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {companyProfile.taglines.supporting}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-medium flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#fc9a5d]" />
              {companyProfile.taglines.slogan.replace('DhandaGrow AI — ', '')}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-medium flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#f0449b]" />
              {companyProfile.taglines.brandPromise}
            </span>
          </div>

          {/* Call to Actions */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-xl shadow-pink-500/25 transition-all">
                Start Growing Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="#directors-voice">
              <Button variant="outline" className="h-12 px-6 rounded-full border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-medium">
                Read Director&apos;s Voice
              </Button>
            </a>
          </div>

          {/* Quick Jump Subnav */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs">
              {navSections.map((sec, i) => (
                <a
                  key={i}
                  href={sec.href}
                  className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                >
                  {sec.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 1. DIRECTOR’S VOICE (SIDE-BY-SIDE: CONTENT ON LEFT, IMAGE ON RIGHT) */}
        <section id="directors-voice" className="scroll-mt-28 relative">
          <div className="bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
              <Quote className="w-32 h-32 text-pink-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

              {/* SIDE 1: CONTENT COLUMN (Left on desktop) */}
              <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg">
                    <Quote className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      1. {companyProfile.directorsVoice.heading}
                    </h3>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {companyProfile.directorsVoice.subtitle}
                    </h2>
                  </div>
                </div>

                {/* Quote Body - Single Continuous Paragraph */}
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed border-l-2 border-pink-500/40 pl-6 sm:pl-8 italic font-normal">
                  {companyProfile.directorsVoice.quote.join(" ")}
                </p>
              </div>

              {/* SIDE 2: IMAGE COLUMN (Right on desktop) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 self-start order-1 lg:order-2">
                <div className="relative rounded-3xl overflow-hidden border border-pink-500/25 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent p-2 sm:p-2.5 shadow-2xl group">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] w-full bg-slate-900">
                    <Image
                      src="/images/directors-voice.png"
                      alt="Leadership Team - DhandaGrow AI"
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. OUR MISSION (PHOTO ON ONE SIDE, CONTENT ON OTHER) */}
        <section id="mission" className="scroll-mt-28 bg-gradient-to-r from-emerald-950/40 via-emerald-950/20 to-white/[0.02] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* SIDE 1: PHOTO COLUMN */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/25 bg-black/60 p-2 shadow-2xl group">
                <div className="relative rounded-xl overflow-hidden aspect-[3/2] w-full bg-slate-900">
                  <Image
                    src="/our_mission.png"
                    alt="DhandaGrow AI Team - Our Mission"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* SIDE 2: CONTENT COLUMN */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Target className="w-4 h-4" />
                <span>2. Our Mission</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Mission
              </h2>

              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400">
                Har Dukaan Ko Digital, Har Business Ko Growth
              </div>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                {companyProfile.mission.description}
              </p>
            </div>

          </div>
        </section>

        {/* 3. ABOUT US */}
        <section id="about-us" className="scroll-mt-28 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fc9a5d]">
                <Store className="w-4 h-4" />
                <span>3. About Us</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {companyProfile.aboutUs.heading}
              </h2>

              <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
                <p>{companyProfile.aboutUs.paragraphs[1]}</p>
                <p>{companyProfile.aboutUs.paragraphs[2]}</p>
                <p>{companyProfile.aboutUs.paragraphs[3]}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 border border-white/10 text-[#fc9a5d] font-semibold text-base sm:text-lg flex items-center gap-3">
                <Sparkles className="w-5 h-5 shrink-0 text-[#f0449b]" />
                <span>{companyProfile.taglines.slogan}</span>
              </div>
            </div>

            {/* Capability Feature Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Share2,
                  title: "AI Social Posts",
                  desc: "Create professional social media posts & graphics in seconds",
                  color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400"
                },
                {
                  icon: Video,
                  title: "Reels & Creatives",
                  desc: "Generate viral reels and product showcases effortlessly",
                  color: "from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-400"
                },
                {
                  icon: Calendar,
                  title: "Content Planning",
                  desc: "Automate scheduling and posting workflows across channels",
                  color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400"
                },
                {
                  icon: MessageSquare,
                  title: "Customer Engagement",
                  desc: "Streamline conversations and grow audience loyalty 24/7",
                  color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
                }
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all hover:bg-white/[0.05] group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center mb-3 shadow-sm`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-pink-300 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. OUR VISION (SIDE-BY-SIDE: CONTENT ON ONE SIDE, PHOTO ON OTHER) */}
        <section id="vision" className="scroll-mt-28 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-surface border border-purple-500/20 rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* SIDE 1: CONTENT COLUMN */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Eye className="w-4 h-4" />
                <span>4. Our Vision</span>
              </div>

              {/* Only Our Vision Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 text-left">
                <span>Our Vision</span>
              </h2>

              {/* Vision Narrative from PDF */}
              <p className="text-slate-200/90 text-base sm:text-lg leading-relaxed text-left font-normal">
                {companyProfile.vision.description}
              </p>
            </div>

            {/* SIDE 2: VIDEO COLUMN (Thoda Chota, Balanced Size) */}
            <div className="lg:col-span-6 self-center order-1 lg:order-2 w-full flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-black/80 p-2 sm:p-2.5 shadow-2xl shadow-purple-950/50 w-full max-w-xl group">
                <div
                  className="relative rounded-2xl overflow-hidden aspect-[736/480] w-full bg-black shadow-inner [container-type:size]"
                >
                  <video
                    src="/our_vision.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 object-cover pointer-events-none w-[65.22%] h-[153.33%]"
                    style={{
                      width: '100cqh',
                      height: '100cqw',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. OUR CORE BELIEF */}
        <section id="core-belief" className="scroll-mt-28 bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-white/[0.01] border border-amber-500/20 rounded-3xl p-8 sm:p-12 backdrop-blur-xl text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>5. {companyProfile.coreBelief.heading}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {companyProfile.coreBelief.subtitle}
          </h3>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            {companyProfile.coreBelief.description}
          </p>
        </section>

        {/* 6. OUR TAGLINES */}
        <section id="taglines" className="scroll-mt-28 space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>6. Our Taglines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Voice of DhandaGrow AI
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Our core identity, brand commitments, and guiding philosophy summarized in words that resonate with every Indian business owner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Primary Tagline */}
            <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/5 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/50 transition-all shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-[#fc9a5d] mb-2 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4" /> Primary Tagline
              </div>
              <h4 className="text-xl font-bold text-white mb-2 leading-snug">
                “{companyProfile.taglines.primary}”
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our heartbeat promise: ensuring every local store and merchant becomes a digital powerhouse.
              </p>
            </div>

            {/* Supporting Tagline */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Supporting Tagline
              </div>
              <h4 className="text-xl font-bold text-white mb-2 leading-snug">
                “{companyProfile.taglines.supporting}”
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The product framework: AI intelligence + seamless automated workflows = rapid compounding growth.
              </p>
            </div>

            {/* Brand Promise */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Brand Promise
              </div>
              <h4 className="text-xl font-bold text-white mb-2 leading-snug">
                “{companyProfile.taglines.brandPromise}”
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your reliable technological co-pilot standing beside you on every step of your digital journey.
              </p>
            </div>

          </div>

          {/* Slogan Banner */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center backdrop-blur-xl">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
              National Brand Slogan
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
              “{companyProfile.taglines.slogan}”
            </div>
          </div>
        </section>

        {/* 7. COMPANY PROFILE DETAILS & CONTACT CARD */}
        <section id="company-info" className="scroll-mt-28 bg-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" /> 7. Company Information
              </div>
              <h3 className="text-2xl font-extrabold text-white">{companyProfile.name}</h3>
              <p className="text-sm text-slate-400">Powered by {companyProfile.poweredBy}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${companyProfile.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                {companyProfile.email}
              </a>
              <a
                href={`tel:${companyProfile.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                {companyProfile.phone}
              </a>
              <a
                href={companyProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                {companyProfile.website}
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{companyProfile.address}</span>
            </div>
            <div className="font-mono text-slate-500">
              © 2026 DhandaGrow AI • Sevenunique Tech Solutions Private Limited
            </div>
          </div>
        </section>

        {/* 8. FINAL CALL TO ACTION */}
        <section className="bg-gradient-to-r from-[#fc9a5d]/10 via-[#f0449b]/15 to-[#be32ff]/10 border border-pink-500/25 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Grow Your Business with AI?
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Join thousands of shopkeepers and small businesses who are automating their digital marketing, social media, and customer growth today.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-base tracking-wide shadow-2xl shadow-pink-500/30 transition-all cursor-pointer">
                  Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
