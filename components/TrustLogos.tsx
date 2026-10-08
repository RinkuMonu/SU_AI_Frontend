import React from 'react';

const logos = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', height: 'h-8' },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', height: 'h-8' },
  { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', height: 'h-6' },
  { name: 'Shopify', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg', height: 'h-8' },
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', height: 'h-8' },
  { name: 'PayPal', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', height: 'h-7' }
];

export function TrustLogos() {
  return (
    <section className="py-10 bg-white border-b border-slate-100 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-[13px] font-semibold text-[#6b7280]">
            Trusted by <span className="font-bold text-[#374151]">10,000+</span> businesses worldwide
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-20">
            {logos.map((logo) => (
              <div key={logo.name} className="flex items-center justify-center">
                <img 
                  src={logo.url} 
                  alt={`${logo.name} logo`} 
                  className={`object-contain ${logo.height} opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300`}
                  style={{ filter: "grayscale(100%) opacity(0.6) contrast(1.2)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
