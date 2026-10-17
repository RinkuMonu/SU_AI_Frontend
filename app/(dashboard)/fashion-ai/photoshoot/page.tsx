"use client";

import { useState, useEffect } from "react";
import { FashionService } from "@/services/fashion.service";
import { FashionConfig, FashionProduct, PhotoshootRequest } from "@/types/fashion.types";
import { toast } from "react-toastify";
import { Loader2, Camera, ChevronRight, Shirt } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PhotoshootPage() {
  const router = useRouter();
  const [config, setConfig] = useState<FashionConfig | null>(null);
  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [inputType, setInputType] = useState<"product" | "custom">("custom");

  const [formData, setFormData] = useState<Partial<PhotoshootRequest>>({
    model_type: "female",
    model_style: "fashion",
    pose: "standing",
    background: "studio",
    shot_type: "full_body",
    view: "front",
    category: "saree",
    color: "Red and Gold Multi-color"
  });

  useEffect(() => {
    Promise.all([FashionService.getConfig(), FashionService.getProducts()])
      .then(([cfg, prods]) => {
        setConfig(cfg);
        setProducts(prods);
        if (prods.length > 0) {
          setFormData(p => ({ ...p, product_id: prods[0].id }));
        }
      })
      .catch(() => toast.error("Failed to load initial data"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === "product" && !formData.product_id) {
      return toast.error("Please select a product");
    }
    if (inputType === "custom" && (!formData.category || !formData.color)) {
      return toast.error("Please select a category and specify a color");
    }

    setGenerating(true);
    try {
      const payload: PhotoshootRequest = { ...formData } as PhotoshootRequest;
      
      if (inputType === "custom") {
        delete payload.product_id;
        payload.garment_name = `${payload.color} ${payload.category}`;
      } else {
        delete payload.category;
        delete payload.color;
        delete payload.garment_name;
      }

      await FashionService.generatePhotoshoot(payload);
      toast.success("Photoshoot started successfully!");
      router.push("/fashion-ai/history");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to start photoshoot");
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !config) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>;
  }


  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-brand-purple" />
          AI Photoshoot
        </h1>
        <p className="text-text-muted mt-2">Generate professional fashion photography for your clothing items.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white block">1. Select Garment</label>
              
              <div className="flex bg-surface-elevated p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setInputType("custom")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    inputType === "custom" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
                  }`}
                >
                  Custom Clothing
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("product")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    inputType === "product" ? "bg-brand-purple text-white shadow-sm" : "text-text-muted hover:text-white"
                  }`}
                >
                  My Products
                </button>
              </div>
            </div>

            {inputType === "custom" ? (
              <div className="p-5 border border-border rounded-xl bg-surface-elevated/30 space-y-5 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Clothing Category</label>
                    <select 
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {config.categories.map(c => (
                        <option key={c} value={c}>{c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Color / Pattern</label>
                    <input 
                      type="text"
                      placeholder="e.g. Red, Multi-color, Floral print..."
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all"
                      value={formData.color || ""}
                      onChange={e => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-purple bg-brand-purple/10 p-3 rounded-lg border border-brand-purple/20">
                  <Shirt className="w-4 h-4 flex-shrink-0" />
                  We will generate a highly realistic fashion photo based on the category and color you type!
                </div>
              </div>
            ) : (
              <div className="pt-2">
                {products.length === 0 ? (
                  <div className="p-6 bg-surface-elevated rounded-xl border border-border text-center flex flex-col items-center gap-2">
                    <Shirt className="w-8 h-8 text-text-muted opacity-50" />
                    <p className="text-text-muted">No uploaded products found.</p>
                    <p className="text-xs text-text-muted opacity-70">Use "Custom Clothing" above or upload products in the Products section.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => setFormData({...formData, product_id: p.id})}
                        className={`cursor-pointer border rounded-xl p-2.5 transition-all ${
                          formData.product_id === p.id 
                          ? "border-brand-purple bg-brand-purple/10 shadow-[0_0_15px_rgba(139,92,246,0.15)] ring-1 ring-brand-purple/50" 
                          : "border-border hover:border-text-muted/50 bg-surface hover:bg-surface-elevated"
                        }`}
                      >
                        <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-black/20 mb-3 shadow-inner">
                          {p.image_url ? (
                            <Image src={p.image_url} alt={p.name} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Shirt className="w-6 h-6 text-text-muted opacity-20" /></div>
                          )}
                        </div>
                        <p className="text-xs font-medium text-white truncate text-center px-1">{p.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-5 pt-6 border-t border-border">
            <label className="text-sm font-medium text-white block">2. Model & Style Settings</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Model Gender</label>
                <select 
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple outline-none transition-colors"
                  value={formData.model_type}
                  onChange={e => setFormData({...formData, model_type: e.target.value as any, model_style: config.model_styles[e.target.value as "male"|"female"][0]})}
                >
                  {config.model_types.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-text-muted">Model Style</label>
                <select 
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple outline-none transition-colors"
                  value={formData.model_style}
                  onChange={e => setFormData({...formData, model_style: e.target.value})}
                >
                  {(config.model_styles[formData.model_type as "male"|"female"] || []).map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Pose</label>
                <select 
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple outline-none transition-colors"
                  value={formData.pose}
                  onChange={e => setFormData({...formData, pose: e.target.value as any})}
                >
                  {config.poses.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ').toUpperCase()}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-text-muted">Background</label>
                <select 
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple outline-none transition-colors"
                  value={formData.background}
                  onChange={e => setFormData({...formData, background: e.target.value as any})}
                >
                  {config.backgrounds.map(b => <option key={b} value={b}>{b.replace(/_/g, ' ').toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Shot Type</label>
                <select 
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple outline-none transition-colors"
                  value={formData.shot_type}
                  onChange={e => setFormData({...formData, shot_type: e.target.value as any})}
                >
                  {config.shot_types.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-text-muted">Camera View</label>
                <select 
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2.5 text-white focus:border-brand-purple outline-none transition-colors"
                  value={formData.view}
                  onChange={e => setFormData({...formData, view: e.target.value as any})}
                >
                  {config.views.map(v => <option key={v} value={v}>{v.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={generating || (inputType === "product" && products.length === 0)}
            className="w-full py-4 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40"
          >
            {generating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Starting Generation...</>
            ) : (
              <>Generate Fashion Photoshoot <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
