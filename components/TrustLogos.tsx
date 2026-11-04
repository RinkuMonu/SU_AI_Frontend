import React from 'react';

const logos = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', height: 'h-4 sm:h-5 md:h-6' },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', height: 'h-4 sm:h-5 md:h-6' },
  { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', height: 'h-3.5 sm:h-4 md:h-[18px]' },
  { name: 'Shopify', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg', height: 'h-4 sm:h-5 md:h-6 ' },
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', height: 'h-4 sm:h-5 md:h-6' },
  { name: 'PayPal', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', height: 'h-3.5 sm:h-4 md:h-5 ' }
];

export function TrustLogos() {
  return (
    <section className="pt-3 sm:pt-4 lg:pt-5 pb-4 sm:pb-5 lg:pb-6 bg-white border-y border-slate-100 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 mb-2.5 sm:mb-3 lg:mb-3.5 text-center">
        <p className="text-[11px]  sm:text-xs md:text-[13px] font-semibold text-[#6b7280] leading-relaxed text-center ">
          Trusted by <span className="font-bold text-[#374151]">10,000+</span> businesses worldwide
        </p>
      </div>

      {/* Auto-scrolling horizontal marquee track */}

      <div className="relative w-full overflow-hidden flex items-center py-1 sm:py-2">
        {/* Left & Right gradient fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-12 md:w-20 lg:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />

        <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-12 md:w-20 lg:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

        <div className="trust-logo-track flex items-center w-max will-change-transform  ">
          {[1, 2, 3, 4].map((groupNum) => (
            <div
              key={`trust-group-${groupNum}`}
              className="trust-logo-group flex items-center gap-7 sm:gap-10 md:gap-12 lg:gap-16 pr-7 sm:pr-10 md:pr-12 lg:pr-16 shrink-0"
              aria-hidden={groupNum > 1 ? 'true' : undefined}
            >
              {logos.map((logo, idx) => (
                <div
                  key={`${logo.name}-${groupNum}-${idx}`}
                  className="flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <img
                    src={logo.url}
                    alt={`${logo.name} logo`}
                    className={`object-contain ${logo.height} max-w-[75px] sm:max-w-[90px] md:max-w-[105px] hover:scale-105 transition-transform duration-300 select-none`}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
