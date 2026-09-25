'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useSiteContent } from '@/context/SiteContentContext';
import { 
  MapPin, Search, Navigation, Phone, 
  MessageCircle, Crosshair, MousePointerClick
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
      alert('Tu navegador no soporta geolocalización.');
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

        // Auto scroll to map on mobile
        if (window.innerWidth < 1024 && mapRef.current) {
          mapRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      },
      (error) => {
        setFindingNearest(false);
        alert('No pudimos obtener tu ubicación. Por favor permite el acceso en tu navegador.');
      }
    );
  };

  const handleCardClick = (dist: DistributorLocation) => {
    setSelectedDistributor(dist);
    if (window.innerWidth < 1024 && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen pt-20 lg:pt-20 pb-20 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent dark:from-blue-900/10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container-max">
        
        {/* Header & Controls in one row for Desktop */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                Puntos de Venta
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Agencias y Distribuidores
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Encuentra tu agencia más cercana en las 24 provincias.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleFindNearest}
              disabled={findingNearest}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                findingNearest ? 'opacity-70 cursor-wait' : ''
              } ${isDark ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20'}`}
            >
              <Crosshair className={`w-4 h-4 ${findingNearest ? 'animate-spin' : ''}`} />
              {findingNearest ? 'Buscando...' : 'Cercana (GPS)'}
            </button>
            
            <select
              value={selectedProvince}
              onChange={(e) => { setSelectedProvince(e.target.value); setGpsActive(false); }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-medium outline-none transition-all cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-primary-500' : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 shadow-sm'
              }`}
            >
              <option value="Todas">Todas las provincias</option>
              {provinces.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ciudad o barrio"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full sm:w-48 pl-8 pr-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-primary-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500 shadow-sm'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Map & List Unified Block - Shorter Map Height */}
        <div className={`rounded-[32px] border flex flex-col lg:flex-row overflow-hidden h-[600px] lg:h-[450px] shadow-2xl transition-all ${
          isDark ? 'bg-slate-900/50 border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl' : 'bg-white/80 border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl'
        }`}>
          
          {/* List Sidebar */}
          <div className={`w-full lg:w-[400px] flex flex-col h-[250px] lg:h-full border-b lg:border-b-0 lg:border-r ${
            isDark ? 'border-white/5' : 'border-slate-200'
          }`}>
            <div className={`p-4 border-b text-[10px] font-bold uppercase tracking-widest flex items-center justify-between ${
              isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span>Agencias ({filteredDistributors.length})</span>
              {gpsActive && <span className="text-emerald-500 flex items-center gap-1"><Crosshair className="w-3 h-3"/> Ordenado por cercanía</span>}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
              {filteredDistributors.length === 0 ? (
                <div className="p-8 text-center text-sm opacity-60">
                  No se encontraron agencias.
                </div>
              ) : (
                filteredDistributors.map(dist => {
                  const isSelected = selectedDistributor?.id === dist.id;
                  return (
                    <div
                      key={dist.id}
                      onClick={() => handleCardClick(dist)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? isDark 
                            ? 'bg-primary-900/20 border-primary-500/50 shadow-lg' 
                            : 'bg-primary-50 border-primary-400 shadow-sm ring-1 ring-primary-500/20'
                          : isDark 
                            ? 'bg-transparent border-white/5 hover:bg-white/5' 
                            : 'bg-transparent border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-extrabold text-[14px] leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {dist.name}
                        </h3>
                        {dist.distance !== undefined && (
                          <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">
                            {dist.distance < 1 ? '< 1 km' : `${dist.distance.toFixed(1)} km`}
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-[11px] flex items-start gap-1.5 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <MapPin className="w-3 h-3 shrink-0 text-primary-500 mt-0.5" />
                        <span>{dist.address}</span>
                      </p>
                      
                      {isSelected && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="flex items-center gap-2 pt-3 mt-3 border-t overflow-hidden"
                          style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                        >
                          <a
                            href={`https://wa.me/${dist.whatsapp}?text=Hola%20${encodeURIComponent(dist.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-2 px-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${dist.latitude},${dist.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`py-2 px-3 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border transition-colors ${
                              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                            }`}
                          >
                            <Navigation className="w-3.5 h-3.5" /> Ir
                          </a>
                        </motion.div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Map Area */}
          <div 
            ref={mapRef}
            className="flex-1 relative h-[350px] lg:h-full bg-slate-200 dark:bg-slate-900"
            onClick={() => setIsMapInteractive(true)}
            onMouseLeave={() => setIsMapInteractive(false)}
          >
            {selectedDistributor ? (
              <>
                <AnimatePresence>
                  {!isMapInteractive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 backdrop-blur-[1px]"
                    >
                      <div className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xl cursor-pointer hover:scale-105 transition-transform pointer-events-none border border-white/10">
                        <MousePointerClick className="w-3.5 h-3.5" />
                        Toca para navegar en el mapa
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <iframe
                  title={`Mapa de ${selectedDistributor.name}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedDistributor.longitude - 0.015}%2C${selectedDistributor.latitude - 0.01}%2C${selectedDistributor.longitude + 0.015}%2C${selectedDistributor.latitude + 0.01}&layer=mapnik&marker=${selectedDistributor.latitude}%2C${selectedDistributor.longitude}`}
                  className={`w-full h-full transition-all ${''} ${!isMapInteractive ? 'pointer-events-none' : ''}`}
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDistributor.latitude},${selectedDistributor.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 z-30 px-5 py-3 bg-white text-slate-900 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-slate-50 transition-transform hover:scale-105 active:scale-95 border border-slate-200"
                >
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <span>Abrir en Google Maps</span>
                </a>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm opacity-50">
                Cargando mapa...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
