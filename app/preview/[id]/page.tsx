"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Globe, ArrowRight, Check, ShoppingBag, Phone, MapPin, MessageSquare } from "lucide-react";

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
        const res = await fetch(`http://127.0.0.1:8000/api/v1/website-builder/site/${siteId}`);
        if (!res.ok) throw new Error("Failed to fetch site data");
        const data = await res.json();
        setSiteData(data);
      } catch (e: any) {
        setError(e.message);
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
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-brand-purple border-t-transparent"></div>
          <p className="text-gray-300 font-medium">Loading website preview...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-50 text-gray-800">
        <Globe size={48} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Website Not Found</h1>
        <p className="text-gray-500">The website preview you are looking for does not exist or failed to load.</p>
      </div>
    );
  }

  const pages = siteData.pages || [];
  const activePage = pages.find((p: any) => p.name?.toLowerCase() === activePageName.toLowerCase()) || pages[0] || {};
  const sections = activePage.sections || [];
  const businessName = siteData.business_name || (siteData.business_id && siteData.business_id !== "None" ? siteData.business_id : "Your Brand");

  const getItemData = (item: any) => {
    if (typeof item === "object" && item !== null) {
      return {
        title: item.title || item.name || "Feature",
        description: item.description || "",
        imagePrompt: item.image_prompt || item.title || item.name || ""
      };
    }
    const itemStr = String(item);
    const parts = itemStr.split(":");
    if (parts.length > 1) {
      return {
        title: parts[0].trim(),
        description: parts.slice(1).join(":").trim(),
        imagePrompt: parts[0].trim()
      };
    }
    return {
      title: itemStr,
      description: "",
      imagePrompt: itemStr
    };
  };

  const getImageUrl = (prompt: string, idx: number) => {
    const fullQuery = `${businessName} ${activePageName} ${prompt}`.trim();
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullQuery)}?width=600&height=400&nologo=true`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-brand-purple selection:text-white">
      {/* Header */}
      <header className="w-full py-5 px-8 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            {businessName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
            {businessName}
          </h1>
        </div>
        <nav className="hidden md:flex gap-8">
          {pages.map((p: any, i: number) => (
            <a 
              key={i} 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActivePageName(p.name || `Page ${i + 1}`); }} 
              className={`font-semibold text-sm transition-all duration-200 hover:text-brand-purple ${activePageName === (p.name || `Page ${i + 1}`) ? "text-brand-purple border-b-2 border-brand-purple pb-1" : "text-gray-600"}`}
            >
              {p.name || `Page ${i + 1}`}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {sections.length > 0 ? (
          sections.map((section: any, index: number) => {
            if (section.type === "hero") {
              const heroBg = `https://image.pollinations.ai/prompt/${encodeURIComponent(businessName + " " + (section.title || "hero banner"))}?width=1200&height=500&nologo=true`;
              return (
                <section key={index} className="relative py-28 px-8 overflow-hidden bg-gray-900 text-white flex items-center justify-center min-h-[480px]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay scale-105 transition-transform duration-1000"
                    style={{ backgroundImage: `url(${heroBg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-900/90" />
                  <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight">
                      {section.title}
                    </h2>
                    {section.subtitle && (
                      <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
                        {section.subtitle}
                      </p>
                    )}
                    {section.cta && (
                      <div className="pt-4">
                        <button 
                          onClick={() => alert(`Action: ${section.cta}`)}
                          className="px-9 py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-brand-purple/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                          {section.cta} <ArrowRight size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            return (
              <section key={index} className={`w-full py-20 px-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="max-w-6xl mx-auto text-center">
                  {section.title && (
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">
                      {section.title}
                    </h2>
                  )}
                  {section.subtitle && (
                    <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                      {section.subtitle}
                    </p>
                  )}

                  {section.items && section.items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
                      {section.items.map((rawItem: any, i: number) => {
                        const item = getItemData(rawItem);
                        const imgUrl = getImageUrl(item.imagePrompt, i);

                        return (
                          <div 
                            key={i} 
                            onClick={() => alert(`Selected: ${item.title}`)}
                            className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden group"
                          >
                            <div className="w-full h-52 bg-gray-200 relative overflow-hidden">
                              <img 
                                src={imgUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                loading="lazy" 
                                onError={(e: any) => {
                                  e.currentTarget.src = `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(businessName + " " + item.title)}`;
                                }}
                              />
                            </div>
                            <div className="p-6 flex flex-col justify-between flex-1 space-y-3">
                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-purple transition-colors">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
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
      <footer className="w-full py-12 bg-gray-900 text-gray-400 text-center border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-extrabold text-white text-xl">{businessName}</div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
