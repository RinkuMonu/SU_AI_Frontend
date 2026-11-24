import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing Plans | DhandaGrow AI",
  description:
    "Simple, transparent, and predictable pricing plans for modern Indian businesses. Choose the plan that fits your business stage.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary/30 selection:text-white pt-14 sm:pt-16">
      <Navbar />
      <Pricing className="pt-2 sm:pt-4 border-t-0" />
      <Footer />
    </main>
  );
}
