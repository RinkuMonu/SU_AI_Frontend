"use client";

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Must read: ${title} on @DhandaGrowAI`);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-y border-slate-200/80 my-10">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Share2 className="w-4 h-4 text-[#7d36fa]" />
        <span>Share this article</span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareWhatsApp}
          className="rounded-full text-xs font-semibold gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShareLinkedIn}
          className="rounded-full text-xs font-semibold gap-1.5 border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-sky-600" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
          </svg>
          LinkedIn
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShareTwitter}
          className="rounded-full text-xs font-semibold gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-slate-800" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X (Twitter)
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="rounded-full text-xs font-semibold gap-1.5 border-purple-200 text-[#7d36fa] hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#7d36fa]" />
              <span>Copy Link</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
