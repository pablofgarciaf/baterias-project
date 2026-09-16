/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — products.ts
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/data/products.ts
 * 🏷️ Type: Data / Constants
 * 📦 Module: Shared
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L018-L028  → Imports (lucide-react icons)
 *   L030-L038  → Type definition (ProductCategory interface)
 *   L040-L129  → Dataset (productCategories array)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import {
  Car,
  Truck,
  Bike,
  Sailboat,
  Zap,
  Sun,
  ShoppingCart,
  Recycle,
  type LucideIcon,
} from 'lucide-react';

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  image: string;
  features: string[];
  popularModels: string[];
}

export const productCategories: ProductCategory[] = [
  {
    id: 'car',
    name: 'Baterías para Automóviles',
    description:
      'Baterías de arranque para autos particulares y de flota. Tecnología AGM y plomo-ácido para todo tipo de vehículo.',
    icon: Car,
    image:
      'https://images.pexels.com/photos/37177070/pexels-photo-37177070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Arranque potente en frío', 'Larga vida útil', 'Mantenimiento libre'],
    popularModels: ['Andina Power 24F', 'Andina AGM H5', 'Andina Eco 35'],
  },
  {
    id: 'truck',
    name: 'Baterías para Camiones',
    description:
      'Diseñadas para motores diésel y vehículos pesados. Soportan vibración extrema y trabajo continuo en carretera.',
    icon: Truck,
    image:
      'https://images.pexels.com/photos/6940962/pexels-photo-6940962.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Alta resistencia a vibración', 'Ciclos profundos', 'Soporte para flotas'],
    popularModels: ['Andina HD 31', 'Andina Pro 4D', 'Andina Max 8D'],
  },
  {
    id: 'motorcycle',
    name: 'Baterías para Motos',
    description:
      'Compactas y potentes para motocicletas, scooters y cuadrimotos. Arranque confiable en cualquier altitud.',
    icon: Bike,
    image:
      'https://images.pexels.com/photos/9606839/pexels-photo-9606839.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Ligero y compacto', 'Arranque rápido', 'Compatible con todas las marcas'],
    popularModels: ['Andina Moto 12N', 'Andina Scoot YTX7', 'Andina ATV YTX14'],
  },
  {
    id: 'marine',
    name: 'Baterías Marinas',
    description:
      'Para lanchas, botes y vehículos acuáticos. Resistencia contra la corrosión salina y descargas profundas.',
    icon: Sailboat,
    image:
      'https://images.pexels.com/photos/7966664/pexels-photo-7966664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Anti-corrosión salina', 'Descarga profunda', 'Doble propósito arranque/ciclo'],
    popularModels: ['Andina Marine 24M', 'Andina Deep 27M', 'Andina Trolling 29M'],
  },
  {
    id: 'golf',
    name: 'Baterías para Carros de Golf',
    description:
      'Baterías de ciclo profundo para carros de golf, maquinaria ligera y vehículos eléctricos de campo.',
    icon: ShoppingCart,
    image:
      'https://images.pexels.com/photos/274108/pexels-photo-274108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Ciclo profundo 6V y 8V', 'Larga duración por carga', 'Bajo mantenimiento'],
    popularModels: ['Andina Golf 6V', 'Andina Course 8V', 'Andina EV 12V'],
  },
  {
    id: 'solar',
    name: 'Baterías Solares',
    description:
      'Sistemas de almacenamiento para paneles solares y energía renovable. Ideales para zonas rurales sin conexión.',
    icon: Sun,
    image:
      'https://images.pexels.com/photos/8853509/pexels-photo-8853509.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Ciclo profundo prolongado', 'Compatible con sistemas solares', 'Tecnología de litio y AGM'],
    popularModels: ['Andina Solar 100Ah', 'Andina Solar 200Ah', 'Andina Lithium 100Ah'],
  },
  {
    id: 'industrial',
    name: 'Baterías Industriales',
    description:
      'Para maquinaria pesada, montacargas, UPS industriales y sistemas de respaldo de gran escala.',
    icon: Zap,
    image:
      'https://images.pexels.com/photos/3817825/pexels-photo-3817825.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Alta capacidad de respaldo', 'Resistencia industrial', 'Soporte técnico 24/7'],
    popularModels: ['Andina UPS 12-100', 'Andina Forklift 48V', 'Andina Backup 2V'],
  },
  {
    id: 'recycle',
    name: 'Reciclaje de Baterías',
    description:
      'Recibimos tu batería usada y la reciclamos de forma responsable. Cuidamos el medio ambiente del Ecuador.',
    icon: Recycle,
    image:
      'https://images.pexels.com/photos/35520664/pexels-photo-35520664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Reciclaje certificado', 'Puntos de entrega en todo el país', 'Incentivos por batería usada'],
    popularModels: ['Programa Verde Andino'],
  },
];
