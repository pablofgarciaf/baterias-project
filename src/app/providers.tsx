/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — providers.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/providers.tsx
 * 🏷️ Type: Client Component (Context Providers Wrapper)
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L017  → Imports (ThemeProvider, SiteContentProvider)
 *   L019-L028  → Providers component (wraps children with contexts)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { SiteContentProvider } from '@/context/SiteContentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SiteContentProvider>
        {children}
      </SiteContentProvider>
    </ThemeProvider>
  );
}
