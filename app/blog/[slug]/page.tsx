import React from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2, AtSign, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white selection:bg-indigo-500/30 selection:text-indigo-900">
      <Navbar />
      
      <article className="pt-32 pb-24">
        {/* Header Section */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <Link 
            href="/#blog" 
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative aspect-[21/9] md:aspect-[2.5/1] rounded-[32px] overflow-hidden shadow-2xl shadow-indigo-900/5">
            <Image 
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg md:prose-xl prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-2xl max-w-none">
            {post.content?.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed text-slate-700 mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Social Share */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <h3 className="text-lg font-bold text-slate-900">Share this article</h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 text-slate-600 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]">
                <AtSign className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 text-slate-600 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]">
                <Globe className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 text-slate-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 text-slate-600 hover:bg-slate-100">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Recommended Articles Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-12">More from the blog</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
              <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="group block bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-indigo-100 transition-all">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                  <Image 
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="px-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">
                      {relatedPost.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-slate-500 text-sm">
                      {relatedPost.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
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
