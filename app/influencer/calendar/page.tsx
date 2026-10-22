"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignCalendarRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/influencer/brand-offers');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-xs text-neutral-400">
      Redirecting to Brand Offers...
    </div>
  );
}
