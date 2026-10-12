'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
import {
  MapPin, Search, Navigation, Phone,
  MessageCircle, Crosshair, ChevronRight, Zap,
  Building2, Clock, CheckCircle2, RotateCcw,
  Sparkles, Compass, ArrowRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { provinces } from '@/data/provinces';
import { DistributorLocation } from '@/types/sinergia';
import { defaultDistributors } from '@/data/sinergiaData';
import { getDistributors } from '@/lib/firebaseStore';

// Cargar Google Maps oficial de forma dinámica
const PremiumMap = dynamic(() => import('@/components/PremiumMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-300 gap-3">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="text-xs font-bold">Cargando Google Maps oficial...</span>
    </div>
  ),
});

export default function AgenciasClient() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [distributorsList, setDistributorsList] = useState<(DistributorLocation & { distance?: number })[]>(defaultDistributors);
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistributor, setSelectedDistributor] = useState<(DistributorLocation & { distance?: number }) | null>(defaultDistributors[0] || null);
  const [findingNearest, setFindingNearest] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const requestedProvince = new URLSearchParams(window.location.search).get('provincia');
    if (requestedProvince && provinces.some((p) => p.name.toLowerCase() === requestedProvince.toLowerCase())) {
      const matched = provinces.find(p => p.name.toLowerCase() === requestedProvince.toLowerCase());
      if (matched) setSelectedProvince(matched.name);
    }
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
    const query = searchQuery.trim().toLowerCase();
    let list = distributorsList.filter(d => {
      const matchProvince = selectedProvince === 'Todas' || d.province.toLowerCase() === selectedProvince.toLowerCase();
      const matchQuery =
        !query ||
        d.name.toLowerCase().includes(query) ||
        d.city.toLowerCase().includes(query) ||
        d.address.toLowerCase().includes(query);
      return matchProvince && matchQuery;
    });

    if (gpsActive) {
      list.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return list;
  }, [selectedProvince, searchQuery, distributorsList, gpsActive]);

  // Mantener sincronizada la agencia activa
  useEffect(() => {
    if (filteredDistributors.length > 0) {
      const exists = selectedDistributor && filteredDistributors.some(d => d.id === selectedDistributor.id);
      if (!exists) {
        setSelectedDistributor(filteredDistributors[0]);
      }
    }
  }, [filteredDistributors, selectedDistributor]);

  // Manejador del botón GPS: calcula, ordena y envía directamente al mapa
  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en este navegador.');
      return;
    }

    setFindingNearest(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
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

        // Envía directamente al mapa
        setMobileView('map');
        setTimeout(() => {
          if (mapContainerRef.current) {
            mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },
      (error) => {
        setFindingNearest(false);
        console.warn('GPS notice:', error.message);
        // Fallback: enfocar la matriz principal en mapa
        setSelectedDistributor(distributorsList[0]);
        setMobileView('map');
        if (mapContainerRef.current) {
          mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectAgency = (dist: DistributorLocation) => {
    setSelectedDistributor(dist);
    // En móviles (pantallas < 1024px), conmuta automáticamente a la vista de mapa y hace scroll
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileView('map');
      setTimeout(() => {
        if (mapContainerRef.current) {
          mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleOpenMapForAgency = (dist: DistributorLocation) => {
    setSelectedDistributor(dist);
    setMobileView('map');
    setTimeout(() => {
      if (mapContainerRef.current) {
        mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen pt-20 lg:pt-24 pb-20 transition-colors duration-300 ${
      isDark 
        ? 'bg-[#060e1a] text-white selection:bg-blue-600 selection:text-white' 
        : 'bg-[#f4f7fb] text-slate-900 selection:bg-blue-600 selection:text-white'
    }`}>
      <div className="container-max relative z-10 px-4 sm:px-6">

        {/* HEADER SECTION — Corporación Maresa Oficial */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                Red Oficial Corporación Maresa
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                32 Puntos en 24 Provincias
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Agencias y Talleres Oficiales Maresa
            </h1>

            <p className={`mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Ubica tu punto más cercano con diagnóstico computarizado gratuito, reemplazo express de batería y garantía nacional directa.
            </p>
          </div>

          {/* BOTÓN GPS PRINCIPAL: Carga y envía directamente al mapa con feedback háptico active:scale-95 */}
          <button
            type="button"
            onClick={handleFindNearest}
            disabled={findingNearest}
            className={`w-full sm:w-auto py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shrink-0 shadow-lg cursor-pointer ${
              findingNearest
                ? 'bg-blue-700 text-white opacity-85'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 border border-blue-400/20'
            }`}
          >
            {findingNearest ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Calculando ubicación y abriendo mapa...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Agencia más cercana (GPS) • Ver en Mapa</span>
              </>
            )}
          </button>
        </div>

        {/* FILTROS Y BUSCADOR COMPACTOS CON ESTILO MARESA */}
        <div className={`mb-5 p-3.5 sm:p-4 rounded-2xl border shadow-sm backdrop-blur-xl transition-all duration-300 ${
          isDark 
            ? 'bg-[#0b192c]/80 border-blue-900/30 shadow-black/30' 
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Province Select */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1 text-slate-500 dark:text-blue-300/80">
                Filtrar por Provincia
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setGpsActive(false); }}
                className={`w-full py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#071326] border-blue-900/40 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'
                }`}
              >
                <option value="Todas">Todas las 24 provincias ({distributorsList.length} agencias)</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1 text-slate-500 dark:text-blue-300/80">
                Búsqueda por Nombre o Ciudad
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Carcelén, Amazonas, Cumbayá, Cuenca, Samborondón..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    isDark
                      ? 'bg-[#071326] border-blue-900/40 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SELECTOR DE VISTA EN CELULAR (TABS ELEGANTES CON COLORES MARESA) */}
        <div className="flex lg:hidden items-center p-1 rounded-2xl bg-slate-200 dark:bg-[#071326] border border-slate-300 dark:border-blue-900/40 mb-4 sticky top-16 z-30 shadow-md">
          <button
            type="button"
            onClick={() => setMobileView('map')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileView === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-700 dark:text-slate-400 hover:text-blue-600'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>🗺️ Mapa Google Oficial</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileView === 'list'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-700 dark:text-slate-400 hover:text-blue-600'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>📋 Directorio ({filteredDistributors.length})</span>
          </button>
        </div>

        {/* LAYOUT PRINCIPAL: Split Desktop / Adaptativo Móvil */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* LISTA DE AGENCIAS (Columna Izquierda con altura exacta para 3 tarjetas) */}
          <div className={`w-full lg:w-[440px] flex-shrink-0 ${
            mobileView === 'map' ? 'hidden lg:block' : 'block'
          }`}>
            <div className={`rounded-2xl border p-3.5 shadow-sm transition-all duration-300 ${
              isDark 
                ? 'bg-[#0b192c]/90 border-blue-900/30 shadow-black/40' 
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}>
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 dark:border-blue-900/30">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Agencias Maresa ({filteredDistributors.length})
                </span>
                {gpsActive && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Crosshair className="w-3 h-3" />
                    Por cercanía GPS
                  </span>
                )}
              </div>

              {/* Contenedor de Tarjetas Compactas: Altura calibrada a ~440px para 3 tarjetas visibles */}
              <div className="space-y-2.5 max-h-none lg:h-[440px] lg:overflow-y-auto pr-1 select-none scrollbar-thin">
                {filteredDistributors.length === 0 ? (
                  <div className="p-8 text-center">
                    <MapPin className="w-9 h-9 text-slate-400 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-sm mb-1">No hay agencias con este filtro</p>
                    <p className="text-xs text-slate-500 mb-4">Corporación Maresa tiene cobertura en todo el Ecuador.</p>
                    <button
                      type="button"
                      onClick={() => { setSelectedProvince('Todas'); setSearchQuery(''); setGpsActive(false); }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      Ver todas las 32 agencias Maresa
                    </button>
                  </div>
                ) : (
                  filteredDistributors.map((dist) => {
                    const isSelected = selectedDistributor?.id === dist.id;
                    return (
                      <div
                        key={dist.id}
                        onClick={() => handleSelectAgency(dist)}
                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-blue-950/70 border-blue-500 shadow-md shadow-blue-950/60 ring-1 ring-blue-500/50'
                              : 'bg-blue-50/90 border-blue-600 shadow-sm ring-1 ring-blue-600/30'
                            : isDark
                              ? 'bg-[#0f233d]/50 border-blue-950/60 hover:border-blue-700/50 hover:bg-[#132c4c]/60'
                              : 'bg-slate-50/80 border-slate-200 hover:border-blue-300 hover:bg-white'
                        }`}
                      >
                        {/* Cabecera de la Tarjeta */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block truncate">
                              {dist.province} • {dist.city}
                            </span>
                            <h3 className={`text-xs sm:text-sm font-black leading-tight mt-0.5 truncate ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                              {dist.name}
                            </h3>
                          </div>
                          {dist.distance !== undefined && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20">
                              {dist.distance < 1 ? '< 1 km' : `${dist.distance.toFixed(1)} km`}
                            </span>
                          )}
                        </div>

                        {/* Solo Horario de Atención (Sin Dirección duplicada) */}
                        <p className={`text-[11px] flex items-center gap-1.5 mb-2.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{dist.schedule}</span>
                        </p>

                        {/* Botones de Acción Compactos */}
                        <div className="flex items-center gap-2 pt-1.5 border-t border-slate-200/80 dark:border-blue-900/30">
                          {dist.whatsapp && (
                            <a
                              href={`https://wa.me/${dist.whatsapp}?text=Hola%20Corporación%20Maresa%2C%20deseo%20consultar%20baterías%20en%20la%20agencia%20${encodeURIComponent(dist.name)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenMapForAgency(dist);
                            }}
                            className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                          >
                            <MapPin className="w-3 h-3 text-amber-300" />
                            <span>Ver en Mapa</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* MAPA OFICIAL GOOGLE MAPS (Columna Derecha: altura calibrada exacta a ~440px) */}
          <div 
            ref={mapContainerRef}
            className={`w-full flex-1 ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className={`rounded-2xl border overflow-hidden shadow-xl sticky top-20 transition-all duration-300 ${
              isDark 
                ? 'bg-[#0b192c] border-blue-900/30' 
                : 'bg-white border-slate-200'
            }`}>
              
              {/* Tarjeta de Agencia Seleccionada sobre el Mapa */}
              {selectedDistributor && (
                <div className={`px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isDark ? 'bg-[#071326] border-blue-900/30 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                        {selectedDistributor.province} • {selectedDistributor.city}
                      </span>
                      {selectedDistributor.distance !== undefined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {selectedDistributor.distance < 1 ? '< 1 km' : `A ${selectedDistributor.distance.toFixed(1)} km`}
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm sm:text-base leading-tight truncate">
                      {selectedDistributor.name}
                    </h3>
                    <p className={`text-xs mt-0.5 flex items-start gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{selectedDistributor.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedDistributor.whatsapp && (
                      <a
                        href={`https://wa.me/${selectedDistributor.whatsapp}?text=Hola%20Corporación%20Maresa%2C%20deseo%20consultar%20disponibilidad%20en%20la%20agencia%20${encodeURIComponent(selectedDistributor.name)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        title="Chat de WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDistributor.latitude},${selectedDistributor.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 active:scale-95 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-amber-300" />
                      <span>Cómo llegar (GPS)</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Contenedor del Mapa Oficial de Google Maps: Altura compacta calibrada a 440px para igualar exactamente las 3 tarjetas de la izquierda */}
              <div className="h-[360px] sm:h-[400px] lg:h-[440px] w-full relative bg-slate-900">
                {selectedDistributor ? (
                  <PremiumMap
                    latitude={selectedDistributor.latitude}
                    longitude={selectedDistributor.longitude}
                    agencyName={selectedDistributor.name}
                  mapsIframe={selectedDistributor.mapsIframe}
                    address={selectedDistributor.address}
                    isDark={isDark}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Selecciona una agencia para ver el mapa
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
