/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — firebaseStore.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/lib/firebaseStore.ts
 * 🏷️ Type: Library / Data Access Layer
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L023-L034  → Imports & dependencies
 *   L036-L072  → LocalStorage keys & offline fallback helpers
 *   L074-L100  → B2B Leads: submitB2BLead
 *   L102-L118  → B2B Leads: getB2BLeads
 *   L120-L136  → B2B Leads: updateLeadStatus
 *   L138-L154  → Distributors: getDistributors
 *   L156-L180  → Distributors: saveDistributor
 *   L182-L197  → Distributors: removeDistributor
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { B2BLead, DistributorLocation } from '@/types/sinergia';
import { initialB2BLeads, defaultDistributors } from '@/data/sinergiaData';

const LOCAL_STORAGE_KEY_LEADS = 'maresa_b2b_leads';
const LOCAL_STORAGE_KEY_DISTRIBUTORS = 'maresa_distributors';

// Helper for local fallback
const getLocalLeads = (): B2BLead[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_LEADS);
    return data ? JSON.parse(data) : initialB2BLeads;
  } catch {
    return initialB2BLeads;
  }
};

const saveLocalLeads = (leads: B2BLead[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(leads));
  } catch (err) {
    console.error('Error saving local leads', err);
  }
};

const getLocalDistributors = (): DistributorLocation[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_DISTRIBUTORS);
    return data ? JSON.parse(data) : defaultDistributors;
  } catch {
    return defaultDistributors;
  }
};

const saveLocalDistributors = (distributors: DistributorLocation[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_DISTRIBUTORS, JSON.stringify(distributors));
  } catch (err) {
    console.error('Error saving local distributors', err);
  }
};

// 1. Enviar Solicitud B2B (Quiero ser distribuidor)
export async function submitB2BLead(leadData: Omit<B2BLead, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> {
  const newLead: B2BLead = {
    ...leadData,
    id: 'lead-' + Date.now(),
    status: 'Pendiente',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'b2b_leads'), {
        ...newLead,
        firebaseTimestamp: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn('Firebase sync failed, storing locally:', err);
    }
  }

  // Local fallback
  const current = getLocalLeads();
  const updated = [newLead, ...current];
  saveLocalLeads(updated);
  return { success: true, id: newLead.id! };
}

// 2. Obtener Solicitudes B2B para el CRM Admin
export async function getB2BLeads(): Promise<B2BLead[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'b2b_leads'));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<B2BLead, 'id'>)
        }));
      }
    } catch (err) {
      console.warn('Firestore getDocs fallback to local:', err);
    }
  }
  return getLocalLeads();
}

// 3. Actualizar Estado de Solicitud (Aprobado, Contactado, etc.)
export async function updateLeadStatus(id: string, newStatus: B2BLead['status']): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const leadRef = doc(db, 'b2b_leads', id);
      await updateDoc(leadRef, { status: newStatus });
      return true;
    } catch (err) {
      console.warn('Firestore updateDoc failed, fallback to local', err);
    }
  }

  const current = getLocalLeads();
  const updated = current.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead);
  saveLocalLeads(updated);
  return true;
}

// 4. Obtener Red de Distribuidores
export async function getDistributors(): Promise<DistributorLocation[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'distributors'));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<DistributorLocation, 'id'>)
        }));
      }
    } catch (err) {
      console.warn('Firestore getDistributors fallback to local:', err);
    }
  }
  return getLocalDistributors();
}

// 5. Agregar o Modificar Distribuidor
export async function saveDistributor(distributor: DistributorLocation): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      if (distributor.id && !distributor.id.startsWith('dist-')) {
        await updateDoc(doc(db, 'distributors', distributor.id), { ...distributor });
      } else {
        await addDoc(collection(db, 'distributors'), { ...distributor, createdAt: serverTimestamp() });
      }
      return true;
    } catch (err) {
      console.warn('Firestore saveDistributor failed, saving locally:', err);
    }
  }

  const current = getLocalDistributors();
  const existingIndex = current.findIndex(d => d.id === distributor.id);
  if (existingIndex >= 0) {
    current[existingIndex] = distributor;
  } else {
    current.unshift(distributor);
  }
  saveLocalDistributors(current);
  return true;
}

// 6. Eliminar Distribuidor
export async function removeDistributor(id: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'distributors', id));
      return true;
    } catch (err) {
      console.warn('Firestore removeDistributor failed:', err);
    }
  }

  const current = getLocalDistributors();
  const filtered = current.filter(d => d.id !== id);
  saveLocalDistributors(filtered);
  return true;
}
