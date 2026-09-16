/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — admin/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/admin/page.tsx
 * 🏷️ Type: Client Component (Admin Dashboard Route)
 * 📦 Module: Admin
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L019  → Imports (AdminPage component, useRouter)
 *   L021-L035  → AdminRoute component (wraps AdminPage with navigation)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useRouter } from 'next/navigation';
import AdminPage from '@/components/AdminPage';

export default function AdminRoute() {
  const router = useRouter();

  const handleBackToSite = () => {
    router.push('/');
  };

  return <AdminPage onBackToSite={handleBackToSite} />;
}
