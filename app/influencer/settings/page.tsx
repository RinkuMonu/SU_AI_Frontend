"use client";
import React, { useState } from 'react';
import { Settings, ShieldCheck, Lock, Bell, HelpCircle, Save, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InfluencerSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#be32ff]" /> Creator Settings &amp; Support
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your account preferences, notification settings, contract privacy, and access technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" /> Notification Preferences
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <span className="text-neutral-300">Email alerts for new Brand Hiring Requests</span>
              <input type="checkbox" defaultChecked className="rounded accent-[#be32ff]" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <span className="text-neutral-300">Escrow payment deposit notifications</span>
              <input type="checkbox" defaultChecked className="rounded accent-[#be32ff]" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <span className="text-neutral-300">Revision request alerts</span>
              <input type="checkbox" defaultChecked className="rounded accent-[#be32ff]" />
            </label>
          </div>
          <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white text-xs font-semibold">
            {saved ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            Save Preferences
          </Button>
        </Card>

        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" /> Dedicated Creator Support
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Need assistance with a bilateral contract, payment dispute, or deliverable verification? Our marketplace dispute arbitration team is available 24/7.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
            <p className="text-neutral-300">Marketplace Concierge: <strong className="text-white">support@sevenunique.ai</strong></p>
            <p className="text-neutral-300">Escrow Helpdesk: <strong className="text-white">payments@sevenunique.ai</strong></p>
          </div>
        </Card>
      </div>
    </div>
  );
}
