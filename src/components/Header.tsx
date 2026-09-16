/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Header.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Header.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L024-L035  → Imports & dependencies (React, icons, motion, ThemeContext)
 *   L037-L039  → Type definitions / interfaces (HeaderProps)
 *   L041-L041  → Component function start (Header)
 *   L042-L044  → State & hooks (mobileOpen, theme)
 *   L046-L053  → Constants / static data (navLinks)
 *   L055-L152  → JSX: Desktop header bar (Brand logo, nav links, actions)
 *   L154-L207  → JSX: Mobile menu drawer (AnimatePresence, links, CTA)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import { 
  Battery, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  PhoneCall, 
  GraduationCap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
}

export default function Header({ onNavigateToAdmin }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const navLinks = [
    { label: 'Inicio', href: '#' },
    { label: 'Quiénes Somos', href: '#quienes-somos' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Puntos de Venta', href: '#puntos-de-venta' },
    { label: 'Escuela Técnica', href: '#blog' },
    { label: 'Proveedores B2B', href: '#quiero-ser-proveedor' },
  ];

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
        isDark 
          ? 'bg-slate-950/90 text-white border-slate-800 shadow-lg' 
          : 'bg-white/90 text-slate-900 border-slate-200 shadow-sm'
      }`}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Identity: Baterías Maresa · Corporación Maresa */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center transition-transform shadow-md shadow-blue-600/25 group-hover:scale-105">
              <Battery className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-display font-extrabold text-lg sm:text-xl tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}>
                  Baterías Maresa
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mt-0.5">
                Corporación Maresa
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Ultra clean & luxury */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-sm font-semibold transition-colors py-1 relative group ${
                  isDark 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Controls: Light/Dark Toggle + Call (Desktop) / Clean Mobile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Call Button (Desktop only) */}
            <a
              href="tel:1800228374"
              className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-300 hover:border-blue-500 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              <span>1-800-BATERIA</span>
            </a>

            {/* Light / Dark Mode Toggle (Always visible) */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-700 hover:border-amber-400/50' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 hover:text-blue-600'
              }`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </motion.div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
              className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`lg:hidden border-t overflow-hidden ${
              isDark 
                ? 'bg-slate-950/98 border-slate-800 text-white' 
                : 'bg-white/98 border-slate-200 text-slate-900'
            }`}
          >
            <div className="container-max py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isDark 
                      ? 'text-slate-200 hover:bg-slate-900 hover:text-blue-400' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <a
                  href="tel:1800228374"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Llamar al 1-800-BATERIA (228-3742)</span>
                </a>

                {onNavigateToAdmin && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      onNavigateToAdmin();
                    }}
                    className="w-full py-2.5 text-center text-xs font-semibold text-slate-400 hover:text-blue-400"
                  >
                    Acceso Administrativo CMS
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
