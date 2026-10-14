// estado: ""
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

import { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
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
      'Suele requerir una instalación y configuración acordes al vehículo'
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
      'Compara las especificaciones de la batería original'
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
      'Comprueba la fijación y la ubicación de los bornes'
    ],
    dimensions: 'Por validar',
    polarity: 'Por validar',
    image: 'https://images.pexels.com/photos/37177070/pexels-photo-37177070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Car
  },
];

export default function Products({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? 'h1' : 'h2';
  const [activeFilter, setActiveFilter] = useState<string>('Todas');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedBatteryForSpecs, setSelectedBatteryForSpecs] = useState<BatteryShowcaseItem | null>(null);
  const [itemsPerView, setItemsPerView] = useState<number>(2);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const trackRef = useRef<HTMLDivElement>(null);

  const filters = ['Todas', 'AGM', 'EFB', 'Calcio-Plata'];

  const filteredItems = batteryCatalogItems.filter(item => 
    activeFilter === 'Todas' ? true : item.technology === activeFilter
  );

  // Responsive items per view listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else {
        setItemsPerView(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure current index is within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [activeFilter, itemsPerView]);

  const maxIndex = Math.max(0, filteredItems.length - itemsPerView);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const target = (index + maxIndex + 1) % (maxIndex + 1);
    const card = track?.querySelectorAll<HTMLElement>('[data-product-card]')[target];
    if (track && card) track.scrollTo({ left: target * (card.offsetWidth + 24), behavior: 'smooth' });
    setCurrentIndex(target);
  };

  const handlePrev = () => goTo(currentIndex - 1);
  const handleNext = () => goTo(currentIndex + 1);

  const handleScroll = () => {
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>('[data-product-card]');
    if (track && first) {
      const step = first.offsetWidth + 24;
      setCurrentIndex(Math.min(maxIndex, Math.round(track.scrollLeft / step)));
    }
  };

  return (
    <section 
      id="catalogo" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-slate-950 text-white border-slate-900' 
          : 'bg-slate-50/80 text-slate-900 border-slate-200'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/15 border border-primary-400/30 text-primary-600 dark:text-primary-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <Zap className="w-4 h-4 text-warning-500 fill-warning-500" />
              Tecnologías de referencia · Baterías Maresa
            </div>
            <Heading className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Conoce las tecnologías de batería
            </Heading>
            <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Compara las tecnologías de batería y descubre qué especificaciones debes revisar para tu vehículo.
            </p>
          </div>


        </div>

        {/* Technology Filter — Dropdown on mobile, pills on desktop */}
        <div className="mb-8">
          <select
            aria-label="Filtrar tecnologías de batería"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className={`sm:hidden w-full py-3 px-4 rounded-xl border text-sm font-bold outline-none transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white focus:border-primary-500'
                : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 shadow-sm'
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
                      className="absolute inset-0 bg-secondary-500 rounded-xl shadow-md shadow-secondary-500/25"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button type="button" onClick={handlePrev} disabled={maxIndex === 0} aria-label="Batería anterior" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-40 ${isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-300 hover:border-secondary-500'}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div 
            id="products-carousel-track"
            ref={trackRef}
            onScroll={handleScroll}
            aria-label="Tecnologías de baterías; desliza para explorar"
            className="flex min-w-0 max-w-[760px] flex-1 gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth pb-6 pt-3 scrollbar-hide"
          >
            {filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  data-product-card
                  className="w-[88%] shrink-0 snap-start sm:w-[calc(50%-12px)]"
                >
                  <div 
                    className={`h-full flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                      isDark 
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl shadow-slate-950/50' 
                        : 'bg-white border-slate-200/90 hover:border-primary-300 shadow-md hover:shadow-xl text-slate-900'
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
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-500 text-primary-950 text-[11px] font-bold uppercase tracking-wider shadow-md">
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{item.technology}</span>
                      </div>


                      {/* Category Label Bottom */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <span className="text-xs font-semibold text-primary-300 block truncate">
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

                        {/* Features List */}
                        <ul className="my-5 space-y-2 text-sm">
                          {item.features.map((feat, idx) => (
                            <li key={idx} className={`flex items-start gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              <CheckCircle2 className="w-4 h-4 text-secondary-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing & CTA Buttons */}
                      <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
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
                            <span>Conocer la tecnología</span>
                          </button>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" onClick={handleNext} disabled={maxIndex === 0} aria-label="Batería siguiente" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary-500 text-primary-950 transition-colors hover:bg-secondary-400 disabled:opacity-40">
            <ChevronRight className="w-6 h-6" />
          </button>
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
              <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 p-5 text-white relative">
                <button
                  onClick={() => setSelectedBatteryForSpecs(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-200">
                  Ficha técnica de referencia • Baterías Maresa
                </span>
                <h3 className="text-xl font-extrabold mt-1">
                  {selectedBatteryForSpecs.name}
                </h3>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm leading-relaxed">Antes de elegir una batería, compara la tecnología, capacidad, corriente de arranque, dimensiones y polaridad indicadas para tu vehículo.</p>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Características Destacadas
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {selectedBatteryForSpecs.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
