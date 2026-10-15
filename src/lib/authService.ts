// estado: ""
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

/** Valida la clave nueva antes de enviarla a Firebase. */
export const validateNewPassword = (password: string, currentPassword = ''): string | null => {
  if (password.length < 12) return 'La contraseña debe tener al menos 12 caracteres.';
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return 'Incluye mayúscula, minúscula, número y un carácter especial (por ejemplo ! . # ?).';
  }
  if (/^\d{10}$/.test(password) || (currentPassword && password === currentPassword)) {
    return 'La nueva contraseña no puede ser tu cédula ni repetir la actual.';
  }
  return null;
};

const getLoginErrorMessage = (error: unknown): string => {
  const code = error && typeof error === 'object' && 'code' in error
    ? String((error as { code: unknown }).code)
    : undefined;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Correo o contraseña incorrectos. Comprueba que estás usando la cuenta creada en Firebase Authentication.';
    case 'auth/operation-not-allowed':
      return 'El acceso por correo y contraseña está deshabilitado en Firebase Authentication. Actívalo en el proveedor de acceso Email/Password.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    case 'auth/app-not-authorized':
      return 'La configuración de Firebase de este entorno no corresponde a una aplicación web autorizada. Revisa el proyecto y las restricciones de la API key.';
    case 'auth/user-disabled':
      return 'Esta cuenta está deshabilitada en Firebase Authentication. Un administrador debe reactivarla.';
    case 'auth/too-many-requests':
      return 'Firebase bloqueó temporalmente los intentos de acceso. Espera unos minutos antes de volver a intentarlo.';
    case 'auth/network-request-failed':
      return 'No se pudo conectar con Firebase Authentication. Revisa la conexión y vuelve a intentar.';
    default:
      return 'No se pudo iniciar sesión. Revisa las credenciales y la configuración del proveedor Email/Password en Firebase.';
  }
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
    if (error instanceof Error && error.message.includes('credencial privada')) {
      return { success: false, error: error.message };
    }
    return { success: false, error: getLoginErrorMessage(error) };
  }
};

export const completePasswordChange = async (password: string, currentPassword = ''): Promise<{ success: boolean; error?: string }> => {
  const user = auth.currentUser;
  const invalid = validateNewPassword(password, currentPassword);
  if (!user || invalid) return { success: false, error: invalid || 'La sesión expiró. Vuelve a ingresar.' };
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
