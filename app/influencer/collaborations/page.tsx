"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Handshake, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  MessageSquare, 
  Upload, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Check,
  CheckCheck,
  Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CollaborationItem {
  id: string;
  brand_name: string;
  brand_logo: string;
  campaign_title: string;
  status: 'In Progress' | 'Pending Submission' | 'In Review' | 'Completed';
  budget: number;
  deadline: string;
  progress_percent: number;
  deliverables: {
    title: string;
    submitted: boolean;
    link?: string;
  }[];
  conversation_id: string;
  brief_url?: string;
}

const INITIAL_COLLABORATIONS: CollaborationItem[] = [
  {
    id: 'collab-1',
    brand_name: 'Myntra',
    brand_logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'Myntra Summer Fashion Reel Collab',
    status: 'In Progress',
    budget: 25000,
    deadline: 'In 3 days',
    progress_percent: 50,
    deliverables: [
      { title: '1 Instagram Reel (60s)', submitted: false },
      { title: '2 Story Slides with Sticker Link', submitted: false }
    ],
    conversation_id: 'conv-myntra',
    brief_url: '#'
  },
  {
    id: 'collab-2',
    brand_name: 'Nykaa',
    brand_logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'Nykaa Festive Glow Product Review',
    status: 'Pending Submission',
    budget: 20000,
    deadline: 'Tomorrow, 6:00 PM',
    progress_percent: 75,
    deliverables: [
      { title: '1 Detailed Review Video', submitted: false },
      { title: 'High-Res Product Photos', submitted: true, link: 'https://instagram.com/p/sample1' }
    ],
    conversation_id: 'conv-nykaa',
    brief_url: '#'
  },
  {
    id: 'collab-3',
    brand_name: 'ZARA',
    brand_logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=120&q=80',
    campaign_title: 'ZARA Urban Lifestyle Autumn Shoot',
    status: 'Completed',
    budget: 35000,
    deadline: 'Completed Oct 28',
    progress_percent: 100,
    deliverables: [
      { title: '1 Outfit Styling Reel', submitted: true, link: 'https://instagram.com/reel/zara1' },
      { title: '3 Feed Carousel Posts', submitted: true, link: 'https://instagram.com/p/zara2' }
    ],
    conversation_id: 'conv-zara',
    brief_url: '#'
  }
];

type StatusFilter = 'all' | 'In Progress' | 'Pending Submission' | 'Completed';

export default function InfluencerCollaborationsPage() {
  const router = useRouter();
  const [collaborations, setCollaborations] = useState<CollaborationItem[]>(INITIAL_COLLABORATIONS);
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  
  // Submit Deliverable Modal State
  const [submitCollab, setSubmitCollab] = useState<CollaborationItem | null>(null);
  const [deliverableLink, setDeliverableLink] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredCollabs = collaborations.filter(collab => {
    if (activeTab === 'all') return true;
    return collab.status === activeTab;
  });

  const handleOpenSubmit = (collab: CollaborationItem) => {
    setSubmitCollab(collab);
    setDeliverableLink('');
    setDeliverableNotes('');
    setSubmitSuccess(false);
  };

  const handleSubmitDeliverable = () => {
    if (!submitCollab || !deliverableLink.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setCollaborations(prev => prev.map(c => {
        if (c.id === submitCollab.id) {
          return {
            ...c,
            status: 'In Review',
            progress_percent: 90,
            deliverables: c.deliverables.map(d => ({
              ...d,
              submitted: true,
              link: d.link || deliverableLink
            }))
          };
        }
        return c;
      }));
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitCollab(null);
      }, 1200);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/influencer"
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Handshake className="w-6 h-6 text-[#be32ff]" />
              My Collaborations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Track active brand sponsorships, submit deliverables for review, and inspect escrow payouts.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/influencer/brand-deals"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
          >
            Find New Deals
          </Link>
          <Link
            href="/influencer/chats"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-90 transition-opacity"
          >
            Open Chats
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        {(['all', 'In Progress', 'Pending Submission', 'Completed'] as StatusFilter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-md shadow-pink-500/20'
                : 'bg-[#0e0f19] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15'
            }`}
          >
            {tab === 'all' ? 'All Collaborations' : tab}
          </button>
        ))}
      </div>

      {/* Collaborations List */}
      <div className="space-y-4">
        {filteredCollabs.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-[#0c0d15] border border-white/10">
            <Handshake className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Collaborations in this state</h3>
            <p className="text-xs text-neutral-400">
              Apply to open brand campaigns in the Brand Deals marketplace to start collaborating.
            </p>
          </div>
        ) : (
          filteredCollabs.map((collab) => {
            const isCompleted = collab.status === 'Completed';
            const isInProgress = collab.status === 'In Progress';
            const isPending = collab.status === 'Pending Submission';

            return (
              <div
                key={collab.id}
                className="rounded-2xl bg-[#0d0e17] border border-white/10 hover:border-purple-500/30 transition-all p-5 space-y-4 shadow-lg"
              >
                {/* Header row: Brand info + Status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={collab.brand_logo}
                      alt={collab.brand_name}
                      className="w-11 h-11 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm sm:text-base font-black text-white">
                          {collab.campaign_title}
                        </h3>
                        <span className="text-neutral-500">&bull;</span>
                        <span className="text-xs font-bold text-neutral-300">{collab.brand_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
                        <span className="font-bold text-emerald-400">₹{collab.budget.toLocaleString('en-IN')} Escrow</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-neutral-400">
                          <Clock className="w-3 h-3 text-[#f0449b]" />
                          <span>{collab.deadline}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="self-start sm:self-center">
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>In Progress</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pending Submission</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        <CheckCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span>Completed &amp; Paid</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400 font-medium">Deliverables Completion</span>
                    <span className="font-bold text-white">{collab.progress_percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500"
                      style={{ width: `${collab.progress_percent}%` }}
                    />
                  </div>
                </div>

                {/* Deliverables checklist */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Deliverables Checklist
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {collab.deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {deliv.submitted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                          )}
                          <span className={deliv.submitted ? 'text-white' : 'text-neutral-300'}>
                            {deliv.title}
                          </span>
                        </div>
                        {deliv.link && (
                          <a
                            href={deliv.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#be32ff] hover:text-[#d87aff] font-bold text-[11px] flex items-center gap-0.5"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                  {/* Chat with Brand */}
                  <Link
                    href={`/influencer/chats?id=${collab.conversation_id}`}
                    className="h-9 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#be32ff]" />
                    <span>Open Brand Chat</span>
                  </Link>

                  {/* Submit button (if not completed) */}
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleOpenSubmit(collab)}
                      className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Deliverables</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Deliverables Modal */}
      {submitCollab && (
        <Dialog open={!!submitCollab} onOpenChange={() => setSubmitCollab(null)}>
          <DialogContent className="sm:max-w-md bg-[#0e0f19] border border-white/10 text-white rounded-2xl p-6">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base sm:text-lg font-black flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#f0449b]" />
                Submit Content for {submitCollab.brand_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                {submitCollab.campaign_title}
              </DialogDescription>
            </DialogHeader>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-sm font-bold text-white">Deliverables Submitted!</h3>
                <p className="text-xs text-neutral-400">
                  {submitCollab.brand_name}&apos;s marketing team has been notified for review.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Live Content / Post / Drive Link
                  </label>
                  <input
                    type="url"
                    value={deliverableLink}
                    onChange={(e) => setDeliverableLink(e.target.value)}
                    placeholder="https://instagram.com/reel/... or Google Drive link"
                    className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#be32ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Notes for the Brand (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={deliverableNotes}
                    onChange={(e) => setDeliverableNotes(e.target.value)}
                    placeholder="Provide details such as posting time, swipe-up tags, or initial view stats..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#be32ff] resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmitDeliverable}
                  disabled={isSubmitting || !deliverableLink.trim()}
                  className="w-full h-10 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Uploading Submission...' : 'Submit for Brand Review'}</span>
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

