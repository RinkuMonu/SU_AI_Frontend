import { notFound } from 'next/navigation';
import { legalData } from '@/data/legal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import React from 'react';

export function generateStaticParams() {
  return legalData.policies.map((policy) => ({
    slug: policy.slug,
  }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const policy = legalData.policies.find((p) => p.slug === resolvedParams.slug);

  if (!policy) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] selection:bg-primary/30 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6">
              Legal Information
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">{policy.title}</h1>
            <p className="text-lg text-slate-500 mb-10 pb-10 border-b border-slate-100 leading-relaxed font-medium">
              {policy.content.introduction}
            </p>
            
            <div className="space-y-12">
              {policy.content.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{section.title}</h2>
                  {section.content && (
                    <p className="text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                  )}
                  {section.items && (
                    <ul className="space-y-3 mt-4 text-slate-600">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 leading-relaxed">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
