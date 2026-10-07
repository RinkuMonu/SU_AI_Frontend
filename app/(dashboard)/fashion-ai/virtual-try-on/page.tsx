"use client";

import { useState, useEffect, useRef } from "react";
import { FashionService } from "@/services/fashion.service";

import { FashionProduct, VirtualTryOnRequest, FashionCategory, GenderType } from "@/types/fashion.types";
import { toast } from "react-toastify";
import { Loader2, Shirt, Upload, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VirtualTryOnPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [inputType, setInputType] = useState<"existing" | "custom">("existing");
  const [config, setConfig] = useState<any>(null);

  const [formData, setFormData] = useState<Partial<VirtualTryOnRequest>>({
    person_image_url: "",
    category: "tshirt",
    color: "White",
  });

  useEffect(() => {
    Promise.all([
      FashionService.getProducts().catch(() => []), 
      FashionService.getConfig().catch(() => null)
    ])
      .then(([fashionProds, configData]) => {
        if (configData) setConfig(configData);

        const allProds = fashionProds.filter(p => p.image_url);
        
        setProducts(allProds);
        if (allProds.length > 0) setFormData(p => ({ ...p, product_id: allProds[0].id }));
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await FashionService.uploadPersonImage(file);
      setFormData(prev => ({ ...prev, person_image_url: url }));
      toast.success("Person photo uploaded");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === "existing" && !formData.product_id) return toast.error("Please select a product");
    if (inputType === "custom" && (!formData.category || !formData.color)) return toast.error("Please select category and color");
    if (!formData.person_image_url) return toast.error("Please upload a person's photo");

    setGenerating(true);
    try {
      const payload = { ...formData };
      if (inputType === "custom") {
        delete payload.product_id;
        payload.garment_name = `${payload.color} ${payload.category}`;
      } else {
        delete payload.category;
        delete payload.color;
        delete payload.garment_name;
      }
      
      await FashionService.generateVirtualTryOn(payload as VirtualTryOnRequest);
      toast.success("Virtual try-on started successfully!");
      router.push("/fashion-ai/history?type=tryon");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to start virtual try-on");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Shirt className="w-6 h-6 text-brand-purple" />
          Virtual Try-On
        </h1>
        <p className="text-text-muted mt-2">See how your product looks on a real person while preserving their identity.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <label className="text-sm font-medium text-white block">1. Upload Person Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                formData.person_image_url ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-brand-purple hover:bg-surface-elevated"
              }`}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleFileUpload}
              />
              
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
                  <p className="text-text-muted">Uploading...</p>
                </div>
              ) : formData.person_image_url ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                    <Image src={formData.person_image_url} alt="Person" fill className="object-cover" unoptimized />
                  </div>
                  <p className="text-sm text-brand-purple font-medium">Click to change photo</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Click to upload photo</p>
                    <p className="text-xs text-text-muted mt-1">JPEG, PNG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white block">2. Select Product to Try On</label>
              <div className="flex bg-surface-elevated p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setInputType("existing")}
                  className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                    inputType === "existing" ? "bg-brand-purple text-white" : "text-text-muted hover:text-white"
                  }`}
                >
                  My Products
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("custom")}
                  className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                    inputType === "custom" ? "bg-brand-purple text-white" : "text-text-muted hover:text-white"
                  }`}
                >
                  Custom Clothing
                </button>
              </div>
            </div>
            
            {inputType === "existing" ? (
              products.length === 0 ? (
                <div className="p-4 bg-surface-elevated rounded-lg border border-border text-center text-text-muted">
                  No products found. Please add products in the Products section.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setFormData({...formData, product_id: p.id})}
                      className={`cursor-pointer border rounded-lg p-2 transition-all ${
                        formData.product_id === p.id ? "border-brand-purple bg-brand-purple/10" : "border-border hover:border-text-muted"
                      }`}
                    >
                      <div className="aspect-square relative rounded-md overflow-hidden bg-black/20 mb-2">
                        {p.image_url && <Image src={p.image_url.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}${p.image_url}` : p.image_url} alt={p.name} fill className="object-cover" unoptimized />}
                      </div>
                      <p className="text-xs text-white truncate text-center">{p.name}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 gap-4 bg-surface-elevated p-4 rounded-xl border border-border">
                <div>
                  <label className="text-xs text-text-muted mb-1.5 block">Clothing Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                  >
                    {config?.categories?.map((cat: string) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1.5 block">Color / Pattern</label>
                  <input 
                    type="text"
                    list="color-options"
                    placeholder="e.g. Red and Gold, Floral Blue"
                    value={formData.color} 
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                  <datalist id="color-options">
                    {config?.colors?.map((c: string) => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={generating || (inputType === "existing" && products.length === 0) || !formData.person_image_url}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Starting Generation...</>
            ) : (
              <>Generate Virtual Try-On <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

