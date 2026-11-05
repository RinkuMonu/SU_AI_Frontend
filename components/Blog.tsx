import React from 'react';
import { blogPosts } from '@/data/blog';
import { SectionHeading } from './ui/SectionHeading';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Blog() {
  return (
    <section id="blog" className="w-full max-w-full pt-6 pb-8 sm:pt-9 sm:pb-14 bg-[#f8f9fc] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center w-full mb-5 sm:mb-8 px-1">
          <h2 className="w-full text-xl min-[375px]:text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-1.5 sm:mb-2">
            Latest insights.
          </h2>
          <p className="text-slate-500 text-[11px] min-[375px]:text-xs sm:text-sm md:text-base max-w-xl w-full mx-auto font-medium leading-relaxed px-2">
            Learn how the best brands are using AI to scale.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full ">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer block w-full min-w-0">
              <div className="relative w-full  aspect-[16/10] sm:aspect-[16/10] rounded-xl rounded-2xl overflow-hidden mb-3 sm:mb-3.5">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <span className="text-[#7d36fa] text-[10px] sm:text-xs font-semibold bg-[#f0449b]/10 px-2 sm:px-2.5 py-1 rounded-full max-w-full">
                  {post.category}
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs ">
                  {post.date}
                </span>
              </div>

              <h3 className="text-sm min-[375px]:text-base sm:text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#fc9a5d] transition-colors line-clamp-2 leading-snug break-words">
                {post.title}
              </h3>

              <p className="text-slate-600 text-[11px] min-[375px]:text-xs sm:text-sm mb-3 sm:mb-3.5 line-clamp-2 leading-relaxed break-words">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-1.5 text-slate-900 text-[11px] sm:text-sm font-semibold group-hover:text-[#f0449b] transition-colors">
                Read article <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
