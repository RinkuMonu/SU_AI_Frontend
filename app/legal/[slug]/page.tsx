import { notFound } from 'next/navigation';
import { legalData } from '@/data/legal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export function generateStaticParams() {
  return legalData.policies.map((policy) => ({
    slug: policy.slug,
  }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const policy = legalData.policies.find((p) => p.slug === resolvedParams.slug);

  if (!policy) {
    notFound();
  }

  const otherPolicies = legalData.policies.filter(
    (p, index, self) => 
      p.slug !== policy.slug && 
      self.findIndex(t => t.slug === p.slug) === index &&
      p.slug !== 'terms-and-conditions'
  );

  return (
    <main className="min-h-screen bg-[#0a0b0e] text-slate-100 selection:bg-brand-purple/30 selection:text-white relative">
      <Navbar />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Quick legal tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {legalData.policies
              .filter((p, i, arr) => arr.findIndex(t => t.slug === p.slug) === i && p.slug !== 'terms-and-conditions')
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/legal/${p.slug}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    p.slug === policy.slug
                      ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {p.title.replace('DhandaGrow AI ', '')}
                </Link>
              ))}
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Legal Document
            </span>
            {policy.lastUpdated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Effective & Last Updated: {policy.lastUpdated}
              </span>
            )}
            {policy.poweredBy && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5" /> Powered by {policy.poweredBy}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {policy.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl font-normal">
            {policy.content.introduction}
          </p>

          {policy.publicationNote && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <span><strong>Note:</strong> {policy.publicationNote}</span>
            </div>
          )}
        </div>

        {/* Main Grid: Sidebar Table of Contents + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Sidebar Table of Contents */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 order-2 lg:order-1">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
                <FileText className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Table of Contents</h3>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {policy.content.sections.length} sections
                </span>
              </div>

              <div className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {policy.content.sections.map((sec, idx) => (
                  <a
                    key={idx}
                    href={`#section-${sec.number || idx + 1}`}
                    className="group flex items-start gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all leading-snug"
                  >
                    <span className="font-mono text-pink-400 shrink-0 font-medium group-hover:text-pink-300">
                      {String(sec.number || idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="line-clamp-1">{sec.title}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Company / Contact Details Card */}
            {policy.company && (
              <div className="bg-gradient-to-br from-purple-950/30 via-white/[0.02] to-white/[0.01] border border-purple-500/20 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 mb-3 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-purple-400" /> Company Contact
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="font-semibold text-white text-sm">
                    {policy.company.name}
                  </div>
                  <div className="flex items-start gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{policy.company.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                    <a href={`mailto:${policy.company.email}`} className="text-purple-300 hover:underline">
                      {policy.company.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                    <a href={`tel:${policy.company.mobile}`} className="text-purple-300 hover:underline">
                      {policy.company.mobile}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                    <a href={policy.website || 'https://dhandagrow.com'} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline flex items-center gap-1">
                      {policy.website || 'https://dhandagrow.com'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Right: Sections Body */}
          <article className="lg:col-span-8 space-y-6 order-1 lg:order-2">
            {policy.content.sections.map((section, index) => {
              const secNumber = section.number || index + 1;
              return (
                <section
                  key={index}
                  id={`section-${secNumber}`}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md hover:border-white/20 transition-all scroll-mt-24 shadow-lg group"
                >
                  <div className="flex items-baseline gap-3 mb-4 border-b border-white/5 pb-3">
                    <span className="font-mono text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                      § {String(secNumber).padStart(2, '0')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-pink-300 transition-colors">
                      {section.title}
                    </h2>
                  </div>

                  {section.content && (
                    <div className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-3 font-normal">
                      {section.content}
                    </div>
                  )}

                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-2.5 mt-4 text-slate-300 text-sm sm:text-base">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 leading-relaxed">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shrink-0 shadow-sm" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}

            {/* Closing Note Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent border border-white/10 text-center text-slate-400 text-xs sm:text-sm">
              <p className="font-medium text-slate-300 mb-1">End of Terms and Conditions</p>
              <p>For questions or assistance regarding these terms, contact <a href="mailto:support@dhandagrow.com" className="text-pink-400 hover:underline">support@dhandagrow.com</a></p>
            </div>
          </article>
        </div>

      </div>

      <Footer />
    </main>
  );
}
