// estado: ""
/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — sinergiaData.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/data/sinergiaData.ts
 * 🏷️ Type: Data / Constants Hub
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   - Exporta vehículos y años desde ./vehiclesData
 *   - Exporta agencias y distribuidores oficiales desde ./agenciasData
 *   - Mantiene leads B2B iniciales para CRM
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-10-12
 * ═══════════════════════════════════════════════════════════════
 */

import { B2BLead } from '@/types/sinergia';

// Re-exportar vehículos y catálogo automotriz modularizado
export { vehicleYears, vehicleCatalog } from './vehiclesData';

// Re-exportar red de agencias y puntos de venta oficiales
export { defaultDistributors } from './agenciasData';

// Leads B2B iniciales para CRM
export const initialB2BLeads: B2BLead[] = [
  {
    id: 'lead-001',
    companyName: 'Mecánica Automotriz Los Andes Cía. Ltda.',
    contactName: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@mecanicalosandes.ec',
    phone: '0994567890',
    province: 'Pichincha',
    city: 'Quito',
    businessType: 'Taller Mecánico',
    estimatedVolume: '30 - 50 baterías / mes',
    notes: 'Interesado en línea AGM y baterías para flotas de camionetas D-Max.',
    status: 'Pendiente',
    createdAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'lead-002',
    companyName: 'Repuestos & Servicios del Pacífico',
    contactName: 'Lcda. Mariana Solórzano',
    email: 'ventas@repuestospacifico.com',
    phone: '0987654321',
    province: 'Guayas',
    city: 'Guayaquil',
    businessType: 'Distribuidora de Repuestos',
    estimatedVolume: '80 - 120 baterías / mes',
    notes: 'Requiere línea de crédito comercial a 30 días y material publicitario para local en vía a Daule.',
    status: 'Contactado',
    createdAt: '2026-09-14T10:15:00Z'
  },
  {
    id: 'lead-003',
    companyName: 'Transportes Pesados TransAzuay',
    contactName: 'Sr. Rodrigo Vásquez',
    email: 'logistica@transazuay.ec',
    phone: '0978901234',
    province: 'Azuay',
    city: 'Cuenca',
    businessType: 'Flota de Transporte',
    estimatedVolume: '20 - 40 baterías / mes (Diésel HD)',
    notes: 'Consumo propio para flota de 28 cabezales Hino e International.',
    status: 'Aprobado',
    createdAt: '2026-09-12T16:45:00Z'
  }
];
