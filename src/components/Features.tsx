// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Features.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Features.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   - Desktop (>= 768px): Grid ordenado 3 arriba y 3 abajo.
 *   - Móvil (< 768px): Carrusel suave de 2 tarjetas por pantalla
 *     (Diapositiva 1: 01 y 02, Diapositiva 2: 03 y 04, Diapositiva 3: 05 y 06).
 *     Transición automática ascendente infinita (1→2→3→1...)
 *     Soporte para deslizamiento manual con gestos táctiles (swipe).
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-10-12
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { ShieldCheck, Clock, Headphones, BadgeCheck, Wrench, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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

// Pares de 2 tarjetas para el carrusel móvil: [[0, 1], [2, 3], [4, 5]]
const mobilePairs = [
  [features[0], features[1]],
  [features[2], features[3]],
  [features[4], features[5]],
];

export default function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Índice del slide móvil activo (0: [1,2], 1: [3,4], 2: [5,6])
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide infinito ascendente cada 4 segundos
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % mobilePairs.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Manejadores para navegación manual
  const handleNext = () => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % mobilePairs.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + mobilePairs.length) % mobilePairs.length);
  };

  // Soporte gestual para swipe táctil con Motion
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -40) {
      handleNext();
    } else if (info.offset.x > 40) {
      handlePrev();
    }
  };

  return (
    <section
      className={`py-16 sm:py-24 transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50/70'
      }`}
    >
      <div className="container-max">
        {/* Cabecera de la Sección */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${
              isDark 
                ? 'bg-primary-900/30 text-primary-300 border-primary-800/40' 
                : 'bg-primary-50 text-brand-navy border-primary-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-secondary-500" />
            Criterios de Ingeniería Automotriz
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-brand-navy'
            }`}
          >
            Seis claves para elegir con seguridad
          </h2>
          <p
            className={`mt-4 text-sm sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Una batería compatible debe cumplir con precisión los requerimientos eléctricos y físicos certificados por el fabricante.
          </p>
        </div>

        {/* ─── 1. MODO MÓVIL (< md): CARRUSEL INFINITO DE 2 TARJETAS ─── */}
        <div 
          className="block md:hidden relative select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2500)}
        >
          <div className="overflow-hidden min-h-[460px] relative px-1">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeSlide}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="space-y-4 touch-pan-y"
              >
                {mobilePairs[activeSlide].map((f, pairIdx) => {
                  const globalIdx = activeSlide * 2 + pairIdx;
                  return (
                    <div
                      key={f.title}
                      className={`rounded-3xl p-6 border transition-all duration-300 shadow-md ${
                        isDark
                          ? 'bg-primary-800/90 border-primary-900/30 text-white shadow-black/40'
                          : 'bg-white border-slate-200/90 text-slate-900 shadow-slate-200/60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center shadow-md shadow-primary-900/30 text-white">
                          <f.icon className="w-6 h-6 text-secondary-300" />
                        </div>
                        <span className={`text-3xl font-extrabold tracking-tight select-none ${
                          isDark ? 'text-slate-700' : 'text-slate-200'
                        }`}>
                          {String(globalIdx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className={`text-base font-extrabold mb-1.5 ${isDark ? 'text-white' : 'text-brand-navy'}`}>
                        {f.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {f.description}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controles de Navegación Móvil (Indicadores + Flechas sutiles) */}
          <div className="flex items-center justify-between mt-5 px-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Anterior par de tarjetas"
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots Indicadores (3 pares: 1-2, 3-4, 5-6) */}
            <div className="flex items-center gap-2">
              {mobilePairs.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    setDirection(dotIdx > activeSlide ? 1 : -1);
                    setActiveSlide(dotIdx);
                  }}
                  aria-label={`Ir al par ${dotIdx * 2 + 1}-${dotIdx * 2 + 2}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === dotIdx 
                      ? 'w-7 bg-secondary-500' 
                      : isDark ? 'w-2 bg-slate-700' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente par de tarjetas"
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── 2. MODO DESKTOP (>= md): GRID ORDENADO DE 3 ARRIBA Y 3 ABAJO ─── */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative rounded-3xl p-7 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-primary-700/60 hover:shadow-primary-950/40'
                  : 'bg-white border-slate-200/90 hover:border-primary-600/40 hover:shadow-slate-300/40'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md shadow-primary-900/30 text-white">
                  <f.icon className="w-7 h-7 text-secondary-300" />
                </div>
                <span className={`text-3xl font-extrabold tracking-tight select-none ${
                  isDark ? 'text-slate-800 group-hover:text-primary-900/60' : 'text-slate-200 group-hover:text-primary-100'
                } transition-colors`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className={`text-lg font-extrabold mb-2.5 ${isDark ? 'text-white' : 'text-brand-navy'}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
