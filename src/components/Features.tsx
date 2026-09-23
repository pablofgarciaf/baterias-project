/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Features.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Features.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L023-L023  → Imports (Lucide icons, theme)
 *   L025-L062  → Constants / static data (features list)
 *   L064-L120  → Component declaration & render (Features)
 *   L070-L082  → Section header (eyebrow, title, subtitle)
 *   L084-L118  → Editorial cards — mobile snap-carousel, desktop grid
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-17
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { ShieldCheck, Clock, Headphones, BadgeCheck, Wrench, Truck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const features = [
  {
    icon: ShieldCheck,
    title: 'Garantía Real',
    description:
      'Hasta 24 meses de garantía en todas nuestras baterías. Si falla, la reemplazamos sin preguntas.',
  },
  {
    icon: Clock,
    title: 'Entrega 24 Horas',
    description:
      'Despacho express a cualquier provincia del Ecuador. En Quito y Guayaquil, entrega el mismo día.',
  },
  {
    icon: Headphones,
    title: 'Soporte Técnico',
    description:
      'Asesoría especializada por teléfono, WhatsApp y en cada punto de venta. Sabemos de baterías.',
  },
  {
    icon: BadgeCheck,
    title: 'Calidad Certificada',
    description:
      'Baterías con certificación ISO 9001 y normas internacionales. Confianza respaldada por laboratorios.',
  },
  {
    icon: Wrench,
    title: 'Instalación Gratis',
    description:
      'Instalamos tu batería sin costo adicional en cualquiera de nuestros distribuidores autorizados.',
  },
  {
    icon: Truck,
    title: 'Red de Distribución',
    description:
      'Más de 150 distribuidores en todo el país. Siempre hay un punto Baterías Andinas cerca de ti.',
  },
];

export default function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      className={`py-20 sm:py-28 transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-white'
      }`}
    >
      <div className="container-max">
        <div className="flex items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] mb-4 ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}
            >
              <span className="w-6 h-px bg-current" />
              ¿Por qué elegirnos?
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[0.95] max-w-xl ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Confianza que arranca en cada encendido
            </h2>
            <p
              className={`mt-4 text-base sm:text-lg max-w-xl leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              No solo vendemos baterías: somos tu socio de energía en cada viaje, ruta y aventura
              a lo largo del Ecuador.
            </p>
          </div>
        </div>

        {/* Mobile: snap-scroll carousel · Desktop: grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative shrink-0 w-[78%] sm:w-auto snap-start rounded-2xl border p-6 sm:p-7 transition-all duration-300 ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-xl'
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-600/20`}
                >
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <span
                  className={`text-4xl font-extrabold tracking-tight leading-none select-none ${
                    isDark ? 'text-slate-800' : 'text-slate-100'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile swipe hint */}
        <p className={`sm:hidden mt-4 text-center text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          Desliza para ver más →
        </p>
      </div>
    </section>
  );
}
