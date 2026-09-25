/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 USERS MANAGER — Admin User Management & Side Creation Drawer
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/admin/UsersManager.tsx
 * 🏷️ Type: Client Component
 * 📦 Module: Admin
 * ─────────────────────────────────────────────────────────────
 * 👥 Google Apps / Vermilion style side drawer for user creation
 * 🔐 Default initial password is their cédula + forcePasswordChange
 * ─────────────────────────────────────────────────────────────
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { getAdminUsers, createAdminUser, AdminUser } from '@/lib/authService';

interface UsersManagerProps {
  darkMode: boolean;
}

export default function UsersManager({ darkMode }: UsersManagerProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [role, setRole] = useState<'admin' | 'operator'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const list = await getAdminUsers();
    setUsers(list);
    setIsLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!email || !name || !cedula) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    if (cedula.length < 6) {
      setFormError('La cédula / contraseña inicial debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAdminUser({
        name,
        email,
        cedula,
        role,
      });

      if (res.success) {
        setFormSuccess('Usuario creado exitosamente con cambio de clave obligatorio.');
        setName('');
        setEmail('');
        setCedula('');
        await loadUsers();
        setTimeout(() => {
          setIsDrawerOpen(false);
          setFormSuccess('');
        }, 1800);
      } else {
        setFormError(res.error || 'Error al crear usuario.');
      }
    } catch {
      setFormError('Ocurrió un error al guardar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Usuarios y Accesos
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Gestiona los administradores y operadores autorizados de Corporación Maresa.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setFormSuccess('');
            setIsDrawerOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Users List Card */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-lg transition-colors ${
          darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-slate-900/5'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead
              className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                darkMode ? 'bg-slate-950/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Usuario</th>
                <th className="py-3.5 px-4">Correo</th>
                <th className="py-3.5 px-4">Rol</th>
                <th className="py-3.5 px-4">Clave Inicial</th>
                <th className="py-3.5 px-4 sm:px-6">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr
                    key={u.email || i}
                    className={`transition-colors ${
                      darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span className={darkMode ? 'text-white' : 'text-slate-900'}>
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 px-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {u.email}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        {u.role === 'admin' ? 'Administrador' : 'Operador'}
                      </span>
                    </td>
                    <td className={`py-4 px-4 font-mono text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {u.cedula ? `C.I. ${u.cedula}` : 'Personalizada'}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      {u.forcePasswordChange ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Lock className="w-3 h-3" />
                          Debe cambiar clave
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Activo
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE DRAWER: Crear Nuevo Usuario (Google / Vermilion Style) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md h-full flex flex-col shadow-2xl border-l animate-in slide-in-from-right duration-300 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Drawer Top */}
            <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight">Crear Nuevo Usuario</h3>
                  <p className="text-[11px] text-slate-400">Acceso administrativo Corporación Maresa</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-slate-800/40 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Form */}
            <form onSubmit={handleCreateUser} className="flex-1 p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ing. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="juan.perez@maresa.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                  Cédula (Contraseña Inicial) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1721790721"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  El usuario usará su cédula para ingresar por primera vez y el sistema le pedirá cambiarla obligatoriamente.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                  Rol Asignado
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="admin">Administrador (Total)</option>
                  <option value="operator">Operador (CRM y Puntos de Venta)</option>
                </select>
              </div>

              {formSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Drawer Bottom Actions */}
              <div className="pt-6 border-t border-slate-800/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800/40 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
