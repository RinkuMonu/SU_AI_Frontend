"use client";

import React from "react";

interface PlatformIconProps {
  id: string;
  name?: string;
  className?: string;
}

export function PlatformIcon({ id, name, className = "w-12 h-12" }: PlatformIconProps) {
  switch (id) {
    case "amazon":
      return (
        <div className={`rounded-2xl bg-white flex items-center justify-center p-2 shadow-md overflow-hidden shrink-0 ${className}`}>
          <img
            src="/images/platforms/amazon_icon.png"
            alt="Amazon"
            className="w-full h-full object-contain"
          />
        </div>
      );

    case "flipkart":
      return (
        <div className={`rounded-2xl bg-[#FFE11B] flex items-center justify-center p-1.5 shadow-md overflow-hidden shrink-0 ${className}`}>
          <img
            src="/images/platforms/flipkart_icon.png"
            alt="Flipkart"
            className="w-full h-full object-contain"
          />
        </div>
      );

    case "myntra":
      return (
        <div className={`rounded-2xl bg-white flex items-center justify-center p-2 shadow-md overflow-hidden shrink-0 ${className}`}>
          <img
            src="/images/platforms/myntra_icon.png"
            alt="Myntra"
            className="w-full h-full object-contain"
          />
        </div>
      );

    case "meesho":
      return (
        <div className={`rounded-2xl bg-[#580a46] flex items-center justify-center shadow-md overflow-hidden shrink-0 ${className}`}>
          <img
            src="/images/platforms/meesho.png"
            alt="Meesho"
            className="w-full h-full object-cover"
          />
        </div>
      );

    case "blinkit":
      return (
        <div className={`rounded-2xl bg-[#FFE141] flex items-center justify-center shadow-md overflow-hidden shrink-0 ${className}`}>
          <img
            src="/images/platforms/blinkit_icon.png"
            alt="Blinkit"
            className="w-full h-full object-contain"
          />
        </div>
      );

    case "other":
      return (
        <div className={`rounded-2xl bg-white flex items-center justify-center shadow-md border border-white/10 shrink-0 ${className}`}>
          <span className="text-[14px] font-black tracking-wider text-neutral-600 font-sans">
            OT
          </span>
        </div>
      );

    case "none_of_these":
      return (
        <div className="w-13 h-13 rounded-2xl bg-white flex items-center justify-center shadow-md border border-white/10">
          <span className="text-[13px] font-black tracking-wider text-neutral-600 font-sans">
            NO
          </span>
        </div>
      );

    case "indiamart":
      return (
        <div className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-11 h-11">
            <circle cx="16" cy="18" r="4" fill="#E53935" />
            <circle cx="27" cy="14" r="4" fill="#1E88E5" />
            <circle cx="37" cy="14" r="4" fill="#43A047" />
            <circle cx="48" cy="18" r="4" fill="#E53935" />
            <path
              d="M16 46V28C16 25 19 25 21 28L32 41L43 28C45 25 48 25 48 28V46"
              stroke="#E53935"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case "justdial":
      return (
        <div className={`rounded-2xl bg-white flex items-center justify-center p-2 shadow-md overflow-hidden shrink-0 ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <path
              d="M20 16v18c0 5.5-3.5 8-8 8-2.5 0-4.8-.8-6.5-2l1.8-4.5c1.2.8 2.8 1.4 4.5 1.4 2.5 0 3.8-1.2 3.8-3.5V16h4.4z"
              fill="#0076D7"
            />
            <path
              d="M42 14h4.4v28H42v-2.8c-2 2-4.5 3.2-7.5 3.2-7 0-11.5-5.5-11.5-13.5s4.5-13.5 11.5-13.5c3 0 5.5 1.2 7.5 3.2V14zm-7 24c4.2 0 7-3.4 7-8.8s-2.8-8.8-7-8.8c-4.2 0-7 3.4-7 8.8s2.8 8.8 7 8.8z"
              fill="#F47B20"
            />
          </svg>
        </div>
      );

    case "sulekha":
      return (
        <div className={`flex flex-col items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 80 70" fill="none" className="w-10 h-8">
            <path
              d="M40 10 C54 10, 66 22, 66 36 C66 43, 61 50, 55 54 C48 58, 38 58, 31 54 C25 50, 22 42, 26 35 C30 28, 41 28, 46 33 C50 38, 50 44, 46 48"
              stroke="#EA580C"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="48" cy="24" r="6" fill="#DC2626" />
            <path
              d="M32 46 C36 50, 44 50, 48 46"
              stroke="#FBBF24"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[11px] font-bold text-[#F87171] tracking-wide -mt-0.5">
            Sulekha
          </span>
        </div>
      );

    case "tradeindia":
      return (
        <div className={`rounded-2xl bg-[#E31E24] flex items-center justify-center shadow-md overflow-hidden shrink-0 ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <text
              x="50"
              y="68"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="56"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-2"
            >
              ti
            </text>
          </svg>
        </div>
      );

    case "alibaba":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#FF6A00" />
          <path
            d="M17 25c1.5 5 5 7.5 9 7.5 5 0 8.5-3.5 8.5-8.5 0-5.5-4-9-9.5-9-6.5 0-11 5-11 11.5 0 6.5 4.5 11 11.5 11 3.5 0 6.5-1.2 8.5-3.2"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case "udaan":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect width="48" height="48" rx="12" fill="#0052CC" />
          <path
            d="M12 24l24-10-10 24-3-10-11-4z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "amazon_business":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect width="48" height="48" rx="10" fill="#0F172A" />
          <path
            d="M26 24c-.5.5-1.2.7-2 .7-1.6 0-2.6-.9-2.6-2.4 0-1.8 1.4-2.5 4.2-2.6v-.3c0-.9-.5-1.4-1.6-1.4-.9 0-1.8.3-2.4.7l-.6-.9c.9-.6 2.2-1 3.6-1 2.5 0 3.6 1.2 3.6 3.5v4.8c0 .6.1 1.1.2 1.6l-1.2.6-.2-.6zm-3.5-1.7c0 .9.5 1.4 1.4 1.4.7 0 1.5-.4 1.8-.9v-1.7c-2 0-3.2.4-3.2 1.2z"
            fill="#FFFFFF"
          />
          <path
            d="M33 27c-5 3-11.5 3-17.5.3-.3-.1-.4-.5-.1-.7.2-.1.6-.1.8 0 5.4 2.4 11.4 2.4 16-.3.4-.2.7.3.5.7h.3z"
            fill="#FF9900"
          />
          <rect x="12" y="31" width="24" height="6" rx="2" fill="#2563EB" />
          <text
            x="24"
            y="35.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="4.5"
            fontWeight="bold"
            letterSpacing="0.5"
          >
            BUSINESS
          </text>
        </svg>
      );

    default: {
      const initials = (name || id || "PL")
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return (
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#fc9a5d]/20 via-[#f0449b]/20 to-[#be32ff]/20 flex items-center justify-center border border-white/20">
          <span className="text-[12px] font-bold text-white">{initials}</span>
        </div>
      );
    }
  }
}
