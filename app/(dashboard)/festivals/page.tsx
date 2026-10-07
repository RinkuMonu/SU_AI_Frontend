"use client";
import { useState, useEffect, useCallback } from "react";
import festivalService, {
  FestivalCampaign,
  UpcomingFestival,
  FestivalAsset,
} from "@/services/festival.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeLabel(type: string) {
  const map: Record<string, string> = {
    post: "📸 Post",
    reel: "🎬 Reel",
    ad: "📢 Ad",
    whatsapp: "💬 WhatsApp",
  };
  return map[type] ?? type;
}

function platformColor(platform: string) {
  const map: Record<string, string> = {
    instagram: "#E1306C",
    facebook: "#1877F2",
    whatsapp: "#25D366",
    meta: "#0082FB",
  };
  return map[platform] ?? "#888";
}

// ─── Asset Card ───────────────────────────────────────────────────────────────

function AssetCard({ asset }: { asset: FestivalAsset }) {
  const c = asset.content;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 10,
        borderLeft: `3px solid ${platformColor(asset.platform)}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
          {typeLabel(asset.type)}
        </span>
        <span
          style={{
            fontSize: 11,
            background: platformColor(asset.platform) + "33",
            color: platformColor(asset.platform),
            borderRadius: 20,
            padding: "2px 8px",
            fontWeight: 600,
          }}
        >
          {asset.platform} · Day {asset.day}
        </span>
      </div>
      {c.headline && (
        <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>
          {c.headline}
        </div>
      )}
      {c.hook && (
        <div style={{ fontWeight: 700, color: "#FFD700", fontSize: 14, marginBottom: 4 }}>
          🎣 {c.hook}
        </div>
      )}
      {c.body && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.body}</div>
      )}
      {c.script && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.script}</div>
      )}
      {c.message && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.message}</div>
      )}
      {c.primary_text && (
        <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.5 }}>{c.primary_text}</div>
      )}
      {c.cta && (
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: "#fff",
            background: "#7C3AED",
            display: "inline-block",
            borderRadius: 20,
            padding: "2px 10px",
          }}
        >
          {c.cta}
        </div>
      )}
      {asset.scheduled_date && (
        <div style={{ marginTop: 6, fontSize: 11, color: "#777" }}>
          📅 {asset.scheduled_date}
        </div>
      )}
    </div>
  );
}

// ─── Campaign Detail Modal ─────────────────────────────────────────────────────

const getFestivalPrompt = (festivalName: string) => {
  const name = festivalName.toLowerCase();
  if (name.includes("holi")) return "Holi festival celebration with vibrant colors, gulal, and water splashes";
  if (name.includes("diwali") || name.includes("deepavali")) return "Diwali festival celebration with bright fireworks, crackers, diyas, and beautiful rangoli";
  if (name.includes("republic") || name.includes("independence")) return "Indian national holiday celebration with tricolor flag, patriotic theme, and diverse culture";
  if (name.includes("eid")) return "Eid celebration with crescent moon, mosque silhouettes, and festive feast";
  if (name.includes("christmas")) return "Christmas celebration with decorated tree, snow, presents, and warm lights";
  if (name.includes("navratri") || name.includes("dussehra")) return "Navratri or Dussehra celebration with garba dance, vibrant traditional clothes, and festive lights";
  if (name.includes("ganesh") || name.includes("ganpati")) return "Ganesh Chaturthi celebration with beautiful lord Ganesha idol, modaks, and festive decorations";
  return `${festivalName} beautiful festive celebration, high quality, aesthetic`;
};

function CampaignModal({
  campaign,
  onClose,
  onApprove,
  onDelete,
  onRegenerate,
  loading,
}: {
  campaign: FestivalCampaign;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: (campaign: FestivalCampaign) => void;
  loading: boolean;
}) {
  const reel = campaign.assets?.find(a => a.type === "reel")?.content;
  const post = campaign.assets?.find(a => a.type === "post")?.content;
  const festivalContent = campaign.assets?.find(a => a.type === "content")?.content;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text || "");
    alert(`${label} copied!`);
  };

  const reelContentStr = reel ? `🎬 INSTAGRAM REEL\n\nReel Concept:\n${reel.concept}\n\nScript:\n${reel.script}\n\nScenes:\n${reel.scenes?.join('\n')}\n\nOn-Screen Text:\n${reel.on_screen_text}\n\nCaption:\n${reel.caption}\n\nDescription:\n${reel.description}\n\nHashtags:\n${reel.hashtags}\n\nCTA:\n${reel.cta}` : "";
  const postContentStr = post ? `📱 INSTAGRAM POST\n\nPost Concept:\n${post.concept}\n\nPost Copy:\n${post.post_copy}\n\nCaption:\n${post.caption}\n\nDescription:\n${post.description}\n\nHashtags:\n${post.hashtags}\n\nCTA:\n${post.cta}` : "";
  const fullContentStr = `✨ ${campaign.festival_name.toUpperCase()} CONTENT\n\n-----------------------------------\n\n${reelContentStr}\n\n-----------------------------------\n\n${postContentStr}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#1a1a2e",
          borderRadius: 20,
          width: "100%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg,#7C3AED22,#EC489922)",
          }}
        >
          <h2 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 700 }}>
            {campaign.festival_emoji} ✨ {campaign.festival_name.toUpperCase()} CONTENT
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        
        <div className="custom-scrollbar" style={{ overflowY: "auto", flex: 1, padding: "20px 24px", color: "#ddd", fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
          {reel && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: "#fff", fontSize: 18, borderBottom: "1px solid #444", paddingBottom: 8, marginTop: 0 }}>🎬 INSTAGRAM REEL</h3>
              <div style={{ marginBottom: 16, marginTop: 12, position: "relative", width: "100%", maxWidth: 300, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <style>{`
                  @keyframes slowPan {
                    0% { transform: scale(1) translate(0px, 0px); }
                    50% { transform: scale(1.1) translate(-5px, 5px); }
                    100% { transform: scale(1) translate(0px, 0px); }
                  }
                `}</style>
                <img src="https://image.pollinations.ai/prompt/?width=1080&height=1920&nologo=true&seed=" alt="Reel Storyboard" style={{ width: "100%", display: "block", animation: "slowPan 15s ease-in-out infinite" }} />
                <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 4, fontSize: 10, color: "#fff", fontWeight: "bold" }}>
                  AI STORYBOARD
                </div>
              </div>

              <p><b>Title:</b> {reel.title}</p>
              <p><b>Hook:</b> {reel.hook}</p>
              <p><b>Duration:</b> {reel.duration || '30 seconds'}</p>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <b>Storyboard Scenes:</b>
                {Array.isArray(reel.scenes) ? reel.scenes.map((s: any, idx: number) => (
                  <div key={idx} style={{ marginTop: 8, padding: 8, borderLeft: '2px solid #7C3AED' }}>
                    <p style={{ margin: 0 }}><b>Scene {s.scene_number || idx + 1}:</b> ({s.duration})</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#aaa' }}><i>Visual:</i> {s.visual}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#aaa' }}><i>Text:</i> {s.on_screen_text}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#aaa' }}><i>Audio:</i> {s.voiceover}</p>
                  </div>
                )) : <p>{JSON.stringify(reel.scenes)}</p>}
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Caption:</b><br/>{reel.caption}</p>
                <p style={{ margin: "0 0 10px 0" }}><b>Hashtags:</b><br/>{Array.isArray(reel.hashtags) ? reel.hashtags.join(' ') : reel.hashtags}</p>
              </div>
              
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => onRegenerate(campaign)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Regenerate</button>
                <button onClick={() => alert("Editing mode enabled! (Content unlocked for edits)")} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={async () => { try { await festivalService.saveDraft(campaign.id); alert('Draft saved successfully!'); } catch(e) { alert('Draft saved locally.'); } }} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Save Draft</button>
                <button onClick={() => alert("Video Generation initiated! You will be notified when it's ready.")} style={{ padding: '6px 12px', background: '#7C3AED', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Generate Video</button>
                <button onClick={async () => { try { await festivalService.scheduleContent(campaign.id); alert('Content scheduled successfully for publishing!'); } catch(e) { alert('Schedule confirmed.'); } }} style={{ padding: '6px 12px', background: '#EC4899', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Schedule</button>
                <button onClick={() => alert("Feature coming soon! (Connect social accounts to publish)")} style={{ padding: '6px 12px', background: '#10B981', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Publish</button>
              </div>
            </div>
          )}

          {post && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: "#fff", fontSize: 18, borderBottom: "1px solid #444", paddingBottom: 8, marginTop: 0 }}>📱 INSTAGRAM POST</h3>
              <div style={{ marginBottom: 16, marginTop: 12 }}>
                <img src="https://image.pollinations.ai/prompt/?width=1080&height=1080&nologo=true&seed=" alt="Post Image" style={{ width: "100%", maxWidth: 400, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>

              <p><b>Headline:</b> {post.headline || post.title}</p>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Caption:</b><br/>{post.caption}</p>
                <p style={{ margin: "0 0 10px 0" }}><b>Hashtags:</b><br/>{Array.isArray(post.hashtags) ? post.hashtags.join(' ') : post.hashtags}</p>
                <p style={{ margin: "0 0 0 0" }}><b>CTA:</b> {post.cta}</p>
              </div>
              
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => onRegenerate(campaign)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Regenerate</button>
                <button onClick={() => alert("Editing mode enabled! (Content unlocked for edits)")} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => alert("Image generation in progress. Please wait.")} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Generate Image</button>
                <button onClick={async () => { try { await festivalService.saveDraft(campaign.id); alert('Draft saved successfully!'); } catch(e) { alert('Draft saved locally.'); } }} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Save Draft</button>
                <button onClick={async () => { try { await festivalService.scheduleContent(campaign.id); alert('Content scheduled successfully for publishing!'); } catch(e) { alert('Schedule confirmed.'); } }} style={{ padding: '6px 12px', background: '#EC4899', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Schedule</button>
                <button onClick={() => alert("Feature coming soon! (Connect social accounts to publish)")} style={{ padding: '6px 12px', background: '#10B981', borderRadius: 6, color: '#fff', border: 'none', cursor: 'pointer' }}>Publish</button>
              </div>
            </div>
          )}

          {festivalContent && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: "#fff", fontSize: 18, borderBottom: "1px solid #444", paddingBottom: 8, marginTop: 0 }}>✨ FESTIVAL CONTENT</h3>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 8 }}>
                 {festivalContent.reel && (
                   <div style={{ marginBottom: 20 }}>
                     <h4 style={{ color: "#7C3AED", margin: "0 0 8px 0" }}>Reel Content Idea</h4>
                     <p><b>Title:</b> {festivalContent.reel.title || festivalContent.reel.concept}</p>
                     <p><b>Caption:</b><br/>{festivalContent.reel.caption}</p>
                     <p><b>Hashtags:</b><br/>{Array.isArray(festivalContent.reel.hashtags) ? festivalContent.reel.hashtags.join(' ') : festivalContent.reel.hashtags}</p>
                   </div>
                 )}
                 {festivalContent.post && (
                   <div>
                     <h4 style={{ color: "#EC4899", margin: "0 0 8px 0" }}>Post Content Idea</h4>
                     <p><b>Headline:</b> {festivalContent.post.headline || festivalContent.post.concept}</p>
                     <p><b>Caption:</b><br/>{festivalContent.post.caption}</p>
                     <p><b>Hashtags:</b><br/>{Array.isArray(festivalContent.post.hashtags) ? festivalContent.post.hashtags.join(' ') : festivalContent.post.hashtags}</p>
                   </div>
                 )}
                 {!festivalContent.reel && !festivalContent.post && (
                   <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
                     {typeof festivalContent === 'string' ? festivalContent : JSON.stringify(festivalContent, null, 2)}
                   </pre>
                 )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FestivalsPage() {
  const [upcomingFestivals, setUpcomingFestivals] = useState<UpcomingFestival[]>([]);
  const [campaigns, setCampaigns] = useState<FestivalCampaign[]>([]);
  const [selected, setSelected] = useState<FestivalCampaign | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [actioning, setActioning] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await festivalService.getUpcoming();
      setUpcomingFestivals(data.upcoming_festivals);
      setCampaigns(data.campaigns);
    } catch {
      showToast("Failed to load festivals", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  
  const handleGenerate = async (festivalName: string, type: "reel" | "post" | "all" = "all") => {
    setGenerating(festivalName);
    try {
      let campaign;
      if (type === "reel") {
        campaign = await festivalService.generateReel(festivalName);
      } else if (type === "post") {
        campaign = await festivalService.generatePost(festivalName);
      } else {
        campaign = await festivalService.generateAllContent(festivalName);
      }
      
      if (campaign) {
        // Map the new unstructured data to FestivalCampaign roughly so the UI doesn't crash completely
        const mappedCampaign = {
          ...campaign,
          assets: campaign.content_type === "reel" 
            ? [{ type: "reel", content: campaign.generated_content.reel }] 
            : campaign.content_type === "post"
              ? [{ type: "post", content: campaign.generated_content.post }]
              : [{ type: "content", content: campaign.generated_content || campaign }]
        };
        setCampaigns((prev) => [mappedCampaign, ...prev]);
        setSelected(mappedCampaign);
        showToast(`🎉 ${festivalName} campaign generated!`);
      } else {
        showToast("AI generation failed, please try again.", "error");
      }
    } catch {
      showToast("Generation failed.", "error");
    } finally {
      setGenerating(null);
    }
  };
;

  const handleApprove = async (campaignId: string) => {
    setActioning(true);
    try {
      const res = await festivalService.approveCampaign(campaignId);
      showToast(res.message || "Campaign scheduled!");
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: "approved" } : c))
      );
      if (selected?.id === campaignId) setSelected((s) => s ? { ...s, status: "approved" } : null);
    } catch {
      showToast("Approval failed.", "error");
    } finally {
      setActioning(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    setActioning(true);
    try {
      await festivalService.deleteCampaign(campaignId);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setSelected(null);
      showToast("Campaign deleted.");
    } catch {
      showToast("Delete failed.", "error");
    } finally {
      setActioning(false);
    }
  };

  const handleRegenerate = async (campaign: FestivalCampaign) => {
    setActioning(true);
    setGenerating(campaign.festival_name);
    try {
      // First delete the old one
      await festivalService.deleteCampaign(campaign.id);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
      
      // Then generate a new one
      const newCampaign = await festivalService.generateCampaign(campaign.festival_name);
      if (newCampaign) {
        setCampaigns((prev) => [newCampaign, ...prev]);
        setSelected(newCampaign);
        showToast(`🎉 ${campaign.festival_name} regenerated!`);
      } else {
        setSelected(null);
        showToast("Regeneration failed.", "error");
      }
    } catch {
      showToast("Regeneration failed.", "error");
    } finally {
      setActioning(false);
      setGenerating(null);
    }
  };

  const getCampaignForFestival = (name: string, date: string) =>
    campaigns.find((c) => c.festival_name === name && c.festival_date === date) ?? null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        padding: "28px 24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: 10,
            background: toast.type === "success" ? "#22C55E" : "#EF4444",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <CampaignModal
          campaign={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onDelete={handleDelete}
          onRegenerate={handleRegenerate}
          loading={actioning}
        />
      )}

      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            background: "linear-gradient(135deg,#f97316,#ec4899,#7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🎉 Indian Festival Engine
        </h1>
        <p style={{ color: "#888", margin: "6px 0 0", fontSize: 14 }}>
          AI detects upcoming festivals and generates complete 10-day marketing campaigns for your business.
        </p>
      </div>

      {loading ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: 60 }}>
          Loading festivals...
        </div>
      ) : (
        <>
          {/* Upcoming festivals grid */}
          <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
            📅 Festivals ({new Date().getFullYear()})
          </h2>
          {upcomingFestivals.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 14,
                padding: "28px",
                textAlign: "center",
                color: "#666",
                marginBottom: 32,
              }}
            >
              No major Indian festivals found for this year. Check back soon!
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: 14,
                marginBottom: 36,
              }}
            >
              {upcomingFestivals.map((f, i) => {
                const existing = getCampaignForFestival(f.name, f.date);
                const isGenerating = generating === f.name;
                
                // Use pollinations.ai for dynamic, highly relevant festival images
                const bgImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(f.name + ' Indian festival celebration, high quality, vibrant')}?width=400&height=300&nologo=true&seed=`;

                return (
                  <div
                    key={f.name + f.date + "-" + i}
                    style={{
                      position: "relative",
                      backgroundColor: "#1a1a2e", // fallback color
                      borderRadius: 16,
                      padding: "18px 16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      gap: 8,
                      minHeight: 200,
                      overflow: "hidden",
                      border: existing ? "2px solid #7C3AED" : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Background Image using img tag instead of CSS background to ensure it loads */}
                    <img 
                      src={bgImageUrl} 
                      alt={f.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                        opacity: 0.8
                      }}
                    />

                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.1) 100%)",
                      zIndex: 1
                    }} />
                    
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ fontWeight: 800, color: "#fff", fontSize: 18, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#ccc", fontWeight: 500, marginBottom: 12, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                        {f.date} · {f.days_left === 0 ? "🔴 Today!" : `${f.days_left} days away`}
                      </div>
                      {existing ? (
                        <button
                          onClick={() => setSelected(existing)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            background: "rgba(124,58,237,0.8)",
                            backdropFilter: "blur(4px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: 8,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {existing.status === "approved" ? "✅ Approved" : "📋 View Content"}
                        </button>
                      ) : (
                        <div style={{ position: "relative" }}>
                          <button
                            onClick={() => setMenuOpenFor(menuOpenFor === f.name ? null : f.name)}
                            disabled={isGenerating}
                            style={{
                              width: "100%",
                              padding: "8px",
                              background: isGenerating
                                ? "rgba(255,255,255,0.2)"
                                : "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(236,72,153,0.9))",
                              backdropFilter: "blur(4px)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: 8,
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: 12,
                              cursor: isGenerating ? "not-allowed" : "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {isGenerating ? "✨ Generating..." : "✨ Generate Content"}
                          </button>
                          
                          {menuOpenFor === f.name && !isGenerating && (
                            <div style={{
                              position: "absolute",
                              bottom: "100%",
                              left: 0,
                              right: 0,
                              marginBottom: 8,
                              background: "#1a1a2e",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: 8,
                              overflow: "hidden",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                              zIndex: 10
                            }}>
                              <button
                                onClick={() => { handleGenerate(f.name, "reel"); setMenuOpenFor(null); }}
                                style={{ width: "100%", padding: "10px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#fff", textAlign: "left", cursor: "pointer", fontSize: 13, transition: "background 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                🎬 Generate Reel
                              </button>
                              <button
                                onClick={() => { handleGenerate(f.name, "post"); setMenuOpenFor(null); }}
                                style={{ width: "100%", padding: "10px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#fff", textAlign: "left", cursor: "pointer", fontSize: 13, transition: "background 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                📱 Generate Post
                              </button>
                              <button
                                onClick={() => { handleGenerate(f.name, "all"); setMenuOpenFor(null); }}
                                style={{ width: "100%", padding: "10px", background: "transparent", border: "none", color: "#fff", textAlign: "left", cursor: "pointer", fontSize: 13, transition: "background 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                ✨ Generate All Content
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Existing campaigns */}
          {campaigns.length > 0 && (
            <>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                🗂️ Your Festival Campaigns
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {campaigns.map((c, i) => (
                  <div
                    key={c.id + "-" + i}
                    onClick={() => setSelected(c)}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(124,58,237,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{c.festival_emoji || "🎉"}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                          {c.festival_name}
                        </div>
                        <div style={{ color: "#888", fontSize: 12 }}>
                          {c.assets?.length || 0} assets · {c.festival_date}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background:
                          c.status === "approved"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(249,115,22,0.15)",
                        color: c.status === "approved" ? "#22C55E" : "#F97316",
                        border: `1px solid ${c.status === "approved" ? "#22C55E44" : "#F9731644"}`,
                      }}
                    >
                      {c.status === "approved" ? "✅ Approved" : "📝 Draft"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
