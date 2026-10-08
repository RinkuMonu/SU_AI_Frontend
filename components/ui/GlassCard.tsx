import React from 'react';
import { cn } from '@/lib/utils';

export function GlassCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md", className)}>
      {children}
    </div>
  );
}
