"use client";

import React from "react";

interface PlatformIconProps {
  id: string;
  name?: string;
  className?: string;
}

export function PlatformIcon({ id, name, className = "w-7 h-7" }: PlatformIconProps) {
  switch (id) {
    case "amazon":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Amazon 'a' and smile arrow */}
          <path
            d="M26.8 28.2c-.6.6-1.5.9-2.6.9-2.1 0-3.4-1.2-3.4-3.2 0-2.3 1.8-3.3 5.4-3.4v-.4c0-1.2-.6-1.8-2.1-1.8-1.2 0-2.4.4-3.2.9-.3.2-.6.1-.8-.2l-.8-1.2c-.2-.3-.1-.6.2-.8 1.2-.8 2.9-1.3 4.8-1.3 3.3 0 4.8 1.6 4.8 4.6v6.4c0 .8.1 1.5.3 2.1.1.3 0 .6-.3.7l-1.6.8c-.3.1-.6 0-.7-.4l-.2-.8zm-4.7-2.3c0 1.2.7 1.8 1.8 1.8.9 0 1.9-.5 2.3-1.2v-2.3c-2.6.1-4.1.6-4.1 1.7z"
            fill="#111"
          />
          <path
            d="M37.5 32.5c-7.2 4.2-16.6 4.3-25.2.4-.4-.2-.5-.7-.1-1 .3-.2.8-.2 1.1 0 7.8 3.5 16.4 3.4 23.1-.4.5-.3 1 .4.7.9l.4.1z"
            fill="#FF9900"
          />
          <path
            d="M38.8 31.4c-.4-.5-2.7-.4-3.8-.2-.3.1-.4-.2-.1-.4 1.7-1.1 3.9-.8 4.3-.3.4.5-.1 2.6-1.7 3.9-.3.2-.5.1-.4-.2.4-1 .1-2.4-.3-2.8z"
            fill="#FF9900"
          />
        </svg>
      );

    case "flipkart":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#2874F0" />
          {/* Shopping bag handle */}
          <path
            d="M19 19c0-3 2.2-5 5-5s5 2 5 5"
            stroke="#FFE11B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Flipkart 'F' in yellow */}
          <path
            d="M21 21h8c.6 0 1 .4 1 1s-.4 1-1 1h-6v3h5c.6 0 1 .4 1 1s-.4 1-1 1h-5v6c0 .6-.4 1-1 1s-1-.4-1-1V22c0-.6.4-1 1-1z"
            fill="#FFE11B"
          />
        </svg>
      );

    case "myntra":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Myntra M shapes */}
          <path
            d="M12 34V18c0-2.2 1.8-4 4-4s4 1.8 4 4v16"
            stroke="#FF3F6C"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M20 34V18c0-2.2 1.8-4 4-4s4 1.8 4 4v16"
            stroke="#F26A10"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M28 34V18c0-2.2 1.8-4 4-4s4 1.8 4 4v16"
            stroke="#9C27B0"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "meesho":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect width="48" height="48" rx="12" fill="#800080" />
          <path
            d="M14 33V21c0-3.3 2.7-6 6-6s6 2.7 6 6v12M26 21c0-3.3 2.7-6 6-6s6 2.7 6 6v12"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case "blinkit":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect width="48" height="48" rx="12" fill="#F8CB46" />
          <path
            d="M19 14h6c4 0 7 2.5 7 6s-2 5-4.5 5.5C30.5 26.5 33 29.5 33 34c0 4-3.5 6-7.5 6H19V14zm5 9.5h2c1.7 0 3-1 3-2.5s-1.3-2.5-3-2.5h-2v5zm0 12h2.5c2 0 3.5-1.2 3.5-3s-1.5-3-3.5-3H24v6z"
            fill="#0C831F"
          />
        </svg>
      );

    case "indiamart":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#D71921" />
          {/* Dual figures forming handshake / globe */}
          <circle cx="18" cy="18" r="4" fill="#FFFFFF" />
          <circle cx="30" cy="18" r="4" fill="#FFFFFF" />
          <path
            d="M14 32c0-4 3.5-7 8-7h4c4.5 0 8 3 8 7"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M22 25l4 4 4-4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "justdial":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect width="48" height="48" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* 'J' in vibrant blue */}
          <path
            d="M18 16v11c0 3.5-2 5-5 5-1.5 0-3-.5-4-1.2l1-2.8c.8.5 1.8.8 2.7.8 1.5 0 2.3-.7 2.3-2.2V16h3z"
            fill="#0076D7"
          />
          {/* 'd' in vibrant orange */}
          <path
            d="M32 15h3v17h-3v-1.8c-1.2 1.3-2.8 2.2-4.8 2.2-4.5 0-7.2-3.6-7.2-8.5 0-5 2.8-8.5 7.2-8.5 2 0 3.6.9 4.8 2.2V15zm-4.4 14.4c2.6 0 4.4-2.1 4.4-5.6 0-3.4-1.8-5.6-4.4-5.6-2.5 0-4.3 2.1-4.3 5.6 0 3.5 1.8 5.6 4.3 5.6z"
            fill="#F47B20"
          />
        </svg>
      );

    case "sulekha":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1" />
          {/* Sulekha stylized sun spiral in orange & red */}
          <path
            d="M24 12c6.6 0 12 5.4 12 12s-5.4 12-12 12S12 30.6 12 24"
            stroke="#F97316"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="24" cy="24" r="5" fill="#EF4444" />
        </svg>
      );

    case "tradeindia":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect width="48" height="48" rx="10" fill="#D32F2F" />
          {/* 'ti' in clean white */}
          <path
            d="M14 18h8v3h-2.5v11h-3V21H14v-3zm12 3h3v11h-3V21zm0-4h3v2.5h-3V17z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "alibaba":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#FF6A00" />
          {/* Alibaba smiling face / 'a' */}
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
          {/* Udaan paper plane / bird */}
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

    case "other":
      return (
        <div className="w-full h-full rounded-xl bg-neutral-100 flex items-center justify-center border border-neutral-300">
          <span className="text-[12px] font-black tracking-wider text-neutral-600">OT</span>
        </div>
      );

    case "none_of_these":
      return (
        <div className="w-full h-full rounded-xl bg-neutral-100 flex items-center justify-center border border-neutral-300">
          <span className="text-[12px] font-black tracking-wider text-neutral-600">NO</span>
        </div>
      );

    default: {
      const initials = (name || id || "PL")
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return (
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#fc9a5d]/20 via-[#f0449b]/20 to-[#be32ff]/20 flex items-center justify-center border border-white/20">
          <span className="text-[11px] font-black text-white">{initials}</span>
        </div>
      );
    }
  }
}
