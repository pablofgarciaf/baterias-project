// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Recycling.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Recycling.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L023-L026  → Imports & dependencies
 *   L028-L028  → Component function start
 *   L029-L032  → State & hooks (useSiteContent, useTheme)
 *   L034-L039  → Constants / static data (metrics)
 *   L041-L160  → JSX render (editorial story, benefits list, metrics grid)
 *   L028-L028  → Export default Recycling
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { Recycle, Leaf, ArrowRight, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

export default function Recycling() {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const rec = content.recycling;
  const isDark = theme === 'dark';
  const recImage = !rec.backgroundImage || rec.backgroundImage === '/hero-reciclaje.webp' || rec.backgroundImage === '/hero-reciclaje-2026.png' || rec.backgroundImage.includes('pexels-photo-35520664')
    ? '/hero-reciclaje-auto-2026.png'
    : rec.backgroundImage;

  const metrics = [
    { value: '01', label: 'No abras ni vacíes la batería usada.', color: 'text-secondary-600 dark:text-secondary-400' },
    { value: '02', label: 'Transpórtala en posición vertical y evita golpes.', color: 'text-secondary-600 dark:text-secondary-400' },
    { value: '03', label: 'Consulta un punto autorizado antes de entregarla.', color: 'text-secondary-600 dark:text-secondary-400' },
    { value: '04', label: 'Confirma las condiciones de recepción con cada centro.', color: 'text-secondary-600 dark:text-secondary-400' }
  ];

  return (
    <section
      id="reciclaje"
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark
          ? 'bg-slate-950 text-white border-slate-800'
          : 'bg-primary-50 text-slate-900 border-slate-200'
      }`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={recImage}
          alt="Reciclaje ecológico de baterías en Ecuador"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isDark ? 'opacity-15' : 'opacity-10'
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80'
              : 'bg-gradient-to-r from-white via-white/95 to-primary-50/90'
          }`}
        />
      </div>

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left Editorial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-500/15 text-secondary-700 dark:text-secondary-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-secondary-500/30">
              <Recycle className="w-4 h-4 text-secondary-500" />
              {rec.badge}
            </span>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {rec.titleLine1}
              <br />
              <span className="text-secondary-600 dark:text-secondary-400">
                {rec.titleLine2}
              </span>
            </h2>

            <p className={`mt-5 text-base sm:text-lg leading-relaxed max-w-xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {rec.subtitle}
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                { icon: Leaf, text: rec.point1Text },
                { icon: MapPin, text: rec.point2Text },
                { icon: Recycle, text: rec.point3Text },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-500/15 text-secondary-700 dark:text-secondary-400 flex items-center justify-center shrink-0 border border-secondary-500/20">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="/agencias"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-secondary-500 hover:bg-secondary-400 text-primary-950 font-bold text-sm shadow-xl shadow-secondary-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>{rec.ctaButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Metrics Bento Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {metrics.map((metric, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  i % 2 === 1 ? 'sm:mt-6' : ''
                } ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-white shadow-xl shadow-slate-950/50'
                    : 'bg-white border-slate-200/90 text-slate-900 shadow-md shadow-slate-900/5'
                }`}
              >
                <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${metric.color}`}>
                  {metric.value}
                </div>
                <p className={`text-xs sm:text-sm mt-2 font-medium leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {metric.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
