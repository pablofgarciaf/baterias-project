/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — About.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/About.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L025-L028  → Imports & dependencies
 *   L030-L030  → Component function start (About)
 *   L031-L034  → State & hooks (useSiteContent, useTheme)
 *   L036-L041  → Constants / static data (pillars array)
 *   L043-L167  → JSX render — About section container
 *   L055-L106  → Left column: Visual asset & 45 Years badge
 *   L108-L162  → Right column: Narrative copy & pillars grid
 *   L139-L160  → Pillars cards mapping
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { Battery, Target, Eye, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

export default function About() {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const about = content.about;
  const isDark = theme === 'dark';

  const pillars = [
    { icon: Target, title: about.missionTitle, text: about.missionText },
    { icon: Eye, title: about.visionTitle, text: about.visionText },
    { icon: Users, title: about.teamTitle, text: about.teamText },
    { icon: Award, title: about.awardsTitle, text: about.awardsText },
  ];

  return (
    <section 
      id="quienes-somos" 
      className={`py-20 sm:py-28 relative transition-colors duration-300 ${
        isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      }`}
    >
      <span id="nosotros" className="absolute -top-24 left-0 pointer-events-none" />

      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Asset & Floating 45 Years Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <img
                src={about.aboutImage}
                alt="Instalaciones de Corporación Maresa Ecuador"
                className="w-full h-[420px] sm:h-[500px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white sm:hidden">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {about.yearsBadge}
                </span>
                <p className="text-sm font-semibold">{about.yearsSubtext}</p>
              </div>
            </div>

            {/* Floating Desktop Badge with shadow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`absolute -bottom-6 -right-6 rounded-2xl shadow-2xl p-5 sm:p-6 max-w-xs hidden sm:block border ${
                isDark 
                  ? 'bg-slate-950/95 border-slate-700 text-white shadow-blue-900/20' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-900/15'
              } backdrop-blur-md`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                  <Battery className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {about.yearsBadge}
                  </div>
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {about.yearsSubtext}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial & Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              {about.badge}
            </div>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {about.title}
            </h2>

            <p className={`mt-5 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {about.paragraph1}
            </p>

            <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {about.paragraph2}
            </p>

            {/* Strategic Pillars Bento Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                    isDark 
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-white' 
                      : 'bg-slate-50/80 border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
