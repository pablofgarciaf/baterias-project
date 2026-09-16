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
import { provinces } from '@/data/provinces';
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
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <Battery className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl text-white block leading-none">
                  Baterías Andinas
                </span>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mt-0.5">
                  Corporación Maresa Holding
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Distribución oficial de baterías automotrices en el Ecuador con respaldo y garantía nacional de Corporación Maresa (45+ años de trayectoria automotriz).
            </p>
            
            {/* Social channels */}
            <div className="flex gap-2.5 mt-5">
              {[
                { icon: Linkedin, href: 'https://www.linkedin.com/company/corporacion-maresa', label: 'LinkedIn' },
                { icon: Facebook, href: 'https://www.facebook.com/corporacionmaresa', label: 'Facebook' },
                { icon: Instagram, href: 'https://www.instagram.com/corporacionmaresa', label: 'Instagram' },
                { icon: Twitter, href: 'https://twitter.com/corpmaresa', label: 'Twitter / X' },
                { icon: Youtube, href: 'https://www.youtube.com', label: 'YouTube' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Líneas de Baterías */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Tecnologías de Batería
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                'Baterías Calcio-Plata (Libre Mantenimiento)',
                'Baterías EFB (Start-Stop Urbano & Taxis)',
                'Baterías AGM (Start-Stop Luxury & 4x4)',
                'Baterías para Camiones y Carga Pesada',
                'Baterías Marinas y Ciclo Profundo',
                'Diagnóstico Computarizado Gratuito',
              ].map((p) => (
                <li key={p}>
                  <a href="#catalogo" className="hover:text-blue-400 transition-colors">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Enlaces y Contacto con Ofuscación Anti-Scraping */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Atención & Urgencias
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:1800228374" className="hover:text-white font-bold transition-colors">
                  1-800-BATERIA (228-3742)
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+593998123456" className="hover:text-white transition-colors">
                  Emergencias Móviles: 099-812-3456
                </a>
              </div>

              {/* Email obfuscated against scrapers */}
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">
                  <span>contacto</span>
                  <span className="text-blue-400 font-bold">&#64;</span>
                  <span>bateriasandinas.ec</span>
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Av. Amazonas N34-451 y Atahualpa, Quito - Ecuador</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-900">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Garantía y Chequeo
              </span>
              <p className="text-xs text-slate-400">
                Revisión de alternador y sistema de carga sin costo en todos nuestros centros autorizados.
              </p>
            </div>
          </div>

          {/* Col 4: Boletín & Respaldo */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Novedades Técnicas
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Recibe guías técnicas de altitud andina y avisos de promociones oficiales.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@correo.ec"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-slate-800 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                aria-label="Suscribirse al boletín"
                className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Admin Access Callout */}
            {onOpenAdmin && (
              <div className="mt-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-slate-300 font-semibold">CMS Backoffice</span>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Abrir CMS
                </button>
              </div>
            )}
          </div>

        </div>

        {/* 24 Provincias Quick Links */}
        <div className="pt-8 border-t border-slate-900">
          <h4 className="text-slate-300 font-semibold mb-3 text-xs uppercase tracking-wider">
            Red Oficial en las 24 Provincias de Ecuador
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {provinces.map((p) => (
              <a
                key={p.id}
                href="#puntos-de-venta"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-[11px] text-slate-400 transition-colors"
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Acceso Administrativo */}
        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2026 Baterías Andinas · Una marca respaldada por Corporación Maresa. Todos los derechos reservados.</p>
          <div className="flex gap-4 items-center flex-wrap">
            <a href="#" className="hover:text-slate-300 transition-colors">Términos de uso</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-blue-400 hover:text-white underline font-semibold transition-colors cursor-pointer"
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
