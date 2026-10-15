"use client";

import { useState, useEffect } from 'react';
import { campaignService } from '@/services/campaign.service';
import { Campaign, GenerateCampaignRequest } from '@/types/campaign';
import { 
  Megaphone, 
  Target, 
  BarChart2, 
  Plus, 
  Loader2, 
  Trash2, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Calendar,
  Users, 
  Share2, 
  Layers, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Camera, 
  Film,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

// Helper to parse strategy text with headings into structured sections
function parseStrategySections(text: string) {
  if (!text) return [];

  // Look for headings ending with colon (e.g., "Market Positioning & Customer Journey:", "Pain Points, Value Proposition & Emotional Triggers:")
  const parts = text.split(/(?:^|\s)([A-Za-z\s&,/-]{4,45}:)/g).filter(p => p && p.trim().length > 0);

  if (parts.length >= 2) {
    const sections: { title: string; body: string }[] = [];
    let currentTitle = "Strategic Positioning";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (part.endsWith(':') && part.length < 50) {
        currentTitle = part.replace(/:$/, '').trim();
      } else {
        sections.push({ title: currentTitle, body: part });
        currentTitle = "Execution Strategy";
      }
    }
    if (sections.length > 0) return sections;
  }

  // Fallback: split by line breaks or show whole text
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  return paragraphs.map((p, idx) => ({
    title: idx === 0 ? "Strategic Positioning" : "Strategic Execution",
    body: p.trim()
  }));
}

// Helper to parse individual suggested post raw text into structured fields
function parsePostItem(rawText: string, index: number) {
  let title = `Post ${index + 1}`;
  let hook = "";
  let visualConcept = "";
  let caption = "";
  let hashtags: string[] = [];
  const clean = rawText.trim();

  // Extract [Hook & Angle] or bracketed text
  const hookMatch = clean.match(/\[(.*?)\]/);
  if (hookMatch) {
    hook = hookMatch[1];
  }

  // Extract Title after "Post X: [Hook] Title."
  const titleMatch = clean.match(/Post\s*\d+\s*:\s*(?:\[.*?\]\s*)?([^.\n]+)/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Extract Visual concept: ...
  const visualMatch = clean.match(/Visual concept\s*:\s*(.*?)(?=(?:Caption draft\s*:|#|$))/i);
  if (visualMatch) {
    visualConcept = visualMatch[1].trim();
  }

  // Extract Caption draft: ...
  const captionMatch = clean.match(/Caption draft\s*:\s*(.*?)(?=(?:#\w+|$))/i);
  if (captionMatch) {
    caption = captionMatch[1].trim();
  }

  // Extract hashtags
  const hashtagMatches = clean.match(/#[\w]+/g);
  if (hashtagMatches) {
    hashtags = hashtagMatches;
  }

  // Fallback if no visualConcept or caption parsed
  if (!visualConcept && !caption) {
    caption = clean.replace(/Post\s*\d+\s*:\s*/i, '');
  }

  return { title, hook, visualConcept, caption, hashtags, raw: rawText };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [generatingAdCopyId, setGeneratingAdCopyId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const fetchCampaigns = async () => {
    try {
      const res = await campaignService.getCampaigns();
      setCampaigns(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await campaignService.deleteCampaign(id);
      setCampaigns(campaigns.filter(c => c._id !== id && c.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateAdCopy = async (campaign: Campaign) => {
    const campaignId = (campaign.id || campaign._id) as string;
    setGeneratingAdCopyId(campaignId);
    try {
      const res = await campaignService.generateAdCopy(campaignId, {
        name: campaign.name,
        goal: campaign.goal,
        audience: campaign.targetAudience
      });
      try {
        await campaignService.updateCampaign(campaignId, { adCopy: res.data });
      } catch (e) {
        console.warn("Could not save to backend, updating local state only", e);
      }
      setCampaigns(campaigns.map(c => 
        (c.id === campaignId || c._id === campaignId) 
          ? { ...c, adCopy: res.data } 
          : c
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingAdCopyId(null);
    }
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const formData = new FormData(e.currentTarget);
    const request: GenerateCampaignRequest = {
      name: formData.get('name') as string,
      goal: formData.get('goal') as string,
      targetAudience: formData.get('targetAudience') as string,
      platforms: ['Instagram', 'Facebook'],
      budget: formData.get('budget') as string,
      duration: formData.get('duration') as string,
      objective: formData.get('objective') as string,
    };

    try {
      const res = await campaignService.generateCampaign(request);
      setCampaigns([res.data, ...campaigns]);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center shrink-0">
            <Megaphone className="h-6 w-6 text-brand-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Campaigns</h1>
            <p className="text-sm text-text-muted mt-0.5">Generate high-converting marketing strategies, content calendars, and targeted ad copy.</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "bg-surface border border-border text-white hover:bg-surface-elevated" : "bg-brand-gradient hover:opacity-90 text-white shadow-lg shadow-purple-500/20"}
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'New Campaign'}
        </Button>
      </div>

      {/* Campaign Creation Form */}
      {showForm && (
        <Card className="border-border bg-surface shadow-2xl animate-in slide-in-from-top-4 overflow-hidden">
          <CardHeader className="bg-surface-elevated/50 border-b border-border/80 pb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              Create AI Marketing Campaign
            </CardTitle>
            <CardDescription>
              Fill in your campaign parameters. AI will research market positioning, generate content roadmaps, and write persuasive ad copy.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-text-muted uppercase">Campaign Name</Label>
                  <Input name="name" required placeholder="e.g. Festive Fashion Collection 2026" className="bg-surface-elevated border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-text-muted uppercase">Campaign Goal</Label>
                  <select name="goal" className="flex h-10 w-full rounded-md border border-border bg-surface-elevated text-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple outline-none">
                    <option value="Sales">Sales</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Leads">Leads</option>
                    <option value="Engagement">Engagement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-text-muted uppercase">Target Audience</Label>
                  <Input name="targetAudience" required placeholder="e.g. Modern women aged 18-35 in metropolitan cities" className="bg-surface-elevated border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-text-muted uppercase">Budget</Label>
                  <Input name="budget" placeholder="e.g. ₹25,000 / month" className="bg-surface-elevated border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-text-muted uppercase">Duration</Label>
                  <Input name="duration" placeholder="e.g. 30 days" className="bg-surface-elevated border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-text-muted uppercase">Campaign Objective</Label>
                  <Input name="objective" placeholder="e.g. Drive 3x ROAS and establish festive wardrobe positioning" className="bg-surface-elevated border-border" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isGenerating} className="bg-brand-gradient hover:opacity-90 text-white font-bold px-6 shadow-md">
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Strategy...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Campaign with AI</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Listing */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-brand-purple" />
          <p className="text-sm text-text-muted">Loading your marketing campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center text-text-muted border rounded-2xl bg-surface-elevated/40 border-border border-dashed space-y-3">
          <Target className="h-14 w-14 text-text-muted/60" />
          <h3 className="text-lg font-bold text-white">No campaigns generated yet</h3>
          <p className="text-sm text-text-muted max-w-sm">Click &quot;New Campaign&quot; above to let AI craft an all-in-one marketing strategy with suggested posts and ad copy.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {campaigns.map((campaign) => {
            const campaignId = (campaign.id || campaign._id) as string;
            const strategySections = parseStrategySections(campaign.strategy);
            const isExpanded = expandedCampaignId === campaignId;

            return (
              <Card key={campaignId || Math.random().toString()} className="overflow-hidden bg-surface border-border shadow-xl hover:border-brand-purple/30 transition-all rounded-2xl">
                {/* Header Bar */}
                <div className="bg-surface-elevated/90 p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl font-extrabold text-white tracking-tight">{campaign.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {campaign.goal || "Growth"}
                      </span>
                      {campaign.duration && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {campaign.duration}
                        </span>
                      )}
                      {campaign.budget && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
                          Budget: {campaign.budget}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                      {campaign.targetAudience && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-text-muted" />
                          <strong className="text-neutral-300">Audience:</strong> {campaign.targetAudience}
                        </span>
                      )}
                      {campaign.platforms && campaign.platforms.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 text-text-muted" />
                          <strong className="text-neutral-300">Platforms:</strong> {campaign.platforms.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs font-semibold rounded-xl border-border bg-surface hover:bg-surface-elevated text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                      onClick={() => setExpandedCampaignId(isExpanded ? null : campaignId)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 text-brand-purple" />
                          Hide Strategy
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-brand-purple" />
                          View Full Strategy
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="rounded-xl px-3 cursor-pointer"
                      onClick={() => handleDelete(campaignId)}
                      title="Delete Campaign"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 3-Column Content Body */}
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 1. Strategy Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-brand-purple" />
                          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">Strategy & Positioning</h4>
                        </div>
                        <button
                          onClick={() => copyToClipboard(campaign.strategy, `strat-${campaignId}`)}
                          className="text-xs text-text-muted hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy Strategy"
                        >
                          {copiedKey === `strat-${campaignId}` ? (
                            <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400 text-[11px] font-semibold">Copied</span></>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /><span className="text-[11px]">Copy</span></>
                          )}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {strategySections.map((sec, sIdx) => (
                          <div key={sIdx} className="bg-surface-elevated/60 border border-border/80 hover:border-brand-purple/30 transition-all rounded-xl p-3.5 space-y-1.5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-brand-purple shrink-0"></span>
                              <h5 className="font-bold text-white text-xs">{sec.title}</h5>
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed pl-3.5 border-l-2 border-brand-purple/20">
                              {sec.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Content Blueprint (Suggested Posts) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-brand-purple" />
                          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">Content Blueprint</h4>
                        </div>
                        <span className="text-[11px] text-brand-purple font-semibold bg-brand-purple/10 px-2 py-0.5 rounded-full border border-brand-purple/20">
                          {campaign.suggestedPosts?.length || 0} Posts
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(campaign.suggestedPosts || []).slice(0, 2).map((rawPost, pIdx) => {
                          const parsed = parsePostItem(rawPost, pIdx);
                          const postKey = `post-${campaignId}-${pIdx}`;

                          return (
                            <div key={pIdx} className="bg-surface-elevated/60 border border-border/80 hover:border-brand-purple/30 transition-all rounded-xl p-3.5 space-y-2.5 shadow-sm">
                              {/* Title & Hook */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple text-[10px] font-bold">
                                      Post {pIdx + 1}
                                    </span>
                                    {parsed.hook && (
                                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                                        {parsed.hook}
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-white text-xs leading-snug line-clamp-1">{parsed.title}</h5>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(parsed.caption || parsed.raw, postKey)}
                                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
                                  title="Copy Caption"
                                >
                                  {copiedKey === postKey ? (
                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              {/* Visual Concept */}
                              {parsed.visualConcept && (
                                <div className="bg-black/30 rounded-lg p-2 border border-white/5 text-[11px] text-neutral-300">
                                  <div className="flex items-center gap-1 text-text-muted font-bold text-[9px] uppercase tracking-wider mb-0.5">
                                    <Camera className="w-3 h-3 text-brand-purple" />
                                    Visual Concept
                                  </div>
                                  <p className="line-clamp-2 leading-relaxed">{parsed.visualConcept}</p>
                                </div>
                              )}

                              {/* Caption Draft */}
                              {parsed.caption && (
                                <div className="bg-black/20 rounded-lg p-2 border border-white/5 text-[11px] text-neutral-300">
                                  <div className="text-text-muted font-bold text-[9px] uppercase tracking-wider mb-0.5">
                                    Caption Draft
                                  </div>
                                  <p className="line-clamp-3 leading-relaxed">{parsed.caption}</p>
                                </div>
                              )}

                              {/* Hashtags */}
                              {parsed.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  {parsed.hashtags.slice(0, 4).map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[10px] font-semibold text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded border border-brand-purple/20">
                                      {tag}
                                    </span>
                                  ))}
                                  {parsed.hashtags.length > 4 && (
                                    <span className="text-[10px] text-text-muted font-medium py-0.5">
                                      +{parsed.hashtags.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. High-Converting Ad Copy */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">High-Converting Ad Copy</h4>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-7 text-xs px-2.5 rounded-lg font-semibold flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 border border-brand-purple/20 cursor-pointer"
                          onClick={() => handleGenerateAdCopy(campaign)}
                          disabled={generatingAdCopyId === campaignId}
                        >
                          {generatingAdCopyId === campaignId ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                          Generate with AI
                        </Button>
                      </div>

                      <div className="bg-gradient-to-br from-surface-elevated/90 to-purple-950/20 border border-brand-purple/30 rounded-xl p-4 relative group space-y-3 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-3xl font-serif text-brand-purple/50 leading-none">&ldquo;</span>
                          <button
                            onClick={() => copyToClipboard(campaign.adCopy, `adcopy-${campaignId}`)}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
                            title="Copy Ad Copy"
                          >
                            {copiedKey === `adcopy-${campaignId}` ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-white/95 italic font-medium leading-relaxed pl-1">
                          {campaign.adCopy}
                        </p>

                        {campaign.callToAction && (
                          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[11px] text-text-muted font-medium">Recommended CTA:</span>
                            <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-sm">
                              {campaign.callToAction}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Expanded Full Strategy Intelligence */}
                  {isExpanded && (
                    <div className="mt-8 pt-6 border-t border-border/80 space-y-6 animate-in fade-in slide-in-from-top-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-brand-purple" />
                          Comprehensive Campaign Intelligence
                        </h4>
                        <button
                          onClick={() => copyToClipboard(
                            `${campaign.name}\n\nSTRATEGY:\n${campaign.strategy}\n\nCONTENT STRATEGY:\n${campaign.contentStrategy || ''}\n\nPOSTS:\n${campaign.suggestedPosts?.join('\n\n') || ''}`,
                            `full-${campaignId}`
                          )}
                          className="text-xs text-text-muted hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedKey === `full-${campaignId}` ? (
                            <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400 font-semibold">Copied Entire Blueprint</span></>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /><span>Copy Full Blueprint</span></>
                          )}
                        </button>
                      </div>

                      {/* Audience & Schedule Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-surface-elevated/50 p-4 rounded-xl border border-border/70 space-y-2">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-brand-purple" /> Target Audience Profile & Channels
                          </h5>
                          <p className="text-xs text-neutral-200 leading-relaxed"><strong className="text-white">Audience:</strong> {campaign.targetAudience}</p>
                          <div className="pt-1 flex flex-wrap gap-1.5">
                            {campaign.platforms?.map(p => (
                              <span key={p} className="text-[10px] font-semibold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-surface-elevated/50 p-4 rounded-xl border border-border/70 space-y-2">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-purple" /> Budget Allocation & Schedule
                          </h5>
                          <div className="space-y-1 text-xs text-neutral-200">
                            <p><strong className="text-white">Budget:</strong> {campaign.budget || "₹25,000 / month"}</p>
                            <p><strong className="text-white">Posting Schedule:</strong> {campaign.postingSchedule || "Daily prime-time active hours"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Extended Narrative */}
                      {campaign.contentStrategy && (
                        <div className="bg-surface-elevated/50 p-4 rounded-xl border border-border/70 space-y-2">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-brand-purple" /> Extended Content Strategy Narrative
                          </h5>
                          <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                            {campaign.contentStrategy}
                          </p>
                        </div>
                      )}

                      {/* All Suggested Posts in Multi-column Cards */}
                      {campaign.suggestedPosts && campaign.suggestedPosts.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5 text-brand-purple" /> All Content Posts Blueprint ({campaign.suggestedPosts.length})
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {campaign.suggestedPosts.map((rawPost, idx) => {
                              const parsed = parsePostItem(rawPost, idx);
                              const fullPostKey = `full-post-${campaignId}-${idx}`;

                              return (
                                <div key={idx} className="bg-surface-elevated/70 border border-border/80 hover:border-brand-purple/40 transition-all rounded-xl p-4 space-y-2.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple text-[10px] font-bold">
                                          Post {idx + 1}
                                        </span>
                                        {parsed.hook && (
                                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                                            {parsed.hook}
                                          </span>
                                        )}
                                      </div>
                                      <h5 className="font-bold text-white text-xs mt-1 leading-snug">{parsed.title}</h5>
                                    </div>
                                    <button
                                      onClick={() => copyToClipboard(parsed.caption || parsed.raw, fullPostKey)}
                                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
                                      title="Copy Caption"
                                    >
                                      {copiedKey === fullPostKey ? (
                                        <Check className="w-3.5 h-3.5 text-green-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>

                                  {parsed.visualConcept && (
                                    <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 text-xs text-neutral-300">
                                      <div className="flex items-center gap-1 text-text-muted font-bold text-[10px] uppercase tracking-wider mb-0.5">
                                        <Camera className="w-3 h-3 text-brand-purple" />
                                        Visual Concept
                                      </div>
                                      <p className="leading-relaxed">{parsed.visualConcept}</p>
                                    </div>
                                  )}

                                  {parsed.caption && (
                                    <div className="bg-black/20 rounded-lg p-2.5 border border-white/5 text-xs text-neutral-300">
                                      <div className="text-text-muted font-bold text-[10px] uppercase tracking-wider mb-0.5">
                                        Caption Draft
                                      </div>
                                      <p className="leading-relaxed">{parsed.caption}</p>
                                    </div>
                                  )}

                                  {parsed.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-1">
                                      {parsed.hashtags.map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[10px] font-semibold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded border border-brand-purple/20">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                    <Link
                                      href="/ai-post"
                                      className="text-xs font-semibold text-brand-purple hover:text-purple-300 flex items-center gap-1 transition-colors"
                                    >
                                      <span>Create in AI Post Maker</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Suggested Reels if available */}
                      {campaign.suggestedReels && campaign.suggestedReels.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                            <Film className="w-3.5 h-3.5 text-brand-purple" /> Viral Reel Concepts ({campaign.suggestedReels.length})
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {campaign.suggestedReels.map((reelText, rIdx) => (
                              <div key={rIdx} className="bg-surface-elevated/70 border border-border/80 rounded-xl p-4 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                                    <Film className="w-3 h-3" /> Reel #{rIdx + 1}
                                  </span>
                                  <Link
                                    href="/reel-creator"
                                    className="text-xs font-semibold text-brand-purple hover:text-purple-300 flex items-center gap-1"
                                  >
                                    Create Reel <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                                <p className="text-xs text-neutral-200 leading-relaxed">{reelText}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Quick Jump Action Banner */}
                      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-brand-purple/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">Campaign Call to Action</p>
                          <p className="text-white font-bold text-sm mt-0.5">{campaign.callToAction || "Explore Our New Collection"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs cursor-pointer" asChild>
                            <Link href="/ai-post">Open AI Post Maker</Link>
                          </Button>
                          <Button size="sm" className="bg-brand-gradient hover:opacity-90 text-xs text-white cursor-pointer font-bold shadow-md" asChild>
                            <Link href="/content-library">View Content Library</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
