"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GeneratedContent } from '@/types/content';
import { 
  Copy, 
  RefreshCw, 
  Save, 
  Calendar, 
  Check, 
  Edit2, 
  X, 
  Sparkles, 
  Share2, 
  Hash, 
  CheckCircle2, 
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface ContentPreviewProps {
  content: GeneratedContent;
  onRegenerate: () => void;
  onSave: (editedContent: GeneratedContent) => void;
}

export function ContentPreview({ content, onRegenerate, onSave }: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopyAll = () => {
    const textToCopy = `${editedContent.title}\n\n${editedContent.caption}\n\n${editedContent.hashtags.join(' ')}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedAll(true);
    showNotification("Full content copied to clipboard!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyCaptionOnly = () => {
    navigator.clipboard?.writeText(editedContent.caption);
    setCopiedCaption(true);
    showNotification("Caption text copied!");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
    showNotification("Content saved to Content Library successfully!");
  };

  const handleSchedule = () => {
    const scheduledContent = { ...editedContent, status: 'Scheduled' as const };
    onSave(scheduledContent);
    setIsEditing(false);
    showNotification("Content scheduled for auto-posting!");
  };

  const getPlatformBadgeColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border-pink-500/30';
    if (p.includes('linkedin')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (p.includes('facebook')) return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    if (p.includes('youtube')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    return 'bg-brand-purple/10 text-brand-pink border-brand-purple/30';
  };

  return (
    <Card className="border border-border/80 shadow-2xl bg-surface/90 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all">
      {/* Feedback Toast Banner */}
      {notification && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-surface-elevated border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      <CardHeader className="bg-surface-elevated/40 border-b border-border/60 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                Generated Result
              </CardTitle>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getPlatformBadgeColor(editedContent.platform)}`}>
                {editedContent.type}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 font-medium">
              Platform: <span className="text-slate-200">{editedContent.platform}</span> • Tone: <span className="text-slate-200">{editedContent.tone}</span> • Language: <span className="text-slate-200">{editedContent.language}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)} 
              className="border-border text-slate-200 hover:text-white hover:bg-surface-secondary text-xs h-9 gap-1.5"
            >
              {isEditing ? (
                <>
                  <X className="h-3.5 w-3.5 text-rose-400" /> Cancel
                </>
              ) : (
                <>
                  <Edit2 className="h-3.5 w-3.5 text-brand-pink" /> Edit
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyAll} 
              className="border-border text-slate-200 hover:text-white hover:bg-surface-secondary text-xs h-9 gap-1.5"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-brand-coral" /> Copy All
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Optional Media Preview */}
        {(editedContent as any).media_url && (
          <div className="rounded-xl overflow-hidden border border-border shadow-md flex justify-center bg-black/40 p-2">
            <img 
              src={(editedContent as any).media_url} 
              alt="Generated Creative" 
              className="w-full max-w-md h-auto rounded-lg object-contain" 
            />
          </div>
        )}

        {/* Title / Headline */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Headline / Title</h3>
          {isEditing ? (
            <input 
              className="w-full p-3 rounded-xl border border-border bg-surface-elevated text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
              value={editedContent.title}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
            />
          ) : (
            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {editedContent.title}
            </h2>
          )}
        </div>

        {/* Caption Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Social Caption</h3>
            <button
              type="button"
              onClick={handleCopyCaptionOnly}
              className="text-xs text-brand-pink hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCaption ? "Copied" : "Copy Caption"}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea 
              rows={6}
              className="w-full p-3.5 rounded-xl border border-border bg-surface-elevated text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
              value={editedContent.caption}
              onChange={(e) => setEditedContent({...editedContent, caption: e.target.value})}
            />
          ) : (
            <div className="rounded-xl border border-border/70 bg-surface-elevated/60 p-4 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {editedContent.caption}
            </div>
          )}
        </div>

        {/* Hashtags */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-brand-purple" /> Recommended Hashtags
          </h3>
          {isEditing ? (
            <input 
              className="w-full p-2.5 rounded-xl border border-border bg-surface-elevated text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
              value={editedContent.hashtags.join(' ')}
              onChange={(e) => setEditedContent({...editedContent, hashtags: e.target.value.split(/\s+/).filter(Boolean)})}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {editedContent.hashtags.map((tag, i) => (
                <span 
                  key={i} 
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-brand-purple/10 text-brand-pink border border-brand-purple/20 hover:bg-brand-purple/20 transition-colors cursor-pointer"
                  onClick={() => {
                    navigator.clipboard?.writeText(tag);
                    showNotification(`Copied ${tag}`);
                  }}
                  title="Click to copy hashtag"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI Suggestions / Recommendations */}
        {editedContent.suggestions && editedContent.suggestions.length > 0 && !isEditing && (
          <div className="space-y-2.5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              AI Creative Direction
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {editedContent.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-surface-elevated/40 border-t border-border/60 p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <Button 
          variant="ghost" 
          onClick={onRegenerate} 
          className="text-text-muted hover:text-white hover:bg-surface-secondary text-xs h-10"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Regenerate Variation
        </Button>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={handleSchedule} 
            className="border-border text-slate-200 hover:text-white hover:bg-surface-secondary text-xs h-10"
          >
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-sky-400" /> Schedule Post
          </Button>

          <Button 
            onClick={handleSave} 
            className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs h-10 shadow-md shadow-brand-purple/20"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Content
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
