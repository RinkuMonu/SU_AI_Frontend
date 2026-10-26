"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Sparkles, Image as ImageIcon, Loader2, Share2, CheckCircle2 } from "lucide-react";

import MultiImageUploader from "@/components/ai/MultiImageUploader";
import { InsufficientCreditsAlert } from "@/components/ui/InsufficientCreditsAlert";

import { imageService } from "@/services/image.service";
import api from "@/lib/api";
import { resolveImageUrl, getAiFallbackImage } from "@/lib/imageUtils";

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

export default function AIImagePage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasInsufficientCredits, setHasInsufficientCredits] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPublishingFacebook, setIsPublishingFacebook] = useState(false);
  const [isPublishingInstagram, setIsPublishingInstagram] = useState(false);
  const [isPublishingLinkedIn, setIsPublishingLinkedIn] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  const handlePublish = async (publishPlatform: 'facebook' | 'instagram' | 'linkedin') => {

    if (publishPlatform === 'linkedin') {
      setIsPublishingLinkedIn(true);
      let text = prompt.trim();
      if (generatedImage) text += `\n\n${generatedImage}`;
      const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsPublishingLinkedIn(false);
      setPublishSuccessMessage("Opened LinkedIn with image ready to publish!");
      setTimeout(() => setPublishSuccessMessage(null), 5000);
      return;
    }

    if (publishPlatform === 'facebook') setIsPublishingFacebook(true);
    else setIsPublishingInstagram(true);

    setPublishSuccessMessage(null);

    try {
      const endpoint = `/api/v1/${publishPlatform}/publish-image`;
      await api.post(endpoint, {
        image_url: generatedImage,
        caption: prompt,
      });
      setPublishSuccessMessage(`Successfully Published to ${publishPlatform.charAt(0).toUpperCase() + publishPlatform.slice(1)}!`);
      setTimeout(() => setPublishSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      alert('Failed to publish: ' + (err.response?.data?.detail || err.message || 'Please check account connection.'));
    } finally {
      if (publishPlatform === 'facebook') setIsPublishingFacebook(false);
      else setIsPublishingInstagram(false);
    }
  };

  useEffect(() => {
    // Component mounted
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for the image.");
      return;
    }

    try {
      setLoading(true);
      setGeneratedImage(null);
      setError(null);
      setHasInsufficientCredits(false);

      const result = await imageService.generateImage({
        prompt: prompt.trim(),
        reference_images: uploadedImages.length > 0 ? uploadedImages : undefined,
      });

      if (result.success && result.data?.image_url) {
        setGeneratedImage(resolveImageUrl(result.data.image_url, prompt.trim()));
        window.dispatchEvent(new Event("credit-update"));
      } else {
        const seed = Math.floor(Math.random() * 1000000);
        setGeneratedImage(getAiFallbackImage(prompt.trim(), seed));
        window.dispatchEvent(new Event("credit-update"));
      }

    } catch (err: any) {
      console.error("AI image generation failed:", err);

      if (err?.response?.status === 402 || err?.message?.toLowerCase().includes("credit")) {
        setHasInsufficientCredits(true);
      } else {
        setError(
          err?.response?.data?.detail || err?.message || "Unable to generate image. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `su-ai-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Failed to download image", err);
      // Fallback
      window.open(generatedImage, "_blank");
    }
  };

  return (
    <main className="py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-brand-gradient rounded-full shadow-lg shadow-purple-500/20">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Image Generator
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Describe the image you want to create. You can also provide an optional product for context.
          </p>
        </div>

        {hasInsufficientCredits && <InsufficientCreditsAlert />}

        {error && (
          <div className="mb-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <section className="rounded-2xl bg-surface border border-border p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Prompt
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A minimalist workspace with a coffee cup and a laptop, soft lighting..."
              className="w-full bg-[#0a142c] border border-border rounded-xl p-4 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple min-h-[120px] resize-y"
            />
          </section>

          <section className="rounded-2xl bg-surface border border-border p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Reference Images <span className="text-sm font-normal text-text-muted">(Optional)</span>
            </h2>
            <p className="text-sm text-text-muted mb-5">
              Upload up to 4 images of your product for the AI to base the generated image on.
            </p>
            <MultiImageUploader
              value={uploadedImages}
              onChange={setUploadedImages}
              maxFiles={4}
            />
          </section>

          <section>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="
                w-full rounded-xl
                bg-brand-gradient text-white
                px-6 py-4
                font-semibold
                disabled:opacity-50
                hover:opacity-90 transition-opacity
                flex items-center justify-center gap-2
                shadow-lg shadow-purple-500/20
              "
            >
              {loading ? (
                "Generating..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Image
                </>
              )}
            </button>
          </section>

          {generatedImage && (
            <section className="rounded-2xl bg-surface border border-border p-6 shadow-lg animate-in fade-in zoom-in duration-300">
              <h2 className="text-xl font-semibold mb-5 text-white">
                Generated Image
              </h2>
              <div className="aspect-square relative w-full overflow-hidden rounded-xl bg-[#0a142c] mb-6">
                <Image
                  src={generatedImage}
                  alt="Generated AI Image"
                  fill
                  className="object-contain"
                  unoptimized
                  onError={() => {
                    const seed = Math.floor(Math.random() * 1000000);
                    setGeneratedImage(getAiFallbackImage(prompt.trim(), seed));
                  }}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="w-full rounded-xl bg-[#0a142c] border border-border text-white px-6 py-4 font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download
                </button>
              </div>

              <div className="pt-4 mt-4 border-t border-border">
                {publishSuccessMessage ? (
                  <div className="w-full rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 p-4 text-center font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {publishSuccessMessage}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handlePublish('instagram')}
                      disabled={isPublishingInstagram || isPublishingFacebook || isPublishingLinkedIn}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 transition-opacity px-2.5 py-3 font-bold text-white shadow-md disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
                      title="Publish to Instagram"
                    >
                      {isPublishingInstagram ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <InstagramIcon className="w-4 h-4 shrink-0" />}
                      <span className="truncate">{isPublishingInstagram ? 'Publishing...' : 'Instagram'}</span>
                    </button>

                    <button
                      onClick={() => handlePublish('facebook')}
                      disabled={isPublishingFacebook || isPublishingInstagram || isPublishingLinkedIn}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] transition-colors px-2.5 py-3 font-bold text-white shadow-md disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
                      title="Publish to Facebook"
                    >
                      {isPublishingFacebook ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <FacebookIcon className="w-4 h-4 shrink-0" />}
                      <span className="truncate">{isPublishingFacebook ? 'Publishing...' : 'Facebook'}</span>
                    </button>



                    <button
                      onClick={() => handlePublish('linkedin')}
                      disabled={isPublishingLinkedIn || isPublishingInstagram || isPublishingFacebook}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#095196] transition-colors px-2.5 py-3 font-bold text-white shadow-md disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
                      title="Publish to LinkedIn"
                    >
                      {isPublishingLinkedIn ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <LinkedinIcon className="w-4 h-4 shrink-0" />}
                      <span className="truncate">{isPublishingLinkedIn ? 'Opening...' : 'LinkedIn'}</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
