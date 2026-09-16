/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — buscador/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/buscador/page.tsx
 * 🏷️ Type: Page (Vehicle Battery Finder Route)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L016  → Imports
 *   L018-L024  → Metadata export (SEO)
 *   L026-L030  → BuscadorPage component
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import BuscadorClient from './BuscadorClient';

export const metadata: Metadata = {
  title: 'Escoge tu Batería — Buscador Vehicular',
  description:
    'Encuentra la batería exacta para tu auto en 3 pasos: selecciona año, marca y modelo. Compatible con Chevrolet, Toyota, Kia, Hyundai, Mazda y más marcas en Ecuador.',
};

export default function BuscadorPage() {
  return <BuscadorClient />;
}
