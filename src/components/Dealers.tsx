/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Dealers.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Dealers.tsx
 * 🏷️ Type: Server Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L021-L021  → Imports & dependencies (Lucide icons)
 *   L023-L023  → Component function start (Dealers)
 *   L024-L031  → Constants / static data (benefits list)
 *   L033-L095  → JSX render — B2B Dealers section container
 *   L040-L071  → Left column: Pitch, benefits checklist, CTA button
 *   L073-L090  → Right column: Key performance stats cards
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import { Store, TrendingUp, Handshake, ArrowRight, Check } from 'lucide-react';

export default function Dealers() {
  const benefits = [
    'Margen de ganancia competitivo',
    'Capacitación técnica gratuita',
    'Material de marketing incluido',
    'Soporte de inventario y logística',
    'Acceso a plataforma de pedidos online',
    'Garantía respaldada por Baterías Andinas',
  ];

  return (
    <section id="distribuidores" className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-gray-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-primary-200 text-sm font-semibold mb-4 border border-white/20">
              Oportunidad de Negocio
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Conviértete en
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Distribuidor Autorizado
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              Únete a la red de más de 150 distribuidores en todo el Ecuador. Crece tu
              negocio con la marca de baterías más confiable del país.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>

            <a href="#contacto" className="btn-accent mt-8">
              Solicitar información
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Store, value: '150+', label: 'Distribuidores activos', color: 'text-primary-400' },
              { icon: TrendingUp, value: '35%', label: 'Crecimiento anual promedio', color: 'text-accent-400' },
              { icon: Handshake, value: '24', label: 'Provincias con cobertura', color: 'text-secondary-400' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20 ${
                  i === 1 ? 'sm:mt-8' : ''
                }`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
