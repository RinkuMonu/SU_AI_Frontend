"use client";

import { useState, useEffect } from 'react';
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
  Hash, 
  CheckCircle2, 
  Lightbulb,
  Loader2,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { resolveImageUrl, handleImageError } from '@/lib/imageUtils';

interface ContentPreviewProps {
  content: GeneratedContent;
  onRegenerate: () => void | Promise<void>;
  onSave: (editedContent: GeneratedContent) => void | Promise<void>;
  isGenerating?: boolean;
}

export function ContentPreview({ content, onRegenerate, onSave, isGenerating = false }: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<GeneratedContent>(content);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Schedule modal state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [scheduleDate, setScheduleDate] = useState(defaultDateStr);
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [schedulePlatform, setSchedulePlatform] = useState(content.platform || "Instagram");

  const [notification, setNotification] = useState<{ 
    type: 'success' | 'error' | 'info'; 
    message: string; 
    actionUrl?: string; 
    actionLabel?: string; 
  } | null>(null);

  // Synchronize state when the content prop changes (e.g., when regenerated or when a new card is selected)
  useEffect(() => {
    setEditedContent(content);
    setSchedulePlatform(content.platform || "Instagram");
    setIsEditing(false);
  }, [content]);

  const showNotification = (
    message: string, 
    type: 'success' | 'error' | 'info' = 'success', 
    actionUrl?: string, 
    actionLabel?: string
  ) => {
    setNotification({ type, message, actionUrl, actionLabel });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleCopyAll = () => {
    const textToCopy = `${editedContent.title}\n\n${editedContent.caption}\n\n${(editedContent.hashtags || []).join(' ')}`;
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toSave: GeneratedContent = {
        ...editedContent,
        updatedAt: new Date().toISOString(),
      };
      await onSave(toSave);
      setEditedContent(toSave);
      setIsEditing(false);
      showNotification("Content saved to Content Library!", "success", "/content-library", "View in Library");
    } catch (err: any) {
      console.error("Failed to save content:", err);
      showNotification("Failed to save content. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateClick = async () => {
    if (isRegenerating || isGenerating || isSaving) return;
    setIsRegenerating(true);
    try {
      await onRegenerate();
      showNotification("New variation generated successfully!", "success");
    } catch (err: any) {
      console.error("Failed to regenerate:", err);
      showNotification("Failed to generate new variation.", "error");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleConfirmSchedule = async () => {
    setIsScheduling(true);
    try {
      const scheduledIso = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      const scheduledContent: GeneratedContent = {
        ...editedContent,
        platform: schedulePlatform,
        status: 'Scheduled',
        scheduledAt: scheduledIso,
        updatedAt: new Date().toISOString(),
      };
      await onSave(scheduledContent);
      setEditedContent(scheduledContent);
      setShowScheduleModal(false);
      setIsEditing(false);
      showNotification(`Post scheduled for ${scheduleDate} at ${scheduleTime}!`, "success", "/content-library", "View in Library");
    } catch (err) {
      console.error("Failed to schedule:", err);
      showNotification("Failed to schedule post.", "error");
    } finally {
      setIsScheduling(false);
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('instagram')) return 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border-pink-500/30';
    if (p.includes('linkedin')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (p.includes('facebook')) return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    if (p.includes('youtube')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    return 'bg-brand-purple/10 text-brand-pink border-brand-purple/30';
  };

  const busy = isSaving || isRegenerating || isGenerating || isScheduling;

  return (
    <>
      <Card className="border border-border/80 shadow-2xl bg-surface/90 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all">
        {/* Feedback Toast Banner */}
        {notification && (
          <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl max-w-[90%] sm:max-w-md ${
            notification.type === 'error' 
              ? 'bg-rose-950/95 border-rose-500/50 text-rose-200' 
              : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
          }`}>
            {notification.type === 'error' ? (
              <X className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-medium truncate">{notification.message}</span>
            {notification.actionUrl && (
              <Link 
                href={notification.actionUrl} 
                className="text-xs font-bold text-white underline hover:text-brand-pink transition-colors ml-auto whitespace-nowrap flex items-center gap-1"
              >
                <span>{notification.actionLabel || 'View'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
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
                  {editedContent.type || 'Post'}
                </span>
                {editedContent.status && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                    editedContent.status === 'Scheduled' 
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : editedContent.status === 'Published'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                  }`}>
                    {editedContent.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-1 font-medium">
                Platform: <span className="text-slate-200">{editedContent.platform}</span> • Tone: <span className="text-slate-200">{editedContent.tone}</span> • Language: <span className="text-slate-200">{editedContent.language}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={busy}
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
                disabled={busy}
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
          {((editedContent as any).media_url || (editedContent as any).imageUrl || (editedContent as any).image_url) && (
            <div className="rounded-xl overflow-hidden border border-border shadow-md flex justify-center bg-black/40 p-2">
              <img 
                src={(editedContent as any).media_url || (editedContent as any).imageUrl || (editedContent as any).image_url} 
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
                value={(editedContent.hashtags || []).join(' ')}
                onChange={(e) => setEditedContent({...editedContent, hashtags: e.target.value.split(/\s+/).filter(Boolean)})}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(editedContent.hashtags || []).map((tag, i) => (
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
            onClick={handleRegenerateClick} 
            disabled={busy}
            className="text-text-muted hover:text-white hover:bg-surface-secondary text-xs h-10 transition-all font-medium disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${(isRegenerating || isGenerating) ? 'animate-spin text-brand-purple' : ''}`} />
            {isRegenerating || isGenerating ? "Generating Variation..." : "Regenerate Variation"}
          </Button>

          <div className="flex items-center gap-2.5">
            <Button 
              variant="outline" 
              onClick={() => setShowScheduleModal(true)} 
              disabled={busy}
              className="border-border text-slate-200 hover:text-white hover:bg-surface-secondary text-xs h-10 font-medium"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
              <span>Schedule Post</span>
            </Button>

            <Button 
              onClick={handleSave} 
              disabled={busy}
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs h-10 shadow-md shadow-brand-purple/20 min-w-[125px] transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  <span>Save Content</span>
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Schedule Post Modal */}
      {showScheduleModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isScheduling) {
              setShowScheduleModal(false);
            }
          }}
        >
          <div className="w-full max-w-lg bg-surface-elevated border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-border/60 flex items-center justify-between bg-surface/60">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Schedule AI Post</h3>
                  <p className="text-xs text-text-muted">Choose when to automatically publish this post.</p>
                </div>
              </div>
              <button 
                type="button" 
                disabled={isScheduling}
                onClick={() => setShowScheduleModal(false)}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Post Preview Snippet */}
              <div className="p-3.5 rounded-xl bg-surface border border-border/70 space-y-1">
                <span className="text-[10px] font-bold text-brand-pink uppercase tracking-wider">Post Preview</span>
                <p className="text-sm font-semibold text-white line-clamp-1">{editedContent.title}</p>
                <p className="text-xs text-text-muted line-clamp-2">{editedContent.caption}</p>
              </div>

              {/* Target Platform */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Social Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Instagram', 'Facebook', 'LinkedIn', 'YouTube'].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setSchedulePlatform(plat)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        schedulePlatform.toLowerCase() === plat.toLowerCase()
                          ? 'bg-brand-purple/20 border-brand-purple text-white shadow-sm'
                          : 'bg-surface border-border text-text-muted hover:text-white hover:border-border/80'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Publish Date</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Publish Time</span>
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                  />
                </div>
              </div>

              {/* Recommended Timing Info */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 text-xs text-sky-300">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Peak engagement window: 10:00 AM – 1:00 PM for {schedulePlatform}.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface/80 border-t border-border/60 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                type="button"
                disabled={isScheduling}
                onClick={() => setShowScheduleModal(false)}
                className="border-border text-slate-300 hover:text-white h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isScheduling}
                onClick={handleConfirmSchedule}
                className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs h-9 px-4 shadow-md shadow-brand-purple/20"
              >
                {isScheduling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    <span>Confirm & Schedule</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

