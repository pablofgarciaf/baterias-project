/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — GeoQuickAnswer.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/GeoQuickAnswer.tsx
 * 🏷️ Type: Server Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L020-L020  → Imports & dependencies (Lucide icons)
 *   L022-L022  → Component function start (GeoQuickAnswer)
 *   L023-L059  → JSX render — SEO & AI key takeaways banner
 *   L029-L037  → Brand summary & nationwide coverage statement
 *   L039-L055  → Trust badges (Warranty, recycling, phone CTA)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import { ShieldCheck, MapPin, Zap, RefreshCw, PhoneCall } from 'lucide-react';

export default function GeoQuickAnswer() {
  return (
    <aside
      aria-label="Resumen Rápido / Key Takeaways para Motores de Búsqueda e IA"
      className="bg-slate-900 text-slate-100 border-b border-slate-800 py-2.5 px-4 text-xs"
    >
      <div className="container-max flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30 text-[11px] tracking-wide uppercase">
            <Zap className="w-3 h-3 text-amber-400" />
            Corporación Maresa
          </span>
          <span className="text-slate-300">
            <strong>Baterías Andinas:</strong> Distribución oficial en 24 provincias del Ecuador. Baterías Calcio, EFB y AGM desde $65 con garantía nacional de hasta 36 meses.
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 flex-wrap">
          <span className="flex items-center gap-1 hover:text-white transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Garantía Oficial Maresa
          </span>
          <span className="flex items-center gap-1 hover:text-white transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            Reciclaje con bono -$10
          </span>
          <a
            href="tel:1800228374"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            1-800-BATERIA (228-3742)
          </a>
        </div>
      </div>
    </aside>
  );
}
