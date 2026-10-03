"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, Wand2, Sparkles, Check, X } from 'lucide-react';
import influencerService, { Influencer, Campaign } from '@/services/influencer.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [pitchMessage, setPitchMessage] = useState("");
  const [pitchLoading, setPitchLoading] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infRes, appRes, colRes] = await Promise.all([
        influencerService.discover(),
        influencerService.getBusinessApplications(),
        influencerService.getBusinessCollaborations()
      ]);
      setInfluencers(infRes.data || []);
      setApplications(appRes.data || []);
      setCollaborations(colRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApp = async (id: string, status: string) => {
    try {
      await influencerService.updateApplicationStatus(id, status);
      fetchData();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleInstantPitch = async (inf: Influencer) => {
    setSelectedInfluencer(inf);
    setPitchLoading(true);
    try {
      // 1. Generate the AI pitch
      const genRes = await influencerService.generatePitch(inf.id);
      // 2. Instantly send the campaign pitch
      await influencerService.createCampaign(inf.id, genRes.pitch, 0);
      alert("AI Campaign initiated successfully! It is now in your transactions.");
      
      // Refresh the data to show in transaction summary (collaborations)
      await fetchData();
      
      // Switch tab to collaborations
      setActiveTab('collaborations');
    } catch (e: any) {
      alert("Failed to create AI pitch. Make sure you are logged in as a business.");
    } finally {
      setPitchLoading(false);
      setSelectedInfluencer(null);
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
          <p className="text-white/60 mt-2">Discover top creators, review inbound applications, and manage active collaborations.</p>
        </div>
        <Button 
          onClick={() => setShowAuthModal(true)} 
          className="bg-brand-purple hover:bg-brand-purple/80 text-white shrink-0"
        >
          Influencer Login / Register
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#1a1a1a] border border-white/10 justify-start rounded-xl p-1 h-12 mb-6">
          <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6 relative">
            Inbound Applications
            {applications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-coral text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{applications.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="collaborations" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6">
            Active Collaborations
          </TabsTrigger>
          <TabsTrigger value="discover" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6">
            Discover (AI)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-text-muted">No pending applications at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map(app => (
                <Card key={app.id} className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white">{app.influencer_name}</CardTitle>
                        <p className="text-brand-pink text-sm">{app.influencer_category}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateApp(app.id, 'accepted')} size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button onClick={() => handleUpdateApp(app.id, 'rejected')} size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-muted mb-4"><strong>Campaign:</strong> {app.campaign_name}</p>
                    <div className="p-4 bg-white/5 rounded-md border border-white/5 text-sm text-white/80">
                      "{app.message}"
                    </div>
                    {app.proposed_price > 0 && (
                      <p className="text-sm font-semibold mt-4 text-brand-purple">Proposed Budget: ?{app.proposed_price}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborations" className="space-y-4">
          {collaborations.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-text-muted">You don't have any active collaborations yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborations.map(col => (
                <Card key={col.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg text-white">{col.campaign_name}</CardTitle>
                      <Badge variant="outline" className="text-brand-purple border-brand-purple/30 bg-brand-purple/10 capitalize">
                        {col.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-muted"><strong>Influencer:</strong> {col.influencer_name}</p>
                    <p className="text-sm text-text-muted"><strong>Agreed Price:</strong> ?{col.agreed_price}</p>
                    <p className="text-sm text-text-muted mt-2">Started: {new Date(col.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {influencers.map((inf) => (
              <div key={inf.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 hover:border-brand-purple/50 transition-all flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden border-2 border-white/10">
                      <img 
                        src={inf.avatar_url || `https://i.pravatar.cc/150?u=${inf.id}`} 
                        alt={inf.name} 
                        className="w-full h-full object-cover" 
                      />
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
                <Button 
                  onClick={() => handleInstantPitch(inf)}
                  disabled={pitchLoading && selectedInfluencer?.id === inf.id}
                  className="w-full bg-white/10 hover:bg-brand-purple text-white gap-2"
                >
                  {pitchLoading && selectedInfluencer?.id === inf.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" /> 
                  )}
                  {pitchLoading && selectedInfluencer?.id === inf.id ? "Sending..." : "AI Pitch"}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {authMode === 'login' ? 'Influencer Login' : 'Influencer Registration'}
            </DialogTitle>
            <DialogDescription className="text-center text-white/60">
              {authMode === 'login' ? 'Welcome back! Login to manage your profile and collabs.' : 'Join the platform to connect with top brands!'}
            </DialogDescription>
          </DialogHeader>
          
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                const password = formData.get('password') as string;
                
                let res;
                if (authMode === 'login') {
                  res = await import('@/services/auth.service').then(m => m.authService.login(email, password));
                } else {
                  const name = formData.get('name') as string;
                  res = await import('@/services/auth.service').then(m => m.authService.signup(name, email, password, 'influencer'));
                  if (res?.detail?.includes('OTP')) {
                    alert('Registration successful! Please check your email for the OTP and verify your account from the main login page.');
                    return;
                  }
                }
                
                if (res?.token) {
                  localStorage.setItem('access_token', res.token);
                  localStorage.setItem('user', JSON.stringify(res.user));
                  setShowAuthModal(false);
                  window.location.href = '/influencer';
                }
              } catch (err: any) {
                alert(err.message || 'Authentication failed');
              }
            }}
            className="space-y-4 py-4"
          >
            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input name="name" required type="text" className="w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple" placeholder="John Doe" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input name="email" required type="email" className="w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple" placeholder="hello@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input name="password" required type="password" className="w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple" placeholder="••••••••" />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-purple/80 text-white h-11 mt-4"
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
            
            <p className="text-center text-sm text-white/60 mt-4">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-brand-purple hover:underline font-medium">
                {authMode === 'login' ? 'Register here' : 'Login here'}
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


