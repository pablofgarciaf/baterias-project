/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — reciclaje/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/reciclaje/page.tsx
 * 🏷️ Type: Page (Recycling Program Route)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L016  → Imports
 *   L018-L024  → Metadata export (SEO)
 *   L026-L030  → ReciclajePage component
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import ReciclajeClient from './ReciclajeClient';

export const metadata: Metadata = {
  title: 'Reciclaje Ecológico — Plan Canje Verde Maresa',
  description:
    'Programa de reciclaje de baterías usadas de Corporación Maresa. Entrega tu batería vieja y recibe un bono inmediato de -$10 en tu nueva batería en cualquier agencia de Ecuador.',
};

export default function ReciclajePage() {
  return <ReciclajeClient />;
}
