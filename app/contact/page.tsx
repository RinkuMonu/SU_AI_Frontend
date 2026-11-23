import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Contact } from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Contact Us | DhandaGrow AI',
  description: 'Get in touch with the DhandaGrow team. We are here to help your business scale with automated AI marketing.',
  alternates: {
    canonical: 'https://dhandagrow.com/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-brand-purple/20 selection:text-slate-900 relative overflow-hidden font-sans">
      <Navbar />

      {/* Top spacing to account for fixed navbar */}
      <div className="pt-24 sm:pt-28">
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
