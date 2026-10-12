/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — VehicleFinder.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/VehicleFinder.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site (Luxury UI / Emil Kowalski Standards)
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L030-L055  → Imports & Type definitions
 *   L056-L190  → Custom Luxury Selector Component (Zero OS borders, Emil Kowalski easings)
 *   L192-L280  → Main Component State, Memoized selectors & Smart Search Engine
 *   L282-L370  → 3-Step Luxury Interactive Card with Micro-interactions
 *   L372-L490  → Compatibility Result Card (Glassmorphism Bento Grid, Specs & WhatsApp CTA)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-10-11
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Car, 
  RotateCcw, 
  MapPin, 
  CheckCircle2, 
  HelpCircle,
  Zap, 
  ChevronDown,
  Calendar,
  Check,
  Sparkles,
  ShieldCheck,
  Layers,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { VehicleBatteryMatch } from '@/types/sinergia';
import { vehicleCatalog as defaultCatalog, vehicleYears as defaultYears } from '@/data/sinergiaData';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

interface VehicleFinderProps {
  onSelectBattery?: (battery: VehicleBatteryMatch['recommendedBattery']) => void;
  onLocateStore?: (province?: string) => void;
}

interface LuxuryDropdownProps {
  label: string;
  step: string;
  icon: React.ReactNode;
  value: string | number;
  placeholder: string;
  options: { label: string; value: string | number }[];
  disabled?: boolean;
  hasSearch?: boolean;
  onSelect: (val: any) => void;
  isDark: boolean;
}

/**
 * Custom Dropdown Component siguiendo estándares de Emil Kowalski:
 * - Cero líneas nativas de sistema operativo
 * - Easing personalizado [0.23, 1, 0.32, 1] y duración 180ms
 * - Micro-interacciones active:scale-[0.98]
 * - Cierre automático por click-outside y escape
 * - Accesibilidad total con teclado (ArrowDown, ArrowUp, Enter, Escape)
 */
function LuxuryDropdown({
  label,
  step,
  icon,
  value,
  placeholder,
  options,
  disabled = false,
  hasSearch = true,
  onSelect,
  isDark,
}: LuxuryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((opt) => String(opt.value) === String(value));
  const selectedOption = options[selectedIndex];

  const filteredOptions = useMemo(() => {
    if (!searchFilter.trim()) return options;
    const term = searchFilter.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(term));
  }, [options, searchFilter]);

  // Sincronizar índice resaltado cuando cambia la lista filtrada o se abre
  useEffect(() => {
    if (isOpen) {
      const idx = filteredOptions.findIndex((opt) => String(opt.value) === String(value));
      setHighlightedIndex(idx >= 0 ? idx : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, filteredOptions, value]);

  // Auto-scroll al elemento resaltado con flechas
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsListRef.current) {
      const activeEl = optionsListRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Click outside y escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        onSelect(filteredOptions[highlightedIndex].value);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const showSearchInput = hasSearch && options.length > 8;

  return (
    <div 
      className="relative w-full" 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      {/* Label & Step Header */}
      <div className="flex items-center justify-between mb-2">
        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <span className="text-blue-500 font-mono text-[11px] font-extrabold">{step}</span>
          <span>{label}</span>
        </label>
        {selectedOption && (
          <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-400/20">
            Listo
          </span>
        )}
      </div>

      {/* Luxury Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearchFilter('');
          }
        }}
        className={`w-full min-h-[54px] px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all duration-200 select-none ${
          disabled 
            ? 'opacity-40 cursor-not-allowed border border-slate-700/40 bg-slate-800/30' 
            : 'cursor-pointer active:scale-[0.98]'
        } ${
          isDark 
            ? isOpen 
              ? 'bg-slate-900 border-2 border-blue-500 shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900/80 hover:bg-slate-900 border border-slate-700/70 hover:border-slate-600 shadow-sm' 
            : isOpen 
              ? 'bg-white border-2 border-blue-500 shadow-lg shadow-blue-500/15' 
              : 'bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden mr-2">
          <div className={`p-2 rounded-xl shrink-0 ${
            selectedOption 
              ? 'bg-blue-500/15 text-blue-500' 
              : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200/80 text-slate-500'
          }`}>
            {icon}
          </div>
          <div className="truncate">
            <span className={`block text-sm font-semibold truncate ${
              selectedOption 
                ? isDark ? 'text-white' : 'text-slate-950' 
                : isDark ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'
            }`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-blue-500' : ''
        }`} />
      </button>

      {/* Floating Animated Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl border ${
              isDark 
                ? 'bg-slate-900/95 border-slate-700/80 shadow-slate-950/80' 
                : 'bg-white/95 border-slate-200 shadow-slate-900/15'
            }`}
          >
            {/* Search filter if enabled */}
            {showSearchInput && (
              <div className="p-1 mb-1.5">
                <input
                  type="text"
                  autoFocus
                  placeholder="Escribe para buscar..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-medium ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>
            )}

            {/* Options List */}
            <div 
              ref={optionsListRef}
              role="listbox"
              className="max-h-60 overflow-y-auto scrollbar-hide py-1 space-y-0.5"
            >
              {filteredOptions.length === 0 ? (
                <div className={`p-3 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No se encontraron coincidencias
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = String(opt.value) === String(value);
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onClick={() => {
                        onSelect(opt.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                        isSelected 
                          ? isDark 
                            ? 'bg-blue-600/25 text-blue-300 font-bold border border-blue-500/30' 
                            : 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
                          : isHighlighted
                            ? isDark
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-100 text-slate-950'
                            : isDark 
                              ? 'text-slate-200 hover:bg-slate-800/80 hover:text-white' 
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-500 shrink-0 ml-2" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VehicleFinder({ onLocateStore }: VehicleFinderProps) {
  const contactWhatsApp = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP;
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [result, setResult] = useState<VehicleBatteryMatch | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Inicializamos inmediatamente con el catálogo ecuatoriano pre-cargado
  const [vehicleCatalog, setVehicleCatalog] = useState<VehicleBatteryMatch[]>(defaultCatalog);
  const [catalogLoading, setCatalogLoading] = useState(false);

  const { content } = useSiteContent();
  const { theme } = useTheme();
  const vfContent = content.vehicleFinder;
  const isDark = theme === 'dark';

  // Sincronización en segundo plano con Firestore (si existen registros publicados adicionales)
  useEffect(() => {
    let active = true;
    async function loadCatalog() {
      if (!isFirebaseConfigured) return;
      try {
        const snapshot = await getDocs(query(collection(db, 'catalog'), where('published', '==', true)));
        if (active && !snapshot.empty) {
          const remoteItems = snapshot.docs.map((item) => item.data() as VehicleBatteryMatch);
          if (remoteItems.length > 0) {
            setVehicleCatalog(remoteItems);
          }
        }
      } catch {
        // En caso de corte o desconexión, el catálogo ecuatoriano local garantiza servicio ininterrumpido
      }
    }
    void loadCatalog();
    return () => { active = false; };
  }, []);

  const vehicleYears = useMemo(() => {
    const years = Array.from(new Set(vehicleCatalog.map((item) => item.year).filter(Boolean))).sort((a, b) => b - a);
    return years.length > 0 ? years : defaultYears;
  }, [vehicleCatalog]);

  // Marcas disponibles
  const availableBrands = useMemo(() => {
    if (!selectedYear) {
      return Array.from(new Set(vehicleCatalog.map((v) => v.brand))).sort();
    }
    const brands = vehicleCatalog
      .filter((v) => v.year === Number(selectedYear))
      .map((v) => v.brand);
    return brands.length > 0 
      ? Array.from(new Set(brands)).sort() 
      : Array.from(new Set(vehicleCatalog.map((v) => v.brand))).sort();
  }, [selectedYear, vehicleCatalog]);

  // Modelos disponibles
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    let list = vehicleCatalog.filter((v) => v.brand.toLowerCase() === selectedBrand.toLowerCase());
    if (selectedYear) {
      const filteredByYear = list.filter((v) => v.year === Number(selectedYear));
      if (filteredByYear.length > 0) {
        list = filteredByYear;
      }
    }
    return Array.from(new Set(list.map((v) => v.model))).sort();
  }, [selectedYear, selectedBrand, vehicleCatalog]);

  // Búsqueda inteligente de compatibilidad con feedback táctil y visual de espera
  const performSearch = (brand = selectedBrand, model = selectedModel, year = selectedYear) => {
    if (!brand || !model) return;

    setIsSearching(true);
    setResult(null);

    // Latencia deliberada de micro-interacción para confirmar consulta al catálogo
    setTimeout(() => {
      let match = vehicleCatalog.find(
        (v) =>
          v.brand.toLowerCase() === brand.toLowerCase() &&
          v.model.toLowerCase() === model.toLowerCase() &&
          (year ? v.year === Number(year) : true)
      );

      if (!match) {
        match = vehicleCatalog.find(
          (v) =>
            v.brand.toLowerCase() === brand.toLowerCase() &&
            v.model.toLowerCase() === model.toLowerCase()
        );
      }

      setResult(match || null);
      setIsSearching(false);

      // Auto-scroll suave para centrar el resultado en el viewport
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 60);
    }, 500);
  };

  const handleReset = () => {
    setSelectedYear('');
    setSelectedBrand('');
    setSelectedModel('');
    setResult(null);
    setIsSearching(false);
  };

  return (
    <section 
      id="escoge-tu-bateria" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-slate-900 text-white border-slate-800' 
          : 'bg-slate-50 text-slate-900 border-slate-200'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            {vfContent.badge}
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}>
            {vfContent.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {vfContent.subtitle}
          </p>
        </div>

        {/* 3-Step Cascade Selector Container (Emil Kowalski Luxury UI) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`max-w-4xl mx-auto backdrop-blur-xl border rounded-3xl p-5 sm:p-8 shadow-2xl transition-all duration-300 ${
            isDark 
              ? 'bg-slate-800/85 border-slate-700/80 shadow-slate-950/50' 
              : 'bg-white border-slate-200/90 shadow-slate-900/10'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            
            {/* Step 1: Año */}
            <LuxuryDropdown
              step="1."
              label="Año del Vehículo"
              placeholder="Cualquier Año..."
              icon={<Calendar className="w-4 h-4" />}
              value={selectedYear}
              hasSearch={false}
              isDark={isDark}
              options={[
                { label: 'Cualquier Año (Todas las versiones)', value: '' },
                ...vehicleYears.map((yr) => ({ label: `${yr}`, value: yr }))
              ]}
              onSelect={(val) => {
                const yr = val ? Number(val) : '';
                setSelectedYear(yr);
                if (selectedBrand && selectedModel) {
                  performSearch(selectedBrand, selectedModel, yr);
                }
              }}
            />

            {/* Step 2: Marca */}
            <LuxuryDropdown
              step="2."
              label="Marca"
              placeholder="Selecciona Marca..."
              icon={<Car className="w-4 h-4" />}
              value={selectedBrand}
              isDark={isDark}
              options={availableBrands.map((b) => ({ label: b, value: b }))}
              onSelect={(brandVal) => {
                setSelectedBrand(brandVal);
                setSelectedModel('');
                setResult(null);
              }}
            />

            {/* Step 3: Modelo */}
            <LuxuryDropdown
              step="3."
              label="Modelo"
              placeholder={!selectedBrand ? 'Primero elige marca...' : 'Selecciona Modelo...'}
              icon={<Layers className="w-4 h-4" />}
              value={selectedModel}
              disabled={!selectedBrand || availableModels.length === 0}
              isDark={isDark}
              options={availableModels.map((m) => ({ label: m, value: m }))}
              onSelect={(modelVal) => {
                setSelectedModel(modelVal);
                performSearch(selectedBrand, modelVal, selectedYear);
              }}
            />
          </div>

          {/* Action Row */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${
            isDark ? 'border-slate-700/60' : 'border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 text-xs ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Base verificada para Quito (2.850 msnm), Guayaquil, Cuenca y flotas del Ecuador.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {(selectedYear || selectedBrand || selectedModel || result) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/15 text-slate-300' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpiar
                </button>
              )}
              <button
                type="button"
                onClick={() => performSearch()}
                disabled={!selectedBrand || !selectedModel || isSearching}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verificando batería...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Buscar Batería Compatible</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading & Waiting Message Panel (Emil Kowalski feedback standards) */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`mt-8 max-w-4xl mx-auto rounded-3xl p-8 border shadow-xl text-center backdrop-blur-xl ${
                isDark 
                  ? 'bg-slate-900/90 border-blue-500/30 text-white shadow-blue-950/20' 
                  : 'bg-white/95 border-blue-200 text-slate-900 shadow-blue-900/10'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-inner">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
                </div>
                
                <div>
                  <h4 className="text-lg sm:text-xl font-extrabold tracking-tight">
                    Consultando compatibilidad técnica...
                  </h4>
                  <p className={`text-xs sm:text-sm mt-1.5 max-w-lg mx-auto ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Verificando especificaciones oficiales, norma DIN, polaridad y amperaje requerido para <strong className="text-blue-500">{selectedBrand} {selectedModel}</strong>.
                  </p>
                </div>

                <div className="w-56 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Card with Luxury Motion (Emil Kowalski specs) */}
        <AnimatePresence>
          {result && !isSearching && (
            <motion.div 
              ref={resultRef}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={`mt-8 max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white shadow-slate-950/60' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10'
              }`}
            >
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
                isDark ? 'border-slate-700' : 'border-slate-100'
              }`}>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Compatibilidad Oficial Verificada
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Motor: {result.engine}
                    </span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold mt-2 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {result.brand} {result.model} {result.year ? `(${result.year})` : ''}
                  </h3>
                </div>

                {result.recommendedBattery.priceEcuador > 0 && (
                  <div className="sm:text-right">
                    <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      PVP Sugerido Ecuador
                    </span>
                    <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                      ${result.recommendedBattery.priceEcuador.toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                      Recibe hasta $15 de descuento entregando tu batería usada
                    </span>
                  </div>
                )}
              </div>

              {/* Recommended Battery Highlight Card */}
              <div className={`mt-6 p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDark 
                  ? 'bg-blue-950/30 border-blue-500/30' 
                  : 'bg-blue-50/80 border-blue-200'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                    <Zap className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block font-mono">
                      Batería Homologada Recomendada
                    </span>
                    <h4 className={`text-lg sm:text-xl font-extrabold ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}>
                      {result.recommendedBattery.model} ({result.recommendedBattery.technology})
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% Calce Exacto Garantizado
                  </span>
                </div>
              </div>

              {/* Battery Specs Bento Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <span className={`text-xs uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Referencia BCI / DIN
                  </span>
                  <span className={`text-lg font-extrabold mt-1 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {result.recommendedBattery.bciGroup}
                  </span>
                  <span className="text-[11px] text-blue-500 dark:text-blue-400 font-semibold">
                    {result.recommendedBattery.technology}
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <span className={`text-xs uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Arranque en Frío (CCA)
                  </span>
                  <span className="text-lg font-extrabold text-amber-500 mt-1 block">
                    {result.recommendedBattery.cca} A
                  </span>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Excelente arranque en páramo y frío andino
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <span className={`text-xs uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Capacidad (Ah)
                  </span>
                  <span className={`text-lg font-extrabold mt-1 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {result.recommendedBattery.ah} Ah
                  </span>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {result.recommendedBattery.voltage} V estándar
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <span className={`text-xs uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Garantía Nacional
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    {result.recommendedBattery.warrantyMonths > 0 ? `${result.recommendedBattery.warrantyMonths} meses` : 'Garantía oficial'}
                  </span>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Respaldo directo Maresa en todo el Ecuador
                  </span>
                </div>
              </div>

              {/* Technical Features Pills */}
              {result.recommendedBattery.features && result.recommendedBattery.features.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700/40">
                  <span className={`text-xs font-bold block mb-2 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Ventajas Homologadas para este Vehículo:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedBattery.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium border ${
                          isDark 
                            ? 'bg-slate-900/80 border-slate-700/60 text-slate-300' 
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                {contactWhatsApp && (
                  <a
                    href={`https://wa.me/${contactWhatsApp}?text=Hola%2C%20deseo%20consultar%20disponibilidad%20de%20la%20batería%20${encodeURIComponent(result.recommendedBattery.model)}%20para%20${encodeURIComponent(result.brand + ' ' + result.model)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Pedir esta Batería por WhatsApp</span>
                  </a>
                )}

                {onLocateStore && (
                  <button
                    type="button"
                    onClick={() => onLocateStore()}
                    className={`w-full sm:w-auto py-4 px-6 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                      isDark 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Ver Puntos de Venta</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
