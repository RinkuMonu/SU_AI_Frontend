"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Share2 } from "lucide-react";


import { useCreateAd } from "@/hooks/useCreateAd";

export default function CreateAdPage() {

  const [prompt, setPrompt] = useState("");

  const {
    create,
    loading,
    result,
    error,
  } = useCreateAd();

  const handleGenerate = async () => {

    await create({
      prompt: prompt,
    });

  };

  const [isPublishingFacebook, setIsPublishingFacebook] = useState(false);
  const [isPublishingInstagram, setIsPublishingInstagram] = useState(false);
  const [isPublishingLinkedin, setIsPublishingLinkedin] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  const handlePublish = async (publishPlatform: 'facebook' | 'instagram' | 'linkedin') => {
    if (publishPlatform === 'facebook') setIsPublishingFacebook(true);
    else if (publishPlatform === 'instagram') setIsPublishingInstagram(true);
    else setIsPublishingLinkedin(true);
    
    setPublishSuccessMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/v1/social/publish-${publishPlatform}/${result?.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) { const errData = await res.json().catch(() => ({})); throw new Error(errData.detail || 'Publish failed'); }
      
      setPublishSuccessMessage(`Successfully Published to ${publishPlatform.charAt(0).toUpperCase() + publishPlatform.slice(1)}!`);
      setTimeout(() => setPublishSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      alert('Failed to publish: ' + (err.message || 'Please ensure you have linked your account.'));
    } finally {
      if (publishPlatform === 'facebook') setIsPublishingFacebook(false);
      else if (publishPlatform === 'instagram') setIsPublishingInstagram(false);
      else setIsPublishingLinkedin(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Create Ad
        </h1>

        <p className="mt-2 text-text-muted">
          Generate AI-powered advertising creatives.
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-6 rounded-2xl border border-border bg-surface p-6 lg:col-span-2 shadow-lg">

          <div>
            <label className="mb-2 block font-semibold text-white">
              Ad Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the ad you want to generate in detail..."
              className="min-h-[200px] w-full rounded-lg border border-border bg-surface-elevated text-white p-4 focus:ring-2 focus:ring-brand-purple outline-none resize-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            onClick={handleGenerate}
            className="w-full rounded-xl bg-brand-gradient hover:opacity-90 transition-opacity px-6 py-4 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Generating Ad..."
              : "Generate Ad"}
          </button>

        </div>

        {/* Preview */}

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold text-white">
            Ad Preview
          </h2>

          {result ? (

            <div className="space-y-5">

              <img
                src={result.creative_url}
                alt="AI Ad"
                className="w-full rounded-xl"
              />

              <h3 className="text-xl font-bold text-white">
                {result.headline}
              </h3>

              <p className="text-text-secondary">
                {result.primary_text}
              </p>

              <p className="text-text-muted">
                {result.description}
              </p>

              <a 
                href={"/products"}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full rounded-lg bg-brand-gradient p-3 font-semibold text-white hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                {result.cta}
              </a>

              <div className="flex flex-wrap gap-2">

                {result.hashtags?.map(
                  (tag: string) => (

                    <span
                      key={tag}
                      className="rounded-full bg-surface-elevated px-3 py-1 text-sm text-text-muted"
                    >
                      #{tag.replace("#", "")}
                    </span>

                  )
                )}

              </div>

              <div className="pt-4 mt-4 border-t border-border">
                {publishSuccessMessage ? (
                  <div className="w-full rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 p-4 text-center font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {publishSuccessMessage}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mt-2">
                    <button 
                      onClick={() => handlePublish('instagram')}
                      disabled={isPublishingInstagram || isPublishingFacebook || isPublishingLinkedin}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 transition-opacity px-4 py-3 font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {isPublishingInstagram ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                      {isPublishingInstagram ? 'Publishing...' : `Publish to Instagram`}
                    </button>

                    <button 
                      onClick={() => handlePublish('facebook')}
                      disabled={isPublishingFacebook || isPublishingInstagram || isPublishingLinkedin}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] transition-colors px-4 py-3 font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {isPublishingFacebook ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                      {isPublishingFacebook ? 'Publishing...' : `Publish to Facebook`}
                    </button>

                    <button 
                      onClick={() => handlePublish('linkedin')}
                      disabled={isPublishingLinkedin || isPublishingInstagram || isPublishingFacebook}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] transition-colors px-4 py-3 font-bold text-white shadow-md shadow-blue-900/20 disabled:opacity-50"
                    >
                      {isPublishingLinkedin ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Publishing to LinkedIn...</>
                      ) : (
                        <>
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          Publish to LinkedIn
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

          ) : (

            <div className="flex min-h-[400px] items-center justify-center text-center text-text-muted">
              Your generated ad will appear here.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}
