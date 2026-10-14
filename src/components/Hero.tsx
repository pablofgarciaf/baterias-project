// estado: ""
'use client';

import { ArrowRight, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useSiteContent } from '@/context/SiteContentContext';

export default function Hero() {
  const { content } = useSiteContent();
  const heroContent = content.hero;
  const desktopImage = !heroContent.backgroundImage || heroContent.backgroundImage === '/hero-desktop.webp'
    ? '/hero-maresa-2026-desktop.png'
    : heroContent.backgroundImage;
  const mobileImage = !heroContent.mobileImage || heroContent.mobileImage === '/hero-mobile.webp'
    ? '/hero-maresa-2026-mobile.png'
    : heroContent.mobileImage;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden bg-primary-950 lg:min-h-[calc(100svh-4rem)]">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 767px)" srcSet={mobileImage} />
        <source media="(min-width: 768px)" srcSet={desktopImage} />
        <img
          src={desktopImage}
          alt="Vehículo y batería para ilustrar la guía de selección"
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/95 via-primary-950/75 to-primary-950/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-950/45 via-transparent to-primary-950/15" />

      <div className="container-max relative w-full py-20 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-white/85 sm:text-sm">
            <span className="h-1 w-7 rounded-full bg-secondary-500" aria-hidden="true" />
            {heroContent.badgeText}
          </p>

          <h1 className="font-display text-[clamp(2.35rem,7vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-white">
            {heroContent.titleMain}{' '}
            <span className="text-secondary-400">{heroContent.titleHighlight}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {heroContent.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/buscador"
              className="inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-lg bg-secondary-500 px-5 py-3 text-sm font-bold text-primary-950 shadow-lg shadow-black/20 transition-colors hover:bg-secondary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Search className="h-4 w-4" />
              {heroContent.ctaButtonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/agencias"
              className="inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-lg border border-white/60 bg-primary-950/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MapPin className="h-4 w-4" />
              {heroContent.secondaryButtonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
