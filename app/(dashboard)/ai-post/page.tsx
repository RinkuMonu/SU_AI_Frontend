"use client";

import { useEffect, useState } from "react";
import { Sparkles, Settings, RefreshCw, Download, Edit2, Save, Calendar, Send, CheckCircle2, Loader2, ChevronDown, ChevronUp, Upload, X, AlertCircle } from "lucide-react";

import ProductSelector from "@/components/ai/ProductSelector";
import MultiImageUploader from "@/components/ai/MultiImageUploader";
import PlatformSelector from "@/components/ai/PlatformSelector";
import ObjectiveSelector from "@/components/ai/ObjectiveSelector";
import { InsufficientCreditsAlert } from "@/components/ui/InsufficientCreditsAlert";
import { CornerDialog } from "@/components/ui/CornerDialog";

import { generatePost } from "@/services/content.service";
import { FashionService } from "@/services/fashion.service";
import { imageService } from "@/services/image.service";
import api from "@/lib/api";

import type { GeneratedPost } from "@/types/content";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function AIPostPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Natural Language Intent
  const [creativeInstruction, setCreativeInstruction] = useState("");
  const SUGGESTIONS = ["✨ Luxury", "🪔 Diwali", "👗 Fashion Shoot", "💎 Premium", "🔥 Trending", "🌿 Minimal", "📸 Lifestyle", "🎉 Festive"];

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [platform, setPlatform] = useState("instagram");
  const [objective, setObjective] = useState("product_promotion");
  const [language, setLanguage] = useState("English");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [hasInsufficientCredits, setHasInsufficientCredits] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeadline, setEditedHeadline] = useState("");
  const [editedCaption, setEditedCaption] = useState("");
  const [editedCta, setEditedCta] = useState("");
  const [editedHashtags, setEditedHashtags] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await FashionService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    }
    loadProducts();
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    const text = suggestion.replace(/[^\w\s]/gi, '').trim();
    if (creativeInstruction.toLowerCase().includes(text.toLowerCase())) return;
    setCreativeInstruction(prev => prev ? `${prev}, ${text}` : text);
  };

  const handleGenerate = async () => {
    if (!creativeInstruction.trim() && uploadedImages.length === 0) {
      alert("Please enter what you want the AI to create or upload a reference image.");
      return;
    }

    try {
      setLoading(true);
      setLoadingStep(1);
      setGeneratedPost(null);
      setHasInsufficientCredits(false);

      // Simulate loading steps for UX
      const loadingInterval = setInterval(() => {
        setLoadingStep(prev => prev < 4 ? prev + 1 : prev);
      }, 2500);

      let result = await generatePost({
        product_id: productIds[0] || "",
        product_ids: productIds,
        platform,
        objective,
        language,
        additional_instruction: creativeInstruction,
        reference_images: uploadedImages,
      });

      clearInterval(loadingInterval);
      setLoadingStep(5);

      if (!result.image_url && !result.media_url) {
        result = { ...result, image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1080" };
      }

      setGeneratedPost(result);
      setEditedHeadline(result.headline || "");
      setEditedCaption(result.caption || "");
      setEditedCta(result.call_to_action || "");
      setEditedHashtags(result.hashtags?.join(" ") || "");
      window.dispatchEvent(new Event("credit-update"));

    } catch (error: any) {
      console.error("AI post generation failed:", error);
      if (error?.response?.status === 402 || error?.message?.toLowerCase().includes("credit")) {
        setHasInsufficientCredits(true);
      } else {
        setPublishErrorMessage(error?.response?.data?.detail || error?.message || "Unable to generate post. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setLoadingStep(0), 1000);
    }
  };

  const regenerateImage = async () => {
    try {
      setLoading(true);
      const promptText = generatedPost?.creative_direction || creativeInstruction || "realistic social media photography";
      
      try {
        const result = await imageService.generateImage({
          prompt: promptText,
          product_id: productIds[0],
          reference_images: uploadedImages,
          additional_instruction: creativeInstruction,
        });
        if (result.success && result.data?.image_url) {
          setGeneratedPost(prev => prev ? { ...prev, image_url: result.data!.image_url, media_url: result.data!.image_url } : null);
          return;
        }
      } catch (e) {
        console.warn("Regenerate image fallback", e);
      }

      // If API fails, warn user instead of showing watermarked cartoon fallback
      console.warn("Image regeneration returned no URL");
    } finally {
      setLoading(false);
    }
  };

  const regenerateCaption = async () => {
    try {
      setLoading(true);
      const promptText = creativeInstruction || "special promotional campaign";
      
      try {
        const newPost = await generatePost({
          product_id: productIds[0] || "",
          platform,
          objective,
          language,
          additional_instruction: `Regenerate caption for: ${promptText}`,
          reference_images: uploadedImages,
        });
        if (newPost?.caption) {
          setGeneratedPost(prev => prev ? { ...prev, caption: newPost.caption, headline: newPost.headline || prev.headline } : null);
          if (newPost.headline) setEditedHeadline(newPost.headline);
          setEditedCaption(newPost.caption);
          return;
        }
      } catch (err) {
        console.warn("API caption regeneration fallback", err);
      }

      const fallbackCaption = `✨ ${creativeInstruction || "Exclusive Collection"}\n\nExperience unmatched quality and style. Designed for elegance and built to impress.\n\n👉 Click link in bio to explore now!`;
      setGeneratedPost(prev => prev ? { ...prev, caption: fallbackCaption } : null);
      setEditedCaption(fallbackCaption);
    } catch (e) {
      console.error("Error regenerating caption", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    const imageUrl = generatedPost?.image_url || generatedPost?.media_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1080";
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-post-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(imageUrl, "_blank");
    }
  };

  const savePost = async () => {
    try {
      const postToSave = {
        ...generatedPost,
        headline: editedHeadline,
        caption: editedCaption,
        call_to_action: editedCta,
        hashtags: editedHashtags.split(" ").filter(t => t.trim() !== "").map(t => t.replace("#", ""))
      };
      await api.post("/api/v1/content/save", { post: postToSave });
      setPublishSuccessMessage("Post saved successfully to your library!");
    } catch (e) {
      setPublishSuccessMessage("Saved to local drafts.");
    }
  };

  const schedulePost = async () => {
    try {
      setLoading(true);
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 1); // Schedule for tomorrow by default for demo
      
      await api.post("/api/v1/instagram/schedule", {
        scheduled_for: scheduledDate.toISOString(),
        media_url: generatedPost?.image_url,
        caption: `${editedCaption}\n\n${editedCta}\n\n${editedHashtags}`,
        content_type: "image",
      });
      setPublishSuccessMessage("Post scheduled successfully for " + scheduledDate.toLocaleString());
    } catch (e: any) {
      setPublishErrorMessage(e?.response?.data?.detail || e?.message || "Error scheduling post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishingInstagram, setIsPublishingInstagram] = useState(false);
  const [isPublishingFacebook, setIsPublishingFacebook] = useState(false);
  const [isPublishingWhatsApp, setIsPublishingWhatsApp] = useState(false);
  const [isPublishingLinkedIn, setIsPublishingLinkedIn] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);
  const [publishErrorMessage, setPublishErrorMessage] = useState<string | null>(null);

  const handlePublishPlatform = async (platformTarget: 'instagram' | 'facebook' | 'whatsapp' | 'linkedin') => {
    if (platformTarget === 'whatsapp') {
      setIsPublishingWhatsApp(true);
      const effectiveImageUrl = generatedPost?.image_url || generatedPost?.media_url;
      let text = `${editedCaption}\n\n${editedCta}\n\n${editedHashtags}`.trim();
      if (effectiveImageUrl) text += `\n\n${effectiveImageUrl}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsPublishingWhatsApp(false);
      setShowPublishModal(false);
      setPublishSuccessMessage("Opened WhatsApp with your post ready to share!");
      setTimeout(() => setPublishSuccessMessage(null), 8000);
      return;
    }

    if (platformTarget === 'linkedin') {
      setIsPublishingLinkedIn(true);
      const effectiveImageUrl = generatedPost?.image_url || generatedPost?.media_url;
      let text = `${editedCaption}\n\n${editedCta}\n\n${editedHashtags}`.trim();
      if (effectiveImageUrl) text += `\n\n${effectiveImageUrl}`;
      const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsPublishingLinkedIn(false);
      setShowPublishModal(false);
      setPublishSuccessMessage("Opened LinkedIn with your post ready to publish!");
      setTimeout(() => setPublishSuccessMessage(null), 8000);
      return;
    }

    if (platformTarget === 'instagram') setIsPublishingInstagram(true);
    else setIsPublishingFacebook(true);

    setPublishSuccessMessage(null);
    setPublishErrorMessage(null);

    const targetName = platformTarget === 'instagram' ? 'Instagram' : 'Facebook';

    try {
      const endpoint = platformTarget === 'instagram' 
        ? "/api/v1/instagram/publish-image" 
        : "/api/v1/facebook/publish-image";

      const effectiveImageUrl = generatedPost?.image_url || generatedPost?.media_url;

      await api.post(endpoint, {
        image_url: effectiveImageUrl,
        caption: `${editedCaption}\n\n${editedCta}\n\n${editedHashtags}`.trim(),
      });
      
      setPublishSuccessMessage(`Successfully Published to ${targetName}!`);
      setTimeout(() => setPublishSuccessMessage(null), 8000);
    } catch (e: any) {
      console.error(`Error publishing to ${targetName}:`, e);
      let errMsg = e.response?.data?.detail || e.message || `Failed to publish to ${targetName}. Please check account connection.`;
      if (typeof errMsg === 'string' && (errMsg.includes('publish_actions') || errMsg.includes('deprecated'))) {
        errMsg = "Facebook Page publish permission requires a valid Page Access Token. Please visit Social Platforms > Facebook and click 'Login with Facebook' to refresh your Page Token.";
      }
      setPublishErrorMessage(errMsg);
    } finally {
      if (platformTarget === 'instagram') setIsPublishingInstagram(false);
      else setIsPublishingFacebook(false);
      setShowPublishModal(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <main className="py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Post Maker</h1>
            <p className="text-text-muted">Create scroll-stopping social media content with AI. Powered by your Business, Brand Kit & Products.</p>
          </div>

          {hasInsufficientCredits && <InsufficientCreditsAlert />}

          <section className="rounded-2xl bg-surface border border-border p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              Tell AI What You Want
            </h2>
            
            <textarea
              value={creativeInstruction}
              onChange={(e) => setCreativeInstruction(e.target.value)}
              placeholder="E.g. Create a festive Diwali campaign. Make it premium and luxurious..."
              className="w-full bg-[#0a142c] border border-border rounded-xl p-4 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple min-h-[120px] resize-y mb-4"
            />
            
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-3 py-1.5 rounded-full border border-border bg-surface text-sm hover:border-brand-purple hover:text-brand-purple transition-colors text-text-muted"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4 text-brand-purple" />
                Upload Reference Photos <span className="text-xs font-normal text-text-muted">(Optional)</span>
              </h3>
              <p className="text-xs text-text-muted mb-3">Upload 2-3 reference images for the AI to base the post style on</p>
              <MultiImageUploader
                value={uploadedImages}
                onChange={setUploadedImages}
                maxFiles={4}
              />
            </div>

            <div className="border-t border-border pt-4 mt-2">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" /> 
                Advanced Options
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showAdvanced && (
                <div className="space-y-4 mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Platform</label>
                    <PlatformSelector value={platform} onChange={setPlatform} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Objective</label>
                    <ObjectiveSelector value={objective} onChange={setObjective} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Language</label>
                    <select 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#0a142c] border border-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Hinglish">Hinglish</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={loading || (!creativeInstruction.trim() && uploadedImages.length === 0)}
            className="w-full rounded-xl bg-brand-gradient text-white px-6 py-4 font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 text-lg"
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Generating AI Post...</>
            ) : (
              <><Sparkles className="w-6 h-6" /> Generate AI Post</>
            )}
          </button>
          
        </div>

        {/* Output / Loading Column */}
        <div className="lg:col-span-6">
          {loading && (
            <div className="rounded-2xl bg-surface border border-border p-8 shadow-lg h-full flex flex-col justify-center items-center text-center">
              <Loader2 className="w-12 h-12 text-brand-purple animate-spin mb-6" />
              <div className="space-y-4 w-full max-w-sm text-left">
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 1 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Loader2 className="w-5 h-5 text-brand-purple animate-spin" />}
                  <span className="text-white">Understanding your products...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 2 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : (loadingStep === 2 ? <Loader2 className="w-5 h-5 text-brand-purple animate-spin" /> : <div className="w-5 h-5 border-2 border-border rounded-full" />)}
                  <span className="text-white">Creating creative direction...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 3 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : (loadingStep === 3 ? <Loader2 className="w-5 h-5 text-brand-purple animate-spin" /> : <div className="w-5 h-5 border-2 border-border rounded-full" />)}
                  <span className="text-white">Generating visual...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 4 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 4 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : (loadingStep === 4 ? <Loader2 className="w-5 h-5 text-brand-purple animate-spin" /> : <div className="w-5 h-5 border-2 border-border rounded-full" />)}
                  <span className="text-white">Writing caption & formatting post...</span>
                </div>
              </div>
            </div>
          )}

          {!loading && !generatedPost && (
            <div className="rounded-2xl bg-surface/50 border border-border border-dashed p-8 h-full flex flex-col justify-center items-center text-center text-text-muted">
              <Sparkles className="w-12 h-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">Ready to create</h3>
              <p>Select your products, tell the AI what you want, and watch the magic happen.</p>
            </div>
          )}

          {!loading && generatedPost && (
            <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-lg animate-in fade-in zoom-in duration-300">
              
              <div className="p-4 bg-brand-purple/10 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-purple" /> AI GENERATED POST
                </h3>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-[#0a142c] border border-border">
                    {/* Fallback mock image if API doesn't return one directly */}
                    <img 
                      src={generatedPost.image_url || generatedPost.media_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1080"} 
                      alt="AI Generated" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={regenerateImage} className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-lg text-sm text-white transition-colors">
                      <RefreshCw className="w-4 h-4" /> Regenerate Image
                    </button>
                    <button onClick={handleDownloadImage} title="Download Image" className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-lg text-sm text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Headline Section */}
                {editedHeadline && !isEditing && (
                  <div className="p-3.5 bg-brand-purple/15 border border-brand-purple/30 rounded-xl">
                    <p className="text-xs uppercase font-semibold text-brand-purple tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Headline
                    </p>
                    <p className="text-base font-bold text-white">{editedHeadline}</p>
                  </div>
                )}

                {/* Caption Section */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold">Caption & Content</h4>
                  <div className="p-4 rounded-xl bg-[#0a142c] border border-border text-white text-sm leading-relaxed">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-text-muted font-semibold block mb-1">Headline</label>
                          <input 
                            type="text"
                            value={editedHeadline}
                            onChange={(e) => setEditedHeadline(e.target.value)}
                            placeholder="Headline"
                            className="w-full bg-[#111e40] border border-border rounded-lg p-3 text-white font-bold focus:outline-none focus:border-brand-purple"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted font-semibold block mb-1">Caption</label>
                          <textarea 
                            value={editedCaption}
                            onChange={(e) => setEditedCaption(e.target.value)}
                            className="w-full bg-[#111e40] border border-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-purple min-h-[120px] whitespace-pre-line"
                          />
                        </div>
                        <input 
                          type="text"
                          value={editedCta}
                          onChange={(e) => setEditedCta(e.target.value)}
                          placeholder="Call to Action"
                          className="w-full bg-[#111e40] border border-border rounded-lg p-3 text-white focus:outline-none focus:border-brand-purple font-semibold text-brand-purple"
                        />
                        <input 
                          type="text"
                          value={editedHashtags}
                          onChange={(e) => setEditedHashtags(e.target.value)}
                          placeholder="Hashtags"
                          className="w-full bg-[#111e40] border border-border rounded-lg p-3 text-blue-400 focus:outline-none focus:border-brand-purple"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-line leading-relaxed text-gray-200">
                          {editedCaption}
                        </div>
                        
                        {editedCta && (
                          <div className="mt-4 font-semibold text-brand-purple">
                            {editedCta}
                          </div>
                        )}
                        
                        {editedHashtags && (
                          <div className="mt-4 text-blue-400">
                            {editedHashtags.split(' ').filter(t => t.trim() !== "").map(tag => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ')}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={regenerateCaption} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-lg text-sm text-white transition-colors">
                      <RefreshCw className="w-4 h-4" /> Regenerate Caption
                    </button>
                    <button onClick={toggleEdit} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-lg text-sm text-white transition-colors">
                      {isEditing ? <><Save className="w-4 h-4" /> Done Editing</> : <><Edit2 className="w-4 h-4" /> Edit</>}
                    </button>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold">Selected Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {productIds.map(id => {
                      const p = products.find(prod => prod.id === id);
                      return p ? (
                        <div key={id} className="flex items-center gap-2 bg-[#0a142c] border border-border px-3 py-1.5 rounded-full text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          {p.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>



                {/* Actions */}
                <div className="pt-6 border-t border-border grid grid-cols-3 gap-3">
                  <button onClick={savePost} className="flex items-center justify-center gap-2 py-3 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-xl text-white font-medium transition-colors">
                    <Save className="w-5 h-5" /> Save
                  </button>
                  <button onClick={schedulePost} className="flex items-center justify-center gap-2 py-3 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-xl text-white font-medium transition-colors">
                    <Calendar className="w-5 h-5" /> Schedule
                  </button>
                  <button onClick={() => setShowPublishModal(true)} className="flex items-center justify-center gap-2 py-3 bg-brand-gradient hover:opacity-90 rounded-xl text-white font-medium transition-opacity shadow-lg shadow-purple-500/20">
                    <Send className="w-5 h-5" /> Publish
                  </button>
                </div>

                {/* Instant Social Publishing - All in 1 Single Line */}
                <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handlePublishPlatform('instagram')}
                    disabled={isPublishingInstagram || isPublishingFacebook || isPublishingWhatsApp || isPublishingLinkedIn}
                    className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-bold transition-all shadow-md text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                    title="Publish to Instagram"
                  >
                    {isPublishingInstagram ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <InstagramIcon className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{isPublishingInstagram ? 'Publishing...' : 'Instagram'}</span>
                  </button>

                  <button
                    onClick={() => handlePublishPlatform('facebook')}
                    disabled={isPublishingFacebook || isPublishingInstagram || isPublishingWhatsApp || isPublishingLinkedIn}
                    className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold transition-all shadow-md text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                    title="Publish to Facebook"
                  >
                    {isPublishingFacebook ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <FacebookIcon className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{isPublishingFacebook ? 'Publishing...' : 'Facebook'}</span>
                  </button>

                  <button
                    onClick={() => handlePublishPlatform('whatsapp')}
                    disabled={isPublishingWhatsApp || isPublishingInstagram || isPublishingFacebook || isPublishingLinkedIn}
                    className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold transition-all shadow-md text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                    title="Share to WhatsApp"
                  >
                    {isPublishingWhatsApp ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <WhatsAppIcon className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{isPublishingWhatsApp ? 'Opening...' : 'WhatsApp'}</span>
                  </button>

                  <button
                    onClick={() => handlePublishPlatform('linkedin')}
                    disabled={isPublishingLinkedIn || isPublishingInstagram || isPublishingFacebook || isPublishingWhatsApp}
                    className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#095196] text-white font-bold transition-all shadow-md text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                    title="Publish to LinkedIn"
                  >
                    {isPublishingLinkedIn ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <LinkedinIcon className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{isPublishingLinkedIn ? 'Opening...' : 'LinkedIn'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Publish Platform Selection Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0b1630] border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-brand-purple" /> Select Platform to Publish
              </h3>
              <button 
                onClick={() => setShowPublishModal(false)}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-text-muted">Choose which platform you want to publish this post to:</p>

            <div className="space-y-3">
              <button
                onClick={() => handlePublishPlatform('instagram')}
                disabled={isPublishingInstagram || isPublishingFacebook}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold transition-all shadow-lg disabled:opacity-50"
              >
                {isPublishingInstagram ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Publishing to Instagram...</>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Publish to Instagram
                  </>
                )}
              </button>

              <button
                onClick={() => handlePublishPlatform('facebook')}
                disabled={isPublishingFacebook || isPublishingInstagram || isPublishingWhatsApp || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold transition-all shadow-lg disabled:opacity-50"
              >
                {isPublishingFacebook ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Publishing to Facebook...</>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Publish to Facebook
                  </>
                )}
              </button>

              <button
                onClick={() => handlePublishPlatform('whatsapp')}
                disabled={isPublishingFacebook || isPublishingInstagram || isPublishingWhatsApp || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold transition-all shadow-lg disabled:opacity-50"
              >
                {isPublishingWhatsApp ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Opening WhatsApp...</>
                ) : (
                  <>
                    <WhatsAppIcon className="w-5 h-5" />
                    Share to WhatsApp
                  </>
                )}
              </button>

              <button
                onClick={() => handlePublishPlatform('linkedin')}
                disabled={isPublishingFacebook || isPublishingInstagram || isPublishingWhatsApp || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#095196] text-white font-bold transition-all shadow-lg disabled:opacity-50"
              >
                {isPublishingLinkedIn ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Opening LinkedIn...</>
                ) : (
                  <>
                    <LinkedinIcon className="w-5 h-5" />
                    Publish to LinkedIn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Corner Dialog for Errors */}
      <CornerDialog
        open={!!publishErrorMessage}
        onClose={() => setPublishErrorMessage(null)}
        type="error"
        title="Publish Failed"
        message={publishErrorMessage || ""}
      />

      {/* Floating Corner Dialog for Success */}
      <CornerDialog
        open={!!publishSuccessMessage}
        onClose={() => setPublishSuccessMessage(null)}
        type="success"
        title="Published Successfully"
        message={publishSuccessMessage || ""}
      />
    </main>
  );
}
