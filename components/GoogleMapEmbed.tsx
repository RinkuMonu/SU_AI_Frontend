'use client';
import React, { useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/services/googleMaps.service';
import { MapPin, ExternalLink } from 'lucide-react';

interface GoogleMapEmbedProps {
  query?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
  className?: string;
  title?: string;
}

export function GoogleMapEmbed({
  query = 'India',
  lat,
  lng,
  zoom = 14,
  height = '300px',
  className = '',
  title = 'Google Map Location',
}: GoogleMapEmbedProps) {
  const [hasError, setHasError] = useState(false);

  const locationQuery = lat !== undefined && lng !== undefined ? `${lat},${lng}` : query;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
    locationQuery
  )}&zoom=${zoom}`;

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0f1015] shadow-lg ${className}`}>
      {!hasError ? (
        <iframe
          title={title}
          width="100%"
          height={height}
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          style={{ height }}
          className="flex flex-col items-center justify-center p-6 text-center text-neutral-400 bg-neutral-900/50"
        >
          <MapPin className="w-8 h-8 text-neutral-500 mb-2" />
          <p className="text-sm font-medium text-white mb-1">{locationQuery}</p>
          <p className="text-xs text-neutral-500 mb-4">Interactive map preview</p>
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Floating direct map link badge */}
      <div className="absolute top-3 right-3 z-10">
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white transition-colors shadow-md"
        >
          <MapPin className="w-3 h-3 text-[#fc9a5d]" />
          <span>Open Maps</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </a>
      </div>
    </div>
  );
}
