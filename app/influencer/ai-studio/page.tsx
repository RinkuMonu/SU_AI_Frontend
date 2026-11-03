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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/influencer"
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#fc9a5d]" />
              Creator AI Content Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Generate viral reel hooks, high-converting brand integration scripts, and persuasive brand pitches with AI.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/influencer/brand-deals"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
          >
            Explore Deals
          </Link>
          <Link
            href="/influencer/chats"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-90 transition-opacity"
          >
            Open Chats
          </Link>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* Tool 1 */}
        <button
          type="button"
          onClick={() => { setActiveTool('hooks'); setGeneratedResults([]); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
            activeTool === 'hooks'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Zap className={`w-5 h-5 ${activeTool === 'hooks' ? 'text-[#fc9a5d]' : 'text-neutral-400'}`} />
          <div>
            <span className="text-xs font-black text-white block">Viral Reel Hooks</span>
            <span className="text-[10px] text-neutral-400">Stop the scroll in 3 seconds</span>
          </div>
        </button>

        {/* Tool 2 */}
        <button
          type="button"
          onClick={() => { setActiveTool('scripts'); setGeneratedResults([]); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
            activeTool === 'scripts'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Film className={`w-5 h-5 ${activeTool === 'scripts' ? 'text-[#be32ff]' : 'text-neutral-400'}`} />
          <div>
            <span className="text-xs font-black text-white block">Brand Scriptwriter</span>
            <span className="text-[10px] text-neutral-400">3-act reel structure</span>
          </div>
        </button>

        {/* Tool 3 */}
        <button
          type="button"
          onClick={() => { setActiveTool('captions'); setGeneratedResults([]); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
            activeTool === 'captions'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Hash className={`w-5 h-5 ${activeTool === 'captions' ? 'text-[#f0449b]' : 'text-neutral-400'}`} />
          <div>
            <span className="text-xs font-black text-white block">Captions &amp; Tags</span>
            <span className="text-[10px] text-neutral-400">SEO optimized engagement</span>
          </div>
        </button>

        {/* Tool 4 */}
        <button
          type="button"
          onClick={() => { setActiveTool('pitches'); setGeneratedResults([]); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
            activeTool === 'pitches'
              ? 'bg-[#1a0f2c] border-[#be32ff] shadow-lg shadow-purple-500/10'
              : 'bg-[#0c0d15] border-white/10 hover:border-white/20'
          }`}
        >
          <Send className={`w-5 h-5 ${activeTool === 'pitches' ? 'text-emerald-400' : 'text-neutral-400'}`} />
          <div>
            <span className="text-xs font-black text-white block">Brand Pitch Proposal</span>
            <span className="text-[10px] text-neutral-400">Land high-ticket sponsors</span>
          </div>
        </button>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0c0d15] border border-white/10 space-y-4 shadow-lg">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[#be32ff]" />
            Prompt &amp; Creative Brief
          </h3>

          <div>
            <label className="text-[11px] font-bold text-neutral-300 block mb-1">
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
              className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#be32ff]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-300 block mb-1">
              Your Primary Niche / Tone
            </label>
            <select
              value={brandOrNiche}
              onChange={(e) => setBrandOrNiche(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#121320] border border-white/10 text-xs text-white focus:outline-none focus:border-[#be32ff] cursor-pointer"
            >
              <option value="Fashion & Lifestyle">Fashion &amp; Lifestyle (Aesthetic &amp; Chic)</option>
              <option value="Beauty & Skincare">Beauty &amp; Skincare (Educational &amp; Honest)</option>
              <option value="Fitness & Health">Fitness &amp; Health (Energetic &amp; Motivating)</option>
              <option value="Tech & Gadgets">Tech &amp; Gadgets (Review &amp; Testing)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full h-11 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Creative Content</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Area (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#0c0d15] border border-white/10 flex flex-col justify-between shadow-lg min-h-[360px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-black text-white">
                Generated Outputs
              </h3>
              {generatedResults.length > 0 && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready to copy
                </span>
              )}
            </div>

            {generatedResults.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs font-bold text-white">No content generated yet</p>
                <p className="text-[11px] text-neutral-400">
                  Enter your topic on the left and click &quot;Generate Creative Content&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {generatedResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all space-y-2 relative group"
                  >
                    <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap select-text">
                      {result}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => handleCopy(result, idx)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-neutral-400" />
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

    </div>
  );
}

