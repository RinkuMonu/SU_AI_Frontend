"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Loader2, 
  Sparkles, 
  Wand2, 
  ChevronDown, 
  Share2, 
  Globe, 
  Smile, 
  Package, 
  Users, 
  FileText, 
  Target, 
  MousePointerClick, 
  MessageSquare,
  Sliders,
  Flame,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { GenerateContentRequest } from '@/types/content';
import { getProducts } from '@/services/product.service';

const contentSchema = z.object({
  type: z.string().min(1, "Content Type is required"),
  platform: z.string().min(1, "Platform is required"),
  language: z.string().min(1, "Language is required"),
  tone: z.string().min(1, "Tone is required"),
  productId: z.string().optional(),
  targetAudience: z.string().optional(),
  topic: z.string().optional(),
  callToAction: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

interface ContentGeneratorProps {
  initialType?: string;
  initialProductId?: string;
  onGenerate: (data: GenerateContentRequest) => Promise<void>;
  isLoading: boolean;
}

const PRESET_TEMPLATES = [
  { label: "🔥 Viral Reel Hook", type: "Reel Script", tone: "Promotional", cta: "Link in bio to shop now!" },
  { label: "🛍️ Product Launch", type: "Instagram Post", tone: "Premium", cta: "Shop our new arrival today" },
  { label: "⚡ Flash Sale & Offer", type: "Promotional Content", tone: "Funny", cta: "DM us 'DISCOUNT' for 20% off" },
  { label: "🎉 Festival Greeting", type: "Festival Post", tone: "Emotional", cta: "Wishing you joy and prosperity" },
];

const QUICK_CTAS = [
  "Shop now link in bio",
  "DM us for orders",
  "Limited stock available",
  "Tap the link to explore",
  "Comment YES for exclusive access"
];

const TONES = [
  "Professional",
  "Friendly",
  "Premium",
  "Promotional",
  "Funny",
  "Emotional"
];

export function ContentGenerator({ initialType, initialProductId, onGenerate, isLoading }: ContentGeneratorProps) {
  const [products, setProducts] = useState<any[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: initialType || 'Instagram Post',
      platform: 'Instagram',
      language: 'English',
      tone: 'Professional',
      productId: initialProductId || '',
      targetAudience: '',
      topic: '',
      callToAction: '',
      additionalInstructions: '',
    }
  });

  const selectedPlatform = watch("platform");
  const selectedTone = watch("tone");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        // Fallback silently if mock or API fails
      }
    }
    loadProducts();
  }, []);

  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setValue("type", template.type);
    setValue("tone", template.tone);
    setValue("callToAction", template.cta);
  };

  const onSubmit = async (data: ContentFormValues) => {
    await onGenerate(data as GenerateContentRequest);
  };

  return (
    <Card className="border border-border/80 bg-surface/90 backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden transition-all">
      {/* Decorative ambient gradient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="pb-5 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-pink border border-brand-purple/30 shadow-inner shrink-0">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Generation Settings
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-0.5">
                Configure AI to write exactly what you need.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-pink text-xs font-semibold self-start sm:self-auto">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Copywriter v2.0</span>
          </div>
        </div>

        {/* Quick Inspiration Templates */}
        <div className="mt-4 pt-3 border-t border-border/40">
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-coral" /> Quick Presets
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="text-xs px-2.5 py-1 rounded-lg bg-surface-elevated/70 border border-border text-slate-300 hover:text-white hover:border-brand-purple/50 hover:bg-brand-purple/10 transition-all cursor-pointer font-medium"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Grid: Content Type & Platform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-purple" />
                Content Type <span className="text-rose-400">*</span>
              </Label>
              <div className="relative">
                <select 
                  id="type"
                  className="flex h-11 w-full rounded-xl border border-border bg-surface-elevated/80 px-3.5 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all shadow-sm pr-10"
                  {...register("type")}
                >
                  <option value="Instagram Post" className="bg-[#12141f] text-white">Instagram Post</option>
                  <option value="Instagram Caption" className="bg-[#12141f] text-white">Instagram Caption</option>
                  <option value="Facebook Post" className="bg-[#12141f] text-white">Facebook Post</option>
                  <option value="LinkedIn Post" className="bg-[#12141f] text-white">LinkedIn Post</option>
                  <option value="Promotional Content" className="bg-[#12141f] text-white">Promotional Content</option>
                  <option value="Festival Post" className="bg-[#12141f] text-white">Festival Post</option>
                  <option value="Product Advertisement" className="bg-[#12141f] text-white">Product Advertisement</option>
                  <option value="Reel Script" className="bg-[#12141f] text-white">Reel Script</option>
                  <option value="Ad Copy" className="bg-[#12141f] text-white">Ad Copy</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
              {errors.type && <p className="text-xs text-rose-400">{errors.type.message}</p>}
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-brand-pink" />
                Platform <span className="text-rose-400">*</span>
              </Label>
              <div className="relative">
                <select 
                  id="platform"
                  className="flex h-11 w-full rounded-xl border border-border bg-surface-elevated/80 px-3.5 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all shadow-sm pr-10"
                  {...register("platform")}
                >
                  <option value="Instagram" className="bg-[#12141f] text-white">Instagram</option>
                  <option value="Facebook" className="bg-[#12141f] text-white">Facebook</option>
                  <option value="LinkedIn" className="bg-[#12141f] text-white">LinkedIn</option>
                  <option value="YouTube" className="bg-[#12141f] text-white">YouTube</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
              {errors.platform && <p className="text-xs text-rose-400">{errors.platform.message}</p>}
            </div>
          </div>

          {/* Grid: Language & Tone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Language <span className="text-rose-400">*</span>
              </Label>
              <div className="relative">
                <select 
                  id="language"
                  className="flex h-11 w-full rounded-xl border border-border bg-surface-elevated/80 px-3.5 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all shadow-sm pr-10"
                  {...register("language")}
                >
                  <option value="English" className="bg-[#12141f] text-white">English</option>
                  <option value="Hindi" className="bg-[#12141f] text-white">Hindi</option>
                  <option value="Hinglish" className="bg-[#12141f] text-white">Hinglish</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
              {errors.language && <p className="text-xs text-rose-400">{errors.language.message}</p>}
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                Tone <span className="text-rose-400">*</span>
              </Label>
              <div className="relative">
                <select 
                  id="tone"
                  className="flex h-11 w-full rounded-xl border border-border bg-surface-elevated/80 px-3.5 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all shadow-sm pr-10"
                  {...register("tone")}
                >
                  {TONES.map((t) => (
                    <option key={t} value={t} className="bg-[#12141f] text-white">{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
              {errors.tone && <p className="text-xs text-rose-400">{errors.tone.message}</p>}
            </div>
          </div>

          {/* Tone Quick Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-text-muted mr-1 font-medium">Quick tone:</span>
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setValue("tone", t)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full transition-all cursor-pointer font-medium ${
                  selectedTone === t
                    ? "bg-brand-purple text-white shadow-sm font-semibold"
                    : "bg-surface-elevated text-text-muted hover:text-white border border-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Section: Context (Optional) */}
          <div className="space-y-4 pt-5 border-t border-border/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-coral" />
                Context (Optional)
              </h3>
              <span className="text-[11px] text-text-muted">Helps AI tailor the message</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product */}
              <div className="space-y-2">
                <Label htmlFor="productId" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                  Product
                </Label>
                <div className="relative">
                  <select 
                    id="productId"
                    className="flex h-11 w-full rounded-xl border border-border bg-surface-elevated/80 px-3.5 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all shadow-sm pr-10"
                    {...register("productId")}
                  >
                    <option value="" className="bg-[#12141f] text-white">Select a product...</option>
                    {products.length > 0 ? (
                      products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#12141f] text-white">
                          {p.name} {p.price ? `(₹${p.price})` : ''}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1" className="bg-[#12141f] text-white">Floral Summer Dress</option>
                        <option value="2" className="bg-[#12141f] text-white">Cotton Blend Kurta</option>
                        <option value="3" className="bg-[#12141f] text-white">Denim Jacket</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Target Audience
                </Label>
                <Input 
                  id="targetAudience" 
                  placeholder="e.g. College students in Delhi" 
                  className="h-11 rounded-xl bg-surface-elevated/80 border-border text-white placeholder:text-text-muted/60 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                  {...register("targetAudience")} 
                />
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Topic
                </Label>
                <Input 
                  id="topic" 
                  placeholder="e.g. Launching our new summer collection" 
                  className="h-11 rounded-xl bg-surface-elevated/80 border-border text-white placeholder:text-text-muted/60 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                  {...register("topic")} 
                />
              </div>

              {/* Call To Action */}
              <div className="space-y-2">
                <Label htmlFor="callToAction" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MousePointerClick className="w-3.5 h-3.5 text-rose-400" />
                  Call To Action
                </Label>
                <Input 
                  id="callToAction" 
                  placeholder="e.g. Shop now link in bio" 
                  className="h-11 rounded-xl bg-surface-elevated/80 border-border text-white placeholder:text-text-muted/60 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                  {...register("callToAction")} 
                />
              </div>
            </div>

            {/* Quick CTA Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-text-muted mr-1 font-medium">Quick CTA:</span>
              {QUICK_CTAS.map((cta, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setValue("callToAction", cta)}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-elevated text-slate-300 hover:text-white hover:border-brand-pink/50 hover:bg-brand-pink/10 border border-border transition-all cursor-pointer"
                >
                  {cta}
                </button>
              ))}
            </div>

            {/* Additional Instructions */}
            <div className="space-y-2 pt-2">
              <Label htmlFor="additionalInstructions" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-pink" />
                Additional Instructions
              </Label>
              <textarea 
                id="additionalInstructions" 
                rows={3}
                className="flex w-full rounded-xl border border-border bg-surface-elevated/80 p-3 text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all"
                placeholder="Any specific keywords, hashtags, emojis, or structure you want the AI to follow?"
                {...register("additionalInstructions")}
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-3 flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full sm:w-auto min-w-[200px] h-12 bg-brand-gradient hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-xl shadow-brand-purple/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> 
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-white animate-pulse" /> 
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
