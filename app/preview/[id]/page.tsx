"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Globe, Monitor, Tablet, Smartphone, ArrowLeft } from "lucide-react";
import { websiteBuilderService } from "@/services/website-builder.service";
import { generateHtmlFromJSON } from "@/lib/website-generator";

export default function PreviewWebsite() {
  const params = useParams();
  const siteId = params.id as string;
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    async function fetchSite() {
      try {
        if (siteId && siteId !== "preview" && siteId !== "demo") {
          try {
            const data = await websiteBuilderService.getSite(siteId);
            const actual = (data as any)?.generatedSiteData || (data as any)?.site_data || data;
            if (actual && ((actual.pages && actual.pages.length > 0) || actual.business_name)) {
              setSiteData(actual);
              setLoading(false);
              return;
            }
          } catch (e: any) {
            console.warn("Backend getSite error, checking local cached site", e);
          }
        }
      } catch (e: any) {
        console.warn("Error in fetchSite", e);
      }

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("website_builder_site_data");
          if (stored) {
            const parsed = JSON.parse(stored);
            const actual = parsed?.generatedSiteData || parsed?.site_data || parsed;
            if (actual && ((actual.pages && actual.pages.length > 0) || actual.business_name)) {
              setSiteData(actual);
              setLoading(false);
              return;
            }
          }
        } catch (storageErr) {
          console.warn("Error reading localStorage website data", storageErr);
        }
      }

      setError("The website preview could not be loaded. Please ensure your website has been generated in the Website Builder.");
      setLoading(false);
    }

    if (siteId) {
      fetchSite();
    } else {
      setLoading(false);
    }
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-300 font-medium text-sm">Loading website preview...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-950 text-gray-200 p-6 text-center">
        <Globe size={48} className="text-purple-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">Website Not Found</h1>
        <p className="text-gray-400 max-w-md mb-6">{error || "The website preview you are looking for does not exist or has expired."}</p>
        <Link
          href="/website-builder"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition"
        >
          <ArrowLeft size={16} /> Back to Website Builder
        </Link>
      </div>
    );
  }

  const actualData = siteData?.generatedSiteData || siteData?.site_data || siteData || {};
  const bName = actualData.business_name || "Your Website";
  const htmlContent = generateHtmlFromJSON(actualData, viewMode);

  return (
    <div className="w-full h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top Controls Toolbar */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/website-builder"
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition"
            title="Back to Website Builder"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-sm sm:text-base text-white tracking-tight">{bName}</span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Preview
            </span>
          </div>
        </div>

        {/* 3 View Modes Switcher */}
        <div className="flex items-center bg-gray-950/80 p-1 rounded-xl border border-gray-800 gap-1">
          <button
            type="button"
            onClick={() => setViewMode("desktop")}
            title="Desktop view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "desktop"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Monitor size={14} />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("tablet")}
            title="Tablet view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "tablet"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Tablet size={14} />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mobile")}
            title="Mobile view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "mobile"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Action Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/website-builder"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 transition"
          >
            Edit Site
          </Link>
        </div>
      </header>

      {/* Viewport Frame */}
      <main className="flex-1 bg-gray-950 overflow-auto flex items-center justify-center p-0 md:p-3">
        <div
          className={`h-full transition-all duration-300 bg-white ${
            viewMode === "desktop"
              ? "w-full"
              : viewMode === "tablet"
              ? "w-[768px] max-w-full rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50"
              : "w-[375px] max-w-full rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-800"
          }`}
          style={{ height: viewMode === "desktop" ? "100%" : "calc(100vh - 84px)" }}
        >
          <iframe
            key={viewMode}
            title={`${bName} Live Preview (${viewMode})`}
            srcDoc={htmlContent}
            className="w-full h-full border-0"
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>
      </main>
    </div>
  );
}
