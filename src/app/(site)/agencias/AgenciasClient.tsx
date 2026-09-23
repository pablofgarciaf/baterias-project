'use client';

import { useTheme } from '@/context/ThemeContext';
import { MapPin } from 'lucide-react';
import StoreLocator from '@/components/StoreLocator';
import Provinces from '@/components/Provinces';

export default function AgenciasClient() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      {/* Hero Banner con imagen */}
      <section className="relative h-[40vh] min-h-[280px] max-h-[400px] flex items-end overflow-hidden -mt-14 lg:-mt-16">
        <picture className="absolute inset-0 z-0">
          <source media="(max-width: 767px)" srcSet="/agencias-hero.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/agencias-hero.webp" type="image/webp" />
          <img
            src="/agencias-hero.webp"
            alt="Red de distribuidores Baterías Maresa en Ecuador"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="container-max relative z-10 pb-8 sm:pb-12">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-primary-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">Puntos de Venta</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Agencias y Distribuidores
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/70 max-w-lg">
            Encuentra tu agencia más cercana en las 24 provincias del Ecuador.
          </p>
        </div>
      </section>

      <StoreLocator />
      <Provinces />
    </>
  );
}
