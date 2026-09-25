/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ADMIN PAGE — Authentication & Shell Gateway
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/admin/page.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin
 * ─────────────────────────────────────────────────────────────
 * 🛡️ Firebase Auth + Firestore force password change flow
 * 🎨 Luxury styling inspired by Vermilion & EnergyEngine
 * 👁️ Password visibility toggle + recovery flow
 * ─────────────────────────────────────────────────────────────
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import {
  loginAdminUser,
  completePasswordChange,
  requestPasswordReset,
  ensurePrimaryAdminSeed,
} from '@/lib/authService';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Force Password Change Modal
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  useEffect(() => {
    ensurePrimaryAdminSeed();
    try {
      if (sessionStorage.getItem('maresa_admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) setDarkMode(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const res = await loginAdminUser(email, password);
      if (res.success) {
        if (res.forcePasswordChange) {
          setPendingEmail(email.trim().toLowerCase());
          setShowChangeModal(true);
          setIsLoading(false);
          return;
        }
        setIsAuthenticated(true);
      } else {
        setAuthError(res.error || 'Credenciales inválidas.');
      }
    } catch (err) {
      setAuthError('Ocurrió un error inesperado al conectar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setChangeError('');

    if (newPassword.length < 6) {
      setChangeError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('Las contraseñas no coinciden.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await completePasswordChange(pendingEmail, newPassword);
      if (res.success) {
        setShowChangeModal(false);
        setIsAuthenticated(true);
      } else {
        setChangeError(res.error || 'Error al actualizar contraseña.');
      }
    } catch (err) {
      setChangeError('No se pudo actualizar la contraseña.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    const res = await requestPasswordReset(forgotEmail);
    setForgotLoading(false);
    if (res.success) {
      setForgotSent(true);
    } else {
      setForgotError(res.error || 'No se pudo enviar el correo.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex flex-col font-sans transition-colors relative overflow-hidden ${
          darkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Subtle background ambient lights (Vermilion / Luxury style) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with theme toggle */}
        <header
          className={`h-14 border-b flex items-center justify-between px-6 sm:px-10 z-20 backdrop-blur-xl ${
            darkMode
              ? 'bg-slate-950/60 border-white/[0.06]'
              : 'bg-white/70 border-slate-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
              <span className="font-extrabold text-[10px] text-white tracking-tighter">MBT</span>
            </div>
            <span
              className={`font-semibold text-xs tracking-wider uppercase ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Maresa <span className="text-blue-500">Security Gateway</span>
            </span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              darkMode
                ? 'text-slate-400 hover:text-amber-400 hover:bg-white/[0.06]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </header>

        {/* Login Screen Main */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
          <div
            className={`w-full max-w-md rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all shadow-2xl border ${
              darkMode
                ? 'bg-slate-900/80 border-white/[0.08] shadow-black/50'
                : 'bg-white/90 border-slate-200 shadow-slate-900/10'
            }`}
          >
            {/* Header Icon & Title */}
            <div className="text-center mb-7">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1
                className={`text-2xl font-bold tracking-tight ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                Panel Administrativo
              </h1>
              <p
                className={`text-xs mt-1.5 leading-relaxed max-w-xs mx-auto ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Ingresa con tu correo y credenciales autorizadas de Corporación Maresa.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 px-0.5 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@bateriasmaresa.ec"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-slate-950/60 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input with Eye toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <label
                    className={`block text-[11px] font-bold uppercase tracking-wider ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] font-medium text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-slate-950/60 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Helper quick hint for initial admin setup */}
              <div
                className={`mt-4 pt-4 border-t text-center text-[11px] ${
                  darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                }`}
              >
                Cuenta principal: <span className="font-semibold text-slate-400">pablofgarciaf@gmail.com</span>
              </div>
            </form>
          </div>
        </main>

        {/* MODAL 1: Cambio Obligatorio de Clave (Primer Ingreso) */}
        {showChangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div
              className={`w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-center tracking-tight">
                Crea tu nueva contraseña
              </h2>
              <p
                className={`text-xs text-center mt-1.5 mb-5 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Por seguridad, debes cambiar tu clave temporal para{' '}
                <strong className={darkMode ? 'text-white' : 'text-slate-800'}>{pendingEmail}</strong>
              </p>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-3.5 pr-10 py-2.5 rounded-xl border text-sm outline-none ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repite la contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-3.5 pr-10 py-2.5 rounded-xl border text-sm outline-none ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {newPassword.length > 0 && confirmPassword.length > 0 && (
                  <div className={`text-[11px] font-semibold text-center mt-2 ${
                    newPassword === confirmPassword ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {newPassword === confirmPassword 
                      ? '✓ Las contraseñas coinciden' 
                      : '⚠ Las contraseñas aún no coinciden'}
                  </div>
                )}

                {changeError && (
                  <p className="text-xs text-red-400 font-medium text-center">{changeError}</p>
                )}

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Guardar y Entrar al Panel'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Recuperación de Contraseña */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div
              className={`w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl border relative ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                  setForgotError('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-blue-600/15 text-blue-500 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-center tracking-tight">
                Recuperar Contraseña
              </h2>
              <p
                className={`text-xs text-center mt-1.5 mb-5 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Te enviaremos un enlace oficial de restablecimiento a tu correo.
              </p>

              {forgotSent ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-400">
                    ¡Correo de recuperación enviado!
                  </p>
                  <p className="text-xs opacity-70">
                    Revisa tu bandeja de entrada en <strong>{forgotEmail}</strong> y sigue las instrucciones.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                  >
                    Volver al Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="pablofgarciaf@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>

                  {forgotError && (
                    <p className="text-xs text-red-400 font-medium text-center">{forgotError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Enviar Enlace de Recuperación'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <AdminShell />;
}