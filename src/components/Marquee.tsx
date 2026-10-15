// estado: ""
'use client';

import React from 'react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';
import { Zap, ShieldCheck, Wrench, RefreshCw, Award, Sparkles } from 'lucide-react';

interface MarqueeProps {
  scrolled?: boolean;
}

export default function Marquee({ scrolled = false }: MarqueeProps) {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const marqueeData = content.marquee;
  if (!marqueeData || !marqueeData.enabled || marqueeData.items.length === 0) {
    return null;
  }

  // Multiplicamos los elementos para un bucle continuo perfecto e imperceptible
  const items = [...marqueeData.items, ...marqueeData.items, ...marqueeData.items, ...marqueeData.items];

  return (
    <div
      role="region"
      aria-label="Anuncios y beneficios destacados"
      className={`w-full overflow-hidden transition-all duration-500 select-none ${
        scrolled 
          ? 'max-h-0 opacity-0 -translate-y-full pointer-events-none' 
          : 'max-h-14 opacity-100 translate-y-0'
      } ${
        isDark
          ? 'bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-white/[0.08] text-neutral-200'
          : 'bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 border-b border-neutral-700/50 text-white shadow-inner'
      }`}
    >
      <div className="relative w-full overflow-hidden py-2.5">
        {/* Máscaras de gradiente lateral (fade cinematográfico estilo Apple / Modulares GM) */}
        <div 
          className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-28 bg-gradient-to-r ${
            isDark ? 'from-neutral-950' : 'from-neutral-900'
          } to-transparent`} 
        />
        <div 
          className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-28 bg-gradient-to-l ${
            isDark ? 'from-neutral-950' : 'from-neutral-900'
          } to-transparent`} 
        />

        <div className="animate-marquee flex items-center gap-10 px-6">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              aria-hidden={index >= marqueeData.items.length ? true : undefined}
              className="inline-flex items-center gap-3 shrink-0 group cursor-default"
            >
              {item.tag && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-secondary-500/20 text-secondary-300 border border-secondary-500/30 group-hover:bg-secondary-600/30 transition-colors">
                  {item.tag}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-tight text-white/95 group-hover:text-secondary-300 transition-colors">
                  {item.title}
                </span>
                <span className="text-secondary-400/70 text-xs font-mono">•</span>
                <span className="text-xs font-normal text-slate-300/90 tracking-wide">
                  {item.subtitle}
                </span>
              </div>
              <Sparkles className="w-3 h-3 text-secondary-400/80 shrink-0 ml-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
