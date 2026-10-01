import Script from "next/script";
import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";



export const metadata: Metadata = {
  title: "SevenUnique AI | Marketing SaaS for Businesses",
  description: "AI-powered marketing SaaS platform for small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased min-h-screen bg-background text-foreground"
      >
                <AuthProvider>
          {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
