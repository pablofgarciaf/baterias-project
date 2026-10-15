// estado: ""
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
import {
  MapPin, Search, Navigation,
  MessageCircle, Crosshair,
  Building2, Clock, CheckCircle2,
  ArrowRight, Loader2
} from 'lucide-react';
import { provinces } from '@/data/provinces';
import { DistributorLocation } from '@/types/sinergia';
import { getDistributors } from '@/lib/firebaseStore';
import type { MapLocation } from '@/components/PremiumMap';

// Carga diferida del mapa interactivo con marcadores de los puntos disponibles.
const PremiumMap = dynamic(() => import('@/components/PremiumMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-300 gap-3">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    <span className="text-xs font-bold">Cargando mapa de locales...</span>
    </div>
  ),
});

// Direcciones publicadas en el directorio de Maresa Parts (consulta: 2026-10-14).
const officialMaresaLocations = [
  { name: 'Maresa Center Carlos Julio Arosemena', city: 'Guayaquil', address: 'Av. Carlos Julio Arosemena Tola Km 2 1/2, junto a la gasolinera Primax', latitude: -2.1745, longitude: -79.9185 },
  { name: 'Maresa Center Juan Tanca Marengo', city: 'Guayaquil', address: 'Av. Juan Tanca Marengo Km 1 1/2, diagonal al Mall del Sol', latitude: -2.1532, longitude: -79.8917 },
  { name: 'Maresa Center Express Granados', city: 'Quito', address: 'Av. de los Granados E11-67 y de las Hiedras, esquina', latitude: -0.1682, longitude: -78.4739 },
  { name: 'Maresa Center Granados', city: 'Quito', address: 'E11-124 y Av. 6 de Diciembre, frente a Corporación Maresa', latitude: -0.1742, longitude: -78.4768 },
  { name: 'Maresa Center Valle de los Chillos', city: 'Quito', address: 'Av. Gral. Rumiñahui y Giovanni Farina', latitude: -0.3118, longitude: -78.4524 },
  { name: 'Maresa Center Manta', city: 'Manta', address: 'Av. 113 Calle 199 N1114', latitude: -0.9537, longitude: -80.7089 },
];
const fallbackMapLocations: MapLocation[] = officialMaresaLocations.map((location) => ({
  id: location.name,
  ...location,
}));

export default function AgenciasClient() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [distributorsList, setDistributorsList] = useState<(DistributorLocation & { distance?: number })[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistributor, setSelectedDistributor] = useState<(DistributorLocation & { distance?: number }) | null>(null);
  const [findingNearest, setFindingNearest] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [gpsActive, setGpsActive] = useState(false);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [fallbackSelected, setFallbackSelected] = useState<(typeof officialMaresaLocations)[number] | null>(null);
  const [nearestLocation, setNearestLocation] = useState<{ name: string; city: string; address: string; latitude: number; longitude: number; distance: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const requestedProvince = new URLSearchParams(window.location.search).get('provincia');
    if (requestedProvince && provinces.some((p) => p.name.toLowerCase() === requestedProvince.toLowerCase())) {
      const matched = provinces.find(p => p.name.toLowerCase() === requestedProvince.toLowerCase());
      if (matched) setSelectedProvince(matched.name);
    }
    getDistributors().then(data => {
      setDistributorsList(data);
    }).finally(() => setLocationsLoading(false));
  }, []);

  const filteredDistributors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = distributorsList.filter(d => {
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
  const distributorMapLocations = useMemo(() => filteredDistributors.map((location) => ({
    id: location.id,
    name: location.name,
    city: location.city,
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
  })), [filteredDistributors]);

  // Mantener sincronizada la agencia activa
  useEffect(() => {
    if (filteredDistributors.length > 0) {
      const exists = selectedDistributor && filteredDistributors.some(d => d.id === selectedDistributor.id);
      if (selectedDistributor && !exists) {
        setSelectedDistributor(filteredDistributors[0]);
      }
    } else if (selectedDistributor) {
      setSelectedDistributor(null);
    }
  }, [filteredDistributors, selectedDistributor]);

  // Manejador del botón GPS: calcula, ordena y envía directamente al mapa
  const handleFindNearest = () => {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('Este navegador no permite compartir la ubicación. Elige un local del directorio.');
      return;
    }

    setFindingNearest(true);

    if (distributorsList.length === 0) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const nearest = officialMaresaLocations
            .map((location) => {
              const radians = Math.PI / 180;
              const dLat = (location.latitude - coords.latitude) * radians;
              const dLon = (location.longitude - coords.longitude) * radians;
              const a = Math.sin(dLat / 2) ** 2 + Math.cos(coords.latitude * radians) * Math.cos(location.latitude * radians) * Math.sin(dLon / 2) ** 2;
              return { ...location, distance: 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) };
            })
            .sort((a, b) => a.distance - b.distance)[0];
          if (nearest) {
            setFallbackSelected(nearest);
            setNearestLocation({
              name: nearest.name,
              city: nearest.city,
              address: nearest.address,
              latitude: nearest.latitude,
              longitude: nearest.longitude,
              distance: nearest.distance,
            });
            window.setTimeout(() => mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
          } else {
            setNearestLocation(null);
          }
          setFindingNearest(false);
        },
        (error) => {
          setGpsError(error.code === error.PERMISSION_DENIED
            ? 'No autorizaste el acceso a tu ubicación. Elige un local del directorio; no te enviaremos a una ciudad por defecto.'
            : 'No pudimos obtener tu ubicación. Elige un local del directorio e inténtalo de nuevo si quieres usar el GPS.');
          setFindingNearest(false);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
      return;
    }

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
        setGpsError(error.code === error.PERMISSION_DENIED
          ? 'No autorizaste el acceso a tu ubicación. Elige un local del directorio; no te enviaremos a una ciudad por defecto.'
          : 'No pudimos obtener tu ubicación. Elige un local del directorio e inténtalo de nuevo si quieres usar el GPS.');
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

  if (!locationsLoading && distributorsList.length === 0) {
    return (
      <main className={`min-h-screen py-16 sm:py-20 ${isDark ? 'bg-primary-950 text-white' : 'bg-[#f6f6f4] text-primary-950'}`}>
        <div className="container-max">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary-600">Encuentra un local</p>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">Locales publicados por Maresa</h1>
          <p className={`mt-4 max-w-2xl text-base leading-relaxed ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
            Consulta la dirección que te resulte más conveniente y pregunta directamente al local por la disponibilidad de baterías.
          </p>
          <button type="button" onClick={handleFindNearest} disabled={findingNearest} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-secondary-500 px-5 font-bold text-primary-950 transition-colors hover:bg-secondary-400 disabled:opacity-60">
            <Crosshair className="h-4 w-4" />{findingNearest ? 'Buscando ubicación…' : 'Encontrar local más cercano'}
          </button>
          {gpsError && <p role="alert" className={`mt-3 max-w-2xl text-sm ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>{gpsError}</p>}
          {nearestLocation && (
            <div role="status" className={`mt-4 rounded-xl border p-4 text-sm ${isDark ? 'border-primary-700 bg-primary-900' : 'border-primary-200 bg-white'}`}>
              <p className="font-bold">Local estimado más cercano: {nearestLocation.name}, {nearestLocation.city}</p>
              <p className="mt-1">Aproximadamente {Math.round(nearestLocation.distance)} km en línea recta. Confirma la dirección antes de salir.</p>
              <a className="mt-2 inline-flex items-center gap-2 font-bold text-secondary-700 underline" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${nearestLocation.address}, ${nearestLocation.city}, Ecuador`)}`} target="_blank" rel="noopener noreferrer">Ver ruta al local <ArrowRight className="h-4 w-4" /></a>
            </div>
          )}
          <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]">
            <div className="order-2 grid gap-4 sm:grid-cols-2 xl:order-1">
              {officialMaresaLocations.map((location) => {
                const isSelected = fallbackSelected?.name === location.name;
                return (
                  <article key={location.name} className={`flex h-full flex-col rounded-2xl border p-5 transition-shadow ${isDark ? 'border-primary-700 bg-primary-900' : 'border-slate-200 bg-white shadow-sm'} ${isSelected ? 'ring-2 ring-secondary-500/60' : ''}`}>
                    <span className="text-xs font-bold uppercase tracking-wide text-secondary-600">{location.city}</span>
                    <h2 className="mt-2 text-lg font-bold">{location.name}</h2>
                    <p className={`mt-3 flex items-start gap-2 text-sm leading-relaxed ${isDark ? 'text-primary-200' : 'text-primary-600'}`}><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500" />{location.address}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                      <button type="button" onClick={() => { setFallbackSelected(location); window.setTimeout(() => mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); }} aria-pressed={isSelected} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-secondary-700 hover:underline"><MapPin className="h-4 w-4" />Ver en mapa</button>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.address}, ${location.city}, Ecuador`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-secondary-700 hover:underline">Cómo llegar <ArrowRight className="h-4 w-4" /></a>
                    </div>
                  </article>
                );
              })}
            </div>
            <section ref={mapContainerRef} aria-label="Mapa de puntos de atención" className={`order-1 scroll-mt-24 overflow-hidden rounded-2xl border shadow-lg xl:order-2 ${isDark ? 'border-primary-700 bg-primary-900' : 'border-slate-200 bg-white'}`}>
              <div className={`border-b px-5 py-4 ${isDark ? 'border-primary-700' : 'border-slate-200'}`}>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-700">Mapa de atención</span>
                <h2 className="mt-1 text-lg font-extrabold">{fallbackSelected?.name || 'Locales de atención publicados'}</h2>
                <p className={`mt-1 text-sm ${isDark ? 'text-primary-200' : 'text-slate-600'}`}>{fallbackSelected ? fallbackSelected.address : 'Selecciona un marcador o un local para ver su ubicación aproximada y cómo llegar.'}</p>
              </div>
              <div className="h-[360px] sm:h-[440px]">
                <PremiumMap
                  locations={fallbackMapLocations}
                  selectedLocationId={fallbackSelected?.name ?? null}
                  agencyName="Mapa de puntos de atención publicados por Maresa"
                  isDark={isDark}
                  onSelectLocation={(id) => setFallbackSelected(officialMaresaLocations.find((location) => location.name === id) ?? null)}
                />
              </div>
              <p className={`border-t px-5 py-3 text-xs ${isDark ? 'border-primary-700 text-primary-300' : 'border-slate-200 text-slate-500'}`}>Los marcadores son referenciales; usa la dirección publicada para confirmar el destino.</p>
            </section>
          </div>
          <a href="https://maresapartsb2c.corpmaresa.com.ec/locales" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-secondary-600 underline underline-offset-4">Consultar el directorio completo de Maresa <ArrowRight className="h-4 w-4" /></a>
        </div>
      </main>
    );
  }

  return (
    <div className={`min-h-screen pt-20 lg:pt-24 pb-20 transition-colors duration-300 ${
      isDark
        ? 'bg-[#191919] text-white selection:bg-primary-600 selection:text-white'
        : 'bg-[#f6f6f4] text-slate-900 selection:bg-primary-600 selection:text-white'
    }`}>
      <div className="container-max relative z-10 px-4 sm:px-6">

        {/* HEADER SECTION — Corporación Maresa Oficial */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-primary-600/15 text-primary-600 dark:text-primary-400 border border-primary-500/30 flex items-center gap-1.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-warning-500" />
                Consulta puntos de atención
              </span>
              <span className={`text-xs font-black flex items-center gap-1 ${distributorsList.length > 0 ? 'text-success-600 dark:text-success-400' : 'text-accent-600 dark:text-accent-300'}`}>
                {distributorsList.length > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                {distributorsList.length} puntos publicados
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Puntos de atención
            </h1>

            <p className={`mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Consulta las ubicaciones publicadas y confirma horarios y servicios antes de desplazarte.
            </p>
          </div>

          {/* BOTÓN GPS PRINCIPAL: Carga y envía directamente al mapa con feedback háptico active:scale-95 */}
            <button
            type="button"
            onClick={handleFindNearest}
            disabled={findingNearest}
            className={`w-full sm:w-auto py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all duration-200 shrink-0 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60 ${
              findingNearest
                ? 'bg-secondary-600 text-primary-950 opacity-85'
                : 'bg-secondary-500 hover:bg-secondary-400 text-primary-950 shadow-lg shadow-secondary-600/25 border border-secondary-400/20'
            }`}
          >
            {findingNearest ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-warning-300" />
                <span>Calculando ubicación y abriendo mapa...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4 text-warning-400 animate-pulse" />
                <span>Agencia más cercana (GPS) • Ver en Mapa</span>
              </>
            )}
          </button>
          {gpsError && <p role="alert" className={`mt-3 max-w-2xl text-sm ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>{gpsError}</p>}
        </div>

        {/* FILTROS Y BUSCADOR COMPACTOS CON ESTILO MARESA */}
        <div className={`mb-5 p-3.5 sm:p-4 rounded-2xl border shadow-sm backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? 'bg-[#252524]/80 border-primary-900/30 shadow-black/30'
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Province Select */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1 text-slate-500 dark:text-primary-300/80">
                Filtrar por Provincia
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setGpsActive(false); }}
                className={`w-full py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#1e1e1d] border-primary-900/40 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500/40'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30'
                }`}
              >
                <option value="Todas">Todas las provincias ({distributorsList.length} puntos)</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1 text-slate-500 dark:text-primary-300/80">
                <span id="agency-search-label">Búsqueda por nombre o ciudad</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  aria-labelledby="agency-search-label"
                  placeholder="Nombre o ciudad"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    isDark
                      ? 'bg-[#1e1e1d] border-primary-900/40 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/40'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SELECTOR DE VISTA EN CELULAR (TABS ELEGANTES CON COLORES MARESA) */}
        <div className="flex lg:hidden items-center p-1 rounded-2xl bg-slate-200 dark:bg-[#1e1e1d] border border-slate-300 dark:border-primary-900/40 mb-4 sticky top-16 z-30 shadow-md">
          <button
            type="button"
            onClick={() => setMobileView('map')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileView === 'map'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                : 'text-slate-700 dark:text-slate-400 hover:text-primary-600'
            }`}
          >
            <MapPin className="w-4 h-4 text-warning-400" />
            <span>Mapa</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileView === 'list'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                : 'text-slate-700 dark:text-slate-400 hover:text-primary-600'
            }`}
          >
            <Building2 className="w-4 h-4 text-warning-400" />
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
                ? 'bg-[#252524]/90 border-primary-900/30 shadow-black/40'
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}>
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 dark:border-primary-900/30">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                  Puntos disponibles ({filteredDistributors.length})
                </span>
                {gpsActive && (
                  <span className="text-[11px] font-bold text-success-600 dark:text-success-400 flex items-center gap-1">
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
                    <p className="font-bold text-sm mb-1">{distributorsList.length === 0 ? 'Aún no hay puntos de atención publicados' : 'No hay puntos con este filtro'}</p>
                    <p className="text-xs text-slate-500 mb-4">{distributorsList.length === 0 ? 'Estamos verificando direcciones, contactos y horarios antes de mostrarlos.' : 'Prueba otra provincia o búsqueda.'}</p>
                    <button
                      type="button"
                      onClick={() => { setSelectedProvince('Todas'); setSearchQuery(''); setGpsActive(false); }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      Limpiar filtros
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
                              ? 'bg-primary-950/70 border-primary-500 shadow-md shadow-primary-950/60 ring-1 ring-primary-500/50'
                              : 'bg-primary-50/90 border-primary-600 shadow-sm ring-1 ring-primary-600/30'
                            : isDark
                              ? 'bg-[#30302e]/50 border-primary-950/60 hover:border-primary-700/50 hover:bg-[#41413e]/60'
                              : 'bg-slate-50/80 border-slate-200 hover:border-primary-300 hover:bg-white'
                        }`}
                      >
                        {/* Cabecera de la Tarjeta */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block truncate">
                              {dist.province} • {dist.city}
                            </span>
                            <h3 className={`text-xs sm:text-sm font-black leading-tight mt-0.5 truncate ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                              {dist.name}
                            </h3>
                          </div>
                          {dist.distance !== undefined && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-success-500/15 text-success-600 dark:text-success-400 shrink-0 border border-success-500/20">
                              {dist.distance < 1 ? '< 1 km' : `${dist.distance.toFixed(1)} km`}
                            </span>
                          )}
                        </div>

                        {/* Solo Horario de Atención (Sin Dirección duplicada) */}
                        <p className={`text-[11px] flex items-center gap-1.5 mb-2.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Clock className="w-3 h-3 text-warning-500 shrink-0" />
                          <span className="truncate">{dist.schedule}</span>
                        </p>

                        {/* Botones de Acción Compactos */}
                        <div className="flex items-center gap-2 pt-1.5 border-t border-slate-200/80 dark:border-primary-900/30">
                          {dist.whatsapp && (
                            <a
                              href={`https://wa.me/${dist.whatsapp}?text=Hola%2C%20deseo%20consultar%20bater%C3%ADas%20en%20${encodeURIComponent(dist.name)}.`}
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
                            className="flex-1 py-1.5 px-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                          >
                            <MapPin className="w-3 h-3 text-warning-300" />
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
                ? 'bg-[#252524] border-primary-900/30'
                : 'bg-white border-slate-200'
            }`}>

              {/* Tarjeta de Agencia Seleccionada sobre el Mapa */}
              {selectedDistributor && (
                <div className={`px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isDark ? 'bg-[#1e1e1d] border-primary-900/30 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-500 dark:text-primary-400">
                        {selectedDistributor.province} • {selectedDistributor.city}
                      </span>
                      {selectedDistributor.distance !== undefined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-500/15 text-success-600 dark:text-success-400 border border-success-500/20">
                          {selectedDistributor.distance < 1 ? '< 1 km' : `A ${selectedDistributor.distance.toFixed(1)} km`}
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm sm:text-base leading-tight truncate">
                      {selectedDistributor.name}
                    </h3>
                    <p className={`text-xs mt-0.5 flex items-start gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{selectedDistributor.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedDistributor.whatsapp && (
                      <a
                        href={`https://wa.me/${selectedDistributor.whatsapp}?text=Hola%2C%20deseo%20consultar%20disponibilidad%20en%20${encodeURIComponent(selectedDistributor.name)}.`}
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
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedDistributor.address}, ${selectedDistributor.city}, Ecuador`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary-600/30 active:scale-95 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-warning-300" />
                      <span>Cómo llegar (GPS)</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Contenedor del Mapa Oficial de Google Maps: Altura compacta calibrada a 440px para igualar exactamente las 3 tarjetas de la izquierda */}
              <div className="h-[360px] sm:h-[400px] lg:h-[440px] w-full relative bg-slate-900">
                <PremiumMap
                  locations={distributorMapLocations}
                  selectedLocationId={selectedDistributor?.id ?? null}
                  agencyName="Mapa de puntos de atención"
                  isDark={isDark}
                  onSelectLocation={(id) => {
                    const location = filteredDistributors.find((item) => item.id === id);
                    if (location) setSelectedDistributor(location);
                  }}
                />
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
