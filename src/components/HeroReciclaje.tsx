// estado: ""
'use client';

import { ArrowRight, Recycle } from 'lucide-react';
import Link from 'next/link';
import { useSiteContent } from '@/context/SiteContentContext';

export default function HeroReciclaje() {
  const { content } = useSiteContent();
  const rec = content.recycling;
  const oldDefault = 'https://images.pexels.com/photos/35520664/pexels-photo-35520664.jpeg?auto=compress&cs=tinysrgb&w=1920';
  const image = !rec.backgroundImage || rec.backgroundImage === '/hero-reciclaje.webp' || rec.backgroundImage === oldDefault || rec.backgroundImage === '/hero-reciclaje-2026.png'
    ? '/hero-reciclaje-auto-2026.png'
    : rec.backgroundImage;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden bg-primary-950 lg:min-h-[calc(100svh-4rem)]">
      <img
        src={image}
        alt="Entrega de una batería automotriz usada en un taller"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/95 via-primary-950/75 to-primary-950/20" />

      <div className="container-max relative w-full py-20 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-white/85 sm:text-sm">
            <span className="h-1 w-7 rounded-full bg-secondary-500" aria-hidden="true" />
            {rec.badge}
          </p>
          <h1 className="font-display text-[clamp(2.35rem,6vw,4.25rem)] font-extrabold leading-[1.08] tracking-tight text-white">
            {rec.titleLine1}{' '}
            <span className="text-secondary-400">{rec.titleLine2}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {rec.subtitle}
          </p>
          <div className="mt-8 flex items-start">
            <Link href="/agencias" className="inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-lg bg-secondary-500 px-5 py-3 text-center text-sm font-bold text-primary-950 transition-colors hover:bg-secondary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Recycle className="h-4 w-4" />
              {rec.ctaButtonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
