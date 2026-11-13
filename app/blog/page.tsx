import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Blog } from '@/components/Blog';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog & Articles | DhandaGrow AI',
  description:
    'Latest insights, guides, and news on how modern Indian brands use AI to scale marketing and content creation.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fc] selection:bg-primary/30 selection:text-white pt-20 sm:pt-24 lg:pt-28">
      <Navbar />
      <Blog />
      <Footer />
    </main>
  );
}

