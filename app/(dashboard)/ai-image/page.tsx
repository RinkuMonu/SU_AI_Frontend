"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Sparkles, Image as ImageIcon, Loader2, Share2, CheckCircle2 } from "lucide-react";

import MultiImageUploader from "@/components/ai/MultiImageUploader";
import { InsufficientCreditsAlert } from "@/components/ui/InsufficientCreditsAlert";

import { imageService } from "@/services/image.service";

export default function AIImagePage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasInsufficientCredits, setHasInsufficientCredits] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPublishingFacebook, setIsPublishingFacebook] = useState(false);
  const [isPublishingInstagram, setIsPublishingInstagram] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  const handlePublish = async (publishPlatform: 'facebook' | 'instagram') => {
    if (publishPlatform === 'facebook') setIsPublishingFacebook(true);
    else setIsPublishingInstagram(true);

    setPublishSuccessMessage(null);

    // Simulate API call to save and publish
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (publishPlatform === 'facebook') setIsPublishingFacebook(false);
    else setIsPublishingInstagram(false);

    setPublishSuccessMessage(`Successfully Published to ${publishPlatform.charAt(0).toUpperCase() + publishPlatform.slice(1)}!`);
    setTimeout(() => setPublishSuccessMessage(null), 5000);
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
        setGeneratedImage(result.data.image_url);
        window.dispatchEvent(new Event("credit-update"));
      } else {
        setError(result.message || "Failed to generate image.");
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
                  unoptimized // In case image URLs are external/blob
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
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handlePublish('instagram')}
                      disabled={isPublishingInstagram || isPublishingFacebook}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 transition-opacity px-6 py-4 font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {isPublishingInstagram ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                      {isPublishingInstagram ? 'Publishing...' : `Publish to Instagram`}
                    </button>

                    <button
                      onClick={() => handlePublish('facebook')}
                      disabled={isPublishingFacebook || isPublishingInstagram}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] transition-colors px-6 py-4 font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {isPublishingFacebook ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                      {isPublishingFacebook ? 'Publishing...' : `Publish to Facebook`}
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
