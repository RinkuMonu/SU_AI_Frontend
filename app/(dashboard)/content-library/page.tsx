"use client";

import { useState, useEffect } from 'react';
import { contentService } from '@/services/content.service';
import { socialService } from '@/services/social.service';
import { GeneratedContent } from '@/types/content';
import { ContentCard } from '@/components/content/ContentCard';
import { ContentFilters } from '@/components/content/ContentFilters';
import { Library, Sparkles, Send, Camera, Share2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { ContentPreview } from '@/components/content/ContentPreview';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { Label } from '@/components/ui/label';

export default function ContentLibraryPage() {
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);

  // Instagram State
  const [isPublishingIg, setIsPublishingIg] = useState(false);
  const [showIgRegister, setShowIgRegister] = useState(false);
  const [igRegAccountId, setIgRegAccountId] = useState("");
  const [igRegToken, setIgRegToken] = useState("");
  const [isRegisteringIg, setIsRegisteringIg] = useState(false);

  // LinkedIn State
  const [isPublishingLi, setIsPublishingLi] = useState(false);
  const [showLiRegister, setShowLiRegister] = useState(false);
  const [liRegAuthorId, setLiRegAuthorId] = useState("");
  const [liRegToken, setLiRegToken] = useState("");
  const [isRegisteringLi, setIsRegisteringLi] = useState(false);

  // Facebook State
  const [isPublishingFb, setIsPublishingFb] = useState(false);
  const [showFbRegister, setShowFbRegister] = useState(false);
  const [fbRegPageId, setFbRegPageId] = useState("");
  const [fbRegToken, setFbRegToken] = useState("");
  const [isRegisteringFb, setIsRegisteringFb] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const res = await contentService.getContents();
      setContents(res.data);
    } catch (error) {
      console.error("Failed to load contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteContent(id);
      setContents(contents.filter(c => c._id !== id));
      if (selectedContent?._id === id) setSelectedContent(null);
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const handleSave = async (editedContent: GeneratedContent) => {
    try {
      await contentService.updateContent(editedContent._id, editedContent);
      setContents(contents.map(c => c._id === editedContent._id ? editedContent : c));
      setSelectedContent(editedContent);
    } catch (error) {
      console.error("Failed to save content:", error);
    }
  };

  const markAsPublished = async () => {
    if (!selectedContent) return;
    try {
      const publishedContent = { ...selectedContent, status: 'Published' as const };
      await contentService.updateContent(selectedContent._id, publishedContent);
      setContents(prev => prev.map(c => c._id === selectedContent._id ? publishedContent : c));
      setSelectedContent(publishedContent);
    } catch (error) {
      console.error("Failed to update status to published:", error);
    }
  };

  // Instagram Publishing Flow
  const handlePublishIg = async () => {
    if (!selectedContent) return;
    setIsPublishingIg(true);
    try {
      await socialService.publishToInstagram(selectedContent._id);
      await markAsPublished();
      alert("Successfully published to Instagram Feed!");
      setShowIgRegister(false);
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.message;
      if (msg.toLowerCase().includes("not connected")) {
        setShowIgRegister(true);
      } else {
        alert("Failed to publish: " + msg);
      }
    } finally {
      setIsPublishingIg(false);
    }
  };

  const handleIgRegisterAndPublish = async () => {
    setIsRegisteringIg(true);
    try {
      await api.put('/api/v1/businesses/me', {
        ig_account_id: igRegAccountId,
        ig_access_token: igRegToken
      });
      setShowIgRegister(false);
      // Automatically retry the publish!
      await handlePublishIg();
    } catch (error) {
      alert("Failed to register Instagram credentials");
    } finally {
      setIsRegisteringIg(false);
    }
  };

  // LinkedIn Publishing Flow
  const handlePublishLi = async () => {
    if (!selectedContent) return;
    setIsPublishingLi(true);
    try {
      await socialService.publishToLinkedin(selectedContent._id);
      await markAsPublished();
      alert("Successfully published to LinkedIn!");
      setShowLiRegister(false);
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.message;
      if (msg.toLowerCase().includes("not connected")) {
        setShowLiRegister(true);
      } else {
        alert("Failed to publish: " + msg);
      }
    } finally {
      setIsPublishingLi(false);
    }
  };

  const handleLiRegisterAndPublish = async () => {
    setIsRegisteringLi(true);
    try {
      await api.put('/api/v1/businesses/me', {
        linkedin_author_id: liRegAuthorId,
        linkedin_access_token: liRegToken
      });
      setShowLiRegister(false);
      await handlePublishLi();
    } catch (error) {
      alert("Failed to register LinkedIn credentials");
    } finally {
      setIsRegisteringLi(false);
    }
  };

  // Facebook Publishing Flow
  const handlePublishFb = async () => {
    if (!selectedContent) return;
    setIsPublishingFb(true);
    try {
      await socialService.publishToFacebook(selectedContent._id);
      await markAsPublished();
      alert("Successfully published to Facebook Page!");
      setShowFbRegister(false);
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.message;
      if (msg.toLowerCase().includes("not connected")) {
        setShowFbRegister(true);
      } else {
        alert("Failed to publish: " + msg);
      }
    } finally {
      setIsPublishingFb(false);
    }
  };

  const handleFbRegisterAndPublish = async () => {
    setIsRegisteringFb(true);
    try {
      await api.put('/api/v1/businesses/me', {
        fb_page_id: fbRegPageId,
        fb_access_token: fbRegToken
      });
      setShowFbRegister(false);
      // Automatically retry the publish!
      await handlePublishFb();
    } catch (error) {
      alert("Failed to register Facebook credentials");
    } finally {
      setIsRegisteringFb(false);
    }
  };

  const filteredContents = contents.filter(c => {
    if (filter === 'All') return true;
    
    const status = c.status?.toLowerCase();
    if (filter === 'Drafts') return status === 'draft' || status === 'drafts';
    if (filter === 'Scheduled') return status === 'scheduled';
    if (filter === 'Published') return status === 'published';

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Library className="h-6 w-6 text-brand-purple" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Plan Content</h1>
            <p className="text-text-muted mt-1">Manage your generated AI content and publish them.</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/content">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate New
          </Link>
        </Button>
      </div>

      <div className="bg-surface border border-border p-4 rounded-lg shadow-sm">
        <ContentFilters currentFilter={filter} onFilterChange={setFilter} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted border rounded-lg bg-surface-elevated border-dashed border-border">
          <Library className="h-12 w-12 text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-white">No content found</h3>
          <p className="max-w-sm mt-1 mb-4">You haven't generated any content that matches this filter yet.</p>
          <Button variant="outline" asChild>
            <Link href="/content">Generate Content</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContents.map(content => (
            <ContentCard 
              key={content._id} 
              content={content} 
              onView={(c) => setSelectedContent(c)}
              onEdit={(c) => setSelectedContent(c)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedContent(null);
        }}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-xl shadow-xl relative animate-in fade-in zoom-in-95">
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2 z-10 rounded-full w-8 h-8 p-0"
              onClick={() => setSelectedContent(null)}
            >
              o
            </Button>
            <div className="p-1 pt-8">
                <ContentPreview 
                  content={selectedContent} 
                  onRegenerate={() => {}} 
                  onSave={handleSave} 
                />
                
                <div className="grid md:grid-cols-3 gap-4 mt-4">


                  {/* Instagram Publish Section */}
                  <div className="p-4 border-t md:border-t-0 md:border-r border-border bg-surface-secondary">
                    <h3 className="font-semibold text-white mb-2">Instagram</h3>
                    <p className="text-xs text-text-muted mb-4">Post directly to Feed or Reels.</p>
                    
                    {!showIgRegister ? (
                      <Button onClick={handlePublishIg} disabled={isPublishingIg} className="w-full bg-pink-600 hover:bg-pink-700 h-8 text-xs">
                        {isPublishingIg ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3 mr-2" />}
                        Publish Post
                      </Button>
                    ) : (
                      <div className="space-y-3 bg-white p-3 rounded-md border border-pink-200 shadow-sm animate-in fade-in">
                        <p className="text-xs font-medium text-red-600">Please register API credentials.</p>
                        <div>
                          <Label className="text-[10px]">Instagram Account ID</Label>
                          <Input value={igRegAccountId} onChange={(e) => setIgRegAccountId(e.target.value)} className="mt-1 h-7 text-xs" />
                        </div>
                        <div>
                          <Label className="text-[10px]">Access Token</Label>
                          <Input type="password" value={igRegToken} onChange={(e) => setIgRegToken(e.target.value)} className="mt-1 h-7 text-xs" />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleIgRegisterAndPublish} disabled={isRegisteringIg} className="w-full h-7 text-[10px] bg-pink-600 hover:bg-pink-700 px-1">
                            {isRegisteringIg ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Save & Publish
                          </Button>
                          <Button variant="outline" onClick={() => setShowIgRegister(false)} className="h-7 text-[10px] px-2">Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Facebook Publish Section */}
                  <div className="p-4 border-t md:border-t-0 border-border bg-surface-secondary">
                    <h3 className="font-semibold text-white mb-2">Facebook</h3>
                    <p className="text-xs text-text-muted mb-4">Post directly to your Page.</p>
                    
                    {!showFbRegister ? (
                      <Button onClick={handlePublishFb} disabled={isPublishingFb} className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                        {isPublishingFb ? <Loader2 className="h-3 w-3 animate-spin" /> : <Share2 className="h-3 w-3 mr-2" />}
                        Publish Post
                      </Button>
                    ) : (
                      <div className="space-y-3 bg-white p-3 rounded-md border border-blue-200 shadow-sm animate-in fade-in">
                        <div className="text-[10px] text-blue-900 bg-blue-50 p-2 rounded">
                          <strong>Don't have a Facebook Page?</strong> <br/>
                          <a href="https://www.facebook.com/pages/create/" target="_blank" rel="noreferrer" className="text-blue-600 underline">Click here to create one</a>.
                        </div>
                        <p className="text-[10px] font-medium text-red-600">Please register your API credentials.</p>
                        <div>
                          <Label className="text-[10px]">Facebook Page ID</Label>
                          <Input value={fbRegPageId} onChange={(e) => setFbRegPageId(e.target.value)} className="mt-1 h-7 text-xs" />
                        </div>
                        <div>
                          <Label className="text-[10px]">Access Token</Label>
                          <Input type="password" value={fbRegToken} onChange={(e) => setFbRegToken(e.target.value)} className="mt-1 h-7 text-xs" />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleFbRegisterAndPublish} disabled={isRegisteringFb} className="w-full h-7 text-[10px] bg-blue-600 hover:bg-blue-700 px-1">
                            {isRegisteringFb ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Save & Publish
                          </Button>
                          <Button variant="outline" onClick={() => setShowFbRegister(false)} className="h-7 text-[10px] px-2">Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* LinkedIn Publish Section */}
                  <div className="p-4 border-t md:border-t-0 md:border-l border-border bg-surface-secondary">
                    <h3 className="font-semibold text-white mb-2">LinkedIn</h3>
                    <p className="text-xs text-text-muted mb-4">Post directly to your network.</p>
                    
                    {!showLiRegister ? (
                      <Button onClick={handlePublishLi} disabled={isPublishingLi} className="w-full bg-blue-700 hover:bg-blue-800 h-8 text-xs">
                        {isPublishingLi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Briefcase className="h-3 w-3 mr-2" />}
                        Publish Post
                      </Button>
                    ) : (
                      <div className="space-y-3 bg-white p-3 rounded-md border border-blue-200 shadow-sm animate-in fade-in">
                        <div className="text-[10px] text-blue-900 bg-blue-50 p-2 rounded">
                          <strong>Don't have a Developer App?</strong> <br/>
                          <a href="https://www.linkedin.com/developers/" target="_blank" rel="noreferrer" className="text-blue-600 underline">Click here to create one</a>.
                        </div>
                        <p className="text-[10px] font-medium text-red-600">Please register your API credentials.</p>
                        <div>
                          <Label className="text-[10px]">Author ID (urn:li:person:...)</Label>
                          <Input value={liRegAuthorId} onChange={(e) => setLiRegAuthorId(e.target.value)} className="mt-1 h-7 text-xs" />
                        </div>
                        <div>
                          <Label className="text-[10px]">Access Token</Label>
                          <Input type="password" value={liRegToken} onChange={(e) => setLiRegToken(e.target.value)} className="mt-1 h-7 text-xs" />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleLiRegisterAndPublish} disabled={isRegisteringLi} className="w-full h-7 text-[10px] bg-blue-700 hover:bg-blue-800 px-1">
                            {isRegisteringLi ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Save & Publish
                          </Button>
                          <Button variant="outline" onClick={() => setShowLiRegister(false)} className="h-7 text-[10px] px-2">Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
