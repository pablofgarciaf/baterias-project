/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Products.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Products.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L026-L045  → Imports & dependencies
 *   L047-L064  → Type definitions / interfaces (BatteryShowcaseItem)
 *   L066-L177  → Constants / static data (batteryCatalogItems)
 *   L179-L195  → Component function start & state declarations
 *   L197-L230  → Lifecycle hooks & effects (resize, sync, auto-play)
 *   L232-L262  → Event handlers (navigation & touch swipe gestures)
 *   L264-L544  → JSX render: header, filter tabs & product carousel
 *   L546-L643  → JSX render: technical specs modal dialog
 *   L644-L646  → Section close & component export end
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, useRef, type TouchEvent } from 'react';
import { 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Car, 
  Truck, 
  Search,
  FileText,
  X,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/context/ThemeContext';

interface BatteryShowcaseItem {
  id: string;
  name: string;
  category: string;
  bciGroup: string;
  cca: number;
  ah: number;
  voltage: number;
  warrantyMonths: number;
  priceEcuador: number;
  technology: 'AGM' | 'EFB' | 'Calcio-Plata' | 'Heavy Duty';
  bestFor: string;
  features: string[];
  dimensions: string;
  polarity: string;
  image: string;
  icon: typeof Car;
}

const batteryCatalogItems: BatteryShowcaseItem[] = [
  {
    id: 'referencia-agm',
    name: 'Tecnología AGM',
    category: 'Referencia educativa',
    bciGroup: 'Por validar',
    cca: 0,
    ah: 0,
    voltage: 12,
    warrantyMonths: 0,
    priceEcuador: 0,
    technology: 'AGM',
    bestFor: 'Vehículos que requieren AGM según el fabricante',
    features: [
      'Comprueba tecnología y dimensiones originales antes de reemplazar',
      'Algunos vehículos requieren registrar la batería nueva',
      'La ficha comercial oficial está pendiente'
    ],
    dimensions: 'Por validar',
    polarity: 'Por validar',
    image: 'https://images.pexels.com/photos/37177072/pexels-photo-37177072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Car
  },
  {
    id: 'referencia-efb',
    name: 'Tecnología EFB',
    category: 'Referencia educativa',
    bciGroup: 'Por validar',
    cca: 0,
    ah: 0,
    voltage: 12,
    warrantyMonths: 0,
    priceEcuador: 0,
    technology: 'EFB',
    bestFor: 'Vehículos que requieren EFB según el fabricante',
    features: [
      'Confirma la tecnología exigida por el sistema Start-Stop',
      'Comprueba capacidad y corriente de arranque en el manual',
      'La ficha comercial oficial está pendiente'
    ],
    dimensions: 'Por validar',
    polarity: 'Por validar',
    image: 'https://images.pexels.com/photos/6940962/pexels-photo-6940962.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Truck
  },
  {
    id: 'referencia-convencional',
    name: 'Batería convencional',
    category: 'Referencia educativa',
    bciGroup: 'Por validar',
    cca: 0,
    ah: 0,
    voltage: 12,
    warrantyMonths: 0,
    priceEcuador: 0,
    technology: 'Calcio-Plata',
    bestFor: 'Solo cuando sea compatible con el vehículo',
    features: [
      'Verifica tamaño, polaridad y sujeción',
      'No sustituyas una AGM o EFB sin comprobar el requisito del fabricante',
      'La ficha comercial oficial está pendiente'
    ],
    dimensions: 'Por validar',
    polarity: 'Por validar',
    image: 'https://images.pexels.com/photos/37177070/pexels-photo-37177070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Car
  },
];

export default function Products() {
  const [activeFilter, setActiveFilter] = useState<string>('Todas');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedBatteryForSpecs, setSelectedBatteryForSpecs] = useState<BatteryShowcaseItem | null>(null);
  const [itemsPerView, setItemsPerView] = useState<number>(3);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const filters = ['Todas', 'AGM', 'EFB', 'Calcio-Plata'];

  const filteredItems = batteryCatalogItems.filter(item => 
    activeFilter === 'Todas' ? true : item.technology === activeFilter
  );

  // Responsive items per view listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure current index is within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter, itemsPerView]);

  const maxIndex = Math.max(0, filteredItems.length - itemsPerView);

  // Auto-play
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      id="catalogo" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-slate-950 text-white border-slate-900' 
          : 'bg-slate-50/80 text-slate-900 border-slate-200'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              Tecnologías de referencia · Baterías Maresa
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Conoce las tecnologías de batería
            </h2>
            <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Estas fichas explican diferencias generales. Los modelos, precios y garantías se publicarán cuando exista un catálogo oficial aprobado.
            </p>
          </div>


        </div>

        {/* Technology Filter — Dropdown on mobile, pills on desktop */}
        <div className="mb-8">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className={`sm:hidden w-full py-3 px-4 rounded-xl border text-sm font-bold outline-none transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'
                : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm'
            }`}
          >
            {filters.map((filter) => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>

          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : isDark
                        ? 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                        : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-product-filter"
                      className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Controls (below tabs, aligned right) */}
        <div className="flex md:hidden items-center justify-end gap-3 mb-6">
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
              isDark ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
            }`}>
              {String(currentIndex + 1).padStart(2, '0')} / {String(maxIndex + 1).padStart(2, '0')}
            </span>
            <button onClick={handlePrev} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer border ${isDark ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-600/30">
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>

        {/* Fluid Responsive Carousel Track with Touch Swipe */}
        <div className="relative group">
          {/* Desktop Controls (flanking) */}
          <button onClick={handlePrev} className={`${filteredItems.length > 3 ? 'hidden md:flex' : 'hidden'} absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center transition-all active:scale-95 cursor-pointer border shadow-lg backdrop-blur-md ${isDark ? 'bg-slate-900/90 hover:bg-slate-800 text-white border-slate-800' : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200'}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className={`${filteredItems.length > 3 ? 'hidden md:flex' : 'hidden'} absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xl shadow-blue-600/30 backdrop-blur-md`}>
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            id="products-carousel-track"
            className="flex justify-start md:justify-center overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-8 pb-8 pt-4 px-4 sm:px-0 no-scrollbar scroll-smooth"
          >
            {filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="shrink-0 snap-center w-[290px] sm:w-[320px] lg:w-[360px]"
                >
                  <div 
                    className={`h-full flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 ${
                      isDark 
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl shadow-slate-950/50' 
                        : 'bg-white border-slate-200/90 hover:border-blue-300 shadow-md hover:shadow-xl text-slate-900'
                    }`}
                  >
                    {/* Top Image & Badge */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Technology Pill */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{item.technology}</span>
                      </div>

                      {/* Warranty Pill */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur text-white text-[11px] font-bold shadow-md">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Ficha comercial pendiente</span>
                      </div>

                      {/* Category Label Bottom */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <span className="text-xs font-semibold text-blue-300 block truncate">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className={`text-lg sm:text-xl font-extrabold leading-snug line-clamp-2 ${
                          isDark ? 'text-white' : 'text-slate-950'
                        }`}>
                          {item.name}
                        </h3>

                        <p className={`text-xs mt-1.5 line-clamp-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <strong>Ideal para:</strong> {item.bestFor}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-2 my-4">
                          <div className={`p-2.5 rounded-xl border text-center ${
                            isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              BCI
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold block mt-0.5">
                              {item.bciGroup}
                            </span>
                          </div>

                          <div className={`p-2.5 rounded-xl border text-center ${
                            isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              CCA
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold text-amber-500 block mt-0.5">
                              {item.cca > 0 ? `${item.cca} A` : 'Por validar'}
                            </span>
                          </div>

                          <div className={`p-2.5 rounded-xl border text-center ${
                            isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Ah
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold block mt-0.5">
                              {item.ah > 0 ? `${item.ah} Ah` : 'Por validar'}
                            </span>
                          </div>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-1.5 mb-4 text-xs">
                          {item.features.slice(0, 2).map((feat, idx) => (
                            <li key={idx} className={`flex items-start gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing & CTA Buttons */}
                      <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className={`text-xs block font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Precio y disponibilidad por confirmar
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                            Programa de reciclaje por confirmar
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <button
                            onClick={() => setSelectedBatteryForSpecs(item)}
                            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              isDark 
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Ficha</span>
                          </button>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* Technical Specs Modal Dialog */}
      <AnimatePresence>
        {selectedBatteryForSpecs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white relative">
                <button
                  onClick={() => setSelectedBatteryForSpecs(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Ficha técnica de referencia • Baterías Maresa
                </span>
                <h3 className="text-xl font-extrabold mt-1">
                  {selectedBatteryForSpecs.name}
                </h3>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-400 font-bold block">Grupo BCI</span>
                    <span className="text-sm font-extrabold mt-0.5 block">{selectedBatteryForSpecs.bciGroup}</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-400 font-bold block">Capacidad / Voltaje</span>
                    <span className="text-sm font-extrabold mt-0.5 block">Por validar</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-400 font-bold block">Arranque Frío (CCA)</span>
                    <span className="text-sm font-extrabold text-amber-500 mt-0.5 block">Por validar</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-400 font-bold block">Garantía</span>
                    <span className="text-sm font-extrabold text-emerald-500 mt-0.5 block">Por confirmar</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-400 font-bold block">Dimensiones (L x An x Al)</span>
                    <span className="text-xs font-bold mt-0.5 block">{selectedBatteryForSpecs.dimensions}</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-400 font-bold block">Polaridad</span>
                    <span className="text-xs font-bold mt-0.5 block">{selectedBatteryForSpecs.polarity}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Características Destacadas
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {selectedBatteryForSpecs.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50/60 border-blue-200'
                }`}>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Precio y disponibilidad pendientes de aprobación comercial</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
