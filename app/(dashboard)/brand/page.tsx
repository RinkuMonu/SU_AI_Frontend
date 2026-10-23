"use client";

import React from "react";
import { BrandKitRegistrationModal } from "@/components/brand/BrandKitRegistrationModal";
import { useRouter } from "next/navigation";

export default function BrandKitPage() {
  const router = useRouter();

  return (
    <div className="py-2">
      <BrandKitRegistrationModal
        isOpen={true}
        onClose={() => router.push("/dashboard")}
        isModal={false}
      />
    </div>
  );
}
