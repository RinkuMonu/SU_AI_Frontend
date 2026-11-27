"use client";

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-y border-slate-200/80 my-10 bg-slate-50/70 rounded-2xl px-5 sm:px-6">
      <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#7d36fa]">
          <Share2 className="w-4 h-4" />
        </div>
        <span>Share this article</span>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        {/* LinkedIn Button */}
        <button
          onClick={handleShareLinkedIn}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white text-[#0A66C2] border border-sky-200 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white shadow-xs hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-[#0A66C2] group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
          </svg>
          <span>LinkedIn</span>
        </button>

        {/* X (Twitter) Button */}
        <button
          onClick={handleShareTwitter}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-900 border border-slate-300 hover:border-black hover:bg-black hover:text-white shadow-xs hover:shadow-md hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-slate-900 group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X (Twitter)</span>
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-emerald-500/10'
              : 'bg-white text-[#7d36fa] border border-purple-200 hover:border-[#7d36fa] hover:bg-[#7d36fa] hover:text-white hover:shadow-purple-500/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#7d36fa] group-hover:text-white transition-colors duration-300" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
