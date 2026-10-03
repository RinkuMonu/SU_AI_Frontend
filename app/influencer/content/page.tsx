"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, UploadCloud, Link as LinkIcon, CheckCircle } from 'lucide-react';
import influencerService from '@/services/influencer.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MyContentPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCollab, setSelectedCollab] = useState<any>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  
  const [selectedSubForLive, setSelectedSubForLive] = useState<any>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, colRes] = await Promise.all([
        influencerService.getMySubmissions(),
        // For brevity, fetching all applications to get collaboration data since we didn't make a getMyCollaborations endpoint yet.
        influencerService.getMyApplications()
      ]);
      setSubmissions(subRes.data || []);
      // Filter accepted ones which are active collabs
      setCollaborations((colRes.data || []).filter((a: any) => a.status === 'accepted'));
    } catch (e: any) {
      console.error("Failed to load content data:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContent = async () => {
    if (!selectedCollab || !mediaUrl) return;
    setSubmitting(true);
    try {
      await influencerService.submitContent(selectedCollab.id, {
        media_url: mediaUrl,
        caption: caption
      });
      alert("Content submitted for review!");
      setSelectedCollab(null);
      fetchData();
    } catch (e: any) {
      alert("Failed to submit content.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveLiveUrl = async () => {
    if (!selectedSubForLive || !liveUrl) return;
    setSubmitting(true);
    try {
      await influencerService.updateLiveUrl(selectedSubForLive.id, liveUrl);
      alert("Live URL published!");
      setSelectedSubForLive(null);
      fetchData();
    } catch (e: any) {
      alert("Failed to save Live URL.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white">My Content</h1>
        <p className="text-text-muted mt-2">Upload deliverables for brand approval and submit live URLs.</p>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold text-white">Content Submissions</h2>
        {submissions.length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-text-muted">You haven't submitted any content yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map(sub => (
              <Card key={sub.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-white">Draft Submission</CardTitle>
                    <Badge variant="outline" className="capitalize text-xs">
                      {sub.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                     {sub.media_url ? (
                       <img src={sub.media_url} alt="Draft" className="w-full h-full object-cover" />
                     ) : (
                       <UploadCloud className="w-8 h-8 text-white/20" />
                     )}
                  </div>
                  <p className="text-sm text-white/80 line-clamp-2">"{sub.caption}"</p>
                  
                  {sub.status === 'changes_requested' && sub.feedback && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-400">
                      <strong>Brand Feedback:</strong> {sub.feedback}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {sub.status === 'approved' && !sub.live_url ? (
                    <Button onClick={() => { setLiveUrl(""); setSelectedSubForLive(sub); }} className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
                      <LinkIcon className="w-4 h-4" /> Add Live URL
                    </Button>
                  ) : sub.live_url ? (
                    <Button variant="outline" className="w-full text-green-400 border-green-500/30 bg-green-500/10" disabled>
                      <CheckCircle className="w-4 h-4 mr-2" /> Published
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full text-text-muted border-white/10" disabled>
                      Awaiting Brand Review
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedSubForLive} onOpenChange={(open) => !open && setSelectedSubForLive(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Content</DialogTitle>
            <DialogDescription className="text-white/60">
              Paste the public URL of your live post.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Post URL</Label>
              <Input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://instagram.com/p/..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSubForLive(null)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button disabled={submitting || !liveUrl} onClick={handleSaveLiveUrl} className="bg-brand-purple hover:bg-brand-purple/80 text-white">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Live URL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
