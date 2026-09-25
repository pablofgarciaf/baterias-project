/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ADMIN LAYOUT - Metadata & root layout for admin
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/admin/layout.tsx
 * 🏷️ Type: Server Component
 * 📦 Module: Admin/Layout
 * ─────────────────────────────────────────────────────────────
 * 🔍 Metadata: noindex, nofollow, title
 * ♿ WCAG 2.1 AA accessible
 * 🎨 Server component (no client JS)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Admin Maresa',
  description: 'Panel de administración CMS & CRM para Baterías Maresa Ecuador',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
  openGraph: {
    title: 'Panel Admin Maresa',
    description: 'Panel de administración CMS & CRM para Baterías Maresa Ecuador',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Panel Admin Maresa',
    description: 'Panel de administración CMS & CRM para Baterías Maresa Ecuador',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}