'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Edit3, KeyRound, Loader2, Shield, UserPlus, X } from 'lucide-react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';

type Role = 'admin' | 'editor';
type StaffUser = { uid: string; name: string; email: string; cedulaLast4?: string; role: Role; active: boolean; emailVerified: boolean; forcePasswordChange?: boolean };

async function adminRequest(path: string, options?: RequestInit) {
  const user = auth.currentUser;
  if (!user) throw new Error('La sesión expiró. Vuelve a iniciar sesión.');
  const token = await user.getIdToken();
  const response = await fetch(path, {
    ...options,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options?.headers },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'No se pudo completar la operación.');
  return result;
}

async function sendActivationLink(email: string) {
  auth.languageCode = 'es';
  await sendSignInLinkToEmail(auth, email.trim().toLowerCase(), {
    url: `${window.location.origin}/admin`,
    handleCodeInApp: true,
  });
}

export default function UsersManager({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [role, setRole] = useState<Role>('editor');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminRequest('/api/admin/users');
      setUsers(result.users);
      onCountChange?.(result.users.length);
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron cargar usuarios.');
    } finally { setLoading(false); }
  }, [onCountChange]);

  useEffect(() => { void reload(); }, [reload]);

  const showForm = (user: StaffUser | null) => {
    setEditing(user);
    setName(user?.name || '');
    setEmail(user?.email || '');
    setCedula('');
    setRole(user?.role || 'editor');
    setError('');
    setOpen(true);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      if (editing) {
        await adminRequest(`/api/admin/users/${encodeURIComponent(editing.uid)}`, {
          method: 'PATCH', body: JSON.stringify({ name, role }),
        });
        setNotice('Usuario actualizado en Authentication y Firestore.');
      } else {
        await adminRequest('/api/admin/users', {
          method: 'POST', body: JSON.stringify({ name, email, cedula, role }),
        });
        setCedula('');
        try {
          auth.languageCode = 'es';
          await sendActivationLink(email);
          setNotice('Usuario creado. Se envió un enlace de activación al correo indicado.');
        } catch {
          setNotice('Usuario creado en Firebase, pero no se pudo enviar el enlace. Activa el método Enlace por correo en Authentication y usa Reenviar invitación.');
        }
      }
      setOpen(false);
      await reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el usuario.');
    } finally { setSaving(false); }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>Usuarios y Accesos</h2>
          <p className="text-sm mt-1 text-slate-400">Cuentas reales de Firebase Authentication vinculadas a documentos por UID en Firestore.</p>
        </div>
        <button type="button" onClick={() => showForm(null)} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold">
          <UserPlus className="w-4 h-4" /> Nuevo usuario
        </button>
      </div>

      {error && !open && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">{notice}</p>}

      <div className={`rounded-3xl border overflow-x-auto ${dark ? 'bg-slate-900/40 border-white/10' : 'bg-white border-slate-200'}`}>
        <table className="w-full text-left text-sm">
          <thead className={`border-b text-xs uppercase tracking-wider ${dark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
            <tr><th className="p-5">Usuario</th><th className="p-5">Correo / UID</th><th className="p-5">Rol</th><th className="p-5">Estado</th><th className="p-5">Acciones</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="p-8 text-center text-slate-400"><Loader2 className="inline-block w-4 h-4 animate-spin mr-2" />Cargando usuarios...</td></tr>}
            {!loading && users.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">No hay usuarios vinculados por UID.</td></tr>}
            {users.map((user) => (
              <tr key={user.uid} className={`border-t ${dark ? 'border-white/5' : 'border-slate-100'}`}>
                <td className="p-5 font-semibold">{user.name}</td>
                <td className="p-5"><span className="block">{user.email}</span><code className="block mt-1 text-xs text-slate-500 break-all">{user.uid}</code>{user.cedulaLast4 && <span className="block mt-1 text-xs text-slate-500">Cédula: ••••••{user.cedulaLast4}</span>}</td>
                <td className="p-5"><span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400"><Shield className="w-3 h-3" />{user.role === 'admin' ? 'Admin' : 'Editor'}</span></td>
                <td className="p-5 text-xs">{user.active ? (!user.emailVerified ? 'Correo pendiente' : user.forcePasswordChange ? 'Primer ingreso pendiente' : 'Activo') : 'Desactivado'}</td>
                <td className="p-5"><div className="flex items-center gap-2"><button type="button" onClick={() => showForm(user)} aria-label={`Editar ${user.name}`} className="rounded-xl border border-slate-600 p-2 hover:border-blue-500"><Edit3 className="w-4 h-4" /></button>{user.forcePasswordChange && <button type="button" onClick={() => { void sendActivationLink(user.email).then(() => setNotice('Invitación enviada.')).catch(() => setError('No se pudo enviar la invitación. Revisa Authentication.')); }} className="rounded-xl border border-blue-500/40 px-2 py-1 text-xs text-blue-400">Reenviar invitación</button>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="user-dialog-title" className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className="flex justify-between items-center mb-5"><h3 id="user-dialog-title" className="text-xl font-bold">{editing ? 'Editar usuario' : 'Crear usuario'}</h3><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar"><X className="w-5 h-5" /></button></div>
          {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
          <form onSubmit={save} className="space-y-4">
            <label className="block text-sm font-medium">Nombre<input required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-600 bg-transparent px-3 py-2" /></label>
            <label className="block text-sm font-medium">Correo<input required type="email" disabled={Boolean(editing)} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-600 bg-transparent px-3 py-2 disabled:opacity-60" /></label>
            {!editing && <label className="block text-sm font-medium">Cédula<input required inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} autoComplete="off" value={cedula} onChange={(event) => setCedula(event.target.value.replace(/\D/g, ''))} className="mt-1 block w-full rounded-xl border border-slate-600 bg-transparent px-3 py-2" /><span className="block mt-1 text-xs text-slate-400">10 dígitos. El panel solo conservará los últimos cuatro.</span></label>}
            <label className="block text-sm font-medium">Rol<select value={role} onChange={(event) => setRole(event.target.value as Role)} className={`mt-1 block w-full rounded-xl border border-slate-600 px-3 py-2 ${dark ? 'bg-slate-900' : 'bg-white'}`}><option value="editor">Editor de contenidos</option><option value="admin">Administrador</option></select></label>
            {!editing && <p className="flex gap-2 text-xs text-slate-400"><KeyRound className="w-4 h-4 shrink-0" />Se enviará un enlace que verifica el correo y permite crear una contraseña en el primer ingreso.</p>}
            <div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 text-sm">Cancelar</button><button disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear usuario'}</button></div>
          </form>
        </div>
      </div>}
    </section>
  );
}
