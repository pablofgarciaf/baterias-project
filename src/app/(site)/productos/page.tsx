/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — productos/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/productos/page.tsx
 * 🏷️ Type: Page (Products Route)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L016  → Imports
 *   L018-L024  → Metadata export (SEO)
 *   L026-L034  → ProductosPage component
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Catálogo de Baterías — Todos los Modelos',
  description:
    'Explora el catálogo completo de baterías Maresa: AGM, EFB, Calcio-Plata y Heavy Duty. Compara especificaciones y solicita cotización directa por WhatsApp.',
};

export default function ProductosPage() {
  return <ProductsClient />;
}
