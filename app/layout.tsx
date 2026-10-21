import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SecurityShield } from "@/components/security/SecurityShield";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DhandaGrow AI | All-in-One Business Growth Platform",
  description: "Automate your marketing, create content instantly, and grow your business with DhandaGrow's advanced AI platform.",
  icons: {
    icon: '/logo.png',
  },
};
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCmTCmI8Hn8Du4M3rYzfSdhRVcx1oap59o";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <SecurityShield />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script
          id="google-maps-sdk"
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
