# 🗺️ ARCHITECTURE MAP — Baterías Maresa

> ⚠️ Este archivo se actualiza en el MISMO turno en que se crea, elimina o reestructura un archivo.
> Ningún cambio estructural se considera terminado si este mapa quedó desincronizado.

**Última actualización:** 2026-09-23 (Header transparente + Hero full-screen)
**Stack:** Next.js 15 (App Router + Turbopack) · React 19 · Tailwind CSS v4 (PostCSS) · Firebase Firestore/Auth · motion (Framer Motion) · lucide-react · xlsx · @google/genai (Gemini API)

---

## 📁 Zonas de Aislamiento

| Zona | Ruta raíz | Descripción | ¿Puede tocarse desde otra zona? |
|---|---|---|---|
| Sitio Público | `src/app/(site)/`, `src/components/[público].tsx` | SEO, conversión, diseño premium | No |
| Panel Admin | `src/app/admin/`, `src/components/AdminPage.tsx` | Gestión CMS/CRM interna | No |
| Compartido | `src/lib/`, `src/types/`, `src/data/`, `src/context/` | Datos, tipos, Firebase, contextos — usado por ambas zonas | Sí, es el único cruce permitido |

---

## 📦 Módulo: App Shell & Root

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/layout.tsx` | Server Component | Compartido | Root layout: fonts (Playfair Display + Inter), metadata global, JSON-LD Schema, Providers wrapper |
| `src/app/globals.css` | Stylesheet | Compartido | Tailwind v4 @theme tokens, colores, animaciones, utilidades CSS |
| `src/app/providers.tsx` | Client Component | Compartido | ThemeProvider + SiteContentProvider wrappers |

---

## 📦 Módulo: Sitio Público — Layout & Navegación

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/layout.tsx` | Client Component | Sitio Público | Header + Footer + WhatsApp FAB compartidos en todas las rutas públicas |
| `src/components/Header.tsx` | Client Component | Sitio Público | Nav fixed: transparente en Home (scroll→sólido), sólido en internas. Dropdown "Servicios" agrupa 6 secciones. Mobile accordion |
| `src/components/Footer.tsx` | Client Component | Sitio Público | Footer corporativo, contacto ofuscado, redes sociales, provincias |
| `src/components/WhatsAppFloatingButton.tsx` | Client Component | Sitio Público | FAB flotante WhatsApp/llamada, expandible |

---

## 📦 Módulo: Home Page

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/page.tsx` | Client Component | Sitio Público | Home: Hero + GeoQuickAnswer + About + Features + Dealers |
| `src/components/Hero.tsx` | Client Component | Sitio Público | Hero full-screen con imagen de fondo (desktop/mobile webp), overlay gradient, stats. Imágenes: `/hero-desktop.webp` y `/hero-mobile.webp` |
| `src/components/GeoQuickAnswer.tsx` | Server Component | Sitio Público | Cápsula GEO para IA (aside semántico, byte 0) |
| `src/components/About.tsx` | Client Component | Sitio Público | Historia corporativa, 4 pilares, imagen |
| `src/components/Features.tsx` | Server Component | Sitio Público | Grid 6 diferenciales de servicio |
| `src/components/Dealers.tsx` | Server Component | Sitio Público | CTA distribuidores, stats, beneficios |

---

## 📦 Módulo: Catálogo de Productos

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/productos/page.tsx` | Server Component | Sitio Público | Metadata SEO → ProductsClient |
| `src/app/(site)/productos/ProductsClient.tsx` | Client Component | Sitio Público | Shell cliente del catálogo |
| `src/components/Products.tsx` | Client Component | Sitio Público | Catálogo baterías, carrusel, filtros, modal specs, WhatsApp |

---

## 📦 Módulo: Buscador Vehicular

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/buscador/page.tsx` | Server Component | Sitio Público | Metadata SEO → BuscadorClient |
| `src/app/(site)/buscador/BuscadorClient.tsx` | Client Component | Sitio Público | Shell cliente del buscador |
| `src/components/VehicleFinder.tsx` | Client Component | Sitio Público | Buscador 3 pasos (año→marca→modelo), resultado batería |

---

## 📦 Módulo: Red de Agencias

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/agencias/page.tsx` | Server Component | Sitio Público | Metadata SEO → AgenciasClient |
| `src/app/(site)/agencias/AgenciasClient.tsx` | Client Component | Sitio Público | Shell cliente agencias |
| `src/components/StoreLocator.tsx` | Client Component | Sitio Público | Mapa agencias, búsqueda, filtro provincia, OpenStreetMap |
| `src/components/Provinces.tsx` | Client Component | Sitio Público | 24 provincias Ecuador, filtro región, búsqueda |

---

## 📦 Módulo: Blog Técnico

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/blog/page.tsx` | Server Component | Sitio Público | Metadata SEO → BlogClient |
| `src/app/(site)/blog/BlogClient.tsx` | Client Component | Sitio Público | Shell cliente blog |
| `src/components/Blog.tsx` | Client Component | Sitio Público | Blog técnico, carrusel, modal lectura, categorías |

---

## 📦 Módulo: Reciclaje

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/reciclaje/page.tsx` | Server Component | Sitio Público | Metadata SEO → ReciclajeClient |
| `src/app/(site)/reciclaje/ReciclajeClient.tsx` | Client Component | Sitio Público | Shell cliente reciclaje |
| `src/components/Recycling.tsx` | Client Component | Sitio Público | Programa reciclaje, métricas impacto, CTA |

---

## 📦 Módulo: Contacto B2B

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/contacto-b2b/page.tsx` | Server Component | Sitio Público | Metadata SEO → ContactoB2BClient |
| `src/app/(site)/contacto-b2b/ContactoB2BClient.tsx` | Client Component | Sitio Público | Shell cliente B2B |
| `src/components/B2BLeadCapture.tsx` | Client Component | Sitio Público | Formulario B2B, propuesta comercial, Firebase submit |

---

## 📦 Módulo: Nosotros

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/(site)/nosotros/page.tsx` | Server Component | Sitio Público | Metadata SEO → NosotrosClient |
| `src/app/(site)/nosotros/NosotrosClient.tsx` | Client Component | Sitio Público | Shell cliente nosotros |

---

## 📦 Módulo: Panel Admin

| Archivo | Tipo | Zona | Descripción |
|---|---|---|---|
| `src/app/admin/page.tsx` | Client Component | Panel Admin | Dashboard admin: CMS, CRM B2B, distribuidores, catálogo |

> **Nota:** `src/components/AdminPage.tsx` fue eliminado (ver git status). La lógica del admin vive ahora en `src/app/admin/page.tsx`.

---

## 🔧 Contextos (Estado Global)

| Archivo | Zona | Descripción |
|---|---|---|
| `src/context/SiteContentContext.tsx` | Compartido | CMS context: contenido editable de 7 secciones, localStorage + Firebase, updateSection/resetDefaults |
| `src/context/ThemeContext.tsx` | Compartido | Tema light/dark, localStorage persistence, toggleTheme/setTheme |

---

## 🔧 Lib (Firebase & Servicios)

| Archivo | Zona | Descripción |
|---|---|---|
| `src/lib/firebase.ts` | Compartido | Init Firebase App, Auth, Firestore, Analytics. Usa `process.env.NEXT_PUBLIC_FIREBASE_*` |
| `src/lib/firebaseStore.ts` | Compartido | CRUD Firestore: leads B2B (submit/get/update), distribuidores (get/save/remove). Fallback localStorage |

---

## 🔧 Data (Datos Estáticos)

| Archivo | Zona | Descripción |
|---|---|---|
| `src/data/products.ts` | Compartido | 8 categorías de productos (Auto, Camión, Moto, Marina, Golf, Solar, Industrial, Reciclaje) |
| `src/data/provinces.ts` | Compartido | 24 provincias Ecuador con capital, región, población, superficie, colores |
| `src/data/sinergiaData.ts` | Compartido | Catálogo vehicular (Chevrolet, Toyota, Kia, etc.), distribuidores default, leads semilla |

---

## 🔧 Types (Interfaces TypeScript)

| Archivo | Zona | Descripción |
|---|---|---|
| `src/types/maresa.ts` | Compartido | Interfaces legacy Supabase/PostgreSQL: SiteSection, Brand, Vehicle, Part, ServiceCenter, InventoryRow |
| `src/types/sinergia.ts` | Compartido | Interfaces activas: VehicleBatteryMatch, DistributorLocation, B2BLead, BatteryProduct |

---

## 📄 Archivos Públicos (SEO/GEO)

| Archivo | Propósito |
|---|---|
| `public/robots.txt` | Abierto a Google, Bing, GPTBot, Claude, Perplexity. Bloquea scrapers maliciosos |
| `public/sitemap.xml` | Mapa del sitio para crawlers |
| `public/llms.txt` | Documentación para IAs: resumen empresa, catálogo, servicios, FAQ |
| `public/llms-full.txt` | Versión extendida de llms.txt |

---

## 🌐 Dominio (provisional)

`bateriasmaresa.ec` — Cuando cambie, actualizar en:
- `src/app/layout.tsx` → metadataBase + JSON-LD URLs
- `public/robots.txt` → Sitemap URL
- `public/sitemap.xml` → Todas las `<loc>` URLs
- `public/llms.txt` → URLs de referencia

---

## 🔄 Protocolo de Cambios

1. **SIEMPRE** lee este archivo primero.
2. Identifica el archivo a modificar en las tablas.
3. Lee las **primeras 20 líneas** del archivo (Architecture Map Header) para la estructura.
4. Modifica SOLO las líneas necesarias.
5. **Actualiza este mapa** si se crean, eliminan o reestructuran archivos.
