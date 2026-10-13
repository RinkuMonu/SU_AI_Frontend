import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeatureHighlights } from '@/components/FeatureHighlights';
import { TrustLogos } from '@/components/TrustLogos';
import { PaymentsStackSection } from '@/components/PaymentsStackSection';
import { Features } from '@/components/Features';
import { AISection } from '@/components/AISection';
import { Automation } from '@/components/Automation';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { Examples } from '@/components/Examples';
import { Pricing } from '@/components/Pricing';
import { Blog } from '@/components/Blog';
import { Contact } from '@/components/Contact';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <FeatureHighlights />
      <PaymentsStackSection />
      <TrustLogos />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Automation />
      {/* <Examples /> */}
      <Pricing />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}
