"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Wand2, Plus, Sparkles, CheckCircle2, CircleDashed } from "lucide-react";
import influencerService, { Influencer, Campaign } from "@/services/influencer.service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [pitchMessage, setPitchMessage] = useState("");
  const [pitchLoading, setPitchLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infRes, campRes] = await Promise.all([
        influencerService.discover(),
        influencerService.getCampaigns()
      ]);
      setInfluencers(infRes.data || []);
      setCampaigns(campRes.data || []);
    } catch (e) {
      alert("Failed to load influencer data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePitch = async (inf: Influencer) => {
    setSelectedInfluencer(inf);
    setPitchLoading(true);
    setPitchMessage("");
    try {
      const res = await influencerService.generatePitch(inf.id);
      setPitchMessage(res.pitch);
    } catch (e) {
      alert("Failed to generate AI pitch.");
    } finally {
      setPitchLoading(false);
    }
  };

  const handleSendPitch = async () => {
    if (!selectedInfluencer || !pitchMessage) return;
    try {
      await influencerService.createCampaign(selectedInfluencer.id, pitchMessage, 0);
      alert("Campaign initiated successfully!");
      setSelectedInfluencer(null);
      fetchData();
    } catch (e: any) {
      alert("Failed to send pitch.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-brand-coral" />
            Influencer Engine
          </h1>
          <p className="text-white/60 mt-2">Discover top creators and use AI to craft perfect collaboration pitches.</p>
        </div>
        <Button 
          onClick={async () => {
            const handle = prompt("Enter influencer Instagram or YouTube handle:");
            if (handle) {
              try {
                await influencerService.addInfluencer({
                  name: handle.startsWith('@') ? handle : '@' + handle,
                  platform: handle.toLowerCase().includes('youtube') ? 'YouTube' : 'Instagram',
                  niche: "Lifestyle & Marketing",
                  followers_count: Math.floor(Math.random() * 500000) + 10000,
                  engagement_rate: Number((Math.random() * 5 + 1).toFixed(1)),
                  contact_email: handle.replace('@', '') + '@example.com'
                });
                alert(`Successfully added ${handle} to your tracking list!`);
                fetchData();
              } catch (e) {
                alert("Failed to add influencer.");
              }
            }
          }}
          className="bg-brand-purple hover:bg-brand-purple/80 text-white gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Influencer
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {influencers.map((inf) => (
            <div key={inf.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 hover:border-brand-purple/50 transition-all flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {inf.name.charAt(0)}
                  </div>
                  <Badge variant="secondary" className="bg-white/5 border-white/10 text-xs">
                    {inf.platform}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{inf.name}</h3>
                <p className="text-sm text-brand-coral font-medium mb-4">{inf.niche}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/50 mb-1">Followers</p>
                    <p className="text-sm font-semibold text-white">{(inf.followers_count / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/50 mb-1">Engagement</p>
                    <p className="text-sm font-semibold text-white">{inf.engagement_rate}%</p>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleGeneratePitch(inf)} className="w-full bg-white/10 hover:bg-brand-purple text-white gap-2">
                <Wand2 className="w-4 h-4" /> AI Pitch
              </Button>
            </div>
          ))}
        </div>
      </div>

      {campaigns.length > 0 && (
        <div className="space-y-4 mt-12">
          <h2 className="text-xl font-semibold text-white">Active Campaigns</h2>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 font-medium">Influencer</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Pitch Snippet</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(camp => {
                  const influencer = influencers.find(i => i.id === camp.influencer_id);
                  return (
                    <tr key={camp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-white">{influencer?.name || 'Unknown'}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-brand-purple border-brand-purple/30 bg-brand-purple/10 capitalize">
                          {camp.status}
                        </Badge>
                      </td>
                      <td className="p-4">{new Date(camp.created_at || Date.now()).toLocaleDateString()}</td>
                      <td className="p-4 max-w-xs truncate">{camp.ai_pitch_message}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!selectedInfluencer} onOpenChange={(open) => !open && setSelectedInfluencer(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-coral" />
              AI Pitch Generation
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Generating a personalized outreach message for {selectedInfluencer?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {pitchLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
                <p className="text-sm text-white/60 animate-pulse">AI is writing the perfect pitch...</p>
              </div>
            ) : (
              <textarea 
                value={pitchMessage} 
                onChange={(e: any) => setPitchMessage(e.target.value)}
                className="min-h-[200px] w-full p-4 bg-white/5 border border-white/10 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInfluencer(null)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button disabled={pitchLoading || !pitchMessage} onClick={handleSendPitch} className="bg-brand-purple hover:bg-brand-purple/80 text-white">
              Send Pitch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

