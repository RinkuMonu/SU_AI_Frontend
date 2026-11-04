"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Globe, ArrowRight, Check, ShoppingBag, Phone, MapPin, MessageSquare, ExternalLink } from "lucide-react";
import { websiteBuilderService, SiteDetailsResponse, WebsiteSection, WebsiteSectionItem } from "@/services/website-builder.service";

const resolveImageUrl = (
  explicitUrl: string | undefined,
  contextQuery: string,
  width = 800,
  height = 600
): string => {
  if (explicitUrl && typeof explicitUrl === "string" && explicitUrl.trim() !== "") {
    if (!explicitUrl.includes("photo-1551434678-e076c223a692") && !explicitUrl.includes("source.unsplash.com")) {
      return explicitUrl.trim();
    }
  }
  const cleanContext = (contextQuery || "business storefront").trim();
  const encoded = encodeURIComponent(cleanContext);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`;
};

export default function PreviewWebsite() {
  const params = useParams();
  const siteId = params.id as string;
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePageName, setActivePageName] = useState("Home");

  useEffect(() => {
    async function fetchSite() {
      try {
        const data = await websiteBuilderService.getSite(siteId);
        setSiteData(data);
      } catch (e: any) {
        console.error("Failed to load site preview", e);
        setError(e?.response?.data?.detail || e.message || "Failed to load website preview.");
      } finally {
        setLoading(false);
      }
    }
    if (siteId) {
      fetchSite();
    }
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-300 font-medium text-sm">Loading website preview...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-50 text-gray-800 p-6 text-center">
        <Globe size={48} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Website Not Found</h1>
        <p className="text-gray-500 max-w-md">{error || "The website preview you are looking for does not exist or has expired."}</p>
      </div>
    );
  }

  const pages = siteData.pages || [];
  const activePage = pages.find((p: any) => p.name?.toLowerCase() === activePageName.toLowerCase()) || pages[0] || {};
  const sections = activePage.sections || [];
  const businessName = siteData.business_name || (siteData.business_id && siteData.business_id !== "None" ? siteData.business_id : "My Business");
  const businessCategory = siteData.business_category || "";
  const primaryColor = siteData.theme?.primary || "#4f46e5";
  const buttonColor = siteData.theme?.button_color || primaryColor;
  const buttonTextColor = siteData.theme?.button_text_color || "#ffffff";
  const buttonRadius = siteData.theme?.button_radius || "9999px";
  const fontFamily = siteData.theme?.font_family || siteData.theme?.font || "'Outfit', sans-serif";
  const logoUrl = typeof siteData.logo === "string" ? siteData.logo : siteData.logo?.url || null;

  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-800 selection:bg-purple-600 selection:text-white"
      style={{ fontFamily }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
      ` }} />
      {/* Header */}
      <header className="w-full py-5 px-8 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-10 w-auto object-contain" />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              {businessName.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {businessName}
          </h1>
        </div>
        <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto py-1">
          {pages.map((p: any, i: number) => {
            const pageName = p.name || `Page ${i + 1}`;
            const isActive = activePageName.toLowerCase() === pageName.toLowerCase();
            return (
              <button
                key={i}
                onClick={() => setActivePageName(pageName)}
                className={`font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive ? "text-purple-600 border-b-2 border-purple-600 pb-1" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                {pageName}
              </button>
            );
          })}
          <a
            href="#contact"
            className="px-4 sm:px-5 py-1.5 sm:py-2.5 font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap shrink-0 hover:opacity-90"
            style={{ backgroundColor: buttonColor, color: buttonTextColor, borderRadius: buttonRadius }}
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {sections.length > 0 ? (
          sections.map((section: WebsiteSection, index: number) => {
            const sectionType = (section.type || "section").toLowerCase();
            if (sectionType === "navbar" || sectionType === "footer") return null;
            const sTitle = section.title || section.name || "";
            const sSubtitle = section.subtitle || "";
            const sDesc = section.description || section.content || "";

            // 1. HERO SECTION
            if (sectionType === "hero") {
              const heroQuery = `${businessName} ${sTitle || "hero banner"}`.trim();
              const heroImg = resolveImageUrl(section.image_url, heroQuery, 1200, 600);

              return (
                <section key={index} className="relative py-28 px-8 overflow-hidden bg-gray-900 text-white flex items-center justify-center min-h-[500px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay scale-105"
                    style={{ backgroundImage: `url(${heroImg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-gray-900/90" />
                  <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight">
                      {sTitle}
                    </h2>
                    {sSubtitle && (
                      <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
                        {sSubtitle}
                      </p>
                    )}
                    <div className="pt-4 flex justify-center gap-4">
                      {section.cta ? (
                        <a
                          href="#contact"
                          className="px-9 py-4 font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          style={{ backgroundColor: buttonColor, color: buttonTextColor, borderRadius: buttonRadius }}
                        >
                          {section.cta} <ArrowRight size={20} />
                        </a>
                      ) : (
                        <a
                          href="#contact"
                          className="px-9 py-4 font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          style={{ backgroundColor: buttonColor, color: buttonTextColor, borderRadius: buttonRadius }}
                        >
                          Explore Offerings <ArrowRight size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </section>
              );
            }

            // 2. PRODUCTS / BOUQUETS / MENU / CATALOG / ITEMS
            if (
              sectionType === "products" ||
              sectionType === "menu" ||
              sectionType === "bouquets" ||
              sectionType === "catalog" ||
              sectionType === "items" ||
              sectionType === "offerings"
            ) {
              const items = section.items || [];
              return (
                <section key={index} className="w-full py-20 px-8 bg-gray-50 border-b border-gray-100">
                  <div className="max-w-6xl mx-auto text-center">
                    {sTitle && <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">{sTitle}</h2>}
                    {sSubtitle && <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">{sSubtitle}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
                      ${items.map((item: WebsiteSectionItem, itemIdx: number) => {
                        const itemTitle = item.title || item.name || `Item ${itemIdx + 1}`;
                        const itemQuery = `${businessName} ${itemTitle}`.trim();
                        const itemImg = resolveImageUrl(item.image_url, itemQuery, 600, 450);

                        return (
                          <div
                            key={itemIdx}
                            className="flex flex-col bg-white rounded-2xl shadow-xs border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden"
                          >
                            <div className="w-full h-52 bg-gray-100 relative overflow-hidden">
                              <img src={itemImg} alt={itemTitle} className="w-full h-full object-cover" loading="lazy" />
                              {item.price && (
                                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow">
                                  {item.price}
                                </span>
                              )}
                            </div>
                            <div className="p-6 flex flex-col justify-between flex-1 space-y-3">
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg">{itemTitle}</h3>
                                {item.description && <p className="text-gray-600 text-sm leading-relaxed mt-1">{item.description}</p>}
                              </div>
                              <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                {item.price ? <span className="text-lg font-bold text-purple-600">{item.price}</span> : <span></span>}
                                <button
                                  onClick={() => alert(`Inquiry submitted for ${itemTitle}`)}
                                  className="px-4 py-2 text-xs font-semibold shadow-xs transition hover:opacity-90 cursor-pointer"
                                  style={{ backgroundColor: buttonColor, color: buttonTextColor, borderRadius: buttonRadius }}
                                >
                                  Inquire
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            }

            // 3. GALLERY / PORTFOLIO
            if (sectionType === "gallery" || sectionType === "portfolio") {
              const items = section.items || [];
              return (
                <section key={index} className="w-full py-20 px-8 bg-white border-b border-gray-100">
                  <div className="max-w-6xl mx-auto text-center">
                    {sTitle && <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">{sTitle}</h2>}
                    {sSubtitle && <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">{sSubtitle}</p>}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {items.map((item: WebsiteSectionItem, itemIdx: number) => {
                        const itemTitle = item.title || item.name || `Photo ${itemIdx + 1}`;
                        const itemQuery = `${businessName} ${itemTitle}`.trim();
                        const itemImg = resolveImageUrl(item.image_url, itemQuery, 500, 500);

                        return (
                          <div key={itemIdx} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 shadow-xs">
                            <img src={itemImg} alt={itemTitle} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                              <span className="text-white text-xs font-semibold">{itemTitle}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            }

            // 4. STATS / METRICS BAR
            if (sectionType === "stats" || sectionType === "metrics") {
              const items = section.items || [];
              return (
                <section key={index} className="w-full py-12 px-8 bg-gray-50 border-b border-gray-100">
                  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {items.map((stat: any, i: number) => (
                      <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs">
                        <div className="text-3xl md:text-4xl font-extrabold mb-1" style={{ color: primaryColor }}>
                          {stat.value || "100%"}
                        </div>
                        <div className="text-sm font-bold text-gray-900">{stat.label || stat.title || "Quality"}</div>
                        {stat.description && <p className="text-xs text-gray-500 mt-1">{stat.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // 5. TESTIMONIALS / REVIEWS
            if (sectionType === "testimonials" || sectionType === "reviews") {
              const items = section.items || [];
              return (
                <section key={index} className="w-full py-20 px-8 bg-gray-50/70 border-b border-gray-100">
                  <div className="max-w-6xl mx-auto text-center">
                    <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 uppercase tracking-wider bg-purple-100 text-purple-700">
                      Customer Reviews
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">
                      {sTitle || "What Our Customers Say"}
                    </h2>
                    {sSubtitle && <p className="text-base text-gray-600 mb-12 max-w-2xl mx-auto">{sSubtitle}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
                      {items.map((item: any, i: number) => {
                        const stars = "★".repeat(item.rating || 5);
                        return (
                          <div key={i} className="flex flex-col justify-between bg-white rounded-2xl shadow-xs border border-gray-100 p-8 space-y-4">
                            <div>
                              <div className="text-amber-400 text-lg mb-3">{stars}</div>
                              <p className="text-gray-700 text-sm leading-relaxed italic">"{item.quote || item.text || item.description}"</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {(item.name || "Customer").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">{item.name || "Client"}</h4>
                                <p className="text-xs text-gray-500">{item.role || "Verified Client"}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            }

            // 6. FAQ
            if (sectionType === "faq" || sectionType === "faqs") {
              const items = section.items || [];
              return (
                <section key={index} className="w-full py-20 px-8 bg-white border-b border-gray-100">
                  <div className="max-w-5xl mx-auto text-center">
                    <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 uppercase tracking-wider bg-purple-100 text-purple-700">
                      Common Questions
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">
                      {sTitle || "Frequently Asked Questions"}
                    </h2>
                    {sSubtitle && <p className="text-base text-gray-600 mb-12 max-w-2xl mx-auto">{sSubtitle}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-8">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100">
                          <h3 className="font-bold text-gray-900 text-base mb-2 flex items-start gap-2">
                            <span style={{ color: primaryColor }} className="font-black">Q.</span>
                            <span>{item.question || item.title}</span>
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed pl-5">{item.answer || item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            // 7. CTA BANNER
            if (sectionType === "cta" || sectionType === "banner") {
              return (
                <section
                  key={index}
                  className="w-full py-20 px-8 text-center text-white relative overflow-hidden"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">{sTitle || `Ready to experience ${businessName}?`}</h2>
                    {(sSubtitle || sDesc) && (
                      <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                        {sSubtitle || sDesc}
                      </p>
                    )}
                    <div className="pt-4 flex justify-center">
                      <a
                        href="#contact"
                        className="px-8 py-3.5 font-bold text-base shadow-xl hover:opacity-90 transition cursor-pointer"
                        style={{ backgroundColor: buttonColor, color: buttonTextColor, borderRadius: buttonRadius }}
                      >
                        {section.cta || "Get in Touch Today"}
                      </a>
                    </div>
                  </div>
                </section>
              );
            }

            // 8. GENERIC SECTION (Features, Services, About, etc.)
            const items = section.items || [];
            return (
              <section key={index} className={`w-full py-20 px-8 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <div className="max-w-6xl mx-auto text-center">
                  {sTitle && <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">{sTitle}</h2>}
                  {sSubtitle && <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{sSubtitle}</p>}
                  {sDesc && <p className="text-base text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">{sDesc}</p>}

                  {items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
                      {items.map((item: WebsiteSectionItem, i: number) => {
                        const itemTitle = item.title || item.name || `Feature ${i + 1}`;
                        const itemDesc = item.description || "";
                        const itemQuery = `${businessName} ${itemTitle}`.trim();
                        const itemImg = item.image_url ? resolveImageUrl(item.image_url, itemQuery, 600, 400) : null;

                        return (
                          <div key={i} className="flex flex-col bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-3">
                            {itemImg && (
                              <div className="w-full h-44 rounded-xl overflow-hidden mb-2">
                                <img src={itemImg} alt={itemTitle} className="w-full h-full object-cover" loading="lazy" />
                              </div>
                            )}
                            <h3 className="font-bold text-gray-900 text-lg">{itemTitle}</h3>
                            {itemDesc && <p className="text-gray-600 text-sm leading-relaxed">{itemDesc}</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          })
        ) : (
          <div className="py-24 text-center text-gray-500">No content available for this page.</div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-950 text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 sm:py-16 px-6 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left">
            {/* Col 1: Brand & Logo */}
            <div>
              <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                {logoUrl ? (
                  <img src={logoUrl} alt={businessName} className="h-8 w-auto object-contain rounded-md" />
                ) : (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {businessName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{businessName}</h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-sm mx-auto sm:mx-0">
                {siteData.tagline || (businessCategory ? `Dedicated to excellence and authentic quality in ${businessCategory}.` : "Quality products and exceptional service tailored to you.")}
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
                Pages & Links
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {pages.map((p: any, i: number) => {
                  const pName = p.name || `Page ${i + 1}`;
                  const isActive = activePageName.toLowerCase() === pName.toLowerCase();
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePageName(pName);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`transition cursor-pointer ${
                          isActive ? "text-white font-bold" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {pName}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Col 3: About & Inquiries */}
            <div className="sm:col-span-2 md:col-span-1">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
                About & Inquiries
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-400 mb-4">
                {businessCategory
                  ? `${businessName} is your trusted destination for ${businessCategory}. Committed to providing exceptional craftsmanship, personal care, and customer satisfaction.`
                  : `At ${businessName}, we believe in delivering genuine value and outstanding service for every customer.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  const contactPage = pages.find((p: any) => p.name?.toLowerCase() === "contact");
                  if (contactPage) {
                    setActivePageName(contactPage.name);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg transition hover:opacity-90 shadow-sm cursor-pointer"
                style={{ backgroundColor: buttonColor, color: buttonTextColor, borderRadius: buttonRadius }}
              >
                Contact & Inquiries
              </button>
            </div>
          </div>

          <div className="border-t border-gray-900 mt-10 sm:mt-14 pt-6 sm:pt-8 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
