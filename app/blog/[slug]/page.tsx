import React from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/blog/ShareBar';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Quote, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  Zap,
  Bookmark,
  Calendar,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] selection:bg-purple-500/20 selection:text-purple-900 relative">
      {/* Top Reading Progress Bar */}
      <ReadingProgressBar />

      <Navbar />
      
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-purple-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-24 right-1/4 w-[450px] h-[300px] bg-pink-400/10 rounded-full blur-[120px]" />
      </div>

      <article className="pt-28 sm:pt-36 pb-20 relative z-10">
        {/* Breadcrumbs & Category Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {/* Back button */}
          <div className="flex items-center justify-start mb-8">
            <Link 
              href="/#blog" 
              className="inline-flex items-center text-xs sm:text-sm font-bold text-slate-700 hover:text-[#7d36fa] transition-all duration-300 group px-4 py-2 rounded-full bg-white hover:bg-purple-50/80 border border-slate-200/90 hover:border-purple-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to all insights</span>
            </Link>
          </div>

          <div className="text-center">
            {/* Category Pill with Shimmering Glow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-200/80 text-[#7d36fa] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#f0449b] animate-pulse" />
              <span>{post.category}</span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-slate-900 tracking-tight mb-6 leading-[1.15]">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                {post.subtitle}
              </p>
            )}

            {/* Author & Publication Metadata Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600">
              {post.author && (
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-purple-300/80 shadow-xs bg-purple-100 flex items-center justify-center font-bold text-purple-700 shrink-0 ring-4 ring-purple-100/50">
                    {post.author.avatar ? (
                      <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{post.author.name[0]}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{post.author.name}</span>
                      <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">{post.author.role}</div>
                  </div>
                </div>
              )}

              <div className="hidden sm:block w-px h-6 bg-slate-200" />

              <div className="flex items-center gap-5 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span>{post.readTime}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  <span>{post.date}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Banner Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="p-2 sm:p-2.5 rounded-[36px] bg-gradient-to-b from-purple-200/60 via-pink-100/40 to-slate-200/80 shadow-2xl shadow-purple-950/10">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[28px] overflow-hidden group">
              <Image 
                src={post.image}
                alt={post.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/20">
                <BookOpen className="w-3.5 h-3.5 text-purple-300" />
                <span>Deep Dive Guide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body Container */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Key Takeaways Box */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="mb-14 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-purple-50/90 via-white to-pink-50/70 border border-purple-200/90 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-lg mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7d36fa] to-[#f0449b] flex items-center justify-center text-white shadow-md shadow-purple-500/25">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Key Strategic Takeaways</span>
              </div>

              <div className="space-y-4">
                {post.keyTakeaways.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3.5 text-sm sm:text-base text-slate-700 leading-snug p-2 rounded-xl hover:bg-white/80 transition-all duration-200 group"
                  >
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#7d36fa] transition-colors duration-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7d36fa] group-hover:text-white transition-colors duration-200" />
                    </div>
                    <span className="font-medium group-hover:text-slate-900 transition-colors duration-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Stats Highlights Grid */}
          {post.stats && post.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
              {post.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-purple-300 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center justify-between cursor-default"
                >
                  <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#7d36fa] via-[#a855f7] to-[#f0449b] bg-clip-text text-transparent tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold text-slate-900 mt-2 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  {stat.description && (
                    <span className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {stat.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Main Structured Sections */}
          <div className="space-y-14 text-slate-800">
            {post.sections && post.sections.map((section, sIdx) => (
              <section key={sIdx} className="space-y-6">
                {section.heading && (
                  <div className="pt-2">
                    <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[#7d36fa] to-[#f0449b] mb-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                      {section.heading}
                    </h2>
                    {section.subheading && (
                      <p className="text-sm sm:text-base font-semibold text-[#7d36fa] mt-1.5">
                        {section.subheading}
                      </p>
                    )}
                  </div>
                )}

                {section.paragraphs && section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-[17px] leading-[1.8] text-slate-700 font-normal">
                    {p}
                  </p>
                ))}

                {/* Callout Box */}
                {section.callout && (
                  <div className={`p-6 sm:p-7 rounded-2xl border my-6 relative overflow-hidden transition-all duration-300 ${
                    section.callout.type === 'quote'
                      ? 'bg-gradient-to-r from-purple-50/80 to-pink-50/50 border-purple-200 border-l-4 border-l-[#7d36fa] text-purple-950 font-serif italic text-lg sm:text-xl'
                      : section.callout.type === 'warning'
                      ? 'bg-amber-50/80 border-amber-200/80 border-l-4 border-l-amber-500 text-amber-950'
                      : 'bg-emerald-50/80 border-emerald-200/80 border-l-4 border-l-emerald-500 text-emerald-950'
                  }`}>
                    {section.callout.title && (
                      <div className="flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-wider mb-2.5 not-italic text-slate-900">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{section.callout.title}</span>
                      </div>
                    )}
                    <p className="leading-relaxed text-sm sm:text-base font-medium">
                      {section.callout.text}
                    </p>
                  </div>
                )}

                {/* Bullet Points */}
                {section.bullets && (
                  <div className="space-y-3.5 pl-1 my-5">
                    {section.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 text-base text-slate-700 leading-relaxed">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#7d36fa] to-[#f0449b] shrink-0 mt-2 shadow-xs" />
                        <div>{bullet}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checklist / Framework Steps */}
                {section.checklist && (
                  <div className="space-y-3.5 my-6">
                    {section.checklist.map((item, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="group p-4 sm:p-5 rounded-2xl bg-white hover:bg-purple-50/40 border border-slate-200/80 hover:border-purple-300 shadow-2xs hover:shadow-md hover:translate-x-1.5 transition-all duration-300 flex items-start gap-3.5 cursor-default"
                      >
                        <div className="w-7 h-7 rounded-xl bg-purple-100 text-[#7d36fa] group-hover:bg-[#7d36fa] group-hover:text-white group-hover:scale-105 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-all duration-300 shadow-xs">
                          {cIdx + 1}
                        </div>
                        <div className="text-sm sm:text-base text-slate-800 leading-snug font-medium">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Conclusion Section */}
          {post.conclusion && (
            <div className="mt-14 pt-10 border-t border-slate-200/90">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-[#7d36fa] text-xs font-bold uppercase tracking-wider mb-4">
                <Bookmark className="w-3.5 h-3.5 text-[#7d36fa]" />
                <span>Conclusion</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                {post.conclusion.title}
              </h3>
              <div className="space-y-4">
                {post.conclusion.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-base sm:text-lg leading-relaxed text-slate-700">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio Box */}
          {post.author && (
            <div className="my-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-300 shadow-md bg-purple-100 flex items-center justify-center font-bold text-xl text-purple-700 shrink-0">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{post.author.name[0]}</span>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-bold text-slate-900 text-base">{post.author.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">Author</span>
                </div>
                <p className="text-xs text-[#7d36fa] font-semibold">{post.author.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  Crafting strategic insights and actionable frameworks on autonomous marketing, generative media, and business growth.
                </p>
              </div>
            </div>
          )}

          {/* Social Share Bar */}
          <ShareBar title={post.title} />

          {/* In-Article Premium CTA Card */}
          {post.cta && (
            <div className="my-14 p-8 sm:p-12 rounded-[36px] bg-[#090b14] border border-white/10 text-white relative overflow-hidden shadow-2xl shadow-purple-950/40">
              {/* Background ambient subtle glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/25 blur-[100px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 blur-[100px] pointer-events-none rounded-full" />

              <div className="relative z-10 text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 mb-5 backdrop-blur-sm shadow-xs">
                  <Zap className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                  <span>Transform Your Business Today</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white leading-tight">
                  {post.cta.title}
                </h3>
                
                <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
                  {post.cta.description}
                </p>

                <Button 
                  asChild
                  size="lg"
                  className="rounded-full px-9 py-6 text-sm font-bold bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] text-white hover:opacity-95 shadow-[0_10px_35px_rgba(240,68,155,0.45)] hover:shadow-[0_15px_45px_rgba(240,68,155,0.6)] hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Link href={post.cta.buttonHref}>
                    <span>{post.cta.buttonText}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

        </div>
      </article>

      {/* Recommended Articles Section */}
      <section className="py-20 bg-slate-100/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7d36fa]">
                Continue Reading
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                More Insights from DhandaGrow
              </h2>
            </div>
            <Link 
              href="/#blog" 
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#7d36fa] flex items-center gap-1.5 transition-colors group"
            >
              <span>View all insights</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
              <Link 
                href={`/blog/${relatedPost.slug}`} 
                key={relatedPost.id} 
                className="group block bg-white rounded-3xl p-5 shadow-2xs border border-slate-200/80 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5">
                  <Image 
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#7d36fa] shadow-sm">
                    {relatedPost.category}
                  </div>
                </div>
                
                <div className="px-2">
                  <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span>{relatedPost.readTime}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{relatedPost.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#7d36fa] transition-colors line-clamp-2 leading-snug">
                    {relatedPost.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {relatedPost.excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#7d36fa] group-hover:translate-x-1 transition-transform">
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
