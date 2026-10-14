// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — blog/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/blog/page.tsx
 * 🏷️ Type: Page (Blog & Technical Resources Route)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L016  → Imports
 *   L018-L024  → Metadata export (SEO)
 *   L026-L030  → BlogPage component
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Guías sobre baterías',
  description:
    'Artículos introductorios sobre selección, uso y mantenimiento de baterías automotrices.',
};

export default function BlogPage() {
  return <BlogClient />;
}
