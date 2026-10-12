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
  title: 'Quiénes somos',
  description:
    'Conoce el propósito, la propuesta de valor y los compromisos de Baterías Maresa. Información institucional pendiente de aprobación.',
};

export default function NosotrosPage() {
  return <NosotrosClient />;
}
