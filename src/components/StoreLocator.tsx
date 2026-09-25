/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — StoreLocator.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/StoreLocator.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L026-L047  → Imports & dependencies
 *   L048-L050  → Type definitions / interfaces (StoreLocatorProps)
 *   L052-L061  → Component function start & state declarations
 *   L063-L078  → Lifecycle hooks & data loading (Firebase & province sync)
 *   L080-L090  → Memoized distributor filtering (province & query)
 *   L092-L163  → JSX render: header & search / province filter controls
 *   L165-L320  → JSX render: agency directory listing cards (call, WhatsApp, GPS)
 *   L322-L395  → JSX render: interactive OpenStreetMap iframe & agency detail
 *   L397-L401  → Section close & component export end
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Star, 
  Navigation, 
  MessageCircle,
  Building2,
  PhoneCall
} from 'lucide-react';
import { motion } from 'motion/react';
import { defaultDistributors } from '@/data/sinergiaData';
import { provinces } from '@/data/provinces';
import { DistributorLocation } from '@/types/sinergia';
import { useSiteContent } from '@/context/SiteContentContext';
import { getDistributors } from '@/lib/firebaseStore';
import { useTheme } from '@/context/ThemeContext';

interface StoreLocatorProps {
  initialProvince?: string | null;
}

export default function StoreLocator({ initialProvince }: StoreLocatorProps) {
  const [distributorsList, setDistributorsList] = useState<DistributorLocation[]>(defaultDistributors);
  const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince || 'Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistributor, setSelectedDistributor] = useState<DistributorLocation | null>(defaultDistributors[0]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { content } = useSiteContent();
  const slContent = content.storeLocator;

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

  useEffect(() => {
    if (initialProvince) {
      setSelectedProvince(initialProvince);
    }
  }, [initialProvince]);

  // Filter distributors
  const filteredDistributors = useMemo(() => {
    return distributorsList.filter(d => {
      const matchProvince = selectedProvince === 'Todas' || d.province.toLowerCase() === selectedProvince.toLowerCase();
      const matchQuery = 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProvince && matchQuery;
    });
  }, [selectedProvince, searchQuery, distributorsList]);

  return (
    <section 
      id="puntos-de-venta" 
      className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-slate-900 text-white border-slate-800' 
          : 'bg-slate-50 text-slate-900 border-slate-200'
      }`}
    >
      <div className="container-max">
        

        {/* Filter Controls */}
        <div className={`p-4 sm:p-6 rounded-2xl border mb-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center shadow-lg transition-colors ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-slate-900/5'
        }`}>
          <div className="sm:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={slContent.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
          </div>

          <div className="sm:col-span-6 flex items-center gap-3">
            <label className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Filtrar Provincia:
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className={`w-full py-3 px-4 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              }`}
            >
              <option value="Todas">Todas las 24 Provincias</option>
              {provinces.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Map & Directory Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List of Distributors */}
          <div className="lg:col-span-5 space-y-4 max-h-[640px] overflow-y-auto pr-2 no-scrollbar">
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span>Agencias Maresa Encontradas ({filteredDistributors.length})</span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Garantía Nacional</span>
            </div>

            {filteredDistributors.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No se encontraron agencias en <strong>{selectedProvince}</strong> con los criterios de búsqueda.
                </p>
                <button
                  onClick={() => { setSelectedProvince('Todas'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Ver todas las agencias en Ecuador
                </button>
              </div>
            ) : (
              filteredDistributors.map((dist) => {
                const isSelected = selectedDistributor?.id === dist.id;
                return (
                  <div
                    key={dist.id}
                    onClick={() => setSelectedDistributor(dist)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDark 
                          ? 'bg-slate-800/95 border-blue-500 shadow-xl shadow-blue-500/10' 
                          : 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500'
                        : isDark 
                          ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isDark 
                              ? 'bg-blue-600/30 text-blue-300 border-blue-500/40' 
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {dist.province}
                          </span>
                          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {dist.city}
                          </span>
                        </div>
                        <h3 className={`text-base font-extrabold mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          {dist.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{dist.rating}</span>
                      </div>
                    </div>

                    <p className={`text-xs flex items-start gap-1.5 mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{dist.address}</span>
                    </p>

                    <div className={`space-y-1.5 text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{dist.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <a 
                          href={`tel:${dist.phone.replace(/[^0-9+]/g, '')}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-blue-600 font-semibold"
                        >
                          {dist.phone}
                        </a>
                      </div>
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dist.services.map((s, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                            isDark 
                              ? 'bg-slate-900 text-slate-300 border-slate-800' 
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className={`flex items-center gap-2 pt-3 border-t ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}>
                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${dist.phone.replace(/[^0-9+]/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          isDark 
                            ? 'bg-slate-900 hover:bg-slate-800 text-blue-400 border-slate-700' 
                            : 'bg-slate-100 hover:bg-slate-200 text-blue-700 border-slate-300'
                        }`}
                        title="Llamar a esta agencia"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Llamar</span>
                      </a>

                      <a
                        href={`https://wa.me/${dist.whatsapp}?text=Hola%20${encodeURIComponent(dist.name)},%20deseo%20consultar%20disponibilidad%20de%20batería`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dist.name + ' ' + dist.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                          isDark 
                            ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        GPS
                      </a>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Geo Map Display */}
          <div className={`lg:col-span-7 rounded-3xl border overflow-hidden shadow-2xl sticky top-24 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-slate-900/10'
          }`}>
            {selectedDistributor ? (
              <div>
                <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                        Agencia Seleccionada
                      </span>
                      <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {selectedDistributor.city}, {selectedDistributor.province}
                      </span>
                    </div>
                    <h3 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {selectedDistributor.name}
                    </h3>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDistributor.latitude},${selectedDistributor.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                  >
                    <Navigation className="w-4 h-4" />
                    Cómo llegar (GPS)
                  </a>
                </div>

                {/* Map Simulation with Leaflet/OpenStreetMap visual iframe */}
                <div className="h-96 w-full relative bg-slate-950">
                  <iframe
                    title={`Mapa de ${selectedDistributor.name}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedDistributor.longitude - 0.015}%2C${selectedDistributor.latitude - 0.01}%2C${selectedDistributor.longitude + 0.015}%2C${selectedDistributor.latitude + 0.01}&layer=mapnik&marker=${selectedDistributor.latitude}%2C${selectedDistributor.longitude}`}
                    className={`w-full h-full ${isDark ? 'filter contrast-125 saturate-50 invert' : ''}`}
                  />
                  
                  {/* Floating Map Info Overlay */}
                  <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-2xl backdrop-blur-md border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isDark 
                      ? 'bg-slate-900/95 border-slate-700 text-white' 
                      : 'bg-white/95 border-slate-200 text-slate-900'
                  }`}>
                    <div>
                      <span className="font-bold block">{selectedDistributor.address}</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        {selectedDistributor.schedule} • Tel: {selectedDistributor.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Instalación y Diagnóstico Oficial</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-16 text-center text-slate-400">
                Selecciona una agencia para ver su ubicación en el mapa.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
