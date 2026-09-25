/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — sinergia.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/types/sinergia.ts
 * 🏷️ Type: Type Definitions
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L019-L036  → Interface: VehicleBatteryMatch (compatibility match)
 *   L038-L052  → Interface: DistributorLocation (stores & workshops)
 *   L054-L067  → Interface: B2BLead (commercial lead applications)
 *   L069-L085  → Interface: BatteryProduct (product specifications)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

export interface VehicleBatteryMatch {
  id: string;
  year: number;
  brand: string;
  model: string;
  engine: string;
  recommendedBattery: {
    model: string;
    bciGroup: string;
    cca: number; // Cold Cranking Amps
    ah: number;
    voltage: number;
    technology: 'AGM' | 'Plomo-Ácido' | 'EFB' | 'Gel';
    warrantyMonths: number;
    priceEcuador: number;
    features: string[];
  };
}

export interface DistributorLocation {
  id: string;
  name: string;
  province: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  schedule: string;
  latitude: number;
  longitude: number;
  services: string[];
  isAuthorized: boolean;
  rating: number;
  mapsIframe?: string;
}

export interface B2BLead {
  id?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  businessType: 'Taller Mecánico' | 'Distribuidora de Repuestos' | 'Flota de Transporte' | 'Lubricadora' | 'Otro';
  estimatedVolume: string; // e.g. "10-50 unidades/mes"
  notes?: string;
  status: 'Pendiente' | 'Contactado' | 'Aprobado' | 'Descartado' | 'Aplica' | 'No Aplica';
  createdAt: string;
}

export interface BatteryProduct {
  id: string;
  name: string;
  category: 'auto' | 'camion' | 'moto' | 'marino' | 'golf' | 'solar' | 'industrial';
  sku: string;
  cca: number;
  ah: number;
  voltage: number;
  dimensions: string;
  technology: string;
  warranty: string;
  price: number;
  isPopular?: boolean;
  isActive: boolean;
  imageUrl: string;
  description: string;
}
