// estado: ""
'use client';

import { ArrowRight, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useSiteContent } from '@/context/SiteContentContext';

export default function Hero() {
  const { content } = useSiteContent();
  const heroContent = content.hero;
  // Una fuente estable evita que el fondo cambie tras cargar el contenido remoto.
  const desktopImage = '/hero-maresa-2026-desktop.png';
  const mobileImage = '/hero-maresa-2026-mobile.png';

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-primary-950">
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/80 via-primary-950/50 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/20" />

      <div className="container-max relative w-full pb-20 pt-32 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40">
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
              className="inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-950 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:bg-slate-100 hover:shadow-[0_0_52px_rgba(255,255,255,0.3)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-7 sm:py-3.5"
            >
              <Search className="h-4 w-4" />
              {heroContent.ctaButtonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/agencias"
              className="inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-7 sm:py-3.5"
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
