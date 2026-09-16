/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 ARCHITECTURE MAP — layout.tsx (Root)
 * ═══════════════════════════════════════════════════════════════
 * 📁 Path: src/app/layout.tsx
 * 🏷️ Type: Root Layout (Server Component)
 * 📦 Module: Shared (all routes)
 * ─────────────────────────────────────────────────────────────
 * 🔍 STRUCTURE:
 *   L015-L019  → Imports (fonts, CSS, Providers)
 *   L021-L034  → Google Fonts (Plus Jakarta Sans + Sora)
 *   L036-L092  → Metadata export (title, description, OG, Twitter, robots)
 *   L094-L218  → JSON-LD Schema.org (Organization, WebSite, HowTo, FAQ)
 *   L220-L240  → RootLayout component (html, body, providers)
 * ─────────────────────────────────────────────────────────────
 * 📝 LAST UPDATED: 2026-09-16
 * ═══════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Baterías Maresa | Corporación Maresa Ecuador',
    template: '%s | Baterías Maresa Ecuador',
  },
  description:
    'Baterías Maresa oficiales en Ecuador. Garantía nacional hasta 36 meses, catálogo vehicular, agencias en 24 provincias y escuela técnica automotriz.',
  keywords: [
    'baterías maresa',
    'corporación maresa',
    'baterías ecuador',
    'batería auto quito',
    'batería guayaquil',
    'buscador de batería',
    'cambiar bateria auto',
    'escuela de baterias',
    'agencias maresa',
    'agm start stop',
    'reciclaje baterias',
  ],
  authors: [{ name: 'Corporación Maresa - Baterías Maresa' }],
  applicationName: 'Baterías Maresa',
  metadataBase: new URL('https://bateriasmaresa.ec'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://bateriasmaresa.ec/',
    siteName: 'Baterías Maresa - Corporación Maresa',
    title: 'Baterías Maresa | Corporación Maresa Ecuador',
    description:
      'Baterías Maresa oficiales en Ecuador. Garantía nacional hasta 36 meses, catálogo vehicular, agencias en 24 provincias y escuela técnica automotriz.',
    locale: 'es_EC',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Baterías Maresa Ecuador',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baterías Maresa | Corporación Maresa Ecuador',
    description:
      'Baterías Maresa oficiales en Ecuador. Garantía nacional hasta 36 meses, catálogo vehicular, agencias en 24 provincias y escuela técnica automotriz.',
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200&auto=format&fit=crop',
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['AutoPartsStore', 'AutomotiveBusiness'],
      '@id': 'https://bateriasmaresa.ec/#organization',
      name: 'Baterías Maresa - Corporación Maresa',
      alternateName: 'Corporación Maresa Baterías Ecuador',
      url: 'https://bateriasmaresa.ec',
      logo: 'https://bateriasmaresa.ec/assets/logo.png',
      description:
        'Distribuidor oficial de baterías automotrices, pesadas, marinas e industriales con respaldo de Corporación Maresa en las 24 provincias de Ecuador.',
      telephone: '+593-1800-228374',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Amazonas N34-451 y Atahualpa',
        addressLocality: 'Quito',
        addressRegion: 'Pichincha',
        postalCode: '170505',
        addressCountry: 'EC',
      },
      geo: { '@type': 'GeoCoordinates', latitude: -0.180653, longitude: -78.467834 },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Pichincha' },
        { '@type': 'AdministrativeArea', name: 'Guayas' },
        { '@type': 'AdministrativeArea', name: 'Azuay' },
        { '@type': 'AdministrativeArea', name: 'Manabí' },
        { '@type': 'AdministrativeArea', name: 'Tungurahua' },
        { '@type': 'AdministrativeArea', name: 'El Oro' },
        { '@type': 'AdministrativeArea', name: 'Loja' },
        { '@type': 'AdministrativeArea', name: 'Imbabura' },
        { '@type': 'AdministrativeArea', name: 'Chimborazo' },
        { '@type': 'AdministrativeArea', name: 'Santo Domingo de los Tsáchilas' },
        { '@type': 'Country', name: 'Ecuador' },
      ],
      sameAs: [
        'https://www.facebook.com/corporacionmaresa',
        'https://www.instagram.com/corporacionmaresa',
        'https://www.linkedin.com/company/corporacion-maresa',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://bateriasmaresa.ec/#website',
      url: 'https://bateriasmaresa.ec',
      name: 'Baterías Maresa Ecuador',
      publisher: { '@id': 'https://bateriasmaresa.ec/#organization' },
    },
    {
      '@type': 'HowTo',
      '@id': 'https://bateriasmaresa.ec/#howto-cambiar-bateria',
      name: 'Cómo cambiar la batería de tu auto paso a paso sin desconfigurar la computadora',
      description:
        'Guía práctica de la Escuela Técnica Baterías Maresa para reemplazar la batería de tu vehículo de forma segura y profesional.',
      totalTime: 'PT20M',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
      tool: [
        { '@type': 'HowToTool', name: 'Llave fija o de copa de 10mm' },
        { '@type': 'HowToTool', name: 'Guantes de nitrilo y gafas protectoras' },
        { '@type': 'HowToTool', name: 'Cepillo de bornes o lija fina' },
        { '@type': 'HowToTool', name: 'Grasa dieléctrica o vaselina neutra' },
        { '@type': 'HowToTool', name: 'Salvamemorias OBD-II (opcional)' },
      ],
      step: [
        { '@type': 'HowToStep', name: 'Paso 1: Seguridad y motor apagado', text: 'Apaga el motor, retira la llave del switch y espera 5 minutos a que los módulos electrónicos entren en reposo.' },
        { '@type': 'HowToStep', name: 'Paso 2: Desconectar primero el polo negativo (-)', text: 'Afloja y retira siempre el cable negativo (negro con signo -). Esto evita cortocircuitos accidentales con el chasis.' },
        { '@type': 'HowToStep', name: 'Paso 3: Desconectar el polo positivo (+)', text: 'Afloja y retira el cable positivo (rojo con signo +). Aísla el borne para que no haga contacto con ninguna pieza metálica.' },
        { '@type': 'HowToStep', name: 'Paso 4: Retirar la sujeción mecánica y la batería vieja', text: 'Desatornilla el soporte o platina que fija la batería a la bandeja. Retira la batería usada manteniéndola vertical.' },
        { '@type': 'HowToStep', name: 'Paso 5: Limpiar bandeja y colocar la nueva batería Maresa', text: 'Limpia los terminales con bicarbonato y agua si hay sulfato. Coloca la nueva batería verificando la polaridad correcta.' },
        { '@type': 'HowToStep', name: 'Paso 6: Conectar primero el positivo (+) y luego el negativo (-)', text: 'Para instalar, el orden se invierte: conecta primero el borne positivo (+), apriétalo firmemente, y por último conecta el polo negativo (-).' },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://bateriasmaresa.ec/#faq',
      mainEntity: [
        { '@type': 'Question', name: '¿Por qué elegir Baterías Maresa en Ecuador?', acceptedAnswer: { '@type': 'Answer', text: 'Baterías Maresa cuenta con el respaldo corporativo de más de 45 años en la industria automotriz del Ecuador, garantía nacional de hasta 36 meses, cobertura en las 24 provincias y chequeo eléctrico preventivo gratuito.' } },
        { '@type': 'Question', name: '¿Cómo saber qué batería necesita mi auto en la altitud de la Sierra o el calor de la Costa?', acceptedAnswer: { '@type': 'Answer', text: 'En la Sierra (Quito, Cuenca, Ambato) se requiere un CCA (arranque en frío) superior a 600A por el frío matutino y la densidad del aire. En la Costa (Guayaquil, Manta, Machala) se requiere aleación Calcio-Plata de alta resistencia a la corrosión por temperatura y salitre.' } },
        { '@type': 'Question', name: '¿Qué es la Escuela de Baterías Maresa?', acceptedAnswer: { '@type': 'Answer', text: 'Es nuestro portal educativo gratuito con guías paso a paso para cambiar la batería, cómo pasar corriente sin dañar la computadora del auto, trucos para alargar la vida útil y diccionario automotriz para conductores.' } },
        { '@type': 'Question', name: '¿En qué consiste el bono de reciclaje ecológico de -$10?', acceptedAnswer: { '@type': 'Answer', text: 'Al entregar tu batería vieja en cualquiera de nuestras agencias autorizadas Maresa en Ecuador, recibes un bono de descuento inmediato de -$10 en tu nueva batería, asegurando su reciclaje ambiental bajo certificación.' } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="AI / LLMs Documentation" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${sora.variable} bg-white text-slate-800 antialiased selection:bg-blue-600 selection:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
