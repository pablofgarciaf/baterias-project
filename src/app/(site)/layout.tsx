/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — (site)/layout.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/(site)/layout.tsx
 * 🏷️ Type: Client Component (Site Layout with Header + Footer)
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L020  → Imports (Header, Footer, WhatsApp, context)
 *   L022-L052  → SiteLayout component (theme wrapper + Header + children + Footer + WhatsApp FAB)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { useTheme } from '@/context/ThemeContext';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sticky Header — shared across all public routes */}
      <Header />

      <main id="main-content" className="pt-14 lg:pt-16">
        {children}
      </main>

      {/* Footer Corporativo */}
      <Footer />

      {/* Floating WhatsApp & Direct Call Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
