// estado: ""
'use client';

import React, { useEffect, useState } from 'react';

interface PremiumMapProps {
  latitude: number;
  longitude: number;
  agencyName: string;
  mapsIframe?: string;
  address?: string;
  isDark?: boolean;
}

function resolveEmbedSrc(mapsIframe: string | undefined, latitude: number, longitude: number): string {
  const fallback = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es&z=16&output=embed`;
  const match = mapsIframe?.match(/src=["']([^"']+)["']/i);
  if (!match) return fallback;
  try {
    const url = new URL(match[1].replace(/&amp;/g, '&'));
    if (url.protocol !== 'https:') return fallback;
    if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps/')) return url.href;
    if (url.hostname === 'maps.google.com' && url.pathname === '/maps') return url.href;
  } catch {
    return fallback;
  }
  return fallback;
}

export default function PremiumMap({ latitude, longitude, agencyName, mapsIframe, isDark = false }: PremiumMapProps) {
  const src = resolveEmbedSrc(mapsIframe, latitude, longitude);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  return (
    <div className="w-full h-full relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 z-10 gap-3">
          <div className="w-9 h-9 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wide">Cargando Google Maps oficial...</span>
        </div>
      )}

      <iframe
        key={src}
        title={`Google Maps - ${agencyName}`}
        src={src}
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full border-0 transition-all duration-300 ${
          isDark ? 'map-dark-filter' : ''
        }`}
      />
    </div>
  );
}
