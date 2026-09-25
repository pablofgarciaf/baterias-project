/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ADMIN LOGIN - Standalone login screen for admin panel
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/AdminLogin.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin/UI
 * ─────────────────────────────────────────────────────────────
 * 🔍 Extracted from AdminRoute page.tsx lines 318-379
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-24
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Lock, KeyRound } from 'lucide-react';

export interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('maresa_admin_auth') === 'true') {
        onLogin(true);
      }
    } catch {}
  }, [onLogin]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        setDarkMode(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'maresa2026' || password === 'admin') {
      sessionStorage.setItem('maresa_admin_auth', 'true');
      setAuthError('');
      onLogin(true);
    } else {
      setAuthError('Contraseña incorrecta. Intenta con "maresa2026"');
      onLogin(false);
    }
  };

  const handleQuickLogin = () => {
    setPassword('maresa2026');
    sessionStorage.setItem('maresa_admin_auth', 'true');
    setAuthError('');
    onLogin(true);
  };

  const cardClass = `rounded-2xl p-8 text-center space-y-6 border shadow-xl ${
    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  }`;

  const inputClass = `w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
    darkMode
      ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
  }`;

  const titleClass = `text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`;
  const subtitleClass = `text-xs mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`;
  const quickBtnClass = `w-full py-2 text-xs transition-colors cursor-pointer ${
    darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'
  }`;

  return (
    <div className={`flex-1 flex items-center justify-center p-6 transition-colors ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="w-full max-w-sm">
        <div className={cardClass}>
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center mx-auto">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="6" fill="#2563eb" />
              <text
                x="16"
                y="21"
                textAnchor="middle"
                fontFamily="system-ui,sans-serif"
                fontWeight="800"
                fontSize="11"
                fill="white"
                letterSpacing="-0.5"
              >
                MBT
              </text>
            </svg>
          </div>

          <div>
            <h2 className={titleClass}>Administrador Maresa</h2>
            <p className={subtitleClass}>
              Ingresa tu clave para editar contenidos, imágenes y gestionar solicitudes B2B.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
              Ingresar
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className={quickBtnClass}
            >
              Ingreso rápido (maresa2026)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}