"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Business } from "@/types";
import { Loader2, Globe, MapPin, Tag } from "lucide-react";

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await adminService.getBusinesses();
        setBusinesses(data);
      } catch (err: any) {
        setError(err.message || "Failed to load businesses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Platform Businesses</h1>
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-white">All Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <Card key={business.id} className="overflow-hidden border-border bg-surface-elevated/30 hover:border-brand-pink/50 transition-all">
                <CardHeader className="bg-surface-elevated/50 pb-4 border-b border-border">
                  <CardTitle className="text-lg truncate text-white" title={business.name}>
                    {business.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center text-sm text-text-secondary">
                    <Tag className="w-4 h-4 mr-2 text-text-muted" />
                    <span className="truncate">{business.category || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 mr-2 text-text-muted" />
                    <span className="truncate">{business.location || 'No location'}</span>
                  </div>
                  {business.website && (
                    <div className="flex items-center text-sm text-text-secondary">
                      <Globe className="w-4 h-4 mr-2 text-text-muted" />
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-brand-pink hover:underline truncate">
                        {business.website}
                      </a>
                    </div>
                  )}
                  <div className="pt-2 text-xs text-text-muted font-mono break-all">
                    ID: {business.id}
                  </div>
                </CardContent>
              </Card>
            ))}
            {businesses.length === 0 && (
              <div className="col-span-full py-8 text-center text-text-muted">
                No businesses found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
