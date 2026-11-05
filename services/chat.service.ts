import api from '@/lib/api';
import marketplaceService, { HiringRequest } from './marketplace.service';

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file' | 'audio' | 'campaign_brief';
  size?: string;
}

export interface ChatMessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'influencer' | 'business' | 'admin';
  text: string;
  attachments?: ChatAttachment[];
  created_at: string;
  read: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
  id: string;
  business_id: string;
  business_name: string;
  business_logo: string;
  business_category?: string;
  is_verified: boolean;
  is_online?: boolean;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  campaign_id?: string;
  campaign_name?: string;
  campaign_budget?: number;
  campaign_deliverables?: string[];
  campaign_status?: string;
  category: 'all' | 'brands' | 'collaborations';
}

const STORAGE_KEY_PREFIX = 'dhandagrow_influencer_chats_';

// Default initial active conversations matching the reference design screenshot
const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-myntra',
    business_id: 'biz-myntra',
    business_name: 'Myntra',
    business_logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80',
    business_category: 'Fashion & Apparel',
    is_verified: true,
    is_online: true,
    last_message: "Hi Sejal! We'd like to collaborate for our upcoming fashion campaign...",
    last_message_at: '10:24 AM',
    unread_count: 2,
    campaign_id: 'camp-myntra-1',
    campaign_name: 'Myntra Summer Fashion Reel Collab',
    campaign_budget: 25000,
    campaign_deliverables: ['1 Instagram Reel (60s)', '2 Story Slides with Sticker Link'],
    campaign_status: 'In Progress',
    category: 'collaborations'
  },
  {
    id: 'conv-nykaa',
    business_id: 'biz-nykaa',
    business_name: 'Nykaa',
    business_logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80',
    business_category: 'Beauty & Skincare',
    is_verified: true,
    is_online: true,
    last_message: 'Please share your media kit and availability for next week.',
    last_message_at: 'Yesterday',
    unread_count: 1,
    campaign_id: 'camp-nykaa-2',
    campaign_name: 'Nykaa Festive Glow Product Review',
    campaign_budget: 20000,
    campaign_deliverables: ['1 Detailed Review Video', 'High-Res Product Photos'],
    campaign_status: 'Pending Submission',
    category: 'brands'
  },
  {
    id: 'conv-zara',
    business_id: 'biz-zara',
    business_name: 'ZARA',
    business_logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    business_category: 'Luxury & Lifestyle',
    is_verified: true,
    is_online: false,
    last_message: 'Your deliverables have been received. Thanks for the great content!',
    last_message_at: 'Oct 28',
    unread_count: 0,
    campaign_id: 'camp-zara-3',
    campaign_name: 'ZARA Urban Lifestyle Autumn Shoot',
    campaign_budget: 35000,
    campaign_deliverables: ['1 Outfit Styling Reel', '3 Feed Carousel Posts'],
    campaign_status: 'Completed',
    category: 'collaborations'
  },
  {
    id: 'conv-mamaearth',
    business_id: 'biz-mamaearth',
    business_name: 'Mamaearth',
    business_logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80',
    business_category: 'Natural Skincare',
    is_verified: false,
    is_online: false,
    last_message: 'Are you interested in our new skincare campaign?',
    last_message_at: 'Oct 25',
    unread_count: 0,
    campaign_id: 'camp-mamaearth-4',
    campaign_name: 'Organic Vitamin C Serum Launch',
    campaign_budget: 18000,
    campaign_deliverables: ['1 Unboxing Reel', '1 Story Tag'],
    campaign_status: 'Offer Received',
    category: 'brands'
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessageItem[]> = {
  'conv-myntra': [
    {
      id: 'm1',
      conversation_id: 'conv-myntra',
      sender_id: 'biz-myntra',
      sender_name: 'Myntra Brand Team',
      sender_role: 'business',
      text: "Hi Sejal! We'd like to collaborate for our upcoming summer fashion collection. Are you interested?",
      created_at: '10:24 AM',
      read: true,
      status: 'read'
    },
    {
      id: 'm2',
      conversation_id: 'conv-myntra',
      sender_id: 'influencer',
      sender_name: 'Sejal Gupta',
      sender_role: 'influencer',
      text: "Hi! Yes, I'm interested. Please share the campaign brief and deliverables.",
      created_at: '10:32 AM',
      read: true,
      status: 'read'
    },
    {
      id: 'm3',
      conversation_id: 'conv-myntra',
      sender_id: 'biz-myntra',
      sender_name: 'Myntra Brand Team',
      sender_role: 'business',
      text: "Awesome! Here is the campaign brief for the summer reel. Deliverables are 1 reel & 2 stories.",
      attachments: [
        {
          id: 'att-1',
          name: 'Myntra_Summer2026_Brief.pdf',
          url: '#',
          type: 'campaign_brief',
          size: '1.4 MB'
        }
      ],
      created_at: '10:34 AM',
      read: false,
      status: 'delivered'
    },
    {
      id: 'm4',
      conversation_id: 'conv-myntra',
      sender_id: 'biz-myntra',
      sender_name: 'Myntra Brand Team',
      sender_role: 'business',
      text: "Let us know if the proposed budget of ₹25,000 works for you!",
      created_at: '10:35 AM',
      read: false,
      status: 'delivered'
    }
  ],
  'conv-nykaa': [
    {
      id: 'n1',
      conversation_id: 'conv-nykaa',
      sender_id: 'biz-nykaa',
      sender_name: 'Nykaa Partnerships',
      sender_role: 'business',
      text: "Hey! We loved your recent skincare reel and would love to send over our new Festive Glow Kit.",
      created_at: 'Yesterday',
      read: true,
      status: 'read'
    },
    {
      id: 'n2',
      conversation_id: 'conv-nykaa',
      sender_id: 'biz-nykaa',
      sender_name: 'Nykaa Partnerships',
      sender_role: 'business',
      text: "Please share your media kit and availability for next week.",
      created_at: 'Yesterday',
      read: false,
      status: 'delivered'
    }
  ],
  'conv-zara': [
    {
      id: 'z1',
      conversation_id: 'conv-zara',
      sender_id: 'influencer',
      sender_name: 'Sejal Gupta',
      sender_role: 'influencer',
      text: "Hi ZARA team, I have uploaded the final high-res outfit shoot reel and carousel photos for approval.",
      created_at: 'Oct 27',
      read: true,
      status: 'read'
    },
    {
      id: 'z2',
      conversation_id: 'conv-zara',
      sender_id: 'biz-zara',
      sender_name: 'ZARA Brand Lead',
      sender_role: 'business',
      text: "Your deliverables have been received. Thanks for the great content!",
      created_at: 'Oct 28',
      read: true,
      status: 'read'
    }
  ],
  'conv-mamaearth': [
    {
      id: 'me1',
      conversation_id: 'conv-mamaearth',
      sender_id: 'biz-mamaearth',
      sender_name: 'Mamaearth Outreach',
      sender_role: 'business',
      text: "Are you interested in our new skincare campaign? Budget is ₹18,000.",
      created_at: 'Oct 25',
      read: true,
      status: 'read'
    }
  ]
};

export const chatService = {
  getStorageKey(userId?: string): string {
    return userId ? `${STORAGE_KEY_PREFIX}${userId}` : `${STORAGE_KEY_PREFIX}guest`;
  },

  async getConversations(userId?: string): Promise<ChatConversation[]> {
    if (typeof window === 'undefined') return INITIAL_CONVERSATIONS;
    
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    // Initialize with default template
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.getStorageKey(userId), JSON.stringify(INITIAL_CONVERSATIONS));
      } catch {}
    }
    return INITIAL_CONVERSATIONS;
  },

  async getMessages(conversationId: string, userId?: string): Promise<ChatMessageItem[]> {
    if (typeof window === 'undefined') return INITIAL_MESSAGES[conversationId] || [];

    try {
      const stored = localStorage.getItem(`${this.getStorageKey(userId)}_msgs_${conversationId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}

    const defaultMsgs = INITIAL_MESSAGES[conversationId] || [];
    if (typeof window !== 'undefined' && defaultMsgs.length > 0) {
      try {
        localStorage.setItem(`${this.getStorageKey(userId)}_msgs_${conversationId}`, JSON.stringify(defaultMsgs));
      } catch {}
    }
    return defaultMsgs;
  },

  async sendMessage(
    conversationId: string, 
    text: string, 
    senderName: string = 'Creator',
    userId?: string,
    attachments?: ChatAttachment[]
  ): Promise<ChatMessageItem> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversation_id: conversationId,
      sender_id: userId || 'influencer',
      sender_name: senderName,
      sender_role: 'influencer',
      text: text.trim(),
      attachments,
      created_at: timeStr,
      read: true,
      status: 'sent'
    };

    if (typeof window !== 'undefined') {
      try {
        // 1. Update message list
        const currentMsgs = await this.getMessages(conversationId, userId);
        const updatedMsgs = [...currentMsgs, newMsg];
        localStorage.setItem(`${this.getStorageKey(userId)}_msgs_${conversationId}`, JSON.stringify(updatedMsgs));

        // 2. Update conversation snippet
        const convs = await this.getConversations(userId);
        const updatedConvs = convs.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              last_message: text.trim() || (attachments?.length ? 'Sent an attachment' : ''),
              last_message_at: timeStr
            };
          }
          return c;
        });
        localStorage.setItem(this.getStorageKey(userId), JSON.stringify(updatedConvs));
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    }

    return newMsg;
  },

  async markConversationAsRead(conversationId: string, userId?: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const convs = await this.getConversations(userId);
      const updated = convs.map(c => {
        if (c.id === conversationId) {
          return { ...c, unread_count: 0 };
        }
        return c;
      });
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(updated));

      // Mark messages read
      const msgs = await this.getMessages(conversationId, userId);
      const updatedMsgs = msgs.map(m => ({ ...m, read: true, status: 'read' as const }));
      localStorage.setItem(`${this.getStorageKey(userId)}_msgs_${conversationId}`, JSON.stringify(updatedMsgs));
    } catch {}
  },

  async getTotalUnreadCount(userId?: string): Promise<number> {
    const convs = await this.getConversations(userId);
    return convs.reduce((sum, c) => sum + (c.unread_count || 0), 0);
  },

  async connectDealToChat(deal: {
    id: string;
    business_name: string;
    business_logo?: string;
    campaign_name: string;
    budget?: number;
    deliverables?: string[];
    initial_pitch?: string;
  }, userId?: string): Promise<string> {
    const convs = await this.getConversations(userId);
    const existing = convs.find(c => c.business_name.toLowerCase() === deal.business_name.toLowerCase());
    
    if (existing) {
      return existing.id;
    }

    const newConvId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newConvId,
      business_id: `biz-${Date.now()}`,
      business_name: deal.business_name,
      business_logo: deal.business_logo || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80',
      is_verified: true,
      is_online: true,
      last_message: deal.initial_pitch || `Connected regarding ${deal.campaign_name}`,
      last_message_at: 'Just now',
      unread_count: 0,
      campaign_id: deal.id,
      campaign_name: deal.campaign_name,
      campaign_budget: deal.budget,
      campaign_deliverables: deal.deliverables,
      campaign_status: 'Offer Sent',
      category: 'brands'
    };

    if (typeof window !== 'undefined') {
      const updated = [newConv, ...convs];
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(updated));

      if (deal.initial_pitch) {
        const welcomeMsg: ChatMessageItem = {
          id: `msg-${Date.now()}`,
          conversation_id: newConvId,
          sender_id: userId || 'influencer',
          sender_name: 'Creator',
          sender_role: 'influencer',
          text: deal.initial_pitch,
          created_at: 'Just now',
          read: true,
          status: 'sent'
        };
        localStorage.setItem(`${this.getStorageKey(userId)}_msgs_${newConvId}`, JSON.stringify([welcomeMsg]));
      }
    }

    return newConvId;
  }
};

