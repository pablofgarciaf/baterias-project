// estado: ""
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
  setDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { B2BLead, DistributorLocation } from '@/types/sinergia';

// 1. Enviar Solicitud B2B (Quiero ser distribuidor)
export async function submitB2BLead(leadData: Omit<B2BLead, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> {
  if (!isFirebaseConfigured) throw new Error('El formulario todavía no está conectado al CRM.');
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
    } catch (err) { throw err; }
  }
  throw new Error('El formulario todavía no está conectado al CRM.');
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
    } catch (err) { throw err; }
  }
  return [];
}

// 3. Actualizar Estado de Solicitud (Aprobado, Contactado, etc.)
export async function updateLeadStatus(id: string, newStatus: B2BLead['status']): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const leadRef = doc(db, 'b2b_leads', id);
      await updateDoc(leadRef, { status: newStatus });
      return true;
    } catch (err) { throw err; }
  }
  return false;
}

// 4. Obtener Red de Distribuidores
export async function getDistributors(includeUnpublished = false): Promise<DistributorLocation[]> {
  if (isFirebaseConfigured && db) {
    try {
      const source = includeUnpublished
        ? collection(db, 'distributors')
        : query(collection(db, 'distributors'), where('published', '==', true));
      const snapshot = await getDocs(source);
      return snapshot.docs.map(d => ({
        ...(d.data() as Omit<DistributorLocation, 'id'>),
        id: d.id,
      }));
    } catch (err) {
      if (includeUnpublished) throw err;
      console.warn('No se pudieron cargar los puntos de venta:', err);
    }
  }
  return [];
}

// 5. Agregar o Modificar Distribuidor
export async function saveDistributor(distributor: DistributorLocation): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      if (!distributor.id) throw new Error('El punto de atención necesita un identificador.');
      await setDoc(doc(db, 'distributors', distributor.id), { ...distributor });
      return true;
    } catch (err) { throw err; }
  }
  return false;
}

// 6. Eliminar Distribuidor
export async function removeDistributor(id: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'distributors', id));
      return true;
    } catch (err) { throw err; }
  }
  return false;
}
