/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — nosotros/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/nosotros/page.tsx
 * 🏷️ Type: Page (About Us Route)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L016  → Imports
 *   L018-L024  → Metadata export (SEO)
 *   L026-L030  → NosotrosPage component
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import NosotrosClient from './NosotrosClient';

export const metadata: Metadata = {
  title: 'Quiénes Somos — 45 Años de Corporación Maresa',
  description:
    'Conoce la historia de Corporación Maresa en Ecuador: más de 45 años de liderazgo automotriz, laboratorios ISO 9001 y tecnología adaptada a la geografía andina.',
};

export default function NosotrosPage() {
  return <NosotrosClient />;
}
