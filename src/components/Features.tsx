/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — Features.tsx
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/components/Features.tsx
 * 🏷️ Type: Server Component
 * 📦 Module: Public Site
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L020-L020  → Imports & dependencies (Lucide icons)
 *   L022-L059  → Constants / static data (features list)
 *   L061-L093  → Component declaration & render (Features)
 *   L065-L074  → Section header (Badge, title, subtitle)
 *   L076-L089  → Features grid cards mapping (6 core benefits)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import { ShieldCheck, Clock, Headphones, BadgeCheck, Wrench, Truck } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Garantía Real',
    description:
      'Hasta 24 meses de garantía en todas nuestras baterías. Si falla, la reemplazamos sin preguntas.',
  },
  {
    icon: Clock,
    title: 'Entrega 24 Horas',
    description:
      'Despacho express a cualquier provincia del Ecuador. En Quito y Guayaquil, entrega el mismo día.',
  },
  {
    icon: Headphones,
    title: 'Soporte Técnico',
    description:
      'Asesoría especializada por teléfono, WhatsApp y en cada punto de venta. Sabemos de baterías.',
  },
  {
    icon: BadgeCheck,
    title: 'Calidad Certificada',
    description:
      'Baterías con certificación ISO 9001 y normas internacionales. Confianza respaldada por laboratorios.',
  },
  {
    icon: Wrench,
    title: 'Instalación Gratis',
    description:
      'Instalamos tu batería sin costo adicional en cualquiera de nuestros distribuidores autorizados.',
  },
  {
    icon: Truck,
    title: 'Red de Distribución',
    description:
      'Más de 150 distribuidores en todo el país. Siempre hay un punto Baterías Andinas cerca de ti.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary-100 text-secondary-700 text-sm font-semibold mb-3">
            ¿Por qué elegirnos?
          </span>
          <h2 className="section-title">Confianza que arranca en cada encendido</h2>
          <p className="section-subtitle mx-auto text-center">
            No solo vendemos baterías: somos tu socio de energía en cada viaje, ruta y
            aventura a lo largo del Ecuador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
