import React from 'react';
import { blogPosts } from '@/data/blog';
import { SectionHeading } from './ui/SectionHeading';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Blog() {
  return (
    <section id="blog" className="pt-7 pb-12 sm:pt-9 sm:pb-14 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1.5 sm:mb-2">
            Latest insights.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-medium">
            Learn how the best brands are using AI to scale.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer block">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3.5">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#7d36fa] text-xs font-semibold bg-[#f0449b]/10 px-2.5 py-0.5 rounded-full">
                  {post.category}
                </span>
                <span className="text-slate-400 text-xs">
                  {post.date}
                </span>
              </div>
              
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#fc9a5d] transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              
              <p className="text-slate-600 text-xs sm:text-sm mb-3.5 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-1.5 text-slate-900 text-xs sm:text-sm font-semibold group-hover:text-[#f0449b] transition-colors">
                Read article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
