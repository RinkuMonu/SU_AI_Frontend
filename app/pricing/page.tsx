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
    <main className="min-h-screen bg-[#f8f9fe] selection:bg-primary/30 selection:text-white pt-20 sm:pt-24 lg:pt-28">
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  );
}
