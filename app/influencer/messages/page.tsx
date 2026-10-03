"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Send, Phone, Video, MoreVertical, Image as ImageIcon, Smile, Paperclip } from 'lucide-react';

const DUMMY_CHATS = [
  { id: 1, name: 'Sarah (Influencer)', avatar: 'S', lastMsg: 'I have uploaded the draft for review!', time: '10:42 AM', unread: 2, online: true },
  { id: 2, name: 'TechGuru Max', avatar: 'T', lastMsg: 'Sounds good, let us proceed with the  budget.', time: 'Yesterday', unread: 0, online: false },
  { id: 3, name: 'Fitness Jane', avatar: 'F', lastMsg: 'Can we change the posting date to Friday?', time: 'Yesterday', unread: 0, online: true },
  { id: 4, name: 'Foodie Frank', avatar: 'F', lastMsg: 'Thanks! I will send the invoice shortly.', time: 'Mon', unread: 0, online: false },
];

const DUMMY_MESSAGES = [
  { id: 1, sender: 'them', text: 'Hey there! I saw your campaign and I am very interested.', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'Awesome! We love your recent tech reviews. Are you okay with a dedicated 60-second integration?', time: '10:35 AM' },
  { id: 3, sender: 'them', text: 'Yes, that works perfectly. I can shoot it this weekend.', time: '10:40 AM' },
  { id: 4, sender: 'them', text: 'I have uploaded the draft for review!', time: '10:42 AM' },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(DUMMY_CHATS[0]);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [msgText, setMsgText] = useState("");
  
  // Store messages per chat ID
  const [chatHistories, setChatHistories] = useState<Record<number, any[]>>({
    1: DUMMY_MESSAGES,
    2: [{ id: 101, sender: 'them', text: 'Sounds good, let us proceed with the budget.', time: 'Yesterday' }],
    3: [{ id: 201, sender: 'them', text: 'Can we change the posting date to Friday?', time: 'Yesterday' }],
    4: [{ id: 301, sender: 'them', text: 'Thanks! I will send the invoice shortly.', time: 'Mon' }],
  });

  const messages = chatHistories[activeChat.id] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    
    const newMsg = { 
      id: Date.now(), 
      sender: 'me', 
      text: msgText, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setChatHistories(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setMsgText("");
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] flex bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
      
      {/* Sidebar - Chat List */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 md:border-r border-white/10 flex-col bg-[#111] shrink-0`}>
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 bg-white/5 border-white/10 text-white focus-visible:ring-brand-purple"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {DUMMY_CHATS.map(chat => (
            <div 
              key={chat.id}
              onClick={() => {
                setActiveChat(chat);
                setShowMobileChat(true);
              }}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-white/5 ${activeChat.id === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center text-lg font-bold text-white shrink-0">
                  {chat.avatar}
                </div>
                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                  <span className="text-xs text-text-muted shrink-0">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-text-muted truncate pr-2">{chat.lastMsg}</p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-coral text-white text-xs flex items-center justify-center shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#0a0a0a] relative min-w-0`}>
        {/* Chat Header */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-[#111] shrink-0">
          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               size="icon" 
               className="md:hidden text-white mr-1" 
               onClick={() => setShowMobileChat(false)}
             >
               &larr;
             </Button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center font-bold text-white shrink-0">
               {activeChat.avatar}
             </div>
             <div className="min-w-0">
               <h3 className="font-bold text-white truncate">{activeChat.name}</h3>
               <p className="text-xs text-green-400">{activeChat.online ? 'Online' : 'Offline'}</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-text-muted hover:text-white"><Phone className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-text-muted hover:text-white"><Video className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-text-muted hover:text-white"><MoreVertical className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
             <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">Today</span>
          </div>
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe ? 'bg-brand-purple text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-white/40'}`}>{msg.time}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#111] border-t border-white/10 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="text-text-muted hover:text-white"><Paperclip className="w-5 h-5" /></Button>
            <Button type="button" variant="ghost" size="icon" className="text-text-muted hover:text-white"><ImageIcon className="w-5 h-5" /></Button>
            <Input 
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-white/5 border-white/10 text-white focus-visible:ring-brand-purple rounded-full h-11 px-4"
            />
            <Button type="button" variant="ghost" size="icon" className="text-text-muted hover:text-white"><Smile className="w-5 h-5" /></Button>
            <Button type="submit" size="icon" className="bg-brand-purple hover:bg-brand-purple/80 text-white rounded-full h-11 w-11 shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
