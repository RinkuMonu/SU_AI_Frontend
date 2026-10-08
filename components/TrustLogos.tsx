import React from 'react';

const logos = [
  "Acme Corp", "GlobalTech", "Quantum", "Nexus", "Vertex AI", "Horizon", "Pinnacle"
];

export function TrustLogos() {
  return (
    <section className="py-12 border-y border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase whitespace-nowrap">
            Trusted by growing businesses
          </p>
          
          <div className="min-w-0 w-full md:flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="trust-logo-track flex w-max">
              {[0, 1].map((group) => (
                <div
                  key={group}
                  className="trust-logo-group flex shrink-0 items-center gap-12 pr-12"
                  aria-hidden={group === 1}
                  role={group === 0 ? 'list' : undefined}
                  aria-label={group === 0 ? 'Trusted businesses' : undefined}
                >
                  {logos.map((logo) => (
                    <span
                      key={logo}
                      className="text-lg font-bold text-slate-400 tracking-tighter grayscale opacity-70 hover:opacity-100 hover:text-red-600 transition-all cursor-default"
                      role={group === 0 ? 'listitem' : undefined}
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
