import type { Metadata, Viewport } from "next";
import { Inter, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { SecurityShield } from "@/components/security/SecurityShield";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} font-sans antialiased bg-background text-foreground min-h-screen`} suppressHydrationWarning>
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

                // Protect React DOM reconciliation from Google Translate node mutation crashes (removeChild / insertBefore)
                if (typeof Node === "function" && Node.prototype) {
                  var origRemoveChild = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    try {
                      if (child.parentNode !== this) {
                        if (child.parentNode) {
                          return child.parentNode.removeChild(child);
                        }
                        return child;
                      }
                      return origRemoveChild.apply(this, arguments);
                    } catch (e) {
                      try {
                        if (child && child.parentNode) {
                          return child.parentNode.removeChild(child);
                        }
                      } catch (_) {}
                      return child;
                    }
                  };

                  var origInsertBefore = Node.prototype.insertBefore;
                  Node.prototype.insertBefore = function(newNode, referenceNode) {
                    try {
                      if (referenceNode && referenceNode.parentNode !== this) {
                        if (referenceNode.parentNode) {
                          return referenceNode.parentNode.insertBefore(newNode, referenceNode);
                        }
                        return this.appendChild(newNode);
                      }
                      return origInsertBefore.apply(this, arguments);
                    } catch (e) {
                      try {
                        return this.appendChild(newNode);
                      } catch (_) {
                        return newNode;
                      }
                    }
                  };
                }

                // Suppress browser autofill & password manager extension hydration mismatch (fdprocessedid)
                if (typeof Element !== "undefined" && Element.prototype) {
                  var origSetAttribute = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, value) {
                    if (name === "fdprocessedid") {
                      return;
                    }
                    return origSetAttribute.apply(this, arguments);
                  };
                }

                if (typeof console !== "undefined" && console.error) {
                  var _origError = console.error;
                  console.error = function() {
                    for (var i = 0; i < arguments.length; i++) {
                      var arg = arguments[i];
                      if (typeof arg === "string" && (arg.indexOf("fdprocessedid") !== -1 || (arg.indexOf("hydration-mismatch") !== -1 && arg.indexOf("extension") !== -1))) {
                        return;
                      }
                    }
                    return _origError.apply(console, arguments);
                  };
                }

                if (typeof MutationObserver !== "undefined") {
                  try {
                    var fdObserver = new MutationObserver(function(mutations) {
                      for (var i = 0; i < mutations.length; i++) {
                        var m = mutations[i];
                        if (m.type === "attributes" && m.attributeName === "fdprocessedid" && m.target && m.target.removeAttribute) {
                          m.target.removeAttribute("fdprocessedid");
                        }
                      }
                    });
                    if (document.documentElement) {
                      fdObserver.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["fdprocessedid"] });
                    }
                  } catch (_) {}
                }
              } catch(_) {}
            `,
          }}
        />
        <SmoothScrollProvider>
          <SecurityShield />
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </SmoothScrollProvider>

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
                    includedLanguages: 'en,hi,mr,gu,pa,bn,ur,ne,ta,te,kn,ml',
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
