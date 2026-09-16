/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Provinces.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Provinces.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L026-L033  → Imports & dependencies
 *   L035-L035  → Constants / static data (regions)
 *   L037-L039  → Component function start & state declarations
 *   L041-L055  → Computed state (filtered provinces & regionCounts)
 *   L057-L070  → JSX render: section header & national coverage banner
 *   L071-L107  → JSX render: search input & regional filter buttons
 *   L109-L119  → JSX render: region summary cards (colors & descriptions)
 *   L121-L162  → JSX render: 24 provinces grid & empty results state
 *   L163-L166  → Section close & component export end
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import { MapPin, Search, Building2, Users } from 'lucide-react';
import {
  provinces,
  regionColors,
  regionDescriptions,
  type Region,
} from '@/data/provinces';

const regions: Region[] = ['Sierra', 'Costa', 'Oriente', 'Insular'];

export default function Provinces() {
  const [activeRegion, setActiveRegion] = useState<Region | 'Todas'>('Todas');
  const [search, setSearch] = useState('');

  const filtered = provinces.filter((p) => {
    const matchRegion = activeRegion === 'Todas' || p.region === activeRegion;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.capital.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  const regionCounts = regions.reduce(
    (acc, r) => {
      acc[r] = provinces.filter((p) => p.region === r).length;
      return acc;
    },
    {} as Record<Region, number>
  );

  return (
    <section id="provincias" className="py-20 bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-semibold mb-3">
            Cobertura Nacional
          </span>
          <h2 className="section-title">En las 24 provincias del Ecuador</h2>
          <p className="section-subtitle mx-auto text-center">
            Desde Pichincha hasta Galápagos, llevamos energía a cada rincón del país.
            Filtra por región para encontrar el distribuidor más cercano.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar provincia o capital..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveRegion('Todas')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeRegion === 'Todas'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas ({provinces.length})
            </button>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeRegion === r
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r} ({regionCounts[r]})
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {regions.map((r) => (
            <div
              key={r}
              className={`p-4 rounded-xl border ${regionColors[r]} text-sm`}
            >
              <strong>{r}</strong>
              <p className="text-xs opacity-80 mt-1">{regionDescriptions[r]}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="card p-5 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${regionColors[p.region]}`}
                >
                  {p.region}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Capital: <strong className="text-gray-700">{p.capital}</strong>
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {(p.population / 1000).toFixed(0)}k hab.
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {p.area.toLocaleString()} km²
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-accent-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver distribuidores en {p.name}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No se encontraron provincias. Intenta con otro término.
          </div>
        )}
      </div>
    </section>
  );
}
