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
  title: 'Puntos de venta',
  description:
    'Explora el directorio de puntos de venta de referencia. Direcciones y canales de atención pendientes de validación.',
};

export default function AgenciasPage() {
  return <AgenciasClient />;
}
