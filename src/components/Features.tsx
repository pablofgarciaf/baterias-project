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
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Tecnología adecuada',
    description:
      'Comprueba si el vehículo requiere AGM, EFB o una batería convencional.',
  },
  {
    icon: Clock,
    title: 'Corriente de arranque',
    description:
      'Compara el CCA exigido por el vehículo con la ficha de la batería.',
  },
  {
    icon: Headphones,
    title: 'Capacidad correcta',
    description:
      'Revisa los Ah recomendados y las necesidades eléctricas de tu vehículo.',
  },
  {
    icon: BadgeCheck,
    title: 'Medidas y bornes',
    description:
      'Confirma tamaño, sujeción y polaridad antes de instalar la batería.',
  },
  {
    icon: Wrench,
    title: 'Instalación segura',
    description:
      'Algunos vehículos necesitan registrar la batería nueva o revisar el sistema de carga.',
  },
  {
    icon: Truck,
    title: 'Compra informada',
    description:
      'Pide precio, disponibilidad y garantía de la referencia exacta antes de decidir.',
  },
];

function FeaturesCarousel({ features: items, isDark }: { features: typeof features; isDark: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const idxRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-card]');
    if (!cards.length) return;

    const scrollToIdx = (i: number) => {
      const card = cards[i % cards.length];
      if (!card) return;
      el.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
    };

    timerRef.current = setInterval(() => {
      idxRef.current++;
      if (idxRef.current >= cards.length) idxRef.current = 0;
      scrollToIdx(idxRef.current);
    }, 3000);

    const pause = () => clearInterval(timerRef.current);
    const resume = () => {
      pause();
      timerRef.current = setInterval(() => {
        idxRef.current++;
        if (idxRef.current >= cards.length) idxRef.current = 0;
        scrollToIdx(idxRef.current);
      }, 3000);
    };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', () => setTimeout(resume, 2000), { passive: true });

    return () => {
      clearInterval(timerRef.current);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
    >
      {items.map((f, i) => (
        <div
          key={f.title}
          data-card
          className={`group relative shrink-0 w-[78%] sm:w-[45%] lg:w-[30%] snap-start rounded-2xl border p-6 sm:p-7 transition-all duration-300 ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-xl'
          }`}
        >
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-600/20">
              <f.icon className="w-7 h-7 text-white" />
            </div>
            <span className={`text-4xl font-extrabold tracking-tight leading-none select-none ${isDark ? 'text-slate-800' : 'text-slate-100'}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{f.description}</p>
        </div>
      ))}
    </div>
  );
}

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
              Antes de comprar
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[0.95] max-w-xl ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Seis claves para elegir con seguridad
            </h2>
            <p
              className={`mt-4 text-base sm:text-lg max-w-xl leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Una batería compatible debe cumplir los requisitos eléctricos y físicos de tu vehículo.
            </p>
          </div>
        </div>

        {/* Infinite auto-scrolling carousel */}
        <FeaturesCarousel features={features} isDark={isDark} />
      </div>
    </section>
  );
}
