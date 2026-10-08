import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TrustLogos } from '@/components/TrustLogos';
import { Features } from '@/components/Features';
import { AISection } from '@/components/AISection';
import { Automation } from '@/components/Automation';
import { Examples } from '@/components/Examples';
import { Pricing } from '@/components/Pricing';
import { Blog } from '@/components/Blog';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <TrustLogos />
      <Features />
      <AISection />
      <Automation />
      {/* <Examples /> */}
      <Pricing />
      <Blog />
      <CTA />
      <Footer />
    </main>
  );
}
