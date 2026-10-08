import React from 'react';
import { blogPosts } from '@/data/blog';
import { SectionHeading } from './ui/SectionHeading';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function Blog() {
  return (
    <section id="blog" className="py-24 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Latest insights."
          subtitle="Learn how the best brands are using AI to scale."
          tone="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {blogPosts.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[#7d36fa] text-sm font-medium bg-[#f0449b]/10 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-slate-500 text-sm">
                  {post.date}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-[#fc9a5d] transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-2 text-slate-900 text-sm font-medium group-hover:text-[#f0449b] transition-colors">
                Read article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
