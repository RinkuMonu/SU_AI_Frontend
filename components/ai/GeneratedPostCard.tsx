"use client";
import api from '@/lib/api';
import { useState } from "react";
import { Loader2, Share2, CheckCircle2, AlertTriangle } from "lucide-react";

import { GeneratedPost } from "@/types/content";

interface Props {
  post: GeneratedPost;
  imageUrl?: string;
}

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

export default function GeneratedPostCard({
  post,
  imageUrl: initialImageUrl,
}: Props) {
  const [currentImage, setCurrentImage] = useState<string | undefined>(initialImageUrl);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [isPublishingFacebook, setIsPublishingFacebook] = useState(false);
  const [isPublishingInstagram, setIsPublishingInstagram] = useState(false);
  const [isPublishingLinkedIn, setIsPublishingLinkedIn] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);
  const [publishErrorMessage, setPublishErrorMessage] = useState<string | null>(null);

  const handlePublish = async (publishPlatform: 'facebook' | 'instagram' | 'linkedin') => {
    if (publishPlatform === 'whatsapp') {
      setIsPublishingWhatsApp(true);
      const img = currentImage || post.image_url || post.media_url;
      let text = `${post.caption || ''}\n\n${(post.hashtags || []).join(' ')}`.trim();
      if (img) text += `\n\n${img}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsPublishingWhatsApp(false);
      setPublishSuccessMessage("Opened WhatsApp with post ready to share!");
      setTimeout(() => setPublishSuccessMessage(null), 5000);
      return;
    }

    if (publishPlatform === 'linkedin') {
      setIsPublishingLinkedIn(true);
      setPublishSuccessMessage(null);
      setPublishErrorMessage(null);
      try {
        // Try API-based publishing first (real LinkedIn post)
        const endpoint = '/api/v1/linkedin/publish-image';
        const res = await api.post(endpoint, {
          image_url: currentImage || post.image_url || post.media_url,
          caption: `${post.caption || ''}\n\n${(post.hashtags || []).join(' ')}`.trim(),
        });
        const postUrl = res.data?.url || res.data?.data?.url;
        setPublishSuccessMessage(postUrl
          ? `✅ Published to LinkedIn! View: ${postUrl}`
          : '✅ Successfully Published to LinkedIn!');
        setTimeout(() => setPublishSuccessMessage(null), 8000);
      } catch (err: any) {
        const detail = err.response?.data?.detail || '';
        const statusCode = err.response?.status;
        // If token expired/revoked or not connected, fallback to web intent
        if (statusCode === 401 || statusCode === 400 || detail.toLowerCase().includes('revoked') || detail.toLowerCase().includes('not connected')) {
          const img = currentImage || post.image_url || post.media_url;
          let text = `${post.caption || ''}\n\n${(post.hashtags || []).join(' ')}`.trim();
          if (img) text += `\n\n${img}`;
          const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
          window.open(url, '_blank', 'noopener,noreferrer');
          setPublishSuccessMessage('Opened LinkedIn — paste your post there!');
          setTimeout(() => setPublishSuccessMessage(null), 5000);
        } else {
          setPublishErrorMessage(`❌ LinkedIn: ${detail || err.message || 'Publishing failed'}`);
          setTimeout(() => setPublishErrorMessage(null), 10000);
        }
      } finally {
        setIsPublishingLinkedIn(false);
      }
      return;
    }

    if (publishPlatform === 'facebook') setIsPublishingFacebook(true);
    else setIsPublishingInstagram(true);
    
    setPublishSuccessMessage(null);
    setPublishErrorMessage(null);
    
    try {
      const endpoint = `/api/v1/${publishPlatform}/publish-image`;
      await api.post(endpoint, {
        image_url: currentImage || post.image_url || post.media_url,
        caption: `${post.caption || ''}\n\n${(post.hashtags || []).join(' ')}`.trim(),
      });
      setPublishSuccessMessage(`Successfully Published to ${publishPlatform.charAt(0).toUpperCase() + publishPlatform.slice(1)}!`);
      setTimeout(() => setPublishSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail || err.message || 'Please check account connection.';
      setPublishErrorMessage(`❌ Failed to publish to ${publishPlatform.charAt(0).toUpperCase() + publishPlatform.slice(1)}: ${detail}`);
      setTimeout(() => setPublishErrorMessage(null), 10000);
    } finally {
      if (publishPlatform === 'facebook') setIsPublishingFacebook(false);
      else setIsPublishingInstagram(false);
    }
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
        {publishSuccessMessage && (
          <div className="w-full rounded-xl bg-green-50 border border-green-200 text-green-700 p-4 text-center font-semibold flex items-center justify-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5" /> {publishSuccessMessage}
          </div>
        )}
        {publishErrorMessage && (
          <div className="w-full rounded-xl bg-red-50 border border-red-200 text-red-700 p-4 text-center font-semibold flex items-center justify-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" /> {publishErrorMessage}
          </div>
        )}
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
      </div>
    </div>
  );
}
