// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Footer.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Footer.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L023-L025  → Imports & dependencies
 *   L027-L029  → Type definitions / interfaces (FooterProps)
 *   L031-L031  → Component function start
 *   L032-L033  → State & hooks (useTheme)
 *   L035-L232  → JSX render (brand, tech list, contact, newsletter, provinces, legal)
 *   L031-L031  → Export default Footer
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { Battery, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Send, ShieldCheck, Lock, PhoneCall } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-400 border-slate-900' : 'bg-slate-950 text-slate-300 border-slate-900'
    }`}>
      <div className="container-max py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Corporación Maresa */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/30">
                <Battery className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl text-white block leading-none">
                  Baterías Maresa
                </span>
                <span className="text-xs text-primary-400 font-bold uppercase tracking-wider block mt-0.5">
                  Guía de baterías
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Guías para comparar tecnologías y elegir una batería adecuada para tu vehículo.
            </p>
          </div>

          {/* Col 2: Líneas de Baterías */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Tecnologías de Batería
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                'Baterías convencionales',
                'Tecnología EFB',
                'Tecnología AGM',
                'Cómo comparar CCA y Ah',
                'Dimensiones y polaridad',
                'Cuidados de la batería',
              ].map((p) => (
                <li key={p}>
                  <a href="/productos" className="hover:text-primary-400 transition-colors">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Atención y contacto
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">Consulta los puntos de atención publicados y confirma sus datos antes de desplazarte.</p>

            <div className="mt-6 pt-4 border-t border-slate-900">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Garantía y Chequeo
              </span>
              <p className="text-xs text-slate-400">
                Solicita las condiciones de garantía de la referencia exacta antes de comprar.
              </p>
            </div>
          </div>

          {/* Col 4: Boletín & Respaldo */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Novedades Técnicas
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Explora consejos para elegir, instalar y cuidar la batería de tu vehículo.
            </p>
            <a href="/blog" className="text-xs text-primary-400 hover:text-primary-300">Leer las guías técnicas</a>

            {/* Clear Admin Access Callout */}
            {onOpenAdmin && (
              <div className="mt-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-warning-400" />
                  <span className="text-xs text-slate-300 font-semibold">CMS Backoffice</span>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="px-2.5 py-1 rounded-lg bg-primary-600/30 hover:bg-primary-600 text-primary-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Abrir CMS
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Directory */}
        <div className="pt-8 border-t border-slate-900">
          <h4 className="text-slate-300 font-semibold mb-3 text-xs uppercase tracking-wider">
            Encuentra un local
          </h4>
          <a href="/agencias" className="inline-flex rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-primary-600 hover:text-white">
            Ver direcciones de Maresa
          </a>
        </div>

        {/* Bottom Legal & Acceso Administrativo */}
        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2026 Baterías Maresa.</p>
          <div className="flex gap-4 items-center flex-wrap">
            <a href="/privacidad" className="hover:text-slate-300 transition-colors">Privacidad</a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-primary-400 hover:text-white underline font-semibold transition-colors cursor-pointer"
              >
                Acceso Administrativo (CMS)
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
