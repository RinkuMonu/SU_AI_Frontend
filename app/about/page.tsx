import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { companyProfile } from '@/data/about';
import { SectionConnector } from '@/components/about/SectionConnector';
import Image from 'next/image';
import Link from 'next/link';
import {
  Quote,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0e] text-slate-100 selection:bg-brand-purple/30 selection:text-white relative overflow-hidden font-sans">
      <Navbar />

      {/* Ambient Radial Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-gradient-to-tr from-orange-600/15 via-pink-600/15 to-purple-600/10 rounded-full blur-[170px]" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-[170px]" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/10 to-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* 1. TOP HERO SECTION: EMPOWERING CONTENT ON LEFT, TEAM IMAGE ON RIGHT */}
      <section id="our-team" className="relative w-full pt-28 pb-12 lg:pt-36 lg:pb-16 border-b border-white/10 overflow-hidden bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* LEFT COLUMN: FIRST CONTENT (EMPOWERING HEADING & DESCRIPTION ONLY) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.15]">
                Empowering Every Business to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
                  Grow Digitally
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-normal">
                {companyProfile.aboutUs.paragraphs[0]}
              </p>
            </div>

            {/* RIGHT COLUMN: TEAM IMAGE */}
            <div className="lg:col-span-6 w-full flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-2 sm:p-2.5 shadow-2xl w-full group">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/10] w-full bg-slate-900 shadow-inner">
                  <Image
                    src="/team-goa.webp"
                    alt="Seven Unique Leadership Team in Goa"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90 font-medium backdrop-blur-md bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10">
                    <span>Seven Unique Leadership Team</span>
                    <span className="text-pink-400 font-semibold">DhandaGrow AI</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 2. MAIN CONTENT BODY */}
      <div className="relative z-10 pt-4 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Connector from Hero Team Image (right 75%) to Director's Voice (left 22%) */}
        <SectionConnector
          startDesktop={75}
          endDesktop={22}
          startMobile={50}
          endMobile={50}
          height={96}
        />

        {/* 1. DIRECTOR’S VOICE (SIDE-BY-SIDE: CONTENT ON LEFT, IMAGE ON RIGHT) */}
        <section id="directors-voice" className="scroll-mt-28 relative">
          <div className="bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
              <Quote className="w-32 h-32 text-pink-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* SIDE 1: CONTENT COLUMN (Left on desktop - balanced equally with image height) */}
              <div className="lg:col-span-7 space-y-6 order-2 lg:order-1 flex flex-col justify-center">
                
                {/* Header Tag & Heading */}
                <div className="space-y-2 text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
                    <Quote className="w-4 h-4" />
                    <span>1. Director&apos;s Voice</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    {companyProfile.directorsVoice.subtitle}
                  </h2>

                  <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-pink-400">
                    Founder, Promoter &amp; Managing Director
                  </div>
                </div>

                {/* Direct Intro Line from Dinesh Kumar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-transparent border border-pink-500/30 text-white font-medium text-base sm:text-lg leading-relaxed shadow-lg backdrop-blur-sm text-left">
                  “Hi, I’m <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">Dinesh Kumar</span>, Founder, Promoter &amp; Managing Director of Sevenunique Tech Solutions Private Limited.”
                </div>

                {/* Quote Body - Single Continuous Paragraph */}
                <p className="text-slate-200/90 text-base sm:text-lg leading-relaxed border-l-2 border-pink-500/40 pl-5 sm:pl-7 italic font-normal text-left">
                  {companyProfile.directorsVoice.quote.join(" ")}
                </p>
              </div>

              {/* SIDE 2: IMAGE COLUMN (Right on desktop - Full Complete Uncropped Photo) */}
              <div className="lg:col-span-5 self-center order-1 lg:order-2 w-full flex justify-center">
                <div className="relative rounded-3xl overflow-hidden border border-pink-500/25 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent p-2 sm:p-2.5 shadow-2xl group max-w-sm sm:max-w-md w-full">
                  <div className="relative rounded-2xl overflow-hidden aspect-[2/3] w-full bg-slate-900/40">
                    <Image
                      src="/images/directors-voice.png"
                      alt="Dinesh Kumar - Founder, Promoter & Managing Director"
                      fill
                      unoptimized
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. Connector from Director's Voice (left 22%) to About Us (right 75%) */}
        <SectionConnector
          startDesktop={22}
          endDesktop={75}
          startMobile={50}
          endMobile={50}
          height={96}
        />

        {/* 2. ABOUT US (SIDE-BY-SIDE: CONTENT ON LEFT, TEAM.PNG IMAGE ON RIGHT) */}
        <section id="about-us" className="scroll-mt-28 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* SIDE 1: CONTENT COLUMN (Left on desktop) */}
            <div className="lg:col-span-7 space-y-4 text-left self-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span className="text-[#fc9a5d]">2.</span>
                <span>About Us</span>
              </h2>

              <div className="space-y-3 text-slate-300 text-base sm:text-lg leading-relaxed">
                <p>{companyProfile.aboutUs.paragraphs[1]}</p>
                <p>{companyProfile.aboutUs.paragraphs[2]}</p>
                <p>{companyProfile.aboutUs.paragraphs[3]}</p>
              </div>
            </div>

            {/* SIDE 2: IMAGE COLUMN (Right on desktop - Team.png) */}
            <div className="lg:col-span-5 w-full flex justify-center self-center">
              <div className="relative rounded-3xl overflow-hidden border border-orange-500/25 bg-gradient-to-b from-orange-500/10 via-pink-500/5 to-transparent p-2 sm:p-2.5 shadow-2xl group max-w-sm sm:max-w-md w-full">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square w-full bg-slate-900/60 shadow-inner">
                  <Image
                    src="/team.png"
                    alt="DhandaGrow AI Team"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Connector from About Us (right 75%) to Our Mission (left 25%) */}
        <SectionConnector
          startDesktop={75}
          endDesktop={25}
          startMobile={50}
          endMobile={50}
          height={96}
        />

        {/* 3. OUR MISSION (PHOTO ON ONE SIDE, CONTENT ON OTHER) */}
        <section id="mission" className="scroll-mt-28 bg-gradient-to-r from-emerald-950/40 via-emerald-950/20 to-white/[0.02] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* SIDE 1: PHOTO COLUMN */}
            <div className="lg:col-span-5 w-full flex justify-center self-center">
              <div className="relative rounded-3xl overflow-hidden border border-emerald-500/25 bg-black/60 p-2 sm:p-2.5 shadow-2xl group max-w-sm sm:max-w-md w-full">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full bg-slate-900 shadow-inner">
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
            <div className="lg:col-span-7 space-y-3.5 text-left self-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span className="text-emerald-400">3.</span>
                <span>Our Mission</span>
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

        {/* 4. Connector from Our Mission (left 25%) to Our Vision (right 75%) */}
        <SectionConnector
          startDesktop={25}
          endDesktop={75}
          startMobile={50}
          endMobile={50}
          height={96}
        />

        {/* 4. OUR VISION (SIDE-BY-SIDE: CONTENT ON ONE SIDE, PHOTO ON OTHER) */}
        <section id="vision" className="scroll-mt-28 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-surface border border-purple-500/20 rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* SIDE 1: CONTENT COLUMN */}
            <div className="lg:col-span-6 space-y-3.5 order-2 lg:order-1 text-left self-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span className="text-purple-400">4.</span>
                <span>Our Vision</span>
              </h2>

              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-400">
                A Digitally Empowered India
              </div>

              <p className="text-slate-200/90 text-base sm:text-lg leading-relaxed text-left font-normal">
                {companyProfile.vision.description}
              </p>
            </div>

            {/* SIDE 2: VIDEO COLUMN (Balanced Size) */}
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

        {/* 5. Connector from Our Vision (right 75%) to Partners Message (left 25%) */}
        <SectionConnector
          startDesktop={75}
          endDesktop={25}
          startMobile={50}
          endMobile={50}
          height={96}
        />

        {/* 5. A MESSAGE FROM OUR PARTNERS (PHOTO ON LEFT, CONTENT ON RIGHT) */}
        <section id="partners-message" className="scroll-mt-28 bg-gradient-to-r from-orange-950/30 via-pink-950/20 to-white/[0.02] border border-pink-500/20 rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">

            {/* SIDE 1: PARTNER PHOTO (Left on desktop - matched equally to content height) */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-pink-500/25 bg-black/60 p-2 sm:p-2.5 shadow-2xl group w-full max-w-sm sm:max-w-md lg:max-w-none h-full flex flex-col">
                <div className="relative rounded-2xl overflow-hidden w-full flex-1 aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto bg-slate-900 shadow-inner">
                  <Image
                    src="/partners.png"
                    alt="Dinesh Kumar & Rahul Prajapat - Partners at DhandaGrow AI"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5 text-xs text-white backdrop-blur-md bg-black/55 p-3 rounded-xl border border-white/10">
                    <span className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
                      Dinesh Kumar &amp; Rahul Prajapat
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Partners at DhandaGrow AI
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDE 2: CONTENT COLUMN (Right on desktop) */}
            <div className="lg:col-span-7 space-y-3.5 text-left flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span className="text-pink-400">5.</span>
                <span>A Message from Our Partners</span>
              </h2>

              {/* Narrative Content */}
              <div className="space-y-2.5 text-slate-200/90 text-sm sm:text-base leading-relaxed font-normal">
                {companyProfile.partnersMessage?.paragraphs?.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Closing Callout */}
              {companyProfile.partnersMessage?.closing && (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-transparent border border-pink-500/30 text-white font-semibold text-sm sm:text-base leading-snug shadow-lg backdrop-blur-sm">
                  “{companyProfile.partnersMessage.closing}”
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 6. Connector from Partners Message (left 25%) to Leadership Team (center 50%) */}
        <SectionConnector
          startDesktop={25}
          endDesktop={50}
          startMobile={50}
          endMobile={50}
          height={96}
        />

        {/* 6. MEET OUR LEADERSHIP TEAM (4-COLUMN HORIZONTAL GRID) */}
        {companyProfile.leadershipTeam && (
          <section id="leadership-team" className="scroll-mt-28 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="space-y-8 sm:space-y-10">
              
              {/* Header */}
              <div className="space-y-2.5 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-center">
                  {companyProfile.leadershipTeam.heading}
                </h2>
                {companyProfile.leadershipTeam.subtitle && (
                  <p className="text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] font-semibold">
                    {companyProfile.leadershipTeam.subtitle}
                  </p>
                )}
                {companyProfile.leadershipTeam.description && (
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {companyProfile.leadershipTeam.description}
                  </p>
                )}
              </div>

              {/* 4-Image Horizontal Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
                {companyProfile.leadershipTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-pink-500/40 bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] p-5 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1.5 group backdrop-blur-xl"
                  >
                    {/* Circle Avatar with White Background */}
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden bg-white border-4 border-white/20 shadow-xl mx-auto mb-4 group-hover:border-pink-500/50 group-hover:scale-105 transition-all duration-500 shrink-0">
                      <Image
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 150px, 180px"
                      />
                    </div>

                    {/* Member Details: Name & Role */}
                    <div className="pt-1 w-full flex flex-col items-center">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#fc9a5d] group-hover:via-[#f0449b] group-hover:to-[#be32ff] transition-all duration-300">
                        {member.name}
                      </h3>
                      <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-pink-300 bg-pink-500/10 border border-pink-500/20 max-w-full text-center">
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* 7. Connector from Leadership Team (center 50%) to Come Work With Us (center 50%) */}
        <SectionConnector
          startDesktop={50}
          endDesktop={50}
          startMobile={50}
          endMobile={50}
          height={96}
        />

        {/* COME WORK WITH US SECTION */}
        <section className="relative rounded-3xl overflow-hidden bg-[#faf7f2] border border-orange-200/50 p-8 sm:p-14 lg:p-20 shadow-2xl text-center">
          
          {/* Main Center Content */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center py-6 sm:py-10">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-slate-900 tracking-tight leading-tight mb-8">
              Come Work With Us
            </h2>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2.5 bg-[#f25116] hover:bg-[#d94109] text-white font-semibold text-base sm:text-lg px-8 sm:px-9 py-3.5 sm:py-4 rounded-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <span>Careers</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Floating Team Avatars & Speech Bubbles (Desktop & Tablet) */}
          {/* 1. Top Left: Avatar with 'Innovate with us...' */}
          <div className="hidden md:flex items-center gap-3 absolute top-8 sm:top-12 left-6 sm:left-12 lg:left-16 z-20">
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-white shadow-xl bg-amber-50 shrink-0">
              <Image
                src="/team/devika-chhipa.webp"
                alt="Innovate with us"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#fde9df] border border-orange-200/40 text-[#d9531e] font-medium text-xs lg:text-sm shadow-sm whitespace-nowrap">
              Innovate with us...
            </div>
          </div>

          {/* 2. Bottom Left: Avatar with 'Power to you!' */}
          <div className="hidden md:flex flex-col items-start gap-2 absolute bottom-6 sm:bottom-10 left-12 sm:left-24 lg:left-32 z-20">
            <div className="px-3.5 py-1.5 rounded-full bg-[#e8f1ff] border border-blue-200/50 text-[#2563eb] font-semibold text-xs lg:text-sm shadow-sm whitespace-nowrap ml-2">
              Power to you!
            </div>
            <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-white shadow-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shrink-0">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900">
                <Image
                  src="/team/gupta-vijay.webp"
                  alt="Power to you"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* 3. Top Right: Avatar */}
          <div className="hidden md:flex items-center absolute top-10 sm:top-14 right-8 sm:right-16 lg:right-24 z-20">
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-white shadow-xl bg-slate-100 shrink-0">
              <Image
                src="/team/rajya-sir.webp"
                alt="Team member"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* 4. Bottom Right: Avatar with 'Code the extraordinary...' */}
          <div className="hidden md:flex flex-col items-end gap-2 absolute bottom-6 sm:bottom-10 right-10 sm:right-20 lg:right-28 z-20">
            <div className="px-3.5 py-1.5 rounded-full bg-[#fde9df] border border-orange-200/40 text-[#d9531e] font-medium text-xs lg:text-sm shadow-sm whitespace-nowrap mr-2">
              Code the extraordinary...
            </div>
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-white shadow-xl bg-amber-50 shrink-0">
              <Image
                src="/team/deepak.webp"
                alt="Code the extraordinary"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Mobile Preview for Avatars */}
          <div className="flex md:hidden items-center justify-center gap-4 mt-6 flex-wrap">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-amber-50">
              <Image src="/team/devika-chhipa.webp" alt="Team" fill className="object-cover object-top" />
            </div>
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-indigo-500">
              <Image src="/team/gupta-vijay.webp" alt="Team" fill className="object-cover object-top" />
            </div>
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100">
              <Image src="/team/rajya-sir.webp" alt="Team" fill className="object-cover object-top" />
            </div>
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-amber-50">
              <Image src="/team/deepak.webp" alt="Team" fill className="object-cover object-top" />
            </div>
          </div>

        </section>

      </div>

      <Footer />
    </main>
  );
}
