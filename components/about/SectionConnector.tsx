'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

export interface SectionConnectorProps {
  /** Starting horizontal position as percentage (0-100) on desktop */
  startDesktop: number;
  /** Ending horizontal position as percentage (0-100) on desktop */
  endDesktop: number;
  /** Starting horizontal position as percentage (0-100) on mobile (default: 50) */
  startMobile?: number;
  /** Ending horizontal position as percentage (0-100) on mobile (default: 50) */
  endMobile?: number;
  /** Total height of the connector in pixels (default: 96) */
  height?: number;
  /** Optional custom stroke color */
  strokeColor?: string;
  /** Optional extra class names */
  className?: string;
  /** Show glowing endpoint nodes (default: true) */
  showNodes?: boolean;
}

export function SectionConnector({
  startDesktop,
  endDesktop,
  startMobile = 50,
  endMobile = 50,
  height = 96,
  strokeColor,
  className = '',
  showNodes = true,
}: SectionConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [isClient, setIsClient] = useState(false);
  const uniqueId = useId().replace(/:/g, '');

  useEffect(() => {
    setIsClient(true);
    const el = containerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      if (el) {
        setContainerWidth(el.offsetWidth);
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(el);
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const isMobile = isClient && containerWidth < 768;

  const startPct = isMobile ? startMobile : startDesktop;
  const endPct = isMobile ? endMobile : endDesktop;

  const x1 = (startPct / 100) * containerWidth;
  const x2 = (endPct / 100) * containerWidth;
  const H = height;
  const midY = H / 2;

  const dx = x2 - x1;
  const absDx = Math.abs(dx);

  let pathD = '';

  if (absDx < 4) {
    // Pure straight vertical line
    pathD = `M ${x1} 0 V ${H}`;
  } else {
    // Smooth S-curve with rounded corner arcs
    const R = Math.min(32, absDx / 2, midY);

    if (dx < 0) {
      // Moving downwards and turning left, then turning down
      const sweep1 = 1; // clockwise
      const sweep2 = 0; // counter-clockwise
      pathD = `M ${x1} 0 V ${midY - R} A ${R} ${R} 0 0 ${sweep1} ${x1 - R} ${midY} H ${x2 + R} A ${R} ${R} 0 0 ${sweep2} ${x2} ${midY + R} V ${H}`;
    } else {
      // Moving downwards and turning right, then turning down
      const sweep1 = 0; // counter-clockwise
      const sweep2 = 1; // clockwise
      pathD = `M ${x1} 0 V ${midY - R} A ${R} ${R} 0 0 ${sweep1} ${x1 + R} ${midY} H ${x2 - R} A ${R} ${R} 0 0 ${sweep2} ${x2} ${midY + R} V ${H}`;
    }
  }

  const gradId = `line-grad-${uniqueId}`;
  const glowId = `line-glow-${uniqueId}`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full pointer-events-none select-none z-20 ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full overflow-visible"
        width={containerWidth}
        height={height}
        viewBox={`0 0 ${containerWidth} ${height}`}
      >
        <defs>
          <linearGradient
            id={gradId}
            x1={dx < 0 ? '100%' : '0%'}
            y1="0%"
            x2={dx < 0 ? '0%' : '100%'}
            y2="100%"
          >
            <stop offset="0%" stopColor="#fc9a5d" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#f0449b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fc9a5d" stopOpacity="0.95" />
          </linearGradient>

          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#fc9a5d" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Outer ambient glow path */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor || `url(#${gradId})`}
          strokeWidth="3.5"
          strokeOpacity="0.25"
          filter={`url(#${glowId})`}
        />

        {/* Main crisp connector path (matches Neokred slim precision) */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor || `url(#${gradId})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subtle traveling light particle effect */}
        <path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="6 70"
          strokeDashoffset="0"
          className="opacity-40"
        />

        {/* Connection endpoint nodes */}
        {showNodes && (
          <>
            {/* Top Node (Exit from top container) */}
            <circle cx={x1} cy={0} r={6} fill="#fc9a5d" fillOpacity="0.2" />
            <circle cx={x1} cy={0} r={3} fill="#fc9a5d" />

            {/* Bottom Node (Entry into bottom container) */}
            <circle cx={x2} cy={H} r={6} fill="#fc9a5d" fillOpacity="0.2" />
            <circle cx={x2} cy={H} r={3} fill="#fc9a5d" />
          </>
        )}
      </svg>
    </div>
  );
}
