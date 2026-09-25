/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ADMIN HEADER - Unified CRM-style header for admin modules
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/AdminHeader.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin/UI
 * ─────────────────────────────────────────────────────────────
 * 🔍 Single-row flex: left (title + description), right (actions)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';
import { RefreshCw, LogOut } from 'lucide-react';

export interface AdminHeaderProps {
  moduleTitle: string;
  moduleDescription: string;
  onReset: () => void;
  onLogout: () => void;
}

export const AdminHeader = React.forwardRef<HTMLElement, AdminHeaderProps>(
  ({ moduleTitle, moduleDescription, onReset, onLogout }, ref) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    const headerClass = isDark
      ? 'backdrop-blur-xl bg-white/[0.02] border-b border-white/[0.06]'
      : 'backdrop-blur-xl bg-white/80 border-b border-slate-200/50';

    const textPrimary = isDark ? 'text-white' : 'text-slate-950';
    const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
    const buttonBase = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer';
    const buttonSecondary = isDark
      ? `${buttonBase} bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white`
      : `${buttonBase} bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-950`;
    const buttonDanger = isDark
      ? `${buttonBase} bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300`
      : `${buttonBase} bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700`;

    return (
      <header
        ref={ref}
        className={`sticky top-0 z-40 ${headerClass}`}
        data-testid="admin-header"
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-4">
            <div className="min-w-0">
              <h1 className={`${textPrimary} font-semibold text-base truncate`}>{moduleTitle}</h1>
              <p className={`${textSecondary} text-sm truncate`}>{moduleDescription}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onReset} className={buttonSecondary} aria-label="Restablecer">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Restablecer</span>
              </button>
              <button onClick={onLogout} className={buttonDanger} aria-label="Salir">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;