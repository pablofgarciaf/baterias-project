# 🏗️ ARCHITECTURE MAP — Baterías Maresa (Next.js)
> **LÉEME PRIMERO.** Este archivo es el mapa maestro del proyecto.
> Antes de modificar cualquier archivo, lee sus comentarios Architecture Map (líneas 1-20 aprox).

## 📊 Stack Tecnológico
- **Framework:** Next.js 15 (App Router + Turbopack)
- **UI:** React 19 + Tailwind CSS v4 (PostCSS)
- **Base de Datos:** Firebase Firestore (contenido, leads B2B, distribuidores)
- **Auth:** Firebase Auth (panel admin)
- **Animaciones:** motion (Framer Motion)
- **Iconos:** lucide-react
- **Exportación:** xlsx (Excel export en admin)
- **IA:** @google/genai (Gemini API)

## 🌐 Dominio (provisional)
`bateriasmaresa.ec` — Se actualizará cuando el dominio definitivo esté listo.
Cambiar en: `layout.tsx` (metadata + JSON-LD), `robots.txt`, `sitemap.xml`, `llms.txt`

---

## 📁 Estructura de Archivos

### App Router (`src/app/`)
| Archivo | Tipo | Módulo | Propósito |
|---------|------|--------|-----------|
| `layout.tsx` | Server Component | Shared | Root layout: fonts, metadata global, JSON-LD Schema, Providers wrapper |
| `globals.css` | Stylesheet | Shared | Tailwind v4 @theme tokens, colores, animaciones, utilidades CSS |
| `providers.tsx` | Client Component | Shared | ThemeProvider + SiteContentProvider wrappers |
| `(site)/layout.tsx` | Client Component | Public Site | Header + Footer + WhatsApp FAB compartidos en todas las rutas públicas |
| `(site)/page.tsx` | Client Component | Public Site | Home: Hero + GeoQuickAnswer + About + Features + Dealers |
| `(site)/productos/page.tsx` | Server Component | Public Site | Metadata SEO → ProductsClient |
| `(site)/buscador/page.tsx` | Server Component | Public Site | Metadata SEO → BuscadorClient (VehicleFinder) |
| `(site)/agencias/page.tsx` | Server Component | Public Site | Metadata SEO → AgenciasClient (StoreLocator + Provinces) |
| `(site)/blog/page.tsx` | Server Component | Public Site | Metadata SEO → BlogClient |
| `(site)/reciclaje/page.tsx` | Server Component | Public Site | Metadata SEO → ReciclajeClient |
| `(site)/contacto-b2b/page.tsx` | Server Component | Public Site | Metadata SEO → ContactoB2BClient (B2BLeadCapture) |
| `(site)/nosotros/page.tsx` | Server Component | Public Site | Metadata SEO → NosotrosClient (About + Features) |
| `admin/page.tsx` | Client Component | Admin | Panel CMS/CRM completo (sin Header/Footer del sitio público) |

### Componentes (`src/components/`)
| Archivo | Tipo | Líneas Clave | Propósito |
|---------|------|-------------|-----------|
| `Header.tsx` | Client | L024-L207 | Nav sticky, mobile drawer, dark mode toggle, logo |
| `Hero.tsx` | Client | L027-L216 | Hero animado, trust badges, CTA buttons, stats |
| `GeoQuickAnswer.tsx` | Server | L020-L059 | Cápsula GEO para IA (aside semántico) |
| `About.tsx` | Client | L025-L167 | Historia corporativa, 4 pilares, imagen |
| `Features.tsx` | Server | L020-L093 | Grid 6 diferenciales de servicio |
| `Dealers.tsx` | Server | L021-L095 | CTA distribuidores, stats, beneficios |
| `Products.tsx` | Client | L026-L646 | Catálogo baterías, carrusel, filtros, modal specs, WhatsApp |
| `VehicleFinder.tsx` | Client | L025-L419 | Buscador 3 pasos (año→marca→modelo), resultado batería |
| `Blog.tsx` | Client | L026-L577 | Blog técnico, carrusel, modal lectura, categorías |
| `B2BLeadCapture.tsx` | Client | L024-L437 | Formulario B2B, propuesta comercial, Firebase submit |
| `StoreLocator.tsx` | Client | L026-L401 | Mapa agencias, búsqueda, filtro provincia, OpenStreetMap |
| `Provinces.tsx` | Client | L026-L166 | 24 provincias Ecuador, filtro región, búsqueda |
| `Recycling.tsx` | Client | L023-L160 | Programa reciclaje, métricas impacto, CTA |
| `Footer.tsx` | Client | L023-L232 | Footer corporativo, contacto obfuscado, redes, provincias |
| `WhatsAppFloatingButton.tsx` | Client | L023-L212 | FAB flotante WhatsApp/llamada, expandible |
| `AdminPage.tsx` | Client | L025-L1233 | Dashboard admin: CMS, CRM B2B, distribuidores, catálogo |

### Contextos (`src/context/`)
| Archivo | Propósito |
|---------|-----------|
| `SiteContentContext.tsx` | CMS context: contenido editable de 7 secciones, localStorage + Firebase, updateSection/resetDefaults |
| `ThemeContext.tsx` | Tema light/dark, localStorage persistence, toggleTheme/setTheme |

### Lib (`src/lib/`)
| Archivo | Propósito |
|---------|-----------|
| `firebase.ts` | Init Firebase App, Auth, Firestore, Analytics. Usa `process.env.NEXT_PUBLIC_FIREBASE_*` |
| `firebaseStore.ts` | CRUD Firestore: leads B2B (submit/get/update), distribuidores (get/save/remove). Fallback localStorage |

### Data (`src/data/`)
| Archivo | Propósito |
|---------|-----------|
| `products.ts` | 8 categorías de productos (Auto, Camión, Moto, Marina, Golf, Solar, Industrial, Reciclaje) |
| `provinces.ts` | 24 provincias Ecuador con capital, región, población, superficie, colores |
| `sinergiaData.ts` | Catálogo vehicular (Chevrolet, Toyota, Kia, Hyundai, Mazda, etc.), distribuidores default, leads semilla |

### Types (`src/types/`)
| Archivo | Propósito |
|---------|-----------|
| `maresa.ts` | Interfaces Supabase/PostgreSQL: SiteSection, Brand, Vehicle, Part, ServiceCenter, InventoryRow |
| `sinergia.ts` | Interfaces activas: VehicleBatteryMatch, DistributorLocation, B2BLead, BatteryProduct |

### Public (`public/`)
| Archivo | Propósito |
|---------|-----------|
| `robots.txt` | Abierto a Google, Bing, GPTBot, Claude, Perplexity. Bloquea scrapers. |
| `llms.txt` | Documentación para IAs: resumen empresa, catálogo, servicios, FAQ |
| `llms-full.txt` | Versión extendida de llms.txt |
| `sitemap.xml` | Mapa del sitio para crawlers |

---

## 🔄 Protocolo de Cambios

1. **SIEMPRE** lee este archivo primero (`.architecture.md`)
2. Identifica el archivo a modificar en las tablas de arriba
3. Lee las **primeras 20 líneas** del archivo (Architecture Map) para entender la estructura
4. Modifica SOLO las líneas que necesitas cambiar
5. **Actualiza los números de línea** en el Architecture Map del archivo modificado
6. Si se agrega un archivo nuevo, agrégalo a las tablas de este documento
