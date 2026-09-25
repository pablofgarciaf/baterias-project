/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Header.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Header.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L024-L040  → Imports & dependencies
 *   L042-L068  → Constants (navLinks with icons, moreLinks)
 *   L070-L070  → Component function start
 *   L071-L095  → State & hooks (mobileOpen, moreOpen, scrolled, pathname)
 *   L097-L310  → JSX: Header (transparent→solid, nav links, mobile drawer)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-23
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Battery,
  Menu,
  X,
  Sun,
  Moon,
  PhoneCall,
  ChevronDown,
  Search,
  MapPin,
  Handshake,
  Package,
  Recycle,
  GraduationCap,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Escoge tu Batería', href: '/#escoge-tu-bateria', icon: Search },
  { label: 'Quiénes Somos', href: '/nosotros', icon: Users },
  { label: 'Puntos de Venta', href: '/agencias', icon: MapPin },
  { label: 'Ser Proveedor', href: '/contacto-b2b', icon: Handshake },
];

const moreLinks = [
  { label: 'Catálogo Completo', href: '/productos', icon: Package, desc: 'Toda nuestra línea de baterías' },
  { label: 'Reciclaje', href: '/reciclaje', icon: Recycle, desc: 'Programa Canje Verde' },
  { label: 'Escuela Técnica', href: '/blog', icon: GraduationCap, desc: 'Guías y consejos' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const hasDarkHero = pathname === '/' || pathname === '/nosotros';
  const solid = scrolled || !hasDarkHero;

  const headerBg = solid
    ? isDark
      ? 'bg-slate-950/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/20'
      : 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
    : 'bg-transparent border-b border-transparent';

  const linkBase = solid
    ? isDark ? 'text-slate-300' : 'text-slate-600'
    : 'text-white/80';

  const linkHover = solid
    ? isDark ? 'hover:text-white' : 'hover:text-slate-950'
    : 'hover:text-white';

  const linkActive = solid
    ? isDark ? 'text-white' : 'text-slate-950'
    : 'text-white';

  const accentUnderline = solid
    ? isDark ? 'bg-primary-400' : 'bg-primary-600'
    : 'bg-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
      <div className="container-max">
        <div className="flex items-center justify-between h-14 lg:h-16">

          {/* Brand — compact */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${solid
                ? 'bg-primary-600 shadow-sm'
                : 'bg-white/15 backdrop-blur-md border border-white/20'
              }`}>
              <Battery className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <span className={`font-display font-bold text-[15px] tracking-tight transition-colors duration-300 ${solid ? (isDark ? 'text-white' : 'text-slate-950') : 'text-white'
                }`}>
                Baterías Maresa
              </span>
              <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] block transition-colors duration-300 ${solid ? 'text-primary-600 dark:text-primary-400' : 'text-white/60'
                }`}>
                Corporación Maresa
              </span>
            </div>
          </Link>

          {/* Desktop Nav — all client-required links visible */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 xl:px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 rounded-lg ${active ? linkActive : `${linkBase} ${linkHover}`
                    } ${solid ? (active ? '' : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]') : (active ? '' : 'hover:bg-white/[0.08]')}`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full ${accentUnderline}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* More dropdown — secondary pages */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-0.5 px-3 xl:px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 cursor-pointer rounded-lg ${linkBase} ${linkHover} ${solid ? 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]' : 'hover:bg-white/[0.08]'
                  }`}
              >
                Más
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full right-0 mt-1.5 w-64 rounded-xl border p-1.5 shadow-xl ${isDark
                        ? 'bg-slate-900/95 backdrop-blur-2xl border-white/10 shadow-black/40'
                        : 'bg-white/95 backdrop-blur-2xl border-black/[0.06] shadow-black/[0.08]'
                      }`}
                  >
                    {moreLinks.map((svc) => (
                      <Link
                        key={svc.label}
                        href={svc.href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${isDark
                            ? 'hover:bg-white/[0.06] text-slate-300 hover:text-white'
                            : 'hover:bg-black/[0.03] text-slate-600 hover:text-slate-950'
                          }`}
                      >
                        <svc.icon className={`w-4 h-4 shrink-0 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                        <div>
                          <div className={`text-[13px] font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {svc.label}
                          </div>
                          <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {svc.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="tel:1800228374"
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${solid
                  ? isDark
                    ? 'bg-white/[0.06] border border-white/10 text-white hover:bg-white/[0.1]'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                  : 'bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25'
                }`}
            >
              <PhoneCall className="w-3 h-3" />
              1-800-BATERIA
            </a>

            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${solid
                  ? isDark
                    ? 'text-slate-400 hover:text-amber-400 hover:bg-white/[0.06]'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-black/[0.04]'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.1]'
                }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
              className={`lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${solid
                  ? isDark
                    ? 'text-slate-300 hover:bg-white/[0.06]'
                    : 'text-slate-600 hover:bg-black/[0.04]'
                  : 'text-white hover:bg-white/[0.1]'
                }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`lg:hidden overflow-hidden ${isDark
                ? 'bg-slate-950/98 backdrop-blur-2xl'
                : 'bg-white/98 backdrop-blur-2xl'
              }`}
          >
            <div className="container-max py-3 space-y-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${active
                        ? isDark ? 'text-white bg-white/[0.06]' : 'text-slate-950 bg-primary-50'
                        : isDark ? 'text-slate-300 hover:bg-white/[0.04]' : 'text-slate-600 hover:bg-black/[0.02]'
                      }`}
                  >
                    {link.icon && <link.icon className={`w-4 h-4 ${active ? (isDark ? 'text-primary-400' : 'text-primary-600') : ''}`} />}
                    {link.label}
                  </Link>
                );
              })}

              <div className={`h-px mx-3 my-2 ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'}`} />

              {moreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]' : 'text-slate-500 hover:text-slate-700 hover:bg-black/[0.02]'
                    }`}
                >
                  <link.icon className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              ))}

              <div className={`h-px mx-3 my-2 ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'}`} />

              <a
                href="tel:1800228374"
                className="flex items-center justify-center gap-2 mx-3 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold shadow-sm active:scale-[0.98] transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Llamar al 1-800-BATERIA
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
