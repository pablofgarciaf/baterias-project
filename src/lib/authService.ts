import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export interface AdminUser {
  email: string;
  name: string;
  cedula?: string;
  role: 'admin' | 'editor';
  roles?: string[];
  forcePasswordChange: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const checkIsAuthorizedAdmin = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false;
  const user = data as Record<string, unknown>;
  return user.role === 'admin' || (Array.isArray(user.roles) && user.roles.includes('admin'));
};

export const verifyAdminUser = async (user: User | null): Promise<{ authorized: boolean; forcePasswordChange: boolean; role: 'admin' | 'editor' | null }> => {
  if (!isFirebaseConfigured || !user?.email) {
    return { authorized: false, forcePasswordChange: false, role: null };
  }
  if (!user.emailVerified) {
    return { authorized: false, forcePasswordChange: false, role: null };
  }
  const token = await user.getIdToken();
  const response = await fetch('/api/admin/session', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (response.status === 503) throw new Error('El servidor administrativo necesita la credencial privada de Firebase. Configura la cuenta de servicio para continuar.');
  if (!response.ok) return { authorized: false, forcePasswordChange: false, role: null };
  const data = await response.json();
  return {
    authorized: data.role === 'admin' || data.role === 'editor',
    forcePasswordChange: data?.forcePasswordChange === true,
    role: data.role,
  };
};

export const loginAdminUser = async (email: string, password: string): Promise<{ success: boolean; forcePasswordChange?: boolean; role?: 'admin' | 'editor'; error?: string }> => {
  if (!isFirebaseConfigured) return { success: false, error: 'El acceso administrativo aún no está configurado.' };
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    if (!credential.user.emailVerified) {
      const sent = await sendEmailVerification(credential.user).then(() => true).catch(() => false);
      await signOut(auth);
      return { success: false, error: sent ? 'Verifica tu correo. Te enviamos un enlace de confirmación.' : 'Verifica tu correo. No se pudo enviar el enlace; contacta al administrador.' };
    }
    const status = await verifyAdminUser(credential.user);
    if (!status.authorized) {
      await signOut(auth);
      return { success: false, error: 'Tu cuenta no tiene acceso administrativo verificado.' };
    }
    return { success: true, forcePasswordChange: status.forcePasswordChange, role: status.role || undefined };
  } catch (error) {
    await signOut(auth).catch(() => undefined);
    return { success: false, error: error instanceof Error && error.message.includes('credencial privada') ? error.message : 'No se pudo iniciar sesión. Revisa tus credenciales y la configuración.' };
  }
};

export const completePasswordChange = async (password: string): Promise<{ success: boolean; error?: string }> => {
  const user = auth.currentUser;
  if (!user || password.length < 12) return { success: false, error: 'La contraseña debe tener al menos 12 caracteres.' };
  try {
    const status = await verifyAdminUser(user);
    if (!status.authorized) return { success: false, error: 'Acceso no autorizado.' };
    const token = await user.getIdToken();
    const response = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error('No se pudo confirmar el cambio.');
    await signOut(auth);
    return { success: true };
  } catch {
    return { success: false, error: 'No se pudo actualizar la contraseña. Vuelve a iniciar sesión e inténtalo.' };
  }
};

export const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (!isFirebaseConfigured) return { success: false, error: 'La recuperación aún no está configurada.' };
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    return { success: true };
  } catch {
    return { success: false, error: 'No se pudo enviar el correo de recuperación.' };
  }
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const status = await verifyAdminUser(auth.currentUser);
  if (!status.authorized || status.role !== 'admin' || !auth.currentUser) throw new Error('Acceso no autorizado.');
  const token = await auth.currentUser.getIdToken();
  const response = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!response.ok) throw new Error('No se pudo consultar usuarios.');
  const data = await response.json();
  return data.users as AdminUser[];
};
