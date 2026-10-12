"use client";

import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface DoneAnimationProps {
  className?: string;
}

export function DoneAnimation({ className = "w-32 h-32" }: DoneAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: AnimationItem | undefined;

    if (containerRef.current) {
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/Done.json",
      });
    }

    return () => {
      if (anim) anim.destroy();
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
