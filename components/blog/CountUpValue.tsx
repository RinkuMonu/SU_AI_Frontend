"use client";

import { useEffect, useRef, useState } from 'react';

interface CountUpValueProps {
  value: string;
  index?: number;
  className?: string;
}

const DURATION = 1800;
const STAGGER = 150;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUpValue({ value, index = 0, className = '' }: CountUpValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)([\s\S]*)$/);
    if (reduceMotion || !match) {
      started.current = true;
      return;
    }

    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];
    const target = parseFloat(numStr);
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

    const format = (n: number) => prefix + n.toFixed(decimals) + suffix;

    let rafId = 0;
    let cancelled = false;

    const run = () => {
      setDisplay(format(0));
      const startTime = performance.now() + index * STAGGER;
      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startTime;
        if (elapsed < 0) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        const progress = Math.min(elapsed / DURATION, 1);
        setDisplay(format(target * easeOutCubic(progress)));
        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            observer.disconnect();
            run();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, index]);

  return (
    <span ref={ref} className={`${className} tabular-nums`}>
      {display}
    </span>
  );
}