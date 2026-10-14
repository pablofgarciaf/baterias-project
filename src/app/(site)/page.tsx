// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — (site)/page.tsx (Home)
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/page.tsx
 * 🏷️ Type: Client Component (Home Landing Page)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L017-L026  → Imports (Hero, GeoQuickAnswer, About, Features, icons, motion)
 *   L028-L044  → Teaser section data definitions
 *   L046-L200  → HomePage component with teaser sections
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import Link from 'next/link';
import Hero from '@/components/Hero';
import VehicleFinder from '@/components/VehicleFinder';
import About from '@/components/About';
import Features from '@/components/Features';
import { useTheme } from '@/context/ThemeContext';
import { useRef } from 'react';
import {
  Search,
  Car,
  ArrowRight,
  MapPin,
  Package,
  Handshake,
  Recycle,
  GraduationCap,
  Star,
  Zap,
  Shield,
  Navigation,
  BookOpen,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* ─── Teaser Section Data ─── */
const teaserSections = [

  {
    id: 'catalogo',
    title: 'Catálogo de Baterías',
    subtitle: 'Tecnologías y fichas de referencia',
    description:
      'Conoce las diferencias entre tecnologías AGM, EFB y convencionales y aprende a comparar especificaciones.',
    href: '/productos',
    cta: 'Ver Catálogo Completo',
    icon: Package,
    accentIcon: Zap,
    gradient: 'from-secondary-500 to-secondary-700',
    lightBg: 'from-secondary-50/40 via-white to-secondary-50/20',
    darkBg: 'from-slate-900 via-slate-900/95 to-secondary-950/30',
    highlights: ['Tecnología AGM & EFB', 'CCA y capacidad', 'Cómo comparar'],
  },
  {
    id: 'puntos-de-venta',
    title: 'Puntos de Venta',
    subtitle: 'Consulta ubicaciones y datos de atención',
    description:
      'Encuentra direcciones de locales publicadas por Maresa y consulta su canal oficial de atención.',
    href: '/agencias',
    cta: 'Encontrar Agencia Cercana',
    icon: MapPin,
    accentIcon: Navigation,
    gradient: 'from-secondary-500 to-secondary-700',
    lightBg: 'from-primary-50 via-white to-secondary-50/30',
    darkBg: 'from-slate-900 via-slate-900/95 to-secondary-950/20',
    highlights: ['Mapa interactivo', 'Busca por ciudad', 'Información de contacto'],
  },

  {
    id: 'reciclaje',
    title: 'Reciclaje Ecológico',
    subtitle: 'Entrega responsable de baterías usadas',
    description:
      'Aprende cómo manipular y entregar una batería automotriz usada de manera responsable.',
    href: '/reciclaje',
    cta: 'Conocer Programa Verde',
    icon: Recycle,
    accentIcon: Leaf,
    gradient: 'from-primary-600 to-primary-800',
    lightBg: 'from-primary-50 via-white to-primary-50',
    darkBg: 'from-slate-900 via-slate-900/95 to-primary-950/30',
    highlights: ['Entrega responsable', 'Precauciones básicas', 'Puntos de recepción'],
  },
  {
    id: 'blog',
    title: 'Escuela Técnica',
    subtitle: 'Guías, consejos y recursos para el cuidado de tu batería',
    description:
      'Aprende cómo elegir la batería correcta según altitud, diagnóstico de alternador, diferencias entre AGM y EFB, y mucho más contenido técnico especializado.',
    href: '/blog',
    cta: 'Explorar Artículos',
    icon: GraduationCap,
    accentIcon: BookOpen,
    gradient: 'from-primary-600 to-primary-800',
    lightBg: 'from-primary-50 via-white to-primary-50',
    darkBg: 'from-slate-900 via-slate-900/95 to-primary-950/30',
    highlights: ['Guías paso a paso', 'Tecnologías', 'Consejos de mantenimiento'],
  },
];

function InfiniteCarousel({ items, isDark }: { items: typeof teaserSections; isDark: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>('[data-card]')];
    const current = cards.findIndex((card) => card.offsetLeft - el.offsetLeft >= el.scrollLeft - 8);
    const next = (Math.max(current, 0) + direction + cards.length) % cards.length;
    el.scrollTo({ left: cards[next].offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" onClick={() => move(-1)} aria-label="Servicio anterior" className="grid h-10 w-10 place-items-center rounded-full border border-primary-300 text-primary-800 transition-colors hover:border-secondary-500 hover:bg-secondary-500 hover:text-primary-950"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={() => move(1)} aria-label="Servicio siguiente" className="grid h-10 w-10 place-items-center rounded-full bg-secondary-500 text-primary-950 transition-colors hover:bg-secondary-400"><ChevronRight className="h-5 w-5" /></button>
      </div>
    <div
      ref={scrollRef}
      className="flex gap-5 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide pb-2 sm:gap-6"
    >
      {items.map((section) => (
        <Link
          key={section.id}
          href={section.href}
          data-card
          className={`group shrink-0 w-[82%] sm:w-[48%] lg:w-[30%] snap-start block rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 hover:border-slate-600 hover:shadow-slate-900/50'
              : 'bg-white border-gray-100 hover:border-primary-200 hover:shadow-primary-100/40'
          }`}
        >
          <div className={`h-1.5 w-full bg-gradient-to-r ${section.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <section.accentIcon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
              </div>
            </div>
            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{section.title}</h3>
            <p className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{section.subtitle}</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {section.highlights.map((h) => (
                <span key={h} className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>{h}</span>
              ))}
            </div>
            <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${isDark ? 'text-primary-400 group-hover:text-primary-300' : 'text-primary-600 group-hover:text-primary-700'}`}>
              <span>{section.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
    </div>
  );
}

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      {/* 1. Hero Principal — 100vh con GeoQuickAnswer integrado */}
      <Hero />

      {/* 2. Buscador Vehicular — encuentra tu batería */}
      <VehicleFinder />

      {/* 3. Quiénes Somos — 45 Años de Liderazgo */}
      <About />

      {/* 3. Escoge tu Batería (Teaser → /buscador) */}
      {/* 4. Catálogo (Teaser → /productos) */}
      {/* 5. Puntos de Venta (Teaser → /agencias) */}
      <section
        className={`py-16 sm:py-20 lg:py-24 transition-colors duration-300 ${
          isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-white to-gray-50'
        }`}
      >
        <div className="container-max">
          <div className="mb-12 sm:mb-16">
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] mb-4 ${
                isDark ? 'text-primary-400' : 'text-primary-600'
              }`}
            >
              <span className="w-6 h-px bg-current" />
              Todo lo que necesitas
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[0.95] ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Nuestros Servicios
            </h2>
            <p
              className={`mt-4 text-base sm:text-lg max-w-2xl ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}
            >
              Explora tecnologías, compatibilidades, puntos de atención, reciclaje y guías de cuidado.
            </p>
          </div>

          <InfiniteCarousel items={teaserSections} isDark={isDark} />
        </div>
      </section>

      {/* 6. Diferenciales de Servicio */}
      <Features />

    </>
  );
}
