import { Message } from '@/types/messages';

const mockMessages: Message[] = [
  {
    _id: '1',
    customerName: 'Rahul Kumar',
    message: 'Hi, is the blue denim jacket available in size L?',
    platform: 'Instagram',
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    customerName: 'Priya Singh',
    message: 'I want to return my order #12345. How do I do that?',
    platform: 'Facebook',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '3',
    customerName: 'Amit Sharma',
    message: 'Thank you for the quick delivery!',
    platform: 'Direct',
    status: 'Replied',
    reply: 'You are very welcome, Amit! We are glad you liked it.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const messagesService = {
  async getMessages(): Promise<{ data: Message[] }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: [...mockMessages] };
  },

  async generateReply(messageId: string): Promise<{ data: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const message = mockMessages.find(m => m._id === messageId);
    if (!message) throw new Error('Message not found');
    
    // Simple mock logic based on the message content
    if (message.message.toLowerCase().includes('available')) {
      return { data: `Hi ${message.customerName}, yes, it is currently in stock! You can place an order directly on our website. Let us know if you need help with the link.` };
    }
    if (message.message.toLowerCase().includes('return')) {
      return { data: `Hello ${message.customerName}. We're sorry to hear you want to return your order. Please visit our returns portal at our website or share your order details here so we can process it.` };
    }
    
    return { data: `Hi ${message.customerName}, thank you for reaching out! How can we assist you further today?` };
  },

  async sendReply(messageId: string, replyText: string): Promise<{ data: Message }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockMessages.findIndex(m => m._id === messageId);
    if (index === -1) throw new Error('Message not found');
    
    mockMessages[index] = {
      ...mockMessages[index],
      status: 'Replied',
      reply: replyText,
      updatedAt: new Date().toISOString()
    };
    
    return { data: mockMessages[index] };
  }
};
