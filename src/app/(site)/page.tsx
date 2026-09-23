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
import { motion } from 'motion/react';
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
} from 'lucide-react';

/* ─── Teaser Section Data ─── */
const teaserSections = [
  {
    id: 'escoge-tu-bateria',
    title: 'Escoge tu Batería',
    subtitle: 'Encuentra la batería perfecta para tu vehículo en 3 simples pasos',
    description:
      'Selecciona año, marca y modelo de tu auto y nuestro sistema inteligente te recomienda la batería ideal con especificaciones técnicas, precio y disponibilidad inmediata.',
    href: '/buscador',
    cta: 'Buscar Mi Batería',
    icon: Car,
    accentIcon: Search,
    gradient: 'from-primary-600 to-primary-800',
    lightBg: 'from-primary-50 via-white to-blue-50/30',
    darkBg: 'from-slate-900 via-slate-900/95 to-primary-950/40',
    highlights: ['Compatible con +50 marcas', 'Resultado en segundos', 'Precio al instante'],
  },
  {
    id: 'catalogo',
    title: 'Catálogo de Baterías',
    subtitle: 'Línea completa para autos, camiones, motos y maquinaria',
    description:
      'Explora nuestra gama premium: desde baterías convencionales hasta tecnología AGM y EFB para vehículos Start-Stop. Todas con garantía real de fábrica.',
    href: '/productos',
    cta: 'Ver Catálogo Completo',
    icon: Package,
    accentIcon: Zap,
    gradient: 'from-secondary-500 to-secondary-700',
    lightBg: 'from-secondary-50/40 via-white to-orange-50/20',
    darkBg: 'from-slate-900 via-slate-900/95 to-secondary-950/30',
    highlights: ['Tecnología AGM & EFB', 'Para todo tipo de vehículo', 'Garantía hasta 24 meses'],
  },
  {
    id: 'puntos-de-venta',
    title: 'Puntos de Venta',
    subtitle: 'Red de distribuidores en las 24 provincias del Ecuador',
    description:
      'Encuentra tu agencia más cercana con mapa interactivo, horarios, teléfono directo y WhatsApp. Más de 150 puntos autorizados en todo el país.',
    href: '/agencias',
    cta: 'Encontrar Agencia Cercana',
    icon: MapPin,
    accentIcon: Navigation,
    gradient: 'from-accent-500 to-accent-700',
    lightBg: 'from-accent-50/30 via-white to-emerald-50/20',
    darkBg: 'from-slate-900 via-slate-900/95 to-accent-950/30',
    highlights: ['Mapa interactivo', '150+ distribuidores', 'WhatsApp directo'],
  },
  {
    id: 'quiero-ser-proveedor',
    title: 'Quiero ser Proveedor',
    subtitle: 'Únete a nuestra red de distribuidores autorizados',
    description:
      'Crece tu negocio con la marca de baterías más confiable del Ecuador. Márgenes competitivos, capacitación técnica gratuita y soporte logístico nacional.',
    href: '/contacto-b2b',
    cta: 'Solicitar Información B2B',
    icon: Handshake,
    accentIcon: Star,
    gradient: 'from-purple-600 to-indigo-700',
    lightBg: 'from-purple-50/30 via-white to-indigo-50/20',
    darkBg: 'from-slate-900 via-slate-900/95 to-purple-950/30',
    highlights: ['Margen competitivo', 'Capacitación gratuita', 'Crédito directo'],
  },
  {
    id: 'reciclaje',
    title: 'Reciclaje Ecológico',
    subtitle: 'Programa Canje Verde: entrega tu batería usada y ahorra',
    description:
      'Contribuye al medio ambiente y recibe un bono de descuento inmediato al entregar tu batería usada en cualquier agencia autorizada.',
    href: '/reciclaje',
    cta: 'Conocer Programa Verde',
    icon: Recycle,
    accentIcon: Leaf,
    gradient: 'from-emerald-600 to-teal-700',
    lightBg: 'from-emerald-50/30 via-white to-teal-50/20',
    darkBg: 'from-slate-900 via-slate-900/95 to-emerald-950/30',
    highlights: ['Bono -$10 inmediato', 'Eco-friendly', 'En cualquier agencia'],
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
    gradient: 'from-sky-600 to-cyan-700',
    lightBg: 'from-sky-50/30 via-white to-cyan-50/20',
    darkBg: 'from-slate-900 via-slate-900/95 to-sky-950/30',
    highlights: ['Guías paso a paso', 'Videos técnicos', 'Tips de mantenimiento'],
  },
];

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
              Baterías, asesoría técnica, puntos de venta y programas especiales para ti y tu negocio.
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            {teaserSections.map((section, idx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-start"
              >
                <Link
                  href={section.href}
                  id={section.id}
                  className={`group block h-full rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-600 hover:shadow-slate-900/50'
                      : 'bg-white border-gray-100 hover:border-primary-200 hover:shadow-primary-100/40'
                  }`}
                >
                  {/* Top gradient accent bar */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${section.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="p-6 sm:p-7">
                    {/* Icon pair */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-slate-800' : 'bg-gray-100'
                        }`}
                      >
                        <section.accentIcon
                          className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}
                        />
                      </div>
                    </div>

                    {/* Copy */}
                    <h3
                      className={`text-lg font-bold mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {section.title}
                    </h3>
                    <p
                      className={`text-sm font-medium mb-3 ${
                        isDark ? 'text-slate-400' : 'text-gray-500'
                      }`}
                    >
                      {section.subtitle}
                    </p>

                    {/* Highlight pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {section.highlights.map((h) => (
                        <span
                          key={h}
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isDark
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-gray-50 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div
                      className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                        isDark
                          ? 'text-primary-400 group-hover:text-primary-300'
                          : 'text-primary-600 group-hover:text-primary-700'
                      }`}
                    >
                      <span>{section.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <p className={`md:hidden mt-4 text-center text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
            Desliza para ver más →
          </p>
        </div>
      </section>

      {/* 6. Diferenciales de Servicio */}
      <Features />

      {/* 7. CTA Distribuidores (links to /contacto-b2b) */}
      <section
        className="py-16 sm:py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-gray-900 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-primary-200 text-xs font-bold uppercase tracking-widest mb-4 border border-white/15">
              Oportunidad de Negocio
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              ¿Quieres ser{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Distribuidor Autorizado
              </span>
              ?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Únete a la red de más de 150 distribuidores en todo el Ecuador. Márgenes competitivos,
              capacitación gratuita y soporte logístico nacional.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contacto-b2b"
                className="btn-accent inline-flex items-center gap-2"
              >
                Solicitar Información
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/agencias"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Ver Red de Agencias
                <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
