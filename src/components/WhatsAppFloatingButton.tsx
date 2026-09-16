/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — WhatsAppFloatingButton.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/WhatsAppFloatingButton.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L023-L026  → Imports & dependencies
 *   L028-L028  → Component function start
 *   L029-L030  → State & hooks (isOpen, useTheme)
 *   L032-L035  → Constants / static contact URLs & phones
 *   L037-L212  → JSX render (expanded modal, options, FAB button)
 *   L028-L028  → Export default WhatsAppFloatingButton
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import { Phone, MessageCircle, X, Clock, PhoneCall, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/context/ThemeContext';

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const whatsappUrl =
    'https://wa.me/593998123456?text=Hola%20Maresa,%20deseo%20consultar%20sobre%20una%20bater%C3%ADa%20para%20mi%20veh%C3%ADculo.';
  const tollFreeNumber = 'tel:1800228374';
  const emergencyMobile = 'tel:+593998123456';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Contact Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className={`mb-3 w-80 sm:w-88 rounded-3xl shadow-2xl border overflow-hidden backdrop-blur-xl ${
              theme === 'dark'
                ? 'bg-slate-900/98 text-white border-slate-700/80 shadow-slate-950/80'
                : 'bg-white/98 text-slate-900 border-slate-200/90 shadow-2xl shadow-blue-950/15'
            }`}
          >
            {/* Header with Maresa Branding */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-4 text-white relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar opciones de contacto"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-blue-200">
                  Atención Inmediata Maresa
                </span>
              </div>
              <h4 className="text-base font-extrabold leading-tight">
                ¿Necesitas batería o auxilio en ruta?
              </h4>
              <p className="text-xs text-blue-100/90 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                Atención 24/7 en las 24 provincias de Ecuador
              </p>
            </div>

            {/* Contact Options List */}
            <div className="p-3.5 space-y-2.5">
              
              {/* Option 1: WhatsApp Chat Direct */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-150 group ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-emerald-950/40 border-slate-700 hover:border-emerald-500/60 text-white'
                    : 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200/80 text-emerald-950 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Chatear por WhatsApp</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                      En línea
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Cotización express y compatibilidad de batería
                  </p>
                </div>
              </a>

              {/* Option 2: Llamada Nacional Gratuita 1-800 */}
              <a
                href={tollFreeNumber}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-150 group ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-blue-950/40 border-slate-700 hover:border-blue-500/60 text-white'
                    : 'bg-blue-50/70 hover:bg-blue-100/80 border-blue-200/80 text-blue-950 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Llamar 1-800 BATERÍA</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white">
                      Gratis
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    1-800-228-3742 (Fijo y Celular)
                  </p>
                </div>
              </a>

              {/* Option 3: Auxilio Vial y Batería a Domicilio */}
              <a
                href={emergencyMobile}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-150 group ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-amber-950/30 border-slate-700 hover:border-amber-500/60 text-white'
                    : 'bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/80 text-amber-950 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Emergencia en Ruta</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500 text-white">
                      Móvil
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    099-812-3456 • Asistencia y reemplazo
                  </p>
                </div>
              </a>

            </div>

            {/* Bottom Guarantee Note */}
            <div className={`p-3 border-t text-[11px] flex items-center gap-2 ${
              theme === 'dark' ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-100'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Garantía nacional directa de Corporación Maresa.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standalone Green Floating Button Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar menú de contacto' : 'Abrir opciones de llamada y WhatsApp'}
        title="Contactar a Corporación Maresa"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative"
      >
        {/* Animated Ring Beacon */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white dark:border-slate-900" />
        </span>

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
