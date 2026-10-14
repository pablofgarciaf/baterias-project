// estado: ""
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
  title: 'Reciclaje de baterías',
  description:
    'Información general sobre la entrega responsable de baterías usadas. Condiciones del programa pendientes de confirmación.',
};

export default function ReciclajePage() {
  return <ReciclajeClient />;
}
