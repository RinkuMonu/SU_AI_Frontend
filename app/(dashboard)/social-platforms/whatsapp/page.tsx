"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Loader2, 
  Check, 
  ShieldCheck, 
  Share2, 
  Upload, 
  Send, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Phone, 
  CheckCheck, 
  Info, 
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Layers,
  MessageCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { socialService } from "@/services/social.service";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#25D366" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function WhatsAppIntegrationPage() {
  const [activeTab, setActiveTab] = useState<"publisher" | "settings">("publisher");
  const [loadingData, setLoadingData] = useState(true);

  // WhatsApp Credentials State
  const [phoneId, setPhoneId] = useState("");
  const [token, setToken] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Upload & Share State
  const [contentList, setContentList] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [customMessage, setCustomMessage] = useState(
    "🌟 Special Offer! Check out our latest products and deals. Contact us now to order or learn more!"
  );
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [targetPhone, setTargetPhone] = useState("");
  const [isPublishingApi, setIsPublishingApi] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch business profile & content on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await api.get('/api/v1/businesses/me');
        if (res.data) {
          if (res.data.whatsapp_phone_id) setPhoneId(res.data.whatsapp_phone_id);
          if (res.data.whatsapp_token) setToken(res.data.whatsapp_token);
          if (res.data.contact_phone) {
            setContactPhone(res.data.contact_phone);
            setTargetPhone(res.data.contact_phone);
          }
          if (res.data.whatsapp_phone_id && res.data.whatsapp_token) {
            setIsConnected(true);
          }
        }
      } catch (e) {
        console.warn("Could not load business details", e);
      } finally {
        setLoadingData(false);
      }

      // Fetch AI content items for 1-click select
      try {
        setLoadingContent(true);
        const contentRes = await api.get('/api/v1/content');
        const items = Array.isArray(contentRes.data) ? contentRes.data : contentRes.data?.data || [];
        setContentList(items);

        // Preselect the first one if available
        if (items.length > 0) {
          const first = items[0];
          setSelectedContentId(first._id || "");
          setMediaUrl(first.imageUrl || first.image_url || first.media_url || "");
          const text = first.caption || first.text || first.content || "";
          if (text) setCustomMessage(text);
        }
      } catch (err) {
        console.warn("Could not fetch content items", err);
      } finally {
        setLoadingContent(false);
      }
    }

    loadInitialData();
  }, []);

  // Handle selecting an AI generated item
  const handleSelectContent = (item: any) => {
    setSelectedContentId(item._id || "");
    const img = item.imageUrl || item.image_url || item.media_url || "";
    setMediaUrl(img);
    const text = item.caption || item.text || item.content || "";
    if (text) {
      setCustomMessage(text);
    }
  };

  // Handle manual local file upload preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaUrl(reader.result as string);
        setSelectedContentId(""); // Custom item
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Meta WhatsApp Credentials
  const handleSaveCredentials = async () => {
    setIsUpdating(true);
    setPublishError(null);
    try {
      await api.put('/api/v1/businesses/me', {
        whatsapp_phone_id: phoneId,
        whatsapp_token: token,
        contact_phone: contactPhone
      });
      setUpdated(true);
      if (phoneId && token) {
        setIsConnected(true);
      }
      setTimeout(() => setUpdated(false), 3000);
    } catch (error: any) {
      console.error("Failed to update WhatsApp settings", error);
      setPublishError("Failed to save WhatsApp settings. Please verify details.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Clean phone number for WhatsApp URL
  const getCleanPhone = (phone: string) => {
    let clean = phone.replace(/[^\d]/g, "");
    if (clean.length === 10) {
      // Default to India country code 91 if 10 digits provided
      clean = "91" + clean;
    }
    return clean;
  };

  // 1-Click WhatsApp Direct Share (Web / App)
  const handleDirectWhatsAppShare = () => {
    const cleanPhone = getCleanPhone(targetPhone);
    let fullText = customMessage.trim();
    if (mediaUrl && !mediaUrl.startsWith("data:")) {
      fullText += `\n\n🖼️ View Image: ${mediaUrl}`;
    }

    const encodedText = encodeURIComponent(fullText);
    const whatsappUrl = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Publish using backend official API endpoint
  const handlePublishViaApi = async () => {
    if (!selectedContentId) {
      // If user uploaded custom image, provide instant direct WhatsApp send
      handleDirectWhatsAppShare();
      return;
    }

    setIsPublishingApi(true);
    setPublishSuccess(null);
    setPublishError(null);

    try {
      const cleanPhone = getCleanPhone(targetPhone);
      await socialService.publishToWhatsApp(selectedContentId, cleanPhone);
      setPublishSuccess("Post published and delivered to WhatsApp successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Failed to publish via WhatsApp API";
      if (msg.toLowerCase().includes("not configured") || msg.toLowerCase().includes("credentials")) {
        setPublishError("WhatsApp API credentials missing or incomplete. Switched to 1-Click WhatsApp Web share.");
        handleDirectWhatsAppShare();
      } else {
        setPublishError(msg);
      }
    } finally {
      setIsPublishingApi(false);
    }
  };

  // Copy message text to clipboard
  const handleCopyMessage = () => {
    let fullText = customMessage.trim();
    if (mediaUrl && !mediaUrl.startsWith("data:")) {
      fullText += `\n\n${mediaUrl}`;
    }
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5">
            <WhatsAppIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              WhatsApp Publisher
            </h1>
            <p className="text-text-muted mt-1 text-sm">
              Upload, preview and share your AI posts directly to WhatsApp chats, status, and broadcasts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Cloud API Connected
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated border border-border text-slate-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Direct Share Ready
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("publisher")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "publisher"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "text-text-muted hover:text-white hover:bg-surface-elevated"
          }`}
        >
          <Share2 className="w-4 h-4" /> Upload & Share to WhatsApp
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "settings"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "text-text-muted hover:text-white hover:bg-surface-elevated"
          }`}
        >
          <Phone className="w-4 h-4" /> WhatsApp API Settings
        </button>
      </div>

      {/* TAB 1: UPLOAD & SHARE */}
      {activeTab === "publisher" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Content & Upload Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Source Selection: AI Posts or Custom Upload */}
            <Card className="bg-surface border-border shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    <CardTitle className="text-white text-base">Select AI Post or Upload Media</CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> Custom Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <CardDescription className="text-xs">
                  Pick an AI-generated post from your library or upload an image banner from your computer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Horizontal scroll of AI posts */}
                {loadingContent ? (
                  <div className="flex items-center justify-center p-6 text-sm text-text-muted">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading recent AI posts...
                  </div>
                ) : contentList.length > 0 ? (
                  <div>
                    <Label className="text-xs text-text-muted mb-2 block">Recent AI Content Items:</Label>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {contentList.slice(0, 10).map((item) => {
                        const isSelected = selectedContentId === item._id;
                        const thumb = item.imageUrl || item.image_url || item.media_url;
                        return (
                          <div
                            key={item._id}
                            onClick={() => handleSelectContent(item)}
                            className={`min-w-[120px] max-w-[120px] p-2 rounded-lg border cursor-pointer transition-all flex flex-col items-center gap-1.5 shrink-0 ${
                              isSelected
                                ? "bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                                : "bg-surface-elevated border-border text-text-muted hover:border-slate-500 hover:text-white"
                            }`}
                          >
                            <div className="w-full h-20 rounded bg-slate-900 overflow-hidden flex items-center justify-center relative">
                              {thumb ? (
                                <img src={thumb} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-slate-600" />
                              )}
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                            <span className="text-[11px] truncate w-full text-center">
                              {item.caption || item.text || "AI Post"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-surface-elevated border border-dashed border-border text-center text-xs text-text-muted">
                    No generated posts found. Click "Custom Upload" or generate new posts in AI Content.
                  </div>
                )}

                {/* Direct Image URL input if desired */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-white">Media Image URL / Banner</Label>
                  <Input
                    placeholder="https://... or uploaded image"
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      setSelectedContentId("");
                    }}
                    className="border-border bg-surface-elevated text-white text-xs font-mono h-9 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Message & Recipient Details */}
            <Card className="bg-surface border-border shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" /> Message & Recipient Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Customize the caption message, emoji highlights, and target WhatsApp number.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Target Number */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-white flex items-center justify-between">
                    <span>Target WhatsApp Phone Number</span>
                    <span className="text-[11px] text-text-muted font-normal">
                      Include country code (e.g., 919876543210)
                    </span>
                  </Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
                    <Input
                      type="tel"
                      placeholder="e.g. 919876543210 or leave blank to choose in WhatsApp"
                      value={targetPhone}
                      onChange={(e) => setTargetPhone(e.target.value)}
                      className="border-border bg-surface-elevated text-white pl-9 h-9 text-sm focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Caption / Message Text */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-white">WhatsApp Message Text</Label>
                    <div className="flex gap-1">
                      {["🔥 Offer", "✨ New", "🛍️ Shop", "📞 Contact"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setCustomMessage((prev) => `${prev} ${tag}`)}
                          className="text-[10px] bg-surface-elevated hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-border"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Type your WhatsApp post message or offer description..."
                    className="w-full rounded-md border border-border bg-surface-elevated p-3 text-sm text-white placeholder-text-muted outline-none focus:ring-1 focus:ring-emerald-500 transition-all custom-scrollbar"
                  />
                  <p className="text-[11px] text-text-muted">
                    Tip: Use *bold* for emphasis, _italic_ for styling, and emojis to increase engagement!
                  </p>
                </div>

                {/* Feedback notifications */}
                {publishSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 shrink-0" /> {publishSuccess}
                  </div>
                )}
                {publishError && (
                  <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {publishError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {/* Primary 1-Click WhatsApp Direct Share */}
                  <Button
                    type="button"
                    onClick={handleDirectWhatsAppShare}
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold h-11 shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon className="h-5 w-5" /> Share on WhatsApp Web / App
                  </Button>

                  {/* Secondary API Publish if content item is selected */}
                  {selectedContentId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePublishViaApi}
                      disabled={isPublishingApi}
                      className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 h-11 text-xs font-semibold px-4 flex items-center justify-center gap-2"
                    >
                      {isPublishingApi ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send via Cloud API
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCopyMessage}
                    className="h-11 px-3 text-text-muted hover:text-white"
                    title="Copy Message Text"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live WhatsApp Mobile Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp Live Chat Preview
                </span>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Recipient View
                </span>
              </div>

              {/* Smartphone Frame Mockup */}
              <div className="rounded-[28px] border-4 border-slate-800 bg-[#0c1317] shadow-2xl overflow-hidden max-w-[340px] mx-auto">
                {/* Phone Speaker Notch */}
                <div className="bg-[#1f2c34] h-6 flex items-center justify-center">
                  <div className="w-16 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* WhatsApp Chat Header */}
                <div className="bg-[#1f2c34] px-3 py-2.5 flex items-center justify-between text-white border-b border-slate-700/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs shadow">
                      DG
                    </div>
                    <div>
                      <p className="font-semibold text-xs leading-none">Your Business Store</p>
                      <p className="text-[10px] text-emerald-400 mt-0.5">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Chat Background & Message Bubbles */}
                <div 
                  className="p-3 min-h-[360px] max-h-[460px] overflow-y-auto space-y-3 flex flex-col justify-end"
                  style={{
                    backgroundColor: "#0b141a",
                    backgroundImage: "radial-gradient(circle at 50% 50%, rgba(37, 211, 102, 0.03) 0%, transparent 80%)"
                  }}
                >
                  {/* Date badge */}
                  <div className="flex justify-center">
                    <span className="bg-[#182229] text-slate-400 text-[10px] px-2.5 py-0.5 rounded-md shadow-sm">
                      Today
                    </span>
                  </div>

                  {/* Outgoing Message Bubble */}
                  <div className="self-end max-w-[90%] bg-[#005c4b] text-white rounded-lg rounded-tr-none p-2 shadow-md space-y-1.5 animate-in fade-in">
                    {/* Media Image if available */}
                    {mediaUrl ? (
                      <div className="rounded-md overflow-hidden bg-slate-900 border border-emerald-900/40">
                        <img 
                          src={mediaUrl} 
                          alt="Post Preview" 
                          className="w-full max-h-48 object-cover" 
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null}

                    {/* Text Message */}
                    <div className="text-xs whitespace-pre-wrap leading-relaxed pr-2 font-normal text-slate-100">
                      {customMessage || "Type a message..."}
                    </div>

                    {/* Time & Double Tick */}
                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 -mt-0.5">
                      <span>12:30 PM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>

                {/* Phone Bottom Input Mockup */}
                <div className="bg-[#1f2c34] p-2 flex items-center gap-2 border-t border-slate-700/40">
                  <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-slate-400">
                    Type a message
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Quick instructions under preview */}
              <div className="mt-4 p-3 rounded-lg bg-surface-elevated border border-border text-[11px] text-text-muted space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400" /> Instant Customer Outreach:
                </p>
                <p>
                  Clicking <strong>"Share on WhatsApp Web / App"</strong> automatically opens your WhatsApp with the prepared image and caption ready to send to your target customer or broadcast list.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHATSAPP CLOUD API SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-4xl space-y-6">
          <Card className="bg-surface border-border shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="h-6 w-6" />
                <CardTitle className="text-white">Meta WhatsApp Business API Settings</CardTitle>
              </div>
              <CardDescription>
                Configure your Meta Developer WhatsApp Cloud API credentials to enable automated backend publishing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white text-xs">WhatsApp Business Phone Number</Label>
                <Input
                  placeholder="e.g. +91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="border-border bg-surface-elevated text-white focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
                />
                <p className="text-[11px] text-text-muted">
                  Your registered business telephone number for customer replies and inquiries.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-xs">WhatsApp Phone Number ID</Label>
                <Input
                  placeholder="e.g. 102938475612345"
                  value={phoneId}
                  onChange={(e) => setPhoneId(e.target.value)}
                  className="border-border bg-surface-elevated text-white focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
                />
                <p className="text-[11px] text-text-muted">
                  Found in your Meta App Dashboard under WhatsApp &gt; API Setup &gt; Phone number ID.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-xs">Permanent System User Access Token</Label>
                <Input
                  type="password"
                  placeholder="EAAB..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="border-border bg-surface-elevated text-white focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                />
                <p className="text-[11px] text-text-muted">
                  Permanent access token with `whatsapp_business_messaging` and `whatsapp_business_management` permissions.
                </p>
              </div>

              <Button
                onClick={handleSaveCredentials}
                disabled={isUpdating}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold transition-all mt-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving WhatsApp Settings...
                  </>
                ) : updated ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Saved Successfully
                  </>
                ) : (
                  "Save WhatsApp Credentials"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Guide Card */}
          <Card className="bg-surface-elevated border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                How to get Meta WhatsApp Cloud API Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-text-muted space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <span>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">developers.facebook.com</a> and create a "Business" type app.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <span>Add the <strong>WhatsApp</strong> product to your app.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <span>Copy your <strong>Phone Number ID</strong> and <strong>Temporary / System User Access Token</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                <span>Paste them into the fields above and click Save.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
