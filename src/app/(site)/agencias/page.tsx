/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — agencias/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/agencias/page.tsx
 * 🏷️ Type: Page (Store Locator + Provinces Route)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L016  → Imports
 *   L018-L024  → Metadata export (SEO)
 *   L026-L032  → AgenciasPage component
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import AgenciasClient from './AgenciasClient';

export const metadata: Metadata = {
  title: 'Agencias y Puntos de Venta — 24 Provincias',
  description:
    'Encuentra tu agencia Baterías Maresa más cercana en Ecuador. Red de distribuidores autorizados en las 24 provincias con mapa, horarios, teléfono y WhatsApp directo.',
};

export default function AgenciasPage() {
  return <AgenciasClient />;
}
