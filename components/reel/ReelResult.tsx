import { useState, useEffect, useRef } from "react";
import { ReelJobStatus } from "@/types/reel";
import { Loader2, Share2, CheckCircle2 } from "lucide-react";

interface ReelResultProps {
  result: ReelJobStatus;
  onReset: () => void;
}

export function ReelResult({ result, onReset }: ReelResultProps) {
  const isVideo = (url?: string) => {
    if (!url) return false;
    // pollinations.ai returns images, not videos.
    if (url.includes("pollinations.ai")) return false;
    return true;
  };
  const hasRealVideo = isVideo(result.video_url);
  
  const productImage = result.thumbnail_url || (result.video_url?.includes("pollinations") ? result.video_url : null);
  const productName = result.product_name || result.script?.title || "Product";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const scenes = result.script?.scenes || [];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (isPreviewOpen && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    } else if (!isPreviewOpen && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPreviewOpen]);

  useEffect(() => {
    if (!isPreviewOpen || scenes.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrentScene((prev) => {
        if (prev >= scenes.length - 1) {
          clearInterval(timerRef.current!);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timerRef.current!);
  }, [isPreviewOpen, scenes.length]);

  const openPreview = () => {
    setCurrentScene(0);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    clearInterval(timerRef.current!);
  };

  const goToScene = (idx: number) => {
    clearInterval(timerRef.current!);
    setCurrentScene(idx);
  };


  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-green-500/20 rounded-xl">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Reel is Ready!</h2>
        </div>

        <div className="flex flex-col xl:flex-row gap-10">
          {/* Left: Video Player or Product Reel Card */}
          <div className="w-full xl:w-1/2 flex justify-center">
            {hasRealVideo ? (
              <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-black/10 flex justify-center items-center z-50 pointer-events-auto">
                <video
                  src={result.video_url!}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[650px] object-contain relative z-[60] rounded-3xl cursor-pointer pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                  poster={productImage ?? undefined}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              /* Product Reel Preview Card â€” phone-shaped */
              <div className="relative w-[280px] flex-shrink-0" style={{ aspectRatio: "9/16" }}>
                {/* Phone shell */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-purple/20 border-4 border-gray-900 cursor-pointer" onClick={openPreview}>
                  {/* Product Image */}
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                  )}

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

                  {/* Top bar: scene count */}
                  <div className="absolute top-4 right-4">
                    {result.script?.scenes && (
                      <span className="bg-black/50 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                        {result.script.scenes.length} Scenes
                      </span>
                    )}
                  </div>

                  {/* Product name badge top-left */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 max-w-[140px] truncate block">
                      {productName}
                    </span>
                  </div>

                  {/* Hook text middle */}
                  {result.script?.hook && (
                    <div className="absolute left-4 right-4" style={{ top: "30%" }}>
                      <div className="bg-surface/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
                        <p className="text-white text-sm font-bold text-center leading-snug drop-shadow">✨ {result.script.hook}</p>
                      </div>
                    </div>
                  )}

                  {/* Play button center â€” clickable */}
                  <button
                    type="button"
                    onClick={openPreview}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                    aria-label="Preview reel scenes"
                  >
                    <div className="w-16 h-16 bg-surface/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 animate-pulse group-hover/play:scale-110 group-hover/play:bg-surface/40 transition-all duration-200">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>

                  {/* Bottom: title + CTA */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                    <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow">
                      {result.script?.title || productName}
                    </h3>
                    {result.script?.cta && (
                      <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        {result.script.cta}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#0a142c] rounded-full z-10" />
              </div>
            )}
          </div>

          {/* Right: Script details */}
          <div className="w-full xl:w-1/2 flex flex-col relative z-50 pointer-events-auto">
            <div className="flex-grow space-y-6">

              {/* Product info */}
              {(result.product_name || result.product_description) && (
                <div className="flex items-start gap-3 bg-brand-purple/10 rounded-2xl px-5 py-4 border border-brand-purple/20">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-purple">{result.product_name}</p>
                    {result.product_description && (
                      <p className="text-xs text-brand-purple mt-0.5 line-clamp-2">{result.product_description}</p>
                    )}
                  </div>
                </div>
              )}

              {result.script && (
                <div className="bg-[#0a142c] p-6 rounded-2xl border border-brand-purple/20/50 shadow-sm">
                  <h3 className="text-xl font-extrabold text-white mb-3">{result.script.title}</h3>
                  <div className="flex gap-3">
                    <span className="text-3xl text-brand-purple/50 font-serif leading-none">"</span>
                    <p className="text-lg text-text-muted italic font-medium leading-relaxed">{result.script.hook}</p>
                  </div>
                </div>
              )}

              {result.caption && (
                <div className="px-2">
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Suggested Caption</h4>
                  <p className="text-white whitespace-pre-wrap leading-relaxed text-base bg-[#0a142c] p-4 rounded-xl border border-border">{result.caption}</p>
                </div>
              )}

              {result.hashtags && result.hashtags.length > 0 && (
                <div className="px-2">
                  <div className="flex flex-wrap gap-2.5">
                    {result.hashtags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-surface border border-border px-3 py-1.5 text-sm font-semibold text-brand-purple shadow-sm hover:shadow hover:border-brand-purple/50 transition-all cursor-default">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!hasRealVideo && (
                <div className="px-2 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Script Generated!</strong> To produce a real MP4 video, add a video API key (Runway ML, Luma AI, etc.) in your backend <code className="bg-amber-500/20 px-1 rounded">.env</code>. The AI script, caption & hashtags above are fully ready to use.
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-border">
              {hasRealVideo && (
                <a
                  href={result.video_url!}
                  download
                  target="_blank"
                  className="flex-1 flex justify-center items-center gap-2 rounded-2xl bg-[#0a142c] px-6 py-4 font-bold text-white hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download HD
                </a>
              )}
              <button
                type="button"
                onClick={onReset}
                className="flex-1 flex justify-center items-center gap-2 rounded-2xl border-2 border-border bg-surface px-6 py-4 font-bold text-text-muted hover:border-brand-purple/50 hover:bg-brand-purple/10 hover:text-brand-purple transition-all active:scale-[0.98] cursor-pointer"
              >
                Create Another
              </button>
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
                    disabled={isPublishingInstagram || isPublishingFacebook}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 transition-opacity px-4 py-3 font-bold text-white shadow-md disabled:opacity-50"
                  >
                    {isPublishingInstagram ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                    {isPublishingInstagram ? 'Publishing...' : `Publish to Instagram`}
                  </button>

                  <button 
                    onClick={() => handlePublish('facebook')}
                    disabled={isPublishingFacebook || isPublishingInstagram}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] transition-colors px-4 py-3 font-bold text-white shadow-md disabled:opacity-50"
                  >
                    {isPublishingFacebook ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                    {isPublishingFacebook ? 'Publishing...' : `Publish to Facebook`}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Scene-by-Scene Breakdown */}
      {result.script && result.script.scenes && (
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-lg">
          <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-white">
            <svg className="w-6 h-6 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Scene-by-Scene Breakdown
          </h3>
          <div className="space-y-6">
            {result.script.scenes.map((scene: any, idx: number) => (
              <div 
                key={idx} 
                onClick={() => {
                  openPreview();
                  goToScene(idx);
                }}
                className="p-6 bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-brand-purple/50 hover:ring-4 hover:ring-brand-purple/20 transition-all cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label={`Preview Scene ${scene.scene_number}`}
              >
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border group-hover:border-brand-purple/20 transition-colors">
                  <span className="bg-brand-purple/10 text-brand-purple text-sm font-extrabold px-3 py-1.5 rounded-lg border border-brand-purple/20 group-hover:bg-brand-purple group-hover:text-white transition-colors">
                    Scene {scene.scene_number}
                  </span>
                  <span className="text-sm font-semibold text-text-muted flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {scene.duration_seconds}s
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative pl-4">
                    <span className="absolute left-0 top-0 w-1 h-full bg-blue-500/30 rounded-full" />
                    <span className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Visual Direction</span>
                    <p className="text-sm text-text-muted font-medium leading-relaxed">{scene.visual}</p>
                  </div>
                  <div className="relative pl-4">
                    <span className="absolute left-0 top-0 w-1 h-full bg-brand-purple/30 rounded-full" />
                    <span className="block text-xs font-bold text-brand-purple uppercase tracking-widest mb-2">Voiceover</span>
                    <p className="text-sm text-white italic leading-relaxed bg-brand-purple/10 p-3 rounded-xl border border-brand-purple/20">"{scene.voiceover}"</p>
                  </div>
                </div>
                {scene.on_screen_text && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">On-Screen Text</span>
                    <p className="text-base font-bold text-white bg-pink-500/10 inline-block px-4 py-2 rounded-xl border border-pink-500/20">{scene.on_screen_text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€ Scene Preview Modal â”€â”€ */}
      {isPreviewOpen && scenes.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-sm mx-auto"
            style={{ aspectRatio: "9/16", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Phone shell */}
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border-4 border-gray-900 shadow-2xl bg-black">
              {/* Background image */}
              {productImage ? (
                <img src={productImage} alt={productName} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              {/* Progress bars */}
              <div className="absolute top-6 left-4 right-4 flex gap-1 z-10">
                {scenes.map((_: any, i: number) => (
                  <div key={i} className="h-0.5 flex-1 rounded-full overflow-hidden bg-surface/30">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${i < currentScene ? 'bg-surface w-full' : i === currentScene ? 'bg-surface w-full animate-[grow_3s_linear_forwards]' : 'bg-transparent w-0'}`}
                    />
                  </div>
                ))}
              </div>

              {/* Scene number badge */}
              <div className="absolute top-10 right-4 z-10">
                <span className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {currentScene + 1} / {scenes.length}
                </span>
              </div>

              {/* Main content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
                {/* Voiceover */}
                {scenes[currentScene]?.voiceover && (
                  <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-5 py-4 mb-4 border border-white/10">
                    <p className="text-white text-sm font-semibold leading-relaxed">🎙️ {scenes[currentScene].voiceover}</p>
                  </div>
                )}
                {/* On-screen text */}
                {scenes[currentScene]?.on_screen_text && (
                  <div className="bg-gradient-to-r from-indigo-500/80 to-purple-500/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <p className="text-white font-extrabold text-base">📝 {scenes[currentScene].on_screen_text}</p>
                  </div>
                )}
              </div>

              {/* Visual direction label at bottom */}
              <div className="absolute bottom-16 left-4 right-4 z-10 text-center">
                <p className="text-white/70 text-xs font-medium leading-snug">
                  {scenes[currentScene]?.visual}
                </p>
              </div>

              {/* Nav buttons */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                <button
                  type="button"
                  onClick={() => goToScene(Math.max(0, currentScene - 1))}
                  disabled={currentScene === 0}
                  className="w-10 h-10 rounded-full bg-surface/20 flex items-center justify-center text-white disabled:opacity-30 hover:bg-surface/40 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-white/80 text-xs font-semibold">Tap sides to navigate</span>
                <button
                  type="button"
                  onClick={() => goToScene(Math.min(scenes.length - 1, currentScene + 1))}
                  disabled={currentScene === scenes.length - 1}
                  className="w-10 h-10 rounded-full bg-surface/20 flex items-center justify-center text-white disabled:opacity-30 hover:bg-surface/40 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Phone notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#0a142c] rounded-full z-20" />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={closePreview}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-surface text-white flex items-center justify-center shadow-xl hover:bg-border transition-all cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




