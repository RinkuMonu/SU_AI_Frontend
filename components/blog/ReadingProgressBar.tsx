"use client";

import React, { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] transition-all duration-150 ease-out shadow-[0_0_12px_rgba(240,68,155,0.7)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
