'use client';

import React from 'react';

// SVGs for AI Model Badges as shown in Image 2
const GeminiIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill="url(#gemini-grad-marquee)"
    />
    <defs>
      <linearGradient id="gemini-grad-marquee" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1BA1E3" />
        <stop offset="0.5" stopColor="#5B76FB" />
        <stop offset="1" stopColor="#D96570" />
      </linearGradient>
    </defs>
  </svg>
);

const MistralIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#FF7000">
    <rect x="2" y="3" width="4" height="4" rx="0.5" />
    <rect x="18" y="3" width="4" height="4" rx="0.5" />
    <rect x="2" y="7" width="8" height="4" rx="0.5" />
    <rect x="14" y="7" width="8" height="4" rx="0.5" />
    <rect x="2" y="11" width="20" height="4" rx="0.5" />
    <rect x="2" y="15" width="4" height="4" rx="0.5" />
    <rect x="10" y="15" width="4" height="4" rx="0.5" />
    <rect x="18" y="15" width="4" height="4" rx="0.5" />
  </svg>
);

const GrokIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="8.5" />
    <line x1="7" y1="17" x2="17" y2="7" />
  </svg>
);

const NovaIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#8B5CF6">
    <path d="M12 2L13.8 8.5C14.4 10.7 16.1 12.4 18.3 13L22 14L18.3 15C16.1 15.6 14.4 17.3 13.8 19.5L12 24L10.2 19.5C9.6 17.3 7.9 15.6 5.7 15L2 14L5.7 13C7.9 12.4 9.6 10.7 10.2 8.5L12 2Z" />
  </svg>
);

const OpenAIIcon = () => (
  <svg className="w-5 h-5 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9 6.07 6.07 0 0 0-10.27 2.17 5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.09 4.78 2.75a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.04.06l-4.84 2.8a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.98v5.68c0 .28.15.54.39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.1 3.85-5.84-3.37 2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.67a.79.79 0 0 0-.4-.69zm2.01-3.02-.14-.08-4.77-2.79a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.79 2.76a.79.79 0 0 0-.39.68v6.72z" />
  </svg>
);

const SeedanceIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="10" width="3" height="8" rx="1.5" fill="#00D2B4" />
    <rect x="8" y="5" width="3" height="14" rx="1.5" fill="#00D2B4" />
    <rect x="13.5" y="8" width="3" height="11" rx="1.5" fill="#00D2B4" />
    <rect x="19" y="11" width="3" height="7" rx="1.5" fill="#00D2B4" />
  </svg>
);

const QwenIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#7C3AED">
    <path d="M12 2.5L2.5 19H21.5L12 2.5ZM12 7L17 16H7L12 7ZM12 11L9.5 15H14.5L12 11Z" fillRule="evenodd" />
  </svg>
);

const WanIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#6366F1">
    <path d="M12 2L21 7.2V17.8L12 23L3 17.8V7.2L12 2ZM12 5.5L6.5 8.7V15.3L12 18.5L17.5 15.3V8.7L12 5.5Z" />
  </svg>
);

const KlingIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2.2">
    <circle cx="8" cy="12" r="4.5" />
    <circle cx="16" cy="12" r="4.5" />
  </svg>
);

const BananaIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M12 1.5L14.5 9.5L22.5 12L14.5 14.5L12 22.5L9.5 14.5L1.5 12L9.5 9.5L12 1.5Z" fill="url(#banana-grad-marquee)" />
    <defs>
      <linearGradient id="banana-grad-marquee" x1="1.5" y1="1.5" x2="22.5" y2="22.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#EAB308" />
      </linearGradient>
    </defs>
  </svg>
);

const ClaudeIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#D97706">
    <path d="M13.5 2H10.5V8.5L6 4L3.8 6.2L8.5 10.5H2V13.5H8.5L4 18L6.2 20.2L10.5 15.5V22H13.5V15.5L18 20L20.2 17.8L15.5 13.5H22V10.5H15.5L20 6L17.8 3.8L13.5 8.5V2Z" />
  </svg>
);

interface AIModel {
  name: string;
  icon: React.ComponentType;
}

const row1Models: AIModel[] = [
  { name: 'Gemini 3.1 Pro', icon: GeminiIcon },
  { name: 'Mistral Small', icon: MistralIcon },
  { name: 'Codestral', icon: MistralIcon },
  { name: 'Grok 4.5', icon: GrokIcon },
  { name: 'Nova Pro', icon: NovaIcon },
  { name: 'GPT 5.6 Sol', icon: OpenAIIcon },
  { name: 'Claude 3.7 Sonnet', icon: ClaudeIcon },
];

const row2Models: AIModel[] = [
  { name: 'GPT Image 1.5', icon: OpenAIIcon },
  { name: 'Nano Banana 2', icon: BananaIcon },
  { name: 'Magistral Medium', icon: MistralIcon },
  { name: 'Grok Imagine', icon: GrokIcon },
  { name: 'Wan 3.0 Prime', icon: WanIcon },
  { name: 'Gemini 3.1 Pro', icon: GeminiIcon },
  { name: 'Claude 3.7 Sonnet', icon: ClaudeIcon },
];

const row3Models: AIModel[] = [
  { name: 'Nova Micro', icon: NovaIcon },
  { name: 'Seedance 2.0', icon: SeedanceIcon },
  { name: 'Qwen 3.8 Max', icon: QwenIcon },
  { name: 'Seedance 2.0', icon: SeedanceIcon },
  { name: 'Kling 3.0', icon: KlingIcon },
  { name: 'Codestral', icon: MistralIcon },
  { name: 'Wan 3.0 Prime', icon: WanIcon },
];

function ModelPill({ model }: { model: AIModel }) {
  const Icon = model.icon;
  return (
    <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm shrink-0 select-none cursor-pointer transition-transform duration-200 hover:scale-105">
      <Icon />
      <span className="text-[13.5px] sm:text-[14.5px] font-semibold text-slate-800 tracking-tight whitespace-nowrap">
        {model.name}
      </span>
    </div>
  );
}

export function AIModelsMarquee() {
  return (
    <div className="relative w-full overflow-hidden pt-1 pb-1 sm:pb-2 select-none">
      {/* Side gradient fade masks on the hero background */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 bg-gradient-to-r from-[#12082b] via-[#12082b]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 bg-gradient-to-l from-[#12082b] via-[#12082b]/80 to-transparent z-20 pointer-events-none" />

      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {/* Row 1: Scrolling Left */}
        <div className="overflow-hidden flex items-center">
          <div className="ai-models-marquee-left flex items-center gap-2.5 sm:gap-3">
            {[1, 2, 3, 4].map((copyIndex) => (
              <div
                key={`r1-copy-${copyIndex}`}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0"
                aria-hidden={copyIndex > 1 ? 'true' : undefined}
              >
                {row1Models.map((m, idx) => (
                  <ModelPill key={`r1-${copyIndex}-${idx}-${m.name}`} model={m} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="overflow-hidden flex items-center">
          <div className="ai-models-marquee-right flex items-center gap-2.5 sm:gap-3">
            {[1, 2, 3, 4].map((copyIndex) => (
              <div
                key={`r2-copy-${copyIndex}`}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0"
                aria-hidden={copyIndex > 1 ? 'true' : undefined}
              >
                {row2Models.map((m, idx) => (
                  <ModelPill key={`r2-${copyIndex}-${idx}-${m.name}`} model={m} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Scrolling Left */}
        <div className="overflow-hidden flex items-center">
          <div className="ai-models-marquee-left flex items-center gap-2.5 sm:gap-3">
            {[1, 2, 3, 4].map((copyIndex) => (
              <div
                key={`r3-copy-${copyIndex}`}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0"
                aria-hidden={copyIndex > 1 ? 'true' : undefined}
              >
                {row3Models.map((m, idx) => (
                  <ModelPill key={`r3-${copyIndex}-${idx}-${m.name}`} model={m} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
