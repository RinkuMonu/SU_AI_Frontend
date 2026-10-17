"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { ContentPreview } from '@/components/content/ContentPreview';
import { contentService } from '@/services/content.service';
import { GenerateContentRequest, GeneratedContent } from '@/types/content';
import { Sparkles, History, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActivityService } from '@/services/activity.service';

function ContentStudioContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const productIdParam = searchParams.get('productId');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const initialType = typeParam === 'reel' ? 'Reel Script' : typeParam === 'post' ? 'Instagram Post' : 'Instagram Post';

  const handleGenerate = async (data: GenerateContentRequest) => {
    setIsLoading(true);
    try {
      const response = await contentService.generateContent(data);
      setGeneratedContent(response.data);
      ActivityService.logActivity({
        title: `Generated ${data.type || "AI Post"}`,
        description: response.data.title || `Created engaging ${data.platform} ${data.type} with AI.`,
        category: "content",
        platform: (data.platform?.toLowerCase() as any) || "ai",
        status: "Draft",
        actionUrl: "/content",
      });
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (editedContent: GeneratedContent) => {
    try {
      await contentService.updateContent(editedContent._id, editedContent);
      setGeneratedContent(editedContent);
      ActivityService.logActivity({
        title: `Updated ${editedContent.type || "Content"}`,
        description: editedContent.title || "Saved changes to content library item.",
        category: "content",
        platform: (editedContent.platform?.toLowerCase() as any) || "ai",
        status: editedContent.status || "Completed",
        actionUrl: "/content",
      });
    } catch (error) {
      console.error("Failed to save content:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center text-white shadow-lg shadow-brand-purple/25 shrink-0">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Content Studio
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              Create engaging marketing content with AI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            asChild
            className="border-border bg-surface hover:bg-surface-elevated text-slate-200 hover:text-white rounded-xl shadow-sm text-xs font-semibold h-10 px-4"
          >
            <Link href="/content-library">
              <History className="h-4 w-4 mr-2 text-brand-pink" />
              Content Library
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid: Form & Result Preview */}
      <div className={generatedContent ? "grid grid-cols-1 xl:grid-cols-12 gap-8 items-start" : "max-w-4xl mx-auto w-full"}>
        <div className={generatedContent ? "xl:col-span-5 w-full" : "w-full"}>
          <ContentGenerator 
            initialType={initialType} 
            initialProductId={productIdParam || ''} 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
          />
        </div>

        {generatedContent && (
          <div className="xl:col-span-7 animate-in fade-in slide-in-from-right-8 duration-500">
            <ContentPreview 
              content={generatedContent} 
              onRegenerate={() => {
                if (generatedContent) {
                  handleGenerate({
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
        )}
      </div>
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
