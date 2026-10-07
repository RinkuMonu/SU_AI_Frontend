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
  const reel = campaign.assets.find(a => a.type === "reel")?.content;
  const post = campaign.assets.find(a => a.type === "post")?.content;

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
                <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(reel.image_prompt || reel.concept || campaign.festival_name + ' beautiful festival reel cover')}?width=1080&height=1920&nologo=true&seed=42`} alt="Reel Storyboard" style={{ width: "100%", display: "block", animation: "slowPan 15s ease-in-out infinite" }} />
                <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 4, fontSize: 10, color: "#fff", fontWeight: "bold" }}>
                  AI STORYBOARD
                </div>
              </div>
              <p><b>Reel Concept:</b><br/>{reel.concept}</p>
              <p><b>Script:</b><br/>{reel.script}</p>
              <p><b>Scenes:</b><br/>{reel.scenes?.join('\n')}</p>
              <p><b>On-Screen Text:</b><br/>{reel.on_screen_text}</p>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Caption:</b><br/>{reel.caption}</p>
                <button onClick={() => copyToClipboard(reel.caption, "Caption")} style={{ background: "#333", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Copy Caption</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Description:</b><br/>{reel.description}</p>
                <button onClick={() => copyToClipboard(reel.description, "Description")} style={{ background: "#333", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Copy Description</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Hashtags:</b><br/>{reel.hashtags}</p>
                <button onClick={() => copyToClipboard(reel.hashtags, "Hashtags")} style={{ background: "#333", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Copy Hashtags</button>
              </div>
              <p style={{ marginTop: 10 }}><b>CTA:</b><br/>{reel.cta}</p>
            </div>
          )}

          {post && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: "#fff", fontSize: 18, borderBottom: "1px solid #444", paddingBottom: 8, marginTop: 0 }}>📱 INSTAGRAM POST</h3>
              <div style={{ marginBottom: 16, marginTop: 12 }}>
                <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(post.image_prompt || post.concept || campaign.festival_name + ' gorgeous festival image')}?width=1080&height=1080&nologo=true&seed=42`} alt="Post Image" style={{ width: "100%", maxWidth: 400, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
              <p><b>Post Concept:</b><br/>{post.concept}</p>
              <p><b>Post Copy:</b><br/>{post.post_copy}</p>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Caption:</b><br/>{post.caption}</p>
                <button onClick={() => copyToClipboard(post.caption, "Caption")} style={{ background: "#333", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Copy Caption</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Description:</b><br/>{post.description}</p>
                <button onClick={() => copyToClipboard(post.description, "Description")} style={{ background: "#333", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Copy Description</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, marginTop: 10 }}>
                <p style={{ margin: "0 0 10px 0" }}><b>Hashtags:</b><br/>{post.hashtags}</p>
                <button onClick={() => copyToClipboard(post.hashtags, "Hashtags")} style={{ background: "#333", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Copy Hashtags</button>
              </div>
              <p style={{ marginTop: 10 }}><b>CTA:</b><br/>{post.cta}</p>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: 10,
            justifyContent: "center"
          }}
        >
          <button
            onClick={() => { onRegenerate(campaign); }}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              color: loading ? "#888" : "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </button>
          <button
            onClick={() => copyToClipboard(fullContentStr, "Full Content")}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg,#7C3AED,#EC4899)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Copy Content
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
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

  const handleGenerate = async (festivalName: string) => {
    setGenerating(festivalName);
    try {
      const campaign = await festivalService.generateCampaign(festivalName);
      if (campaign) {
        setCampaigns((prev) => [campaign, ...prev]);
        setSelected(campaign);
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
                const bgImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(f.name + ' Indian festival celebration, high quality, vibrant')}?width=400&height=300&nologo=true&seed=42`;

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
                        <button
                          onClick={() => handleGenerate(f.name)}
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
                          {isGenerating ? "✨ Generating Content..." : "✨ Generate Content"}
                        </button>
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
                          {c.assets.length} assets · {c.festival_date}
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
