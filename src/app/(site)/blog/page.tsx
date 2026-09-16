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
  title: 'Blog Técnico — Escuela de Baterías Maresa',
  description:
    'Guías técnicas automotrices: cómo elegir batería por altitud, diagnóstico de alternador, Start-Stop AGM vs EFB, reciclaje ecológico y más consejos para Ecuador.',
};

export default function BlogPage() {
  return <BlogClient />;
}
