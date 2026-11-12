import type { Metadata, Viewport } from "next";
import { Inter, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { SecurityShield } from "@/components/security/SecurityShield";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#071023",
};

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
      <body className={`${inter.variable} ${roboto.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden min-h-screen`}>
        <script
          id="anti-screenshare-early"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof MediaDevices !== "undefined" && MediaDevices.prototype) {
                  try {
                    Object.defineProperty(MediaDevices.prototype, "getDisplayMedia", {
                      value: function() {
                        return Promise.reject(new DOMException("Screen sharing blocked on this platform.", "NotAllowedError"));
                      },
                      writable: true,
                      configurable: true
                    });
                  } catch (_) {}
                }
                if (navigator.mediaDevices) {
                  try {
                    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
                      value: function() {
                        return Promise.reject(new DOMException("Screen sharing blocked on this platform.", "NotAllowedError"));
                      },
                      writable: true,
                      configurable: true
                    });
                  } catch (_) {}
                }
                if (window.HTMLVideoElement && HTMLVideoElement.prototype) {
                  try {
                    HTMLVideoElement.prototype.requestPictureInPicture = function() {
                      return Promise.reject(new DOMException("Picture-in-picture disabled.", "NotAllowedError"));
                    };
                  } catch (_) {}
                }
              } catch(_) {}
            `,
          }}
        />
        <SecurityShield />
        <LanguageProvider>
          <AuthProvider>
          {children}
        </AuthProvider>
        </LanguageProvider>
        <Script
          id="google-maps-sdk"
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
