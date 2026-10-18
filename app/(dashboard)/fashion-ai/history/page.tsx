"use client";

import { useEffect, useState } from "react";
import { FashionService } from "@/services/fashion.service";
import { GenerationHistoryItem } from "@/types/fashion.types";
import { Loader2, Download, Trash2, Camera, Shirt } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function FashionHistoryPage() {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'photoshoot' | 'tryon'>('all');

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const typeParam = filter === 'all' ? undefined : filter;
      const res = await FashionService.getHistory(typeParam);
      setHistory(res.data);
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'photoshoot' | 'tryon') => {
    if (!confirm("Are you sure you want to delete this generation?")) return;
    try {
      await FashionService.deleteGeneration(id, type);
      toast.success("Deleted successfully");
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `fashion-generation-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Generation History</h1>
          <p className="text-text-muted mt-1">View your previous fashion generations</p>
        </div>
        <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border">
          {(['all', 'photoshoot', 'tryon'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                filter === t 
                  ? "bg-brand-purple text-white" 
                  : "text-text-muted hover:text-white"
              }`}
            >
              {t === 'all' ? 'All' : t === 'photoshoot' ? 'Photoshoots' : 'Virtual Try-On'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-xl">
          <p className="text-text-muted">No generations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map(item => (
            <div key={item.id} className="bg-surface border border-border rounded-xl overflow-hidden group">
              <div className="aspect-[3/4] relative bg-black/20">
                {item.result_image_url ? (
                  <Image 
                    src={item.result_image_url} 
                    alt="Generation result"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted flex-col gap-2">
                    {item.status === 'processing' || item.status === 'pending' ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm">Processing...</span>
                      </>
                    ) : item.status === 'failed' ? (
                      <span className="text-sm text-red-400">Generation Failed</span>
                    ) : (
                      <span className="text-sm">No image</span>
                    )}
                  </div>
                )}
                
                {/* Overlay Actions */}
                {item.result_image_url && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button 
                      onClick={() => handleDownload(item.result_image_url!)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, item.type)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                {/* Type Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-medium text-white">
                  {item.type === 'photoshoot' ? (
                    <><Camera className="w-3 h-3" /> Photoshoot</>
                  ) : (
                    <><Shirt className="w-3 h-3" /> Try-On</>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-medium text-white truncate mb-1">
                  {item.product_name || "Unknown Product"}
                </h3>
                <p className="text-xs text-text-muted">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
                {item.type === 'photoshoot' && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.model_type && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted">{item.model_type}</span>}
                    {item.pose && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted">{item.pose}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
