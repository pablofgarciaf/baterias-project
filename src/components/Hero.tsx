/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Hero.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Hero.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L027-L030  → Imports & dependencies
 *   L032-L035  → Type definitions / interfaces (HeroProps)
 *   L037-L037  → Component function start (Hero)
 *   L038-L041  → State & hooks (useSiteContent, useTheme)
 *   L043-L047  → Constants / static data (stats array)
 *   L049-L057  → Event handlers (scrollToVehicleFinder, scrollToStoreLocator)
 *   L059-L086  → JSX: Section container & background visuals (Image, glow)
 *   L088-L151  → JSX: Hero copy & trust badges (Badge, title, subtitle, points)
 *   L153-L179  → JSX: Call to action buttons (Vehicle Finder, Store Locator)
 *   L181-L216  → JSX: Trust statistics bento grid
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { ShieldCheck, Truck, Award, Search, MapPin, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

interface HeroProps {
  selectedProvince?: string | null;
  onProvinceChange?: (province: string | null) => void;
}

export default function Hero({ selectedProvince, onProvinceChange }: HeroProps) {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const heroContent = content.hero;
  const isDark = theme === 'dark';

  const stats = [
    { icon: ShieldCheck, value: heroContent.stat1Value, label: heroContent.stat1Label },
    { icon: Truck, value: heroContent.stat2Value, label: heroContent.stat2Label },
    { icon: Award, value: heroContent.stat3Value, label: heroContent.stat3Label },
  ];

  const scrollToVehicleFinder = () => {
    const el = document.getElementById('escoge-tu-bateria');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStoreLocator = () => {
    const el = document.getElementById('puntos-de-venta');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className={`relative py-16 sm:py-24 lg:py-28 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-slate-50 via-white to-blue-50/40 text-slate-900'
      }`}
    >
      {/* Background Graphic & Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroContent.backgroundImage}
          alt="Baterías Andinas Corporación Maresa Ecuador"
          width={1920}
          height={1080}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isDark ? 'opacity-30' : 'opacity-15'
          } scale-105`}
        />
        <div 
          className={`absolute inset-0 transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60' 
              : 'bg-gradient-to-r from-white via-white/95 to-slate-50/80'
          }`} 
        />
        
        {/* Soft radial glow */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-max relative z-10 w-full">
        <div className="max-w-3xl">
          
          {/* Official Maresa Badge with Motion */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md mb-6 border shadow-sm ${
              isDark 
                ? 'bg-blue-500/15 border-blue-400/30 text-blue-200' 
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              {heroContent.badgeText}
            </span>
          </motion.div>

          {/* H1 Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            {heroContent.titleMain}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
              {heroContent.titleHighlight}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-5 text-base sm:text-lg max-w-2xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {heroContent.subtitle}
          </motion.p>

          {/* Quick trust points */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm font-medium"
          >
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Chequeo computarizado gratis
            </span>
            <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" /> Instalación en 24 provincias
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="w-4 h-4" /> Bono -$10 por tu batería vieja
            </span>
          </motion.div>

          {/* Call to Action Buttons with Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              onClick={scrollToVehicleFinder}
              className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 transition-all duration-200 active:scale-95 hover:-translate-y-0.5 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>{heroContent.ctaButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToStoreLocator}
              className={`px-7 py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 border transition-all duration-200 active:scale-95 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
              }`}
            >
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{heroContent.secondaryButtonText}</span>
            </button>
          </motion.div>

          {/* Responsive Trust Badges Bento */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className={`mt-12 pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                  isDark 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-white' 
                    : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md text-slate-900'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 dark:bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-semibold ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
