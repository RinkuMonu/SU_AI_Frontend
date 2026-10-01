"use client";

import { useState } from "react";
import { Loader2, Share2, CheckCircle2 } from "lucide-react";

import { GeneratedPost } from "@/types/content";

interface Props {
  post: GeneratedPost;
  imageUrl?: string;
}

export default function GeneratedPostCard({
  post,
  imageUrl: initialImageUrl,
}: Props) {
  const [currentImage, setCurrentImage] = useState<string | undefined>(initialImageUrl);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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

  const copyCaption = async () => {
    await navigator.clipboard.writeText(
      `${post.caption}\n\n${post.hashtags.join(" ")}`
    );
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-indigo-600">✨</span> Your AI Post is Ready
        </h2>
        <button
          onClick={copyCaption}
          className="rounded-xl border-2 border-indigo-100 bg-indigo-50 px-5 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
        >
          Copy All Text
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Mockup Preview Area */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 shadow-inner flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              SU
            </div>
            <div className="font-semibold text-sm">Your Brand</div>
          </div>
          
          <div className="rounded-xl overflow-hidden bg-gray-200 aspect-square shadow-sm relative mb-4 group">
            {isGeneratingImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 backdrop-blur-sm z-10">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-sm font-semibold text-indigo-700 animate-pulse">Painting your masterpiece...</span>
              </div>
            ) : null}
            
            {currentImage ? (
              <img src={currentImage} alt="Post preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onLoad={() => setIsGeneratingImage(false)} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                No image generated
              </div>
            )}
            
            <button
              onClick={() => {
                setIsGeneratingImage(true);
                // Use Pollinations AI (free, no-key text-to-image API) with the generated creative direction!
                const prompt = post.creative_direction || `A high quality commercial photo for ${post.headline}`;
                setCurrentImage(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1080&nologo=true&seed=${Math.floor(Math.random() * 10000)}`);
              }}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-indigo-600 shadow-lg px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center gap-2 cursor-pointer z-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Generate AI Image
            </button>
          </div>

          <div className="space-y-3 px-1 text-sm">
            <p className="font-bold text-gray-900">{post.headline}</p>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{post.caption}</p>
            <p className="font-semibold text-indigo-600">{post.call_to_action}</p>
            <p className="text-blue-500 font-medium break-words">
              {post.hashtags.join(" ")}
            </p>
          </div>
        </div>

        {/* Content Details Area */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Headline</p>
            <p className="font-semibold text-gray-900 text-lg">{post.headline}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Caption</p>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">{post.caption}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Call to Action</p>
              <p className="font-semibold text-indigo-600">{post.call_to_action}</p>
            </div>
            
            {post.creative_direction && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Direction</p>
                <p className="text-sm text-gray-700 font-medium">{post.creative_direction}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Hashtags</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        {publishSuccessMessage ? (
          <div className="w-full rounded-xl bg-green-50 border border-green-200 text-green-700 p-4 text-center font-semibold flex items-center justify-center gap-2">
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
    </div>
  );
}
