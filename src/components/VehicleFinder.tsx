import { useState, useMemo } from 'react';
import { 
  Search, 
  Car, 
  RotateCcw, 
  ExternalLink, 
  MapPin, 
  CheckCircle2, 
  HelpCircle,
  Flame,
  Zap,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { vehicleCatalog, vehicleYears } from '@/data/sinergiaData';
import { VehicleBatteryMatch } from '@/types/sinergia';
import { useSiteContent } from '@/context/SiteContentContext';
import { useTheme } from '@/context/ThemeContext';

interface VehicleFinderProps {
  onSelectBattery?: (battery: VehicleBatteryMatch['recommendedBattery']) => void;
  onLocateStore?: (province?: string) => void;
}

export default function VehicleFinder({ onLocateStore }: VehicleFinderProps) {
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [result, setResult] = useState<VehicleBatteryMatch | null>(null);

  const { content } = useSiteContent();
  const { theme } = useTheme();
  const vfContent = content.vehicleFinder;
  const isDark = theme === 'dark';

  // Filter available brands based on selected year
  const availableBrands = useMemo(() => {
    if (!selectedYear) {
      return Array.from(new Set(vehicleCatalog.map(v => v.brand))).sort();
    }
    const brands = vehicleCatalog
      .filter(v => v.year === Number(selectedYear))
      .map(v => v.brand);
    return Array.from(new Set(brands)).sort();
  }, [selectedYear]);

  // Filter available models based on year and brand
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    let list = vehicleCatalog.filter(v => v.brand.toLowerCase() === selectedBrand.toLowerCase());
    if (selectedYear) {
      list = list.filter(v => v.year === Number(selectedYear));
    }
    return Array.from(new Set(list.map(v => v.model))).sort();
  }, [selectedYear, selectedBrand]);

  const handleSearch = () => {
    if (!selectedBrand || !selectedModel) return;

    let match = vehicleCatalog.find(
      v => v.brand.toLowerCase() === selectedBrand.toLowerCase() &&
           v.model.toLowerCase() === selectedModel.toLowerCase() &&
           (!selectedYear || v.year === Number(selectedYear))
    );

    if (!match) {
      match = vehicleCatalog.find(
        v => v.brand.toLowerCase() === selectedBrand.toLowerCase() &&
             v.model.toLowerCase() === selectedModel.toLowerCase()
      );
    }

    setResult(match || null);
  };

  const handleReset = () => {
    setSelectedYear('');
    setSelectedBrand('');
    setSelectedModel('');
    setResult(null);
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

        {/* 3-Step Cascade Selector Container */}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            
            {/* Step 1: Año */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                1. Año del Vehículo
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value ? Number(e.target.value) : '');
                  setSelectedBrand('');
                  setSelectedModel('');
                  setResult(null);
                }}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl font-medium border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 text-white border-slate-700' 
                    : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
              >
                <option value="">Cualquier Año...</option>
                {vehicleYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Marca */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                2. Marca
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('');
                  setResult(null);
                }}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl font-medium border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 text-white border-slate-700' 
                    : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
              >
                <option value="">Selecciona Marca...</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Modelo */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                3. Modelo
              </label>
              <select
                value={selectedModel}
                disabled={!selectedBrand || availableModels.length === 0}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                }}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl font-medium border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'bg-slate-900 text-white border-slate-700' 
                    : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
              >
                <option value="">
                  {!selectedBrand ? 'Primero elige marca...' : 'Selecciona Modelo...'}
                </option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${
            isDark ? 'border-slate-700/60' : 'border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 text-xs ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Base técnica calibrada para altura andina (2,800m+) y clima de costa ecuatoriana</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {(selectedYear || selectedBrand || selectedModel || result) && (
                <button
                  onClick={handleReset}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
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
                onClick={handleSearch}
                disabled={!selectedBrand || !selectedModel}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Buscar Batería Compatible
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Card with Motion */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
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
                      100% Compatible OEM
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Motor: {result.engine}
                    </span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold mt-2 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {result.brand} {result.model} ({result.year})
                  </h3>
                </div>

                <div className="sm:text-right">
                  <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    PVP Sugerido Oficial
                  </span>
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                    ${result.recommendedBattery.priceEcuador.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    Recibimos tu batería usada (-$10 bono inmediato)
                  </span>
                </div>
              </div>

              {/* Battery Specs Bento Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <span className={`text-xs uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Referencia BCI
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
                    Arranque Frío (CCA)
                  </span>
                  <span className="text-lg font-extrabold text-amber-500 mt-1 block">
                    {result.recommendedBattery.cca} A
                  </span>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Apto Altitud Andina
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
                    12 Voltios DC
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <span className={`text-xs uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Garantía Nacional
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    {result.recommendedBattery.warrantyMonths} Meses
                  </span>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Corporación Maresa
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={`https://wa.me/593998123456?text=Hola%20Maresa,%20deseo%20comprar%20la%20bater%C3%ADa%20${encodeURIComponent(result.recommendedBattery.model)}%20para%20mi%20${encodeURIComponent(result.brand + ' ' + result.model + ' ' + result.year)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Pedir esta Batería por WhatsApp</span>
                </a>

                {onLocateStore && (
                  <button
                    onClick={() => onLocateStore()}
                    className={`w-full sm:w-auto py-4 px-6 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
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
