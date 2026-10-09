"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, Wand2, Sparkles, Check, X, Bookmark, BookmarkCheck, Search, BarChart2, Trash2, Plus } from 'lucide-react';
import influencerService, { Influencer, InfluencerProfile, Campaign } from '@/services/influencer.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { paymentService } from '@/services/payment.service';


export default function InfluencersPage() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [crmCampaigns, setCrmCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerProfile | null>(null);
  
  const [showAddInfluencerModal, setShowAddInfluencerModal] = useState(false);
  const [newInfluencer, setNewInfluencer] = useState({ name: '', platform: 'Instagram', niche: '', followers_count: 0, engagement_rate: 0, contact_email: '' });
  const [isAddingInfluencer, setIsAddingInfluencer] = useState(false);
  
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);
  const [activeInsightCampaign, setActiveInsightCampaign] = useState<any>(null);
  const [campaignDashboardData, setCampaignDashboardData] = useState<any>(null);
  const [campaignInsightsData, setCampaignInsightsData] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const [showPitchDialog, setShowPitchDialog] = useState(false);
  const [pitchStyle, setPitchStyle] = useState('Professional');
  const [deliverables, setDeliverables] = useState('1 Reel');
  const [budget, setBudget] = useState('100');
  const [pitchLoading, setPitchLoading] = useState(false);

  const [filters, setFilters] = useState({ category: '', min_followers: '', location: '', platform: '' });
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const [activeTab, setActiveTab] = useState('discover');

  const [isHiring, setIsHiring] = useState(false);
  const handleHireInfluencer = async () => {
    setIsHiring(true);
    try {
      const response = await paymentService.createPayment("HIRE_INFLUENCER");
      if (response.payment_url) {
        window.location.href = response.payment_url;
      } else {
        alert("Payment URL not found in response.");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Failed to initiate payment.");
    } finally {
      setIsHiring(false);
    }
  };

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API call for location
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationSearchTerm.length > 2) {
        setIsLocationLoading(true);
        try {
          const res = await influencerService.searchLocations(locationSearchTerm);
          if (res.success && res.data && res.data.features) {
            const formattedOptions = res.data.features.map((f: any) => {
              const { country, state, city } = f.properties;
              return [country, state, city].filter(Boolean).join(', ');
            });
            setLocationOptions(Array.from(new Set(formattedOptions)));
            setShowLocationDropdown(true);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLocationLoading(false);
        }
      } else {
        setLocationOptions([]);
        setShowLocationDropdown(false);
      }
    }, 300);

  
  return () => clearTimeout(delayDebounceFn);
  }, [locationSearchTerm]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infRes, appRes, colRes, shortRes, crmRes] = await Promise.all([
        influencerService.discover({ ...filters, min_followers: filters.min_followers ? Number(filters.min_followers) : undefined }),
        influencerService.getBusinessApplications(),
        influencerService.getBusinessCollaborations(),
        influencerService.getShortlist().catch(() => ({ data: [] })),
        influencerService.getCampaigns().catch(() => ({ data: [] }))
      ]);
      setInfluencers(infRes.data || []);
      setApplications(appRes.data || []);
      setCollaborations(colRes.data || []);
      setShortlist(shortRes?.data || []);
      setCrmCampaigns(crmRes?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  const handleToggleShortlist = async (id: string) => {
    try {
      await influencerService.toggleShortlist(id);
      fetchData(); // Refresh shortlist
    } catch (e) {
      alert("Failed to update shortlist");
    }
  };

  const openInsights = async (camp: any) => {
    setActiveInsightCampaign(camp);
    setShowInsightsDialog(true);
    setInsightsLoading(true);
    setCampaignDashboardData(null);
    setCampaignInsightsData(null);
    try {
      const [dashRes, insRes] = await Promise.all([
        influencerService.getCampaignDashboard(camp.id).catch(() => ({ data: null })),
        influencerService.getCampaignInsights(camp.id).catch(() => ({ data: null }))
      ]);
      setCampaignDashboardData(dashRes?.data);
      setCampaignInsightsData(insRes?.data);
    } catch (e) {
      console.error(e);
    } finally {
      setInsightsLoading(false);
    }
  };

  const isShortlisted = (id: string) => {
    return shortlist.some(s => s.influencer_id === id);
  };

  const handleAddInfluencer = async () => {
    setIsAddingInfluencer(true);
    try {
      const res = await influencerService.addInfluencer(newInfluencer);
      if (res.success) {
        const mapped: InfluencerProfile = { 
           id: res.data.id, 
           user_id: res.data.id,
           username: res.data.name, 
           category: res.data.niche, 
           follower_count: res.data.followers_count, 
           engagement_rate: res.data.engagement_rate 
        };
        setInfluencers([mapped, ...influencers]);
        setShowAddInfluencerModal(false);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add influencer");
    } finally {
      setIsAddingInfluencer(false);
    }
  };

  const handleDeleteInfluencer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this influencer?')) return;
    try {
      await influencerService.deleteInfluencer(id);
      setInfluencers(influencers.filter(inf => inf.id !== id && inf.user_id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete influencer");
    }
  };

  const handleUpdateApp = async (id: string, status: string) => {
    try {
      await influencerService.updateApplicationStatus(id, status);
      fetchData();
      if (status === 'accepted') {
        router.push('/messages');
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const initiatePitch = (inf: InfluencerProfile) => {
    setSelectedInfluencer(inf);
    setShowPitchDialog(true);
  };

  const executePitch = async () => {
    if (!selectedInfluencer) return;
    setPitchLoading(true);
    try {
      // 1. Generate the AI pitch with style
      const genRes = await influencerService.generatePitch(selectedInfluencer.id!, pitchStyle);
      // 2. Send the campaign pitch with deliverables
      const deliverableArray = deliverables.split(',').map(d => d.trim()).filter(d => d);
      await influencerService.createCampaign(selectedInfluencer.id!, genRes.pitch, Number(budget), deliverableArray);
      alert("AI Campaign initiated successfully! It is now in your transactions.");
      
      await fetchData();
      setShowPitchDialog(false);
      setActiveTab('collaborations');
    } catch (e: any) {
      alert("Failed to create AI pitch. Make sure you are logged in as a business.");
    } finally {
      setPitchLoading(false);
      setSelectedInfluencer(null);
    }
  };

  if (loading && influencers.length === 0) {
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
        <div className="flex gap-2">
          <Button 
            onClick={handleHireInfluencer}
              disabled={isHiring}
              className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] hover:opacity-90 shadow-[0_0_15px_rgba(252,154,93,0.5)] text-white shrink-0 border-0"
          >
            {isHiring ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} {isHiring ? "Processing..." : "Hire Influencer"}
          </Button>
          <Button 
            onClick={() => setShowAuthModal(true)} 
            className="bg-gradient-to-r from-[#be32ff] to-[#7d36fa] hover:opacity-90 shadow-[0_0_15px_rgba(190,50,255,0.5)] text-white shrink-0 border-0"
          >
            Influencer Login / Register
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#1a1a1a] border border-white/10 justify-start rounded-xl p-1 h-12 mb-6">
          <TabsTrigger value="discover" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6">
            Discover (AI)
          </TabsTrigger>
          <TabsTrigger value="shortlist" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6">
            Shortlist
            {shortlist.length > 0 && (
              <span className="ml-2 bg-brand-pink text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{shortlist.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6 relative">
            Inbound Applications
            {applications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-coral text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{applications.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="collaborations" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6">
            Active Collaborations
          </TabsTrigger>
          <TabsTrigger value="crm" className="rounded-lg data-[state=active]:bg-brand-purple data-[state=active]:text-white h-10 px-6">
            Campaign CRM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Category / Niche</label>
              <input list="category-options" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} type="text" placeholder="e.g. Tech, Beauty" className="w-full p-2 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white text-sm" />
              <datalist id="category-options">
                <option value="Tech" />
                <option value="Beauty" />
                <option value="Fashion" />
                <option value="Food" />
                <option value="Travel" />
                <option value="Gaming" />
                <option value="Fitness" />
                <option value="Finance" />
              </datalist>
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Platform</label>
              <input list="platform-options" value={filters.platform} onChange={e => setFilters({...filters, platform: e.target.value})} type="text" placeholder="e.g. Instagram" className="w-full p-2 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white text-sm" />
              <datalist id="platform-options">
                <option value="Instagram" />
                <option value="YouTube" />
                <option value="TikTok" />
                <option value="Twitter" />
                <option value="LinkedIn" />
                <option value="Facebook" />
              </datalist>
            </div>
            <div className="relative" ref={dropdownRef}>
              <label className="text-xs text-text-muted mb-1 block">Location</label>
              <div className="relative">
                <input 
                  value={filters.location} 
                  onChange={e => {
                    setFilters({...filters, location: e.target.value});
                    setLocationSearchTerm(e.target.value);
                  }} 
                  onFocus={() => {
                    if (locationOptions.length > 0) setShowLocationDropdown(true);
                  }}
                  type="text" 
                  placeholder="e.g. New York" 
                  className="w-full p-2 pr-8 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white text-sm" 
                />
                {isLocationLoading && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                  </div>
                )}
              </div>
              
              {showLocationDropdown && locationOptions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-[#1e1e2d] border border-white/10 rounded-md shadow-lg max-h-60 overflow-auto py-1">
                  {locationOptions.map((loc, idx) => (
                    <li 
                      key={idx} 
                      className="px-3 py-2 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => {
                        setFilters({...filters, location: loc});
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Min Followers</label>
              <input list="followers-options" value={filters.min_followers} onChange={e => setFilters({...filters, min_followers: e.target.value})} type="number" placeholder="10000" className="w-full p-2 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <datalist id="followers-options">
                <option value="1000" />
                <option value="5000" />
                <option value="10000" />
                <option value="50000" />
                <option value="100000" />
                <option value="500000" />
                <option value="1000000" />
              </datalist>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/80 text-white">
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </div>
          </form>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>
          ) : influencers.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl text-text-muted">No influencers found matching your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map((inf) => (
                <div key={inf.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 hover:border-brand-purple/50 transition-all flex flex-col relative overflow-hidden">
                  
                  {inf.ai_match_score !== undefined && (
                    <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                      <Sparkles className="w-3 h-3" /> AI Match: {inf.ai_match_score}/100
                    </div>
                  )}

                  <div className="flex-1 mt-2">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden border-2 border-white/10">
                        <img 
                          src={inf.profile_image || `https://i.pravatar.cc/150?u=${inf.id}`} 
                          alt={inf.username} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleDeleteInfluencer(inf.id || inf.user_id!, e)} 
                          className="p-2 rounded-full transition-colors bg-white/5 text-red-400 hover:bg-red-500/20"
                          title="Delete Influencer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleToggleShortlist(inf.id!)} 
                          className={`p-2 rounded-full transition-colors ${isShortlisted(inf.id!) ? 'bg-brand-pink/20 text-brand-pink' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                        >
                          {isShortlisted(inf.id!) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">@{inf.username}</h3>
                    <p className="text-sm text-brand-coral font-medium mb-2">{inf.category || (inf as any).niche}</p>
                    
                    {inf.ai_match_explanation && (
                      <p className="text-xs text-white/70 bg-white/5 p-2 rounded mb-4 italic">
                        "{inf.ai_match_explanation}"
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-xs text-white/50 mb-1">Followers</p>
                        <p className="text-sm font-semibold text-white">{((inf.follower_count || (inf as any).followers_count || 0) / 1000).toFixed(1)}k</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-xs text-white/50 mb-1">Engagement</p>
                        <p className="text-sm font-semibold text-white">{inf.engagement_rate}%</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => initiatePitch(inf)}
                    className="w-full bg-white/10 hover:bg-brand-purple text-white gap-2"
                  >
                    <Wand2 className="w-4 h-4" /> AI Pitch
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shortlist" className="space-y-4">
           {shortlist.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-text-muted">Your shortlist is empty. Discover and save creators first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlist.map((sItem) => (
                <div key={sItem.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 hover:border-brand-pink/50 transition-all flex flex-col relative">
                  <div className="absolute top-0 right-0 bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    Match: {sItem.match_score}/100
                  </div>
                  <div className="flex-1 mt-2">
                    <h3 className="text-lg font-bold text-white mb-2">Creator ID: {sItem.influencer_id.substring(0, 8)}...</h3>
                    <p className="text-xs text-text-muted mb-4">Added: {new Date(sItem.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button 
                    onClick={() => handleToggleShortlist(sItem.influencer_id)}
                    variant="outline"
                    className="w-full border-white/10 hover:bg-white/5 text-white gap-2 mt-4"
                  >
                    Remove from Shortlist
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-text-muted">No pending applications at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map(app => {
                const matchedCreator = influencers.find(inf => inf.id === app.influencer_id || inf.user_id === app.influencer_id);
                const displayName = (!app.influencer_name || app.influencer_name.includes('Unknown')) ? (matchedCreator?.username || 'Creator') : app.influencer_name;
              
  return (
                <Card key={app.id} className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white">{displayName}</CardTitle>
                        <p className="text-brand-pink text-sm">{app.influencer_category || matchedCreator?.category || 'General'}</p>
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
                    <p className="text-sm text-text-muted mb-4"><strong>Campaign:</strong> {app.campaign_name || 'Campaign'}</p>
                    <div className="p-4 bg-white/5 rounded-md border border-white/5 text-sm text-white/80">
                      "{app.message}"
                    </div>
                    {app.proposed_price > 0 && (
                      <p className="text-sm font-semibold mt-4 text-brand-purple">Proposed Budget: ₹{app.proposed_price}</p>
                    )}
                  </CardContent>
                </Card>
              )})}
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
              {collaborations.map(col => {
                const matchedCreator = influencers.find(inf => inf.id === col.influencer_id || inf.user_id === col.influencer_id);
                const displayName = col.influencer_name || matchedCreator?.username || 'Unknown Creator';
              
  return (
                <Card 
                  key={col.id} 
                  className="bg-card border-border cursor-pointer hover:border-brand-purple/50 transition-colors"
                  onClick={() => openInsights({ id: col.campaign_id || col.id, ...col })}
                >
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg text-white">{col.campaign_name || 'Campaign'}</CardTitle>
                      <Badge variant="outline" className="text-brand-purple border-brand-purple/30 bg-brand-purple/10 capitalize">
                        {col.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-muted"><strong>Influencer:</strong> {displayName}</p>
                    <p className="text-sm text-text-muted"><strong>Agreed Price:</strong> ₹{col.agreed_price}</p>
                    <p className="text-sm text-text-muted mt-2">Started: {new Date(col.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              )})}
            </div>
          )}
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          {crmCampaigns.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-text-muted">No campaigns in your pipeline yet. Start pitching creators!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crmCampaigns.map(camp => {
                const matchedCreator = influencers.find(inf => inf.id === camp.influencer_id || inf.user_id === camp.influencer_id);
                const displayName = camp.influencer_name || matchedCreator?.username || 'Unknown Creator';
              
  return (
                <Card key={camp.id} className="bg-card border-border relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple"></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{displayName}</CardTitle>
                      <Badge variant="outline" className={`border-brand-purple/30 ${camp.pipeline_status === 'Accepted' || camp.pipeline_status === 'Published' || camp.pipeline_status === 'Content Approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : camp.pipeline_status === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-brand-purple/10 text-brand-purple'}`}>
                        {camp.pipeline_status || 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-muted"><strong>Budget:</strong> ?{camp.budget || 0}</p>
                    <p className="text-sm text-text-muted mt-2 mb-4">Created: {new Date(camp.created_at || new Date()).toLocaleDateString()}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => openInsights(camp)}
                      className="w-full bg-white/5 border-white/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                    >
                      <BarChart2 className="w-4 h-4 mr-2" /> ROI & Insights
                    </Button>
                  </CardContent>
                </Card>
              )})}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showInsightsDialog} onOpenChange={setShowInsightsDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-3xl max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <BarChart2 className="text-brand-coral w-6 h-6" /> 
              Campaign Insights
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Live ROI and AI-driven recommendations for your campaign with {activeInsightCampaign?.influencer_name}.
            </DialogDescription>
          </DialogHeader>
          
          {insightsLoading ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
                <p className="text-sm text-text-muted animate-pulse">Aggregating live campaign data...</p>
             </div>
          ) : (
             <div className="space-y-6 py-4">
               {/* Dashboard Metrics */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                   <p className="text-xs text-text-muted mb-1">Total Budget</p>
                   <p className="text-xl font-bold text-white">?{campaignDashboardData?.total_budget || activeInsightCampaign?.budget || 0}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                   <p className="text-xs text-text-muted mb-1">Spent (Collabs)</p>
                   <p className="text-xl font-bold text-brand-coral">?{campaignDashboardData?.spent_budget || 0}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                   <p className="text-xs text-text-muted mb-1">Active Influencers</p>
                   <p className="text-xl font-bold text-white">{campaignDashboardData?.active_influencers || 0}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                   <p className="text-xs text-text-muted mb-1">Content Live</p>
                   <p className="text-xl font-bold text-brand-purple">{campaignDashboardData?.published_content || 0}</p>
                 </div>
               </div>

               {/* ROI Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                   <p className="text-xs text-text-muted mb-1">Total Reach</p>
                   <p className="text-lg font-semibold text-white/50">{campaignDashboardData?.reach_metric || "Awaiting Data"}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                   <p className="text-xs text-text-muted mb-1">Avg Engagement</p>
                   <p className="text-lg font-semibold text-white/50">{campaignDashboardData?.engagement_metric || "Awaiting Data"}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center border-brand-purple/30 bg-brand-purple/5">
                   <p className="text-xs text-brand-purple mb-1 font-semibold">Estimated ROI</p>
                   <p className="text-lg font-bold text-brand-purple/50">{campaignDashboardData?.roi_metric || "Awaiting Data"}</p>
                 </div>
               </div>

               {/* AI Insights */}
               <div className="mt-8 space-y-4">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-brand-purple" /> AI Analysis
                 </h3>
                 
                 {campaignInsightsData?.error || typeof campaignInsightsData === 'string' ? (
                   <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
                      <p className="text-text-muted">{campaignInsightsData?.error || campaignInsightsData || "Not enough data. Content must be published and tracked to generate AI insights."}</p>
                   </div>
                 ) : (
                   <div className="grid md:grid-cols-2 gap-4">
                     <div className="bg-brand-purple/10 border border-brand-purple/20 p-5 rounded-xl">
                        <h4 className="font-bold text-brand-purple mb-2">What's Working</h4>
                        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{campaignInsightsData?.insights || "Generating..."}</p>
                     </div>
                     <div className="bg-brand-coral/10 border border-brand-coral/20 p-5 rounded-xl">
                        <h4 className="font-bold text-brand-coral mb-2">Recommendations</h4>
                        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{campaignInsightsData?.recommendations || "Generating..."}</p>
                     </div>
                   </div>
                 )}
               </div>
             </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Influencer Modal */}
      <Dialog open={showAddInfluencerModal} onOpenChange={setShowAddInfluencerModal}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Manual Influencer</DialogTitle>
            <DialogDescription className="text-white/60">
              Create a new influencer profile manually for testing or database addition.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-text-muted">Username / Name</label>
              <input type="text" value={newInfluencer.name} onChange={e => setNewInfluencer({...newInfluencer, name: e.target.value})} className="w-full p-2 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white" placeholder="e.g. janesmith" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-text-muted">Category / Niche</label>
              <input list="add-category-options" type="text" value={newInfluencer.niche} onChange={e => setNewInfluencer({...newInfluencer, niche: e.target.value})} className="w-full p-2 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white" placeholder="e.g. Fashion, Tech" />
              <datalist id="add-category-options">
                <option value="Tech" />
                <option value="Beauty" />
                <option value="Fashion" />
                <option value="Food" />
                <option value="Travel" />
                <option value="Gaming" />
                <option value="Fitness" />
                <option value="Finance" />
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Platform</label>
                <input list="add-platform-options" type="text" value={newInfluencer.platform} onChange={e => setNewInfluencer({...newInfluencer, platform: e.target.value})} className="w-full p-2 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white" placeholder="e.g. Instagram" />
                <datalist id="add-platform-options">
                  <option value="Instagram" />
                  <option value="YouTube" />
                  <option value="TikTok" />
                  <option value="Twitter" />
                  <option value="LinkedIn" />
                  <option value="Facebook" />
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Followers</label>
                <input list="add-followers-options" type="number" value={newInfluencer.followers_count || ''} onChange={e => setNewInfluencer({...newInfluencer, followers_count: Number(e.target.value)})} className="w-full p-2 bg-transparent border border-white/20 rounded focus:border-brand-purple text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="10000" />
                <datalist id="add-followers-options">
                  <option value="1000" />
                  <option value="5000" />
                  <option value="10000" />
                  <option value="50000" />
                  <option value="100000" />
                  <option value="500000" />
                  <option value="1000000" />
                </datalist>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddInfluencerModal(false)} className="border-white/10 text-black hover:text-black">Cancel</Button>
            <Button onClick={handleAddInfluencer} disabled={isAddingInfluencer} className="bg-brand-purple hover:bg-brand-purple/80 text-white">
              {isAddingInfluencer ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPitchDialog} onOpenChange={setShowPitchDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-brand-purple w-5 h-5" /> 
              Generate AI Pitch
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Customize the AI outreach message and set campaign deliverables for @{selectedInfluencer?.username || (selectedInfluencer as any)?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pitch Style / Tone</label>
              <select 
                value={pitchStyle}
                onChange={(e) => setPitchStyle(e.target.value)}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple text-white"
              >
                <option value="Professional" className="bg-[#1a1a1a]">Professional</option>
                <option value="Friendly" className="bg-[#1a1a1a]">Friendly & Casual</option>
                <option value="Gen Z" className="bg-[#1a1a1a]">Gen Z / Trendy</option>
                <option value="Short DM" className="bg-[#1a1a1a]">Short DM</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Deliverables (comma separated)</label>
              <input 
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                type="text" 
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple" 
                placeholder="1 Reel, 2 Stories" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Budget (?)</label>
              <input 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                type="number" 
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-purple" 
                placeholder="1000" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPitchDialog(false)} className="border-white/10 text-black hover:text-black">Cancel</Button>
            <Button 
              onClick={executePitch} 
              disabled={pitchLoading}
              className="bg-brand-purple hover:bg-brand-purple/80 text-white"
            >
              {pitchLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
              {pitchLoading ? "Generating & Sending..." : "Generate & Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  res = await import('@/services/auth.service').then(m => m.authService.signup({ full_name: name, email, password, role: 'influencer' }));
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
