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
  title: 'Contacto para negocios',
  description:
    'Conoce la propuesta comercial para talleres y distribuidores y deja tus datos cuando el formulario esté habilitado.',
};

export default function ContactoB2BPage() {
  return <ContactoB2BClient />;
}
