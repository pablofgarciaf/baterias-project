/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Hero.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Hero.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L024-L029  → Imports & dependencies
 *   L031-L041  → State, hooks, constants
 *   L043-L150  → JSX: Hero ~75vh with bg image, light overlay, Apple-clean layout
 * ─────────────────────────────────────────────────────────────
 * ⚠️ Images: replace /hero-desktop.webp and /hero-mobile.webp in public/
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ══════════════════════════════════════════════════════════════
 */

'use client';

import { ShieldCheck, Truck, MapPin, Search, ArrowRight, Zap, RefreshCw, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';

export default function Hero() {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const heroContent = content.hero;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { icon: ShieldCheck, value: heroContent.stat1Value, label: heroContent.stat1Label },
    { icon: Truck, value: heroContent.stat2Value, label: heroContent.stat2Label },
    { icon: MapPin, value: 'Nacional / Cobertura', label: '' },
  ];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden -mt-14 lg:-mt-16">

      {/* Background Image */}
      <picture className="absolute inset-0 z-0" suppressHydrationWarning>
        <source suppressHydrationWarning media="(max-width: 767px)" srcSet={heroContent.mobileImage || '/hero-mobile.webp'} type="image/webp" />
        <source suppressHydrationWarning media="(min-width: 768px)" srcSet={heroContent.backgroundImage || '/hero-desktop.webp'} type="image/webp" />
        <img suppressHydrationWarning
          src={heroContent.backgroundImage || '/hero-desktop.webp'}
          alt="Baterías Maresa — energía confiable para tu vehículo en Ecuador"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Cinema gradient — dark left, lighter right */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content — vertically centered */}
      <div className="container-max relative z-10 pt-14 lg:pt-16 pb-20 w-full">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-3"
          >
            {heroContent.badgeText}
          </motion.span>

          {/* H1 — editorial, large */}
          <motion.h1
            initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-display font-extrabold tracking-tighter leading-[1.05] text-white drop-shadow-sm"
          >
            {heroContent.titleMain}{' '}
            <span className="text-primary-300">
              {heroContent.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-sm sm:text-base text-white/70 max-w-lg leading-relaxed"
          >
            {heroContent.subtitle}
          </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-6 md:mt-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full max-w-md sm:max-w-none">
            <Link
              href="/buscador"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 text-sm font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-[0.98] hover:bg-slate-50"
            >
              <Search className="w-4 h-4" />
              {heroContent.ctaButtonText}
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/agencias"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-xl text-white text-sm font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 active:scale-[0.98]"
            >
              <MapPin className="w-4 h-4" />
              {heroContent.secondaryButtonText}
            </Link>
          </div>
        </motion.div>
        </div>

        {/* Mobile Stats (Simple inline pills to save vertical space) */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex flex-wrap gap-2 lg:hidden"
        >
          {stats.map((stat, i) => (
            <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-medium">
              <stat.icon className="w-3.5 h-3.5 text-primary-300" />
              <span>{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Desktop stats - floating row right side, uses CSS hidden lg:flex */}
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="hidden lg:flex absolute bottom-20 right-8 xl:right-12 z-10 items-center gap-6 sm:gap-8 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/15"
      >
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <stat.icon className="w-4 h-4 text-primary-300" />
            <div>
              <div className="text-lg sm:text-xl font-bold text-white leading-none tracking-tight">
                {stat.value}
              </div>
              {stat.label && (
                <div className="text-[10px] text-white/50 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              )}
            </div>
            {i < stats.length - 1 && (
              <div className="w-px h-8 bg-white/10 ml-3 sm:ml-5" />
            )}
          </div>
        ))}
      </motion.div>

      {/* GeoQuickAnswer bar — integrated at hero bottom (moved outside container-max) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-950/80 backdrop-blur-md border-t border-white/10 py-2.5 px-4 text-xs text-slate-100">
        <div className="container-max flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30 text-[11px] tracking-wide uppercase">
              <Zap className="w-3 h-3 text-amber-400" />
              Corporación Maresa
            </span>
            <span className="text-slate-300">
              <strong>Baterías Andinas:</strong> Distribución oficial en 24 provincias. Desde $65 con garantía hasta 36 meses.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 flex-wrap hidden md:flex">
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Garantía Oficial
            </span>
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              Reciclaje -$10
            </span>
            <a href="tel:1800228374" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors">
              <PhoneCall className="w-3 h-3" />
              1-800-BATERIA
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
