/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — maresa.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/types/maresa.ts
 * 🏷️ Type: Type Definitions
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L021-L032  → Interface: SiteSection (CMS section content)
 *   L034-L040  → Interface: Brand (automotive manufacturer)
 *   L042-L050  → Interface: Vehicle (vehicle models)
 *   L052-L061  → Interface: Part (parts & batteries schema)
 *   L063-L074  → Interface: ServiceCenter (dealers & workshops)
 *   L076-L085  → Interface: InventoryRow (stock per center)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

export interface SiteSection {
  id: string;
  section_key: string;
  eyebrow: string;
  title: string;
  body: string;
  cta_label: string;
  cta_href: string;
  image_url: string;
  is_visible: boolean;
  sort_order: number;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface Vehicle {
  id: string;
  brand_id: string;
  name: string;
  vehicle_type: string;
  model_year_start: number | null;
  model_year_end: number | null;
  is_active: boolean;
}

export interface Part {
  id: string;
  part_number: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  image_url: string;
  is_active: boolean;
}

export interface ServiceCenter {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  hours: string;
  is_active: boolean;
}

export interface InventoryRow {
  id: string;
  part_id: string;
  service_center_id: string;
  quantity: number;
  reorder_level: number;
  updated_at: string;
  part?: Part;
  service_center?: ServiceCenter;
}
