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
 * 📝 LAST UPDATED: 2026-09-23
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { ShieldCheck, Truck, Award, Search, MapPin, ArrowRight, Zap, RefreshCw, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

export default function Hero() {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const heroContent = content.hero;

  const stats = [
    { icon: ShieldCheck, value: heroContent.stat1Value, label: heroContent.stat1Label },
    { icon: Truck, value: heroContent.stat2Value, label: heroContent.stat2Label },
    { icon: Award, value: heroContent.stat3Value, label: heroContent.stat3Label },
  ];

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden -mt-14 lg:-mt-16">

      {/* Background Image */}
      <picture className="absolute inset-0 z-0">
        <source media="(max-width: 767px)" srcSet="/hero-movile.webp" type="image/webp" />
        <source media="(min-width: 768px)" srcSet="/hero-desktop.webp" type="image/webp" />
        <img
          src="/hero-desktop.webp"
          alt="Baterías Maresa — energía confiable para tu vehículo en Ecuador"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Subtle gradient — lets image breathe */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      {/* Content — bottom-aligned, Apple-clean */}
      <div className="container-max relative z-10 pb-10 sm:pb-14 w-full">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-3"
          >
            {heroContent.badgeText}
          </motion.span>

          {/* H1 — editorial, large */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-display font-bold tracking-tight leading-[1.05] text-white"
          >
            {heroContent.titleMain}{' '}
            <span className="text-primary-300">
              {heroContent.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-sm sm:text-base text-white/70 max-w-lg leading-relaxed"
          >
            {heroContent.subtitle}
          </motion.p>

          {/* CTAs — Apple style: pill buttons, clean */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/buscador"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97] hover:-translate-y-px"
            >
              <Search className="w-4 h-4" />
              {heroContent.ctaButtonText}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/agencias"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-[0.97]"
            >
              <MapPin className="w-4 h-4" />
              {heroContent.secondaryButtonText}
            </Link>
          </motion.div>
        </div>

        {/* Stats — floating row, right side on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 lg:absolute lg:bottom-14 lg:right-8 xl:right-12 inline-flex items-center gap-6 sm:gap-8 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/15"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <stat.icon className="w-4 h-4 text-primary-300" />
              <div>
                <div className="text-lg sm:text-xl font-bold text-white leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] text-white/50 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-8 bg-white/10 ml-3 sm:ml-5" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* GeoQuickAnswer bar — integrated at hero bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-slate-950/80 backdrop-blur-md border-t border-white/10 py-2.5 px-4 text-xs text-slate-100">
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
          <div className="flex items-center gap-4 text-slate-400 flex-wrap">
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
