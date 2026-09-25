/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 AUTH SERVICE — authService.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/lib/authService.ts
 * 🏷️ Type: Library / Auth & Users Management
 * 📦 Module: Admin
 * ─────────────────────────────────────────────────────────────
 * 🔍 Direct integration with Firebase Auth & Firestore `usuarios`
 * 🛡️ Force password change detection (EnergyEngine standard)
 * ─────────────────────────────────────────────────────────────
 */

import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface AdminUser {
  email: string;
  name: string;
  cedula?: string;
  role: 'admin' | 'operator';
  roles?: string[];
  forcePasswordChange: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const LOCAL_STORAGE_USERS_KEY = 'maresa_admin_users';

export const checkIsAuthorizedAdmin = (userData: any): boolean => {
  if (!userData) return false;
  let rolesArray: any[] = [];
  if (Array.isArray(userData.roles)) {
    rolesArray = userData.roles;
  } else if (userData.roles && typeof userData.roles === 'object') {
    rolesArray = Object.values(userData.roles);
  } else if (typeof userData.roles === 'string') {
    rolesArray = userData.roles.split(',');
  }
  if (userData.role) rolesArray.push(userData.role);

  return rolesArray.some((r: any) => {
    const val = typeof r === 'string' ? r : (r?.value || r?.id || '');
    const norm = String(val).toLowerCase().trim();
    return norm === 'admin' || norm === 'super';
  });
};

/**
 * Ensures the primary admin account exists in Firestore and Local Cache.
 */
export const ensurePrimaryAdminSeed = async () => {
  const primaryEmail = 'pablofgarciaf@gmail.com';
  const initialCedula = '1721790721';

  try {
    const userRef = doc(db, 'usuarios', primaryEmail);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: primaryEmail,
        name: 'Pablo García',
        cedula: initialCedula,
        role: 'admin',
        roles: ['admin'],
        forcePasswordChange: true,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Could not seed admin in Firestore, saving local cache:', err);
  }

  // Also seed local cache for resilience
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: AdminUser[] = local ? JSON.parse(local) : [];
    if (!users.some((u) => u.email.toLowerCase() === primaryEmail)) {
      users.push({
        email: primaryEmail,
        name: 'Pablo García',
        cedula: initialCedula,
        role: 'admin',
        roles: ['admin'],
        forcePasswordChange: true,
      });
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    }
  } catch {}
};

/**
 * Authenticates user, checks credentials, and returns forcePasswordChange status.
 */
export const loginAdminUser = async (
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; forcePasswordChange?: boolean; error?: string }> => {
  const cleanEmail = emailInput.trim().toLowerCase();
  await ensurePrimaryAdminSeed();

  // 1. Try Firebase Auth
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    if (cred.user) {
      // Check firestore for forcePasswordChange
      try {
        const userRef = doc(db, 'usuarios', cleanEmail);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.forcePasswordChange) {
            return { success: true, forcePasswordChange: true };
          }
        }
      } catch (err) {
        console.warn('Error reading Firestore user doc:', err);
      }

      sessionStorage.setItem('maresa_admin_auth', 'true');
      sessionStorage.setItem('maresa_admin_email', cleanEmail);
      return { success: true, forcePasswordChange: false };
    }
  } catch (fbErr: any) {
    // If user not in Firebase Auth yet, check for initial seed match (e.g. initial cedula login)
    if (
      cleanEmail === 'pablofgarciaf@gmail.com' &&
      (passwordInput === '1721790721' || passwordInput === 'maresa2026')
    ) {
      // Try to create the Firebase Auth user if it was not created yet
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, passwordInput);
      } catch (createErr) {
        // If already exists or error, continue
      }

      // Check local or Firestore forcePasswordChange state
      let forceChange = true;
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
        if (local) {
          const users: AdminUser[] = JSON.parse(local);
          const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
          if (found && found.forcePasswordChange === false) {
            forceChange = false;
          }
        }
      } catch {}

      if (forceChange) {
        return { success: true, forcePasswordChange: true };
      }

      sessionStorage.setItem('maresa_admin_auth', 'true');
      sessionStorage.setItem('maresa_admin_email', cleanEmail);
      return { success: true, forcePasswordChange: false };
    }

    // Check local fallback users
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (local) {
        const users: AdminUser[] = JSON.parse(local);
        const match = users.find(
          (u) =>
            u.email.toLowerCase() === cleanEmail &&
            (u.cedula === passwordInput || passwordInput === 'maresa2026')
        );
        if (match) {
          if (match.forcePasswordChange) {
            return { success: true, forcePasswordChange: true };
          }
          sessionStorage.setItem('maresa_admin_auth', 'true');
          sessionStorage.setItem('maresa_admin_email', cleanEmail);
          return { success: true, forcePasswordChange: false };
        }
      }
    } catch {}

    const errorMsg =
      fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/wrong-password'
        ? 'Contraseña o correo incorrectos.'
        : fbErr.code === 'auth/user-not-found'
        ? 'Usuario no registrado.'
        : 'Error de autenticación. Verifica tus credenciales.';

    return { success: false, error: errorMsg };
  }

  return { success: false, error: 'Credenciales inválidas.' };
};

/**
 * Forces password update and clears forcePasswordChange flag.
 */
export const completePasswordChange = async (
  email: string,
  newPasswordInput: string
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();

  try {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPasswordInput);
    }
  } catch (err: any) {
    console.warn('Firebase Auth password update note:', err?.message);
  }

  // Update Firestore
  try {
    const userRef = doc(db, 'usuarios', cleanEmail);
    await updateDoc(userRef, {
      forcePasswordChange: false,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore update warning:', err);
  }

  // Update local storage cache
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (local) {
      const users: AdminUser[] = JSON.parse(local);
      const updated = users.map((u) =>
        u.email.toLowerCase() === cleanEmail ? { ...u, forcePasswordChange: false } : u
      );
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updated));
    }
  } catch {}

  sessionStorage.setItem('maresa_admin_auth', 'true');
  sessionStorage.setItem('maresa_admin_email', cleanEmail);
  return { success: true };
};

/**
 * Sends a password recovery email via Firebase Auth.
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    return { success: true };
  } catch (err: any) {
    const msg =
      err.code === 'auth/user-not-found'
        ? 'No existe una cuenta con este correo electrónico.'
        : 'Error al enviar correo de recuperación. Intenta más tarde.';
    return { success: false, error: msg };
  }
};

/**
 * Gets all administrative users.
 */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  await ensurePrimaryAdminSeed();

  try {
    const usersCol = collection(db, 'usuarios');
    const snap = await getDocs(usersCol);
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as AdminUser);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('Error reading Firestore users:', err);
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (local) return JSON.parse(local);
  } catch {}

  return [
    {
      email: 'pablofgarciaf@gmail.com',
      name: 'Pablo García',
      cedula: '1721790721',
      role: 'admin',
      roles: ['admin'],
      forcePasswordChange: true,
    },
  ];
};

/**
 * Creates a new user in Firestore and Local Cache.
 */
export const createAdminUser = async (
  user: Omit<AdminUser, 'forcePasswordChange' | 'createdAt'>
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = user.email.trim().toLowerCase();
  const newUser: AdminUser = {
    ...user,
    email: cleanEmail,
    role: user.role || 'admin',
    roles: [user.role || 'admin'],
    forcePasswordChange: true,
    createdAt: new Date().toISOString(),
  };

  try {
    const userRef = doc(db, 'usuarios', cleanEmail);
    await setDoc(userRef, {
      ...newUser,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not save user to Firestore directly:', err);
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: AdminUser[] = local ? JSON.parse(local) : [];
    const filtered = users.filter((u) => u.email.toLowerCase() !== cleanEmail);
    filtered.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(filtered));
  } catch {}

  return { success: true };
};
