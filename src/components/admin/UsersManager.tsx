'use client';

import { useState, useEffect, useRef } from 'react';
import { User, UserPlus, Shield, CheckCircle, Mail, Key, X, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor';
  status: 'Activo' | 'Inactivo';
  createdAt: string;
}

export default function UsersManager() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Editor'>('Admin');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock load
    setTimeout(() => {
      setUsers([
        { id: '1', name: 'Pablo García', email: 'pablofgarciaf@gmail.com', role: 'Admin', status: 'Activo', createdAt: new Date().toISOString() }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);

  const openNewUserModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('Admin');
    setPassword('');
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: UserData) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setPassword(''); // leave blank if not changing
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setFormError('');
      setFormSuccess('');
    }, 300);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    if (!name || !email || (!editingUser && !password)) {
      setFormError('Por favor completa los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));

      if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, name, email, role } : u));
        setFormSuccess('Usuario actualizado con éxito.');
      } else {
        const newUser: UserData = {
          id: Math.random().toString(),
          name,
          email,
          role,
          status: 'Activo',
          createdAt: new Date().toISOString()
        };
        setUsers([...users, newUser]);
        setFormSuccess('Usuario creado con éxito.');
      }

      setTimeout(() => {
        closeModal();
        setIsSubmitting(false);
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar el usuario.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Usuarios y Accesos
          </h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Gestiona los administradores y operadores autorizados de Corporación Maresa.
          </p>
        </div>

        <button
          onClick={openNewUserModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Users List Card */}
      <div
        className={`rounded-[24px] border overflow-hidden shadow-2xl transition-colors ${
          darkMode ? 'bg-slate-900/40 border-white/5 backdrop-blur-xl' : 'bg-white/80 border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead
              className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                darkMode ? 'bg-slate-950/50 border-white/5 text-slate-400' : 'bg-slate-50/50 border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-4 px-6">Usuario</th>
                <th className="py-4 px-6">Correo</th>
                <th className="py-4 px-6">Rol</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 px-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {u.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                        darkMode ? 'bg-blue-900/20 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        <Shield className="w-3.5 h-3.5" />
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openEditModal(u)}
                        className={`p-2 rounded-xl border transition-all ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-blue-500' : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500'
                        }`}
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL: Crear/Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className={`w-full max-w-lg rounded-[32px] border shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200 ${
              darkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`px-6 py-5 border-b flex items-center justify-between ${
              darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center">
                  {editingUser ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight">
                    {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                  </h3>
                  <p className="text-xs opacity-60">Acceso administrativo</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-5">
              
              {formError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {formSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 opacity-60">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: Ing. Juan PAcrez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                        darkMode ? 'bg-slate-900 border-slate-800 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 opacity-60">
                    Correo ElectrA3nico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                    <input
                      type="email"
                      required
                      placeholder="usuario@dominio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                        darkMode ? 'bg-slate-900 border-slate-800 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 opacity-60">
                      Rol del Sistema *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'Admin' | 'Editor')}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all cursor-pointer focus:ring-2 focus:ring-blue-500/20 ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <option value="Admin">Administrador (Total)</option>
                      <option value="Editor">Editor (Contenidos)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 opacity-60">
                      {editingUser ? 'Nueva Clave (Opcional)' : 'Clave Inicial *'}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <input
                        type="password"
                        required={!editingUser}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                          darkMode ? 'bg-slate-900 border-slate-800 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 ${
                    isSubmitting ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {isSubmitting ? 'Guardando...' : editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
