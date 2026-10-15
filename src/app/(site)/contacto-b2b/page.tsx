// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — contacto-b2b/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/contacto-b2b/page.tsx
 * 🏷️ Type: Page (B2B Lead Capture Route)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L016  → Imports
 *   L018-L024  → Metadata export (SEO)
 *   L026-L030  → ContactoB2BPage component
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import ContactoB2BClient from './ContactoB2BClient';

export const metadata: Metadata = {
  title: 'Quiero ser proveedor',
  description:
    'Postula tu taller o negocio para distribuir baterías Maresa. Déjanos los datos de tu empresa y te contactamos.',
};

export default function ContactoB2BPage() {
  return <ContactoB2BClient />;
}
