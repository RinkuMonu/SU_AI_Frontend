"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  Copy, 
  Check, 
  RefreshCw, 
  Wand2, 
  Film, 
  FileText, 
  Hash, 
  Send,
  Zap,
  Bookmark
} from 'lucide-react';

type StudioTool = 'hooks' | 'scripts' | 'captions' | 'pitches';

export default function InfluencerAIStudioPage() {
  const [activeTool, setActiveTool] = useState<StudioTool>('hooks');
  const [promptInput, setPromptInput] = useState('');
  const [brandOrNiche, setBrandOrNiche] = useState('Fashion & Lifestyle');
  const [generating, setGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!promptInput.trim() && !brandOrNiche) return;
    setGenerating(true);

    setTimeout(() => {
      if (activeTool === 'hooks') {
        setGeneratedResults([
          `"Stop wearing your oversized blazers like this in 2026—here is the Italian silhouette rule..."`,
          `"I tested 7 luxury serums so you don’t waste ₹5,000. Here’s the only one that actually repaired my barrier."`,
          `"If you have combination skin, this 30-second morning step changed everything for me."`,
          `"The biggest mistake 90% of creators make when styling monochrome outfits..."`,
          `"Don't buy into the hype until you watch this unfiltered 7-day wear test."`
        ]);
      } else if (activeTool === 'scripts') {
        setGeneratedResults([
          `🎬 ACT 1 - THE HOOK (0:00 - 0:04)\nVisual: Fast cuts trying to fix a creased linen shirt, looking frustrated.\nAudio: "I used to think looking put-together every morning took an hour..."\n\n🎯 ACT 2 - SEAMLESS INTEGRATION (0:05 - 0:35)\nVisual: Unboxing the ${promptInput || 'Myntra Summer Capsule'}, quick transition into 3 effortless looks.\nAudio: "Then I discovered these breathable linen pieces from the new summer collection. Notice how the drape feels bespoke without breaking the bank."\n\n🚀 ACT 3 - CTA (0:36 - 0:45)\nVisual: Direct eye contact, warm smile, pointing to bottom corner.\nAudio: "The summer drop is live now with an extra 20% off using my code SEJAL20. Link is in my bio and stories!"`
        ]);
      } else if (activeTool === 'captions') {
        setGeneratedResults([
          `Golden hour in Jaipur hits different when the fit feels this effortless ✨\n\nPartnered with ${promptInput || 'Myntra'} to showcase three ways to elevate your everyday summer wardrobe—from casual coffee runs to rooftop sunset dinners. Which look is your favorite: 1, 2, or 3? Drop your pick below! 👇\n\nTap the link in my bio to explore the full collection with my exclusive discount code.\n\n#DhandaGrowCreator #SummerFashion2026 #AestheticStyle #JaipurBlogger #OOTDIndia #StyleInspo`
        ]);
      } else {
        setGeneratedResults([
          `Hi ${promptInput || 'Brand'} Partnerships Team,\n\nI’ve been closely following your latest launch and love how your brand blends modern aesthetics with authentic storytelling.\n\nMy community consists of 85,000+ fashion & lifestyle enthusiasts in tier-1 Indian metros with an authentic 4.8% engagement rate. For your upcoming campaign, I’ve conceptualized a 3-part aesthetic styling reel series that organically integrates your product while driving direct sticker link conversions.\n\nI’ve attached my verified DhandaGrow Media Kit and would love to collaborate. Looking forward to your thoughts!\n\nBest regards,\nSejal Gupta (@khushi.digilyf)`
        ]);
      }
      setGenerating(false);
    }, 700);
  };

  const handleCopy = (text: string, idx: number) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 min-w-0">
            <Link
              href="/influencer"
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors shrink-0"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight flex items-center gap-2 min-w-0">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#fc9a5d] shrink-0" />
              <span className="truncate">Creator AI Content Studio</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-neutral-400 pl-9 sm:pl-11 max-w-3xl">
            Generate viral reel hooks, high-converting brand integration scripts, and persuasive brand pitches with AI.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
          <Link
            href="/influencer/brand-deals"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-colors text-center"
          >
            Explore Deals
          </Link>
          <Link
            href="/influencer/chats"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-sm font-bold text-white shadow-md shadow-purple-500/20 group enabled:hover:brightness-110 enabled:hover:shadow-lg enabled:hover:shadow-pink-500/30 enabled:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer text-center"
          >
            Open Chats
          </Link>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tool 1 */}
        <button
          type="button"
          onClick={() => { setActiveTool('hooks'); setGeneratedResults([]); }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-start gap-3 min-h-[132px] h-full ${
            activeTool === 'hooks'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Zap className={`w-6 h-6 shrink-0 ${activeTool === 'hooks' ? 'text-[#fc9a5d]' : 'text-neutral-400'}`} />
          <div className="min-w-0">
            <span className="text-base font-semibold text-white block">Viral Reel Hooks</span>
            <span className="text-sm text-neutral-400 block mt-1 leading-snug">Stop the scroll in 3 seconds</span>
          </div>
        </button>

        {/* Tool 2 */}
        <button
          type="button"
          onClick={() => { setActiveTool('scripts'); setGeneratedResults([]); }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-start gap-3 min-h-[132px] h-full ${
            activeTool === 'scripts'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Film className={`w-6 h-6 shrink-0 ${activeTool === 'scripts' ? 'text-[#be32ff]' : 'text-neutral-400'}`} />
          <div className="min-w-0">
            <span className="text-base font-semibold text-white block">Brand Scriptwriter</span>
            <span className="text-sm text-neutral-400 block mt-1 leading-snug">3-act reel structure</span>
          </div>
        </button>

        {/* Tool 3 */}
        <button
          type="button"
          onClick={() => { setActiveTool('captions'); setGeneratedResults([]); }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-start gap-3 min-h-[132px] h-full ${
            activeTool === 'captions'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Hash className={`w-6 h-6 shrink-0 ${activeTool === 'captions' ? 'text-[#f0449b]' : 'text-neutral-400'}`} />
          <div className="min-w-0">
            <span className="text-base font-semibold text-white block">Captions &amp; Tags</span>
            <span className="text-sm text-neutral-400 block mt-1 leading-snug">SEO optimized engagement</span>
          </div>
        </button>

        {/* Tool 4 */}
        <button
          type="button"
          onClick={() => { setActiveTool('pitches'); setGeneratedResults([]); }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-start gap-3 min-h-[132px] h-full ${
            activeTool === 'pitches'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Send className={`w-6 h-6 shrink-0 ${activeTool === 'pitches' ? 'text-emerald-400' : 'text-neutral-400'}`} />
          <div className="min-w-0">
            <span className="text-base font-semibold text-white block">Brand Pitch Proposal</span>
            <span className="text-sm text-neutral-400 block mt-1 leading-snug">Land high-ticket sponsors</span>
          </div>
        </button>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0c0d15] border border-white/10 shadow-lg flex flex-col lg:min-h-[520px] hover:border-pink-500/60 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
            <Wand2 className="w-5 h-5 text-[#be32ff] shrink-0" />
            <span>Prompt &amp; Creative Brief</span>
          </h3>

          <div className="space-y-5 flex-1">
            <div>
              <label className="text-sm sm:text-base font-semibold text-neutral-200 block mb-2">
                {activeTool === 'pitches' ? 'Brand Name & Product' : 'Topic or Campaign Concept'}
              </label>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={
                  activeTool === 'hooks'
                    ? 'e.g. Summer styling hacks or Skincare barrier repair'
                    : activeTool === 'scripts'
                    ? 'e.g. Myntra Summer Linen Collection unboxing'
                    : activeTool === 'captions'
                    ? 'e.g. Golden hour styling reel'
                    : 'e.g. Nykaa Skincare Serum launch'
                }
                className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/[0.07] border border-white/20 text-base text-white placeholder:text-slate-400 focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/30 hover:border-pink-500/60 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="text-sm sm:text-base font-semibold text-neutral-200 block mb-2">
                Your Primary Niche / Tone
              </label>
              <select
                value={brandOrNiche}
                onChange={(e) => setBrandOrNiche(e.target.value)}
                className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/[0.07] border border-white/20 text-base text-white focus:outline-none focus:border-[#be32ff] focus:ring-2 focus:ring-[#be32ff]/30 cursor-pointer"
              >
                <option value="Fashion & Lifestyle" className="bg-[#121320] text-white">Fashion &amp; Lifestyle (Aesthetic &amp; Chic)</option>
                <option value="Beauty & Skincare" className="bg-[#121320] text-white">Beauty &amp; Skincare (Educational &amp; Honest)</option>
                <option value="Fitness & Health" className="bg-[#121320] text-white">Fitness &amp; Health (Energetic &amp; Motivating)</option>
                <option value="Tech & Gadgets" className="bg-[#121320] text-white">Tech &amp; Gadgets (Review &amp; Testing)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="mt-6 w-full h-14 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] disabled:opacity-40 text-white font-bold text-base shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group enabled:hover:brightness-110 enabled:hover:shadow-lg enabled:hover:shadow-pink-500/30 enabled:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Creative Content</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Area (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#0c0d15] border border-white/10 shadow-lg flex flex-col lg:min-h-[520px] hover:border-pink-500/60 transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5 gap-3">
            <h3 className="text-lg font-semibold text-white">
              Generated Outputs
            </h3>
            {generatedResults.length > 0 && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0 hover:border-pink-500/60 transition-colors duration-200">
                Ready to copy
              </span>
            )}
          </div>

          {generatedResults.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 min-h-[280px]">
              <Sparkles className="w-12 h-12 text-neutral-600 mb-4" />
              <p className="text-lg font-semibold text-white">No content generated yet</p>
              <p className="text-sm text-neutral-400 mt-2 max-w-md leading-relaxed">
                Enter your topic on the left and click &quot;Generate Creative Content&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
              {generatedResults.map((result, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-pink-500/60 transition-all space-y-3 relative group duration-200"
                >
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed whitespace-pre-wrap select-text break-words">
                    {result}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleCopy(result, idx)}
                      className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-neutral-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

