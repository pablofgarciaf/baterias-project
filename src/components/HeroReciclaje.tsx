/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 HERO RECICLAJE - Hero section for recycling page
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/HeroReciclaje.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 Replica Hero.tsx structure with hero-reciclaje.webp background
 * ♿ WCAG 2.1 AA accessible
 * 🎨 Glassmorphism + cinema gradient
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { Recycle, Leaf, ArrowRight, MapPin, ShieldCheck, RefreshCw, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';

export default function HeroReciclaje() {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const rec = content.recycling;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { icon: ShieldCheck, value: '99%', label: 'Componentes reciclados' },
    { icon: RefreshCw, value: '50+ Ton', label: 'Plomo/plástico al mes' },
    { icon: MapPin, value: 'Nacional / Cobertura', label: '' },
  ];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden -mt-14 lg:-mt-16">
      {/* Background Image — hero-reciclaje.webp */}
      <picture className="absolute inset-0 z-0" suppressHydrationWarning>
        <source suppressHydrationWarning media="(max-width: 767px)" srcSet={rec.backgroundImage || '/hero-reciclaje.webp'} type="image/webp" />
        <source suppressHydrationWarning media="(min-width: 768px)" srcSet={rec.backgroundImage || '/hero-reciclaje.webp'} type="image/webp" />
        <img suppressHydrationWarning
          src={rec.backgroundImage || '/hero-reciclaje.webp'}
          alt="Reciclaje ecológico de baterías — Plan Canje Verde Maresa Ecuador"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Cinema gradient — dark left, lighter right (reciclaje theme) */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-emerald-900/10" />
      </div>

      {/* Content — vertically centered */}
      <div className="container-max relative z-10 pt-14 lg:pt-16 pb-20 w-full">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 mb-3"
          >
            <Recycle className="w-3 h-3 mr-1 animate-spin" />
            {rec.badge}
          </motion.span>

          {/* H1 — editorial, large */}
          <motion.h1
            initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-display font-bold tracking-tight leading-[1.05] text-white"
          >
            {rec.titleLine1}{' '}
            <br />
            <span className="text-emerald-300">
              {rec.titleLine2}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-sm sm:text-base text-emerald-100 max-w-lg leading-relaxed"
          >
            {rec.subtitle}
          </motion.p>

          {/* CTAs — Mobile: 2 top row, 1 bottom full-width | Desktop: inline 2 buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-6"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Row 1: 2 buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full mt-4">
              <Link
                href="#puntos-de-venta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]"
              >
                <Leaf className="w-4 h-4" />
                {rec.ctaButtonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/contacto-b2b"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-[0.97]"
              >
                <MapPin className="w-4 h-4" />
                {rec.secondaryButtonText || 'Puntos de Venta'}
              </Link>

              <Link
                href="tel:1800228374"
                className="w-full sm:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]"
              >
                <PhoneCall className="w-4 h-4" />
                1-800-BATERIA
              </Link>
            </div>
            </div>
          </motion.div>
        </div>

        {/* Stats — Desktop: floating row right side | Mobile: 2 rows (2+1) */}
        {!isMobile && (
          // Desktop stats - floating row right side
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute lg:bottom-14 lg:right-8 xl:right-12 inline-flex items-center gap-6 sm:gap-8 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/15"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <stat.icon className="w-4 h-4 text-emerald-300" />
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white leading-none tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-emerald-100 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-8 bg-white/10 ml-3 sm:ml-5" />
                )}
              </div>
            ))}
          </motion.div>
        )}

        {isMobile && (
          // Mobile Stats — 2 rows: Row 1 (2 stats), Row 2 (1 stat centered)
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-6"
          >
            {/* Row 1: 2 stats side by side */}
            <div className="flex gap-3">
              {stats.slice(0, 2).map((stat, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15"
                >
                  <stat.icon className="w-5 h-5 text-emerald-300 shrink-0" />
                  <div className="text-center flex flex-col items-center">
                    <div className="text-xl font-bold text-white leading-none tracking-tight">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[10px] text-emerald-100 font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: 1 stat centered full width */}
            <div className="mt-3 flex justify-center">
              <div className="w-full max-w-xs flex items-center justify-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15">
                {React.createElement(stats[2].icon, { className: "w-5 h-5 text-emerald-300 shrink-0" })}
                <div className="text-center flex flex-col items-center">
                  <div className="text-xl font-bold text-white leading-none tracking-tight">
                    {stats[2].value}
                  </div>
                  <div className="mt-1 text-[10px] text-emerald-100 font-medium uppercase tracking-wider">
                    {stats[2].label}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick info bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-emerald-950/80 backdrop-blur-md border-t border-emerald-800/30 py-2.5 px-4 text-xs text-emerald-100">
          <div className="container-max flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/30 text-[11px] tracking-wide uppercase">
                <Recycle className="w-3 h-3" />
                Plan Canje Verde
              </span>
              <span className="text-emerald-200">
                <strong>Entrega tu batería usada:</strong> bono inmediato de -$10 en tu nueva batería en cualquier agencia autorizada.
              </span>
            </div>
            <div className="flex items-center gap-4 text-emerald-300 flex-wrap">
              <span className="flex items-center gap-1 hover:text-white transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantía Oficial
              </span>
              <span className="flex items-center gap-1 hover:text-white transition-colors">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                Eco-friendly
              </span>
              <a href="tel:1800228374" className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-medium transition-colors">
                <PhoneCall className="w-3 h-3" />
                1-800-BATERIA
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
