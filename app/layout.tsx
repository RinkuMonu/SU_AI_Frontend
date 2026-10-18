import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <SecurityShield />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
