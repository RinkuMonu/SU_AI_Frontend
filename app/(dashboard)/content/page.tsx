"use client";

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { ContentPreview } from '@/components/content/ContentPreview';
import { contentService } from '@/services/content.service';
import { GenerateContentRequest, GeneratedContent } from '@/types/content';
import { Sparkles, History, Loader2, ArrowLeft, Layers, ShoppingBag, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActivityService } from '@/services/activity.service';
import { InsufficientCreditsAlert } from '@/components/ui/InsufficientCreditsAlert';
import { CornerDialog } from '@/components/ui/CornerDialog';

function ContentStudioContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const productIdParam = searchParams.get('productId');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [lastRequest, setLastRequest] = useState<GenerateContentRequest | null>(null);
  const [hasInsufficientCredits, setHasInsufficientCredits] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialType = typeParam === 'reel' ? 'Reel Script' : typeParam === 'post' ? 'Instagram Post' : 'Instagram Post';

  const handleGenerate = async (data: GenerateContentRequest) => {
    setIsLoading(true);
    setHasInsufficientCredits(false);
    setErrorMessage(null);
    setLastRequest(data);

    try {
      const response = await contentService.generateContent(data);
      setGeneratedContent(response.data);
      window.dispatchEvent(new Event("credit-update"));

      ActivityService.logActivity({
        title: `Generated ${data.type || "AI Post"}`,
        description: response.data.title || `Created engaging ${data.platform} ${data.type} with AI.`,
        category: "content",
        platform: (data.platform?.toLowerCase() as any) || "ai",
        status: "Draft",
        actionUrl: "/content",
      });
    } catch (error: any) {
      console.error("Failed to generate content:", error);
      if (error?.response?.status === 402 || error?.message?.toLowerCase().includes("credit")) {
        setHasInsufficientCredits(true);
      } else {
        setErrorMessage(error?.response?.data?.detail || error?.message || "Failed to generate content. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (editedContent: GeneratedContent) => {
    try {
      const response = await contentService.saveContent(editedContent);
      const savedItem = response.data || editedContent;
      setGeneratedContent(savedItem);
      ActivityService.logActivity({
        title: `${savedItem.status === 'Scheduled' ? 'Scheduled' : 'Saved'} ${savedItem.type || "Content"}`,
        description: savedItem.title || "Saved changes to content library item.",
        category: "content",
        platform: (savedItem.platform?.toLowerCase() as any) || "ai",
        status: savedItem.status || "Completed",
        actionUrl: "/content-library",
      });
    } catch (error) {
      console.error("Failed to save content:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-purple to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                AI Content Generation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider border border-brand-purple/30">
                Product Studio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Turn your product images &amp; details into high-converting posts, captions, ads, and reels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button 
            variant="outline" 
            asChild
            className="border-border bg-surface hover:bg-surface-elevated text-slate-200 hover:text-white rounded-xl shadow-sm text-xs font-semibold h-10 px-4 cursor-pointer"
          >
            <Link href="/content-library">
              <History className="h-4 w-4 mr-2 text-brand-purple" />
              Content Library
            </Link>
          </Button>
        </div>
      </div>

      {hasInsufficientCredits && <InsufficientCreditsAlert />}

      {/* Main Grid: Form (Left) & Result Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Product-based Generator Form (7 cols) */}
        <div className="lg:col-span-7 w-full space-y-6">
          <ContentGenerator 
            initialType={initialType} 
            initialProductId={productIdParam || ''} 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
          />
        </div>

        {/* Right Column: Live Result Preview & Actions (5 cols) */}
        <div className="lg:col-span-5 w-full lg:sticky lg:top-6 space-y-4">
          {generatedContent ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <ContentPreview 
                content={generatedContent} 
                isGenerating={isLoading}
                onRegenerate={async () => {
                  if (lastRequest) {
                    await handleGenerate(lastRequest);
                  } else if (generatedContent) {
                    await handleGenerate({
                      type: generatedContent.type,
                      platform: generatedContent.platform,
                      language: generatedContent.language,
                      tone: generatedContent.tone,
                      productId: generatedContent.productId,
                      targetAudience: generatedContent.targetAudience,
                      topic: generatedContent.topic,
                      callToAction: generatedContent.callToAction,
                      additionalInstructions: generatedContent.additionalInstructions,
                    });
                  }
                }} 
                onSave={handleSave} 
              />
            </div>
          ) : (
            /* Live Preview Placeholder Outline */
            <div className="rounded-2xl bg-surface/60 border border-border border-dashed p-6 sm:p-8 text-center text-text-muted min-h-[460px] flex flex-col justify-center items-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Live Content Preview
              </h3>
              <p className="text-xs text-text-muted max-w-xs leading-relaxed mb-6">
                Your generated post, captions, hashtags, and visual mockup will appear here ready to edit, save, copy, and download.
              </p>

              {/* Sample Card Outline */}
              <div className="w-full max-w-xs rounded-xl bg-[#091226] border border-border/80 p-3.5 text-left space-y-2.5 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700" />
                  <div className="h-3 w-28 bg-slate-700 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-800 rounded" />
                <div className="h-2 w-4/5 bg-slate-800 rounded" />
                <div className="h-2 w-2/3 bg-slate-800 rounded" />
                <div className="pt-2 flex gap-1.5">
                  <div className="h-4 w-12 bg-brand-purple/20 rounded" />
                  <div className="h-4 w-12 bg-brand-purple/20 rounded" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CornerDialog
        open={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        type="error"
        title="Generation Failed"
        message={errorMessage || ""}
      />
    </div>
  );
}

export default function ContentStudioPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-brand-purple" /></div>}>
      <ContentStudioContent />
    </Suspense>
  );
}
