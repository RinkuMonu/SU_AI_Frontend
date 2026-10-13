import React from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/blog/ShareBar';
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
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] selection:bg-purple-500/20 selection:text-purple-900">
      <Navbar />
      
      <article className="pt-28 sm:pt-36 pb-20">
        {/* Breadcrumbs & Category Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {/* Back button shifted to left-hand side */}
          <div className="flex items-center justify-start mb-8">
            <Link 
              href="/#blog" 
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#7d36fa] transition-colors group px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-purple-50 border border-slate-200/60"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to all insights
            </Link>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-200/60 text-[#7d36fa] text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#f0449b]" />
              <span>{post.category}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.15]">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-base sm:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                {post.subtitle}
              </p>
            )}
          </div>
        </header>

        {/* Featured Banner Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[28px] overflow-hidden shadow-2xl shadow-purple-950/10 border border-slate-200/80">
            <Image 
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Article Body Container */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Key Takeaways Box */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50/90 via-white to-pink-50/60 border border-purple-200/70 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#7d36fa] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Key Strategic Takeaways</span>
              </div>

              <div className="space-y-3.5">
                {post.keyTakeaways.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-[#f0449b] shrink-0 mt-0.5" />
                    <span>{item}</span>
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
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center transition-all hover:border-purple-300 hover:shadow-md"
                >
                  <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#7d36fa] to-[#f0449b] bg-clip-text text-transparent tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  {stat.description && (
                    <span className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {stat.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Main Structured Sections */}
          <div className="space-y-12 text-slate-800">
            {post.sections && post.sections.map((section, sIdx) => (
              <section key={sIdx} className="space-y-5">
                {section.heading && (
                  <div className="pt-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {section.heading}
                    </h2>
                    {section.subheading && (
                      <p className="text-sm sm:text-base font-semibold text-[#7d36fa] mt-1">
                        {section.subheading}
                      </p>
                    )}
                  </div>
                )}

                {section.paragraphs && section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-lg leading-relaxed text-slate-700 font-normal">
                    {p}
                  </p>
                ))}

                {/* Callout Box */}
                {section.callout && (
                  <div className={`p-5 sm:p-6 rounded-2xl border my-6 ${
                    section.callout.type === 'quote'
                      ? 'bg-gradient-to-r from-purple-50/70 to-pink-50/50 border-purple-200 text-purple-950 font-serif italic text-lg sm:text-xl'
                      : section.callout.type === 'warning'
                      ? 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                      : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-950'
                  }`}>
                    {section.callout.title && (
                      <div className="flex items-center gap-2 font-sans font-bold text-sm uppercase tracking-wider mb-2 not-italic text-slate-900">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
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
                  <div className="space-y-3 pl-2 my-4">
                    {section.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 text-base text-slate-700 leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-[#f0449b] shrink-0 mt-2.5" />
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
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5 transition-all hover:border-purple-200"
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#7d36fa] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
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
            <div className="mt-14 pt-10 border-t border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
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

          {/* Social Share Bar */}
          <ShareBar title={post.title} />

          {/* In-Article Premium CTA Card */}
          {post.cta && (
            <div className="my-14 p-8 sm:p-10 rounded-[32px] bg-[#090b14] border border-white/10 text-white relative overflow-hidden shadow-2xl shadow-purple-950/30">
              {/* Background ambient subtle glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 blur-[100px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/15 blur-[100px] pointer-events-none rounded-full" />

              <div className="relative z-10 text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 mb-4 backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                  <span>Transform Your Business Today</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                  {post.cta.title}
                </h3>
                
                <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
                  {post.cta.description}
                </p>

                <Button 
                  asChild
                  size="lg"
                  className="rounded-xl px-8 py-6 text-sm font-bold bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] text-white hover:opacity-95 shadow-[0_0_30px_rgba(240,68,155,0.4)] transition-all scale-100 hover:scale-105"
                >
                  <Link href={post.cta.buttonHref}>
                    {post.cta.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
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
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#7d36fa] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
              <Link 
                href={`/blog/${relatedPost.slug}`} 
                key={relatedPost.id} 
                className="group block bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all"
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
                    <Clock className="w-3.5 h-3.5" />
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
                    Read article <ArrowRight className="w-3.5 h-3.5" />
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
