import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { SecurityShield } from "@/components/security/SecurityShield";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden min-h-screen`} suppressHydrationWarning>
        <script
          id="anti-screenshare-early"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Suppress third-party wasm-bindgen false-positive deprecation warnings
                if (typeof console !== "undefined" && console.warn) {
                  const _origWarn = console.warn;
                  console.warn = function() {
                    if (arguments.length > 0 && typeof arguments[0] === "string" && arguments[0].indexOf("deprecated parameters for the initialization function") !== -1) {
                      return;
                    }
                    return _origWarn.apply(console, arguments);
                  };
                }
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

        {/* Hidden Google Translate Mount */}
        <div id="google_translate_element" aria-hidden="true" className="hidden" />

        {/* Google Translate Init Script */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,mr,gu,pa,bn,ta,te,kn,ml',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `,
          }}
        />
        <Script
          id="google-translate-script"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* Google Translate Top Banner Auto-remover */}
        <Script
          id="google-translate-remover"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function purgeBanner() {
                  if (document.body && document.body.style.top && document.body.style.top !== '0px') {
                    document.body.style.setProperty('top', '0px', 'important');
                  }
                  if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== '0px') {
                    document.documentElement.style.setProperty('top', '0px', 'important');
                  }
                  var banners = document.querySelectorAll('body > .skiptranslate, iframe.goog-te-banner-frame, iframe[class*="VIpgJd"], .VIpgJd-ZVi9od-ORHb-OEVmcd, iframe[id*=".container"]');
                  for (var i = 0; i < banners.length; i++) {
                    banners[i].style.setProperty('display', 'none', 'important');
                    banners[i].style.setProperty('visibility', 'hidden', 'important');
                    banners[i].style.setProperty('height', '0px', 'important');
                    banners[i].style.setProperty('opacity', '0', 'important');
                  }
                }
                if (typeof window !== 'undefined') {
                  var observer = new MutationObserver(purgeBanner);
                  if (document.documentElement) {
                    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
                  }
                  window.addEventListener('DOMContentLoaded', purgeBanner);
                  window.addEventListener('load', purgeBanner);
                  setInterval(purgeBanner, 150);
                }
              })();
            `,
          }}
        />

        <Script
          id="google-maps-sdk"
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
