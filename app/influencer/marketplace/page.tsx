"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Briefcase, CheckCircle, Clock, Sparkles, Send } from 'lucide-react';
import influencerService from '@/services/influencer.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export default function MarketplacePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('opportunities');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campRes, appRes] = await Promise.all([
        influencerService.getMarketplaceCampaigns().catch(() => ({ data: [] })),
        influencerService.getMyApplications().catch(() => ({ data: [] }))
      ]);
      setCampaigns(campRes.data || []);
      setApplications(appRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = (campaign: any) => {
    setSelectedCampaign(campaign);
    setApplyMessage("Hi! I would love to collaborate on this campaign.");
    setProposedPrice(campaign.budget?.toString() || "0");
  };

  const executeApply = async () => {
    if (!selectedCampaign) return;
    setApplyLoading(true);
    try {
      await influencerService.applyForCampaign(selectedCampaign.id, applyMessage, Number(proposedPrice));
      alert("Application sent successfully!");
      await fetchData();
      setSelectedCampaign(null);
      setActiveTab('applications');
    } catch (e: any) {
      alert("Failed to apply for campaign.");
    } finally {
      setApplyLoading(false);
    }
  };

  const hasApplied = (campaignId: string) => {
    return applications.some(app => app.campaign_id === campaignId);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-brand-purple" />
          Creator Marketplace
        </h1>
        <p className="text-white/60 mt-2">Review private campaign invitations from brands and track your applications.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#1a1a1a] border border-white/10 justify-start rounded-xl p-1 h-12 mb-6">
          <TabsTrigger value="opportunities" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6 relative">
            New Opportunities
            {campaigns.filter(c => !hasApplied(c.id)).length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-coral text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {campaigns.filter(c => !hasApplied(c.id)).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6">
            My Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {campaigns.filter(c => !hasApplied(c.id)).length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
              <Sparkles className="w-12 h-12 text-brand-purple/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
              <p className="text-text-muted">No new campaign pitches from brands right now. Make sure your profile is fully complete to get discovered.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {campaigns.filter(c => !hasApplied(c.id)).map((campaign) => (
                <Card key={campaign.id} className="bg-card border-border overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-brand-purple to-brand-coral w-full"></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-white mb-1">New Brand Pitch</CardTitle>
                        <p className="text-brand-pink text-sm font-medium">Budget: ?{campaign.budget}</p>
                      </div>
                      <Badge className="bg-brand-purple/20 text-brand-purple border-brand-purple/30">Targeted Invite</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <p className="text-sm text-white/80 whitespace-pre-wrap italic">
                        "{campaign.ai_pitch_message || campaign.message}"
                      </p>
                    </div>
                    
                    {campaign.deliverables && campaign.deliverables.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2">Requested Deliverables:</h4>
                        <div className="flex flex-wrap gap-2">
                          {campaign.deliverables.map((d: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-white/70 border-white/20">{d}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-white/5 border-t border-white/10 pt-4 flex justify-end">
                    <Button 
                      onClick={() => handleOpenApply(campaign)}
                      className="bg-brand-purple hover:bg-brand-purple/80 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Accept & Apply
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-text-muted">You haven't applied to any campaigns yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map(app => (
                <Card key={app.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg text-white">Campaign Application</CardTitle>
                      <Badge variant="outline" className={`capitalize ${app.status === 'accepted' ? 'text-green-400 border-green-400/30' : app.status === 'rejected' ? 'text-red-400 border-red-400/30' : 'text-brand-purple border-brand-purple/30'}`}>
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-muted mb-2"><strong>Proposed Budget:</strong> ?{app.proposed_price}</p>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2"><strong>Your Message:</strong> {app.message}</p>
                    <div className="flex items-center text-xs text-white/40">
                      <Clock className="w-3 h-3 mr-1" />
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Apply Modal */}
      <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="text-brand-purple w-5 h-5" /> 
              Apply for Campaign
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Confirm your interest and finalize your proposed rate for this collaboration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message to Brand</label>
              <textarea 
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple text-white min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Proposed Price / Counter-offer (?)</label>
              <input 
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                type="number" 
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple" 
              />
              <p className="text-xs text-white/40 mt-1">The brand's original budget was ?{selectedCampaign?.budget}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCampaign(null)} className="border-white/10 text-black hover:text-black">Cancel</Button>
            <Button 
              onClick={executeApply} 
              disabled={applyLoading}
              className="bg-brand-purple hover:bg-brand-purple/80 text-white"
            >
              {applyLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {applyLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
