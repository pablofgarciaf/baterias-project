'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useSiteContent } from '@/context/SiteContentContext';
import {
  MapPin, Search, Navigation, Phone,
  MessageCircle, Crosshair, MousePointerClick, ChevronRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { defaultDistributors } from '@/data/sinergiaData';
import { provinces } from '@/data/provinces';
import { DistributorLocation } from '@/types/sinergia';
import { getDistributors } from '@/lib/firebaseStore';

export default function AgenciasClient() {
  const { theme } = useTheme();
  const { content } = useSiteContent();
  const isDark = theme === 'dark';

  const [distributorsList, setDistributorsList] = useState<(DistributorLocation & { distance?: number })[]>(defaultDistributors);
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistributor, setSelectedDistributor] = useState<DistributorLocation | null>(defaultDistributors[0]);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [findingNearest, setFindingNearest] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDistributors().then(data => {
      if (data && data.length > 0) {
        setDistributorsList(data);
        if (!selectedDistributor) {
          setSelectedDistributor(data[0]);
        }
      }
    });
  }, []);

  const filteredDistributors = useMemo(() => {
    let list = distributorsList.filter(d => {
      const matchProvince = selectedProvince === 'Todas' || d.province.toLowerCase() === selectedProvince.toLowerCase();
      const matchQuery =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProvince && matchQuery;
    });

    if (gpsActive) {
      list.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return list;
  }, [selectedProvince, searchQuery, distributorsList, gpsActive]);

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      console.error('Geolocalización no soportada');
      setFindingNearest(false);
      return;
    }

    setFindingNearest(true);

    const timeoutId = setTimeout(() => {
      setFindingNearest(false);
      console.error('Geolocalización timeout');
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        const R = 6371; // km

        const updatedList = distributorsList.map(dist => {
          const dLat = (dist.latitude - latitude) * Math.PI / 180;
          const dLon = (dist.longitude - longitude) * Math.PI / 180;
          const lat1 = latitude * Math.PI / 180;
          const lat2 = dist.latitude * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c;
          return { ...dist, distance: d };
        });

        updatedList.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

        setDistributorsList(updatedList);
        setSelectedProvince('Todas');
        setSearchQuery('');
        setSelectedDistributor(updatedList[0]);
        setGpsActive(true);
        setFindingNearest(false);

        // Auto scroll to map on mobile
        if (window.innerWidth < 1024 && mapRef.current) {
          mapRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        setFindingNearest(false);

        const errorMessages: { [key: number]: string } = {
          1: '🚫 Permiso DENEGADO. Por favor, permite acceso a ubicación en los settings del navegador.',
          2: '📍 Ubicación NO DISPONIBLE. Intenta de nuevo.',
          3: '⏱️ Timeout. Intenta de nuevo.'
        };

        const errorCode = (error as any)?.code || 0;
        const errorMsg = errorMessages[errorCode] || `⚠️ Error desconocido: ${JSON.stringify(error)}`;

        console.error(`Geolocalización Error (${errorCode}):`, errorMsg, error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleCardClick = (dist: DistributorLocation) => {
    setSelectedDistributor(dist);
    if (window.innerWidth < 1024 && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen pt-20 lg:pt-20 pb-20 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Premium Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-primary-900/5 to-transparent' : 'bg-gradient-to-b from-primary-50 to-white'}`} />
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[100px] ${isDark ? 'bg-primary-600/5' : 'bg-primary-400/8'}`} />
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] ${isDark ? 'bg-blue-600/5' : 'bg-blue-400/5'}`} />
      </div>

      <div className="container-max relative z-10">

        {/* HEADER SECTION — Premium Typography + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12"
        >
          {/* Title + Description */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="flex items-center gap-2.5 mb-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border ${
                isDark
                  ? 'bg-primary-600/15 border-primary-500/30 text-primary-400'
                  : 'bg-primary-100/60 border-primary-300/40 text-primary-700'
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                Puntos de Venta Oficial
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6 }}
              className={`text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.0] mb-4 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Encuentra tu
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Agencia Maresa
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.24 }}
              className={`text-lg max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              Distribuidor oficial en 24 provincias del Ecuador • Garantía hasta 36 meses • Soporte técnico profesional • Reciclaje ecológico -$10
            </motion.p>
          </div>

          {/* GPS Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            onClick={handleFindNearest}
            disabled={findingNearest}
            className={`py-4 px-7 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all duration-200 ease-out active:scale-[0.97] shrink-0 whitespace-nowrap ${
              findingNearest ? 'opacity-70 cursor-wait' : ''
            } ${
              isDark
                ? 'bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]'
                : 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.3)]'
            }`}
          >
            <Crosshair className={`w-5 h-5 ${findingNearest ? 'animate-spin' : ''}`} />
            {findingNearest ? 'Buscando...' : 'Cercana (GPS)'}
          </motion.button>
        </motion.div>

        {/* CONTROLS SECTION — Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className={`mb-8 p-5 rounded-2xl backdrop-blur-xl border ${
            isDark
              ? 'bg-slate-900/40 border-slate-800/40'
              : 'bg-white/40 border-slate-200/40'
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Province Select */}
            <div className="flex-1">
              <select
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setGpsActive(false); }}
                className={`w-full py-3 px-4 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer backdrop-blur-sm ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-700/50 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30'
                    : 'bg-white/50 border-slate-200/50 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'
                }`}
              >
                <option value="Todas">Todas las provincias</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 opacity-50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Busca ciudad, barrio o agencia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all backdrop-blur-sm ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30'
                    : 'bg-white/50 border-slate-200/50 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* MAIN LAYOUT — Map + List Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`rounded-3xl border flex flex-col lg:flex-row overflow-hidden min-h-[600px] lg:h-[550px] shadow-2xl backdrop-blur-xl transition-all ${
            isDark
              ? 'bg-slate-900/50 border-slate-800/60 shadow-[0_0_60px_rgba(0,0,0,0.4)]'
              : 'bg-white/50 border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)]'
          }`}
        >

          {/* LIST SIDEBAR — Agencias Cards */}
          <div className={`w-full lg:w-[420px] flex flex-col h-[300px] lg:h-full border-b lg:border-b-0 lg:border-r overflow-hidden ${
            isDark ? 'border-slate-800/40' : 'border-slate-200/40'
          }`}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`px-6 py-4 border-b backdrop-blur-sm flex items-center justify-between ${
                isDark
                  ? 'border-slate-800/40 bg-slate-900/20 text-slate-300'
                  : 'border-slate-200/40 bg-white/20 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  isDark
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {filteredDistributors.length}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Agencias</span>
              </div>
              {gpsActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 text-emerald-500 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  Cerca a ti
                </motion.div>
              )}
            </motion.div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredDistributors.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-8 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
                  >
                    No se encontraron agencias.
                  </motion.div>
                ) : (
                  filteredDistributors.map((dist, idx) => {
                    const isSelected = selectedDistributor?.id === dist.id;
                    return (
                      <motion.div
                        key={dist.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        onClick={() => handleCardClick(dist)}
                        className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 group overflow-hidden ${
                          isSelected
                            ? isDark
                              ? 'bg-gradient-to-br from-primary-600/20 to-primary-700/15 border-primary-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                              : 'bg-gradient-to-br from-primary-100/60 to-primary-50/40 border-primary-400/60 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                            : isDark
                              ? 'bg-slate-800/20 border-slate-700/30 hover:bg-slate-800/35'
                              : 'bg-white/30 border-slate-200/30 hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Hover Gradient Overlay */}
                        {!isSelected && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary-500/5 to-transparent" />
                        )}

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className={`font-extrabold text-sm leading-tight flex-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                              {dist.name}
                            </h3>
                            {dist.distance !== undefined && (
                              <motion.span
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${
                                  dist.distance < 2
                                    ? isDark
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-emerald-100 text-emerald-700'
                                    : isDark
                                      ? 'bg-primary-500/20 text-primary-400'
                                      : 'bg-primary-100 text-primary-700'
                                }`}
                              >
                                {dist.distance < 1 ? '< 1 km' : `${dist.distance.toFixed(1)} km`}
                              </motion.span>
                            )}
                          </div>

                          <p className={`text-xs flex items-start gap-2 line-clamp-2 mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary-500 mt-0.5" />
                            <span>{dist.address}</span>
                          </p>

                          {/* Action Buttons */}
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: isSelected ? 'auto' : 0, opacity: isSelected ? 1 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden pt-3 border-t"
                            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                          >
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://wa.me/${dist.whatsapp}?text=Hola%20${encodeURIComponent(dist.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-md"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${dist.latitude},${dist.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all active:scale-[0.97] ${
                                  isDark
                                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-slate-600/30'
                                    : 'bg-slate-100/50 hover:bg-slate-200/50 text-slate-800 border-slate-200/50'
                                }`}
                              >
                                <Navigation className="w-3.5 h-3.5" />
                                Ir
                              </a>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MAP AREA — MAGNIFICENT DESIGN */}
          <div
            ref={mapRef}
            className="flex-1 relative h-[300px] lg:h-full bg-gradient-to-br from-slate-200/80 via-slate-100/60 to-slate-200/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 overflow-hidden"
            onClick={() => setIsMapInteractive(true)}
            onMouseLeave={() => setIsMapInteractive(false)}
          >
            {selectedDistributor ? (
              <>
                {/* Overlay Hint */}
                <AnimatePresence>
                  {!isMapInteractive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-black/20 to-transparent backdrop-blur-md pointer-events-none"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`rounded-2xl px-6 py-4 flex items-center gap-3 font-bold text-sm shadow-2xl border ${
                          isDark
                            ? 'bg-slate-950/80 text-white border-white/20'
                            : 'bg-white/80 text-slate-900 border-slate-200/40'
                        }`}
                      >
                        <MousePointerClick className="w-4 h-4" />
                        Toca para navegar el mapa
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* iFrame Map */}
                <iframe
                  title={`Mapa de ${selectedDistributor.name}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedDistributor.longitude - 0.015}%2C${selectedDistributor.latitude - 0.01}%2C${selectedDistributor.longitude + 0.015}%2C${selectedDistributor.latitude + 0.01}&layer=mapnik&marker=${selectedDistributor.latitude}%2C${selectedDistributor.longitude}`}
                  className={`w-full h-full transition-all ${!isMapInteractive ? 'pointer-events-none' : ''}`}
                />

                {/* Google Maps CTA Button */}
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDistributor.latitude},${selectedDistributor.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`absolute bottom-6 right-6 z-30 px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all active:scale-[0.97] border shadow-lg ${
                    isDark
                      ? 'bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
                  }`}
                >
                  <Navigation className="w-5 h-5 text-primary-600" />
                  <span>Google Maps</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </motion.a>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Cargando mapa...
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* INFO BANNER — Trust & Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={`mt-8 p-6 rounded-2xl backdrop-blur-xl border ${
            isDark
              ? 'bg-gradient-to-r from-primary-900/20 to-blue-900/10 border-primary-800/30'
              : 'bg-gradient-to-r from-primary-50/60 to-blue-50/40 border-primary-200/40'
          }`}
        >
          <div className="flex items-start gap-4 flex-col md:flex-row md:items-center">
            <div className={`px-3.5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 ${
              isDark
                ? 'bg-primary-600/20 text-primary-400'
                : 'bg-primary-100 text-primary-700'
            }`}>
              <Zap className="w-4 h-4" />
              Garantizado
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-950'}>Corporación Maresa:</strong> Distribuidor oficial con garantía de hasta 36 meses. Reciclaje ecológico -$10. Soporte técnico en 24 provincias.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
